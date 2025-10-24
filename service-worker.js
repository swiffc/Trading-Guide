// Trading Guide - Service Worker
// Enables offline functionality and caching for PWA

const CACHE_NAME = 'trading-guide-v2.8';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/navigation.js',
  '/js/main.js',
  '/js/alerts.js',
  '/js/trading-journal.js',
  '/js/calculators.js',
  '/js/gann-timing.js',
  '/js/pattern-trainer.js',
  '/js/export-print.js',
  '/pages/core-philosophy.html',
  '/pages/weekly-schedule.html',
  '/pages/btmm-cycle.html',
  '/pages/daily-sessions.html',
  '/pages/micro-quarters.html',
  '/pages/technical-setup.html',
  '/pages/patterns.html',
  '/pages/entry-rules.html',
  '/pages/risk-management.html',
  '/pages/checklist.html',
  '/pages/examples.html',
  '/pages/live-session-guide.html',
  '/pages/quick-reference.html',
  '/pages/trading-journal.html',
  '/pages/calculators.html',
  '/pages/market-visuals.html',
  '/pages/trade-execution.html',
  '/pages/trading-psychology.html',
  '/pages/intraday-bias.html',
  '/js/market-visuals.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Not in cache - fetch from network
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Add to cache for future use
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);
        
        // You could return a custom offline page here
        // return caches.match('/offline.html');
      })
  );
});

// Message event - handle messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New trading alert!',
    // icon: '/icon-192.png', // Optional - add if you create icons
    // badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'trading-alert',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Trading Guide', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Loaded');

