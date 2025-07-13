#!/usr/bin/env python3
"""
Test script to verify the full conversation flow works correctly
This tests the complete birthday party planning flow
"""
import asyncio
import httpx
import json
from typing import Dict, Any, List

async def test_full_conversation_flow():
    """Test the complete conversation flow for birthday party planning"""
    
    base_url = "http://localhost:8000"
    endpoint = "/api/ai/extract-parameters"
    
    # Simulate the full conversation
    conversation_steps = [
        # Step 1: Initial message with birthday party
        {
            "user_says": "I want to plan a birthday party for my 3 year old",
            "expected_extraction": {"event_type": "birthday-child"},
            "expected_missing": ["guest_count", "budget_range"]
        },
        # Step 2: Answer about guest count
        {
            "user_says": "About 20 kids and their parents, so maybe 50 people total",
            "expected_extraction": {"guest_count": 50},
            "expected_missing": ["budget_range"]
        },
        # Step 3: Answer about budget
        {
            "user_says": "I'd like to keep it under $2000",
            "expected_extraction": {"budget_range": "under-2k"},
            "expected_missing": []
        }
    ]
    
    async with httpx.AsyncClient() as client:
        extracted_params = {}
        conversation_history = []
        
        for i, step in enumerate(conversation_steps):
            print(f"\n{'='*60}")
            print(f"Step {i+1}: User says: '{step['user_says']}'")
            print('='*60)
            
            try:
                # Prepare the request
                request_data = {
                    "message": step['user_says'],
                    "existing_params": extracted_params,  # Frontend sends camelCase
                    "conversation_history": conversation_history
                }
                
                print(f"Request data: {json.dumps(request_data, indent=2)}")
                
                response = await client.post(
                    f"{base_url}{endpoint}",
                    json=request_data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    print(f"\nResponse Status: SUCCESS")
                    print(f"Extracted params: {json.dumps(data.get('extractedParams', {}), indent=2)}")
                    print(f"Needs clarification: {data.get('needsClarification', False)}")
                    print(f"AI Response: {data.get('response', 'No response')}")
                    
                    if data.get('clarificationQuestion'):
                        print(f"\nClarification needed: {data['clarificationQuestion']}")
                        if data.get('clarificationOptions'):
                            print(f"Options: {data['clarificationOptions'].get('options', [])}")
                    
                    print(f"Ready to generate: {data.get('readyToGenerate', False)}")
                    
                    # Verify expectations
                    extracted = data.get('extractedParams', {})
                    for key, expected_value in step['expected_extraction'].items():
                        # Convert key to camelCase for comparison
                        camel_key = key
                        if key == 'event_type':
                            camel_key = 'eventType'
                        elif key == 'guest_count':
                            camel_key = 'guestCount'
                        elif key == 'budget_range':
                            camel_key = 'budget'
                        
                        if camel_key in extracted:
                            print(f"✓ {camel_key} extracted correctly: {extracted[camel_key]}")
                        else:
                            print(f"✗ ERROR: {camel_key} not extracted!")
                    
                    # Update for next iteration
                    extracted_params = extracted
                    conversation_history.append({
                        "type": "user",
                        "content": step['user_says'],
                        "timestamp": "2024-01-01T00:00:00Z"  # Add timestamp
                    })
                    conversation_history.append({
                        "type": "assistant",
                        "content": data.get('response', ''),
                        "timestamp": "2024-01-01T00:00:01Z"
                    })
                    
                    # Check if we're ready to generate after last step
                    if i == len(conversation_steps) - 1:
                        if data.get('readyToGenerate'):
                            print("\n✓ SUCCESS: All parameters collected, ready to generate!")
                        else:
                            print("\n✗ ERROR: Should be ready to generate but isn't!")
                        
                else:
                    print(f"Error: HTTP {response.status_code}")
                    print(f"Response: {response.text}")
                    break
                    
            except Exception as e:
                print(f"Exception: {str(e)}")
                import traceback
                traceback.print_exc()
                break
        
        # Final summary
        print(f"\n{'='*60}")
        print("FINAL SUMMARY")
        print('='*60)
        print(f"Final extracted parameters: {json.dumps(extracted_params, indent=2)}")
        print(f"Total conversation turns: {len(conversation_history) // 2}")

if __name__ == "__main__":
    print("Testing Full Conversation Flow for Birthday Party Planning")
    print("Make sure the backend server is running on http://localhost:8000")
    print("\nPress Ctrl+C to stop\n")
    
    try:
        asyncio.run(test_full_conversation_flow())
    except KeyboardInterrupt:
        print("\nTest stopped by user")