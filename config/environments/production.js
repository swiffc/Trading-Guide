// Production environment configuration
module.exports = {
  environment: 'production',
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
  app: {
    name: 'Trading Guide',
    version: process.env.APP_VERSION || '1.0.0',
    url: 'https://trading-guide.app',
  },
  logging: {
    level: 'warn',
    format: 'json',
  },
  cache: {
    enabled: true,
    ttl: 7200,
  },
  features: {
    serviceWorker: true,
    pwa: true,
    offlineMode: true,
    analytics: true,
  },
  monitoring: {
    enabled: true,
    prometheus: {
      enabled: true,
      port: 9090,
    },
    sentry: {
      enabled: true,
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      tracesSampleRate: 0.1,
    },
    newRelic: {
      enabled: false,
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    },
  },
  security: {
    cors: {
      enabled: true,
      origin: [
        'https://trading-guide.app',
        'https://www.trading-guide.app',
      ],
    },
    rateLimit: {
      enabled: true,
      max: 100,
      windowMs: 60000,
    },
    helmet: {
      enabled: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:'],
        },
      },
    },
  },
  performance: {
    compression: true,
    staticCache: {
      maxAge: 31536000,
    },
  },
};
