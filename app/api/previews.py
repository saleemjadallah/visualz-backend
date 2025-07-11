from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
import os
from pathlib import Path
import mimetypes

router = APIRouter()

# Define the directory where preview files are stored
PREVIEWS_DIR = Path("static/previews")

# Ensure the previews directory exists
PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/{filename}")
async def get_preview_file(filename: str):
    """
    Serve 3D preview files.
    
    Args:
        filename: The name of the preview file to serve
        
    Returns:
        FileResponse: The requested preview file
        
    Raises:
        HTTPException: If the file is not found or access is denied
    """
    # Security: Only allow certain file extensions
    allowed_extensions = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.glb', '.gltf'}
    file_extension = Path(filename).suffix.lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Construct the full file path
    file_path = PREVIEWS_DIR / filename
    
    # Security: Ensure the file path is within the previews directory
    try:
        file_path = file_path.resolve()
        PREVIEWS_DIR.resolve()
        if not str(file_path).startswith(str(PREVIEWS_DIR.resolve())):
            raise HTTPException(status_code=403, detail="Access denied")
    except Exception:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check if file exists
    if not file_path.exists() or not file_path.is_file():
        # For now, return a placeholder response since we don't have actual rendered files yet
        return Response(
            content="Preview file not found. 3D rendering system is in development.",
            status_code=404,
            media_type="text/plain"
        )
    
    # Determine the media type
    media_type, _ = mimetypes.guess_type(str(file_path))
    if media_type is None:
        media_type = "application/octet-stream"
    
    # Return the file
    return FileResponse(
        path=str(file_path),
        media_type=media_type,
        filename=filename
    )

@router.post("/generate/{design_id}")
async def generate_preview(design_id: str):
    """
    Generate a 3D preview for a specific design.
    This is a placeholder for future implementation.
    
    Args:
        design_id: The ID of the design to generate a preview for
        
    Returns:
        dict: Information about the generated preview
    """
    # This would be implemented later with actual 3D rendering
    preview_filename = f"scene_{design_id}_{int(__import__('time').time())}.png"
    preview_url = f"https://visualz.events/api/previews/{preview_filename}"
    
    return {
        "success": True,
        "preview_url": preview_url,
        "filename": preview_filename,
        "message": "Preview generation queued (placeholder implementation)"
    }