"""
API endpoints for cultural philosophy guidance and recommendations.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from app.services.cultural_philosophy_service import CulturalPhilosophyService, CulturalPhilosophy
from app.api.auth import get_current_user
from app.models.user import User
from pydantic import BaseModel
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class DesignRecommendationRequest(BaseModel):
    philosophy: CulturalPhilosophy
    event_type: str
    budget_range: str
    guest_count: int
    specific_requirements: Optional[List[str]] = None

class CulturalValidationRequest(BaseModel):
    philosophy: CulturalPhilosophy
    design_elements: List[str]
    event_context: Optional[str] = None

@router.get("/philosophies")
async def get_all_philosophies(
    current_user: User = Depends(get_current_user)
):
    """Get overview of all cultural philosophies."""
    try:
        service = CulturalPhilosophyService()
        philosophies = await service.get_all_philosophies()
        
        # Return simplified overview
        overview = {}
        for philosophy, data in philosophies.items():
            overview[philosophy.value] = {
                "name": data.name,
                "culture": data.culture,
                "foundation": data.foundation,
                "core_principles": data.core_principles,
                "primary_colors": data.color_palette.primary[:3],
                "key_materials": [m.name for m in data.materials[:3]]
            }
        
        return {
            "philosophies": overview,
            "total_count": len(overview),
            "message": "Cultural philosophies retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving philosophies: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve cultural philosophies")

@router.get("/philosophies/{philosophy}")
async def get_philosophy_details(
    philosophy: CulturalPhilosophy,
    current_user: User = Depends(get_current_user)
):
    """Get detailed information about a specific cultural philosophy."""
    try:
        service = CulturalPhilosophyService()
        philosophy_data = await service.get_philosophy_data(philosophy)
        
        return {
            "philosophy": philosophy.value,
            "data": philosophy_data.dict(),
            "message": f"{philosophy_data.name} philosophy details retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving philosophy {philosophy}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve {philosophy} philosophy")

@router.post("/recommendations")
async def get_design_recommendations(
    request: DesignRecommendationRequest,
    current_user: User = Depends(get_current_user)
):
    """Get design recommendations based on cultural philosophy and event parameters."""
    try:
        service = CulturalPhilosophyService()
        
        recommendations = await service.get_design_recommendations(
            philosophy=request.philosophy,
            event_type=request.event_type,
            budget_range=request.budget_range,
            guest_count=request.guest_count
        )
        
        # Add vendor recommendations
        vendors = await service.get_vendor_recommendations(request.philosophy)
        recommendations["recommended_vendors"] = vendors
        
        # Add color palette guidance
        colors = await service.get_color_palette_guidance(request.philosophy)
        recommendations["color_guidance"] = colors
        
        return {
            "recommendations": recommendations,
            "message": f"Design recommendations for {request.philosophy.value} generated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate design recommendations")

@router.post("/validate")
async def validate_cultural_appropriateness(
    request: CulturalValidationRequest,
    current_user: User = Depends(get_current_user)
):
    """Validate design elements against cultural sensitivity guidelines."""
    try:
        service = CulturalPhilosophyService()
        
        validation_result = await service.validate_cultural_appropriateness(
            philosophy=request.philosophy,
            design_elements=request.design_elements
        )
        
        return {
            "validation": validation_result,
            "message": "Cultural appropriateness validation completed"
        }
        
    except Exception as e:
        logger.error(f"Error validating cultural appropriateness: {e}")
        raise HTTPException(status_code=500, detail="Failed to validate cultural appropriateness")

@router.get("/philosophies/{philosophy}/colors")
async def get_color_palette(
    philosophy: CulturalPhilosophy,
    current_user: User = Depends(get_current_user)
):
    """Get detailed color palette guidance for a philosophy."""
    try:
        service = CulturalPhilosophyService()
        color_guidance = await service.get_color_palette_guidance(philosophy)
        
        return {
            "philosophy": philosophy.value,
            "color_palette": color_guidance,
            "message": f"Color palette for {philosophy.value} retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving color palette: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve color palette")

@router.get("/philosophies/{philosophy}/materials")
async def get_materials_guidance(
    philosophy: CulturalPhilosophy,
    current_user: User = Depends(get_current_user)
):
    """Get detailed materials guidance for a philosophy."""
    try:
        service = CulturalPhilosophyService()
        philosophy_data = await service.get_philosophy_data(philosophy)
        
        materials_info = []
        for material in philosophy_data.materials:
            materials_info.append({
                "name": material.name,
                "description": material.description,
                "authenticity_markers": material.authenticity_markers,
                "quality_indicators": material.quality_indicators,
                "suppliers": material.suppliers
            })
        
        return {
            "philosophy": philosophy.value,
            "materials": materials_info,
            "message": f"Materials guidance for {philosophy.value} retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving materials guidance: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve materials guidance")

@router.get("/philosophies/{philosophy}/vendors")
async def get_vendor_recommendations_endpoint(
    philosophy: CulturalPhilosophy,
    material_type: Optional[str] = Query(None, description="Filter by material type"),
    current_user: User = Depends(get_current_user)
):
    """Get vendor recommendations for a specific philosophy."""
    try:
        service = CulturalPhilosophyService()
        vendors = await service.get_vendor_recommendations(philosophy, material_type)
        
        return {
            "philosophy": philosophy.value,
            "vendors": vendors,
            "filter": material_type,
            "count": len(vendors),
            "message": f"Vendor recommendations for {philosophy.value} retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving vendor recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve vendor recommendations")

@router.get("/philosophies/{philosophy}/regional-variations")
async def get_regional_variations(
    philosophy: CulturalPhilosophy,
    current_user: User = Depends(get_current_user)
):
    """Get regional variations for a philosophy."""
    try:
        service = CulturalPhilosophyService()
        philosophy_data = await service.get_philosophy_data(philosophy)
        
        return {
            "philosophy": philosophy.value,
            "regional_variations": [var.dict() for var in philosophy_data.regional_variations],
            "message": f"Regional variations for {philosophy.value} retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving regional variations: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve regional variations")

@router.get("/philosophies/{philosophy}/cultural-sensitivity")
async def get_cultural_sensitivity_guidelines(
    philosophy: CulturalPhilosophy,
    current_user: User = Depends(get_current_user)
):
    """Get cultural sensitivity guidelines for a philosophy."""
    try:
        service = CulturalPhilosophyService()
        philosophy_data = await service.get_philosophy_data(philosophy)
        
        return {
            "philosophy": philosophy.value,
            "cultural_sensitivity": philosophy_data.cultural_sensitivity,
            "core_principles": philosophy_data.core_principles,
            "message": f"Cultural sensitivity guidelines for {philosophy.value} retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving cultural sensitivity guidelines: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve cultural sensitivity guidelines")

@router.post("/philosophies/{philosophy}/budget-guidance")
async def get_budget_guidance(
    philosophy: CulturalPhilosophy,
    total_budget: float = Query(..., description="Total budget amount"),
    current_user: User = Depends(get_current_user)
):
    """Get budget allocation guidance for a philosophy."""
    try:
        service = CulturalPhilosophyService()
        philosophy_data = await service.get_philosophy_data(philosophy)
        
        # Calculate actual budget allocations
        budget_breakdown = {}
        for category, percentage in philosophy_data.budget_allocation.items():
            percent_value = float(percentage.replace('%', '')) / 100
            budget_breakdown[category] = {
                "percentage": percentage,
                "amount": total_budget * percent_value
            }
        
        return {
            "philosophy": philosophy.value,
            "total_budget": total_budget,
            "budget_breakdown": budget_breakdown,
            "message": f"Budget guidance for {philosophy.value} calculated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error calculating budget guidance: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate budget guidance")

@router.post("/admin/save-philosophy-data")
async def save_philosophy_data_to_db(
    current_user: User = Depends(get_current_user)
):
    """Save all philosophy data to the database (admin function)."""
    try:
        service = CulturalPhilosophyService()
        await service.save_philosophy_data()
        
        return {
            "message": "Cultural philosophy data saved to database successfully"
        }
        
    except Exception as e:
        logger.error(f"Error saving philosophy data: {e}")
        raise HTTPException(status_code=500, detail="Failed to save philosophy data")

@router.get("/search")
async def search_philosophies(
    query: str = Query(..., description="Search query"),
    current_user: User = Depends(get_current_user)
):
    """Search across all philosophies for relevant information."""
    try:
        service = CulturalPhilosophyService()
        all_philosophies = await service.get_all_philosophies()
        
        results = []
        query_lower = query.lower()
        
        for philosophy, data in all_philosophies.items():
            # Search in various fields
            matches = []
            
            if query_lower in data.name.lower():
                matches.append(f"Philosophy name: {data.name}")
            
            if query_lower in data.culture.lower():
                matches.append(f"Culture: {data.culture}")
            
            if query_lower in data.foundation.lower():
                matches.append("Foundation description")
            
            # Search in core principles
            for principle in data.core_principles:
                if query_lower in principle.lower():
                    matches.append(f"Core principle: {principle}")
            
            # Search in materials
            for material in data.materials:
                if query_lower in material.name.lower():
                    matches.append(f"Material: {material.name}")
            
            if matches:
                results.append({
                    "philosophy": philosophy.value,
                    "name": data.name,
                    "culture": data.culture,
                    "matches": matches[:3]  # Limit to top 3 matches
                })
        
        return {
            "query": query,
            "results": results,
            "total_matches": len(results),
            "message": f"Search completed for '{query}'"
        }
        
    except Exception as e:
        logger.error(f"Error searching philosophies: {e}")
        raise HTTPException(status_code=500, detail="Failed to search philosophies")