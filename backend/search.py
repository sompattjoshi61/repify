import os
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
qdrant = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))

COLLECTION_NAME = "repify"
EMBEDDING_MODEL = "text-embedding-3-small"


def search_codebase(question: str, repo_url: str | None = None, top_k: int = 6) -> list[dict]:
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=question)
    question_vector = response.data[0].embedding

    search_filter = None
    if repo_url:
        search_filter = Filter(
            must=[FieldCondition(key="repo_url", match=MatchValue(value=repo_url))]
        )

    results = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=question_vector,
        query_filter=search_filter,
        limit=top_k,
        with_payload=True,
    )

    return [
        {
            "content": r.payload.get("content", ""),
            "file_path": r.payload.get("file_path", ""),
            "score": r.score,
            "language": r.payload.get("language", ""),
            "type": r.payload.get("type", "code"),
        }
        for r in results
    ]
