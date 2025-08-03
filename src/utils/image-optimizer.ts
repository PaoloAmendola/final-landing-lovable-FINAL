/**
 * Image optimization utilities for NIVELA® project
 * Provides WebP conversion with fallback support
 */

interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'avif';
  fallback?: boolean;
}

/**
 * Convert image source to WebP format with fallback
 */
export const convertToWebP = (src: string, config: ImageOptimizationConfig = {}) => {
  const { quality = 85, format = 'webp', fallback = true } = config;
  
  if (!src || typeof src !== 'string') {
    return src;
  }

  // Check if already optimized
  if (src.includes('.webp') || src.includes('.avif')) {
    return src;
  }

  // Convert common formats
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return webpSrc;
};

/**
 * Generate responsive image sources for different screen sizes
 */
export const generateResponsiveSources = (src: string) => {
  const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '');
  
  return {
    webp: {
      mobile: `${baseSrc}-mobile.webp`,
      tablet: `${baseSrc}-tablet.webp`,
      desktop: `${baseSrc}-desktop.webp`,
    },
    fallback: {
      mobile: `${baseSrc}-mobile.jpg`,
      tablet: `${baseSrc}-tablet.jpg`, 
      desktop: `${baseSrc}-desktop.jpg`,
    }
  };
};

/**
 * Check if browser supports WebP format
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (images: string[]) => {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = convertToWebP(src);
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
};

/**
 * Lazy load image with intersection observer
 */
export const createLazyImageObserver = (callback?: (entry: IntersectionObserverEntry) => void) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = convertToWebP(src);
            img.removeAttribute('data-src');
            observer.unobserve(img);
            
            callback?.(entry);
          }
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.1
    }
  );

  return observer;
};