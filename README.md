# 🏥 MediAgent — AI-Powered Medical Intelligence Platform

> A production-grade, real-time clinical decision support system built with RAG, LangGraph multi-agent orchestration, and local LLM inference — running 100% free on a local GPU.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-1.2-orange?style=flat-square)
![LangGraph](https://img.shields.io/badge/LangGraph-1.1-purple?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![CUDA](https://img.shields.io/badge/CUDA-12.4-76B900?style=flat-square&logo=nvidia)

---

## 🧠 What is MediAgent?

MediAgent is an enterprise-grade medical AI platform that acts as an intelligent clinical co-pilot for doctors and healthcare professionals. It combines:

- **RAG (Retrieval-Augmented Generation)** — searches real medical documents before answering
- **Multi-Agent Orchestration** — 4 specialized AI agents work as a medical team
- **Local LLM** — Llama 3.1 8B runs on your GPU, no API costs, no data leaves your machine
- **Real-time Streaming** — watch the AI think live, token by token
- **Source Citations** — every answer is backed by real medical documents

---

## 🤖 Multi-Agent Pipeline

```
Doctor's Query
      ↓
 Record Agent        → Analyzes patient records and history
      ↓
 Literature Agent    → Searches medical documents via RAG (ChromaDB)
      ↓
 Risk Agent          → Flags drug interactions and contraindications
      ↓
 Supervisor Agent    → Synthesizes everything into a clinical report
      ↓
 Final Diagnosis with Citations
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| LLM | Llama 3.1 8B (Ollama) | Local AI inference on GPU |
| RAG Framework | LangChain + LangGraph | Document retrieval + agent orchestration |
| Vector Database | ChromaDB | Semantic search over medical documents |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 | Text to vector conversion on CUDA |
| Backend | FastAPI + Uvicorn | Async REST API with WebSocket streaming |
| Frontend | Next.js 16 + TypeScript + TailwindCSS | Medical UI with dark/light mode |
| GPU | NVIDIA RTX 4060 + CUDA 12.4 + PyTorch 2.6 | GPU-accelerated inference |
| Database | SQLite → PostgreSQL (Phase 4) | Patient records and audit logs |

---

## ✨ Features

- 🩺 **Clinical Decision Support** — AI-generated diagnosis summaries with evidence
- 📚 **RAG over Medical Literature** — hypertension, diabetes, cardiology, drug interactions
- ⚠️ **Drug Interaction Alerts** — automatic flagging of contraindications
- 🔄 **Real-time Streaming** — token-by-token response streaming
- 👥 **Patient Profiles** — load patient context to personalize diagnosis
- 🌙 **Dark / Light Mode** — professional medical UI
- 📄 **Source Citations** — every claim backed by a real document
- ⚡ **100% Free** — no API keys, no cloud costs, runs on local GPU

---

## 🚀 Getting Started

### Prerequisites
- Windows 10/11 or Ubuntu
- NVIDIA GPU with CUDA support (8GB+ VRAM recommended)
- Python 3.11
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/krisha-mangukiya/MediAgent.git
cd MediAgent
```

### 2. Install CUDA Toolkit 12.4
Download from: https://developer.nvidia.com/cuda-12-4-0-download-archive

### 3. Set up Python environment
```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
pip install torch==2.6.0+cu124 torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124 --no-deps
```

### 4. Install and setup Ollama
Download from: https://ollama.com/download/windows
```bash
ollama pull llama3.1
```

### 5. Load medical documents into ChromaDB
```bash
python -c "
from backend.rag.document_loader import load_and_split
from backend.rag.vector_store import create_vector_store
import os

docs = [f'data/medical_docs/{f}' for f in os.listdir('data/medical_docs') if f.endswith('.txt')]
all_chunks = []
for doc in docs:
    all_chunks.extend(load_and_split(doc))
create_vector_store(all_chunks)
print('Knowledge base ready!')
"
```

### 6. Start the backend
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 8. Open the app
```
http://localhost:3000
```

---

## 📁 Project Structure

```
MediAgent/
├── backend/
│   ├── main.py                  # FastAPI server (7 endpoints)
│   ├── agents/
│   │   ├── state.py             # Shared agent state (LangGraph)
│   │   ├── record_agent.py      # Patient data analysis
│   │   ├── literature_agent.py  # RAG document search
│   │   ├── risk_agent.py        # Drug interaction checker
│   │   ├── supervisor_agent.py  # Final report synthesis
│   │   └── graph.py             # LangGraph orchestrator
│   ├── rag/
│   │   ├── document_loader.py   # PDF/TXT document ingestion
│   │   ├── vector_store.py      # ChromaDB operations
│   │   └── rag_engine.py        # RAG query pipeline
│   └── utils/
│       └── ollama_client.py     # Llama 3.1 client
├── frontend/
│   └── app/
│       └── page.tsx             # Main UI (Next.js)
├── data/
│   └── medical_docs/
│       ├── hypertension_guide.txt
│       ├── diabetes_guide.txt
│       ├── cardiology_guide.txt
│       └── drug_interactions.txt
├── .env                         # Environment variables
└── requirements.txt             # Python dependencies
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | System status |
| POST | `/ask` | Direct LLM query |
| POST | `/ask/stream` | Streaming LLM response |
| POST | `/rag/ask` | RAG-powered answer with citations |
| POST | `/rag/stream` | Streaming RAG response |
| POST | `/agents/diagnose` | Full multi-agent pipeline |

API Documentation: `http://localhost:8000/docs`

---

## 🗺️ Roadmap

- [x] Phase 1 — FastAPI + Llama 3.1 + RAG Engine
- [x] Phase 2 — LangGraph Multi-Agent Pipeline
- [x] Phase 3 — Next.js Frontend + Medical Documents
- [ ] Phase 4 — PostgreSQL Patient Database
- [ ] Phase 5 — Voice Input (Whisper AI)
- [ ] Phase 6 — Docker + Deployment

---

## 👨‍💻 Author

**Krisha Mangukiya**
- GitHub: [@krisha-mangukiya](https://github.com/krisha-mangukiya)

---

## ⚠️ Disclaimer

MediAgent is an AI research and educational project. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.

---

⭐ If you find this project useful, please give it a star!
