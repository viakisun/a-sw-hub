<script lang="ts">
  /**
   * Root Landing Page
   * Redirects to login or dashboard based on authentication status
   */
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated, authStore } from '../domains/auth/auth.store';
  import { logger } from '../lib/logger';

  const log = logger.module('LandingPage');

  onMount(() => {
    // Check authentication status
    authStore.checkAuth();

    // Redirect based on auth status
    if ($isAuthenticated) {
      log.info('Authenticated user accessing root, redirecting to dashboard');
      goto('/dashboard');
    } else {
      log.info('Unauthenticated user accessing root, redirecting to login');
      goto('/login');
    }
  });
</script>

<div class="loading-container">
  <div class="loading-content">
    <div class="logo">
      <span class="logo__block"></span>
      <h1>A-SW HUB</h1>
    </div>
    <div class="spinner"></div>
    <p>INITIALIZING SYSTEM...</p>
  </div>
</div>

<style>
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg);
  }

  .loading-content {
    text-align: center;
  }

  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .logo__block {
    width: 64px;
    height: 64px;
    background: var(--fg);
  }

  .logo h1 {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid var(--hair);
    border-top-color: var(--fg);
    border-radius: 0 !important;
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-4);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  p {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }
</style>