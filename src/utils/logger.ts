type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  source?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createEntry(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      source
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  info(message: string, data?: any, source?: string) {
    const entry = this.createEntry('info', message, data, source);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data ? data : '');
    }
  }

  warn(message: string, data?: any, source?: string) {
    const entry = this.createEntry('warn', message, data, source);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data ? data : '');
    }
  }

  error(message: string, data?: any, source?: string) {
    const entry = this.createEntry('error', message, data, source);
    this.addLog(entry);
    
    // Only log errors in development or for critical production errors
    if (this.isDevelopment || data?.critical) {
      console.error(`[ERROR] ${message}`, data ? data : '');
    }
  }

  debug(message: string, data?: any, source?: string) {
    const entry = this.createEntry('debug', message, data, source);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data ? data : '');
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  // Método para enviar logs críticos para serviço externo em produção
  async sendCriticalError(message: string, error: Error, context?: any) {
    const entry = this.createEntry('error', message, { error: error.message, stack: error.stack, context });
    this.addLog(entry);
    
    // Always log critical errors
    console.error(`[CRITICAL] ${message}`, error);
    
    // Em produção, poderia enviar para Sentry, LogRocket, etc.
    if (!this.isDevelopment) {
      // await sendToErrorService(entry);
    }
  }
}

export const logger = new Logger();
export type { LogLevel, LogEntry };