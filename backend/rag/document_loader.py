import os
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()


def load_text_document(file_path: str):
    loader = TextLoader(file_path, encoding="utf-8")
    documents = loader.load()
    return documents


def load_pdf_document(file_path: str):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return documents


def split_documents(documents, chunk_size=500, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    return chunks


def load_and_split(file_path: str):
    if file_path.endswith(".pdf"):
        docs = load_pdf_document(file_path)
    else:
        docs = load_text_document(file_path)
    chunks = split_documents(docs)
    return chunks