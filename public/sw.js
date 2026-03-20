/* Emuski Service Worker - Enhanced for 3D CAD Analysis */

const CACHE_NAME = 'emuski-cache-v3';
const STATIC_CACHE_NAME = 'emuski-static-v3';

// Critical assets for 3D CAD analysis
const ASSETS_TO_CACHE = [
  '/',
  '/tools/3d-cad-analysis',
  '/favicon.ico',
  '/manifest.json',
  '/fonts/InterVariable.woff2',
  '/assets/emuski-logo-optimized.webp'
];

// API patterns for caching
const CACHE_FIRST_APIS = [
  /^\/api\/credits\/status/,
];

const NETWORK_FIRST_APIS = [
  /^\/api\/dfm-analysis/,
  /^\/api\/upload/,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Never try to cache chrome-extension or non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Only cache same-origin requests - don't intercept cross-origin requests we don't control
  if (url.origin !== self.location.origin) return;

  // Handle API requests with specific strategies
  if (CACHE_FIRST_APIS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            // Update cache in background
            fetch(event.request).then(response => {
              cache.put(event.request, response.clone());
            }).catch(() => {});
            return cachedResponse;
          }
          
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  if (NETWORK_FIRST_APIS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Default strategy for static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(fetchResponse => {
        // Cache successful responses for future use
        if (fetchResponse.ok) {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      });
    })
  );
});
