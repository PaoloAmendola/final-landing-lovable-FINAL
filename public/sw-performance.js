// Service Worker Performance - Otimizado para NIVELA®
const CACHE_NAME = 'nivela-v1.0.0';
const STATIC_CACHE = 'nivela-static-v1';
const DYNAMIC_CACHE = 'nivela-dynamic-v1';
const IMAGE_CACHE = 'nivela-images-v1';

// Recursos críticos para cache
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  // CSS crítico
  // JS crítico
];

// Recursos estáticos
const STATIC_RESOURCES = [
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico'
];

// Padrões de imagem para cache otimizado
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
  /supabase\.co.*\/storage.*\.(png|jpg|jpeg|webp|avif)$/
];

// Install - Cache recursos críticos
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(CRITICAL_RESOURCES.concat(STATIC_RESOURCES))
      )
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate - Limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch - Estratégias de cache otimizadas
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Só processar requests GET
  if (request.method !== 'GET') return;
  
  // Ignora extensões do Chrome
  if (url.protocol === 'chrome-extension:') return;
  
  // Estratégia para diferentes tipos de recursos
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticResource(request)) {
    event.respondWith(handleStaticRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Verifica se é request de imagem
function isImageRequest(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Verifica se é recurso estático
function isStaticResource(request) {
  const url = new URL(request.url);
  return STATIC_RESOURCES.some(resource => url.pathname.includes(resource));
}

// Verifica se é request da API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('supabase.co') && url.pathname.includes('/rest/');
}

// Handler para imagens - Cache First com fallback
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    if (response.ok) {
      // Só cache imagens pequenas (< 1MB)
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 1024 * 1024) {
        cache.put(request, response.clone());
      }
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Image request failed:', error);
    // Retorna placeholder em caso de erro
    return new Response('', { status: 503, statusText: 'Image Unavailable' });
  }
}

// Handler para recursos estáticos - Cache First
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Static request failed:', error);
    return caches.match(request);
  }
}

// Handler para API - Network First com timeout
async function handleAPIRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Timeout de 3 segundos para requests da API
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 3000)
      )
    ]);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] API request failed, trying cache:', error);
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handler para navegação - Network First com fallback
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Navigation request failed:', error);
    
    // Tenta cache primeiro
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Fallback para página inicial
    return caches.match('/');
  }
}

// Background Sync para analytics offline
self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    // Implementar sync de analytics quando online
    console.log('[SW] Syncing analytics data...');
  } catch (error) {
    console.log('[SW] Analytics sync failed:', error);
  }
}

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
    console.log('[SW] Performance measure:', event.data.measure);
  }
});