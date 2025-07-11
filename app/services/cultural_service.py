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
        self.db = await get_database()
        # Connect to cultural database
        client = self.db.client
        self.cultural_db = client['designvisualz_cultural']
        logger.info("Cultural service initialized")
    
    async def get_philosophy(self, philosophy_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific design philosophy"""
        if not self.cultural_db:
            await self.initialize()
        
        philosophy = await self.cultural_db.philosophies.find_one(
            {"philosophyId": philosophy_id}
        )
        return philosophy
    
    async def get_all_philosophies(self) -> List[Dict[str, Any]]:
        """Get all available design philosophies"""
        if not self.cultural_db:
            await self.initialize()
        
        cursor = self.cultural_db.philosophies.find({})
        philosophies = await cursor.to_list(length=None)
        return philosophies
    
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
            await self.initialize()
        
        # Get philosophy and elements
        philosophy = await self.get_philosophy(philosophy_id)
        design_elements = await self.get_design_elements(philosophy_id)
        event_apps = await self.cultural_db.event_applications.find({
            "philosophyId": philosophy_id
        }).to_list(length=None)
        
        if not philosophy:
            return {"error": "Philosophy not found"}
        
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

# Global service instance
cultural_service = CulturalService()