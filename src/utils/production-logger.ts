/**
 * Production Logger - Optimized logging for production environment
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'performance';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
  source?: string;
  sessionId?: string;
}

interface LoggerConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  maxLogs: number;
  batchSize: number;
  flushInterval: number;
}

class ProductionLogger {
  private logs: LogEntry[] = [];
  private isDevelopment = import.meta.env.DEV;
  private sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  private logQueue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  
  private config: LoggerConfig = {
    enableConsole: this.isDevelopment,
    enableRemote: !this.isDevelopment,
    maxLogs: 1000,
    batchSize: 10,
    flushInterval: 30000 // 30 seconds
  };

  constructor(config?: Partial<LoggerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    // Start auto-flush in production
    if (!this.isDevelopment) {
      this.startAutoFlush();
    }
  }

  private createEntry(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      data,
      source,
      sessionId: this.sessionId
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep logs under limit
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }
    
    // Add to remote queue if enabled
    if (this.config.enableRemote && entry.level !== 'debug') {
      this.logQueue.push(entry);
      
      // Flush immediately for errors
      if (entry.level === 'error') {
        this.flushLogs();
      }
    }
  }

  private startAutoFlush() {
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.config.flushInterval);
  }

  private async flushLogs() {
    if (this.logQueue.length === 0) return;
    
    const logsToSend = this.logQueue.splice(0, this.config.batchSize);
    
    try {
      // In production, you would send to your logging service
      // await this.sendToLoggingService(logsToSend);
      
      // For now, we'll just store in sessionStorage for debugging
      if (typeof window !== 'undefined') {
        const existingLogs = sessionStorage.getItem('app_logs');
        const logs = existingLogs ? JSON.parse(existingLogs) : [];
        logs.push(...logsToSend);
        
        // Keep only last 100 logs in storage
        const recentLogs = logs.slice(-100);
        sessionStorage.setItem('app_logs', JSON.stringify(recentLogs));
      }
    } catch (error) {
      // Silently handle logging errors to avoid infinite loops
      if (this.isDevelopment) {
        console.warn('Failed to flush logs:', error);
      }
    }
  }

  info(message: string, data?: any, source?: string) {
    const entry = this.createEntry('info', message, data, source);
    this.addLog(entry);
    
    if (this.config.enableConsole) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any, source?: string) {
    const entry = this.createEntry('warn', message, data, source);
    this.addLog(entry);
    
    if (this.config.enableConsole) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  error(message: string, data?: any, source?: string) {
    const entry = this.createEntry('error', message, data, source);
    this.addLog(entry);
    
    // Always log errors in console (even in production for critical issues)
    if (this.config.enableConsole || data?.critical) {
      console.error(`[ERROR] ${message}`, data || '');
    }
  }

  debug(message: string, data?: any, source?: string) {
    const entry = this.createEntry('debug', message, data, source);
    this.addLog(entry);
    
    if (this.isDevelopment && this.config.enableConsole) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  performance(message: string, data?: any, source?: string) {
    const entry = this.createEntry('performance', message, data, source);
    this.addLog(entry);
    
    if (this.config.enableConsole) {
      console.log(`[PERF] ${message}`, data || '');
    }
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.logQueue = [];
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('app_logs');
    }
  }

  // Critical error handler for production
  async reportCriticalError(message: string, error: Error, context?: any) {
    const entry = this.createEntry('error', message, { 
      error: error.message, 
      stack: error.stack, 
      context,
      critical: true 
    });
    
    this.addLog(entry);
    
    // Always log critical errors
    console.error(`[CRITICAL] ${message}`, error);
    
    // Immediately flush critical errors
    if (this.config.enableRemote) {
      await this.flushLogs();
    }
  }

  // Performance metrics logging
  logPerformanceMetrics(metrics: any) {
    this.performance('Performance Metrics', metrics, 'PerformanceMonitor');
  }

  // Analytics logging
  logAnalyticsEvent(eventName: string, properties: any) {
    this.info(`Analytics: ${eventName}`, properties, 'Analytics');
  }

  // Destroy logger (cleanup)
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Final flush
    this.flushLogs();
  }
}

// Create optimized logger instance
export const logger = new ProductionLogger({
  enableConsole: import.meta.env.DEV,
  enableRemote: !import.meta.env.DEV,
  maxLogs: 500,
  batchSize: 20,
  flushInterval: 60000 // 1 minute in production
});

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    logger.destroy();
  });
}

export default logger;
