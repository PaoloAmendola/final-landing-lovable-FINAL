import React, { useCallback, useEffect } from 'react';
import productionLogger from '@/utils/production-logger';

// Global analytics interface
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface ConversionEvent {
  type: 'form_view' | 'form_interaction' | 'form_submit' | 'cta_click' | 'section_view' | 'video_play' | 'error';
  section?: string;
  value?: string | number;
  metadata?: Record<string, any>;
}

interface PerformanceMetrics {
  page_load_time: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  first_input_delay: number;
}

const useAnalytics = () => {
  // Track page views
  const trackPageView = useCallback((path: string = window.location.pathname) => {
    const event: AnalyticsEvent = {
      name: 'page_view',
      properties: {
        path,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timestamp: Date.now()
      }
    };

    // In production, send to analytics service with reduced logging
    if (process.env.NODE_ENV === 'production') {
      productionLogger.info('page_view', { path });
      
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_view', {
          page_path: path,
          custom_map: { dimension1: 'bem_beauty_nivela' }
        });
      }
    } else {
      productionLogger.debug('page_view', event);
    }
  }, []);

  // Track conversion events
  const trackConversion = useCallback((event: ConversionEvent) => {
    const analyticsEvent: AnalyticsEvent = {
      name: `conversion_${event.type}`,
      properties: {
        ...event,
        timestamp: Date.now(),
        session_id: sessionStorage.getItem('session_id') || 'unknown',
        user_journey: JSON.parse(localStorage.getItem('user_journey') || '[]')
      }
    };

    if (process.env.NODE_ENV === 'production') {
      productionLogger.info('conversion', { type: event.type, section: event.section });
    } else {
      productionLogger.debug('conversion', analyticsEvent);
    }

    // Store simplified user journey
    const journey = JSON.parse(localStorage.getItem('user_journey') || '[]');
    journey.push({
      event: event.type,
      timestamp: Date.now(),
      section: event.section
    });
    
    // Keep only last 10 events (reduced from 20)
    if (journey.length > 10) {
      journey.shift();
    }
    
    localStorage.setItem('user_journey', JSON.stringify(journey));

    // Track high-value conversions
    if (['form_submit', 'cta_click'].includes(event.type)) {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID', // Replace with actual conversion ID
          event_category: 'engagement',
          event_label: event.type,
          value: event.value || 1
        });
      }
    }
  }, []);

  // Track performance metrics
  const trackPerformance = useCallback((metrics: Partial<PerformanceMetrics>) => {
    const event: AnalyticsEvent = {
      name: 'performance_metrics',
      properties: {
        ...metrics,
        timestamp: Date.now(),
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        device_memory: (navigator as any).deviceMemory || 'unknown'
      }
    };

    if (process.env.NODE_ENV === 'production') {
      productionLogger.warn('performance_slow', { page_load_time: metrics.page_load_time });
    } else {
      productionLogger.debug('performance_metrics', event);
    }

    // Track performance issues with reduced frequency (only critical cases)
    if (metrics.page_load_time && metrics.page_load_time > 5000) {
      productionLogger.error('critical_performance', {
        page_load_time: metrics.page_load_time,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      });
    }
  }, []);

  // Track user interactions
  const trackInteraction = useCallback((element: string, action: string, value?: string) => {
    const event: AnalyticsEvent = {
      name: 'user_interaction',
      properties: {
        element,
        action,
        value,
        timestamp: Date.now(),
        page: window.location.pathname
      }
    };

    if (process.env.NODE_ENV === 'development') {
      productionLogger.debug('user_interaction', event);
    }
  }, []);

  // Track errors
  const trackError = useCallback((error: Error, context?: string) => {
    const event: AnalyticsEvent = {
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: Date.now(),
        url: window.location.href,
        user_agent: navigator.userAgent
      }
    };

    productionLogger.error('app_error', { message: error.message, context });

    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }, []);

  // Initialize session tracking
  useEffect(() => {
    // Generate session ID if not exists
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }

    // Track session start
    trackPageView();

    // Track page unload
    const handleBeforeUnload = () => {
      const sessionData = {
        session_id: sessionStorage.getItem('session_id'),
        duration: Date.now() - parseInt(sessionStorage.getItem('session_start') || '0'),
        page_views: parseInt(sessionStorage.getItem('page_views') || '0'),
        interactions: parseInt(sessionStorage.getItem('interactions') || '0')
      };

      if (process.env.NODE_ENV === 'development') {
        productionLogger.debug('session_end', sessionData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackPageView]);

  return {
    trackPageView,
    trackConversion,
    trackPerformance,
    trackInteraction,
    trackError
  };
};

export { useAnalytics };
export type { ConversionEvent, PerformanceMetrics };
