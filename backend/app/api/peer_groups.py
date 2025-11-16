"""
Peer Groups API endpoints for group creation and messaging
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.peer import PeerGroup, PeerMessage

router = APIRouter()


class PeerGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None


class PeerGroupResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class PeerMessageCreate(BaseModel):
    content: str


class PeerMessageResponse(BaseModel):
    id: int
    group_id: int
    user_name: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True


@router.get("/peer-groups", response_model=List[PeerGroupResponse])
async def list_peer_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all peer support groups"""
    groups = db.query(PeerGroup).all()
    return groups


@router.post("/peer-groups", response_model=PeerGroupResponse)
async def create_peer_group(
    group: PeerGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new peer support group"""
    # Check if group name already exists
    existing = db.query(PeerGroup).filter(PeerGroup.name == group.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Group name already exists")
    
    new_group = PeerGroup(
        name=group.name,
        description=group.description
    )
    
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group


@router.get("/peer-groups/{group_id}", response_model=PeerGroupResponse)
async def get_peer_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get details of a specific peer group"""
    group = db.query(PeerGroup).filter(PeerGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group


@router.get("/peer-groups/{group_id}/messages", response_model=List[PeerMessageResponse])
async def list_group_messages(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all messages in a peer group"""
    group = db.query(PeerGroup).filter(PeerGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    messages = db.query(PeerMessage).filter(
        PeerMessage.group_id == group_id
    ).order_by(PeerMessage.timestamp.desc()).all()
    
    return messages


@router.post("/peer-groups/{group_id}/messages", response_model=PeerMessageResponse)
async def create_group_message(
    group_id: int,
    message: PeerMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new message in a peer group"""
    group = db.query(PeerGroup).filter(PeerGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    new_message = PeerMessage(
        group_id=group_id,
        user_name=current_user.username,  # Use current user's username
        content=message.content
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message