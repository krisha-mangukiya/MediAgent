from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import os

load_dotenv()

from backend.database.database import create_tables, get_db

create_tables()

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


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    condition: str
    medications: str
    allergies: str
    blood_pressure: str
    notes: str = ""


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


@app.post("/agents/diagnose")
async def run_agent_diagnosis(
    query: MedicalQuery,
    patient_context: str = "",
    db: Session = Depends(get_db)
):
    from backend.agents.graph import run_mediagent
    from backend.database.crud import save_diagnosis
    result = run_mediagent(query.question, patient_context)
    save_diagnosis(
        db=db,
        question=result["question"],
        patient_context=patient_context,
        final_answer=result["final_answer"],
        record_summary=result.get("record_summary", ""),
        literature_summary=result.get("literature_summary", ""),
        risk_alerts=result.get("risk_alerts", []),
        sources=result.get("sources", [])
    )
    return result


@app.get("/patients")
async def get_patients(db: Session = Depends(get_db)):
    from backend.database.crud import get_all_patients
    patients = get_all_patients(db)
    return patients


@app.post("/patients")
async def create_patient_endpoint(patient: PatientCreate, db: Session = Depends(get_db)):
    from backend.database.crud import create_patient
    new_patient = create_patient(
        db=db,
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        condition=patient.condition,
        medications=patient.medications,
        allergies=patient.allergies,
        blood_pressure=patient.blood_pressure,
        notes=patient.notes
    )
    return new_patient


@app.get("/history")
async def get_history(db: Session = Depends(get_db)):
    from backend.database.crud import get_diagnosis_history
    history = get_diagnosis_history(db)
    return history


@app.get("/documents")
async def get_documents(db: Session = Depends(get_db)):
    from backend.database.crud import get_all_documents
    documents = get_all_documents(db)
    return documents