#!/usr/bin/env python3
"""
Cultural Database Population Script
Populates MongoDB with comprehensive cultural design philosophy data
for AI event visualization system
"""

import pymongo
import os
from datetime import datetime
from bson import ObjectId
import json

def get_database_connection():
    """Get MongoDB database connection"""
    # Use the same connection string as the main application
    mongo_uri = os.getenv('MONGODB_URL', 'mongodb://admin:password@localhost:27017/designvisualz?authSource=admin')
    
    try:
        client = pymongo.MongoClient(mongo_uri)
        # Test connection
        client.admin.command('ping')
        db = client['designvisualz_cultural']
        print(f"Connected to MongoDB successfully")
        return db
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        print("Please ensure MongoDB is running and accessible")
        print(f"Connection string attempted: {mongo_uri}")
        return None

def create_indexes(db):
    """Create optimized indexes for performance"""
    print("Creating database indexes...")
    
    # Performance Indexes
    db.philosophies.create_index([("philosophyId", 1)])
    db.design_elements.create_index([("philosophyId", 1), ("elementType", 1)])
    db.event_applications.create_index([("philosophyId", 1), ("eventType", 1)])
    
    # Search Indexes
    db.philosophies.create_index([("name.en", "text"), ("coreValues", "text")])
    db.design_elements.create_index([("colors.culturalMeaning", "text")])
    
    # Geospatial Index for Vendors
    db.vendors.create_index([("location", "2dsphere")])
    
    print("Indexes created successfully")

def populate_philosophies(db):
    """Populate the philosophies collection"""
    print("Populating design philosophies...")
    
    philosophies_data = [
        {
            "_id": ObjectId(),
            "philosophyId": "wabi-sabi",
            "name": {
                "en": "Wabi-Sabi",
                "native": "侘び寂び"
            },
            "origin": {
                "country": "Japan",
                "region": "Multiple",
                "historicalPeriod": "15th-16th century",
                "rootedIn": "Zen Buddhism and tea ceremony traditions"
            },
            "coreValues": ["imperfection", "impermanence", "incompleteness", "natural beauty", "mindfulness"],
            "description": "Finding beauty in imperfection, impermanence, and incompleteness. Rooted in Zen Buddhism and tea ceremony traditions.",
            "culturalSensitivity": {
                "level": "high",
                "sacredElements": ["tea ceremony items", "tokonoma alcoves", "tatami mats"],
                "consultationRequired": True,
                "appropriationConcerns": [
                    "superficial use of terms",
                    "decorative misuse of sacred elements",
                    "commercializing spiritual practices"
                ],
                "respectfulUsage": [
                    "consult practitioners for tea ceremony elements",
                    "understand underlying philosophy",
                    "avoid mixing with incompatible aesthetics"
                ]
            },
            "compatibleWith": ["hygge", "modern-minimal"],
            "incompatibleWith": ["bella-figura-ornate"],
            "lastUpdated": datetime.now(),
            "validationStatus": "expert-reviewed",
            "sources": [
                "Society for Japanese Arts",
                "TOIRO Kitchen",
                "The Conversation Academic Research"
            ]
        },
        {
            "_id": ObjectId(),
            "philosophyId": "hygge",
            "name": {
                "en": "Hygge",
                "native": "Hygge"
            },
            "origin": {
                "country": "Denmark",
                "region": "Scandinavia",
                "historicalPeriod": "Traditional, popularized 20th century",
                "rootedIn": "Danish response to long, dark winters"
            },
            "coreValues": ["coziness", "togetherness", "comfort", "simple pleasures", "presence"],
            "description": "Creating cozy togetherness and comfortable conviviality, emphasizing presence and simple pleasures.",
            "culturalSensitivity": {
                "level": "medium",
                "sacredElements": ["fika traditions", "family gathering customs"],
                "consultationRequired": False,
                "appropriationConcerns": [
                    "commercializing beyond surface coziness",
                    "ignoring egalitarian values",
                    "reducing to mere aesthetic"
                ],
                "respectfulUsage": [
                    "understand community values",
                    "emphasize genuine comfort over luxury",
                    "respect seasonal traditions"
                ]
            },
            "compatibleWith": ["wabi-sabi", "modern-sustainable"],
            "incompatibleWith": ["bella-figura-formal"],
            "lastUpdated": datetime.now(),
            "validationStatus": "expert-reviewed",
            "sources": [
                "Denmark.dk Official",
                "SA Expeditions Cultural Guide",
                "Benjamin Moore Color Research"
            ]
        },
        {
            "_id": ObjectId(),
            "philosophyId": "bella-figura",
            "name": {
                "en": "Bella Figura",
                "native": "Bella Figura"
            },
            "origin": {
                "country": "Italy",
                "region": "Throughout Italy, Renaissance roots",
                "historicalPeriod": "Renaissance to present",
                "rootedIn": "Renaissance concept of presenting one's best self"
            },
            "coreValues": ["elegance", "style", "social grace", "excellence", "family honor"],
            "description": "Making a good impression through elegance and style, encompassing behavior, aesthetics, and social grace.",
            "culturalSensitivity": {
                "level": "high",
                "sacredElements": ["family traditions", "regional customs", "religious elements"],
                "consultationRequired": True,
                "appropriationConcerns": [
                    "stereotyping Italian culture",
                    "ignoring regional differences",
                    "superficial luxury without substance"
                ],
                "respectfulUsage": [
                    "respect regional differences",
                    "understand family values",
                    "source authentic materials"
                ]
            },
            "compatibleWith": ["savoir-vivre", "cultural-fusion"],
            "incompatibleWith": ["wabi-sabi-minimal"],
            "lastUpdated": datetime.now(),
            "validationStatus": "expert-reviewed",
            "sources": [
                "ResearchGate Cultural Studies",
                "Soletoscana Cultural Institute",
                "Walks of Italy Cultural Guide"
            ]
        },
        {
            "_id": ObjectId(),
            "philosophyId": "savoir-vivre",
            "name": {
                "en": "Savoir-Vivre",
                "native": "Savoir-Vivre"
            },
            "origin": {
                "country": "France",
                "region": "Throughout France, Parisian refinement",
                "historicalPeriod": "18th century to present",
                "rootedIn": "French art of living well"
            },
            "coreValues": ["refinement", "etiquette", "cultural sophistication", "joie de vivre", "intellectual discourse"],
            "description": "The art of living well through refinement, etiquette, and cultural sophistication. Combines savoir-faire with joie de vivre.",
            "culturalSensitivity": {
                "level": "high",
                "sacredElements": ["salon traditions", "wine culture", "culinary arts"],
                "consultationRequired": True,
                "appropriationConcerns": [
                    "pronunciation and terminology misuse",
                    "conflating Parisian with provincial styles",
                    "superficial luxury without cultural understanding"
                ],
                "respectfulUsage": [
                    "proper pronunciation essential",
                    "distinguish regional styles",
                    "understand intellectual traditions"
                ]
            },
            "compatibleWith": ["bella-figura", "cultural-fusion"],
            "incompatibleWith": ["hygge-casual"],
            "lastUpdated": datetime.now(),
            "validationStatus": "expert-reviewed",
            "sources": [
                "Best of France Cultural Institute",
                "French Art of Living Research",
                "Atelier de Hahn Traditional Designs"
            ]
        },
        {
            "_id": ObjectId(),
            "philosophyId": "modern-contemporary",
            "name": {
                "en": "Modern Contemporary",
                "native": "Modern Contemporary"
            },
            "origin": {
                "country": "International",
                "region": "Global, Bauhaus origins",
                "historicalPeriod": "20th century to present",
                "rootedIn": "Bauhaus principles and sustainable design"
            },
            "coreValues": ["functionality", "minimalism", "innovation", "sustainability", "accessibility"],
            "description": "Form follows function, emphasizing minimalism, innovation, and sustainability while adapting to current trends.",
            "culturalSensitivity": {
                "level": "medium",
                "sacredElements": ["accessibility standards", "environmental considerations"],
                "consultationRequired": False,
                "appropriationConcerns": [
                    "creating sterile environments",
                    "ignoring diverse cultural needs",
                    "over-emphasizing technology"
                ],
                "respectfulUsage": [
                    "ensure accessibility",
                    "respect diverse cultures",
                    "balance technology with humanity"
                ]
            },
            "compatibleWith": ["wabi-sabi", "hygge", "cultural-fusion"],
            "incompatibleWith": [],
            "lastUpdated": datetime.now(),
            "validationStatus": "expert-reviewed",
            "sources": [
                "Herman Miller Design Research",
                "Sustainable Design Institute",
                "Universal Design Foundation"
            ]
        },
        {
            "_id": ObjectId(),
            "philosophyId": "cultural-fusion",
            "name": {
                "en": "Cultural Fusion",
                "native": "Cultural Fusion"
            },
            "origin": {
                "country": "International",
                "region": "Global multicultural communities",
                "historicalPeriod": "Late 20th century to present",
                "rootedIn": "Multicultural societies and global connectivity"
            },
            "coreValues": ["respect", "authenticity", "collaboration", "mutual benefit", "cultural bridge-building"],
            "description": "Respectful blending of cultural traditions through collaboration, authenticity, and mutual benefit. Emphasizes fusion over appropriation.",
            "culturalSensitivity": {
                "level": "highest",
                "sacredElements": ["all cultural elements from represented traditions"],
                "consultationRequired": True,
                "appropriationConcerns": [
                    "using sacred elements without permission",
                    "superficial mixing without understanding",
                    "commercial exploitation of traditions"
                ],
                "respectfulUsage": [
                    "extensive consultation required",
                    "avoid sacred elements without permission",
                    "ensure mutual benefit",
                    "collaborate with cultural practitioners"
                ]
            },
            "compatibleWith": ["all-with-consultation"],
            "incompatibleWith": [],
            "lastUpdated": datetime.now(),
            "validationStatus": "expert-reviewed",
            "sources": [
                "The Cultural Consultants Network",
                "Association of National Advertisers Diversity Guidelines",
                "Academic Cultural Fusion Research"
            ]
        }
    ]
    
    # Clear existing data and insert new
    db.philosophies.delete_many({})
    result = db.philosophies.insert_many(philosophies_data)
    print(f"Inserted {len(result.inserted_ids)} design philosophies")

def populate_design_elements(db):
    """Populate design elements for each philosophy"""
    print("Populating design elements...")
    
    design_elements_data = [
        # Wabi-Sabi Elements
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
                    "seasonality": ["autumn", "winter"]
                },
                {
                    "name": "Warm Taupe",
                    "hex": "#988272",
                    "rgb": [152, 130, 114],
                    "culturalMeaning": "earth connection, stability",
                    "usage": ["ceramics", "wooden elements"],
                    "seasonality": ["all"]
                },
                {
                    "name": "Sage Green",
                    "hex": "#c8c8b6",
                    "rgb": [200, 200, 182],
                    "culturalMeaning": "natural wisdom, tranquility",
                    "usage": ["textiles", "natural elements"],
                    "seasonality": ["spring", "summer"]
                }
            ]
        },
        {
            "_id": ObjectId(),
            "philosophyId": "wabi-sabi",
            "elementType": "materials",
            "name": "Natural Materials",
            "materials": [
                {
                    "name": "Aged Wood",
                    "types": ["oak", "pine", "bamboo"],
                    "properties": {
                        "texture": "rough, weathered",
                        "finish": "natural, minimal treatment",
                        "sustainabilityRating": 5
                    },
                    "culturalSignificance": "impermanence, natural aging",
                    "suppliers": [
                        {
                            "name": "The Wabi Sabi Shop",
                            "location": "Japan",
                            "authenticity": "verified",
                            "priceRange": "$50-500"
                        }
                    ]
                },
                {
                    "name": "Raku Ceramics",
                    "types": ["tea bowls", "vases", "plates"],
                    "properties": {
                        "texture": "irregular, crackling",
                        "finish": "natural glazes",
                        "sustainabilityRating": 4
                    },
                    "culturalSignificance": "imperfection as beauty, tea ceremony",
                    "suppliers": [
                        {
                            "name": "MUSUBI KILN",
                            "location": "Japan",
                            "authenticity": "verified",
                            "priceRange": "$30-300"
                        }
                    ]
                }
            ]
        },
        # Hygge Elements
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
                    "culturalMeaning": "purity, comfort, simplicity",
                    "usage": ["walls", "linens", "ceramics"],
                    "seasonality": ["all"]
                },
                {
                    "name": "Gray Cashmere",
                    "hex": "#C8C4C1",
                    "rgb": [200, 196, 193],
                    "culturalMeaning": "softness, comfort, timelessness",
                    "usage": ["textiles", "furniture"],
                    "seasonality": ["winter", "autumn"]
                },
                {
                    "name": "Blush Pink",
                    "hex": "#F4D1C7",
                    "rgb": [244, 209, 199],
                    "culturalMeaning": "warmth, gentleness, home",
                    "usage": ["accents", "candles", "textiles"],
                    "seasonality": ["all"]
                }
            ]
        },
        # Bella Figura Elements
        {
            "_id": ObjectId(),
            "philosophyId": "bella-figura",
            "elementType": "colorPalette",
            "name": "Rich Jewel Tones",
            "colors": [
                {
                    "name": "Mediterranean Blue",
                    "hex": "#60797d",
                    "rgb": [96, 121, 125],
                    "culturalMeaning": "depth, sophistication, coastal heritage",
                    "usage": ["accent walls", "ceramics", "textiles"],
                    "seasonality": ["summer", "spring"]
                },
                {
                    "name": "Tuscan Terracotta",
                    "hex": "#AB5235",
                    "rgb": [171, 82, 53],
                    "culturalMeaning": "earth, tradition, warmth",
                    "usage": ["ceramics", "architectural elements"],
                    "seasonality": ["autumn", "all"]
                },
                {
                    "name": "Tuscan Gold",
                    "hex": "#DBAB85",
                    "rgb": [219, 171, 133],
                    "culturalMeaning": "luxury, heritage, sunlight",
                    "usage": ["accents", "metalwork", "frames"],
                    "seasonality": ["all"]
                }
            ]
        }
        # Additional elements for other philosophies would continue here...
    ]
    
    # Clear existing data and insert new
    db.design_elements.delete_many({})
    result = db.design_elements.insert_many(design_elements_data)
    print(f"Inserted {len(result.inserted_ids)} design elements")

def populate_event_applications(db):
    """Populate event applications for each philosophy"""
    print("Populating event applications...")
    
    event_applications_data = [
        {
            "_id": ObjectId(),
            "philosophyId": "wabi-sabi",
            "eventType": "tea-ceremony",
            "appropriateFor": ["intimate gatherings", "meditation sessions", "cultural education"],
            "inappropriateFor": ["large commercial events", "loud celebrations"],
            "guestCount": {
                "min": 2,
                "max": 12,
                "optimal": 6
            },
            "spatialRequirements": {
                "layout": "asymmetrical",
                "lighting": "natural, diffused",
                "essentialElements": ["tokonoma", "low entrance", "tatami mats"],
                "acoustics": "quiet, contemplative"
            },
            "culturalProtocols": [
                {
                    "phase": "arrival",
                    "requirement": "remove shoes",
                    "significance": "respect and humility"
                },
                {
                    "phase": "ceremony",
                    "requirement": "mindful movements",
                    "significance": "appreciation of process"
                }
            ],
            "seasonalConsiderations": {
                "spring": {
                    "priority": "high",
                    "elements": ["cherry blossoms", "fresh green"],
                    "meaning": "renewal and growth"
                },
                "autumn": {
                    "priority": "highest",
                    "elements": ["dried branches", "earth tones"],
                    "meaning": "appreciation of impermanence"
                }
            },
            "budget": {
                "low": 200,
                "medium": 800,
                "high": 2000,
                "currency": "USD"
            }
        },
        {
            "_id": ObjectId(),
            "philosophyId": "hygge",
            "eventType": "intimate-dinner",
            "appropriateFor": ["family gatherings", "close friends", "winter celebrations"],
            "inappropriateFor": ["formal business events", "large parties"],
            "guestCount": {
                "min": 4,
                "max": 12,
                "optimal": 8
            },
            "spatialRequirements": {
                "layout": "circular, conversation-focused",
                "lighting": "layered, warm, candles essential",
                "essentialElements": ["comfortable seating", "soft textiles", "fireplace or candles"],
                "acoustics": "intimate, conversational"
            },
            "culturalProtocols": [
                {
                    "phase": "arrival",
                    "requirement": "warm welcome",
                    "significance": "creating belonging"
                },
                {
                    "phase": "dining",
                    "requirement": "unhurried pace",
                    "significance": "savoring togetherness"
                }
            ],
            "seasonalConsiderations": {
                "winter": {
                    "priority": "highest",
                    "elements": ["heavy textiles", "warm lighting", "comfort foods"],
                    "meaning": "shelter from darkness"
                }
            },
            "budget": {
                "low": 150,
                "medium": 500,
                "high": 1200,
                "currency": "USD"
            }
        }
    ]
    
    # Clear existing data and insert new
    db.event_applications.delete_many({})
    result = db.event_applications.insert_many(event_applications_data)
    print(f"Inserted {len(result.inserted_ids)} event applications")

def populate_vendors(db):
    """Populate vendor information"""
    print("Populating vendor database...")
    
    vendors_data = [
        {
            "_id": ObjectId(),
            "name": "The Wabi Sabi Shop",
            "philosophies": ["wabi-sabi"],
            "location": {
                "type": "Point",
                "coordinates": [139.6917, 35.6895]  # Tokyo, Japan
            },
            "address": "Tokyo, Japan",
            "authenticity": "verified",
            "verificationLevel": "certified-authentic",
            "specialties": ["aged wood", "raku ceramics", "traditional tea items"],
            "priceRange": "$30-500",
            "contactInfo": {
                "website": "thewabisabishop.com",
                "email": "contact@wabisabishop.com"
            },
            "culturalCertification": {
                "certifiedBy": "Society for Japanese Arts",
                "validUntil": datetime(2025, 12, 31)
            }
        },
        {
            "_id": ObjectId(),
            "name": "HAY",
            "philosophies": ["hygge", "modern-contemporary"],
            "location": {
                "type": "Point",
                "coordinates": [12.5683, 55.6761]  # Copenhagen, Denmark
            },
            "address": "Copenhagen, Denmark",
            "authenticity": "verified",
            "verificationLevel": "expert-verified",
            "specialties": ["modern furniture", "textiles", "lighting"],
            "priceRange": "$50-2000",
            "contactInfo": {
                "website": "hay.dk",
                "email": "info@hay.dk"
            },
            "culturalCertification": {
                "certifiedBy": "Danish Design Institute",
                "validUntil": datetime(2025, 12, 31)
            }
        }
    ]
    
    # Clear existing data and insert new
    db.vendors.delete_many({})
    result = db.vendors.insert_many(vendors_data)
    print(f"Inserted {len(result.inserted_ids)} vendors")

def populate_fusion_compatibility(db):
    """Populate fusion compatibility matrix"""
    print("Populating fusion compatibility matrix...")
    
    compatibility_data = [
        {
            "_id": ObjectId(),
            "primaryPhilosophy": "wabi-sabi",
            "secondaryPhilosophy": "hygge",
            "compatibilityLevel": "high",
            "reason": "Both emphasize natural materials, comfort, and mindful living",
            "bridgeElements": ["natural wood", "soft lighting", "comfortable textiles"],
            "consultationRequired": False,
            "successfulExamples": ["Scandinavian-Japanese fusion homes", "Minimalist comfort spaces"]
        },
        {
            "_id": ObjectId(),
            "primaryPhilosophy": "bella-figura",
            "secondaryPhilosophy": "savoir-vivre",
            "compatibilityLevel": "high",
            "reason": "Both value elegance, refinement, and sophisticated presentation",
            "bridgeElements": ["luxury materials", "classical proportions", "formal protocols"],
            "consultationRequired": True,
            "successfulExamples": ["European luxury hotels", "International diplomatic events"]
        },
        {
            "_id": ObjectId(),
            "primaryPhilosophy": "wabi-sabi",
            "secondaryPhilosophy": "bella-figura",
            "compatibilityLevel": "low",
            "reason": "Fundamental conflict between imperfection/simplicity and perfection/ornament",
            "bridgeElements": [],
            "consultationRequired": True,
            "warnings": ["Risk of cultural misrepresentation", "Philosophical contradictions"]
        }
    ]
    
    # Clear existing data and insert new
    db.fusion_compatibility.delete_many({})
    result = db.fusion_compatibility.insert_many(compatibility_data)
    print(f"Inserted {len(result.inserted_ids)} compatibility rules")

def populate_cultural_experts(db):
    """Populate cultural experts database"""
    print("Populating cultural experts database...")
    
    experts_data = [
        {
            "_id": ObjectId(),
            "name": "Dr. Akiko Tanaka",
            "expertise": ["wabi-sabi", "japanese-tea-ceremony"],
            "credentials": ["PhD Cultural Anthropology", "Tea Master Certificate"],
            "institution": "Society for Japanese Arts",
            "contactInfo": {
                "email": "a.tanaka@japaneseart.org",
                "availability": "consulting"
            },
            "languages": ["Japanese", "English"],
            "consultationRate": "$150/hour",
            "specializations": ["tea ceremony protocols", "zen aesthetics", "sacred space design"]
        },
        {
            "_id": ObjectId(),
            "name": "Lars Nielsen",
            "expertise": ["hygge", "scandinavian-design"],
            "credentials": ["Design Institute Denmark", "Cultural Heritage Specialist"],
            "institution": "Danish Design Institute",
            "contactInfo": {
                "email": "l.nielsen@danishdesign.dk",
                "availability": "consulting"
            },
            "languages": ["Danish", "English", "Swedish"],
            "consultationRate": "$120/hour",
            "specializations": ["hygge authenticity", "sustainable design", "community spaces"]
        }
    ]
    
    # Clear existing data and insert new
    db.cultural_experts.delete_many({})
    result = db.cultural_experts.insert_many(experts_data)
    print(f"Inserted {len(result.inserted_ids)} cultural experts")

def create_validation_rules(db):
    """Create validation rules collection"""
    print("Creating validation rules...")
    
    validation_rules = [
        {
            "_id": ObjectId(),
            "ruleType": "cultural_sensitivity",
            "philosophyId": "wabi-sabi",
            "triggerConditions": {
                "elementTypes": ["tea-ceremony-items", "tokonoma", "sacred-spaces"],
                "eventTypes": ["commercial", "entertainment"]
            },
            "validationLevel": "expert-required",
            "message": "Tea ceremony elements require consultation with certified practitioners",
            "blockers": ["superficial commercial use", "mixing with loud entertainment"],
            "recommendations": ["consult cultural expert", "consider alternative elements"]
        },
        {
            "_id": ObjectId(),
            "ruleType": "fusion_compatibility",
            "primaryPhilosophy": "any",
            "secondaryPhilosophy": "cultural-fusion",
            "triggerConditions": {
                "guestCount": {"$gt": 50},
                "culturalMix": {"$gt": 2}
            },
            "validationLevel": "mandatory-consultation",
            "message": "Large multicultural events require cultural consultant oversight",
            "requirements": ["cultural expert approval", "community representative input"]
        }
    ]
    
    # Create validation rules collection
    db.validation_rules.delete_many({})
    result = db.validation_rules.insert_many(validation_rules)
    print(f"Inserted {len(result.inserted_ids)} validation rules")

def main():
    """Main execution function"""
    print("Starting Cultural Database Population...")
    print("=" * 50)
    
    # Get database connection
    db = get_database_connection()
    if db is None:
        return False
    
    try:
        # Create indexes
        create_indexes(db)
        
        # Populate all collections
        populate_philosophies(db)
        populate_design_elements(db)
        populate_event_applications(db)
        populate_vendors(db)
        populate_fusion_compatibility(db)
        populate_cultural_experts(db)
        create_validation_rules(db)
        
        print("\n" + "=" * 50)
        print("Cultural Database Population Complete!")
        print("=" * 50)
        
        # Display summary
        collections = [
            "philosophies", "design_elements", "event_applications", 
            "vendors", "fusion_compatibility", "cultural_experts", "validation_rules"
        ]
        
        print("\nDatabase Summary:")
        for collection_name in collections:
            count = db[collection_name].count_documents({})
            print(f"  {collection_name}: {count} documents")
        
        return True
        
    except Exception as e:
        print(f"Error during population: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 