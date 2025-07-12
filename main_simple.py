#!/usr/bin/env python3
"""Simplified main app without custom middleware"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api import auth, projects, designs, ai, uploads, cv_analysis, cultural, websocket, cultural_philosophy, parametric_furniture, parametric, previews, ai_threejs
from app.services.database import init_db, close_db, get_database
import motor.motor_asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await init_db()
        print("✅ Database connection established")
    except Exception as e:
        print(f"⚠️ Database connection failed: {e}")
        print("⚠️ Running without database connection")
    yield
    # Shutdown
    try:
        await close_db()
    except Exception:
        pass

print(f"🚀 Starting DesignVisualz API on port {settings.PORT}")
print(f"📍 Environment: {settings.ENVIRONMENT}")
print(f"🌐 Railway URL: {settings.RAILWAY_STATIC_URL or 'Not set'}")
print(f"🔒 CORS Origins: {settings.CORS_ORIGINS}")

app = FastAPI(
    title="DesignVisualz API",
    description="AI-powered event visualization platform with parametric furniture generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan
)

# CORS middleware - must be added first
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=settings.ALLOWED_HOSTS
)

# NO CUSTOM CORS HANDLER - removed to avoid issues

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"]) 
app.include_router(designs.router, prefix="/api/designs", tags=["designs"])
# app.include_router(ai.router, prefix="/api/ai-legacy", tags=["ai"])  # COMMENTED OUT to avoid conflict
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(cv_analysis.router, prefix="/api/cv", tags=["computer_vision"])
app.include_router(cultural.router, prefix="/api/cultural", tags=["cultural"])
app.include_router(cultural_philosophy.router, prefix="/api/cultural-philosophy", tags=["cultural_philosophy"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])
app.include_router(parametric_furniture.router, prefix="/api/parametric-furniture", tags=["parametric_furniture"])
app.include_router(parametric.router, prefix="/api/parametric", tags=["parametric"])
app.include_router(previews.router, prefix="/api/previews", tags=["previews"])
app.include_router(ai_threejs.router, prefix="/api/ai", tags=["ai_threejs"])  # This has the 3D generation endpoint

@app.get("/")
async def root():
    return {
        "message": "DesignVisualz API", 
        "version": "1.0.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "port": settings.PORT
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint for Railway deployment.
    Returns basic health status without database dependency.
    """
    return {
        "status": "healthy",
        "service": "DesignVisualz API",
        "version": "1.0.0",
        "port": settings.PORT,
        "environment": settings.ENVIRONMENT,
        "railway_url": settings.RAILWAY_STATIC_URL or "not set"
    }

@app.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check that verifies all dependencies.
    Use this for debugging, not for deployment health checks.
    """
    health_status = {
        "status": "healthy",
        "service": "DesignVisualz API",
        "version": "1.0.0",
        "port": settings.PORT,
        "environment": settings.ENVIRONMENT,
        "checks": {}
    }
    
    # Check database connection
    try:
        db = await get_database()
        await db.command("ping")
        health_status["checks"]["database"] = {"status": "healthy", "message": "MongoDB connected"}
    except Exception as e:
        health_status["checks"]["database"] = {"status": "unhealthy", "message": str(e)}
        health_status["status"] = "degraded"
    
    # Check API keys presence (not the actual values)
    health_status["checks"]["api_keys"] = {
        "openai": bool(settings.OPENAI_API_KEY),
        "cloudinary": bool(settings.CLOUDINARY_API_KEY)
    }
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)