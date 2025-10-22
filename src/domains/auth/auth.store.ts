/**
 * Module: Authentication Store
 * Description: Reactive state management for authentication with proper error handling
 * Dependencies: svelte/store, auth.service, auth.types
 * Notes: This store is the single source of truth for authentication state
 * @module domains/auth/store
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { authService } from './auth.service';
import { errorHandler } from '../../lib/errors';
import type { User } from '../../lib/types';
import { AuthEvent } from './auth.types';
import type { AuthState, AuthCredentials } from './auth.types';

/**
 * Create the authentication store with proper initialization
 */
function createAuthStore() {
  // Initialize state
  const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  };

  // Create writable store
  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Event emitter for auth events
  const emit = (event: AuthEvent, data?: any) => {
    if (browser) {
      window.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
  };

  // Initialize store on client side
  if (browser) {
    // Check for existing session
    const session = authService.getSession();
    if (session) {
      update((state) => ({
        ...state,
        isAuthenticated: true,
        user: session.user,
        isLoading: false,
      }));
    } else {
      update((state) => ({ ...state, isLoading: false }));
    }

    // Listen for session expiration
    window.addEventListener('session-expired', () => {
      handleSessionExpired();
    });
  }

  /**
   * Handle session expiration
   */
  async function handleSessionExpired() {
    update((state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      error: 'Your session has expired. Please log in again.',
    }));

    emit(AuthEvent.SESSION_EXPIRED);

    // Redirect to login
    await goto('/login');
  }

  /**
   * Login with credentials
   */
  async function login(credentials: AuthCredentials, rememberMe = false) {
    console.log('[AuthStore] Login called with:', { email: credentials.email, rememberMe });
    update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      console.log('[AuthStore] Calling authService.login...');
      const response = await authService.login(credentials, rememberMe);
      console.log('[AuthStore] Auth service response:', response);

      update((state) => ({
        ...state,
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        error: null,
      }));

      emit(AuthEvent.LOGIN_SUCCESS, response.user);

      // Navigate to dashboard
      await goto('/dashboard');

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      update((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMessage,
      }));

      emit(AuthEvent.LOGIN_FAILURE, { error: errorMessage });
      await errorHandler.handle(error as Error);

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Login with OAuth provider
   */
  async function loginWithProvider(provider: 'github' | 'google' | 'microsoft' = 'github') {
    update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      // For now, only GitHub is implemented
      if (provider !== 'github') {
        throw new Error(`${provider} authentication not yet implemented`);
      }

      const response = await authService.loginWithGitHub();

      update((state) => ({
        ...state,
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        error: null,
      }));

      emit(AuthEvent.LOGIN_SUCCESS, response.user);

      // Navigate to dashboard
      await goto('/dashboard');

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth login failed';

      update((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMessage,
      }));

      emit(AuthEvent.LOGIN_FAILURE, { error: errorMessage });
      await errorHandler.handle(error as Error);

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Logout current user
   */
  async function logout() {
    update((state) => ({ ...state, isLoading: true }));

    try {
      await authService.logout();

      update((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      }));

      emit(AuthEvent.LOGOUT);

      // Navigate to login
      await goto('/login');
    } catch (error) {
      // Logout should always succeed locally even if server fails
      update((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      }));

      emit(AuthEvent.LOGOUT);
      await goto('/login');
    }
  }

  /**
   * Refresh the current session
   */
  async function refreshSession() {
    const currentState = get({ subscribe });
    if (!currentState.isAuthenticated) return;

    try {
      await authService.refreshSession();
      const session = authService.getSession();

      if (session) {
        update((state) => ({
          ...state,
          user: session.user,
          error: null,
        }));

        emit(AuthEvent.SESSION_REFRESHED);
      }
    } catch (error) {
      // Session refresh failed - user needs to login again
      await handleSessionExpired();
    }
  }

  /**
   * Check authentication status
   */
  function checkAuth() {
    const session = authService.getSession();

    if (session) {
      update((state) => ({
        ...state,
        isAuthenticated: true,
        user: session.user,
        isLoading: false,
        error: null,
      }));
    } else {
      update((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      }));
    }
  }

  /**
   * Clear any authentication errors
   */
  function clearError() {
    update((state) => ({ ...state, error: null }));
  }

  /**
   * Update user profile
   */
  function updateUser(updates: Partial<User>) {
    update((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...updates };

      // Update session with new user data
      const session = authService.getSession();
      if (session) {
        session.user = updatedUser;
        authService['persistSession'](session); // Access private method
      }

      return {
        ...state,
        user: updatedUser,
      };
    });
  }

  return {
    subscribe,
    login,
    loginWithProvider,
    logout,
    refreshSession,
    checkAuth,
    clearError,
    updateUser,
  };
}

// Create the store instance
export const authStore = createAuthStore();

// Derived stores for convenience
export const currentUser = derived(authStore, ($authStore) => $authStore.user);

export const isAuthenticated = derived(authStore, ($authStore) => $authStore.isAuthenticated);

export const isAdmin = derived(authStore, ($authStore) => $authStore.user?.role === 'admin');

export const isDeveloper = derived(
  authStore,
  ($authStore) => $authStore.user?.role === 'developer' || $authStore.user?.role === 'admin'
);

export const authError = derived(authStore, ($authStore) => $authStore.error);

export const isLoading = derived(authStore, ($authStore) => $authStore.isLoading);
