# Authentication 403 Forbidden Fix

## Issue
The backend was returning `403 Forbidden` instead of `401 Unauthorized` for parametric furniture generation endpoints when authentication was missing or invalid.

## Root Cause
FastAPI's built-in `HTTPBearer` security class returns HTTP 403 by default when:
- No Authorization header is present
- The Authorization header format is invalid (not "Bearer <token>")
- The scheme is not "bearer" (case-insensitive)

This is by design in FastAPI's security implementation (see `fastapi/security/http.py`).

## Solution Implemented
Created a custom `HTTPBearer` class that returns 401 instead of 403 for consistency with REST API best practices:

1. Created `/app/core/custom_security.py` with a custom HTTPBearer implementation
2. Updated `/app/api/auth.py` to use the custom HTTPBearer
3. Updated `/app/api/websocket.py` to use the custom HTTPBearer

## Expected Behavior Now
- No Authorization header → 401 Unauthorized
- Invalid Bearer format → 401 Unauthorized
- Invalid/expired token → 401 Unauthorized (from get_current_user)
- Valid token but no permissions → 403 Forbidden (if implemented)

## Testing
Use the provided `test_auth.py` script to verify the authentication flow:
```bash
python test_auth.py
```

## Frontend Considerations
The frontend should handle both 401 and 403 status codes as authentication errors:
```javascript
if (response.status === 401 || response.status === 403) {
    // Handle authentication error
    // Redirect to login, refresh token, etc.
}
```