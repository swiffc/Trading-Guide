// Staging environment configuration
module.exports = {
  environment: 'staging',
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
  app: {
    name: 'Trading Guide',
    version: process.env.APP_VERSION || '1.0.0',
    url: 'https://staging.trading-guide.app',
  },
  logging: {
    level: 'info',
    format: 'json',
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
  features: {
    serviceWorker: true,
    pwa: true,
    offlineMode: true,
    analytics: false,
  },
  monitoring: {
    enabled: true,
    prometheus: {
      enabled: true,
      port: 9090,
    },
    sentry: {
      enabled: false,
      dsn: process.env.SENTRY_DSN,
    },
  },
  security: {
    cors: {
      enabled: true,
      origin: ['https://staging.trading-guide.app'],
    },
    rateLimit: {
      enabled: true,
      max: 200,
      windowMs: 60000,
    },
    helmet: {
      enabled: true,
    },
  },
};
