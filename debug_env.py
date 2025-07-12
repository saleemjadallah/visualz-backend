#!/usr/bin/env python3
"""Debug script to check environment variables in Railway"""
import os
from app.core.config import settings

print("=== Environment Variables Debug ===")
print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {os.sys.path}")
print("\n=== Railway Variables ===")
print(f"RAILWAY_ENVIRONMENT: {os.getenv('RAILWAY_ENVIRONMENT', 'NOT SET')}")
print(f"RAILWAY_STATIC_URL: {os.getenv('RAILWAY_STATIC_URL', 'NOT SET')}")
print(f"PORT: {os.getenv('PORT', 'NOT SET')}")

print("\n=== Application Variables ===")
print(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'NOT SET')}")
print(f"SECRET_KEY exists: {'SECRET_KEY' in os.environ}")
print(f"MONGODB_URL exists: {'MONGODB_URL' in os.environ}")
print(f"OPENAI_API_KEY exists: {'OPENAI_API_KEY' in os.environ}")

print("\n=== Settings Object ===")
print(f"settings.ENVIRONMENT: {settings.ENVIRONMENT}")
print(f"settings.DEBUG: {settings.DEBUG}")
print(f"settings.PORT: {settings.PORT}")
print(f"settings.MONGODB_URL: {settings.MONGODB_URL[:30]}..." if settings.MONGODB_URL else "NOT SET")
print(f"settings.DATABASE_NAME: {settings.DATABASE_NAME}")
print(f"settings.RAILWAY_STATIC_URL: {settings.RAILWAY_STATIC_URL}")

print("\n=== All Environment Variables ===")
for key in sorted(os.environ.keys()):
    if any(sensitive in key.upper() for sensitive in ['KEY', 'SECRET', 'PASSWORD', 'TOKEN']):
        print(f"{key}: ***HIDDEN***")
    else:
        print(f"{key}: {os.environ[key]}")