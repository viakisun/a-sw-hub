/**
 * Module: Base Service
 * Description: Abstract base class for all service implementations with retry logic and error handling
 * Dependencies: config, errors
 * Notes: All services should extend this class for consistent behavior
 * @module services/base
 */

import { config } from '../../config';
import { NetworkError, AppError, errorHandler } from '../errors';

/**
 * HTTP methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * Request configuration
 */
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  mock?: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  timestamp: Date;
}

/**
 * Base service class with common HTTP functionality
 */
export abstract class BaseService {
  protected readonly baseUrl: string;
  protected readonly timeout: number;
  protected readonly maxRetries: number;
  protected readonly retryDelay: number;
  protected readonly mockMode: boolean;

  constructor(
    protected readonly serviceName: string,
    protected readonly endpoint?: string
  ) {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
    this.maxRetries = config.api.retryAttempts;
    this.retryDelay = config.api.retryDelay;
    this.mockMode = config.api.mockMode;

    console.log(`[${serviceName}] Initialized with:`, {
      baseUrl: this.baseUrl,
      endpoint: this.endpoint,
      mockMode: this.mockMode,
      environment: config.environment,
      configMockMode: config.api.mockMode,
    });
  }

  /**
   * Make an HTTP request with retry logic and error handling
   */
  protected async request<T>(path: string, options: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path, options.params);
    const method = options.method || HttpMethod.GET;
    const timeout = options.timeout || this.timeout;
    const retries = options.retries ?? this.maxRetries;

    // Use mock mode if configured
    if (this.mockMode || options.mock) {
      console.log(`[BaseService] Using mock mode for ${method} ${path}`);
      const mockResponse = await this.handleMockRequest<T>(path, method, options);
      console.log(`[BaseService] Mock response:`, mockResponse);
      return mockResponse;
    }

    // Prepare request
    const requestOptions: RequestInit = {
      method,
      headers: this.buildHeaders(options.headers),
      signal: this.createAbortSignal(timeout),
    };

    if (options.body && method !== HttpMethod.GET) {
      requestOptions.body = JSON.stringify(options.body);
    }

    // Execute request with retries
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new NetworkError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            {
              url,
              method,
              attempt,
            }
          );
        }

        const data = await this.parseResponse<T>(response);

        return {
          data,
          status: response.status,
          headers: response.headers,
          timestamp: new Date(),
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (
          error instanceof NetworkError &&
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          break;
        }

        // Wait before retrying
        if (attempt < retries) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
          console.log(`[${this.serviceName}] Retrying request (attempt ${attempt + 1}/${retries})`);
        }
      }
    }

    // All attempts failed
    if (lastError) {
      await errorHandler.handle(lastError);
      throw lastError;
    }

    throw new NetworkError('Request failed after all retry attempts');
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    // In mock mode with no baseUrl, just return the path
    if (this.mockMode && !this.baseUrl) {
      const queryString = params
        ? '?' +
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join('&')
        : '';
      return path + queryString;
    }

    const baseUrl = this.endpoint ? `${this.baseUrl}${this.endpoint}` : this.baseUrl;

    // If baseUrl is still empty, use a dummy URL for mock mode
    const urlBase = baseUrl || 'http://mock.local';
    const url = new URL(path, urlBase);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    // Add auth token if available
    const sessionData = this.getSessionData();
    if (sessionData?.token) {
      headers['Authorization'] = `${config.auth.tokenPrefix} ${sessionData.token}`;
    }

    return headers;
  }

  /**
   * Create abort signal for request timeout
   */
  private createAbortSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    if (contentType?.includes('text/')) {
      return response.text() as unknown as T;
    }

    // Default to blob for binary data
    return response.blob() as unknown as T;
  }

  /**
   * Handle mock requests
   */
  protected abstract handleMockRequest<T>(
    path: string,
    method: HttpMethod,
    options: RequestConfig
  ): Promise<ApiResponse<T>>;

  /**
   * Get session data from localStorage
   */
  private getSessionData(): { token: string; user: any } | null {
    if (typeof window === 'undefined') return null;

    try {
      const sessionStr = localStorage.getItem(config.auth.sessionKey);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request helper
   */
  protected get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: HttpMethod.GET, params });
  }

  /**
   * POST request helper
   */
  protected post<T>(
    path: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: HttpMethod.POST, body, params });
  }

  /**
   * PUT request helper
   */
  protected put<T>(
    path: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: HttpMethod.PUT, body, params });
  }

  /**
   * PATCH request helper
   */
  protected patch<T>(
    path: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: HttpMethod.PATCH, body, params });
  }

  /**
   * DELETE request helper
   */
  protected delete<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: HttpMethod.DELETE, params });
  }
}
