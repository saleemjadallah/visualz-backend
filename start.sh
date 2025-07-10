#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-8000}

echo "Starting DesignVisualz API on port $PORT"
echo "Environment: $ENVIRONMENT"

# Start the FastAPI server
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1