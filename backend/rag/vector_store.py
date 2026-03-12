import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./data/chroma_db")


def get_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cuda"},
        encode_kwargs={"normalize_embeddings": True}
    )
    return embeddings


def create_vector_store(chunks):
    embeddings = get_embeddings()
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )
    print(f"Stored {len(chunks)} chunks in ChromaDB")
    return vector_store


def load_vector_store():
    embeddings = get_embeddings()
    vector_store = Chroma(
        persist_directory=CHROMA_PERSIST_DIR,
        embedding_function=embeddings
    )
    return vector_store


def search_documents(query: str, k: int = 3):
    vector_store = load_vector_store()
    results = vector_store.similarity_search(query, k=k)
    return results