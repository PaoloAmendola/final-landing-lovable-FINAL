/**
 * Performance Monitor - Real-time performance tracking and optimization
 */

interface PerformanceMetrics {
  lcp: number | null;
  fcp: number | null;
  cls: number | null;
  fid: number | null;
  ttfb: number | null;
  totalBlockingTime: number | null;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: 'script' | 'stylesheet' | 'image' | 'fetch' | 'other';
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fcp: null,
    cls: null,
    fid: null,
    ttfb: null,
    totalBlockingTime: null
  };

  private resourceTimings: ResourceTiming[] = [];
  private isMonitoring = false;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFCP();
    this.observeCLS();
    this.observeFID();
    this.measureTTFB();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Generate performance report
    setTimeout(() => this.generateReport(), 10000); // After 10s
  }

  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
        
        // Alert if LCP is critical
        if (this.metrics.lcp > 4000) {
          console.warn('🚨 Critical LCP detected:', this.metrics.lcp + 'ms');
          this.suggestLCPOptimizations();
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }
  }

  private observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observer not supported');
    }
  }

  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  private observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  private measureTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0] as any;
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
    }
  }

  private observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        const resourceTiming: ResourceTiming = {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize || 0,
          type: this.getResourceType(entry.name)
        };
        
        this.resourceTimings.push(resourceTiming);
        
        // Alert for slow resources
        if (resourceTiming.duration > 1000) {
          console.warn('🐌 Slow resource detected:', resourceTiming);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource timing observer not supported');
    }
  }

  private getResourceType(url: string): ResourceTiming['type'] {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('api') || url.includes('supabase')) return 'fetch';
    return 'other';
  }

  private suggestLCPOptimizations() {
    const suggestions = [
      '🖼️ Optimize hero images with WebP format',
      '⚡ Add preload tags for critical images',
      '📦 Reduce bundle size with code splitting',
      '🚀 Use CDN for static assets',
      '🗜️ Compress images and use responsive sizes'
    ];
    
    console.group('💡 LCP Optimization Suggestions');
    suggestions.forEach(suggestion => console.log(suggestion));
    console.groupEnd();
  }

  private generateReport() {
    const score = this.calculatePerformanceScore();
    
    console.group('📊 Performance Report');
    console.log('🎯 Performance Score:', score + '/100');
    console.log('📈 Core Web Vitals:', this.metrics);
    console.log('📦 Resource Timings:', this.resourceTimings.length + ' resources');
    
    if (score < 70) {
      console.warn('⚠️ Performance needs improvement');
      this.generateOptimizationSuggestions();
    } else if (score >= 90) {
      console.log('🎉 Excellent performance!');
    }
    
    console.groupEnd();
  }

  private calculatePerformanceScore(): number {
    const { lcp, fcp, cls, fid } = this.metrics;
    let score = 100;

    // LCP scoring (40% weight)
    if (lcp !== null) {
      if (lcp > 4000) score -= 40;
      else if (lcp > 2500) score -= 20;
      else if (lcp > 1200) score -= 10;
    }

    // FCP scoring (20% weight)
    if (fcp !== null) {
      if (fcp > 3000) score -= 20;
      else if (fcp > 1800) score -= 10;
      else if (fcp > 1000) score -= 5;
    }

    // CLS scoring (20% weight)
    if (cls !== null) {
      if (cls > 0.25) score -= 20;
      else if (cls > 0.1) score -= 10;
      else if (cls > 0.05) score -= 5;
    }

    // FID scoring (20% weight)
    if (fid !== null) {
      if (fid > 300) score -= 20;
      else if (fid > 100) score -= 10;
      else if (fid > 50) score -= 5;
    }

    return Math.max(0, score);
  }

  private generateOptimizationSuggestions() {
    const suggestions: string[] = [];

    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      suggestions.push('🖼️ Optimize LCP element (likely hero image)');
      suggestions.push('⚡ Add fetchpriority="high" to LCP image');
    }

    if (this.metrics.fcp && this.metrics.fcp > 1800) {
      suggestions.push('🎨 Inline critical CSS');
      suggestions.push('📦 Reduce JavaScript bundle size');
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      suggestions.push('📐 Set explicit dimensions for images');
      suggestions.push('🔒 Reserve space for dynamic content');
    }

    if (this.metrics.fid && this.metrics.fid > 100) {
      suggestions.push('⚡ Reduce main thread blocking');
      suggestions.push('🔄 Use Web Workers for heavy tasks');
    }

    console.group('💡 Optimization Suggestions');
    suggestions.forEach(suggestion => console.log(suggestion));
    console.groupEnd();
  }

  // Public API
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getResourceTimings(): ResourceTiming[] {
    return [...this.resourceTimings];
  }

  getPerformanceScore(): number {
    return this.calculatePerformanceScore();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components
export const usePerformanceMonitor = () => {
  return {
    getMetrics: () => performanceMonitor.getMetrics(),
    getScore: () => performanceMonitor.getPerformanceScore(),
    getResourceTimings: () => performanceMonitor.getResourceTimings()
  };
};