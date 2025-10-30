#!/bin/bash
# Basic load test script using Apache Bench (ab) or curl

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

HOST=${1:-localhost:8080}
CONCURRENT=${2:-10}
REQUESTS=${3:-100}

echo -e "${YELLOW}=== Load Test ===${NC}"
echo "Host: ${HOST}"
echo "Concurrent: ${CONCURRENT}"
echo "Total Requests: ${REQUESTS}"
echo ""

# Check if Apache Bench is available
if command -v ab &> /dev/null; then
    echo "Using Apache Bench..."
    ab -n ${REQUESTS} -c ${CONCURRENT} http://${HOST}/
elif command -v wrk &> /dev/null; then
    echo "Using wrk..."
    wrk -t${CONCURRENT} -c${CONCURRENT} -d10s http://${HOST}/
else
    echo "Simulating load with curl..."
    for i in $(seq 1 ${REQUESTS}); do
        curl -s -o /dev/null http://${HOST}/ &
        if [ $((i % CONCURRENT)) -eq 0 ]; then
            wait
        fi
    done
    wait
    echo -e "${GREEN}✓ Load test completed${NC}"
fi
