"""
Enhanced AI Service with Cultural Philosophy Integration.
Incorporates comprehensive cultural research into AI-generated design recommendations.
"""

import openai
from typing import Dict, List, Any, Optional, Union
import json
import logging
from app.core.config import settings
from app.core.prompts import MASTER_SYSTEM_PROMPT, build_design_prompt, get_event_specific_prompt
from app.models.project import Project
from app.models.design import Design, ColorPalette, MaterialRecommendation, LightingPlan, BudgetBreakdown
from app.services.cultural_philosophy_service import CulturalPhilosophyService, CulturalPhilosophy

logger = logging.getLogger(__name__)

class EnhancedAIDesignService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.cultural_service = CulturalPhilosophyService()
    
    async def generate_culturally_informed_design(
        self,
        project: Project,
        cultural_philosophy: Optional[CulturalPhilosophy] = None,
        style_preferences: List[str] = None
    ) -> Dict[str, Any]:
        """Generate design with deep cultural philosophy integration."""
        try:
            # Get cultural philosophy data if specified
            cultural_context = None
            if cultural_philosophy:
                cultural_context = await self.cultural_service.get_philosophy_data(cultural_philosophy)
            
            # Build enhanced prompt with cultural intelligence
            enhanced_prompt = await self._build_cultural_design_prompt(
                project, cultural_context, style_preferences
            )
            
            # Generate design using cultural context
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": await self._get_enhanced_system_prompt()},
                    {"role": "user", "content": enhanced_prompt}
                ],
                temperature=0.7,
                max_tokens=2500
            )
            
            design_data = json.loads(response.choices[0].message.content)
            
            # Validate cultural appropriateness
            if cultural_philosophy:
                validation = await self.cultural_service.validate_cultural_appropriateness(
                    cultural_philosophy,
                    design_data.get("design_elements", [])
                )
                design_data["cultural_validation"] = validation
            
            return design_data
            
        except Exception as e:
            logger.error(f"Error generating culturally informed design: {e}")
            raise
    
    async def _build_cultural_design_prompt(
        self,
        project: Project,
        cultural_context: Optional[Any],
        style_preferences: List[str] = None
    ) -> str:
        """Build comprehensive prompt with cultural philosophy integration."""
        
        # Base project information
        space_data = {
            "length": project.space_data.length,
            "width": project.space_data.width,
            "height": project.space_data.height,
            "room_type": project.space_data.room_type,
            "features": project.space_data.features,
            "limitations": project.space_data.limitations
        }
        
        event_requirements = {
            "event_type": project.event_requirements.event_type,
            "guest_count": project.event_requirements.guest_count,
            "duration": project.event_requirements.duration,
            "formality": project.event_requirements.formality,
            "budget": project.event_requirements.budget,
            "special_requirements": project.event_requirements.special_requirements
        }
        
        prompt_parts = [
            f"Design an event space with the following specifications:",
            f"Space: {space_data}",
            f"Event: {event_requirements}",
        ]
        
        # Add cultural philosophy context if available
        if cultural_context:
            cultural_guidance = f"""
            
CULTURAL PHILOSOPHY GUIDANCE - {cultural_context.name} ({cultural_context.culture}):

Foundation: {cultural_context.foundation}

Core Principles:
{chr(10).join(f"• {principle}" for principle in cultural_context.core_principles)}

Authentic Color Palette:
• Primary: {", ".join(cultural_context.color_palette.primary)}
• Secondary: {", ".join(cultural_context.color_palette.secondary)}
• Accent: {", ".join(cultural_context.color_palette.accent)}
• AVOID: {", ".join(cultural_context.color_palette.avoid)}

Authentic Materials:
{chr(10).join(f"• {material.name}: {material.description}" for material in cultural_context.materials)}

Spatial Arrangement Guidelines:
{chr(10).join(f"• {arrangement}" for arrangement in cultural_context.spatial_arrangements)}

Cultural Sensitivity Requirements:
• Sacred elements to respect: {", ".join(cultural_context.cultural_sensitivity.get("sacred_elements", []))}
• Elements to avoid: {", ".join(cultural_context.cultural_sensitivity.get("avoid", []))}
• Respect required for: {", ".join(cultural_context.cultural_sensitivity.get("respect_required", []))}

Regional Variations Available:
{chr(10).join(f"• {var.name}: {var.description}" for var in cultural_context.regional_variations)}

Budget Allocation Guidance:
{chr(10).join(f"• {category}: {percentage}" for category, percentage in cultural_context.budget_allocation.items())}

Authentic Vendor Sources:
{chr(10).join(f"• {vendor['name']} ({vendor['location']}): {vendor['specialty']}" for vendor in cultural_context.vendor_sources)}
            """
            prompt_parts.append(cultural_guidance)
        
        # Add style preferences
        if style_preferences:
            prompt_parts.append(f"Style Preferences: {', '.join(style_preferences)}")
        
        # Add specific requirements
        prompt_parts.append("""
        
RESPONSE FORMAT:
Please provide your design recommendations in the following JSON format:
{
    "design_concept": "Overall design concept description",
    "color_palette": {
        "primary": ["#hex1", "#hex2"],
        "secondary": ["#hex3", "#hex4"],
        "accent": ["#hex5", "#hex6"]
    },
    "materials": [
        {
            "name": "Material name",
            "description": "Why this material fits",
            "authenticity_notes": "Cultural authenticity markers"
        }
    ],
    "spatial_layout": {
        "arrangement": "Description of space arrangement",
        "flow": "Guest flow considerations",
        "focal_points": ["List of key focal points"]
    },
    "lighting_plan": {
        "ambient": "Ambient lighting description",
        "task": ["Task lighting elements"],
        "accent": ["Accent lighting elements"],
        "cultural_considerations": "Cultural lighting requirements"
    },
    "furniture_recommendations": [
        {
            "name": "Furniture piece",
            "category": "seating/table/storage/etc",
            "cultural_significance": "Cultural relevance if applicable",
            "positioning": "Recommended placement"
        }
    ],
    "cultural_elements": [
        {
            "element": "Cultural element name",
            "significance": "Cultural meaning",
            "implementation": "How to implement respectfully"
        }
    ],
    "budget_breakdown": {
        "category": "percentage or amount",
        "cultural_priorities": "Where to invest for authenticity"
    },
    "cultural_appropriateness": {
        "validation": "How this design respects cultural values",
        "sensitivities": "Potential cultural sensitivity concerns",
        "authenticity_markers": "Elements that ensure cultural authenticity"
    },
    "vendor_recommendations": [
        {
            "category": "What to purchase",
            "recommended_vendors": "Suggested authentic suppliers",
            "quality_indicators": "What to look for in authentic pieces"
        }
    ],
    "implementation_timeline": {
        "phase_1": "Initial setup requirements",
        "phase_2": "Cultural element integration",
        "phase_3": "Final authenticity validation"
    }
}
        """)
        
        return "\n".join(prompt_parts)
    
    async def _get_enhanced_system_prompt(self) -> str:
        """Get enhanced system prompt with cultural intelligence."""
        return f"""
{MASTER_SYSTEM_PROMPT}

ENHANCED CULTURAL INTELLIGENCE SYSTEM:

You are now enhanced with comprehensive cultural philosophy research covering four major design philosophies:

1. WABI-SABI (Japanese): Beauty in imperfection, impermanence, mindful simplicity
2. HYGGE (Danish/Scandinavian): Cozy contentment, democratic design, intimate togetherness
3. BELLA FIGURA (Italian): Dignity, social grace, artisan craftsmanship, regional authenticity
4. SAVOIR-VIVRE (French): Art of living, quality over quantity, sophisticated simplicity

For each philosophy, you have access to:
- Historical and cultural foundations
- Authentic color palettes with specific hex codes
- Traditional materials with quality indicators
- Spatial arrangement principles
- Cultural sensitivity guidelines
- Regional variations and their characteristics
- Authentic vendor sources and suppliers
- Budget allocation strategies
- Implementation protocols

CULTURAL SENSITIVITY REQUIREMENTS:
- Always respect sacred elements and traditional practices
- Avoid cultural appropriation and stereotypes
- Ensure authenticity through proper materials and techniques
- Validate appropriateness of cultural elements
- Provide educational context for cultural choices
- Suggest authentic suppliers and artisans

DESIGN EXCELLENCE STANDARDS:
- Prioritize authenticity over aesthetics
- Use traditional materials and techniques when specified
- Respect cultural proportions and spatial relationships
- Integrate cultural philosophy into every design decision
- Provide clear cultural context and reasoning
- Ensure practical implementation with authentic sources

When incorporating cultural elements, always:
1. Explain the cultural significance
2. Provide authentic implementation guidance
3. Suggest appropriate vendors and suppliers
4. Include budget allocation specific to cultural priorities
5. Validate cultural appropriateness
6. Offer educational context for users

Remember: You're not just designing spaces, you're creating culturally meaningful experiences that honor traditions while serving contemporary needs.
        """
    
    async def get_cultural_design_recommendations(
        self,
        event_type: str,
        cultural_philosophy: CulturalPhilosophy,
        budget_range: str,
        guest_count: int,
        specific_requirements: List[str] = None
    ) -> Dict[str, Any]:
        """Get specific cultural design recommendations."""
        try:
            # Get philosophy data
            philosophy_data = await self.cultural_service.get_philosophy_data(cultural_philosophy)
            
            # Get design recommendations
            recommendations = await self.cultural_service.get_design_recommendations(
                philosophy=cultural_philosophy,
                event_type=event_type,
                budget_range=budget_range,
                guest_count=guest_count
            )
            
            # Build AI prompt for specific recommendations
            prompt = f"""
            Generate specific design recommendations for a {event_type} event using {cultural_philosophy.value} philosophy.
            
            Event Details:
            - Type: {event_type}
            - Guest Count: {guest_count}
            - Budget Range: {budget_range}
            - Special Requirements: {specific_requirements or "None"}
            
            Cultural Philosophy: {philosophy_data.name}
            Foundation: {philosophy_data.foundation}
            Core Principles: {", ".join(philosophy_data.core_principles)}
            
            Please provide specific, actionable recommendations in JSON format including:
            - Specific color combinations from the authentic palette
            - Detailed material specifications with suppliers
            - Spatial arrangement guidelines
            - Cultural element integration
            - Budget allocation specific to this philosophy
            - Implementation timeline
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": await self._get_enhanced_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            ai_recommendations = json.loads(response.choices[0].message.content)
            
            # Combine with cultural service recommendations
            return {
                "philosophy": cultural_philosophy.value,
                "cultural_foundation": philosophy_data.foundation,
                "ai_recommendations": ai_recommendations,
                "cultural_guidelines": recommendations,
                "vendor_sources": philosophy_data.vendor_sources,
                "cultural_sensitivity": philosophy_data.cultural_sensitivity
            }
            
        except Exception as e:
            logger.error(f"Error getting cultural design recommendations: {e}")
            raise
    
    async def validate_design_cultural_appropriateness(
        self,
        design_elements: List[str],
        cultural_philosophy: CulturalPhilosophy,
        event_context: str
    ) -> Dict[str, Any]:
        """Validate design elements for cultural appropriateness using AI."""
        try:
            # Get cultural philosophy data
            philosophy_data = await self.cultural_service.get_philosophy_data(cultural_philosophy)
            
            # Get baseline validation
            validation = await self.cultural_service.validate_cultural_appropriateness(
                cultural_philosophy, design_elements
            )
            
            # Enhance with AI analysis
            prompt = f"""
            Analyze the following design elements for cultural appropriateness in the context of {cultural_philosophy.value} philosophy:
            
            Design Elements: {", ".join(design_elements)}
            Event Context: {event_context}
            
            Cultural Philosophy: {philosophy_data.name}
            Foundation: {philosophy_data.foundation}
            Sacred Elements: {", ".join(philosophy_data.cultural_sensitivity.get("sacred_elements", []))}
            Elements to Avoid: {", ".join(philosophy_data.cultural_sensitivity.get("avoid", []))}
            
            Provide detailed cultural analysis in JSON format:
            {
                "appropriateness_score": 0-100,
                "detailed_analysis": "Comprehensive cultural analysis",
                "respectful_elements": ["Elements that honor the culture"],
                "concerning_elements": ["Elements that may be inappropriate"],
                "improvement_suggestions": ["Specific suggestions for better cultural alignment"],
                "educational_context": "Cultural education for users",
                "authentic_alternatives": ["Authentic alternatives if needed"]
            }
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": await self._get_enhanced_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent analysis
                max_tokens=1500
            )
            
            ai_analysis = json.loads(response.choices[0].message.content)
            
            # Combine with baseline validation
            return {
                "baseline_validation": validation,
                "ai_analysis": ai_analysis,
                "philosophy": cultural_philosophy.value,
                "overall_appropriateness": ai_analysis.get("appropriateness_score", 0) >= 80
            }
            
        except Exception as e:
            logger.error(f"Error validating cultural appropriateness: {e}")
            raise
    
    async def generate_cultural_fusion_design(
        self,
        project: Project,
        primary_philosophy: CulturalPhilosophy,
        secondary_philosophy: CulturalPhilosophy,
        fusion_approach: str = "respectful_blend"
    ) -> Dict[str, Any]:
        """Generate a design that respectfully blends two cultural philosophies."""
        try:
            # Get both philosophy data
            primary_data = await self.cultural_service.get_philosophy_data(primary_philosophy)
            secondary_data = await self.cultural_service.get_philosophy_data(secondary_philosophy)
            
            # Build fusion prompt
            fusion_prompt = f"""
            Create a respectful cultural fusion design that blends {primary_philosophy.value} ({primary_data.culture}) and {secondary_philosophy.value} ({secondary_data.culture}) philosophies.
            
            PRIMARY PHILOSOPHY - {primary_data.name}:
            Foundation: {primary_data.foundation}
            Core Principles: {", ".join(primary_data.core_principles)}
            Primary Colors: {", ".join(primary_data.color_palette.primary)}
            Key Materials: {", ".join(material.name for material in primary_data.materials)}
            
            SECONDARY PHILOSOPHY - {secondary_data.name}:
            Foundation: {secondary_data.foundation}
            Core Principles: {", ".join(secondary_data.core_principles)}
            Primary Colors: {", ".join(secondary_data.color_palette.primary)}
            Key Materials: {", ".join(material.name for material in secondary_data.materials)}
            
            Fusion Approach: {fusion_approach}
            
            Project Requirements:
            - Space: {project.space_data.length}' x {project.space_data.width}' x {project.space_data.height}'
            - Event Type: {project.event_requirements.event_type}
            - Guest Count: {project.event_requirements.guest_count}
            - Budget: {project.event_requirements.budget}
            
            Create a design that:
            1. Respects both cultural traditions
            2. Finds common ground between philosophies
            3. Avoids cultural appropriation
            4. Creates meaningful cultural dialogue
            5. Provides educational value
            
            Provide response in JSON format with detailed cultural fusion analysis.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": await self._get_enhanced_system_prompt()},
                    {"role": "user", "content": fusion_prompt}
                ],
                temperature=0.7,
                max_tokens=2500
            )
            
            fusion_design = json.loads(response.choices[0].message.content)
            
            # Validate both cultural appropriateness
            primary_validation = await self.cultural_service.validate_cultural_appropriateness(
                primary_philosophy, fusion_design.get("design_elements", [])
            )
            secondary_validation = await self.cultural_service.validate_cultural_appropriateness(
                secondary_philosophy, fusion_design.get("design_elements", [])
            )
            
            return {
                "fusion_design": fusion_design,
                "primary_philosophy": primary_philosophy.value,
                "secondary_philosophy": secondary_philosophy.value,
                "cultural_validations": {
                    "primary": primary_validation,
                    "secondary": secondary_validation
                },
                "fusion_approach": fusion_approach
            }
            
        except Exception as e:
            logger.error(f"Error generating cultural fusion design: {e}")
            raise