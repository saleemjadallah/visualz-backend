from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseConnection:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

database = DatabaseConnection()

async def connect_to_mongo():
    """Create database connection"""
    try:
        # Enhanced MongoDB connection with SSL/TLS settings
        database.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=20000,
            retryWrites=True
        )
        database.database = database.client[settings.DATABASE_NAME]
        
        # Test the connection
        await database.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    try:
        if database.client:
            database.client.close()
            logger.info("Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")

def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return database.database

# Connection lifecycle management
async def init_db():
    """Initialize database connection"""
    await connect_to_mongo()

async def close_db():
    """Close database connection"""
    await close_mongo_connection()