#!/bin/bash

# Ultimate Contest Radar - Development Startup Script
# This script starts the complete development environment with Docker

set -e

echo "🚀 Starting Ultimate Contest Radar Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

echo "🔧 Starting development services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are healthy
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U contest_user -d contest_radar > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📱 Services available:"
echo "   • Ultimate Contest Radar: http://localhost:3000"
echo "   • Adminer (DB Admin):      http://localhost:8080"
echo "   • MailHog (Email Testing): http://localhost:8025"
echo ""
echo "🛠️  Quick commands:"
echo "   • View logs:           docker-compose logs -f"
echo "   • Stop services:       docker-compose down"
echo "   • Restart app only:    docker-compose restart app"
echo "   • Access app shell:    docker-compose exec app sh"
echo "   • Access db shell:     docker-compose exec postgres psql -U contest_user -d contest_radar"
echo ""
echo "Happy coding! 🎯"
