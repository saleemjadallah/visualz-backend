from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
import logging

from app.models.design import AIDesignRequest, Design, DesignCreate
from app.models.user import User
from app.api.auth import get_current_user
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