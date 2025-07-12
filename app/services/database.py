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
        logger.info(f"Attempting to connect to MongoDB...")
        logger.info(f"Database name: {settings.DATABASE_NAME}")
        logger.info(f"MongoDB URL: {settings.MONGODB_URL[:30]}..." if settings.MONGODB_URL else "NOT SET")
        
        # Check if MongoDB URL is properly set
        if not settings.MONGODB_URL or settings.MONGODB_URL.startswith("your-mongodb") or settings.MONGODB_URL == "mongodb://localhost:27017/designvisualz":
            logger.error("MongoDB URL is not properly configured. Please set MONGODB_URL environment variable in Railway.")
            logger.error("Check Railway Variables tab and ensure MONGODB_URL is set with your MongoDB Atlas connection string.")
            logger.error("Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority")
            raise ValueError("MongoDB URL not configured. Set MONGODB_URL in Railway environment variables.")
        
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
        logger.error(f"MongoDB URL configured: {bool(settings.MONGODB_URL and not settings.MONGODB_URL.startswith('your-mongodb'))}")
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