"""
WebSocket service for real-time collaboration features.
Handles room management, user presence, and live design updates.
"""

import asyncio
import json
import logging
from typing import Dict, Set, List, Optional, Any
from datetime import datetime, timezone
from dataclasses import dataclass, asdict
from enum import Enum
import uuid

from fastapi import WebSocket, WebSocketDisconnect
from bson import ObjectId

logger = logging.getLogger(__name__)

class CollaborationEventType(Enum):
    """Types of collaboration events."""
    USER_JOINED = "user_joined"
    USER_LEFT = "user_left"
    DESIGN_UPDATE = "design_update"
    FURNITURE_MOVE = "furniture_move"
    FURNITURE_ADD = "furniture_add"
    FURNITURE_REMOVE = "furniture_remove"
    CURSOR_UPDATE = "cursor_update"
    SELECTION_CHANGE = "selection_change"
    COMMENT_ADD = "comment_add"
    COMMENT_UPDATE = "comment_update"
    COMMENT_DELETE = "comment_delete"
    DESIGN_LOCK = "design_lock"
    DESIGN_UNLOCK = "design_unlock"
    CHAT_MESSAGE = "chat_message"
    PRESENCE_UPDATE = "presence_update"

@dataclass
class CollaborationUser:
    """Represents a user in collaboration session."""
    user_id: str
    username: str
    email: str
    session_id: str
    joined_at: datetime
    last_activity: datetime
    cursor_position: Optional[Dict[str, float]] = None
    selected_elements: List[str] = None
    current_tool: Optional[str] = None
    is_active: bool = True

    def __post_init__(self):
        if self.selected_elements is None:
            self.selected_elements = []

@dataclass
class CollaborationEvent:
    """Represents a collaboration event."""
    event_type: CollaborationEventType
    user_id: str
    project_id: str
    session_id: str
    timestamp: datetime
    data: Dict[str, Any]
    event_id: str = None

    def __post_init__(self):
        if self.event_id is None:
            self.event_id = str(uuid.uuid4())

@dataclass
class CollaborationRoom:
    """Represents a collaboration room for a project."""
    project_id: str
    created_at: datetime
    users: Dict[str, CollaborationUser]
    locked_elements: Dict[str, str]  # element_id -> user_id
    recent_events: List[CollaborationEvent]
    chat_messages: List[Dict[str, Any]]
    max_recent_events: int = 100

    def __post_init__(self):
        if not self.users:
            self.users = {}
        if not self.locked_elements:
            self.locked_elements = {}
        if not self.recent_events:
            self.recent_events = []
        if not self.chat_messages:
            self.chat_messages = []

class WebSocketManager:
    """Manages WebSocket connections for real-time collaboration."""
    
    def __init__(self):
        # WebSocket connections: session_id -> WebSocket
        self.connections: Dict[str, WebSocket] = {}
        
        # Active rooms: project_id -> CollaborationRoom
        self.rooms: Dict[str, CollaborationRoom] = {}
        
        # User to session mapping: user_id -> session_id
        self.user_sessions: Dict[str, str] = {}
        
        # Session to user mapping: session_id -> user_id
        self.session_users: Dict[str, str] = {}
        
        # Room memberships: session_id -> project_id
        self.session_rooms: Dict[str, str] = {}
        
        # Lock to prevent race conditions
        self.lock = asyncio.Lock()
    
    async def connect(
        self, 
        websocket: WebSocket, 
        project_id: str, 
        user_id: str, 
        username: str, 
        email: str
    ) -> str:
        """Connect a user to a collaboration room."""
        await websocket.accept()
        
        session_id = str(uuid.uuid4())
        
        async with self.lock:
            # Store connection
            self.connections[session_id] = websocket
            self.user_sessions[user_id] = session_id
            self.session_users[session_id] = user_id
            self.session_rooms[session_id] = project_id
            
            # Create or get room
            if project_id not in self.rooms:
                self.rooms[project_id] = CollaborationRoom(
                    project_id=project_id,
                    created_at=datetime.now(timezone.utc),
                    users={},
                    locked_elements={},
                    recent_events=[],
                    chat_messages=[]
                )
            
            room = self.rooms[project_id]
            
            # Add user to room
            user = CollaborationUser(
                user_id=user_id,
                username=username,
                email=email,
                session_id=session_id,
                joined_at=datetime.now(timezone.utc),
                last_activity=datetime.now(timezone.utc)
            )
            room.users[session_id] = user
            
            # Create join event
            join_event = CollaborationEvent(
                event_type=CollaborationEventType.USER_JOINED,
                user_id=user_id,
                project_id=project_id,
                session_id=session_id,
                timestamp=datetime.now(timezone.utc),
                data={
                    "username": username,
                    "user_count": len(room.users)
                }
            )
            
            # Add to recent events
            room.recent_events.append(join_event)
            if len(room.recent_events) > room.max_recent_events:
                room.recent_events = room.recent_events[-room.max_recent_events:]
            
            # Send welcome message with room state
            await self.send_to_user(session_id, {
                "type": "connection_established",
                "session_id": session_id,
                "project_id": project_id,
                "room_users": [
                    {
                        "user_id": u.user_id,
                        "username": u.username,
                        "joined_at": u.joined_at.isoformat(),
                        "is_active": u.is_active
                    } for u in room.users.values()
                ],
                "locked_elements": room.locked_elements,
                "recent_events": [
                    {
                        "event_type": e.event_type.value,
                        "user_id": e.user_id,
                        "timestamp": e.timestamp.isoformat(),
                        "data": e.data
                    } for e in room.recent_events[-10:]  # Last 10 events
                ]
            })
            
            # Broadcast user joined to other users
            await self.broadcast_to_room(project_id, {
                "type": "user_joined",
                "user_id": user_id,
                "username": username,
                "user_count": len(room.users),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }, exclude_session=session_id)
            
            logger.info(f"User {username} ({user_id}) joined room {project_id}")
            
        return session_id
    
    async def disconnect(self, session_id: str):
        """Disconnect a user from collaboration."""
        async with self.lock:
            if session_id not in self.connections:
                return
            
            # Get user and room info
            user_id = self.session_users.get(session_id)
            project_id = self.session_rooms.get(session_id)
            
            if project_id and project_id in self.rooms:
                room = self.rooms[project_id]
                
                if session_id in room.users:
                    user = room.users[session_id]
                    username = user.username
                    
                    # Remove user from room
                    del room.users[session_id]
                    
                    # Release any locked elements
                    elements_to_unlock = [
                        elem_id for elem_id, lock_user_id in room.locked_elements.items()
                        if lock_user_id == user_id
                    ]
                    for elem_id in elements_to_unlock:
                        del room.locked_elements[elem_id]
                    
                    # Create leave event
                    leave_event = CollaborationEvent(
                        event_type=CollaborationEventType.USER_LEFT,
                        user_id=user_id,
                        project_id=project_id,
                        session_id=session_id,
                        timestamp=datetime.now(timezone.utc),
                        data={
                            "username": username,
                            "user_count": len(room.users),
                            "unlocked_elements": elements_to_unlock
                        }
                    )
                    
                    room.recent_events.append(leave_event)
                    if len(room.recent_events) > room.max_recent_events:
                        room.recent_events = room.recent_events[-room.max_recent_events:]
                    
                    # Broadcast user left to remaining users
                    await self.broadcast_to_room(project_id, {
                        "type": "user_left",
                        "user_id": user_id,
                        "username": username,
                        "user_count": len(room.users),
                        "unlocked_elements": elements_to_unlock,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
                    
                    # Clean up empty room
                    if len(room.users) == 0:
                        del self.rooms[project_id]
                        logger.info(f"Room {project_id} cleaned up (empty)")
                    
                    logger.info(f"User {username} ({user_id}) left room {project_id}")
            
            # Clean up mappings
            if session_id in self.connections:
                del self.connections[session_id]
            if user_id and user_id in self.user_sessions:
                del self.user_sessions[user_id]
            if session_id in self.session_users:
                del self.session_users[session_id]
            if session_id in self.session_rooms:
                del self.session_rooms[session_id]
    
    async def send_to_user(self, session_id: str, message: Dict[str, Any]):
        """Send message to a specific user."""
        if session_id in self.connections:
            try:
                await self.connections[session_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to session {session_id}: {e}")
                await self.disconnect(session_id)
    
    async def broadcast_to_room(
        self, 
        project_id: str, 
        message: Dict[str, Any], 
        exclude_session: Optional[str] = None
    ):
        """Broadcast message to all users in a room."""
        if project_id not in self.rooms:
            return
        
        room = self.rooms[project_id]
        failed_sessions = []
        
        for session_id, user in room.users.items():
            if session_id == exclude_session:
                continue
                
            try:
                await self.send_to_user(session_id, message)
            except Exception as e:
                logger.error(f"Error broadcasting to session {session_id}: {e}")
                failed_sessions.append(session_id)
        
        # Clean up failed sessions
        for session_id in failed_sessions:
            await self.disconnect(session_id)
    
    async def handle_message(self, session_id: str, message: Dict[str, Any]):
        """Handle incoming WebSocket message."""
        try:
            message_type = message.get("type")
            user_id = self.session_users.get(session_id)
            project_id = self.session_rooms.get(session_id)
            
            if not user_id or not project_id:
                await self.send_to_user(session_id, {
                    "type": "error",
                    "message": "Invalid session"
                })
                return
            
            # Update user activity
            await self.update_user_activity(session_id)
            
            # Handle different message types
            if message_type == "furniture_move":
                await self.handle_furniture_move(session_id, message)
            elif message_type == "furniture_add":
                await self.handle_furniture_add(session_id, message)
            elif message_type == "furniture_remove":
                await self.handle_furniture_remove(session_id, message)
            elif message_type == "cursor_update":
                await self.handle_cursor_update(session_id, message)
            elif message_type == "selection_change":
                await self.handle_selection_change(session_id, message)
            elif message_type == "element_lock":
                await self.handle_element_lock(session_id, message)
            elif message_type == "element_unlock":
                await self.handle_element_unlock(session_id, message)
            elif message_type == "chat_message":
                await self.handle_chat_message(session_id, message)
            elif message_type == "design_update":
                await self.handle_design_update(session_id, message)
            else:
                await self.send_to_user(session_id, {
                    "type": "error",
                    "message": f"Unknown message type: {message_type}"
                })
                
        except Exception as e:
            logger.error(f"Error handling message from session {session_id}: {e}")
            await self.send_to_user(session_id, {
                "type": "error",
                "message": "Internal server error"
            })
    
    async def update_user_activity(self, session_id: str):
        """Update user's last activity timestamp."""
        project_id = self.session_rooms.get(session_id)
        if project_id and project_id in self.rooms:
            room = self.rooms[project_id]
            if session_id in room.users:
                room.users[session_id].last_activity = datetime.now(timezone.utc)
    
    async def handle_furniture_move(self, session_id: str, message: Dict[str, Any]):
        """Handle furniture move event."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        furniture_id = message.get("furniture_id")
        position = message.get("position", {})
        
        if not furniture_id or not position:
            return
        
        # Create event
        event = CollaborationEvent(
            event_type=CollaborationEventType.FURNITURE_MOVE,
            user_id=user_id,
            project_id=project_id,
            session_id=session_id,
            timestamp=datetime.now(timezone.utc),
            data={
                "furniture_id": furniture_id,
                "position": position
            }
        )
        
        # Add to room events
        room = self.rooms[project_id]
        room.recent_events.append(event)
        if len(room.recent_events) > room.max_recent_events:
            room.recent_events = room.recent_events[-room.max_recent_events:]
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "furniture_moved",
            "furniture_id": furniture_id,
            "position": position,
            "moved_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_furniture_add(self, session_id: str, message: Dict[str, Any]):
        """Handle furniture add event."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        furniture_data = message.get("furniture_data", {})
        
        if not furniture_data:
            return
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "furniture_added",
            "furniture_data": furniture_data,
            "added_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_furniture_remove(self, session_id: str, message: Dict[str, Any]):
        """Handle furniture remove event."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        furniture_id = message.get("furniture_id")
        
        if not furniture_id:
            return
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "furniture_removed",
            "furniture_id": furniture_id,
            "removed_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_cursor_update(self, session_id: str, message: Dict[str, Any]):
        """Handle cursor position update."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        cursor_position = message.get("cursor_position", {})
        
        # Update user's cursor position
        room = self.rooms[project_id]
        if session_id in room.users:
            room.users[session_id].cursor_position = cursor_position
        
        # Broadcast to other users (throttled)
        await self.broadcast_to_room(project_id, {
            "type": "cursor_updated",
            "user_id": user_id,
            "cursor_position": cursor_position,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_selection_change(self, session_id: str, message: Dict[str, Any]):
        """Handle element selection change."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        selected_elements = message.get("selected_elements", [])
        
        # Update user's selection
        room = self.rooms[project_id]
        if session_id in room.users:
            room.users[session_id].selected_elements = selected_elements
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "selection_changed",
            "user_id": user_id,
            "selected_elements": selected_elements,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_element_lock(self, session_id: str, message: Dict[str, Any]):
        """Handle element lock request."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        element_id = message.get("element_id")
        
        if not element_id:
            return
        
        room = self.rooms[project_id]
        
        # Check if element is already locked
        if element_id in room.locked_elements:
            await self.send_to_user(session_id, {
                "type": "lock_failed",
                "element_id": element_id,
                "locked_by": room.locked_elements[element_id],
                "message": "Element is already locked by another user"
            })
            return
        
        # Lock the element
        room.locked_elements[element_id] = user_id
        
        # Confirm lock to user
        await self.send_to_user(session_id, {
            "type": "lock_acquired",
            "element_id": element_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "element_locked",
            "element_id": element_id,
            "locked_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_element_unlock(self, session_id: str, message: Dict[str, Any]):
        """Handle element unlock request."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        element_id = message.get("element_id")
        
        if not element_id:
            return
        
        room = self.rooms[project_id]
        
        # Check if user owns the lock
        if element_id not in room.locked_elements or room.locked_elements[element_id] != user_id:
            await self.send_to_user(session_id, {
                "type": "unlock_failed",
                "element_id": element_id,
                "message": "You don't have the lock for this element"
            })
            return
        
        # Unlock the element
        del room.locked_elements[element_id]
        
        # Confirm unlock to user
        await self.send_to_user(session_id, {
            "type": "lock_released",
            "element_id": element_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "element_unlocked",
            "element_id": element_id,
            "unlocked_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def handle_chat_message(self, session_id: str, message: Dict[str, Any]):
        """Handle chat message."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        text = message.get("text", "").strip()
        
        if not text:
            return
        
        room = self.rooms[project_id]
        user = room.users[session_id]
        
        chat_message = {
            "id": str(uuid.uuid4()),
            "text": text,
            "user_id": user_id,
            "username": user.username,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Add to room chat history
        room.chat_messages.append(chat_message)
        
        # Keep only last 100 messages
        if len(room.chat_messages) > 100:
            room.chat_messages = room.chat_messages[-100:]
        
        # Broadcast to all users
        await self.broadcast_to_room(project_id, {
            "type": "chat_message",
            "message": chat_message
        })
    
    async def handle_design_update(self, session_id: str, message: Dict[str, Any]):
        """Handle design update event."""
        user_id = self.session_users[session_id]
        project_id = self.session_rooms[session_id]
        
        design_changes = message.get("design_changes", {})
        
        if not design_changes:
            return
        
        # Broadcast to other users
        await self.broadcast_to_room(project_id, {
            "type": "design_updated",
            "design_changes": design_changes,
            "updated_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, exclude_session=session_id)
    
    async def get_room_info(self, project_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a collaboration room."""
        if project_id not in self.rooms:
            return None
        
        room = self.rooms[project_id]
        
        return {
            "project_id": project_id,
            "created_at": room.created_at.isoformat(),
            "user_count": len(room.users),
            "users": [
                {
                    "user_id": user.user_id,
                    "username": user.username,
                    "joined_at": user.joined_at.isoformat(),
                    "last_activity": user.last_activity.isoformat(),
                    "is_active": user.is_active,
                    "cursor_position": user.cursor_position,
                    "selected_elements": user.selected_elements
                }
                for user in room.users.values()
            ],
            "locked_elements": room.locked_elements,
            "recent_events_count": len(room.recent_events),
            "chat_messages_count": len(room.chat_messages)
        }
    
    async def cleanup_inactive_users(self, inactive_threshold_minutes: int = 30):
        """Clean up users who have been inactive for too long."""
        current_time = datetime.now(timezone.utc)
        inactive_sessions = []
        
        for project_id, room in self.rooms.items():
            for session_id, user in room.users.items():
                inactive_duration = current_time - user.last_activity
                if inactive_duration.total_seconds() > (inactive_threshold_minutes * 60):
                    inactive_sessions.append(session_id)
        
        for session_id in inactive_sessions:
            await self.disconnect(session_id)
            logger.info(f"Cleaned up inactive session: {session_id}")

# Global WebSocket manager instance
websocket_manager = WebSocketManager()