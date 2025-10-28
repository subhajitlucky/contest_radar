#!/bin/bash

# Ultimate Contest Radar - Development Stop Script
# This script stops and cleans up the development environment

set -e

echo "🛑 Stopping Ultimate Contest Radar Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running."
    exit 1
fi

echo "🔧 Stopping services..."
docker-compose down

echo "🧹 Cleaning up..."
# Optionally remove volumes (uncomment if you want to reset data)
# docker-compose down -v

echo "✅ Development environment stopped successfully!"
echo ""
echo "💡 To start again, run: ./scripts/dev.sh"
