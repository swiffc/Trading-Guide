# Multi-stage Dockerfile for Trading Guide App
# Stage 1: Build stage (for potential future optimizations)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files (for future npm packages if needed)
COPY package*.json ./

# Install dependencies (if any)
RUN if [ -f package.json ]; then npm ci --only=production; fi

# Copy application files
COPY . .

# Stage 2: Production stage with Nginx
FROM nginx:1.25-alpine AS production

# Install security updates
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    curl \
    bash && \
    rm -rf /var/cache/apk/*

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy application files from builder
COPY --from=builder /app /usr/share/nginx/html

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-app -g nginx-app nginx-app && \
    chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# Switch to non-root user
USER nginx-app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Metadata
LABEL maintainer="Trading Guide Team"
LABEL version="1.0"
LABEL description="Trading Guide - Quarterly Theory & BTMM Method PWA"
