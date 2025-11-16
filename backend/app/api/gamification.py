"""
Gamification API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, WellnessPoints, Challenge
from app.config import settings

router = APIRouter()


class ChallengeCreate(BaseModel):
    challenge_type: str
    title: str
    description: Optional[str] = None


class ChallengeResponse(BaseModel):
    id: int
    challenge_type: str
    title: str
    description: Optional[str]
    completed: bool
    points_earned: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    username: str
    points: int
    level: int
    rank: int


@router.get("/points")
async def get_wellness_points(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's wellness points and level"""
    wellness = db.query(WellnessPoints).filter(
        WellnessPoints.user_id == current_user.id
    ).first()
    
    if not wellness:
        # Create initial wellness record
        wellness = WellnessPoints(user_id=current_user.id, points=0, level=1)
        db.add(wellness)
        db.commit()
        db.refresh(wellness)
    
    return {
        "points": wellness.points,
        "level": wellness.level,
        "badges": wellness.badges or "[]"
    }


@router.post("/challenges", response_model=ChallengeResponse, status_code=201)
async def create_challenge(
    challenge_data: ChallengeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new wellness challenge"""
    challenge = Challenge(
        user_id=current_user.id,
        challenge_type=challenge_data.challenge_type,
        title=challenge_data.title,
        description=challenge_data.description
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    
    return challenge


@router.get("/challenges", response_model=List[ChallengeResponse])
async def get_challenges(
    completed: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's challenges"""
    query = db.query(Challenge).filter(Challenge.user_id == current_user.id)
    
    if completed is not None:
        query = query.filter(Challenge.completed == completed)
    
    challenges = query.order_by(Challenge.created_at.desc()).all()
    return challenges


@router.post("/challenges/{challenge_id}/complete")
async def complete_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a challenge as completed and award points"""
    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id,
        Challenge.user_id == current_user.id
    ).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    if challenge.completed:
        raise HTTPException(status_code=400, detail="Challenge already completed")
    
    # Award points
    points_earned = settings.POINTS_PER_CHALLENGE
    challenge.completed = True
    challenge.completed_at = datetime.utcnow()
    challenge.points_earned = points_earned
    
    # Update wellness points
    wellness = db.query(WellnessPoints).filter(
        WellnessPoints.user_id == current_user.id
    ).first()
    
    if not wellness:
        wellness = WellnessPoints(user_id=current_user.id, points=0, level=1)
        db.add(wellness)
    
    wellness.points += points_earned
    # Level up every 100 points
    wellness.level = (wellness.points // 100) + 1
    
    db.commit()
    
    return {
        "message": "Challenge completed!",
        "points_earned": points_earned,
        "total_points": wellness.points,
        "level": wellness.level
    }


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get wellness points leaderboard"""
    wellness_records = db.query(WellnessPoints, User).join(
        User, WellnessPoints.user_id == User.id
    ).order_by(WellnessPoints.points.desc()).limit(limit).all()
    
    leaderboard = []
    for rank, (wellness, user) in enumerate(wellness_records, 1):
        leaderboard.append(LeaderboardEntry(
            username=user.username,
            points=wellness.points,
            level=wellness.level,
            rank=rank
        ))
    
    return leaderboard


@router.post("/award-chat-points")
async def award_chat_points(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Award points for chatting with AI companion"""
    wellness = db.query(WellnessPoints).filter(
        WellnessPoints.user_id == current_user.id
    ).first()
    
    if not wellness:
        wellness = WellnessPoints(user_id=current_user.id, points=0, level=1)
        db.add(wellness)
    
    points_earned = settings.POINTS_PER_CHAT
    wellness.points += points_earned
    wellness.level = (wellness.points // 100) + 1
    
    db.commit()
    
    return {
        "points_earned": points_earned,
        "total_points": wellness.points,
        "level": wellness.level
    }

