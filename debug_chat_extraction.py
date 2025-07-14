#!/usr/bin/env python3
"""Debug script for chat parameter extraction"""

import asyncio
import json
from app.services.ai_service import AIDesignService
from app.config import settings
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_extraction():
    """Test parameter extraction with Birthday (Child) selection"""
    
    print(f"OpenAI API Key present: {'sk-' in os.getenv('OPENAI_API_KEY', '')}")
    
    # Simulate the exact message that would be sent
    test_message = "Birthday (Child)"
    existing_params = {}
    
    extraction_prompt = f"""
    Extract event planning parameters from user message: "{test_message}"
    
    CRITICAL: Only extract parameters we can actually support. Be flexible with understanding common requests.
    
    Available options:
    - event_type: ['wedding', 'birthday-child', 'birthday-adult', 'corporate', 'baby-shower', 'graduation', 'anniversary', 'cultural-celebration', 'quinceañera', 'bar-bat-mitzvah', 'product-launch']
    
    Existing parameters: {json.dumps(existing_params)}
    
    EXTRACTION RULES:
    1. Map user inputs to system event types:
       - "Birthday (Adult)" -> event_type: "birthday-adult"
       - "Birthday (Child)" -> event_type: "birthday-child"
    
    Return JSON with:
    {{
      "extracted": {{
        "event_type": "closest_match_or_null"
      }},
      "missing_critical": ["list", "of", "missing", "required", "fields"],
      "confidence": "high|medium|low",
      "response_tone": "friendly_acknowledgment_of_what_was_understood"
    }}
    """
    
    try:
        # Test the AI service
        ai_service = AIDesignService()
        print("\nCalling AI service with extraction prompt...")
        result = await ai_service.extract_parameters_from_text(extraction_prompt)
        
        print(f"\nAI Response:\n{result}")
        
        # Parse the response
        parsed_result = json.loads(result)
        print(f"\nParsed Result:\n{json.dumps(parsed_result, indent=2)}")
        
        # Check if birthday-child was extracted
        event_type = parsed_result.get('extracted', {}).get('event_type')
        print(f"\nExtracted event_type: {event_type}")
        print(f"Is 'birthday-child'? {event_type == 'birthday-child'}")
        
    except Exception as e:
        print(f"\nERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_extraction())