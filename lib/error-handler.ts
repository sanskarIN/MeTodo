// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Error Handler & Logger
 * 
 * This service handles all error management and logging for MeTodo.
 * Provides centralized error handling, logging, and error reporting.
 * 
 * Features:
 * - Error catching and handling
 * - Error logging
 * - Error reporting
 * - Stack trace management
 * - Error recovery
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  PERMISSION = 'permission',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public category: ErrorCategory = ErrorCategory.UNKNOWN,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Log entry interface
 */
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Error Handler & Logger Service Class
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private errorCallbacks: Array<(error: AppError) => void> = [];

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
    });
    console.log(`[INFO] ${message}`, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data,
    });
    console.warn(`[WARN] ${message}`, data);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | AppError, data?: any): void {
    const errorEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      data,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            code: error instanceof AppError ? error.code : undefined,
          }
        : undefined,
    };

    this.addLog(errorEntry);
    console.error(`[ERROR] ${message}`, error, data);

    // Trigger error callbacks
    if (error instanceof AppError) {
      this.errorCallbacks.forEach((callback) => callback(error));
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.addLog({
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        data,
      });
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  /**
   * Add log entry
   */
  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: string): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as string
   */
  exportLogs(): string {
    return this.logs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${
            log.data ? ` - ${JSON.stringify(log.data)}` : ''
          }${log.error ? ` - Error: ${log.error.message}` : ''}`
      )
      .join('\n');
  }

  /**
   * Handle error
   */
  handleError(error: Error | AppError, context?: Record<string, any>): AppError {
    if (error instanceof AppError) {
      this.error(error.message, error, context);
      return error;
    }

    const appError = new AppError(
      error.message,
      'UNKNOWN_ERROR',
      ErrorSeverity.HIGH,
      ErrorCategory.UNKNOWN,
      context
    );

    this.error(error.message, appError, context);
    return appError;
  }

  /**
   * Handle network error
   */
  handleNetworkError(error: Error, context?: Record<string, any>): AppError {
    const appError = new AppError(
      'Network error. Please check your connection.',
      'NETWORK_ERROR',
      ErrorSeverity.MEDIUM,
      ErrorCategory.NETWORK,
      context
    );

    this.error(appError.message, appError, context);
    return appError;
  }

  /**
   * Handle validation error
   */
  handleValidationError(message: string, context?: Record<string, any>): AppError {
    const appError = new AppError(
      message,
      'VALIDATION_ERROR',
      ErrorSeverity.LOW,
      ErrorCategory.VALIDATION,
      context
    );

    this.warn(appError.message, context);
    return appError;
  }

  /**
   * Handle storage error
   */
  handleStorageError(error: Error, context?: Record<string, any>): AppError {
    const appError = new AppError(
      'Storage error. Please try again.',
      'STORAGE_ERROR',
      ErrorSeverity.HIGH,
      ErrorCategory.STORAGE,
      context
    );

    this.error(appError.message, appError, context);
    return appError;
  }

  /**
   * Handle permission error
   */
  handlePermissionError(context?: Record<string, any>): AppError {
    const appError = new AppError(
      'Permission denied.',
      'PERMISSION_ERROR',
      ErrorSeverity.MEDIUM,
      ErrorCategory.PERMISSION,
      context
    );

    this.warn(appError.message, context);
    return appError;
  }

  /**
   * Handle authentication error
   */
  handleAuthError(context?: Record<string, any>): AppError {
    const appError = new AppError(
      'Authentication failed. Please log in again.',
      'AUTH_ERROR',
      ErrorSeverity.MEDIUM,
      ErrorCategory.AUTHENTICATION,
      context
    );

    this.warn(appError.message, context);
    return appError;
  }

  /**
   * Register error callback
   */
  onError(callback: (error: AppError) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Remove error callback
   */
  offError(callback: (error: AppError) => void): void {
    this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
  }

  /**
   * Get error message for user
   */
  getUserMessage(error: AppError | Error): string {
    if (error instanceof AppError) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Create error report
   */
  createErrorReport(error: AppError | Error): string {
    const timestamp = new Date().toISOString();
    const logs = this.exportLogs();
    const errorMessage = error instanceof AppError ? error.message : error.message;
    const errorStack = error.stack || 'No stack trace available';

    return `
Error Report
============
Timestamp: ${timestamp}
Message: ${errorMessage}
Stack: ${errorStack}

Recent Logs:
${logs}
    `.trim();
  }

  /**
   * Report error to server
   */
  async reportError(error: AppError | Error, context?: Record<string, any>): Promise<void> {
    try {
      const report = this.createErrorReport(error);
      const payload = {
        error: error instanceof AppError ? error.message : error.message,
        code: error instanceof AppError ? error.code : 'UNKNOWN',
        severity: error instanceof AppError ? error.severity : ErrorSeverity.HIGH,
        category: error instanceof AppError ? error.category : ErrorCategory.UNKNOWN,
        stack: error.stack,
        context,
        report,
        timestamp: new Date().toISOString(),
      };

      // Send to error reporting service
      // await fetch('/api/errors/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      this.info('Error reported to server', payload);
    } catch (err) {
      this.error('Failed to report error', err as Error);
    }
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

/**
 * Global error handler
 */
export function setupGlobalErrorHandler(): void {
  // Handle uncaught errors
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      errorHandler.handleError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      errorHandler.handleError(new Error(String(event.reason)));
    });
  }
}
