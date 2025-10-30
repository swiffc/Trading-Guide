#!/bin/bash
# Integration test script

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

HOST=${1:-localhost:8080}
FAILED=0

echo "Running integration tests on ${HOST}..."
echo ""

# Test function
test_endpoint() {
    local path=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo -n "Testing ${description}... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" http://${HOST}${path})
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP ${response})"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected ${expected_status}, got ${response})"
        FAILED=$((FAILED + 1))
    fi
}

# Run tests
echo -e "${YELLOW}=== Page Tests ===${NC}"
test_endpoint "/" 200 "Home page"
test_endpoint "/index.html" 200 "Index page"
test_endpoint "/pages/core-philosophy.html" 200 "Core Philosophy page"
test_endpoint "/pages/patterns.html" 200 "Patterns page"
test_endpoint "/pages/quick-reference.html" 200 "Quick Reference page"

echo ""
echo -e "${YELLOW}=== Static Asset Tests ===${NC}"
test_endpoint "/styles.css" 200 "Main stylesheet"
test_endpoint "/js/main.js" 200 "Main JavaScript"
test_endpoint "/js/navigation.js" 200 "Navigation JavaScript"
test_endpoint "/manifest.json" 200 "PWA Manifest"
test_endpoint "/service-worker.js" 200 "Service Worker"

echo ""
echo -e "${YELLOW}=== Health & Error Tests ===${NC}"
test_endpoint "/health" 200 "Health endpoint"
test_endpoint "/nonexistent" 404 "404 error handling"

# Summary
echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}=== All tests passed! ===${NC}"
    exit 0
else
    echo -e "${RED}=== ${FAILED} test(s) failed ===${NC}"
    exit 1
fi
