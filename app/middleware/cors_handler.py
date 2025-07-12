"""Custom CORS handler to ensure visualz.events is always allowed"""
from fastapi import Request
from fastapi.responses import Response
from typing import Callable
import logging

logger = logging.getLogger(__name__)

async def cors_middleware(request: Request, call_next: Callable) -> Response:
    """Add CORS headers for visualz.events domain"""
    
    # Get the origin from the request
    origin = request.headers.get("origin", "")
    
    # Log the request for debugging
    if origin:
        logger.info(f"Request from origin: {origin}")
    
    # Process the request
    response = await call_next(request)
    
    # Always allow visualz.events and visualz.xyz domains
    allowed_origins = [
        "https://visualz.events",
        "https://www.visualz.events",
        "https://visualz.xyz",
        "https://www.visualz.xyz",
        "http://localhost:3000",
        "http://localhost:3456"
    ]
    
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "3600"
    
    return response