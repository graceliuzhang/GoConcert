from pydantic import BaseModel, Field
from typing import Optional

class LocationCoordinates(BaseModel):
    """Geographic coordinates"""
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Latitude (-90 to 90)")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Longitude (-180 to 180)")

class EventBase(BaseModel):
    """Base event model"""
    ticketmaster_id: str
    title: str
    venue: str
    meta: str
    url: Optional[str] = None
    image: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    genre: Optional[str] = None

class EventCreate(EventBase):
    """Event creation model"""
    event_data: Optional[dict] = None

class EventResponse(EventBase):
    """Event response model"""
    class Config:
        from_attributes = True
