import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import UploadFile, HTTPException
from typing import Dict, List, Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

class CloudinaryService:
    """Service for handling file uploads to Cloudinary."""
    
    def __init__(self):
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_formats = ["jpg", "jpeg", "png", "gif", "webp", "bmp"]
    
    async def upload_space_photo(self, file: UploadFile, user_id: str, project_id: str) -> Dict[str, str]:
        """Upload a space photo to Cloudinary."""
        try:
            # Validate file
            await self._validate_file(file)
            
            # Create folder structure
            folder = f"designvisualz/users/{user_id}/projects/{project_id}/spaces"
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file.file,
                folder=folder,
                resource_type="image",
                transformation=[
                    {"width": 1200, "height": 800, "crop": "limit"},
                    {"quality": "auto"},
                    {"fetch_format": "auto"}
                ],
                tags=["space_photo", f"user_{user_id}", f"project_{project_id}"]
            )
            
            logger.info(f"Space photo uploaded successfully: {result['public_id']}")
            
            return {
                "public_id": result["public_id"],
                "url": result["secure_url"],
                "width": result["width"],
                "height": result["height"],
                "format": result["format"],
                "file_size": result["bytes"]
            }
            
        except Exception as e:
            logger.error(f"Error uploading space photo: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    async def upload_design_image(self, file: UploadFile, user_id: str, design_id: str) -> Dict[str, str]:
        """Upload a design image to Cloudinary."""
        try:
            # Validate file
            await self._validate_file(file)
            
            # Create folder structure
            folder = f"designvisualz/users/{user_id}/designs/{design_id}"
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file.file,
                folder=folder,
                resource_type="image",
                transformation=[
                    {"width": 1920, "height": 1080, "crop": "limit"},
                    {"quality": "auto"},
                    {"fetch_format": "auto"}
                ],
                tags=["design_image", f"user_{user_id}", f"design_{design_id}"]
            )
            
            logger.info(f"Design image uploaded successfully: {result['public_id']}")
            
            return {
                "public_id": result["public_id"],
                "url": result["secure_url"],
                "width": result["width"],
                "height": result["height"],
                "format": result["format"],
                "file_size": result["bytes"]
            }
            
        except Exception as e:
            logger.error(f"Error uploading design image: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    async def delete_image(self, public_id: str) -> bool:
        """Delete an image from Cloudinary."""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            logger.error(f"Error deleting image {public_id}: {e}")
            return False
    
    async def get_user_images(self, user_id: str) -> List[Dict]:
        """Get all images for a user."""
        try:
            result = cloudinary.api.resources(
                type="upload",
                prefix=f"designvisualz/users/{user_id}/",
                max_results=100
            )
            return result.get("resources", [])
        except Exception as e:
            logger.error(f"Error fetching user images: {e}")
            return []
    
    async def _validate_file(self, file: UploadFile) -> None:
        """Validate uploaded file."""
        # Check file size
        if file.size > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum limit of {self.max_file_size / (1024 * 1024):.1f}MB"
            )
        
        # Check file format
        if not file.filename or not any(file.filename.lower().endswith(f".{fmt}") for fmt in self.allowed_formats):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format. Allowed formats: {', '.join(self.allowed_formats)}"
            )
        
        # Check content type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only images are allowed."
            )

# Create service instance
cloudinary_service = CloudinaryService()