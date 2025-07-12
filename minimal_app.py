#!/usr/bin/env python3
"""Minimal FastAPI app to test if Railway can run anything"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

print("Starting minimal DesignVisualz API...")

app = FastAPI(title="DesignVisualz Minimal API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "DesignVisualz Minimal API", 
        "status": "running",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "unknown")
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "minimal"}

@app.post("/api/ai/generate-3d-scene")
async def generate_3d_scene(request: dict):
    """Mock 3D scene generation endpoint"""
    return {
        "scene_data": {
            "scene": {
                "name": "Mock_3D_Scene",
                "objects": 5,
                "cultural_theme": "modern",
                "celebration_props": 3
            }
        },
        "cultural_metadata": [
            {"type": "mock", "culture": "modern"}
        ],
        "accessibility_features": ["mock_accessibility"],
        "budget_breakdown": {"total": 1000},
        "preview_url": "/api/previews/mock-scene",
        "design_id": "mock_design_123",
        "generation_metadata": {
            "status": "success",
            "time": 1.5
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Running on port {port}")
    print(f"PORT env var: {os.getenv('PORT', 'NOT SET')}")
    uvicorn.run(app, host="0.0.0.0", port=port)