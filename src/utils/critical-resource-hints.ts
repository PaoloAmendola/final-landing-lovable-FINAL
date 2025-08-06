/**
 * Critical Resource Hints - Intelligent preloading and prefetching
 */

interface ResourceHintOptions {
  priority?: 'high' | 'low' | 'auto';
  crossorigin?: boolean;
  as?: 'font' | 'image' | 'script' | 'style' | 'document';
  media?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
}

class CriticalResourceHints {
  private addedHints = new Set<string>();
  
  /**
   * Add critical resource preload hints to document head
   */
  addPreload(href: string, options: ResourceHintOptions = {}) {
    if (this.addedHints.has(`preload:${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    
    if (options.as) link.setAttribute('as', options.as);
    if (options.crossorigin) link.crossOrigin = 'anonymous';
    if (options.fetchpriority) link.setAttribute('fetchpriority', options.fetchpriority);
    if (options.media) link.media = options.media;
    
    document.head.appendChild(link);
    this.addedHints.add(`preload:${href}`);
  }

  /**
   * Add prefetch hints for resources needed later
   */
  addPrefetch(href: string, options: ResourceHintOptions = {}) {
    if (this.addedHints.has(`prefetch:${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    if (options.as) link.setAttribute('as', options.as);
    if (options.crossorigin) link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.addedHints.add(`prefetch:${href}`);
  }

  /**
   * Add DNS prefetch for cross-origin domains
   */
  addDnsPrefetch(domain: string) {
    if (this.addedHints.has(`dns-prefetch:${domain}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    
    document.head.appendChild(link);
    this.addedHints.add(`dns-prefetch:${domain}`);
  }

  /**
   * Add preconnect for critical cross-origin resources
   */
  addPreconnect(href: string, crossorigin = false) {
    if (this.addedHints.has(`preconnect:${href}`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    
    if (crossorigin) link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.addedHints.add(`preconnect:${href}`);
  }

  /**
   * Initialize critical resource hints for the application
   */
  initializeCriticalHints() {
    // Critical images - highest priority
    this.addPreload(
      'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero.webp',
      { as: 'image', fetchpriority: 'high' }
    );
    
    this.addPreload(
      'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/logo-bembeauty-transparente.webp',
      { as: 'image', fetchpriority: 'high' }
    );

    // Critical fonts
    this.addPreload(
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
      { as: 'style', crossorigin: true }
    );

    // DNS prefetch for external domains
    this.addDnsPrefetch('fsntuympgysgfgqdvzsp.supabase.co');
    this.addDnsPrefetch('fonts.googleapis.com');
    this.addDnsPrefetch('fonts.gstatic.com');
    this.addDnsPrefetch('www.googletagmanager.com');
    this.addDnsPrefetch('www.google-analytics.com');

    // Preconnect to critical origins
    this.addPreconnect('https://fsntuympgysgfgqdvzsp.supabase.co', true);
    this.addPreconnect('https://fonts.googleapis.com');
    this.addPreconnect('https://fonts.gstatic.com', true);

    // Prefetch below-the-fold resources
    setTimeout(() => {
      this.addPrefetch(
        'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-destaque.webp',
        { as: 'image' }
      );
    }, 2000);
  }

  /**
   * Add resource hints based on user interaction patterns
   */
  addInteractionBasedHints() {
    // Preload resources likely to be needed based on scroll position
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          switch (sectionId) {
            case 'produto':
              this.addPrefetch(
                'https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/frasco-nivela-destaque.webp',
                { as: 'image' }
              );
              break;
              
            case 'tecnologia':
              // Prefetch technology section assets
              break;
              
            case 'ingredientes':
              // Prefetch Amazon ingredients assets
              break;
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '200px 0px'
    });

    // Observe sections for intelligent prefetching
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
  }

  /**
   * Clear all added hints (useful for cleanup)
   */
  clear() {
    this.addedHints.clear();
  }

  /**
   * Get statistics about added hints
   */
  getStats() {
    const stats = {
      total: this.addedHints.size,
      preloads: 0,
      prefetches: 0,
      dnsPrefetches: 0,
      preconnects: 0
    };

    this.addedHints.forEach((hint) => {
      if (hint.startsWith('preload:')) stats.preloads++;
      else if (hint.startsWith('prefetch:')) stats.prefetches++;
      else if (hint.startsWith('dns-prefetch:')) stats.dnsPrefetches++;
      else if (hint.startsWith('preconnect:')) stats.preconnects++;
    });

    return stats;
  }
}

// Export singleton instance
export const criticalResourceHints = new CriticalResourceHints();

// Initialize on module load
if (typeof window !== 'undefined') {
  // Initialize critical hints immediately
  criticalResourceHints.initializeCriticalHints();
  
  // Add interaction-based hints after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      criticalResourceHints.addInteractionBasedHints();
    });
  } else {
    criticalResourceHints.addInteractionBasedHints();
  }
}

export default criticalResourceHints;