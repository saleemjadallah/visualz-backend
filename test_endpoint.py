#!/usr/bin/env python3
"""
Test the extract-parameters endpoint via HTTP
"""

import requests
import json

# Test the endpoint
url = "http://localhost:8000/api/ai/extract-parameters"
payload = {
    "message": "I'm planning a birthday party for my 3 year old",
    "existing_params": {},
    "conversation_history": []
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        print("\nSuccess! Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"\nError Response:")
        print(response.text)
        
except Exception as e:
    print(f"Request failed: {e}")