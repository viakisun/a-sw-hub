import { writable, derived } from 'svelte/store';
import type { User, Session } from '$lib/types';
import { browser } from '$app/environment';
import { getCurrentUser } from '$lib/data/mockUsers';

// Create the auth store
function createAuthStore() {
  const SESSION_KEY = 'asw-hub-session';

  // Load session from localStorage if in browser
  const initialSession: Session | null = browser
    ? JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    : null;

  // Convert date strings back to Date objects
  if (initialSession?.expiresAt) {
    initialSession.expiresAt = new Date(initialSession.expiresAt);
  }
  if (initialSession?.user?.createdAt) {
    initialSession.user.createdAt = new Date(initialSession.user.createdAt);
  }
  if (initialSession?.user?.lastLogin) {
    initialSession.user.lastLogin = new Date(initialSession.user.lastLogin);
  }

  const { subscribe, set, update } = writable<Session | null>(initialSession);

  return {
    subscribe,
    login: async (username: string, password: string, rememberMe: boolean = false) => {
      // Mock authentication - accept any credentials
      const user = getCurrentUser(); // Use Sarah Chen as default
      const expirationHours = rememberMe ? 24 * 7 : 24; // 7 days or 1 day
      const session: Session = {
        user,
        token: `mock-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
        rememberMe,
      };

      // Save to localStorage
      if (browser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      set(session);
      return { success: true, user };
    },
    loginWithGitHub: async () => {
      // Mock GitHub OAuth login
      const user = getCurrentUser();
      const session: Session = {
        user,
        token: `github-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        rememberMe: true,
      };

      // Save to localStorage
      if (browser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      set(session);
      return { success: true, user };
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem(SESSION_KEY);
      }
      set(null);
    },
    checkSession: () => {
      update((session) => {
        if (!session) return null;

        // Check if session is expired
        if (new Date() > new Date(session.expiresAt)) {
          if (browser) {
            localStorage.removeItem(SESSION_KEY);
          }
          return null;
        }

        return session;
      });
    },
    extendSession: () => {
      update((session) => {
        if (!session) return null;

        const expirationHours = session.rememberMe ? 24 * 7 : 24;
        session.expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

        if (browser) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }

        return session;
      });
    },
  };
}

export const authStore = createAuthStore();

// Derived stores
export const currentUser = derived(authStore, ($authStore) => $authStore?.user || null);

export const isAuthenticated = derived(
  authStore,
  ($authStore) => !!$authStore && new Date() < new Date($authStore.expiresAt)
);

export const isAdmin = derived(currentUser, ($currentUser) => $currentUser?.role === 'admin');

export const isDeveloper = derived(
  currentUser,
  ($currentUser) => $currentUser?.role === 'developer' || $currentUser?.role === 'admin'
);
