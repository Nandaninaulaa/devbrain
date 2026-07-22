# 🧠 Developer Brain — Personal Mode MVP

An **AI-powered knowledge system** for your own codebases and notes. Ingest a project folder, ask natural-language questions grounded in your content, automatically generate interview flashcards, and visualize relationships between concepts using a knowledge graph.

This project implements **Phases 0–5** of the roadmap:

> 📥 Ingestion → ✂️ Chunking → 🧩 Embeddings → 🗂️ Vector Database (Chroma) → 💬 RAG Question Answering → 📝 Flashcards → 🕸️ Knowledge Graph → ⚛️ React Frontend → 🐳 Docker Deployment

By default, the project runs **completely free** using local embeddings and retrieval-only mode, and automatically upgrades to full LLM-powered responses once an OpenAI API key is provided.

---

# ✨ Features

### 📥 Intelligent Project Ingestion

* Automatically scans project folders
* Supports source code and documentation
* Extracts meaningful chunks for semantic search

### 🧩 Semantic Embeddings

* Local SentenceTransformers embeddings (zero cost)
* Optional OpenAI embeddings for higher retrieval quality

### 💬 AI-Powered RAG Question Answering

Ask questions like:

> *"How does authentication work?"*

> *"Explain the retry logic."*

Developer Brain retrieves the most relevant code and documentation before generating grounded answers.

---

### 📝 Interview Flashcard Generator

Automatically creates flashcards from your own projects.

* 🤖 LLM-generated cards (OpenAI)
* 🆓 Heuristic fallback when running locally

Perfect for interview preparation.

---

### 🕸️ Knowledge Graph

Builds an interactive graph connecting:

* 🟠 Concepts
* 🔵 Files

LLM mode extracts semantic concepts.

Offline mode extracts functions and classes automatically.

---

### 🌐 React Dashboard

Modern frontend built with React + Vite.

Tabs include:

* 💬 Ask
* 📝 Flashcards
* 🕸️ Knowledge Graph
* 📥 Ingest

---

### 🐳 Docker Support

Run the complete stack with a single command.

Includes:

* FastAPI Backend
* React Frontend
* Neo4j
* ChromaDB

---

# 📂 Project Structure

```text
developer-brain/
│
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── chunking.py
│   │   ├── file_readers.py
│   │   ├── embeddings.py
│   │   ├── vectorstore.py
│   │   ├── ingest.py
│   │   ├── qa.py
│   │   ├── flashcards.py
│   │   ├── graph.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

# 🚀 Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

The first embedding request downloads the **all-MiniLM-L6-v2** model (~80MB) from Hugging Face and caches it locally.

---

# 📥 Ingest a Project

Using CLI:

```bash
python -m app.ingest /path/to/project
```

Or use:

* 📥 Ingest API
* 🌐 Frontend Ingest Tab

---

# 💬 Ask Questions

Example:

```bash
curl -X POST http://localhost:8000/ask \
-H "Content-Type: application/json" \
-d '{"question":"How does authentication work?"}'
```

Without an API key:

* returns the most relevant retrieved chunks.

With OpenAI:

* returns grounded AI-generated answers.

---

# 🔑 Enable OpenAI

Edit `.env`

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
```

Optional:

```env
EMBEDDING_PROVIDER=openai
```

for OpenAI embeddings.

---

# ⚛️ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend automatically proxies API requests to the backend.

---

# 🕸️ Knowledge Graph

The graph extracts concepts from your projects and stores them in Neo4j.

Relationships:

```text
Concept
      │
      ▼
USED_IN
      │
      ▼
File
```

API Endpoints:

* POST `/graph/build`
* GET `/graph`
* DELETE `/graph`

Supports:

* 🤖 LLM concept extraction
* 🆓 Function/Class extraction fallback

---

# 🐳 Docker Deployment

Copy environment file:

```bash
cp .env.docker.example .env
```

Run everything:

```bash
docker compose up --build
```

Services:

* ⚛️ Frontend → http://localhost:5173
* 🚀 Backend → http://localhost:8000
* 🕸️ Neo4j → http://localhost:7474

Persistent volumes:

* chroma_data
* neo4j_data

---

# 📈 Project Progress

| Phase                | Status     |
| -------------------- | ---------- |
| 🎯 Scope MVP         | ✅ Complete |
| 📥 Ingestion         | ✅ Complete |
| 💬 RAG Q&A           | ✅ Complete |
| 📝 Flashcards        | ✅ Complete |
| 🕸️ Knowledge Graph  | ✅ Complete |
| ⚛️ React Frontend    | ✅ Complete |
| 🐳 Docker Deployment | ✅ Complete |
| 👥 Team Mode         | 🚧 Planned |

---

# 🔮 Future Improvements

* 👥 Multi-user authentication
* 📂 GitHub repository ingestion
* 📜 Pull Request analysis
* 📄 Automatic ADR generation
* 🔗 Concept prerequisite relationships
* 🧠 Improved graph reasoning
* ☁️ Cloud deployment

---

# ✅ Tested Components

Successfully tested:

* 📥 Folder ingestion
* ✂️ Chunking
* 🧩 Embedding generation
* 🗂️ Chroma vector storage
* 💬 Retrieval pipeline
* 📝 Flashcard generation
* 🕸️ Knowledge graph creation

The SentenceTransformers model and OpenAI API calls require internet access and were not exercised in an offline environment but are supported once configured locally.

---

# 👩‍💻 Author

## **Nandani Naula**

🎓 B.Tech Computer Science & Engineering (Artificial Intelligence & Machine Learning)

💻 Full Stack Developer • AI/ML Enthusiast • RAG • LLMs • Knowledge Graphs

🔗 GitHub: https://github.com/Nandaninaulaa

⭐ If you found this project useful, consider giving it a **Star** on GitHub!

