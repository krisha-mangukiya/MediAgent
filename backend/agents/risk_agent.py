import ollama
import os
from backend.agents.state import MediAgentState
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


def risk_agent(state: MediAgentState) -> MediAgentState:
    print("Risk Agent activated...")
    question = state["question"]
    patient_context = state.get("patient_context", "No patient records provided.")
    record_summary = state.get("record_summary", "")
    literature_summary = state.get("literature_summary", "")
    prompt = f"""You are the Risk Agent. Identify risks, drug interactions, contraindications.\n\nPATIENT: {patient_context}\n\nSUMMARY: {record_summary}\n\nLITERATURE: {literature_summary}\n\nQUESTION: {question}\n\nList all risks and safety concerns."""
    response = ollama.chat(model=OLLAMA_MODEL, messages=[{"role": "user", "content": prompt}])
    risk_content = response["message"]["content"]
    print("Risk Agent completed.")
    return {**state, "risk_alerts": [risk_content], "current_agent": "risk_agent"}
