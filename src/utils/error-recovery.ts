/**
 * Error Handling and Recovery System
 */

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface ErrorRecoveryAction {
  type: 'retry' | 'fallback' | 'redirect' | 'reload';
  payload?: any;
}

class ErrorRecoverySystem {
  private errorCount = new Map<string, number>();
  private maxRetries = 3;
  private retryDelay = 1000;

  /**
   * Handle errors with automatic recovery
   */
  async handleError(
    error: Error,
    context: Partial<ErrorContext>,
    recoveryAction?: ErrorRecoveryAction
  ): Promise<boolean> {
    const errorKey = this.getErrorKey(error, context);
    const currentCount = this.errorCount.get(errorKey) || 0;
    
    // Create full context
    const fullContext: ErrorContext = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    };

    // Log error
    console.error('[Error Recovery]', {
      error: error.message,
      stack: error.stack,
      context: fullContext,
      attemptCount: currentCount + 1
    });

    // Update error count
    this.errorCount.set(errorKey, currentCount + 1);

    // Try recovery if under max retries
    if (currentCount < this.maxRetries && recoveryAction) {
      try {
        await this.executeRecovery(recoveryAction);
        
        // Clear error count on successful recovery
        this.errorCount.delete(errorKey);
        return true;
      } catch (recoveryError) {
        console.error('[Recovery Failed]', recoveryError);
      }
    }

    // If max retries reached or no recovery action
    if (currentCount >= this.maxRetries) {
      this.handleCriticalError(error, fullContext);
    }

    return false;
  }

  /**
   * Execute recovery action
   */
  private async executeRecovery(action: ErrorRecoveryAction): Promise<void> {
    switch (action.type) {
      case 'retry':
        await this.delay(this.retryDelay);
        if (action.payload?.function) {
          await action.payload.function();
        }
        break;

      case 'fallback':
        if (action.payload?.fallbackComponent) {
          // Render fallback component
          console.log('[Recovery] Using fallback component');
        }
        break;

      case 'redirect':
        if (action.payload?.url) {
          window.location.href = action.payload.url;
        }
        break;

      case 'reload':
        await this.delay(2000);
        window.location.reload();
        break;

      default:
        throw new Error(`Unknown recovery action: ${action.type}`);
    }
  }

  /**
   * Handle critical errors that couldn't be recovered
   */
  private handleCriticalError(error: Error, context: ErrorContext) {
    console.error('[CRITICAL ERROR - Recovery Failed]', {
      error: error.message,
      stack: error.stack,
      context
    });

    // In production, send to error monitoring service
    if (!import.meta.env.DEV) {
      this.reportToMonitoringService(error, context);
    }

    // Show user-friendly error message
    this.showUserErrorMessage();
  }

  /**
   * Generate unique error key for tracking
   */
  private getErrorKey(error: Error, context: Partial<ErrorContext>): string {
    return `${error.name}:${context.component || 'unknown'}:${context.action || 'unknown'}`;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Report to external monitoring service
   */
  private async reportToMonitoringService(error: Error, context: ErrorContext) {
    try {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ error: error.message, stack: error.stack, context })
      // });
      
      console.log('[Monitoring] Error reported', { error: error.message, context });
    } catch (reportError) {
      console.error('[Monitoring] Failed to report error:', reportError);
    }
  }

  /**
   * Show user-friendly error message
   */
  private showUserErrorMessage() {
    // You could integrate with your toast system here
    const message = 'Ocorreu um erro inesperado. Nossa equipe foi notificada.';
    console.log('[User Message]', message);
    
    // Example with toast (if available)
    // toast.error(message);
  }

  /**
   * Clear error counts (useful for resetting state)
   */
  clearErrorCounts() {
    this.errorCount.clear();
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = new Map();
    this.errorCount.forEach((count, key) => {
      stats.set(key, count);
    });
    return Object.fromEntries(stats);
  }
}

// Export singleton
export const errorRecovery = new ErrorRecoverySystem();

/**
 * Utility function for wrapping async operations with error recovery
 */
export async function withErrorRecovery<T>(
  operation: () => Promise<T>,
  context: Partial<ErrorContext>,
  recoveryAction?: ErrorRecoveryAction
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const recovered = await errorRecovery.handleError(
      error as Error,
      context,
      recoveryAction
    );
    
    if (recovered && recoveryAction?.type === 'retry') {
      // Try operation again after recovery
      try {
        return await operation();
      } catch (retryError) {
        console.error('[Retry Failed]', retryError);
      }
    }
    
    return null;
  }
}

/**
 * React Error Boundary integration
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: any) => {
    errorRecovery.handleError(error, {
      component: componentName,
      action: 'render'
    }, {
      type: 'fallback',
      payload: { fallbackComponent: true }
    });
  };
}

export default errorRecovery;