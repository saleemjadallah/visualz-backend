"""
Cultural Element Categorization System

This service provides standardized categorization and classification 
for cultural elements in the DesignVisualz platform.
"""

from typing import Dict, List, Optional, Set
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class CulturalCategory(Enum):
    """Standardized cultural element categories."""
    
    # Physical Elements
    DECORATIVE_FLORA = "decorative_flora"
    DECORATIVE_OBJECT = "decorative_object"
    DECORATIVE_TEXTILE = "decorative_textile"
    DECORATIVE_PATTERN = "decorative_pattern"
    
    # Spatial & Design Elements
    SPATIAL_DESIGN = "spatial_design"
    LIGHTING_DESIGN = "lighting_design"
    FURNITURE_STYLE = "furniture_style"
    ARCHITECTURAL_ELEMENT = "architectural_element"
    
    # Abstract Elements
    COLOR_SYMBOLISM = "color_symbolism"
    SYMBOLIC_OBJECT = "symbolic_object"
    RITUAL_ELEMENT = "ritual_element"
    CEREMONIAL_PRACTICE = "ceremonial_practice"
    
    # Temporal Elements
    SEASONAL_TRADITION = "seasonal_tradition"
    HOLIDAY_ELEMENT = "holiday_element"
    LIFECYCLE_TRADITION = "lifecycle_tradition"
    
    # Material Elements
    TRADITIONAL_MATERIAL = "traditional_material"
    CRAFT_TECHNIQUE = "craft_technique"
    TEXTILE_PATTERN = "textile_pattern"
    
    # Audio/Sensory Elements
    MUSIC_TRADITION = "music_tradition"
    CULINARY_ELEMENT = "culinary_element"
    AROMATIC_ELEMENT = "aromatic_element"

class SacredLevel(Enum):
    """Levels of cultural/sacred significance."""
    LOW = "low"          # Decorative use generally acceptable
    MEDIUM = "medium"    # Requires cultural awareness and respect
    HIGH = "high"        # Requires careful consideration and context
    SACRED = "sacred"    # Requires community permission and consultation

class CulturalRegion(Enum):
    """Broad cultural regions for organization."""
    EAST_ASIAN = "east_asian"
    SOUTH_ASIAN = "south_asian"
    SOUTHEAST_ASIAN = "southeast_asian"
    MIDDLE_EASTERN = "middle_eastern"
    AFRICAN = "african"
    EUROPEAN = "european"
    NORTH_AMERICAN = "north_american"
    CENTRAL_AMERICAN = "central_american"
    SOUTH_AMERICAN = "south_american"
    OCEANIAN = "oceanian"
    ARCTIC = "arctic"
    MULTI_CULTURAL = "multi_cultural"

class EventContext(Enum):
    """Event contexts for cultural appropriateness."""
    WEDDING = "wedding"
    FUNERAL = "funeral"
    RELIGIOUS_CEREMONY = "religious_ceremony"
    BIRTHDAY = "birthday"
    CORPORATE_EVENT = "corporate_event"
    CULTURAL_CELEBRATION = "cultural_celebration"
    SEASONAL_CELEBRATION = "seasonal_celebration"
    FAMILY_GATHERING = "family_gathering"
    COMMUNITY_EVENT = "community_event"
    EDUCATIONAL_EVENT = "educational_event"

class CulturalCategorizationService:
    """Service for categorizing and validating cultural elements."""
    
    def __init__(self):
        self.category_hierarchy = self._build_category_hierarchy()
        self.context_appropriateness = self._build_context_rules()
        
    def _build_category_hierarchy(self) -> Dict[str, Dict]:
        """Build hierarchical categorization structure."""
        return {
            "physical_elements": {
                "decorative": [
                    CulturalCategory.DECORATIVE_FLORA,
                    CulturalCategory.DECORATIVE_OBJECT,
                    CulturalCategory.DECORATIVE_TEXTILE,
                    CulturalCategory.DECORATIVE_PATTERN
                ],
                "functional": [
                    CulturalCategory.FURNITURE_STYLE,
                    CulturalCategory.ARCHITECTURAL_ELEMENT,
                    CulturalCategory.TRADITIONAL_MATERIAL
                ]
            },
            "design_elements": {
                "spatial": [
                    CulturalCategory.SPATIAL_DESIGN,
                    CulturalCategory.LIGHTING_DESIGN
                ],
                "visual": [
                    CulturalCategory.COLOR_SYMBOLISM,
                    CulturalCategory.TEXTILE_PATTERN,
                    CulturalCategory.CRAFT_TECHNIQUE
                ]
            },
            "symbolic_elements": {
                "spiritual": [
                    CulturalCategory.SYMBOLIC_OBJECT,
                    CulturalCategory.RITUAL_ELEMENT,
                    CulturalCategory.CEREMONIAL_PRACTICE
                ],
                "temporal": [
                    CulturalCategory.SEASONAL_TRADITION,
                    CulturalCategory.HOLIDAY_ELEMENT,
                    CulturalCategory.LIFECYCLE_TRADITION
                ]
            },
            "sensory_elements": {
                "auditory": [CulturalCategory.MUSIC_TRADITION],
                "gustatory": [CulturalCategory.CULINARY_ELEMENT],
                "olfactory": [CulturalCategory.AROMATIC_ELEMENT]
            }
        }
    
    def _build_context_rules(self) -> Dict[str, Dict]:
        """Build rules for context appropriateness."""
        return {
            EventContext.WEDDING.value: {
                "highly_appropriate": [
                    CulturalCategory.DECORATIVE_FLORA,
                    CulturalCategory.COLOR_SYMBOLISM,
                    CulturalCategory.CEREMONIAL_PRACTICE,
                    CulturalCategory.LIFECYCLE_TRADITION
                ],
                "inappropriate": [
                    CulturalCategory.RITUAL_ELEMENT  # Unless specifically wedding-related
                ],
                "requires_permission": [
                    CulturalCategory.RITUAL_ELEMENT
                ]
            },
            EventContext.FUNERAL.value: {
                "highly_appropriate": [
                    CulturalCategory.SYMBOLIC_OBJECT,
                    CulturalCategory.RITUAL_ELEMENT,
                    CulturalCategory.LIFECYCLE_TRADITION
                ],
                "inappropriate": [
                    CulturalCategory.DECORATIVE_FLORA  # Unless culturally appropriate
                ],
                "requires_permission": [
                    CulturalCategory.CEREMONIAL_PRACTICE
                ]
            },
            EventContext.CORPORATE_EVENT.value: {
                "highly_appropriate": [
                    CulturalCategory.DECORATIVE_PATTERN,
                    CulturalCategory.SPATIAL_DESIGN,
                    CulturalCategory.LIGHTING_DESIGN
                ],
                "inappropriate": [
                    CulturalCategory.RITUAL_ELEMENT,
                    CulturalCategory.CEREMONIAL_PRACTICE
                ],
                "requires_permission": []
            }
        }
    
    def categorize_element(self, element_name: str, culture: str, description: str) -> Dict[str, any]:
        """Automatically categorize a cultural element."""
        try:
            # Simple keyword-based categorization
            # In production, this would use more sophisticated NLP
            
            name_lower = element_name.lower()
            desc_lower = description.lower()
            
            # Determine category
            category = self._determine_category(name_lower, desc_lower)
            
            # Determine sacred level
            sacred_level = self._determine_sacred_level(name_lower, desc_lower, culture)
            
            # Determine region
            region = self._determine_region(culture)
            
            # Generate recommendations
            recommendations = self._generate_categorization_recommendations(
                category, sacred_level, culture
            )
            
            return {
                "suggested_category": category.value if category else "uncategorized",
                "suggested_sacred_level": sacred_level.value,
                "suggested_region": region.value if region else "unknown",
                "confidence_score": 0.7,  # Placeholder confidence
                "recommendations": recommendations,
                "validation_needed": True
            }
            
        except Exception as e:
            logger.error(f"Error categorizing element '{element_name}': {e}")
            return {
                "suggested_category": "uncategorized",
                "suggested_sacred_level": SacredLevel.MEDIUM.value,
                "suggested_region": "unknown",
                "confidence_score": 0.0,
                "recommendations": ["Manual categorization required"],
                "validation_needed": True
            }
    
    def _determine_category(self, name: str, description: str) -> Optional[CulturalCategory]:
        """Determine category based on keywords."""
        
        # Flora-related keywords
        if any(keyword in name or keyword in description for keyword in 
               ["flower", "blossom", "petal", "bloom", "floral", "botanical"]):
            return CulturalCategory.DECORATIVE_FLORA
        
        # Pattern-related keywords
        if any(keyword in name or keyword in description for keyword in
               ["pattern", "design", "motif", "geometric", "knot"]):
            return CulturalCategory.DECORATIVE_PATTERN
        
        # Textile-related keywords
        if any(keyword in name or keyword in description for keyword in
               ["fabric", "textile", "cloth", "weaving", "banner"]):
            return CulturalCategory.DECORATIVE_TEXTILE
        
        # Spatial/architectural keywords
        if any(keyword in name or keyword in description for keyword in
               ["space", "room", "proportion", "layout", "architectural"]):
            return CulturalCategory.SPATIAL_DESIGN
        
        # Lighting keywords
        if any(keyword in name or keyword in description for keyword in
               ["light", "lighting", "candle", "lamp", "illumination"]):
            return CulturalCategory.LIGHTING_DESIGN
        
        # Color-related keywords
        if any(keyword in name or keyword in description for keyword in
               ["color", "hue", "palette", "symbolism"]):
            return CulturalCategory.COLOR_SYMBOLISM
        
        # Object keywords
        if any(keyword in name or keyword in description for keyword in
               ["object", "item", "artifact", "pottery", "vessel"]):
            return CulturalCategory.DECORATIVE_OBJECT
        
        return None
    
    def _determine_sacred_level(self, name: str, description: str, culture: str) -> SacredLevel:
        """Determine sacred level based on keywords and context."""
        
        # Sacred keywords
        sacred_keywords = ["sacred", "holy", "religious", "ceremonial", "ritual", "spiritual"]
        if any(keyword in name or keyword in description for keyword in sacred_keywords):
            return SacredLevel.HIGH
        
        # High significance keywords
        high_keywords = ["traditional", "ancestral", "heritage", "ceremonial", "symbolic"]
        if any(keyword in name or keyword in description for keyword in high_keywords):
            return SacredLevel.MEDIUM
        
        # Cultural-specific high-significance patterns
        if "kente" in name.lower() or "sacred geometry" in description.lower():
            return SacredLevel.HIGH
        
        return SacredLevel.LOW
    
    def _determine_region(self, culture: str) -> Optional[CulturalRegion]:
        """Determine cultural region."""
        culture_lower = culture.lower()
        
        region_mapping = {
            "japanese": CulturalRegion.EAST_ASIAN,
            "chinese": CulturalRegion.EAST_ASIAN,
            "korean": CulturalRegion.EAST_ASIAN,
            "indian": CulturalRegion.SOUTH_ASIAN,
            "pakistani": CulturalRegion.SOUTH_ASIAN,
            "bangladeshi": CulturalRegion.SOUTH_ASIAN,
            "thai": CulturalRegion.SOUTHEAST_ASIAN,
            "vietnamese": CulturalRegion.SOUTHEAST_ASIAN,
            "indonesian": CulturalRegion.SOUTHEAST_ASIAN,
            "mexican": CulturalRegion.CENTRAL_AMERICAN,
            "guatemalan": CulturalRegion.CENTRAL_AMERICAN,
            "african": CulturalRegion.AFRICAN,
            "nigerian": CulturalRegion.AFRICAN,
            "ghanaian": CulturalRegion.AFRICAN,
            "irish": CulturalRegion.EUROPEAN,
            "celtic": CulturalRegion.EUROPEAN,
            "scottish": CulturalRegion.EUROPEAN,
            "danish": CulturalRegion.EUROPEAN,
            "scandinavian": CulturalRegion.EUROPEAN,
            "arabic": CulturalRegion.MIDDLE_EASTERN,
            "persian": CulturalRegion.MIDDLE_EASTERN,
            "turkish": CulturalRegion.MIDDLE_EASTERN
        }
        
        for culture_key, region in region_mapping.items():
            if culture_key in culture_lower:
                return region
        
        return None
    
    def _generate_categorization_recommendations(
        self, 
        category: Optional[CulturalCategory], 
        sacred_level: SacredLevel, 
        culture: str
    ) -> List[str]:
        """Generate recommendations based on categorization."""
        recommendations = []
        
        if sacred_level == SacredLevel.HIGH or sacred_level == SacredLevel.SACRED:
            recommendations.append("Requires consultation with cultural experts")
            recommendations.append("Verify appropriate usage contexts")
        
        if sacred_level == SacredLevel.MEDIUM:
            recommendations.append("Research cultural significance before use")
            recommendations.append("Consider context appropriateness")
        
        if category == CulturalCategory.RITUAL_ELEMENT:
            recommendations.append("Ensure proper ceremonial context")
            recommendations.append("Respect traditional protocols")
        
        if "african" in culture.lower():
            recommendations.append("Consult with African cultural communities")
            recommendations.append("Verify against appropriation concerns")
        
        recommendations.append(f"Validate with {culture} cultural experts")
        
        return recommendations
    
    def validate_context_appropriateness(
        self, 
        category: CulturalCategory, 
        event_context: EventContext,
        sacred_level: SacredLevel
    ) -> Dict[str, any]:
        """Validate if a cultural element is appropriate for an event context."""
        
        context_rules = self.context_appropriateness.get(event_context.value, {})
        
        # Check if highly appropriate
        if category in context_rules.get("highly_appropriate", []):
            return {
                "appropriate": True,
                "confidence": "high",
                "reason": f"{category.value} is highly appropriate for {event_context.value}",
                "recommendations": []
            }
        
        # Check if inappropriate
        if category in context_rules.get("inappropriate", []):
            return {
                "appropriate": False,
                "confidence": "high",
                "reason": f"{category.value} is generally inappropriate for {event_context.value}",
                "recommendations": ["Consider alternative elements", "Consult cultural expert if specific use case"]
            }
        
        # Check sacred level restrictions
        if sacred_level == SacredLevel.SACRED:
            return {
                "appropriate": False,
                "confidence": "high",
                "reason": "Sacred elements require special consideration and community permission",
                "recommendations": ["Consult with community elders", "Ensure proper ceremonial context"]
            }
        
        # Default: needs review
        return {
            "appropriate": None,  # Uncertain
            "confidence": "medium",
            "reason": f"No specific rules for {category.value} in {event_context.value} context",
            "recommendations": ["Review with cultural expert", "Consider event-specific appropriateness"]
        }
    
    def get_category_guidelines(self, category: CulturalCategory) -> Dict[str, any]:
        """Get guidelines for a specific cultural category."""
        
        guidelines = {
            CulturalCategory.DECORATIVE_FLORA: {
                "description": "Flowers, plants, and botanical elements with cultural significance",
                "considerations": [
                    "Seasonal appropriateness",
                    "Color symbolism",
                    "Religious associations",
                    "Regional variations"
                ],
                "best_practices": [
                    "Research seasonal traditions",
                    "Understand color meanings",
                    "Source authentic varieties when possible"
                ]
            },
            CulturalCategory.DECORATIVE_PATTERN: {
                "description": "Visual patterns, motifs, and designs with cultural meaning",
                "considerations": [
                    "Sacred geometry",
                    "Traditional meanings",
                    "Proper proportions",
                    "Color combinations"
                ],
                "best_practices": [
                    "Understand pattern significance",
                    "Maintain traditional proportions",
                    "Use appropriate color palettes"
                ]
            },
            CulturalCategory.RITUAL_ELEMENT: {
                "description": "Elements used in religious or ceremonial practices",
                "considerations": [
                    "Sacred significance",
                    "Proper ceremonial use",
                    "Community permissions",
                    "Context requirements"
                ],
                "best_practices": [
                    "Always consult religious/cultural leaders",
                    "Understand proper usage protocols",
                    "Respect sacred contexts only"
                ]
            }
        }
        
        return guidelines.get(category, {
            "description": "Cultural element requiring expert consultation",
            "considerations": ["Cultural significance", "Appropriate usage", "Community respect"],
            "best_practices": ["Consult cultural experts", "Research thoroughly", "Respect traditions"]
        })
    
    def suggest_alternatives(
        self, 
        inappropriate_category: CulturalCategory,
        target_event: EventContext,
        culture: str
    ) -> List[Dict[str, any]]:
        """Suggest alternative categories that would be appropriate."""
        
        context_rules = self.context_appropriateness.get(target_event.value, {})
        appropriate_categories = context_rules.get("highly_appropriate", [])
        
        alternatives = []
        for category in appropriate_categories:
            if category != inappropriate_category:
                guidelines = self.get_category_guidelines(category)
                alternatives.append({
                    "category": category.value,
                    "description": guidelines.get("description", ""),
                    "reason": f"More appropriate for {target_event.value} events",
                    "considerations": guidelines.get("considerations", [])
                })
        
        return alternatives[:3]  # Limit to top 3 suggestions