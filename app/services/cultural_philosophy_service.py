"""
Cultural Philosophy Service for authentic design guidance.
Integrates comprehensive research on four major cultural design philosophies.
"""

from typing import List, Dict, Any, Optional
import logging
from enum import Enum
from pydantic import BaseModel
from app.services.database import get_database

logger = logging.getLogger(__name__)

class CulturalPhilosophy(str, Enum):
    WABI_SABI = "wabi_sabi"
    HYGGE = "hygge"
    BELLA_FIGURA = "bella_figura"
    SAVOIR_VIVRE = "savoir_vivre"

class RegionalVariation(BaseModel):
    name: str
    description: str
    key_characteristics: List[str]
    color_palette: List[str]
    materials: List[str]

class ColorPalette(BaseModel):
    primary: List[str]
    secondary: List[str]
    accent: List[str]
    avoid: List[str]

class MaterialSpecification(BaseModel):
    name: str
    description: str
    authenticity_markers: List[str]
    quality_indicators: List[str]
    suppliers: List[str]

class PhilosophyData(BaseModel):
    name: str
    culture: str
    foundation: str
    core_principles: List[str]
    color_palette: ColorPalette
    materials: List[MaterialSpecification]
    spatial_arrangements: List[str]
    event_applications: List[str]
    cultural_sensitivity: Dict[str, Any]
    regional_variations: List[RegionalVariation]
    vendor_sources: List[Dict[str, str]]
    budget_allocation: Dict[str, str]

class CulturalPhilosophyService:
    def __init__(self):
        self.db = get_database()
        self.philosophies = self._initialize_philosophies()
    
    def _initialize_philosophies(self) -> Dict[CulturalPhilosophy, PhilosophyData]:
        """Initialize the comprehensive cultural philosophy database."""
        return {
            CulturalPhilosophy.WABI_SABI: PhilosophyData(
                name="Wabi-Sabi",
                culture="Japanese",
                foundation="Emerged from 15th-century Zen Buddhism and tea ceremony traditions, revolutionized by Sen no Rikyū. Teaches that impermanence, imperfection, and incompleteness create profound beauty.",
                core_principles=[
                    "Beauty in imperfection",
                    "Acceptance of impermanence",
                    "Mindful simplicity",
                    "Natural aging and patina",
                    "Asymmetry over symmetry",
                    "Ma (negative space) creates meaning"
                ],
                color_palette=ColorPalette(
                    primary=["#8B7355", "#F5F5DC", "#D2B48C", "#2F2F2F"],  # Clay, bone white, taupe, soot black
                    secondary=["#9CAF88", "#CD853F", "#708090"],  # Muted green, rusty orange, stone gray
                    accent=["#A0522D", "#696969"],  # Sienna, dim gray
                    avoid=["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]  # Vibrant colors
                ),
                materials=[
                    MaterialSpecification(
                        name="Weathered Wood",
                        description="Reclaimed barn wood, driftwood with natural patina",
                        authenticity_markers=["Natural weathering", "Visible grain", "Aged character"],
                        quality_indicators=["Structural integrity", "Natural variations", "Aged patina"],
                        suppliers=["Reclaimed lumber yards", "Driftwood specialists"]
                    ),
                    MaterialSpecification(
                        name="Handmade Ceramics",
                        description="Iga-yaki pottery with intentional imperfections",
                        authenticity_markers=["Irregular glazing", "Handmade marks", "Natural variations"],
                        quality_indicators=["Kiln marks", "Artisan signatures", "Natural imperfections"],
                        suppliers=["Nagatani-en (est. 1832)", "Traditional Japanese potters"]
                    ),
                    MaterialSpecification(
                        name="Natural Stone",
                        description="Unpolished surfaces with natural texture",
                        authenticity_markers=["Rough texture", "Natural color variations", "Unpolished finish"],
                        quality_indicators=["Structural soundness", "Natural patterns", "Weathered appearance"],
                        suppliers=["Local quarries", "Natural stone suppliers"]
                    )
                ],
                spatial_arrangements=[
                    "Master Ma (間) - negative space creating meaning",
                    "Asymmetrical groupings in odd numbers (3, 5, 7)",
                    "Tatami mat proportions (191cm x 95.5cm)",
                    "16 tatami stitches from edge for guest seating",
                    "3 stitches between tea ceremony implements"
                ],
                event_applications=[
                    "Mindful corporate meeting spaces",
                    "Minimalist wedding venues with seasonal elements",
                    "Tea ceremony events with proper protocols",
                    "Contemplative gatherings emphasizing quality over quantity"
                ],
                cultural_sensitivity={
                    "sacred_elements": ["Buddhist symbols", "Tea ceremony rituals", "Traditional measurements"],
                    "avoid": ["Perfectionism", "Mass-produced items", "Religious appropriation"],
                    "respect_required": ["Seasonal awareness", "Mindful presentation", "Cultural context"]
                },
                regional_variations=[
                    RegionalVariation(
                        name="Traditional Tea Ceremony",
                        description="Formal tea ceremony aesthetics",
                        key_characteristics=["Precise measurements", "Seasonal awareness", "Ritual objects"],
                        color_palette=["#F5F5DC", "#8B7355", "#2F2F2F"],
                        materials=["Handmade ceramics", "Bamboo", "Natural textiles"]
                    )
                ],
                vendor_sources=[
                    {"name": "Wagumi", "location": "London", "specialty": "Handcrafted Japanese ceramics"},
                    {"name": "Rikumo", "location": "Philadelphia", "specialty": "Curated Japanese lifestyle goods"},
                    {"name": "Nagatani-en", "location": "Japan", "specialty": "Authentic Iga-yaki pottery since 1832"}
                ],
                budget_allocation={
                    "aged_materials": "40%",
                    "handmade_pieces": "25%",
                    "lighting": "20%",
                    "seasonal_elements": "15%"
                }
            ),
            
            CulturalPhilosophy.HYGGE: PhilosophyData(
                name="Hygge",
                culture="Danish/Scandinavian",
                foundation="Derived from Old Norse 'hugr' (soul, consciousness), evolved as cultural adaptation to harsh Nordic winters. Embodies everyday togetherness, safety, equality, and spontaneous social flow.",
                core_principles=[
                    "Cozy contentment",
                    "Democratic design accessibility",
                    "Everyday togetherness",
                    "Warm lighting atmosphere",
                    "Natural materials",
                    "Intimate gatherings (4-8 people)"
                ],
                color_palette=ColorPalette(
                    primary=["#F8F8FF", "#D3D3D3", "#B0C4DE", "#DEB887"],  # Warm whites, soft grays, muted blues, natural wood
                    secondary=["#D4A6A6", "#ACBAB6", "#415A4E"],  # Dusty rose, sage, forest green
                    accent=["#CD853F", "#F5DEB3"],  # Peru, wheat
                    avoid=["#FF1493", "#00CED1", "#FF4500"]  # Harsh bright colors
                ),
                materials=[
                    MaterialSpecification(
                        name="Light Woods",
                        description="Birch, ash, Nordic pine with natural character",
                        authenticity_markers=["Light color", "Natural grain", "Sustainable sourcing"],
                        quality_indicators=["Brinell hardness 1.9-2.7 HB", "Natural resin character", "FSC certification"],
                        suppliers=["Nordic timber suppliers", "Sustainable forestry sources"]
                    ),
                    MaterialSpecification(
                        name="Layered Textiles",
                        description="Chunky wool knits, organic linen, soft cotton",
                        authenticity_markers=["Natural fibers", "Chunky textures", "Neutral colors"],
                        quality_indicators=["OEKO-TEX certification", "Organic materials", "Comfort priority"],
                        suppliers=["Scandinavian textile manufacturers", "Organic fabric suppliers"]
                    ),
                    MaterialSpecification(
                        name="Candles",
                        description="Essential for hygge atmosphere - Denmark burns 13 lbs per capita annually",
                        authenticity_markers=["Natural wax", "Warm flame", "Various heights"],
                        quality_indicators=["Clean burning", "Long lasting", "Soot-free"],
                        suppliers=["Skandinavisk", "Nordic candle makers"]
                    )
                ],
                spatial_arrangements=[
                    "Intimate seating for 4-8 people maximum",
                    "Multiple light sources at 2700K color temperature",
                    "Layered comfort elements",
                    "Conversation-friendly groupings",
                    "Avoid harsh overhead lighting"
                ],
                event_applications=[
                    "Candlelit dinner parties with comfort foods",
                    "Summer outdoor gatherings with string lights",
                    "Collaborative cooking experiences",
                    "Cozy storytelling sessions",
                    "Board game gatherings"
                ],
                cultural_sensitivity={
                    "sacred_elements": ["Democratic values", "Equality principles", "Social sustainability"],
                    "avoid": ["Elitism", "Excessive luxury", "Exclusivity"],
                    "respect_required": ["Affordability", "Accessibility", "Social consciousness"]
                },
                regional_variations=[
                    RegionalVariation(
                        name="Winter Hygge",
                        description="Indoor coziness for dark months",
                        key_characteristics=["Candles", "Warm textiles", "Comfort foods"],
                        color_palette=["#F8F8FF", "#D3D3D3", "#CD853F"],
                        materials=["Wool", "Candles", "Warm woods"]
                    ),
                    RegionalVariation(
                        name="Summer Hygge",
                        description="Outdoor casual luxury",
                        key_characteristics=["Al fresco dining", "Natural settings", "Light fabrics"],
                        color_palette=["#F0F8FF", "#98FB98", "#DDA0DD"],
                        materials=["Linen", "Wicker", "String lights"]
                    )
                ],
                vendor_sources=[
                    {"name": "HAY", "location": "Denmark", "specialty": "Contemporary Danish design"},
                    {"name": "Muuto", "location": "Denmark", "specialty": "New Perspectives on Scandinavian Design"},
                    {"name": "Finnish Design Shop", "location": "Finland", "specialty": "Largest Scandinavian design retailer"}
                ],
                budget_allocation={
                    "comfort_textiles": "35%",
                    "warm_lighting": "25%",
                    "natural_materials": "25%",
                    "candles_ambiance": "15%"
                }
            ),
            
            CulturalPhilosophy.BELLA_FIGURA: PhilosophyData(
                name="Bella Figura",
                culture="Italian",
                foundation="Rooted in Renaissance Italy where beauty, craftsmanship, and courtesy were paramount. Reflects belief that presentation affects how others perceive and feel. 'Anche l'occhio vuole la sua parte' - the eye wants satisfaction too.",
                core_principles=[
                    "Dignity and self-respect",
                    "Social grace and hospitality",
                    "Artisan craftsmanship (artigianale)",
                    "Opulence without ostentation",
                    "Regional authenticity",
                    "Quality over quantity"
                ],
                color_palette=ColorPalette(
                    primary=["#E2725B", "#D6764B", "#F7E6CA"],  # Terra cotta, burnt sienna, warm cream
                    secondary=["#305CDE", "#808000", "#DAA520"],  # Deep blue, olive green, goldenrod
                    accent=["#FF6347", "#FFD700", "#4B0082"],  # Tomato, gold, indigo
                    avoid=["#FF69B4", "#00FF7F", "#FF00FF"]  # Garish colors
                ),
                materials=[
                    MaterialSpecification(
                        name="Italian Marble",
                        description="Carrara Bianco, Calacatta Gold, Statuario marble",
                        authenticity_markers=["Quarry certification", "Unique veining", "Italian origin"],
                        quality_indicators=["Density", "Veining patterns", "Polish quality"],
                        suppliers=["Carrara quarries", "Italian marble importers"]
                    ),
                    MaterialSpecification(
                        name="Quality Fabrics",
                        description="Venetian silk damasks, Genoese cut velvet, Tuscan leather",
                        authenticity_markers=["Italian manufacture", "Traditional weaving", "Quality fibers"],
                        quality_indicators=["Thread count", "Weave quality", "Durability"],
                        suppliers=["Como silk producers", "Tuscan leather craftsmen"]
                    ),
                    MaterialSpecification(
                        name="Artisan Ceramics",
                        description="Hand-painted ceramics with regional patterns",
                        authenticity_markers=["Hand-painted details", "Regional styles", "Artisan signatures"],
                        quality_indicators=["Glaze quality", "Pattern authenticity", "Firing marks"],
                        suppliers=["Deruta pottery", "Italian ceramics artisans"]
                    )
                ],
                spatial_arrangements=[
                    "Coordinated excellence in all elements",
                    "Functional beauty principles",
                    "Confident use of negative space",
                    "Regional authentic styling",
                    "Theatrical presentation without excess"
                ],
                event_applications=[
                    "Formal celebrations with matching elements",
                    "Regional Italian cuisine showcases",
                    "Wine tasting with educational components",
                    "Artisan craft demonstrations",
                    "Opera or classical music events"
                ],
                cultural_sensitivity={
                    "sacred_elements": ["Artisan traditions", "Regional pride", "Family heritage"],
                    "avoid": ["Theme park Italian", "Stereotypical clichés", "Mass production"],
                    "respect_required": ["Regional variations", "Artisan craftsmanship", "Cultural context"]
                },
                regional_variations=[
                    RegionalVariation(
                        name="Milanese Elegance",
                        description="Clean lines and sophisticated minimalism",
                        key_characteristics=["Refined fabrics", "High-quality metals", "Sophisticated minimalism"],
                        color_palette=["#C0C0C0", "#2F2F2F", "#DAA520"],
                        materials=["Refined metals", "Quality fabrics", "Minimal ornamentation"]
                    ),
                    RegionalVariation(
                        name="Tuscan Rusticity",
                        description="Warm spaces with terra cotta and natural stone",
                        key_characteristics=["Terra cotta", "Natural stone", "Hand-woven textiles"],
                        color_palette=["#E2725B", "#D6764B", "#808000"],
                        materials=["Terra cotta", "Natural stone", "Woven textiles"]
                    ),
                    RegionalVariation(
                        name="Venetian Opulence",
                        description="Ornate details with gilded elements",
                        key_characteristics=["Gilded details", "Byzantine influences", "Ornate patterns"],
                        color_palette=["#FFD700", "#4B0082", "#B8860B"],
                        materials=["Gilded elements", "Rich fabrics", "Ornate details"]
                    )
                ],
                vendor_sources=[
                    {"name": "Alessi", "location": "Italy", "specialty": "Iconic kitchenware since 1921"},
                    {"name": "Fornasetti", "location": "Italy", "specialty": "Distinctive artistic decorative objects"},
                    {"name": "Versace Home", "location": "Italy", "specialty": "Luxury home furnishings"}
                ],
                budget_allocation={
                    "statement_pieces": "40%",
                    "quality_materials": "30%",
                    "artisan_crafts": "20%",
                    "regional_authenticity": "10%"
                }
            ),
            
            CulturalPhilosophy.SAVOIR_VIVRE: PhilosophyData(
                name="Savoir-Vivre",
                culture="French",
                foundation="Knowing how to live - French philosophy of quality over quantity, mindful appreciation, and sophisticated simplicity. UNESCO recognized French gastronomic meal as World Intangible Heritage in 2010.",
                core_principles=[
                    "Quality over quantity",
                    "Mindful appreciation",
                    "Sophisticated simplicity",
                    "Joie de vivre (joy of living)",
                    "Refined craftsmanship",
                    "Proper service protocols"
                ],
                color_palette=ColorPalette(
                    primary=["#F7E7CE", "#F4F1E8", "#FAF8F5"],  # Champagne, ecru, warm white
                    secondary=["#6B8CAE", "#A0D6B4", "#DCA1A1"],  # French blue, soft teal, dusty rose
                    accent=["#9CAF88", "#8B4513", "#4682B4"],  # Sage green, saddle brown, steel blue
                    avoid=["#FF1493", "#00FF00", "#FF4500"]  # Garish colors
                ),
                materials=[
                    MaterialSpecification(
                        name="French Linens",
                        description="Master of Linen certified with 6.5+ y/d² density",
                        authenticity_markers=["Master of Linen certification", "French manufacture", "High thread count"],
                        quality_indicators=["Density 6.5+ y/d²", "Fabric quality", "Durability"],
                        suppliers=["LEMAITRE DEMEESTERE (est. 1835)", "French linen manufacturers"]
                    ),
                    MaterialSpecification(
                        name="French Crystal",
                        description="Baccarat and Lalique crystal with unmistakable brilliance",
                        authenticity_markers=["Baccarat/Lalique marks", "Lead crystal", "French craftsmanship"],
                        quality_indicators=["Brilliance", "Weight", "Clarity"],
                        suppliers=["Baccarat (1764)", "Lalique (1888)"]
                    ),
                    MaterialSpecification(
                        name="French Silverware",
                        description="Christofle motto: 'Only one quality: the best'",
                        authenticity_markers=["Christofle marks", "Silver content", "French craftsmanship"],
                        quality_indicators=["Weight", "Finish quality", "Durability"],
                        suppliers=["Christofle", "French silver manufacturers"]
                    )
                ],
                spatial_arrangements=[
                    "Conversation-friendly groupings",
                    "Proper furniture proportions",
                    "Service à la française (simultaneous presentation)",
                    "Service à la russe (sequential courses)",
                    "Precise table setting protocols"
                ],
                event_applications=[
                    "Refined dinner parties with proper service",
                    "Wine tasting with educational components",
                    "French cultural celebrations",
                    "Culinary demonstrations",
                    "Art appreciation gatherings"
                ],
                cultural_sensitivity={
                    "sacred_elements": ["Culinary traditions", "Service protocols", "French craftsmanship"],
                    "avoid": ["Casual presentation", "Poor service", "Inferior materials"],
                    "respect_required": ["Proper etiquette", "Quality standards", "Cultural authenticity"]
                },
                regional_variations=[
                    RegionalVariation(
                        name="Parisian Sophistication",
                        description="Opulent materials with Louis XVI influences",
                        key_characteristics=["Velvet", "Silk", "Brocade", "Metropolitan polish"],
                        color_palette=["#F7E7CE", "#6B8CAE", "#DCA1A1"],
                        materials=["Luxury fabrics", "Gilded elements", "Crystal"]
                    ),
                    RegionalVariation(
                        name="Provincial Charm",
                        description="Rustic sophistication with natural materials",
                        key_characteristics=["Natural materials", "Warm palettes", "Country elegance"],
                        color_palette=["#F4F1E8", "#9CAF88", "#8B4513"],
                        materials=["Natural stone", "Wood", "Ceramics"]
                    )
                ],
                vendor_sources=[
                    {"name": "Hermès Maison", "location": "France", "specialty": "Luxury home goods"},
                    {"name": "Christofle", "location": "France", "specialty": "Fine silverware"},
                    {"name": "Baccarat", "location": "France", "specialty": "Crystal since 1764"}
                ],
                budget_allocation={
                    "fine_linens": "35%",
                    "quality_serving": "25%",
                    "crystal_glass": "25%",
                    "authentic_details": "15%"
                }
            )
        }
    
    async def get_philosophy_data(self, philosophy: CulturalPhilosophy) -> PhilosophyData:
        """Get comprehensive data for a specific cultural philosophy."""
        return self.philosophies[philosophy]
    
    async def get_all_philosophies(self) -> Dict[CulturalPhilosophy, PhilosophyData]:
        """Get all cultural philosophies."""
        return self.philosophies
    
    async def get_design_recommendations(
        self, 
        philosophy: CulturalPhilosophy,
        event_type: str,
        budget_range: str,
        guest_count: int
    ) -> Dict[str, Any]:
        """Get specific design recommendations based on philosophy and event parameters."""
        philosophy_data = self.philosophies[philosophy]
        
        recommendations = {
            "philosophy": philosophy.value,
            "cultural_foundation": philosophy_data.foundation,
            "recommended_colors": philosophy_data.color_palette.primary,
            "key_materials": [m.name for m in philosophy_data.materials[:3]],
            "spatial_guidelines": philosophy_data.spatial_arrangements,
            "cultural_sensitivity": philosophy_data.cultural_sensitivity,
            "budget_guidance": philosophy_data.budget_allocation
        }
        
        # Event-specific recommendations
        if philosophy == CulturalPhilosophy.HYGGE and guest_count > 8:
            recommendations["warning"] = "Hygge works best with intimate gatherings of 4-8 people"
        
        if philosophy == CulturalPhilosophy.WABI_SABI and event_type == "corporate":
            recommendations["focus"] = "Mindful meeting spaces with contemplative elements"
        
        if philosophy == CulturalPhilosophy.BELLA_FIGURA and event_type == "wedding":
            recommendations["focus"] = "Coordinated excellence with regional Italian elements"
        
        if philosophy == CulturalPhilosophy.SAVOIR_VIVRE and event_type == "dinner":
            recommendations["focus"] = "Proper service protocols and quality table settings"
        
        return recommendations
    
    async def validate_cultural_appropriateness(
        self, 
        philosophy: CulturalPhilosophy,
        design_elements: List[str]
    ) -> Dict[str, Any]:
        """Validate design elements against cultural sensitivity guidelines."""
        philosophy_data = self.philosophies[philosophy]
        sensitivity = philosophy_data.cultural_sensitivity
        
        validation_result = {
            "philosophy": philosophy.value,
            "appropriate_elements": [],
            "inappropriate_elements": [],
            "warnings": [],
            "recommendations": []
        }
        
        for element in design_elements:
            element_lower = element.lower()
            
            # Check against avoid list
            if any(avoid_item.lower() in element_lower for avoid_item in sensitivity["avoid"]):
                validation_result["inappropriate_elements"].append(element)
                validation_result["warnings"].append(f"'{element}' contradicts {philosophy.value} principles")
            else:
                validation_result["appropriate_elements"].append(element)
        
        # Add philosophy-specific recommendations
        validation_result["recommendations"] = [
            f"Ensure respect for {philosophy_data.culture} cultural context",
            f"Focus on {', '.join(philosophy_data.core_principles[:3])}",
            f"Consider regional variations for authenticity"
        ]
        
        return validation_result
    
    async def get_vendor_recommendations(
        self, 
        philosophy: CulturalPhilosophy,
        material_type: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """Get vendor recommendations for a specific philosophy."""
        philosophy_data = self.philosophies[philosophy]
        
        if material_type:
            # Filter vendors by material type
            relevant_vendors = []
            for vendor in philosophy_data.vendor_sources:
                if material_type.lower() in vendor["specialty"].lower():
                    relevant_vendors.append(vendor)
            return relevant_vendors
        
        return philosophy_data.vendor_sources
    
    async def get_color_palette_guidance(
        self, 
        philosophy: CulturalPhilosophy
    ) -> Dict[str, List[str]]:
        """Get detailed color palette guidance for a philosophy."""
        philosophy_data = self.philosophies[philosophy]
        
        return {
            "primary": philosophy_data.color_palette.primary,
            "secondary": philosophy_data.color_palette.secondary,
            "accent": philosophy_data.color_palette.accent,
            "avoid": philosophy_data.color_palette.avoid,
            "cultural_context": philosophy_data.foundation
        }
    
    async def save_philosophy_data(self):
        """Save all philosophy data to the database."""
        try:
            for philosophy, data in self.philosophies.items():
                await self.db.cultural_philosophies.replace_one(
                    {"philosophy": philosophy.value},
                    {
                        "philosophy": philosophy.value,
                        "data": data.dict(),
                        "last_updated": "2024-01-01T00:00:00Z"
                    },
                    upsert=True
                )
            logger.info("Cultural philosophy data saved successfully")
        except Exception as e:
            logger.error(f"Error saving philosophy data: {e}")
            raise