import ollama
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")

def get_ollama_response(prompt: str) -> str:
    """Send a prompt to Llama 3.1 and get a response."""
    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response['message']['content']

def stream_ollama_response(prompt: str):
    """Stream response token by token from Llama 3.1."""
    stream = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ],
        stream=True
    )
    for chunk in stream:
        yield chunk['message']['content']