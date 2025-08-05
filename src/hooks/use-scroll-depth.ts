import { useEffect, useCallback, useRef } from 'react';
import { useAnalytics } from './use-analytics';

interface ScrollDepthConfig {
  percentages?: number[];
  elements?: string[];
  throttleMs?: number;
}

const useScrollDepth = (config: ScrollDepthConfig = {}) => {
  const { 
    percentages = [25, 50, 75, 90, 100],
    elements = [],
    throttleMs = 100
  } = config;

  const { trackInteraction } = useAnalytics();
  const trackedPercentages = useRef<Set<number>>(new Set());
  const trackedElements = useRef<Set<string>>(new Set());
  const lastScrollTime = useRef<number>(0);

  const trackScrollDepth = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < throttleMs) return;
    lastScrollTime.current = now;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

    // Track percentage milestones
    percentages.forEach(percentage => {
      if (scrollPercentage >= percentage && !trackedPercentages.current.has(percentage)) {
        trackedPercentages.current.add(percentage);
        trackInteraction('scroll_depth', 'milestone', `${percentage}%`);
      }
    });

    // Track element visibility
    elements.forEach(elementSelector => {
      if (trackedElements.current.has(elementSelector)) return;

      const element = document.querySelector(elementSelector);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementBottom = elementTop + rect.height;

      // Check if element is in viewport
      if (scrollTop + window.innerHeight >= elementTop && scrollTop <= elementBottom) {
        trackedElements.current.add(elementSelector);
        trackInteraction('element_view', 'scroll', elementSelector);
      }
    });
  }, [percentages, elements, throttleMs, trackInteraction]);

  useEffect(() => {
    const throttledHandler = () => {
      requestAnimationFrame(trackScrollDepth);
    };

    window.addEventListener('scroll', throttledHandler, { passive: true });
    
    // Initial check
    trackScrollDepth();

    return () => {
      window.removeEventListener('scroll', throttledHandler);
    };
  }, [trackScrollDepth]);

  // Reset tracking for new page views
  const resetTracking = useCallback(() => {
    trackedPercentages.current.clear();
    trackedElements.current.clear();
  }, []);

  return {
    resetTracking
  };
};

export { useScrollDepth };