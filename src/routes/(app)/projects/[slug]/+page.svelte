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

  $: slug = $page.params.slug;

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
        </div>
      {/if}

      {#if activeTab === 'builds'}
        <div class="builds">
          <div class="builds-header">
            <h3>BUILD HISTORY</h3>
            <Button variant="primary">+ TRIGGER BUILD</Button>
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
              <h3>BUILD SUCCESS RATE</h3>
              <div class="stat-chart">
                <div class="bar-chart">
                  {#each [85, 92, 78, 95, 88, 91, 94] as value, i}
                    <div class="bar-column">
                      <div class="bar" style="height: {value}%"></div>
                      <div class="bar-label">D{i + 1}</div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>

            <div class="stat-card">
              <h3>DEPLOYMENT FREQUENCY</h3>
              <div class="frequency-stats">
                <div class="freq-stat">
                  <div class="freq-value">12</div>
                  <div class="freq-label">THIS WEEK</div>
                </div>
                <div class="freq-stat">
                  <div class="freq-value">47</div>
                  <div class="freq-label">THIS MONTH</div>
                </div>
                <div class="freq-stat">
                  <div class="freq-value">523</div>
                  <div class="freq-label">TOTAL</div>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <h3>AVERAGE BUILD TIME</h3>
              <div class="time-chart">
                <div class="time-value">4m 32s</div>
                <div class="time-trend">↓ 12% FROM LAST WEEK</div>
              </div>
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
                <Button variant="outline">ARCHIVE</Button>
              </div>
              <div class="danger-item">
                <div>
                  <Text>Delete this project</Text>
                  <Text size="small" muted>Permanently delete this project and all its data</Text>
                </div>
                <Button variant="outline">DELETE</Button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
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
</style>