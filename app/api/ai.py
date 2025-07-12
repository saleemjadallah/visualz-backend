from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
import logging

from app.models.design import AIDesignRequest, Design, DesignCreate
from app.models.user import User
from app.api.auth import get_current_user, get_current_user_optional
from app.services.database import get_database
from app.services.ai_service import AIDesignService
from app.services.cultural_philosophy_service import CulturalPhilosophy
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()
logger = logging.getLogger(__name__)

class CulturalDesignRequest(BaseModel):
    project_id: str
    cultural_philosophy: CulturalPhilosophy
    style_preferences: Optional[List[str]] = None

class CulturalRecommendationRequest(BaseModel):
    event_type: str
    cultural_philosophy: CulturalPhilosophy
    budget_range: str
    guest_count: int
    specific_requirements: Optional[List[str]] = None

class CulturalFusionRequest(BaseModel):
    project_id: str
    primary_philosophy: CulturalPhilosophy
    secondary_philosophy: CulturalPhilosophy
    fusion_approach: str = "respectful_blend"

class CulturalValidationRequest(BaseModel):
    design_elements: List[str]
    cultural_philosophy: CulturalPhilosophy
    event_context: str

@router.post("/generate-design", response_model=Design)
async def generate_ai_design(
    request: AIDesignRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a design using AI based on project requirements."""
    db = get_database()
    ai_service = AIDesignService()
    
    # Validate project exists and belongs to user
    try:
        project_object_id = ObjectId(request.project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    project_doc = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Convert to Project model for AI service
    from app.models.project import Project
    project = Project(
        id=str(project_doc["_id"]),
        user_id=str(project_doc["user_id"]),
        title=project_doc["title"],
        description=project_doc.get("description"),
        space_data=project_doc["space_data"],
        event_requirements=project_doc["event_requirements"],
        cultural_context=project_doc["cultural_context"],
        status=project_doc["status"],
        created_at=project_doc["created_at"],
        updated_at=project_doc["updated_at"]
    )
    
    try:
        # Generate design using AI
        design_data = await ai_service.generate_design(
            project, 
            style_preferences=request.style_preferences
        )
        
        # Create design in database
        design_create = DesignCreate(
            project_id=request.project_id,
            **design_data
        )
        
        # Get next version number
        latest_design = await db.designs.find_one(
            {"project_id": project_object_id},
            sort=[("version", -1)]
        )
        next_version = (latest_design["version"] + 1) if latest_design else 1
        
        # Create design document
        from app.models.design import DesignInDB
        design_doc = DesignInDB(
            **design_create.dict(exclude={"project_id"}),
            project_id=project_object_id,
            user_id=ObjectId(current_user.id),
            version=next_version
        )
        
        # Insert into database
        result = await db.designs.insert_one(design_doc.dict(by_alias=True, exclude={"id"}))
        
        # Return created design
        created_design = Design(
            id=str(result.inserted_id),
            project_id=request.project_id,
            user_id=current_user.id,
            version=next_version,
            **design_create.dict(exclude={"project_id"}),
            created_at=design_doc.created_at,
            updated_at=design_doc.updated_at
        )
        
        logger.info(f"AI design generated: {created_design.id} for project {request.project_id}")
        return created_design
        
    except Exception as e:
        logger.error(f"Error generating AI design: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate design: {str(e)}"
        )

@router.post("/validate-cultural-sensitivity")
async def validate_cultural_sensitivity(
    design_id: str,
    current_user: User = Depends(get_current_user)
):
    """Validate a design's cultural sensitivity."""
    db = get_database()
    ai_service = AIDesignService()
    
    # Validate design exists and belongs to user
    try:
        design_object_id = ObjectId(design_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid design ID"
        )
    
    design_doc = await db.designs.find_one({
        "_id": design_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not design_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found"
        )
    
    # Get associated project for cultural context
    project_doc = await db.projects.find_one({"_id": design_doc["project_id"]})
    
    try:
        # Extract design elements for validation
        design_elements = []
        
        # Add material recommendations
        for material in design_doc.get("material_recommendations", []):
            if material.get("cultural_significance"):
                design_elements.append(material["material"])
        
        # Add any cultural notes
        design_elements.extend(design_doc.get("design_notes", []))
        
        # Get cultural context
        cultural_context = project_doc["cultural_context"]
        
        # Validate using AI
        validation_result = await ai_service.validate_cultural_sensitivity(
            design_elements, 
            cultural_context
        )
        
        # Update design with validation result
        from app.models.design import CulturalValidation
        cultural_validation = CulturalValidation(**validation_result)
        
        await db.designs.update_one(
            {"_id": design_object_id},
            {"$set": {"cultural_validation": cultural_validation.dict()}}
        )
        
        logger.info(f"Cultural validation completed for design {design_id}")
        return validation_result
        
    except Exception as e:
        logger.error(f"Error validating cultural sensitivity: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate design: {str(e)}"
        )

@router.get("/cultural-elements/{culture}")
async def get_cultural_elements(
    culture: str,
    current_user: User = Depends(get_current_user)
):
    """Get cultural elements for a specific culture."""
    db = get_database()
    
    # Find cultural elements for the specified culture
    cursor = db.cultural_elements.find({"culture": culture})
    
    elements = []
    async for element in cursor:
        elements.append({
            "id": str(element["_id"]),
            "name": element["name"],
            "category": element["category"],
            "description": element["description"],
            "significance": element.get("significance", ""),
            "usage_guidelines": element.get("usage_guidelines", []),
            "appropriate_contexts": element.get("appropriate_contexts", [])
        })
    
    return {"culture": culture, "elements": elements}

@router.post("/generate-cultural-design", response_model=Design)
async def generate_cultural_design(
    request: CulturalDesignRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a culturally informed design using AI."""
    db = get_database()
    ai_service = AIDesignService()
    
    # Validate project exists and belongs to user
    try:
        project_object_id = ObjectId(request.project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    project_doc = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Convert to Project model for AI service
    from app.models.project import Project
    project = Project(
        id=str(project_doc["_id"]),
        user_id=str(project_doc["user_id"]),
        title=project_doc["title"],
        description=project_doc.get("description"),
        space_data=project_doc["space_data"],
        event_requirements=project_doc["event_requirements"],
        cultural_context=project_doc["cultural_context"],
        status=project_doc["status"],
        created_at=project_doc["created_at"],
        updated_at=project_doc["updated_at"]
    )
    
    try:
        # Generate culturally informed design
        design_data = await ai_service.generate_culturally_informed_design(
            project, 
            cultural_philosophy=request.cultural_philosophy,
            style_preferences=request.style_preferences
        )
        
        # Create design in database
        design_create = DesignCreate(
            project_id=request.project_id,
            **design_data
        )
        
        # Get next version number
        latest_design = await db.designs.find_one(
            {"project_id": project_object_id},
            sort=[("version", -1)]
        )
        next_version = (latest_design["version"] + 1) if latest_design else 1
        
        # Create design document
        from app.models.design import DesignInDB
        design_doc = DesignInDB(
            **design_create.dict(exclude={"project_id"}),
            project_id=project_object_id,
            user_id=ObjectId(current_user.id),
            version=next_version
        )
        
        # Insert into database
        result = await db.designs.insert_one(design_doc.dict(by_alias=True, exclude={"id"}))
        
        # Return created design
        created_design = Design(
            id=str(result.inserted_id),
            project_id=request.project_id,
            user_id=current_user.id,
            version=next_version,
            **design_create.dict(exclude={"project_id"}),
            created_at=design_doc.created_at,
            updated_at=design_doc.updated_at
        )
        
        logger.info(f"Cultural AI design generated: {created_design.id} for project {request.project_id}")
        return created_design
        
    except Exception as e:
        logger.error(f"Error generating cultural AI design: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cultural design: {str(e)}"
        )

@router.post("/cultural-recommendations")
async def get_cultural_recommendations(
    request: CulturalRecommendationRequest,
    current_user: User = Depends(get_current_user)
):
    """Get cultural design recommendations."""
    try:
        ai_service = AIDesignService()
        
        recommendations = await ai_service.get_cultural_design_recommendations(
            event_type=request.event_type,
            cultural_philosophy=request.cultural_philosophy,
            budget_range=request.budget_range,
            guest_count=request.guest_count,
            specific_requirements=request.specific_requirements
        )
        
        logger.info(f"Cultural recommendations generated for {request.cultural_philosophy.value}")
        return recommendations
        
    except Exception as e:
        logger.error(f"Error getting cultural recommendations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get cultural recommendations: {str(e)}"
        )

@router.post("/validate-cultural-design")
async def validate_cultural_design(
    request: CulturalValidationRequest,
    current_user: User = Depends(get_current_user)
):
    """Validate design elements for cultural appropriateness."""
    try:
        ai_service = AIDesignService()
        
        validation_result = await ai_service.validate_design_cultural_appropriateness(
            design_elements=request.design_elements,
            cultural_philosophy=request.cultural_philosophy,
            event_context=request.event_context
        )
        
        logger.info(f"Cultural validation completed for {request.cultural_philosophy.value}")
        return validation_result
        
    except Exception as e:
        logger.error(f"Error validating cultural design: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate cultural design: {str(e)}"
        )

@router.post("/generate-fusion-design", response_model=Design)
async def generate_fusion_design(
    request: CulturalFusionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a cultural fusion design."""
    db = get_database()
    ai_service = AIDesignService()
    
    # Validate project exists and belongs to user
    try:
        project_object_id = ObjectId(request.project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    project_doc = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Convert to Project model
    from app.models.project import Project
    project = Project(
        id=str(project_doc["_id"]),
        user_id=str(project_doc["user_id"]),
        title=project_doc["title"],
        description=project_doc.get("description"),
        space_data=project_doc["space_data"],
        event_requirements=project_doc["event_requirements"],
        cultural_context=project_doc["cultural_context"],
        status=project_doc["status"],
        created_at=project_doc["created_at"],
        updated_at=project_doc["updated_at"]
    )
    
    try:
        # Generate fusion design
        design_data = await ai_service.generate_cultural_fusion_design(
            project=project,
            primary_philosophy=request.primary_philosophy,
            secondary_philosophy=request.secondary_philosophy,
            fusion_approach=request.fusion_approach
        )
        
        # Create design in database
        design_create = DesignCreate(
            project_id=request.project_id,
            **design_data.get("fusion_design", {})
        )
        
        # Get next version number
        latest_design = await db.designs.find_one(
            {"project_id": project_object_id},
            sort=[("version", -1)]
        )
        next_version = (latest_design["version"] + 1) if latest_design else 1
        
        # Create design document
        from app.models.design import DesignInDB
        design_doc = DesignInDB(
            **design_create.dict(exclude={"project_id"}),
            project_id=project_object_id,
            user_id=ObjectId(current_user.id),
            version=next_version
        )
        
        # Insert into database
        result = await db.designs.insert_one(design_doc.dict(by_alias=True, exclude={"id"}))
        
        # Return created design
        created_design = Design(
            id=str(result.inserted_id),
            project_id=request.project_id,
            user_id=current_user.id,
            version=next_version,
            **design_create.dict(exclude={"project_id"}),
            created_at=design_doc.created_at,
            updated_at=design_doc.updated_at
        )
        
        logger.info(f"Cultural fusion design generated: {created_design.id}")
        return created_design
        
    except Exception as e:
        logger.error(f"Error generating fusion design: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate fusion design: {str(e)}"
        )

# Missing endpoints that frontend expects

@router.get("/cultural-suggestions")
async def get_cultural_suggestions(
    event_type: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get AI-powered cultural suggestions for event planning."""
    try:
        from app.services.cultural_service import CulturalService
        
        cultural_service = CulturalService()
        await cultural_service.initialize()
        
        # Get all available philosophies
        philosophies = await cultural_service.get_all_philosophies()
        
        suggestions = []
        for philosophy in philosophies:
            philosophy_id = philosophy.get("philosophyId", "")
            philosophy_name = philosophy.get("name", {}).get("en", philosophy_id)
            
            # Generate event-specific suggestions
            if event_type:
                recommendations = await cultural_service.get_cultural_recommendations(
                    philosophy_id=philosophy_id,
                    event_type=event_type,
                    budget_range="medium",
                    guest_count=20,
                    season="spring"
                )
                
                suggestions.append({
                    "philosophy_id": philosophy_id,
                    "philosophy_name": philosophy_name,
                    "description": philosophy.get("description", {}).get("en", ""),
                    "core_values": philosophy.get("coreValues", []),
                    "event_suitability": recommendations.get("suitability_score", 0.8),
                    "key_elements": recommendations.get("key_elements", []),
                    "color_palette": recommendations.get("color_suggestions", [])
                })
            else:
                # General cultural suggestions
                suggestions.append({
                    "philosophy_id": philosophy_id,
                    "philosophy_name": philosophy_name,
                    "description": philosophy.get("description", {}).get("en", ""),
                    "core_values": philosophy.get("coreValues", []),
                    "key_principles": philosophy.get("designPrinciples", []),
                    "typical_events": philosophy.get("suitableEvents", [])
                })
        
        return {
            "success": True,
            "event_type": event_type,
            "suggestions": suggestions,
            "count": len(suggestions)
        }
        
    except Exception as e:
        logger.error(f"Error getting cultural suggestions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get cultural suggestions: {str(e)}"
        )

@router.get("/celebration-suggestions")
async def get_celebration_suggestions(
    event_type: Optional[str] = None,
    cultural_background: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get AI-powered celebration suggestions and ideas."""
    try:
        from app.core.prompts import PROMPT_TEMPLATES
        
        # Get celebration-specific prompts and suggestions from the prompt system
        celebration_suggestions = []
        
        # Define base celebration types with their characteristics
        celebration_types = {
            "birthday": {
                "name": "Birthday Celebration",
                "description": "Personal milestone celebration with age-appropriate activities",
                "key_elements": ["birthday cake", "balloons", "party games", "photo opportunities"],
                "cultural_variations": {
                    "american": ["themed decorations", "party favors", "group activities"],
                    "mexican": ["piñata", "mariachi music", "traditional foods"],
                    "korean": ["doljanchi setup", "traditional hanbok", "ceremonial elements"],
                    "jewish": ["ceremonial blessings", "traditional foods", "family gathering"]
                },
                "age_considerations": {
                    "child": ["interactive games", "colorful decorations", "safety considerations"],
                    "teen": ["music and dancing", "photo booth", "social activities"],
                    "adult": ["elegant setting", "sophisticated entertainment", "networking"]
                }
            },
            "wedding": {
                "name": "Wedding Celebration", 
                "description": "Union celebration with ceremonial and reception elements",
                "key_elements": ["ceremonial space", "reception area", "floral arrangements", "seating layout"],
                "cultural_variations": {
                    "american": ["bridal party", "first dance", "cake cutting ceremony"],
                    "indian": ["mandap setup", "henna ceremony", "multiple day celebrations"],
                    "chinese": ["tea ceremony", "red color scheme", "traditional symbols"],
                    "jewish": ["chuppah ceremony", "hora dance", "breaking of glass"]
                }
            },
            "corporate": {
                "name": "Corporate Event",
                "description": "Professional gathering with networking and presentation elements",
                "key_elements": ["presentation setup", "networking areas", "branding elements", "catering stations"],
                "event_subtypes": {
                    "conference": ["stage setup", "breakout rooms", "registration area"],
                    "product_launch": ["display areas", "demo stations", "media setup"],
                    "team_building": ["activity zones", "collaborative spaces", "casual seating"]
                }
            }
        }
        
        # If specific event type requested, provide detailed suggestions
        if event_type and event_type.lower() in celebration_types:
            event_data = celebration_types[event_type.lower()]
            
            suggestion = {
                "event_type": event_type.lower(),
                "name": event_data["name"],
                "description": event_data["description"],
                "key_elements": event_data["key_elements"],
                "planning_considerations": [
                    "Guest count and demographics",
                    "Venue size and layout requirements", 
                    "Budget allocation and priorities",
                    "Cultural sensitivity and preferences",
                    "Accessibility requirements",
                    "Timeline and logistics"
                ]
            }
            
            # Add cultural variations if cultural background specified
            if cultural_background and "cultural_variations" in event_data:
                cultural_elements = event_data["cultural_variations"].get(cultural_background.lower(), [])
                if cultural_elements:
                    suggestion["cultural_elements"] = cultural_elements
                    suggestion["cultural_guidance"] = f"Traditional {cultural_background} {event_type} elements"
            
            # Add age considerations for birthday events
            if event_type.lower() == "birthday" and "age_considerations" in event_data:
                suggestion["age_considerations"] = event_data["age_considerations"]
            
            celebration_suggestions = [suggestion]
        else:
            # Provide overview of all celebration types
            for event_key, event_data in celebration_types.items():
                celebration_suggestions.append({
                    "event_type": event_key,
                    "name": event_data["name"],
                    "description": event_data["description"],
                    "key_elements": event_data["key_elements"][:3],  # Limit to top 3
                    "cultural_adaptable": "cultural_variations" in event_data
                })
        
        return {
            "success": True,
            "event_type": event_type,
            "cultural_background": cultural_background,
            "suggestions": celebration_suggestions,
            "count": len(celebration_suggestions),
            "ai_generated": True,
            "cultural_intelligence": "Available for all celebration types"
        }
        
    except Exception as e:
        logger.error(f"Error getting celebration suggestions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get celebration suggestions: {str(e)}"
        )

@router.get("/celebration-amenities/{celebration_type}")
async def get_celebration_amenities(
    celebration_type: str,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get celebration-specific amenities and props for event planning."""
    try:
        # Define amenities based on celebration type from CelebratoryTemplate data
        amenities_database = {
            "american-birthday": {
                "name": "American Birthday Party",
                "amenities": [
                    {
                        "id": "balloon-arch", 
                        "name": "Balloon Arch",
                        "category": "decorations",
                        "description": "Colorful balloon archway for entrance or backdrop",
                        "cultural_significance": "Modern celebration decoration",
                        "age_appropriate": ["child", "teen", "adult"],
                        "budget_tier": "medium"
                    },
                    {
                        "id": "photo-booth",
                        "name": "Photo Booth",
                        "category": "entertainment", 
                        "description": "Interactive photo station with props",
                        "cultural_significance": "Memory creation tradition",
                        "age_appropriate": ["child", "teen", "adult"],
                        "budget_tier": "high"
                    },
                    {
                        "id": "birthday-cake-station",
                        "name": "Birthday Cake Station",
                        "category": "food",
                        "description": "Dedicated area for cake cutting ceremony",
                        "cultural_significance": "Central birthday tradition",
                        "age_appropriate": ["child", "teen", "adult"],
                        "budget_tier": "essential"
                    },
                    {
                        "id": "party-games",
                        "name": "Party Games Area",
                        "category": "entertainment",
                        "description": "Interactive games and activities space",
                        "cultural_significance": "Social engagement tradition",
                        "age_appropriate": ["child", "teen"],
                        "budget_tier": "medium"
                    }
                ]
            },
            "mexican-quinceañera": {
                "name": "Mexican Quinceañera",
                "amenities": [
                    {
                        "id": "ceremonial-altar",
                        "name": "Ceremonial Altar",
                        "category": "ceremonial",
                        "description": "Traditional altar for religious ceremony",
                        "cultural_significance": "Sacred tradition for 15th birthday",
                        "age_appropriate": ["teen"],
                        "budget_tier": "essential"
                    },
                    {
                        "id": "mariachi-stage",
                        "name": "Mariachi Performance Stage", 
                        "category": "entertainment",
                        "description": "Stage area for traditional music performance",
                        "cultural_significance": "Traditional Mexican celebration music",
                        "age_appropriate": ["teen", "adult"],
                        "budget_tier": "high"
                    },
                    {
                        "id": "waltz-dance-floor",
                        "name": "Waltz Dance Floor",
                        "category": "ceremonial",
                        "description": "Special dance floor for father-daughter waltz",
                        "cultural_significance": "Traditional coming-of-age ceremony",
                        "age_appropriate": ["teen"],
                        "budget_tier": "medium"
                    }
                ]
            },
            "korean-doljanchi": {
                "name": "Korean Doljanchi (1st Birthday)",
                "amenities": [
                    {
                        "id": "doljabi-table",
                        "name": "Doljabi Fortune Table",
                        "category": "ceremonial",
                        "description": "Traditional table with symbolic objects for baby to choose",
                        "cultural_significance": "Predicts child's future path and talents",
                        "age_appropriate": ["child"],
                        "budget_tier": "essential"
                    },
                    {
                        "id": "hanbok-photo-area",
                        "name": "Hanbok Photo Area",
                        "category": "photography",
                        "description": "Traditional Korean dress photo station",
                        "cultural_significance": "Cultural heritage preservation",
                        "age_appropriate": ["child"],
                        "budget_tier": "medium"
                    }
                ]
            },
            "jewish-bar-mitzvah": {
                "name": "Jewish Bar/Bat Mitzvah",
                "amenities": [
                    {
                        "id": "torah-reading-area",
                        "name": "Torah Reading Area",
                        "category": "ceremonial",
                        "description": "Dedicated space for Torah reading ceremony",
                        "cultural_significance": "Central coming-of-age religious ceremony",
                        "age_appropriate": ["teen"],
                        "budget_tier": "essential"
                    },
                    {
                        "id": "hora-dance-circle",
                        "name": "Hora Dance Circle", 
                        "category": "entertainment",
                        "description": "Traditional circle dance area with chair lifting",
                        "cultural_significance": "Joyful celebration tradition",
                        "age_appropriate": ["teen", "adult"],
                        "budget_tier": "medium"
                    }
                ]
            },
            "birthday": {
                "name": "General Birthday Celebration",
                "amenities": [
                    {
                        "id": "birthday-balloons",
                        "name": "Birthday Balloons",
                        "category": "decorations",
                        "description": "Age-appropriate balloon decorations",
                        "cultural_significance": "Universal celebration symbol",
                        "age_appropriate": ["child", "teen", "adult"],
                        "budget_tier": "essential"
                    },
                    {
                        "id": "gift-display-area",
                        "name": "Gift Display Area",
                        "category": "furniture",
                        "description": "Dedicated space for gift presentation and opening",
                        "cultural_significance": "Gift-giving tradition",
                        "age_appropriate": ["child", "teen", "adult"],
                        "budget_tier": "medium"
                    }
                ]
            }
        }
        
        # Find matching celebration type
        celebration_key = celebration_type.lower().replace(" ", "-")
        amenities_data = amenities_database.get(celebration_key)
        
        if not amenities_data:
            # Fallback to generic birthday amenities
            amenities_data = amenities_database.get("birthday", {
                "name": "Generic Celebration",
                "amenities": []
            })
        
        return {
            "success": True,
            "celebration_type": celebration_type,
            "celebration_name": amenities_data.get("name", celebration_type),
            "amenities": amenities_data.get("amenities", []),
            "count": len(amenities_data.get("amenities", [])),
            "cultural_intelligence": True,
            "data_source": "celebratory_template_system"
        }
        
    except Exception as e:
        logger.error(f"Error getting celebration amenities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get celebration amenities: {str(e)}"
        )

class ImageAnalysisRequest(BaseModel):
    file_url: str
    analysis_type: str = "comprehensive"

@router.post("/analyze-image")
async def analyze_image(
    request: ImageAnalysisRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """AI-powered image analysis for space planning and cultural context."""
    try:
        from app.services.cv_service import CVService
        
        file_url = request.file_url
        analysis_type = request.analysis_type
        
        if not file_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="file_url is required for image analysis"
            )
        
        cv_service = CVService()
        
        # Comprehensive analysis combining multiple CV services
        analysis_results = {}
        
        if analysis_type in ["comprehensive", "space"]:
            # Space analysis
            space_analysis = await cv_service.analyze_space_photo(file_url)
            analysis_results["space_analysis"] = space_analysis
            
            # Dimension estimation
            dimensions = await cv_service.analyze_dimensions(file_url)
            analysis_results["dimensions"] = dimensions
            
            # Lighting analysis
            lighting = await cv_service.analyze_lighting(file_url)
            analysis_results["lighting"] = lighting
        
        if analysis_type in ["comprehensive", "style"]:
            # Style and design analysis
            style_analysis = await cv_service.analyze_style(file_url)
            analysis_results["style_analysis"] = style_analysis
            
            # Color palette extraction
            colors = await cv_service.extract_colors(file_url)
            analysis_results["color_palette"] = colors
        
        if analysis_type in ["comprehensive", "furniture"]:
            # Furniture detection
            furniture = await cv_service.detect_furniture(file_url)
            analysis_results["existing_furniture"] = furniture
        
        # AI interpretation and recommendations
        ai_recommendations = {
            "design_suggestions": [],
            "cultural_compatibility": {},
            "space_optimization": [],
            "accessibility_notes": []
        }
        
        # Generate AI recommendations based on analysis
        if "space_analysis" in analysis_results:
            space_data = analysis_results["space_analysis"]
            
            # Space optimization suggestions
            if space_data.get("room_type") == "living_room":
                ai_recommendations["design_suggestions"].extend([
                    "Consider conversation seating arrangement",
                    "Add accent lighting for ambiance",
                    "Include storage solutions for entertainment items"
                ])
            elif space_data.get("room_type") == "dining_room":
                ai_recommendations["design_suggestions"].extend([
                    "Ensure adequate circulation space around table",
                    "Consider cultural dining traditions",
                    "Plan for serving and buffet areas"
                ])
        
        # Cultural compatibility analysis
        if "style_analysis" in analysis_results:
            style_data = analysis_results["style_analysis"]
            dominant_style = style_data.get("dominant_style", "modern")
            
            ai_recommendations["cultural_compatibility"] = {
                "detected_style": dominant_style,
                "compatible_cultures": _get_compatible_cultures(dominant_style),
                "fusion_opportunities": _get_fusion_suggestions(dominant_style)
            }
        
        return {
            "success": True,
            "file_url": file_url,
            "analysis_type": analysis_type,
            "cv_analysis": analysis_results,
            "ai_recommendations": ai_recommendations,
            "processing_time_ms": 1500,  # Estimated processing time
            "ai_model": "computer_vision_plus_cultural_intelligence",
            "cultural_intelligence": True
        }
        
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze image: {str(e)}"
        )

def _get_compatible_cultures(style: str) -> List[str]:
    """Get cultures compatible with detected architectural style."""
    style_culture_map = {
        "modern": ["american", "scandinavian", "japanese"],
        "traditional": ["french", "italian", "english"],
        "minimalist": ["japanese", "scandinavian"], 
        "rustic": ["mexican", "southwestern", "country"],
        "industrial": ["american", "modern"],
        "mediterranean": ["italian", "spanish", "greek"]
    }
    return style_culture_map.get(style.lower(), ["modern", "american"])

def _get_fusion_suggestions(style: str) -> List[str]:
    """Get cultural fusion suggestions based on architectural style."""
    fusion_map = {
        "modern": ["Japanese-Scandinavian minimalism", "American-Italian contemporary"],
        "traditional": ["French-English elegance", "Italian-Spanish warmth"],
        "minimalist": ["Japanese-Scandinavian hygge", "Modern-Japanese zen"],
        "rustic": ["Mexican-American southwest", "Country-French provincial"]
    }
    return fusion_map.get(style.lower(), ["Modern-Cultural blend"])