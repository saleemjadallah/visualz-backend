"""
Cultural API Endpoints
Provides RESTful access to cultural database and validation services
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
import logging

from app.services.cultural_service import cultural_service
from app.api.auth import get_current_user_optional
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

# Request/Response Models
class CulturalValidationRequest(BaseModel):
    philosophyId: str
    eventType: str
    elements: List[str]
    guestCount: int = Field(default=0, ge=0)

class CulturalRecommendationRequest(BaseModel):
    philosophyId: str
    eventType: str
    budgetRange: str
    guestCount: int
    season: str = "spring"

class FusionCompatibilityRequest(BaseModel):
    primaryPhilosophy: str
    secondaryPhilosophy: str

class VendorSearchRequest(BaseModel):
    philosophyId: str
    location: Optional[Dict[str, float]] = None
    maxDistanceKm: float = 100.0

@router.get("/philosophies", summary="Get all cultural design philosophies")
async def get_philosophies(
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Retrieve all available cultural design philosophies
    """
    try:
        philosophies = await cultural_service.get_all_philosophies()
        
        # Convert ObjectIds to strings for JSON serialization
        for philosophy in philosophies:
            philosophy["_id"] = str(philosophy["_id"])
        
        return {
            "success": True,
            "philosophies": philosophies,
            "count": len(philosophies)
        }
    except Exception as e:
        logger.error(f"Error fetching philosophies: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/philosophies/{philosophy_id}", summary="Get specific philosophy details")
async def get_philosophy(
    philosophy_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Get detailed information about a specific cultural philosophy
    """
    try:
        philosophy = await cultural_service.get_philosophy(philosophy_id)
        
        if not philosophy:
            raise HTTPException(status_code=404, detail="Philosophy not found")
        
        # Convert ObjectId to string
        philosophy["_id"] = str(philosophy["_id"])
        
        return {
            "success": True,
            "philosophy": philosophy
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching philosophy {philosophy_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/philosophies/{philosophy_id}/elements", summary="Get design elements for philosophy")
async def get_design_elements(
    philosophy_id: str,
    element_type: Optional[str] = Query(None, description="Filter by element type"),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Get design elements (colors, materials, patterns) for a specific philosophy
    """
    try:
        elements = await cultural_service.get_design_elements(philosophy_id, element_type)
        
        # Convert ObjectIds to strings
        for element in elements:
            element["_id"] = str(element["_id"])
        
        return {
            "success": True,
            "elements": elements,
            "count": len(elements),
            "philosophyId": philosophy_id,
            "elementType": element_type
        }
    except Exception as e:
        logger.error(f"Error fetching design elements: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate", summary="Validate cultural sensitivity")
async def validate_cultural_sensitivity(
    request: CulturalValidationRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Validate design choices for cultural sensitivity and appropriateness
    """
    try:
        validation_result = await cultural_service.validate_cultural_sensitivity(
            philosophy_id=request.philosophyId,
            event_type=request.eventType,
            elements=request.elements,
            guest_count=request.guestCount
        )
        
        # Log validation for monitoring
        await cultural_service.log_cultural_usage(
            philosophy_id=request.philosophyId,
            event_type=request.eventType,
            elements_used=request.elements,
            user_id=current_user.id if current_user else None,
            success=validation_result.get("valid", False)
        )
        
        return {
            "success": True,
            "validation": validation_result
        }
    except Exception as e:
        logger.error(f"Error validating cultural sensitivity: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations", summary="Get cultural design recommendations")
async def get_cultural_recommendations(
    request: CulturalRecommendationRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Get AI-powered cultural design recommendations for events
    """
    try:
        recommendations = await cultural_service.get_cultural_recommendations(
            philosophy_id=request.philosophyId,
            event_type=request.eventType,
            budget_range=request.budgetRange,
            guest_count=request.guestCount,
            season=request.season
        )
        
        # Log recommendation request
        await cultural_service.log_cultural_usage(
            philosophy_id=request.philosophyId,
            event_type=request.eventType,
            elements_used=["recommendations_requested"],
            user_id=current_user.id if current_user else None,
            success=True
        )
        
        return {
            "success": True,
            "recommendations": recommendations,
            "generatedAt": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fusion/compatibility", summary="Check fusion compatibility")
async def check_fusion_compatibility(
    request: FusionCompatibilityRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Check compatibility between two cultural philosophies for fusion events
    """
    try:
        compatibility = await cultural_service.check_fusion_compatibility(
            primary_philosophy=request.primaryPhilosophy,
            secondary_philosophy=request.secondaryPhilosophy
        )
        
        return {
            "success": True,
            "compatibility": compatibility,
            "primaryPhilosophy": request.primaryPhilosophy,
            "secondaryPhilosophy": request.secondaryPhilosophy
        }
    except Exception as e:
        logger.error(f"Error checking fusion compatibility: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/vendors", summary="Find cultural vendors")
async def get_cultural_vendors(
    request: VendorSearchRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Find verified vendors for cultural design elements
    """
    try:
        vendors = await cultural_service.get_cultural_vendors(
            philosophy_id=request.philosophyId,
            location=request.location,
            max_distance_km=request.maxDistanceKm
        )
        
        # Convert ObjectIds to strings
        for vendor in vendors:
            vendor["_id"] = str(vendor["_id"])
        
        return {
            "success": True,
            "vendors": vendors,
            "count": len(vendors),
            "philosophyId": request.philosophyId
        }
    except Exception as e:
        logger.error(f"Error fetching vendors: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/experts/{philosophy_id}", summary="Get cultural expert")
async def get_cultural_expert(
    philosophy_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Get cultural expert contact information for consultation
    """
    try:
        expert = await cultural_service.get_cultural_expert(philosophy_id)
        
        if not expert:
            return {
                "success": True,
                "expert": None,
                "message": "No expert found for this philosophy"
            }
        
        # Convert ObjectId to string
        expert["_id"] = str(expert["_id"])
        
        # Remove sensitive contact info for non-authenticated users
        if not current_user:
            expert.pop("contactInfo", None)
            expert["contactAvailable"] = True
            expert["authenticationRequired"] = True
        
        return {
            "success": True,
            "expert": expert
        }
    except Exception as e:
        logger.error(f"Error fetching expert: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/seasonal/{philosophy_id}", summary="Get seasonal recommendations")
async def get_seasonal_recommendations(
    philosophy_id: str,
    season: str = Query("spring", description="Season (spring, summer, autumn, winter)"),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Get season-specific cultural design recommendations
    """
    try:
        if season not in ["spring", "summer", "autumn", "winter"]:
            raise HTTPException(status_code=400, detail="Invalid season")
        
        seasonal_recs = await cultural_service.get_seasonal_recommendations(
            philosophy_id=philosophy_id,
            current_season=season
        )
        
        return {
            "success": True,
            "recommendations": seasonal_recs,
            "philosophyId": philosophy_id,
            "season": season
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching seasonal recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", summary="Cultural service health check")
async def health_check() -> Dict[str, Any]:
    """
    Check the health of the cultural service and database
    """
    try:
        # Test database connection
        success = await cultural_service.initialize()
        
        if success:
            philosophies = await cultural_service.get_all_philosophies()
            return {
                "success": True,
                "status": "healthy",
                "database": "connected",
                "philosophyCount": len(philosophies),
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": True,
                "status": "degraded",
                "database": "fallback_mode",
                "message": "Cultural database unavailable, using fallback data",
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        logger.error(f"Cultural service health check failed: {e}")
        return {
            "success": True,
            "status": "degraded",
            "database": "unavailable",
            "message": "Cultural service operating in fallback mode",
            "timestamp": datetime.now().isoformat()
        }

# AI Integration Endpoints

@router.post("/ai/cultural-analysis", summary="AI cultural analysis for parametric generation")
async def ai_cultural_analysis(
    analysis_request: Dict[str, Any],
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Provide cultural analysis for AI parametric generation system
    """
    try:
        philosophy_id = analysis_request.get("philosophy")
        event_type = analysis_request.get("eventType")
        budget_range = analysis_request.get("budgetRange", "medium")
        guest_count = analysis_request.get("guestCount", 50)
        
        if not philosophy_id or not event_type:
            raise HTTPException(status_code=400, detail="philosophy and eventType required")
        
        # Get comprehensive analysis
        philosophy = await cultural_service.get_philosophy(philosophy_id)
        recommendations = await cultural_service.get_cultural_recommendations(
            philosophy_id=philosophy_id,
            event_type=event_type,
            budget_range=budget_range,
            guest_count=guest_count,
            season=analysis_request.get("season", "spring")
        )
        
        # Validate basic elements
        basic_elements = analysis_request.get("elements", [])
        validation = await cultural_service.validate_cultural_sensitivity(
            philosophy_id=philosophy_id,
            event_type=event_type,
            elements=basic_elements,
            guest_count=guest_count
        )
        
        # Compile AI-friendly response
        ai_analysis = {
            "culturalScore": 85.0,  # Base score
            "philosophy": {
                "id": philosophy_id,
                "name": philosophy.get("name", {}).get("en", ""),
                "coreValues": philosophy.get("coreValues", []),
                "sensitivityLevel": philosophy.get("culturalSensitivity", {}).get("level", "medium")
            },
            "recommendations": recommendations,
            "validation": validation,
            "aiGuidance": {
                "colorPalette": recommendations.get("colorPalette", [])[:3],  # Top 3 colors
                "materials": recommendations.get("materials", [])[:3],  # Top 3 materials
                "spatialGuidance": recommendations.get("spatialGuidance", {}),
                "culturalElements": philosophy.get("coreValues", [])[:5]  # Top 5 values
            }
        }
        
        # Adjust cultural score based on validation
        if validation.get("consultationRequired"):
            ai_analysis["culturalScore"] -= 10
        if validation.get("warnings"):
            ai_analysis["culturalScore"] -= len(validation.get("warnings", [])) * 2
        
        ai_analysis["culturalScore"] = max(50.0, min(100.0, ai_analysis["culturalScore"]))
        
        return {
            "success": True,
            "analysis": ai_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in AI cultural analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai/cultural-elements/{philosophy_id}", summary="Get AI-optimized cultural elements")
async def get_ai_cultural_elements(
    philosophy_id: str,
    event_type: str = Query(..., description="Event type for context"),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Get cultural elements optimized for AI parametric generation
    """
    try:
        # Get all elements for the philosophy
        elements = await cultural_service.get_design_elements(philosophy_id)
        philosophy = await cultural_service.get_philosophy(philosophy_id)
        
        if not philosophy:
            raise HTTPException(status_code=404, detail="Philosophy not found")
        
        # Structure for AI consumption
        ai_elements = {
            "philosophy": {
                "id": philosophy_id,
                "name": philosophy.get("name", {}),
                "coreValues": philosophy.get("coreValues", [])
            },
            "colorPalettes": [],
            "materials": [],
            "patterns": [],
            "spatialPrinciples": philosophy.get("spatialPrinciples", []),
            "culturalConstraints": {
                "sacredElements": philosophy.get("culturalSensitivity", {}).get("sacredElements", []),
                "consultationRequired": philosophy.get("culturalSensitivity", {}).get("consultationRequired", False),
                "sensitivityLevel": philosophy.get("culturalSensitivity", {}).get("level", "medium")
            }
        }
        
        # Process elements into AI-friendly format
        for element in elements:
            element_type = element.get("elementType")
            
            if element_type == "colorPalette":
                colors = element.get("colors", [])
                for color in colors:
                    ai_elements["colorPalettes"].append({
                        "name": color.get("name"),
                        "hex": color.get("hex"),
                        "rgb": color.get("rgb"),
                        "meaning": color.get("culturalMeaning"),
                        "usage": color.get("usage", []),
                        "seasonality": color.get("seasonality", [])
                    })
            
            elif element_type == "materials":
                materials = element.get("materials", [])
                for material in materials:
                    ai_elements["materials"].append({
                        "name": material.get("name"),
                        "types": material.get("types", []),
                        "properties": material.get("properties", {}),
                        "culturalSignificance": material.get("culturalSignificance", ""),
                        "sustainability": material.get("properties", {}).get("sustainabilityRating", 0)
                    })
        
        return {
            "success": True,
            "elements": ai_elements,
            "philosophyId": philosophy_id,
            "eventType": event_type
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching AI cultural elements: {e}")
        raise HTTPException(status_code=500, detail=str(e))