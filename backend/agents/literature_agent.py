import ollama
import os
from backend.agents.state import MediAgentState
from backend.rag.vector_store import search_documents
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


def literature_agent(state: MediAgentState) -> MediAgentState:
    print("Literature Agent activated...")

    question = state["question"]
    record_summary = state.get("record_summary", "")

    search_query = f"{question} {record_summary[:200]}"
    docs = search_documents(search_query, k=3)

    retrieved_texts = [doc.page_content for doc in docs]
    sources = [doc.metadata.get("source", "Unknown") for doc in docs]
    context = "\n\n".join(retrieved_texts)

    prompt = f"""You are the Literature Agent in a medical AI system.
Your job is to analyze retrieved medical literature and extract relevant insights.

RETRIEVED MEDICAL LITERATURE:
{context}

DOCTOR'S QUESTION:
{question}

PATIENT SUMMARY:
{record_summary}

Summarize the most relevant findings from the medical literature.
Focus on evidence-based recommendations directly relevant to this case."""

    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )

    summary = response["message"]["content"]

    print("Literature Agent completed.")

    return {
        **state,
        "retrieved_documents": retrieved_texts,
        "literature_summary": summary,
        "sources": list(set(sources)),
        "current_agent": "literature_agent"
    }