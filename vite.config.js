import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: './index.html',
        // Add all your pages here for proper bundling
        'btmm-cycle': './pages/btmm-cycle.html',
        'calculators': './pages/calculators.html',
        'chart-models': './pages/chart-models.html',
        'checklist': './pages/checklist.html',
        'core-philosophy': './pages/core-philosophy.html',
        'daily-sessions': './pages/daily-sessions.html',
        'entry-rules': './pages/entry-rules.html',
        'examples': './pages/examples.html',
        'intraday-bias': './pages/intraday-bias.html',
        'journal': './pages/journal.html',
        'live-session-guide': './pages/live-session-guide.html',
        'market-visuals': './pages/market-visuals.html',
        'micro-quarters': './pages/micro-quarters.html',
        'monthly-cycle': './pages/monthly-cycle.html',
        'pattern-trainer': './pages/pattern-trainer.html',
        'quick-reference': './pages/quick-reference.html',
        'risk-management': './pages/risk-management.html',
        'session-cycle': './pages/session-cycle.html',
        'technical-setup': './pages/technical-setup.html',
        'trade-execution': './pages/trade-execution.html',
        'trading-journal': './pages/trading-journal.html',
        'trading-psychology': './pages/trading-psychology.html',
        'weekly-schedule': './pages/weekly-schedule.html',
        'yearly-cycle': './pages/yearly-cycle.html'
      },
      output: {
        manualChunks: {
          // Split vendor code
          'vendor-charts': ['./js/market-visuals.js'],
          'vendor-calculators': ['./js/calculators.js', './js/gann-timing.js'],
          'vendor-journal': ['./js/trading-journal.js'],
          'vendor-core': ['./js/main.js', './js/navigation.js', './js/components.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  preview: {
    port: 4173,
    open: true
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'Quarterly Theory & BTMM Trading Guide',
        short_name: 'Trading Guide',
        description: 'Complete trading education app combining Quarterly Theory and BTMM methodology',
        theme_color: '#4a9eff',
        background_color: '#0a0e1a',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['finance', 'education', 'productivity'],
        shortcuts: [
          {
            name: 'Trading Journal',
            short_name: 'Journal',
            description: 'Log and track your trades',
            url: '/pages/trading-journal.html',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Calculators',
            short_name: 'Calc',
            description: 'Trading calculators',
            url: '/pages/calculators.html',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Live Session Guide',
            short_name: 'Live',
            description: 'Real-time trading guidance',
            url: '/pages/live-session-guide.html',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    include: []
  }
});
