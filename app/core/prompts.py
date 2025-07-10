"""
AI prompt templates based on the sophisticated prompt system from PromptSystem.md
"""

# Master system prompt combining design expertise
MASTER_SYSTEM_PROMPT = """
You are an expert event and interior designer with 20+ years of experience combining the aesthetic sensibilities of Kelly Wearstler, the spatial planning expertise of Studio McGee, the cultural sensitivity of Japanese design masters like Kengo Kuma, and the transformative vision of top event planners like Colin Cowie and Mindy Weiss.

Your role is to create sophisticated, culturally-aware event designs that balance:
- Universal design principles with cultural specificity
- Functional requirements with aesthetic excellence
- Budget constraints with aspirational beauty
- Technical precision with creative expression

Always apply the Golden Ratio (60/40 rule), maintain conversation distances of 7-9 feet, ensure 36-inch traffic pathways, and create multiple interaction zones. Consider lighting as architectural material with 2700-3000K warmth and three-layer hierarchy (ambient/task/accent).

Respond with specific, actionable design solutions that include exact measurements, material specifications, color codes, and cultural considerations.
"""

def build_design_prompt(space_data: dict, event_requirements: dict, cultural_context: dict) -> str:
    """Build a comprehensive design prompt based on user inputs."""
    
    prompt = f"""
DESIGN REQUEST:

SPACE DETAILS:
- Dimensions: {space_data.get('length', 0)}ft x {space_data.get('width', 0)}ft x {space_data.get('height', 8)}ft
- Room Type: {space_data.get('room_type', 'General Space')}
- Existing Features: {space_data.get('features', 'None specified')}
- Limitations: {space_data.get('limitations', 'None specified')}

EVENT REQUIREMENTS:
- Event Type: {event_requirements.get('event_type', 'General Celebration')}
- Guest Count: {event_requirements.get('guest_count', 10)} people
- Duration: {event_requirements.get('duration', '3 hours')}
- Formality Level: {event_requirements.get('formality', 'Casual')}
- Budget Range: ${event_requirements.get('budget', 1000)}
- Special Requirements: {event_requirements.get('special_requirements', 'None')}

CULTURAL CONTEXT:
- Primary Culture: {cultural_context.get('primary_culture', 'Contemporary Western')}
- Secondary Cultures: {cultural_context.get('secondary_cultures', [])}
- Religious Considerations: {cultural_context.get('religious', 'None')}
- Dietary Restrictions: {cultural_context.get('dietary', 'None')}

DESIGN OUTPUT REQUIRED:
1. 2D SPATIAL LAYOUT:
   - Exact furniture placement with coordinates
   - Traffic flow patterns with measurements
   - Zone designations (dining, socializing, etc.)
   - Safety clearances and accessibility paths

2. MATERIAL & COLOR SPECIFICATIONS:
   - Primary color palette with hex codes
   - Secondary accent colors
   - Recommended materials and textures
   - Lighting specifications (ambient, task, accent)

3. CULTURAL INTEGRATION:
   - Authentic cultural elements to incorporate
   - Respectful fusion techniques if multiple cultures
   - Traditional colors or patterns with meanings
   - Cultural protocol considerations

4. FURNITURE & DECOR RECOMMENDATIONS:
   - Specific furniture pieces with dimensions
   - Decorative elements with cultural significance
   - Table settings and arrangement details
   - Technology integration requirements

5. BUDGET BREAKDOWN:
   - Percentage allocation across categories
   - Priority items vs. optional elements
   - Cost-saving alternatives
   - DIY possibilities

Please provide a comprehensive design that honors cultural traditions while creating a functional, beautiful space within the specified budget.
"""
    
    return prompt

# Comprehensive Scenario-Based Prompt Library
EVENT_PROMPTS = {
    # INTIMATE HOME CELEBRATIONS
    "kids_birthday_party": """
KIDS BIRTHDAY PARTY DESIGN CONTEXT (Ages 4-8):
- Apply child-safe spatial planning: 25 sq ft per child minimum
- Create defined zones: active play (40%), quiet activities (20%), food service (20%), adult supervision (20%)
- Implement Montessori-inspired accessibility: all elements at child height (24-36 inches)
- Use color psychology for age group: primary colors for energy, pastels for calm zones
- Ensure safety clearances: 48-inch pathways around active zones, soft materials near play areas
- Integrate family traditions and heritage colors
- Consider dietary restrictions and cultural food preferences
- Balance Western celebration elements with family cultural practices
- Material specifications: washable, child-safe
- Lighting plan: no strobing, warm 2700K
- Safety compliance checklist required
""",
    
    "birthday_party": """
BIRTHDAY PARTY DESIGN CONTEXT (General):
- Apply child-safe spatial planning: 25 sq ft per child minimum
- Create defined zones: active play (40%), quiet activities (20%), food service (20%), adult supervision (20%)
- Use color psychology: primary colors for energy, pastels for calm zones
- Ensure safety clearances: 48-inch pathways around active zones
- Integrate family traditions and heritage colors
- Consider age-appropriate activities and safety measures
""",
    
    "dinner_party": """
DINNER PARTY DESIGN CONTEXT (6-12 guests):
- Apply Studio McGee's 60/30/10 color rule
- Implement Kelly Wearstler's Material Tray Method for texture layering
- Use conversation distance optimization: maximum 9 feet between seats
- Create intimate lighting: 100-200 lux ambient, accent spots on table centerpieces
- Dining: 30-40 sq ft per person for formal dining
- Pre-dinner reception area: 9 sq ft per person standing
- Multiple conversation clusters for 8+ guests
- Bar/beverage station with 36-inch service clearance
- Seasonal material integration (linen summer, wool winter)
- Height variation in table settings (candles, florals, serving pieces)
- Music acoustic considerations for conversation comfort
- Temperature zones for guest comfort
""",
    
    # CORPORATE & PROFESSIONAL EVENTS
    "corporate_event": """
CORPORATE EVENT DESIGN CONTEXT:
- Apply color psychology: Blue (trust), green (growth), yellow accents (creativity)
- Create collaborative zones: 6-8 person clusters with 48-inch circulation
- AV integration: screens visible from all positions
- Professional aesthetic maintaining creativity encouragement
- Subtle company branding through color psychology
- Cultural values reflection in spatial arrangement
""",
    
    "team_building": """
TEAM BUILDING WORKSHOP DESIGN CONTEXT (15-50 people):
- Apply color psychology: Blue (trust building), green (growth mindset), yellow accents (creativity)
- Create collaborative zones: 6-8 person clusters with 48-inch circulation
- Implement flexible furniture for rapid reconfiguration
- Design privacy gradients: open collaboration to quiet reflection spaces
- AV integration: screens visible from all positions
- Power access: every 6 feet for devices
- Storage solutions for personal items during activities
- Climate comfort for active participation
- Subtle company branding through color psychology
- Cultural values reflection in spatial arrangement
- Professional aesthetic maintaining creativity encouragement
""",
    
    "product_launch": """
PRODUCT LAUNCH DESIGN CONTEXT (100-500 guests):
- Create product journey narrative through spatial sequence
- Implement lighting drama: reveal moments for product highlights
- Design Instagram-worthy moments: geometric backdrops, strategic lighting
- Apply luxury event standards: 12-15 sq ft per person reception style
- Product display zones with museum-quality lighting
- Demo areas with acoustic separation
- VIP sections with elevated sight lines
- Press areas with optimal photo angles
- Entry sequence building anticipation
- Natural circulation preventing bottlenecks
- Multiple bar stations reducing wait times
- Strategic restroom and exit placement
""",
    
    # CULTURAL & RELIGIOUS CELEBRATIONS
    "wedding_reception": """
WEDDING RECEPTION DESIGN CONTEXT (50-200 guests):
- Research and honor both families' traditions
- Create fusion elements respecting cultural protocols
- Integrate traditional color meanings with modern aesthetics
- Design ceremony transition to celebration space
- Apply golden ratio to table arrangements
- Create sight line hierarchy focusing on couple
- Design dance floor using 4.5 sq ft per guest formula
- Implement cultural greeting and interaction patterns
- Source traditional textiles and decorative elements
- Balance heritage pieces with contemporary comfort
- Consider cultural dietary requirements in service design
- Integrate family heirloom display areas
- Map guest experience from arrival to departure
- Create photo opportunity zones with cultural significance
- Design quiet spaces for multi-generational comfort
- Plan lighting progression from ceremony to celebration
""",
    
    "religious_celebration": """
RELIGIOUS HOLIDAY CELEBRATION DESIGN CONTEXT:
- Research liturgical color requirements and seasonal traditions
- Design with prayer/meditation space considerations
- Implement gender-appropriate spatial arrangements if required
- Create accessibility for religious observance requirements
- Multi-generational interaction zones
- Traditional food service cultural protocols
- Cultural education display areas
- Intergenerational knowledge sharing spaces
- Traditional textiles and decorative elements
- Lighting respecting religious practices
- Acoustic considerations for music/prayer
- Sustainable practices honoring creation care
""",
    
    # SEASONAL & OUTDOOR CELEBRATIONS
    "garden_party": """
GARDEN PARTY DESIGN CONTEXT (20-80 guests):
- Work with existing landscape architecture
- Apply Japanese Ma principle using garden negative space
- Create shelter zones with natural and artificial elements
- Design lighting that enhances rather than competes with nature
- Contingency planning for temperature and precipitation
- Flexible furniture allowing quick reconfiguration
- Natural material integration with weather resistance
- Seasonal color palette reflecting garden elements
- Multiple shade and sun zones for guest comfort
- Acoustic considerations for outdoor sound travel
""",
    
    "holiday_celebration": """
HOLIDAY CELEBRATION DESIGN CONTEXT:
- Integrate traditional holiday colors and symbols
- Create nostalgic atmosphere with modern comfort
- Design for multi-generational participation
- Implement holiday-specific spatial requirements
- Consider gift exchange and tradition areas
- Seasonal material selection and decoration
- Holiday food service requirements
- Cultural and religious observance considerations
- Memory-making photo opportunities
- Flexible spaces for holiday activities
"""
}

def get_event_specific_prompt(event_type: str) -> str:
    """Get event-specific design context."""
    return EVENT_PROMPTS.get(event_type.lower().replace(" ", "_"), "")

# Cultural sensitivity validation prompt
CULTURAL_VALIDATION_PROMPT = """
Please review the following design elements for cultural appropriateness and sensitivity:

Design Elements: {design_elements}
Cultural Context: {cultural_context}

Evaluate:
1. Are all cultural elements used respectfully and authentically?
2. Are there any potential cultural appropriation concerns?
3. Do the fusion elements honor both/all cultures involved?
4. Are there any elements that might be offensive or insensitive?
5. Recommendations for improvement or community consultation?

Provide a sensitivity score (1-10) and detailed feedback.
"""