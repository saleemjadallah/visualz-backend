from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import Dict, Any
import logging

from app.models.user import User
from app.api.auth import get_current_user
from app.services.cv_service import cv_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze-space")
async def analyze_space_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Analyze a space photo using computer vision."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read image data
        image_data = await file.read()
        
        # Analyze the space
        analysis_result = await cv_service.analyze_space_photo(image_data)
        
        logger.info(f"Space analysis completed for user {current_user.id}")
        
        return {
            "success": True,
            "analysis": analysis_result,
            "message": "Space analysis completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing space photo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze space photo: {str(e)}"
        )

@router.post("/analyze-dimensions")
async def analyze_room_dimensions(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Analyze room dimensions from a photo."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read image data
        image_data = await file.read()
        
        # Convert to OpenCV format
        image = cv_service._bytes_to_opencv_image(image_data)
        
        # Analyze dimensions
        dimensions = await cv_service._estimate_room_dimensions(image)
        
        logger.info(f"Room dimensions analysis completed for user {current_user.id}")
        
        return {
            "success": True,
            "dimensions": dimensions,
            "message": "Room dimensions analysis completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing room dimensions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze room dimensions: {str(e)}"
        )

@router.post("/detect-furniture")
async def detect_furniture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Detect furniture in a space photo."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read image data
        image_data = await file.read()
        
        # Convert to OpenCV format
        image = cv_service._bytes_to_opencv_image(image_data)
        
        # Detect objects
        objects = await cv_service._detect_objects(image)
        
        logger.info(f"Furniture detection completed for user {current_user.id}")
        
        return {
            "success": True,
            "detected_objects": objects,
            "count": len(objects),
            "message": "Furniture detection completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error detecting furniture: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to detect furniture: {str(e)}"
        )

@router.post("/analyze-lighting")
async def analyze_lighting(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Analyze lighting conditions in a space photo."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read image data
        image_data = await file.read()
        
        # Convert to OpenCV format
        image = cv_service._bytes_to_opencv_image(image_data)
        
        # Analyze lighting
        lighting_analysis = await cv_service._analyze_lighting(image)
        
        logger.info(f"Lighting analysis completed for user {current_user.id}")
        
        return {
            "success": True,
            "lighting_analysis": lighting_analysis,
            "message": "Lighting analysis completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing lighting: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze lighting: {str(e)}"
        )

@router.post("/extract-colors")
async def extract_color_palette(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Extract color palette from a space photo."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read image data
        image_data = await file.read()
        
        # Convert to OpenCV format
        image = cv_service._bytes_to_opencv_image(image_data)
        
        # Extract color palette
        colors = await cv_service._extract_color_palette(image)
        
        logger.info(f"Color palette extraction completed for user {current_user.id}")
        
        return {
            "success": True,
            "color_palette": colors,
            "message": "Color palette extraction completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting color palette: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract color palette: {str(e)}"
        )

@router.post("/analyze-style")
async def analyze_architectural_style(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Analyze architectural style of a space."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read image data
        image_data = await file.read()
        
        # Convert to OpenCV format
        image = cv_service._bytes_to_opencv_image(image_data)
        
        # Analyze style
        style_analysis = await cv_service._classify_architectural_style(image)
        
        logger.info(f"Architectural style analysis completed for user {current_user.id}")
        
        return {
            "success": True,
            "style_analysis": style_analysis,
            "message": "Architectural style analysis completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing architectural style: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze architectural style: {str(e)}"
        )