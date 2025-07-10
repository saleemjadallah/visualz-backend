from typing import List, Dict, Any, Optional
import logging
from bson import ObjectId
from app.services.database import get_database
from app.models.cultural import (
    CulturalElement, CulturalElementCreate, CulturalElementInDB,
    CulturalValidationRequest, CulturalValidationResult,
    CulturalGuideline, CulturalFusionRule
)
from app.services.cultural_categorization import (
    CulturalCategorizationService, CulturalCategory, SacredLevel, EventContext
)

logger = logging.getLogger(__name__)

class CulturalService:
    def __init__(self):
        self.db = get_database()
        self.categorization_service = CulturalCategorizationService()
    
    async def get_cultural_elements(
        self, 
        culture: Optional[str] = None,
        category: Optional[str] = None,
        verified_only: bool = False
    ) -> List[CulturalElement]:
        """Get cultural elements with optional filtering."""
        try:
            query = {}
            
            if culture:
                query["culture"] = {"$regex": culture, "$options": "i"}
            
            if category:
                query["category"] = category
                
            if verified_only:
                query["is_verified"] = True
            
            cursor = self.db.cultural_elements.find(query)
            elements = []
            
            async for doc in cursor:
                element = CulturalElement(
                    id=str(doc["_id"]),
                    **{k: v for k, v in doc.items() if k != "_id"}
                )
                elements.append(element)
            
            return elements
            
        except Exception as e:
            logger.error(f"Error fetching cultural elements: {e}")
            return []
    
    async def get_cultural_element_by_id(self, element_id: str) -> Optional[CulturalElement]:
        """Get a specific cultural element by ID."""
        try:
            doc = await self.db.cultural_elements.find_one({"_id": ObjectId(element_id)})
            if doc:
                return CulturalElement(
                    id=str(doc["_id"]),
                    **{k: v for k, v in doc.items() if k != "_id"}
                )
            return None
            
        except Exception as e:
            logger.error(f"Error fetching cultural element {element_id}: {e}")
            return None
    
    async def create_cultural_element(
        self, 
        element_data: CulturalElementCreate, 
        created_by: Optional[str] = None
    ) -> CulturalElement:
        """Create a new cultural element."""
        try:
            element_doc = CulturalElementInDB(
                **element_data.dict(),
                created_by=ObjectId(created_by) if created_by else None
            )
            
            result = await self.db.cultural_elements.insert_one(
                element_doc.dict(by_alias=True, exclude={"id"})
            )
            
            return CulturalElement(
                id=str(result.inserted_id),
                **element_data.dict(),
                created_at=element_doc.created_at,
                updated_at=element_doc.updated_at,
                created_by=created_by
            )
            
        except Exception as e:
            logger.error(f"Error creating cultural element: {e}")
            raise Exception(f"Failed to create cultural element: {str(e)}")
    
    async def validate_cultural_appropriateness(
        self, 
        request: CulturalValidationRequest
    ) -> CulturalValidationResult:
        """Validate design elements for cultural appropriateness."""
        try:
            # Get relevant cultural elements from database
            elements = await self.get_cultural_elements(
                culture=request.primary_culture,
                verified_only=True
            )
            
            # Add secondary cultures
            for culture in request.secondary_cultures:
                secondary_elements = await self.get_cultural_elements(
                    culture=culture,
                    verified_only=True
                )
                elements.extend(secondary_elements)
            
            # Perform validation logic
            validation_result = await self._perform_validation(request, elements)
            
            return validation_result
            
        except Exception as e:
            logger.error(f"Error validating cultural appropriateness: {e}")
            return CulturalValidationResult(
                sensitivity_score=5,
                overall_status="needs_review",
                recommendations=["Manual cultural expert review required due to validation error"],
                disclaimer_text="This design has not been validated for cultural appropriateness. Please consult with cultural experts before implementation."
            )
    
    async def _perform_validation(
        self, 
        request: CulturalValidationRequest, 
        cultural_elements: List[CulturalElement]
    ) -> CulturalValidationResult:
        """Perform the actual validation logic."""
        validated_elements = []
        flagged_elements = []
        recommendations = []
        consultation_required = []
        sensitivity_score = 10  # Start with perfect score
        
        # Check each design element against cultural database
        for design_element in request.design_elements:
            element_status = await self._validate_single_element(
                design_element, 
                request, 
                cultural_elements
            )
            
            if element_status["status"] == "approved":
                validated_elements.append(element_status)
            elif element_status["status"] == "flagged":
                flagged_elements.append(element_status)
                sensitivity_score -= element_status.get("severity_impact", 1)
            elif element_status["status"] == "consultation_required":
                consultation_required.append(design_element)
                sensitivity_score -= 2
        
        # Check for cultural fusion conflicts
        if len(request.secondary_cultures) > 0:
            fusion_analysis = await self._analyze_cultural_fusion(
                request.primary_culture,
                request.secondary_cultures,
                cultural_elements
            )
            recommendations.extend(fusion_analysis["recommendations"])
            sensitivity_score -= fusion_analysis.get("conflict_penalty", 0)
        
        # Determine overall status
        sensitivity_score = max(1, min(10, sensitivity_score))
        
        if sensitivity_score >= 8 and len(flagged_elements) == 0:
            overall_status = "approved"
        elif sensitivity_score >= 6:
            overall_status = "needs_review"
        else:
            overall_status = "rejected"
        
        # Generate disclaimer text
        disclaimer_text = self._generate_disclaimer(
            request.primary_culture,
            overall_status,
            len(flagged_elements) > 0
        )
        
        return CulturalValidationResult(
            sensitivity_score=sensitivity_score,
            overall_status=overall_status,
            validated_elements=validated_elements,
            flagged_elements=flagged_elements,
            recommendations=recommendations,
            consultation_required=consultation_required,
            disclaimer_text=disclaimer_text
        )
    
    async def _validate_single_element(
        self, 
        design_element: str, 
        request: CulturalValidationRequest,
        cultural_elements: List[CulturalElement]
    ) -> Dict[str, Any]:
        """Validate a single design element."""
        # Find matching cultural elements
        matching_elements = [
            elem for elem in cultural_elements 
            if design_element.lower() in elem.name.lower() or
               design_element.lower() in [tag.lower() for tag in elem.patterns + elem.materials]
        ]
        
        if not matching_elements:
            return {
                "element": design_element,
                "status": "approved",
                "note": "No specific cultural restrictions found"
            }
        
        # Check most restrictive element
        most_restrictive = max(
            matching_elements,
            key=lambda x: {"low": 1, "medium": 2, "high": 3, "sacred": 4}[x.sacred_level]
        )
        
        # Check context appropriateness
        if request.event_type.lower() in [ctx.lower() for ctx in most_restrictive.inappropriate_contexts]:
            return {
                "element": design_element,
                "status": "flagged",
                "reason": f"Inappropriate for {request.event_type} events",
                "cultural_element": most_restrictive.name,
                "severity_impact": 3,
                "recommendations": most_restrictive.usage_guidelines
            }
        
        # Check if community permission required
        if most_restrictive.community_permission_required:
            return {
                "element": design_element,
                "status": "consultation_required",
                "reason": "Requires community elder consultation",
                "cultural_element": most_restrictive.name
            }
        
        # Check sacred level
        if most_restrictive.sacred_level in ["high", "sacred"]:
            return {
                "element": design_element,
                "status": "flagged",
                "reason": f"High sacred significance ({most_restrictive.sacred_level} level)",
                "cultural_element": most_restrictive.name,
                "severity_impact": 2,
                "recommendations": ["Consider alternative elements", "Consult cultural expert"]
            }
        
        return {
            "element": design_element,
            "status": "approved",
            "cultural_element": most_restrictive.name,
            "usage_guidelines": most_restrictive.usage_guidelines
        }
    
    async def _analyze_cultural_fusion(
        self, 
        primary_culture: str, 
        secondary_cultures: List[str],
        cultural_elements: List[CulturalElement]
    ) -> Dict[str, Any]:
        """Analyze potential conflicts in cultural fusion."""
        recommendations = []
        conflict_penalty = 0
        
        # Check for known problematic combinations
        problematic_pairs = [
            ("sacred", "decorative"),
            ("funeral", "celebration"),
            ("religious", "secular")
        ]
        
        # This is a simplified fusion analysis
        # In production, this would use the CulturalFusionRule model
        for secondary in secondary_cultures:
            recommendations.append(
                f"When combining {primary_culture} and {secondary} elements, "
                f"ensure respectful representation of both cultures"
            )
        
        if len(secondary_cultures) > 2:
            recommendations.append(
                "Consider limiting to 2-3 cultural influences to maintain authenticity"
            )
            conflict_penalty += 1
        
        return {
            "recommendations": recommendations,
            "conflict_penalty": conflict_penalty
        }
    
    def _generate_disclaimer(
        self, 
        primary_culture: str, 
        status: str, 
        has_flagged_elements: bool
    ) -> str:
        """Generate appropriate disclaimer text."""
        base_disclaimer = (
            f"CULTURAL SENSITIVITY NOTICE: This design incorporates elements from {primary_culture} culture. "
            f"This is a preliminary assessment based on general cultural knowledge. "
        )
        
        if status == "approved" and not has_flagged_elements:
            return base_disclaimer + (
                "No immediate cultural concerns identified, but we recommend consulting with "
                "cultural experts and community members for final validation before implementation."
            )
        elif status == "needs_review":
            return base_disclaimer + (
                "Some elements require additional review. Please consult with cultural experts "
                "and consider alternative approaches for flagged elements."
            )
        else:  # rejected
            return base_disclaimer + (
                "This design contains elements that may be culturally inappropriate. "
                "Significant modifications and expert consultation are required before implementation."
            )
    
    async def get_cultural_guidelines(self, culture: str) -> List[CulturalGuideline]:
        """Get cultural guidelines for a specific culture."""
        try:
            cursor = self.db.cultural_guidelines.find({"culture": culture})
            guidelines = []
            
            async for doc in cursor:
                guideline = CulturalGuideline(**doc)
                guidelines.append(guideline)
            
            return guidelines
            
        except Exception as e:
            logger.error(f"Error fetching cultural guidelines for {culture}: {e}")
            return []
    
    async def suggest_cultural_alternatives(
        self, 
        flagged_element: str, 
        target_culture: str,
        category: str
    ) -> List[Dict[str, Any]]:
        """Suggest culturally appropriate alternatives for flagged elements."""
        try:
            # Find appropriate elements in the same category
            appropriate_elements = await self.get_cultural_elements(
                culture=target_culture,
                category=category,
                verified_only=True
            )
            
            # Filter for low/medium sacred level
            safe_elements = [
                elem for elem in appropriate_elements
                if elem.sacred_level in ["low", "medium"] and
                not elem.community_permission_required
            ]
            
            alternatives = []
            for elem in safe_elements[:5]:  # Limit to top 5 suggestions
                alternatives.append({
                    "name": elem.name,
                    "description": elem.description,
                    "usage_guidelines": elem.usage_guidelines,
                    "colors": elem.colors,
                    "materials": elem.materials
                })
            
            return alternatives
            
        except Exception as e:
            logger.error(f"Error suggesting alternatives: {e}")
            return []