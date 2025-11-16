"""
Peer models: PeerGroup and PeerMessage

These models represent peer support groups and messages within those groups.
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class PeerGroup(Base):
    __tablename__ = "peer_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # one-to-many relationship to PeerMessage
    messages = relationship("PeerMessage", back_populates="group", cascade="all, delete-orphan")


class PeerMessage(Base):
    __tablename__ = "peer_messages"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("peer_groups.id"), nullable=False)
    user_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    # Use both SQL-side default and Python-side default for compatibility
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow, server_default=func.now())

    # relationship back to group
    group = relationship("PeerGroup", back_populates="messages")
