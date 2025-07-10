# DesignVisualz Backend API

AI-powered event visualization platform with parametric furniture generation and cultural intelligence.

## 🚀 Live API

**Production URL:** https://visualz.xyz

**API Documentation:** https://visualz.xyz/docs

## 🎯 Core Features

### AI Parametric Furniture Generation
- **Endpoint:** `POST /api/parametric-furniture/generate`
- **Description:** Generate procedural furniture with cultural intelligence
- **Supported Types:** Chair, Table, Sofa, Bookshelf, Desk, Bed, Dresser, Coffee Table
- **Cultural Styles:** Japanese, French, Scandinavian, Italian, Modern, Minimalist, Traditional, Contemporary

### 3D Export Pipeline
- **Endpoint:** `POST /api/parametric-furniture/export/{furniture_id}`
- **Formats:** GLTF, GLB, OBJ, STL
- **Quality Levels:** Low, Medium, High
- **Features:** Compression, cultural metadata, materials

### Cultural Intelligence
- **Endpoint:** `GET /api/cultural/elements`
- **Description:** Comprehensive cultural database with authenticity validation
- **Features:** Cultural appropriateness scoring, design principles, alternatives

### Computer Vision
- **Endpoint:** `POST /api/cv/analyze-space`
- **Description:** Space analysis, lighting evaluation, style classification
- **Features:** Room dimension estimation, object detection, color extraction

### Real-time Collaboration
- **Endpoint:** `WebSocket /api/ws/project/{project_id}`
- **Description:** Multi-user design collaboration
- **Features:** Real-time furniture movement, chat, presence tracking

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register          # Register new user
POST /api/auth/login            # User login
GET  /api/auth/me               # Get current user
POST /api/auth/logout           # User logout
```

### Parametric Furniture Generation
```
POST /api/parametric-furniture/generate                    # Generate furniture
POST /api/parametric-furniture/export/{furniture_id}       # Export to format
GET  /api/parametric-furniture/download/{export_id}        # Download file
POST /api/parametric-furniture/preview                     # Preview generation
GET  /api/parametric-furniture/supported-types             # Get supported options
```

### Projects & Designs
```
GET    /api/projects/                    # List projects
POST   /api/projects/                    # Create project
GET    /api/projects/{project_id}        # Get project
PUT    /api/projects/{project_id}        # Update project
DELETE /api/projects/{project_id}        # Delete project

GET    /api/designs/                     # List designs
POST   /api/designs/                     # Create design
GET    /api/designs/{design_id}          # Get design
PUT    /api/designs/{design_id}          # Update design
DELETE /api/designs/{design_id}          # Delete design
```

### AI Services
```
POST /api/ai/generate-design              # Generate 2D design
POST /api/ai/generate-cultural-design     # Culturally-informed design
POST /api/ai/generate-fusion-design       # Multi-cultural fusion
POST /api/ai/cultural-recommendations     # Cultural recommendations
POST /api/ai/validate-cultural-sensitivity # Cultural validation
```

### File Uploads
```
POST /api/uploads/space-photo/{project_id}           # Upload space photo
POST /api/uploads/design-image/{design_id}           # Upload design image
POST /api/uploads/multiple-space-photos/{project_id} # Batch upload
GET  /api/uploads/images                             # List user images
DELETE /api/uploads/image/{public_id}                # Delete image
```

### Computer Vision
```
POST /api/cv/analyze-space         # Analyze space from image
POST /api/cv/detect-objects        # Detect objects in image
POST /api/cv/analyze-lighting      # Analyze lighting conditions
POST /api/cv/classify-style        # Classify architectural style
POST /api/cv/extract-colors        # Extract color palette
```

### Cultural Intelligence
```
GET  /api/cultural/elements                    # Get cultural elements
POST /api/cultural/validate                    # Validate cultural appropriateness
GET  /api/cultural/categories                  # Get cultural categories
POST /api/cultural/categorize                  # Categorize cultural elements
GET  /api/cultural-philosophy/                 # List cultural philosophies
GET  /api/cultural-philosophy/{philosophy_id}  # Get specific philosophy
```

## 🌍 Cultural Styles Supported

### Japanese (Wabi-Sabi)
- **Principles:** Minimalism, natural materials, harmony with nature
- **Features:** Lower seating, tapered legs, natural finishes
- **Authenticity:** Research-based traditional techniques

### French (Classical Elegance)
- **Principles:** Refinement, attention to detail, classic proportions
- **Features:** Ornate details, curved elements, luxury finishes
- **Authenticity:** Historical design references

### Scandinavian (Hygge)
- **Principles:** Functionality, simplicity, clean lines
- **Features:** Light colors, natural wood, minimal ornamentation
- **Authenticity:** Nordic design traditions

### Italian (Bella Figura)
- **Principles:** Craftsmanship, artistic flair, bold design
- **Features:** Premium materials, sophisticated proportions
- **Authenticity:** Italian design heritage

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **CORS Protection:** Cross-origin resource sharing configured
- **Input Validation:** Comprehensive request validation
- **Rate Limiting:** API rate limiting (future implementation)
- **Cultural Sensitivity:** Appropriateness validation system

## 🏗️ Architecture

### Backend Stack
- **Framework:** FastAPI (Python 3.11)
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary
- **AI Services:** OpenAI GPT-4
- **3D Processing:** Trimesh, PyGLTF
- **Real-time:** WebSockets
- **Deployment:** Railway

### Key Services
- **Parametric Generation Service:** Procedural furniture generation
- **Geometry Export Service:** 3D model export pipeline
- **Cultural Intelligence Service:** Cultural validation and categorization
- **Computer Vision Service:** Image analysis and space understanding
- **WebSocket Service:** Real-time collaboration

## 📈 Performance

### Generation Times
- **Chair:** ~2-3 seconds
- **Table:** ~1-2 seconds
- **Complex furniture:** ~3-4 seconds

### Export Sizes
- **Low quality:** 50-100KB
- **Medium quality:** 100-500KB
- **High quality:** 500KB-2MB

### Cultural Authenticity
- **Validation accuracy:** 90%+
- **Cultural database:** 1000+ elements
- **Design principles:** 4 major philosophies

## 🔄 Development

### Local Setup
```bash
# Clone repository
git clone https://github.com/saleemjadallah/visualz-backend.git
cd visualz-backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
uvicorn app.main:app --reload --port 8000
```

### Environment Variables
```env
# Database
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=your_database_name

# AI Services
OPENAI_API_KEY=your_openai_api_key

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Security
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Deployment
ENVIRONMENT=production
DEBUG=False
RAILWAY_STATIC_URL=https://visualz.xyz
PORT=8000
```

## 📚 API Examples

### Generate Parametric Chair
```python
import requests

response = requests.post("https://visualz.xyz/api/parametric-furniture/generate", 
    headers={"Authorization": "Bearer YOUR_TOKEN"},
    json={
        "furniture_type": "chair",
        "cultural_style": "japanese",
        "dimensions": {
            "seat_width": 0.45,
            "seat_height": 0.40
        },
        "materials": {
            "seat": "wood",
            "frame": "wood"
        },
        "colors": {
            "primary": "#8B4513",
            "secondary": "#654321"
        },
        "cultural_elements": {
            "style": "japanese",
            "authenticity": 0.9
        },
        "comfort_level": 1.0,
        "durability": 1.2,
        "style_intensity": 0.8
    }
)

furniture_data = response.json()
furniture_id = furniture_data["furniture_id"]
```

### Export to GLB Format
```python
response = requests.post(f"https://visualz.xyz/api/parametric-furniture/export/{furniture_id}",
    headers={"Authorization": "Bearer YOUR_TOKEN"},
    json={
        "format": "glb",
        "quality": "high",
        "cultural_metadata": True,
        "include_materials": True,
        "compress": True
    }
)

export_data = response.json()
download_url = export_data["download_url"]
```

### Download Generated Model
```python
response = requests.get(f"https://visualz.xyz{download_url}",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)

with open("generated_chair.glb", "wb") as f:
    f.write(response.content)
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **API Issues:** Create an issue on GitHub
- **Documentation:** https://visualz.xyz/docs
- **Email:** support@visualz.xyz

---

**DesignVisualz** - Revolutionizing event design with AI-powered parametric generation and cultural intelligence.