#!/usr/bin/env python3
"""Gradual test to identify what's breaking the app"""
import os
import sys
import uvicorn

print("=== Gradual Test Starting ===")

# Step 1: Basic imports
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    print("✅ Step 1: Basic FastAPI imports OK")
except Exception as e:
    print(f"❌ Step 1 failed: {e}")
    sys.exit(1)

# Step 2: Try importing our config
try:
    from app.core.config import settings
    print("✅ Step 2: Config import OK")
    print(f"   - PORT: {settings.PORT}")
    print(f"   - ENVIRONMENT: {settings.ENVIRONMENT}")
except Exception as e:
    print(f"❌ Step 2 failed: {e}")
    sys.exit(1)

# Step 3: Create app with lifespan (but simpler)
try:
    from contextlib import asynccontextmanager
    
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        print("Starting app...")
        yield
        print("Shutting down app...")
    
    app = FastAPI(title="Gradual Test", lifespan=lifespan)
    print("✅ Step 3: App with lifespan OK")
except Exception as e:
    print(f"❌ Step 3 failed: {e}")
    sys.exit(1)

# Step 4: Add CORS middleware
try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("✅ Step 4: CORS middleware OK")
except Exception as e:
    print(f"❌ Step 4 failed: {e}")
    sys.exit(1)

# Step 5: Try importing database (without connecting)
try:
    from app.services.database import init_db, close_db
    print("✅ Step 5: Database imports OK")
except Exception as e:
    print(f"❌ Step 5 failed: {e}")
    import traceback
    traceback.print_exc()

# Step 6: Try importing one router
try:
    from app.api import auth
    print("✅ Step 6: Auth router import OK")
except Exception as e:
    print(f"❌ Step 6 failed: {e}")
    import traceback
    traceback.print_exc()

# Add test endpoints
@app.get("/")
def root():
    return {"status": "gradual_test", "step": "all imports successful"}

@app.get("/health")
def health():
    return {"status": "ok"}

# Start the app
port = int(os.getenv("PORT", 8000))
print(f"Starting gradual test on port {port}...")
uvicorn.run(app, host="0.0.0.0", port=port)