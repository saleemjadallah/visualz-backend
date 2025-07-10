from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class CulturalElementBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Name of the cultural element")
    culture: str = Field(..., min_length=1, max_length=100, description="Primary culture (e.g., Japanese, Mexican, Scottish)")
    category: str = Field(..., description="Element category (color, pattern, object, spatial, ritual)")
    description: str = Field(..., max_length=1000, description="Detailed description of the element")
    significance: str = Field(..., max_length=1000, description="Cultural and historical significance")
    
    # Usage Guidelines
    appropriate_contexts: List[str] = Field(default=[], description="Contexts where element is appropriate")
    inappropriate_contexts: List[str] = Field(default=[], description="Contexts to avoid")
    usage_guidelines: List[str] = Field(default=[], description="Specific usage recommendations")
    
    # Cultural Sensitivity
    sacred_level: str = Field(default="low", description="Sacred/sensitivity level: low, medium, high, sacred")
    community_permission_required: bool = Field(default=False, description="Requires community elder approval")
    modern_adaptations_allowed: bool = Field(default=True, description="Can be modernized/stylized")
    
    # Design Properties
    colors: List[str] = Field(default=[], description="Associated hex color codes")
    materials: List[str] = Field(default=[], description="Traditional materials")
    patterns: List[str] = Field(default=[], description="Associated pattern descriptions")
    seasonal_usage: Optional[str] = Field(None, description="Seasonal restrictions if any")
    
    # Metadata
    sources: List[str] = Field(default=[], description="Research sources and references")
    verified_by: Optional[str] = Field(None, description="Cultural expert who verified this entry")
    regional_variations: List[Dict[str, str]] = Field(default=[], description="Regional differences")
    
    # Status
    is_verified: bool = Field(default=False, description="Whether verified by cultural expert")
    needs_review: bool = Field(default=True, description="Needs cultural expert review")
    disclaimer_required: bool = Field(default=True, description="Requires cultural sensitivity disclaimer")

class CulturalElementCreate(CulturalElementBase):
    pass

class CulturalElementUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    culture: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = None
    description: Optional[str] = Field(None, max_length=1000)
    significance: Optional[str] = Field(None, max_length=1000)
    appropriate_contexts: Optional[List[str]] = None
    inappropriate_contexts: Optional[List[str]] = None
    usage_guidelines: Optional[List[str]] = None
    sacred_level: Optional[str] = None
    community_permission_required: Optional[bool] = None
    modern_adaptations_allowed: Optional[bool] = None
    colors: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    patterns: Optional[List[str]] = None
    seasonal_usage: Optional[str] = None
    sources: Optional[List[str]] = None
    verified_by: Optional[str] = None
    regional_variations: Optional[List[Dict[str, str]]] = None
    is_verified: Optional[bool] = None
    needs_review: Optional[bool] = None

class CulturalElementInDB(CulturalElementBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[PyObjectId] = Field(None, description="User who created this entry")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CulturalElement(CulturalElementBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None

class CulturalValidationRequest(BaseModel):
    design_elements: List[str] = Field(..., description="Design elements to validate")
    primary_culture: str = Field(..., description="Primary cultural context")
    secondary_cultures: List[str] = Field(default=[], description="Secondary cultural contexts")
    event_type: str = Field(..., description="Type of event")
    religious_considerations: List[str] = Field(default=[], description="Religious factors")

class CulturalValidationResult(BaseModel):
    sensitivity_score: int = Field(..., ge=1, le=10, description="Cultural sensitivity score (1-10)")
    overall_status: str = Field(..., description="approved, needs_review, or rejected")
    validated_elements: List[Dict[str, Any]] = Field(default=[], description="Elements that passed validation")
    flagged_elements: List[Dict[str, Any]] = Field(default=[], description="Elements requiring attention")
    recommendations: List[str] = Field(default=[], description="Improvement suggestions")
    alternative_suggestions: List[Dict[str, Any]] = Field(default=[], description="Alternative culturally appropriate elements")
    consultation_required: List[str] = Field(default=[], description="Elements requiring expert consultation")
    disclaimer_text: Optional[str] = Field(None, description="Required disclaimer text")

class CulturalGuideline(BaseModel):
    culture: str = Field(..., description="Culture name")
    category: str = Field(..., description="Guideline category")
    title: str = Field(..., description="Guideline title")
    description: str = Field(..., description="Detailed guideline description")
    do_list: List[str] = Field(default=[], description="Recommended practices")
    dont_list: List[str] = Field(default=[], description="Practices to avoid")
    examples: List[Dict[str, str]] = Field(default=[], description="Good and bad examples")
    severity: str = Field(default="medium", description="Guideline importance: low, medium, high, critical")

class CulturalFusionRule(BaseModel):
    culture_a: str = Field(..., description="First culture")
    culture_b: str = Field(..., description="Second culture")
    compatibility_score: int = Field(..., ge=1, le=10, description="How well cultures can be fused")
    fusion_guidelines: List[str] = Field(default=[], description="Guidelines for combining elements")
    complementary_elements: List[str] = Field(default=[], description="Elements that work well together")
    conflicting_elements: List[str] = Field(default=[], description="Elements that should not be combined")
    successful_examples: List[str] = Field(default=[], description="Examples of successful fusion")
    consultation_recommended: bool = Field(default=True, description="Whether expert consultation is recommended")