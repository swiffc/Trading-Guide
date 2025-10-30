// Development environment configuration
module.exports = {
  environment: 'development',
  server: {
    port: 8080,
    host: 'localhost',
  },
  app: {
    name: 'Trading Guide',
    version: '1.0.0',
    url: 'http://localhost:8080',
  },
  logging: {
    level: 'debug',
    format: 'pretty',
  },
  cache: {
    enabled: false,
    ttl: 60,
  },
  features: {
    serviceWorker: false,
    pwa: false,
    offlineMode: false,
    analytics: false,
  },
  monitoring: {
    enabled: false,
    prometheus: {
      enabled: false,
      port: 9090,
    },
  },
  security: {
    cors: {
      enabled: true,
      origin: '*',
    },
    rateLimit: {
      enabled: false,
      max: 1000,
      windowMs: 60000,
    },
  },
};
