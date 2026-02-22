from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GroupCreate(BaseModel):
    """Group creation model"""
    event_id: str = Field(..., description="Ticketmaster event ID")
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    max_members: int = Field(..., ge=2, le=50)
    event_title: Optional[str] = None
    event_venue: Optional[str] = None
    event_meta: Optional[str] = None

class GroupJoin(BaseModel):
    """Join group request"""
    group_id: str

class GroupResponse(BaseModel):
    """Group response model"""
    id: str
    event_id: str
    name: str
    description: Optional[str]
    max_members: int
    current_members: int
    creator_id: str
    member_ids: List[str]
    event_title: Optional[str]
    event_venue: Optional[str]
    event_meta: Optional[str]
    created_at: str
    is_full: bool
    
    class Config:
        from_attributes = True
