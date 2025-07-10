import json
import io
import base64
import trimesh
from typing import Dict, Any, Optional
from enum import Enum
from dataclasses import dataclass
import struct
import gzip
import logging
from pygltflib import GLTF2, Buffer, BufferView, Accessor, Mesh, Primitive, Node, Scene, Asset, Material, PbrMetallicRoughness

from app.services.parametric_generation_service import ParametricGeometry, ExportFormat, ExportOptions

logger = logging.getLogger(__name__)

class CompressionType(Enum):
    NONE = "none"
    GZIP = "gzip"
    DRACO = "draco"  # Future implementation

@dataclass
class ExportResult:
    data: bytes
    format: ExportFormat
    metadata: Dict[str, Any]
    size: int
    compression: CompressionType

class GeometryExporter:
    def __init__(self):
        self.supported_formats = {
            ExportFormat.GLTF: self._export_gltf,
            ExportFormat.GLB: self._export_glb,
            ExportFormat.OBJ: self._export_obj,
            ExportFormat.STL: self._export_stl
        }
    
    async def export_parametric_furniture(
        self, 
        geometry: ParametricGeometry, 
        options: ExportOptions
    ) -> ExportResult:
        """Export parametric furniture geometry to specified format"""
        
        try:
            logger.info(f"Exporting geometry to {options.format.value} format")
            
            # Validate format support
            if options.format not in self.supported_formats:
                raise ValueError(f"Export format {options.format.value} not supported")
            
            # Convert to trimesh
            mesh = self._geometry_to_trimesh(geometry)
            
            # Apply quality settings
            if options.quality == "low":
                mesh = self._reduce_quality(mesh, 0.5)
            elif options.quality == "high":
                mesh = self._enhance_quality(mesh)
            
            # Export to format
            export_func = self.supported_formats[options.format]
            data = export_func(mesh, geometry, options)
            
            # Apply compression
            if options.compress:
                data = self._compress_data(data)
                compression = CompressionType.GZIP
            else:
                compression = CompressionType.NONE
            
            # Create result
            result = ExportResult(
                data=data,
                format=options.format,
                metadata=self._generate_export_metadata(geometry, options),
                size=len(data),
                compression=compression
            )
            
            logger.info(f"Successfully exported geometry ({len(data)} bytes)")
            return result
            
        except Exception as e:
            logger.error(f"Error exporting geometry: {str(e)}")
            raise
    
    def _geometry_to_trimesh(self, geometry: ParametricGeometry) -> trimesh.Trimesh:
        """Convert ParametricGeometry to trimesh.Trimesh"""
        try:
            mesh = trimesh.Trimesh(
                vertices=geometry.vertices,
                faces=geometry.faces,
                process=True
            )
            return mesh
        except Exception as e:
            logger.error(f"Error converting geometry to trimesh: {str(e)}")
            raise
    
    def _reduce_quality(self, mesh: trimesh.Trimesh, factor: float) -> trimesh.Trimesh:
        """Reduce mesh quality for smaller file sizes"""
        try:
            # Simplify mesh
            target_faces = int(len(mesh.faces) * factor)
            simplified = mesh.simplify_quadric_decimation(target_faces)
            return simplified if simplified.faces.shape[0] > 0 else mesh
        except Exception as e:
            logger.warning(f"Could not reduce quality: {str(e)}")
            return mesh
    
    def _enhance_quality(self, mesh: trimesh.Trimesh) -> trimesh.Trimesh:
        """Enhance mesh quality for better appearance"""
        try:
            # Subdivide for smoother surface
            subdivided = mesh.subdivide()
            return subdivided if subdivided.faces.shape[0] > 0 else mesh
        except Exception as e:
            logger.warning(f"Could not enhance quality: {str(e)}")
            return mesh
    
    def _export_gltf(self, mesh: trimesh.Trimesh, geometry: ParametricGeometry, options: ExportOptions) -> bytes:
        """Export to GLTF format"""
        try:
            # Create GLTF document
            gltf = GLTF2()
            
            # Asset info
            gltf.asset = Asset(
                generator="DesignVisualz Parametric Generator",
                version="2.0"
            )
            
            # Convert mesh data
            vertices = mesh.vertices.flatten().astype('float32')
            faces = mesh.faces.flatten().astype('uint32')
            
            # Create buffer
            vertex_buffer = vertices.tobytes()
            index_buffer = faces.tobytes()
            total_buffer = vertex_buffer + index_buffer
            
            buffer = Buffer(byteLength=len(total_buffer))
            gltf.buffers = [buffer]
            
            # Buffer views
            vertex_buffer_view = BufferView(
                buffer=0,
                byteOffset=0,
                byteLength=len(vertex_buffer),
                target=34962  # ARRAY_BUFFER
            )
            
            index_buffer_view = BufferView(
                buffer=0,
                byteOffset=len(vertex_buffer),
                byteLength=len(index_buffer),
                target=34963  # ELEMENT_ARRAY_BUFFER
            )
            
            gltf.bufferViews = [vertex_buffer_view, index_buffer_view]
            
            # Accessors
            vertex_accessor = Accessor(
                bufferView=0,
                componentType=5126,  # FLOAT
                count=len(mesh.vertices),
                type="VEC3",
                min=mesh.vertices.min(axis=0).tolist(),
                max=mesh.vertices.max(axis=0).tolist()
            )
            
            index_accessor = Accessor(
                bufferView=1,
                componentType=5125,  # UNSIGNED_INT
                count=len(mesh.faces) * 3,
                type="SCALAR"
            )
            
            gltf.accessors = [vertex_accessor, index_accessor]
            
            # Materials
            if options.include_materials:
                material = Material(
                    pbrMetallicRoughness=PbrMetallicRoughness(
                        baseColorFactor=[0.8, 0.6, 0.4, 1.0],
                        metallicFactor=0.0,
                        roughnessFactor=0.8
                    )
                )
                gltf.materials = [material]
            
            # Mesh
            primitive = Primitive(
                attributes={"POSITION": 0},
                indices=1,
                material=0 if options.include_materials else None
            )
            
            gltf_mesh = Mesh(primitives=[primitive])
            gltf.meshes = [gltf_mesh]
            
            # Node
            node = Node(mesh=0)
            gltf.nodes = [node]
            
            # Scene
            scene = Scene(nodes=[0])
            gltf.scenes = [scene]
            gltf.scene = 0
            
            # Convert to JSON
            gltf_json = gltf.to_json()
            
            # Create final GLTF with embedded buffer
            gltf_dict = json.loads(gltf_json)
            gltf_dict["buffers"][0]["uri"] = f"data:application/octet-stream;base64,{base64.b64encode(total_buffer).decode('utf-8')}"
            
            return json.dumps(gltf_dict, indent=2).encode('utf-8')
            
        except Exception as e:
            logger.error(f"Error exporting to GLTF: {str(e)}")
            raise
    
    def _export_glb(self, mesh: trimesh.Trimesh, geometry: ParametricGeometry, options: ExportOptions) -> bytes:
        """Export to GLB format"""
        try:
            # Use trimesh built-in GLB export
            export_data = mesh.export(file_type='glb')
            
            # Add metadata if requested
            if options.cultural_metadata:
                # GLB doesn't support custom metadata easily, so we'll embed it as extras
                pass
            
            return export_data
            
        except Exception as e:
            logger.error(f"Error exporting to GLB: {str(e)}")
            raise
    
    def _export_obj(self, mesh: trimesh.Trimesh, geometry: ParametricGeometry, options: ExportOptions) -> bytes:
        """Export to OBJ format"""
        try:
            export_data = mesh.export(file_type='obj')
            
            # Add cultural metadata as comments
            if options.cultural_metadata:
                metadata_lines = []
                metadata_lines.append("# DesignVisualz Parametric Furniture")
                metadata_lines.append(f"# Cultural Style: {geometry.metadata.get('cultural_style', 'modern')}")
                metadata_lines.append(f"# Authenticity: {geometry.metadata.get('cultural_authenticity', 0.8)}")
                metadata_lines.append("")
                
                # Prepend metadata to OBJ
                metadata_str = "\n".join(metadata_lines)
                export_data = metadata_str.encode('utf-8') + export_data
            
            return export_data
            
        except Exception as e:
            logger.error(f"Error exporting to OBJ: {str(e)}")
            raise
    
    def _export_stl(self, mesh: trimesh.Trimesh, geometry: ParametricGeometry, options: ExportOptions) -> bytes:
        """Export to STL format"""
        try:
            export_data = mesh.export(file_type='stl')
            return export_data
            
        except Exception as e:
            logger.error(f"Error exporting to STL: {str(e)}")
            raise
    
    def _compress_data(self, data: bytes) -> bytes:
        """Compress data using gzip"""
        try:
            compressed = gzip.compress(data, compresslevel=9)
            logger.info(f"Compressed {len(data)} bytes to {len(compressed)} bytes ({len(compressed)/len(data)*100:.1f}%)")
            return compressed
        except Exception as e:
            logger.error(f"Error compressing data: {str(e)}")
            return data
    
    def _generate_export_metadata(self, geometry: ParametricGeometry, options: ExportOptions) -> Dict[str, Any]:
        """Generate export metadata"""
        metadata = {
            "format": options.format.value,
            "quality": options.quality,
            "compressed": options.compress,
            "cultural_metadata_included": options.cultural_metadata,
            "materials_included": options.include_materials,
            "vertex_count": len(geometry.vertices),
            "face_count": len(geometry.faces),
            "export_timestamp": int(time.time())
        }
        
        # Add cultural metadata
        if options.cultural_metadata:
            metadata.update({
                "cultural_style": geometry.metadata.get("cultural_style", "modern"),
                "cultural_authenticity": geometry.metadata.get("cultural_authenticity", 0.8),
                "design_principles": geometry.metadata.get("design_principles", [])
            })
        
        return metadata

# Quality presets
QUALITY_PRESETS = {
    "low": {
        "mesh_simplification": 0.3,
        "texture_resolution": 512,
        "compression": True
    },
    "medium": {
        "mesh_simplification": 0.7,
        "texture_resolution": 1024,
        "compression": True
    },
    "high": {
        "mesh_simplification": 1.0,
        "texture_resolution": 2048,
        "compression": False
    }
}

geometry_exporter = GeometryExporter()

import time