from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List, Dict, Any
import logging

from app.models.user import User
from app.api.auth import get_current_user
from app.services.cloudinary_service import cloudinary_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/space-photo/{project_id}")
async def upload_space_photo(
    project_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Upload a space photo for a project."""
    try:
        # Upload to Cloudinary
        result = await cloudinary_service.upload_space_photo(
            file=file,
            user_id=current_user.id,
            project_id=project_id
        )
        
        logger.info(f"Space photo uploaded for project {project_id} by user {current_user.id}")
        
        return {
            "message": "Space photo uploaded successfully",
            "file_info": result
        }
        
    except Exception as e:
        logger.error(f"Error uploading space photo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/design-image/{design_id}")
async def upload_design_image(
    design_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Upload a design image."""
    try:
        # Upload to Cloudinary
        result = await cloudinary_service.upload_design_image(
            file=file,
            user_id=current_user.id,
            design_id=design_id
        )
        
        logger.info(f"Design image uploaded for design {design_id} by user {current_user.id}")
        
        return {
            "message": "Design image uploaded successfully",
            "file_info": result
        }
        
    except Exception as e:
        logger.error(f"Error uploading design image: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/image/{public_id}")
async def delete_image(
    public_id: str,
    current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """Delete an image by public ID."""
    try:
        # Verify the image belongs to the user (basic check)
        if not public_id.startswith(f"designvisualz/users/{current_user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this image"
            )
        
        success = await cloudinary_service.delete_image(public_id)
        
        if success:
            logger.info(f"Image deleted: {public_id} by user {current_user.id}")
            return {"message": "Image deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found or could not be deleted"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/images")
async def get_user_images(
    current_user: User = Depends(get_current_user)
) -> List[Dict]:
    """Get all images for the current user."""
    try:
        images = await cloudinary_service.get_user_images(current_user.id)
        return images
        
    except Exception as e:
        logger.error(f"Error fetching user images: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/multiple-space-photos/{project_id}")
async def upload_multiple_space_photos(
    project_id: str,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Upload multiple space photos for a project."""
    try:
        if len(files) > 10:  # Limit to 10 files
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 10 files allowed per upload"
            )
        
        results = []
        for file in files:
            result = await cloudinary_service.upload_space_photo(
                file=file,
                user_id=current_user.id,
                project_id=project_id
            )
            results.append(result)
        
        logger.info(f"Multiple space photos uploaded for project {project_id} by user {current_user.id}")
        
        return {
            "message": f"Successfully uploaded {len(results)} space photos",
            "files": results
        }
        
    except Exception as e:
        logger.error(f"Error uploading multiple space photos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )