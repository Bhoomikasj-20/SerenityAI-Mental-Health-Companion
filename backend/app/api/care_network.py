"""
Hybrid Care Network API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, CrisisAlert
from app.config import settings

router = APIRouter()


class CounselorInfo(BaseModel):
    id: int
    name: str
    specialization: str
    availability: str
    
    class Config:
        from_attributes = True


class PeerMentorInfo(BaseModel):
    id: int
    username: str
    experience_level: str
    
    class Config:
        from_attributes = True


class AppointmentRequest(BaseModel):
    counselor_id: int
    preferred_date: str
    preferred_time: str
    reason: Optional[str] = None


@router.get("/counselors", response_model=List[CounselorInfo])
async def get_counselors(
    db: Session = Depends(get_db)
):
    """Get list of available counselors"""
    counselors = db.query(User).filter(
        User.is_counselor == True,
        User.is_active == True
    ).all()
    
    # In production, this would come from a separate Counselor table
    return [
        CounselorInfo(
            id=counselor.id,
            name=counselor.full_name or counselor.username,
            specialization="General Mental Health",  # Would be from Counselor table
            availability="Mon-Fri, 9 AM - 5 PM"  # Would be from Counselor table
        )
        for counselor in counselors
    ]


@router.get("/peer-mentors", response_model=List[PeerMentorInfo])
async def get_peer_mentors(
    db: Session = Depends(get_db)
):
    """Get list of available peer mentors"""
    mentors = db.query(User).filter(
        User.is_peer_mentor == True,
        User.is_active == True
    ).limit(10).all()
    
    return [
        PeerMentorInfo(
            id=mentor.id,
            username=mentor.username,
            experience_level="Trained Peer Mentor"  # Would be from Mentor table
        )
        for mentor in mentors
    ]


@router.post("/appointments/request")
async def request_appointment(
    request: AppointmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request an appointment with a counselor"""
    counselor = db.query(User).filter(
        User.id == request.counselor_id,
        User.is_counselor == True
    ).first()
    
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    # In production, this would create an Appointment record
    # and integrate with Google Calendar API
    
    return {
        "message": "Appointment request submitted",
        "counselor_name": counselor.full_name or counselor.username,
        "preferred_date": request.preferred_date,
        "preferred_time": request.preferred_time,
        "status": "pending"
    }


@router.get("/support-tiers")
async def get_support_tiers(
    current_user: User = Depends(get_current_user)
):
    """Get information about support tiers"""
    return {
        "tier_1": {
            "name": "AI Companion",
            "description": "24/7 AI-based emotional support",
            "available": True,
            "response_time": "Instant"
        },
        "tier_2": {
            "name": "Peer Mentor",
            "description": "Connect with trained peer mentors",
            "available": True,
            "response_time": "Within 24 hours"
        },
        "tier_3": {
            "name": "Professional Counselor",
            "description": "Schedule sessions with certified counselors",
            "available": True,
            "response_time": "Scheduled appointment"
        }
    }


@router.post("/escalate-to-peer")
async def escalate_to_peer_mentor(
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Escalate conversation to a peer mentor"""
    # In production, this would create a support ticket
    # and notify available peer mentors
    
    return {
        "message": "Your request has been escalated to a peer mentor",
        "status": "pending",
        "estimated_response": "Within 24 hours"
    }


@router.post("/escalate-to-counselor")
async def escalate_to_counselor(
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Escalate conversation to a professional counselor"""
    # In production, this would create an urgent support request
    # and notify available counselors
    
    return {
        "message": "Your request has been escalated to a professional counselor",
        "status": "pending",
        "estimated_response": "Within 48 hours",
        "suggestion": "Consider scheduling an appointment for faster response"
    }


class CrisisAlertRequest(BaseModel):
    student_id: str
    message: str
    timestamp: Optional[str] = None


@router.post("/alert-helpdesk")
async def alert_helpdesk(
    alert_data: CrisisAlertRequest,
    db: Session = Depends(get_db)
):
    """Alert help desk about a crisis situation"""
    try:
        # Create crisis alert record
        alert = CrisisAlert(
            user_id=int(alert_data.student_id) if alert_data.student_id.isdigit() else None,
            student_id=alert_data.student_id,
            message=alert_data.message,
            status="pending"
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        
        # In production, this would:
        # 1. Send email/SMS to help desk
        # 2. Create ticket in help desk system
        # 3. Notify on-call counselor
        # 4. Log to security audit system
        
        return {
            "success": True,
            "message": "Crisis alert has been sent to help desk",
            "alert_id": alert.id,
            "status": "pending"
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Error creating alert: {str(e)}"
        }

