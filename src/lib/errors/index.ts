/**
 * Module: Error Management System
 * Description: Centralized error handling, classification, and recovery strategies
 * Dependencies: None
 * Notes: All application errors should extend these base classes
 * @module errors
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
 * Error categories for classification
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  UNKNOWN = 'unknown',
}

/**
 * Base application error class
 * All custom errors should extend this class
 */
export abstract class AppError extends Error {
  public readonly timestamp: Date;
  public readonly id: string;

  constructor(
    message: string,
    public readonly code: string,
    public readonly severity: ErrorSeverity,
    public readonly category: ErrorCategory,
    public readonly recoverable: boolean = true,
    public readonly metadata?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.id = this.generateErrorId();

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  private generateErrorId(): string {
    return `${this.category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user-friendly error message
   */
  public getUserMessage(): string {
    return this.message;
  }

  /**
   * Get detailed error information for logging
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      category: this.category,
      recoverable: this.recoverable,
      timestamp: this.timestamp.toISOString(),
      metadata: this.metadata,
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    metadata?: Record<string, any>
  ) {
    super(
      message,
      `NETWORK_${statusCode || 'UNKNOWN'}`,
      statusCode === 503 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      ErrorCategory.NETWORK,
      true,
      { ...metadata, statusCode }
    );
  }

  getUserMessage(): string {
    if (this.statusCode === 404) {
      return 'The requested resource was not found';
    }
    if (this.statusCode === 500) {
      return 'A server error occurred. Please try again later';
    }
    if (this.statusCode === 503) {
      return 'Service temporarily unavailable. Please try again later';
    }
    return 'A network error occurred. Please check your connection';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: any,
    metadata?: Record<string, any>
  ) {
    super(message, 'VALIDATION_ERROR', ErrorSeverity.LOW, ErrorCategory.VALIDATION, true, {
      ...metadata,
      field,
      value,
    });
  }

  getUserMessage(): string {
    if (this.field) {
      return `Invalid value for ${this.field}: ${this.message}`;
    }
    return this.message;
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', metadata?: Record<string, any>) {
    super(message, 'AUTH_FAILED', ErrorSeverity.HIGH, ErrorCategory.AUTHENTICATION, true, metadata);
  }

  getUserMessage(): string {
    return 'Please log in to continue';
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Insufficient permissions',
    public readonly requiredRole?: string,
    metadata?: Record<string, any>
  ) {
    super(message, 'AUTH_FORBIDDEN', ErrorSeverity.MEDIUM, ErrorCategory.AUTHORIZATION, false, {
      ...metadata,
      requiredRole,
    });
  }

  getUserMessage(): string {
    return 'You do not have permission to perform this action';
  }
}

/**
 * Business logic errors
 */
export class BusinessError extends AppError {
  constructor(message: string, code: string, metadata?: Record<string, any>) {
    super(message, code, ErrorSeverity.MEDIUM, ErrorCategory.BUSINESS_LOGIC, true, metadata);
  }
}

/**
 * System errors (unrecoverable)
 */
export class SystemError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'SYSTEM_ERROR', ErrorSeverity.CRITICAL, ErrorCategory.SYSTEM, false, metadata);
  }

  getUserMessage(): string {
    return 'A system error occurred. Please contact support if this persists';
  }
}

/**
 * Error recovery strategies
 */
export interface ErrorRecoveryStrategy {
  canRecover(error: AppError): boolean;
  recover(error: AppError): Promise<void>;
}

/**
 * Network error recovery strategy
 */
export class NetworkErrorRecovery implements ErrorRecoveryStrategy {
  private retryCount = new Map<string, number>();
  private readonly maxRetries = 3;

  canRecover(error: AppError): boolean {
    if (!(error instanceof NetworkError)) return false;

    const count = this.retryCount.get(error.id) || 0;
    return error.recoverable && count < this.maxRetries;
  }

  async recover(error: AppError): Promise<void> {
    const count = this.retryCount.get(error.id) || 0;
    this.retryCount.set(error.id, count + 1);

    // Wait with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, count), 10000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Cleanup old entries
    if (this.retryCount.size > 100) {
      const oldestKey = this.retryCount.keys().next().value;
      if (oldestKey !== undefined) {
        this.retryCount.delete(oldestKey);
      }
    }
  }
}

/**
 * Global error handler
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private recoveryStrategies: ErrorRecoveryStrategy[] = [];
  private errorListeners: ((error: AppError) => void)[] = [];

  private constructor() {
    // Register default recovery strategies
    this.registerRecoveryStrategy(new NetworkErrorRecovery());
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Register a recovery strategy
   */
  registerRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.push(strategy);
  }

  /**
   * Register an error listener
   */
  onError(listener: (error: AppError) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * Handle an error with recovery attempts
   */
  async handle(error: Error): Promise<void> {
    const appError = this.normalizeError(error);

    // Notify listeners
    this.errorListeners.forEach((listener) => listener(appError));

    // Log error
    this.logError(appError);

    // Attempt recovery
    for (const strategy of this.recoveryStrategies) {
      if (strategy.canRecover(appError)) {
        try {
          await strategy.recover(appError);
          return;
        } catch (recoveryError) {
          console.error('Recovery failed:', recoveryError);
        }
      }
    }

    // If no recovery possible, throw
    if (!appError.recoverable) {
      throw appError;
    }
  }

  /**
   * Normalize any error to AppError
   */
  private normalizeError(error: Error): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Handle common error types
    if (error.name === 'TypeError') {
      return new SystemError(error.message, { originalError: error });
    }

    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return new NetworkError(error.message);
    }

    // Default to system error
    return new SystemError(error.message, { originalError: error });
  }

  /**
   * Log error based on severity
   */
  private logError(error: AppError): void {
    const logData = error.toJSON();

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🔴 CRITICAL ERROR:', logData);
        break;
      case ErrorSeverity.HIGH:
        console.error('🟠 HIGH SEVERITY ERROR:', logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('🟡 MEDIUM SEVERITY ERROR:', logData);
        break;
      case ErrorSeverity.LOW:
        console.info('🟢 LOW SEVERITY ERROR:', logData);
        break;
    }
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
