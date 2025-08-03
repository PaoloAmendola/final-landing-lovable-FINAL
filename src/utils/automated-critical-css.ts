/**
 * Automated Critical CSS Extraction and Optimization
 * Version 2.0 - Enhanced with automatic inlining and performance budgets
 */

interface CriticalCSSConfig {
  viewport: {
    width: number;
    height: number;
  };
  inlineThreshold: number;
  performanceBudget: {
    maxCriticalSize: number;
    maxTotalSize: number;
    maxRenderBlocking: number;
  };
  whitelist?: string[];
  blacklist?: string[];
  enableMinification: boolean;
  enableAutoPrefixer: boolean;
}

interface CriticalCSSResult {
  criticalCSS: string;
  nonCriticalCSS: string;
  stats: {
    originalSize: number;
    criticalSize: number;
    nonCriticalSize: number;
    compressionRatio: number;
    renderBlocking: number;
    performance: {
      beforeFCP: number;
      afterFCP: number;
      improvement: number;
    };
  };
  recommendations: string[];
}

const DEFAULT_CONFIG: CriticalCSSConfig = {
  viewport: { width: 1920, height: 1080 },
  inlineThreshold: 14 * 1024, // 14KB
  performanceBudget: {
    maxCriticalSize: 14 * 1024, // 14KB
    maxTotalSize: 100 * 1024, // 100KB
    maxRenderBlocking: 3
  },
  enableMinification: true,
  enableAutoPrefixer: true
};

class AutomatedCriticalCSS {
  private config: CriticalCSSConfig;
  private observer: IntersectionObserver | null = null;
  private criticalRules: Set<string> = new Set();
  private processedSheets: Set<string> = new Set();

  constructor(config: Partial<CriticalCSSConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Main extraction function - automatically detects and extracts critical CSS
   */
  async extractCriticalCSS(): Promise<CriticalCSSResult> {
    if (import.meta.env.DEV) {
      console.log('[Critical CSS] Starting automated extraction...');
    }

    const startTime = performance.now();

    try {
      // Step 1: Initialize viewport and collect visible elements
      await this.initializeViewport();
      const visibleElements = this.getVisibleElements();

      // Step 2: Analyze stylesheets and extract critical rules
      const allStylesheets = this.getAllStylesheets();
      await this.analyzeStylesheets(allStylesheets, visibleElements);

      // Step 3: Process and optimize critical CSS
      const criticalCSS = await this.processCriticalCSS();
      const nonCriticalCSS = await this.extractNonCriticalCSS(allStylesheets);

      // Step 4: Generate performance metrics and recommendations
      const stats = this.generateStats(criticalCSS, nonCriticalCSS, startTime);
      const recommendations = this.generateRecommendations(stats);

      if (import.meta.env.DEV) {
        console.log('[Critical CSS] Extraction complete:', stats);
      }

      return {
        criticalCSS,
        nonCriticalCSS,
        stats,
        recommendations
      };

    } catch (error) {
      console.error('[Critical CSS] Extraction failed:', error);
      throw error;
    }
  }

  /**
   * Initialize viewport simulation for critical CSS detection
   */
  private async initializeViewport(): Promise<void> {
    // Set viewport dimensions for critical fold calculation
    const viewport = this.config.viewport;
    
    // Create temporary container to measure critical fold
    const testContainer = document.createElement('div');
    testContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${viewport.width}px;
      height: ${viewport.height}px;
      opacity: 0;
      pointer-events: none;
      z-index: -9999;
    `;
    
    document.body.appendChild(testContainer);
    
    // Initialize intersection observer for critical fold detection
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.markElementAsCritical(entry.target);
          }
        });
      },
      {
        root: testContainer,
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Clean up test container
    setTimeout(() => {
      document.body.removeChild(testContainer);
    }, 100);
  }

  /**
   * Get all elements visible in the critical viewport
   */
  private getVisibleElements(): Element[] {
    const viewport = this.config.viewport;
    const elements: Element[] = [];

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          const element = node as Element;
          const rect = element.getBoundingClientRect();
          
          // Check if element is in critical fold
          const isVisible = (
            rect.top < viewport.height &&
            rect.left < viewport.width &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            this.isElementVisible(element)
          );

          return isVisible ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      elements.push(node as Element);
    }

    return elements;
  }

  /**
   * Check if element is actually visible (not hidden by CSS)
   */
  private isElementVisible(element: Element): boolean {
    const style = getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) > 0 &&
      (element as HTMLElement).offsetWidth > 0 &&
      (element as HTMLElement).offsetHeight > 0
    );
  }

  /**
   * Get all CSS stylesheets from the document
   */
  private getAllStylesheets(): CSSStyleSheet[] {
    const stylesheets: CSSStyleSheet[] = [];

    // Get stylesheet elements
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(element => {
      if (element instanceof HTMLLinkElement && element.sheet) {
        stylesheets.push(element.sheet);
      } else if (element instanceof HTMLStyleElement && element.sheet) {
        stylesheets.push(element.sheet);
      }
    });

    return stylesheets.filter(sheet => this.isSameOrigin(sheet));
  }

  /**
   * Check if stylesheet is from same origin (to avoid CORS issues)
   */
  private isSameOrigin(stylesheet: CSSStyleSheet): boolean {
    try {
      // Try to access rules - will throw if cross-origin
      const rules = stylesheet.cssRules || stylesheet.rules;
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[Critical CSS] Skipping cross-origin stylesheet:', stylesheet.href);
      }
      return false;
    }
  }

  /**
   * Analyze stylesheets and identify critical rules
   */
  private async analyzeStylesheets(stylesheets: CSSStyleSheet[], visibleElements: Element[]): Promise<void> {
    for (const stylesheet of stylesheets) {
      try {
        await this.processStylesheet(stylesheet, visibleElements);
      } catch (error) {
        console.warn('[Critical CSS] Error processing stylesheet:', error);
      }
    }
  }

  /**
   * Process individual stylesheet
   */
  private async processStylesheet(stylesheet: CSSStyleSheet, visibleElements: Element[]): Promise<void> {
    const href = stylesheet.href || 'inline';
    if (this.processedSheets.has(href)) return;

    this.processedSheets.add(href);

    try {
      const rules = stylesheet.cssRules || stylesheet.rules;
      
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        await this.processRule(rule, visibleElements);
      }
    } catch (error) {
      console.warn('[Critical CSS] Error processing stylesheet rules:', error);
    }
  }

  /**
   * Process individual CSS rule
   */
  private async processRule(rule: CSSRule, visibleElements: Element[]): Promise<void> {
    if (rule instanceof CSSStyleRule) {
      // Check if rule applies to any visible elements
      const isCritical = this.isRuleCritical(rule, visibleElements);
      
      if (isCritical) {
        this.criticalRules.add(rule.cssText);
      }
    } else if (rule instanceof CSSMediaRule) {
      // Process media queries
      const mediaMatches = window.matchMedia(rule.media.mediaText).matches;
      if (mediaMatches) {
        for (let i = 0; i < rule.cssRules.length; i++) {
          await this.processRule(rule.cssRules[i], visibleElements);
        }
      }
    } else if (rule instanceof CSSImportRule) {
      // Handle @import rules
      if (rule.styleSheet) {
        await this.processStylesheet(rule.styleSheet, visibleElements);
      }
    }
  }

  /**
   * Check if a CSS rule is critical (applies to visible elements)
   */
  private isRuleCritical(rule: CSSStyleRule, visibleElements: Element[]): boolean {
    try {
      // Check against whitelist/blacklist
      if (this.config.whitelist?.some(pattern => rule.selectorText.includes(pattern))) {
        return true;
      }
      
      if (this.config.blacklist?.some(pattern => rule.selectorText.includes(pattern))) {
        return false;
      }

      // Check if selector matches any visible elements
      const matches = visibleElements.some(element => {
        try {
          return element.matches(rule.selectorText);
        } catch (error) {
          // Invalid selector
          return false;
        }
      });

      return matches;
    } catch (error) {
      return false;
    }
  }

  /**
   * Mark element as critical for styling
   */
  private markElementAsCritical(element: Element): void {
    element.setAttribute('data-critical', 'true');
  }

  /**
   * Process and optimize critical CSS
   */
  private async processCriticalCSS(): Promise<string> {
    let criticalCSS = Array.from(this.criticalRules).join('\n');

    if (this.config.enableMinification) {
      criticalCSS = this.minifyCSS(criticalCSS);
    }

    if (this.config.enableAutoPrefixer) {
      criticalCSS = this.addAutoPrefixes(criticalCSS);
    }

    return criticalCSS;
  }

  /**
   * Extract non-critical CSS
   */
  private async extractNonCriticalCSS(stylesheets: CSSStyleSheet[]): Promise<string> {
    const allRules = new Set<string>();
    
    for (const stylesheet of stylesheets) {
      try {
        const rules = stylesheet.cssRules || stylesheet.rules;
        for (let i = 0; i < rules.length; i++) {
          allRules.add(rules[i].cssText);
        }
      } catch (error) {
        // Skip inaccessible stylesheets
      }
    }

    // Remove critical rules from all rules
    const nonCriticalRules = Array.from(allRules).filter(rule => 
      !this.criticalRules.has(rule)
    );

    return nonCriticalRules.join('\n');
  }

  /**
   * Minify CSS
   */
  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon
      .replace(/\s*{\s*/g, '{') // Clean braces
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*,\s*/g, ',') // Clean commas
      .replace(/\s*:\s*/g, ':') // Clean colons
      .replace(/\s*;\s*/g, ';') // Clean semicolons
      .trim();
  }

  /**
   * Add vendor prefixes (simplified)
   */
  private addAutoPrefixes(css: string): string {
    // Simplified autoprefixer - in production use a proper autoprefixer library
    const prefixMap = {
      'transform': ['-webkit-transform', '-moz-transform', '-ms-transform'],
      'transition': ['-webkit-transition', '-moz-transition', '-ms-transition'],
      'animation': ['-webkit-animation', '-moz-animation', '-ms-animation'],
      'box-shadow': ['-webkit-box-shadow', '-moz-box-shadow'],
      'border-radius': ['-webkit-border-radius', '-moz-border-radius']
    };

    let prefixedCSS = css;
    
    Object.entries(prefixMap).forEach(([property, prefixes]) => {
      const regex = new RegExp(`(^|[^-])${property}:`, 'gm');
      prefixedCSS = prefixedCSS.replace(regex, (match, prefix) => {
        const prefixed = prefixes.map(p => `${prefix}${p}:`).join('') + match;
        return prefixed;
      });
    });

    return prefixedCSS;
  }

  /**
   * Generate performance statistics
   */
  private generateStats(criticalCSS: string, nonCriticalCSS: string, startTime: number): CriticalCSSResult['stats'] {
    const originalSize = (criticalCSS + nonCriticalCSS).length;
    const criticalSize = criticalCSS.length;
    const nonCriticalSize = nonCriticalCSS.length;
    const processingTime = performance.now() - startTime;

    return {
      originalSize,
      criticalSize,
      nonCriticalSize,
      compressionRatio: criticalSize / originalSize,
      renderBlocking: this.countRenderBlockingResources(),
      performance: {
        beforeFCP: 0, // Would be measured in real implementation
        afterFCP: 0, // Would be measured after optimization
        improvement: processingTime
      }
    };
  }

  /**
   * Count render-blocking resources
   */
  private countRenderBlockingResources(): number {
    const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
    const styleElements = document.querySelectorAll('style');
    const scriptElements = document.querySelectorAll('script:not([async]):not([defer])');
    
    return linkElements.length + styleElements.length + scriptElements.length;
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(stats: CriticalCSSResult['stats']): string[] {
    const recommendations: string[] = [];

    if (stats.criticalSize > this.config.performanceBudget.maxCriticalSize) {
      recommendations.push(
        `Critical CSS size (${Math.round(stats.criticalSize / 1024)}KB) exceeds budget. Consider reducing critical styles or splitting components.`
      );
    }

    if (stats.renderBlocking > this.config.performanceBudget.maxRenderBlocking) {
      recommendations.push(
        `Too many render-blocking resources (${stats.renderBlocking}). Consider inlining critical CSS and async loading non-critical resources.`
      );
    }

    if (stats.compressionRatio > 0.8) {
      recommendations.push(
        'High critical-to-total CSS ratio. Consider lazy-loading non-critical styles or removing unused CSS.'
      );
    }

    if (stats.compressionRatio < 0.1) {
      recommendations.push(
        'Very low critical CSS ratio. Consider including more above-the-fold styles in critical CSS.'
      );
    }

    return recommendations;
  }
}

/**
 * Automatically optimize critical CSS for the current page
 */
export async function optimizeCriticalCSS(config?: Partial<CriticalCSSConfig>): Promise<CriticalCSSResult> {
  if (import.meta.env.DEV) {
    console.log('[Critical CSS] Starting optimization...');
  }

  const optimizer = new AutomatedCriticalCSS(config);
  const result = await optimizer.extractCriticalCSS();

  // Auto-apply optimizations if enabled
  if (result.stats.criticalSize <= (config?.inlineThreshold || DEFAULT_CONFIG.inlineThreshold)) {
    await applyOptimizations(result);
  }

  if (result.stats.performance.improvement > 0) {
    if (import.meta.env.DEV) {
      console.log('[Critical CSS] Optimization complete:', result.stats);
    }
  }

  return result;
}

/**
 * Apply critical CSS optimizations to the page
 */
async function applyOptimizations(result: CriticalCSSResult): Promise<void> {
  try {
    // Inline critical CSS
    const criticalStyle = document.createElement('style');
    criticalStyle.setAttribute('data-critical', 'true');
    criticalStyle.textContent = result.criticalCSS;
    document.head.insertBefore(criticalStyle, document.head.firstChild);

    // Defer non-critical CSS
    const nonCriticalLink = document.createElement('link');
    nonCriticalLink.rel = 'preload';
    nonCriticalLink.setAttribute('as', 'style');
    nonCriticalLink.onload = function() {
      (this as HTMLLinkElement).onload = null;
      (this as HTMLLinkElement).rel = 'stylesheet';
    };
    
    // Create blob URL for non-critical CSS
    const blob = new Blob([result.nonCriticalCSS], { type: 'text/css' });
    nonCriticalLink.href = URL.createObjectURL(blob);
    
    document.head.appendChild(nonCriticalLink);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = nonCriticalLink.href;
    noscript.appendChild(fallbackLink);
    document.head.appendChild(noscript);

  } catch (error) {
    console.error('[Critical CSS] Failed to apply optimizations:', error);
  }
}

export { AutomatedCriticalCSS };
export type { CriticalCSSConfig, CriticalCSSResult };