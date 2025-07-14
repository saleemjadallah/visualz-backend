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


app = FastAPI(
    title="DesignVisualz API",
    description="AI-powered event visualization platform with parametric furniture generation",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else "/docs",
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
    servers=[
        {"url": settings.RAILWAY_STATIC_URL, "description": "Production server"} if settings.RAILWAY_STATIC_URL else None,
        {"url": f"http://localhost:{settings.PORT}", "description": "Development server"}
    ] if settings.RAILWAY_STATIC_URL else [
        {"url": f"http://localhost:{settings.PORT}", "description": "Development server"}
    ]
)

# CORS middleware - must be added first
# Define allowed origins directly for clarity and to fix the issue
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3456",
    "https://visualz.xyz",
    "https://www.visualz.xyz",
    "https://visualz.events",
    "https://www.visualz.events",
    "http://visualz.events", # Adding http for flexibility
]

print(f"🔒 CORS Origins explicitly set to: {allowed_origins}")


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=settings.ALLOWED_HOSTS
)


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(designs.router, prefix="/api/designs", tags=["designs"])
app.include_router(ai.router, prefix="/api/ai-legacy", tags=["ai"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(cv_analysis.router, prefix="/api/cv", tags=["computer_vision"])
app.include_router(cultural.router, prefix="/api/cultural", tags=["cultural"])
app.include_router(cultural_philosophy.router, prefix="/api/cultural-philosophy", tags=["cultural_philosophy"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])
app.include_router(parametric_furniture.router, prefix="/api/parametric-furniture", tags=["parametric_furniture"])
app.include_router(parametric.router, prefix="/api/parametric", tags=["parametric"])
app.include_router(previews.router, prefix="/api/previews", tags=["previews"])
app.include_router(ai_threejs.router, prefix="/api/ai", tags=["ai_threejs"])

@app.get("/")
async def root():
    return {
        "message": "DesignVisualz API", 
        "version": "1.0.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "port": settings.PORT
    }
