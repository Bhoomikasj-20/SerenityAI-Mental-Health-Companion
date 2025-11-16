"""
Innovaden - Main FastAPI Application
AI-Driven Digital Mental Health Platform for Students
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.api import auth, chatbot, analytics, gamification, care_network, peer_groups
from app.database import engine, Base
from app.config import settings
import asyncio
import logging

logger = logging.getLogger(__name__)

# Import all models to ensure they are registered with Base
from app.models import User, ChatSession, ChatMessage, MoodLog, WellnessPoints, Challenge, CrisisAlert, PeerGroup, PeerMessage

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SerenityAI API",
    description="AI-Driven Digital Mental Health Platform for Students",
    version="1.0.0"
)


@app.on_event("startup")
async def preload_ai_models():
    """Preload Phi-3 LLM model in a background thread to avoid blocking first request."""
    try:
        # Import companion lazily to avoid circular imports at module load
        from app.ai.chatbot import companion
        # Run the model loading in a thread so startup isn't blocked by heavy model downloads
        # Phi-3 will lazy load on first use, but we can trigger it here
        await asyncio.to_thread(companion._get_model)
        logger.info("Phi-3 LLM model preloaded on startup")
    except Exception as e:
        logger.warning(f"Failed to preload Phi-3 model at startup: {e}")
        logger.info("Model will load on first use")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["AI Companion"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(gamification.router, prefix="/api/gamification", tags=["Gamification"])
app.include_router(care_network.router, prefix="/api/care", tags=["Care Network"])
app.include_router(peer_groups.router, prefix="/api", tags=["Peer Groups"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to SerenityAI API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

