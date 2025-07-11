#!/usr/bin/env python3
"""
Test script to diagnose 403 Forbidden issues with parametric endpoints
"""

import requests
import json
import sys

def test_auth_flow():
    base_url = "http://localhost:8000"
    
    print("=== Testing Authentication Flow ===\n")
    
    # 1. Test health endpoint (no auth required)
    print("1. Testing health endpoint (no auth required):")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
    except Exception as e:
        print(f"   ERROR: {str(e)}\n")
        print("   Server might not be running!")
        return
    
    # 2. Test auth endpoint without token
    print("2. Testing auth endpoint without token:")
    try:
        response = requests.get(f"{base_url}/api/auth/me")
        print(f"   Status: {response.status_code}")
        print(f"   Expected: 403 (from HTTPBearer)")
        print(f"   Response: {response.text[:200]}\n")
    except Exception as e:
        print(f"   ERROR: {str(e)}\n")
    
    # 3. Test with invalid token format
    print("3. Testing with invalid Bearer token format:")
    headers = {"Authorization": "InvalidFormat"}
    try:
        response = requests.get(f"{base_url}/api/auth/me", headers=headers)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}\n")
    except Exception as e:
        print(f"   ERROR: {str(e)}\n")
    
    # 4. Test with valid Bearer format but invalid token
    print("4. Testing with valid Bearer format but invalid token:")
    headers = {"Authorization": "Bearer invalid_token_12345"}
    try:
        response = requests.get(f"{base_url}/api/auth/me", headers=headers)
        print(f"   Status: {response.status_code}")
        print(f"   Expected: 401 (from get_current_user)")
        print(f"   Response: {response.text[:200]}\n")
    except Exception as e:
        print(f"   ERROR: {str(e)}\n")
    
    # 5. Test parametric endpoint without token
    print("5. Testing parametric endpoint without token:")
    try:
        response = requests.post(f"{base_url}/api/parametric/furniture/generate", json={})
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}\n")
    except Exception as e:
        print(f"   ERROR: {str(e)}\n")
    
    # 6. Test parametric endpoint with invalid Bearer token
    print("6. Testing parametric endpoint with Bearer token:")
    headers = {"Authorization": "Bearer invalid_token_12345"}
    request_data = {
        "request": {
            "eventType": "wedding",
            "culture": "japanese",
            "guestCount": 100,
            "spaceDimensions": {"width": 20, "length": 30, "height": 4},
            "budgetRange": "medium",
            "formalityLevel": "formal",
            "specialRequirements": "Traditional elements"
        },
        "options": {
            "includeCulturalAnalysis": True,
            "generateRecommendations": True,
            "optimizeForBudget": True
        }
    }
    try:
        response = requests.post(
            f"{base_url}/api/parametric/furniture/generate", 
            json=request_data,
            headers=headers
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:300]}\n")
    except Exception as e:
        print(f"   ERROR: {str(e)}\n")
    
    print("=== Diagnosis ===")
    print("If you're getting 403 instead of 401, the issue is likely:")
    print("1. HTTPBearer is returning 403 when no token is provided")
    print("2. HTTPBearer is returning 403 for invalid token format")
    print("3. There might be middleware intercepting the request")
    print("\nThe fix is to ensure proper error handling in the auth flow.")

if __name__ == "__main__":
    test_auth_flow()