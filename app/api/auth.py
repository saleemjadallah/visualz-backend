from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer as FastAPIHTTPBearer
from datetime import datetime, timedelta
from bson import ObjectId
from typing import Optional
import logging

from app.models.user import UserCreate, UserLogin, User, Token, UserInDB
from app.core.security import verify_password, get_password_hash, create_access_token, verify_token
from app.core.custom_security import HTTPBearer
from app.services.database import get_database

router = APIRouter()
security = HTTPBearer()
security_optional = FastAPIHTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(credentials.credential)
    if not token_data:
        raise credentials_exception
    
    user_id = token_data.get("sub")
    if not user_id:
        raise credentials_exception
    
    # Get user from database
    db = await get_database()
    user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise credentials_exception
    
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

async def get_current_user_from_token(token: str) -> Optional[User]:
    """
    Get current user from JWT token (for WebSocket authentication).
    Returns None if authentication fails instead of raising exception.
    """
    try:
        token_data = verify_token(token)
        if not token_data:
            return None
        
        user_id = token_data.get("sub")
        if not user_id:
            return None
    except Exception:
        return None
    
    # Get user from database
    db = await get_database()
    user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if user_doc is None:
        return None
    
    return User(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        is_active=user_doc["is_active"],
        preferences=user_doc.get("preferences", {}),
        created_at=user_doc["created_at"],
        updated_at=user_doc["updated_at"]
    )

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None for demo purposes.
    This allows endpoints to work without authentication.
    """
    if not credentials:
        logger.info("No authentication provided - running in demo mode")
        return None
    
    try:
        token_data = verify_token(credentials.credential)
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

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user."""
    db = await get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_doc = UserInDB(
        email=user_data.email,
        full_name=user_data.full_name,
        preferences=user_data.preferences or {},
        hashed_password=get_password_hash(user_data.password)
    )
    
    # Insert user into database
    result = await db.users.insert_one(user_doc.dict(by_alias=True, exclude={"id"}))
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    # Get created user
    created_user = User(
        id=str(result.inserted_id),
        email=user_doc.email,
        full_name=user_doc.full_name,
        preferences=user_doc.preferences,
        is_active=user_doc.is_active,
        created_at=user_doc.created_at,
        updated_at=user_doc.updated_at
    )
    
    logger.info(f"New user registered: {user_data.email}")
    
    return Token(access_token=access_token, user=created_user)

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Authenticate user and return access token."""
    db = await get_database()
    
    # Find user by email
    user_doc = await db.users.find_one({"email": user_credentials.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user_doc["_id"])})
    
    # Create user response
    user = User(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        preferences=user_doc.get("preferences", {}),
        is_active=user_doc["is_active"],
        created_at=user_doc["created_at"],
        updated_at=user_doc["updated_at"]
    )
    
    logger.info(f"User logged in: {user_credentials.email}")
    
    return Token(access_token=access_token, user=user)

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@router.post("/logout")
def logout():
    """Logout user (client should remove token)."""
    return {"message": "Successfully logged out"}