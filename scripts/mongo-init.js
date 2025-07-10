// MongoDB initialization script
db = db.getSiblingDB('designvisualz');

// Create collections with indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "created_at": 1 });

db.projects.createIndex({ "user_id": 1 });
db.projects.createIndex({ "created_at": 1 });
db.projects.createIndex({ "status": 1 });

db.designs.createIndex({ "project_id": 1 });
db.designs.createIndex({ "user_id": 1 });
db.designs.createIndex({ "created_at": 1 });

db.cultural_elements.createIndex({ "culture": 1 });
db.cultural_elements.createIndex({ "category": 1 });

print("Database initialized successfully");