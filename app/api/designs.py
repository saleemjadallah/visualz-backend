from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime
import logging

from app.models.design import Design, DesignCreate, DesignUpdate, DesignInDB
from app.models.user import User
from app.api.auth import get_current_user
from app.services.database import get_database

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=Design)
async def create_design(
    design_data: DesignCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new design."""
    db = get_database()
    
    # Validate project exists and belongs to user
    try:
        project_object_id = ObjectId(design_data.project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    project = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get next version number
    latest_design = await db.designs.find_one(
        {"project_id": project_object_id},
        sort=[("version", -1)]
    )
    next_version = (latest_design["version"] + 1) if latest_design else 1
    
    # Create design document
    design_doc = DesignInDB(
        **design_data.dict(exclude={"project_id"}),
        project_id=project_object_id,
        user_id=ObjectId(current_user.id),
        version=next_version
    )
    
    # Insert into database
    result = await db.designs.insert_one(design_doc.dict(by_alias=True, exclude={"id"}))
    
    # Return created design
    created_design = Design(
        id=str(result.inserted_id),
        project_id=design_data.project_id,
        user_id=current_user.id,
        version=next_version,
        **design_data.dict(exclude={"project_id"}),
        created_at=design_doc.created_at,
        updated_at=design_doc.updated_at
    )
    
    logger.info(f"Design created: {created_design.id} for project {design_data.project_id}")
    return created_design

@router.get("/project/{project_id}", response_model=List[Design])
async def get_project_designs(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all designs for a specific project."""
    db = get_database()
    
    # Validate project exists and belongs to user
    try:
        project_object_id = ObjectId(project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    project = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Find designs for this project
    cursor = db.designs.find(
        {"project_id": project_object_id}
    ).sort("version", -1)
    
    designs = []
    async for design_doc in cursor:
        design = Design(
            id=str(design_doc["_id"]),
            project_id=str(design_doc["project_id"]),
            user_id=str(design_doc["user_id"]),
            version=design_doc["version"],
            name=design_doc["name"],
            description=design_doc.get("description"),
            furniture_items=design_doc["furniture_items"],
            color_palette=design_doc["color_palette"],
            material_recommendations=design_doc["material_recommendations"],
            lighting_plan=design_doc["lighting_plan"],
            budget_breakdown=design_doc["budget_breakdown"],
            cultural_validation=design_doc.get("cultural_validation"),
            ai_generated=design_doc["ai_generated"],
            design_notes=design_doc["design_notes"],
            created_at=design_doc["created_at"],
            updated_at=design_doc["updated_at"]
        )
        designs.append(design)
    
    return designs

@router.get("/{design_id}", response_model=Design)
async def get_design(
    design_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific design by ID."""
    db = get_database()
    
    # Validate ObjectId
    try:
        design_object_id = ObjectId(design_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid design ID"
        )
    
    # Find design
    design_doc = await db.designs.find_one({
        "_id": design_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not design_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found"
        )
    
    design = Design(
        id=str(design_doc["_id"]),
        project_id=str(design_doc["project_id"]),
        user_id=str(design_doc["user_id"]),
        version=design_doc["version"],
        name=design_doc["name"],
        description=design_doc.get("description"),
        furniture_items=design_doc["furniture_items"],
        color_palette=design_doc["color_palette"],
        material_recommendations=design_doc["material_recommendations"],
        lighting_plan=design_doc["lighting_plan"],
        budget_breakdown=design_doc["budget_breakdown"],
        cultural_validation=design_doc.get("cultural_validation"),
        ai_generated=design_doc["ai_generated"],
        design_notes=design_doc["design_notes"],
        created_at=design_doc["created_at"],
        updated_at=design_doc["updated_at"]
    )
    
    return design

@router.put("/{design_id}", response_model=Design)
async def update_design(
    design_id: str,
    design_update: DesignUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a design."""
    db = get_database()
    
    # Validate ObjectId
    try:
        design_object_id = ObjectId(design_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid design ID"
        )
    
    # Check if design exists and belongs to user
    existing_design = await db.designs.find_one({
        "_id": design_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not existing_design:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found"
        )
    
    # Prepare update data
    update_data = design_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Update design
    await db.designs.update_one(
        {"_id": design_object_id},
        {"$set": update_data}
    )
    
    # Get updated design
    updated_design_doc = await db.designs.find_one({"_id": design_object_id})
    
    updated_design = Design(
        id=str(updated_design_doc["_id"]),
        project_id=str(updated_design_doc["project_id"]),
        user_id=str(updated_design_doc["user_id"]),
        version=updated_design_doc["version"],
        name=updated_design_doc["name"],
        description=updated_design_doc.get("description"),
        furniture_items=updated_design_doc["furniture_items"],
        color_palette=updated_design_doc["color_palette"],
        material_recommendations=updated_design_doc["material_recommendations"],
        lighting_plan=updated_design_doc["lighting_plan"],
        budget_breakdown=updated_design_doc["budget_breakdown"],
        cultural_validation=updated_design_doc.get("cultural_validation"),
        ai_generated=updated_design_doc["ai_generated"],
        design_notes=updated_design_doc["design_notes"],
        created_at=updated_design_doc["created_at"],
        updated_at=updated_design_doc["updated_at"]
    )
    
    logger.info(f"Design updated: {design_id} by user {current_user.id}")
    return updated_design

@router.delete("/{design_id}")
async def delete_design(
    design_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a design."""
    db = get_database()
    
    # Validate ObjectId
    try:
        design_object_id = ObjectId(design_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid design ID"
        )
    
    # Check if design exists and belongs to user
    existing_design = await db.designs.find_one({
        "_id": design_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not existing_design:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found"
        )
    
    # Delete design
    await db.designs.delete_one({"_id": design_object_id})
    
    logger.info(f"Design deleted: {design_id} by user {current_user.id}")
    return {"message": "Design deleted successfully"}