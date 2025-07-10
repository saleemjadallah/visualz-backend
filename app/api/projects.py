from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime
import logging

from app.models.project import Project, ProjectCreate, ProjectUpdate, ProjectInDB
from app.models.user import User
from app.api.auth import get_current_user
from app.services.database import get_database

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=Project)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new project."""
    db = get_database()
    
    # Create project document
    project_doc = ProjectInDB(
        **project_data.dict(),
        user_id=ObjectId(current_user.id)
    )
    
    # Insert into database
    result = await db.projects.insert_one(project_doc.dict(by_alias=True, exclude={"id"}))
    
    # Return created project
    created_project = Project(
        id=str(result.inserted_id),
        user_id=current_user.id,
        **project_data.dict(),
        created_at=project_doc.created_at,
        updated_at=project_doc.updated_at
    )
    
    logger.info(f"Project created: {created_project.id} by user {current_user.id}")
    return created_project

@router.get("/", response_model=List[Project])
async def get_user_projects(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all projects for the current user."""
    db = get_database()
    
    # Find user's projects
    cursor = db.projects.find(
        {"user_id": ObjectId(current_user.id)}
    ).sort("created_at", -1).skip(skip).limit(limit)
    
    projects = []
    async for project_doc in cursor:
        project = Project(
            id=str(project_doc["_id"]),
            user_id=str(project_doc["user_id"]),
            title=project_doc["title"],
            description=project_doc.get("description"),
            space_data=project_doc["space_data"],
            event_requirements=project_doc["event_requirements"],
            cultural_context=project_doc["cultural_context"],
            status=project_doc["status"],
            created_at=project_doc["created_at"],
            updated_at=project_doc["updated_at"]
        )
        projects.append(project)
    
    return projects

@router.get("/{project_id}", response_model=Project)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific project by ID."""
    db = get_database()
    
    # Validate ObjectId
    try:
        project_object_id = ObjectId(project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    # Find project
    project_doc = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    project = Project(
        id=str(project_doc["_id"]),
        user_id=str(project_doc["user_id"]),
        title=project_doc["title"],
        description=project_doc.get("description"),
        space_data=project_doc["space_data"],
        event_requirements=project_doc["event_requirements"],
        cultural_context=project_doc["cultural_context"],
        status=project_doc["status"],
        created_at=project_doc["created_at"],
        updated_at=project_doc["updated_at"]
    )
    
    return project

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a project."""
    db = get_database()
    
    # Validate ObjectId
    try:
        project_object_id = ObjectId(project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    # Check if project exists and belongs to user
    existing_project = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Prepare update data
    update_data = project_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Update project
    await db.projects.update_one(
        {"_id": project_object_id},
        {"$set": update_data}
    )
    
    # Get updated project
    updated_project_doc = await db.projects.find_one({"_id": project_object_id})
    
    updated_project = Project(
        id=str(updated_project_doc["_id"]),
        user_id=str(updated_project_doc["user_id"]),
        title=updated_project_doc["title"],
        description=updated_project_doc.get("description"),
        space_data=updated_project_doc["space_data"],
        event_requirements=updated_project_doc["event_requirements"],
        cultural_context=updated_project_doc["cultural_context"],
        status=updated_project_doc["status"],
        created_at=updated_project_doc["created_at"],
        updated_at=updated_project_doc["updated_at"]
    )
    
    logger.info(f"Project updated: {project_id} by user {current_user.id}")
    return updated_project

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a project."""
    db = get_database()
    
    # Validate ObjectId
    try:
        project_object_id = ObjectId(project_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    # Check if project exists and belongs to user
    existing_project = await db.projects.find_one({
        "_id": project_object_id,
        "user_id": ObjectId(current_user.id)
    })
    
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Delete associated designs first
    await db.designs.delete_many({"project_id": project_object_id})
    
    # Delete project
    await db.projects.delete_one({"_id": project_object_id})
    
    logger.info(f"Project deleted: {project_id} by user {current_user.id}")
    return {"message": "Project deleted successfully"}