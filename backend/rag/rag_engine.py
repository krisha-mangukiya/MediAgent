import os
import ollama
from backend.rag.vector_store import search_documents
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


def ask_with_rag(question: str, k: int = 3) -> dict:
    relevant_chunks = search_documents(question, k=k)

    context = "\n\n".join([doc.page_content for doc in relevant_chunks])

    sources = []
    for doc in relevant_chunks:
        source = doc.metadata.get("source", "Unknown")
        sources.append(source)

    prompt = f"""You are MediAgent, an expert medical AI assistant.
Use the following medical documents as context to answer the question.
Always base your answer on the provided context.
If the context does not contain enough information, say so clearly.

MEDICAL CONTEXT:
{context}

QUESTION:
{question}

Provide a clear, professional medical answer based strictly on the context above.
At the end, mention which sources you used."""

    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )

    answer = response["message"]["content"]

    return {
        "question": question,
        "answer": answer,
        "sources": list(set(sources)),
        "chunks_used": len(relevant_chunks),
        "context_preview": context[:300] + "..."
    }


def stream_with_rag(question: str, k: int = 3):
    relevant_chunks = search_documents(question, k=k)

    context = "\n\n".join([doc.page_content for doc in relevant_chunks])

    prompt = f"""You are MediAgent, an expert medical AI assistant.
Use the following medical documents as context to answer the question.
Always base your answer on the provided context.

MEDICAL CONTEXT:
{context}

QUESTION:
{question}

Provide a clear, professional medical answer based strictly on the context above."""

    stream = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    for chunk in stream:
        yield chunk["message"]["content"]