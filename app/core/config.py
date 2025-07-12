from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "DesignVisualz"
    ENVIRONMENT: str = "production"  # Changed default to production
    DEBUG: bool = False  # Changed default to False for production
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database - These will be overridden by Railway environment variables
    MONGODB_URL: str = "mongodb://localhost:27017/designvisualz"
    DATABASE_NAME: str = "designvisualz"
    
    # External APIs - These will be overridden by Railway environment variables
    OPENAI_API_KEY: str = ""
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # CORS and security
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3456,http://127.0.0.1:3456,https://visualz.xyz,https://www.visualz.xyz,https://visualz.events,https://www.visualz.events"
    ).split(",")
    ALLOWED_HOSTS: List[str] = os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1,*.railway.app,visualz.xyz,*.visualz.xyz,visualz.events,*.visualz.events"
    ).split(",")
    
    # Email settings (optional)
    EMAIL_HOST: str = os.getenv("EMAIL_HOST", "")
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", "587"))
    EMAIL_USERNAME: str = os.getenv("EMAIL_USERNAME", "")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "")
    
    # Railway deployment
    RAILWAY_STATIC_URL: str = os.getenv("RAILWAY_STATIC_URL", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        # Allow environment variables to override defaults
        env_prefix = ""  # No prefix needed since variable names match

settings = Settings()