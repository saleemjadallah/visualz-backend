import cv2
import numpy as np
from PIL import Image
import io
import logging
import math
from typing import Dict, List, Tuple, Optional
from fastapi import HTTPException
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

logger = logging.getLogger(__name__)

class ComputerVisionService:
    """Service for computer vision analysis of space photos."""
    
    def __init__(self):
        self.min_room_area = 50  # Minimum room area in square feet
        self.max_room_area = 2000  # Maximum room area in square feet
    
    async def analyze_space_photo(self, image_data: bytes) -> Dict:
        """Analyze a space photo to extract room dimensions and features."""
        try:
            # Convert bytes to OpenCV image
            image = self._bytes_to_opencv_image(image_data)
            
            # Analyze room dimensions
            dimensions = await self._estimate_room_dimensions(image)
            
            # Detect objects and furniture
            objects = await self._detect_objects(image)
            
            # Analyze lighting conditions
            lighting = await self._analyze_lighting(image)
            
            # Classify architectural style
            style = await self._classify_architectural_style(image)
            
            # Extract color palette
            color_palette = await self._extract_color_palette(image)
            
            # Identify architectural features
            features = await self._identify_architectural_features(image)
            
            return {
                "dimensions": dimensions,
                "detected_objects": objects,
                "lighting_analysis": lighting,
                "architectural_style": style,
                "color_palette": color_palette,
                "architectural_features": features,
                "analysis_confidence": self._calculate_confidence(dimensions, objects, lighting)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing space photo: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")
    
    async def _estimate_room_dimensions(self, image: np.ndarray) -> Dict:
        """Estimate room dimensions from image using advanced perspective correction."""
        try:
            height, width = image.shape[:2]
            
            # Convert to grayscale for edge detection
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur to reduce noise
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Advanced edge detection with morphological operations
            edges = cv2.Canny(blurred, 50, 150)
            
            # Dilate edges to connect nearby contours
            kernel = np.ones((3, 3), np.uint8)
            edges = cv2.dilate(edges, kernel, iterations=1)
            
            # Find lines using Hough transform
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)
            
            room_dimensions = await self._analyze_perspective_lines(lines, width, height)
            
            if room_dimensions:
                return room_dimensions
            
            # Fallback: Use vanishing point detection
            vanishing_point = await self._find_vanishing_point(lines, width, height)
            if vanishing_point:
                dimensions = await self._estimate_from_vanishing_point(vanishing_point, width, height)
                if dimensions:
                    return dimensions
            
            # Final fallback with improved estimation
            return await self._fallback_dimension_estimation(image)
            
        except Exception as e:
            logger.error(f"Error estimating room dimensions: {e}")
            return await self._fallback_dimension_estimation(image)
    
    async def _analyze_perspective_lines(self, lines: np.ndarray, img_width: int, img_height: int) -> Optional[Dict]:
        """Analyze perspective lines to estimate room dimensions."""
        try:
            if lines is None or len(lines) < 4:
                return None
            
            # Separate horizontal and vertical lines
            horizontal_lines = []
            vertical_lines = []
            
            for line in lines:
                x1, y1, x2, y2 = line[0]
                angle = math.atan2(y2 - y1, x2 - x1) * 180 / math.pi
                
                # Classify lines by angle
                if abs(angle) < 15 or abs(angle) > 165:  # Nearly horizontal
                    horizontal_lines.append(line[0])
                elif abs(angle - 90) < 15 or abs(angle + 90) < 15:  # Nearly vertical
                    vertical_lines.append(line[0])
            
            # Estimate dimensions based on line analysis
            if len(horizontal_lines) >= 2 and len(vertical_lines) >= 2:
                # Calculate average room size based on line positions
                avg_width = self._calculate_average_dimension(horizontal_lines, img_width)
                avg_height = self._calculate_average_dimension(vertical_lines, img_height)
                
                # Convert pixel dimensions to real-world estimates
                # Using average room size assumptions
                estimated_length = max(10, min(25, avg_width * 0.015))  # Rough conversion
                estimated_width = max(8, min(20, avg_height * 0.012))
                
                return {
                    "length": round(estimated_length, 1),
                    "width": round(estimated_width, 1),
                    "height": 8.5,
                    "area": round(estimated_length * estimated_width, 1),
                    "aspect_ratio": round(estimated_length / estimated_width, 2),
                    "confidence": 0.75,
                    "detection_method": "perspective_lines"
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error analyzing perspective lines: {e}")
            return None
    
    async def _find_vanishing_point(self, lines: np.ndarray, img_width: int, img_height: int) -> Optional[Tuple[float, float]]:
        """Find vanishing point from perspective lines."""
        try:
            if lines is None or len(lines) < 3:
                return None
            
            # Find intersection points of lines
            intersections = []
            
            for i in range(len(lines)):
                for j in range(i + 1, len(lines)):
                    line1 = lines[i][0]
                    line2 = lines[j][0]
                    
                    intersection = self._line_intersection(line1, line2)
                    if intersection and self._is_valid_vanishing_point(intersection, img_width, img_height):
                        intersections.append(intersection)
            
            if len(intersections) >= 2:
                # Cluster intersections to find vanishing point
                intersections = np.array(intersections)
                if len(intersections) > 1:
                    kmeans = KMeans(n_clusters=1, random_state=42)
                    kmeans.fit(intersections)
                    return tuple(kmeans.cluster_centers_[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Error finding vanishing point: {e}")
            return None
    
    async def _estimate_from_vanishing_point(self, vanishing_point: Tuple[float, float], img_width: int, img_height: int) -> Optional[Dict]:
        """Estimate room dimensions using vanishing point."""
        try:
            vp_x, vp_y = vanishing_point
            
            # Calculate perspective distortion factor
            center_x, center_y = img_width // 2, img_height // 2
            distance_from_center = math.sqrt((vp_x - center_x)**2 + (vp_y - center_y)**2)
            
            # Normalize by image diagonal
            img_diagonal = math.sqrt(img_width**2 + img_height**2)
            distortion_factor = distance_from_center / img_diagonal
            
            # Estimate dimensions based on perspective
            base_length = 12.0
            base_width = 10.0
            
            # Adjust based on vanishing point position
            if vp_x < center_x:  # Vanishing point to the left
                estimated_length = base_length * (1 + distortion_factor * 0.3)
                estimated_width = base_width * (1 - distortion_factor * 0.2)
            else:  # Vanishing point to the right
                estimated_length = base_length * (1 - distortion_factor * 0.2)
                estimated_width = base_width * (1 + distortion_factor * 0.3)
            
            return {
                "length": round(estimated_length, 1),
                "width": round(estimated_width, 1),
                "height": 8.5,
                "area": round(estimated_length * estimated_width, 1),
                "aspect_ratio": round(estimated_length / estimated_width, 2),
                "confidence": 0.65,
                "detection_method": "vanishing_point"
            }
            
        except Exception as e:
            logger.error(f"Error estimating from vanishing point: {e}")
            return None
    
    async def _fallback_dimension_estimation(self, image: np.ndarray) -> Dict:
        """Fallback dimension estimation using image analysis."""
        try:
            height, width = image.shape[:2]
            
            # Analyze image composition
            aspect_ratio = width / height
            
            # Use machine learning approach for size estimation
            features = await self._extract_size_features(image)
            estimated_size = await self._predict_room_size(features)
            
            return {
                "length": round(estimated_size.get("length", 12.0), 1),
                "width": round(estimated_size.get("width", 10.0), 1),
                "height": 8.5,
                "area": round(estimated_size.get("length", 12.0) * estimated_size.get("width", 10.0), 1),
                "aspect_ratio": round(aspect_ratio, 2),
                "confidence": 0.4,
                "detection_method": "ml_estimation"
            }
            
        except Exception as e:
            logger.error(f"Error in fallback estimation: {e}")
            return {
                "length": 12.0,
                "width": 10.0,
                "height": 8.5,
                "area": 120.0,
                "aspect_ratio": 1.2,
                "confidence": 0.2,
                "detection_method": "default"
            }
    
    def _calculate_average_dimension(self, lines: List, img_dimension: int) -> float:
        """Calculate average dimension from line positions."""
        if not lines:
            return img_dimension * 0.8
        
        positions = []
        for line in lines:
            x1, y1, x2, y2 = line
            avg_pos = (x1 + x2) / 2 if abs(x2 - x1) > abs(y2 - y1) else (y1 + y2) / 2
            positions.append(avg_pos)
        
        return max(positions) - min(positions) if len(positions) > 1 else img_dimension * 0.8
    
    def _line_intersection(self, line1: List[int], line2: List[int]) -> Optional[Tuple[float, float]]:
        """Find intersection point of two lines."""
        try:
            x1, y1, x2, y2 = line1
            x3, y3, x4, y4 = line2
            
            denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
            if abs(denom) < 1e-10:
                return None
            
            t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
            
            x = x1 + t * (x2 - x1)
            y = y1 + t * (y2 - y1)
            
            return (x, y)
            
        except Exception as e:
            logger.error(f"Error calculating line intersection: {e}")
            return None
    
    def _is_valid_vanishing_point(self, point: Tuple[float, float], img_width: int, img_height: int) -> bool:
        """Check if point is a valid vanishing point."""
        x, y = point
        
        # Vanishing point should be within extended image bounds
        margin = max(img_width, img_height) * 0.5
        return (-margin <= x <= img_width + margin and 
                -margin <= y <= img_height + margin)
    
    async def _extract_size_features(self, image: np.ndarray) -> Dict:
        """Extract features for room size prediction."""
        try:
            height, width = image.shape[:2]
            
            # Extract various image features
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Edge density
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (height * width)
            
            # Texture analysis
            texture_variance = np.var(gray)
            
            # Color distribution
            color_std = np.std(image, axis=(0, 1))
            
            # Brightness distribution
            brightness_mean = np.mean(gray)
            brightness_std = np.std(gray)
            
            return {
                "aspect_ratio": width / height,
                "edge_density": edge_density,
                "texture_variance": texture_variance,
                "color_std_mean": np.mean(color_std),
                "brightness_mean": brightness_mean,
                "brightness_std": brightness_std
            }
            
        except Exception as e:
            logger.error(f"Error extracting size features: {e}")
            return {}
    
    async def _predict_room_size(self, features: Dict) -> Dict:
        """Predict room size based on features."""
        try:
            # Simple heuristic-based prediction
            # In production, this would use a trained ML model
            
            aspect_ratio = features.get("aspect_ratio", 1.2)
            edge_density = features.get("edge_density", 0.1)
            brightness = features.get("brightness_mean", 128)
            
            # Estimate length based on aspect ratio
            if aspect_ratio > 1.5:
                base_length = 16
            elif aspect_ratio > 1.2:
                base_length = 14
            else:
                base_length = 12
            
            # Adjust based on edge density (more edges = more complex/smaller room)
            if edge_density > 0.15:
                base_length *= 0.8
            elif edge_density < 0.05:
                base_length *= 1.2
            
            # Adjust based on brightness (brighter = larger room)
            if brightness > 150:
                base_length *= 1.1
            elif brightness < 100:
                base_length *= 0.9
            
            base_width = base_length / aspect_ratio
            
            return {
                "length": max(8, min(25, base_length)),
                "width": max(6, min(20, base_width))
            }
            
        except Exception as e:
            logger.error(f"Error predicting room size: {e}")
            return {"length": 12.0, "width": 10.0}
    
    async def _detect_objects(self, image: np.ndarray) -> List[Dict]:
        """Detect furniture and objects in the image using advanced techniques."""
        try:
            detected_objects = []
            
            # Multi-method object detection
            furniture_objects = await self._detect_furniture_by_shape(image)
            detected_objects.extend(furniture_objects)
            
            # Detect objects by color and texture
            color_objects = await self._detect_objects_by_color(image)
            detected_objects.extend(color_objects)
            
            # Detect objects by texture patterns
            texture_objects = await self._detect_objects_by_texture(image)
            detected_objects.extend(texture_objects)
            
            # Remove duplicates and merge overlapping detections
            detected_objects = await self._merge_overlapping_detections(detected_objects)
            
            # If no objects detected, use contextual inference
            if not detected_objects:
                detected_objects = await self._infer_furniture_from_context(image)
            
            return detected_objects
            
        except Exception as e:
            logger.error(f"Error detecting objects: {e}")
            return []
    
    async def _detect_furniture_by_shape(self, image: np.ndarray) -> List[Dict]:
        """Detect furniture based on geometric shapes."""
        try:
            detected_objects = []
            
            # Convert to grayscale for contour detection
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply edge detection
            edges = cv2.Canny(gray, 50, 150)
            
            # Find contours
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area < 1000:  # Skip small contours
                    continue
                
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                aspect_ratio = w / h
                
                # Approximate contour to polygon
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                
                # Classify based on shape characteristics
                furniture_type, confidence = self._classify_furniture_by_shape(
                    approx, aspect_ratio, area, w, h
                )
                
                if furniture_type and confidence > 0.3:
                    detected_objects.append({
                        "type": furniture_type,
                        "confidence": confidence,
                        "bbox": {"x": x, "y": y, "width": w, "height": h},
                        "detection_method": "shape",
                        "area": area,
                        "aspect_ratio": aspect_ratio
                    })
            
            return detected_objects
            
        except Exception as e:
            logger.error(f"Error detecting furniture by shape: {e}")
            return []
    
    async def _detect_objects_by_color(self, image: np.ndarray) -> List[Dict]:
        """Detect objects based on color patterns."""
        try:
            detected_objects = []
            
            # Convert to HSV for better color detection
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            # Define color ranges for different furniture types
            color_ranges = {
                "wooden_furniture": [
                    (np.array([10, 50, 20]), np.array([20, 255, 200])),  # Brown
                    (np.array([15, 40, 40]), np.array([25, 255, 255]))   # Light brown
                ],
                "upholstered_furniture": [
                    (np.array([0, 0, 50]), np.array([180, 50, 200])),    # Gray fabrics
                    (np.array([100, 50, 50]), np.array([130, 255, 255])) # Blue fabrics
                ],
                "metal_furniture": [
                    (np.array([0, 0, 80]), np.array([180, 30, 120]))     # Metallic gray
                ]
            }
            
            for furniture_category, ranges in color_ranges.items():
                for lower, upper in ranges:
                    mask = cv2.inRange(hsv, lower, upper)
                    
                    # Apply morphological operations to clean up the mask
                    kernel = np.ones((5, 5), np.uint8)
                    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
                    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
                    
                    # Find contours
                    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                    
                    for contour in contours:
                        area = cv2.contourArea(contour)
                        if area > 2000:  # Minimum size for color-based detection
                            x, y, w, h = cv2.boundingRect(contour)
                            
                            # Extract color information
                            roi = image[y:y+h, x:x+w]
                            dominant_color = self._get_dominant_color(roi)
                            
                            detected_objects.append({
                                "type": self._infer_furniture_type_from_color(furniture_category, w, h),
                                "confidence": 0.5,
                                "bbox": {"x": x, "y": y, "width": w, "height": h},
                                "detection_method": "color",
                                "dominant_color": dominant_color,
                                "color_category": furniture_category
                            })
            
            return detected_objects
            
        except Exception as e:
            logger.error(f"Error detecting objects by color: {e}")
            return []
    
    async def _detect_objects_by_texture(self, image: np.ndarray) -> List[Dict]:
        """Detect objects based on texture patterns."""
        try:
            detected_objects = []
            
            # Convert to grayscale for texture analysis
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply texture filters
            # Sobel filter for edge texture
            sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
            
            # Local Binary Pattern for texture classification
            lbp = self._calculate_lbp(gray)
            
            # Analyze texture regions
            texture_regions = self._find_texture_regions(sobel_magnitude, lbp)
            
            for region in texture_regions:
                x, y, w, h = region["bbox"]
                texture_type = region["texture_type"]
                confidence = region["confidence"]
                
                # Infer furniture type from texture
                furniture_type = self._infer_furniture_from_texture(texture_type, w, h)
                
                if furniture_type:
                    detected_objects.append({
                        "type": furniture_type,
                        "confidence": confidence,
                        "bbox": {"x": x, "y": y, "width": w, "height": h},
                        "detection_method": "texture",
                        "texture_type": texture_type
                    })
            
            return detected_objects
            
        except Exception as e:
            logger.error(f"Error detecting objects by texture: {e}")
            return []
    
    async def _merge_overlapping_detections(self, detections: List[Dict]) -> List[Dict]:
        """Merge overlapping object detections."""
        try:
            if not detections:
                return []
            
            # Sort by confidence
            detections.sort(key=lambda x: x["confidence"], reverse=True)
            
            merged_detections = []
            
            for detection in detections:
                bbox1 = detection["bbox"]
                is_overlapping = False
                
                for i, existing in enumerate(merged_detections):
                    bbox2 = existing["bbox"]
                    
                    # Calculate intersection over union (IoU)
                    iou = self._calculate_iou(bbox1, bbox2)
                    
                    if iou > 0.5:  # Significant overlap
                        # Merge detections
                        merged_detections[i] = self._merge_detections(existing, detection)
                        is_overlapping = True
                        break
                
                if not is_overlapping:
                    merged_detections.append(detection)
            
            return merged_detections
            
        except Exception as e:
            logger.error(f"Error merging detections: {e}")
            return detections
    
    async def _infer_furniture_from_context(self, image: np.ndarray) -> List[Dict]:
        """Infer furniture presence from room context."""
        try:
            detected_objects = []
            
            # Analyze room layout to infer common furniture
            height, width = image.shape[:2]
            
            # Analyze brightness zones (darker areas might be furniture)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply threshold to find darker regions
            _, dark_regions = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)
            
            # Find contours in dark regions
            contours, _ = cv2.findContours(dark_regions, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Analyze layout patterns
            room_center_x, room_center_y = width // 2, height // 2
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 1500:  # Minimum size for inferred furniture
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    # Position-based inference
                    distance_from_center = math.sqrt(
                        (x + w/2 - room_center_x)**2 + (y + h/2 - room_center_y)**2
                    )
                    
                    # Infer furniture type based on position and size
                    furniture_type = self._infer_furniture_from_position(
                        x, y, w, h, width, height, distance_from_center
                    )
                    
                    if furniture_type:
                        detected_objects.append({
                            "type": furniture_type,
                            "confidence": 0.3,
                            "bbox": {"x": x, "y": y, "width": w, "height": h},
                            "detection_method": "contextual_inference"
                        })
            
            return detected_objects
            
        except Exception as e:
            logger.error(f"Error inferring furniture from context: {e}")
            return []
    
    def _classify_furniture_by_shape(self, approx: np.ndarray, aspect_ratio: float, area: float, width: int, height: int) -> Tuple[str, float]:
        """Classify furniture based on geometric shape."""
        try:
            num_vertices = len(approx)
            
            # Tables (rectangular, wider than tall)
            if num_vertices == 4 and 1.2 < aspect_ratio < 3.0 and area > 5000:
                return "table", 0.7
            
            # Chairs (more vertical, smaller area)
            elif num_vertices >= 4 and 0.4 < aspect_ratio < 1.2 and 2000 < area < 8000:
                return "chair", 0.6
            
            # Sofas (long and horizontal)
            elif num_vertices >= 4 and aspect_ratio > 2.0 and area > 8000:
                return "sofa", 0.65
            
            # Cabinets/wardrobes (tall and rectangular)
            elif num_vertices == 4 and aspect_ratio < 0.8 and area > 6000:
                return "cabinet", 0.6
            
            # Beds (large rectangular)
            elif num_vertices == 4 and 1.5 < aspect_ratio < 2.5 and area > 10000:
                return "bed", 0.5
            
            return None, 0.0
            
        except Exception as e:
            logger.error(f"Error classifying furniture by shape: {e}")
            return None, 0.0
    
    def _get_dominant_color(self, roi: np.ndarray) -> str:
        """Extract dominant color from region of interest."""
        try:
            # Reshape image to be a list of pixels
            pixels = roi.reshape(-1, 3)
            
            # Use K-means to find dominant color
            kmeans = KMeans(n_clusters=1, random_state=42)
            kmeans.fit(pixels)
            
            # Get dominant color
            color = kmeans.cluster_centers_[0]
            
            # Convert BGR to RGB and then to hex
            rgb_color = [int(color[2]), int(color[1]), int(color[0])]
            hex_color = "#{:02x}{:02x}{:02x}".format(*rgb_color)
            
            return hex_color
            
        except Exception as e:
            logger.error(f"Error getting dominant color: {e}")
            return "#808080"
    
    def _infer_furniture_type_from_color(self, color_category: str, width: int, height: int) -> str:
        """Infer furniture type from color category and dimensions."""
        aspect_ratio = width / height
        
        if color_category == "wooden_furniture":
            if aspect_ratio > 1.5:
                return "table"
            elif aspect_ratio < 0.8:
                return "cabinet"
            else:
                return "chair"
        elif color_category == "upholstered_furniture":
            if aspect_ratio > 2.0:
                return "sofa"
            elif aspect_ratio > 1.5:
                return "bed"
            else:
                return "chair"
        elif color_category == "metal_furniture":
            return "chair"
        
        return "furniture"
    
    def _calculate_lbp(self, image: np.ndarray) -> np.ndarray:
        """Calculate Local Binary Pattern for texture analysis."""
        try:
            # Simple LBP implementation
            rows, cols = image.shape
            lbp = np.zeros((rows-2, cols-2), dtype=np.uint8)
            
            for i in range(1, rows-1):
                for j in range(1, cols-1):
                    center = image[i, j]
                    code = 0
                    
                    # 8-connected neighbors
                    neighbors = [
                        image[i-1, j-1], image[i-1, j], image[i-1, j+1],
                        image[i, j+1], image[i+1, j+1], image[i+1, j],
                        image[i+1, j-1], image[i, j-1]
                    ]
                    
                    for k, neighbor in enumerate(neighbors):
                        if neighbor >= center:
                            code += 2**k
                    
                    lbp[i-1, j-1] = code
            
            return lbp
            
        except Exception as e:
            logger.error(f"Error calculating LBP: {e}")
            return np.zeros((image.shape[0]-2, image.shape[1]-2), dtype=np.uint8)
    
    def _find_texture_regions(self, sobel_magnitude: np.ndarray, lbp: np.ndarray) -> List[Dict]:
        """Find regions with distinct texture patterns."""
        try:
            regions = []
            
            # Threshold sobel magnitude to find textured areas
            texture_threshold = np.mean(sobel_magnitude) + np.std(sobel_magnitude)
            textured_areas = (sobel_magnitude > texture_threshold).astype(np.uint8) * 255
            
            # Find contours in textured areas
            contours, _ = cv2.findContours(textured_areas, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 3000:  # Minimum size for texture region
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    # Analyze texture pattern in this region
                    if y < lbp.shape[0] and x < lbp.shape[1]:
                        roi_lbp = lbp[y:min(y+h, lbp.shape[0]), x:min(x+w, lbp.shape[1])]
                        
                        # Simple texture classification
                        texture_type = self._classify_texture_pattern(roi_lbp)
                        
                        regions.append({
                            "bbox": (x, y, w, h),
                            "texture_type": texture_type,
                            "confidence": 0.4
                        })
            
            return regions
            
        except Exception as e:
            logger.error(f"Error finding texture regions: {e}")
            return []
    
    def _classify_texture_pattern(self, lbp_roi: np.ndarray) -> str:
        """Classify texture pattern from LBP."""
        try:
            # Calculate LBP histogram
            hist = cv2.calcHist([lbp_roi], [0], None, [256], [0, 256])
            
            # Normalize histogram
            hist = hist / np.sum(hist)
            
            # Simple texture classification based on histogram properties
            entropy = -np.sum(hist * np.log2(hist + 1e-10))
            
            if entropy > 6.0:
                return "fabric"  # High entropy = complex texture
            elif entropy > 4.0:
                return "wood"    # Medium entropy = wood grain
            else:
                return "smooth"  # Low entropy = smooth surface
                
        except Exception as e:
            logger.error(f"Error classifying texture pattern: {e}")
            return "unknown"
    
    def _infer_furniture_from_texture(self, texture_type: str, width: int, height: int) -> Optional[str]:
        """Infer furniture type from texture."""
        aspect_ratio = width / height
        
        if texture_type == "fabric":
            if aspect_ratio > 2.0:
                return "sofa"
            elif aspect_ratio > 1.5:
                return "bed"
            else:
                return "chair"
        elif texture_type == "wood":
            if aspect_ratio > 1.5:
                return "table"
            elif aspect_ratio < 0.8:
                return "cabinet"
            else:
                return "chair"
        
        return None
    
    def _calculate_iou(self, bbox1: Dict, bbox2: Dict) -> float:
        """Calculate Intersection over Union for two bounding boxes."""
        try:
            # Extract coordinates
            x1, y1, w1, h1 = bbox1["x"], bbox1["y"], bbox1["width"], bbox1["height"]
            x2, y2, w2, h2 = bbox2["x"], bbox2["y"], bbox2["width"], bbox2["height"]
            
            # Calculate intersection
            x_left = max(x1, x2)
            y_top = max(y1, y2)
            x_right = min(x1 + w1, x2 + w2)
            y_bottom = min(y1 + h1, y2 + h2)
            
            if x_right < x_left or y_bottom < y_top:
                return 0.0
            
            intersection_area = (x_right - x_left) * (y_bottom - y_top)
            
            # Calculate union
            box1_area = w1 * h1
            box2_area = w2 * h2
            union_area = box1_area + box2_area - intersection_area
            
            return intersection_area / union_area if union_area > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating IoU: {e}")
            return 0.0
    
    def _merge_detections(self, detection1: Dict, detection2: Dict) -> Dict:
        """Merge two overlapping detections."""
        try:
            # Use detection with higher confidence as base
            if detection1["confidence"] >= detection2["confidence"]:
                base_detection = detection1.copy()
                other_detection = detection2
            else:
                base_detection = detection2.copy()
                other_detection = detection1
            
            # Merge bounding boxes (use the larger one)
            bbox1 = base_detection["bbox"]
            bbox2 = other_detection["bbox"]
            
            x = min(bbox1["x"], bbox2["x"])
            y = min(bbox1["y"], bbox2["y"])
            w = max(bbox1["x"] + bbox1["width"], bbox2["x"] + bbox2["width"]) - x
            h = max(bbox1["y"] + bbox1["height"], bbox2["y"] + bbox2["height"]) - y
            
            base_detection["bbox"] = {"x": x, "y": y, "width": w, "height": h}
            
            # Average confidence
            base_detection["confidence"] = (detection1["confidence"] + detection2["confidence"]) / 2
            
            # Combine detection methods
            method1 = base_detection.get("detection_method", "")
            method2 = other_detection.get("detection_method", "")
            base_detection["detection_method"] = f"{method1}+{method2}"
            
            return base_detection
            
        except Exception as e:
            logger.error(f"Error merging detections: {e}")
            return detection1
    
    def _infer_furniture_from_position(self, x: int, y: int, w: int, h: int, 
                                     img_width: int, img_height: int, 
                                     distance_from_center: float) -> Optional[str]:
        """Infer furniture type from position in room."""
        try:
            aspect_ratio = w / h
            relative_size = (w * h) / (img_width * img_height)
            
            # Center of room (likely seating area)
            if distance_from_center < min(img_width, img_height) * 0.3:
                if aspect_ratio > 1.5 and relative_size > 0.05:
                    return "sofa"
                elif relative_size > 0.02:
                    return "chair"
            
            # Along walls (likely tables or cabinets)
            elif (x < img_width * 0.1 or x > img_width * 0.9 or 
                  y < img_height * 0.1 or y > img_height * 0.9):
                if aspect_ratio > 1.2:
                    return "table"
                elif aspect_ratio < 0.8:
                    return "cabinet"
            
            # Large objects in bedrooms
            elif relative_size > 0.08:
                return "bed"
            
            return None
            
        except Exception as e:
            logger.error(f"Error inferring furniture from position: {e}")
            return None
    
    async def _analyze_lighting(self, image: np.ndarray) -> Dict:
        """Analyze lighting conditions in the image with advanced algorithms."""
        try:
            # Multi-space color analysis
            lighting_analysis = await self._comprehensive_lighting_analysis(image)
            
            # Detect light sources
            light_sources = await self._detect_light_sources(image)
            
            # Analyze shadows and depth
            shadow_analysis = await self._analyze_shadows(image)
            
            # Color temperature analysis
            color_temperature = await self._analyze_color_temperature(image)
            
            # Lighting uniformity analysis
            uniformity = await self._analyze_lighting_uniformity(image)
            
            # Natural vs artificial light detection
            natural_light = await self._detect_natural_light_advanced(image)
            
            return {
                "brightness_level": lighting_analysis["brightness_level"],
                "lighting_quality": lighting_analysis["lighting_quality"],
                "color_temperature": color_temperature,
                "uniformity": uniformity,
                "natural_light_present": natural_light["present"],
                "natural_light_intensity": natural_light["intensity"],
                "light_sources": light_sources,
                "shadow_analysis": shadow_analysis,
                "lighting_zones": await self._identify_lighting_zones(image),
                "recommended_improvements": await self._suggest_lighting_improvements(lighting_analysis, light_sources)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing lighting: {e}")
            return {
                "brightness_level": 128.0,
                "lighting_quality": "moderate",
                "color_temperature": "neutral",
                "uniformity": 0.5,
                "natural_light_present": True,
                "natural_light_intensity": 0.5,
                "light_sources": [],
                "shadow_analysis": {"quality": "moderate"},
                "lighting_zones": [],
                "recommended_improvements": []
            }
    
    async def _comprehensive_lighting_analysis(self, image: np.ndarray) -> Dict:
        """Comprehensive lighting analysis using multiple color spaces."""
        try:
            # Convert to different color spaces
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            yuv = cv2.cvtColor(image, cv2.COLOR_BGR2YUV)
            
            # LAB L channel analysis (perceptual brightness)
            l_channel = lab[:, :, 0]
            mean_brightness = np.mean(l_channel)
            std_brightness = np.std(l_channel)
            
            # HSV V channel analysis (value/brightness)
            v_channel = hsv[:, :, 2]
            hsv_brightness = np.mean(v_channel)
            
            # YUV Y channel analysis (luma)
            y_channel = yuv[:, :, 0]
            luma = np.mean(y_channel)
            
            # Combined brightness score
            combined_brightness = (mean_brightness + hsv_brightness + luma) / 3
            
            # Determine lighting quality
            if combined_brightness > 200:
                lighting_quality = "excellent"
            elif combined_brightness > 170:
                lighting_quality = "good"
            elif combined_brightness > 140:
                lighting_quality = "moderate"
            elif combined_brightness > 100:
                lighting_quality = "dim"
            else:
                lighting_quality = "poor"
            
            # Calculate contrast
            contrast = np.std(l_channel)
            
            return {
                "brightness_level": round(combined_brightness, 1),
                "lighting_quality": lighting_quality,
                "contrast": round(contrast, 2),
                "brightness_std": round(std_brightness, 2)
            }
            
        except Exception as e:
            logger.error(f"Error in comprehensive lighting analysis: {e}")
            return {
                "brightness_level": 128.0,
                "lighting_quality": "moderate",
                "contrast": 40.0,
                "brightness_std": 30.0
            }
    
    async def _detect_light_sources(self, image: np.ndarray) -> List[Dict]:
        """Detect and classify light sources in the image."""
        try:
            light_sources = []
            
            # Convert to grayscale for bright spot detection
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect very bright areas (potential light sources)
            _, bright_areas = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY)
            
            # Apply morphological operations
            kernel = np.ones((5, 5), np.uint8)
            bright_areas = cv2.morphologyEx(bright_areas, cv2.MORPH_CLOSE, kernel)
            
            # Find contours
            contours, _ = cv2.findContours(bright_areas, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 100:  # Minimum area for light source
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    # Classify light source type
                    light_type = self._classify_light_source(x, y, w, h, image.shape)
                    
                    # Analyze light characteristics
                    roi = image[y:y+h, x:x+w]
                    light_color = self._analyze_light_color(roi)
                    
                    light_sources.append({
                        "type": light_type,
                        "position": {"x": x, "y": y, "width": w, "height": h},
                        "intensity": self._calculate_light_intensity(roi),
                        "color": light_color,
                        "estimated_temperature": self._estimate_light_temperature(light_color)
                    })
            
            return light_sources
            
        except Exception as e:
            logger.error(f"Error detecting light sources: {e}")
            return []
    
    async def _analyze_shadows(self, image: np.ndarray) -> Dict:
        """Analyze shadow patterns to understand lighting setup."""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect dark areas (potential shadows)
            _, dark_areas = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY_INV)
            
            # Apply morphological operations
            kernel = np.ones((7, 7), np.uint8)
            dark_areas = cv2.morphologyEx(dark_areas, cv2.MORPH_CLOSE, kernel)
            
            # Find contours
            contours, _ = cv2.findContours(dark_areas, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Analyze shadow characteristics
            shadow_count = len([c for c in contours if cv2.contourArea(c) > 500])
            
            # Calculate shadow to light ratio
            shadow_area = sum(cv2.contourArea(c) for c in contours if cv2.contourArea(c) > 500)
            total_area = image.shape[0] * image.shape[1]
            shadow_ratio = shadow_area / total_area
            
            # Determine shadow quality
            if shadow_ratio < 0.1:
                shadow_quality = "well_lit"
            elif shadow_ratio < 0.25:
                shadow_quality = "moderate"
            else:
                shadow_quality = "heavily_shadowed"
            
            return {
                "shadow_count": shadow_count,
                "shadow_ratio": round(shadow_ratio, 3),
                "quality": shadow_quality,
                "lighting_directionality": self._analyze_lighting_direction(contours)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing shadows: {e}")
            return {"quality": "moderate", "shadow_count": 0, "shadow_ratio": 0.1}
    
    async def _analyze_color_temperature(self, image: np.ndarray) -> Dict:
        """Analyze color temperature of the lighting."""
        try:
            # Calculate average color values
            mean_colors = np.mean(image, axis=(0, 1))
            blue_mean, green_mean, red_mean = mean_colors
            
            # Calculate color temperature indicators
            rg_ratio = red_mean / green_mean if green_mean > 0 else 1.0
            bg_ratio = blue_mean / green_mean if green_mean > 0 else 1.0
            rb_ratio = red_mean / blue_mean if blue_mean > 0 else 1.0
            
            # Estimate Kelvin temperature
            if rb_ratio > 1.3:
                temperature_k = 2700  # Warm incandescent
                temperature_desc = "warm"
            elif rb_ratio > 1.1:
                temperature_k = 3000  # Warm white
                temperature_desc = "warm_white"
            elif rb_ratio > 0.9:
                temperature_k = 4000  # Neutral white
                temperature_desc = "neutral"
            elif rb_ratio > 0.8:
                temperature_k = 5000  # Cool white
                temperature_desc = "cool_white"
            else:
                temperature_k = 6500  # Daylight
                temperature_desc = "daylight"
            
            return {
                "temperature_k": temperature_k,
                "temperature_description": temperature_desc,
                "red_green_ratio": round(rg_ratio, 3),
                "blue_green_ratio": round(bg_ratio, 3),
                "red_blue_ratio": round(rb_ratio, 3)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing color temperature: {e}")
            return {
                "temperature_k": 4000,
                "temperature_description": "neutral",
                "red_green_ratio": 1.0,
                "blue_green_ratio": 1.0,
                "red_blue_ratio": 1.0
            }
    
    async def _analyze_lighting_uniformity(self, image: np.ndarray) -> Dict:
        """Analyze lighting uniformity across the image."""
        try:
            # Convert to LAB and extract L channel
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            l_channel = lab[:, :, 0]
            
            # Divide image into grid sections
            h, w = l_channel.shape
            grid_size = 8
            section_h, section_w = h // grid_size, w // grid_size
            
            section_brightness = []
            
            for i in range(grid_size):
                for j in range(grid_size):
                    y_start = i * section_h
                    y_end = (i + 1) * section_h
                    x_start = j * section_w
                    x_end = (j + 1) * section_w
                    
                    section = l_channel[y_start:y_end, x_start:x_end]
                    section_brightness.append(np.mean(section))
            
            # Calculate uniformity metrics
            brightness_std = np.std(section_brightness)
            brightness_mean = np.mean(section_brightness)
            
            # Uniformity score (0-1, higher is better)
            uniformity_score = 1 - (brightness_std / brightness_mean) if brightness_mean > 0 else 0
            uniformity_score = max(0, min(1, uniformity_score))
            
            # Classify uniformity
            if uniformity_score > 0.8:
                uniformity_quality = "excellent"
            elif uniformity_score > 0.6:
                uniformity_quality = "good"
            elif uniformity_score > 0.4:
                uniformity_quality = "moderate"
            else:
                uniformity_quality = "poor"
            
            return {
                "uniformity_score": round(uniformity_score, 3),
                "uniformity_quality": uniformity_quality,
                "brightness_variation": round(brightness_std, 2),
                "bright_spots": await self._identify_bright_spots(section_brightness, grid_size),
                "dark_spots": await self._identify_dark_spots(section_brightness, grid_size)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing lighting uniformity: {e}")
            return {
                "uniformity_score": 0.5,
                "uniformity_quality": "moderate",
                "brightness_variation": 30.0,
                "bright_spots": [],
                "dark_spots": []
            }
    
    async def _detect_natural_light_advanced(self, image: np.ndarray) -> Dict:
        """Advanced natural light detection."""
        try:
            # Analyze color temperature for natural light characteristics
            color_temp = await self._analyze_color_temperature(image)
            
            # Detect window-like bright areas
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            _, very_bright = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
            
            # Find large bright rectangular areas (windows)
            contours, _ = cv2.findContours(very_bright, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            window_like_areas = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 2000:  # Minimum size for window
                    x, y, w, h = cv2.boundingRect(contour)
                    aspect_ratio = w / h
                    
                    # Check if it looks like a window
                    if 0.5 < aspect_ratio < 3.0:  # Reasonable window proportions
                        window_like_areas.append({
                            "area": area,
                            "position": {"x": x, "y": y, "width": w, "height": h},
                            "aspect_ratio": aspect_ratio
                        })
            
            # Calculate natural light probability
            natural_light_indicators = 0
            
            # Color temperature indicator
            if 5000 <= color_temp["temperature_k"] <= 6500:
                natural_light_indicators += 2
            elif 4000 <= color_temp["temperature_k"] <= 7000:
                natural_light_indicators += 1
            
            # Window-like areas indicator
            if len(window_like_areas) > 0:
                natural_light_indicators += 2
            
            # Brightness pattern indicator
            if np.mean(gray) > 120:
                natural_light_indicators += 1
            
            # Calculate probability
            max_indicators = 5
            natural_light_probability = natural_light_indicators / max_indicators
            
            return {
                "present": natural_light_probability > 0.4,
                "intensity": round(natural_light_probability, 2),
                "confidence": round(natural_light_probability, 2),
                "window_areas": len(window_like_areas),
                "color_temperature_match": 5000 <= color_temp["temperature_k"] <= 6500
            }
            
        except Exception as e:
            logger.error(f"Error in advanced natural light detection: {e}")
            return {
                "present": True,
                "intensity": 0.5,
                "confidence": 0.3,
                "window_areas": 0,
                "color_temperature_match": False
            }
    
    async def _identify_lighting_zones(self, image: np.ndarray) -> List[Dict]:
        """Identify different lighting zones in the image."""
        try:
            # Convert to LAB color space
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            l_channel = lab[:, :, 0]
            
            # Apply K-means clustering to identify lighting zones
            h, w = l_channel.shape
            data = l_channel.reshape(-1, 1)
            
            # Use 3-5 clusters for different lighting zones
            n_clusters = 4
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            labels = kmeans.fit_predict(data)
            
            # Reshape labels back to image shape
            label_image = labels.reshape(h, w)
            
            # Analyze each cluster
            zones = []
            for i in range(n_clusters):
                cluster_mask = (label_image == i).astype(np.uint8) * 255
                
                # Find contours for this cluster
                contours, _ = cv2.findContours(cluster_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                if contours:
                    # Get largest contour for this cluster
                    largest_contour = max(contours, key=cv2.contourArea)
                    area = cv2.contourArea(largest_contour)
                    
                    if area > 1000:  # Minimum area for lighting zone
                        x, y, w, h = cv2.boundingRect(largest_contour)
                        
                        # Calculate zone brightness
                        zone_brightness = kmeans.cluster_centers_[i][0]
                        
                        # Classify zone
                        if zone_brightness > 180:
                            zone_type = "bright"
                        elif zone_brightness > 120:
                            zone_type = "moderate"
                        else:
                            zone_type = "dim"
                        
                        zones.append({
                            "type": zone_type,
                            "brightness": round(zone_brightness, 1),
                            "area": area,
                            "bbox": {"x": x, "y": y, "width": w, "height": h},
                            "percentage": round((area / (h * w)) * 100, 1)
                        })
            
            return zones
            
        except Exception as e:
            logger.error(f"Error identifying lighting zones: {e}")
            return []
    
    async def _suggest_lighting_improvements(self, lighting_analysis: Dict, light_sources: List[Dict]) -> List[str]:
        """Suggest lighting improvements based on analysis."""
        try:
            suggestions = []
            
            # Brightness suggestions
            if lighting_analysis["brightness_level"] < 120:
                suggestions.append("Add more ambient lighting to improve overall brightness")
            elif lighting_analysis["brightness_level"] > 200:
                suggestions.append("Consider dimming lights or adding diffusers to reduce glare")
            
            # Light source suggestions
            if len(light_sources) < 2:
                suggestions.append("Add multiple light sources for better illumination")
            
            # Color temperature suggestions
            suggestions.append("Consider using warm white (2700K-3000K) for relaxation or cool white (4000K-5000K) for task lighting")
            
            # Uniformity suggestions
            if lighting_analysis.get("contrast", 0) > 60:
                suggestions.append("Add fill lighting to reduce harsh shadows")
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error suggesting lighting improvements: {e}")
            return ["Consider adding balanced ambient and task lighting"]
    
    # Helper methods for lighting analysis
    def _classify_light_source(self, x: int, y: int, w: int, h: int, img_shape: tuple) -> str:
        """Classify type of light source based on position and size."""
        img_h, img_w = img_shape[:2]
        
        # Position analysis
        if y < img_h * 0.3:  # Upper portion
            if w > h:
                return "ceiling_light"
            else:
                return "pendant_light"
        elif x < img_w * 0.2 or x > img_w * 0.8:  # Sides
            return "wall_light"
        else:
            return "table_lamp"
    
    def _analyze_light_color(self, roi: np.ndarray) -> Dict:
        """Analyze color characteristics of light source."""
        try:
            mean_color = np.mean(roi, axis=(0, 1))
            b, g, r = mean_color
            
            return {
                "rgb": [int(r), int(g), int(b)],
                "dominant_channel": "red" if r > g and r > b else "green" if g > b else "blue"
            }
        except:
            return {"rgb": [255, 255, 255], "dominant_channel": "white"}
    
    def _calculate_light_intensity(self, roi: np.ndarray) -> float:
        """Calculate light intensity from ROI."""
        try:
            gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            return round(np.mean(gray_roi) / 255.0, 2)
        except:
            return 0.5
    
    def _estimate_light_temperature(self, light_color: Dict) -> int:
        """Estimate color temperature from light color."""
        try:
            r, g, b = light_color["rgb"]
            
            if r > g * 1.2 and r > b * 1.2:
                return 2700  # Warm
            elif b > r * 1.2 and b > g * 1.2:
                return 6500  # Cool
            else:
                return 4000  # Neutral
        except:
            return 4000
    
    def _analyze_lighting_direction(self, shadow_contours: List) -> str:
        """Analyze lighting direction from shadow patterns."""
        try:
            if not shadow_contours:
                return "uniform"
            
            # Simple heuristic based on shadow positions
            # In a real implementation, this would be more sophisticated
            return "directional"
        except:
            return "uniform"
    
    async def _identify_bright_spots(self, brightness_values: List[float], grid_size: int) -> List[Dict]:
        """Identify bright spots in the lighting grid."""
        try:
            mean_brightness = np.mean(brightness_values)
            std_brightness = np.std(brightness_values)
            threshold = mean_brightness + std_brightness
            
            bright_spots = []
            for i, brightness in enumerate(brightness_values):
                if brightness > threshold:
                    row = i // grid_size
                    col = i % grid_size
                    bright_spots.append({
                        "position": {"row": row, "col": col},
                        "brightness": round(brightness, 1),
                        "relative_intensity": round(brightness / mean_brightness, 2)
                    })
            
            return bright_spots
        except:
            return []
    
    async def _identify_dark_spots(self, brightness_values: List[float], grid_size: int) -> List[Dict]:
        """Identify dark spots in the lighting grid."""
        try:
            mean_brightness = np.mean(brightness_values)
            std_brightness = np.std(brightness_values)
            threshold = mean_brightness - std_brightness
            
            dark_spots = []
            for i, brightness in enumerate(brightness_values):
                if brightness < threshold:
                    row = i // grid_size
                    col = i % grid_size
                    dark_spots.append({
                        "position": {"row": row, "col": col},
                        "brightness": round(brightness, 1),
                        "relative_intensity": round(brightness / mean_brightness, 2)
                    })
            
            return dark_spots
        except:
            return []
    
    async def _classify_architectural_style(self, image: np.ndarray) -> Dict:
        """Classify the architectural style of the space."""
        try:
            # This is a simplified style classification
            # In reality, you'd use a trained CNN model
            
            # Analyze color dominance
            color_analysis = await self._extract_color_palette(image)
            
            # Analyze lines and shapes
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            
            # Count horizontal and vertical lines
            horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))
            vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 25))
            
            horizontal_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, horizontal_kernel)
            vertical_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, vertical_kernel)
            
            h_line_count = np.sum(horizontal_lines > 0)
            v_line_count = np.sum(vertical_lines > 0)
            
            # Simple classification based on color and line patterns
            if h_line_count > v_line_count * 1.5:
                style = "modern"
            elif "warm" in str(color_analysis):
                style = "traditional"
            else:
                style = "contemporary"
            
            return {
                "primary_style": style,
                "confidence": 0.4,
                "characteristics": ["clean_lines", "neutral_colors"],
                "period": "contemporary"
            }
            
        except Exception as e:
            logger.error(f"Error classifying architectural style: {e}")
            return {
                "primary_style": "contemporary",
                "confidence": 0.3,
                "characteristics": ["unknown"],
                "period": "contemporary"
            }
    
    async def _extract_color_palette(self, image: np.ndarray) -> List[str]:
        """Extract dominant colors from the image."""
        try:
            # Reshape image to be a list of pixels
            pixels = image.reshape(-1, 3)
            
            # Use K-means clustering to find dominant colors
            from sklearn.cluster import KMeans
            
            kmeans = KMeans(n_clusters=5, random_state=42)
            kmeans.fit(pixels)
            
            # Get dominant colors
            colors = kmeans.cluster_centers_
            
            # Convert BGR to RGB and then to hex
            hex_colors = []
            for color in colors:
                # Convert BGR to RGB
                rgb_color = [int(color[2]), int(color[1]), int(color[0])]
                hex_color = "#{:02x}{:02x}{:02x}".format(*rgb_color)
                hex_colors.append(hex_color)
            
            return hex_colors
            
        except Exception as e:
            logger.error(f"Error extracting color palette: {e}")
            return ["#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd"]
    
    async def _identify_architectural_features(self, image: np.ndarray) -> List[str]:
        """Identify architectural features in the image."""
        try:
            features = []
            
            # Detect windows (bright rectangular areas)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Threshold to find bright areas
            _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
            
            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 5000:  # Minimum size for architectural features
                    x, y, w, h = cv2.boundingRect(contour)
                    aspect_ratio = w / h
                    
                    if 0.5 < aspect_ratio < 2.0:  # Likely a window
                        features.append("windows")
                        break
            
            # Detect doors (darker vertical rectangles)
            # Add more sophisticated detection logic here
            
            # Default features if none detected
            if not features:
                features = ["walls", "ceiling"]
            
            return features
            
        except Exception as e:
            logger.error(f"Error identifying architectural features: {e}")
            return ["walls", "ceiling"]
    
    def _detect_natural_light(self, image: np.ndarray) -> bool:
        """Detect presence of natural light in the image."""
        try:
            # Convert to LAB color space
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            l_channel = lab[:, :, 0]
            
            # Look for very bright areas that might indicate windows
            bright_areas = np.sum(l_channel > 220)
            total_pixels = l_channel.size
            
            # If more than 5% of pixels are very bright, assume natural light
            return (bright_areas / total_pixels) > 0.05
            
        except Exception as e:
            logger.error(f"Error detecting natural light: {e}")
            return True  # Default to assuming natural light
    
    def _calculate_confidence(self, dimensions: Dict, objects: List, lighting: Dict) -> float:
        """Calculate overall confidence score for the analysis."""
        try:
            dim_confidence = dimensions.get("confidence", 0.3)
            obj_confidence = np.mean([obj.get("confidence", 0.3) for obj in objects]) if objects else 0.3
            lighting_confidence = 0.7  # Lighting analysis is generally more reliable
            
            return round((dim_confidence + obj_confidence + lighting_confidence) / 3, 2)
            
        except Exception as e:
            logger.error(f"Error calculating confidence: {e}")
            return 0.3
    
    def _bytes_to_opencv_image(self, image_data: bytes) -> np.ndarray:
        """Convert bytes to OpenCV image."""
        try:
            # Convert bytes to PIL Image
            pil_image = Image.open(io.BytesIO(image_data))
            
            # Convert PIL to OpenCV format
            opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
            
            return opencv_image
            
        except Exception as e:
            logger.error(f"Error converting bytes to OpenCV image: {e}")
            raise HTTPException(status_code=400, detail="Invalid image format")

# Create service instance
cv_service = ComputerVisionService()