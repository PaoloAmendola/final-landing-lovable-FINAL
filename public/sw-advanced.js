// Advanced Service Worker with intelligent caching strategies
// Version: 1.2.0

const CACHE_VERSION = 'v1.2.0';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  videos: `videos-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`
};

// Cache strategies configuration
const CACHE_STRATEGIES = {
  // Static assets: Cache First with network fallback
  static: {
    patterns: [
      /\.(js|css|woff2?|ttf|eot)$/,
      /\/assets\//,
      /\/images\//,
      /favicon\.ico$/
    ],
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },

  // Images: Cache First with WebP optimization
  images: {
    patterns: [
      /\.(png|jpg|jpeg|gif|svg|webp)$/,
      /\/lovable-uploads\//,
      /\/public\//
    ],
    strategy: 'CacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 200
  },

  // Videos: Network First with cache fallback
  videos: {
    patterns: [
      /\.(mp4|webm|avi|mov)$/,
      /\/videos\//,
      /\/lovable-uploads\/.*\.(mp4|webm|avi|mov)$/
    ],
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 20
  },

  // API calls: Network First with stale-while-revalidate
  api: {
    patterns: [
      /\/api\//,
      /\.json$/
    ],
    strategy: 'NetworkFirst',
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },

  // HTML pages: Network First with cache fallback
  pages: {
    patterns: [
      /\.html$/,
      /\/$/,
      /\?/
    ],
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 30
  }
};

// Performance monitoring
const PERFORMANCE_CONFIG = {
  enableMetrics: true,
  sampleRate: 0.1, // Sample 10% of requests
  slowRequestThreshold: 1000 // 1 second
};

class AdvancedServiceWorker {
  constructor() {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      slowRequests: 0
    };
    
    this.init();
  }

  init() {
    // Install event
    self.addEventListener('install', (event) => {
      console.log('[SW] Installing advanced service worker', CACHE_VERSION);
      event.waitUntil(this.handleInstall());
    });

    // Activate event
    self.addEventListener('activate', (event) => {
      console.log('[SW] Activating advanced service worker', CACHE_VERSION);
      event.waitUntil(this.handleActivate());
    });

    // Fetch event
    self.addEventListener('fetch', (event) => {
      event.respondWith(this.handleFetch(event));
    });

    // Background sync
    self.addEventListener('sync', (event) => {
      if (event.tag === 'background-analytics') {
        event.waitUntil(this.handleBackgroundSync());
      }
    });

    // Push notifications (for future use)
    self.addEventListener('push', (event) => {
      event.waitUntil(this.handlePushMessage(event));
    });
  }

  async handleInstall() {
    try {
      // Pre-cache critical resources
      const cache = await caches.open(CACHE_NAMES.static);
      
      const criticalResources = [
        '/',
        '/index.html',
        '/manifest.json',
        // Add critical CSS and JS files
        '/src/index.css',
        // Add critical images
        '/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png', // Logo
        '/lovable-uploads/b7bd961d-cfd0-44fe-abc4-50e429c53251.png'  // Hero image
      ];

      await cache.addAll(criticalResources);
      console.log('[SW] Critical resources cached');

      // Skip waiting to activate immediately
      self.skipWaiting();
    } catch (error) {
      console.error('[SW] Installation failed:', error);
    }
  }

  async handleActivate() {
    try {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        Object.values(CACHE_NAMES).every(currentName => name !== currentName)
      );

      await Promise.all(
        oldCaches.map(cacheName => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );

      // Claim all clients
      await self.clients.claim();
      console.log('[SW] Service worker activated and claimed clients');
    } catch (error) {
      console.error('[SW] Activation failed:', error);
    }
  }

  async handleFetch(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
      return fetch(request);
    }

    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) {
      return fetch(request);
    }

    // Determine cache strategy
    const strategy = this.getCacheStrategy(request);
    
    // Performance monitoring
    const startTime = performance.now();
    
    try {
      const response = await this.executeStrategy(strategy, request);
      
      // Log performance metrics
      if (PERFORMANCE_CONFIG.enableMetrics && Math.random() < PERFORMANCE_CONFIG.sampleRate) {
        const duration = performance.now() - startTime;
        this.logPerformanceMetric(request, duration, response);
      }
      
      return response;
    } catch (error) {
      console.error('[SW] Fetch failed:', error);
      return this.getFallbackResponse(request);
    }
  }

  getCacheStrategy(request) {
    const url = request.url;
    
    // Check each strategy pattern
    for (const [strategyName, config] of Object.entries(CACHE_STRATEGIES)) {
      if (config.patterns.some(pattern => pattern.test(url))) {
        return { name: strategyName, config };
      }
    }
    
    // Default strategy
    return { name: 'dynamic', config: { strategy: 'NetworkFirst' } };
  }

  async executeStrategy(strategy, request) {
    const { name, config } = strategy;
    const cacheName = CACHE_NAMES[name] || CACHE_NAMES.dynamic;

    switch (config.strategy) {
      case 'CacheFirst':
        return this.cacheFirst(request, cacheName, config);
      
      case 'NetworkFirst':
        return this.networkFirst(request, cacheName, config);
      
      case 'StaleWhileRevalidate':
        return this.staleWhileRevalidate(request, cacheName, config);
      
      default:
        return this.networkFirst(request, cacheName, config);
    }
  }

  async cacheFirst(request, cacheName, config) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      this.metrics.cacheHits++;
      
      // Check if cache is expired
      if (this.isCacheExpired(cachedResponse, config.maxAge)) {
        // Update cache in background
        this.updateCacheInBackground(request, cache);
      }
      
      return cachedResponse;
    }

    this.metrics.cacheMisses++;
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await this.putInCache(cache, request, networkResponse.clone(), config);
    }
    
    return networkResponse;
  }

  async networkFirst(request, cacheName, config) {
    const cache = await caches.open(cacheName);
    
    try {
      this.metrics.networkRequests++;
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        await this.putInCache(cache, request, networkResponse.clone(), config);
      }
      
      return networkResponse;
    } catch (error) {
      console.warn('[SW] Network failed, trying cache:', error);
      
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        this.metrics.cacheHits++;
        return cachedResponse;
      }
      
      throw error;
    }
  }

  async staleWhileRevalidate(request, cacheName, config) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Always try to update from network
    const networkResponsePromise = fetch(request)
      .then(response => {
        if (response.ok) {
          this.putInCache(cache, request, response.clone(), config);
        }
        return response;
      })
      .catch(error => {
        console.warn('[SW] Network update failed:', error);
        return null;
      });

    // Return cached version immediately if available
    if (cachedResponse) {
      this.metrics.cacheHits++;
      // Network update happens in background
      networkResponsePromise;
      return cachedResponse;
    }

    // Wait for network if no cache
    this.metrics.cacheMisses++;
    return networkResponsePromise;
  }

  async putInCache(cache, request, response, config) {
    // Clone response before caching
    const responseToCache = response.clone();
    
    // Add timestamp for expiration checking
    const headers = new Headers(responseToCache.headers);
    headers.set('sw-cached-at', Date.now().toString());
    
    const modifiedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers
    });

    await cache.put(request, modifiedResponse);
    
    // Enforce cache size limits
    if (config.maxEntries) {
      await this.enforceMaxEntries(cache, config.maxEntries);
    }
  }

  async enforceMaxEntries(cache, maxEntries) {
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
      // Remove oldest entries (FIFO)
      const entriesToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(entriesToDelete.map(key => cache.delete(key)));
    }
  }

  isCacheExpired(response, maxAge) {
    if (!maxAge) return false;
    
    const cachedAt = response.headers.get('sw-cached-at');
    if (!cachedAt) return false;
    
    const age = Date.now() - parseInt(cachedAt);
    return age > maxAge;
  }

  async updateCacheInBackground(request, cache) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response);
      }
    } catch (error) {
      console.warn('[SW] Background cache update failed:', error);
    }
  }

  getFallbackResponse(request) {
    // Return offline fallback for pages
    if (request.destination === 'document') {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Offline - NIVELA®</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: system-ui; text-align: center; padding: 2rem; background: linear-gradient(135deg, #0D181C, #254C5A);">
          <h1 style="color: #D9C0AA;">Você está offline</h1>
          <p style="color: #A6B8C1;">Verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()" style="background: #9D4916; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; cursor: pointer;">
            Tentar Novamente
          </button>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Return network error for other requests
    return new Response('Network error', { status: 408 });
  }

  logPerformanceMetric(request, duration, response) {
    if (duration > PERFORMANCE_CONFIG.slowRequestThreshold) {
      this.metrics.slowRequests++;
      console.warn('[SW] Slow request detected:', {
        url: request.url,
        duration: Math.round(duration),
        cached: response.headers.get('sw-cached-at') ? true : false
      });
    }
  }

  async handleBackgroundSync() {
    try {
      // Sync analytics data
      const analyticsData = await this.getStoredAnalytics();
      if (analyticsData.length > 0) {
        await this.sendAnalytics(analyticsData);
        await this.clearStoredAnalytics();
      }
    } catch (error) {
      console.error('[SW] Background sync failed:', error);
    }
  }

  async handlePushMessage(event) {
    const data = event.data ? event.data.json() : {};
    
    const options = {
      body: data.body || 'Nova atualização do NIVELA®',
      icon: '/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png',
      badge: '/favicon.ico',
      tag: 'nivela-update',
      renotify: true,
      actions: [
        {
          action: 'open',
          title: 'Ver Agora'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ]
    };

    await self.registration.showNotification(
      data.title || 'NIVELA® - Novidades',
      options
    );
  }

  async getStoredAnalytics() {
    // Implement getting stored analytics from IndexedDB
    return [];
  }

  async sendAnalytics(data) {
    // Implement sending analytics to server
    return true;
  }

  async clearStoredAnalytics() {
    // Implement clearing analytics from IndexedDB
    return true;
  }
}

// Initialize the advanced service worker
new AdvancedServiceWorker();

// Performance monitoring endpoint
self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_METRICS') {
    event.ports[0].postMessage({
      metrics: self.sw?.metrics || {},
      version: CACHE_VERSION,
      caches: Object.keys(CACHE_NAMES)
    });
  }
});

console.log('[SW] Advanced Service Worker script loaded');