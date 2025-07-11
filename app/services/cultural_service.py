"""
Cultural Service - AI Integration with Cultural Database
Provides cultural validation, recommendations, and design elements
for event visualization system
"""

import logging
from typing import Dict, List, Optional, Any, Tuple
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import asyncio

from app.services.database import get_database
from app.models.cultural import (
    CulturalPhilosophy, DesignElement, EventApplication, 
    CulturalValidationResult, FusionCompatibility
)

logger = logging.getLogger(__name__)

class CulturalService:
    """Service for cultural database operations and AI integration"""
    
    def __init__(self):
        self.db = None
        self.cultural_db = None
    
    async def initialize(self):
        """Initialize database connections"""
        try:
            self.db = await get_database()
            # Connect to cultural database
            client = self.db.client
            self.cultural_db = client['designvisualz_cultural']
            
            # Check if database exists by listing collections
            collections = await self.cultural_db.list_collection_names()
            
            # If no collections exist, initialize the database
            if not collections or len(collections) == 0:
                logger.info("Cultural database is empty, initializing with default data...")
                await self._initialize_cultural_database()
            
            logger.info("Cultural service initialized successfully")
            return True
        except Exception as e:
            logger.warning(f"Cultural database not available: {e}")
            logger.info("Cultural service will operate in fallback mode")
            self.cultural_db = None
            return False
    
    async def get_philosophy(self, philosophy_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific design philosophy"""
        if not self.cultural_db:
            success = await self.initialize()
            if not success:
                return self._get_fallback_philosophy(philosophy_id)
        
        try:
            philosophy = await self.cultural_db.philosophies.find_one(
                {"philosophyId": philosophy_id}
            )
            return philosophy
        except Exception as e:
            logger.warning(f"Error fetching philosophy: {e}")
            return self._get_fallback_philosophy(philosophy_id)
    
    async def get_all_philosophies(self) -> List[Dict[str, Any]]:
        """Get all available design philosophies"""
        if not self.cultural_db:
            success = await self.initialize()
            if not success:
                return self._get_fallback_philosophies()
        
        try:
            cursor = self.cultural_db.philosophies.find({})
            philosophies = await cursor.to_list(length=None)
            return philosophies
        except Exception as e:
            logger.warning(f"Error fetching philosophies: {e}")
            return self._get_fallback_philosophies()
    
    async def get_design_elements(
        self, 
        philosophy_id: str, 
        element_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get design elements for a philosophy"""
        if not self.cultural_db:
            await self.initialize()
        
        query = {"philosophyId": philosophy_id}
        if element_type:
            query["elementType"] = element_type
        
        cursor = self.cultural_db.design_elements.find(query)
        elements = await cursor.to_list(length=None)
        return elements
    
    async def validate_cultural_sensitivity(
        self, 
        philosophy_id: str, 
        event_type: str, 
        elements: List[str],
        guest_count: int = 0
    ) -> Dict[str, Any]:
        """Validate cultural sensitivity of design choices"""
        if not self.cultural_db:
            await self.initialize()
        
        # Get philosophy
        philosophy = await self.get_philosophy(philosophy_id)
        if not philosophy:
            return {
                "valid": False,
                "errors": ["Philosophy not found"],
                "warnings": [],
                "consultationRequired": False
            }
        
        sensitivity = philosophy.get("culturalSensitivity", {})
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "consultationRequired": sensitivity.get("consultationRequired", False),
            "sensitivityLevel": sensitivity.get("level", "medium")
        }
        
        # Check for sacred elements
        sacred_elements = sensitivity.get("sacredElements", [])
        for element in elements:
            if any(sacred in element.lower() for sacred in sacred_elements):
                validation_result["consultationRequired"] = True
                validation_result["warnings"].append(
                    f"Element '{element}' may contain sacred cultural significance"
                )
        
        # Check validation rules
        validation_rules = await self.cultural_db.validation_rules.find({
            "philosophyId": philosophy_id
        }).to_list(length=None)
        
        for rule in validation_rules:
            trigger_conditions = rule.get("triggerConditions", {})
            
            # Check guest count threshold
            if "guestCount" in trigger_conditions:
                threshold = trigger_conditions["guestCount"].get("$gt", 0)
                if guest_count > threshold:
                    validation_result["consultationRequired"] = True
                    validation_result["warnings"].append(rule.get("message", ""))
        
        return validation_result
    
    async def get_cultural_recommendations(
        self, 
        philosophy_id: str, 
        event_type: str,
        budget_range: str,
        guest_count: int,
        season: str = "spring"
    ) -> Dict[str, Any]:
        """Get AI-powered cultural recommendations"""
        if not self.cultural_db:
            success = await self.initialize()
            if not success:
                return self._get_fallback_recommendations(philosophy_id)
        
        try:
            # Get philosophy and elements
            philosophy = await self.get_philosophy(philosophy_id)
            design_elements = await self.get_design_elements(philosophy_id)
            event_apps = await self.cultural_db.event_applications.find({
                "philosophyId": philosophy_id
            }).to_list(length=None)
            
            if not philosophy:
                return self._get_fallback_recommendations(philosophy_id)
        except Exception as e:
            logger.warning(f"Error fetching cultural data: {e}")
            return self._get_fallback_recommendations(philosophy_id)
        
        recommendations = {
            "philosophy": {
                "name": philosophy.get("name", {}),
                "coreValues": philosophy.get("coreValues", []),
                "description": philosophy.get("description", "")
            },
            "colorPalette": [],
            "materials": [],
            "spatialGuidance": {},
            "culturalProtocols": [],
            "budgetGuidance": {},
            "seasonalConsiderations": {},
            "warnings": []
        }
        
        # Extract color recommendations
        for element in design_elements:
            if element.get("elementType") == "colorPalette":
                colors = element.get("colors", [])
                for color in colors:
                    if season in color.get("seasonality", []) or "all" in color.get("seasonality", []):
                        recommendations["colorPalette"].append({
                            "name": color.get("name"),
                            "hex": color.get("hex"),
                            "meaning": color.get("culturalMeaning"),
                            "usage": color.get("usage", [])
                        })
        
        # Extract material recommendations
        for element in design_elements:
            if element.get("elementType") == "materials":
                materials = element.get("materials", [])
                for material in materials:
                    recommendations["materials"].append({
                        "name": material.get("name"),
                        "properties": material.get("properties", {}),
                        "significance": material.get("culturalSignificance", ""),
                        "sustainability": material.get("properties", {}).get("sustainabilityRating", 0)
                    })
        
        # Extract spatial and protocol guidance from event applications
        for app in event_apps:
            if app.get("eventType") == event_type or event_type in app.get("appropriateFor", []):
                recommendations["spatialGuidance"] = app.get("spatialRequirements", {})
                recommendations["culturalProtocols"] = app.get("culturalProtocols", [])
                recommendations["budgetGuidance"] = app.get("budget", {})
                
                # Check seasonal considerations
                seasonal_data = app.get("seasonalConsiderations", {})
                if season in seasonal_data:
                    recommendations["seasonalConsiderations"] = seasonal_data[season]
        
        # Add cultural sensitivity warnings
        sensitivity = philosophy.get("culturalSensitivity", {})
        if sensitivity.get("level") in ["high", "highest"]:
            recommendations["warnings"].extend(
                sensitivity.get("appropriationConcerns", [])
            )
        
        return recommendations
    
    async def check_fusion_compatibility(
        self, 
        primary_philosophy: str, 
        secondary_philosophy: str
    ) -> Dict[str, Any]:
        """Check compatibility between two cultural philosophies for fusion events"""
        if not self.cultural_db:
            await self.initialize()
        
        # Check direct compatibility
        compatibility = await self.cultural_db.fusion_compatibility.find_one({
            "primaryPhilosophy": primary_philosophy,
            "secondaryPhilosophy": secondary_philosophy
        })
        
        # Check reverse compatibility if not found
        if not compatibility:
            compatibility = await self.cultural_db.fusion_compatibility.find_one({
                "primaryPhilosophy": secondary_philosophy,
                "secondaryPhilosophy": primary_philosophy
            })
        
        if not compatibility:
            return {
                "compatible": False,
                "level": "unknown",
                "reason": "No compatibility data available",
                "consultationRequired": True,
                "warnings": ["Unknown compatibility - expert consultation recommended"]
            }
        
        return {
            "compatible": compatibility.get("compatibilityLevel") in ["high", "medium"],
            "level": compatibility.get("compatibilityLevel"),
            "reason": compatibility.get("reason"),
            "bridgeElements": compatibility.get("bridgeElements", []),
            "consultationRequired": compatibility.get("consultationRequired", True),
            "warnings": compatibility.get("warnings", []),
            "successfulExamples": compatibility.get("successfulExamples", [])
        }
    
    async def get_cultural_vendors(
        self, 
        philosophy_id: str, 
        location: Optional[Dict[str, float]] = None,
        max_distance_km: float = 100.0
    ) -> List[Dict[str, Any]]:
        """Get verified vendors for a cultural philosophy"""
        if not self.cultural_db:
            await self.initialize()
        
        query = {"philosophies": philosophy_id}
        
        # Add geospatial query if location provided
        if location:
            query["location"] = {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [location["longitude"], location["latitude"]]
                    },
                    "$maxDistance": max_distance_km * 1000  # Convert to meters
                }
            }
        
        cursor = self.cultural_db.vendors.find(query)
        vendors = await cursor.to_list(length=None)
        
        # Sort by verification level
        verification_order = {
            "certified-authentic": 1,
            "expert-verified": 2,
            "community-approved": 3,
            "pending-review": 4
        }
        
        vendors.sort(key=lambda x: verification_order.get(x.get("verificationLevel"), 5))
        return vendors
    
    async def get_cultural_expert(self, philosophy_id: str) -> Optional[Dict[str, Any]]:
        """Get cultural expert for consultation"""
        if not self.cultural_db:
            await self.initialize()
        
        expert = await self.cultural_db.cultural_experts.find_one({
            "expertise": {"$in": [philosophy_id]}
        })
        return expert
    
    async def log_cultural_usage(
        self,
        philosophy_id: str,
        event_type: str,
        elements_used: List[str],
        user_id: Optional[str] = None,
        success: bool = True
    ):
        """Log cultural usage for monitoring and improvement"""
        if not self.cultural_db:
            await self.initialize()
        
        usage_log = {
            "timestamp": datetime.now(),
            "philosophyId": philosophy_id,
            "eventType": event_type,
            "elementsUsed": elements_used,
            "userId": user_id,
            "success": success,
            "source": "ai-event-visualization"
        }
        
        await self.cultural_db.usage_logs.insert_one(usage_log)
    
    async def get_seasonal_recommendations(
        self, 
        philosophy_id: str, 
        current_season: str
    ) -> Dict[str, Any]:
        """Get season-specific cultural recommendations"""
        if not self.cultural_db:
            await self.initialize()
        
        # Get elements with seasonal considerations
        elements = await self.get_design_elements(philosophy_id)
        seasonal_recs = {
            "colors": [],
            "materials": [],
            "activities": [],
            "cultural_significance": {}
        }
        
        for element in elements:
            if element.get("elementType") == "colorPalette":
                colors = element.get("colors", [])
                for color in colors:
                    seasonality = color.get("seasonality", [])
                    if current_season in seasonality or "all" in seasonality:
                        seasonal_recs["colors"].append({
                            "name": color.get("name"),
                            "hex": color.get("hex"),
                            "meaning": color.get("culturalMeaning")
                        })
        
        # Get seasonal event applications
        event_apps = await self.cultural_db.event_applications.find({
            "philosophyId": philosophy_id
        }).to_list(length=None)
        
        for app in event_apps:
            seasonal_considerations = app.get("seasonalConsiderations", {})
            if current_season in seasonal_considerations:
                seasonal_data = seasonal_considerations[current_season]
                seasonal_recs["cultural_significance"] = seasonal_data
        
        return seasonal_recs
    
    def _get_fallback_philosophy(self, philosophy_id: str) -> Optional[Dict[str, Any]]:
        """Get fallback philosophy data when database is unavailable"""
        fallback_philosophies = {
            "wabi-sabi": {
                "_id": "fallback",
                "philosophyId": "wabi-sabi",
                "name": {"en": "Wabi-Sabi", "native": "侘び寂び"},
                "coreValues": ["imperfection", "impermanence", "natural beauty"],
                "description": "Finding beauty in imperfection and impermanence",
                "culturalSensitivity": {
                    "level": "high",
                    "consultationRequired": True,
                    "sacredElements": ["tea ceremony items"]
                }
            },
            "hygge": {
                "_id": "fallback",
                "philosophyId": "hygge",
                "name": {"en": "Hygge", "native": "Hygge"},
                "coreValues": ["coziness", "togetherness", "comfort"],
                "description": "Creating cozy togetherness and comfortable conviviality",
                "culturalSensitivity": {
                    "level": "medium",
                    "consultationRequired": False,
                    "sacredElements": []
                }
            },
            "modern-contemporary": {
                "_id": "fallback",
                "philosophyId": "modern-contemporary",
                "name": {"en": "Modern Contemporary", "native": "Modern Contemporary"},
                "coreValues": ["functionality", "minimalism", "innovation"],
                "description": "Form follows function with sustainable design",
                "culturalSensitivity": {
                    "level": "low",
                    "consultationRequired": False,
                    "sacredElements": []
                }
            }
        }
        return fallback_philosophies.get(philosophy_id)
    
    def _get_fallback_philosophies(self) -> List[Dict[str, Any]]:
        """Get all fallback philosophies when database is unavailable"""
        return [
            {
                "_id": "fallback-1",
                "philosophyId": "wabi-sabi",
                "name": {"en": "Wabi-Sabi", "native": "侘び寂び"},
                "coreValues": ["imperfection", "impermanence", "natural beauty"],
                "description": "Finding beauty in imperfection and impermanence",
                "culturalSensitivity": {"level": "high", "consultationRequired": True}
            },
            {
                "_id": "fallback-2",
                "philosophyId": "hygge",
                "name": {"en": "Hygge", "native": "Hygge"},
                "coreValues": ["coziness", "togetherness", "comfort"],
                "description": "Creating cozy togetherness and comfortable conviviality",
                "culturalSensitivity": {"level": "medium", "consultationRequired": False}
            },
            {
                "_id": "fallback-3",
                "philosophyId": "modern-contemporary",
                "name": {"en": "Modern Contemporary", "native": "Modern Contemporary"},
                "coreValues": ["functionality", "minimalism", "innovation"],
                "description": "Form follows function with sustainable design",
                "culturalSensitivity": {"level": "low", "consultationRequired": False}
            }
        ]
    
    def _get_fallback_recommendations(self, philosophy_id: str) -> Dict[str, Any]:
        """Get fallback recommendations when database is unavailable"""
        return {
            "philosophy": self._get_fallback_philosophy(philosophy_id) or {"name": {"en": "Unknown"}, "coreValues": []},
            "colorPalette": [
                {"name": "Neutral White", "hex": "#F5F5F5", "meaning": "simplicity", "usage": ["walls", "textiles"]},
                {"name": "Warm Gray", "hex": "#9E9E9E", "meaning": "balance", "usage": ["accents", "furniture"]}
            ],
            "materials": [
                {"name": "Natural Wood", "properties": {"sustainability": 4}, "significance": "warmth and nature"}
            ],
            "spatialGuidance": {"layout": "open", "lighting": "natural"},
            "culturalProtocols": [],
            "budgetGuidance": {"low": 500, "medium": 1500, "high": 5000},
            "seasonalConsiderations": {},
            "warnings": ["Cultural database unavailable - using fallback recommendations"]
        }
    
    async def _initialize_cultural_database(self):
        """Initialize the cultural database with default data"""
        try:
            # Create philosophies
            philosophies_data = [
                {
                    "philosophyId": "wabi-sabi",
                    "name": {"en": "Wabi-Sabi", "native": "侘び寂び"},
                    "origin": {
                        "country": "Japan",
                        "region": "Multiple",
                        "historicalPeriod": "15th-16th century"
                    },
                    "coreValues": ["imperfection", "impermanence", "incompleteness"],
                    "description": "Finding beauty in imperfection, impermanence, and incompleteness",
                    "culturalSensitivity": {
                        "level": "high",
                        "sacredElements": ["tea ceremony items", "tokonoma alcoves"],
                        "consultationRequired": True,
                        "appropriationConcerns": ["superficial use of terms", "decorative misuse"]
                    },
                    "compatibleWith": ["hygge", "modern-minimal"],
                    "lastUpdated": datetime.now(),
                    "validationStatus": "expert-reviewed"
                },
                {
                    "philosophyId": "hygge",
                    "name": {"en": "Hygge", "native": "Hygge"},
                    "origin": {
                        "country": "Denmark",
                        "region": "Scandinavia",
                        "historicalPeriod": "Traditional"
                    },
                    "coreValues": ["coziness", "togetherness", "comfort"],
                    "description": "Creating cozy togetherness and comfortable conviviality",
                    "culturalSensitivity": {
                        "level": "medium",
                        "consultationRequired": False,
                        "appropriationConcerns": ["commercializing beyond surface coziness"]
                    },
                    "compatibleWith": ["wabi-sabi", "modern-sustainable"],
                    "lastUpdated": datetime.now(),
                    "validationStatus": "expert-reviewed"
                },
                {
                    "philosophyId": "modern-contemporary",
                    "name": {"en": "Modern Contemporary", "native": "Modern Contemporary"},
                    "origin": {
                        "country": "International",
                        "region": "Global",
                        "historicalPeriod": "20th century to present"
                    },
                    "coreValues": ["functionality", "minimalism", "innovation", "sustainability"],
                    "description": "Form follows function, emphasizing minimalism and sustainability",
                    "culturalSensitivity": {
                        "level": "low",
                        "consultationRequired": False,
                        "appropriationConcerns": ["creating sterile environments"]
                    },
                    "compatibleWith": ["wabi-sabi", "hygge"],
                    "lastUpdated": datetime.now(),
                    "validationStatus": "expert-reviewed"
                }
            ]
            
            await self.cultural_db.philosophies.insert_many(philosophies_data)
            logger.info(f"Created {len(philosophies_data)} philosophies")
            
            # Create design elements
            design_elements_data = [
                {
                    "philosophyId": "wabi-sabi",
                    "elementType": "colorPalette",
                    "name": "Earth Tones",
                    "colors": [
                        {
                            "name": "Soft Lavender",
                            "hex": "#ddccff",
                            "rgb": [221, 204, 255],
                            "culturalMeaning": "transience, subtle beauty",
                            "usage": ["textiles", "accent walls"],
                            "seasonality": ["all"]
                        }
                    ]
                },
                {
                    "philosophyId": "hygge",
                    "elementType": "colorPalette",
                    "name": "Warm Neutrals",
                    "colors": [
                        {
                            "name": "Cotton White",
                            "hex": "#F0F0F0",
                            "rgb": [240, 240, 240],
                            "culturalMeaning": "comfort, simplicity",
                            "usage": ["walls", "linens"],
                            "seasonality": ["all"]
                        }
                    ]
                },
                {
                    "philosophyId": "modern-contemporary",
                    "elementType": "colorPalette",
                    "name": "Monochromatic",
                    "colors": [
                        {
                            "name": "Pure White",
                            "hex": "#FFFFFF",
                            "rgb": [255, 255, 255],
                            "culturalMeaning": "clarity, minimalism",
                            "usage": ["walls", "surfaces"],
                            "seasonality": ["all"]
                        }
                    ]
                }
            ]
            
            await self.cultural_db.design_elements.insert_many(design_elements_data)
            logger.info(f"Created {len(design_elements_data)} design elements")
            
            # Create indexes
            await self.cultural_db.philosophies.create_index([("philosophyId", 1)])
            await self.cultural_db.design_elements.create_index([("philosophyId", 1), ("elementType", 1)])
            logger.info("Created indexes for performance")
            
        except Exception as e:
            logger.error(f"Error initializing cultural database: {e}")
            raise

# Global service instance
cultural_service = CulturalService()