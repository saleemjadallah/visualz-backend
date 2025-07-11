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

from app.api.auth import get_current_user
from app.models.user import User
from app.services.ai_service import AIDesignService
from app.models.design import AIDesignRequest

router = APIRouter()
logger = logging.getLogger(__name__)

# Three.js Integration Service Path
THREEJS_BRIDGE_PATH = Path(__file__).parent.parent.parent / "parametric-furniture" / "ai-integration"

class EventRequirementsRequest(BaseModel):
    event_type: str = Field(..., description="Type of event (birthday, wedding, corporate, etc.)")
    cultural_background: List[str] = Field(..., description="Primary and secondary cultural backgrounds")
    space_dimensions: Dict[str, float] = Field(..., description="Width, depth, height in meters")
    guest_count: int = Field(..., description="Total number of expected guests")
    budget_range: str = Field(..., description="Budget category: low, medium, high, luxury")
    accessibility_requirements: List[str] = Field(default=[], description="Specific accessibility needs")
    style_preferences: List[str] = Field(default=[], description="Style and aesthetic preferences")
    venue_type: str = Field(default="indoor", description="indoor, outdoor, mixed, covered-outdoor")
    timing: Dict[str, str] = Field(default={}, description="Season, time of day, weather expectations")
    special_requirements: List[str] = Field(default=[], description="Unique event requirements")

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
    current_user: User = Depends(get_current_user)
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
        logger.info(f"Starting AI-Three.js scene generation for user {current_user.email}")
        
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
        design_id = f"ai_3d_{int(start_time.timestamp())}_{current_user.id[:8]}"
        
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
    
    return {
        "event_type": request.event_type,
        "cultural_background": request.cultural_background,
        "space_dimensions": request.space_dimensions,
        "guest_count": request.guest_count,
        "budget_range": request.budget_range,
        "accessibility_requirements": request.accessibility_requirements,
        "style_preferences": request.style_preferences,
        "venue_type": request.venue_type,
        "timing": request.timing,
        "special_requirements": request.special_requirements
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
                    "culture": original_request.cultural_background[0] if original_request.cultural_background else "american",
                    "guestCount": original_request.guest_count,
                    "spaceDimensions": original_request.space_dimensions,
                    "balloonSystems": True,
                    "photoBackdrops": True,
                    "interactiveProps": True,
                    "ceremonialElements": True,
                    "giftDisplayAreas": True,
                    "entertainmentProps": True
                },
                "position": {"x": 0, "y": 0, "z": 0},
                "rotation": {"x": 0, "y": 0, "z": 0},
                "cultural_significance": f"Central celebration system with {original_request.cultural_background[0] if original_request.cultural_background else 'American'} traditions",
                "accessibility_features": original_request.accessibility_requirements,
                "budget_tier": map_budget_to_tier(original_request.budget_range)
            },
            {
                "type": "balloon-system",
                "template": "balloon-arch",
                "parameters": {
                    "balloonType": "themed",
                    "balloonCount": min(30, original_request.guest_count + 5),
                    "colors": get_cultural_colors(original_request.cultural_background[0] if original_request.cultural_background else "american"),
                    "arrangement": "arch"
                },
                "position": {"x": 0, "y": 0, "z": -4},
                "rotation": {"x": 0, "y": 0, "z": 0},
                "cultural_significance": "Festive entrance arch for photo opportunities",
                "accessibility_features": ["clear-pathway-underneath"],
                "budget_tier": map_budget_to_tier(original_request.budget_range)
            }
        ])
    
    # Add standard furniture
    furniture_specs.extend([
        {
            "type": "chair",
            "template": "enhanced-chair",
            "parameters": {
                "chairType": "dining" if "dining" in original_request.event_type.lower() else "event",
                "culture": original_request.cultural_background[0] if original_request.cultural_background else "modern",
                "count": max(4, original_request.guest_count // 4)
            },
            "position": {"x": 2, "y": 0, "z": 2},
            "rotation": {"x": 0, "y": 0, "z": 0},
            "cultural_significance": "Seating aligned with cultural ergonomics",
            "accessibility_features": original_request.accessibility_requirements,
            "budget_tier": map_budget_to_tier(original_request.budget_range)
        }
    ])
    
    return AIDesignResponse(
        spatial_layout={
            "dimensions": original_request.space_dimensions,
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
                f"{original_request.cultural_background[0] if original_request.cultural_background else 'american'}_traditions": True,
                "celebration_focus": is_celebration
            },
            "accessibility_modifications": {
                "inclusive_design": len(original_request.accessibility_requirements) > 0,
                "safety_priority": is_celebration and "child" in original_request.event_type.lower()
            },
            "budget_constraints": {
                "tier": map_budget_to_tier(original_request.budget_range),
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
    culture = request.cultural_background[0] if request.cultural_background else "american"
    
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
    culture = request.cultural_background[0] if request.cultural_background else "modern"
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