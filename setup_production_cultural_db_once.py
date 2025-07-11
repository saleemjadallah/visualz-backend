#!/usr/bin/env python3
"""
ONE-TIME PRODUCTION CULTURAL DATABASE SETUP
This script creates and populates the cultural database in production MongoDB
Run this once after deployment to fix the cultural service
"""

import pymongo
import os
import sys
from datetime import datetime
from bson import ObjectId

# Use production environment variables or fallback
MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://admin:password@localhost:27017/designvisualz?authSource=admin')

def main():
    print("🚀 Setting up production cultural database...")
    print(f"📡 Connecting to: {MONGODB_URL.replace(MONGODB_URL.split('@')[0].split('//')[1], '***')}")
    
    try:
        # Connect to production MongoDB
        client = pymongo.MongoClient(MONGODB_URL)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to production MongoDB successfully")
        
        # Get the cultural database
        cultural_db = client['designvisualz_cultural']
        
        # Check if already populated
        existing_count = cultural_db.philosophies.count_documents({})
        if existing_count > 0:
            print(f"⚠️  Cultural database already has {existing_count} philosophies")
            response = input("Continue anyway? (y/N): ")
            if response.lower() != 'y':
                print("❌ Setup cancelled")
                return
        
        # Create core philosophies
        philosophies_data = [
            {
                "_id": ObjectId(),
                "philosophyId": "wabi-sabi",
                "name": {"en": "Wabi-Sabi", "native": "侘び寂び"},
                "origin": {
                    "country": "Japan",
                    "region": "Multiple",
                    "historicalPeriod": "15th-16th century"
                },
                "coreValues": ["imperfection", "impermanence", "incompleteness"],
                "description": "Finding beauty in imperfection, impermanence, and incompleteness",
                "culturalSensitivity": {
                    "level": "high",
                    "sacredElements": ["tea ceremony items", "tokonoma alcoves"],
                    "consultationRequired": True,
                    "appropriationConcerns": ["superficial use of terms", "decorative misuse"]
                },
                "compatibleWith": ["hygge", "modern-minimal"],
                "lastUpdated": datetime.now(),
                "validationStatus": "expert-reviewed"
            },
            {
                "_id": ObjectId(),
                "philosophyId": "hygge",
                "name": {"en": "Hygge", "native": "Hygge"},
                "origin": {
                    "country": "Denmark",
                    "region": "Scandinavia",
                    "historicalPeriod": "Traditional"
                },
                "coreValues": ["coziness", "togetherness", "comfort"],
                "description": "Creating cozy togetherness and comfortable conviviality",
                "culturalSensitivity": {
                    "level": "medium",
                    "consultationRequired": False,
                    "appropriationConcerns": ["commercializing beyond surface coziness"]
                },
                "compatibleWith": ["wabi-sabi", "modern-sustainable"],
                "lastUpdated": datetime.now(),
                "validationStatus": "expert-reviewed"
            },
            {
                "_id": ObjectId(),
                "philosophyId": "modern-contemporary",
                "name": {"en": "Modern Contemporary", "native": "Modern Contemporary"},
                "origin": {
                    "country": "International",
                    "region": "Global",
                    "historicalPeriod": "20th century to present"
                },
                "coreValues": ["functionality", "minimalism", "innovation", "sustainability"],
                "description": "Form follows function, emphasizing minimalism and sustainability",
                "culturalSensitivity": {
                    "level": "low",
                    "consultationRequired": False,
                    "appropriationConcerns": ["creating sterile environments"]
                },
                "compatibleWith": ["wabi-sabi", "hygge"],
                "lastUpdated": datetime.now(),
                "validationStatus": "expert-reviewed"
            }
        ]
        
        # Insert philosophies
        cultural_db.philosophies.delete_many({})  # Clear existing
        result = cultural_db.philosophies.insert_many(philosophies_data)
        print(f"✅ Inserted {len(result.inserted_ids)} philosophies")
        
        # Create design elements
        design_elements_data = [
            {
                "_id": ObjectId(),
                "philosophyId": "wabi-sabi",
                "elementType": "colorPalette",
                "name": "Earth Tones",
                "colors": [
                    {
                        "name": "Soft Lavender",
                        "hex": "#ddccff",
                        "rgb": [221, 204, 255],
                        "culturalMeaning": "transience, subtle beauty",
                        "usage": ["textiles", "accent walls"],
                        "seasonality": ["all"]
                    },
                    {
                        "name": "Warm Taupe",
                        "hex": "#988272",
                        "rgb": [152, 130, 114],
                        "culturalMeaning": "earth connection",
                        "usage": ["ceramics", "wood"],
                        "seasonality": ["all"]
                    }
                ]
            },
            {
                "_id": ObjectId(),
                "philosophyId": "hygge",
                "elementType": "colorPalette",
                "name": "Warm Neutrals",
                "colors": [
                    {
                        "name": "Cotton White",
                        "hex": "#F0F0F0",
                        "rgb": [240, 240, 240],
                        "culturalMeaning": "comfort, simplicity",
                        "usage": ["walls", "linens"],
                        "seasonality": ["all"]
                    },
                    {
                        "name": "Gray Cashmere",
                        "hex": "#C8C4C1",
                        "rgb": [200, 196, 193],
                        "culturalMeaning": "softness, timelessness",
                        "usage": ["textiles", "furniture"],
                        "seasonality": ["winter", "autumn"]
                    }
                ]
            },
            {
                "_id": ObjectId(),
                "philosophyId": "modern-contemporary",
                "elementType": "colorPalette",
                "name": "Monochromatic",
                "colors": [
                    {
                        "name": "Pure White",
                        "hex": "#FFFFFF",
                        "rgb": [255, 255, 255],
                        "culturalMeaning": "clarity, minimalism",
                        "usage": ["walls", "surfaces"],
                        "seasonality": ["all"]
                    },
                    {
                        "name": "Charcoal",
                        "hex": "#36454F",
                        "rgb": [54, 69, 79],
                        "culturalMeaning": "sophistication, depth",
                        "usage": ["accents", "furniture"],
                        "seasonality": ["all"]
                    }
                ]
            }
        ]
        
        cultural_db.design_elements.delete_many({})
        result = cultural_db.design_elements.insert_many(design_elements_data)
        print(f"✅ Inserted {len(result.inserted_ids)} design elements")
        
        # Create basic event applications
        event_applications_data = [
            {
                "_id": ObjectId(),
                "philosophyId": "hygge",
                "eventType": "intimate-dinner",
                "appropriateFor": ["family gatherings", "close friends"],
                "guestCount": {"min": 4, "max": 12, "optimal": 8},
                "spatialRequirements": {
                    "layout": "circular",
                    "lighting": "warm, layered",
                    "essentialElements": ["candles", "soft textiles"]
                },
                "budget": {"low": 150, "medium": 500, "high": 1200}
            },
            {
                "_id": ObjectId(),
                "philosophyId": "modern-contemporary",
                "eventType": "product-launch",
                "appropriateFor": ["tech conferences", "business events"],
                "guestCount": {"min": 20, "max": 200, "optimal": 75},
                "spatialRequirements": {
                    "layout": "open",
                    "lighting": "bright, clean",
                    "essentialElements": ["AV equipment", "minimal decor"]
                },
                "budget": {"low": 1000, "medium": 5000, "high": 15000}
            }
        ]
        
        cultural_db.event_applications.delete_many({})
        result = cultural_db.event_applications.insert_many(event_applications_data)
        print(f"✅ Inserted {len(result.inserted_ids)} event applications")
        
        # Create basic fusion compatibility
        fusion_data = [
            {
                "_id": ObjectId(),
                "primaryPhilosophy": "wabi-sabi",
                "secondaryPhilosophy": "hygge",
                "compatibilityLevel": "high",
                "reason": "Both emphasize natural materials and comfort",
                "bridgeElements": ["natural wood", "soft lighting"],
                "consultationRequired": False
            }
        ]
        
        cultural_db.fusion_compatibility.delete_many({})
        result = cultural_db.fusion_compatibility.insert_many(fusion_data)
        print(f"✅ Inserted {len(result.inserted_ids)} fusion compatibility rules")
        
        # Create indexes for performance
        print("🔧 Creating indexes...")
        cultural_db.philosophies.create_index([("philosophyId", 1)])
        cultural_db.design_elements.create_index([("philosophyId", 1), ("elementType", 1)])
        cultural_db.event_applications.create_index([("philosophyId", 1), ("eventType", 1)])
        print("✅ Indexes created")
        
        # Final verification
        total_docs = (
            cultural_db.philosophies.count_documents({}) +
            cultural_db.design_elements.count_documents({}) +
            cultural_db.event_applications.count_documents({}) +
            cultural_db.fusion_compatibility.count_documents({})
        )
        
        print(f"\n🎉 Production cultural database setup complete!")
        print(f"📊 Total documents created: {total_docs}")
        print(f"🗄️ Database: designvisualz_cultural")
        print(f"📋 Collections: philosophies, design_elements, event_applications, fusion_compatibility")
        print(f"\n✨ Your cultural service should now work in production!")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error setting up cultural database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 