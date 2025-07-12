#!/usr/bin/env python3
"""Startup check script to verify environment before running the app"""
import os
import sys

def check_environment():
    """Check if all required environment variables are set"""
    required_vars = {
        'MONGODB_URL': 'MongoDB connection string',
        'OPENAI_API_KEY': 'OpenAI API key',
        'SECRET_KEY': 'JWT secret key'
    }
    
    optional_vars = {
        'CLOUDINARY_CLOUD_NAME': 'Cloudinary cloud name',
        'CLOUDINARY_API_KEY': 'Cloudinary API key',
        'CLOUDINARY_API_SECRET': 'Cloudinary API secret',
        'DATABASE_NAME': 'Database name (defaults to designvisualz)'
    }
    
    print("=== DesignVisualz Backend Startup Check ===\n")
    
    missing_required = []
    for var, description in required_vars.items():
        value = os.getenv(var)
        if not value or value.startswith('your-') or value == 'mongodb://localhost:27017/designvisualz':
            print(f"❌ {var}: NOT SET - {description}")
            missing_required.append(var)
        else:
            print(f"✅ {var}: SET - {description}")
    
    print("\nOptional variables:")
    for var, description in optional_vars.items():
        value = os.getenv(var)
        if not value:
            print(f"⚠️  {var}: NOT SET - {description}")
        else:
            print(f"✅ {var}: SET - {description}")
    
    if missing_required:
        print(f"\n❌ STARTUP FAILED: Missing required environment variables: {', '.join(missing_required)}")
        print("\nPlease set these variables in Railway:")
        print("1. Go to your Railway project")
        print("2. Click on your backend service")
        print("3. Go to Variables tab")
        print("4. Add the missing variables")
        print("\nSee RAILWAY_ENV_SETUP.md for detailed instructions.")
        return False
    
    print("\n✅ All required environment variables are set!")
    return True

if __name__ == "__main__":
    if not check_environment():
        sys.exit(1)
    print("\nProceeding with application startup...")