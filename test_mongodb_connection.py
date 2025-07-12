#!/usr/bin/env python3
"""Test MongoDB connection with your connection string"""
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

async def test_mongodb_connection():
    """Test MongoDB connection"""
    # Get MongoDB URL from environment or command line
    mongodb_url = os.getenv('MONGODB_URL')
    if len(sys.argv) > 1:
        mongodb_url = sys.argv[1]
    
    if not mongodb_url:
        print("❌ No MongoDB URL provided")
        print("Usage: MONGODB_URL='your-connection-string' python3 test_mongodb_connection.py")
        print("   or: python3 test_mongodb_connection.py 'your-connection-string'")
        return
    
    # Hide password in logs
    if '@' in mongodb_url:
        parts = mongodb_url.split('@')
        visible_url = parts[0].split('://')[0] + '://***:***@' + parts[1]
    else:
        visible_url = mongodb_url
    
    print(f"Testing MongoDB connection...")
    print(f"URL: {visible_url}")
    
    try:
        # Create client with same settings as your app
        client = AsyncIOMotorClient(
            mongodb_url,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=20000,
            retryWrites=True
        )
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # List databases
        dbs = await client.list_database_names()
        print(f"✅ Available databases: {', '.join(dbs)}")
        
        # Test specific database
        db_name = os.getenv('DATABASE_NAME', 'designvisualz')
        db = client[db_name]
        collections = await db.list_collection_names()
        print(f"✅ Collections in '{db_name}': {', '.join(collections) if collections else 'none yet'}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Connection failed: {type(e).__name__}: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check your MongoDB Atlas Network Access settings")
        print("   - Add 0.0.0.0/0 to allow all IPs (for testing)")
        print("   - Or add Railway's IP ranges")
        print("2. Verify your connection string format:")
        print("   - Should be: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority")
        print("3. Check username and password are correct")
        print("4. Ensure database user has proper permissions")

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())