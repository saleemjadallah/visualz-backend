#!/usr/bin/env python3
"""
Test script to verify parameter extraction endpoint is working correctly
"""
import asyncio
import httpx
import json

# Test cases for birthday party requests
test_messages = [
    "I'm planning a birthday party for my 3 year old",
    "I want to plan a 3rd birthday party",
    "Help me plan a birthday celebration for my toddler",
    "birthday party for 20 kids",
    "I need help with my child's birthday",
    "Can you help me plan a party?",
    "3 year old bday party"
]

async def test_extraction():
    """Test the parameter extraction endpoint"""
    
    # Use the local development server
    base_url = "http://localhost:8000"
    endpoint = "/api/ai/extract-parameters"
    
    async with httpx.AsyncClient() as client:
        for message in test_messages:
            print(f"\n{'='*60}")
            print(f"Testing message: '{message}'")
            print('='*60)
            
            try:
                response = await client.post(
                    f"{base_url}{endpoint}",
                    json={
                        "message": message,
                        "existing_params": {},
                        "conversation_history": []
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"Status: SUCCESS")
                    print(f"Extracted params: {json.dumps(data['extracted_params'], indent=2)}")
                    print(f"Needs clarification: {data['needs_clarification']}")
                    print(f"Response: {data['response']}")
                    if data.get('clarification_question'):
                        print(f"Clarification: {data['clarification_question']}")
                    print(f"Ready to generate: {data['ready_to_generate']}")
                else:
                    print(f"Status: FAILED (HTTP {response.status_code})")
                    print(f"Error: {response.text}")
                    
            except Exception as e:
                print(f"Status: ERROR")
                print(f"Exception: {str(e)}")

if __name__ == "__main__":
    print("Testing Parameter Extraction Endpoint")
    print("Make sure the backend server is running on http://localhost:8000")
    print("\nPress Ctrl+C to stop")
    
    try:
        asyncio.run(test_extraction())
    except KeyboardInterrupt:
        print("\nTest stopped by user")