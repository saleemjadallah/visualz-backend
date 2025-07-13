#!/usr/bin/env python3
"""
Test script to debug birthday party parameter extraction issue
"""
import asyncio
import httpx
import json

async def test_birthday_extraction():
    """Test the parameter extraction for birthday party specifically"""
    
    base_url = "http://localhost:8000"
    endpoint = "/api/ai/extract-parameters"
    
    # Test conversation flow
    conversation_flow = [
        {
            "message": "I want to plan a birthday party for my 3 year old",
            "existing_params": {},
            "conversation_history": []
        }
    ]
    
    async with httpx.AsyncClient() as client:
        existing_params = {}
        conversation_history = []
        
        for step in conversation_flow:
            print(f"\n{'='*60}")
            print(f"User: {step['message']}")
            print('='*60)
            
            try:
                response = await client.post(
                    f"{base_url}{endpoint}",
                    json={
                        "message": step['message'],
                        "existing_params": existing_params,
                        "conversation_history": conversation_history
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"\nExtracted params: {json.dumps(data['extracted_params'], indent=2)}")
                    print(f"Needs clarification: {data['needs_clarification']}")
                    print(f"AI Response: {data['response']}")
                    
                    if data.get('clarification_question'):
                        print(f"\nClarification needed: {data['clarification_question']}")
                        if data.get('clarification_options'):
                            print(f"Options: {data['clarification_options']['options']}")
                    
                    print(f"Ready to generate: {data['ready_to_generate']}")
                    
                    # Update for next iteration
                    existing_params = data['extracted_params']
                    conversation_history.append({
                        "type": "user",
                        "content": step['message']
                    })
                    conversation_history.append({
                        "type": "assistant",
                        "content": data['response']
                    })
                    
                    # If clarification is needed, simulate user response
                    if data['needs_clarification'] and 'event_type' in data.get('clarification_question', '').lower():
                        print("\n" + "="*60)
                        print("ISSUE DETECTED: AI is asking for event type even though user said 'birthday party'")
                        print("="*60)
                        
                        # Try another response
                        follow_up = "It's a birthday party"
                        print(f"\nUser (follow-up): {follow_up}")
                        
                        response2 = await client.post(
                            f"{base_url}{endpoint}",
                            json={
                                "message": follow_up,
                                "existing_params": existing_params,
                                "conversation_history": conversation_history
                            },
                            timeout=30.0
                        )
                        
                        if response2.status_code == 200:
                            data2 = response2.json()
                            print(f"\nSecond extraction params: {json.dumps(data2['extracted_params'], indent=2)}")
                            print(f"Second AI Response: {data2['response']}")
                            
                            if 'event_type' not in data2['extracted_params']:
                                print("\nPROBLEM CONFIRMED: Event type still not extracted after explicit mention")
                        
                else:
                    print(f"Error: HTTP {response.status_code}")
                    print(f"Response: {response.text}")
                    
            except Exception as e:
                print(f"Exception: {str(e)}")

if __name__ == "__main__":
    print("Testing Birthday Party Parameter Extraction")
    print("Make sure the backend server is running on http://localhost:8000")
    print("\nPress Ctrl+C to stop\n")
    
    try:
        asyncio.run(test_birthday_extraction())
    except KeyboardInterrupt:
        print("\nTest stopped by user")