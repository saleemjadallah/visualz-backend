#!/usr/bin/env python3
"""Test Railway deployment endpoints"""
import requests
import json

def test_deployment():
    base_url = "https://visualz.xyz"
    
    print("Testing DesignVisualz Backend Deployment...\n")
    
    # Test 1: Basic health check
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}")
    
    # Test 2: Detailed health check
    print("\n")
    try:
        response = requests.get(f"{base_url}/health/detailed", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Detailed health check passed!")
            print(f"   Status: {data.get('status')}")
            print(f"   Database: {data.get('checks', {}).get('database', {}).get('status', 'unknown')}")
            print(f"   API Keys: {data.get('checks', {}).get('api_keys', {})}")
        else:
            print(f"❌ Detailed health check failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Detailed health check failed: {str(e)}")
    
    # Test 3: Root endpoint
    print("\n")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        if response.status_code == 200:
            print("✅ Root endpoint working!")
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {str(e)}")
    
    # Test 4: API Documentation
    print("\n")
    try:
        response = requests.get(f"{base_url}/docs", timeout=10)
        if response.status_code == 200:
            print("✅ API documentation is accessible!")
            print(f"   URL: {base_url}/docs")
        else:
            print(f"❌ API documentation returned status {response.status_code}")
    except Exception as e:
        print(f"❌ API documentation check failed: {str(e)}")

if __name__ == "__main__":
    test_deployment()