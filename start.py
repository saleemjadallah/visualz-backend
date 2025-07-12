#!/usr/bin/env python3
"""Wrapper script to start the app with better error handling"""
import os
import sys
import uvicorn

try:
    # Set Python path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    # Import and run the app
    from app.main import app
    
    # Get port from environment
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    print(f"Starting DesignVisualz API on {host}:{port}")
    
    # Run uvicorn
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info",
        access_log=True
    )
    
except Exception as e:
    print(f"Failed to start app: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)