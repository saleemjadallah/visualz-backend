#!/usr/bin/env python3
"""Test script to debug and fix the birthday party loop issue locally"""

import json

# Simulating the extract_parameters logic from the code
SYSTEM_CAPABILITIES = {
    'event_types': [
        'wedding', 'birthday-child', 'birthday-adult', 'corporate', 
        'baby-shower', 'graduation', 'anniversary', 'cultural-celebration',
        'quinceañera', 'bar-bat-mitzvah', 'product-launch'
    ],
    'cultures': [
        'japanese', 'scandinavian', 'italian', 'french', 'modern',
        'american', 'mexican', 'korean', 'jewish', 'indian', 'mixed-heritage'
    ],
    'budget_ranges': [
        'under-2k', '2k-5k', '5k-15k', '15k-30k', '30k-50k', 'over-50k'
    ],
    'style_preferences': [
        'elegant', 'rustic', 'modern', 'traditional', 'minimalist', 
        'vintage', 'bohemian', 'industrial', 'wabi-sabi', 'hygge', 
        'bella-figura', 'savoir-vivre'
    ],
    'space_types': [
        'indoor', 'outdoor', 'ballroom', 'conference-room', 'backyard',
        'pavilion', 'home-living-room', 'rooftop', 'garden'
    ],
    'time_of_day': ['morning', 'afternoon', 'evening', 'all-day']
}

REQUIRED_PARAMS = ['event_type', 'guest_count', 'budget_range']

def validate_parameter(key: str, value: str) -> bool:
    """Validate parameter against system capabilities"""
    if key == 'guest_count':
        try:
            count = int(value)
            return 1 <= count <= 1000
        except:
            return False
    
    # Special handling for null values
    if value is None or value == "null":
        return False
    
    capability_key = f"{key}s" if key in ['event_type', 'culture', 'space_type'] else key
    if capability_key == 'styles':
        capability_key = 'style_preferences'
    
    # Convert value to string to handle any type issues
    value_str = str(value).lower()
    
    # Get the list of valid options and convert to lowercase for comparison
    valid_options = [opt.lower() for opt in SYSTEM_CAPABILITIES.get(capability_key, [])]
    
    return value_str in valid_options

def test_extraction_logic():
    """Test the extraction logic locally"""
    
    print("\n=== Testing Parameter Validation Logic ===\n")
    
    # Test 1: Check if "birthday party" matches any event type
    test_values = [
        ("event_type", "birthday party"),
        ("event_type", "birthday-party"),
        ("event_type", "birthday"),
        ("event_type", "birthday-child"),
        ("event_type", "birthday-adult"),
    ]
    
    for key, value in test_values:
        is_valid = validate_parameter(key, value)
        print(f"Testing {key}='{value}': Valid = {is_valid}")
    
    print("\n--- Available event types ---")
    for event_type in SYSTEM_CAPABILITIES['event_types']:
        print(f"  - {event_type}")
    
    # Test 2: Simulate parameter conversion
    print("\n=== Testing Parameter Conversion ===\n")
    
    # Simulate camelCase to snake_case conversion
    frontend_params = {
        "eventType": "birthday-child",
        "guestCount": 20,
        "budgetRange": "2k-5k"
    }
    
    converted_params = {}
    for key, value in frontend_params.items():
        snake_key = key
        if key == 'eventType':
            snake_key = 'event_type'
        elif key == 'guestCount':
            snake_key = 'guest_count'
        elif key == 'budgetRange' or key == 'budget':
            snake_key = 'budget_range'
        converted_params[snake_key] = value
    
    print(f"Frontend params: {frontend_params}")
    print(f"Converted params: {converted_params}")
    
    # Check missing params
    missing_required = [param for param in REQUIRED_PARAMS if param not in converted_params or not converted_params[param]]
    print(f"Missing required params: {missing_required}")
    
    # Test 3: Debug the clarification generation
    print("\n=== Testing Clarification Generation ===\n")
    
    def generate_clarification_question(missing_param: str, existing_params: dict) -> dict:
        """Generate bounded clarification questions"""
        questions = {
            'event_type': {
                'id': 'event_type',
                'question': 'What type of event are you planning?',
                'options': ['Wedding', 'Birthday Party', 'Corporate Event', 'Cultural Celebration', 'Baby Shower', 'Graduation', 'Anniversary'],
                'required': True
            },
            'guest_count': {
                'id': 'guest_count',
                'question': 'About how many people will attend?',
                'options': ['10-25 people', '25-50 people', '50-100 people', '100-200 people', '200+ people'],
                'required': True
            },
            'budget_range': {
                'id': 'budget_range',
                'question': "What's your approximate budget range?",
                'options': ['Under $2,000', '$2,000-$5,000', '$5,000-$15,000', '$15,000-$30,000', '$30,000-$50,000', '$50,000+'],
                'required': True
            }
        }
        
        return questions.get(missing_param, questions['event_type'])
    
    # Test with different scenarios
    scenarios = [
        {"event_type": None, "guest_count": None, "budget_range": None},
        {"event_type": "birthday-child", "guest_count": None, "budget_range": None},
        {"event_type": "birthday-child", "guest_count": 20, "budget_range": None},
        {"event_type": "birthday-child", "guest_count": 20, "budget_range": "2k-5k"},
    ]
    
    for i, params in enumerate(scenarios):
        print(f"\nScenario {i+1}: {params}")
        missing = [p for p in REQUIRED_PARAMS if p not in params or not params[p]]
        print(f"Missing: {missing}")
        if missing:
            clarification = generate_clarification_question(missing[0], params)
            print(f"Next question: {clarification['question']}")
        else:
            print("All parameters collected!")
    
    # Test 4: Check exact matching issue
    print("\n=== Testing Exact Match Issue ===\n")
    
    # The issue might be in how "Birthday Party" from the options is being matched
    # to the system capabilities which expect "birthday-child" or "birthday-adult"
    
    user_inputs = [
        "Birthday Party",
        "birthday party",
        "BIRTHDAY PARTY",
        "birthday-child",
        "birthday-adult"
    ]
    
    for user_input in user_inputs:
        # This is likely where the issue is - the frontend sends "Birthday Party"
        # but the backend expects "birthday-child" or "birthday-adult"
        lower_input = user_input.lower()
        matched = False
        
        # Check if it matches any event type
        for event_type in SYSTEM_CAPABILITIES['event_types']:
            if event_type.lower() == lower_input:
                print(f"'{user_input}' -> MATCHED: {event_type}")
                matched = True
                break
        
        if not matched:
            print(f"'{user_input}' -> NO MATCH FOUND")
            
            # Check what it should map to
            if 'birthday' in lower_input:
                if any(term in lower_input for term in ['child', 'kid', 'toddler']):
                    print(f"  -> Should map to: birthday-child")
                else:
                    print(f"  -> Should map to: birthday-adult")

if __name__ == "__main__":
    test_extraction_logic()