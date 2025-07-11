from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from enum import Enum
import json
import logging
import subprocess
import asyncio
from datetime import datetime
from pathlib import Path

# Import auth and user models
from app.api.auth import get_current_user
from app.models.user import User
from typing import Optional as OptionalType
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token
from bson import ObjectId
from app.services.database import get_database

router = APIRouter()
logger = logging.getLogger(__name__)

# Optional authentication for development/demo purposes
security_optional = HTTPBearer(auto_error=False)

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional)) -> Optional[User]:
    """Get current user if authenticated, otherwise return None for demo purposes."""
    if not credentials:
        logger.info("No authentication provided - running in demo mode")
        return None
    
    try:
        token_data = verify_token(credentials.credentials)
        if not token_data:
            return None
        
        user_id = token_data.get("sub")
        if not user_id:
            return None
        
        # Get user from database
        db = await get_database()
        user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user_doc:
            return None
        
        # Convert to User model
        user = User(
            id=str(user_doc["_id"]),
            email=user_doc["email"],
            full_name=user_doc["full_name"],
            preferences=user_doc.get("preferences", {}),
            is_active=user_doc["is_active"],
            created_at=user_doc["created_at"],
            updated_at=user_doc["updated_at"]
        )
        return user
    except Exception as e:
        logger.warning(f"Optional auth failed: {str(e)} - continuing without auth")
        return None

# Base directory for parametric templates
PARAMETRIC_BASE_DIR = Path(__file__).parent.parent.parent / "parametric-furniture"

# Mock data for testing until TypeScript templates are fully integrated
MOCK_MODE = True  # Set to False once TypeScript integration is ready

class CultureType(str, Enum):
    japanese = "japanese"
    scandinavian = "scandinavian" 
    italian = "italian"
    french = "french"
    modern = "modern"

class FormalityLevel(str, Enum):
    casual = "casual"
    semi_formal = "semi-formal"
    formal = "formal"
    ceremonial = "ceremonial"

class UserFurnitureRequest(BaseModel):
    eventType: str
    culture: CultureType
    guestCount: int
    spaceDimensions: Dict[str, float]
    budgetRange: str = Field(..., pattern="^(low|medium|high|luxury)$")
    formalityLevel: FormalityLevel
    specialRequirements: str

class LightingParameters(BaseModel):
    culture: CultureType
    eventType: str
    timeOfDay: str = "evening"
    season: str = "spring"
    spaceType: str = "indoor"
    spaceDimensions: Dict[str, float]
    ambiance: str = "serene"
    functionality: str = "balanced"
    powerBudget: int
    installationComplexity: str = "moderate"
    weatherResistance: bool = False
    traditionalElements: List[str] = []
    colorTemperature: str = "warm"
    brightness: str = "moderate"

class FloralParameters(BaseModel):
    culture: CultureType
    eventType: str
    formality: FormalityLevel
    season: str = "spring"
    arrangementStyle: str = "centerpiece"
    scale: str = "medium"
    colorScheme: str = "natural"
    budget: int
    venue: str = "indoor"
    duration: int = 6
    maintenance: str = "medium"
    symbolism: List[str] = []
    traditionalFlowers: List[str] = []
    avoidFlowers: List[str] = []
    localSourcing: bool = True
    sustainablePractices: bool = True
    reusability: bool = False

class StageParameters(BaseModel):
    performanceType: str
    audienceSize: int
    interactionLevel: str = "performance-only"
    audioRequirements: str = "basic"
    visualRequirements: str = "standard"
    lightingIntegration: bool = True
    culture: CultureType
    ceremony: bool = False
    traditionalElements: List[str] = []
    spaceDimensions: Dict[str, float]
    budget: int
    setupTime: int = 4
    weatherProtection: bool = False
    accessibilityRequired: bool = False
    multilingual: bool = False
    hearingAssistance: bool = False
    visualAssistance: bool = False

class CompleteEventSpec(BaseModel):
    furniture: UserFurnitureRequest
    lighting: Optional[LightingParameters] = None
    floral: Optional[FloralParameters] = None
    stage: Optional[StageParameters] = None

class GenerationOptions(BaseModel):
    includeCulturalAnalysis: bool = True
    generateRecommendations: bool = True
    optimizeForBudget: bool = True

class ParametricGenerationResult(BaseModel):
    success: bool
    models: List[Dict[str, Any]] = []
    culturalScore: float = 85.0
    recommendations: List[str] = []
    generation_time: float = 0.0
    metadata: Dict[str, Any] = {}

class CompleteEventResult(BaseModel):
    furniture: ParametricGenerationResult
    lighting: Optional[Dict[str, Any]] = None
    floral: Optional[Dict[str, Any]] = None
    stage: Optional[Dict[str, Any]] = None
    summary: Dict[str, Any]
    previewUrl: Optional[str] = None
    designId: str

@router.post("/furniture/generate", response_model=ParametricGenerationResult)
async def generate_parametric_furniture(
    request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate parametric furniture using AI and cultural intelligence
    """
    try:
        start_time = datetime.now()
        
        # Log the incoming request for debugging
        logger.info(f"Received furniture generation request: {request}")
        
        # Handle different request formats
        if 'request' in request:
            # Format: {"request": {...}, "options": {...}}
            furniture_data = request.get('request', {})
            options_data = request.get('options', {})
        else:
            # Format: direct data
            furniture_data = request
            options_data = {}
        
        logger.info(f"Parsed furniture_data: {furniture_data}")
        logger.info(f"Parsed options_data: {options_data}")
        
        # Extract request data with better error handling
        try:
            furniture_request = UserFurnitureRequest(**furniture_data)
            options = GenerationOptions(**options_data)
        except Exception as parse_error:
            logger.error(f"Failed to parse request data: {str(parse_error)}")
            logger.error(f"furniture_data: {furniture_data}")
            logger.error(f"options_data: {options_data}")
            raise HTTPException(status_code=400, detail=f"Invalid request format: {str(parse_error)}")
        
        logger.info(f"Generating furniture for {furniture_request.culture} {furniture_request.eventType}")
        
        # Run parametric furniture generation 
        if MOCK_MODE:
            result = get_mock_furniture_result(furniture_request)
        else:
            result = await run_parametric_generation("furniture", {
                "culture": furniture_request.culture,
                "eventType": furniture_request.eventType,
                "guestCount": furniture_request.guestCount,
                "spaceDimensions": furniture_request.spaceDimensions,
                "budgetRange": furniture_request.budgetRange,
                "formalityLevel": furniture_request.formalityLevel,
                "specialRequirements": furniture_request.specialRequirements
            })
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        # Calculate cultural authenticity score
        cultural_score = calculate_cultural_score(furniture_request.culture, result)
        
        # Generate recommendations
        recommendations = generate_furniture_recommendations(furniture_request, result)
        
        response = ParametricGenerationResult(
            success=True,
            models=result.get('models', []),
            culturalScore=cultural_score,
            recommendations=recommendations,
            generation_time=generation_time,
            metadata={
                "culture": furniture_request.culture,
                "eventType": furniture_request.eventType,
                "guestCount": furniture_request.guestCount,
                "generatedAt": datetime.now().isoformat()
            }
        )
        
        logger.info(f"Generated furniture in {generation_time:.2f}s with cultural score {cultural_score}")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error generating parametric furniture: {str(e)}")
        logger.error(f"Request data: {request}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Furniture generation failed: {str(e)}")

@router.post("/lighting/generate")
async def generate_parametric_lighting(
    request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate parametric lighting using AI and cultural intelligence
    """
    try:
        start_time = datetime.now()
        
        # Extract parameters from request
        parameters = LightingParameters(**request.get('parameters', {}))
        
        logger.info(f"Generating lighting for {parameters.culture} {parameters.eventType}")
        
        # Run parametric lighting generation
        result = await run_parametric_generation("lighting", parameters.dict())
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        response = {
            "success": True,
            "setup": result.get('setup', {}),
            "ambiance": parameters.ambiance,
            "powerUsage": result.get('powerUsage', 0),
            "culturalElements": result.get('culturalElements', []),
            "generation_time": generation_time,
            "metadata": {
                "culture": parameters.culture,
                "eventType": parameters.eventType,
                "generatedAt": datetime.now().isoformat()
            }
        }
        
        logger.info(f"Generated lighting in {generation_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Error generating parametric lighting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lighting generation failed: {str(e)}")

@router.post("/floral/generate")
async def generate_parametric_floral(
    request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate parametric floral arrangements using AI and cultural intelligence
    """
    try:
        start_time = datetime.now()
        
        # Extract parameters from request
        parameters = FloralParameters(**request.get('parameters', {}))
        
        logger.info(f"Generating floral for {parameters.culture} {parameters.eventType}")
        
        # Run parametric floral generation
        result = await run_parametric_generation("floral", parameters.dict())
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        # Calculate sustainability score
        sustainability_score = calculate_sustainability_score(parameters, result)
        
        response = {
            "success": True,
            "arrangements": result.get('arrangements', []),
            "seasonalElements": result.get('seasonalElements', []),
            "sustainabilityScore": sustainability_score,
            "culturalElements": result.get('culturalElements', []),
            "generation_time": generation_time,
            "metadata": {
                "culture": parameters.culture,
                "eventType": parameters.eventType,
                "season": parameters.season,
                "generatedAt": datetime.now().isoformat()
            }
        }
        
        logger.info(f"Generated floral in {generation_time:.2f}s with sustainability score {sustainability_score}")
        return response
        
    except Exception as e:
        logger.error(f"Error generating parametric floral: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Floral generation failed: {str(e)}")

@router.post("/stage/generate")
async def generate_parametric_stage(
    request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate parametric stage/entertainment systems using AI and cultural intelligence
    """
    try:
        start_time = datetime.now()
        
        # Extract parameters from request
        parameters = StageParameters(**request.get('parameters', {}))
        
        logger.info(f"Generating stage for {parameters.culture} {parameters.performanceType}")
        
        # Run parametric stage generation
        result = await run_parametric_generation("stage", parameters.dict())
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        response = {
            "success": True,
            "configuration": result.get('configuration', {}),
            "accessibilityFeatures": result.get('accessibilityFeatures', []),
            "audioSpecs": result.get('audioSpecs', {}),
            "culturalElements": result.get('culturalElements', []),
            "generation_time": generation_time,
            "metadata": {
                "culture": parameters.culture,
                "performanceType": parameters.performanceType,
                "audienceSize": parameters.audienceSize,
                "generatedAt": datetime.now().isoformat()
            }
        }
        
        logger.info(f"Generated stage in {generation_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Error generating parametric stage: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stage generation failed: {str(e)}")

@router.post("/render/complete-scene")
async def render_complete_scene(
    scene_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Render complete 3D scene with all parametric elements
    """
    try:
        start_time = datetime.now()
        
        logger.info("Rendering complete 3D scene")
        
        # Extract render options
        render_options = scene_data.get('renderOptions', {})
        quality = render_options.get('quality', 'medium')
        cultural_theme = render_options.get('culturalTheme', 'modern')
        
        # Simulate 3D rendering process
        await asyncio.sleep(2)  # Simulate rendering time
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        # Generate preview URL pointing to backend domain
        preview_url = f"https://visualz.xyz/api/previews/scene_{int(datetime.now().timestamp())}.png"
        
        response = {
            "success": True,
            "previewUrl": preview_url,
            "quality": quality,
            "culturalTheme": cultural_theme,
            "renderTime": generation_time,
            "metadata": {
                "renderOptions": render_options,
                "generatedAt": datetime.now().isoformat()
            }
        }
        
        logger.info(f"Rendered scene in {generation_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Error rendering scene: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scene rendering failed: {str(e)}")

@router.post("/generate-complete-event")
async def generate_complete_event(
    event_spec: CompleteEventSpec,
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate complete event with furniture, lighting, floral, and stage systems
    """
    try:
        start_time = datetime.now()
        design_id = f"design_{int(datetime.now().timestamp())}_{hash(str(event_spec)) % 10000}"
        
        logger.info(f"Generating complete event {design_id}")
        
        # Generate furniture
        furniture_result = await generate_parametric_furniture(
            {"request": event_spec.furniture.dict(), "options": {"includeCulturalAnalysis": True}},
            background_tasks,
            current_user
        )
        
        # Generate lighting if specified
        lighting_result = None
        if event_spec.lighting:
            lighting_result = await generate_parametric_lighting(
                event_spec.lighting, background_tasks, current_user
            )
        
        # Generate floral if specified
        floral_result = None
        if event_spec.floral:
            floral_result = await generate_parametric_floral(
                event_spec.floral, background_tasks, current_user
            )
        
        # Generate stage if specified
        stage_result = None
        if event_spec.stage:
            stage_result = await generate_parametric_stage(
                event_spec.stage, background_tasks, current_user
            )
        
        # Render complete scene
        scene_data = {
            "furniture": furniture_result.dict() if furniture_result else None,
            "lighting": lighting_result,
            "floral": floral_result,
            "stage": stage_result,
            "renderOptions": {
                "quality": "high",
                "culturalTheme": event_spec.furniture.culture,
                "includeMetadata": True
            }
        }
        
        render_result = await render_complete_scene(scene_data, background_tasks, current_user)
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        # Calculate overall scores
        cultural_authenticity = furniture_result.culturalScore if furniture_result else 85.0
        sustainability_score = floral_result.get('sustainabilityScore', 75.0) if floral_result else 75.0
        
        response = CompleteEventResult(
            furniture=furniture_result,
            lighting=lighting_result,
            floral=floral_result,
            stage=stage_result,
            summary={
                "totalBudget": calculate_total_budget(event_spec),
                "culturalAuthenticity": cultural_authenticity,
                "sustainabilityScore": sustainability_score,
                "accessibility": extract_accessibility_features(event_spec),
                "timeline": "2-3 weeks for full implementation",
                "generationTime": generation_time
            },
            previewUrl=render_result.get('previewUrl'),
            designId=design_id
        )
        
        logger.info(f"Generated complete event {design_id} in {generation_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Error generating complete event: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Complete event generation failed: {str(e)}")

# Helper functions
async def run_parametric_generation(template_type: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run parametric generation using Node.js/TypeScript templates
    """
    try:
        # In production, this would call the actual TypeScript parametric generation
        # For now, return mock data that matches the expected structure
        
        if template_type == "furniture":
            return {
                "models": [
                    {
                        "id": f"furniture_{int(datetime.now().timestamp())}",
                        "type": "chair",
                        "culture": parameters.get('culture', 'modern'),
                        "geometry": {"vertices": 800, "faces": 1200},
                        "materials": ["wood", "fabric"],
                        "culturalScore": 88.5
                    }
                ],
                "culturalElements": ["clean lines", "natural materials"],
                "recommendations": ["Consider adding cushions for comfort"]
            }
        elif template_type == "lighting":
            return {
                "setup": {
                    "ambient": ["ceiling lights", "wall sconces"],
                    "task": ["table lamps"],
                    "accent": ["decorative fixtures"]
                },
                "powerUsage": parameters.get('powerBudget', 500),
                "culturalElements": get_cultural_lighting_elements(parameters.get('culture', 'modern'))
            }
        elif template_type == "floral":
            return {
                "arrangements": [
                    {
                        "type": "centerpiece",
                        "flowers": get_cultural_flowers(parameters.get('culture', 'modern')),
                        "size": parameters.get('scale', 'medium')
                    }
                ],
                "seasonalElements": get_seasonal_elements(parameters.get('season', 'spring')),
                "culturalElements": get_cultural_floral_elements(parameters.get('culture', 'modern'))
            }
        elif template_type == "stage":
            return {
                "configuration": {
                    "platform": {"width": 4, "depth": 3, "height": 0.3},
                    "audio": {"speakers": 4, "microphones": 2},
                    "lighting": {"spots": 6, "ambient": 4}
                },
                "accessibilityFeatures": get_accessibility_features(parameters),
                "audioSpecs": {"power": "500W", "frequency": "20Hz-20kHz"},
                "culturalElements": get_cultural_stage_elements(parameters.get('culture', 'modern'))
            }
        
        return {"success": True, "data": {}}
        
    except Exception as e:
        logger.error(f"Error in parametric generation: {str(e)}")
        raise

def calculate_cultural_score(culture: CultureType, result: Dict[str, Any]) -> float:
    """Calculate cultural authenticity score"""
    base_score = 85.0
    
    # Add bonus for cultural elements
    cultural_elements = result.get('culturalElements', [])
    cultural_bonus = min(len(cultural_elements) * 2, 10)
    
    return min(base_score + cultural_bonus, 100.0)

def calculate_sustainability_score(parameters: FloralParameters, result: Dict[str, Any]) -> float:
    """Calculate sustainability score for floral arrangements"""
    score = 70.0
    
    if parameters.localSourcing:
        score += 10
    if parameters.sustainablePractices:
        score += 10
    if parameters.reusability:
        score += 10
    
    return min(score, 100.0)

def generate_furniture_recommendations(request: UserFurnitureRequest, result: Dict[str, Any]) -> List[str]:
    """Generate recommendations for furniture"""
    recommendations = []
    
    if request.guestCount > 50:
        recommendations.append("Consider modular seating for large events")
    
    if request.culture == CultureType.japanese:
        recommendations.append("Add floor cushions for authentic Japanese seating")
    elif request.culture == CultureType.scandinavian:
        recommendations.append("Include cozy textiles for hygge atmosphere")
    
    return recommendations

def calculate_total_budget(event_spec: CompleteEventSpec) -> int:
    """Calculate total estimated budget"""
    budget_mapping = {"low": 1000, "medium": 3000, "high": 8000, "luxury": 20000}
    base_budget = budget_mapping.get(event_spec.furniture.budgetRange, 3000)
    
    # Add costs for additional systems
    if event_spec.lighting:
        base_budget += event_spec.lighting.powerBudget
    if event_spec.floral:
        base_budget += event_spec.floral.budget
    if event_spec.stage:
        base_budget += event_spec.stage.budget
    
    return base_budget

def extract_accessibility_features(event_spec: CompleteEventSpec) -> List[str]:
    """Extract accessibility features from event specification"""
    features = []
    
    if event_spec.stage and event_spec.stage.accessibilityRequired:
        features.append("Stage accessibility compliant")
    if event_spec.stage and event_spec.stage.hearingAssistance:
        features.append("Hearing assistance available")
    if event_spec.stage and event_spec.stage.visualAssistance:
        features.append("Visual assistance available")
    
    return features

def get_cultural_lighting_elements(culture: str) -> List[str]:
    """Get cultural lighting elements"""
    elements = {
        "japanese": ["andon lanterns", "soft ambient light"],
        "french": ["crystal chandeliers", "elegant wall sconces"],
        "italian": ["warm pendant lights", "decorative fixtures"],
        "scandinavian": ["natural light emphasis", "clean modern fixtures"],
        "modern": ["LED strips", "geometric fixtures"]
    }
    return elements.get(culture, elements["modern"])

def get_cultural_flowers(culture: str) -> List[str]:
    """Get cultural flower selections"""
    flowers = {
        "japanese": ["cherry blossom", "chrysanthemum", "iris"],
        "french": ["roses", "peonies", "hydrangeas"],
        "italian": ["roses", "lilies", "olive branches"],
        "scandinavian": ["tulips", "daffodils", "wildflowers"],
        "modern": ["orchids", "calla lilies", "succulents"]
    }
    return flowers.get(culture, flowers["modern"])

def get_seasonal_elements(season: str) -> List[str]:
    """Get seasonal elements"""
    elements = {
        "spring": ["fresh blooms", "light colors", "new growth"],
        "summer": ["bright colors", "outdoor elements", "abundant florals"],
        "autumn": ["warm tones", "dried elements", "harvest themes"],
        "winter": ["evergreens", "white elements", "cozy textures"]
    }
    return elements.get(season, elements["spring"])

def get_cultural_floral_elements(culture: str) -> List[str]:
    """Get cultural floral design elements"""
    elements = {
        "japanese": ["ikebana principles", "asymmetrical balance"],
        "french": ["structured arrangements", "romantic styling"],
        "italian": ["abundant displays", "warm colors"],
        "scandinavian": ["simple arrangements", "natural styling"],
        "modern": ["geometric arrangements", "minimal styling"]
    }
    return elements.get(culture, elements["modern"])

def get_accessibility_features(parameters: Dict[str, Any]) -> List[str]:
    """Get accessibility features for stage"""
    features = []
    
    if parameters.get('accessibilityRequired', False):
        features.extend(["wheelchair accessible", "clear sight lines"])
    if parameters.get('hearingAssistance', False):
        features.append("hearing loop system")
    if parameters.get('visualAssistance', False):
        features.append("visual accessibility features")
    
    return features

def get_cultural_stage_elements(culture: str) -> List[str]:
    """Get cultural stage design elements"""
    elements = {
        "japanese": ["elevated platform", "natural materials"],
        "french": ["elegant drapery", "refined details"],
        "italian": ["ornate elements", "dramatic staging"],
        "scandinavian": ["clean lines", "functional design"],
        "modern": ["minimalist platform", "tech integration"]
    }
    return elements.get(culture, elements["modern"])

def get_mock_furniture_result(request: UserFurnitureRequest) -> Dict[str, Any]:
    """Generate mock furniture result for testing"""
    return {
        "models": [
            {
                "id": f"furniture_{int(datetime.now().timestamp())}",
                "type": "chair",
                "culture": request.culture,
                "geometry": {"vertices": 800, "faces": 1200},
                "materials": ["wood", "fabric"],
                "culturalScore": 88.5
            }
        ],
        "culturalElements": get_cultural_furniture_elements(request.culture),
        "recommendations": [f"Consider {request.culture} design elements"]
    }

def get_cultural_furniture_elements(culture: str) -> List[str]:
    """Get cultural furniture design elements"""
    elements = {
        "japanese": ["clean lines", "natural materials", "low profile", "tatami compatibility"],
        "french": ["elegant curves", "ornate details", "luxury fabrics", "classical proportions"],
        "italian": ["rich materials", "artistic details", "warm colors", "craftsmanship"],
        "scandinavian": ["minimalist design", "light woods", "functional beauty", "hygge comfort"],
        "modern": ["geometric forms", "mixed materials", "contemporary styling", "innovative design"]
    }
    return elements.get(culture, elements["modern"])