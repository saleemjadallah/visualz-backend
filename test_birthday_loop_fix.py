#!/usr/bin/env python3
"""Test script to debug and fix the birthday party loop issue"""

import requests
import json
import time

BASE_URL = "https://designvisualz-backend-production.up.railway.app"

def test_parameter_extraction_flow():
    """Test the parameter extraction flow with 'Birthday Party' input"""
    
    print("\n=== Testing Parameter Extraction Flow ===\n")
    
    # Test 1: Initial message
    print("Test 1: Initial message - 'I want to plan an event'")
    response = requests.post(
        f"{BASE_URL}/api/ai/extract-parameters",
        json={
            "message": "I want to plan an event",
            "existing_params": {},
            "conversation_history": []
        }
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    print(f"Needs clarification: {result.get('needsClarification', False)}")
    print(f"Clarification question: {result.get('clarificationQuestion', 'None')}")
    
    # Test 2: User says "Birthday Party"
    print("\nTest 2: User responds with 'Birthday Party'")
    response = requests.post(
        f"{BASE_URL}/api/ai/extract-parameters",
        json={
            "message": "Birthday Party",
            "existing_params": result.get('extractedParams', {}),
            "conversation_history": [
                {"type": "assistant", "content": result.get('response', '')},
                {"type": "user", "content": "Birthday Party"}
            ]
        }
    )
    print(f"Status: {response.status_code}")
    result2 = response.json()
    print(f"Response: {json.dumps(result2, indent=2)}")
    print(f"Extracted params: {result2.get('extractedParams', {})}")
    print(f"Needs clarification: {result2.get('needsClarification', False)}")
    print(f"Clarification question: {result2.get('clarificationQuestion', 'None')}")
    
    # Test 3: Try more specific birthday party message
    print("\nTest 3: More specific - 'I want to plan a birthday party'")
    response = requests.post(
        f"{BASE_URL}/api/ai/extract-parameters",
        json={
            "message": "I want to plan a birthday party",
            "existing_params": {},
            "conversation_history": []
        }
    )
    print(f"Status: {response.status_code}")
    result3 = response.json()
    print(f"Response: {json.dumps(result3, indent=2)}")
    print(f"Extracted params: {result3.get('extractedParams', {})}")
    
    # Test 4: Test with age specified
    print("\nTest 4: With age - 'Birthday party for my 3 year old'")
    response = requests.post(
        f"{BASE_URL}/api/ai/extract-parameters",
        json={
            "message": "Birthday party for my 3 year old",
            "existing_params": {},
            "conversation_history": []
        }
    )
    print(f"Status: {response.status_code}")
    result4 = response.json()
    print(f"Response: {json.dumps(result4, indent=2)}")
    print(f"Extracted params: {result4.get('extractedParams', {})}")
    
    # Test 5: Debug what happens when we have eventType already
    print("\nTest 5: Testing with existing eventType parameter")
    response = requests.post(
        f"{BASE_URL}/api/ai/extract-parameters",
        json={
            "message": "About 20 people",
            "existing_params": {"eventType": "birthday-adult"},
            "conversation_history": []
        }
    )
    print(f"Status: {response.status_code}")
    result5 = response.json()
    print(f"Response: {json.dumps(result5, indent=2)}")
    print(f"Extracted params: {result5.get('extractedParams', {})}")
    print(f"Still asking for event type?: {result5.get('clarificationQuestion', '').lower().find('event') > -1}")

if __name__ == "__main__":
    test_parameter_extraction_flow()