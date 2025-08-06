// Optimized Service Worker for Production
// Version: 2.0.0 - Performance Focused

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  videos: `videos-${CACHE_VERSION}`
};

// Simplified cache strategies
const STATIC_CACHE_PATTERNS = [
  /\.(js|css|woff2?|ttf)$/,
  /\/assets\//,
  /favicon\.ico$/
];

const IMAGE_CACHE_PATTERNS = [
  /\.(png|jpg|jpeg|gif|svg|webp)$/,
  /\/lovable-uploads\//
];

const VIDEO_CACHE_PATTERNS = [
  /\.(mp4|webm)$/,
  /\/videos\//
];

class OptimizedServiceWorker {
  constructor() {
    this.init();
  }

  init() {
    self.addEventListener('install', (event) => {
      event.waitUntil(this.handleInstall());
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(this.handleActivate());
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(this.handleFetch(event));
    });
  }

  async handleInstall() {
    try {
      const cache = await caches.open(CACHE_NAMES.static);
      
      const criticalResources = [
        '/',
        '/manifest.json'
      ];

      await cache.addAll(criticalResources);
      self.skipWaiting();
    } catch (error) {
      // Silent failure
    }
  }

  async handleActivate() {
    try {
      // Clean old caches
      const cacheNames = await caches.keys();
      const deletePromises = cacheNames
        .filter(name => !Object.values(CACHE_NAMES).includes(name))
        .map(name => caches.delete(name));
      
      await Promise.all(deletePromises);
      await self.clients.claim();
    } catch (error) {
      // Silent failure
    }
  }

  async handleFetch(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
      return fetch(request);
    }

    // Handle different resource types
    if (this.matchesPatterns(url.pathname, STATIC_CACHE_PATTERNS)) {
      return this.cacheFirst(request, CACHE_NAMES.static);
    }

    if (this.matchesPatterns(url.pathname, IMAGE_CACHE_PATTERNS)) {
      return this.cacheFirst(request, CACHE_NAMES.images);
    }

    if (this.matchesPatterns(url.pathname, VIDEO_CACHE_PATTERNS)) {
      return this.networkFirst(request, CACHE_NAMES.videos);
    }

    // Default: network first
    return this.networkFirst(request, CACHE_NAMES.static);
  }

  matchesPatterns(pathname, patterns) {
    return patterns.some(pattern => pattern.test(pathname));
  }

  async cacheFirst(request, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(request);
      
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      return new Response('Offline content not available', { status: 503 });
    }
  }

  async networkFirst(request, cacheName) {
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.status === 200) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return new Response('Network error', { status: 503 });
    }
  }
}

// Initialize the optimized service worker
new OptimizedServiceWorker();