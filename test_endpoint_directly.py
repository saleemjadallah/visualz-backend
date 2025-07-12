#!/usr/bin/env python3
"""
Test the /api/ai/generate-3d-scene endpoint directly to identify any other validation issues
"""

import sys
import os
sys.path.append('.')

import asyncio
import json
from app.api.ai_threejs import EventRequirementsRequest, generate_ai_threejs_scene
from fastapi import BackgroundTasks

async def test_endpoint():
    """Test the endpoint directly with a valid payload"""
    
    # Valid test payload
    test_payload = {
        "event_type": "birthday",
        "celebration_type": "child-birthday", 
        "cultural_preferences": ["american"],
        "cultural_background": ["american"],
        "budget_tier": "medium",
        "budget_range": "medium",
        "guest_count": 20,
        "age_range": "child",
        "space_data": {"width": 10, "depth": 10, "height": 3},
        "celebration_amenities": ["balloons"],
        "style_preferences": ["colorful"],
        "special_needs": [],
        "accessibility_requirements": []
    }
    
    print("🧪 Testing endpoint with valid payload...")
    print(f"Payload: {json.dumps(test_payload, indent=2)}")
    
    try:
        # Create request object
        request = EventRequirementsRequest(**test_payload)
        print("✅ Request validation passed")
        
        # Create mock background tasks
        background_tasks = BackgroundTasks()
        
        # Test the endpoint function (this might fail due to missing services)
        print("\n🔄 Calling endpoint function...")
        try:
            result = await generate_ai_threejs_scene(
                request=request,
                background_tasks=background_tasks,
                current_user=None  # Anonymous user
            )
            print("✅ Endpoint call succeeded!")
            print(f"Result type: {type(result)}")
            if hasattr(result, 'design_id'):
                print(f"Design ID: {result.design_id}")
            
        except Exception as endpoint_error:
            print(f"⚠️  Endpoint execution error: {type(endpoint_error).__name__}: {endpoint_error}")
            print("This is expected if services are not configured (MongoDB, OpenAI, etc.)")
            
            # Check if it's a validation error vs service error
            if "validation" in str(endpoint_error).lower() or "422" in str(endpoint_error):
                print("❌ This appears to be a validation issue!")
            else:
                print("✅ This appears to be a service configuration issue, not validation")
        
    except Exception as e:
        print(f"❌ Request validation failed: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(test_endpoint())