<script lang="ts">
  /**
   * App Layout
   * Main application wrapper with AppShell
   */

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated, authStore } from '../../domains/auth/auth.store';
  import { logger } from '../../lib/logger';
  import AppShell from '$lib/components/layout/AppShell.svelte';

  const log = logger.module('AppLayout');

  // Check authentication
  onMount(() => {
    authStore.checkAuth();

    if (!$isAuthenticated) {
      log.warn('Unauthenticated access attempt to protected route');
      goto('/login');
    } else {
      log.debug('Authenticated user accessing protected route');
    }
  });
</script>

{#if $isAuthenticated}
  <AppShell>
    <slot />
  </AppShell>
{/if}