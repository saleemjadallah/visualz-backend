"""
Custom security implementations that return 401 instead of 403
"""
from typing import Optional
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer as FastAPIHTTPBearer
from fastapi.security.utils import get_authorization_scheme_param
from starlette.requests import Request
from fastapi.security import HTTPAuthorizationCredentials


class HTTPBearer(FastAPIHTTPBearer):
    """
    Custom HTTPBearer that returns 401 Unauthorized instead of 403 Forbidden
    when authentication is missing or invalid.
    """
    
    async def __call__(
        self, request: Request
    ) -> Optional[HTTPAuthorizationCredentials]:
        authorization = request.headers.get("Authorization")
        scheme, credentials = get_authorization_scheme_param(authorization)
        
        if not (authorization and scheme and credentials):
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None
                
        if scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None
                
        return HTTPAuthorizationCredentials(scheme=scheme, credentials=credentials)