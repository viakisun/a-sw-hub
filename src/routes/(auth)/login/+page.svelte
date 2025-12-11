<script lang="ts">
  /**
   * Login Page
   * Industrial B/W split-screen design
   * Left: white form area
   * Right: black pitch area
   */

  import { authStore } from '../../../domains/auth/auth.store';
  import { logger } from '../../../lib/logger';
  import Input from '$lib/components/inputs/Input.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';
  import Button from '$lib/components/buttons/Button.svelte';

  const log = logger.module('LoginPage');

  let email = '';
  let password = '';
  let rememberMe = false;
  let loading = false;
  let error = '';

  async function handleSubmit() {
    error = '';
    loading = true;
    console.log('[LoginPage] Starting login:', { email, passwordLength: password.length, rememberMe });
    log.info('Login attempt', { email });

    try {
      const result = await authStore.login({ email, password }, rememberMe);
      console.log('[LoginPage] Login result:', result);

      if (!result.success) {
        error = result.error || 'Authentication failed';
        console.error('[LoginPage] Login failed:', { email, error });
        log.warn('Login failed', { email, error });
      } else {
        console.log('[LoginPage] Login successful:', { email, user: result.user });
        log.info('Login successful', { email });
      }
    } catch (e) {
      console.error('[LoginPage] Login exception:', e);
      error = e instanceof Error ? e.message : 'Authentication failed';
      log.error('Login error', e, { email });
    } finally {
      loading = false;
    }
  }

  async function handleGitHubLogin() {
    loading = true;
    log.info('GitHub login attempt');

    try {
      const result = await authStore.loginWithProvider('github');
      if (!result.success) {
        error = result.error || 'GitHub authentication failed';
        log.warn('GitHub login failed', { error });
      } else {
        log.info('GitHub login successful');
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'GitHub authentication failed';
      log.error('GitHub login error', e);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login | agrithing.ai</title>
</svelte:head>

<div class="login-page">
  <!-- Left Side - Form -->
  <div class="login-form">
    <div class="login-form__container">
      <div class="logo">
        <span class="logo__block"></span>
        <div class="logo__content">
          <h1 class="logo__text">agrithing.ai</h1>
          <span class="logo__subtitle">A-SW 서비스 플랫폼</span>
        </div>
      </div>

      <div class="login-form__header">
        <h2>AUTHENTICATION</h2>
        <p class="subtitle">ACCESS AGRICULTURAL SOFTWARE WORKSPACE</p>
      </div>

      {#if error}
        <div class="error-message" role="alert">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <Input
            type="email"
            bind:value={email}
            label="EMAIL ADDRESS"
            placeholder="user@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <Input
            type="password"
            bind:value={password}
            label="PASSWORD"
            placeholder="Enter password"
            required
            autocomplete="current-password"
          />
        </div>

        <div class="form-row">
          <Checkbox bind:checked={rememberMe} label="Remember me" />
          <a href="/forgot" class="link">FORGOT PASSWORD?</a>
        </div>

        <div class="form-actions">
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </Button>
        </div>
      </form>

      <div class="divider">
        <span class="divider__line"></span>
        <span class="divider__text">OR</span>
        <span class="divider__line"></span>
      </div>

      <Button variant="outline" fullWidth on:click={handleGitHubLogin} disabled={loading}>
        <span class="github-icon">■</span>
        AUTHENTICATE WITH GITHUB
      </Button>

      <div class="login-footer">
        <p class="stats">
          <span class="stat">142 PROJECTS</span>
          <span class="stat-separator">|</span>
          <span class="stat">47 ACTIVE BUILDS</span>
          <span class="stat-separator">|</span>
          <span class="stat">12 USERS ONLINE</span>
        </p>
      </div>
    </div>
  </div>

  <!-- Right Side - Pitch -->
  <div class="login-pitch">
    <div class="pitch-content">
      <h2 class="pitch-title">농업기계 자율주행 소프트웨어 협력 개발 플랫폼</h2>

      <div class="features">
        <div class="feature">
          <span class="feature__icon">■</span>
          <div class="feature__content">
            <h3>CI/CD 파이프라인</h3>
            <p>자동화된 빌드, 테스트, 배포 워크플로우</p>
          </div>
        </div>

        <div class="feature">
          <span class="feature__icon">▦</span>
          <div class="feature__content">
            <h3>프로젝트 관리</h3>
            <p>오픈소스 기반 협력 개발 및 버전 관리</p>
          </div>
        </div>

        <div class="feature">
          <span class="feature__icon">▣</span>
          <div class="feature__content">
            <h3>품질 관리</h3>
            <p>코드 리뷰, 테스트 커버리지, 정적 분석</p>
          </div>
        </div>

        <div class="feature">
          <span class="feature__icon">☐</span>
          <div class="feature__content">
            <h3>배포 자동화</h3>
            <p>농업기계 타겟 환경별 빌드 및 배포</p>
          </div>
        </div>
      </div>

      <div class="participants">
        <span class="participant">KITECH</span>
        <span class="participant">TYMICT</span>
        <span class="participant">JBNU</span>
        <span class="participant">VIA</span>
        <span class="participant">OntarioTech</span>
      </div>
    </div>

    <div class="pitch-footer">
      <p>© 2025 한국생산기술연구원. ALL RIGHTS RESERVED.</p>
    </div>
  </div>
</div>

<style>
  .login-page {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* Left Side - Form */
  .login-form {
    flex: 1;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    overflow-y: auto;
  }

  .login-form__container {
    width: 100%;
    max-width: 400px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-8);
  }

  .logo__block {
    width: 32px;
    height: 32px;
    background: var(--fg);
  }

  .logo__content {
    display: flex;
    flex-direction: column;
  }

  .logo__text {
    font-size: var(--text-24);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .logo__subtitle {
    font-size: var(--text-11);
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    margin-top: var(--space-1);
  }

  .login-form__header {
    margin-bottom: var(--space-6);
  }

  .login-form__header h2 {
    font-size: var(--text-20);
    font-weight: var(--weight-medium);
    margin-bottom: var(--space-2);
    letter-spacing: var(--tracking-tight);
  }

  .subtitle {
    font-size: var(--text-12);
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .error-message {
    background: var(--surface-1);
    border: 1px solid var(--fg);
    padding: var(--space-3);
    margin-bottom: var(--space-4);
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
  }

  .form-group {
    margin-bottom: var(--space-4);
  }

  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  .link {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    text-decoration: none;
    color: var(--fg);
    border-bottom: 1px solid var(--fg);
  }

  .link:hover {
    opacity: 0.7;
  }

  .form-actions {
    margin-bottom: var(--space-6);
  }

  .divider {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin: var(--space-6) 0;
  }

  .divider__line {
    flex: 1;
    height: 1px;
    background: var(--hair);
  }

  .divider__text {
    font-size: var(--text-11);
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .github-icon {
    font-size: var(--text-16);
  }

  .login-footer {
    margin-top: var(--space-8);
    padding-top: var(--space-4);
    border-top: 1px solid var(--divider);
  }

  .stats {
    font-size: var(--text-11);
    color: var(--muted);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .stat-separator {
    margin: 0 var(--space-2);
    opacity: 0.4;
  }

  /* Right Side - Pitch */
  .login-pitch {
    flex: 1;
    background: var(--fg);
    color: var(--bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-12) var(--space-8);
    position: relative;
  }

  .pitch-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .pitch-title {
    font-size: var(--text-32);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .feature {
    display: flex;
    gap: var(--space-4);
  }

  .feature__icon {
    font-size: var(--text-24);
    opacity: 0.8;
  }

  .feature__content h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-medium);
    margin-bottom: var(--space-1);
    letter-spacing: var(--tracking-wide);
  }

  .feature__content p {
    font-size: var(--text-12);
    opacity: 0.7;
    line-height: var(--leading-normal);
  }

  .participants {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .participant {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--bg);
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
  }

  .pitch-footer {
    text-align: center;
  }

  .pitch-footer p {
    font-size: var(--text-11);
    opacity: 0.6;
    letter-spacing: var(--tracking-wide);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .login-pitch {
      display: none;
    }

    .login-form {
      padding: var(--space-4);
    }
  }
</style>