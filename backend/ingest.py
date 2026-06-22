import os
import shutil
import tempfile
import uuid
from pathlib import Path
from typing import Generator

import git
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
qdrant = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))

COLLECTION_NAME = "repify"
EMBEDDING_MODEL = "text-embedding-3-small"
VECTOR_SIZE = 1536

SUPPORTED_EXTENSIONS = {
    ".js", ".ts", ".jsx", ".tsx", ".py", ".go", ".java",
    ".cs", ".cpp", ".c", ".rb", ".php", ".rs",
    ".md", ".txt", ".json", ".yaml", ".yml", ".sql", ".env.example"
}

SKIP_DIRS = {
    "node_modules", ".git", "build", "dist", "__pycache__",
    ".next", "venv", ".venv", "env", "coverage", ".cache"
}


def ensure_collection():
    existing = [c.name for c in qdrant.get_collections().collections]
    if COLLECTION_NAME not in existing:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )


def walk_files(repo_path: str) -> Generator[Path, None, None]:
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for file in files:
            path = Path(root) / file
            if path.suffix.lower() in SUPPORTED_EXTENSIONS:
                yield path


def chunk_file(path: Path, repo_root: str) -> list[dict]:
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return []

    if len(content.strip()) == 0:
        return []

    relative_path = str(path.relative_to(repo_root))

    # Split by functions/classes for code files, by paragraphs for docs
    chunks = []
    if path.suffix in {".md", ".txt"}:
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        for i, para in enumerate(paragraphs):
            if len(para) > 50:
                chunks.append({"content": para, "file_path": relative_path, "chunk_index": i, "type": "doc"})
    else:
        # Split by lines into chunks of ~60 lines with 10-line overlap
        lines = content.split("\n")
        chunk_size = 60
        overlap = 10
        for i in range(0, len(lines), chunk_size - overlap):
            chunk_lines = lines[i:i + chunk_size]
            chunk_content = "\n".join(chunk_lines).strip()
            if len(chunk_content) > 100:
                chunks.append({
                    "content": chunk_content,
                    "file_path": relative_path,
                    "chunk_index": i,
                    "type": "code",
                    "language": path.suffix.lstrip(".")
                })

    return chunks


def embed_texts(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    return [item.embedding for item in response.data]


def ingest_repo(repo_url: str) -> dict:
    ensure_collection()

    tmp_dir = tempfile.mkdtemp()
    try:
        print(f"Cloning {repo_url}...")
        git.Repo.clone_from(repo_url, tmp_dir, depth=1)

        all_chunks = []
        for file_path in walk_files(tmp_dir):
            chunks = chunk_file(file_path, tmp_dir)
            all_chunks.extend(chunks)

        if not all_chunks:
            return {"status": "error", "message": "No indexable files found"}

        print(f"Found {len(all_chunks)} chunks. Embedding...")

        # Batch embed (max 100 per request)
        batch_size = 100
        points = []
        for i in range(0, len(all_chunks), batch_size):
            batch = all_chunks[i:i + batch_size]
            texts = [c["content"] for c in batch]
            vectors = embed_texts(texts)
            for chunk, vector in zip(batch, vectors):
                points.append(PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload={**chunk, "repo_url": repo_url}
                ))

        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
        print(f"Indexed {len(points)} chunks into Qdrant.")

        return {"status": "success", "chunks_indexed": len(points), "repo_url": repo_url}

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
