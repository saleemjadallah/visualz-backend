from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class SpaceData(BaseModel):
    length: float = Field(..., gt=0, description="Room length in feet")
    width: float = Field(..., gt=0, description="Room width in feet") 
    height: float = Field(default=8.0, gt=0, description="Room height in feet")
    room_type: str = Field(default="general", description="Type of room")
    features: List[str] = Field(default=[], description="Existing architectural features")
    limitations: List[str] = Field(default=[], description="Space limitations or constraints")
    photos: List[str] = Field(default=[], description="URLs to uploaded photos")

class EventRequirements(BaseModel):
    event_type: str = Field(..., description="Type of event")
    guest_count: int = Field(..., gt=0, description="Number of expected guests")
    duration: str = Field(..., description="Event duration")
    formality: str = Field(default="casual", description="Formality level")
    budget: float = Field(..., gt=0, description="Budget in USD")
    special_requirements: List[str] = Field(default=[], description="Special requirements or needs")
    dietary_restrictions: List[str] = Field(default=[], description="Dietary restrictions")

class CulturalContext(BaseModel):
    primary_culture: str = Field(default="contemporary_western", description="Primary cultural background")
    secondary_cultures: List[str] = Field(default=[], description="Additional cultural influences")
    religious_considerations: List[str] = Field(default=[], description="Religious considerations")
    traditions_to_honor: List[str] = Field(default=[], description="Specific traditions to incorporate")

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    space_data: SpaceData
    event_requirements: EventRequirements
    cultural_context: CulturalContext
    status: str = Field(default="draft", description="Project status")

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    space_data: Optional[SpaceData] = None
    event_requirements: Optional[EventRequirements] = None
    cultural_context: Optional[CulturalContext] = None
    status: Optional[str] = None

class ProjectInDB(ProjectBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Project(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime