import React, { useEffect, useState, useCallback } from 'react';
import { usePerformance } from '@/hooks/use-performance';
import { useWebVitals } from '@/hooks/use-web-vitals';
import { logger } from '@/utils/logger';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  domContentLoaded?: number;
  windowLoaded?: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  metric: string;
  value: number;
  threshold: number;
  recommendation: string;
  timestamp: number;
}

interface AdvancedPerformanceMonitorProps {
  enableRUM?: boolean;
  enableAlerts?: boolean;
  sampleRate?: number;
  thresholds?: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
    memoryThreshold?: number;
  };
  onAlert?: (alert: PerformanceAlert) => void;
}

/**
 * Advanced Performance Monitor with Real User Monitoring (RUM)
 * Tracks detailed performance metrics and provides automated alerts
 */
const AdvancedPerformanceMonitor: React.FC<AdvancedPerformanceMonitorProps> = ({
  enableRUM = true,
  enableAlerts = true,
  sampleRate = 0.1, // Sample 10% of users
  thresholds = {
    fcp: 1800,
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    ttfb: 600,
    memoryThreshold: 50 * 1024 * 1024 // 50MB
  },
  onAlert
}) => {
  const { metrics, performanceScore } = usePerformance();
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Check if this user should be monitored (sampling)
  const shouldMonitor = useCallback(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);

  // Collect comprehensive performance metrics
  const collectMetrics = useCallback((): PerformanceMetrics => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lcpEntry = lcpEntries[lcpEntries.length - 1] as PerformancePaintTiming;

    // Memory usage (if available)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize : undefined;

    // Connection info (if available)
    const connection = (navigator as any).connection;
    const connectionType = connection ? connection.effectiveType : undefined;

    return {
      fcp: fcpEntry?.startTime,
      lcp: lcpEntry?.startTime,
      fid: metrics?.fid,
      cls: metrics?.cls,
      ttfb: navigationEntry?.responseStart && navigationEntry?.requestStart 
        ? navigationEntry.responseStart - navigationEntry.requestStart : undefined,
      domContentLoaded: navigationEntry?.domContentLoadedEventEnd && navigationEntry?.fetchStart
        ? navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart : undefined,
      windowLoaded: navigationEntry?.loadEventEnd && navigationEntry?.fetchStart
        ? navigationEntry.loadEventEnd - navigationEntry.fetchStart : undefined,
      memoryUsage,
      connectionType
    };
  }, [metrics]);

  // Generate performance alert
  const generateAlert = useCallback((
    metric: string,
    value: number,
    threshold: number,
    type: 'warning' | 'error' = 'warning'
  ): PerformanceAlert => {
    const recommendations: Record<string, string> = {
      fcp: 'Optimize critical CSS, reduce blocking resources, use resource hints',
      lcp: 'Optimize images, reduce server response times, preload key resources',
      fid: 'Minimize JavaScript execution time, use web workers, defer non-critical JS',
      cls: 'Set explicit dimensions for images/videos, avoid inserting content above existing content',
      ttfb: 'Optimize server performance, use CDN, reduce server processing time',
      memory: 'Optimize JavaScript bundles, remove unused code, implement code splitting'
    };

    return {
      type,
      metric,
      value,
      threshold,
      recommendation: recommendations[metric] || 'Review and optimize this metric',
      timestamp: Date.now()
    };
  }, []);

  // Analyze metrics and generate alerts
  const analyzePerformance = useCallback((performanceMetrics: PerformanceMetrics) => {
    const alerts: PerformanceAlert[] = [];

    // Check each threshold
    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = performanceMetrics[metric as keyof PerformanceMetrics] as number;
      
      if (value && threshold) {
        let alertType: 'warning' | 'error' = 'warning';
        let shouldAlert = false;

        // Different logic for different metrics
        switch (metric) {
          case 'cls':
            shouldAlert = value > threshold;
            alertType = value > threshold * 2 ? 'error' : 'warning';
            break;
          case 'memoryThreshold':
            if (performanceMetrics.memoryUsage) {
              shouldAlert = performanceMetrics.memoryUsage > threshold;
              alertType = performanceMetrics.memoryUsage > threshold * 1.5 ? 'error' : 'warning';
            }
            break;
          default:
            shouldAlert = value > threshold;
            alertType = value > threshold * 1.5 ? 'error' : 'warning';
        }

        if (shouldAlert) {
          const alert = generateAlert(metric, value, threshold, alertType);
          alerts.push(alert);
        }
      }
    });

    // Performance Score Alert
    if (performanceScore < 70) {
      alerts.push(generateAlert(
        'overall_score',
        performanceScore,
        70,
        performanceScore < 50 ? 'error' : 'warning'
      ));
    }

    return alerts;
  }, [thresholds, performanceScore, generateAlert]);

  // Send metrics to analytics/monitoring service
  const sendToMonitoring = useCallback(async (
    performanceMetrics: PerformanceMetrics,
    alerts: PerformanceAlert[]
  ) => {
    if (!enableRUM) return;

    const rumData = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metrics: performanceMetrics,
      alerts: alerts.length > 0 ? alerts : undefined,
      performanceScore,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection?.effectiveType || 'unknown'
    };

    try {
      // In production, send to your monitoring service
      logger.info('RUM Data collected', rumData);
      
      // Example: await fetch('/api/analytics/rum', { method: 'POST', body: JSON.stringify(rumData) });
    } catch (error) {
      logger.error('Failed to send RUM data', { error });
    }
  }, [enableRUM, performanceScore]);

  // Main monitoring function
  const monitorPerformance = useCallback(async () => {
    if (!shouldMonitor()) return;

    try {
      const performanceMetrics = collectMetrics();
      const alerts = analyzePerformance(performanceMetrics);

      // Update local state
      setPerformanceAlerts(alerts);

      // Trigger callbacks
      alerts.forEach(alert => onAlert?.(alert));

      // Send to monitoring service
      await sendToMonitoring(performanceMetrics, alerts);

      // Log significant issues
      if (alerts.some(alert => alert.type === 'error')) {
        logger.error('Critical performance issues detected', { alerts, metrics: performanceMetrics });
      } else if (alerts.length > 0) {
        logger.warn('Performance issues detected', { alerts, metrics: performanceMetrics });
      }

    } catch (error) {
      logger.error('Performance monitoring failed', { error });
    }
  }, [shouldMonitor, collectMetrics, analyzePerformance, onAlert, sendToMonitoring]);

  // Initialize monitoring
  useEffect(() => {
    if (!enableRUM || isMonitoring) return;

    setIsMonitoring(true);

    // Monitor on page load completion
    if (document.readyState === 'complete') {
      setTimeout(monitorPerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(monitorPerformance, 1000);
      });
    }

    // Monitor periodically for ongoing issues
    const interval = setInterval(monitorPerformance, 30000); // Every 30 seconds

    // Monitor on visibility change (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(monitorPerformance, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableRUM, isMonitoring, monitorPerformance]);

  // Real-time alerts display (only in development)
  if (import.meta.env.DEV && enableAlerts && performanceAlerts.length > 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {performanceAlerts.slice(0, 3).map((alert, index) => (
          <div
            key={`${alert.metric}-${alert.timestamp}`}
            className={`p-3 rounded-lg shadow-lg text-sm ${
              alert.type === 'error' 
                ? 'bg-red-600 text-white' 
                : alert.type === 'warning'
                ? 'bg-yellow-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <div className="font-semibold">
              {alert.metric.toUpperCase()}: {Math.round(alert.value)}ms
            </div>
            <div className="text-xs opacity-90">
              Threshold: {alert.threshold}ms
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

/**
 * Performance Dashboard Hook
 * Provides performance data for dashboards and monitoring
 */
const usePerformanceDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    alerts: [],
    trends: [],
    score: 0
  });

  useEffect(() => {
    // Collect dashboard data
    const collectDashboardData = () => {
      // Implementation would collect and aggregate performance data
      // This is a simplified version
    };

    collectDashboardData();
    const interval = setInterval(collectDashboardData, 10000);

    return () => clearInterval(interval);
  }, []);

  return dashboardData;
};

export { AdvancedPerformanceMonitor, usePerformanceDashboard };
export type { PerformanceMetrics, PerformanceAlert };