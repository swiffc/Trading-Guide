# Trading Guide - System Architecture

## Overview

The Trading Guide is a Progressive Web Application (PWA) designed for traders to learn and apply Quarterly Theory and BTMM methodologies. This document outlines the complete system architecture with DevOps infrastructure.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Browser │  │  Mobile  │  │  Tablet  │  │   PWA    │           │
│  │   App    │  │   App    │  │   App    │  │  Offline │           │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘           │
└────────┼─────────────┼─────────────┼─────────────┼─────────────────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            CDN LAYER                                 │
│                     CloudFront / Cloudflare                          │
│              ┌──────────────────────────────────┐                   │
│              │  Global Edge Locations           │                   │
│              │  - Static Asset Caching          │                   │
│              │  - DDoS Protection               │                   │
│              │  - SSL/TLS Termination           │                   │
│              └──────────────────────────────────┘                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         LOAD BALANCER                                │
│              Application Load Balancer (ALB/NLB)                     │
│              ┌──────────────────────────────────┐                   │
│              │  - Health Checks                 │                   │
│              │  - SSL Termination               │                   │
│              │  - Request Routing               │                   │
│              │  - Auto-scaling Integration      │                   │
│              └──────────────────────────────────┘                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    KUBERNETES CLUSTER (EKS/GKE/AKS)                  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                     Ingress Controller                      │    │
│  │                  (Nginx Ingress / Traefik)                  │    │
│  └───────────────────────┬────────────────────────────────────┘    │
│                          │                                           │
│  ┌───────────────────────▼────────────────────────────────────┐    │
│  │                    Service Layer                            │    │
│  │              trading-guide-service (ClusterIP)              │    │
│  └───────────────────────┬────────────────────────────────────┘    │
│                          │                                           │
│  ┌───────────────────────▼────────────────────────────────────┐    │
│  │                Application Pods (Replicas: 3-10)            │    │
│  │                                                              │    │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐             │    │
│  │  │  Pod 1   │    │  Pod 2   │    │  Pod 3   │    ...      │    │
│  │  │          │    │          │    │          │             │    │
│  │  │  Nginx   │    │  Nginx   │    │  Nginx   │             │    │
│  │  │  +       │    │  +       │    │  +       │             │    │
│  │  │  Static  │    │  Static  │    │  Static  │             │    │
│  │  │  Assets  │    │  Assets  │    │  Assets  │             │    │
│  │  └──────────┘    └──────────┘    └──────────┘             │    │
│  │                                                              │    │
│  │  Resources: CPU: 100m-200m, Memory: 128Mi-256Mi            │    │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │          Horizontal Pod Autoscaler (HPA)                  │     │
│  │  Min: 3, Max: 10 based on CPU(70%) & Memory(80%)         │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                               │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Prometheus  │  │   Grafana    │  │  Alertmanager│             │
│  │              │  │              │  │              │             │
│  │  - Metrics   │──▶│ - Dashboards│  │ - Alerts     │             │
│  │  - Scraping  │  │ - Visualization│  │ - Notifications│          │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │     Loki     │  │   Promtail   │                                │
│  │              │  │              │                                │
│  │  - Log       │◀─│ - Log        │                                │
│  │    Storage   │  │   Collection │                                │
│  └──────────────┘  └──────────────┘                                │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE                                │
│                                                                       │
│  GitHub Repository                                                   │
│         │                                                            │
│         ▼                                                            │
│  GitHub Actions Workflows                                           │
│  ┌────────────────────────────────────────────────────┐            │
│  │  1. CI: Lint → Test → Build → Security Scan       │            │
│  │  2. CD: Build Image → Push → Deploy               │            │
│  │  3. Security: Trivy → Dependency Check            │            │
│  └────────────────────────────────────────────────────┘            │
│         │                                                            │
│         ▼                                                            │
│  Container Registry (GHCR)                                          │
│         │                                                            │
│         ▼                                                            │
│  Kubernetes Deployment                                              │
└───────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid/Flexbox
- **JavaScript**: Vanilla JS (no frameworks)
- **PWA**: Progressive Web App capabilities
  - Service Worker for offline support
  - Web App Manifest
  - Responsive design

### Web Server
- **Nginx 1.25**: 
  - Static file serving
  - Gzip compression
  - Caching headers
  - Security headers

### Container & Orchestration
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **Helm**: Package management (optional)

### CI/CD
- **GitHub Actions**: Automation
- **GitHub Container Registry**: Image storage

### Infrastructure as Code
- **Terraform**: AWS infrastructure
- **Kubectl/Kustomize**: Kubernetes manifests

### Monitoring & Logging
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Loki**: Log aggregation
- **Promtail**: Log shipping
- **Alertmanager**: Alert routing

### Cloud Providers (Choose one)
- **AWS**: EKS, ALB, CloudFront, Route53
- **GCP**: GKE, Cloud Load Balancing, Cloud CDN
- **Azure**: AKS, Application Gateway, Azure CDN

## Component Details

### Application Layer

#### Nginx Configuration
- **Worker Processes**: Auto (based on CPU cores)
- **Worker Connections**: 1024
- **Gzip Compression**: Enabled for text assets
- **Caching**: 
  - Static assets: 1 year
  - HTML: 1 hour
  - Service Worker: No cache

#### Resource Requirements
- **CPU**: 100m request, 200m limit
- **Memory**: 128Mi request, 256Mi limit
- **Replicas**: 3 minimum, 10 maximum
- **Storage**: Ephemeral (no persistent volumes needed)

### Kubernetes Resources

#### Deployment
- **Strategy**: RollingUpdate
- **MaxSurge**: 1
- **MaxUnavailable**: 0
- **RevisionHistoryLimit**: 5

#### Service
- **Type**: ClusterIP
- **Port**: 80 → 8080
- **Session Affinity**: ClientIP

#### Ingress
- **Controller**: Nginx Ingress
- **TLS**: Enabled with cert-manager
- **Rate Limiting**: 100 req/min per IP
- **CORS**: Enabled

#### HPA (Horizontal Pod Autoscaler)
- **Min Replicas**: 3
- **Max Replicas**: 10
- **Target CPU**: 70%
- **Target Memory**: 80%

### Monitoring Architecture

#### Metrics Collection
1. **Application Metrics**
   - Request count
   - Response time
   - Error rate
   - Active connections

2. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Network I/O
   - Disk I/O

3. **Business Metrics**
   - Page views
   - Session duration
   - Feature usage

#### Logging Strategy
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Format**: JSON for production
- **Retention**: 7 days in Loki
- **Sampling**: 100% errors, 10% info

#### Alerting
- **Critical**: Page down, high error rate
- **Warning**: High resource usage, slow response
- **Info**: Deployment events, scaling events

## Security Architecture

### Network Security
1. **Ingress Layer**
   - DDoS protection (CloudFlare/AWS Shield)
   - Rate limiting
   - IP whitelisting (optional)

2. **Service Mesh** (Optional)
   - mTLS between services
   - Traffic encryption
   - Service-to-service auth

### Application Security
1. **Container Security**
   - Non-root user (UID 1001)
   - Read-only root filesystem
   - Dropped capabilities
   - Security scanning

2. **Runtime Security**
   - Pod Security Standards
   - Network Policies
   - Resource quotas
   - RBAC policies

### Data Security
1. **In Transit**
   - TLS 1.3
   - Strong cipher suites
   - HSTS enabled

2. **At Rest**
   - Encrypted volumes (future)
   - Secrets encryption
   - Backup encryption

## Scalability

### Horizontal Scaling
- **Application**: HPA based on CPU/Memory
- **Infrastructure**: Cluster Autoscaler
- **Database**: Read replicas (future)

### Vertical Scaling
- **Pod Resources**: Adjustable via deployment
- **Node Size**: Right-sizing based on workload

### Geographic Scaling
- **CDN**: Global edge locations
- **Multi-region**: Future consideration
- **Active-Active**: Not required (static content)

## Disaster Recovery

### Backup Strategy
1. **Application Code**: Git repository
2. **Container Images**: Multiple registry replicas
3. **Configuration**: Infrastructure as Code
4. **Data**: Not applicable (stateless)

### Recovery Procedures
1. **Incident Detection**: Monitoring alerts
2. **Impact Assessment**: Check dashboards
3. **Recovery Action**: 
   - Rollback deployment
   - Scale resources
   - Restore from backup
4. **Post-mortem**: Document and improve

### RTO/RPO
- **RTO**: 15 minutes (Recovery Time Objective)
- **RPO**: 0 (Recovery Point Objective - stateless)

## Performance Optimization

### Frontend
- Minified assets
- Gzip compression
- Browser caching
- Lazy loading

### Backend
- Static content serving
- Efficient Nginx config
- Connection pooling
- Keep-alive enabled

### Infrastructure
- CDN caching
- Load balancing
- Auto-scaling
- Resource optimization

## Cost Optimization

### Compute
- Right-sized pods
- HPA for efficiency
- Spot instances (if applicable)

### Storage
- Ephemeral volumes
- CDN for static assets
- Lifecycle policies

### Network
- CDN reduces origin requests
- Regional deployment
- Data transfer optimization

## Future Enhancements

1. **Database Integration**
   - User preferences
   - Trade journal storage
   - Analytics data

2. **API Backend**
   - Real-time market data
   - User authentication
   - Custom indicators

3. **Advanced Features**
   - WebSocket for live updates
   - Server-side rendering
   - Personalization

4. **Multi-region Deployment**
   - Global presence
   - Reduced latency
   - HA across regions

---

**Last Updated**: 2025-10-30
**Version**: 1.0.0
