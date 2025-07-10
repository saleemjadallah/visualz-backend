import openai
from typing import Dict, List, Any, Optional
import json
import logging
from app.core.config import settings
from app.core.prompts import MASTER_SYSTEM_PROMPT, build_design_prompt, get_event_specific_prompt
from app.models.project import Project
from app.models.design import Design, ColorPalette, MaterialRecommendation, LightingPlan, BudgetBreakdown
from app.services.cultural_philosophy_service import CulturalPhilosophyService, CulturalPhilosophy
from app.services.enhanced_ai_service import EnhancedAIDesignService

logger = logging.getLogger(__name__)

class AIDesignService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.cultural_service = CulturalPhilosophyService()
        self.enhanced_service = EnhancedAIDesignService()
    
    async def generate_design(self, project: Project, style_preferences: List[str] = None) -> Dict[str, Any]:
        """Generate a complete design using AI based on project requirements."""
        try:
            # Build the prompt using project data
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
            
            cultural_context = {
                "primary_culture": project.cultural_context.primary_culture,
                "secondary_cultures": project.cultural_context.secondary_cultures,
                "religious": project.cultural_context.religious_considerations,
                "dietary": project.event_requirements.dietary_restrictions
            }
            
            # Get event-specific prompt context
            event_context = get_event_specific_prompt(project.event_requirements.event_type)
            
            # Build the comprehensive prompt
            user_prompt = build_design_prompt(space_data, event_requirements, cultural_context)
            if event_context:
                user_prompt += f"\n\nEVENT-SPECIFIC CONTEXT:\n{event_context}"
            
            if style_preferences:
                user_prompt += f"\n\nSTYLE PREFERENCES: {', '.join(style_preferences)}"
            
            # Generate design with OpenAI
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": MASTER_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt + "\n\nPlease respond with a valid JSON object only."}
                ],
                temperature=0.7,
                max_tokens=4000
            )
            
            # Parse AI response
            ai_output = json.loads(response.choices[0].message.content)
            
            # Process and structure the AI output
            design_data = await self._process_ai_output(ai_output, project)
            
            logger.info(f"Successfully generated design for project {project.id}")
            return design_data
            
        except Exception as e:
            logger.error(f"Error generating design: {e}")
            raise Exception(f"Failed to generate design: {str(e)}")
    
    async def generate_culturally_informed_design(
        self, 
        project: Project, 
        cultural_philosophy: Optional[CulturalPhilosophy] = None,
        style_preferences: List[str] = None
    ) -> Dict[str, Any]:
        """Generate a design using enhanced cultural intelligence."""
        try:
            # Use the enhanced AI service for culturally informed design
            if cultural_philosophy:
                logger.info(f"Generating culturally informed design using {cultural_philosophy.value} philosophy")
                return await self.enhanced_service.generate_culturally_informed_design(
                    project, cultural_philosophy, style_preferences
                )
            else:
                # Fall back to regular design generation
                logger.info("No cultural philosophy specified, using regular design generation")
                return await self.generate_design(project, style_preferences)
                
        except Exception as e:
            logger.error(f"Error generating culturally informed design: {e}")
            raise Exception(f"Failed to generate culturally informed design: {str(e)}")
    
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
            return await self.enhanced_service.get_cultural_design_recommendations(
                event_type, cultural_philosophy, budget_range, guest_count, specific_requirements
            )
        except Exception as e:
            logger.error(f"Error getting cultural design recommendations: {e}")
            raise Exception(f"Failed to get cultural design recommendations: {str(e)}")
    
    async def validate_design_cultural_appropriateness(
        self,
        design_elements: List[str],
        cultural_philosophy: CulturalPhilosophy,
        event_context: str
    ) -> Dict[str, Any]:
        """Validate design elements for cultural appropriateness."""
        try:
            return await self.enhanced_service.validate_design_cultural_appropriateness(
                design_elements, cultural_philosophy, event_context
            )
        except Exception as e:
            logger.error(f"Error validating cultural appropriateness: {e}")
            raise Exception(f"Failed to validate cultural appropriateness: {str(e)}")
    
    async def generate_cultural_fusion_design(
        self,
        project: Project,
        primary_philosophy: CulturalPhilosophy,
        secondary_philosophy: CulturalPhilosophy,
        fusion_approach: str = "respectful_blend"
    ) -> Dict[str, Any]:
        """Generate a design that respectfully blends two cultural philosophies."""
        try:
            return await self.enhanced_service.generate_cultural_fusion_design(
                project, primary_philosophy, secondary_philosophy, fusion_approach
            )
        except Exception as e:
            logger.error(f"Error generating cultural fusion design: {e}")
            raise Exception(f"Failed to generate cultural fusion design: {str(e)}")
    
    async def _process_ai_output(self, ai_output: Dict[str, Any], project: Project) -> Dict[str, Any]:
        """Process and structure AI output into our design format."""
        try:
            # Extract color palette
            color_data = ai_output.get("color_palette", {})
            color_palette = ColorPalette(
                primary=color_data.get("primary", "#2563eb"),
                secondary=color_data.get("secondary", "#64748b"),
                accent=color_data.get("accent", "#f59e0b"),
                neutral=color_data.get("neutral", "#f8fafc"),
                description=color_data.get("description", "AI generated color palette")
            )
            
            # Extract material recommendations
            materials_data = ai_output.get("materials", [])
            material_recommendations = [
                MaterialRecommendation(
                    category=mat.get("category", "furniture"),
                    material=mat.get("material", ""),
                    color=mat.get("color"),
                    texture=mat.get("texture"),
                    usage=mat.get("usage", ""),
                    cultural_significance=mat.get("cultural_significance")
                )
                for mat in materials_data
            ]
            
            # Extract lighting plan
            lighting_data = ai_output.get("lighting", {})
            lighting_plan = LightingPlan(
                ambient_lighting=lighting_data.get("ambient", "Warm LED overhead lighting"),
                task_lighting=lighting_data.get("task", []),
                accent_lighting=lighting_data.get("accent", []),
                color_temperature=lighting_data.get("temperature", "2700K")
            )
            
            # Extract budget breakdown
            budget_data = ai_output.get("budget", {})
            budget_breakdown = BudgetBreakdown(
                furniture=budget_data.get("furniture", 40.0),
                decor=budget_data.get("decor", 25.0),
                lighting=budget_data.get("lighting", 15.0),
                cultural_elements=budget_data.get("cultural_elements", 10.0),
                miscellaneous=budget_data.get("miscellaneous", 10.0),
                priority_items=budget_data.get("priority_items", []),
                optional_items=budget_data.get("optional_items", [])
            )
            
            # Extract furniture items (for 2D layout)
            furniture_items = []
            furniture_data = ai_output.get("furniture_layout", [])
            for item in furniture_data:
                furniture_items.append({
                    "id": f"item_{len(furniture_items)}",
                    "name": item.get("name", "Furniture Item"),
                    "category": item.get("category", "seating"),
                    "x": float(item.get("x", 0)),
                    "y": float(item.get("y", 0)),
                    "width": float(item.get("width", 2)),
                    "height": float(item.get("height", 2)),
                    "rotation": float(item.get("rotation", 0)),
                    "color": item.get("color"),
                    "style": item.get("style")
                })
            
            return {
                "name": f"AI Design for {project.title}",
                "description": ai_output.get("design_description", "AI generated event design"),
                "furniture_items": furniture_items,
                "color_palette": color_palette,
                "material_recommendations": material_recommendations,
                "lighting_plan": lighting_plan,
                "budget_breakdown": budget_breakdown,
                "ai_generated": True,
                "design_notes": ai_output.get("design_notes", [])
            }
            
        except Exception as e:
            logger.error(f"Error processing AI output: {e}")
            raise Exception(f"Failed to process AI response: {str(e)}")
    
    async def validate_cultural_sensitivity(self, design_elements: List[str], cultural_context: Dict[str, Any]) -> Dict[str, Any]:
        """Validate design elements for cultural appropriateness."""
        try:
            validation_prompt = f"""
            Please review the following design elements for cultural appropriateness:
            
            Design Elements: {', '.join(design_elements)}
            Cultural Context: {json.dumps(cultural_context, indent=2)}
            
            Evaluate:
            1. Cultural authenticity and respect
            2. Potential appropriation concerns
            3. Fusion element appropriateness
            4. Any offensive or insensitive elements
            5. Recommendations for improvement
            
            Respond with JSON format:
            {{
                "sensitivity_score": <1-10>,
                "validation_notes": ["note1", "note2"],
                "recommendations": ["rec1", "rec2"],
                "approved_elements": ["element1", "element2"],
                "flagged_elements": ["element1", "element2"]
            }}
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a cultural sensitivity expert reviewing event design elements."},
                    {"role": "user", "content": validation_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error validating cultural sensitivity: {e}")
            return {
                "sensitivity_score": 5,
                "validation_notes": ["Unable to validate - manual review recommended"],
                "recommendations": ["Consult with cultural experts"],
                "approved_elements": [],
                "flagged_elements": design_elements
            }