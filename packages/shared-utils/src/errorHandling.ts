// Error Handling System - Sistema robusto de manejo de errores del universo Son1kVerse

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'validation' | 'runtime' | 'ui' | 'audio' | 'image' | 'unknown';
  context?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  errors: ErrorInfo[];
  metadata: {
    appVersion: string;
    buildNumber: string;
    environment: 'development' | 'staging' | 'production';
    platform: string;
    browser: string;
  };
  timestamp: number;
}

/**
 * Custom Error Classes
 */
export class Son1kVerseError extends Error {
  public readonly category: ErrorInfo['category'];
  public readonly severity: ErrorInfo['severity'];
  public readonly context?: Record<string, any>;
  public readonly timestamp: number;

  constructor(
    message: string,
    category: ErrorInfo['category'] = 'unknown',
    severity: ErrorInfo['severity'] = 'medium',
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'Son1kVerseError';
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.timestamp = Date.now();
  }
}

export class NetworkError extends Son1kVerseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'network', 'high', context);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Son1kVerseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'validation', 'medium', context);
    this.name = 'ValidationError';
  }
}

export class AudioError extends Son1kVerseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'audio', 'high', context);
    this.name = 'AudioError';
  }
}

export class ImageError extends Son1kVerseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'image', 'medium', context);
    this.name = 'ImageError';
  }
}

/**
 * Error Logger
 */
export class ErrorLogger {
  private errors: ErrorInfo[] = [];
  private maxErrors = 100;
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Log an error
   */
  log(error: Error | Son1kVerseError, context?: Record<string, any>): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      severity: error instanceof Son1kVerseError ? error.severity : 'medium',
      category: error instanceof Son1kVerseError ? error.category : 'unknown',
      context: {
        ...context,
        ...(error instanceof Son1kVerseError ? error.context : {})
      }
    };

    this.errors.push(errorInfo);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Son1kVerse Error:', errorInfo);
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorInfo);
    }
  }

  /**
   * Set user ID for error tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * Clear all errors
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Generate error report
   */
  generateReport(): ErrorReport {
    return {
      id: this.generateReportId(),
      errors: this.getErrors(),
      metadata: {
        appVersion: process.env.REACT_APP_VERSION || '1.0.0',
        buildNumber: process.env.REACT_APP_BUILD_NUMBER || '1',
        environment: process.env.NODE_ENV as any || 'development',
        platform: typeof window !== 'undefined' ? window.navigator.platform : 'unknown',
        browser: this.getBrowserInfo()
      },
      timestamp: Date.now()
    };
  }

  /**
   * Send error to external service
   */
  private async sendToErrorService(errorInfo: ErrorInfo): Promise<void> {
    try {
      // En un entorno real, esto enviaría a un servicio como Sentry, LogRocket, etc.
      console.log('Sending error to service:', errorInfo);
      
      // Simular envío
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorInfo)
      });
    } catch (error) {
      console.error('Failed to send error to service:', error);
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate report ID
   */
  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get browser information
   */
  private getBrowserInfo(): string {
    if (typeof window === 'undefined') return 'unknown';

    const ua = window.navigator.userAgent;
    
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    
    return 'Unknown';
  }
}

/**
 * Error Boundary para React
 */
export class Son1kVerseErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  private errorLogger: ErrorLogger;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
    this.errorLogger = new ErrorLogger();
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.errorLogger.log(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'Son1kVerseErrorBoundary'
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
function DefaultErrorFallback({ error }: { error: Error }) {
  return (
    <div className="error-fallback">
      <div className="error-content">
        <h2 className="error-title">🌀 Nexus Error</h2>
        <p className="error-message">
          Algo salió mal en el universo Son1kVerse. Nuestro equipo cuántico está trabajando en ello.
        </p>
        <details className="error-details">
          <summary>Detalles técnicos</summary>
          <pre className="error-stack">{error.stack}</pre>
        </details>
        <button 
          className="error-retry"
          onClick={() => window.location.reload()}
        >
          🔄 Reiniciar Nexus
        </button>
      </div>
    </div>
  );
}

/**
 * Error Handler Hook para React
 */
export function useErrorHandler() {
  const errorLogger = React.useMemo(() => new ErrorLogger(), []);

  const handleError = React.useCallback((
    error: Error | Son1kVerseError,
    context?: Record<string, any>
  ) => {
    errorLogger.log(error, context);
  }, [errorLogger]);

  const handleAsyncError = React.useCallback(async (
    asyncFn: () => Promise<any>,
    context?: Record<string, any>
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    errorLogger
  };
}

/**
 * Retry mechanism con backoff exponencial
 */
export class RetryManager {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000
  ) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  /**
   * Execute function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.maxRetries) {
          throw lastError;
        }

        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt),
          this.maxDelay
        );

        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Network Error Handler
 */
export class NetworkErrorHandler {
  private retryManager: RetryManager;
  private errorLogger: ErrorLogger;

  constructor() {
    this.retryManager = new RetryManager();
    this.errorLogger = new ErrorLogger();
  }

  /**
   * Handle network requests with retry logic
   */
  async handleRequest<T>(
    requestFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    return this.retryManager.execute(
      requestFn,
      (attempt, error) => {
        this.errorLogger.log(
          new NetworkError(`Network request failed (attempt ${attempt})`, context),
          { attempt, originalError: error.message }
        );
      }
    );
  }

  /**
   * Handle fetch requests
   */
  async fetch(
    url: string,
    options?: RequestInit,
    context?: Record<string, any>
  ): Promise<Response> {
    return this.handleRequest(
      () => fetch(url, options),
      { url, ...context }
    );
  }
}

/**
 * Validation Error Handler
 */
export class ValidationErrorHandler {
  private errorLogger: ErrorLogger;

  constructor() {
    this.errorLogger = new ErrorLogger();
  }

  /**
   * Validate data and throw validation error if invalid
   */
  validate<T>(
    data: T,
    validator: (data: T) => boolean | string,
    context?: Record<string, any>
  ): void {
    const result = validator(data);
    
    if (result !== true) {
      const message = typeof result === 'string' ? result : 'Validation failed';
      const error = new ValidationError(message, { data, ...context });
      this.errorLogger.log(error);
      throw error;
    }
  }

  /**
   * Validate required fields
   */
  validateRequired(
    data: Record<string, any>,
    requiredFields: string[],
    context?: Record<string, any>
  ): void {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      const error = new ValidationError(
        `Missing required fields: ${missingFields.join(', ')}`,
        { missingFields, ...context }
      );
      this.errorLogger.log(error);
      throw error;
    }
  }
}

// Exportar instancia global del error logger
export const globalErrorLogger = new ErrorLogger();

// Exportar instancia global del network handler
export const globalNetworkHandler = new NetworkErrorHandler();

// Exportar instancia global del validation handler
export const globalValidationHandler = new ValidationErrorHandler();

// Exportar utilidades principales
export {
  Son1kVerseError,
  NetworkError,
  ValidationError,
  AudioError,
  ImageError,
  ErrorLogger,
  Son1kVerseErrorBoundary,
  useErrorHandler,
  RetryManager,
  NetworkErrorHandler,
  ValidationErrorHandler
};