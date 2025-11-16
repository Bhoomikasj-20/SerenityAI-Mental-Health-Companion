"""
Predictive Analytics API endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, MoodLog
from app.services.predictive_analytics import predictive_analytics
from app.config import settings

router = APIRouter()


class MoodLogCreate(BaseModel):
    mood_score: int  # 1-10
    stress_level: int  # 1-10
    anxiety_level: int  # 1-10
    notes: Optional[str] = None


class RiskPrediction(BaseModel):
    risk_level: str
    risk_score: int
    confidence: float
    probabilities: dict


class TrendAnalysis(BaseModel):
    trend: str
    stress_trend: str
    average_mood: float
    average_stress: float
    average_anxiety: float
    data_points: int
    latest_mood: int
    latest_stress: int
    latest_anxiety: int


@router.post("/mood-log", status_code=201)
async def create_mood_log(
    mood_data: MoodLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a mood log entry"""
    mood_log = MoodLog(
        user_id=current_user.id,
        mood_score=mood_data.mood_score,
        stress_level=mood_data.stress_level,
        anxiety_level=mood_data.anxiety_level,
        notes=mood_data.notes
    )
    db.add(mood_log)
    db.commit()
    db.refresh(mood_log)
    
    return {"message": "Mood log created successfully", "id": mood_log.id}


@router.get("/risk-prediction", response_model=RiskPrediction)
async def get_risk_prediction(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mental health risk prediction for current user"""
    # Get latest mood log
    latest_log = db.query(MoodLog).filter(
        MoodLog.user_id == current_user.id
    ).order_by(MoodLog.created_at.desc()).first()
    
    if not latest_log:
        # Default values if no mood log exists
        mood_score = 5
        stress_level = 5
        anxiety_level = 5
    else:
        mood_score = latest_log.mood_score
        stress_level = latest_log.stress_level
        anxiety_level = latest_log.anxiety_level
    
    # Calculate days since last log
    if latest_log:
        days_since = (datetime.utcnow() - latest_log.created_at).days
    else:
        days_since = 0
    
    # Get chat frequency (simplified)
    from app.models.user import ChatMessage, ChatSession
    chat_count = db.query(ChatMessage).join(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).count()
    
    # Predict risk
    prediction = predictive_analytics.predict_risk(
        mood_score=mood_score,
        stress_level=stress_level,
        anxiety_level=anxiety_level,
        days_since_last_log=days_since,
        chat_frequency=min(chat_count, 10)
    )
    
    return prediction


@router.get("/trends", response_model=TrendAnalysis)
async def get_trends(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mood trends analysis"""
    trends = predictive_analytics.analyze_user_trends(db, current_user.id, days)
    return trends


@router.get("/mood-logs")
async def get_mood_logs(
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mood log history"""
    logs = db.query(MoodLog).filter(
        MoodLog.user_id == current_user.id
    ).order_by(MoodLog.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "mood_score": log.mood_score,
            "stress_level": log.stress_level,
            "anxiety_level": log.anxiety_level,
            "notes": log.notes,
            "created_at": log.created_at.isoformat()
        }
        for log in logs
    ]

