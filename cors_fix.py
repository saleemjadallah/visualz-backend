"""Emergency CORS fix - allows all origins temporarily"""

# List of allowed origins
ALLOWED_ORIGINS = [
    "https://visualz.events",
    "https://www.visualz.events",
    "https://visualz.xyz",
    "https://www.visualz.xyz",
    "http://localhost:3000",
    "http://localhost:3456",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3456"
]

# For emergency fix, use wildcard
CORS_ALLOW_ALL = True  # Set to False for production

if CORS_ALLOW_ALL:
    print("⚠️  WARNING: CORS is allowing ALL origins - for testing only!")
    CORS_ORIGINS = ["*"]
else:
    CORS_ORIGINS = ALLOWED_ORIGINS

print(f"CORS Origins configured: {CORS_ORIGINS}")