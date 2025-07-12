"""MongoDB Cultural Database Service for DesignVisualz"""
from typing import List, Dict, Any, Optional
import pymongo
from pymongo import MongoClient
from bson import ObjectId
import logging
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)

class MongoDBCulturalDatabase:
    def __init__(self, connection_string: str = None):
        """Initialize MongoDB connection for cultural database"""
        try:
            # Use provided connection string or default from settings
            conn_str = connection_string or settings.MONGODB_URL
            self.client = MongoClient(conn_str)
            self.db = self.client[settings.DATABASE_NAME]
            
            # Initialize collections
            self.cultural_elements = self.db["cultural_elements"]
            self.celebration_traditions = self.db["celebration_traditions"]
            self.vendor_database = self.db["vendor_database"]
            self.design_patterns = self.db["design_patterns"]
            self.color_meanings = self.db["color_meanings"]
            self.age_guidelines = self.db["age_guidelines"]
            self.cultural_validations = self.db["cultural_validations"]
            
            # Create indexes for better performance
            self._create_indexes()
            
            logger.info("MongoDB Cultural Database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB Cultural Database: {e}")
            raise

    def _create_indexes(self):
        """Create indexes for optimal query performance"""
        try:
            # Cultural elements indexes
            self.cultural_elements.create_index([("culture", 1), ("category", 1)])
            self.cultural_elements.create_index([("tags", 1)])
            
            # Celebration traditions indexes
            self.celebration_traditions.create_index([("culture", 1), ("event_type", 1)])
            self.celebration_traditions.create_index([("is_active", 1)])
            
            # Vendor database indexes
            self.vendor_database.create_index([("location.coordinates", "2dsphere")])
            self.vendor_database.create_index([("cultural_specialties", 1)])
            self.vendor_database.create_index([("rating", -1)])
            
            # Design patterns indexes
            self.design_patterns.create_index([("culture", 1), ("pattern_type", 1)])
            
            # Color meanings indexes
            self.color_meanings.create_index([("culture", 1), ("color", 1)])
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Failed to create some indexes: {e}")

    def get_cultural_elements(self, culture: str, event_type: str = None, 
                            category: str = None) -> List[Dict[str, Any]]:
        """Fetch cultural elements based on culture and optional filters"""
        try:
            query = {"culture": culture}
            if event_type:
                query["suitable_events"] = event_type
            if category:
                query["category"] = category
            
            elements = list(self.cultural_elements.find(query))
            
            # Convert ObjectId to string for JSON serialization
            for element in elements:
                element["_id"] = str(element["_id"])
            
            return elements
        except Exception as e:
            logger.error(f"Error fetching cultural elements: {e}")
            return []

    def get_celebration_traditions(self, culture: str, event_type: str, 
                                 age_group: str = None) -> List[Dict[str, Any]]:
        """Fetch celebration traditions for specific culture and event type"""
        try:
            query = {
                "culture": culture,
                "event_type": event_type,
                "is_active": True
            }
            
            if age_group:
                query["$or"] = [
                    {"age_groups": age_group},
                    {"age_groups": "all"}
                ]
            
            traditions = list(self.celebration_traditions.find(query))
            
            # Sort by importance/relevance
            traditions.sort(key=lambda x: x.get("importance_score", 0), reverse=True)
            
            # Convert ObjectId to string
            for tradition in traditions:
                tradition["_id"] = str(tradition["_id"])
            
            return traditions
        except Exception as e:
            logger.error(f"Error fetching celebration traditions: {e}")
            return []

    def get_age_appropriate_guidelines(self, age_group: str, event_type: str, 
                                     culture: str = None) -> Dict[str, Any]:
        """Get age-appropriate design guidelines"""
        try:
            query = {
                "age_group": age_group,
                "event_type": event_type
            }
            
            if culture:
                query["$or"] = [
                    {"culture": culture},
                    {"culture": "universal"}
                ]
            
            guidelines = list(self.age_guidelines.find(query))
            
            # Merge universal and culture-specific guidelines
            merged_guidelines = {
                "safety_considerations": [],
                "recommended_activities": [],
                "design_recommendations": [],
                "avoid_elements": [],
                "accessibility_notes": []
            }
            
            for guideline in guidelines:
                for key in merged_guidelines:
                    if key in guideline:
                        merged_guidelines[key].extend(guideline[key])
            
            # Remove duplicates
            for key in merged_guidelines:
                merged_guidelines[key] = list(set(merged_guidelines[key]))
            
            return merged_guidelines
        except Exception as e:
            logger.error(f"Error fetching age guidelines: {e}")
            return {}

    def validate_cultural_appropriateness(self, design_elements: List[str], 
                                        culture: str, event_context: str) -> Dict[str, Any]:
        """Validate if design elements are culturally appropriate"""
        try:
            # Check for restricted elements
            restricted_query = {
                "culture": culture,
                "restricted_elements": {"$in": design_elements}
            }
            
            restrictions = list(self.cultural_validations.find(restricted_query))
            
            # Check for required elements
            required_query = {
                "culture": culture,
                "event_type": event_context,
                "required_elements": {"$exists": True}
            }
            
            requirements = list(self.cultural_validations.find(required_query))
            
            # Analyze results
            validation_result = {
                "is_appropriate": True,
                "warnings": [],
                "suggestions": [],
                "restricted_elements": [],
                "missing_required": []
            }
            
            # Process restrictions
            for restriction in restrictions:
                for element in design_elements:
                    if element in restriction.get("restricted_elements", []):
                        validation_result["is_appropriate"] = False
                        validation_result["restricted_elements"].append({
                            "element": element,
                            "reason": restriction.get("reason", "Cultural restriction"),
                            "severity": restriction.get("severity", "high")
                        })
                        validation_result["warnings"].append(
                            f"{element} is restricted in {culture} culture: {restriction.get('reason', '')}"
                        )
            
            # Process requirements
            for requirement in requirements:
                required_elements = requirement.get("required_elements", [])
                missing = [elem for elem in required_elements if elem not in design_elements]
                
                if missing:
                    validation_result["missing_required"].extend(missing)
                    validation_result["suggestions"].append(
                        f"Consider adding: {', '.join(missing)} for authentic {culture} {event_context}"
                    )
            
            # Add cultural sensitivity score
            total_elements = len(design_elements)
            problematic_elements = len(validation_result["restricted_elements"])
            validation_result["cultural_sensitivity_score"] = max(
                0, (total_elements - problematic_elements) / total_elements
            ) if total_elements > 0 else 1.0
            
            return validation_result
        except Exception as e:
            logger.error(f"Error validating cultural appropriateness: {e}")
            return {
                "is_appropriate": True,
                "warnings": ["Unable to validate cultural appropriateness"],
                "suggestions": [],
                "cultural_sensitivity_score": 0.5
            }

    def get_vendor_recommendations(self, culture: str, event_type: str, 
                                 location: Dict[str, float] = None, 
                                 budget_tier: str = "medium") -> List[Dict[str, Any]]:
        """Get culturally appropriate vendor recommendations"""
        try:
            query = {
                "cultural_specialties": culture,
                "event_types": event_type,
                "budget_tiers": budget_tier,
                "is_active": True
            }
            
            # Add location-based filtering if coordinates provided
            if location and "latitude" in location and "longitude" in location:
                # Find vendors within 50km radius
                query["location.coordinates"] = {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [location["longitude"], location["latitude"]]
                        },
                        "$maxDistance": 50000  # 50km in meters
                    }
                }
            
            vendors = list(self.vendor_database.find(query).limit(20))
            
            # Sort by rating and cultural expertise
            vendors.sort(key=lambda x: (
                x.get("cultural_expertise_score", 0) * 0.4 + 
                x.get("rating", 0) * 0.6
            ), reverse=True)
            
            # Convert ObjectId and format response
            formatted_vendors = []
            for vendor in vendors:
                formatted_vendors.append({
                    "id": str(vendor["_id"]),
                    "name": vendor.get("name"),
                    "type": vendor.get("vendor_type"),
                    "cultural_specialties": vendor.get("cultural_specialties", []),
                    "rating": vendor.get("rating", 0),
                    "price_range": vendor.get("price_range"),
                    "location": vendor.get("location", {}).get("address"),
                    "contact": vendor.get("contact", {}),
                    "portfolio_url": vendor.get("portfolio_url"),
                    "certifications": vendor.get("cultural_certifications", []),
                    "reviews_count": vendor.get("reviews_count", 0)
                })
            
            return formatted_vendors
        except Exception as e:
            logger.error(f"Error fetching vendor recommendations: {e}")
            return []

    def get_design_patterns(self, culture: str, pattern_type: str = None) -> List[Dict[str, Any]]:
        """Fetch cultural design patterns"""
        try:
            query = {"culture": culture}
            if pattern_type:
                query["pattern_type"] = pattern_type
            
            patterns = list(self.design_patterns.find(query))
            
            # Convert ObjectId and include usage guidelines
            formatted_patterns = []
            for pattern in patterns:
                formatted_patterns.append({
                    "id": str(pattern["_id"]),
                    "name": pattern.get("name"),
                    "type": pattern.get("pattern_type"),
                    "description": pattern.get("description"),
                    "cultural_significance": pattern.get("cultural_significance"),
                    "usage_guidelines": pattern.get("usage_guidelines", []),
                    "suitable_events": pattern.get("suitable_events", []),
                    "color_combinations": pattern.get("color_combinations", []),
                    "modern_adaptations": pattern.get("modern_adaptations", []),
                    "restrictions": pattern.get("restrictions", [])
                })
            
            return formatted_patterns
        except Exception as e:
            logger.error(f"Error fetching design patterns: {e}")
            return []

    def get_color_meanings(self, culture: str) -> Dict[str, Any]:
        """Get cultural color meanings and associations"""
        try:
            color_docs = list(self.color_meanings.find({"culture": culture}))
            
            color_guide = {
                "auspicious_colors": [],
                "neutral_colors": [],
                "colors_to_avoid": [],
                "color_meanings": {},
                "event_specific_colors": {}
            }
            
            for doc in color_docs:
                color = doc.get("color")
                meaning = doc.get("meaning", {})
                
                # Categorize colors
                if doc.get("is_auspicious"):
                    color_guide["auspicious_colors"].append(color)
                elif doc.get("is_neutral"):
                    color_guide["neutral_colors"].append(color)
                elif doc.get("should_avoid"):
                    color_guide["colors_to_avoid"].append(color)
                
                # Add meanings
                color_guide["color_meanings"][color] = meaning
                
                # Add event-specific usage
                if "event_usage" in doc:
                    for event, usage in doc["event_usage"].items():
                        if event not in color_guide["event_specific_colors"]:
                            color_guide["event_specific_colors"][event] = {}
                        color_guide["event_specific_colors"][event][color] = usage
            
            return color_guide
        except Exception as e:
            logger.error(f"Error fetching color meanings: {e}")
            return {}

    def search_cultural_elements(self, search_query: str, culture: str = None, 
                                limit: int = 20) -> List[Dict[str, Any]]:
        """Search cultural elements with text search"""
        try:
            # Create text search query
            query = {"$text": {"$search": search_query}}
            if culture:
                query["culture"] = culture
            
            # Ensure text index exists
            self.cultural_elements.create_index([("name", "text"), ("description", "text"), ("tags", "text")])
            
            results = list(self.cultural_elements.find(
                query,
                {"score": {"$meta": "textScore"}}
            ).sort([("score", {"$meta": "textScore"})]).limit(limit))
            
            # Format results
            formatted_results = []
            for result in results:
                formatted_results.append({
                    "id": str(result["_id"]),
                    "name": result.get("name"),
                    "culture": result.get("culture"),
                    "category": result.get("category"),
                    "description": result.get("description"),
                    "relevance_score": result.get("score", 0)
                })
            
            return formatted_results
        except Exception as e:
            logger.error(f"Error searching cultural elements: {e}")
            return []

    def add_cultural_validation_log(self, design_id: str, validation_result: Dict[str, Any], 
                                   user_id: str = None) -> bool:
        """Log cultural validation results for analytics and improvement"""
        try:
            log_entry = {
                "design_id": design_id,
                "user_id": user_id,
                "validation_result": validation_result,
                "timestamp": datetime.utcnow(),
                "feedback_received": False
            }
            
            self.db["validation_logs"].insert_one(log_entry)
            return True
        except Exception as e:
            logger.error(f"Error logging validation: {e}")
            return False

    def close(self):
        """Close MongoDB connection"""
        if hasattr(self, 'client'):
            self.client.close()
            logger.info("MongoDB connection closed")