from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "MediAgent"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="AI-Powered Medical Intelligence Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MedicalQuery(BaseModel):
    question: str


@app.get("/")
async def root():
    return {
        "app": os.getenv("APP_NAME"),
        "version": os.getenv("APP_VERSION"),
        "status": "running",
        "message": "MediAgent API is live!"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ollama_model": os.getenv("OLLAMA_MODEL"),
        "debug": os.getenv("DEBUG")
    }


@app.post("/ask")
async def ask_medical_question(query: MedicalQuery):
    from backend.utils.ollama_client import get_ollama_response
    prompt = f"""You are MediAgent, an expert medical AI assistant.
Answer the following medical question clearly and professionally.
Always mention when a doctor should be consulted.

Question: {query.question}"""
    response = get_ollama_response(prompt)
    return {"question": query.question, "answer": response}


@app.post("/ask/stream")
async def ask_medical_question_stream(query: MedicalQuery):
    from backend.utils.ollama_client import stream_ollama_response
    prompt = f"""You are MediAgent, an expert medical AI assistant.
Answer the following medical question clearly and professionally.

Question: {query.question}"""
    return StreamingResponse(
        stream_ollama_response(prompt),
        media_type="text/plain"
    )


@app.post("/rag/ask")
async def ask_with_rag_endpoint(query: MedicalQuery):
    from backend.rag.rag_engine import ask_with_rag
    result = ask_with_rag(query.question)
    return result


@app.post("/rag/stream")
async def stream_with_rag_endpoint(query: MedicalQuery):
    from backend.rag.rag_engine import stream_with_rag
    return StreamingResponse(
        stream_with_rag(query.question),
        media_type="text/plain"
    )


@app.post("/rag/ingest")
async def ingest_document(file_path: str):
    from backend.rag.document_loader import load_and_split
    from backend.rag.vector_store import create_vector_store
    chunks = load_and_split(file_path)
    create_vector_store(chunks)
    return {
        "status": "success",
        "message": f"Ingested {len(chunks)} chunks from {file_path}"
    }

@app.post("/agents/diagnose")
async def run_agent_diagnosis(query: MedicalQuery, patient_context: str = ""):
    from backend.agents.graph import run_mediagent
    result = run_mediagent(query.question, patient_context)
    return result