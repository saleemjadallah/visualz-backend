#!/bin/bash
# Railway build script

echo "=== DesignVisualz Backend Build ==="

# Install system dependencies for OpenCV (if needed)
if command -v apt-get &> /dev/null; then
    echo "Installing system dependencies..."
    apt-get update && apt-get install -y \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender-dev \
        libgomp1 \
        libgl1-mesa-glx \
        || echo "Warning: Could not install system dependencies"
fi

# Try to install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip

# First try minimal requirements
if [ -f "requirements-minimal.txt" ]; then
    echo "Installing minimal requirements first..."
    pip install -r requirements-minimal.txt || echo "Warning: Some minimal packages failed"
fi

# Then try full requirements
if [ -f "requirements.txt" ]; then
    echo "Installing full requirements..."
    pip install -r requirements.txt || echo "Warning: Some packages failed to install"
fi

# Show installed packages
echo "Installed packages:"
pip list

echo "Build complete!"