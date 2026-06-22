import os
import uuid
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest import ingest_repo
from search import search_codebase
from llm import answer_question, analyze_diagram

app = FastAPI(title="Repify API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IngestRequest(BaseModel):
    repo_url: str


class ChatRequest(BaseModel):
    question: str
    repo_url: str | None = None


@app.get("/")
def root():
    return {"status": "Repify backend is running"}


@app.post("/ingest")
async def ingest(request: IngestRequest):
    try:
        result = ingest_repo(request.repo_url)
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chunks = search_codebase(request.question, repo_url=request.repo_url)
        answer = answer_question(request.question, chunks)
        return {
            "answer": answer,
            "sources": [{"file_path": c["file_path"], "score": c["score"]} for c in chunks],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-diagram")
async def upload_diagram(file: UploadFile = File(...), repo_url: str = Form(None)):
    try:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/png"

        # Get text description from GPT-4o-mini vision
        description = analyze_diagram(image_bytes, mime_type)

        # Store description as a searchable chunk in Qdrant
        from ingest import ensure_collection, embed_texts
        from qdrant_client.models import PointStruct
        from qdrant_client import QdrantClient

        qdrant = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))
        ensure_collection()

        vectors = embed_texts([description])
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=vectors[0],
            payload={
                "content": description,
                "file_path": f"diagram/{file.filename}",
                "type": "diagram",
                "repo_url": repo_url or "uploaded",
            }
        )
        qdrant.upsert(collection_name="repify", points=[point])

        return {"status": "success", "description": description}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
