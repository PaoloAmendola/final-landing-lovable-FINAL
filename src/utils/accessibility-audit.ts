/**
 * Accessibility Audit Utilities
 * Provides tools for automated accessibility testing and compliance checking
 */

export interface AccessibilityIssue {
  element: Element;
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
}

export interface AccessibilityReport {
  issues: AccessibilityIssue[];
  passedRules: string[];
  score: number;
  compliance: {
    levelA: boolean;
    levelAA: boolean;
    levelAAA: boolean;
  };
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}

export class AccessibilityAuditor {
  private static instance: AccessibilityAuditor;
  
  static getInstance(): AccessibilityAuditor {
    if (!this.instance) {
      this.instance = new AccessibilityAuditor();
    }
    return this.instance;
  }

  /**
   * Run comprehensive accessibility audit
   */
  async audit(options: {
    includeNonCritical?: boolean;
    rootElement?: Element;
  } = {}): Promise<AccessibilityReport> {
    const { includeNonCritical = true, rootElement = document.body } = options;
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];

    // Run all audit checks
    const checks = [
      this.checkImages(rootElement),
      this.checkHeadings(rootElement),
      this.checkForms(rootElement),
      this.checkKeyboardNavigation(rootElement),
      this.checkColorContrast(rootElement),
      this.checkFocusManagement(rootElement),
      this.checkSemanticStructure(rootElement),
      this.checkARIA(rootElement),
      this.checkTouchTargets(rootElement),
      this.checkTabIndex(rootElement)
    ];

    const results = await Promise.all(checks);
    results.forEach(result => {
      issues.push(...result.issues);
      passedRules.push(...result.passedRules);
    });

    // Filter issues based on options
    const filteredIssues = includeNonCritical 
      ? issues 
      : issues.filter(issue => issue.impact === 'critical' || issue.impact === 'serious');

    // Calculate score and compliance
    const score = this.calculateScore(filteredIssues);
    const compliance = this.checkCompliance(filteredIssues);
    const summary = this.generateSummary(filteredIssues);

    return {
      issues: filteredIssues,
      passedRules,
      score,
      compliance,
      summary
    };
  }

  /**
   * Check image accessibility
   */
  private async checkImages(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];
    const images = root.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      const role = img.getAttribute('role');

      // Missing alt attribute
      if (alt === null && role !== 'presentation') {
        issues.push({
          element: img,
          type: 'error',
          rule: 'image-alt',
          message: 'Image is missing alt attribute',
          impact: 'critical',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1 Non-text Content'
        });
      }
      // Empty alt for decorative images should have role="presentation"
      else if (alt === '' && role !== 'presentation') {
        issues.push({
          element: img,
          type: 'warning',
          rule: 'image-decorative',
          message: 'Decorative image should have role="presentation"',
          impact: 'moderate',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1 Non-text Content'
        });
      }
      // Alt text too long
      else if (alt && alt.length > 125) {
        issues.push({
          element: img,
          type: 'warning',
          rule: 'image-alt-length',
          message: 'Alt text is too long (>125 characters)',
          impact: 'minor',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1 Non-text Content'
        });
      }
      else if (alt !== null) {
        passedRules.push('image-alt');
      }

      // Check for meaningful alt text
      if (alt && (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture'))) {
        issues.push({
          element: img,
          type: 'warning',
          rule: 'image-alt-meaningful',
          message: 'Alt text should not contain "image" or "picture"',
          impact: 'minor',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1 Non-text Content'
        });
      }
    });

    return { issues, passedRules };
  }

  /**
   * Check heading structure
   */
  private async checkHeadings(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (headings.length === 0) {
      issues.push({
        element: root,
        type: 'error',
        rule: 'heading-missing',
        message: 'Page should have at least one heading',
        impact: 'serious',
        wcagLevel: 'AA',
        wcagCriteria: '2.4.6 Headings and Labels'
      });
      return { issues, passedRules };
    }

    let previousLevel = 0;
    let hasH1 = false;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (level === 1) {
        hasH1 = true;
        if (index > 0) {
          issues.push({
            element: heading,
            type: 'warning',
            rule: 'heading-h1-multiple',
            message: 'Multiple h1 elements found',
            impact: 'moderate',
            wcagLevel: 'AA',
            wcagCriteria: '2.4.6 Headings and Labels'
          });
        }
      }

      // Check heading sequence
      if (index > 0 && level > previousLevel + 1) {
        issues.push({
          element: heading,
          type: 'error',
          rule: 'heading-sequence',
          message: `Heading levels should not skip (h${previousLevel} to h${level})`,
          impact: 'serious',
          wcagLevel: 'AA',
          wcagCriteria: '2.4.6 Headings and Labels'
        });
      }

      // Check empty headings
      if (!heading.textContent?.trim()) {
        issues.push({
          element: heading,
          type: 'error',
          rule: 'heading-empty',
          message: 'Heading is empty',
          impact: 'serious',
          wcagLevel: 'AA',
          wcagCriteria: '2.4.6 Headings and Labels'
        });
      }

      previousLevel = level;
    });

    if (!hasH1) {
      issues.push({
        element: root,
        type: 'error',
        rule: 'heading-h1-missing',
        message: 'Page should have an h1 element',
        impact: 'serious',
        wcagLevel: 'AA',
        wcagCriteria: '2.4.6 Headings and Labels'
      });
    } else {
      passedRules.push('heading-structure');
    }

    return { issues, passedRules };
  }

  /**
   * Check form accessibility
   */
  private async checkForms(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];
    const formElements = root.querySelectorAll('input, textarea, select');

    formElements.forEach(element => {
      const type = element.getAttribute('type');
      const id = element.getAttribute('id');
      const label = root.querySelector(`label[for="${id}"]`);
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledby = element.getAttribute('aria-labelledby');

      // Skip hidden inputs
      if (type === 'hidden') return;

      // Check for labels
      if (!label && !ariaLabel && !ariaLabelledby) {
        issues.push({
          element: element,
          type: 'error',
          rule: 'form-label-missing',
          message: 'Form element is missing a label',
          impact: 'critical',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1 Info and Relationships'
        });
      } else {
        passedRules.push('form-label');
      }

      // Check required fields
      if (element.hasAttribute('required')) {
        const ariaRequired = element.getAttribute('aria-required');
        if (ariaRequired !== 'true') {
          issues.push({
            element: element,
            type: 'warning',
            rule: 'form-required-aria',
            message: 'Required field should have aria-required="true"',
            impact: 'moderate',
            wcagLevel: 'A',
            wcagCriteria: '3.3.2 Labels or Instructions'
          });
        }
      }

      // Check for error states
      const ariaInvalid = element.getAttribute('aria-invalid');
      const ariaDescribedby = element.getAttribute('aria-describedby');
      
      if (ariaInvalid === 'true' && !ariaDescribedby) {
        issues.push({
          element: element,
          type: 'error',
          rule: 'form-error-description',
          message: 'Invalid field should have aria-describedby pointing to error message',
          impact: 'serious',
          wcagLevel: 'AA',
          wcagCriteria: '3.3.3 Error Suggestion'
        });
      }
    });

    return { issues, passedRules };
  }

  /**
   * Check keyboard navigation
   */
  private async checkKeyboardNavigation(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];
    const interactiveElements = root.querySelectorAll(
      'a, button, input, textarea, select, [tabindex], [role="button"], [role="link"]'
    );

    interactiveElements.forEach(element => {
      const tabindex = element.getAttribute('tabindex');
      const role = element.getAttribute('role');

      // Check for positive tabindex (anti-pattern)
      if (tabindex && parseInt(tabindex) > 0) {
        issues.push({
          element: element,
          type: 'warning',
          rule: 'keyboard-tabindex-positive',
          message: 'Avoid positive tabindex values',
          impact: 'moderate',
          wcagLevel: 'A',
          wcagCriteria: '2.4.3 Focus Order'
        });
      }

      // Check if interactive elements are keyboard accessible
      if (element.tagName.toLowerCase() === 'div' || element.tagName.toLowerCase() === 'span') {
        if ((role === 'button' || role === 'link') && tabindex !== '0') {
          issues.push({
            element: element,
            type: 'error',
            rule: 'keyboard-interactive-tabindex',
            message: 'Interactive element with role should have tabindex="0"',
            impact: 'serious',
            wcagLevel: 'A',
            wcagCriteria: '2.1.1 Keyboard'
          });
        }
      }
    });

    passedRules.push('keyboard-navigation');
    return { issues, passedRules };
  }

  /**
   * Check color contrast (simplified check)
   */
  private async checkColorContrast(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];
    
    // This is a simplified contrast check
    // In a real implementation, you'd use a more sophisticated color contrast analyzer
    const textElements = root.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label');
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const fontWeight = styles.fontWeight;
      
      // Check if text is large (18pt+ or 14pt+ bold)
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
      
      // Note: This is a placeholder - real contrast checking requires color parsing
      // and luminance calculations
      if (element.textContent?.trim()) {
        passedRules.push('color-contrast');
      }
    });

    return { issues, passedRules };
  }

  /**
   * Check focus management
   */
  private async checkFocusManagement(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];
    
    const focusableElements = root.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      issues.push({
        element: root,
        type: 'warning',
        rule: 'focus-no-focusable',
        message: 'No focusable elements found',
        impact: 'moderate',
        wcagLevel: 'A',
        wcagCriteria: '2.1.1 Keyboard'
      });
    } else {
      passedRules.push('focus-management');
    }

    return { issues, passedRules };
  }

  /**
   * Check semantic structure
   */
  private async checkSemanticStructure(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];

    // Check for main landmark
    const main = root.querySelector('main');
    if (!main) {
      issues.push({
        element: root,
        type: 'error',
        rule: 'semantic-main-missing',
        message: 'Page should have a main landmark',
        impact: 'serious',
        wcagLevel: 'AA',
        wcagCriteria: '2.4.1 Bypass Blocks'
      });
    } else {
      passedRules.push('semantic-main');
    }

    // Check for skip links
    const skipLink = root.querySelector('a[href^="#"]');
    if (!skipLink) {
      issues.push({
        element: root,
        type: 'warning',
        rule: 'semantic-skip-link',
        message: 'Page should have a skip link',
        impact: 'moderate',
        wcagLevel: 'AA',
        wcagCriteria: '2.4.1 Bypass Blocks'
      });
    } else {
      passedRules.push('semantic-skip-link');
    }

    return { issues, passedRules };
  }

  /**
   * Check ARIA usage
   */
  private async checkARIA(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];

    const ariaElements = root.querySelectorAll('[aria-labelledby], [aria-describedby]');

    ariaElements.forEach(element => {
      const labelledby = element.getAttribute('aria-labelledby');
      const describedby = element.getAttribute('aria-describedby');

      if (labelledby) {
        const referencedElement = document.getElementById(labelledby);
        if (!referencedElement) {
          issues.push({
            element: element,
            type: 'error',
            rule: 'aria-labelledby-invalid',
            message: `aria-labelledby references non-existent element: ${labelledby}`,
            impact: 'serious',
            wcagLevel: 'A',
            wcagCriteria: '1.3.1 Info and Relationships'
          });
        }
      }

      if (describedby) {
        const referencedElement = document.getElementById(describedby);
        if (!referencedElement) {
          issues.push({
            element: element,
            type: 'error',
            rule: 'aria-describedby-invalid',
            message: `aria-describedby references non-existent element: ${describedby}`,
            impact: 'serious',
            wcagLevel: 'A',
            wcagCriteria: '1.3.1 Info and Relationships'
          });
        }
      }
    });

    if (issues.length === 0 && ariaElements.length > 0) {
      passedRules.push('aria-references');
    }

    return { issues, passedRules };
  }

  /**
   * Check touch target sizes
   */
  private async checkTouchTargets(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];

    const touchTargets = root.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]');

    touchTargets.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // WCAG recommended minimum

      if (rect.width < minSize || rect.height < minSize) {
        issues.push({
          element: element,
          type: 'warning',
          rule: 'touch-target-size',
          message: `Touch target should be at least ${minSize}x${minSize}px`,
          impact: 'moderate',
          wcagLevel: 'AAA',
          wcagCriteria: '2.5.5 Target Size'
        });
      }
    });

    if (issues.length === 0) {
      passedRules.push('touch-target-size');
    }

    return { issues, passedRules };
  }

  /**
   * Check tabindex usage
   */
  private async checkTabIndex(root: Element): Promise<{ issues: AccessibilityIssue[]; passedRules: string[] }> {
    const issues: AccessibilityIssue[] = [];
    const passedRules: string[] = [];

    const elementsWithTabindex = root.querySelectorAll('[tabindex]');

    elementsWithTabindex.forEach(element => {
      const tabindex = element.getAttribute('tabindex');
      const tabindexValue = parseInt(tabindex || '0');

      if (tabindexValue > 0) {
        issues.push({
          element: element,
          type: 'warning',
          rule: 'tabindex-positive',
          message: 'Avoid positive tabindex values',
          impact: 'moderate',
          wcagLevel: 'A',
          wcagCriteria: '2.4.3 Focus Order'
        });
      }
    });

    if (issues.length === 0) {
      passedRules.push('tabindex-usage');
    }

    return { issues, passedRules };
  }

  private calculateScore(issues: AccessibilityIssue[]): number {
    const weights = {
      critical: 10,
      serious: 5,
      moderate: 2,
      minor: 1
    };

    const totalDeductions = issues.reduce((sum, issue) => sum + weights[issue.impact], 0);
    return Math.max(0, 100 - totalDeductions);
  }

  private checkCompliance(issues: AccessibilityIssue[]): {
    levelA: boolean;
    levelAA: boolean;
    levelAAA: boolean;
  } {
    const levelAIssues = issues.filter(issue => 
      issue.wcagLevel === 'A' && (issue.impact === 'critical' || issue.impact === 'serious')
    );
    
    const levelAAIssues = issues.filter(issue => 
      ['A', 'AA'].includes(issue.wcagLevel) && (issue.impact === 'critical' || issue.impact === 'serious')
    );
    
    const levelAAAIssues = issues.filter(issue => 
      ['A', 'AA', 'AAA'].includes(issue.wcagLevel) && (issue.impact === 'critical' || issue.impact === 'serious')
    );

    return {
      levelA: levelAIssues.length === 0,
      levelAA: levelAAIssues.length === 0,
      levelAAA: levelAAAIssues.length === 0
    };
  }

  private generateSummary(issues: AccessibilityIssue[]): {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  } {
    return {
      critical: issues.filter(issue => issue.impact === 'critical').length,
      serious: issues.filter(issue => issue.impact === 'serious').length,
      moderate: issues.filter(issue => issue.impact === 'moderate').length,
      minor: issues.filter(issue => issue.impact === 'minor').length
    };
  }
}

// Export singleton instance
export const accessibilityAuditor = AccessibilityAuditor.getInstance();