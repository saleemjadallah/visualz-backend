from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "DesignVisualz"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database - Default with authentication for Docker MongoDB
    MONGODB_URL: str = "mongodb://admin:password@localhost:27017/designvisualz?authSource=admin"
    DATABASE_NAME: str = "designvisualz"
    
    # External APIs
    OPENAI_API_KEY: str = ""
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # CORS and security
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3456", 
        "http://127.0.0.1:3456",
        "https://visualz.xyz",
        "https://www.visualz.xyz",
        "https://frontend.visualz.xyz",
        "https://app.visualz.xyz",
        "https://visualz.events",
        "https://www.visualz.events"
    ]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*.railway.app", "visualz.xyz", "*.visualz.xyz", "visualz.events", "*.visualz.events"]
    
    # Email settings (optional)
    EMAIL_HOST: str = ""
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    
    # Railway deployment
    RAILWAY_STATIC_URL: str = ""
    PORT: int = int(os.getenv("PORT", "8000"))
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()