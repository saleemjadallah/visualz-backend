#!/usr/bin/env python3
"""
Debug script to identify 422 validation errors in EventRequirementsRequest
"""

import sys
sys.path.append('.')

from app.api.ai_threejs import EventRequirementsRequest
from pydantic import ValidationError
import json

def test_validation(payload, test_name):
    """Test validation and print detailed results"""
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        request = EventRequirementsRequest(**payload)
        print("✅ VALIDATION SUCCESS")
        print(f"Parsed event_type: {request.event_type}")
        print(f"Parsed guest_count: {request.guest_count}")
        print(f"Parsed cultural_background: {request.cultural_background}")
        return True
    except ValidationError as e:
        print("❌ VALIDATION FAILED:")
        print(f"Number of errors: {len(e.errors())}")
        for error in e.errors():
            print(f"  ❌ Field: {error['loc']}")
            print(f"     Type: {error['type']}")
            print(f"     Message: {error['msg']}")
            if 'input' in error:
                print(f"     Input: {error['input']}")
        return False
    except Exception as e:
        print(f"❌ OTHER ERROR: {type(e).__name__}: {e}")
        return False

# Test cases that match frontend scenarios
test_cases = [
    # Case 1: Minimal valid payload
    {
        "name": "Minimal Valid Payload",
        "payload": {
            "event_type": "birthday",
            "guest_count": 20
        }
    },
    
    # Case 2: Frontend payload with all expected fields
    {
        "name": "Complete Frontend Payload",
        "payload": {
            "event_type": "birthday",
            "celebration_type": "child-birthday",
            "cultural_preferences": ["american"],
            "cultural_background": ["american"],
            "budget_tier": "medium",
            "budget_range": "medium",
            "guest_count": 20,
            "age_range": "child",
            "space_data": {
                "width": 10,
                "depth": 10,
                "height": 3
            },
            "celebration_amenities": ["balloons", "photo-booth"],
            "style_preferences": ["colorful", "fun"],
            "special_needs": [],
            "accessibility_requirements": []
        }
    },
    
    # Case 3: Test with string guest_count (common JS issue)
    {
        "name": "String guest_count (JS conversion issue)",
        "payload": {
            "event_type": "birthday",
            "guest_count": "20"  # String instead of int
        }
    },
    
    # Case 4: Test with null/None values
    {
        "name": "Null values for optional fields",
        "payload": {
            "event_type": "birthday",
            "guest_count": 20,
            "cultural_preferences": None,
            "cultural_background": None,
            "space_data": None,
            "celebration_amenities": None,
            "style_preferences": None,
            "special_needs": None,
            "accessibility_requirements": None
        }
    },
    
    # Case 5: Test with empty strings
    {
        "name": "Empty strings for optional fields",
        "payload": {
            "event_type": "birthday",
            "guest_count": 20,
            "celebration_type": "",
            "budget_tier": "",
            "budget_range": "",
            "age_range": ""
        }
    },
    
    # Case 6: Test with missing required fields
    {
        "name": "Missing required fields",
        "payload": {
            "celebration_type": "birthday",
            "cultural_preferences": ["american"]
            # Missing event_type and guest_count
        }
    },
    
    # Case 7: Test with incorrect array structure
    {
        "name": "Incorrect array structure",
        "payload": {
            "event_type": "birthday",
            "guest_count": 20,
            "cultural_preferences": "american",  # String instead of array
            "cultural_background": "american"   # String instead of array
        }
    },
    
    # Case 8: Test with complex space_data structure
    {
        "name": "Complex space_data structure",
        "payload": {
            "event_type": "birthday",
            "guest_count": 20,
            "space_data": {
                "dimensions": {
                    "width": 10,
                    "depth": 10,
                    "height": 3
                },
                "room_type": "living_room",
                "features": ["windows", "fireplace"]
            }
        }
    }
]

def main():
    print("🔍 EventRequirementsRequest Validation Debugging")
    print("="*60)
    
    # Show model schema first
    print("\n📋 MODEL SCHEMA:")
    schema = EventRequirementsRequest.model_json_schema()
    required_fields = schema.get('required', [])
    properties = schema.get('properties', {})
    
    print(f"Required fields: {required_fields}")
    print("\nField definitions:")
    for field_name, field_def in properties.items():
        field_type = field_def.get('type', 'unknown')
        is_required = field_name in required_fields
        print(f"  {'🔴' if is_required else '🟡'} {field_name}: {field_type}")
    
    # Run test cases
    success_count = 0
    total_count = len(test_cases)
    
    for test_case in test_cases:
        success = test_validation(test_case["payload"], test_case["name"])
        if success:
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"SUMMARY: {success_count}/{total_count} tests passed")
    print(f"{'='*60}")
    
    # Provide minimal working payload for frontend
    if success_count > 0:
        print("\n✅ MINIMAL WORKING PAYLOAD FOR FRONTEND:")
        minimal_payload = {
            "event_type": "birthday",
            "guest_count": 20
        }
        print(json.dumps(minimal_payload, indent=2))
        
        print("\n✅ RECOMMENDED COMPLETE PAYLOAD FOR FRONTEND:")
        complete_payload = {
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
        print(json.dumps(complete_payload, indent=2))

if __name__ == "__main__":
    main()