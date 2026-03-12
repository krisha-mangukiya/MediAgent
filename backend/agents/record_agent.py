import ollama
import os
from backend.agents.state import MediAgentState
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


def record_agent(state: MediAgentState) -> MediAgentState:
    print("Record Agent activated...")

    question = state["question"]
    patient_context = state.get("patient_context", "No patient records provided.")

    prompt = f"""You are the Record Agent in a medical AI system.
Your job is to analyze patient information and create a structured summary.

PATIENT INFORMATION:
{patient_context}

DOCTOR'S QUESTION:
{question}

Create a concise structured summary of the patient's relevant medical information.
Focus on details most relevant to the doctor's question.
Format your response as a clear medical summary."""

    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )

    summary = response["message"]["content"]

    print("Record Agent completed.")

    return {
        **state,
        "record_summary": summary,
        "current_agent": "record_agent"
    }