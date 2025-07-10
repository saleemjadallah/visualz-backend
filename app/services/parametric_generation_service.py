import json
import numpy as np
import trimesh
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from dataclasses import dataclass
from app.core.config import settings
import asyncio
import logging

logger = logging.getLogger(__name__)

class FurnitureType(Enum):
    CHAIR = "chair"
    TABLE = "table"
    SOFA = "sofa"
    BOOKSHELF = "bookshelf"
    DESK = "desk"
    BED = "bed"
    DRESSER = "dresser"
    COFFEE_TABLE = "coffee_table"

class CulturalStyle(Enum):
    FRENCH = "french"
    JAPANESE = "japanese"
    SCANDINAVIAN = "scandinavian"
    ITALIAN = "italian"
    MODERN = "modern"
    MINIMALIST = "minimalist"
    TRADITIONAL = "traditional"
    CONTEMPORARY = "contemporary"

class ExportFormat(Enum):
    GLTF = "gltf"
    GLB = "glb"
    OBJ = "obj"
    STL = "stl"

@dataclass
class ParametricParameters:
    dimensions: Dict[str, float]
    materials: Dict[str, str]
    colors: Dict[str, str]
    cultural_elements: Dict[str, Any]
    style_intensity: float = 1.0
    comfort_level: float = 1.0
    durability: float = 1.0

@dataclass
class ExportOptions:
    format: ExportFormat
    quality: str = "medium"
    cultural_metadata: bool = True
    include_materials: bool = True
    compress: bool = True

class ParametricGeometry:
    def __init__(self):
        self.vertices = []
        self.faces = []
        self.materials = {}
        self.metadata = {}

class ParametricChairTemplate:
    def __init__(self):
        self.base_dimensions = {
            "seat_width": 0.45,
            "seat_depth": 0.40,
            "seat_height": 0.45,
            "back_height": 0.85,
            "leg_thickness": 0.05
        }
    
    def generate_geometry(self, parameters: ParametricParameters) -> ParametricGeometry:
        """Generate procedural chair geometry based on parameters"""
        geometry = ParametricGeometry()
        
        # Apply cultural modifications
        dims = self._apply_cultural_style(parameters)
        
        # Generate seat
        seat_mesh = self._generate_seat(dims, parameters)
        
        # Generate backrest
        back_mesh = self._generate_backrest(dims, parameters)
        
        # Generate legs
        legs_mesh = self._generate_legs(dims, parameters)
        
        # Combine meshes
        combined_mesh = trimesh.util.concatenate([seat_mesh, back_mesh, legs_mesh])
        
        geometry.vertices = combined_mesh.vertices.tolist()
        geometry.faces = combined_mesh.faces.tolist()
        geometry.materials = self._generate_materials(parameters)
        geometry.metadata = self._generate_metadata(parameters)
        
        return geometry
    
    def _apply_cultural_style(self, parameters: ParametricParameters) -> Dict[str, float]:
        """Apply cultural design principles to base dimensions"""
        dims = self.base_dimensions.copy()
        
        cultural_style = parameters.cultural_elements.get("style", "modern")
        
        if cultural_style == "japanese":
            # Lower seating, more minimalist proportions
            dims["seat_height"] *= 0.8
            dims["leg_thickness"] *= 0.7
            dims["back_height"] *= 0.9
        elif cultural_style == "french":
            # Elegant proportions, refined details
            dims["seat_width"] *= 1.1
            dims["back_height"] *= 1.15
            dims["leg_thickness"] *= 0.8
        elif cultural_style == "scandinavian":
            # Clean lines, functional proportions
            dims["seat_depth"] *= 1.05
            dims["leg_thickness"] *= 0.9
        
        # Apply parameter scaling
        for key, value in parameters.dimensions.items():
            if key in dims:
                dims[key] *= value
        
        return dims
    
    def _generate_seat(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate seat geometry"""
        comfort = parameters.comfort_level
        
        # Base seat box
        seat_box = trimesh.creation.box(
            extents=[dims["seat_width"], dims["seat_depth"], 0.05]
        )
        
        # Add comfort padding if needed
        if comfort > 0.7:
            # Add slight curve for comfort
            seat_box = self._add_seat_curve(seat_box, comfort)
        
        # Position seat
        seat_box.apply_translation([0, 0, dims["seat_height"]])
        
        return seat_box
    
    def _generate_backrest(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate backrest geometry"""
        cultural_style = parameters.cultural_elements.get("style", "modern")
        
        if cultural_style == "japanese":
            # Minimalist vertical slats
            return self._generate_slat_back(dims, parameters)
        elif cultural_style == "french":
            # Ornate curved back
            return self._generate_curved_back(dims, parameters)
        else:
            # Standard rectangular back
            back_box = trimesh.creation.box(
                extents=[dims["seat_width"], 0.05, dims["back_height"] - dims["seat_height"]]
            )
            back_box.apply_translation([0, -dims["seat_depth"]/2, dims["back_height"]/2 + dims["seat_height"]/2])
            return back_box
    
    def _generate_legs(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate leg geometry"""
        cultural_style = parameters.cultural_elements.get("style", "modern")
        
        legs = []
        leg_positions = [
            [dims["seat_width"]/2 - dims["leg_thickness"]/2, dims["seat_depth"]/2 - dims["leg_thickness"]/2],
            [-dims["seat_width"]/2 + dims["leg_thickness"]/2, dims["seat_depth"]/2 - dims["leg_thickness"]/2],
            [dims["seat_width"]/2 - dims["leg_thickness"]/2, -dims["seat_depth"]/2 + dims["leg_thickness"]/2],
            [-dims["seat_width"]/2 + dims["leg_thickness"]/2, -dims["seat_depth"]/2 + dims["leg_thickness"]/2]
        ]
        
        for pos in leg_positions:
            if cultural_style == "japanese":
                # Tapered legs
                leg = self._generate_tapered_leg(dims, pos)
            elif cultural_style == "french":
                # Curved cabriole legs
                leg = self._generate_curved_leg(dims, pos)
            else:
                # Standard cylindrical legs
                leg = trimesh.creation.cylinder(
                    radius=dims["leg_thickness"]/2,
                    height=dims["seat_height"]
                )
                leg.apply_translation([pos[0], pos[1], dims["seat_height"]/2])
            
            legs.append(leg)
        
        return trimesh.util.concatenate(legs)
    
    def _add_seat_curve(self, seat_box: trimesh.Trimesh, comfort: float) -> trimesh.Trimesh:
        """Add subtle curve to seat for comfort"""
        # Simple implementation - in production would use more sophisticated curve generation
        return seat_box
    
    def _generate_slat_back(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate Japanese-style slat backrest"""
        slats = []
        num_slats = 5
        slat_width = dims["seat_width"] / (num_slats + 1)
        
        for i in range(num_slats):
            x_pos = -dims["seat_width"]/2 + (i + 1) * (dims["seat_width"] / (num_slats + 1))
            slat = trimesh.creation.box(
                extents=[slat_width * 0.6, 0.02, dims["back_height"] - dims["seat_height"]]
            )
            slat.apply_translation([x_pos, -dims["seat_depth"]/2, dims["back_height"]/2 + dims["seat_height"]/2])
            slats.append(slat)
        
        return trimesh.util.concatenate(slats)
    
    def _generate_curved_back(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate French-style curved backrest"""
        # Simplified curved back - in production would use proper curve generation
        back_box = trimesh.creation.box(
            extents=[dims["seat_width"], 0.05, dims["back_height"] - dims["seat_height"]]
        )
        back_box.apply_translation([0, -dims["seat_depth"]/2, dims["back_height"]/2 + dims["seat_height"]/2])
        return back_box
    
    def _generate_tapered_leg(self, dims: Dict[str, float], pos: List[float]) -> trimesh.Trimesh:
        """Generate Japanese-style tapered leg"""
        # Create tapered cylinder
        leg = trimesh.creation.cylinder(
            radius=dims["leg_thickness"]/2,
            height=dims["seat_height"]
        )
        
        # Apply tapering transformation
        vertices = leg.vertices
        for i, vertex in enumerate(vertices):
            taper_factor = 1.0 - (vertex[2] / dims["seat_height"]) * 0.3
            vertices[i][0] *= taper_factor
            vertices[i][1] *= taper_factor
        
        leg.vertices = vertices
        leg.apply_translation([pos[0], pos[1], dims["seat_height"]/2])
        return leg
    
    def _generate_curved_leg(self, dims: Dict[str, float], pos: List[float]) -> trimesh.Trimesh:
        """Generate French-style curved leg"""
        # Simplified curved leg - in production would use proper curve generation
        leg = trimesh.creation.cylinder(
            radius=dims["leg_thickness"]/2,
            height=dims["seat_height"]
        )
        leg.apply_translation([pos[0], pos[1], dims["seat_height"]/2])
        return leg
    
    def _generate_materials(self, parameters: ParametricParameters) -> Dict[str, Any]:
        """Generate material definitions"""
        materials = {}
        
        # Base materials
        materials["seat"] = {
            "color": parameters.colors.get("primary", "#8B4513"),
            "material": parameters.materials.get("seat", "wood"),
            "finish": "matte"
        }
        
        materials["frame"] = {
            "color": parameters.colors.get("secondary", "#654321"),
            "material": parameters.materials.get("frame", "wood"),
            "finish": "satin"
        }
        
        # Cultural material modifications
        cultural_style = parameters.cultural_elements.get("style", "modern")
        if cultural_style == "japanese":
            materials["seat"]["finish"] = "natural"
            materials["frame"]["finish"] = "natural"
        elif cultural_style == "french":
            materials["seat"]["finish"] = "glossy"
            materials["frame"]["finish"] = "glossy"
        
        return materials
    
    def _generate_metadata(self, parameters: ParametricParameters) -> Dict[str, Any]:
        """Generate cultural and design metadata"""
        return {
            "cultural_style": parameters.cultural_elements.get("style", "modern"),
            "cultural_authenticity": parameters.cultural_elements.get("authenticity", 0.8),
            "comfort_rating": parameters.comfort_level,
            "durability_rating": parameters.durability,
            "design_principles": self._get_cultural_principles(parameters.cultural_elements.get("style", "modern"))
        }
    
    def _get_cultural_principles(self, style: str) -> List[str]:
        """Get cultural design principles for the style"""
        principles = {
            "japanese": ["wabi-sabi", "minimalism", "natural materials", "harmony with nature"],
            "french": ["elegance", "refinement", "attention to detail", "classic proportions"],
            "scandinavian": ["functionality", "simplicity", "clean lines", "light colors"],
            "italian": ["craftsmanship", "luxury", "bold design", "artistic flair"]
        }
        return principles.get(style, ["modern", "functional", "versatile"])

class ParametricTableTemplate:
    def __init__(self):
        self.base_dimensions = {
            "table_width": 1.2,
            "table_depth": 0.8,
            "table_height": 0.75,
            "top_thickness": 0.05,
            "leg_thickness": 0.08
        }
    
    def generate_geometry(self, parameters: ParametricParameters) -> ParametricGeometry:
        """Generate procedural table geometry"""
        geometry = ParametricGeometry()
        
        dims = self._apply_cultural_style(parameters)
        
        # Generate table top
        top_mesh = self._generate_table_top(dims, parameters)
        
        # Generate legs/base
        legs_mesh = self._generate_table_legs(dims, parameters)
        
        # Combine meshes
        combined_mesh = trimesh.util.concatenate([top_mesh, legs_mesh])
        
        geometry.vertices = combined_mesh.vertices.tolist()
        geometry.faces = combined_mesh.faces.tolist()
        geometry.materials = self._generate_materials(parameters)
        geometry.metadata = self._generate_metadata(parameters)
        
        return geometry
    
    def _apply_cultural_style(self, parameters: ParametricParameters) -> Dict[str, float]:
        """Apply cultural design principles to base dimensions"""
        dims = self.base_dimensions.copy()
        
        cultural_style = parameters.cultural_elements.get("style", "modern")
        
        if cultural_style == "japanese":
            # Lower height, more rectangular proportions
            dims["table_height"] *= 0.7
            dims["table_width"] *= 1.2
            dims["top_thickness"] *= 0.8
        elif cultural_style == "french":
            # Elegant proportions
            dims["table_height"] *= 1.05
            dims["top_thickness"] *= 1.2
        elif cultural_style == "scandinavian":
            # Clean, functional proportions
            dims["table_width"] *= 1.1
            dims["leg_thickness"] *= 0.9
        
        # Apply parameter scaling
        for key, value in parameters.dimensions.items():
            if key in dims:
                dims[key] *= value
        
        return dims
    
    def _generate_table_top(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate table top geometry"""
        cultural_style = parameters.cultural_elements.get("style", "modern")
        
        if cultural_style == "japanese":
            # Rounded edges
            top = trimesh.creation.box(
                extents=[dims["table_width"], dims["table_depth"], dims["top_thickness"]]
            )
            # Apply rounding (simplified)
            top.apply_translation([0, 0, dims["table_height"]])
            return top
        elif cultural_style == "french":
            # Ornate edges
            top = trimesh.creation.box(
                extents=[dims["table_width"], dims["table_depth"], dims["top_thickness"]]
            )
            top.apply_translation([0, 0, dims["table_height"]])
            return top
        else:
            # Standard rectangular top
            top = trimesh.creation.box(
                extents=[dims["table_width"], dims["table_depth"], dims["top_thickness"]]
            )
            top.apply_translation([0, 0, dims["table_height"]])
            return top
    
    def _generate_table_legs(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate table legs"""
        cultural_style = parameters.cultural_elements.get("style", "modern")
        
        if cultural_style == "japanese":
            # Integrated base
            return self._generate_integrated_base(dims, parameters)
        elif cultural_style == "french":
            # Ornate legs
            return self._generate_ornate_legs(dims, parameters)
        else:
            # Standard four legs
            return self._generate_standard_legs(dims, parameters)
    
    def _generate_standard_legs(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate standard four legs"""
        legs = []
        leg_positions = [
            [dims["table_width"]/2 - dims["leg_thickness"], dims["table_depth"]/2 - dims["leg_thickness"]],
            [-dims["table_width"]/2 + dims["leg_thickness"], dims["table_depth"]/2 - dims["leg_thickness"]],
            [dims["table_width"]/2 - dims["leg_thickness"], -dims["table_depth"]/2 + dims["leg_thickness"]],
            [-dims["table_width"]/2 + dims["leg_thickness"], -dims["table_depth"]/2 + dims["leg_thickness"]]
        ]
        
        for pos in leg_positions:
            leg = trimesh.creation.box(
                extents=[dims["leg_thickness"], dims["leg_thickness"], dims["table_height"]]
            )
            leg.apply_translation([pos[0], pos[1], dims["table_height"]/2])
            legs.append(leg)
        
        return trimesh.util.concatenate(legs)
    
    def _generate_integrated_base(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate Japanese-style integrated base"""
        # Simplified integrated base
        base = trimesh.creation.box(
            extents=[dims["table_width"] * 0.8, dims["table_depth"] * 0.6, dims["leg_thickness"]]
        )
        base.apply_translation([0, 0, dims["leg_thickness"]/2])
        
        # Add vertical supports
        support1 = trimesh.creation.box(
            extents=[dims["leg_thickness"], dims["table_depth"] * 0.6, dims["table_height"]]
        )
        support1.apply_translation([0, 0, dims["table_height"]/2])
        
        return trimesh.util.concatenate([base, support1])
    
    def _generate_ornate_legs(self, dims: Dict[str, float], parameters: ParametricParameters) -> trimesh.Trimesh:
        """Generate French-style ornate legs"""
        # Simplified ornate legs - in production would have more detail
        return self._generate_standard_legs(dims, parameters)
    
    def _generate_materials(self, parameters: ParametricParameters) -> Dict[str, Any]:
        """Generate material definitions"""
        materials = {}
        
        materials["top"] = {
            "color": parameters.colors.get("primary", "#8B4513"),
            "material": parameters.materials.get("top", "wood"),
            "finish": "satin"
        }
        
        materials["legs"] = {
            "color": parameters.colors.get("secondary", "#654321"),
            "material": parameters.materials.get("legs", "wood"),
            "finish": "satin"
        }
        
        return materials
    
    def _generate_metadata(self, parameters: ParametricParameters) -> Dict[str, Any]:
        """Generate cultural and design metadata"""
        return {
            "cultural_style": parameters.cultural_elements.get("style", "modern"),
            "cultural_authenticity": parameters.cultural_elements.get("authenticity", 0.8),
            "functionality_rating": parameters.comfort_level,
            "durability_rating": parameters.durability,
            "design_principles": self._get_cultural_principles(parameters.cultural_elements.get("style", "modern"))
        }
    
    def _get_cultural_principles(self, style: str) -> List[str]:
        """Get cultural design principles for the style"""
        principles = {
            "japanese": ["wabi-sabi", "minimalism", "natural materials", "low profile"],
            "french": ["elegance", "refinement", "classical proportions", "luxury"],
            "scandinavian": ["functionality", "simplicity", "clean lines", "natural wood"],
            "italian": ["craftsmanship", "design excellence", "artistic flair", "quality materials"]
        }
        return principles.get(style, ["modern", "functional", "versatile"])

class ParametricGenerationService:
    def __init__(self):
        self.templates = {
            FurnitureType.CHAIR: ParametricChairTemplate(),
            FurnitureType.TABLE: ParametricTableTemplate(),
            # Add more templates as needed
        }
    
    async def generate_parametric_furniture(
        self, 
        furniture_type: FurnitureType,
        cultural_style: CulturalStyle,
        parameters: ParametricParameters
    ) -> ParametricGeometry:
        """Generate parametric furniture with cultural intelligence"""
        
        try:
            logger.info(f"Generating {furniture_type.value} with {cultural_style.value} style")
            
            # Get appropriate template
            template = self.templates.get(furniture_type)
            if not template:
                raise ValueError(f"No template available for {furniture_type.value}")
            
            # Apply cultural style to parameters
            parameters.cultural_elements["style"] = cultural_style.value
            
            # Generate geometry
            geometry = await asyncio.get_event_loop().run_in_executor(
                None, template.generate_geometry, parameters
            )
            
            logger.info(f"Successfully generated {furniture_type.value} geometry")
            return geometry
            
        except Exception as e:
            logger.error(f"Error generating parametric furniture: {str(e)}")
            raise

parametric_service = ParametricGenerationService()