#!/usr/bin/env python3
"""Test script to verify OpenAI API connection"""

import os
import asyncio
from openai import AsyncOpenAI
import json

async def test_openai_connection():
    """Test if OpenAI API is properly configured and working"""
    
    # Check if API key is set
    api_key = os.getenv("OPENAI_API_KEY", "")
    
    print("=== OpenAI API Connection Test ===\n")
    
    if not api_key:
        print("❌ ERROR: OPENAI_API_KEY environment variable is not set!")
        print("Please set it using: export OPENAI_API_KEY='your-api-key'")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    # Test API connection
    try:
        client = AsyncOpenAI(api_key=api_key)
        
        print("\nTesting parameter extraction with OpenAI...")
        
        test_prompt = """
        Extract event requirements from: "I want to plan a birthday party for my 3 year old"
        
        Return JSON with:
        {
          "extracted": {
            "event_type": "detected_event_type",
            "guest_count": "detected_number_or_null",
            "age_info": "any_age_information"
          },
          "confidence": "high|medium|low"
        }
        """
        
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are a parameter extraction assistant."},
                {"role": "user", "content": test_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        result = response.choices[0].message.content
        print(f"\nOpenAI Response:\n{result}")
        
        # Parse and validate response
        parsed = json.loads(result)
        print(f"\nParsed response:")
        print(f"- Event type: {parsed.get('extracted', {}).get('event_type')}")
        print(f"- Age info: {parsed.get('extracted', {}).get('age_info')}")
        print(f"- Confidence: {parsed.get('confidence')}")
        
        print("\n✅ OpenAI API is working correctly!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error connecting to OpenAI API: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        
        if "api_key" in str(e).lower():
            print("\nThis appears to be an API key issue. Please check:")
            print("1. Your API key is valid")
            print("2. Your API key has sufficient credits")
            print("3. The API key is properly set in the environment")
        
        return False

async def test_extraction_logic():
    """Test the extraction logic specifically for birthday party"""
    
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        print("\n⚠️  Skipping extraction logic test - no API key")
        return
    
    print("\n\n=== Testing Extraction Logic ===\n")
    
    client = AsyncOpenAI(api_key=api_key)
    
    # Test the exact prompt that would be used
    extraction_prompt = """
    Extract event requirements from: "Birthday (Child)"
    
    Available options:
    - event_type: ['wedding', 'birthday-child', 'birthday-adult', 'corporate', 'baby-shower', 'graduation', 'anniversary', 'cultural-celebration']
    
    Existing parameters: {}
    
    EXTRACTION RULES:
    1. "Birthday (Child)" -> event_type: "birthday-child"
    2. "Birthday (Adult)" -> event_type: "birthday-adult"
    
    Return JSON with:
    {
      "extracted": {
        "event_type": "birthday-child"
      },
      "missing_critical": ["guest_count", "budget_range"],
      "confidence": "high"
    }
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "Extract parameters exactly as requested."},
                {"role": "user", "content": extraction_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        result = response.choices[0].message.content
        print(f"Extraction result:\n{result}")
        
        parsed = json.loads(result)
        if parsed.get('extracted', {}).get('event_type') == 'birthday-child':
            print("\n✅ Extraction logic is working correctly!")
        else:
            print("\n❌ Extraction logic issue - not extracting 'birthday-child' from 'Birthday (Child)'")
            
    except Exception as e:
        print(f"\n❌ Error in extraction logic test: {str(e)}")

if __name__ == "__main__":
    print("Testing OpenAI API Connection and Parameter Extraction\n")
    
    # Run tests
    asyncio.run(test_openai_connection())
    asyncio.run(test_extraction_logic())
    
    print("\n\nDiagnostic Summary:")
    print("1. Check if OPENAI_API_KEY is set in environment")
    print("2. Verify the API key is valid and has credits")
    print("3. Check backend logs for any 500 errors")
    print("4. Look at browser console for failed API requests")