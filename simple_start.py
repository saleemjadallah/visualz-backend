#!/usr/bin/env python3
"""Simple startup script to test if the app can start"""
import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
    print("✅ App imported successfully")
    
    # Try to access basic info
    print(f"App title: {app.title}")
    print(f"App version: {app.version}")
    print("✅ App seems to be working")
    
except Exception as e:
    print(f"❌ Failed to import app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)