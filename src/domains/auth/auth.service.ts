/**
 * Module: Authentication Service
 * Description: Handles all authentication operations including login, logout, and session management
 * Dependencies: BaseService, config, errors
 * Notes: Supports both real API and mock authentication based on configuration
 * @module domains/auth
 */

import {
  BaseService,
  HttpMethod,
  type RequestConfig,
  type ApiResponse,
} from '../../lib/services/base.service';
import { AuthenticationError, ValidationError } from '../../lib/errors';
import { config } from '../../config';
import type { User, Session } from '../../lib/types';
import { authSchema, type AuthCredentials, type AuthResponse } from './auth.types';
import { getCurrentUser } from '../../lib/data/mockUsers';

/**
 * Authentication Service
 * Manages user authentication, session persistence, and token refresh
 */
export class AuthService extends BaseService {
  private static instance: AuthService;
  private sessionCheckInterval: number | null = null;

  private constructor() {
    super('AuthService', '/api/auth');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with credentials
   * @param credentials - User login credentials
   * @param rememberMe - Whether to extend session duration
   * @returns Authentication response with user and session data
   */
  async login(credentials: AuthCredentials, rememberMe = false): Promise<AuthResponse> {
    try {
      // Validate credentials
      const validatedCredentials = authSchema.credentials.parse(credentials);

      // Make authentication request
      const response = await this.post<AuthResponse>('/login', {
        ...validatedCredentials,
        rememberMe,
      });

      // Create and persist session
      const session = this.createSession(response.data.user, response.data.token, rememberMe);
      this.persistSession(session);

      // Start session monitoring
      this.startSessionMonitoring();

      return response.data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new AuthenticationError('Invalid credentials', {
        attempted_email: credentials.email,
      });
    }
  }

  /**
   * Authenticate with GitHub OAuth
   * @returns Authentication response
   */
  async loginWithGitHub(): Promise<AuthResponse> {
    try {
      const response = await this.get<AuthResponse>('/oauth/github');

      const session = this.createSession(
        response.data.user,
        response.data.token,
        true // GitHub auth always remembers
      );
      this.persistSession(session);
      this.startSessionMonitoring();

      return response.data;
    } catch (error) {
      throw new AuthenticationError('GitHub authentication failed');
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      // Notify server if not in mock mode
      if (!this.mockMode) {
        await this.post('/logout');
      }
    } catch (error) {
      // Log error but continue with local logout
      console.error('Server logout failed:', error);
    } finally {
      // Always clear local session
      this.clearSession();
      this.stopSessionMonitoring();
    }
  }

  /**
   * Get current session
   * @returns Current session or null
   */
  getSession(): Session | null {
    if (typeof window === 'undefined') return null;

    try {
      const sessionStr = localStorage.getItem(config.auth.sessionKey);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr) as Session;

      // Convert date strings to Date objects
      session.expiresAt = new Date(session.expiresAt);
      if (session.user.createdAt) {
        session.user.createdAt = new Date(session.user.createdAt);
      }
      if (session.user.lastLogin) {
        session.user.lastLogin = new Date(session.user.lastLogin);
      }

      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to parse session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Refresh current session token
   */
  async refreshSession(): Promise<void> {
    const session = this.getSession();
    if (!session) {
      throw new AuthenticationError('No active session');
    }

    try {
      const response = await this.post<AuthResponse>('/refresh', {
        token: session.token,
      });

      const newSession = this.createSession(
        response.data.user,
        response.data.token,
        session.rememberMe
      );
      this.persistSession(newSession);
    } catch (error) {
      this.clearSession();
      throw new AuthenticationError('Session refresh failed');
    }
  }

  /**
   * Extend session expiration
   */
  extendSession(): void {
    const session = this.getSession();
    if (!session) return;

    const expirationHours = session.rememberMe
      ? config.auth.rememberMeDurationHours
      : config.auth.sessionDurationHours;

    session.expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
    this.persistSession(session);
  }

  /**
   * Handle mock authentication requests
   */
  protected async handleMockRequest<T>(
    path: string,
    method: HttpMethod,
    options: RequestConfig
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (path === '/login' || path === '/oauth/github') {
      const user = getCurrentUser();
      const response: AuthResponse = {
        user,
        token: `mock-token-${Date.now()}`,
        expiresIn: 3600,
      };

      return {
        data: response as unknown as T,
        status: 200,
        headers: new Headers(),
        timestamp: new Date(),
      };
    }

    if (path === '/logout') {
      return {
        data: { success: true } as unknown as T,
        status: 200,
        headers: new Headers(),
        timestamp: new Date(),
      };
    }

    if (path === '/refresh') {
      const user = getCurrentUser();
      const response: AuthResponse = {
        user,
        token: `mock-token-${Date.now()}`,
        expiresIn: 3600,
      };

      return {
        data: response as unknown as T,
        status: 200,
        headers: new Headers(),
        timestamp: new Date(),
      };
    }

    throw new AuthenticationError('Mock endpoint not implemented');
  }

  /**
   * Create session object
   */
  private createSession(user: User, token: string, rememberMe: boolean): Session {
    const expirationHours = rememberMe
      ? config.auth.rememberMeDurationHours
      : config.auth.sessionDurationHours;

    return {
      user,
      token,
      expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
      rememberMe,
    };
  }

  /**
   * Persist session to localStorage
   */
  private persistSession(session: Session): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(config.auth.sessionKey, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to persist session:', error);
    }
  }

  /**
   * Clear session from localStorage
   */
  private clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(config.auth.sessionKey);
  }

  /**
   * Check if session is expired
   */
  private isSessionExpired(session: Session): boolean {
    return new Date() > new Date(session.expiresAt);
  }

  /**
   * Start monitoring session expiration
   */
  private startSessionMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Clear existing interval
    this.stopSessionMonitoring();

    // Check session every minute
    this.sessionCheckInterval = window.setInterval(() => {
      const session = this.getSession();
      if (!session) {
        this.stopSessionMonitoring();
        // Dispatch custom event for session expiration
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
    }, 60000);
  }

  /**
   * Stop monitoring session
   */
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
