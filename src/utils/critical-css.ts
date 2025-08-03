/**
 * Critical CSS Extraction and Optimization
 * Automatically identifies and inlines critical CSS for above-the-fold content
 */

interface CriticalCSSConfig {
  viewport: {
    width: number;
    height: number;
  };
  selectors: {
    critical: string[];
    defer: string[];
  };
  inlineThreshold: number; // bytes
}

const DEFAULT_CONFIG: CriticalCSSConfig = {
  viewport: {
    width: 1920,
    height: 1080
  },
  selectors: {
    critical: [
      // Layout and typography
      'html', 'body', 'main',
      // Header and hero section
      'header', '.hero', '[id="inicio"]',
      // Navigation
      'nav', '.nav', '.navigation',
      // Critical typography
      'h1', 'h2', '.font-montserrat',
      // Critical buttons
      '.btn', 'button',
      // Loading states
      '.loading', '.skeleton',
      // Brand colors and gradients
      '.bg-gradient-subtle', '.bg-gradient-accent', '.text-brand-*'
    ],
    defer: [
      // Non-critical sections
      '[id="faq"]', '[id="contato"]', '[id="pre-footer"]',
      // Animations
      '.animate-*', '.transition-*',
      // Interactive states
      ':hover', ':focus', ':active',
      // Media queries for large screens
      '@media (min-width: 1920px)'
    ]
  },
  inlineThreshold: 14 * 1024 // 14KB - critical CSS budget
};

class CriticalCSSExtractor {
  private config: CriticalCSSConfig;
  private criticalRules: string[] = [];
  private deferredRules: string[] = [];

  constructor(config: Partial<CriticalCSSConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Extract critical CSS from all stylesheets
   */
  async extractCritical(): Promise<{
    critical: string;
    deferred: string;
    stats: {
      criticalSize: number;
      deferredSize: number;
      totalRules: number;
      criticalRules: number;
    };
  }> {
    if (import.meta.env.DEV) {
      console.log('[Critical CSS] Starting extraction...');
    }

    try {
      // Get all stylesheets
      const stylesheets = Array.from(document.styleSheets);
      
      for (const stylesheet of stylesheets) {
        await this.processStylesheet(stylesheet);
      }

      const critical = this.criticalRules.join('\n');
      const deferred = this.deferredRules.join('\n');

      const stats = {
        criticalSize: new Blob([critical]).size,
        deferredSize: new Blob([deferred]).size,
        totalRules: this.criticalRules.length + this.deferredRules.length,
        criticalRules: this.criticalRules.length
      };

      if (import.meta.env.DEV) {
        console.log('[Critical CSS] Extraction complete:', stats);
      }

      return { critical, deferred, stats };
    } catch (error) {
      console.error('[Critical CSS] Extraction failed:', error);
      return {
        critical: '',
        deferred: '',
        stats: { criticalSize: 0, deferredSize: 0, totalRules: 0, criticalRules: 0 }
      };
    }
  }

  /**
   * Process individual stylesheet
   */
  private async processStylesheet(stylesheet: CSSStyleSheet) {
    try {
      // Skip external stylesheets that might have CORS issues
      if (stylesheet.href && !this.isSameOrigin(stylesheet.href)) {
        console.warn('[Critical CSS] Skipping external stylesheet:', stylesheet.href);
        return;
      }

      const rules = Array.from(stylesheet.cssRules || []);
      
      for (const rule of rules) {
        this.processRule(rule);
      }
    } catch (error) {
      console.warn('[Critical CSS] Error processing stylesheet:', error);
    }
  }

  /**
   * Process individual CSS rule
   */
  private processRule(rule: CSSRule) {
    const ruleText = rule.cssText;

    // Handle different rule types
    switch (rule.type) {
      case CSSRule.STYLE_RULE:
        this.processStyleRule(rule as CSSStyleRule);
        break;
      
      case CSSRule.MEDIA_RULE:
        this.processMediaRule(rule as CSSMediaRule);
        break;
      
      case CSSRule.IMPORT_RULE:
        // Defer imports to avoid blocking
        this.deferredRules.push(ruleText);
        break;
      
      case CSSRule.FONT_FACE_RULE:
        // Critical: font faces are needed immediately
        this.criticalRules.push(ruleText);
        break;
      
      case CSSRule.KEYFRAMES_RULE:
        // Defer: animations are usually not critical
        this.deferredRules.push(ruleText);
        break;
      
      default:
        // Other rules go to critical by default
        this.criticalRules.push(ruleText);
    }
  }

  /**
   * Process style rule
   */
  private processStyleRule(rule: CSSStyleRule) {
    const selector = rule.selectorText;
    const isCritical = this.isCriticalSelector(selector);
    
    // Check if any elements match this selector in the viewport
    const hasMatchingElements = this.hasElementsInViewport(selector);
    
    if (isCritical || hasMatchingElements) {
      this.criticalRules.push(rule.cssText);
    } else {
      this.deferredRules.push(rule.cssText);
    }
  }

  /**
   * Process media rule
   */
  private processMediaRule(rule: CSSMediaRule) {
    const mediaText = rule.media.mediaText;
    
    // Check if media query applies to critical viewport
    if (this.isMediaQueryCritical(mediaText)) {
      // Process rules within this media query
      const nestedRules = Array.from(rule.cssRules);
      const criticalNestedRules: string[] = [];
      
      nestedRules.forEach(nestedRule => {
        if (nestedRule.type === CSSRule.STYLE_RULE) {
          const styleRule = nestedRule as CSSStyleRule;
          if (this.isCriticalSelector(styleRule.selectorText) || 
              this.hasElementsInViewport(styleRule.selectorText)) {
            criticalNestedRules.push(styleRule.cssText);
          }
        }
      });

      if (criticalNestedRules.length > 0) {
        this.criticalRules.push(`@media ${mediaText} { ${criticalNestedRules.join(' ')} }`);
      }
    } else {
      this.deferredRules.push(rule.cssText);
    }
  }

  /**
   * Check if selector should be considered critical
   */
  private isCriticalSelector(selector: string): boolean {
    return this.config.selectors.critical.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(selector);
      }
      return selector.includes(pattern);
    });
  }

  /**
   * Check if selector should be deferred
   */
  private isDeferredSelector(selector: string): boolean {
    return this.config.selectors.defer.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(selector);
      }
      return selector.includes(pattern);
    });
  }

  /**
   * Check if elements matching selector exist in viewport
   */
  private hasElementsInViewport(selector: string): boolean {
    try {
      const elements = document.querySelectorAll(selector);
      
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        
        // Check if element is in the critical viewport
        if (rect.top < this.config.viewport.height &&
            rect.bottom > 0 &&
            rect.left < this.config.viewport.width &&
            rect.right > 0) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      // Invalid selector
      return false;
    }
  }

  /**
   * Check if media query is critical for initial load
   */
  private isMediaQueryCritical(mediaText: string): boolean {
    // Always include base styles and small screens
    if (!mediaText || mediaText === 'all') return true;
    
    // Include mobile-first queries
    if (mediaText.includes('max-width') || mediaText.includes('min-width: 0')) return true;
    
    // Include screen media
    if (mediaText.includes('screen')) return true;
    
    // Check specific breakpoints
    const widthMatch = mediaText.match(/min-width:\s*(\d+)px/);
    if (widthMatch) {
      const minWidth = parseInt(widthMatch[1]);
      return minWidth <= this.config.viewport.width;
    }
    
    return false;
  }

  /**
   * Check if URL is same origin
   */
  private isSameOrigin(url: string): boolean {
    try {
      const urlObj = new URL(url, window.location.href);
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  }
}

/**
 * Inline critical CSS and defer non-critical styles
 */
export async function optimizeCriticalCSS(config?: Partial<CriticalCSSConfig>) {
  if (import.meta.env.DEV) {
    console.log('[Critical CSS] Starting optimization...');
  }

  const extractor = new CriticalCSSExtractor(config);
  const { critical, deferred, stats } = await extractor.extractCritical();

  // Check if critical CSS is within budget
  if (stats.criticalSize > (config?.inlineThreshold || DEFAULT_CONFIG.inlineThreshold)) {
    console.warn(`[Critical CSS] Critical CSS size (${stats.criticalSize}b) exceeds budget`);
  }

  // Inline critical CSS
  if (critical) {
    const styleElement = document.createElement('style');
    styleElement.id = 'critical-css';
    styleElement.textContent = critical;
    document.head.insertBefore(styleElement, document.head.firstChild);
  }

  // Defer non-critical CSS
  if (deferred) {
    const deferredStyleElement = document.createElement('style');
    deferredStyleElement.id = 'deferred-css';
    deferredStyleElement.media = 'print'; // Load but don't apply
    deferredStyleElement.textContent = deferred;
    
    // Switch to screen media after load
    deferredStyleElement.addEventListener('load', () => {
      deferredStyleElement.media = 'all';
    });
    
    document.head.appendChild(deferredStyleElement);
  }

  if (import.meta.env.DEV) {
    console.log('[Critical CSS] Optimization complete:', stats);
  }
  return stats;
}

/**
 * Load CSS asynchronously
 */
export function loadCSSAsync(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Load but don't apply initially
    
    link.onload = () => {
      link.media = 'all'; // Apply after load
      resolve();
    };
    
    link.onerror = () => {
      reject(new Error(`Failed to load CSS: ${href}`));
    };
    
    document.head.appendChild(link);
  });
}

/**
 * Preload CSS for faster subsequent loads
 */
export function preloadCSS(href: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  document.head.appendChild(link);
}
