<script lang="ts">
  /**
   * Settings Page
   * System configuration and user preferences management
   */

  import { onMount } from 'svelte';
  import { settingsStore, hasPendingChanges } from '$lib/stores/settingsStore';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import type {
    UserProfile,
    SecuritySettings,
    NotificationSettings,
    PreferencesSettings,
    IntegrationSettings,
    DataPrivacySettings,
    ApiKey,
    Session
  } from '$lib/stores/settingsStore';

  let activeTab: 'PROFILE' | 'SECURITY' | 'NOTIFICATIONS' | 'PREFERENCES' | 'INTEGRATIONS' | 'DATA' = 'PROFILE';
  let isSaving = false;
  let showPasswordForm = false;
  let showApiKeyForm = false;
  let showExportDialog = false;
  let showDeleteAccountDialog = false;

  // Password change form
  let passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };

  // API key form
  let apiKeyForm = {
    name: '',
    permissions: [] as string[]
  };

  // Export form
  let exportFormat: 'JSON' | 'CSV' | 'XML' = 'JSON';

  // Reactive statements
  $: profile = $settingsStore.profile;
  $: security = $settingsStore.security;
  $: notifications = $settingsStore.notifications;
  $: preferences = $settingsStore.preferences;
  $: integrations = $settingsStore.integrations;
  $: dataPrivacy = $settingsStore.dataPrivacy;
  $: isDirty = $hasPendingChanges;

  onMount(async () => {
    await settingsStore.loadSettings();
  });

  function getTabIcon(tab: string): string {
    switch(tab) {
      case 'PROFILE': return '▣';
      case 'SECURITY': return '◈';
      case 'NOTIFICATIONS': return '◉';
      case 'PREFERENCES': return '◧';
      case 'INTEGRATIONS': return '◊';
      case 'DATA': return '◩';
      default: return '▪';
    }
  }

  async function handleSave() {
    isSaving = true;
    try {
      await settingsStore.saveSettings();
    } finally {
      isSaving = false;
    }
  }

  async function handlePasswordChange() {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('PASSWORDS DO NOT MATCH');
      return;
    }
    await settingsStore.changePassword(passwordForm.current, passwordForm.new);
    passwordForm = { current: '', new: '', confirm: '' };
    showPasswordForm = false;
  }

  async function handleGenerateApiKey() {
    const key = await settingsStore.generateApiKey(apiKeyForm.name, apiKeyForm.permissions);
    apiKeyForm = { name: '', permissions: [] };
    showApiKeyForm = false;
  }

  async function handleRevokeApiKey(keyId: string) {
    if (confirm('REVOKE THIS API KEY?')) {
      await settingsStore.revokeApiKey(keyId);
    }
  }

  async function handleEndSession(sessionId: string) {
    if (confirm('END THIS SESSION?')) {
      await settingsStore.endSession(sessionId);
    }
  }

  async function handleDataExport() {
    await settingsStore.requestDataExport(exportFormat);
    showExportDialog = false;
  }

  async function handleDeleteAccount() {
    const confirmation = prompt('TYPE "DELETE MY ACCOUNT" TO CONFIRM');
    if (confirmation === 'DELETE MY ACCOUNT') {
      await settingsStore.deleteAccount();
      window.location.href = '/';
    }
  }

  function formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  function maskApiKey(key: string): string {
    return key.substring(0, 10) + '...' + key.substring(key.length - 4);
  }
</script>

<div class="settings-page">
  <!-- Header -->
  <div class="page-header">
    <div>
      <Heading level={1}>SETTINGS</Heading>
      <Text muted>SYSTEM CONFIGURATION AND USER PREFERENCES</Text>
    </div>
    <div class="header-actions">
      {#if isDirty}
        <Text>● UNSAVED CHANGES</Text>
      {/if}
      <Button
        variant="primary"
        disabled={!isDirty || isSaving}
        on:click={handleSave}
      >
        {isSaving ? '◎ SAVING...' : '▶ SAVE CHANGES'}
      </Button>
    </div>
  </div>

  <div class="settings-layout">
    <!-- Sidebar Navigation -->
    <aside class="settings-sidebar">
      <nav class="settings-nav">
        {#each ['PROFILE', 'SECURITY', 'NOTIFICATIONS', 'PREFERENCES', 'INTEGRATIONS', 'DATA'] as tab}
          <button
            class="nav-item"
            class:active={activeTab === tab}
            on:click={() => activeTab = tab as any}
            type="button"
          >
            <span class="nav-icon">{getTabIcon(tab)}</span>
            <span class="nav-label">{tab}</span>
            <span class="nav-arrow">{activeTab === tab ? '■' : '□'}</span>
          </button>
        {/each}
      </nav>
    </aside>

    <!-- Content Area -->
    <main class="settings-content">
      {#if activeTab === 'PROFILE' && profile}
        <section class="settings-section">
          <div class="section-header">
            <h2>USER PROFILE</h2>
            <Text size="small" muted>MANAGE YOUR ACCOUNT INFORMATION</Text>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="username">USERNAME</label>
              <input
                id="username"
                type="text"
                value={profile.username}
                on:input={e => settingsStore.updateProfile({ username: e.currentTarget.value as any })}
              />
            </div>

            <div class="form-group">
              <label for="email">EMAIL ADDRESS</label>
              <input
                id="email"
                type="email"
                value={profile.email}
                on:input={e => settingsStore.updateProfile({ email: e.currentTarget.value as any })}
              />
            </div>

            <div class="form-group">
              <label for="fullName">FULL NAME</label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                on:input={e => settingsStore.updateProfile({ fullName: e.currentTarget.value as any })}
              />
            </div>

            <div class="form-group">
              <label for="department">DEPARTMENT</label>
              <input
                id="department"
                type="text"
                value={profile.department}
                on:input={e => settingsStore.updateProfile({ department: e.currentTarget.value as any })}
              />
            </div>

            <div class="form-group">
              <label for="role">ROLE</label>
              <input
                id="role"
                type="text"
                value={profile.role}
                readonly
              />
            </div>

            <div class="form-group">
              <label for="phone">PHONE NUMBER</label>
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                on:input={e => settingsStore.updateProfile({ phone: e.currentTarget.value as any })}
              />
            </div>

            <div class="form-group">
              <label for="location">LOCATION</label>
              <input
                id="location"
                type="text"
                value={profile.location}
                on:input={e => settingsStore.updateProfile({ location: e.currentTarget.value as any })}
              />
            </div>

            <div class="form-group">
              <label for="joinDate">JOIN DATE</label>
              <input
                id="joinDate"
                type="text"
                value={profile.joinDate}
                readonly
              />
            </div>

            <div class="form-group full-width">
              <label for="bio">BIO</label>
              <textarea
                id="bio"
                value={profile.bio}
                on:input={e => settingsStore.updateProfile({ bio: e.currentTarget.value as any })}
                rows="3"
              ></textarea>
            </div>
          </div>
        </section>

      {:else if activeTab === 'SECURITY' && security}
        <section class="settings-section">
          <div class="section-header">
            <h2>SECURITY SETTINGS</h2>
            <Text size="small" muted>MANAGE PASSWORDS AND ACCESS</Text>
          </div>

          <!-- Password Section -->
          <div class="subsection">
            <h3>PASSWORD</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">LAST CHANGED</span>
                <span class="info-value">{formatDate(security.password.lastChanged)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">MINIMUM LENGTH</span>
                <span class="info-value">{security.password.minLength} CHARACTERS</span>
              </div>
            </div>

            {#if !showPasswordForm}
              <Button variant="outline" on:click={() => showPasswordForm = true}>
                ▶ CHANGE PASSWORD
              </Button>
            {:else}
              <div class="password-form">
                <div class="form-group">
                  <label for="currentPassword">CURRENT PASSWORD</label>
                  <input
                    id="currentPassword"
                    type="password"
                    bind:value={passwordForm.current}
                  />
                </div>
                <div class="form-group">
                  <label for="newPassword">NEW PASSWORD</label>
                  <input
                    id="newPassword"
                    type="password"
                    bind:value={passwordForm.new}
                  />
                </div>
                <div class="form-group">
                  <label for="confirmPassword">CONFIRM NEW PASSWORD</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    bind:value={passwordForm.confirm}
                  />
                </div>
                <div class="form-actions">
                  <Button variant="primary" on:click={handlePasswordChange}>
                    ◈ UPDATE PASSWORD
                  </Button>
                  <Button variant="outline" on:click={() => showPasswordForm = false}>
                    ✕ CANCEL
                  </Button>
                </div>
              </div>
            {/if}
          </div>

          <!-- Two-Factor Authentication -->
          <div class="subsection">
            <h3>TWO-FACTOR AUTHENTICATION</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">STATUS</span>
                <span class="info-value">{security.twoFactor.enabled ? '● ENABLED' : '○ DISABLED'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">METHOD</span>
                <span class="info-value">{security.twoFactor.method.toUpperCase()}</span>
              </div>
            </div>
            <Button variant="outline">
              {security.twoFactor.enabled ? '○ DISABLE 2FA' : '● ENABLE 2FA'}
            </Button>
          </div>

          <!-- API Keys -->
          <div class="subsection">
            <div class="subsection-header">
              <h3>API KEYS</h3>
              <Button variant="outline" size="small" on:click={() => showApiKeyForm = true}>
                + NEW KEY
              </Button>
            </div>

            {#if showApiKeyForm}
              <div class="api-key-form">
                <div class="form-group">
                  <label for="keyName">KEY NAME</label>
                  <input
                    id="keyName"
                    type="text"
                    bind:value={apiKeyForm.name}
                    placeholder="e.g., CI/CD Pipeline"
                  />
                </div>
                <div class="form-group">
                  <label>PERMISSIONS</label>
                  <div class="checkbox-group">
                    {#each ['read:projects', 'write:projects', 'read:builds', 'write:builds', 'read:deployments', 'write:deployments'] as permission}
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          value={permission}
                          on:change={e => {
                            if (e.currentTarget.checked) {
                              apiKeyForm.permissions = [...apiKeyForm.permissions, permission];
                            } else {
                              apiKeyForm.permissions = apiKeyForm.permissions.filter(p => p !== permission);
                            }
                          }}
                        />
                        {permission}
                      </label>
                    {/each}
                  </div>
                </div>
                <div class="form-actions">
                  <Button variant="primary" on:click={handleGenerateApiKey}>
                    ◈ GENERATE KEY
                  </Button>
                  <Button variant="outline" on:click={() => showApiKeyForm = false}>
                    ✕ CANCEL
                  </Button>
                </div>
              </div>
            {/if}

            <div class="api-keys-list">
              {#each security.apiKeys as key}
                <div class="api-key-item">
                  <div class="api-key-info">
                    <div class="api-key-name">{key.name}</div>
                    <div class="api-key-value">{maskApiKey(key.key)}</div>
                    <div class="api-key-meta">
                      CREATED: {formatDate(key.createdAt)} |
                      EXPIRES: {key.expiresAt ? formatDate(key.expiresAt) : 'NEVER'}
                    </div>
                  </div>
                  <Button variant="text" size="small" on:click={() => handleRevokeApiKey(key.id)}>
                    ✕ REVOKE
                  </Button>
                </div>
              {/each}
            </div>
          </div>

          <!-- Active Sessions -->
          <div class="subsection">
            <h3>ACTIVE SESSIONS</h3>
            <div class="sessions-list">
              {#each security.sessions as session}
                <div class="session-item" class:current={session.current}>
                  <div class="session-info">
                    <div class="session-device">
                      {session.current ? '▶' : '▷'} {session.device}
                    </div>
                    <div class="session-details">
                      {session.location} | {session.ip} | {session.browser}
                    </div>
                    <div class="session-time">
                      LAST ACTIVE: {formatDate(session.lastActive)}
                    </div>
                  </div>
                  {#if !session.current}
                    <Button variant="text" size="small" on:click={() => handleEndSession(session.id)}>
                      ✕ END
                    </Button>
                  {:else}
                    <span class="current-badge">CURRENT</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </section>

      {:else if activeTab === 'NOTIFICATIONS' && notifications}
        <section class="settings-section">
          <div class="section-header">
            <h2>NOTIFICATION PREFERENCES</h2>
            <Text size="small" muted>CONFIGURE HOW YOU RECEIVE ALERTS</Text>
          </div>

          <div class="notification-channels">
            {#each Object.entries(notifications.channels) as [channel, settings]}
              <div class="channel-section">
                <h3>{channel.toUpperCase()}</h3>
                <div class="toggle-group">
                  <label class="toggle-item">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      on:change={e => {
                        const updated = { ...notifications.channels };
                        (updated as any)[channel].enabled = e.currentTarget.checked;
                        settingsStore.updateNotifications({ channels: updated });
                      }}
                    />
                    <span>{settings.enabled ? '●' : '○'} ENABLED</span>
                  </label>
                </div>

                {#if settings.enabled}
                  <div class="notification-types">
                    {#each Object.entries(settings) as [type, value]}
                      {#if type !== 'enabled'}
                        <label class="checkbox-label">
                          <input
                            type="checkbox"
                            checked={value}
                            on:change={e => {
                              const updated = { ...notifications.channels };
                              (updated as any)[channel][type] = e.currentTarget.checked;
                              settingsStore.updateNotifications({ channels: updated });
                            }}
                          />
                          {type.toUpperCase()}
                        </label>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Do Not Disturb -->
          <div class="subsection">
            <h3>DO NOT DISTURB</h3>
            <div class="dnd-settings">
              <label class="toggle-item">
                <input
                  type="checkbox"
                  checked={notifications.doNotDisturb.enabled}
                  on:change={e => {
                    const updated = { ...notifications.doNotDisturb, enabled: e.currentTarget.checked };
                    settingsStore.updateNotifications({ doNotDisturb: updated });
                  }}
                />
                <span>{notifications.doNotDisturb.enabled ? '●' : '○'} ENABLED</span>
              </label>

              {#if notifications.doNotDisturb.enabled}
                <div class="form-grid">
                  <div class="form-group">
                    <label for="dndStart">START TIME</label>
                    <input
                      id="dndStart"
                      type="time"
                      value={notifications.doNotDisturb.startTime}
                      on:change={e => {
                        const updated = { ...notifications.doNotDisturb, startTime: e.currentTarget.value };
                        settingsStore.updateNotifications({ doNotDisturb: updated });
                      }}
                    />
                  </div>
                  <div class="form-group">
                    <label for="dndEnd">END TIME</label>
                    <input
                      id="dndEnd"
                      type="time"
                      value={notifications.doNotDisturb.endTime}
                      on:change={e => {
                        const updated = { ...notifications.doNotDisturb, endTime: e.currentTarget.value };
                        settingsStore.updateNotifications({ doNotDisturb: updated });
                      }}
                    />
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </section>

      {:else if activeTab === 'PREFERENCES' && preferences}
        <section class="settings-section">
          <div class="section-header">
            <h2>USER PREFERENCES</h2>
            <Text size="small" muted>CUSTOMIZE YOUR EXPERIENCE</Text>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="theme">THEME</label>
              <select
                id="theme"
                value={preferences.theme}
                on:change={e => settingsStore.updatePreferences({ theme: e.currentTarget.value as any })}
              >
                <option value="DARK">DARK</option>
                <option value="LIGHT">LIGHT</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
            </div>

            <div class="form-group">
              <label for="language">LANGUAGE</label>
              <select
                id="language"
                value={preferences.language}
                on:change={e => settingsStore.updatePreferences({ language: e.currentTarget.value as any })}
              >
                <option value="EN">ENGLISH</option>
                <option value="KO">KOREAN</option>
                <option value="JA">JAPANESE</option>
                <option value="ZH">CHINESE</option>
              </select>
            </div>

            <div class="form-group">
              <label for="timezone">TIMEZONE</label>
              <select
                id="timezone"
                value={preferences.timezone}
                on:change={e => settingsStore.updatePreferences({ timezone: e.currentTarget.value as any })}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">NEW YORK</option>
                <option value="Europe/London">LONDON</option>
                <option value="Asia/Seoul">SEOUL</option>
                <option value="Asia/Tokyo">TOKYO</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dateFormat">DATE FORMAT</label>
              <select
                id="dateFormat"
                value={preferences.dateFormat}
                on:change={e => settingsStore.updatePreferences({ dateFormat: e.currentTarget.value as any })}
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>

            <div class="form-group">
              <label for="timeFormat">TIME FORMAT</label>
              <select
                id="timeFormat"
                value={preferences.timeFormat}
                on:change={e => settingsStore.updatePreferences({ timeFormat: e.currentTarget.value as any })}
              >
                <option value="24H">24 HOUR</option>
                <option value="12H">12 HOUR</option>
              </select>
            </div>

            <div class="form-group">
              <label for="firstDay">FIRST DAY OF WEEK</label>
              <select
                id="firstDay"
                value={preferences.firstDayOfWeek}
                on:change={e => settingsStore.updatePreferences({ firstDayOfWeek: e.currentTarget.value as any })}
              >
                <option value="MONDAY">MONDAY</option>
                <option value="SUNDAY">SUNDAY</option>
              </select>
            </div>

            <div class="form-group">
              <label for="numberFormat">NUMBER FORMAT</label>
              <select
                id="numberFormat"
                value={preferences.numberFormat}
                on:change={e => settingsStore.updatePreferences({ numberFormat: e.currentTarget.value as any })}
              >
                <option value="COMMA">1,000.00</option>
                <option value="PERIOD">1.000,00</option>
                <option value="SPACE">1 000.00</option>
              </select>
            </div>

            <div class="form-group">
              <label for="defaultView">DEFAULT VIEW</label>
              <select
                id="defaultView"
                value={preferences.defaultView}
                on:change={e => settingsStore.updatePreferences({ defaultView: e.currentTarget.value as any })}
              >
                <option value="DASHBOARD">DASHBOARD</option>
                <option value="PROJECTS">PROJECTS</option>
                <option value="BUILDS">BUILDS</option>
              </select>
            </div>
          </div>
        </section>

      {:else if activeTab === 'INTEGRATIONS' && integrations}
        <section class="settings-section">
          <div class="section-header">
            <h2>INTEGRATIONS</h2>
            <Text size="small" muted>CONNECT EXTERNAL SERVICES</Text>
          </div>

          <div class="integrations-grid">
            {#each Object.entries(integrations) as [service, config]}
              <div class="integration-card" class:enabled={config.enabled}>
                <div class="integration-header">
                  <h3>{service.toUpperCase()}</h3>
                  <span class="integration-status">
                    {config.enabled ? '● CONNECTED' : '○ DISCONNECTED'}
                  </span>
                </div>

                {#if config.enabled}
                  <div class="integration-info">
                    {#each Object.entries(config) as [key, value]}
                      {#if key !== 'enabled' && value}
                        <div class="info-item">
                          <span class="info-label">{key.toUpperCase()}</span>
                          <span class="info-value">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      {/if}
                    {/each}
                  </div>
                {/if}

                <div class="integration-actions">
                  {#if config.enabled}
                    <Button variant="outline" size="small">◧ CONFIGURE</Button>
                    <Button variant="text" size="small">✕ DISCONNECT</Button>
                  {:else}
                    <Button variant="primary" size="small">◊ CONNECT</Button>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </section>

      {:else if activeTab === 'DATA' && dataPrivacy}
        <section class="settings-section">
          <div class="section-header">
            <h2>DATA & PRIVACY</h2>
            <Text size="small" muted>MANAGE YOUR DATA AND PRIVACY SETTINGS</Text>
          </div>

          <!-- Data Retention -->
          <div class="subsection">
            <h3>DATA RETENTION</h3>
            <div class="retention-grid">
              {#each Object.entries(dataPrivacy.dataRetention) as [type, days]}
                <div class="retention-item">
                  <label for={`retention-${type}`}>
                    {type.toUpperCase()} (DAYS)
                  </label>
                  <input
                    id={`retention-${type}`}
                    type="number"
                    value={days}
                    on:change={e => {
                      const updated = { ...dataPrivacy.dataRetention };
                      (updated as any)[type] = parseInt(e.currentTarget.value);
                      settingsStore.updateDataPrivacy({ dataRetention: updated });
                    }}
                  />
                </div>
              {/each}
            </div>
          </div>

          <!-- Data Export -->
          <div class="subsection">
            <h3>DATA EXPORT</h3>
            <p class="subsection-description">
              DOWNLOAD YOUR DATA IN VARIOUS FORMATS
            </p>

            <div class="export-controls">
              <Button variant="outline" on:click={() => showExportDialog = true}>
                ◩ REQUEST DATA EXPORT
              </Button>
            </div>

            {#if showExportDialog}
              <div class="dialog-backdrop">
                <div class="dialog">
                  <h3>EXPORT DATA</h3>
                  <div class="form-group">
                    <label for="exportFormat">SELECT FORMAT</label>
                    <select id="exportFormat" bind:value={exportFormat}>
                      <option value="JSON">JSON</option>
                      <option value="CSV">CSV</option>
                      <option value="XML">XML</option>
                    </select>
                  </div>
                  <div class="dialog-actions">
                    <Button variant="primary" on:click={handleDataExport}>
                      ▶ EXPORT
                    </Button>
                    <Button variant="outline" on:click={() => showExportDialog = false}>
                      ✕ CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            {/if}

            <!-- Export History -->
            {#if dataPrivacy.exportHistory.length > 0}
              <div class="export-history">
                <h4>EXPORT HISTORY</h4>
                {#each dataPrivacy.exportHistory as exp}
                  <div class="export-item">
                    <div class="export-info">
                      <span class="export-format">{exp.format}</span>
                      <span class="export-date">{formatDate(exp.requestedAt)}</span>
                      <span class="export-status status-{exp.status.toLowerCase()}">
                        {exp.status}
                      </span>
                    </div>
                    {#if exp.downloadUrl}
                      <Button variant="text" size="small">
                        ↓ DOWNLOAD
                      </Button>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <!-- GDPR Settings -->
          <div class="subsection">
            <h3>PRIVACY SETTINGS</h3>
            <div class="privacy-settings">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={dataPrivacy.gdpr.dataProcessingAgreement}
                  on:change={e => {
                    const updated = { ...dataPrivacy.gdpr, dataProcessingAgreement: e.currentTarget.checked };
                    settingsStore.updateDataPrivacy({ gdpr: updated });
                  }}
                />
                DATA PROCESSING AGREEMENT
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={dataPrivacy.gdpr.marketingEmails}
                  on:change={e => {
                    const updated = { ...dataPrivacy.gdpr, marketingEmails: e.currentTarget.checked };
                    settingsStore.updateDataPrivacy({ gdpr: updated });
                  }}
                />
                MARKETING EMAILS
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={dataPrivacy.gdpr.analyticsTracking}
                  on:change={e => {
                    const updated = { ...dataPrivacy.gdpr, analyticsTracking: e.currentTarget.checked };
                    settingsStore.updateDataPrivacy({ gdpr: updated });
                  }}
                />
                ANALYTICS TRACKING
              </label>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="subsection danger-zone">
            <h3>DANGER ZONE</h3>
            <p class="danger-description">
              IRREVERSIBLE ACTIONS - PROCEED WITH CAUTION
            </p>
            <div class="danger-actions">
              <Button variant="outline" on:click={() => showDeleteAccountDialog = true}>
                ☠ DELETE ACCOUNT
              </Button>
            </div>

            {#if showDeleteAccountDialog}
              <div class="dialog-backdrop">
                <div class="dialog danger">
                  <h3>⚠ DELETE ACCOUNT</h3>
                  <p>
                    THIS ACTION CANNOT BE UNDONE. ALL YOUR DATA WILL BE PERMANENTLY DELETED.
                  </p>
                  <div class="dialog-actions">
                    <Button variant="primary" on:click={handleDeleteAccount}>
                      ☠ DELETE MY ACCOUNT
                    </Button>
                    <Button variant="outline" on:click={() => showDeleteAccountDialog = false}>
                      ✕ CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </section>
      {/if}
    </main>
  </div>
</div>

<style>
  .settings-page {
    min-height: 100vh;
    background: var(--bg);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6) var(--space-8);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .settings-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: calc(100vh - 120px);
  }

  /* Sidebar Navigation */
  .settings-sidebar {
    border-right: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
  }

  .settings-nav {
    padding: var(--space-4) 0;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: transparent;
    border: none;
    border-left: 4px solid transparent;
    color: var(--fg);
    font-family: var(--font-mono);
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    transition: var(--transition-base);
  }

  .nav-item:hover {
    background: var(--surface-2);
  }

  .nav-item.active {
    background: var(--fg);
    color: var(--bg);
    border-left-color: var(--fg);
  }

  .nav-icon {
    width: 20px;
    text-align: center;
    font-size: var(--text-16);
  }

  .nav-label {
    flex: 1;
  }

  .nav-arrow {
    font-size: var(--text-10);
  }

  /* Content Area */
  .settings-content {
    padding: var(--space-6);
    overflow-y: auto;
  }

  .settings-section {
    max-width: 1000px;
  }

  .section-header {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .section-header h2 {
    font-size: var(--text-20);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    margin: 0 0 var(--space-2) 0;
  }

  /* Form Styles */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: var(--space-3);
    background: var(--bg);
    border: var(--border-width) solid var(--border-color);
    color: var(--fg);
    font-family: var(--font-mono);
    font-size: var(--text-13);
  }

  .form-group input[readonly] {
    background: var(--surface-1);
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-group select {
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }

  /* Subsections */
  .subsection {
    padding: var(--space-6) 0;
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .subsection:last-child {
    border-bottom: none;
  }

  .subsection h3 {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .subsection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .subsection-description {
    color: var(--muted);
    font-size: var(--text-13);
    margin-bottom: var(--space-4);
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .info-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--muted);
  }

  .info-value {
    font-size: var(--text-14);
    font-family: var(--font-mono);
  }

  /* Password Form */
  .password-form {
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
    margin-top: var(--space-4);
  }

  /* API Keys */
  .api-key-form {
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .api-keys-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .api-key-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
  }

  .api-key-info {
    flex: 1;
  }

  .api-key-name {
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .api-key-value {
    font-family: var(--font-mono);
    font-size: var(--text-12);
    color: var(--muted);
    margin-bottom: var(--space-1);
  }

  .api-key-meta {
    font-size: var(--text-11);
    color: var(--muted);
  }

  /* Sessions */
  .sessions-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .session-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
  }

  .session-item.current {
    border-color: var(--fg);
  }

  .session-info {
    flex: 1;
  }

  .session-device {
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .session-details {
    font-size: var(--text-12);
    color: var(--muted);
    margin-bottom: var(--space-1);
  }

  .session-time {
    font-size: var(--text-11);
    color: var(--muted);
  }

  .current-badge {
    padding: var(--space-1) var(--space-2);
    background: var(--fg);
    color: var(--bg);
    font-size: var(--text-10);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  /* Checkbox Group */
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-13);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  /* Toggle Group */
  .toggle-group {
    margin-bottom: var(--space-4);
  }

  .toggle-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-13);
    font-weight: var(--weight-semibold);
    cursor: pointer;
  }

  /* Notification Channels */
  .notification-channels {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .channel-section {
    padding: var(--space-4);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
  }

  .channel-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-3) 0;
  }

  .notification-types {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  /* DND Settings */
  .dnd-settings {
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
  }

  /* Integrations */
  .integrations-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .integration-card {
    padding: var(--space-4);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
  }

  .integration-card.enabled {
    border-color: var(--fg);
  }

  .integration-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .integration-header h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .integration-status {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
  }

  .integration-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
    padding-top: var(--space-3);
    border-top: var(--border-width) solid var(--border-color);
  }

  .integration-actions {
    display: flex;
    gap: var(--space-2);
  }

  /* Data Retention */
  .retention-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .retention-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .retention-item label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .retention-item input {
    padding: var(--space-3);
    background: var(--bg);
    border: var(--border-width) solid var(--border-color);
    color: var(--fg);
    font-family: var(--font-mono);
    font-size: var(--text-13);
  }

  /* Export Controls */
  .export-controls {
    margin-bottom: var(--space-4);
  }

  .export-history {
    margin-top: var(--space-4);
  }

  .export-history h4 {
    font-size: var(--text-13);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-3) 0;
  }

  .export-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
    margin-bottom: var(--space-2);
  }

  .export-info {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .export-format {
    font-weight: var(--weight-semibold);
  }

  .export-date {
    font-size: var(--text-12);
    color: var(--muted);
  }

  .export-status {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .export-status.status-completed {
    color: var(--fg);
  }

  .export-status.status-pending,
  .export-status.status-processing {
    color: var(--muted);
  }

  .export-status.status-failed {
    text-decoration: line-through;
  }

  /* Privacy Settings */
  .privacy-settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  /* Danger Zone */
  .danger-zone {
    background: var(--bg);
    border: 2px solid var(--fg);
    padding: var(--space-4);
  }

  .danger-description {
    font-size: var(--text-13);
    color: var(--muted);
    margin-bottom: var(--space-4);
  }

  .danger-actions {
    display: flex;
    gap: var(--space-3);
  }

  /* Dialog */
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background: var(--bg);
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    max-width: 500px;
    width: 100%;
  }

  .dialog.danger {
    border-color: var(--fg);
    border-width: 2px;
  }

  .dialog h3 {
    font-size: var(--text-18);
    font-weight: var(--weight-semibold);
    margin: 0 0 var(--space-4) 0;
  }

  .dialog p {
    font-size: var(--text-13);
    margin-bottom: var(--space-4);
  }

  .dialog-actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: var(--border-width) solid var(--border-color);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .settings-layout {
      grid-template-columns: 200px 1fr;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .integrations-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .settings-layout {
      grid-template-columns: 1fr;
    }

    .settings-sidebar {
      border-right: none;
      border-bottom: var(--border-width) solid var(--border-color);
    }

    .settings-nav {
      display: flex;
      overflow-x: auto;
      padding: 0;
    }

    .nav-item {
      white-space: nowrap;
    }
  }
</style>