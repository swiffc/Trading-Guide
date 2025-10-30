#!/bin/bash
# Deployment script for Trading Guide application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
NAMESPACE="trading-guide"
DOCKER_REGISTRY="ghcr.io"
IMAGE_NAME="${DOCKER_REGISTRY}/your-org/trading-guide"
VERSION=${2:-latest}

echo -e "${GREEN}=== Trading Guide Deployment Script ===${NC}"
echo "Environment: ${ENVIRONMENT}"
echo "Version: ${VERSION}"
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    command -v kubectl >/dev/null 2>&1 || { echo -e "${RED}kubectl is required but not installed.${NC}" >&2; exit 1; }
    command -v docker >/dev/null 2>&1 || { echo -e "${RED}docker is required but not installed.${NC}" >&2; exit 1; }
    
    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}Cannot connect to Kubernetes cluster${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Prerequisites check passed${NC}"
}

# Create namespace if it doesn't exist
create_namespace() {
    echo -e "${YELLOW}Creating namespace...${NC}"
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    echo -e "${GREEN}✓ Namespace ready${NC}"
}

# Apply Kubernetes manifests
apply_manifests() {
    echo -e "${YELLOW}Applying Kubernetes manifests...${NC}"
    
    kubectl apply -f kubernetes/namespace.yml
    kubectl apply -f kubernetes/configmap.yml
    kubectl apply -f kubernetes/deployment.yml
    kubectl apply -f kubernetes/service.yml
    kubectl apply -f kubernetes/ingress.yml
    kubectl apply -f kubernetes/hpa.yml
    
    echo -e "${GREEN}✓ Manifests applied${NC}"
}

# Update deployment image
update_image() {
    echo -e "${YELLOW}Updating deployment image...${NC}"
    
    kubectl set image deployment/trading-guide \
        trading-guide=${IMAGE_NAME}:${VERSION} \
        -n ${NAMESPACE}
    
    echo -e "${GREEN}✓ Image updated${NC}"
}

# Wait for rollout
wait_for_rollout() {
    echo -e "${YELLOW}Waiting for rollout to complete...${NC}"
    
    kubectl rollout status deployment/trading-guide -n ${NAMESPACE} --timeout=5m
    
    echo -e "${GREEN}✓ Rollout completed${NC}"
}

# Run smoke tests
run_smoke_tests() {
    echo -e "${YELLOW}Running smoke tests...${NC}"
    
    # Get service endpoint
    ENDPOINT=$(kubectl get svc trading-guide -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    if [ -z "$ENDPOINT" ]; then
        ENDPOINT=$(kubectl get svc trading-guide -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
    fi
    
    # Test health endpoint
    if kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -n ${NAMESPACE} -- \
        curl -f http://trading-guide/health; then
        echo -e "${GREEN}✓ Smoke tests passed${NC}"
    else
        echo -e "${RED}✗ Smoke tests failed${NC}"
        exit 1
    fi
}

# Show deployment info
show_info() {
    echo ""
    echo -e "${GREEN}=== Deployment Information ===${NC}"
    echo "Namespace: ${NAMESPACE}"
    echo "Image: ${IMAGE_NAME}:${VERSION}"
    echo ""
    
    echo "Pods:"
    kubectl get pods -n ${NAMESPACE} -l app=trading-guide
    echo ""
    
    echo "Services:"
    kubectl get svc -n ${NAMESPACE}
    echo ""
    
    echo "Ingress:"
    kubectl get ingress -n ${NAMESPACE}
}

# Rollback function
rollback() {
    echo -e "${YELLOW}Rolling back deployment...${NC}"
    kubectl rollout undo deployment/trading-guide -n ${NAMESPACE}
    kubectl rollout status deployment/trading-guide -n ${NAMESPACE}
    echo -e "${GREEN}✓ Rollback completed${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    create_namespace
    apply_manifests
    update_image
    wait_for_rollout
    run_smoke_tests
    show_info
    
    echo ""
    echo -e "${GREEN}=== Deployment Successful! ===${NC}"
}

# Handle script arguments
case "$3" in
    rollback)
        rollback
        ;;
    *)
        main
        ;;
esac
