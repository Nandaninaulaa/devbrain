"""
FastAPI app — Phase 2/4 API layer.

Run with:
    uvicorn app.main:app --reload --port 8000

Endpoints:
    POST /ingest        {"folder": "/path/to/folder"}
    POST /ask           {"question": "...", "top_k": 5}
    GET  /flashcards     ?n=5
    GET  /stats
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import flashcards as flashcards_module
from . import graph as graph_module
from . import qa as qa_module
from .ingest import ingest_folder
from .vectorstore import collection_stats

app = FastAPI(title="Developer Brain API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten before deploying publicly
    allow_methods=["*"],
    allow_headers=["*"],
)


class IngestRequest(BaseModel):
    folder: str


class AskRequest(BaseModel):
    question: str
    top_k: int | None = None


@app.get("/")
def root():
    return {"status": "ok", "service": "developer-brain-api"}


@app.get("/stats")
def stats():
    return collection_stats()


@app.post("/ingest")
def ingest(req: IngestRequest):
    try:
        return ingest_folder(req.folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/ask")
def ask(req: AskRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="question must not be empty")
    return qa_module.qa(req.question, top_k=req.top_k)


@app.get("/flashcards")
def flashcards(n: int = 5):
    return {"flashcards": flashcards_module.generate_flashcards(n)}


class BuildGraphRequest(BaseModel):
    limit: int = 200


@app.post("/graph/build")
def build_graph(req: BuildGraphRequest):
    try:
        return graph_module.build_graph(limit=req.limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph build failed: {e}")


@app.get("/graph")
def get_graph(limit: int = 300):
    try:
        return graph_module.get_graph_data(limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read graph: {e}")


@app.delete("/graph")
def clear_graph():
    try:
        graph_module.clear_graph()
        return {"status": "cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not clear graph: {e}")
