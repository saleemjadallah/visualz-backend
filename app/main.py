from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api import auth, projects, designs, ai, uploads, cv_analysis, cultural, websocket, cultural_philosophy, parametric_furniture
# Temporarily disable parametric router to fix health check issues
# from app.api import parametric
from app.services.database import init_db, close_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()

app = FastAPI(
    title="DesignVisualz API",
    description="AI-powered event visualization platform with parametric furniture generation",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else "/docs",
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
    servers=[
        {"url": "https://visualz.xyz", "description": "Production server"},
        {"url": f"http://localhost:{settings.PORT}", "description": "Development server"}
    ]
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=settings.ALLOWED_HOSTS
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(designs.router, prefix="/api/designs", tags=["designs"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(cv_analysis.router, prefix="/api/cv", tags=["computer_vision"])
app.include_router(cultural.router, prefix="/api/cultural", tags=["cultural"])
app.include_router(cultural_philosophy.router, prefix="/api/cultural-philosophy", tags=["cultural_philosophy"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])
app.include_router(parametric_furniture.router, prefix="/api/parametric-furniture", tags=["parametric_furniture"])
# Temporarily disable parametric router to fix health check issues
# app.include_router(parametric.router, prefix="/api/parametric", tags=["parametric"])

@app.get("/")
async def root():
    return {"message": "DesignVisualz API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
