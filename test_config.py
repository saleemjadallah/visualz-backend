#!/usr/bin/env python3
"""Test configuration loading"""
import os
import sys

# Set a test environment variable
os.environ['MONGODB_URL'] = 'mongodb+srv://test:test@cluster.mongodb.net/testdb'

# Now import settings
from app.core.config import settings

print("Testing pydantic-settings configuration loading...")
print(f"MONGODB_URL from env: {os.environ.get('MONGODB_URL', 'NOT SET')}")
print(f"MONGODB_URL from settings: {settings.MONGODB_URL}")
print(f"Are they equal? {os.environ.get('MONGODB_URL') == settings.MONGODB_URL}")

# Test all important settings
print("\nAll Settings:")
for field_name in settings.__fields__:
    value = getattr(settings, field_name)
    if any(sensitive in field_name.upper() for sensitive in ['KEY', 'SECRET', 'PASSWORD', 'TOKEN']):
        print(f"{field_name}: ***HIDDEN***")
    elif isinstance(value, str) and len(value) > 50:
        print(f"{field_name}: {value[:30]}...")
    else:
        print(f"{field_name}: {value}")