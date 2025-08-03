import { useEffect, useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface AdvancedPerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  navigationTiming?: PerformanceNavigationTiming;
  resourceTiming?: PerformanceResourceTiming[];
  memoryUsage?: {
    used: number;
    total: number;
    limit?: number;
  };
  connectionType?: string;
  effectiveType?: string;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  recommendation: string;
  timestamp: number;
}

export const useAdvancedPerformance = () => {
  const [metrics, setMetrics] = useState<AdvancedPerformanceMetrics>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const observersRef = useRef<PerformanceObserver[]>([]);
  const metricsRef = useRef<AdvancedPerformanceMetrics>({});

  const generateAlert = useCallback((
    type: 'warning' | 'error' | 'critical',
    metric: string,
    value: number,
    threshold: number
  ): PerformanceAlert => {
    const recommendations: Record<string, string> = {
      lcp: 'Otimize imagens principais, use lazy loading, implemente preloading',
      fcp: 'Minimize CSS crítico, otimize fonts, reduza JavaScript inicial',
      cls: 'Reserve espaços para elementos dinâmicos, evite inserções DOM',
      fid: 'Reduza JavaScript principal, use Web Workers, otimize event handlers',
      ttfb: 'Otimize servidor, use CDN, implemente cache estratégico'
    };

    return {
      type,
      metric,
      value,
      threshold,
      recommendation: recommendations[metric] || 'Analise este métrica para otimização',
      timestamp: Date.now()
    };
  }, []);

  const analyzeMetrics = useCallback((currentMetrics: AdvancedPerformanceMetrics) => {
    const thresholds = {
      lcp: { warning: 2500, error: 4000 },
      fcp: { warning: 1800, error: 3000 },
      cls: { warning: 0.1, error: 0.25 },
      fid: { warning: 100, error: 300 },
      ttfb: { warning: 600, error: 1500 }
    };

    const newAlerts: PerformanceAlert[] = [];

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = currentMetrics[metric as keyof AdvancedPerformanceMetrics] as number;
      if (value !== undefined) {
        if (value > threshold.error) {
          newAlerts.push(generateAlert('critical', metric, value, threshold.error));
        } else if (value > threshold.warning) {
          newAlerts.push(generateAlert('warning', metric, value, threshold.warning));
        }
      }
    });

    // Memory usage analysis
    if (currentMetrics.memoryUsage) {
      const memoryUsagePercent = (currentMetrics.memoryUsage.used / currentMetrics.memoryUsage.total) * 100;
      if (memoryUsagePercent > 90) {
        newAlerts.push(generateAlert('critical', 'memory', memoryUsagePercent, 90));
      } else if (memoryUsagePercent > 75) {
        newAlerts.push(generateAlert('warning', 'memory', memoryUsagePercent, 75));
      }
    }

    setAlerts(prev => [...prev.slice(-10), ...newAlerts]);
  }, [generateAlert]);

  const collectResourceTiming = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.filter(resource => resource.duration > 0);
  }, []);

  const collectMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return undefined;
  }, []);

  const collectConnectionInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        connectionType: connection.type,
        effectiveType: connection.effectiveType
      };
    }
    return {};
  }, []);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    setIsMonitoring(true);

    try {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        metricsRef.current = { ...metricsRef.current, lcp };
        setMetrics(prev => ({ ...prev, lcp }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);

      // FCP Observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          metricsRef.current = { ...metricsRef.current, fcp };
          setMetrics(prev => ({ ...prev, fcp }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      observersRef.current.push(fcpObserver);

      // CLS Observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        metricsRef.current = { ...metricsRef.current, cls: clsValue };
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0] as any;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        
        metricsRef.current = { ...metricsRef.current, fid };
        setMetrics(prev => ({ ...prev, fid }));
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);

      // TTFB Calculation
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        metricsRef.current = { 
          ...metricsRef.current, 
          ttfb,
          navigationTiming: navigation
        };
        setMetrics(prev => ({ ...prev, ttfb, navigationTiming: navigation }));
      }

      // Collect additional metrics
      const resourceTiming = collectResourceTiming();
      const memoryUsage = collectMemoryUsage();
      const connectionInfo = collectConnectionInfo();

      const additionalMetrics = {
        resourceTiming,
        memoryUsage,
        ...connectionInfo
      };

      metricsRef.current = { ...metricsRef.current, ...additionalMetrics };
      setMetrics(prev => ({ ...prev, ...additionalMetrics }));

    } catch (error) {
      logger.error('Performance monitoring initialization failed', error);
    }
  }, [isMonitoring, collectResourceTiming, collectMemoryUsage, collectConnectionInfo]);

  const stopMonitoring = useCallback(() => {
    observersRef.current.forEach(observer => observer.disconnect());
    observersRef.current = [];
    setIsMonitoring(false);
  }, []);

  // Auto-analyze metrics when they change
  useEffect(() => {
    if (Object.keys(metrics).length > 0) {
      analyzeMetrics(metrics);
    }
  }, [metrics, analyzeMetrics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  const getPerformanceGrade = useCallback((metric: string, value: number) => {
    const thresholds: Record<string, { good: number; needs: number }> = {
      lcp: { good: 2500, needs: 4000 },
      fcp: { good: 1800, needs: 3000 },
      cls: { good: 0.1, needs: 0.25 },
      fid: { good: 100, needs: 300 },
      ttfb: { good: 600, needs: 1500 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needs) return 'needs-improvement';
    return 'poor';
  }, []);

  const getOverallScore = useCallback(() => {
    const scores: Record<string, number> = {};
    let totalWeight = 0;

    if (metrics.lcp !== undefined) {
      scores.lcp = metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0;
      totalWeight += 25;
    }
    if (metrics.fcp !== undefined) {
      scores.fcp = metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0;
      totalWeight += 25;
    }
    if (metrics.cls !== undefined) {
      scores.cls = metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0;
      totalWeight += 25;
    }
    if (metrics.fid !== undefined) {
      scores.fid = metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0;
      totalWeight += 25;
    }

    if (totalWeight === 0) return 0;

    const weightedSum = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round((weightedSum / totalWeight) * 100);
  }, [metrics]);

  return {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceGrade,
    getOverallScore,
    clearAlerts: () => setAlerts([])
  };
};