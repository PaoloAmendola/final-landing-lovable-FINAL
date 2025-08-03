import React, { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

interface AccessibilityConfig {
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
  enableLargeText?: boolean;
  enableScreenReaderOptimizations?: boolean;
  announcePageChanges?: boolean;
}

interface AccessibilityEnhancerProps {
  config?: AccessibilityConfig;
  children: React.ReactNode;
}

export const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({
  config = {},
  children
}) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setIsReducedMotion(prefersReducedMotion);
    setIsHighContrast(prefersHighContrast);

    // Apply system preferences
    if (prefersReducedMotion && config.enableReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.classList.add('reduce-motion');
    }

    if (prefersHighContrast && config.enableHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches && config.enableReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.classList.remove('reduce-motion');
      }
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
      if (e.matches && config.enableHighContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Keyboard navigation enhancements
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content on Tab key from start
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.querySelector('[href="#main-content"]') as HTMLElement;
        if (skipLink) {
          skipLink.focus();
        }
      }

      // ESC key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        const openDropdown = document.querySelector('[aria-expanded="true"]');
        
        if (openModal) {
          const closeButton = openModal.querySelector('[aria-label*="fechar"], [aria-label*="close"]') as HTMLElement;
          closeButton?.click();
        } else if (openDropdown) {
          (openDropdown as HTMLElement).click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus management
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      
      // Ensure focus is visible
      if (target && !target.classList.contains('focus-visible')) {
        target.classList.add('focus-visible');
      }

      // Announce focus changes for screen readers
      if (config.enableScreenReaderOptimizations && target) {
        const label = target.getAttribute('aria-label') || 
                     target.getAttribute('title') || 
                     target.textContent?.trim();
        
        if (label && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          announceToScreenReader(`Focused on ${label}`);
        }
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.classList.remove('focus-visible');
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // Page change announcements
    if (config.announcePageChanges) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const pageTitle = document.title;
            const mainHeading = document.querySelector('h1')?.textContent;
            
            if (pageTitle || mainHeading) {
              announceToScreenReader(`Page changed to ${pageTitle || mainHeading}`);
            }
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [config]);

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Accessibility toolbar controls
  const toggleHighContrast = () => {
    const newState = !isHighContrast;
    setIsHighContrast(newState);
    
    if (newState) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    localStorage.setItem('accessibility-high-contrast', newState.toString());
  };

  const toggleLargeText = () => {
    const newState = !isLargeText;
    setIsLargeText(newState);
    
    if (newState) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    localStorage.setItem('accessibility-large-text', newState.toString());
  };

  return (
    <>
      {/* Accessibility Toolbar */}
      <div
        className="fixed top-4 right-4 z-50 bg-card border rounded-lg p-2 shadow-lg"
        role="toolbar"
        aria-label="Accessibility controls"
      >
        <div className="flex gap-2">
          <button
            onClick={toggleHighContrast}
            aria-pressed={isHighContrast}
            aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast`}
            className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
          >
            {isHighContrast ? '🔆' : '🔅'} Contrast
          </button>
          
          <button
            onClick={toggleLargeText}
            aria-pressed={isLargeText}
            aria-label={`${isLargeText ? 'Disable' : 'Enable'} large text`}
            className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
          >
            {isLargeText ? 'Aa' : 'AA'} Text
          </button>
        </div>
      </div>

      {/* Skip to content link */}
      <a
        href="#main-content"
        className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Enhanced children with accessibility context */}
      <div id="main-content" role="main">
        {children}
      </div>

      {/* Screen reader live region for announcements */}
      <div
        id="sr-live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* High contrast styles */}
      {isHighContrast && (
        <style>{`
          .high-contrast * {
            background: black !important;
            color: white !important;
            border-color: white !important;
          }
          .high-contrast button, .high-contrast a {
            background: white !important;
            color: black !important;
          }
        `}</style>
      )}

      {/* Large text styles */}
      {isLargeText && (
        <style>{`
          .large-text * {
            font-size: 1.2em !important;
            line-height: 1.5 !important;
          }
        `}</style>
      )}
    </>
  );
};