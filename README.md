# SerenityAI – AI-Driven Digital Mental Health Platform for Students

## 🎯 Project Overview

SerenityAI is an AI-powered, secure, stigma-free, and culturally inclusive digital platform that provides personalized emotional support, early detection of distress, and easy access to care for students.

## 🏗️ System Architecture

```
SerenityAI/
├── backend/              # FastAPI backend server
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   ├── ai/          # AI/NLP modules
│   │   ├── blockchain/  # Blockchain integration
│   │   └── utils/       # Utilities
│   └── requirements.txt
├── frontend/            # React.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Frontend utilities
│   └── package.json
├── ai_models/           # AI model training and inference
├── blockchain/          # Blockchain smart contracts
└── docs/               # Documentation
```

## 🚀 Features

1. **AI Emotional Companion** - 24/7 empathetic chatbot with CBT-based responses
2. **Blockchain Privacy Layer** - Secure, anonymous data storage
3. **Predictive Analytics** - Early detection of mental health risks
4. **Gamified Wellness Hub** - Challenges, points, leaderboards
5. **Hybrid Care Network** - AI → Peer Mentor → Counselor support
6. **Peer Groups** - College-based safe chatrooms where authenticated users can create/join groups and share supportive messages (banned-word filtering & moderation placeholder)
7. **Accessibility (Voice & Read-Aloud)** - Microphone input (SpeechRecognition) and read-aloud (speechSynthesis) with preferences stored in localStorage

## 🛠️ Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React.js, Socket.io
- **AI/NLP**: HuggingFace Transformers, Rasa
- **Blockchain**: Ethereum/Hyperledger (lightweight implementation)
- **ML**: Scikit-learn, TensorFlow/PyTorch
- **Real-time**: WebSocket, Socket.io

## 📦 Installation

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

Create a `.env` in the `backend/` folder to override defaults if needed. Defaults are set for local dev.

Key settings you can set in `.env`:

- SECRET_KEY=your_secret
- DATABASE_URL=sqlite:///./serenityai.db
- VITE_API_URL=http://localhost:8000/api

## 📝 License

MIT License
