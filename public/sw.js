
const CACHE_NAME = 'ai-vs-human-v1'; // Version bump

// Install event: Skip waiting to activate the new SW immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: Claim clients immediately so the SW controls the page right away
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches if needed
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Fetch event: Network First Strategy with Dynamic Caching
// 1. Try to get the latest content from the network (Vercel).
// 2. If successful, save it to the cache (update) and return it.
// 3. If network fails (offline), return the cached version.
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests or chrome-extension schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try to serve from cache
        return caches.match(event.request);
      })
  );
});