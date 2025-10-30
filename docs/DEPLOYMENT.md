# Deployment Guide

Step-by-step deployment guide for Trading Guide application.

## 📋 Pre-Deployment Checklist

- [ ] Docker installed and running
- [ ] kubectl configured for target cluster
- [ ] Container registry credentials configured
- [ ] Domain name configured (for production)
- [ ] SSL certificate ready (for production)
- [ ] Environment variables configured
- [ ] Monitoring stack prepared

## 🚀 Deployment Options

### Option 1: Docker Compose (Simplest)

Best for: Development, testing, small-scale deployments

```bash
# 1. Clone repository
git clone https://github.com/your-org/trading-guide.git
cd trading-guide

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# 3. Start application
docker-compose up -d

# 4. Verify deployment
curl http://localhost:8080/health

# 5. View logs
docker-compose logs -f app
```

**Access**: http://localhost:8080

### Option 2: Kubernetes (Production)

Best for: Production, high-availability deployments

#### Step 1: Prepare Cluster

```bash
# Verify cluster connection
kubectl cluster-info

# Create namespace
kubectl create namespace trading-guide
```

#### Step 2: Configure Container Registry

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Create image pull secret (if private registry)
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=USERNAME \
  --docker-password=$GITHUB_TOKEN \
  --docker-email=EMAIL \
  -n trading-guide
```

#### Step 3: Build and Push Image

```bash
# Build image
docker build -t ghcr.io/your-org/trading-guide:v1.0.0 .

# Push to registry
docker push ghcr.io/your-org/trading-guide:v1.0.0
```

#### Step 4: Deploy Application

```bash
# Update image in deployment.yml
sed -i 's|ghcr.io/your-org/trading-guide:latest|ghcr.io/your-org/trading-guide:v1.0.0|g' kubernetes/deployment.yml

# Apply all manifests
kubectl apply -f kubernetes/

# Or use the deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh production v1.0.0
```

#### Step 5: Configure Ingress

```bash
# Update domain in ingress.yml
sed -i 's|trading-guide.app|your-domain.com|g' kubernetes/ingress.yml

# Apply ingress
kubectl apply -f kubernetes/ingress.yml
```

#### Step 6: Verify Deployment

```bash
# Check pods
kubectl get pods -n trading-guide

# Check services
kubectl get svc -n trading-guide

# Check ingress
kubectl get ingress -n trading-guide

# Test health endpoint
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -n trading-guide -- \
  curl -f http://trading-guide/health
```

### Option 3: Terraform + Kubernetes (Full Infrastructure)

Best for: Enterprise deployments with infrastructure as code

#### Step 1: Configure Terraform

```bash
cd terraform

# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your settings
vim terraform.tfvars
```

#### Step 2: Initialize Terraform

```bash
# Initialize
terraform init

# Create S3 bucket for state (if not exists)
aws s3 mb s3://trading-guide-terraform-state
aws dynamodb create-table \
  --table-name trading-guide-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

#### Step 3: Deploy Infrastructure

```bash
# Plan
terraform plan -out=tfplan

# Review the plan
terraform show tfplan

# Apply
terraform apply tfplan

# Get outputs
terraform output
```

#### Step 4: Deploy Application to EKS

```bash
# Configure kubectl
aws eks update-kubeconfig --name trading-guide-production --region us-east-1

# Deploy application
kubectl apply -k kubernetes/
```

## 🔧 Configuration

### Environment Variables

Create `.env.production` file:

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
  --from-literal=db-password=your-password \
  -n trading-guide

# Or from file
kubectl create secret generic trading-guide-config \
  --from-env-file=.env.production \
  -n trading-guide
```

## 📊 Post-Deployment

### 1. Monitoring Setup

```bash
# Deploy monitoring stack
docker-compose --profile monitoring up -d

# Or in Kubernetes
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

### 2. Configure Alerts

```bash
# Apply alert rules
kubectl apply -f monitoring/alerts.yml
```

### 3. Setup Logging

```bash
# Deploy Loki stack
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack -n monitoring
```

### 4. SSL/TLS Certificate

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 5. DNS Configuration

Point your domain to the LoadBalancer:

```bash
# Get LoadBalancer IP/hostname
kubectl get svc -n ingress-nginx

# Create DNS record
# A record: trading-guide.app -> LOAD_BALANCER_IP
# CNAME: www.trading-guide.app -> trading-guide.app
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Application is accessible via domain
- [ ] Health endpoint returns 200: `/health`
- [ ] All pages load correctly
- [ ] SSL certificate is valid (if HTTPS)
- [ ] Service Worker is registered (PWA)
- [ ] Static assets are cached properly
- [ ] Monitoring dashboards show data
- [ ] Logs are being collected
- [ ] Alerts are configured
- [ ] HPA is working (Kubernetes)

## 🔄 CI/CD Automation

### GitHub Actions Deployment

The application automatically deploys on:

1. **Push to main**: Deploys to staging
2. **Version tag**: Deploys to production

```bash
# Trigger production deployment
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1

# Or manually via GitHub UI
# Actions → CD → Run workflow → Select environment
```

### Automated Rollback

If deployment fails, GitHub Actions automatically:
1. Detects the failure
2. Rolls back to previous version
3. Sends notification

Manual rollback:

```bash
# Via kubectl
kubectl rollout undo deployment/trading-guide -n trading-guide

# Via script
./scripts/deploy.sh production v1.0.0 rollback
```

## 🐛 Troubleshooting

### Common Issues

**1. Pods not starting**

```bash
# Check pod status
kubectl describe pod <pod-name> -n trading-guide

# Common causes:
# - Image pull error: Check registry credentials
# - Resource limits: Check node capacity
# - Health check failing: Check application logs
```

**2. Service not accessible**

```bash
# Check service
kubectl get svc -n trading-guide

# Check endpoints
kubectl get endpoints -n trading-guide

# Test from within cluster
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -n trading-guide -- \
  curl -v http://trading-guide
```

**3. Ingress not working**

```bash
# Check ingress
kubectl describe ingress trading-guide -n trading-guide

# Check ingress controller
kubectl get pods -n ingress-nginx

# Check logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Manual scaling
kubectl scale deployment trading-guide --replicas=5 -n trading-guide

# Auto-scaling is configured via HPA
# Min: 3, Max: 10 based on CPU (70%) and Memory (80%)
```

### Vertical Scaling

Update resource limits in `kubernetes/deployment.yml`:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

Then apply:

```bash
kubectl apply -f kubernetes/deployment.yml
```

## 🔐 Security Best Practices

1. **Use secrets for sensitive data**
2. **Enable RBAC in Kubernetes**
3. **Regular security scans**
4. **Keep dependencies updated**
5. **Use private container registry**
6. **Enable network policies**
7. **Regular backup and testing**

## 📞 Support

If you encounter issues:

1. Check logs: `kubectl logs -f -l app=trading-guide -n trading-guide`
2. Review monitoring dashboards
3. Consult the DevOps Guide: `docs/DEVOPS_GUIDE.md`
4. Open an issue on GitHub

---

**Happy Trading! 📈**
