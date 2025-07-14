#!/usr/bin/env python3
"""Emergency test to see what's failing"""
import os
import sys

print("=== Emergency Test Starting ===")
print(f"Python: {sys.version}")
print(f"CWD: {os.getcwd()}")
print(f"PORT: {os.getenv('PORT', 'NOT SET')}")

# Test 1: Can we import FastAPI?
try:
    import fastapi
    print("✅ FastAPI import: OK")
except Exception as e:
    print(f"❌ FastAPI import: {e}")
    sys.exit(1)

# Test 2: Can we create a basic app?
try:
    from fastapi import FastAPI
    app = FastAPI()
    print("✅ FastAPI app creation: OK")
except Exception as e:
    print(f"❌ FastAPI app creation: {e}")
    sys.exit(1)

# Test 3: Can we start uvicorn?
try:
    import uvicorn
    print("✅ Uvicorn import: OK")
    
    @app.get("/")
    def root():
        return {"status": "emergency_test_working"}
    
    @app.get("/health")
    def health():
        return {"status": "ok"}
    
    port = int(os.getenv("PORT", 8000))
    print(f"Starting on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
    
except Exception as e:
    print(f"❌ Uvicorn start: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)