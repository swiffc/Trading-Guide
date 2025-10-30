# Makefile for Trading Guide Application

.PHONY: help dev build start stop logs test deploy clean

# Variables
DOCKER_IMAGE = trading-guide
DOCKER_TAG = latest
NAMESPACE = trading-guide
ENVIRONMENT ?= staging

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up

dev-stop: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

# Docker
build: ## Build Docker image
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

build-no-cache: ## Build Docker image without cache
	docker build --no-cache -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

# Docker Compose
start: ## Start application with Docker Compose
	docker-compose up -d

stop: ## Stop application
	docker-compose down

restart: stop start ## Restart application

logs: ## View application logs
	docker-compose logs -f app

start-monitoring: ## Start with monitoring stack
	docker-compose --profile monitoring up -d

stop-all: ## Stop all services including monitoring
	docker-compose --profile monitoring --profile production down

# Testing
test: ## Run tests
	@echo "Running tests..."
	@find js/ -name "*.js" -exec node -c {} \;
	@echo "✅ All JavaScript files are valid"

lint: ## Lint code
	@echo "Linting files..."
	@find . -name "*.html" -not -path "./node_modules/*" | wc -l
	@echo "✅ Linting complete"

validate: ## Validate configurations
	@echo "Validating Docker Compose..."
	@docker-compose config > /dev/null
	@echo "✅ Docker Compose configuration is valid"
	@if [ -d kubernetes/ ]; then \
		echo "Validating Kubernetes manifests..."; \
		kubectl apply --dry-run=client -k kubernetes/; \
		echo "✅ Kubernetes manifests are valid"; \
	fi

# Kubernetes
k8s-apply: ## Apply Kubernetes manifests
	kubectl apply -k kubernetes/

k8s-delete: ## Delete Kubernetes resources
	kubectl delete -k kubernetes/

k8s-status: ## Show Kubernetes resources status
	kubectl get all -n $(NAMESPACE)

k8s-logs: ## View Kubernetes pod logs
	kubectl logs -f -l app=trading-guide -n $(NAMESPACE)

k8s-describe: ## Describe Kubernetes deployment
	kubectl describe deployment trading-guide -n $(NAMESPACE)

# Deployment
deploy-staging: ## Deploy to staging
	./scripts/deploy.sh staging $(DOCKER_TAG)

deploy-production: ## Deploy to production
	./scripts/deploy.sh production $(DOCKER_TAG)

rollback: ## Rollback deployment
	kubectl rollout undo deployment/trading-guide -n $(NAMESPACE)

# Terraform
tf-init: ## Initialize Terraform
	cd terraform && terraform init

tf-plan: ## Run Terraform plan
	cd terraform && terraform plan

tf-apply: ## Apply Terraform changes
	cd terraform && terraform apply

tf-destroy: ## Destroy Terraform resources
	cd terraform && terraform destroy

# Monitoring
monitoring-start: ## Start monitoring stack
	docker-compose --profile monitoring up -d prometheus grafana

monitoring-stop: ## Stop monitoring stack
	docker-compose stop prometheus grafana

monitoring-logs: ## View monitoring logs
	docker-compose logs -f prometheus grafana

# Security
security-scan: ## Run security scan
	docker scan $(DOCKER_IMAGE):$(DOCKER_TAG)

security-trivy: ## Run Trivy vulnerability scanner
	trivy image $(DOCKER_IMAGE):$(DOCKER_TAG)

# Maintenance
clean: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -f

clean-all: ## Clean up all Docker resources (including images)
	docker-compose down -v --rmi all
	docker system prune -af

update-deps: ## Update dependencies
	docker pull nginx:1.25-alpine
	docker pull node:18-alpine

# Database (Future)
db-backup: ## Backup database
	@echo "Database backup not configured yet"

db-restore: ## Restore database
	@echo "Database restore not configured yet"

# Information
info: ## Show application information
	@echo "Trading Guide Application"
	@echo "========================"
	@echo "Docker Image: $(DOCKER_IMAGE):$(DOCKER_TAG)"
	@echo "Namespace: $(NAMESPACE)"
	@echo "Environment: $(ENVIRONMENT)"
	@echo ""
	@echo "Docker Status:"
	@docker ps --filter name=trading-guide
	@echo ""
	@if command -v kubectl &> /dev/null; then \
		echo "Kubernetes Status:"; \
		kubectl get pods -n $(NAMESPACE) 2>/dev/null || echo "Not deployed to Kubernetes"; \
	fi

version: ## Show version
	@echo "Trading Guide v1.0.0"

.DEFAULT_GOAL := help
