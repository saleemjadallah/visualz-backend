#!/usr/bin/env python3
"""Diagnose startup issues for Railway deployment"""
import sys
import os

print("=== DesignVisualz Backend Startup Diagnostics ===\n")

# 1. Check Python version
print(f"1. Python Version: {sys.version}")

# 2. Check working directory
print(f"2. Working Directory: {os.getcwd()}")

# 3. Check if app directory exists
app_dir = os.path.join(os.getcwd(), "app")
print(f"3. App directory exists: {os.path.exists(app_dir)}")

# 4. Check critical imports
print("\n4. Checking critical imports:")

critical_imports = [
    ("FastAPI", "fastapi"),
    ("Motor", "motor.motor_asyncio"),
    ("PyGLTFlib", "pygltflib"),
    ("Pydantic Settings", "pydantic_settings"),
    ("JOSE (JWT)", "jose"),
    ("Passlib", "passlib"),
    ("OpenAI", "openai"),
    ("Cloudinary", "cloudinary"),
    ("NumPy", "numpy"),
    ("Pillow", "PIL"),
    ("OpenCV", "cv2"),
]

missing_packages = []
for name, module in critical_imports:
    try:
        __import__(module)
        print(f"   ✅ {name}: OK")
    except ImportError as e:
        print(f"   ❌ {name}: MISSING - {str(e)}")
        missing_packages.append(module)

# 5. Check environment variables
print("\n5. Checking environment variables:")
env_vars = [
    "MONGODB_URL",
    "OPENAI_API_KEY",
    "SECRET_KEY",
    "PORT",
    "RAILWAY_STATIC_URL",
    "DATABASE_NAME"
]

for var in env_vars:
    value = os.getenv(var)
    if value:
        if var in ["MONGODB_URL", "OPENAI_API_KEY", "SECRET_KEY"]:
            print(f"   ✅ {var}: SET (hidden)")
        else:
            print(f"   ✅ {var}: {value}")
    else:
        print(f"   ❌ {var}: NOT SET")

# 6. Try importing the app
print("\n6. Testing app import:")
try:
    # Set Python path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    # Try minimal imports first
    print("   - Testing config import...")
    from app.core.config import settings
    print("   ✅ Config imported successfully")
    
    print("   - Testing main app import...")
    from app.main import app
    print("   ✅ App imported successfully!")
    
except Exception as e:
    print(f"   ❌ Failed to import app: {type(e).__name__}: {str(e)}")
    import traceback
    print("\nFull traceback:")
    traceback.print_exc()

# 7. Memory check (if possible)
print("\n7. System Resources:")
try:
    import psutil
    process = psutil.Process()
    print(f"   - Memory usage: {process.memory_info().rss / 1024 / 1024:.2f} MB")
    print(f"   - CPU percent: {process.cpu_percent()}%")
except ImportError:
    print("   - psutil not available for resource monitoring")

# Summary
print("\n=== SUMMARY ===")
if missing_packages:
    print(f"❌ Missing packages: {', '.join(missing_packages)}")
    print("   Fix: Ensure all packages in requirements.txt are installed")
else:
    print("✅ All critical packages are installed")

print("\n=== RECOMMENDATIONS ===")
if missing_packages:
    print("1. Check if Railway is using the correct Python version")
    print("2. Verify requirements.txt is being read during build")
    print("3. Check Railway build logs for pip install errors")
    
print("\nTo run this diagnostic on Railway:")
print("   Add to railway.json: \"startCommand\": \"python diagnose_startup.py\"")
print("   Deploy and check logs")