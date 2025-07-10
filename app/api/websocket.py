"""
WebSocket API endpoints for real-time collaboration.
"""

import json
import logging
from typing import Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.websocket_service import websocket_manager
from app.api.auth import get_current_user_from_token, get_current_user
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)
security = HTTPBearer()

@router.websocket("/collaborate/{project_id}")
async def websocket_collaborate(
    websocket: WebSocket,
    project_id: str,
    token: str = Query(..., description="JWT token for authentication")
):
    """
    WebSocket endpoint for real-time collaboration on a project.
    
    Authentication is done via query parameter since WebSocket doesn't support headers.
    """
    try:
        # Authenticate user from token
        user = await get_current_user_from_token(token)
        if not user:
            await websocket.close(code=4001, reason="Authentication failed")
            return
        
        # Connect user to collaboration room
        session_id = await websocket_manager.connect(
            websocket=websocket,
            project_id=project_id,
            user_id=user.id,
            username=user.full_name,
            email=user.email
        )
        
        try:
            # Listen for messages
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                
                try:
                    message = json.loads(data)
                    await websocket_manager.handle_message(session_id, message)
                except json.JSONDecodeError:
                    await websocket_manager.send_to_user(session_id, {
                        "type": "error",
                        "message": "Invalid JSON format"
                    })
                except Exception as e:
                    logger.error(f"Error handling message: {e}")
                    await websocket_manager.send_to_user(session_id, {
                        "type": "error",
                        "message": "Internal server error"
                    })
        
        except WebSocketDisconnect:
            logger.info(f"User {user.full_name} disconnected from project {project_id}")
        except Exception as e:
            logger.error(f"WebSocket error for user {user.id}: {e}")
        
        finally:
            # Clean up connection
            await websocket_manager.disconnect(session_id)
            
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
        await websocket.close(code=4000, reason="Connection error")

@router.get("/collaboration/room/{project_id}")
async def get_collaboration_room_info(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get information about a collaboration room."""
    try:
        room_info = await websocket_manager.get_room_info(project_id)
        
        if not room_info:
            return {
                "project_id": project_id,
                "active": False,
                "user_count": 0,
                "users": [],
                "message": "No active collaboration session"
            }
        
        return {
            "project_id": project_id,
            "active": True,
            **room_info
        }
        
    except Exception as e:
        logger.error(f"Error getting room info for project {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get room information"
        )

@router.get("/collaboration/stats")
async def get_collaboration_stats(
    current_user: User = Depends(get_current_user)
):
    """Get overall collaboration statistics."""
    try:
        total_rooms = len(websocket_manager.rooms)
        total_users = sum(len(room.users) for room in websocket_manager.rooms.values())
        total_connections = len(websocket_manager.connections)
        
        room_stats = []
        for project_id, room in websocket_manager.rooms.items():
            room_stats.append({
                "project_id": project_id,
                "user_count": len(room.users),
                "created_at": room.created_at.isoformat(),
                "locked_elements_count": len(room.locked_elements),
                "recent_events_count": len(room.recent_events),
                "chat_messages_count": len(room.chat_messages)
            })
        
        return {
            "total_rooms": total_rooms,
            "total_users": total_users,
            "total_connections": total_connections,
            "rooms": room_stats,
            "system_status": "healthy"
        }
        
    except Exception as e:
        logger.error(f"Error getting collaboration stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get collaboration statistics"
        )

@router.post("/collaboration/cleanup")
async def cleanup_inactive_users(
    inactive_threshold_minutes: int = Query(30, description="Inactive threshold in minutes"),
    current_user: User = Depends(get_current_user)
):
    """Manually trigger cleanup of inactive users."""
    try:
        await websocket_manager.cleanup_inactive_users(inactive_threshold_minutes)
        
        return {
            "message": "Cleanup completed successfully",
            "inactive_threshold_minutes": inactive_threshold_minutes
        }
        
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cleanup inactive users"
        )

@router.get("/collaboration/rooms")
async def list_active_rooms(
    current_user: User = Depends(get_current_user)
):
    """List all active collaboration rooms."""
    try:
        rooms = []
        
        for project_id, room in websocket_manager.rooms.items():
            rooms.append({
                "project_id": project_id,
                "user_count": len(room.users),
                "created_at": room.created_at.isoformat(),
                "users": [
                    {
                        "user_id": user.user_id,
                        "username": user.username,
                        "joined_at": user.joined_at.isoformat(),
                        "is_active": user.is_active
                    }
                    for user in room.users.values()
                ],
                "locked_elements_count": len(room.locked_elements),
                "activity_level": "high" if len(room.recent_events) > 10 else "low"
            })
        
        return {
            "rooms": rooms,
            "total_rooms": len(rooms)
        }
        
    except Exception as e:
        logger.error(f"Error listing rooms: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list active rooms"
        )

@router.delete("/collaboration/room/{project_id}")
async def force_close_room(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    """Force close a collaboration room (admin function)."""
    try:
        if project_id not in websocket_manager.rooms:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        
        room = websocket_manager.rooms[project_id]
        
        # Disconnect all users in the room
        sessions_to_disconnect = list(room.users.keys())
        for session_id in sessions_to_disconnect:
            await websocket_manager.disconnect(session_id)
        
        return {
            "message": f"Room {project_id} closed successfully",
            "disconnected_users": len(sessions_to_disconnect)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error closing room {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to close room"
        )