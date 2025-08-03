import React, { memo } from 'react';
import { useWebVitals, useErrorTracking } from '@/hooks/use-web-vitals';
import { logger } from '@/utils/logger';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Eye, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  X 
} from 'lucide-react';

interface RealTimeMetricsProps {
  enabled?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  minimized?: boolean;
  onToggle?: () => void;
}

const RealTimeMetrics = memo(({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  minimized = false,
  onToggle 
}: RealTimeMetricsProps) => {
  const { metrics, isSupported, getPerformanceGrade } = useWebVitals({
    onMetric: (metric) => {
      logger.info('Real-time metric captured', {
        name: metric.name,
        value: metric.value,
        timestamp: Date.now()
      });
    }
  });
  
  const { errors, clearErrors } = useErrorTracking();

  if (!enabled || !isSupported) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4', 
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getGradeBadgeVariant = (grade: string) => {
    switch (grade) {
      case 'good': return 'default';
      case 'needs-improvement': return 'secondary';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  if (minimized) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-background/90"
        >
          <Activity className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm`}>
      <Card className="bg-background/90 backdrop-blur-sm border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Métricas em Tempo Real
            </CardTitle>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Core Web Vitals */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Core Web Vitals
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* LCP */}
              {metrics.lcp && (
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>LCP</span>
                  </div>
                  <div className="text-right">
                    <div className={getGradeColor(getPerformanceGrade('lcp', metrics.lcp))}>
                      {(metrics.lcp / 1000).toFixed(2)}s
                    </div>
                    <Badge 
                      variant={getGradeBadgeVariant(getPerformanceGrade('lcp', metrics.lcp))}
                      className="text-xs h-4"
                    >
                      {getPerformanceGrade('lcp', metrics.lcp).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* FCP */}
              {metrics.fcp && (
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>FCP</span>
                  </div>
                  <div className="text-right">
                    <div className={getGradeColor(getPerformanceGrade('fcp', metrics.fcp))}>
                      {(metrics.fcp / 1000).toFixed(2)}s
                    </div>
                    <Badge 
                      variant={getGradeBadgeVariant(getPerformanceGrade('fcp', metrics.fcp))}
                      className="text-xs h-4"
                    >
                      {getPerformanceGrade('fcp', metrics.fcp).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* CLS */}
              {metrics.cls !== undefined && (
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>CLS</span>
                  </div>
                  <div className="text-right">
                    <div className={getGradeColor(getPerformanceGrade('cls', metrics.cls))}>
                      {metrics.cls.toFixed(3)}
                    </div>
                    <Badge 
                      variant={getGradeBadgeVariant(getPerformanceGrade('cls', metrics.cls))}
                      className="text-xs h-4"
                    >
                      {getPerformanceGrade('cls', metrics.cls).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* TTFB */}
              {metrics.ttfb && (
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>TTFB</span>
                  </div>
                  <div className="text-right">
                    <div className={getGradeColor(getPerformanceGrade('ttfb', metrics.ttfb))}>
                      {metrics.ttfb.toFixed(0)}ms
                    </div>
                    <Badge 
                      variant={getGradeBadgeVariant(getPerformanceGrade('ttfb', metrics.ttfb))}
                      className="text-xs h-4"
                    >
                      {getPerformanceGrade('ttfb', metrics.ttfb).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-destructive uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Erros ({errors.length})
                </h4>
                <Button
                  onClick={clearErrors}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                >
                  Limpar
                </Button>
              </div>
              
              <div className="max-h-20 overflow-y-auto space-y-1">
                {errors.slice(-3).map((error, index) => (
                  <div 
                    key={index}
                    className="text-xs p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive"
                  >
                    <div className="font-medium truncate">{error.message}</div>
                    <div className="text-xs opacity-70">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Summary */}
          <div className="pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              <div>Conexão: {(navigator as any).connection?.effectiveType || 'N/A'}</div>
              <div>Viewport: {window.innerWidth}×{window.innerHeight}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RealTimeMetrics.displayName = 'RealTimeMetrics';

export { RealTimeMetrics };