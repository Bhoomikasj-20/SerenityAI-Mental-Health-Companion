🌿 SerenityAI – AI-Driven Mental Health & Wellness Companion for Students

SerenityAI is a privacy-focused, empathetic, and student-centric mental health companion designed to support emotional well-being using modern AI.

Built using FastAPI + React.js + Phi-3 SLM, SerenityAI is lightweight, deployable on campus systems, and optimized for real-world college mental health needs.

🚀 Key Features
🧠 AI Emotional Companion (Phi-3 Mini + Emotion Analyzer)

Context-aware, empathetic chat responses

Supports stress, anxiety, sadness, happiness, frustration

Conversation memory with structured prompts

Crisis keyword detection + alert routing

❤️ Three-Stage Response Engine
1. Mood Awareness

Rule-based and regex-based sentiment detection:

Happy

Sad

Anxiety

Stress

Anger

Crisis indicators (self-harm words)

2. Supportive AI Response (Phi-3)

Custom prompt engineering

User emotion injected into system prompt

History-aware responses

3. Action Routing

Auto-suggests:

Journaling

Gratitude prompts

Breathing exercises

Campus counsellor / therapist links

Wellness hub activities

🔐 Privacy & Security

Blockchain-style encrypted event logging

No plain-text sensitive storage

Optional Guest Mode (anonymous usage)

🎮 Gamified Wellness Hub

Daily mental well-being challenges

Relaxing games (Coloring, Zen Garden, Breathing animations)

XP points & rewards

🧑‍🤝‍🧑 Peer Groups (Safe & Moderated)

Student wellness discussion rooms

Banned-word filtering

Supportive messaging

🏗️ Project Architecture
SerenityAI/
├── backend/                # FastAPI backend logic
│   ├── app/
│   │   ├── api/            # Chatbot, auth, wellness, groups
│   │   ├── models/         # SQLAlchemy models
│   │   ├── ai/
│   │   │   ├── llm_phi3.py
│   │   │   ├── emotion_analyzer.py
│   │   │   └── chatbot.py
│   │   ├── blockchain/     # Encrypted event logging
│   │   ├── services/       # Business logic
│   │   └── utils/
│   ├── requirements.txt
│
├── frontend/               # React + Tailwind
│   ├── src/
│   │   ├── components/     # Chat UI, Cards, Modals
│   │   ├── pages/          # Dashboard, Wellness Hub
│   │   ├── services/       # Axios API
│   │   └── utils/
│   ├── package.json
│
└── README.md

🛠️ Tech Stack
Frontend

React.js

TailwindCSS

Axios

Socket.io

Backend

FastAPI

SQLAlchemy ORM

Uvicorn

PostgreSQL / SQLite

AI

Microsoft Phi-3 Mini

Custom Emotion Analyzer

Prompt-engineering engine

Privacy

Encrypted log chain

No sensitive data stored

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

Lightweight and deployable anywhere

Emotion-aware responses

Privacy-first design

Early warning system for distressed students

📝 License

MIT License
