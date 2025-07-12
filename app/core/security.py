from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    # Check if SECRET_KEY is properly configured
    if not settings.SECRET_KEY or settings.SECRET_KEY == "your-secret-key-change-in-production":
        # For development/testing, return a simple token
        import json
        import base64
        return base64.b64encode(json.dumps(data).encode()).decode()
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token."""
    # Check if SECRET_KEY is properly configured
    if not settings.SECRET_KEY or settings.SECRET_KEY == "your-secret-key-change-in-production":
        # For development/testing, try to decode simple base64 token
        try:
            import json
            import base64
            return json.loads(base64.b64decode(token))
        except:
            return None
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None