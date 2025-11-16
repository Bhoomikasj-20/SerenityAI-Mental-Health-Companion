"""
AI Companion Chatbot API - Production-Ready FastAPI Implementation
====================================================================
Three-Stage Response System:
1. Mood Awareness: Emotion + Sentiment Analysis
2. Supportive Response: Phi-3 LLM Generation
3. Personalized Action Routing: Emotion-based Redirects

Architecture:
- Crisis detection via EmotionAnalyzer (NO detect_crisis function)
- Session management with DB history sync
- Blockchain privacy layer (non-blocking)
- Comprehensive error handling
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Optional
import logging
import traceback
import asyncio

from app.database import get_db
from app.api.auth import get_current_user
from app.ai.chatbot import companion
from app.models.user import User, ChatSession, ChatMessage, CrisisAlert
from app.blockchain.privacy_layer import privacy_layer
from app.config import settings


# ===================================================================
#                         ROUTER SETUP
# ===================================================================

router = APIRouter()
logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer(auto_error=False)


# ===================================================================
#                    REQUEST / RESPONSE MODELS
# ===================================================================

class ChatRequest(BaseModel):
    """Incoming chat message request"""
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Structured chat response with emotion routing"""
    response: str
    session_id: str
    intent: str = "general"
    emotion: str = "neutral"
    sentiment: str = "NEUTRAL"
    crisis: bool = False
    contact_path: Optional[str] = None
    redirect: Optional[str] = None


# ===================================================================
#                    EMOTION ACTION MAPPING
# ===================================================================

EMOTION_REDIRECT_MAP = {
    "happy": "gratitude",
    "sad": "journal",
    "sadness": "journal",
    "stress": "relaxation",
    "anxiety": "relaxation",
    "anger": "breathing",
    "crisis": "therapist",
    "neutral": None
}


# ===================================================================
#                    HELPER FUNCTIONS
# ===================================================================

def resolve_user(
    creds: Optional[HTTPAuthorizationCredentials],
    db: Session
) -> User:
    """
    Resolve authenticated user from JWT token or return guest user.

    Returns:
        User: Authenticated user or guest user
    """
    current_user = None

    if creds and getattr(creds, "credentials", None):
        try:
            payload = jwt.decode(
                creds.credentials,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            username = payload.get("sub")
            if username:
                current_user = db.query(User).filter(User.username == username).first()
        except JWTError:
            # invalid token -> treat as guest
            current_user = None

    # Guest fallback
    if current_user is None:
        guest = db.query(User).filter(User.username == "guest").first()
        if not guest:
            guest = User(
                email="guest@local",
                username="guest",
                hashed_password="",
                full_name="Guest User",
                is_active=False
            )
            db.add(guest)
            db.commit()
            db.refresh(guest)
        current_user = guest

    return current_user


def get_or_create_session(
    user_id: int,
    session_id: Optional[str],
    db: Session
) -> str:
    """
    Get existing session or create new one.

    Returns:
        str: Session ID
    """
    if not session_id:
        session = ChatSession(
            user_id=user_id,
            session_id=f"session_{user_id}_{datetime.utcnow().timestamp()}"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session.session_id

    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session.session_id


def load_conversation_history(session_id: str, user_id: int, db: Session) -> None:
    """
    Load conversation history from database and sync to companion's in-memory store.
    """
    previous_messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at).limit(20).all()

    formatted_history = []
    for msg in previous_messages:
        formatted_history.append({"role": "user", "content": msg.message})
        formatted_history.append({"role": "assistant", "content": msg.response})

    companion.conversation_history[str(user_id)] = formatted_history


def get_redirect_for_emotion(emotion: str) -> Optional[str]:
    """
    Map emotion to redirect action.

    Returns:
        Optional[str]: Redirect action or None
    """
    return EMOTION_REDIRECT_MAP.get(emotion)


# ===================================================================
#                    MAIN CHAT ENDPOINT
# ===================================================================

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    """
    Main chat endpoint implementing Three-Stage Response System.

    Stage 1: Mood Awareness - Analyze emotion and sentiment
    Stage 2: Supportive Response - Generate Phi-3 LLM response
    Stage 3: Personalized Action Routing - Determine redirect action
    """

    try:
        # ============================================================
        # STAGE 0: User Resolution
        # ============================================================
        current_user = resolve_user(creds, db)
        user_id_str = str(current_user.id)

        # ============================================================
        # STAGE 1: Mood Awareness
        # ============================================================
        # Analyze emotion and sentiment BEFORE any LLM processing
        emotion_result = companion.emotion_analyzer.analyze_emotion(request.message)
        sentiment_result = companion.emotion_analyzer.analyze_sentiment(request.message)

        emotion = emotion_result.get("emotion", "neutral")
        emotion_score = float(emotion_result.get("score", 0.5))
        sentiment = sentiment_result.get("label", "neutral")
        sentiment_score = float(sentiment_result.get("score", 0.0))

        logger.info(
            f"User {user_id_str}: emotion={emotion} ({emotion_score:.2f}), "
            f"sentiment={sentiment} ({sentiment_score:.2f})"
        )

        # ============================================================
        # CRISIS HANDLING (Before LLM)
        # ============================================================
        if emotion == "crisis":
            crisis_response = (
                "I'm really sorry you're feeling this way. You are not alone. "
                "I've notified the help desk so they can support you. "
                "If you're in immediate danger, please reach out to a trusted person or counselor now. "
                "You matter, and there are people who want to help you."
            )

            # Create crisis alert
            try:
                alert = CrisisAlert(
                    user_id=current_user.id,
                    student_id=user_id_str,
                    message=request.message,
                    status="pending"
                )
                db.add(alert)
                db.commit()
                logger.info(f"Crisis alert created for user {user_id_str}")
            except Exception as e:
                logger.error(f"Error creating crisis alert: {e}")
                db.rollback()

            # Get or create session
            session_id = get_or_create_session(current_user.id, request.session_id, db)

            # Save crisis message with full analytics
            chat_message = ChatMessage(
                session_id=session_id,
                message=request.message,
                response=crisis_response,
                sentiment="CRISIS",
                emotion="crisis",
                intent="crisis_intervention"
            )
            db.add(chat_message)
            db.commit()

            return ChatResponse(
                response=crisis_response,
                session_id=session_id,
                intent="crisis_intervention",
                emotion="crisis",
                sentiment="CRISIS",
                crisis=True,
                contact_path="/care/contact",
                redirect="therapist"
            )

        # ============================================================
        # Session Management & History Loading
        # ============================================================
        session_id = get_or_create_session(current_user.id, request.session_id, db)
        load_conversation_history(session_id, current_user.id, db)

        # ============================================================
        # STAGE 2: Supportive Response (Phi-3 LLM)
        # ============================================================
        async def generate_llm_response():
            """Generate response using Phi-3 in background thread"""
            return await asyncio.to_thread(
                companion.generate_response,
                request.message,
                user_id_str
            )

        try:
            ai_response = await asyncio.wait_for(generate_llm_response(), timeout=30.0)
        except asyncio.TimeoutError:
            logger.warning(f"LLM timeout for user {user_id_str}, using fallback")
            ai_response = {
                "response": "I'm here with you. Let's take a deep breath while I process your thoughts.",
                "emotion": emotion,
                "sentiment": sentiment,
                "redirect": get_redirect_for_emotion(emotion),
                "intent": "general",
                "sentiment_score": sentiment_score,
                "emotion_score": emotion_score
            }
        except Exception as e:
            logger.error(f"LLM generation error: {e}")
            ai_response = {
                "response": "I'm here to support you. Could you tell me more about what you're experiencing?",
                "emotion": emotion,
                "sentiment": sentiment,
                "redirect": get_redirect_for_emotion(emotion),
                "intent": "general",
                "sentiment_score": sentiment_score,
                "emotion_score": emotion_score
            }

        # Extract response data
        response_text = ai_response.get("response", "I'm here to support you.")
        response_emotion = ai_response.get("emotion", emotion)
        response_sentiment = ai_response.get("sentiment", sentiment)
        redirect = ai_response.get("redirect") or get_redirect_for_emotion(response_emotion)
        intent = ai_response.get("intent", "general")

        # ============================================================
        # Save Message to Database
        # ============================================================
        chat_message = ChatMessage(
            session_id=session_id,
            message=request.message,
            response=response_text,
            sentiment=response_sentiment,
            emotion=response_emotion,
            intent=intent
        )
        db.add(chat_message)

        # ============================================================
        # STAGE 3: Personalized Action Routing
        # ============================================================
        # Redirect is already determined from emotion mapping

        # ============================================================
        # Blockchain Privacy Layer (Non-blocking)
        # ============================================================
        try:
            privacy_layer.store_data(
                user_id=user_id_str,
                data_type="chat_message",
                data={
                    "message": request.message,
                    "response": response_text,
                    "emotion": response_emotion,
                    "sentiment": response_sentiment,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
        except Exception as e:
            logger.warning(f"Blockchain store error (non-blocking): {e}")

        db.commit()

        # ============================================================
        # Return Final Response
        # ============================================================
        return ChatResponse(
            response=response_text,
            session_id=session_id,
            intent=intent,
            emotion=response_emotion,
            sentiment=response_sentiment,
            crisis=False,
            contact_path=None,
            redirect=redirect
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=503,
            content={"error": "Chat temporarily unavailable. Please try again."}
        )
