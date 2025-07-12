#!/usr/bin/env python3
"""
Test script for newly implemented AI endpoints
Tests the 4 missing endpoints that were just implemented
"""

import asyncio
import httpx
import json
from typing import Dict, Any

BASE_URL = "https://visualz.xyz"  # Production backend URL

async def test_endpoint(client: httpx.AsyncClient, method: str, url: str, data: Dict[Any, Any] = None) -> Dict[str, Any]:
    """Test a single endpoint and return results"""
    try:
        if method.upper() == "GET":
            response = await client.get(url)
        elif method.upper() == "POST":
            response = await client.post(url, json=data)
        else:
            return {"error": f"Unsupported method: {method}"}
        
        return {
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "response": response.json() if response.status_code < 500 else {"error": response.text},
            "url": url
        }
    except Exception as e:
        return {
            "status_code": 500,
            "success": False,
            "error": str(e),
            "url": url
        }

async def test_new_ai_endpoints():
    """Test all newly implemented AI endpoints"""
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        print("🚀 Testing Newly Implemented AI Endpoints")
        print("=" * 50)
        
        # Test 1: Cultural Suggestions
        print("\n1️⃣ Testing /api/ai/cultural-suggestions")
        result1 = await test_endpoint(
            client, "GET", 
            f"{BASE_URL}/api/ai/cultural-suggestions?event_type=birthday"
        )
        print(f"   Status: {result1['status_code']} | Success: {result1['success']}")
        if result1['success']:
            suggestions_count = result1['response'].get('count', 0)
            print(f"   📊 Found {suggestions_count} cultural suggestions")
        else:
            print(f"   ❌ Error: {result1.get('error', 'Unknown error')}")
        
        # Test 2: Celebration Suggestions  
        print("\n2️⃣ Testing /api/ai/celebration-suggestions")
        result2 = await test_endpoint(
            client, "GET",
            f"{BASE_URL}/api/ai/celebration-suggestions?event_type=birthday&cultural_background=american"
        )
        print(f"   Status: {result2['status_code']} | Success: {result2['success']}")
        if result2['success']:
            suggestions_count = result2['response'].get('count', 0)
            print(f"   🎉 Found {suggestions_count} celebration suggestions")
        else:
            print(f"   ❌ Error: {result2.get('error', 'Unknown error')}")
        
        # Test 3: Celebration Amenities
        print("\n3️⃣ Testing /api/ai/celebration-amenities/{celebration_type}")
        result3 = await test_endpoint(
            client, "GET",
            f"{BASE_URL}/api/ai/celebration-amenities/american-birthday"
        )
        print(f"   Status: {result3['status_code']} | Success: {result3['success']}")
        if result3['success']:
            amenities_count = result3['response'].get('count', 0)
            print(f"   🎪 Found {amenities_count} celebration amenities")
        else:
            print(f"   ❌ Error: {result3.get('error', 'Unknown error')}")
        
        # Test 4: Image Analysis (with mock data)
        print("\n4️⃣ Testing /api/ai/analyze-image")
        result4 = await test_endpoint(
            client, "POST",
            f"{BASE_URL}/api/ai/analyze-image",
            {
                "file_url": "https://example.com/test-room.jpg",
                "analysis_type": "comprehensive"
            }
        )
        print(f"   Status: {result4['status_code']} | Success: {result4['success']}")
        if result4['success']:
            print(f"   📸 Image analysis completed successfully")
        else:
            print(f"   ❌ Error: {result4.get('error', 'Unknown error')}")
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 SUMMARY")
        
        total_tests = 4
        successful_tests = sum([
            1 if result1['success'] else 0,
            1 if result2['success'] else 0, 
            1 if result3['success'] else 0,
            1 if result4['success'] else 0
        ])
        
        print(f"✅ Successful: {successful_tests}/{total_tests}")
        print(f"❌ Failed: {total_tests - successful_tests}/{total_tests}")
        
        if successful_tests == total_tests:
            print("🎉 All endpoints working correctly!")
        else:
            print("⚠️  Some endpoints need attention")
            
        # Detailed results for debugging
        print("\n📝 DETAILED RESULTS:")
        for i, result in enumerate([result1, result2, result3, result4], 1):
            print(f"{i}. {result['url']} - {result['status_code']} - {'✅' if result['success'] else '❌'}")
            if not result['success'] and 'response' in result:
                print(f"   Details: {json.dumps(result['response'], indent=2)[:200]}...")

if __name__ == "__main__":
    asyncio.run(test_new_ai_endpoints())