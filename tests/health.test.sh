#!/bin/bash
# Health check test script

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

HOST=${1:-localhost:8080}

echo "Testing health endpoint on ${HOST}..."

# Test health endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" http://${HOST}/health)

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    exit 0
else
    echo -e "${RED}✗ Health check failed (HTTP ${response})${NC}"
    exit 1
fi
