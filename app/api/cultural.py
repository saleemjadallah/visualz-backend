from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
import logging
from app.models.cultural import (
    CulturalElement, CulturalElementCreate, CulturalElementUpdate,
    CulturalValidationRequest, CulturalValidationResult
)
from app.services.cultural_categorization import CulturalCategory, SacredLevel, EventContext
from app.models.user import User
from app.api.auth import get_current_user
from app.services.cultural_service import CulturalService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/elements", response_model=List[CulturalElement])
async def get_cultural_elements(
    culture: Optional[str] = Query(None, description="Filter by culture"),
    category: Optional[str] = Query(None, description="Filter by category"),
    verified_only: bool = Query(False, description="Only return verified elements"),
    current_user: User = Depends(get_current_user)
):
    """Get cultural elements with optional filtering."""
    cultural_service = CulturalService()
    
    try:
        elements = await cultural_service.get_cultural_elements(
            culture=culture,
            category=category,
            verified_only=verified_only
        )
        
        logger.info(f"Retrieved {len(elements)} cultural elements for user {current_user.id}")
        return elements
        
    except Exception as e:
        logger.error(f"Error retrieving cultural elements: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cultural elements"
        )

@router.get("/elements/{element_id}", response_model=CulturalElement)
async def get_cultural_element(
    element_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific cultural element by ID."""
    cultural_service = CulturalService()
    
    try:
        element = await cultural_service.get_cultural_element_by_id(element_id)
        
        if not element:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cultural element not found"
            )
        
        return element
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving cultural element {element_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cultural element"
        )

@router.post("/elements", response_model=CulturalElement)
async def create_cultural_element(
    element_data: CulturalElementCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new cultural element."""
    cultural_service = CulturalService()
    
    try:
        element = await cultural_service.create_cultural_element(
            element_data=element_data,
            created_by=current_user.id
        )
        
        logger.info(f"Created cultural element {element.id} by user {current_user.id}")
        return element
        
    except Exception as e:
        logger.error(f"Error creating cultural element: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create cultural element: {str(e)}"
        )

@router.put("/elements/{element_id}", response_model=CulturalElement)
async def update_cultural_element(
    element_id: str,
    updates: CulturalElementUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a cultural element."""
    cultural_service = CulturalService()
    
    try:
        # First check if element exists
        existing_element = await cultural_service.get_cultural_element_by_id(element_id)
        if not existing_element:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cultural element not found"
            )
        
        # For now, we'll return the existing element
        # TODO: Implement actual update logic in cultural_service
        logger.info(f"Cultural element {element_id} update requested by user {current_user.id}")
        return existing_element
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cultural element {element_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update cultural element"
        )

@router.post("/validate", response_model=CulturalValidationResult)
async def validate_cultural_appropriateness(
    validation_request: CulturalValidationRequest,
    current_user: User = Depends(get_current_user)
):
    """Validate design elements for cultural appropriateness."""
    cultural_service = CulturalService()
    
    try:
        result = await cultural_service.validate_cultural_appropriateness(validation_request)
        
        logger.info(
            f"Cultural validation completed for user {current_user.id}: "
            f"score {result.sensitivity_score}, status {result.overall_status}"
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error validating cultural appropriateness: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to validate cultural appropriateness"
        )

@router.get("/cultures")
async def get_available_cultures(
    current_user: User = Depends(get_current_user)
):
    """Get list of available cultures in the database."""
    cultural_service = CulturalService()
    
    try:
        # Get all cultural elements and extract unique cultures
        all_elements = await cultural_service.get_cultural_elements()
        cultures = list(set(element.culture for element in all_elements))
        cultures.sort()
        
        return {"cultures": cultures}
        
    except Exception as e:
        logger.error(f"Error retrieving available cultures: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve available cultures"
        )

@router.get("/categories")
async def get_available_categories(
    current_user: User = Depends(get_current_user)
):
    """Get list of available categories in the database."""
    cultural_service = CulturalService()
    
    try:
        # Get all cultural elements and extract unique categories
        all_elements = await cultural_service.get_cultural_elements()
        categories = list(set(element.category for element in all_elements))
        categories.sort()
        
        return {"categories": categories}
        
    except Exception as e:
        logger.error(f"Error retrieving available categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve available categories"
        )

@router.get("/cultures/{culture}/guidelines")
async def get_cultural_guidelines(
    culture: str,
    current_user: User = Depends(get_current_user)
):
    """Get cultural guidelines for a specific culture."""
    cultural_service = CulturalService()
    
    try:
        guidelines = await cultural_service.get_cultural_guidelines(culture)
        
        return {
            "culture": culture,
            "guidelines": guidelines,
            "disclaimer": (
                "These guidelines are based on general cultural knowledge and should be "
                "validated with cultural experts and community members before implementation."
            )
        }
        
    except Exception as e:
        logger.error(f"Error retrieving cultural guidelines for {culture}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cultural guidelines"
        )

@router.get("/alternatives")
async def suggest_cultural_alternatives(
    flagged_element: str = Query(..., description="Element that was flagged"),
    target_culture: str = Query(..., description="Target culture for alternatives"),
    category: str = Query(..., description="Element category"),
    current_user: User = Depends(get_current_user)
):
    """Suggest culturally appropriate alternatives for flagged elements."""
    cultural_service = CulturalService()
    
    try:
        alternatives = await cultural_service.suggest_cultural_alternatives(
            flagged_element=flagged_element,
            target_culture=target_culture,
            category=category
        )
        
        return {
            "flagged_element": flagged_element,
            "target_culture": target_culture,
            "alternatives": alternatives,
            "disclaimer": (
                "Alternative suggestions are based on database entries and should be "
                "reviewed by cultural experts before implementation."
            )
        }
        
    except Exception as e:
        logger.error(f"Error suggesting cultural alternatives: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to suggest cultural alternatives"
        )

@router.get("/stats")
async def get_cultural_database_stats(
    current_user: User = Depends(get_current_user)
):
    """Get statistics about the cultural database."""
    cultural_service = CulturalService()
    
    try:
        all_elements = await cultural_service.get_cultural_elements()
        verified_elements = await cultural_service.get_cultural_elements(verified_only=True)
        
        cultures = set(element.culture for element in all_elements)
        categories = set(element.category for element in all_elements)
        
        sacred_levels = {}
        for element in all_elements:
            level = element.sacred_level
            sacred_levels[level] = sacred_levels.get(level, 0) + 1
        
        return {
            "total_elements": len(all_elements),
            "verified_elements": len(verified_elements),
            "total_cultures": len(cultures),
            "total_categories": len(categories),
            "verification_rate": f"{(len(verified_elements) / len(all_elements) * 100):.1f}%" if all_elements else "0%",
            "sacred_level_distribution": sacred_levels,
            "cultures": sorted(list(cultures)),
            "categories": sorted(list(categories)),
            "disclaimer": (
                "This database is for demonstration purposes and contains preliminary data. "
                "All entries require validation by cultural experts before production use."
            )
        }
        
    except Exception as e:
        logger.error(f"Error retrieving cultural database stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve database statistics"
        )

@router.post("/categorize")
async def categorize_cultural_element(
    element_name: str = Query(..., description="Name of the cultural element"),
    culture: str = Query(..., description="Culture of origin"),
    description: str = Query(..., description="Element description"),
    current_user: User = Depends(get_current_user)
):
    """Automatically categorize a cultural element."""
    cultural_service = CulturalService()
    
    try:
        categorization = cultural_service.categorization_service.categorize_element(
            element_name=element_name,
            culture=culture,
            description=description
        )
        
        return {
            "element_name": element_name,
            "culture": culture,
            "categorization": categorization,
            "disclaimer": (
                "Automatic categorization is preliminary and requires expert validation. "
                "Do not use for production without cultural expert review."
            )
        }
        
    except Exception as e:
        logger.error(f"Error categorizing element: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to categorize element"
        )

@router.get("/categories/guidelines")
async def get_category_guidelines(
    category: str = Query(..., description="Cultural category"),
    current_user: User = Depends(get_current_user)
):
    """Get guidelines for a specific cultural category."""
    cultural_service = CulturalService()
    
    try:
        # Convert string to enum
        try:
            category_enum = CulturalCategory(category)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category: {category}"
            )
        
        guidelines = cultural_service.categorization_service.get_category_guidelines(category_enum)
        
        return {
            "category": category,
            "guidelines": guidelines,
            "disclaimer": "Guidelines are for educational purposes. Consult cultural experts for authoritative guidance."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving category guidelines: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve category guidelines"
        )

@router.get("/categories/all")
async def get_all_categories(
    current_user: User = Depends(get_current_user)
):
    """Get all available cultural categories."""
    try:
        categories = [{"value": cat.value, "name": cat.name} for cat in CulturalCategory]
        sacred_levels = [{"value": level.value, "name": level.name} for level in SacredLevel]
        event_contexts = [{"value": ctx.value, "name": ctx.name} for ctx in EventContext]
        
        return {
            "categories": categories,
            "sacred_levels": sacred_levels,
            "event_contexts": event_contexts,
            "total_categories": len(categories)
        }
        
    except Exception as e:
        logger.error(f"Error retrieving categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve categories"
        )

@router.post("/validate-context")
async def validate_context_appropriateness(
    category: str = Query(..., description="Cultural category"),
    event_context: str = Query(..., description="Event context"),
    sacred_level: str = Query(..., description="Sacred level"),
    current_user: User = Depends(get_current_user)
):
    """Validate if a cultural element is appropriate for an event context."""
    cultural_service = CulturalService()
    
    try:
        # Convert strings to enums
        try:
            category_enum = CulturalCategory(category)
            context_enum = EventContext(event_context)
            sacred_enum = SacredLevel(sacred_level)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid enum value: {str(e)}"
            )
        
        validation = cultural_service.categorization_service.validate_context_appropriateness(
            category=category_enum,
            event_context=context_enum,
            sacred_level=sacred_enum
        )
        
        return {
            "category": category,
            "event_context": event_context,
            "sacred_level": sacred_level,
            "validation": validation,
            "disclaimer": "Context validation is preliminary. Always consult with cultural experts."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating context appropriateness: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to validate context appropriateness"
        )