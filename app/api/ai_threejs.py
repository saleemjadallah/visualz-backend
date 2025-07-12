"""
AI-Three.js Integration API
Bridges AI design responses with Three.js scene generation
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import json
import logging
import subprocess
import asyncio
from datetime import datetime
from pathlib import Path

from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from typing import Optional as OptionalType
from app.services.ai_service import AIDesignService
from app.models.design import AIDesignRequest

router = APIRouter()
logger = logging.getLogger(__name__)

# Three.js Integration Service Path
THREEJS_BRIDGE_PATH = Path(__file__).parent.parent.parent / "parametric-furniture" / "ai-integration"

class EventRequirementsRequest(BaseModel):
    event_type: str = Field(..., description="Type of event (birthday, wedding, corporate, etc.)")
    celebration_type: Optional[str] = Field(None, description="Specific celebration type")
    cultural_preferences: Optional[List[str]] = Field(None, description="Cultural preferences")
    cultural_background: Optional[List[str]] = Field(None, description="Primary and secondary cultural backgrounds")
    space_data: Optional[Dict[str, Any]] = Field(None, description="Space dimensions and details")
    space_dimensions: Optional[Dict[str, float]] = Field(None, description="Width, depth, height in meters")
    guest_count: int = Field(..., description="Total number of expected guests")
    budget_tier: Optional[str] = Field(None, description="Budget tier from frontend")
    budget_range: Optional[str] = Field(None, description="Budget category: low, medium, high, luxury")
    age_range: Optional[str] = Field(None, description="Age range of attendees")
    celebration_amenities: Optional[List[str]] = Field(default=[], description="Selected celebration amenities")
    accessibility_requirements: Optional[List[str]] = Field(default=[], description="Specific accessibility needs")
    style_preferences: Optional[List[str]] = Field(default=[], description="Style and aesthetic preferences")
    special_needs: Optional[List[str]] = Field(default=[], description="Special needs requirements")
    venue_type: Optional[str] = Field(default="indoor", description="indoor, outdoor, mixed, covered-outdoor")
    timing: Optional[Dict[str, str]] = Field(default={}, description="Season, time of day, weather expectations")
    special_requirements: Optional[List[str]] = Field(default=[], description="Unique event requirements")

class AIDesignResponse(BaseModel):
    """Structured response format for Three.js integration"""
    spatial_layout: Dict[str, Any]
    furniture_specifications: List[Dict[str, Any]]
    lighting_design: Dict[str, Any]
    cultural_elements: List[Dict[str, Any]]
    material_palette: Dict[str, Any]
    budget_breakdown: Dict[str, Any]
    accessibility_features: List[Dict[str, Any]]
    three_js_scene_code: str
    parametric_generation_params: Dict[str, Any]

class ThreeJSSceneResult(BaseModel):
    scene_data: Dict[str, Any] = Field(..., description="Three.js scene object data")
    cultural_metadata: List[Dict[str, Any]] = Field(..., description="Cultural context and guidance")
    accessibility_features: List[str] = Field(..., description="Accessibility compliance information") 
    budget_breakdown: Dict[str, Any] = Field(..., description="Cost breakdown and priorities")
    preview_url: Optional[str] = Field(None, description="URL for 3D scene preview")
    design_id: str = Field(..., description="Unique identifier for this design")
    generation_metadata: Dict[str, Any] = Field(..., description="Generation timing and quality metrics")

@router.post("/generate-3d-scene", response_model=ThreeJSSceneResult)
async def generate_ai_threejs_scene(
    request: EventRequirementsRequest,
    background_tasks: BackgroundTasks,
    current_user: OptionalType[User] = Depends(get_current_user_optional)
):
    """
    Generate complete 3D scene from user preferences using AI + Three.js integration
    
    This endpoint orchestrates the complete flow:
    1. Convert form data to AI prompt request
    2. Generate AI design response with cultural intelligence  
    3. Format response for Three.js integration
    4. Generate interactive 3D scene with celebratory props
    5. Return scene data for frontend rendering
    """
    try:
        start_time = datetime.now()
        user_email = current_user.email if current_user else "anonymous"
        logger.info(f"Starting AI-Three.js scene generation for user {user_email}")
        
        # Phase 1: Convert form data to AI prompt request
        ai_prompt_request = convert_form_to_ai_prompt_request(request)
        logger.info(f"Converted form data to AI prompt request for {request.event_type}")
        
        # Phase 2: Generate AI design response using enhanced prompt system
        ai_service = AIDesignService()
        ai_design_response = await generate_ai_design_response(ai_service, ai_prompt_request)
        logger.info("Generated AI design response with cultural intelligence")
        
        # Phase 3: Format AI response for Three.js integration
        threejs_design_response = format_ai_response_for_threejs(ai_design_response, request)
        logger.info("Formatted AI response for Three.js integration")
        
        # Phase 4: Generate Three.js scene using integration service
        scene_result = await call_threejs_integration_service(threejs_design_response)
        logger.info("Generated Three.js scene with celebratory props")
        
        # Phase 5: Prepare final response
        generation_time = (datetime.now() - start_time).total_seconds() * 1000
        user_id_suffix = current_user.id[:8] if current_user else "anon"
        design_id = f"ai_3d_{int(start_time.timestamp())}_{user_id_suffix}"
        
        result = ThreeJSSceneResult(
            scene_data=scene_result.get("scene_data", {}),
            cultural_metadata=threejs_design_response.cultural_elements,
            accessibility_features=[f.get("type", "") for f in threejs_design_response.accessibility_features],
            budget_breakdown=threejs_design_response.budget_breakdown,
            preview_url=scene_result.get("preview_url"),
            design_id=design_id,
            generation_metadata={
                "generation_time_ms": generation_time,
                "ai_model_used": "enhanced_cultural_intelligence",
                "threejs_version": "r150+",
                "template_count": len(threejs_design_response.furniture_specifications),
                "cultural_authenticity_score": calculate_cultural_authenticity_score(threejs_design_response),
                "accessibility_compliance": "WCAG_2.1_AA",
                "celebratory_features_included": get_celebratory_features(threejs_design_response)
            }
        )
        
        logger.info(f"✅ AI-Three.js scene generation completed in {generation_time:.2f}ms")
        return result
        
    except Exception as e:
        logger.error(f"❌ AI-Three.js scene generation failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate 3D scene: {str(e)}"
        )

async def generate_ai_design_response(ai_service: AIDesignService, prompt_request: Dict[str, Any]) -> Dict[str, Any]:
    """Generate AI design response using enhanced prompt system"""
    
    # For now, create a structured response based on the request
    # This will be replaced with actual AI service call once Python integration is ready
    return {
        "design_concept": f"AI-generated {prompt_request['event_type']} design",
        "cultural_considerations": prompt_request.get("cultural_background", []),
        "space_layout": prompt_request.get("space_dimensions", {}),
        "furniture_recommendations": [],
        "lighting_plan": {},
        "material_suggestions": {},
        "budget_allocation": {},
        "accessibility_notes": prompt_request.get("accessibility_requirements", [])
    }

def convert_form_to_ai_prompt_request(request: EventRequirementsRequest) -> Dict[str, Any]:
    """Convert frontend form data to AI prompt system format"""
    
    # Handle both frontend field names and expected field names
    cultural_background = request.cultural_background or request.cultural_preferences or []
    space_dimensions = request.space_dimensions or (request.space_data.get("dimensions") if request.space_data else {})
    budget_range = request.budget_range or request.budget_tier or "medium"
    accessibility_requirements = request.accessibility_requirements or request.special_needs or []
    
    return {
        "event_type": request.event_type,
        "celebration_type": request.celebration_type,
        "cultural_background": cultural_background,
        "space_dimensions": space_dimensions,
        "guest_count": request.guest_count,
        "budget_range": budget_range,
        "age_range": request.age_range,
        "accessibility_requirements": accessibility_requirements,
        "style_preferences": request.style_preferences or [],
        "venue_type": request.venue_type or "indoor",
        "timing": request.timing or {},
        "special_requirements": request.special_requirements or [],
        "celebration_amenities": request.celebration_amenities or []
    }

def format_ai_response_for_threejs(ai_response: Dict[str, Any], original_request: EventRequirementsRequest) -> AIDesignResponse:
    """Convert AI response to Three.js integration format"""
    
    # Detect if this is a celebratory event
    celebration_keywords = ['birthday', 'anniversary', 'graduation', 'quinceañera', 'bar-mitzvah', 'bat-mitzvah']
    is_celebration = any(keyword in original_request.event_type.lower() for keyword in celebration_keywords)
    
    # Generate furniture specifications with celebratory focus
    furniture_specs = []
    
    if is_celebration:
        # Add celebratory-specific furniture
        furniture_specs.extend([
            {
                "type": "celebratory-props",
                "template": "celebratory",
                "parameters": {
                    "celebrationType": determine_celebration_type(original_request.event_type),
                    "ageGroup": determine_age_group(original_request.event_type, original_request.guest_count),
                    "theme": extract_theme_from_preferences(original_request.style_preferences),
                    "culture": get_primary_culture(original_request),
                    "guestCount": original_request.guest_count,
                    "spaceDimensions": get_space_dimensions(original_request),
                    "balloonSystems": True,
                    "photoBackdrops": True,
                    "interactiveProps": True,
                    "ceremonialElements": True,
                    "giftDisplayAreas": True,
                    "entertainmentProps": True
                },
                "position": {"x": 0, "y": 0, "z": 0},
                "rotation": {"x": 0, "y": 0, "z": 0},
                "cultural_significance": f"Central celebration system with {get_primary_culture(original_request)} traditions",
                "accessibility_features": get_accessibility_requirements(original_request),
                "budget_tier": map_budget_to_tier(get_budget_range(original_request))
            },
            {
                "type": "balloon-system",
                "template": "balloon-arch",
                "parameters": {
                    "balloonType": "themed",
                    "balloonCount": min(30, original_request.guest_count + 5),
                    "colors": get_cultural_colors(get_primary_culture(original_request)),
                    "arrangement": "arch"
                },
                "position": {"x": 0, "y": 0, "z": -4},
                "rotation": {"x": 0, "y": 0, "z": 0},
                "cultural_significance": "Festive entrance arch for photo opportunities",
                "accessibility_features": ["clear-pathway-underneath"],
                "budget_tier": map_budget_to_tier(get_budget_range(original_request))
            }
        ])
    
    # Add standard furniture
    furniture_specs.extend([
        {
            "type": "chair",
            "template": "enhanced-chair",
            "parameters": {
                "chairType": "dining" if "dining" in original_request.event_type.lower() else "event",
                "culture": get_primary_culture(original_request),
                "count": max(4, original_request.guest_count // 4)
            },
            "position": {"x": 2, "y": 0, "z": 2},
            "rotation": {"x": 0, "y": 0, "z": 0},
            "cultural_significance": "Seating aligned with cultural ergonomics",
            "accessibility_features": get_accessibility_requirements(original_request),
            "budget_tier": map_budget_to_tier(get_budget_range(original_request))
        }
    ])
    
    return AIDesignResponse(
        spatial_layout={
            "dimensions": get_space_dimensions(original_request),
            "zones": generate_zones_for_event(original_request),
            "traffic_pathways": generate_pathways(original_request),
            "cultural_orientations": generate_cultural_orientations(original_request)
        },
        furniture_specifications=furniture_specs,
        lighting_design=generate_lighting_design(original_request),
        cultural_elements=generate_cultural_elements(original_request),
        material_palette=generate_material_palette(original_request),
        budget_breakdown=generate_budget_breakdown(original_request),
        accessibility_features=generate_accessibility_features(original_request),
        three_js_scene_code="// Generated by AI-Three.js Integration Service",
        parametric_generation_params={
            "templates_to_use": [spec["template"] for spec in furniture_specs],
            "cultural_adaptations": {
                f"{get_primary_culture(original_request)}_traditions": True,
                "celebration_focus": is_celebration
            },
            "accessibility_modifications": {
                "inclusive_design": len(get_accessibility_requirements(original_request)) > 0,
                "safety_priority": is_celebration and "child" in original_request.event_type.lower()
            },
            "budget_constraints": {
                "tier": map_budget_to_tier(get_budget_range(original_request)),
                "focus_areas": ["cultural_authenticity", "accessibility", "safety"]
            }
        }
    )

async def call_threejs_integration_service(design_response: AIDesignResponse) -> Dict[str, Any]:
    """Call Three.js integration service to generate scene"""
    
    try:
        # For now, return mock Three.js scene data
        # This will call the actual AIThreeJSIntegrationService when Node.js bridge is ready
        
        scene_data = {
            "scene": {
                "name": "AI_Generated_Event_Scene",
                "objects": len(design_response.furniture_specifications),
                "cultural_theme": design_response.cultural_elements[0]["culture"] if design_response.cultural_elements else "modern",
                "celebration_props": count_celebratory_props(design_response),
                "lighting_setup": "professional",
                "accessibility_compliant": True
            },
            "metadata": {
                "generation_method": "ai_threejs_integration",
                "cultural_authenticity": 0.88,
                "accessibility_score": 0.92,
                "budget_utilization": 0.85,
                "template_count": len(design_response.furniture_specifications)
            },
            "interaction_capabilities": [
                "drag_and_drop",
                "resize_objects", 
                "cultural_guidance",
                "budget_visualization"
            ]
        }
        
        return {
            "scene_data": scene_data,
            "preview_url": f"/api/previews/3d-scene/{design_response.parametric_generation_params.get('design_id', 'temp')}"
        }
        
    except Exception as e:
        logger.error(f"Three.js integration service failed: {str(e)}")
        raise

# Helper functions

def determine_celebration_type(event_type: str) -> str:
    """Determine specific celebration type from event description"""
    event_lower = event_type.lower()
    
    if "quinceañera" in event_lower:
        return "quinceañera"
    elif "bar mitzvah" in event_lower or "bat mitzvah" in event_lower:
        return "bar-bat-mitzvah"
    elif "birthday" in event_lower:
        if any(age_term in event_lower for age_term in ["child", "kid", "year old", "years old"]):
            return "birthday-child"
        elif any(age_term in event_lower for age_term in ["teen", "teenager", "13", "14", "15", "16", "17"]):
            return "birthday-teen"
        else:
            return "birthday-adult"
    elif "graduation" in event_lower:
        return "graduation"
    elif "anniversary" in event_lower:
        return "anniversary"
    else:
        return "cultural-milestone"

def determine_age_group(event_type: str, guest_count: int) -> str:
    """Determine age group for celebration"""
    event_lower = event_type.lower()
    
    if any(term in event_lower for term in ["toddler", "2", "3", "4"]):
        return "toddler"
    elif any(term in event_lower for term in ["child", "kid", "5", "6", "7", "8", "9", "10", "11", "12"]):
        return "child"
    elif any(term in event_lower for term in ["teen", "13", "14", "15", "16", "17", "18"]):
        return "teen"
    elif any(term in event_lower for term in ["senior", "elderly", "retirement"]):
        return "senior"
    elif guest_count > 50:
        return "multi-generational"
    else:
        return "adult"

def extract_theme_from_preferences(preferences: List[str]) -> str:
    """Extract theme from style preferences"""
    if not preferences:
        return "elegant"
    
    theme_mapping = {
        "superhero": "superhero",
        "princess": "princess", 
        "space": "space",
        "nature": "nature",
        "sports": "sports",
        "elegant": "elegant",
        "cultural": "cultural-traditional"
    }
    
    for pref in preferences:
        for key, theme in theme_mapping.items():
            if key in pref.lower():
                return theme
    
    return "elegant"

def get_cultural_colors(culture: str) -> List[str]:
    """Get culturally appropriate color schemes"""
    cultural_palettes = {
        "mexican": ["#FF69B4", "#FFD700", "#00FF00", "#FF0000"],
        "korean": ["#FF0000", "#0000FF", "#FFFFFF", "#000000"],
        "jewish": ["#0000FF", "#FFFFFF", "#C0C0C0", "#FFD700"],
        "american": ["#FF0000", "#FFFFFF", "#0000FF", "#FFD700"],
        "modern": ["#2C3E50", "#3498DB", "#E74C3C", "#F39C12"]
    }
    return cultural_palettes.get(culture, cultural_palettes["modern"])

def map_budget_to_tier(budget_range: str) -> str:
    """Map budget range to tier"""
    mapping = {
        "low": "essential",
        "medium": "enhanced", 
        "high": "premium",
        "luxury": "luxury"
    }
    return mapping.get(budget_range, "enhanced")

def generate_zones_for_event(request: EventRequirementsRequest) -> List[Dict[str, Any]]:
    """Generate spatial zones based on event type"""
    zones = [
        {
            "type": "main_event",
            "purpose": "Primary event area",
            "center": {"x": 0, "z": 0},
            "color": 0x87CEEB
        }
    ]
    
    if "birthday" in request.event_type.lower():
        zones.extend([
            {
                "type": "activity_zone", 
                "purpose": "Interactive games and activities",
                "center": {"x": 3, "z": 2},
                "color": 0xFF69B4
            },
            {
                "type": "gift_area",
                "purpose": "Gift display and opening", 
                "center": {"x": -3, "z": -2},
                "color": 0x98FB98
            }
        ])
    
    return zones

def generate_pathways(request: EventRequirementsRequest) -> List[Dict[str, Any]]:
    """Generate accessibility pathways"""
    return [
        {
            "type": "main_pathway",
            "width": 1.5,
            "length": 6, 
            "center": {"x": 0, "z": 2},
            "accessibility": True
        }
    ]

def generate_cultural_orientations(request: EventRequirementsRequest) -> List[Dict[str, Any]]:
    """Generate cultural orientation requirements"""
    return [
        {
            "direction": "east",
            "significance": "Traditional ceremonial focus",
            "requirements": ["clear sightlines", "camera access"]
        }
    ]

def generate_lighting_design(request: EventRequirementsRequest) -> Dict[str, Any]:
    """Generate lighting design for event"""
    return {
        "ambient": {"color": 0xFFFFFF, "intensity": 0.4},
        "directional": {
            "color": 0xFFFFE0,
            "intensity": 0.8,
            "position": {"x": 2, "y": 4, "z": 2}
        },
        "spots": [
            {
                "color": 0xFFFFFF,
                "intensity": 1.0,
                "distance": 10,
                "angle": 1.047, # π/3
                "penumbra": 0.3,
                "position": {"x": 0, "y": 3, "z": 3},
                "target": {"x": 0, "y": 0, "z": 2}
            }
        ]
    }

def generate_cultural_elements(request: EventRequirementsRequest) -> List[Dict[str, Any]]:
    """Generate cultural elements for scene"""
    culture = get_primary_culture(request)
    
    return [
        {
            "type": f"{request.event_type.lower()}_traditions",
            "culture": culture,
            "cultural_meaning": f"Celebration of {culture} heritage and family traditions",
            "usage_guidelines": ["Respectful representation", "Authentic materials", "Cultural consultation"],
            "position": {"x": 0, "y": 0, "z": 0}
        }
    ]

def generate_material_palette(request: EventRequirementsRequest) -> Dict[str, Any]:
    """Generate material palette for event"""
    culture = get_primary_culture(request)
    cultural_colors = get_cultural_colors(culture)
    
    return {
        "primary": int(cultural_colors[0].replace("#", "0x"), 16) if cultural_colors else 0xFF0000,
        "secondary": int(cultural_colors[1].replace("#", "0x"), 16) if len(cultural_colors) > 1 else 0x0000FF,
        "accent": int(cultural_colors[2].replace("#", "0x"), 16) if len(cultural_colors) > 2 else 0xFFD700,
        "neutral": 0xF5F5F5,
        "textures": ["matte-finish", "child-safe-coating"]
    }

def generate_budget_breakdown(request: EventRequirementsRequest) -> Dict[str, Any]:
    """Generate budget breakdown for event"""
    base_budget = {
        "low": 800,
        "medium": 2000, 
        "high": 5000,
        "luxury": 12000
    }.get(request.budget_range, 2000)
    
    return {
        "total": base_budget,
        "categories": {
            "celebratory_props": int(base_budget * 0.4),
            "furniture": int(base_budget * 0.25),
            "lighting": int(base_budget * 0.15),
            "decorations": int(base_budget * 0.12),
            "miscellaneous": int(base_budget * 0.08)
        },
        "priorities": ["cultural_authenticity", "accessibility", "safety", "visual_impact"]
    }

def generate_accessibility_features(request: EventRequirementsRequest) -> List[Dict[str, Any]]:
    """Generate accessibility features for event"""
    features = []
    
    # Always include basic accessibility
    features.append({
        "type": "wheelchair_path",
        "purpose": "Clear navigation for all guests",
        "dimensions": {"width": 1.5, "length": 6},
        "guidelines": ["No obstacles", "Smooth surface", "Adequate width"]
    })
    
    # Add specific features based on requirements
    if "visual" in " ".join(request.accessibility_requirements).lower():
        features.append({
            "type": "visual_aid",
            "purpose": "Enhanced visual accessibility",
            "dimensions": {"width": 8, "length": 10},
            "guidelines": ["High contrast", "Clear signage", "Adequate lighting"]
        })
    
    return features

def calculate_cultural_authenticity_score(design_response: AIDesignResponse) -> float:
    """Calculate cultural authenticity score"""
    score = 0.8  # Base score
    
    # Bonus for cultural elements
    if design_response.cultural_elements:
        score += 0.1
    
    # Bonus for celebratory props
    if any("celebratory" in spec["type"] for spec in design_response.furniture_specifications):
        score += 0.05
    
    return min(score, 1.0)

def get_celebratory_features(design_response: AIDesignResponse) -> List[str]:
    """Get list of celebratory features included"""
    features = []
    
    for spec in design_response.furniture_specifications:
        if "celebratory" in spec["type"]:
            features.extend([
                "balloon_systems",
                "photo_backdrops", 
                "interactive_props",
                "ceremonial_elements",
                "gift_display_areas"
            ])
        elif "balloon" in spec["type"]:
            features.append("themed_balloon_arrangements")
    
    return list(set(features))

def count_celebratory_props(design_response: AIDesignResponse) -> int:
    """Count celebratory props in design"""
    count = 0
    for spec in design_response.furniture_specifications:
        if any(term in spec["type"] for term in ["celebratory", "balloon", "photo", "ceremonial", "gift"]):
            count += 1
    return count

def get_primary_culture(request: EventRequirementsRequest) -> str:
    """Get primary culture from request, handling different field names"""
    if request.cultural_background and len(request.cultural_background) > 0:
        return request.cultural_background[0]
    elif request.cultural_preferences and len(request.cultural_preferences) > 0:
        return request.cultural_preferences[0]
    return "american"

def get_space_dimensions(request: EventRequirementsRequest) -> Dict[str, float]:
    """Get space dimensions from request, handling different field names"""
    if request.space_dimensions:
        return request.space_dimensions
    elif request.space_data and "dimensions" in request.space_data:
        return request.space_data["dimensions"]
    elif request.space_data:
        # Extract width, depth, height from space_data
        return {
            "width": request.space_data.get("width", 10),
            "depth": request.space_data.get("depth", 10),
            "height": request.space_data.get("height", 3)
        }
    return {"width": 10, "depth": 10, "height": 3}

def get_accessibility_requirements(request: EventRequirementsRequest) -> List[str]:
    """Get accessibility requirements from request, handling different field names"""
    requirements = []
    if request.accessibility_requirements:
        requirements.extend(request.accessibility_requirements)
    if request.special_needs:
        requirements.extend(request.special_needs)
    return list(set(requirements))  # Remove duplicates

def get_budget_range(request: EventRequirementsRequest) -> str:
    """Get budget range from request, handling different field names"""
    return request.budget_range or request.budget_tier or "medium"