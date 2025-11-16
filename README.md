🌿 SerenityAI – AI-Driven Mental Health & Wellness Companion for Students

SerenityAI is a modern, student-friendly mental health companion designed to provide empathetic AI support, early distress detection, and seamless access to care networks—while keeping user privacy at the core.

Built with FastAPI, React.js, and Phi-3 (SLM), the system is lightweight, secure, and optimized for real-world college environments.

🚀 Key Features
🧠 AI Emotional Companion (Phi-3 LLM-Powered)

Context-aware, empathetic chat responses

Emotion-based support routing (happy → gratitude, stress/anxiety → relaxation, sadness → journal, crisis → therapist)

Conversation memory using structured prompts + history

Crisis detection through rule-based emotional analyzer

❤️ Three-Stage Response Engine

Mood Awareness
Rule-based emotion + sentiment detection (happy, sad, anxiety, stress, anger, crisis)

Supportive Response (Phi-3)
Emotion-aware LLM replies using:

system prompts

sentiment context

conversation history

Personalized Action Routing
Auto-suggests: journal, gratitude, breathing exercise, therapist link, etc.

🔐 Privacy & Security

Blockchain-based encrypted event logging

No sensitive data stored in plain form

Guest mode available — no login required

🎮 Gamified Wellness Hub

Daily challenges

Relaxation games (Zen Garden, breathing animations, coloring tasks)

🧑‍🤝‍🧑 Peer Groups

Safe groups for discussions

Basic banned-word filtering

Supportive message exchange


🏗️ Project Architecture
SerenityAI/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/          # Chatbot, auth, analytics, wellness, groups
│   │   ├── models/       # SQLAlchemy models (User, Session, Messages)
│   │   ├── ai/
│   │   │   ├── llm_phi3.py         # Phi-3 LLM integration
│   │   │   ├── emotion_analyzer.py # Rule-based emotion classifier
│   │   │   └── chatbot.py          # AI conversation engine
│   │   ├── blockchain/   # Privacy layer
│   │   ├── services/     # Business logic
│   │   └── utils/
│   └── requirements.txt
│
├── frontend/             # React + Tailwind frontend
│   ├── src/
│   │   ├── components/   # UI components (Chat, Modals, Cards)
│   │   ├── pages/        # Dashboard, Wellness Hub, Gamification
│   │   ├── services/     # API integration
│   │   └── utils/
│   └── package.json
└── README.md

🛠️ Tech Stack
Frontend

React.js

TailwindCSS

Axios (API)

Socket.io (real-time)

Backend

FastAPI

SQLAlchemy ORM

PostgreSQL / SQLite (local)

Uvicorn

AI

Microsoft Phi-3 Mini (Small Language Model)

Custom rule-based Emotion Analyzer (regex)

Structured prompt engineering

Privacy Layer

Lightweight Blockchain-style encrypted logging

Ensures tamper-proof history

📦 Installation
Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Frontend Setup
cd frontend
npm install
npm run dev


📌 Why SerenityAI?

AI-powered mental health support

Lightweight & deployable on normal laptops

Fast, secure, private

College-friendly design

Focused on early intervention

📝 License

MIT License
