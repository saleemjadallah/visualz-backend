"""
Populate the cultural database with starter data for demonstration purposes.

IMPORTANT DISCLAIMER:
This data is for technical demonstration only and is NOT verified by cultural experts.
All entries require validation by cultural communities and experts before production use.
"""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.cultural_service import CulturalService
from app.models.cultural import CulturalElementCreate
from app.services.database import init_db, close_db

# STARTER CULTURAL DATA - FOR DEMONSTRATION ONLY
STARTER_CULTURAL_ELEMENTS = [
    # JAPANESE CULTURE
    {
        "name": "Cherry Blossom (Sakura)",
        "culture": "Japanese",
        "category": "decorative_flora",
        "description": "Iconic Japanese spring flower symbolizing the beauty and transience of life",
        "significance": "Represents mono no aware (awareness of impermanence), renewal, and spring celebration",
        "appropriate_contexts": ["spring celebrations", "wedding ceremonies", "garden parties", "renewal events"],
        "inappropriate_contexts": ["funeral services", "business meetings", "winter events"],
        "usage_guidelines": [
            "Use during spring season (March-May) for authenticity",
            "Combine with soft pink and white color palettes",
            "Avoid oversized or artificial-looking representations"
        ],
        "sacred_level": "low",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#FFB7C5", "#FFFFFF", "#FFC0CB", "#E6E6FA"],
        "materials": ["silk", "paper", "natural wood", "ceramic"],
        "patterns": ["delicate petals", "branch motifs", "scattered blossoms"],
        "seasonal_usage": "Spring (March-May)",
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    {
        "name": "Tatami Mat Proportions",
        "culture": "Japanese",
        "category": "spatial_design",
        "description": "Traditional Japanese room proportions based on tatami mat dimensions",
        "significance": "Reflects Japanese concepts of harmony, proportion, and spatial organization",
        "appropriate_contexts": ["meditation spaces", "tea ceremonies", "minimalist events", "wellness gatherings"],
        "inappropriate_contexts": ["large crowded events", "high-energy celebrations"],
        "usage_guidelines": [
            "Use 2:1 rectangular proportions",
            "Maintain clear, uncluttered spaces",
            "Consider barefoot accessibility"
        ],
        "sacred_level": "medium",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#F5F5DC", "#8B7355", "#2F4F4F"],
        "materials": ["natural fibers", "wood", "bamboo", "stone"],
        "patterns": ["geometric rectangles", "grid layouts", "clean lines"],
        "sources": ["General architectural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    
    # MEXICAN CULTURE
    {
        "name": "Papel Picado",
        "culture": "Mexican",
        "category": "decorative_textile",
        "description": "Traditional Mexican decorative cut paper banners",
        "significance": "Celebrates life, community, and festive occasions; connects earth and sky",
        "appropriate_contexts": ["celebrations", "festivals", "birthdays", "community gatherings", "outdoor events"],
        "inappropriate_contexts": ["somber occasions", "formal business events"],
        "usage_guidelines": [
            "Use vibrant colors traditional to the craft",
            "Hang in flowing patterns to catch wind",
            "Respect traditional cutting patterns and motifs"
        ],
        "sacred_level": "low",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5", "#4D9DE0", "#E15554"],
        "materials": ["tissue paper", "plastic", "fabric"],
        "patterns": ["geometric cuts", "floral motifs", "traditional designs"],
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    {
        "name": "Talavera Pottery Patterns",
        "culture": "Mexican",
        "category": "decorative_object",
        "description": "Traditional Mexican ceramic pottery with distinctive blue and white patterns",
        "significance": "Represents Mexican craftsmanship and cultural heritage from Puebla region",
        "appropriate_contexts": ["cultural celebrations", "dining events", "decorative displays"],
        "inappropriate_contexts": ["non-Mexican cultural events without context"],
        "usage_guidelines": [
            "Use authentic blue and white color combinations",
            "Respect traditional geometric and floral patterns",
            "Acknowledge Puebla regional origins"
        ],
        "sacred_level": "medium",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#1E3A8A", "#FFFFFF", "#FEF3C7"],
        "materials": ["ceramic", "clay", "glazed pottery"],
        "patterns": ["geometric flowers", "traditional motifs", "hand-painted designs"],
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    
    # INDIAN CULTURE
    {
        "name": "Marigold Flowers (Genda)",
        "culture": "Indian",
        "category": "decorative_flora",
        "description": "Sacred flowers commonly used in Indian celebrations and religious ceremonies",
        "significance": "Represents auspiciousness, prosperity, and spiritual devotion",
        "appropriate_contexts": ["religious ceremonies", "weddings", "festivals", "celebrations"],
        "inappropriate_contexts": ["funeral decorations in some contexts", "casual non-cultural events"],
        "usage_guidelines": [
            "Use in garlands and string arrangements",
            "Combine with other traditional flowers",
            "Respect religious significance in ceremonial contexts"
        ],
        "sacred_level": "medium",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#FFA500", "#FFD700", "#FF8C00", "#FF4500"],
        "materials": ["fresh flowers", "silk flowers", "garland strings"],
        "patterns": ["garland stringing", "mandala arrangements", "doorway decorations"],
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    {
        "name": "Rangoli Patterns",
        "culture": "Indian",
        "category": "decorative_pattern",
        "description": "Traditional Indian floor art using colored powders, flowers, or rice",
        "significance": "Welcomes guests and deities, brings good luck and prosperity",
        "appropriate_contexts": ["festivals", "ceremonies", "home celebrations", "cultural events"],
        "inappropriate_contexts": ["areas with heavy foot traffic", "outdoor events during rain"],
        "usage_guidelines": [
            "Place at entrances or central focal points",
            "Use traditional geometric and floral patterns",
            "Consider practical limitations of temporary art"
        ],
        "sacred_level": "medium",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#FFA500", "#800080"],
        "materials": ["colored sand", "flower petals", "rice", "chalk powder"],
        "patterns": ["geometric designs", "floral motifs", "lotus patterns", "mandala circles"],
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    
    # AFRICAN (GENERAL) CULTURE - Note: Africa has many distinct cultures
    {
        "name": "Kente-Inspired Patterns",
        "culture": "West African (Akan)",
        "category": "decorative_textile",
        "description": "Geometric patterns inspired by traditional Kente cloth from Ghana",
        "significance": "Each pattern and color combination has specific meanings and history",
        "appropriate_contexts": ["cultural celebrations", "educational events", "community gatherings"],
        "inappropriate_contexts": ["without understanding of significance", "inappropriate cultural mixing"],
        "usage_guidelines": [
            "Research specific pattern meanings before use",
            "Use with proper cultural context and respect",
            "Consider consulting with Ghanaian cultural experts"
        ],
        "sacred_level": "high",
        "community_permission_required": True,
        "modern_adaptations_allowed": False,
        "colors": ["#FFD700", "#FF0000", "#008000", "#000000", "#FFA500"],
        "materials": ["silk", "cotton", "traditional weaving"],
        "patterns": ["geometric strips", "symbolic motifs", "traditional weaving patterns"],
        "sources": ["General cultural knowledge - REQUIRES COMMUNITY VALIDATION"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    
    # SCANDINAVIAN CULTURE
    {
        "name": "Hygge Lighting Concepts",
        "culture": "Danish/Scandinavian",
        "category": "lighting_design",
        "description": "Cozy, warm lighting that creates intimate and comfortable atmosphere",
        "significance": "Embodies Danish concept of comfort, coziness, and well-being",
        "appropriate_contexts": ["intimate gatherings", "winter events", "home celebrations", "wellness events"],
        "inappropriate_contexts": ["formal business events", "large outdoor events"],
        "usage_guidelines": [
            "Use warm, dim lighting (2200K-2700K)",
            "Include candles and soft lamp lighting",
            "Create multiple small light sources rather than bright overhead lighting"
        ],
        "sacred_level": "low",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#FFF8DC", "#F5DEB3", "#D2B48C"],
        "materials": ["candles", "wood", "natural fibers", "warm metals"],
        "patterns": ["soft diffusion", "warm glows", "intimate lighting zones"],
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    },
    
    # IRISH CULTURE
    {
        "name": "Celtic Knot Patterns",
        "culture": "Irish/Celtic",
        "category": "decorative_pattern",
        "description": "Interwoven knot patterns with no beginning or end",
        "significance": "Represents eternity, interconnectedness, and spiritual continuity",
        "appropriate_contexts": ["weddings", "spiritual ceremonies", "cultural celebrations"],
        "inappropriate_contexts": ["casual decoration without meaning", "inappropriate cultural contexts"],
        "usage_guidelines": [
            "Understand the spiritual significance before use",
            "Use in contexts that honor the meaning",
            "Consider traditional color palettes"
        ],
        "sacred_level": "medium",
        "community_permission_required": False,
        "modern_adaptations_allowed": True,
        "colors": ["#228B22", "#FFD700", "#A0522D", "#000000"],
        "materials": ["carved wood", "metal work", "stone", "textiles"],
        "patterns": ["interwoven lines", "endless loops", "traditional knot forms"],
        "sources": ["General cultural knowledge - requires expert validation"],
        "is_verified": False,
        "needs_review": True,
        "disclaimer_required": True
    }
]

async def populate_cultural_database():
    """Populate the database with starter cultural data."""
    print("🚨 CULTURAL DATABASE POPULATION")
    print("=====================================")
    print("⚠️  IMPORTANT DISCLAIMER:")
    print("   This data is for TECHNICAL DEMONSTRATION ONLY")
    print("   ALL entries require validation by cultural experts")
    print("   DO NOT use in production without proper consultation")
    print("=====================================\n")
    
    try:
        # Initialize database connection
        await init_db()
        cultural_service = CulturalService()
        
        print(f"📝 Inserting {len(STARTER_CULTURAL_ELEMENTS)} cultural elements...")
        
        created_count = 0
        for element_data in STARTER_CULTURAL_ELEMENTS:
            try:
                element = CulturalElementCreate(**element_data)
                created_element = await cultural_service.create_cultural_element(element)
                created_count += 1
                print(f"   ✅ Created: {created_element.name} ({created_element.culture})")
                
            except Exception as e:
                print(f"   ❌ Failed to create {element_data['name']}: {e}")
        
        print(f"\n📊 Successfully created {created_count}/{len(STARTER_CULTURAL_ELEMENTS)} elements")
        print("\n🔍 Database Summary:")
        
        # Get statistics
        all_elements = await cultural_service.get_cultural_elements()
        cultures = set(element.culture for element in all_elements)
        categories = set(element.category for element in all_elements)
        
        print(f"   Total elements: {len(all_elements)}")
        print(f"   Cultures represented: {len(cultures)}")
        print(f"   Categories: {len(categories)}")
        print(f"   Cultures: {', '.join(sorted(cultures))}")
        
        print("\n⚠️  REMEMBER:")
        print("   - All data needs cultural expert validation")
        print("   - Consult with community members before production use")
        print("   - Update entries with proper sources and permissions")
        print("   - This is a technical foundation, not cultural authority")
        
    except Exception as e:
        print(f"❌ Error populating cultural database: {e}")
    
    finally:
        await close_db()

if __name__ == "__main__":
    asyncio.run(populate_cultural_database())