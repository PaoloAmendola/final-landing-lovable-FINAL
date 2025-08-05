import { useEffect, useCallback, useState } from 'react';
import { logger } from '@/utils/logger';

interface PerformanceBudget {
  maxImageSize: number;
  maxBundleSize: number;
  maxRenderTime: number;
}

interface UsePerformanceOptimizationOptions {
  enableImageOptimization?: boolean;
  enableLazyLoading?: boolean;
  performanceBudget?: PerformanceBudget;
}

export const usePerformanceOptimization = (options: UsePerformanceOptimizationOptions = {}) => {
  const {
    enableImageOptimization = true,
    enableLazyLoading = true,
    performanceBudget = {
      maxImageSize: 500 * 1024,
      maxBundleSize: 2 * 1024 * 1024,
      maxRenderTime: 200
    }
  } = options;

  const [renderStartTime, setRenderStartTime] = useState<number>(0);

  // Detecta conexão lenta
  const isSlowConnection = useCallback(() => {
    const connection = (navigator as any).connection;
    if (!connection) return false;
    
    return (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData === true
    );
  }, []);

  // Otimiza imagens baseado na conexão
  const getOptimizedImageSrc = useCallback((src: string, width?: number) => {
    if (!enableImageOptimization) return src;
    
    if (isSlowConnection()) {
      // Para conexões lentas, usar versões menores
      return src.replace(/\.(jpg|jpeg|png)$/, '_thumb.$1');
    }
    return src;
  }, [isSlowConnection, enableImageOptimization]);

  // Preload crítico de recursos
  const preloadCriticalResources = useCallback((resources: string[] = []) => {
    const defaultCriticalImages = [
      '/lovable-uploads/image-hero.png',
      '/lovable-uploads/icone-bem-beauty.png'
    ];

    const allResources = [...defaultCriticalImages, ...resources];

    allResources.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  // Observer para lazy loading
  const createLazyObserver = useCallback((callback: (entries: IntersectionObserverEntry[]) => void) => {
    if (!enableLazyLoading) return null;
    
    const options = {
      root: null,
      rootMargin: isSlowConnection() ? '50px' : '100px',
      threshold: 0.1
    };

    return new IntersectionObserver(callback, options);
  }, [isSlowConnection, enableLazyLoading]);

  // Cleanup de recursos não utilizados
  const cleanupUnusedResources = useCallback(() => {
    // Remove listeners de scroll desnecessários
    const unusedListeners = document.querySelectorAll('[data-scroll-listener]');
    unusedListeners.forEach(el => {
      el.removeAttribute('data-scroll-listener');
    });

    // Limpa cache de imagens antigas
    if ('caches' in window) {
      caches.open('nivela-images-v1').then(cache => {
        cache.keys().then(keys => {
          const oldKeys = keys.filter(key => {
            const url = new URL(key.url);
            return url.pathname.includes('old-') || url.pathname.includes('backup-');
          });
          
          oldKeys.forEach(key => cache.delete(key));
        });
      });
    }
  }, []);

  // Timing utilities
  const startRenderTiming = useCallback(() => {
    setRenderStartTime(performance.now());
  }, []);

  const endRenderTiming = useCallback(() => {
    if (renderStartTime > 0) {
      const renderTime = performance.now() - renderStartTime;
      
      if (renderTime > performanceBudget.maxRenderTime) {
        logger.warn('Render time exceeded budget', {
          renderTime,
          budget: performanceBudget.maxRenderTime,
          timestamp: Date.now()
        });
      }
      
      setRenderStartTime(0);
    }
  }, [renderStartTime, performanceBudget.maxRenderTime]);

  // Monitora performance em tempo real
  useEffect(() => {
    let performanceObserver: PerformanceObserver;

    if ('PerformanceObserver' in window) {
      performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime;
            
            if (lcp > 4000) {
              logger.warn('LCP muito alto detectado', {
                lcp,
                timestamp: Date.now(),
                url: window.location.pathname
              });
              
              // Ação corretiva automática
              document.documentElement.style.setProperty('--animation-duration', '0.1s');
            }
          }

          if (entry.entryType === 'layout-shift') {
            const cls = (entry as any).value;
            
            if (cls > 0.1) {
              logger.warn('Layout shift detectado', {
                cls,
                element: (entry as any).sources?.[0]?.node,
                timestamp: Date.now()
              });
            }
          }
        });
      });

      try {
        performanceObserver.observe({ 
          entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input']
        });
      } catch (error) {
        logger.warn('Performance Observer não suportado', { error });
      }
    }

    // Cleanup em intervalos
    const cleanupInterval = setInterval(cleanupUnusedResources, 30000);

    return () => {
      performanceObserver?.disconnect();
      clearInterval(cleanupInterval);
    };
  }, [cleanupUnusedResources]);

  return {
    isSlowConnection: isSlowConnection(),
    getOptimizedImageSrc,
    preloadCriticalResources,
    createLazyObserver,
    cleanupUnusedResources,
    startRenderTiming,
    endRenderTiming
  };
};