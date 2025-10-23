<script lang="ts">
  /**
   * Project Detail Page
   * Shows project information, builds, and statistics
   */

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { projectsStore } from '$lib/stores/projectsStore';
  import { buildsStore } from '$lib/stores/buildsStore';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import type { Project, Build } from '$lib/types';

  let project: Project | null = null;
  let builds: Build[] = [];
  let activeTab: 'overview' | 'builds' | 'statistics' | 'settings' = 'overview';

  // Dialog states
  let showTriggerBuildDialog = false;
  let showArchiveDialog = false;
  let showDeleteDialog = false;
  let deleteStep = 1;
  let deleteConfirmText = '';

  // Trigger build options
  let selectedBranch = 'main';
  let selectedEnvironment = 'development';
  let cleanBuild = false;
  let skipTests = false;

  // Project starred state
  let isStarred = false;

  $: slug = $page.params.slug;
  $: if (project) {
    selectedBranch = project.repository.defaultBranch;
    isStarred = false; // TODO: Get from user preferences
  }

  function getStatusIndicator(status: string) {
    switch (status) {
      case 'success':
        return '■';
      case 'failed':
        return '□';
      case 'running':
        return '▣';
      case 'pending':
        return '▢';
      default:
        return '○';
    }
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatTime(date: Date | string) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDuration(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  function getRelativeTime(date: Date | string) {
    const now = new Date().getTime();
    const then = new Date(date).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  }

  // Recent commits mock data
  $: recentCommits = builds.slice(0, 5).map(build => ({
    sha: build.commit.sha,
    message: build.commit.message,
    author: build.commit.author,
    timestamp: build.commit.timestamp,
    branch: build.branch
  }));

  // Calculate actual statistics from builds
  $: buildStats = calculateBuildStats(builds);

  function calculateBuildStats(builds: Build[]) {
    const now = new Date();
    const last7Days = builds.filter(b => {
      const diff = now.getTime() - new Date(b.startedAt).getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    });

    const last30Days = builds.filter(b => {
      const diff = now.getTime() - new Date(b.startedAt).getTime();
      return diff < 30 * 24 * 60 * 60 * 1000;
    });

    const successLast7 = last7Days.filter(b => b.status === 'success').length;
    const successLast30 = last30Days.filter(b => b.status === 'success').length;

    const avgDuration = builds.reduce((acc, b) => acc + (b.duration || 0), 0) / (builds.length || 1);

    return {
      successRate7Days: last7Days.length ? (successLast7 / last7Days.length * 100).toFixed(1) : 0,
      successRate30Days: last30Days.length ? (successLast30 / last30Days.length * 100).toFixed(1) : 0,
      avgDuration: Math.floor(avgDuration / 1000),
      totalBuilds: builds.length,
      buildsThisWeek: last7Days.length,
      buildsThisMonth: last30Days.length,
      dailyData: generateDailyData(last7Days)
    };
  }

  function generateDailyData(builds: Build[]) {
    const days = 7;
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayBuilds = builds.filter(b => {
        const buildDate = new Date(b.startedAt);
        buildDate.setHours(0, 0, 0, 0);
        return buildDate.getTime() === date.getTime();
      });

      const success = dayBuilds.filter(b => b.status === 'success').length;
      const rate = dayBuilds.length ? (success / dayBuilds.length * 100) : 0;

      data.push(Math.round(rate));
    }

    return data;
  }

  // Dialog handlers
  function openTriggerBuildDialog() {
    showTriggerBuildDialog = true;
  }

  function closeTriggerBuildDialog() {
    showTriggerBuildDialog = false;
    cleanBuild = false;
    skipTests = false;
  }

  async function triggerBuild() {
    if (!project) return;

    console.log('Triggering build:', {
      projectId: project.id,
      branch: selectedBranch,
      environment: selectedEnvironment,
      cleanBuild,
      skipTests
    });

    // TODO: Implement actual build trigger via buildsStore
    alert(`BUILD TRIGGERED\nBranch: ${selectedBranch}\nEnvironment: ${selectedEnvironment.toUpperCase()}`);
    closeTriggerBuildDialog();
  }

  function openArchiveDialog() {
    showArchiveDialog = true;
  }

  function closeArchiveDialog() {
    showArchiveDialog = false;
  }

  async function archiveProject() {
    if (!project) return;

    // TODO: Implement actual archive via projectsStore
    console.log('Archiving project:', project.id);
    alert(`PROJECT ARCHIVED: ${project.name}`);
    closeArchiveDialog();
    goto('/projects');
  }

  function openDeleteDialog() {
    showDeleteDialog = true;
    deleteStep = 1;
    deleteConfirmText = '';
  }

  function closeDeleteDialog() {
    showDeleteDialog = false;
    deleteStep = 1;
    deleteConfirmText = '';
  }

  async function deleteProject() {
    if (!project) return;

    if (deleteConfirmText !== project.name) {
      alert('PROJECT NAME DOES NOT MATCH');
      return;
    }

    // TODO: Implement actual delete via projectsStore
    console.log('Deleting project:', project.id);
    alert(`PROJECT DELETED: ${project.name}`);
    closeDeleteDialog();
    goto('/projects');
  }

  function toggleStar() {
    isStarred = !isStarred;
    // TODO: Save to user preferences
    console.log('Star toggled:', isStarred);
  }

  async function copyCloneUrl() {
    if (!project) return;
    await navigator.clipboard.writeText(project.repository.url);
    alert('CLONE URL COPIED TO CLIPBOARD');
  }

  function forkProject() {
    if (!project) return;
    // TODO: Implement fork functionality
    alert('FORK FUNCTIONALITY COMING SOON');
  }

  function quickDeploy() {
    if (!project) return;
    // TODO: Implement quick deploy
    alert('QUICK DEPLOY FUNCTIONALITY COMING SOON');
  }

  onMount(async () => {
    await projectsStore.loadProjects();
    const projects = $projectsStore.projects;
    project = projects.find((p) => p.slug === slug) || null;

    if (!project) {
      goto('/projects');
      return;
    }

    await buildsStore.loadBuilds(project.id);
    builds = $buildsStore.builds.filter((b) => b.projectId === project?.id);
  });
</script>

{#if project}
  <div class="project-detail">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="project-title">
          <Button variant="text" on:click={() => goto('/projects')}>← PROJECTS</Button>
          <Heading level={1}>{project.name.toUpperCase()}</Heading>
          <span class="project-status {project.status}">{project.status.toUpperCase()}</span>
        </div>
        <div class="header-actions">
          <Button variant="outline" on:click={() => goto(`/projects/${slug}/pipelines`)}>PIPELINES</Button>
          <Button variant="primary" on:click={() => goto(`/projects/${slug}/edit`)}>CONFIGURE</Button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab"
        class:active={activeTab === 'overview'}
        on:click={() => (activeTab = 'overview')}
      >
        OVERVIEW
      </button>
      <button
        class="tab"
        class:active={activeTab === 'builds'}
        on:click={() => (activeTab = 'builds')}
      >
        BUILDS ({builds.length})
      </button>
      <button
        class="tab"
        class:active={activeTab === 'statistics'}
        on:click={() => (activeTab = 'statistics')}
      >
        STATISTICS
      </button>
      <button
        class="tab"
        class:active={activeTab === 'settings'}
        on:click={() => (activeTab = 'settings')}
      >
        SETTINGS
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      {#if activeTab === 'overview'}
        <div class="overview">
          <!-- Quick Actions -->
          <div class="quick-actions">
            <button class="action-btn" on:click={copyCloneUrl}>
              <span class="icon">■</span>
              <span>CLONE</span>
            </button>
            <button class="action-btn" class:active={isStarred} on:click={toggleStar}>
              <span class="icon">{isStarred ? '★' : '☆'}</span>
              <span>STAR ({project.stars})</span>
            </button>
            <button class="action-btn" on:click={forkProject}>
              <span class="icon">⊢</span>
              <span>FORK ({project.forks})</span>
            </button>
            <button class="action-btn primary" on:click={quickDeploy}>
              <span class="icon">→</span>
              <span>DEPLOY</span>
            </button>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h3>PROJECT INFORMATION</h3>
              <div class="info-row">
                <span class="info-label">CATEGORY</span>
                <span class="info-value">{project.category.replace(/-/g, ' ').toUpperCase()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">LANGUAGE</span>
                <span class="info-value">{project.language}</span>
              </div>
              <div class="info-row">
                <span class="info-label">VISIBILITY</span>
                <span class="info-value">{project.visibility.toUpperCase()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">LICENSE</span>
                <span class="info-value">{project.license || 'NONE'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">CREATED</span>
                <span class="info-value">{formatDate(project.createdAt)}</span>
              </div>
            </div>

            <div class="info-card">
              <h3>REPOSITORY</h3>
              <div class="info-row">
                <span class="info-label">URL</span>
                <span class="info-value mono">{project.repository.url}</span>
              </div>
              <div class="info-row">
                <span class="info-label">DEFAULT BRANCH</span>
                <span class="info-value mono">{project.repository.defaultBranch}</span>
              </div>
              <div class="info-row">
                <span class="info-label">BRANCHES</span>
                <span class="info-value">{project.repository.branches.length}</span>
              </div>
              <div class="info-row">
                <span class="info-label">LAST COMMIT</span>
                <span class="info-value">{formatDate(project.lastCommit)}</span>
              </div>
            </div>

            <div class="info-card">
              <h3>METRICS</h3>
              <div class="metric-grid">
                <div class="metric">
                  <div class="metric-value">{project.stars}</div>
                  <div class="metric-label">STARS</div>
                </div>
                <div class="metric">
                  <div class="metric-value">{project.forks}</div>
                  <div class="metric-label">FORKS</div>
                </div>
                <div class="metric">
                  <div class="metric-value">{project.contributors}</div>
                  <div class="metric-label">CONTRIBUTORS</div>
                </div>
                <div class="metric">
                  <div class="metric-value">{project.coverage || 0}%</div>
                  <div class="metric-label">COVERAGE</div>
                </div>
              </div>
            </div>
          </div>

          <div class="description-section">
            <h3>DESCRIPTION</h3>
            <p>{project.description}</p>
          </div>

          <!-- Recent Activity -->
          {#if recentCommits.length > 0}
            <div class="recent-activity">
              <h3>RECENT COMMITS</h3>
              <div class="commits-list">
                {#each recentCommits as commit}
                  <div class="commit-item">
                    <div class="commit-header">
                      <span class="commit-sha mono">{commit.sha.substring(0, 7)}</span>
                      <span class="commit-branch mono">⊢ {commit.branch}</span>
                      <span class="commit-time">{getRelativeTime(commit.timestamp)}</span>
                    </div>
                    <div class="commit-message">{commit.message}</div>
                    <div class="commit-author">◆ {commit.author}</div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}

      {#if activeTab === 'builds'}
        <div class="builds">
          <div class="builds-header">
            <h3>BUILD HISTORY</h3>
            <Button variant="primary" on:click={openTriggerBuildDialog}>+ TRIGGER BUILD</Button>
          </div>

          <div class="builds-table">
            <div class="table-header">
              <div class="table-cell">#</div>
              <div class="table-cell">STATUS</div>
              <div class="table-cell">BRANCH</div>
              <div class="table-cell">COMMIT</div>
              <div class="table-cell">TRIGGERED BY</div>
              <div class="table-cell">DURATION</div>
              <div class="table-cell">DATE</div>
            </div>

            {#each builds as build}
              <div class="table-row" on:click={() => goto(`/builds/${build.id}`)}>
                <div class="table-cell mono">#{build.buildNumber}</div>
                <div class="table-cell">
                  <span class="status-badge {build.status}">
                    {getStatusIndicator(build.status)} {build.status.toUpperCase()}
                  </span>
                </div>
                <div class="table-cell mono">{build.branch}</div>
                <div class="table-cell mono">{build.commit.sha.substring(0, 7)}</div>
                <div class="table-cell">{build.triggeredBy.name}</div>
                <div class="table-cell">
                  {build.duration ? formatDuration(build.duration) : '-'}
                </div>
                <div class="table-cell">{formatDate(build.startedAt)}</div>
              </div>
            {/each}

            {#if builds.length === 0}
              <div class="no-builds">
                <Text muted>NO BUILDS YET</Text>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      {#if activeTab === 'statistics'}
        <div class="statistics">
          <div class="stats-grid">
            <div class="stat-card">
              <h3>BUILD SUCCESS RATE (LAST 7 DAYS)</h3>
              <div class="stat-chart">
                <div class="bar-chart">
                  {#each buildStats.dailyData as value, i}
                    <div class="bar-column">
                      <div class="bar" style="height: {value || 5}%"></div>
                      <div class="bar-label">D{i + 1}</div>
                    </div>
                  {/each}
                </div>
                <div class="success-rate">
                  <span class="rate-value">{buildStats.successRate7Days}%</span>
                  <span class="rate-label">AVERAGE SUCCESS RATE</span>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <h3>BUILD FREQUENCY</h3>
              <div class="frequency-stats">
                <div class="freq-stat">
                  <div class="freq-value">{buildStats.buildsThisWeek}</div>
                  <div class="freq-label">THIS WEEK</div>
                </div>
                <div class="freq-stat">
                  <div class="freq-value">{buildStats.buildsThisMonth}</div>
                  <div class="freq-label">THIS MONTH</div>
                </div>
                <div class="freq-stat">
                  <div class="freq-value">{buildStats.totalBuilds}</div>
                  <div class="freq-label">TOTAL</div>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <h3>AVERAGE BUILD TIME</h3>
              <div class="time-chart">
                <div class="time-value">{formatDuration(buildStats.avgDuration * 1000)}</div>
                <div class="time-trend">BASED ON {buildStats.totalBuilds} BUILDS</div>
              </div>
            </div>
          </div>

          <div class="stats-details">
            <div class="detail-card">
              <h4>30-DAY SUCCESS RATE</h4>
              <div class="detail-value">{buildStats.successRate30Days}%</div>
            </div>
            <div class="detail-card">
              <h4>TOTAL BUILDS</h4>
              <div class="detail-value">{buildStats.totalBuilds}</div>
            </div>
            <div class="detail-card">
              <h4>AVG BUILD TIME</h4>
              <div class="detail-value">{formatDuration(buildStats.avgDuration * 1000)}</div>
            </div>
          </div>
        </div>
      {/if}

      {#if activeTab === 'settings'}
        <div class="settings">
          <div class="settings-section">
            <h3>DANGER ZONE</h3>
            <div class="danger-actions">
              <div class="danger-item">
                <div>
                  <Text>Archive this project</Text>
                  <Text size="small" muted>Mark this project as archived and read-only</Text>
                </div>
                <Button variant="outline" on:click={openArchiveDialog}>ARCHIVE</Button>
              </div>
              <div class="danger-item">
                <div>
                  <Text>Delete this project</Text>
                  <Text size="small" muted>Permanently delete this project and all its data</Text>
                </div>
                <Button variant="outline" on:click={openDeleteDialog}>DELETE</Button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Trigger Build Dialog -->
  {#if showTriggerBuildDialog}
    <div class="dialog-overlay" on:click={closeTriggerBuildDialog}>
      <div class="dialog" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>TRIGGER BUILD</h2>
          <button class="close-btn" on:click={closeTriggerBuildDialog}>✕</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>BRANCH</label>
            <select bind:value={selectedBranch} class="input">
              {#each project.repository.branches as branch}
                <option value={branch}>{branch}</option>
              {/each}
            </select>
          </div>

          <div class="form-group">
            <label>ENVIRONMENT</label>
            <select bind:value={selectedEnvironment} class="input">
              <option value="development">DEVELOPMENT</option>
              <option value="staging">STAGING</option>
              <option value="production">PRODUCTION</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" bind:checked={cleanBuild} />
              <span>CLEAN BUILD (REMOVE ALL CACHED ARTIFACTS)</span>
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" bind:checked={skipTests} />
              <span>SKIP TESTS (NOT RECOMMENDED)</span>
            </label>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={closeTriggerBuildDialog}>CANCEL</button>
          <button class="btn-primary" on:click={triggerBuild}>TRIGGER BUILD</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Archive Dialog -->
  {#if showArchiveDialog}
    <div class="dialog-overlay" on:click={closeArchiveDialog}>
      <div class="dialog" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>ARCHIVE PROJECT</h2>
          <button class="close-btn" on:click={closeArchiveDialog}>✕</button>
        </div>
        <div class="dialog-body">
          <div class="warning-box">
            <div class="warning-icon">▲</div>
            <div class="warning-content">
              <h3>WARNING</h3>
              <p>Archiving this project will make it read-only. You can unarchive it later.</p>
              <ul>
                <li>No new commits can be pushed</li>
                <li>No builds can be triggered</li>
                <li>No settings can be changed</li>
                <li>Project will be marked as archived</li>
              </ul>
            </div>
          </div>
          <p class="confirm-text">Are you sure you want to archive <strong>{project.name}</strong>?</p>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={closeArchiveDialog}>CANCEL</button>
          <button class="btn-danger" on:click={archiveProject}>ARCHIVE PROJECT</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Delete Dialog -->
  {#if showDeleteDialog}
    <div class="dialog-overlay" on:click={closeDeleteDialog}>
      <div class="dialog danger" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>DELETE PROJECT</h2>
          <button class="close-btn" on:click={closeDeleteDialog}>✕</button>
        </div>
        <div class="dialog-body">
          {#if deleteStep === 1}
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
            <p class="confirm-text">Do you really want to proceed?</p>
          {:else}
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
          {/if}
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={closeDeleteDialog}>CANCEL</button>
          {#if deleteStep === 1}
            <button class="btn-danger" on:click={() => deleteStep = 2}>PROCEED TO CONFIRM</button>
          {:else}
            <button
              class="btn-danger"
              on:click={deleteProject}
              disabled={deleteConfirmText !== project.name}
            >
              DELETE PROJECT
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .project-detail {
    min-height: 100vh;
    background: var(--bg);
  }

  .page-header {
    border-bottom: var(--border-width) solid var(--border-color);
    padding: var(--space-6) var(--space-8);
    background: var(--bg);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .project-title {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .project-status {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    border: var(--border-width) solid var(--fg);
  }

  .project-status.active {
    background: var(--fg);
    color: var(--bg);
  }

  .header-actions {
    display: flex;
    gap: var(--space-3);
  }

  .tabs {
    display: flex;
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
  }

  .tab {
    padding: var(--space-4) var(--space-6);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
    cursor: pointer;
    transition: var(--transition-base);
    border-right: var(--border-width) solid var(--border-color);
  }

  .tab:hover {
    background: var(--surface-2);
  }

  .tab.active {
    background: var(--fg);
    color: var(--bg);
  }

  .tab-content {
    padding: var(--space-8);
  }

  /* Overview Tab */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 0;
    margin-bottom: var(--space-8);
    border: var(--border-width) solid var(--border-color);
  }

  .info-card {
    padding: var(--space-6);
    border-right: var(--border-width) solid var(--border-color);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .info-card:last-child {
    border-right: none;
  }

  .info-card h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: var(--space-2) 0;
    border-bottom: var(--border-width) solid var(--divider);
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .info-value {
    font-size: var(--text-14);
    font-weight: var(--weight-medium);
  }

  .info-value.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-top: var(--space-4);
  }

  .metric {
    text-align: center;
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
  }

  .metric-value {
    font-size: var(--text-24);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .metric-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .description-section {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
  }

  .description-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-3) 0;
  }

  .description-section p {
    font-size: var(--text-14);
    line-height: var(--leading-relaxed);
    color: var(--fg);
    margin: 0;
  }

  /* Builds Tab */
  .builds-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  .builds-header h3 {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .builds-table {
    border: var(--border-width) solid var(--border-color);
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 80px 120px 120px 100px 150px 100px 150px;
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .table-header {
    background: var(--fg);
    color: var(--bg);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    font-size: var(--text-12);
  }

  .table-row {
    background: var(--bg);
    cursor: pointer;
    transition: var(--transition-base);
  }

  .table-row:hover {
    background: var(--surface-1);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-cell {
    padding: var(--space-3) var(--space-4);
    display: flex;
    align-items: center;
    border-right: var(--border-width) solid var(--border-color);
    font-size: var(--text-14);
  }

  .table-cell:last-child {
    border-right: none;
  }

  .table-cell.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
  }

  .status-badge.success {
    color: var(--fg);
  }

  .status-badge.failed {
    color: var(--muted);
  }

  .no-builds {
    padding: var(--space-8);
    text-align: center;
  }

  /* Statistics Tab */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 0;
    border: var(--border-width) solid var(--border-color);
  }

  .stat-card {
    padding: var(--space-6);
    border-right: var(--border-width) solid var(--border-color);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .stat-card:last-child {
    border-right: none;
  }

  .stat-card h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 150px;
    padding: var(--space-4) 0;
  }

  .bar-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .bar {
    width: 30px;
    background: var(--fg);
    margin-bottom: var(--space-2);
  }

  .bar-label {
    font-size: var(--text-11);
    color: var(--muted);
  }

  .frequency-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
    padding: var(--space-4) 0;
  }

  .freq-stat {
    text-align: center;
  }

  .freq-value {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-2);
  }

  .freq-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .time-chart {
    padding: var(--space-6) 0;
    text-align: center;
  }

  .time-value {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-3);
  }

  .time-trend {
    font-size: var(--text-14);
    color: var(--muted);
  }

  /* Settings Tab */
  .settings-section {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .settings-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .danger-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .danger-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
  }

  /* Quick Actions */
  .quick-actions {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border: var(--border-width) solid var(--fg);
    background: var(--bg);
    cursor: pointer;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    transition: var(--transition-base);
    font-family: inherit;
  }

  .action-btn:hover {
    background: var(--surface-2);
  }

  .action-btn.primary {
    background: var(--fg);
    color: var(--bg);
  }

  .action-btn.primary:hover {
    opacity: 0.9;
  }

  .action-btn.active {
    background: var(--fg);
    color: var(--bg);
  }

  .action-btn .icon {
    font-size: var(--text-16);
  }

  /* Recent Activity */
  .recent-activity {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    margin-top: var(--space-8);
  }

  .recent-activity h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .commits-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .commit-item {
    padding: var(--space-3) var(--space-4);
    border-bottom: var(--border-width) solid var(--border-color);
    transition: var(--transition-base);
  }

  .commit-item:hover {
    background: var(--surface-1);
  }

  .commit-item:last-child {
    border-bottom: none;
  }

  .commit-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
    font-size: var(--text-12);
  }

  .commit-sha {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    background: var(--surface-1);
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--border-color);
  }

  .commit-branch {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    color: var(--muted);
  }

  .commit-time {
    margin-left: auto;
    color: var(--muted);
  }

  .commit-message {
    font-size: var(--text-14);
    margin-bottom: var(--space-2);
    line-height: var(--leading-relaxed);
  }

  .commit-author {
    font-size: var(--text-12);
    color: var(--muted);
  }

  /* Stats Details */
  .stats-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    margin-top: var(--space-6);
    border: var(--border-width) solid var(--border-color);
  }

  .detail-card {
    padding: var(--space-6);
    text-align: center;
    border-right: var(--border-width) solid var(--border-color);
  }

  .detail-card:last-child {
    border-right: none;
  }

  .detail-card h4 {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-3) 0;
    color: var(--muted);
  }

  .detail-value {
    font-size: var(--text-24);
    font-weight: var(--weight-semibold);
  }

  .success-rate {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: var(--border-width) solid var(--border-color);
  }

  .rate-value {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
  }

  .rate-label {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
  }

  /* Dialog Overlay */
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

  .form-group {
    margin-bottom: var(--space-4);
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-2);
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
  }

  .input:focus {
    border-width: 2px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-14);
    font-weight: var(--weight-regular);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    cursor: pointer;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-6);
    border-top: var(--border-width) solid var(--border-color);
  }

  .btn-primary,
  .btn-secondary,
  .btn-danger {
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

  .btn-primary {
    background: var(--fg);
    color: var(--bg);
  }

  .btn-primary:hover {
    opacity: 0.9;
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

  /* Warning Box */
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

  .confirm-text {
    font-size: var(--text-14);
    text-align: center;
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
</style>