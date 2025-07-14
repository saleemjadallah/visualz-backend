#!/usr/bin/env python3
"""Generate a secure SECRET_KEY for JWT tokens"""
import secrets

def generate_secret_key():
    """Generate a secure random secret key"""
    return secrets.token_urlsafe(32)

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("Generated SECRET_KEY for Railway environment variables:")
    print("=" * 50)
    print(secret_key)
    print("=" * 50)
    print("\nAdd this to your Railway environment variables:")
    print(f"SECRET_KEY={secret_key}")
    print("\nThis key is used for signing JWT tokens securely.")