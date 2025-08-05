import { useEffect } from 'react';
import { logger } from '@/utils/logger';

// Global Hotjar interface
declare global {
  interface Window {
    hj?: (...args: any[]) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  }
}

interface HotjarConfig {
  hjid: number;
  enabled?: boolean;
  debug?: boolean;
}

const useHotjar = (config: HotjarConfig) => {
  const { hjid, enabled = true, debug = false } = config;

  useEffect(() => {
    if (!enabled || !hjid) return;

    // Load Hotjar script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hjid},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);

    if (debug) {
      logger.info('Hotjar initialized', { hjid });
    }

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [hjid, enabled, debug]);

  return {
    trigger: (eventName: string) => {
      if (enabled && window.hj) {
        window.hj('trigger', eventName);
        if (debug) {
          logger.info('Hotjar event triggered', { eventName });
        }
      }
    },
    identify: (userId: string, attributes?: Record<string, any>) => {
      if (enabled && window.hj) {
        window.hj('identify', userId, attributes);
        if (debug) {
          logger.info('Hotjar user identified', { userId, attributes });
        }
      }
    }
  };
};

export { useHotjar };