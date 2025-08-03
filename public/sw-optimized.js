const CACHE_NAME = 'nivela-v1.3.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png', // Logo
  '/lovable-uploads/icone-bem-beauty.png',
];

// Enhanced cache patterns with performance optimization
const RUNTIME_CACHE_PATTERNS = [
  { pattern: /^https:\/\/fonts\.googleapis\.com/, strategy: 'StaleWhileRevalidate', maxAge: 86400000 }, // 1 day
  { pattern: /^https:\/\/fonts\.gstatic\.com/, strategy: 'CacheFirst', maxAge: 604800000 }, // 7 days
  { pattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/, strategy: 'CacheFirst', maxAge: 604800000 }, // 7 days
  { pattern: /\.(?:js|css)$/, strategy: 'StaleWhileRevalidate', maxAge: 86400000 }, // 1 day
  { pattern: /^https:\/\/xnexfhgtqlryfkyuvihq\.supabase\.co/, strategy: 'StaleWhileRevalidate', maxAge: 300000 }, // 5 minutes
  { pattern: /^https:\/\/www\.googletagmanager\.com/, strategy: 'NetworkFirst', maxAge: 3600000 }, // 1 hour
  { pattern: /^https:\/\/www\.google-analytics\.com/, strategy: 'NetworkFirst', maxAge: 3600000 } // 1 hour
];

// Performance metrics tracking
const performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  slowRequests: 0
};

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing optimized service worker v1.3.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching critical assets...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Critical assets cached successfully');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Precaching failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating optimized service worker v1.3.0');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Cache cleanup complete');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[SW] Activation failed:', error);
      })
  );
});

// Fetch event - intelligent caching with performance monitoring
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    handleFetchWithMetrics(event.request)
  );
});

async function handleFetchWithMetrics(request) {
  const startTime = performance.now();
  
  try {
    const response = await handleRequest(request);
    
    // Log performance metrics (sample 10% of requests)
    if (Math.random() < 0.1) {
      const duration = performance.now() - startTime;
      logPerformanceMetric(request, duration, response);
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return getFallbackResponse(request);
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    return handleNavigationRequest(request);
  }

  // Handle other requests based on patterns
  for (const { pattern, strategy, maxAge } of RUNTIME_CACHE_PATTERNS) {
    if (pattern.test(request.url)) {
      return handleWithStrategy(request, strategy, maxAge);
    }
  }

  // Default: Network First for unknown requests
  return handleWithStrategy(request, 'NetworkFirst', 86400000);
}

async function handleNavigationRequest(request) {
  try {
    // Try network first for fresh content
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      performanceMetrics.networkRequests++;
    }
    
    return response;
  } catch (error) {
    // Fallback to cache or offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match(OFFLINE_URL) || getFallbackResponse(request);
  }
}

async function handleWithStrategy(request, strategy, maxAge = 86400000) {
  switch (strategy) {
    case 'CacheFirst':
      return cacheFirst(request, maxAge);
    case 'NetworkFirst':
      return networkFirst(request, maxAge);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, maxAge);
    default:
      return networkFirst(request, maxAge);
  }
}

async function cacheFirst(request, maxAge) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isCacheExpired(cachedResponse, maxAge)) {
    performanceMetrics.cacheHits++;
    return cachedResponse;
  }

  try {
    performanceMetrics.networkRequests++;
    const response = await fetch(request);
    
    if (response.status === 200) {
      await putInCacheWithTimestamp(cache, request, response.clone());
    }
    
    return response;
  } catch (error) {
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      return cachedResponse;
    }
    throw error;
  }
}

async function networkFirst(request, maxAge) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    performanceMetrics.networkRequests++;
    const response = await fetch(request);
    
    if (response.status === 200) {
      await putInCacheWithTimestamp(cache, request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, maxAge) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Start network request in background
  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.status === 200) {
        putInCacheWithTimestamp(cache, request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.warn('[SW] Background network update failed:', error);
      return null;
    });

  // Return cached version immediately if available and not expired
  if (cachedResponse && !isCacheExpired(cachedResponse, maxAge)) {
    performanceMetrics.cacheHits++;
    // Network update happens in background
    return cachedResponse;
  }

  // Wait for network if no cache or cache expired
  performanceMetrics.networkRequests++;
  return networkResponsePromise || cachedResponse;
}

async function putInCacheWithTimestamp(cache, request, response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-at', Date.now().toString());
  
  const modifiedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });

  await cache.put(request, modifiedResponse);
}

function isCacheExpired(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const age = Date.now() - parseInt(cachedAt);
  return age > maxAge;
}

function getFallbackResponse(request) {
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - NIVELA®</title>
        <style>
          body {
            font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
            margin: 0; padding: 0;
            background: linear-gradient(135deg, #0D181C, #254C5A);
            color: #D9C0AA; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            text-align: center;
          }
          .container { max-width: 400px; padding: 2rem; }
          .icon { font-size: 4rem; margin-bottom: 1rem; }
          h1 { color: #9D4916; margin-bottom: 1rem; }
          button {
            background: linear-gradient(135deg, #9D4916, #D9C0AA);
            color: white; border: none; padding: 0.75rem 1.5rem;
            border-radius: 0.75rem; font-weight: 600; cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📶</div>
          <h1>Você está offline</h1>
          <p>Verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()">Tentar Novamente</button>
        </div>
        <script>
          window.addEventListener('online', () => window.location.reload());
          setInterval(() => {
            if (navigator.onLine) window.location.reload();
          }, 30000);
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  return new Response('Network error', { status: 408 });
}

function logPerformanceMetric(request, duration, response) {
  if (duration > 1000) { // Log slow requests (>1s)
    performanceMetrics.slowRequests++;
    console.warn('[SW] Slow request detected:', {
      url: request.url,
      duration: Math.round(duration),
      cached: response.headers.get('sw-cached-at') ? true : false
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('[SW] Background sync triggered');
  // Handle offline form submissions or analytics
}

// Push notifications support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova atualização do NIVELA®',
      icon: '/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png',
      badge: '/lovable-uploads/icone-bem-beauty.png',
      tag: 'nivela-notification',
      renotify: true,
      data: data.url
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'NIVELA® - Novidades', 
        options
      )
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Performance metrics endpoint
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_METRICS') {
    event.ports[0]?.postMessage({
      metrics: performanceMetrics,
      version: CACHE_NAME,
      timestamp: Date.now()
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Optimized Service Worker v1.3.0 loaded successfully');