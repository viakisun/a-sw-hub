<script lang="ts">
  /**
   * AppShell Component
   * Main application layout with sidebar and header
   * Black & white industrial design with zero radius
   */
  import { page } from '$app/stores';
  import { currentUser } from '../../../domains/auth/auth.store';

  export let sidebarOpen = true;
</script>

<div class="app-shell">
  <!-- Skip Link for Accessibility -->
  <a href="#main" class="skip-link">Skip to main content</a>

  <!-- Sidebar -->
  <aside class="sidebar" class:sidebar--closed={!sidebarOpen}>
    <div class="sidebar__header">
      <div class="logo">
        <span class="logo__block"></span>
        <span class="logo__text">A-SW HUB</span>
      </div>
    </div>

    <nav class="sidebar__nav" aria-label="Main navigation">
      <a
        href="/dashboard"
        class="nav-item"
        class:nav-item--active={$page.url.pathname === '/dashboard'}
      >
        <span class="nav-item__icon">■</span>
        <span class="nav-item__text">DASHBOARD</span>
      </a>

      <a
        href="/projects"
        class="nav-item"
        class:nav-item--active={$page.url.pathname.startsWith('/projects')}
      >
        <span class="nav-item__icon">▦</span>
        <span class="nav-item__text">PROJECTS</span>
      </a>

      <a
        href="/builds"
        class="nav-item"
        class:nav-item--active={$page.url.pathname.startsWith('/builds')}
      >
        <span class="nav-item__icon">▣</span>
        <span class="nav-item__text">BUILDS</span>
      </a>

      <a
        href="/approvals"
        class="nav-item"
        class:nav-item--active={$page.url.pathname.startsWith('/approvals')}
      >
        <span class="nav-item__icon">☐</span>
        <span class="nav-item__text">APPROVALS</span>
      </a>

      <a
        href="/settings"
        class="nav-item"
        class:nav-item--active={$page.url.pathname.startsWith('/settings')}
      >
        <span class="nav-item__icon">⚙</span>
        <span class="nav-item__text">SETTINGS</span>
      </a>
    </nav>

    <div class="sidebar__footer">
      <div class="user-info">
        <div class="user-info__avatar"></div>
        <div class="user-info__details">
          <div class="user-info__name">{$currentUser?.name || 'Guest'}</div>
          <div class="user-info__role">{$currentUser?.role || 'viewer'}</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="main-wrapper">
    <!-- Header -->
    <header class="header">
      <button
        class="menu-toggle"
        on:click={() => sidebarOpen = !sidebarOpen}
        aria-label="Toggle sidebar"
      >
        {#if sidebarOpen}
          ◀
        {:else}
          ▶
        {/if}
      </button>

      <div class="header__title">
        <slot name="title">A-SW HUB</slot>
      </div>

      <div class="header__actions">
        <button class="header__action" aria-label="Notifications">
          <span class="notification-badge" data-count="3">□</span>
        </button>

        <a href="/login" class="header__action">
          LOGOUT
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main" class="main">
      <slot />
    </main>
  </div>
</div>

<style>
  .app-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* Sidebar Styles */
  .sidebar {
    width: var(--sidebar-width);
    height: 100%;
    background: var(--bg);
    border-right: 1px solid var(--hair);
    display: flex;
    flex-direction: column;
    transition: transform var(--transition-base);
  }

  .sidebar--closed {
    transform: translateX(-100%);
  }

  .sidebar__header {
    padding: var(--space-4);
    border-bottom: 1px solid var(--divider);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .logo__block {
    display: block;
    width: 24px;
    height: 24px;
    background: var(--fg);
  }

  .logo__text {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .sidebar__nav {
    flex: 1;
    padding: var(--space-4) 0;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    text-decoration: none;
    color: var(--fg);
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    transition: background var(--transition-fast);
    position: relative;
  }

  .nav-item:hover {
    background: var(--surface-1);
  }

  .nav-item--active {
    background: var(--surface-1);
    border-left: 2px solid var(--fg);
  }

  .nav-item__icon {
    font-size: var(--text-16);
    width: 20px;
    text-align: center;
  }

  .sidebar__footer {
    padding: var(--space-4);
    border-top: 1px solid var(--divider);
  }

  .user-info {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .user-info__avatar {
    width: 32px;
    height: 32px;
    background: var(--surface-2);
    border: 1px solid var(--hair);
  }

  .user-info__name {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
  }

  .user-info__role {
    font-size: var(--text-11);
    color: var(--muted);
    text-transform: uppercase;
  }

  /* Main Wrapper */
  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Header Styles */
  .header {
    height: var(--header-height);
    background: var(--bg);
    border-bottom: 1px solid var(--hair);
    display: flex;
    align-items: center;
    padding: 0 var(--space-4);
    gap: var(--space-4);
  }

  .menu-toggle {
    padding: var(--space-2);
    background: none;
    border: 1px solid var(--hair);
    font-size: var(--text-14);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .menu-toggle:hover {
    background: var(--surface-1);
  }

  .header__title {
    flex: 1;
    font-size: var(--text-16);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tight);
  }

  .header__actions {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  .header__action {
    padding: var(--space-2);
    background: none;
    border: none;
    color: var(--fg);
    cursor: pointer;
    text-decoration: none;
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    transition: opacity var(--transition-fast);
  }

  .header__action:hover {
    opacity: 0.7;
  }

  .notification-badge {
    position: relative;
    font-size: var(--text-20);
  }

  .notification-badge[data-count]::after {
    content: attr(data-count);
    position: absolute;
    top: -4px;
    right: -4px;
    font-size: var(--text-11);
    background: var(--fg);
    color: var(--bg);
    padding: 2px 4px;
    min-width: 16px;
    text-align: center;
  }

  /* Main Content */
  .main {
    flex: 1;
    overflow: auto;
    background: var(--bg);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      z-index: var(--z-sticky);
      box-shadow: 0 0 0 100vw rgba(0, 0, 0, 0.5);
    }

    .sidebar--closed {
      box-shadow: none;
    }
  }
</style>