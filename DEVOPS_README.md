# Trading Guide - DevOps Infrastructure

Complete enterprise-grade DevOps infrastructure for the Trading Guide application.

## 🎯 What's Included

This repository now includes a comprehensive DevOps infrastructure with:

✅ **Docker Containerization**
- Multi-stage Dockerfile with Nginx
- Docker Compose for local development
- Production-ready container configuration
- Security hardening (non-root user, read-only filesystem)

✅ **Kubernetes Deployment**
- Complete K8s manifests (Deployment, Service, Ingress, HPA)
- Horizontal Pod Autoscaler (3-10 replicas)
- Resource limits and requests
- Health checks and readiness probes
- Namespace isolation

✅ **CI/CD Pipelines**
- GitHub Actions workflows (CI, CD, Security, Docker)
- Automated testing and linting
- Security scanning with Trivy
- Multi-architecture image builds
- Automated deployments to staging/production

✅ **Infrastructure as Code**
- Terraform configurations for AWS EKS
- Modular infrastructure design
- State management with S3/DynamoDB
- Multi-environment support

✅ **Monitoring & Logging**
- Prometheus for metrics collection
- Grafana dashboards
- Loki + Promtail for log aggregation
- Pre-configured alerts
- Application and infrastructure monitoring

✅ **Testing Framework**
- Health check tests
- Integration tests
- Load testing scripts
- Automated test execution in CI

✅ **Environment Configuration**
- Development, staging, production configs
- Environment variable management
- Secrets handling
- Feature flags

✅ **Documentation**
- Complete DevOps guide
- Deployment instructions
- Architecture documentation
- Troubleshooting guides

## 📁 New Directory Structure

```
trading-guide/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Continuous Integration
│   │   ├── cd.yml                    # Continuous Deployment
│   │   ├── docker-publish.yml        # Docker image publishing
│   │   └── security-scan.yml         # Security scanning
│   └── dependabot.yml                # Dependency updates
│
├── docker/
│   ├── nginx.conf                    # Nginx main config
│   ├── default.conf                  # Nginx site config
│   └── dev.conf                      # Development config
│
├── kubernetes/
│   ├── namespace.yml                 # Namespace and quotas
│   ├── deployment.yml                # Application deployment
│   ├── service.yml                   # Service definition
│   ├── ingress.yml                   # Ingress configuration
│   ├── hpa.yml                       # Horizontal Pod Autoscaler
│   ├── configmap.yml                 # Configuration
│   └── kustomization.yml             # Kustomize config
│
├── terraform/
│   ├── main.tf                       # Main Terraform config
│   ├── variables.tf                  # Variable definitions
│   ├── terraform.tfvars.example      # Example variables
│   └── modules/                      # Terraform modules
│       ├── vpc/
│       ├── eks/
│       ├── rds/
│       └── cloudfront/
│
├── monitoring/
│   ├── prometheus.yml                # Prometheus config
│   ├── alerts.yml                    # Alert rules
│   ├── loki-config.yml              # Loki configuration
│   ├── promtail-config.yml          # Promtail config
│   └── grafana/
│       └── dashboards/
│           └── trading-guide-dashboard.json
│
├── config/
│   └── environments/
│       ├── development.js            # Dev environment
│       ├── staging.js                # Staging environment
│       └── production.js             # Production environment
│
├── scripts/
│   └── deploy.sh                     # Deployment script
│
├── tests/
│   ├── health.test.sh               # Health check tests
│   ├── integration.test.sh          # Integration tests
│   └── load-test.sh                 # Load testing
│
├── docs/
│   ├── DEVOPS_GUIDE.md              # Complete DevOps guide
│   ├── DEPLOYMENT.md                # Deployment instructions
│   └── ARCHITECTURE.md              # System architecture
│
├── Dockerfile                        # Production Docker image
├── .dockerignore                     # Docker ignore file
├── docker-compose.yml                # Production compose
├── docker-compose.dev.yml            # Development compose
├── .env.example                      # Environment variables template
├── package.json                      # NPM scripts
├── Makefile                          # Convenience commands
└── DEVOPS_README.md                  # This file
```

## 🚀 Quick Start

### Local Development

```bash
# Start development server
make dev
# or
npm run dev
# or
docker-compose -f docker-compose.dev.yml up

# Access application
open http://localhost:8080
```

### Production Build

```bash
# Build Docker image
make build
# or
docker build -t trading-guide:latest .

# Run locally
docker run -d -p 8080:8080 trading-guide:latest
```

### Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -k kubernetes/

# Or use the deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh production v1.0.0

# Check status
kubectl get all -n trading-guide
```

## 📊 Monitoring

### Start Monitoring Stack

```bash
# Using Docker Compose
make monitoring-start

# Access dashboards
open http://localhost:3000  # Grafana (admin/admin)
open http://localhost:9090  # Prometheus
```

### Pre-configured Dashboards

- **Application Overview**: Request rate, response time, error rate
- **Infrastructure Health**: CPU, memory, network usage
- **Performance Metrics**: Latency percentiles, throughput
- **Alerts**: Critical and warning alerts

## 🔄 CI/CD Pipeline

### Automatic Deployments

- **Push to main**: Automatically deploys to staging
- **Version tag**: Automatically deploys to production

```bash
# Trigger production deployment
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

### Manual Deployment

```bash
# Via GitHub Actions
gh workflow run cd.yml -f environment=production

# Via script
./scripts/deploy.sh production v1.0.1
```

## 🔒 Security Features

- ✅ Container security scanning with Trivy
- ✅ Dependency vulnerability checking
- ✅ Secret scanning with Gitleaks
- ✅ Non-root container user
- ✅ Read-only root filesystem
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Rate limiting
- ✅ HTTPS/TLS encryption
- ✅ Network policies (Kubernetes)

## 📈 Scaling

### Horizontal Scaling

The application automatically scales based on:
- CPU usage (target: 70%)
- Memory usage (target: 80%)
- Min replicas: 3
- Max replicas: 10

```bash
# Manual scaling
kubectl scale deployment trading-guide --replicas=5 -n trading-guide

# Check HPA status
kubectl get hpa -n trading-guide
```

## 🛠️ Available Commands

### Makefile Commands

```bash
make help              # Show all available commands
make dev               # Start development environment
make build             # Build Docker image
make test              # Run tests
make deploy-staging    # Deploy to staging
make deploy-production # Deploy to production
make k8s-apply         # Apply Kubernetes manifests
make k8s-status        # Show Kubernetes status
make monitoring-start  # Start monitoring stack
make security-scan     # Run security scan
make clean             # Clean up resources
```

### NPM Scripts

```bash
npm run dev            # Start development
npm run build          # Build Docker image
npm run start          # Start with Docker Compose
npm run test           # Run tests
npm run deploy:staging # Deploy to staging
npm run k8s:apply      # Apply K8s manifests
npm run monitoring:start # Start monitoring
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEVOPS_GUIDE.md](docs/DEVOPS_GUIDE.md) | Complete DevOps infrastructure guide |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Step-by-step deployment instructions |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design |

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.production` and configure:

```bash
NODE_ENV=production
APP_VERSION=1.0.0
TZ=America/New_York
DOMAIN=trading-guide.app
ENABLE_METRICS=true
LOG_LEVEL=warn
```

### Kubernetes Secrets

```bash
# Create secrets
kubectl create secret generic trading-guide-secrets \
  --from-literal=api-key=your-api-key \
  -n trading-guide
```

## 🐛 Troubleshooting

### Check Application Status

```bash
# Docker
docker ps
docker logs trading-guide-app

# Kubernetes
kubectl get pods -n trading-guide
kubectl logs -f -l app=trading-guide -n trading-guide
kubectl describe pod <pod-name> -n trading-guide
```

### Common Issues

1. **Pods not starting**: Check `kubectl describe pod`
2. **Service not accessible**: Verify ingress and service configuration
3. **High memory usage**: Adjust resource limits
4. **CI/CD failing**: Check GitHub Actions logs

## 📊 Metrics & Monitoring

### Key Metrics

- Request rate and latency
- Error rate (4xx, 5xx)
- Pod CPU and memory usage
- Pod restart count
- Network I/O

### Alerts

- Application down (critical)
- High error rate (warning)
- High resource usage (warning)
- Pod restarting frequently (warning)

## 🎯 Production Checklist

Before deploying to production:

- [ ] Update image tag in deployment.yml
- [ ] Configure domain in ingress.yml
- [ ] Set up SSL certificate
- [ ] Configure DNS records
- [ ] Set up monitoring
- [ ] Configure alerts
- [ ] Test rollback procedure
- [ ] Document recovery procedures
- [ ] Set up backup strategy (if needed)
- [ ] Security scan passed
- [ ] Load testing completed

## 🤝 Contributing

When contributing to the infrastructure:

1. Test changes locally with Docker Compose
2. Validate Kubernetes manifests: `kubectl apply --dry-run=client`
3. Run security scans
4. Update documentation
5. Create PR with clear description

## 📞 Support

For issues or questions:

1. Check the documentation in `docs/`
2. Review logs and monitoring dashboards
3. Consult the troubleshooting section
4. Open a GitHub issue

## 🎉 What You Get

With this DevOps infrastructure, you get:

✅ **Production-Ready**: Battle-tested configurations
✅ **Scalable**: Auto-scaling from 3 to 10 replicas
✅ **Secure**: Multiple layers of security
✅ **Observable**: Complete monitoring and logging
✅ **Automated**: CI/CD pipelines for all environments
✅ **Documented**: Comprehensive guides and documentation
✅ **Tested**: Automated testing framework
✅ **Maintainable**: Infrastructure as Code

## 📈 Next Steps

1. **Deploy to Staging**
   ```bash
   make deploy-staging
   ```

2. **Set Up Monitoring**
   ```bash
   make monitoring-start
   ```

3. **Configure Domain**
   - Update ingress.yml with your domain
   - Set up DNS records
   - Configure SSL certificate

4. **Customize Configuration**
   - Update environment variables
   - Adjust resource limits
   - Configure alerts

5. **Deploy to Production**
   ```bash
   git tag -a v1.0.0 -m "Initial production release"
   git push origin v1.0.0
   ```

---

**Built with ❤️ for enterprise-scale deployments**

**Version**: 1.0.0  
**Last Updated**: 2025-10-30  
**License**: MIT
