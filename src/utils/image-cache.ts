import { logger } from '@/utils/logger';

interface CacheEntry {
  blob: Blob;
  timestamp: number;
  size: number;
}

class ImageCacheManager {
  private cache = new Map<string, CacheEntry>();
  private maxCacheSize = 50 * 1024 * 1024; // 50MB
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours
  private currentCacheSize = 0;

  constructor() {
    // Clean expired entries on initialization
    this.cleanExpiredEntries();
    
    // Set up periodic cleanup
    setInterval(() => this.cleanExpiredEntries(), 60 * 60 * 1000); // Every hour
  }

  async cacheImage(url: string, quality?: number): Promise<string> {
    try {
      // Check if already cached and still valid
      const cached = this.cache.get(url);
      if (cached && Date.now() - cached.timestamp < this.maxAge) {
        return URL.createObjectURL(cached.blob);
      }

      // Fetch and cache the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Optimize if needed
      const optimizedBlob = await this.optimizeImage(blob, quality);
      
      // Check cache size limits
      if (this.currentCacheSize + optimizedBlob.size > this.maxCacheSize) {
        this.evictOldEntries(optimizedBlob.size);
      }

      // Cache the image
      const entry: CacheEntry = {
        blob: optimizedBlob,
        timestamp: Date.now(),
        size: optimizedBlob.size
      };

      this.cache.set(url, entry);
      this.currentCacheSize += optimizedBlob.size;

      logger.info('Image cached successfully', {
        url,
        size: optimizedBlob.size,
        cacheSize: this.currentCacheSize
      });

      return URL.createObjectURL(optimizedBlob);
    } catch (error) {
      logger.error('Failed to cache image', { url, error });
      return url; // Fallback to original URL
    }
  }

  private async optimizeImage(blob: Blob, quality = 0.85): Promise<Blob> {
    return new Promise((resolve) => {
      // Skip optimization for non-image types or small images
      if (!blob.type.startsWith('image/') || blob.size < 50 * 1024) {
        resolve(blob);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate optimized dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (optimizedBlob) => {
            resolve(optimizedBlob || blob);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(blob);
      img.src = URL.createObjectURL(blob);
    });
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    let removedSize = 0;

    for (const [url, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(url);
        removedSize += entry.size;
      }
    }

    this.currentCacheSize -= removedSize;
    
    if (removedSize > 0) {
      logger.info('Cleaned expired cache entries', {
        removedSize,
        currentCacheSize: this.currentCacheSize
      });
    }
  }

  private evictOldEntries(neededSize: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp); // Oldest first

    let freedSize = 0;
    for (const [url, entry] of entries) {
      this.cache.delete(url);
      freedSize += entry.size;
      this.currentCacheSize -= entry.size;

      if (freedSize >= neededSize) {
        break;
      }
    }

    logger.info('Evicted old cache entries', {
      freedSize,
      neededSize,
      currentCacheSize: this.currentCacheSize
    });
  }

  getCacheStats() {
    return {
      size: this.currentCacheSize,
      entries: this.cache.size,
      maxSize: this.maxCacheSize
    };
  }

  clearCache(): void {
    this.cache.clear();
    this.currentCacheSize = 0;
    logger.info('Image cache cleared');
  }
}

// Export singleton instance
export const imageCache = new ImageCacheManager();

// Preload critical images
export const preloadCriticalImages = async (urls: string[]) => {
  const promises = urls.map(url => imageCache.cacheImage(url, 0.9));
  
  try {
    await Promise.allSettled(promises);
    logger.info('Critical images preloaded', { count: urls.length });
  } catch (error) {
    logger.error('Failed to preload some critical images', { error });
  }
};