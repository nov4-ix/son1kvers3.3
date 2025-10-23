/**
 * Error handling utilities for SON1KVERS3 platform
 */

import { ERROR_CODES, HTTP_STATUS } from './constants';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Capture stack trace if available (Node.js environment)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, ERROR_CODES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED, true, details);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired', details?: any) {
    super(message, ERROR_CODES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED, true, details);
  }
}

export class TokenInvalidError extends AppError {
  constructor(message: string = 'Invalid token', details?: any) {
    super(message, ERROR_CODES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED, true, details);
  }
}

export class InsufficientPermissionsError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(message, ERROR_CODES.INSUFFICIENT_PERMISSIONS, HTTP_STATUS.FORBIDDEN, true, details);
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, ERROR_CODES.RATE_LIMIT_EXCEEDED, HTTP_STATUS.TOO_MANY_REQUESTS, true, details);
  }
}

export class QuotaExceededError extends AppError {
  constructor(message: string = 'Quota exceeded', details?: any) {
    super(message, ERROR_CODES.QUOTA_EXCEEDED, HTTP_STATUS.TOO_MANY_REQUESTS, true, details);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

export class InvalidFormatError extends AppError {
  constructor(message: string = 'Invalid format', details?: any) {
    super(message, ERROR_CODES.INVALID_FORMAT, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

export class FileTooLargeError extends AppError {
  constructor(message: string = 'File too large', details?: any) {
    super(message, ERROR_CODES.FILE_TOO_LARGE, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

export class UnsupportedFormatError extends AppError {
  constructor(message: string = 'Unsupported format', details?: any) {
    super(message, ERROR_CODES.UNSUPPORTED_FORMAT, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

/**
 * Resource errors
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, ERROR_CODES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, true, details);
  }
}

export class AlreadyExistsError extends AppError {
  constructor(message: string = 'Resource already exists', details?: any) {
    super(message, ERROR_CODES.ALREADY_EXISTS, HTTP_STATUS.CONFLICT, true, details);
  }
}

export class ResourceLockedError extends AppError {
  constructor(message: string = 'Resource is locked', details?: any) {
    super(message, ERROR_CODES.RESOURCE_LOCKED, HTTP_STATUS.CONFLICT, true, details);
  }
}

/**
 * Generation errors
 */
export class GenerationError extends AppError {
  constructor(message: string = 'Generation failed', details?: any) {
    super(message, ERROR_CODES.GENERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR, true, details);
  }
}

export class ModelUnavailableError extends AppError {
  constructor(message: string = 'AI model unavailable', details?: any) {
    super(message, ERROR_CODES.MODEL_UNAVAILABLE, HTTP_STATUS.SERVICE_UNAVAILABLE, true, details);
  }
}

export class InsufficientResourcesError extends AppError {
  constructor(message: string = 'Insufficient resources', details?: any) {
    super(message, ERROR_CODES.INSUFFICIENT_RESOURCES, HTTP_STATUS.SERVICE_UNAVAILABLE, true, details);
  }
}

/**
 * Collaboration errors
 */
export class CollaborationFullError extends AppError {
  constructor(message: string = 'Collaboration is full', details?: any) {
    super(message, ERROR_CODES.COLLABORATION_FULL, HTTP_STATUS.CONFLICT, true, details);
  }
}

export class CollaborationLockedError extends AppError {
  constructor(message: string = 'Collaboration is locked', details?: any) {
    super(message, ERROR_CODES.COLLABORATION_LOCKED, HTTP_STATUS.CONFLICT, true, details);
  }
}

export class InvalidCollaborationStateError extends AppError {
  constructor(message: string = 'Invalid collaboration state', details?: any) {
    super(message, ERROR_CODES.INVALID_COLLABORATION_STATE, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

/**
 * Payment errors
 */
export class PaymentError extends AppError {
  constructor(message: string = 'Payment failed', details?: any) {
    super(message, ERROR_CODES.PAYMENT_FAILED, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

export class SubscriptionExpiredError extends AppError {
  constructor(message: string = 'Subscription expired', details?: any) {
    super(message, ERROR_CODES.SUBSCRIPTION_EXPIRED, HTTP_STATUS.FORBIDDEN, true, details);
  }
}

export class InsufficientFundsError extends AppError {
  constructor(message: string = 'Insufficient funds', details?: any) {
    super(message, ERROR_CODES.INSUFFICIENT_FUNDS, HTTP_STATUS.BAD_REQUEST, true, details);
  }
}

/**
 * System errors
 */
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, true, details);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service unavailable', details?: any) {
    super(message, ERROR_CODES.SERVICE_UNAVAILABLE, HTTP_STATUS.SERVICE_UNAVAILABLE, true, details);
  }
}

export class MaintenanceModeError extends AppError {
  constructor(message: string = 'System is under maintenance', details?: any) {
    super(message, ERROR_CODES.MAINTENANCE_MODE, HTTP_STATUS.SERVICE_UNAVAILABLE, true, details);
  }
}

/**
 * Error factory for creating appropriate error types
 */
export class ErrorFactory {
  static authentication(message?: string, details?: any): AuthenticationError {
    return new AuthenticationError(message, details);
  }

  static tokenExpired(message?: string, details?: any): TokenExpiredError {
    return new TokenExpiredError(message, details);
  }

  static tokenInvalid(message?: string, details?: any): TokenInvalidError {
    return new TokenInvalidError(message, details);
  }

  static insufficientPermissions(message?: string, details?: any): InsufficientPermissionsError {
    return new InsufficientPermissionsError(message, details);
  }

  static rateLimit(message?: string, details?: any): RateLimitError {
    return new RateLimitError(message, details);
  }

  static quotaExceeded(message?: string, details?: any): QuotaExceededError {
    return new QuotaExceededError(message, details);
  }

  static validation(message?: string, details?: any): ValidationError {
    return new ValidationError(message, details);
  }

  static invalidFormat(message?: string, details?: any): InvalidFormatError {
    return new InvalidFormatError(message, details);
  }

  static fileTooLarge(message?: string, details?: any): FileTooLargeError {
    return new FileTooLargeError(message, details);
  }

  static unsupportedFormat(message?: string, details?: any): UnsupportedFormatError {
    return new UnsupportedFormatError(message, details);
  }

  static notFound(message?: string, details?: any): NotFoundError {
    return new NotFoundError(message, details);
  }

  static alreadyExists(message?: string, details?: any): AlreadyExistsError {
    return new AlreadyExistsError(message, details);
  }

  static resourceLocked(message?: string, details?: any): ResourceLockedError {
    return new ResourceLockedError(message, details);
  }

  static generation(message?: string, details?: any): GenerationError {
    return new GenerationError(message, details);
  }

  static modelUnavailable(message?: string, details?: any): ModelUnavailableError {
    return new ModelUnavailableError(message, details);
  }

  static insufficientResources(message?: string, details?: any): InsufficientResourcesError {
    return new InsufficientResourcesError(message, details);
  }

  static collaborationFull(message?: string, details?: any): CollaborationFullError {
    return new CollaborationFullError(message, details);
  }

  static collaborationLocked(message?: string, details?: any): CollaborationLockedError {
    return new CollaborationLockedError(message, details);
  }

  static invalidCollaborationState(message?: string, details?: any): InvalidCollaborationStateError {
    return new InvalidCollaborationStateError(message, details);
  }

  static payment(message?: string, details?: any): PaymentError {
    return new PaymentError(message, details);
  }

  static subscriptionExpired(message?: string, details?: any): SubscriptionExpiredError {
    return new SubscriptionExpiredError(message, details);
  }

  static insufficientFunds(message?: string, details?: any): InsufficientFundsError {
    return new InsufficientFundsError(message, details);
  }

  static internal(message?: string, details?: any): InternalError {
    return new InternalError(message, details);
  }

  static serviceUnavailable(message?: string, details?: any): ServiceUnavailableError {
    return new ServiceUnavailableError(message, details);
  }

  static maintenanceMode(message?: string, details?: any): MaintenanceModeError {
    return new MaintenanceModeError(message, details);
  }

  /**
   * Create error from unknown error type
   */
  static fromUnknown(error: unknown, defaultMessage: string = 'An unknown error occurred'): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new InternalError(error.message || defaultMessage, { originalError: error.message });
    }

    return new InternalError(defaultMessage, { originalError: String(error) });
  }
}

/**
 * Error response formatter
 */
export function formatErrorResponse(error: AppError | Error): {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
} {
  const appError = error instanceof AppError ? error : ErrorFactory.fromUnknown(error);

  return {
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details
    }
  };
}

/**
 * Check if error is operational (safe to expose to client)
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Get error status code
 */
export function getErrorStatusCode(error: Error): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return HTTP_STATUS.INTERNAL_SERVER_ERROR;
}

/**
 * Get error code
 */
export function getErrorCode(error: Error): string {
  if (error instanceof AppError) {
    return error.code;
  }
  return ERROR_CODES.INTERNAL_ERROR;
}

/**
 * Create error with context
 */
export function createErrorWithContext(
  error: Error,
  context: Record<string, any>
): AppError {
  const appError = ErrorFactory.fromUnknown(error);

  return new AppError(
    appError.message,
    appError.code,
    appError.statusCode,
    appError.isOperational,
    {
      ...appError.details,
      context
    }
  );
}

/**
 * Wrap async function with error handling
 */
export function asyncErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return (...args: T): Promise<R> => {
    return fn(...args).catch(error => {
      throw ErrorFactory.fromUnknown(error);
    });
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        throw lastError;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Error logger utility
 */
export class ErrorLogger {
  static log(error: Error, context?: Record<string, any>): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context
    };

    // In production, this would log to a proper logging service
    console.error('Error logged:', errorInfo);
  }

  static logAppError(error: AppError, context?: Record<string, any>): void {
    this.log(error, {
      ...context,
      code: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      details: error.details
    });
  }
}

/**
 * Error boundary for async operations
 */
export async function withErrorBoundary<T>(
  operation: () => Promise<T>,
  fallback?: () => T,
  errorHandler?: (error: Error) => void
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error instanceof Error ? error : new Error(String(error)));
    } else {
      ErrorLogger.log(error instanceof Error ? error : new Error(String(error)));
    }

    if (fallback) {
      return fallback();
    }

    return undefined;
  }
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T = any>(json: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(json);
  } catch (error) {
    ErrorLogger.log(error instanceof Error ? error : new Error('JSON parse error'), { json });
    return fallback;
  }
}

/**
 * Safe async operation wrapper
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T,
  errorHandler?: (error: Error) => void
): Promise<T | undefined> {
  return withErrorBoundary(operation, () => fallback, errorHandler);
}
