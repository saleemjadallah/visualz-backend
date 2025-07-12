#!/usr/bin/env python3
"""
Test script for corrected API endpoint paths
Tests the path mismatches that were fixed
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

async def test_corrected_endpoints():
    """Test the corrected API endpoints"""
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        print("🔧 Testing Corrected API Endpoint Paths")
        print("=" * 50)
        
        # Test 1: Cultural Validation (FIXED PATH)
        print("\n1️⃣ Testing CORRECTED /api/cultural/validate")
        validation_data = {
            "philosophyId": "wabi-sabi",
            "eventType": "birthday",
            "elements": ["wooden_table", "natural_lighting", "minimalist_decor"],
            "guestCount": 15
        }
        result1 = await test_endpoint(
            client, "POST", 
            f"{BASE_URL}/api/cultural/validate",
            validation_data
        )
        print(f"   Status: {result1['status_code']} | Success: {result1['success']}")
        if result1['success']:
            validation_result = result1['response']
            print(f"   ✅ Validation completed - Valid: {validation_result.get('valid', 'Unknown')}")
            if 'warnings' in validation_result:
                print(f"   ⚠️  Warnings: {len(validation_result['warnings'])}")
        else:
            print(f"   ❌ Error: {result1.get('error', 'Unknown error')}")
        
        # Test 2: Cultural Elements (FIXED PATH)
        print("\n2️⃣ Testing CORRECTED /api/cultural/philosophies/{id}/elements")
        result2 = await test_endpoint(
            client, "GET",
            f"{BASE_URL}/api/cultural/philosophies/wabi-sabi/elements"
        )
        print(f"   Status: {result2['status_code']} | Success: {result2['success']}")
        if result2['success']:
            elements_result = result2['response']
            elements_count = len(elements_result.get('elements', []))
            print(f"   🎨 Found {elements_count} cultural elements")
        else:
            print(f"   ❌ Error: {result2.get('error', 'Unknown error')}")
        
        # Test 3: Cultural Elements with Filter
        print("\n3️⃣ Testing CORRECTED /api/cultural/philosophies/{id}/elements?element_type=colors")
        result3 = await test_endpoint(
            client, "GET",
            f"{BASE_URL}/api/cultural/philosophies/wabi-sabi/elements?element_type=colors"
        )
        print(f"   Status: {result3['status_code']} | Success: {result3['success']}")
        if result3['success']:
            colors_result = result3['response']
            colors_count = len(colors_result.get('elements', []))
            print(f"   🌈 Found {colors_count} color elements")
        else:
            print(f"   ❌ Error: {result3.get('error', 'Unknown error')}")
        
        # Test 4: Old Incorrect Paths (Should return 404)
        print("\n4️⃣ Testing OLD INCORRECT paths (should fail)")
        old_path_1 = await test_endpoint(
            client, "POST",
            f"{BASE_URL}/api/ai/validate-cultural-sensitivity",
            validation_data
        )
        old_path_2 = await test_endpoint(
            client, "GET",
            f"{BASE_URL}/api/ai/cultural-elements/wabi-sabi"
        )
        
        print(f"   OLD validate path: {old_path_1['status_code']} (should be 404)")
        print(f"   OLD elements path: {old_path_2['status_code']} (should be 404)")
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 SUMMARY")
        
        successful_tests = sum([
            1 if result1['success'] else 0,
            1 if result2['success'] else 0,
            1 if result3['success'] else 0
        ])
        
        failed_old_paths = sum([
            1 if old_path_1['status_code'] == 404 else 0,
            1 if old_path_2['status_code'] == 404 else 0
        ])
        
        print(f"✅ New endpoints working: {successful_tests}/3")
        print(f"❌ Old endpoints properly disabled: {failed_old_paths}/2")
        
        if successful_tests == 3 and failed_old_paths == 2:
            print("🎉 All path corrections working perfectly!")
        elif successful_tests == 3:
            print("✅ New endpoints work, but old paths might still be active")
        else:
            print("⚠️  Some endpoints need attention")
            
        # Detailed results
        print("\n📝 DETAILED RESULTS:")
        for i, result in enumerate([result1, result2, result3], 1):
            status_icon = "✅" if result['success'] else "❌"
            print(f"{i}. {result['url']} - {result['status_code']} - {status_icon}")

if __name__ == "__main__":
    asyncio.run(test_corrected_endpoints())