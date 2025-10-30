# Trading Guide - DevOps Guide

Complete DevOps infrastructure and deployment guide for the Trading Guide application.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Security](#security)
- [Maintenance](#maintenance)

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Web Server**: Nginx 1.25
- **Container Runtime**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Infrastructure**: Terraform (AWS EKS)
- **Monitoring**: Prometheus + Grafana
- **Logging**: Loki + Promtail
- **Registry**: GitHub Container Registry

### Infrastructure Components

```
┌─────────────────────────────────────────────────────┐
│                   CloudFront CDN                    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              Application Load Balancer              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Kubernetes Cluster (EKS/GKE/AKS)            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │   Pod 1    │  │   Pod 2    │  │   Pod 3    │    │
│  │  (Nginx)   │  │  (Nginx)   │  │  (Nginx)   │    │
│  └────────────┘  └────────────┘  └────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │     Horizontal Pod Autoscaler (HPA)        │    │
│  └────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              Monitoring & Logging                    │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Prometheus  │  │ Grafana  │  │ Loki+Promtail│   │
│  └─────────────┘  └──────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- kubectl 1.28+
- Terraform 1.5+ (for infrastructure)
- Make (optional, for convenience)

### Local Development

```bash
# Using Docker Compose
npm run dev

# Or manually
docker-compose -f docker-compose.dev.yml up

# Access the app
open http://localhost:8080
```

### Using Makefile

```bash
# View all available commands
make help

# Start development
make dev

# Build Docker image
make build

# Run tests
make test

# Deploy to staging
make deploy-staging
```

## 🐳 Docker Setup

### Building the Image

```bash
# Development build
docker build -t trading-guide:dev .

# Production build
docker build -t trading-guide:prod -f Dockerfile .

# Multi-architecture build
docker buildx build --platform linux/amd64,linux/arm64 -t trading-guide:latest .
```

### Running Locally

```bash
# Basic run
docker run -d -p 8080:8080 trading-guide:latest

# With environment variables
docker run -d \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e TZ=America/New_York \
  trading-guide:latest

# With Docker Compose
docker-compose up -d
```

### Docker Compose Profiles

```bash
# Development mode
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose --profile production up -d

# With monitoring stack
docker-compose --profile monitoring up -d

# Full stack (app + monitoring)
docker-compose --profile production --profile monitoring up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites

1. A running Kubernetes cluster (EKS, GKE, AKS, or local minikube)
2. kubectl configured to access your cluster
3. Container image pushed to a registry

### Manual Deployment

```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yml

# Apply all manifests
kubectl apply -f kubernetes/

# Or use kustomize
kubectl apply -k kubernetes/

# Check deployment status
kubectl get all -n trading-guide

# View logs
kubectl logs -f -l app=trading-guide -n trading-guide
```

### Using Deployment Script

```bash
# Deploy to staging
./scripts/deploy.sh staging v1.0.0

# Deploy to production
./scripts/deploy.sh production v1.0.0

# Rollback
./scripts/deploy.sh production v1.0.0 rollback
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment trading-guide --replicas=5 -n trading-guide

# Horizontal Pod Autoscaler is configured automatically
# Min: 3, Max: 10 replicas based on CPU/Memory usage
kubectl get hpa -n trading-guide
```

### Updating the Application

```bash
# Update image
kubectl set image deployment/trading-guide \
  trading-guide=ghcr.io/your-org/trading-guide:v1.1.0 \
  -n trading-guide

# Check rollout status
kubectl rollout status deployment/trading-guide -n trading-guide

# Rollback if needed
kubectl rollout undo deployment/trading-guide -n trading-guide
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

The application includes four main workflows:

1. **CI (Continuous Integration)** - `.github/workflows/ci.yml`
   - Triggered on: Push to any branch, PRs
   - Actions: Lint, test, build, security scan
   - Duration: ~5-10 minutes

2. **CD (Continuous Deployment)** - `.github/workflows/cd.yml`
   - Triggered on: Push to main, tags, manual dispatch
   - Actions: Build image, deploy to staging/production
   - Duration: ~10-15 minutes

3. **Docker Publish** - `.github/workflows/docker-publish.yml`
   - Triggered on: Push to main, version tags
   - Actions: Build and push multi-arch images
   - Duration: ~8-12 minutes

4. **Security Scan** - `.github/workflows/security-scan.yml`
   - Triggered on: Push, PRs, weekly schedule
   - Actions: Trivy, dependency check, secret scanning
   - Duration: ~5-8 minutes

### Workflow Triggers

```yaml
# Automatic deployment on tag
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1

# Manual deployment
gh workflow run cd.yml -f environment=production
```

### Secrets Configuration

Required GitHub Secrets:

```bash
# Container Registry
GITHUB_TOKEN (automatic)

# AWS (if using EKS)
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION

# Kubernetes
KUBE_CONFIG (base64 encoded kubeconfig)

# Monitoring (optional)
SENTRY_DSN
NEW_RELIC_LICENSE_KEY
```

## 📊 Monitoring & Logging

### Prometheus Metrics

Access Prometheus at: `http://prometheus:9090`

Key metrics:
- `up{job="trading-guide"}` - Application availability
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `container_cpu_usage_seconds_total` - CPU usage
- `container_memory_usage_bytes` - Memory usage

### Grafana Dashboards

Access Grafana at: `http://grafana:3000`

Default credentials:
- Username: `admin`
- Password: `admin` (change on first login)

Pre-configured dashboards:
- Application Overview
- Performance Metrics
- Infrastructure Health
- Error Tracking

### Loki Log Aggregation

Access logs through Grafana or query directly:

```bash
# View logs in Grafana
# Navigate to Explore → Select Loki data source

# Query examples
{app="trading-guide"}
{app="trading-guide"} |= "error"
{app="trading-guide", level="error"}
```

### Alerts

Configured alerts in `monitoring/alerts.yml`:
- Application down
- High error rate
- High response time
- Resource usage warnings
- Pod restart alerts

Alerts are sent to Alertmanager and can be routed to:
- Email
- Slack
- PagerDuty
- Discord
- Custom webhooks

## 🔒 Security

### Best Practices Implemented

1. **Container Security**
   - Non-root user
   - Read-only root filesystem
   - Dropped capabilities
   - Security scanning with Trivy

2. **Network Security**
   - TLS/SSL encryption
   - Rate limiting
   - CORS configuration
   - Security headers (CSP, X-Frame-Options, etc.)

3. **Secrets Management**
   - Environment variables
   - Kubernetes secrets
   - No hardcoded credentials

4. **Dependency Management**
   - Dependabot for automated updates
   - Regular vulnerability scanning
   - Minimal base images

### Security Scanning

```bash
# Scan Docker image
make security-scan

# Or manually
docker scan trading-guide:latest
trivy image trading-guide:latest

# Scan code
trivy fs .
```

## 🛠️ Maintenance

### Database Backup (Future Feature)

```bash
# Backup
kubectl exec -n trading-guide deployment/database -- \
  pg_dump -U postgres trading_guide > backup.sql

# Restore
kubectl exec -i -n trading-guide deployment/database -- \
  psql -U postgres trading_guide < backup.sql
```

### Log Rotation

Logs are automatically rotated by:
- Docker (JSON file driver with size limits)
- Kubernetes (kubelet log rotation)
- Loki (retention policy: 7 days)

### Updating Dependencies

```bash
# Update Docker base images
make update-deps

# Update Kubernetes components
helm repo update
helm upgrade --install ...

# Update Terraform modules
cd terraform
terraform init -upgrade
```

### Disaster Recovery

1. **Backup Checklist**
   - Container images in registry
   - Kubernetes manifests in Git
   - Database backups (if applicable)
   - Configuration and secrets

2. **Recovery Process**
   ```bash
   # Restore infrastructure
   cd terraform
   terraform apply
   
   # Restore application
   kubectl apply -k kubernetes/
   
   # Restore database (if applicable)
   ./scripts/restore-db.sh backup.sql
   ```

### Troubleshooting

```bash
# Check pod status
kubectl get pods -n trading-guide

# View pod logs
kubectl logs -f <pod-name> -n trading-guide

# Describe pod for events
kubectl describe pod <pod-name> -n trading-guide

# Execute into pod
kubectl exec -it <pod-name> -n trading-guide -- /bin/sh

# Check resource usage
kubectl top pods -n trading-guide
kubectl top nodes

# View events
kubectl get events -n trading-guide --sort-by='.lastTimestamp'
```

## 📈 Performance Optimization

### Nginx Caching

```nginx
# Static assets - 1 year cache
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN Integration

Configure CloudFront or similar CDN:
1. Point origin to Application Load Balancer
2. Configure cache behaviors
3. Enable compression
4. Set up custom SSL certificate

### Resource Limits

Configured in `kubernetes/deployment.yml`:
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

Adjust based on monitoring data.

## 📞 Support

For issues or questions:
- Check the logs: `kubectl logs -f -l app=trading-guide -n trading-guide`
- Review monitoring dashboards
- Check GitHub Actions workflow runs
- Consult the troubleshooting guide above

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform Documentation](https://www.terraform.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Built with ❤️ for traders by traders**
