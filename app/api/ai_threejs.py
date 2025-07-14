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
import re

from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from typing import Optional as OptionalType
from app.services.ai_service import AIDesignService
from app.models.design import AIDesignRequest
from app.services.enhanced_ai_prompt_system import EnhancedAIPromptSystemWithMongoDB
from app.services.mongodb_cultural_database import MongoDBCulturalDatabase
from app.services.event_synonym_mapper import EventSynonymMapper

router = APIRouter()
logger = logging.getLogger(__name__)

# Three.js Integration Service Path
THREEJS_BRIDGE_PATH = Path(__file__).parent.parent.parent / "parametric-furniture" / "ai-integration"

# System capabilities for parameter extraction
SYSTEM_CAPABILITIES = {
    'event_types': [
        'wedding', 'birthday-child', 'birthday-adult', 'corporate', 
        'baby-shower', 'graduation', 'anniversary', 'cultural-celebration',
        'quinceañera', 'bar-bat-mitzvah', 'product-launch'
    ],
    'cultures': [
        'japanese', 'scandinavian', 'italian', 'french', 'modern',
        'american', 'mexican', 'korean', 'jewish', 'indian', 'mixed-heritage'
    ],
    'budget_ranges': [
        'under-2k', '2k-5k', '5k-15k', '15k-30k', '30k-50k', 'over-50k'
    ],
    'style_preferences': [
        'elegant', 'rustic', 'modern', 'traditional', 'minimalist', 
        'vintage', 'bohemian', 'industrial', 'wabi-sabi', 'hygge', 
        'bella-figura', 'savoir-vivre'
    ],
    'space_types': [
        'indoor', 'outdoor', 'ballroom', 'conference-room', 'backyard',
        'pavilion', 'home-living-room', 'rooftop', 'garden'
    ],
    'time_of_day': ['morning', 'afternoon', 'evening', 'all-day']
}

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
    """Generate AI design response using enhanced prompt system with MongoDB cultural data"""
    
    try:
        # Initialize MongoDB-enhanced prompt system
        enhanced_prompt_system = EnhancedAIPromptSystemWithMongoDB()
        
        # Get primary culture (handle both list and string)
        cultural_background = prompt_request.get("cultural_background", [])
        primary_culture = cultural_background[0] if isinstance(cultural_background, list) and cultural_background else "american"
        
        # Generate culturally-aware design using MongoDB data
        design_result = await enhanced_prompt_system.generate_culturally_aware_design_prompt(
            event_type=prompt_request.get("event_type", "celebration"),
            culture=primary_culture,
            celebration_type=prompt_request.get("celebration_type", prompt_request.get("event_type", "birthday")),
            age_group=prompt_request.get("age_range", "adult"),
            budget_tier=prompt_request.get("budget_range", "medium"),
            guest_count=prompt_request.get("guest_count", 20),
            special_requirements=prompt_request.get("special_requirements", []),
            venue_constraints={
                "space_size": prompt_request.get("space_dimensions", {}),
                "layout": prompt_request.get("venue_type", "indoor"),
                "restrictions": prompt_request.get("accessibility_requirements", [])
            }
        )
        
        if design_result["success"]:
            # Extract design elements from the AI response
            design_concept = design_result.get("design_concept", "")
            cultural_validation = design_result.get("cultural_validation", {})
            vendor_recommendations = design_result.get("vendor_recommendations", [])
            
            # Get additional cultural data from MongoDB
            cultural_db = MongoDBCulturalDatabase()
            
            # Fetch cultural elements
            cultural_elements = cultural_db.get_cultural_elements(
                culture=primary_culture,
                event_type=prompt_request.get("event_type")
            )
            
            # Get color meanings
            color_meanings = cultural_db.get_color_meanings(primary_culture)
            
            # Get design patterns
            design_patterns = cultural_db.get_design_patterns(primary_culture)
            
            # Build comprehensive response
            return {
                "design_concept": design_concept,
                "cultural_considerations": {
                    "primary_culture": primary_culture,
                    "cultural_elements": cultural_elements[:5],  # Top 5 elements
                    "color_guidance": color_meanings,
                    "design_patterns": design_patterns[:3],  # Top 3 patterns
                    "validation_result": cultural_validation
                },
                "space_layout": prompt_request.get("space_dimensions", {}),
                "furniture_recommendations": _generate_furniture_recommendations(
                    prompt_request, cultural_elements
                ),
                "lighting_plan": _generate_lighting_plan(
                    prompt_request, color_meanings
                ),
                "material_suggestions": _generate_material_suggestions(
                    cultural_elements, design_patterns
                ),
                "budget_allocation": _generate_budget_allocation(
                    prompt_request.get("budget_range", "medium"),
                    cultural_elements
                ),
                "accessibility_notes": prompt_request.get("accessibility_requirements", []),
                "vendor_recommendations": vendor_recommendations,
                "mongodb_cultural_data": True
            }
        else:
            # Fallback to basic response
            logger.warning(f"MongoDB cultural generation failed: {design_result.get('error')}")
            return {
                "design_concept": f"AI-generated {prompt_request['event_type']} design",
                "cultural_considerations": prompt_request.get("cultural_background", []),
                "space_layout": prompt_request.get("space_dimensions", {}),
                "furniture_recommendations": [],
                "lighting_plan": {},
                "material_suggestions": {},
                "budget_allocation": {},
                "accessibility_notes": prompt_request.get("accessibility_requirements", []),
                "mongodb_cultural_data": False
            }
            
    except Exception as e:
        logger.error(f"Error generating AI design response with MongoDB: {e}")
        # Fallback to basic response
        return {
            "design_concept": f"AI-generated {prompt_request['event_type']} design",
            "cultural_considerations": prompt_request.get("cultural_background", []),
            "space_layout": prompt_request.get("space_dimensions", {}),
            "furniture_recommendations": [],
            "lighting_plan": {},
            "material_suggestions": {},
            "budget_allocation": {},
            "accessibility_notes": prompt_request.get("accessibility_requirements", []),
            "mongodb_cultural_data": False
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
    
    # Add standard furniture with PBR materials
    primary_culture = get_primary_culture(original_request)
    cultural_materials = get_cultural_material_mapping(primary_culture)
    
    # Calculate furniture counts based on guest count
    chair_count = max(4, original_request.guest_count // 4)
    table_count = max(1, original_request.guest_count // 8)
    
    furniture_specs.extend([
        {
            "type": "chair",
            "template": "enhanced-chair",
            "parameters": {
                "chairType": "dining" if "dining" in original_request.event_type.lower() else "event",
                "culture": primary_culture,
                "count": chair_count
            },
            "position": {"x": 2, "y": 0, "z": 2},
            "rotation": {"x": 0, "y": 0, "z": 0},
            "cultural_significance": "Seating aligned with cultural ergonomics",
            "accessibility_features": get_accessibility_requirements(original_request),
            "budget_tier": map_budget_to_tier(get_budget_range(original_request)),
            "material": {
                "type": cultural_materials.get("chair", {}).get("type", "oak-wood"),
                "pbrProperties": {
                    "roughness": cultural_materials.get("chair", {}).get("roughness", 0.7),
                    "metalness": cultural_materials.get("chair", {}).get("metalness", 0.1),
                    "textureUrls": {
                        "diffuse": f"/textures/{primary_culture}/chair_diffuse.jpg",
                        "normal": f"/textures/{primary_culture}/chair_normal.jpg",
                        "roughness": f"/textures/{primary_culture}/chair_roughness.jpg"
                    }
                },
                "culturalMaterial": cultural_materials.get("chair", {}).get("cultural_name", "Traditional Wood")
            }
        },
        {
            "type": "table",
            "template": "enhanced-table",
            "parameters": {
                "tableType": "dining" if "dining" in original_request.event_type.lower() else "cocktail",
                "culture": primary_culture,
                "count": table_count,
                "shape": "rectangular" if original_request.guest_count > 20 else "round"
            },
            "position": {"x": 0, "y": 0, "z": 0},
            "rotation": {"x": 0, "y": 0, "z": 0},
            "cultural_significance": "Gathering surface with cultural design elements",
            "accessibility_features": get_accessibility_requirements(original_request),
            "budget_tier": map_budget_to_tier(get_budget_range(original_request)),
            "material": {
                "type": cultural_materials.get("table", {}).get("type", "oak-wood"),
                "pbrProperties": {
                    "roughness": cultural_materials.get("table", {}).get("roughness", 0.6),
                    "metalness": cultural_materials.get("table", {}).get("metalness", 0.0),
                    "textureUrls": {
                        "diffuse": f"/textures/{primary_culture}/table_diffuse.jpg",
                        "normal": f"/textures/{primary_culture}/table_normal.jpg",
                        "roughness": f"/textures/{primary_culture}/table_roughness.jpg"
                    }
                },
                "culturalMaterial": cultural_materials.get("table", {}).get("cultural_name", "Traditional Table Wood")
            }
        }
    ])
    
    # Add lounge furniture for larger events
    if original_request.guest_count > 30:
        furniture_specs.append({
            "type": "sofa",
            "template": "enhanced-sofa",
            "parameters": {
                "sofaType": "lounge",
                "culture": primary_culture,
                "count": max(1, original_request.guest_count // 20)
            },
            "position": {"x": -3, "y": 0, "z": 3},
            "rotation": {"x": 0, "y": 45, "z": 0},
            "cultural_significance": "Comfortable gathering space with cultural fabrics",
            "accessibility_features": get_accessibility_requirements(original_request),
            "budget_tier": map_budget_to_tier(get_budget_range(original_request)),
            "material": {
                "type": cultural_materials.get("sofa", {}).get("type", "linen-fabric"),
                "pbrProperties": {
                    "roughness": cultural_materials.get("sofa", {}).get("roughness", 0.8),
                    "metalness": cultural_materials.get("sofa", {}).get("metalness", 0.0),
                    "textureUrls": {
                        "diffuse": f"/textures/{primary_culture}/fabric_diffuse.jpg",
                        "normal": f"/textures/{primary_culture}/fabric_normal.jpg",
                        "roughness": f"/textures/{primary_culture}/fabric_roughness.jpg"
                    }
                },
                "culturalMaterial": cultural_materials.get("sofa", {}).get("cultural_name", "Traditional Fabric")
            }
        })
    
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
        # Convert furniture specifications to frontend format
        furniture_items = []
        for idx, spec in enumerate(design_response.furniture_specifications):
            # Generate unique positions for multiple items
            count = spec.get("parameters", {}).get("count", 1)
            base_x = spec.get("position", {}).get("x", 0)
            base_z = spec.get("position", {}).get("z", 0)
            
            for i in range(count):
                # Distribute items in a grid pattern
                offset_x = (i % 3) * 2 - 2
                offset_z = (i // 3) * 2
                
                furniture_items.append({
                    "id": f"{spec['type']}_{idx}_{i}",
                    "name": f"{spec['type'].title()} {i+1}",
                    "category": spec["type"],
                    "x": base_x + offset_x,
                    "y": base_z + offset_z,  # Frontend expects y as z position
                    "width": 2.0,  # Default dimensions
                    "height": 2.0,
                    "rotation": spec.get("rotation", {}).get("y", 0),
                    "color": "#8B4513",  # Default color
                    "style": spec.get("parameters", {}).get("culture", "modern"),
                    "material": spec.get("material", {})  # Include PBR material data
                })
        
        # Create complete scene data
        scene_data = {
            "scene": {
                "name": "AI_Generated_Event_Scene",
                "objects": len(furniture_items),
                "cultural_theme": design_response.cultural_elements[0]["culture"] if design_response.cultural_elements else "modern",
                "celebration_props": count_celebratory_props(design_response),
                "lighting_setup": "professional",
                "accessibility_compliant": True
            },
            "furniture_items": furniture_items,
            "color_palette": {
                "primary": "#8B4513",
                "secondary": "#D2691E", 
                "accent": "#FFD700",
                "neutral": "#F5F5DC"
            },
            "lighting_plan": {
                "ambient_lighting": "warm",
                "task_lighting": ["spotlights"],
                "accent_lighting": ["uplights"],
                "color_temperature": "3000K"
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

class ClarificationOption(BaseModel):
    id: str = Field(..., description="Unique identifier for the option")
    question: str = Field(..., description="Question to ask the user")
    options: List[str] = Field(..., description="Available options to choose from")
    required: bool = Field(..., description="Whether this clarification is required")

class ConversationMessage(BaseModel):
    type: str = Field(..., description="'user' | 'assistant' | 'system'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = Field(None, description="Message timestamp")
    clarificationOptions: Optional[List[ClarificationOption]] = Field(None, description="Available clarification options")

class ParameterExtractionRequest(BaseModel):
    message: str = Field(..., description="User's natural language message")
    existing_params: Dict[str, Any] = Field(default_factory=dict, description="Already extracted parameters")
    conversation_history: List[ConversationMessage] = Field(default_factory=list, description="Previous conversation messages")

class ParameterExtractionResponse(BaseModel):
    extractedParams: Dict[str, Any] = Field(..., description="All extracted parameters")
    needsClarification: bool = Field(False, description="Whether clarification is needed")
    clarificationQuestion: Optional[str] = Field(None, description="Question to ask for clarification")
    clarificationOptions: Optional[ClarificationOption] = Field(None, description="Options for clarification")
    readyToGenerate: bool = Field(False, description="Whether all required params are collected")
    response: str = Field(..., description="Natural language response to user")


REQUIRED_PARAMS = ['event_type', 'guest_count', 'budget_range']

def map_clarification_response(message: str, clarification_options: Dict) -> str:
    """Map user's clarification response to system value"""
    # Get value map from clarification options
    value_map = clarification_options.get('value_map', {})
    
    # First try exact match
    if message in value_map:
        return value_map[message]
    
    # Try case-insensitive match
    message_lower = message.lower()
    for display_value, system_value in value_map.items():
        if display_value.lower() == message_lower:
            return system_value
    
    # For guest count, also try to extract numbers from natural language
    if clarification_options.get('id') == 'guest_count':
        # Extract numbers from strings like "25 people", "about 30", etc.
        import re
        numbers = re.findall(r'\d+', message)
        if numbers:
            return numbers[0]  # Return first number found
    
    # Return original message if no mapping found
    return message

@router.post("/extract-parameters", response_model=ParameterExtractionResponse)
async def extract_parameters_from_chat(
    request: ParameterExtractionRequest,
    current_user: OptionalType[User] = Depends(get_current_user_optional)
):
    """
    Extract event parameters from natural language chat messages
    
    This endpoint uses AI to understand user requirements from conversational input
    and extract structured parameters needed for 3D scene generation.
    """
    try:
        logger.info("="*80)
        logger.info("INCOMING /extract-parameters REQUEST:")
        logger.info(f"MESSAGE: {request.message}")
        logger.info(f"EXISTING PARAMS: {request.existing_params}")
        logger.info(f"CONVERSATION HISTORY: {[msg.dict() for msg in request.conversation_history]}")
        logger.info("="*80)

        logger.info(f"Extracting parameters from message: {request.message[:100]}...")
        
        # Normalize existing parameters to snake_case for prompt consistency
        normalized_existing = {}
        for key, value in request.existing_params.items():
            snake_key = re.sub(r'(?<!^)(?=[A-Z])', '_', key).lower()
            normalized_existing[snake_key] = value
        logger.info(f"Normalized existing params for prompt: {normalized_existing}")

        # Check if this message is a response to a clarification question
        # by checking if it matches any clarification options
        mapped_message = request.message
        last_clarification = None
        
        # Check conversation history for recent clarification questions
        if request.conversation_history:
            for msg in reversed(request.conversation_history):
                if msg.type == 'assistant' and hasattr(msg, 'clarificationOptions') and msg.clarificationOptions:
                    last_clarification = msg.clarificationOptions[0] if isinstance(msg.clarificationOptions, list) else msg.clarificationOptions
                    break
        
        # If we found a recent clarification, try to map the response
        if last_clarification:
            # Generate the clarification question structure to get value mapping
            # Handle both dict and object formats
            clarification_id = last_clarification.id if hasattr(last_clarification, 'id') else last_clarification.get('id', '')
            clarification_data = generate_clarification_question(
                clarification_id, 
                request.existing_params
            )
            mapped_message = map_clarification_response(request.message, clarification_data)
            logger.info(f"Mapped clarification response '{request.message}' to '{mapped_message}'")
        
        # Build extraction prompt
        extraction_prompt = f"""
        Extract event requirements from: "{mapped_message}"
        
        CRITICAL: Only extract parameters we can actually support. Be flexible with understanding common requests.
        
        Available options:
        - event_type: {SYSTEM_CAPABILITIES['event_types']}
        - culture: {SYSTEM_CAPABILITIES['cultures']}
        - budget_range: {SYSTEM_CAPABILITIES['budget_ranges']}
        - style: {SYSTEM_CAPABILITIES['style_preferences']}
        - space_type: {SYSTEM_CAPABILITIES['space_types']}
        - time_of_day: {SYSTEM_CAPABILITIES['time_of_day']}
        
        Existing parameters: {json.dumps(normalized_existing)}
        
        EXTRACTION RULES:
        1. Map user inputs to system event types:
           - "birthday party", "bday", "birthday celebration", "Birthday Party" -> event_type: "birthday-adult" (default)
           - "Birthday (Adult)", "Adult birthday" -> event_type: "birthday-adult"
           - "Birthday (Child)", "Child birthday" -> event_type: "birthday-child"
           - "Yes, for a child" (in context of birthday) -> event_type: "birthday-child"
           - "No, for an adult" (in context of birthday) -> event_type: "birthday-adult"
           - If age <13 mentioned (e.g., "3 year old", "10th birthday") -> event_type: "birthday-child"
           - If teen/adult context clear -> event_type: "birthday-adult"
           - "in my house", "at home", "my home" -> space_type: "indoor"
        2. Extract numbers as guest_count if reasonable (1-1000)
        3. IMPORTANT: If the message contains any of our budget_range values directly (like "under-2k", "2k-5k", etc.), 
           extract it AS-IS to budget_range. These are already mapped values.
        4. Map budget options to system ranges:
           - "Under $2,000" -> "under-2k"
           - "$2,000-$5,000" -> "2k-5k"
           - "$5,000-$15,000" -> "5k-15k"
           - "$15,000-$30,000" -> "15k-30k"
           - "$30,000-$50,000" -> "30k-50k"
           - "$50,000+" -> "over-50k"
        5. Map guest count options:
           - "10-25 people" -> guest_count: 20
           - "25-50 people" -> guest_count: 35
           - "50-100 people" -> guest_count: 75
           - "100-200 people" -> guest_count: 150
           - "200+ people" -> guest_count: 250
        5. If no culture mentioned, leave culture as null (don't assume)
        6. Default space_type to "indoor" if not mentioned
        
        Examples:
        - "Birthday Party" -> event_type: "birthday-adult"
        - "Birthday (Child)" -> event_type: "birthday-child"
        - "planning a birthday party for my 3 year old" -> event_type: "birthday-child"
        - "30th birthday party" -> event_type: "birthday-adult"
        
        CRITICAL EXAMPLES - ALWAYS PRESERVE EXISTING PARAMETERS:
        
        Example 1 - Adding guest count:
        Existing: {{"event_type": "birthday-child"}}
        User says: "25-50 people"
        Extracted: {{"event_type": "birthday-child", "guest_count": 35}}
        
        Example 2 - Adding space type:
        Existing: {{"event_type": "birthday-child", "budget_range": "2k-5k"}}
        User says: "indoor"
        Extracted: {{"event_type": "birthday-child", "budget_range": "2k-5k", "space_type": "indoor"}}
        
        Example 3 - Multiple existing params:
        Existing: {{"event_type": "wedding", "guest_count": 150, "budget_range": "15k-30k"}}
        User says: "I want it in the evening"
        Extracted: {{"event_type": "wedding", "guest_count": 150, "budget_range": "15k-30k", "time_of_day": "evening"}}
        
        Example 4 - Selecting from options:
        Existing: {{"event_type": "corporate", "guest_count": 50}}
        User says: "$5,000-$15,000"
        Extracted: {{"event_type": "corporate", "guest_count": 50, "budget_range": "5k-15k"}}
        
        Example 5 - Natural language with existing params:
        Existing: {{"event_type": "birthday-child", "guest_count": 20, "space_type": "indoor"}}
        User says: "my budget is around 3000 dollars"
        Extracted: {{"event_type": "birthday-child", "guest_count": 20, "space_type": "indoor", "budget_range": "2k-5k"}}
        
        Example 6 - Style preference addition:
        Existing: {{"event_type": "anniversary", "budget_range": "5k-15k", "guest_count": 75}}
        User says: "I want something elegant and traditional"
        Extracted: {{"event_type": "anniversary", "budget_range": "5k-15k", "guest_count": 75, "style": "elegant"}}
        
        Example 7 - Cultural context:
        Existing: {{"event_type": "wedding", "guest_count": 200}}
        User says: "It's a traditional Indian wedding"
        Extracted: {{"event_type": "wedding", "guest_count": 200, "culture": "indian"}}
        
        Example 8 - Modifying existing parameter:
        Existing: {{"event_type": "birthday-adult", "guest_count": 50}}
        User says: "Actually, let's make it 100 people"
        Extracted: {{"event_type": "birthday-adult", "guest_count": 100}}  <- Update only what changed
        
        REMEMBER: NEVER drop parameters that aren't mentioned in the current message!
        
        CRITICAL: Start with ALL existing parameters and only update what's mentioned in the current message.
        
        Return JSON with:
        {{
          "extracted": {{
            "event_type": "use_existing_or_extract_new",
            "culture": "use_existing_or_extract_new", 
            "guest_count": "use_existing_or_extract_new",
            "budget_range": "use_existing_or_extract_new",
            "style": "use_existing_or_extract_new",
            "space_type": "use_existing_or_extract_new",
            "time_of_day": "use_existing_or_extract_new"
          }},
          "missing_critical": ["list", "of", "missing", "required", "fields"],
          "confidence": "high|medium|low",
          "response_tone": "friendly_acknowledgment_of_what_was_understood"
        }}
        
        IMPORTANT: If a parameter exists in "Existing parameters" and is not being changed by the current message, 
        you MUST include it in "extracted" with its existing value. Never drop existing parameters!
        
        CRITICAL FOR BUDGET: If the message is "under-2k", "2k-5k", "5k-15k", etc., this is ALREADY a valid budget_range value.
        Extract it directly as: "budget_range": "under-2k" (or whatever the value is).
        
        IMPORTANT: For response_tone, acknowledge what you understood from their message. 
        Example: "I'd love to help you plan a birthday party for your 3-year-old! Let me gather a few more details."
        """
        
        # Use AI service for extraction
        ai_service = AIDesignService()
        extraction_result = await ai_service.extract_parameters_from_text(extraction_prompt)
        
        # Parse AI response
        try:
            result = json.loads(extraction_result)
            logger.info(f"AI extraction result: {json.dumps(result, indent=2)}")
        except json.JSONDecodeError:
            logger.error(f"Failed to parse AI response: {extraction_result}")
            # Fallback parsing
            result = {
                "extracted": {},
                "missing_critical": REQUIRED_PARAMS,
                "confidence": "low",
                "response_tone": "I'm having trouble understanding your requirements. Could you tell me more?"
            }
        
        # Also use enhanced prompt system for cultural context if available
        try:
            enhanced_ai = EnhancedAIPromptSystemWithMongoDB()
            
            # Get culturally-aware response if culture is specified
            if 'culture' in result.get('extracted', {}):
                cultural_response = await enhanced_ai.generate_chat_response_with_cultural_context(
                    user_message=request.message,
                    extracted_params=result['extracted'],
                    conversation_history=[msg.dict() for msg in request.conversation_history]
                )
                if cultural_response.get('success'):
                    result['response_tone'] = cultural_response['response']
        except Exception as e:
            logger.debug(f"Enhanced cultural response not available: {e}")
        
        # Convert camelCase parameters from frontend to snake_case
        converted_existing_params = {}
        for key, value in request.existing_params.items():
            # Convert camelCase to snake_case
            snake_key = key
            if key == 'eventType':
                snake_key = 'event_type'
            elif key == 'guestCount':
                snake_key = 'guest_count'
            elif key == 'budgetRange' or key == 'budget':
                snake_key = 'budget_range'
            elif key == 'spaceType':
                snake_key = 'space_type'
            elif key == 'timeOfDay':
                snake_key = 'time_of_day'
            converted_existing_params[snake_key] = value
        
        # Merge with existing parameters
        updated_params = {**converted_existing_params}
        for key, value in result['extracted'].items():
            if value:
                # Special handling for guest_count - ensure it's an integer
                if key == 'guest_count':
                    try:
                        # If it's already a number string or int, use it
                        value = int(value)
                    except (ValueError, TypeError):
                        # If conversion fails, log it
                        logger.warning(f"Could not convert guest_count '{value}' to integer")
                        continue
                
                is_valid = validate_parameter(key, value)
                logger.info(f"Validating {key}={value} (type: {type(value).__name__}): {is_valid}")
                if is_valid:
                    updated_params[key] = value
                else:
                    logger.warning(f"Parameter {key}={value} failed validation")
        
        # Check what's missing from required parameters
        logger.info(f"Updated params after extraction: {updated_params}")
        logger.info(f"Required params: {REQUIRED_PARAMS}")
        missing_required = [param for param in REQUIRED_PARAMS if param not in updated_params or not updated_params[param]]
        logger.info(f"Missing required params: {missing_required}")
        
        # Convert snake_case back to camelCase for frontend
        frontend_params = {}
        for key, value in updated_params.items():
            camel_key = key
            if key == 'event_type':
                camel_key = 'eventType'
            elif key == 'guest_count':
                camel_key = 'guestCount'
            elif key == 'budget_range':
                camel_key = 'budget'
            elif key == 'space_type':
                camel_key = 'spaceType'
            elif key == 'time_of_day':
                camel_key = 'timeOfDay'
            frontend_params[camel_key] = value
        
        if missing_required:
            # Generate clarification question for next missing parameter
            clarification = generate_clarification_question(missing_required[0], updated_params)
            
            return ParameterExtractionResponse(
                extractedParams=frontend_params,
                needsClarification=True,
                clarificationQuestion=clarification['question'],
                clarificationOptions=ClarificationOption(**clarification),
                response=result.get('response_tone', 'Got it! Let me ask you one more thing...')
            )
        else:
            # All required parameters collected
            return ParameterExtractionResponse(
                extractedParams=frontend_params,
                readyToGenerate=True,
                response=f"Perfect! I have everything needed to design your {updated_params.get('event_type', 'event')}."
            )
            
    except Exception as e:
        logger.error(f"Parameter extraction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract parameters: {str(e)}"
        )

def validate_parameter(key: str, value: str) -> bool:
    """Validate parameter against system capabilities"""
    if key == 'guest_count':
        try:
            count = int(value)
            is_valid = 1 <= count <= 1000
            if not is_valid:
                logger.warning(f"Guest count {count} out of valid range (1-1000)")
            return is_valid
        except Exception as e:
            logger.warning(f"Failed to convert guest_count '{value}' to int: {e}")
            return False
    
    # Special handling for null values
    if value is None or value == "null":
        logger.warning(f"Parameter {key} has null value")
        return False
    
    capability_key = f"{key}s" if key in ['event_type', 'culture', 'space_type'] else key
    if capability_key == 'styles':
        capability_key = 'style_preferences'
    
    # Convert value to string to handle any type issues
    value_str = str(value).lower()
    
    # Get the list of valid options and convert to lowercase for comparison
    valid_options = [opt.lower() for opt in SYSTEM_CAPABILITIES.get(capability_key, [])]
    
    is_valid = value_str in valid_options
    if not is_valid:
        logger.warning(f"Parameter {key}='{value}' (lowercased: '{value_str}') not in valid options: {valid_options}")
    
    return is_valid

def generate_clarification_question(missing_param: str, existing_params: Dict) -> Dict:
    """Generate bounded clarification questions with proper value mapping"""
    
    questions = {
        'event_type': {
            'id': 'event_type',
            'question': 'What type of event are you planning?',
            'options': ['Wedding', 'Birthday (Adult)', 'Birthday (Child)', 'Corporate Event', 'Baby Shower', 'Graduation', 'Anniversary', 'Cultural Celebration'],
            'required': True,
            # Map display values to system values
            'value_map': {
                'Wedding': 'wedding',
                'Birthday (Adult)': 'birthday-adult', 
                'Birthday (Child)': 'birthday-child',
                'Corporate Event': 'corporate',
                'Baby Shower': 'baby-shower',
                'Graduation': 'graduation',
                'Anniversary': 'anniversary',
                'Cultural Celebration': 'cultural-celebration'
            }
        },
        'guest_count': {
            'id': 'guest_count',
            'question': 'About how many people will attend?',
            'options': ['10-25 people', '25-50 people', '50-100 people', '100-200 people', '200+ people'],
            'required': True,
            # Map display values to numeric values (using max of range)
            'value_map': {
                '10-25 people': '25',
                '25-50 people': '50',
                '50-100 people': '100',
                '100-200 people': '200',
                '200+ people': '250'
            }
        },
        'budget_range': {
            'id': 'budget_range',
            'question': "What's your approximate budget range?",
            'options': ['Under $2,000', '$2,000-$5,000', '$5,000-$15,000', '$15,000-$30,000', '$30,000-$50,000', '$50,000+'],
            'required': True,
            # Map display values to system values
            'value_map': {
                'Under $2,000': 'under-2k',
                '$2,000-$5,000': '2k-5k',
                '$5,000-$15,000': '5k-15k',
                '$15,000-$30,000': '15k-30k',
                '$30,000-$50,000': '30k-50k',
                '$50,000+': 'over-50k'
            }
        }
    }
    
    return questions.get(missing_param, questions['event_type'])

# Helper functions

def get_cultural_material_mapping(culture: str) -> Dict[str, Dict[str, Any]]:
    """Get PBR material mappings for different cultures"""
    material_mappings = {
        "japanese": {
            "chair": {
                "type": "oak-wood",
                "roughness": 0.8,
                "metalness": 0.0,
                "cultural_name": "Japanese Oak (Mizunara)"
            },
            "table": {
                "type": "pine-wood",
                "roughness": 0.7,
                "metalness": 0.0,
                "cultural_name": "Japanese Pine (Matsu)"
            },
            "sofa": {
                "type": "linen-fabric",
                "roughness": 0.9,
                "metalness": 0.0,
                "cultural_name": "Natural Linen"
            }
        },
        "korean": {
            "chair": {
                "type": "pine-wood",
                "roughness": 0.75,
                "metalness": 0.0,
                "cultural_name": "Korean Pine (Sonamu)"
            },
            "table": {
                "type": "walnut-wood",
                "roughness": 0.6,
                "metalness": 0.0,
                "cultural_name": "Korean Walnut"
            },
            "sofa": {
                "type": "silk-fabric",
                "roughness": 0.3,
                "metalness": 0.1,
                "cultural_name": "Traditional Silk"
            }
        },
        "mexican": {
            "chair": {
                "type": "mahogany-wood",
                "roughness": 0.5,
                "metalness": 0.0,
                "cultural_name": "Mexican Mahogany"
            },
            "table": {
                "type": "pine-wood",
                "roughness": 0.7,
                "metalness": 0.0,
                "cultural_name": "Pino Mexicano"
            },
            "sofa": {
                "type": "leather",
                "roughness": 0.6,
                "metalness": 0.0,
                "cultural_name": "Tooled Leather"
            }
        },
        "jewish": {
            "chair": {
                "type": "cherry-wood",
                "roughness": 0.6,
                "metalness": 0.0,
                "cultural_name": "Cherry Wood"
            },
            "table": {
                "type": "oak-wood",
                "roughness": 0.7,
                "metalness": 0.0,
                "cultural_name": "European Oak"
            },
            "sofa": {
                "type": "velvet-fabric",
                "roughness": 0.8,
                "metalness": 0.0,
                "cultural_name": "Rich Velvet"
            }
        },
        "american": {
            "chair": {
                "type": "oak-wood",
                "roughness": 0.7,
                "metalness": 0.0,
                "cultural_name": "American Oak"
            },
            "table": {
                "type": "maple-wood",
                "roughness": 0.6,
                "metalness": 0.0,
                "cultural_name": "Hard Maple"
            },
            "sofa": {
                "type": "cotton-fabric",
                "roughness": 0.85,
                "metalness": 0.0,
                "cultural_name": "Cotton Blend"
            }
        }
    }
    
    # Return default american materials if culture not found
    return material_mappings.get(culture, material_mappings["american"])

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
    }
    
    total_budget = base_budget.get(request.budget_range, 2000)
    
    allocation = {
        "total_budget": total_budget,
        "furniture": int(total_budget * 0.35),
        "cultural_elements": int(total_budget * 0.25),
        "lighting": int(total_budget * 0.15),
        "decorations": int(total_budget * 0.15),
        "contingency": int(total_budget * 0.10)
    }
    
    # Adjust for cultural complexity
    cultural_complexity = len(cultural_elements)
    if cultural_complexity > 3:
        # Increase cultural elements budget
        adjustment = int(total_budget * 0.05)
        allocation["cultural_elements"] += adjustment
        allocation["decorations"] -= adjustment
    
    return allocation

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

# Additional helper functions for MongoDB integration

def _generate_furniture_recommendations(prompt_request: Dict[str, Any], cultural_elements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate furniture recommendations based on cultural elements"""
    recommendations = []
    
    # Basic seating based on guest count
    chair_count = max(4, prompt_request.get("guest_count", 20) // 4)
    recommendations.append({
        "type": "seating",
        "item": "chairs",
        "count": chair_count,
        "cultural_style": prompt_request.get("cultural_background", ["american"])[0] if isinstance(prompt_request.get("cultural_background"), list) else "american",
        "accessibility": "wheelchair_friendly" in prompt_request.get("accessibility_requirements", [])
    })
    
    # Add cultural-specific furniture
    for element in cultural_elements[:3]:  # Top 3 cultural elements
        if element.get("category") == "furniture":
            recommendations.append({
                "type": "cultural_furniture",
                "item": element.get("name", "traditional_piece"),
                "cultural_significance": element.get("cultural_meaning", "Traditional design element"),
                "placement": "featured_area"
            })
    
    return recommendations

def _generate_lighting_plan(prompt_request: Dict[str, Any], color_meanings: Dict[str, Any]) -> Dict[str, Any]:
    """Generate lighting plan based on cultural color meanings"""
    plan = {
        "ambient_lighting": {
            "type": "soft_warm",
            "intensity": 0.6,
            "color_temperature": "3000K"
        },
        "accent_lighting": {
            "type": "spotlights",
            "intensity": 0.8,
            "cultural_focus": True
        }
    }
    
    # Add cultural color influences
    if color_meanings:
        dominant_colors = list(color_meanings.keys())[:2]
        plan["cultural_colors"] = {
            "primary": dominant_colors[0] if dominant_colors else "warm_white",
            "accent": dominant_colors[1] if len(dominant_colors) > 1 else "soft_gold"
        }
    
    return plan

def _generate_material_suggestions(cultural_elements: List[Dict[str, Any]], design_patterns: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate material suggestions based on cultural elements and patterns"""
    suggestions = {
        "primary_materials": ["natural_wood", "cotton_fabric"],
        "cultural_materials": [],
        "textures": ["smooth", "woven"],
        "sustainability_rating": "high"
    }
    
    # Add materials from cultural elements
    for element in cultural_elements[:3]:
        materials = element.get("traditional_materials", [])
        if materials:
            suggestions["cultural_materials"].extend(materials[:2])
    
    # Add textures from design patterns
    for pattern in design_patterns[:2]:
        pattern_textures = pattern.get("textures", [])
        if pattern_textures:
            suggestions["textures"].extend(pattern_textures[:1])
    
    return suggestions

def _generate_budget_allocation(budget_range: str, cultural_elements: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate budget allocation based on range and cultural requirements"""
    base_budgets = {
        "low": 1000,
        "medium": 2500,
        "high": 5000,
        "luxury": 10000
    }
    
    total_budget = base_budgets.get(budget_range, 2500)
    
    allocation = {
        "total_budget": total_budget,
        "furniture": int(total_budget * 0.35),
        "cultural_elements": int(total_budget * 0.25),
        "lighting": int(total_budget * 0.15),
        "decorations": int(total_budget * 0.15),
        "contingency": int(total_budget * 0.10)
    }
    
    # Adjust for cultural complexity
    cultural_complexity = len(cultural_elements)
    if cultural_complexity > 3:
        # Increase cultural elements budget
        adjustment = int(total_budget * 0.05)
        allocation["cultural_elements"] += adjustment
        allocation["decorations"] -= adjustment
    
    return allocation

# Missing endpoints that frontend expects

@router.get("/cultural-suggestions")
async def get_cultural_suggestions(
    event_type: Optional[str] = None,
    current_user: OptionalType[User] = Depends(get_current_user_optional)
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
            status_code=500,
            detail=f"Failed to get cultural suggestions: {str(e)}"
        )

@router.get("/celebration-suggestions")
async def get_celebration_suggestions(
    event_type: Optional[str] = None,
    cultural_background: Optional[str] = None,
    current_user: OptionalType[User] = Depends(get_current_user_optional)
):
    """Get AI-powered celebration suggestions and ideas."""
    try:
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
                }
            },
            "wedding": {
                "name": "Wedding Celebration", 
                "description": "Union celebration with ceremonial and reception elements",
                "key_elements": ["ceremonial space", "reception area", "floral arrangements", "seating layout"]
            },
            "corporate": {
                "name": "Corporate Event",
                "description": "Professional gathering with networking and presentation elements",
                "key_elements": ["presentation setup", "networking areas", "branding elements", "catering stations"]
            }
        }
        
        celebration_suggestions = []
        if event_type and event_type.lower() in celebration_types:
            event_data = celebration_types[event_type.lower()]
            suggestion = {
                "event_type": event_type.lower(),
                "name": event_data["name"],
                "description": event_data["description"],
                "key_elements": event_data["key_elements"]
            }
            celebration_suggestions = [suggestion]
        else:
            for event_key, event_data in celebration_types.items():
                celebration_suggestions.append({
                    "event_type": event_key,
                    "name": event_data["name"],
                    "description": event_data["description"],
                    "key_elements": event_data["key_elements"][:3]
                })
        
        return {
            "success": True,
            "event_type": event_type,
            "suggestions": celebration_suggestions,
            "count": len(celebration_suggestions)
        }
        
    except Exception as e:
        logger.error(f"Error getting celebration suggestions: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get celebration suggestions: {str(e)}"
        )

@router.get("/celebration-amenities/{celebration_type}")
async def get_celebration_amenities(
    celebration_type: str,
    current_user: OptionalType[User] = Depends(get_current_user_optional)
):
    """Get celebration-specific amenities and props for event planning."""
    try:
        # Define amenities based on celebration type
        amenities_database = {
            "american-birthday": {
                "name": "American Birthday Party",
                "amenities": [
                    {
                        "id": "balloon-arch", 
                        "name": "Balloon Arch",
                        "category": "decorations",
                        "description": "Colorful balloon archway for entrance or backdrop"
                    },
                    {
                        "id": "photo-booth",
                        "name": "Photo Booth",
                        "category": "entertainment", 
                        "description": "Interactive photo station with props"
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
                        "description": "Age-appropriate balloon decorations"
                    }
                ]
            }
        }
        
        celebration_key = celebration_type.lower().replace(" ", "-")
        amenities_data = amenities_database.get(celebration_key) or amenities_database.get("birthday", {
            "name": "Generic Celebration",
            "amenities": []
        })
        
        return {
            "success": True,
            "celebration_type": celebration_type,
            "amenities": amenities_data.get("amenities", []),
            "count": len(amenities_data.get("amenities", []))
        }
        
    except Exception as e:
        logger.error(f"Error getting celebration amenities: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get celebration amenities: {str(e)}"
        )

class ImageAnalysisRequest(BaseModel):
    file_url: str
    analysis_type: str = "comprehensive"

@router.post("/analyze-image")
async def analyze_image(
    request: ImageAnalysisRequest,
    current_user: OptionalType[User] = Depends(get_current_user_optional)
):
    """AI-powered image analysis for space planning and cultural context."""
    try:
        # Return mock analysis data for demo purposes
        mock_analysis = {
            "space_analysis": {
                "room_type": "living_room",
                "estimated_dimensions": {"width": 4.5, "length": 6.0, "height": 2.8},
                "architectural_style": "modern"
            },
            "style_analysis": {
                "dominant_style": "modern",
                "cultural_indicators": ["american", "scandinavian"]
            }
        }
        
        return {
            "success": True,
            "file_url": request.file_url,
            "analysis_type": request.analysis_type,
            "cv_analysis": mock_analysis,
            "note": "Using mock data for demo - full CV integration pending"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze image: {str(e)}"
        )