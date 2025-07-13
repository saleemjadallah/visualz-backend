"""
AI Event Visualization - Comprehensive Synonym Mapping System
===========================================================

This module provides natural language understanding for the AI event platform,
mapping user input variations to standardized internal templates and categories.
"""

from typing import Dict, List, Set, Optional, Union
import re
from dataclasses import dataclass
from enum import Enum

@dataclass
class SynonymMapping:
    """Structure for organizing synonym relationships"""
    canonical_term: str
    synonyms: Set[str]
    category: str
    subcategory: Optional[str] = None
    cultural_context: Optional[List[str]] = None
    formality_level: Optional[str] = None  # casual, formal, professional
    region_specific: Optional[List[str]] = None

class EventCategory(Enum):
    """Main event categories for the AI system"""
    WEDDING = "wedding"
    CORPORATE = "corporate"
    BIRTHDAY = "birthday"
    ANNIVERSARY = "anniversary"
    CULTURAL = "cultural"
    RELIGIOUS = "religious"
    SEASONAL = "seasonal"
    SOCIAL = "social"
    PROFESSIONAL = "professional"
    CELEBRATION = "celebration"

class SpaceType(Enum):
    """Space categories for venue classification"""
    INDOOR = "indoor"
    OUTDOOR = "outdoor"
    HYBRID = "hybrid"
    VIRTUAL = "virtual"

# ========================================================================
# EVENT TYPE SYNONYMS
# ========================================================================

EVENT_TYPE_SYNONYMS = {
    # WEDDING EVENTS
    "wedding": SynonymMapping(
        canonical_term="wedding",
        synonyms={
            "wedding", "marriage", "matrimony", "nuptials", "union ceremony",
            "wedding ceremony", "marriage ceremony", "matrimonial celebration",
            "bridal ceremony", "wedding celebration", "marriage celebration",
            "wedding party", "wedding reception", "marriage reception",
            "wedding banquet", "wedding feast", "wedding event"
        },
        category="celebration",
        subcategory="life_milestone",
        formality_level="formal"
    ),
    
    "engagement_party": SynonymMapping(
        canonical_term="engagement_party",
        synonyms={
            "engagement party", "engagement celebration", "engagement bash",
            "engagement gathering", "betrothal party", "pre-wedding party",
            "proposal celebration", "engagement dinner", "engagement event",
            "engagement soirée", "engagement get-together"
        },
        category="celebration",
        subcategory="pre_wedding",
        formality_level="semi_formal"
    ),
    
    "bridal_shower": SynonymMapping(
        canonical_term="bridal_shower",
        synonyms={
            "bridal shower", "bride shower", "wedding shower", "bridal tea",
            "bridal party", "pre-wedding shower", "bridal celebration",
            "bridal luncheon", "bridal gathering", "hen party", "bachelorette party"
        },
        category="celebration",
        subcategory="pre_wedding",
        formality_level="casual"
    ),
    
    "bachelor_party": SynonymMapping(
        canonical_term="bachelor_party",
        synonyms={
            "bachelor party", "stag party", "stag do", "buck's party",
            "groom's party", "bachelor celebration", "pre-wedding party",
            "last night of freedom", "bachelor bash", "stag night"
        },
        category="celebration",
        subcategory="pre_wedding",
        formality_level="casual"
    ),
    
    "rehearsal_dinner": SynonymMapping(
        canonical_term="rehearsal_dinner",
        synonyms={
            "rehearsal dinner", "wedding rehearsal", "pre-wedding dinner",
            "practice dinner", "rehearsal celebration", "wedding practice",
            "rehearsal party", "pre-ceremony dinner"
        },
        category="celebration",
        subcategory="pre_wedding",
        formality_level="semi_formal"
    ),
    
    # BIRTHDAY CELEBRATIONS
    "birthday": SynonymMapping(
        canonical_term="birthday",
        synonyms={
            "birthday", "birthday party", "birthday celebration", "birthday bash",
            "birthday gathering", "birthday event", "bday", "b-day", "natal day",
            "anniversary of birth", "birthday festivities", "birthday soirée"
        },
        category="celebration",
        subcategory="personal_milestone",
        formality_level="casual"
    ),
    
    "milestone_birthday": SynonymMapping(
        canonical_term="milestone_birthday",
        synonyms={
            "milestone birthday", "big birthday", "landmark birthday",
            "significant birthday", "special birthday", "major birthday",
            "21st birthday", "30th birthday", "40th birthday", "50th birthday",
            "sweet sixteen", "coming of age", "quinceañera", "bar mitzvah", "bat mitzvah"
        },
        category="celebration",
        subcategory="life_milestone",
        formality_level="formal"
    ),
    
    # CORPORATE EVENTS
    "corporate_meeting": SynonymMapping(
        canonical_term="corporate_meeting",
        synonyms={
            "corporate meeting", "business meeting", "board meeting", "team meeting",
            "staff meeting", "company meeting", "executive meeting", "conference call",
            "business conference", "corporate conference", "work meeting",
            "professional meeting", "office meeting"
        },
        category="professional",
        subcategory="meeting",
        formality_level="professional"
    ),
    
    "product_launch": SynonymMapping(
        canonical_term="product_launch",
        synonyms={
            "product launch", "product unveiling", "product release", "launch event",
            "product debut", "product introduction", "launch party", "reveal event",
            "product presentation", "launch celebration", "grand opening",
            "product showcase", "brand launch"
        },
        category="professional",
        subcategory="marketing",
        formality_level="professional"
    ),
    
    "team_building": SynonymMapping(
        canonical_term="team_building",
        synonyms={
            "team building", "team bonding", "corporate retreat", "staff retreat",
            "team outing", "company outing", "team activity", "corporate event",
            "employee event", "team exercise", "corporate fun day", "staff party",
            "company party", "office party"
        },
        category="professional",
        subcategory="team_development",
        formality_level="casual"
    ),
    
    "conference": SynonymMapping(
        canonical_term="conference",
        synonyms={
            "conference", "summit", "convention", "symposium", "seminar",
            "workshop", "business conference", "professional conference",
            "industry conference", "trade show", "expo", "forum", "colloquium"
        },
        category="professional",
        subcategory="educational",
        formality_level="professional"
    ),
    
    # CULTURAL CELEBRATIONS
    "diwali": SynonymMapping(
        canonical_term="diwali",
        synonyms={
            "diwali", "deepavali", "festival of lights", "diwali celebration",
            "diwali party", "diwali festival", "lakshmi puja", "deepawali"
        },
        category="cultural",
        subcategory="hindu_festival",
        cultural_context=["indian", "hindu"],
        formality_level="formal"
    ),
    
    "chinese_new_year": SynonymMapping(
        canonical_term="chinese_new_year",
        synonyms={
            "chinese new year", "lunar new year", "spring festival", "cny",
            "chinese new year celebration", "lunar new year party",
            "spring festival celebration", "year of the dragon", "year of the rabbit"
        },
        category="cultural",
        subcategory="chinese_festival",
        cultural_context=["chinese", "asian"],
        formality_level="formal"
    ),
    
    "eid": SynonymMapping(
        canonical_term="eid",
        synonyms={
            "eid", "eid celebration", "eid party", "eid ul fitr", "eid al adha",
            "eid festival", "eid gathering", "iftar", "eid feast"
        },
        category="cultural",
        subcategory="islamic_festival",
        cultural_context=["islamic", "muslim"],
        formality_level="formal"
    ),
    
    "christmas": SynonymMapping(
        canonical_term="christmas",
        synonyms={
            "christmas", "christmas party", "christmas celebration", "xmas",
            "christmas gathering", "holiday party", "christmas dinner",
            "christmas eve", "christmas day", "yule", "yuletide"
        },
        category="cultural",
        subcategory="christian_festival",
        cultural_context=["christian", "western"],
        formality_level="semi_formal"
    ),
    
    "hanukkah": SynonymMapping(
        canonical_term="hanukkah",
        synonyms={
            "hanukkah", "chanukah", "festival of lights", "hanukkah celebration",
            "hanukkah party", "jewish festival", "hanukkah dinner"
        },
        category="cultural",
        subcategory="jewish_festival",
        cultural_context=["jewish"],
        formality_level="formal"
    ),
    
    # SEASONAL CELEBRATIONS
    "thanksgiving": SynonymMapping(
        canonical_term="thanksgiving",
        synonyms={
            "thanksgiving", "thanksgiving dinner", "thanksgiving celebration",
            "thanksgiving gathering", "thanksgiving feast", "turkey day",
            "thanksgiving party", "harvest celebration"
        },
        category="seasonal",
        subcategory="autumn_festival",
        cultural_context=["american", "canadian"],
        formality_level="semi_formal"
    ),
    
    "halloween": SynonymMapping(
        canonical_term="halloween",
        synonyms={
            "halloween", "halloween party", "halloween celebration", "all hallows eve",
            "costume party", "halloween bash", "trick or treat", "spooky party",
            "halloween gathering", "haunted party"
        },
        category="seasonal",
        subcategory="autumn_festival",
        formality_level="casual"
    ),
    
    "new_years": SynonymMapping(
        canonical_term="new_years",
        synonyms={
            "new year", "new years", "new year's eve", "nye", "new year party",
            "new year celebration", "new year's party", "countdown party",
            "new year gathering", "year end party"
        },
        category="seasonal",
        subcategory="winter_festival",
        formality_level="semi_formal"
    )
}

# ========================================================================
# SPACE AND VENUE SYNONYMS
# ========================================================================

VENUE_TYPE_SYNONYMS = {
    # INDOOR VENUES
    "ballroom": SynonymMapping(
        canonical_term="ballroom",
        synonyms={
            "ballroom", "grand ballroom", "banquet hall", "reception hall",
            "event hall", "function hall", "grand hall", "dance hall",
            "ceremonial hall", "celebration hall"
        },
        category="indoor",
        subcategory="formal_venue",
        formality_level="formal"
    ),
    
    "restaurant": SynonymMapping(
        canonical_term="restaurant",
        synonyms={
            "restaurant", "dining room", "private dining", "eatery", "bistro",
            "café", "brasserie", "tavern", "gastropub", "fine dining",
            "casual dining", "family restaurant"
        },
        category="indoor",
        subcategory="dining_venue",
        formality_level="semi_formal"
    ),
    
    "home": SynonymMapping(
        canonical_term="home",
        synonyms={
            "home", "house", "residence", "private home", "family home",
            "apartment", "condo", "living room", "dining room", "backyard",
            "patio", "deck", "basement", "garage"
        },
        category="indoor",
        subcategory="residential",
        formality_level="casual"
    ),
    
    "office": SynonymMapping(
        canonical_term="office",
        synonyms={
            "office", "workplace", "conference room", "meeting room", "boardroom",
            "corporate office", "business center", "coworking space",
            "office building", "corporate headquarters"
        },
        category="indoor",
        subcategory="professional",
        formality_level="professional"
    ),
    
    # OUTDOOR VENUES
    "garden": SynonymMapping(
        canonical_term="garden",
        synonyms={
            "garden", "botanical garden", "outdoor garden", "courtyard",
            "rose garden", "zen garden", "landscape garden", "formal garden",
            "english garden", "japanese garden", "greenhouse", "conservatory"
        },
        category="outdoor",
        subcategory="natural",
        formality_level="semi_formal"
    ),
    
    "beach": SynonymMapping(
        canonical_term="beach",
        synonyms={
            "beach", "beachfront", "oceanfront", "seaside", "waterfront",
            "coastal venue", "beach resort", "pier", "marina", "yacht club",
            "lakefront", "riverside"
        },
        category="outdoor",
        subcategory="waterfront",
        formality_level="casual"
    ),
    
    "park": SynonymMapping(
        canonical_term="park",
        synonyms={
            "park", "public park", "city park", "national park", "pavilion",
            "gazebo", "outdoor pavilion", "picnic area", "recreation area",
            "outdoor space", "green space"
        },
        category="outdoor",
        subcategory="public",
        formality_level="casual"
    ),
    
    "rooftop": SynonymMapping(
        canonical_term="rooftop",
        synonyms={
            "rooftop", "roof deck", "terrace", "rooftop terrace", "penthouse",
            "sky lounge", "rooftop bar", "outdoor deck", "rooftop garden",
            "observation deck"
        },
        category="outdoor",
        subcategory="elevated",
        formality_level="semi_formal"
    )
}

# ========================================================================
# DESIGN STYLE SYNONYMS
# ========================================================================

DESIGN_STYLE_SYNONYMS = {
    # TRADITIONAL STYLES
    "classic": SynonymMapping(
        canonical_term="classic",
        synonyms={
            "classic", "classical", "traditional", "timeless", "elegant",
            "formal", "sophisticated", "refined", "graceful", "conventional"
        },
        category="traditional",
        formality_level="formal"
    ),
    
    "vintage": SynonymMapping(
        canonical_term="vintage",
        synonyms={
            "vintage", "retro", "antique", "old-fashioned", "nostalgic",
            "period", "historic", "classic vintage", "shabby chic",
            "rustic vintage"
        },
        category="traditional",
        formality_level="semi_formal"
    ),
    
    # MODERN STYLES
    "modern": SynonymMapping(
        canonical_term="modern",
        synonyms={
            "modern", "contemporary", "current", "up-to-date", "trendy",
            "fashionable", "stylish", "chic", "sleek", "streamlined"
        },
        category="contemporary",
        formality_level="semi_formal"
    ),
    
    "minimalist": SynonymMapping(
        canonical_term="minimalist",
        synonyms={
            "minimalist", "minimal", "simple", "clean", "uncluttered",
            "sparse", "bare", "understated", "basic", "essential"
        },
        category="contemporary",
        formality_level="casual"
    ),
    
    # CULTURAL STYLES
    "bohemian": SynonymMapping(
        canonical_term="bohemian",
        synonyms={
            "bohemian", "boho", "eclectic", "artistic", "free-spirited",
            "unconventional", "creative", "colorful", "vibrant", "relaxed"
        },
        category="eclectic",
        formality_level="casual"
    ),
    
    "industrial": SynonymMapping(
        canonical_term="industrial",
        synonyms={
            "industrial", "urban", "loft", "warehouse", "exposed", "raw",
            "edgy", "gritty", "metropolitan", "concrete", "steel"
        },
        category="contemporary",
        formality_level="casual"
    ),
    
    "rustic": SynonymMapping(
        canonical_term="rustic",
        synonyms={
            "rustic", "country", "farmhouse", "rural", "natural", "organic",
            "earthy", "wooden", "barn", "cottage", "cabin"
        },
        category="traditional",
        formality_level="casual"
    )
}

# ========================================================================
# COLOR SCHEME SYNONYMS
# ========================================================================

COLOR_SCHEME_SYNONYMS = {
    # NEUTRAL PALETTES
    "neutral": SynonymMapping(
        canonical_term="neutral",
        synonyms={
            "neutral", "beige", "cream", "ivory", "white", "off-white",
            "taupe", "gray", "grey", "natural", "earth tones", "muted"
        },
        category="neutral",
        formality_level="formal"
    ),
    
    "monochrome": SynonymMapping(
        canonical_term="monochrome",
        synonyms={
            "monochrome", "black and white", "grayscale", "single color",
            "monotone", "one color", "black white grey"
        },
        category="neutral",
        formality_level="formal"
    ),
    
    # WARM PALETTES
    "warm": SynonymMapping(
        canonical_term="warm",
        synonyms={
            "warm", "warm colors", "warm tones", "red", "orange", "yellow",
            "gold", "amber", "rust", "burgundy", "terracotta", "coral"
        },
        category="warm",
        formality_level="semi_formal"
    ),
    
    "autumn": SynonymMapping(
        canonical_term="autumn",
        synonyms={
            "autumn", "fall", "fall colors", "autumn colors", "harvest",
            "pumpkin", "burnt orange", "deep red", "golden yellow",
            "brown", "bronze"
        },
        category="seasonal",
        subcategory="autumn",
        formality_level="casual"
    ),
    
    # COOL PALETTES
    "cool": SynonymMapping(
        canonical_term="cool",
        synonyms={
            "cool", "cool colors", "cool tones", "blue", "green", "purple",
            "turquoise", "teal", "mint", "lavender", "periwinkle", "sage"
        },
        category="cool",
        formality_level="semi_formal"
    ),
    
    "ocean": SynonymMapping(
        canonical_term="ocean",
        synonyms={
            "ocean", "sea", "marine", "nautical", "coastal", "aqua",
            "seafoam", "navy", "deep blue", "sea green", "water colors"
        },
        category="themed",
        subcategory="nature",
        formality_level="casual"
    ),
    
    # VIBRANT PALETTES
    "vibrant": SynonymMapping(
        canonical_term="vibrant",
        synonyms={
            "vibrant", "bright", "bold", "vivid", "intense", "saturated",
            "colorful", "rainbow", "multi-color", "festive", "cheerful"
        },
        category="vibrant",
        formality_level="casual"
    ),
    
    "tropical": SynonymMapping(
        canonical_term="tropical",
        synonyms={
            "tropical", "paradise", "caribbean", "island", "exotic",
            "lime green", "hot pink", "bright orange", "sunshine yellow",
            "palm", "beach colors"
        },
        category="themed",
        subcategory="tropical",
        formality_level="casual"
    )
}

# ========================================================================
# DECORATION ELEMENTS SYNONYMS
# ========================================================================

DECORATION_SYNONYMS = {
    # LIGHTING
    "lighting": SynonymMapping(
        canonical_term="lighting",
        synonyms={
            "lighting", "lights", "illumination", "lamps", "fixtures",
            "ambient lighting", "mood lighting", "accent lighting",
            "string lights", "fairy lights", "candles", "lanterns"
        },
        category="lighting",
        formality_level="semi_formal"
    ),
    
    "candles": SynonymMapping(
        canonical_term="candles",
        synonyms={
            "candles", "candlelight", "votives", "tea lights", "pillar candles",
            "taper candles", "floating candles", "scented candles",
            "wax candles", "romantic lighting"
        },
        category="lighting",
        subcategory="romantic",
        formality_level="formal"
    ),
    
    # FLOWERS AND PLANTS
    "flowers": SynonymMapping(
        canonical_term="flowers",
        synonyms={
            "flowers", "floral", "blooms", "bouquets", "arrangements",
            "centerpieces", "petals", "fresh flowers", "artificial flowers",
            "silk flowers", "dried flowers"
        },
        category="floral",
        formality_level="formal"
    ),
    
    "plants": SynonymMapping(
        canonical_term="plants",
        synonyms={
            "plants", "greenery", "foliage", "leaves", "ferns", "palms",
            "succulents", "potted plants", "hanging plants", "natural decor"
        },
        category="natural",
        formality_level="casual"
    ),
    
    # TEXTILES
    "fabric": SynonymMapping(
        canonical_term="fabric",
        synonyms={
            "fabric", "textiles", "draping", "curtains", "linens", "tablecloths",
            "napkins", "runners", "backdrops", "banners", "cloth"
        },
        category="textiles",
        formality_level="semi_formal"
    ),
    
    "balloons": SynonymMapping(
        canonical_term="balloons",
        synonyms={
            "balloons", "balloon arch", "balloon garland", "helium balloons",
            "foil balloons", "latex balloons", "balloon bouquet",
            "balloon decorations"
        },
        category="party_supplies",
        formality_level="casual"
    )
}

# ========================================================================
# FOOD AND CATERING SYNONYMS
# ========================================================================

CATERING_SYNONYMS = {
    # SERVICE STYLES
    "buffet": SynonymMapping(
        canonical_term="buffet",
        synonyms={
            "buffet", "self-service", "buffet style", "serve yourself",
            "family style", "station dining", "food stations"
        },
        category="service_style",
        formality_level="casual"
    ),
    
    "plated": SynonymMapping(
        canonical_term="plated",
        synonyms={
            "plated", "sit-down", "served", "formal dinner", "course meal",
            "plated service", "seated dinner", "served meal"
        },
        category="service_style",
        formality_level="formal"
    ),
    
    "cocktail": SynonymMapping(
        canonical_term="cocktail",
        synonyms={
            "cocktail", "cocktail hour", "appetizers", "hors d'oeuvres",
            "finger food", "small bites", "canapés", "reception style",
            "standing reception", "mingling"
        },
        category="service_style",
        formality_level="semi_formal"
    ),
    
    # CUISINE TYPES
    "italian": SynonymMapping(
        canonical_term="italian",
        synonyms={
            "italian", "pasta", "pizza", "mediterranean", "tuscan",
            "sicilian", "roman", "neapolitan", "venetian"
        },
        category="cuisine",
        cultural_context=["italian"],
        formality_level="semi_formal"
    ),
    
    "asian": SynonymMapping(
        canonical_term="asian",
        synonyms={
            "asian", "chinese", "japanese", "thai", "vietnamese", "korean",
            "indian", "pan-asian", "oriental", "eastern"
        },
        category="cuisine",
        cultural_context=["asian"],
        formality_level="semi_formal"
    ),
    
    "mexican": SynonymMapping(
        canonical_term="mexican",
        synonyms={
            "mexican", "latin", "hispanic", "spanish", "tex-mex",
            "southwestern", "central american", "south american"
        },
        category="cuisine",
        cultural_context=["mexican", "latin"],
        formality_level="casual"
    )
}

# ========================================================================
# NATURAL LANGUAGE PROCESSING CLASS
# ========================================================================

class EventSynonymMapper:
    """
    Main class for processing natural language input and mapping to canonical terms
    """
    
    def __init__(self):
        self.all_mappings = {
            **EVENT_TYPE_SYNONYMS,
            **VENUE_TYPE_SYNONYMS,
            **DESIGN_STYLE_SYNONYMS,
            **COLOR_SCHEME_SYNONYMS,
            **DECORATION_SYNONYMS,
            **CATERING_SYNONYMS
        }
        
        # Create reverse mapping for fast lookup
        self.synonym_to_canonical = {}
        self._build_reverse_mapping()
    
    def _build_reverse_mapping(self):
        """Build reverse mapping from synonyms to canonical terms"""
        for canonical, mapping in self.all_mappings.items():
            for synonym in mapping.synonyms:
                self.synonym_to_canonical[synonym.lower()] = canonical
    
    def normalize_text(self, text: str) -> str:
        """Normalize input text for better matching"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove common punctuation
        text = re.sub(r'[^\w\s-]', ' ', text)
        
        # Handle common abbreviations and variations
        text = re.sub(r'\bb-?day\b', 'birthday', text)
        text = re.sub(r'\bxmas\b', 'christmas', text)
        text = re.sub(r'\bnye\b', 'new years eve', text)
        text = re.sub(r'\bcny\b', 'chinese new year', text)
        
        # Normalize spacing
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def extract_canonical_terms(self, user_input: str) -> Dict[str, List[str]]:
        """
        Extract and map user input to canonical terms
        
        Args:
            user_input: Natural language description from user
            
        Returns:
            Dictionary with categories and their canonical terms
        """
        normalized_input = self.normalize_text(user_input)
        words = normalized_input.split()
        
        results = {
            "event_types": [],
            "venue_types": [],
            "design_styles": [],
            "color_schemes": [],
            "decorations": [],
            "catering": [],
            "cultural_context": [],
            "formality_level": None
        }
        
        # Check for exact matches first
        for canonical, mapping in self.all_mappings.items():
            for synonym in mapping.synonyms:
                if synonym.lower() in normalized_input:
                    self._add_to_results(results, canonical, mapping)
        
        # Check for partial matches and phrases
        self._check_phrase_matches(normalized_input, results)
        
        return results
    
    def _add_to_results(self, results: Dict, canonical: str, mapping: SynonymMapping):
        """Add canonical term to appropriate category in results"""
        category_map = {
            "celebration": "event_types",
            "professional": "event_types",
            "cultural": "event_types",
            "seasonal": "event_types",
            "indoor": "venue_types",
            "outdoor": "venue_types",
            "traditional": "design_styles",
            "contemporary": "design_styles",
            "eclectic": "design_styles",
            "neutral": "color_schemes",
            "warm": "color_schemes",
            "cool": "color_schemes",
            "vibrant": "color_schemes",
            "themed": "color_schemes",
            "lighting": "decorations",
            "floral": "decorations",
            "natural": "decorations",
            "textiles": "decorations",
            "party_supplies": "decorations",
            "service_style": "catering",
            "cuisine": "catering"
        }
        
        target_category = category_map.get(mapping.category, "other")
        
        if target_category in results and canonical not in results[target_category]:
            results[target_category].append(canonical)
        
        # Add cultural context
        if mapping.cultural_context:
            results["cultural_context"].extend(mapping.cultural_context)
        
        # Set formality level (use highest formality found)
        if mapping.formality_level:
            formality_hierarchy = {"casual": 1, "semi_formal": 2, "formal": 3, "professional": 4}
            current_level = formality_hierarchy.get(results["formality_level"], 0)
            new_level = formality_hierarchy.get(mapping.formality_level, 0)
            
            if new_level > current_level:
                results["formality_level"] = mapping.formality_level
    
    def _check_phrase_matches(self, text: str, results: Dict):
        """Check for multi-word phrases and compound terms"""
        # Common phrase patterns
        phrase_patterns = [
            r"birthday party",
            r"wedding reception",
            r"corporate event",
            r"team building",
            r"product launch",
            r"holiday party",
            r"graduation party",
            r"anniversary celebration"
        ]
        
        for pattern in phrase_patterns:
            if re.search(pattern, text):
                # Extract the key term and map it
                key_term = pattern.replace(r"\b", "").replace(" ", "_")
                if key_term in self.all_mappings:
                    mapping = self.all_mappings[key_term]
                    self._add_to_results(results, key_term, mapping)
    
    def get_suggestions(self, partial_input: str, limit: int = 10) -> List[str]:
        """Get suggested completions for partial input"""
        normalized = self.normalize_text(partial_input)
        suggestions = []
        
        for canonical, mapping in self.all_mappings.items():
            for synonym in mapping.synonyms:
                if synonym.lower().startswith(normalized):
                    suggestions.append(synonym)
                    if len(suggestions) >= limit:
                        break
            if len(suggestions) >= limit:
                break
        
        return sorted(suggestions)
    
    def get_cultural_context(self, canonical_terms: List[str]) -> Dict[str, any]:
        """Extract cultural context and sensitivity information"""
        cultural_info = {
            "cultures": set(),
            "sensitivity_level": "low",
            "recommendations": [],
            "requirements": []
        }
        
        for term in canonical_terms:
            if term in self.all_mappings:
                mapping = self.all_mappings[term]
                if mapping.cultural_context:
                    cultural_info["cultures"].update(mapping.cultural_context)
                    
                    # Increase sensitivity level for cultural events
                    if mapping.category == "cultural":
                        cultural_info["sensitivity_level"] = "high"
        
        # Convert set to list for JSON serialization
        cultural_info["cultures"] = list(cultural_info["cultures"])
        
        return cultural_info
    
    def validate_combinations(self, extracted_terms: Dict) -> Dict[str, any]:
        """Validate that extracted term combinations make sense"""
        validation = {
            "valid": True,
            "warnings": [],
            "suggestions": []
        }
        
        # Check for conflicting styles
        styles = extracted_terms.get("design_styles", [])
        if "minimalist" in styles and "bohemian" in styles:
            validation["warnings"].append(
                "Minimalist and bohemian styles may conflict. Consider choosing one primary style."
            )
        
        # Check venue-event compatibility
        venues = extracted_terms.get("venue_types", [])
        events = extracted_terms.get("event_types", [])
        
        if "wedding" in events and "office" in venues:
            validation["warnings"].append(
                "Office venues may not be ideal for weddings. Consider more formal venues."
            )
        
        return validation

    def map_to_system_event_type(self, canonical_term: str) -> Optional[str]:
        """Map canonical terms to system event types"""
        event_type_mapping = {
            "birthday": "birthday-adult",  # Default to adult, will be overridden if child indicators present
            "milestone_birthday": "birthday-adult",
            "wedding": "wedding",
            "engagement_party": "wedding",
            "bridal_shower": "wedding",
            "bachelor_party": "wedding",
            "rehearsal_dinner": "wedding",
            "corporate_meeting": "corporate",
            "product_launch": "product-launch",
            "team_building": "corporate",
            "conference": "corporate",
            "diwali": "cultural-celebration",
            "chinese_new_year": "cultural-celebration",
            "eid": "cultural-celebration",
            "christmas": "cultural-celebration",
            "hanukkah": "cultural-celebration",
            "thanksgiving": "cultural-celebration",
            "halloween": "cultural-celebration",
            "new_years": "cultural-celebration"
        }
        
        return event_type_mapping.get(canonical_term)

# ========================================================================
# USAGE EXAMPLES AND TESTING
# ========================================================================

def demo_usage():
    """Demonstrate the synonym mapping system"""
    mapper = EventSynonymMapper()
    
    # Test cases
    test_inputs = [
        "I'm planning a wedding reception in a ballroom with classic elegant style",
        "Birthday bash at home with bright colorful decorations",
        "Corporate team building event outdoors with casual modern vibe",
        "Diwali celebration with traditional Indian decorations and warm colors",
        "Christmas party at the office with festive lighting and buffet style food"
    ]
    
    print("=== Event Synonym Mapping Demo ===\n")
    
    for i, test_input in enumerate(test_inputs, 1):
        print(f"Test {i}: {test_input}")
        
        # Extract canonical terms
        results = mapper.extract_canonical_terms(test_input)
        
        print("Extracted terms:")
        for category, terms in results.items():
            if terms:
                print(f"  {category}: {terms}")
        
        # Get cultural context
        all_terms = []
        for terms in results.values():
            if isinstance(terms, list):
                all_terms.extend(terms)
        
        cultural_context = mapper.get_cultural_context(all_terms)
        if cultural_context["cultures"]:
            print(f"  Cultural context: {cultural_context}")
        
        # Validate combinations
        validation = mapper.validate_combinations(results)
        if validation["warnings"]:
            print(f"  Warnings: {validation['warnings']}")
        
        print("-" * 50)

if __name__ == "__main__":
    demo_usage()