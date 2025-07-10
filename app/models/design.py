from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class FurnitureItem(BaseModel):
    id: str = Field(..., description="Unique identifier for furniture item")
    name: str = Field(..., description="Name of furniture piece")
    category: str = Field(..., description="Furniture category")
    x: float = Field(..., description="X coordinate in feet")
    y: float = Field(..., description="Y coordinate in feet")
    width: float = Field(..., gt=0, description="Width in feet")
    height: float = Field(..., gt=0, description="Height in feet")
    rotation: float = Field(default=0, description="Rotation angle in degrees")
    color: Optional[str] = Field(None, description="Color or material")
    style: Optional[str] = Field(None, description="Style descriptor")

class ColorPalette(BaseModel):
    primary: str = Field(..., description="Primary color hex code")
    secondary: str = Field(..., description="Secondary color hex code")
    accent: str = Field(..., description="Accent color hex code")
    neutral: str = Field(..., description="Neutral color hex code")
    description: Optional[str] = Field(None, description="Color palette description")

class MaterialRecommendation(BaseModel):
    category: str = Field(..., description="Material category")
    material: str = Field(..., description="Specific material")
    color: Optional[str] = Field(None, description="Material color")
    texture: Optional[str] = Field(None, description="Material texture")
    usage: str = Field(..., description="Recommended usage")
    cultural_significance: Optional[str] = Field(None, description="Cultural meaning if any")

class LightingPlan(BaseModel):
    ambient_lighting: str = Field(..., description="Ambient lighting description")
    task_lighting: List[str] = Field(default=[], description="Task lighting requirements")
    accent_lighting: List[str] = Field(default=[], description="Accent lighting features")
    color_temperature: str = Field(default="2700K", description="Recommended color temperature")

class BudgetBreakdown(BaseModel):
    furniture: float = Field(..., ge=0, description="Furniture budget percentage")
    decor: float = Field(..., ge=0, description="Decor budget percentage")
    lighting: float = Field(..., ge=0, description="Lighting budget percentage")
    cultural_elements: float = Field(..., ge=0, description="Cultural elements budget percentage")
    miscellaneous: float = Field(..., ge=0, description="Miscellaneous budget percentage")
    priority_items: List[str] = Field(default=[], description="High priority purchase items")
    optional_items: List[str] = Field(default=[], description="Optional purchase items")

class CulturalValidation(BaseModel):
    sensitivity_score: int = Field(..., ge=1, le=10, description="Cultural sensitivity score")
    validation_notes: List[str] = Field(default=[], description="Validation feedback")
    recommendations: List[str] = Field(default=[], description="Improvement recommendations")
    approved_elements: List[str] = Field(default=[], description="Culturally approved elements")
    flagged_elements: List[str] = Field(default=[], description="Elements needing review")

class DesignBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    furniture_items: List[FurnitureItem] = Field(default=[], description="Placed furniture items")
    color_palette: ColorPalette
    material_recommendations: List[MaterialRecommendation] = Field(default=[])
    lighting_plan: LightingPlan
    budget_breakdown: BudgetBreakdown
    cultural_validation: Optional[CulturalValidation] = None
    ai_generated: bool = Field(default=False, description="Whether design was AI generated")
    design_notes: List[str] = Field(default=[], description="Design notes and comments")

class DesignCreate(DesignBase):
    project_id: str = Field(..., description="Associated project ID")

class DesignUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    furniture_items: Optional[List[FurnitureItem]] = None
    color_palette: Optional[ColorPalette] = None
    material_recommendations: Optional[List[MaterialRecommendation]] = None
    lighting_plan: Optional[LightingPlan] = None
    budget_breakdown: Optional[BudgetBreakdown] = None
    cultural_validation: Optional[CulturalValidation] = None
    design_notes: Optional[List[str]] = None

class DesignInDB(DesignBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    project_id: PyObjectId
    user_id: PyObjectId
    version: int = Field(default=1, description="Design version number")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Design(DesignBase):
    id: str
    project_id: str
    user_id: str
    version: int
    created_at: datetime
    updated_at: datetime

class AIDesignRequest(BaseModel):
    project_id: str = Field(..., description="Project ID to generate design for")
    style_preferences: List[str] = Field(default=[], description="Style preferences")
    priority_elements: List[str] = Field(default=[], description="Elements to prioritize")
    avoid_elements: List[str] = Field(default=[], description="Elements to avoid")