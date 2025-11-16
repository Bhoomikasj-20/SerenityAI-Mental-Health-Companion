# 🌿 **SerenityAI – AI-Driven Mental Health & Wellness Companion for Students**

**SerenityAI** is a **student-centric mental health companion** offering empathetic AI conversations, mood detection, crisis alerts, gamified wellness, and secure encrypted logging — all built with privacy in mind.

Developed using **FastAPI**, **React.js**, and **Microsoft Phi-3**, the system is optimized for real-world campus environments.

---

# 🚀 **Key Features**

## 🧠 **AI Emotional Companion**
- **Empathetic, context-aware chat (Phi-3 Mini)**
- **Emotion detection** (stress, anxiety, sadness, anger, joy)
- **Conversation memory** using structured prompts
- **Crisis keyword detection**

---

## ❤️ **Three-Stage Emotional Response Engine**

### **1️⃣ Mood Awareness**
- Rule-based + regex-based **emotion classification**

### **2️⃣ Supportive AI Response (Phi-3)**
Uses:
- **Sentiment context**
- **User emotion**
- **Chat history**
- **System prompts**

### **3️⃣ Action Routing**
Auto-suggests:
- **Journaling**
- **Gratitude prompts**
- **Breathing exercises**
- **Therapist links**
- **Wellness hub activities**

---

# 🔐 **Privacy & Security**
- **Blockchain-style encrypted logging**
- **No plain-text sensitive data**
- **Guest mode available**

---

# 🎮 **Gamified Wellness Hub**
- **Daily mental wellness challenges**
- **Relaxing games** (Zen Garden, Breathing, Coloring)
- **XP points & rewards**

---

# 🧑‍🤝‍🧑 **Peer Groups (Safe & Moderated)**
- **Student wellness discussion rooms**
- **Banned-word filtering**
- **Supportive messaging**

---

# 🏗️ **Project Architecture**

SerenityAI/
├── backend/ # FastAPI backend logic
│ ├── app/
│ │ ├── api/ # Chatbot, auth, wellness, groups
│ │ ├── models/ # SQLAlchemy models
│ │ ├── ai/
│ │ │ ├── llm_phi3.py
│ │ │ ├── emotion_analyzer.py
│ │ │ └── chatbot.py
│ │ ├── blockchain/ # Encrypted event logging
│ │ ├── services/ # Business logic
│ │ └── utils/
│ ├── requirements.txt
│
├── frontend/ # React + Tailwind frontend
│ ├── src/
│ │ ├── components/ # Chat UI, Cards, Modals
│ │ ├── pages/ # Dashboard, Wellness Hub
│ │ ├── services/ # Axios API calls
│ │ └── utils/
│ ├── package.json
│
└── README.md


---

# 🛠️ **Tech Stack**

## **Frontend**
- **React.js**
- **TailwindCSS**
- **Axios**
- **Socket.io**

## **Backend**
- **FastAPI**
- **SQLAlchemy**
- **Uvicorn**
- **PostgreSQL / SQLite**

## **AI**
- **Microsoft Phi-3 Mini**
- **Custom Emotion Analyzer**


## **Privacy Layer**
- **Encrypted Log Chain**
- **No plain sensitive storage**

---

# 📦 **Installation**

## **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

## **Frontend Setup**
cd frontend
npm install
npm run dev

**📌 Why SerenityAI?**

Emotion-aware AI support

Lightweight & deployable

Privacy-first design

Optimized for students

Early mental health assistance

📝 License

MIT License


