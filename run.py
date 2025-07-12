#!/usr/bin/env python3
"""Simple runner that properly reads PORT from environment"""
import os
import uvicorn

# Get port from environment
port = int(os.getenv("PORT", 8000))
print(f"Starting on port {port}")

# Import and run the app
from main_simple import app

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )