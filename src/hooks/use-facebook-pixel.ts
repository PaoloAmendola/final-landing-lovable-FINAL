import { useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

// Global Facebook Pixel interface
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

interface FacebookPixelConfig {
  pixelId: string;
  enabled?: boolean;
  debug?: boolean;
}

const useFacebookPixel = (config: FacebookPixelConfig) => {
  const { pixelId, enabled = true, debug = false } = config;

  // Initialize Facebook Pixel
  useEffect(() => {
    if (!enabled || !pixelId) return;

    // Load Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `;
    document.head.appendChild(script);

    // Initialize with pixel ID
    if (window.fbq) {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }

    logger.info('Facebook Pixel initialized', { pixelId });

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [pixelId, enabled]);

  // Track events
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (!enabled || !window.fbq) return;

    try {
      window.fbq('track', eventName, parameters);
      
      if (debug) {
        logger.info('Facebook Pixel event tracked', { eventName, parameters });
      }
    } catch (error) {
      logger.error('Facebook Pixel tracking error', error);
    }
  }, [enabled, debug]);

  // Track custom events
  const trackCustomEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (!enabled || !window.fbq) return;

    try {
      window.fbq('trackCustom', eventName, parameters);
      
      if (debug) {
        logger.info('Facebook Pixel custom event tracked', { eventName, parameters });
      }
    } catch (error) {
      logger.error('Facebook Pixel custom tracking error', error);
    }
  }, [enabled, debug]);

  // Predefined conversion events
  const trackLead = useCallback((parameters?: Record<string, any>) => {
    trackEvent('Lead', parameters);
  }, [trackEvent]);

  const trackContact = useCallback((parameters?: Record<string, any>) => {
    trackEvent('Contact', parameters);
  }, [trackEvent]);

  const trackViewContent = useCallback((parameters?: Record<string, any>) => {
    trackEvent('ViewContent', parameters);
  }, [trackEvent]);

  return {
    trackEvent,
    trackCustomEvent,
    trackLead,
    trackContact,
    trackViewContent
  };
};

export { useFacebookPixel };