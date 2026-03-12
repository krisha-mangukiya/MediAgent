import ollama
import os
from backend.agents.state import MediAgentState
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


def supervisor_agent(state: MediAgentState) -> MediAgentState:
    print("Supervisor Agent activated...")

    question = state["question"]
    record_summary = state.get("record_summary", "")
    literature_summary = state.get("literature_summary", "")
    risk_alerts = state.get("risk_alerts", [])
    sources = state.get("sources", [])

    risk_text = "\n".join(risk_alerts) if risk_alerts else "No risks identified."

    prompt = f"""You are the Supervisor Agent and Chief Medical AI of MediAgent.
You have received reports from three specialized agents.
Your job is to synthesize all findings into a comprehensive, professional medical summary.

DOCTOR'S QUESTION:
{question}

PATIENT RECORD SUMMARY (from Record Agent):
{record_summary}

MEDICAL LITERATURE FINDINGS (from Literature Agent):
{literature_summary}

RISK ASSESSMENT (from Risk Agent):
{risk_text}

CITED SOURCES:
{", ".join(sources) if sources else "Internal knowledge base"}

Please provide a comprehensive diagnosis summary that includes:

1. CLINICAL ASSESSMENT
   - Key findings from patient records
   - Relevant medical history

2. EVIDENCE-BASED RECOMMENDATIONS
   - Treatment options supported by literature
   - Dosage and monitoring guidelines

3. RISK ALERTS
   - Drug interactions or contraindications
   - Red flags to watch for

4. FOLLOW-UP PLAN
   - Recommended tests or referrals
   - Monitoring schedule

5. SOURCES CITED
   - List all sources used

Be professional, precise, and always recommend consulting a specialist for final decisions."""

    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )

    final_answer = response["message"]["content"]

    print("Supervisor Agent completed. Final answer ready.")

    return {
        **state,
        "final_answer": final_answer,
        "current_agent": "supervisor_agent"
    }