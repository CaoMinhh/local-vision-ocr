#!/bin/bash

# Local Vision OCR - Docker Deployment Script
# Run this script to deploy and test the application

set -e

echo "🐳 Local Vision OCR - Docker Deployment"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Docker installation
log_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed!"
    exit 1
fi
docker --version

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed!"
    exit 1
fi
docker compose version 2>/dev/null || docker-compose --version

# Navigate to deploy-docker directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"
log_info "Working directory: $SCRIPT_DIR"

# Copy .env if not exists
if [ ! -f ".env" ]; then
    log_info "Creating .env from .env.example..."
    cp .env.example .env
    log_info ".env created (you can edit it if needed)"
fi

# Step 1: Build images
log_info "Step 1: Building Docker images..."
docker compose build --no-cache
log_info "✅ Build completed"

# Step 2: Start services
log_info "Step 2: Starting services..."
docker compose up -d
log_info "✅ Services started"

# Step 3: Wait for services to be ready
log_info "Step 3: Waiting for services to be ready..."
sleep 5

# Step 4: Check service status
log_info "Step 4: Checking service status..."
echo ""
docker compose ps
echo ""

# Step 5: Check if OCR app is responding
log_info "Step 5: Testing OCR app connectivity..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8000/docs > /dev/null 2>&1; then
        log_info "✅ OCR app is responding at http://localhost:8000"
        break
    fi
    RETRY=$((RETRY + 1))
    if [ $RETRY -eq $MAX_RETRIES ]; then
        log_error "OCR app not responding after $MAX_RETRIES attempts"
        log_info "Checking logs..."
        docker compose logs ocr-app
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""

# Step 6: Check Ollama availability
log_info "Step 6: Checking Ollama service..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    log_info "✅ Ollama is responding"
    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*' | cut -d'"' -f4 | head -5)
    if [ -z "$MODELS" ]; then
        log_warn "No models found. Pull a model with:"
        log_warn "  docker exec ollama-service ollama pull nemotron3:33b"
    else
        log_info "Available models:"
        curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*' | cut -d'"' -f4
    fi
else
    log_warn "Ollama not responding yet (may still be initializing)"
fi

# Step 7: Check MongoDB
log_info "Step 7: Checking MongoDB..."
if docker exec mongo-ocr mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    log_info "✅ MongoDB is responding"
else
    log_warn "MongoDB health check failed (may still be initializing)"
fi

echo ""
log_info "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "  1. Pull a vision model:"
echo "     docker exec ollama-service ollama pull nemotron3:33b"
echo ""
echo "  2. Open web interface:"
echo "     http://localhost:8000"
echo ""
echo "  3. View API docs:"
echo "     http://localhost:8000/docs"
echo ""
echo "  4. Monitor logs:"
echo "     docker compose logs -f"
echo ""
echo "  5. Stop services:"
echo "     docker compose down"
echo ""
