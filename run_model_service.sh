#!/usr/bin/env bash
set -e

echo "===================================================="
echo " Starting TerraCascade Model Inference Service"
echo "===================================================="

cd "$(dirname "$0")/model-service"

# Check if python3 is available
if command -v python3 >/dev/null 2>&1; then
    echo "Starting FastAPI model service on http://localhost:8000 ..."
    python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
else
    echo "python3 not found. Please install Python 3.9+ or run with Docker:"
    echo "docker compose up --build"
fi
