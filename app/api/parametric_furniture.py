from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from enum import Enum
import json
import logging
from datetime import datetime

from app.services.parametric_generation_service import (
    parametric_service, 
    FurnitureType, 
    CulturalStyle, 
    ParametricParameters,
    ParametricGeometry
)
from app.services.geometry_export_service import (
    geometry_exporter,
    ExportFormat,
    ExportOptions,
    ExportResult
)
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

class GenerationRequest(BaseModel):
    furniture_type: str = Field(..., description="Type of furniture to generate")
    cultural_style: str = Field(..., description="Cultural style to apply")
    dimensions: Dict[str, float] = Field(default_factory=dict, description="Dimension parameters")
    materials: Dict[str, str] = Field(default_factory=dict, description="Material specifications")
    colors: Dict[str, str] = Field(default_factory=dict, description="Color specifications")
    cultural_elements: Dict[str, Any] = Field(default_factory=dict, description="Cultural design elements")
    comfort_level: float = Field(default=1.0, ge=0.0, le=2.0, description="Comfort factor")
    durability: float = Field(default=1.0, ge=0.0, le=2.0, description="Durability factor")
    style_intensity: float = Field(default=1.0, ge=0.0, le=2.0, description="Cultural style intensity")

class ExportRequest(BaseModel):
    format: str = Field(..., description="Export format (gltf, glb, obj, stl)")
    quality: str = Field(default="medium", description="Quality level (low, medium, high)")
    cultural_metadata: bool = Field(default=True, description="Include cultural metadata")
    include_materials: bool = Field(default=True, description="Include material information")
    compress: bool = Field(default=True, description="Compress output")

class GenerationResponse(BaseModel):
    success: bool
    furniture_id: str
    furniture_type: str
    cultural_style: str
    generation_time: float
    vertex_count: int
    face_count: int
    materials: Dict[str, Any]
    cultural_metadata: Dict[str, Any]
    message: str

class ExportResponse(BaseModel):
    success: bool
    export_id: str
    format: str
    size: int
    compression: str
    download_url: str
    metadata: Dict[str, Any]

class PreviewRequest(BaseModel):
    furniture_type: str
    cultural_style: str
    parameters: Dict[str, Any] = Field(default_factory=dict)

class PreviewResponse(BaseModel):
    success: bool
    preview_data: Dict[str, Any]
    estimated_generation_time: float
    parameter_suggestions: Dict[str, Any]

# In-memory storage for generated geometries (in production, use Redis or database)
generated_geometries: Dict[str, ParametricGeometry] = {}
export_results: Dict[str, ExportResult] = {}

@router.post("/generate", response_model=GenerationResponse)
async def generate_parametric_furniture(
    request: GenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Generate parametric furniture with cultural intelligence
    
    This endpoint creates procedurally generated furniture based on:
    - Furniture type (chair, table, etc.)
    - Cultural style (Japanese, French, Scandinavian, etc.)
    - Custom parameters (dimensions, materials, colors)
    - Cultural design principles and authenticity
    """
    
    try:
        start_time = datetime.now()
        
        # Validate furniture type
        try:
            furniture_type = FurnitureType(request.furniture_type.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported furniture type: {request.furniture_type}"
            )
        
        # Validate cultural style
        try:
            cultural_style = CulturalStyle(request.cultural_style.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported cultural style: {request.cultural_style}"
            )
        
        # Create parametric parameters
        parameters = ParametricParameters(
            dimensions=request.dimensions,
            materials=request.materials,
            colors=request.colors,
            cultural_elements=request.cultural_elements,
            style_intensity=request.style_intensity,
            comfort_level=request.comfort_level,
            durability=request.durability
        )
        
        # Generate furniture
        logger.info(f"Generating {furniture_type.value} with {cultural_style.value} style for user {current_user.id}")
        
        geometry = await parametric_service.generate_parametric_furniture(
            furniture_type=furniture_type,
            cultural_style=cultural_style,
            parameters=parameters
        )
        
        # Generate unique ID
        furniture_id = f"{current_user.id}_{furniture_type.value}_{cultural_style.value}_{int(datetime.now().timestamp())}"
        
        # Store geometry for later export
        generated_geometries[furniture_id] = geometry
        
        # Schedule cleanup (remove after 24 hours)
        background_tasks.add_task(cleanup_geometry, furniture_id, delay=86400)
        
        generation_time = (datetime.now() - start_time).total_seconds()
        
        response = GenerationResponse(
            success=True,
            furniture_id=furniture_id,
            furniture_type=furniture_type.value,
            cultural_style=cultural_style.value,
            generation_time=generation_time,
            vertex_count=len(geometry.vertices),
            face_count=len(geometry.faces),
            materials=geometry.materials,
            cultural_metadata=geometry.metadata,
            message=f"Successfully generated {furniture_type.value} with {cultural_style.value} cultural style"
        )
        
        logger.info(f"Generated furniture {furniture_id} in {generation_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Error generating parametric furniture: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/export/{furniture_id}", response_model=ExportResponse)
async def export_parametric_furniture(
    furniture_id: str,
    request: ExportRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Export generated parametric furniture to various formats
    
    Supported formats:
    - GLTF: Standard 3D format with materials
    - GLB: Binary GLTF format
    - OBJ: Wavefront OBJ format
    - STL: STL format for 3D printing
    """
    
    try:
        # Check if furniture exists
        if furniture_id not in generated_geometries:
            raise HTTPException(
                status_code=404,
                detail=f"Furniture with ID {furniture_id} not found or expired"
            )
        
        geometry = generated_geometries[furniture_id]
        
        # Validate export format
        try:
            export_format = ExportFormat(request.format.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported export format: {request.format}"
            )
        
        # Create export options
        export_options = ExportOptions(
            format=export_format,
            quality=request.quality,
            cultural_metadata=request.cultural_metadata,
            include_materials=request.include_materials,
            compress=request.compress
        )
        
        # Export geometry
        logger.info(f"Exporting furniture {furniture_id} to {export_format.value} format")
        
        export_result = await geometry_exporter.export_parametric_furniture(
            geometry=geometry,
            options=export_options
        )
        
        # Generate export ID
        export_id = f"{furniture_id}_{export_format.value}_{int(datetime.now().timestamp())}"
        
        # Store export result
        export_results[export_id] = export_result
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_export, export_id, delay=3600)  # 1 hour
        
        response = ExportResponse(
            success=True,
            export_id=export_id,
            format=export_format.value,
            size=export_result.size,
            compression=export_result.compression.value,
            download_url=f"/api/parametric-furniture/download/{export_id}",
            metadata=export_result.metadata
        )
        
        logger.info(f"Exported furniture {furniture_id} to {export_format.value} ({export_result.size} bytes)")
        return response
        
    except Exception as e:
        logger.error(f"Error exporting parametric furniture: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.get("/download/{export_id}")
async def download_exported_furniture(
    export_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Download exported parametric furniture file
    """
    
    try:
        # Check if export exists
        if export_id not in export_results:
            raise HTTPException(
                status_code=404,
                detail=f"Export with ID {export_id} not found or expired"
            )
        
        export_result = export_results[export_id]
        
        # Determine content type
        content_types = {
            ExportFormat.GLTF: "model/gltf+json",
            ExportFormat.GLB: "model/gltf-binary",
            ExportFormat.OBJ: "model/obj",
            ExportFormat.STL: "model/stl"
        }
        
        content_type = content_types.get(export_result.format, "application/octet-stream")
        
        # Generate filename
        filename = f"parametric_furniture_{export_id}.{export_result.format.value}"
        
        # Return file
        return Response(
            content=export_result.data,
            media_type=content_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Length": str(export_result.size)
            }
        )
        
    except Exception as e:
        logger.error(f"Error downloading export: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@router.post("/preview", response_model=PreviewResponse)
async def preview_parametric_furniture(
    request: PreviewRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Preview parametric furniture generation without creating full geometry
    
    Returns estimated generation time and parameter suggestions
    """
    
    try:
        # Validate inputs
        try:
            furniture_type = FurnitureType(request.furniture_type.lower())
            cultural_style = CulturalStyle(request.cultural_style.lower())
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Generate preview data
        preview_data = {
            "furniture_type": furniture_type.value,
            "cultural_style": cultural_style.value,
            "estimated_vertices": get_estimated_vertices(furniture_type, cultural_style),
            "estimated_faces": get_estimated_faces(furniture_type, cultural_style),
            "supported_materials": get_supported_materials(furniture_type),
            "cultural_principles": get_cultural_principles(cultural_style)
        }
        
        # Estimate generation time
        estimated_time = estimate_generation_time(furniture_type, cultural_style, request.parameters)
        
        # Generate parameter suggestions
        parameter_suggestions = generate_parameter_suggestions(furniture_type, cultural_style)
        
        response = PreviewResponse(
            success=True,
            preview_data=preview_data,
            estimated_generation_time=estimated_time,
            parameter_suggestions=parameter_suggestions
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error generating preview: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Preview failed: {str(e)}")

@router.get("/supported-types")
async def get_supported_furniture_types():
    """Get list of supported furniture types"""
    return {
        "furniture_types": [ft.value for ft in FurnitureType],
        "cultural_styles": [cs.value for cs in CulturalStyle],
        "export_formats": [ef.value for ef in ExportFormat],
        "quality_levels": ["low", "medium", "high"]
    }

@router.get("/cultural-styles/{style}/principles")
async def get_cultural_style_principles(style: str):
    """Get cultural design principles for a specific style"""
    try:
        cultural_style = CulturalStyle(style.lower())
        principles = get_cultural_principles(cultural_style)
        return {
            "style": cultural_style.value,
            "principles": principles
        }
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail=f"Cultural style {style} not found"
        )

@router.delete("/cleanup/{furniture_id}")
async def cleanup_furniture(
    furniture_id: str,
    current_user: User = Depends(get_current_user)
):
    """Manually cleanup generated furniture"""
    if furniture_id in generated_geometries:
        del generated_geometries[furniture_id]
        return {"message": f"Cleaned up furniture {furniture_id}"}
    else:
        raise HTTPException(status_code=404, detail="Furniture not found")

# Helper functions
async def cleanup_geometry(furniture_id: str, delay: int = 0):
    """Background task to cleanup generated geometry"""
    if delay > 0:
        await asyncio.sleep(delay)
    
    if furniture_id in generated_geometries:
        del generated_geometries[furniture_id]
        logger.info(f"Cleaned up geometry {furniture_id}")

async def cleanup_export(export_id: str, delay: int = 0):
    """Background task to cleanup export results"""
    if delay > 0:
        await asyncio.sleep(delay)
    
    if export_id in export_results:
        del export_results[export_id]
        logger.info(f"Cleaned up export {export_id}")

def get_estimated_vertices(furniture_type: FurnitureType, cultural_style: CulturalStyle) -> int:
    """Estimate vertex count for furniture type and style"""
    base_vertices = {
        FurnitureType.CHAIR: 800,
        FurnitureType.TABLE: 600,
        FurnitureType.SOFA: 1200,
        FurnitureType.BOOKSHELF: 1000,
        FurnitureType.DESK: 800,
        FurnitureType.BED: 1000,
        FurnitureType.DRESSER: 1200,
        FurnitureType.COFFEE_TABLE: 400
    }
    
    # Cultural style modifiers
    style_modifiers = {
        CulturalStyle.FRENCH: 1.3,  # More ornate
        CulturalStyle.JAPANESE: 0.7,  # More minimalist
        CulturalStyle.SCANDINAVIAN: 0.8,
        CulturalStyle.ITALIAN: 1.2,
        CulturalStyle.MODERN: 1.0,
        CulturalStyle.MINIMALIST: 0.6,
        CulturalStyle.TRADITIONAL: 1.1,
        CulturalStyle.CONTEMPORARY: 1.0
    }
    
    base = base_vertices.get(furniture_type, 800)
    modifier = style_modifiers.get(cultural_style, 1.0)
    
    return int(base * modifier)

def get_estimated_faces(furniture_type: FurnitureType, cultural_style: CulturalStyle) -> int:
    """Estimate face count for furniture type and style"""
    return int(get_estimated_vertices(furniture_type, cultural_style) * 1.5)

def get_supported_materials(furniture_type: FurnitureType) -> List[str]:
    """Get supported materials for furniture type"""
    return ["wood", "metal", "plastic", "fabric", "leather", "glass", "stone", "composite"]

def get_cultural_principles(cultural_style: CulturalStyle) -> List[str]:
    """Get cultural design principles"""
    principles = {
        CulturalStyle.JAPANESE: ["wabi-sabi", "minimalism", "natural materials", "harmony with nature"],
        CulturalStyle.FRENCH: ["elegance", "refinement", "attention to detail", "classic proportions"],
        CulturalStyle.SCANDINAVIAN: ["functionality", "simplicity", "clean lines", "light colors"],
        CulturalStyle.ITALIAN: ["craftsmanship", "luxury", "bold design", "artistic flair"],
        CulturalStyle.MODERN: ["simplicity", "functionality", "clean lines", "minimal ornamentation"],
        CulturalStyle.MINIMALIST: ["less is more", "clean lines", "neutral colors", "functional design"],
        CulturalStyle.TRADITIONAL: ["heritage", "craftsmanship", "classic materials", "proven designs"],
        CulturalStyle.CONTEMPORARY: ["current trends", "innovation", "mixed materials", "bold colors"]
    }
    
    return principles.get(cultural_style, ["modern", "functional", "versatile"])

def estimate_generation_time(furniture_type: FurnitureType, cultural_style: CulturalStyle, parameters: Dict[str, Any]) -> float:
    """Estimate generation time in seconds"""
    base_times = {
        FurnitureType.CHAIR: 2.0,
        FurnitureType.TABLE: 1.5,
        FurnitureType.SOFA: 3.0,
        FurnitureType.BOOKSHELF: 2.5,
        FurnitureType.DESK: 2.0,
        FurnitureType.BED: 2.5,
        FurnitureType.DRESSER: 3.0,
        FurnitureType.COFFEE_TABLE: 1.0
    }
    
    # Cultural complexity modifiers
    complexity_modifiers = {
        CulturalStyle.FRENCH: 1.4,  # More complex
        CulturalStyle.JAPANESE: 1.2,  # Moderate complexity
        CulturalStyle.SCANDINAVIAN: 1.0,
        CulturalStyle.ITALIAN: 1.3,
        CulturalStyle.MODERN: 1.0,
        CulturalStyle.MINIMALIST: 0.8,
        CulturalStyle.TRADITIONAL: 1.2,
        CulturalStyle.CONTEMPORARY: 1.0
    }
    
    base_time = base_times.get(furniture_type, 2.0)
    modifier = complexity_modifiers.get(cultural_style, 1.0)
    
    # Add time for custom parameters
    param_time = len(parameters) * 0.1
    
    return base_time * modifier + param_time

def generate_parameter_suggestions(furniture_type: FurnitureType, cultural_style: CulturalStyle) -> Dict[str, Any]:
    """Generate parameter suggestions for furniture type and style"""
    suggestions = {
        "dimensions": {},
        "materials": {},
        "colors": {},
        "cultural_elements": {}
    }
    
    # Furniture-specific suggestions
    if furniture_type == FurnitureType.CHAIR:
        suggestions["dimensions"] = {
            "seat_width": 0.45,
            "seat_depth": 0.40,
            "seat_height": 0.45,
            "back_height": 0.85
        }
        suggestions["materials"] = {
            "seat": "wood",
            "frame": "wood"
        }
    elif furniture_type == FurnitureType.TABLE:
        suggestions["dimensions"] = {
            "table_width": 1.2,
            "table_depth": 0.8,
            "table_height": 0.75
        }
        suggestions["materials"] = {
            "top": "wood",
            "legs": "wood"
        }
    
    # Cultural style suggestions
    if cultural_style == CulturalStyle.JAPANESE:
        suggestions["colors"] = {
            "primary": "#8B4513",
            "secondary": "#D2691E"
        }
        suggestions["cultural_elements"] = {
            "style": "japanese",
            "authenticity": 0.9
        }
    elif cultural_style == CulturalStyle.FRENCH:
        suggestions["colors"] = {
            "primary": "#DAA520",
            "secondary": "#B8860B"
        }
        suggestions["cultural_elements"] = {
            "style": "french",
            "authenticity": 0.8
        }
    elif cultural_style == CulturalStyle.SCANDINAVIAN:
        suggestions["colors"] = {
            "primary": "#F5F5DC",
            "secondary": "#DCDCDC"
        }
        suggestions["cultural_elements"] = {
            "style": "scandinavian",
            "authenticity": 0.9
        }
    
    return suggestions

import asyncio