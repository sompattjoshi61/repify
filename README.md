# Repify

> **"Ask your codebase anything"**

Repify is an AI-powered Codebase RAG (Retrieval-Augmented Generation) Assistant that lets developers ask natural language questions about any GitHub repository and get accurate answers with file references.

---

## What Problem Does It Solve?

When a new developer joins a large project, they spend hours reading code to understand:
- How does login work?
- Where is the payment integration?
- Which API is called when a user purchases something?

**Repify answers all of this in seconds.**

---

## Features

- Paste any GitHub URL → repo gets indexed automatically
- Ask questions in plain English → get answers with exact file references
- Upload architecture diagrams → AI explains them
- Supports JS, TS, Python, Go, Java, Markdown, SQL, JSON, YAML

---

## Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | Next.js + Tailwind CSS | Free (Vercel) |
| Backend | FastAPI (Python) | Free |
| Vector Database | Qdrant (Docker) | Free |
| Embeddings | OpenAI text-embedding-3-small | ~$0.02/1M tokens |
| LLM | OpenAI gpt-4o-mini | ~$0.001/question |
| Vision (diagrams) | OpenAI gpt-4o-mini | ~$0.003/image |
| Code Parsing | tree-sitter | Free |
| Git Cloning | GitPython | Free |

**Estimated total cost for resume/demo use: ~$2 from a $5 OpenAI credit**

---

## How It Works

### Step 1 — User Pastes GitHub URL
```
https://github.com/somecompany/project
```

### Step 2 — Backend Clones the Repo
```python
git.Repo.clone_from(github_url, "./temp/repo")
```

### Step 3 — Parse Every File with tree-sitter
- Walks all files, skips `node_modules`, `.git`, `build`, `dist`
- Splits code by functions and classes (not arbitrary character counts)
- Keeps metadata: file path, function name, language

### Step 4 — Create Embeddings
```python
openai.embeddings.create(
    model="text-embedding-3-small",
    input=chunk_content
)
# Returns a vector of 1536 numbers
```

### Step 5 — Store in Qdrant
Each chunk is stored as:
```json
{
  "content": "export const login = async(req,res) => {...}",
  "file_path": "backend/auth/login.js",
  "function_name": "login",
  "language": "javascript"
}
```

### Step 6 — User Asks a Question
```
"How does authentication work?"
```

### Step 7 — Search Qdrant for Relevant Chunks
- Embed the question using OpenAI
- Find top 5 most similar code chunks in Qdrant

### Step 8 — Send to GPT-4o-mini
Retrieved chunks + question → GPT generates answer with file references

### Step 9 — Answer Displayed to User
```
Authentication uses JWT tokens.

1. Login request hits `/api/login`  →  backend/auth/login.js
2. Password verified                →  services/auth/bcrypt.js
3. JWT token generated              →  services/jwt.js
4. Protected routes check token     →  middleware/auth.js
```

---

## Architecture Diagram Support

```
User uploads image (PNG/JPG)
        ↓
Sent to gpt-4o-mini vision
        ↓
GPT describes it in text
        ↓
Text is embedded and stored in Qdrant
        ↓
Now queryable just like code
```

---

## Full Flow

```
GitHub URL
    ↓
Clone Repo (GitPython)
    ↓
Parse Files (tree-sitter)
    ↓
Create Embeddings (OpenAI)
    ↓
Store in Qdrant (Docker)
    ↓
User asks question
    ↓
Embed question (OpenAI)
    ↓
Search Qdrant → top 5 chunks
    ↓
Send to GPT-4o-mini
    ↓
Answer with file references
```

---

## Project Structure

```
repify/
├── frontend/                  (Next.js)
│   ├── app/
│   │   └── page.tsx           (chat UI)
│   └── components/
│       ├── ChatWindow.tsx
│       ├── RepoInput.tsx
│       └── DiagramUpload.tsx
├── backend/                   (FastAPI)
│   ├── main.py                (API routes)
│   ├── ingest.py              (clone + parse + embed + store)
│   ├── search.py              (query + retrieve from Qdrant)
│   └── llm.py                 (send context to GPT)
├── docker-compose.yml         (runs Qdrant locally)
├── requirements.txt           (Python dependencies)
└── README.md
```

---

## Python Dependencies

```
fastapi
uvicorn
openai
qdrant-client
gitpython
tree-sitter
tree-sitter-languages
python-multipart
python-dotenv
```

---

## Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

---

## Build Order

```
Week 1
  ├── backend/ingest.py   → clone repo + parse files + embed + store in Qdrant
  └── backend/search.py   → embed question + search Qdrant + send to GPT

Week 2
  ├── frontend/           → chat UI + GitHub URL input
  ├── Connect frontend ↔ backend
  └── Add diagram upload feature
```

---

## Running Locally

### 1. Start Qdrant
```bash
docker run -p 6333:6333 qdrant/qdrant
```

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## Resume Bullet Points

```
• Built Repify, a Codebase RAG Assistant that indexes GitHub repos and
  answers natural language questions with file-level references

• Implemented semantic search using Qdrant vector database and
  OpenAI embeddings with tree-sitter AST-based code chunking

• Integrated GPT-4o-mini for context-aware code explanations with
  multimodal support for architecture diagram analysis
```
