"""Enhanced AI Prompt System with MongoDB Integration for DesignVisualz"""
from typing import Dict, List, Any, Optional
import json
import logging
from datetime import datetime
from app.services.mongodb_cultural_database import MongoDBCulturalDatabase
from app.core.config import settings
import openai

logger = logging.getLogger(__name__)

class EnhancedAIPromptSystemWithMongoDB:
    def __init__(self):
        """Initialize the enhanced AI prompt system with MongoDB integration"""
        self.cultural_db = MongoDBCulturalDatabase()
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4-turbo-preview"  # Using latest GPT-4 model
        
        # Master prompt components
        self.master_context = self._load_master_context()
        self.design_philosophies = self._load_design_philosophies()
        
    def _load_master_context(self) -> str:
        """Load the master context for AI prompts"""
        return """You are an elite event design AI that combines:
        - Cultural intelligence from extensive research databases
        - Design expertise from top interior designers worldwide
        - Event planning wisdom from industry leaders
        - Deep understanding of cultural traditions and sensitivities
        - Age-appropriate design considerations
        - Budget-conscious solutions across all tiers
        
        Your responses must be:
        1. Culturally authentic and respectful
        2. Aesthetically sophisticated
        3. Practically implementable
        4. Budget-appropriate
        5. Age-suitable
        6. Inclusive and accessible
        """
    
    def _load_design_philosophies(self) -> Dict[str, str]:
        """Load design philosophies from various cultural perspectives"""
        return {
            "minimalist": "Less is more - focus on essential elements with perfect execution",
            "maximalist": "More is more - rich layers, bold patterns, abundant decoration",
            "traditional": "Honor time-tested traditions with authentic cultural elements",
            "contemporary": "Blend traditional wisdom with modern aesthetics",
            "fusion": "Respectfully combine multiple cultural elements",
            "sustainable": "Eco-conscious design with minimal environmental impact"
        }
    
    async def generate_culturally_aware_design_prompt(
        self,
        event_type: str,
        culture: str,
        celebration_type: str,
        age_group: str,
        budget_tier: str,
        guest_count: int,
        special_requirements: List[str] = None,
        venue_constraints: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate a comprehensive, culturally-aware design prompt"""
        
        # Fetch cultural data from MongoDB
        cultural_elements = self.cultural_db.get_cultural_elements(culture, event_type)
        traditions = self.cultural_db.get_celebration_traditions(culture, celebration_type, age_group)
        age_guidelines = self.cultural_db.get_age_appropriate_guidelines(age_group, event_type, culture)
        color_meanings = self.cultural_db.get_color_meanings(culture)
        design_patterns = self.cultural_db.get_design_patterns(culture)
        
        # Build the enhanced prompt
        prompt_sections = []
        
        # 1. Event Context
        prompt_sections.append(f"""
        EVENT CONTEXT:
        - Event Type: {event_type}
        - Celebration: {celebration_type}
        - Cultural Background: {culture}
        - Age Group: {age_group}
        - Guest Count: {guest_count}
        - Budget Tier: {budget_tier}
        - Special Requirements: {', '.join(special_requirements or ['None specified'])}
        """)
        
        # 2. Cultural Intelligence Section
        if cultural_elements:
            essential_elements = [elem for elem in cultural_elements if elem.get('importance_score', 0) > 0.8]
            prompt_sections.append(f"""
            CULTURAL ELEMENTS (from research database):
            Essential Elements:
            {self._format_cultural_elements(essential_elements[:5])}
            
            Cultural Significance:
            - These elements are crucial for authentic {culture} {celebration_type}
            - Each element carries deep cultural meaning and should be treated with respect
            """)
        
        # 3. Traditional Practices
        if traditions:
            prompt_sections.append(f"""
            TRADITIONAL PRACTICES:
            {self._format_traditions(traditions[:3])}
            
            These traditions must be incorporated respectfully and authentically.
            """)
        
        # 4. Age-Appropriate Guidelines
        if age_guidelines:
            prompt_sections.append(f"""
            AGE-APPROPRIATE CONSIDERATIONS:
            Safety: {', '.join(age_guidelines.get('safety_considerations', [])[:3])}
            Activities: {', '.join(age_guidelines.get('recommended_activities', [])[:3])}
            Design: {', '.join(age_guidelines.get('design_recommendations', [])[:3])}
            Avoid: {', '.join(age_guidelines.get('avoid_elements', [])[:3])}
            """)
        
        # 5. Color Palette
        if color_meanings:
            prompt_sections.append(f"""
            CULTURAL COLOR GUIDANCE:
            Auspicious Colors: {', '.join(color_meanings.get('auspicious_colors', [])[:5])}
            Avoid: {', '.join(color_meanings.get('colors_to_avoid', [])[:3])}
            
            Color meanings in {culture} culture:
            {self._format_color_meanings(color_meanings.get('color_meanings', {}))}
            """)
        
        # 6. Design Patterns
        if design_patterns:
            prompt_sections.append(f"""
            CULTURAL DESIGN PATTERNS:
            {self._format_design_patterns(design_patterns[:3])}
            """)
        
        # 7. Budget Considerations
        budget_guidance = self._get_budget_guidance(budget_tier, culture, event_type)
        prompt_sections.append(budget_guidance)
        
        # 8. Venue Constraints
        if venue_constraints:
            prompt_sections.append(f"""
            VENUE CONSTRAINTS:
            - Space: {venue_constraints.get('space_size', 'Not specified')}
            - Layout: {venue_constraints.get('layout', 'Flexible')}
            - Restrictions: {', '.join(venue_constraints.get('restrictions', ['None']))}
            """)
        
        # 9. Design Instructions
        prompt_sections.append("""
        DESIGN INSTRUCTIONS:
        Create a comprehensive event design that:
        1. Honors cultural authenticity while being contemporary
        2. Ensures age-appropriate safety and engagement
        3. Maximizes budget efficiency without compromising quality
        4. Creates memorable experiences through thoughtful details
        5. Balances tradition with modern aesthetics
        6. Ensures accessibility for all guests
        
        Provide:
        - Overall design concept and theme
        - Spatial layout with cultural considerations
        - Color palette with cultural meanings
        - Key decorative elements and their placement
        - Furniture and seating arrangements
        - Lighting design for ambiance
        - Cultural ceremony accommodations
        - Age-appropriate activity zones
        - Photo opportunity areas
        - Practical logistics and flow
        """)
        
        # Combine all sections
        full_prompt = self.master_context + "\n\n" + "\n\n".join(prompt_sections)
        
        # Generate AI response
        try:
            response = await self._generate_ai_response(full_prompt)
            
            # Validate cultural appropriateness
            validation = self.cultural_db.validate_cultural_appropriateness(
                self._extract_design_elements(response),
                culture,
                event_type
            )
            
            # Get vendor recommendations
            vendors = self.cultural_db.get_vendor_recommendations(
                culture, event_type, budget_tier=budget_tier
            )
            
            return {
                "success": True,
                "design_concept": response,
                "cultural_validation": validation,
                "vendor_recommendations": vendors[:5],  # Top 5 vendors
                "prompt_metadata": {
                    "culture": culture,
                    "event_type": event_type,
                    "age_group": age_group,
                    "budget_tier": budget_tier,
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating culturally-aware design: {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback_design": self._generate_fallback_design(
                    event_type, culture, celebration_type, budget_tier
                )
            }
    
    def _format_cultural_elements(self, elements: List[Dict[str, Any]]) -> str:
        """Format cultural elements for the prompt"""
        formatted = []
        for elem in elements:
            formatted.append(
                f"- {elem.get('name', '')}: {elem.get('description', '')} "
                f"(Significance: {elem.get('cultural_significance', '')})"
            )
        return "\n".join(formatted)
    
    def _format_traditions(self, traditions: List[Dict[str, Any]]) -> str:
        """Format traditions for the prompt"""
        formatted = []
        for tradition in traditions:
            formatted.append(
                f"- {tradition.get('name', '')}: {tradition.get('description', '')} "
                f"(Timing: {tradition.get('timing', 'Throughout event')})"
            )
        return "\n".join(formatted)
    
    def _format_color_meanings(self, color_meanings: Dict[str, Any]) -> str:
        """Format color meanings for the prompt"""
        formatted = []
        for color, meaning in list(color_meanings.items())[:5]:
            formatted.append(f"- {color}: {meaning}")
        return "\n".join(formatted)
    
    def _format_design_patterns(self, patterns: List[Dict[str, Any]]) -> str:
        """Format design patterns for the prompt"""
        formatted = []
        for pattern in patterns:
            formatted.append(
                f"- {pattern.get('name', '')}: {pattern.get('description', '')} "
                f"(Use in: {', '.join(pattern.get('suitable_events', []))})"
            )
        return "\n".join(formatted)
    
    def _get_budget_guidance(self, budget_tier: str, culture: str, event_type: str) -> str:
        """Get budget-specific guidance"""
        budget_tiers = {
            "economy": {
                "focus": "DIY elements, strategic splurges, community resources",
                "allocation": "40% venue, 30% food, 20% decorations, 10% extras"
            },
            "moderate": {
                "focus": "Balance of professional services and personal touches",
                "allocation": "35% venue, 35% catering, 20% design, 10% entertainment"
            },
            "premium": {
                "focus": "Professional execution, custom elements, luxury touches",
                "allocation": "30% venue, 30% catering, 25% design, 15% entertainment"
            },
            "luxury": {
                "focus": "Bespoke everything, exclusive venues, celebrity vendors",
                "allocation": "25% venue, 25% catering, 30% design, 20% experiences"
            }
        }
        
        tier_info = budget_tiers.get(budget_tier, budget_tiers["moderate"])
        
        return f"""
        BUDGET TIER: {budget_tier.upper()}
        Focus: {tier_info['focus']}
        Suggested Allocation: {tier_info['allocation']}
        
        Cultural Budget Considerations for {culture}:
        - Prioritize culturally essential elements
        - Find creative alternatives for expensive traditions
        - Leverage community resources and connections
        - Focus spending on elements with highest cultural impact
        """
    
    async def _generate_ai_response(self, prompt: str) -> str:
        """Generate AI response using OpenAI"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.master_context},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise
    
    def _extract_design_elements(self, design_text: str) -> List[str]:
        """Extract design elements from AI response for validation"""
        # Simple extraction logic - can be enhanced with NLP
        elements = []
        keywords = ["decorations", "flowers", "lighting", "furniture", "colors", 
                   "patterns", "symbols", "materials", "setup", "arrangement"]
        
        for keyword in keywords:
            if keyword in design_text.lower():
                # Extract nearby words as potential elements
                # This is simplified - production would use better NLP
                elements.append(keyword)
        
        return elements
    
    def _generate_fallback_design(self, event_type: str, culture: str, 
                                 celebration_type: str, budget_tier: str) -> Dict[str, Any]:
        """Generate a fallback design if AI fails"""
        return {
            "concept": f"Traditional {culture} {celebration_type} Design",
            "description": f"A respectful and authentic {culture} celebration design "
                          f"suitable for {event_type} within {budget_tier} budget",
            "key_elements": [
                "Cultural decorations appropriate for the occasion",
                "Traditional color scheme",
                "Age-appropriate seating and activity areas",
                "Cultural ceremony space",
                "Photo opportunity zones"
            ],
            "note": "This is a simplified design. Please consult with cultural experts for detailed planning."
        }
    
    async def generate_3d_scene_prompt(
        self,
        design_concept: Dict[str, Any],
        scene_type: str = "overview"
    ) -> str:
        """Generate prompt for 3D scene creation based on design concept"""
        
        cultural_elements = design_concept.get("cultural_validation", {})
        
        prompt = f"""
        Create a detailed 3D scene description for:
        
        SCENE TYPE: {scene_type}
        
        DESIGN CONCEPT:
        {design_concept.get('design_concept', '')}
        
        3D SCENE REQUIREMENTS:
        1. Accurate spatial layout with proper proportions
        2. Culturally authentic decorative elements
        3. Appropriate lighting for ambiance
        4. Realistic materials and textures
        5. Human scale references for spatial understanding
        
        TECHNICAL SPECIFICATIONS:
        - Use Three.js compatible geometry descriptions
        - Include color values in hex format
        - Specify material properties (metalness, roughness)
        - Define light positions and intensities
        - Include camera position for best view
        
        Generate a JSON structure with:
        - geometries: Array of 3D objects with position, scale, rotation
        - materials: Material definitions with colors and properties  
        - lights: Lighting setup for the scene
        - camera: Optimal camera position and target
        - animations: Simple animations for dynamic elements
        """
        
        return prompt
    
    def close(self):
        """Clean up resources"""
        if hasattr(self, 'cultural_db'):
            self.cultural_db.close()