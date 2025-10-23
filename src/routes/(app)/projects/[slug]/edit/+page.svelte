<script lang="ts">
  /**
   * Project Configuration Page
   * Edit and manage project settings
   */

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { projectsStore } from '$lib/stores/projectsStore';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import type { Project } from '$lib/types';

  let project: Project | null = null;
  let hasUnsavedChanges = false;

  // Form data
  let formData = {
    name: '',
    description: '',
    category: '',
    visibility: 'public' as 'public' | 'private',
    license: '',
    repository: {
      url: '',
      defaultBranch: '',
    },
    buildSettings: {
      buildCommand: '',
      testCommand: '',
      installCommand: '',
      outputDirectory: '',
    },
    deploymentSettings: {
      autoDeployBranch: '',
      environment: 'production' as 'development' | 'staging' | 'production' | 'testing',
      deployCommand: '',
    },
    notifications: {
      email: true,
      slack: false,
      onSuccess: false,
      onFailure: true,
      recipients: [] as string[],
    },
    advanced: {
      enableAutoMerge: false,
      requireStatusChecks: true,
      enableDependabot: false,
      privateModules: false,
    }
  };

  let activeSection = 'general';
  let showDiscardDialog = false;
  let showDeleteDialog = false;
  let deleteConfirmText = '';

  $: slug = $page.params.slug;
  $: sections = [
    { id: 'general', label: 'GENERAL', icon: '■' },
    { id: 'repository', label: 'REPOSITORY', icon: '⊢' },
    { id: 'build', label: 'BUILD', icon: '▣' },
    { id: 'deployment', label: 'DEPLOYMENT', icon: '→' },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: '◆' },
    { id: 'advanced', label: 'ADVANCED', icon: '◘' },
    { id: 'danger', label: 'DANGER ZONE', icon: '✕' }
  ];

  function markAsChanged() {
    hasUnsavedChanges = true;
  }

  function handleSave() {
    if (!project) return;

    console.log('Saving project configuration:', formData);
    alert('PROJECT CONFIGURATION SAVED');
    hasUnsavedChanges = false;

    // TODO: Update projectsStore with new data
  }

  function handleCancel() {
    if (hasUnsavedChanges) {
      showDiscardDialog = true;
    } else {
      goto(`/projects/${slug}`);
    }
  }

  function discardChanges() {
    showDiscardDialog = false;
    hasUnsavedChanges = false;
    goto(`/projects/${slug}`);
  }

  function openDeleteDialog() {
    showDeleteDialog = true;
    deleteConfirmText = '';
  }

  function closeDeleteDialog() {
    showDeleteDialog = false;
    deleteConfirmText = '';
  }

  function deleteProject() {
    if (!project || deleteConfirmText !== project.name) {
      alert('PROJECT NAME DOES NOT MATCH');
      return;
    }

    console.log('Deleting project:', project.id);
    alert(`PROJECT DELETED: ${project.name}`);
    closeDeleteDialog();
    goto('/projects');
  }

  function addRecipient() {
    const email = prompt('ENTER EMAIL ADDRESS:');
    if (email && email.includes('@')) {
      formData.notifications.recipients = [...formData.notifications.recipients, email];
      markAsChanged();
    }
  }

  function removeRecipient(email: string) {
    formData.notifications.recipients = formData.notifications.recipients.filter(e => e !== email);
    markAsChanged();
  }

  onMount(async () => {
    await projectsStore.loadProjects();
    const projects = $projectsStore.projects;
    project = projects.find((p) => p.slug === slug) || null;

    if (!project) {
      goto('/projects');
      return;
    }

    // Initialize form data
    formData = {
      name: project.name,
      description: project.description,
      category: project.category,
      visibility: project.visibility,
      license: project.license || '',
      repository: {
        url: project.repository.url,
        defaultBranch: project.repository.defaultBranch,
      },
      buildSettings: {
        buildCommand: 'npm run build',
        testCommand: 'npm test',
        installCommand: 'npm install',
        outputDirectory: 'dist',
      },
      deploymentSettings: {
        autoDeployBranch: 'main',
        environment: 'production',
        deployCommand: 'npm run deploy',
      },
      notifications: {
        email: true,
        slack: false,
        onSuccess: false,
        onFailure: true,
        recipients: ['dev-team@example.com'],
      },
      advanced: {
        enableAutoMerge: false,
        requireStatusChecks: true,
        enableDependabot: false,
        privateModules: false,
      }
    };
  });
</script>

<svelte:window on:beforeunload={(e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
}} />

{#if project}
  <div class="config-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <Button variant="text" on:click={handleCancel}>
            ← {project.name.toUpperCase()}
          </Button>
          <Heading level={1}>PROJECT CONFIGURATION</Heading>
          {#if hasUnsavedChanges}
            <span class="unsaved-badge">● UNSAVED CHANGES</span>
          {/if}
        </div>
        <div class="header-actions">
          <Button variant="outline" on:click={handleCancel}>CANCEL</Button>
          <Button variant="primary" on:click={handleSave} disabled={!hasUnsavedChanges}>
            SAVE CHANGES
          </Button>
        </div>
      </div>
    </div>

    <div class="config-layout">
      <!-- Navigation Sidebar -->
      <div class="config-sidebar">
        <div class="sidebar-nav">
          {#each sections as section}
            <button
              class="nav-item"
              class:active={activeSection === section.id}
              class:danger={section.id === 'danger'}
              on:click={() => activeSection = section.id}
            >
              <span class="nav-icon">{section.icon}</span>
              <span class="nav-label">{section.label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Configuration Content -->
      <div class="config-content">
        {#if activeSection === 'general'}
          <div class="config-section">
            <div class="section-header">
              <h2>GENERAL SETTINGS</h2>
              <p>Basic information about your project</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label for="project-name">PROJECT NAME</label>
                <p class="field-hint">The display name for your project</p>
                <input
                  id="project-name"
                  type="text"
                  class="input"
                  bind:value={formData.name}
                  on:input={markAsChanged}
                  placeholder="My Awesome Project"
                />
              </div>

              <div class="form-group full-width">
                <label for="project-desc">DESCRIPTION</label>
                <p class="field-hint">A brief description of what this project does</p>
                <textarea
                  id="project-desc"
                  class="input"
                  bind:value={formData.description}
                  on:input={markAsChanged}
                  rows="4"
                  placeholder="This project..."
                ></textarea>
              </div>

              <div class="form-group">
                <label for="project-category">CATEGORY</label>
                <p class="field-hint">Project category for organization</p>
                <select
                  id="project-category"
                  class="input"
                  bind:value={formData.category}
                  on:change={markAsChanged}
                >
                  <option value="crop-management">CROP MANAGEMENT</option>
                  <option value="soil-analysis">SOIL ANALYSIS</option>
                  <option value="irrigation">IRRIGATION</option>
                  <option value="pest-control">PEST CONTROL</option>
                  <option value="harvest-optimization">HARVEST OPTIMIZATION</option>
                  <option value="supply-chain">SUPPLY CHAIN</option>
                  <option value="farm-analytics">FARM ANALYTICS</option>
                  <option value="weather-monitoring">WEATHER MONITORING</option>
                  <option value="livestock">LIVESTOCK</option>
                  <option value="market-analysis">MARKET ANALYSIS</option>
                </select>
              </div>

              <div class="form-group">
                <label for="project-visibility">VISIBILITY</label>
                <p class="field-hint">Control who can see this project</p>
                <select
                  id="project-visibility"
                  class="input"
                  bind:value={formData.visibility}
                  on:change={markAsChanged}
                >
                  <option value="public">PUBLIC - ANYONE CAN VIEW</option>
                  <option value="private">PRIVATE - TEAM ONLY</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="project-license">LICENSE</label>
                <p class="field-hint">Open source license (optional)</p>
                <select
                  id="project-license"
                  class="input"
                  bind:value={formData.license}
                  on:change={markAsChanged}
                >
                  <option value="">NONE</option>
                  <option value="MIT">MIT LICENSE</option>
                  <option value="Apache-2.0">APACHE LICENSE 2.0</option>
                  <option value="GPL-3.0">GNU GPL V3</option>
                  <option value="BSD-3-Clause">BSD 3-CLAUSE</option>
                  <option value="ISC">ISC LICENSE</option>
                </select>
              </div>
            </div>
          </div>
        {/if}

        {#if activeSection === 'repository'}
          <div class="config-section">
            <div class="section-header">
              <h2>REPOSITORY SETTINGS</h2>
              <p>Version control and repository configuration</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label for="repo-url">REPOSITORY URL</label>
                <p class="field-hint">Git repository URL (HTTPS or SSH)</p>
                <input
                  id="repo-url"
                  type="text"
                  class="input mono"
                  bind:value={formData.repository.url}
                  on:input={markAsChanged}
                  placeholder="https://github.com/username/repo.git"
                />
              </div>

              <div class="form-group">
                <label for="default-branch">DEFAULT BRANCH</label>
                <p class="field-hint">Primary branch for deployments</p>
                <input
                  id="default-branch"
                  type="text"
                  class="input mono"
                  bind:value={formData.repository.defaultBranch}
                  on:input={markAsChanged}
                  placeholder="main"
                />
              </div>

              <div class="form-group">
                <label>GIT PROVIDER</label>
                <p class="field-hint">Source code hosting service</p>
                <div class="provider-info">
                  <span class="provider-icon">⊢</span>
                  <span class="provider-name">GITHUB</span>
                </div>
              </div>

              <div class="form-group full-width">
                <label>BRANCH PROTECTION</label>
                <p class="field-hint">Configure protection rules for important branches</p>
                <div class="checkbox-list">
                  <label class="checkbox-label">
                    <input type="checkbox" checked disabled />
                    <span>REQUIRE PULL REQUEST BEFORE MERGING</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" checked disabled />
                    <span>REQUIRE STATUS CHECKS TO PASS</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" disabled />
                    <span>REQUIRE SIGNED COMMITS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if activeSection === 'build'}
          <div class="config-section">
            <div class="section-header">
              <h2>BUILD SETTINGS</h2>
              <p>Configure how your project is built and tested</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label for="install-cmd">INSTALL COMMAND</label>
                <p class="field-hint">Command to install dependencies</p>
                <input
                  id="install-cmd"
                  type="text"
                  class="input mono"
                  bind:value={formData.buildSettings.installCommand}
                  on:input={markAsChanged}
                  placeholder="npm install"
                />
              </div>

              <div class="form-group full-width">
                <label for="build-cmd">BUILD COMMAND</label>
                <p class="field-hint">Command to build your project</p>
                <input
                  id="build-cmd"
                  type="text"
                  class="input mono"
                  bind:value={formData.buildSettings.buildCommand}
                  on:input={markAsChanged}
                  placeholder="npm run build"
                />
              </div>

              <div class="form-group full-width">
                <label for="test-cmd">TEST COMMAND</label>
                <p class="field-hint">Command to run tests</p>
                <input
                  id="test-cmd"
                  type="text"
                  class="input mono"
                  bind:value={formData.buildSettings.testCommand}
                  on:input={markAsChanged}
                  placeholder="npm test"
                />
              </div>

              <div class="form-group full-width">
                <label for="output-dir">OUTPUT DIRECTORY</label>
                <p class="field-hint">Directory where build artifacts are generated</p>
                <input
                  id="output-dir"
                  type="text"
                  class="input mono"
                  bind:value={formData.buildSettings.outputDirectory}
                  on:input={markAsChanged}
                  placeholder="dist"
                />
              </div>

              <div class="form-group full-width">
                <label>BUILD ENVIRONMENT</label>
                <p class="field-hint">Environment variables for build process</p>
                <div class="env-note">
                  <span class="note-icon">◆</span>
                  <span>ENVIRONMENT VARIABLES CAN BE MANAGED IN THE PROJECT SETTINGS TAB</span>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if activeSection === 'deployment'}
          <div class="config-section">
            <div class="section-header">
              <h2>DEPLOYMENT SETTINGS</h2>
              <p>Configure automatic deployments and environments</p>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="deploy-branch">AUTO-DEPLOY BRANCH</label>
                <p class="field-hint">Branch that triggers automatic deployments</p>
                <input
                  id="deploy-branch"
                  type="text"
                  class="input mono"
                  bind:value={formData.deploymentSettings.autoDeployBranch}
                  on:input={markAsChanged}
                  placeholder="main"
                />
              </div>

              <div class="form-group">
                <label for="deploy-env">DEPLOYMENT ENVIRONMENT</label>
                <p class="field-hint">Target environment for deployments</p>
                <select
                  id="deploy-env"
                  class="input"
                  bind:value={formData.deploymentSettings.environment}
                  on:change={markAsChanged}
                >
                  <option value="development">DEVELOPMENT</option>
                  <option value="staging">STAGING</option>
                  <option value="production">PRODUCTION</option>
                  <option value="testing">TESTING</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="deploy-cmd">DEPLOYMENT COMMAND</label>
                <p class="field-hint">Command to deploy your application</p>
                <input
                  id="deploy-cmd"
                  type="text"
                  class="input mono"
                  bind:value={formData.deploymentSettings.deployCommand}
                  on:input={markAsChanged}
                  placeholder="npm run deploy"
                />
              </div>

              <div class="form-group full-width">
                <label>DEPLOYMENT OPTIONS</label>
                <div class="checkbox-list">
                  <label class="checkbox-label">
                    <input type="checkbox" checked disabled />
                    <span>AUTOMATIC DEPLOYMENTS ON PUSH</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" disabled />
                    <span>PREVIEW DEPLOYMENTS FOR PULL REQUESTS</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" checked disabled />
                    <span>ROLLBACK ON FAILURE</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if activeSection === 'notifications'}
          <div class="config-section">
            <div class="section-header">
              <h2>NOTIFICATION SETTINGS</h2>
              <p>Manage how and when you receive notifications</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label>NOTIFICATION CHANNELS</label>
                <p class="field-hint">Select how you want to receive notifications</p>
                <div class="checkbox-list">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.notifications.email}
                      on:change={markAsChanged}
                    />
                    <span>EMAIL NOTIFICATIONS</span>
                  </label>
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.notifications.slack}
                      on:change={markAsChanged}
                    />
                    <span>SLACK NOTIFICATIONS</span>
                  </label>
                </div>
              </div>

              <div class="form-group full-width">
                <label>NOTIFICATION TRIGGERS</label>
                <p class="field-hint">Choose which events trigger notifications</p>
                <div class="checkbox-list">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.notifications.onSuccess}
                      on:change={markAsChanged}
                    />
                    <span>SUCCESSFUL BUILDS</span>
                  </label>
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.notifications.onFailure}
                      on:change={markAsChanged}
                    />
                    <span>FAILED BUILDS</span>
                  </label>
                </div>
              </div>

              <div class="form-group full-width">
                <label>RECIPIENTS</label>
                <p class="field-hint">Email addresses to receive notifications</p>
                <div class="recipients-list">
                  {#each formData.notifications.recipients as email}
                    <div class="recipient-item">
                      <span class="recipient-email mono">{email}</span>
                      <button
                        class="btn-icon-small"
                        on:click={() => removeRecipient(email)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  {/each}
                </div>
                <button class="btn-secondary small" on:click={addRecipient}>
                  + ADD RECIPIENT
                </button>
              </div>
            </div>
          </div>
        {/if}

        {#if activeSection === 'advanced'}
          <div class="config-section">
            <div class="section-header">
              <h2>ADVANCED SETTINGS</h2>
              <p>Advanced configuration options for power users</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label>AUTOMATION</label>
                <p class="field-hint">Automated workflows and integrations</p>
                <div class="checkbox-list">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.advanced.enableAutoMerge}
                      on:change={markAsChanged}
                    />
                    <span>ENABLE AUTO-MERGE FOR PULL REQUESTS</span>
                  </label>
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.advanced.requireStatusChecks}
                      on:change={markAsChanged}
                    />
                    <span>REQUIRE STATUS CHECKS BEFORE MERGE</span>
                  </label>
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.advanced.enableDependabot}
                      on:change={markAsChanged}
                    />
                    <span>ENABLE DEPENDABOT FOR DEPENDENCY UPDATES</span>
                  </label>
                </div>
              </div>

              <div class="form-group full-width">
                <label>SECURITY</label>
                <p class="field-hint">Security and access control settings</p>
                <div class="checkbox-list">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      bind:checked={formData.advanced.privateModules}
                      on:change={markAsChanged}
                    />
                    <span>ALLOW PRIVATE NPM MODULES</span>
                  </label>
                </div>
              </div>

              <div class="form-group full-width">
                <label>PROJECT METADATA</label>
                <p class="field-hint">Read-only project information</p>
                <div class="metadata-grid">
                  <div class="metadata-item">
                    <span class="metadata-label">PROJECT ID:</span>
                    <span class="metadata-value mono">{project.id}</span>
                  </div>
                  <div class="metadata-item">
                    <span class="metadata-label">SLUG:</span>
                    <span class="metadata-value mono">{project.slug}</span>
                  </div>
                  <div class="metadata-item">
                    <span class="metadata-label">CREATED:</span>
                    <span class="metadata-value">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div class="metadata-item">
                    <span class="metadata-label">LAST UPDATED:</span>
                    <span class="metadata-value">{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if activeSection === 'danger'}
          <div class="config-section danger">
            <div class="section-header">
              <h2>DANGER ZONE</h2>
              <p>Irreversible and destructive actions</p>
            </div>

            <div class="danger-actions">
              <div class="danger-action-card">
                <div class="danger-action-info">
                  <h3>TRANSFER PROJECT OWNERSHIP</h3>
                  <p>Transfer this project to another user or organization</p>
                </div>
                <button class="btn-danger-outline">TRANSFER</button>
              </div>

              <div class="danger-action-card">
                <div class="danger-action-info">
                  <h3>ARCHIVE PROJECT</h3>
                  <p>Make this project read-only. Can be undone later.</p>
                </div>
                <button class="btn-danger-outline">ARCHIVE</button>
              </div>

              <div class="danger-action-card">
                <div class="danger-action-info">
                  <h3>DELETE PROJECT</h3>
                  <p>Permanently delete this project. This action cannot be undone.</p>
                </div>
                <button class="btn-danger" on:click={openDeleteDialog}>DELETE PROJECT</button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Discard Changes Dialog -->
  {#if showDiscardDialog}
    <div class="dialog-overlay" on:click={() => showDiscardDialog = false}>
      <div class="dialog" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>DISCARD UNSAVED CHANGES?</h2>
          <button class="close-btn" on:click={() => showDiscardDialog = false}>✕</button>
        </div>
        <div class="dialog-body">
          <p>You have unsaved changes. Are you sure you want to discard them?</p>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={() => showDiscardDialog = false}>CANCEL</button>
          <button class="btn-danger" on:click={discardChanges}>DISCARD CHANGES</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Delete Project Dialog -->
  {#if showDeleteDialog}
    <div class="dialog-overlay" on:click={closeDeleteDialog}>
      <div class="dialog danger" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>DELETE PROJECT</h2>
          <button class="close-btn" on:click={closeDeleteDialog}>✕</button>
        </div>
        <div class="dialog-body">
          <div class="warning-box danger">
            <div class="warning-icon">✕</div>
            <div class="warning-content">
              <h3>PERMANENT DELETION</h3>
              <p>This action CANNOT be undone. This will permanently delete:</p>
              <ul>
                <li>All source code and commit history</li>
                <li>All builds and deployment history</li>
                <li>All settings and configurations</li>
                <li>All associated data and artifacts</li>
              </ul>
            </div>
          </div>
          <div class="final-confirm">
            <p>Type the project name <strong>{project.name}</strong> to confirm deletion:</p>
            <input
              type="text"
              class="input confirm-input"
              bind:value={deleteConfirmText}
              placeholder="Enter project name"
            />
            {#if deleteConfirmText && deleteConfirmText !== project.name}
              <p class="error-text">PROJECT NAME DOES NOT MATCH</p>
            {/if}
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={closeDeleteDialog}>CANCEL</button>
          <button
            class="btn-danger"
            on:click={deleteProject}
            disabled={deleteConfirmText !== project.name}
          >
            DELETE PROJECT
          </button>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .config-page {
    min-height: 100vh;
    background: var(--bg);
  }

  .page-header {
    border-bottom: var(--border-width) solid var(--border-color);
    padding: var(--space-6) var(--space-8);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .unsaved-badge {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    border: var(--border-width) solid var(--fg);
    background: var(--fg);
    color: var(--bg);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .header-actions {
    display: flex;
    gap: var(--space-3);
  }

  /* Layout */
  .config-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: calc(100vh - 120px);
  }

  /* Sidebar */
  .config-sidebar {
    border-right: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
    position: sticky;
    top: 120px;
    height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: var(--space-4) 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-6);
    border: none;
    border-left: 3px solid transparent;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--fg);
    cursor: pointer;
    transition: var(--transition-base);
    text-align: left;
  }

  .nav-item:hover {
    background: var(--surface-2);
  }

  .nav-item.active {
    background: var(--bg);
    border-left-color: var(--fg);
  }

  .nav-item.danger {
    color: var(--fg);
  }

  .nav-icon {
    font-size: var(--text-16);
  }

  /* Content */
  .config-content {
    padding: var(--space-8);
    max-width: 1000px;
  }

  .config-section {
    margin-bottom: var(--space-8);
  }

  .config-section.danger {
    border: 2px dashed var(--fg);
    padding: var(--space-6);
  }

  .section-header {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .section-header h2 {
    font-size: var(--text-18);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-2) 0;
  }

  .section-header p {
    font-size: var(--text-14);
    color: var(--muted);
    margin: 0;
  }

  /* Form Grid */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
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
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .field-hint {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .input {
    width: 100%;
    padding: var(--space-3);
    border: var(--border-width) solid var(--fg);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-14);
    color: var(--fg);
    outline: none;
    transition: var(--transition-base);
  }

  .input:focus {
    border-width: 2px;
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
  }

  textarea.input {
    resize: vertical;
    min-height: 100px;
  }

  /* Checkboxes */
  .checkbox-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-12);
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    cursor: pointer;
  }

  /* Provider Info */
  .provider-info {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
  }

  .provider-icon {
    font-size: var(--text-16);
  }

  .provider-name {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  /* Note */
  .env-note {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
    font-size: var(--text-11);
    letter-spacing: var(--tracking-wide);
  }

  .note-icon {
    font-size: var(--text-14);
  }

  /* Recipients */
  .recipients-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .recipient-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
  }

  .recipient-email {
    font-size: var(--text-12);
  }

  .btn-icon-small {
    padding: var(--space-1);
    border: var(--border-width) solid var(--fg);
    background: var(--bg);
    cursor: pointer;
    font-size: var(--text-12);
    transition: var(--transition-base);
    font-family: inherit;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-icon-small:hover {
    background: var(--fg);
    color: var(--bg);
  }

  /* Metadata */
  .metadata-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .metadata-item {
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .metadata-label {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
  }

  .metadata-value {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
  }

  /* Danger Zone */
  .danger-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .danger-action-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
  }

  .danger-action-info h3 {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-1) 0;
  }

  .danger-action-info p {
    font-size: var(--text-12);
    color: var(--muted);
    margin: 0;
  }

  /* Buttons */
  .btn-secondary,
  .btn-danger,
  .btn-danger-outline {
    padding: var(--space-2) var(--space-4);
    border: var(--border-width) solid var(--fg);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    transition: var(--transition-base);
  }

  .btn-secondary.small {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-11);
  }

  .btn-secondary:hover {
    background: var(--surface-1);
  }

  .btn-danger {
    background: var(--fg);
    color: var(--bg);
  }

  .btn-danger:hover {
    opacity: 0.9;
  }

  .btn-danger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-danger-outline {
    border-style: dashed;
  }

  .btn-danger-outline:hover {
    background: var(--fg);
    color: var(--bg);
  }

  /* Dialog */
  .dialog-overlay {
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
    backdrop-filter: blur(4px);
  }

  .dialog {
    background: var(--bg);
    border: var(--border-width) solid var(--fg);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
  }

  .dialog.danger {
    border-width: 2px;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--border-width) solid var(--fg);
    background: var(--fg);
    color: var(--bg);
  }

  .dialog-header h2 {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--bg);
    font-size: var(--text-20);
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-base);
  }

  .close-btn:hover {
    opacity: 0.7;
  }

  .dialog-body {
    padding: var(--space-6);
  }

  .dialog-body p {
    font-size: var(--text-14);
    line-height: var(--leading-relaxed);
    margin: 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-6);
    border-top: var(--border-width) solid var(--border-color);
  }

  .warning-box {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4);
    border: var(--border-width) solid var(--fg);
    background: var(--surface-1);
    margin-bottom: var(--space-4);
  }

  .warning-box.danger {
    border-style: dashed;
    border-width: 2px;
  }

  .warning-icon {
    font-size: var(--text-32);
    line-height: 1;
  }

  .warning-content h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-2) 0;
  }

  .warning-content p {
    font-size: var(--text-14);
    margin: 0 0 var(--space-2) 0;
  }

  .warning-content ul {
    margin: 0;
    padding-left: var(--space-5);
  }

  .warning-content li {
    font-size: var(--text-14);
    margin: var(--space-1) 0;
  }

  .final-confirm {
    text-align: center;
  }

  .final-confirm p {
    font-size: var(--text-14);
    margin-bottom: var(--space-4);
  }

  .confirm-input {
    text-align: center;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  .error-text {
    color: var(--fg);
    font-size: var(--text-12);
    margin-top: var(--space-2);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  /* Utilities */
  .mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .config-layout {
      grid-template-columns: 1fr;
    }

    .config-sidebar {
      position: static;
      height: auto;
      border-right: none;
      border-bottom: var(--border-width) solid var(--border-color);
    }

    .sidebar-nav {
      flex-direction: row;
      overflow-x: auto;
      padding: var(--space-2) var(--space-4);
    }

    .nav-item {
      border-left: none;
      border-bottom: 3px solid transparent;
      padding: var(--space-2) var(--space-4);
      white-space: nowrap;
    }

    .nav-item.active {
      border-left: none;
      border-bottom-color: var(--fg);
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-group {
      grid-column: 1;
    }
  }
</style>
