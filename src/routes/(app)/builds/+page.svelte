<script lang="ts">
  /**
   * Build Monitor Page
   * Real-time monitoring of all build pipelines
   */

  import { onMount, onDestroy } from 'svelte';
  import { buildsStore } from '$lib/stores/buildsStore';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import type { Build, BuildStatus } from '$lib/types';

  let activeBuilds: Build[] = [];
  let recentBuilds: Build[] = [];
  let selectedBuildId: string | null = null;
  let logStream: string[] = [];
  let autoScroll = true;
  let logContainer: HTMLDivElement;

  // Simulated real-time updates
  let updateInterval: ReturnType<typeof setInterval>;

  const mockLogs = [
    '[INFO] Starting build process...',
    '[INFO] Cloning repository from github.com/aswtech/smart-tractor',
    '[INFO] Installing dependencies...',
    '[INFO] Running npm install...',
    '[SUCCESS] Dependencies installed successfully',
    '[INFO] Running build scripts...',
    '[INFO] Compiling TypeScript...',
    '[INFO] Building production bundle...',
    '[WARNING] Bundle size is larger than recommended (512KB)',
    '[INFO] Running unit tests...',
    '[SUCCESS] 342 tests passed, 0 failed',
    '[INFO] Running integration tests...',
    '[SUCCESS] 28 integration tests passed',
    '[INFO] Running security scan...',
    '[SUCCESS] No vulnerabilities found',
    '[INFO] Building Docker image...',
    '[INFO] Pushing to registry...',
    '[SUCCESS] Build completed successfully!'
  ];

  function getStatusColor(status: BuildStatus) {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'failed';
      case 'running':
        return 'running';
      case 'pending':
        return 'pending';
      default:
        return '';
    }
  }

  function getStatusIcon(status: BuildStatus) {
    switch (status) {
      case 'success':
        return '■';
      case 'failed':
        return '□';
      case 'running':
        return '▣';
      case 'pending':
        return '○';
      case 'cancelled':
        return '×';
      default:
        return '·';
    }
  }

  function formatDuration(ms?: number) {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  function calculateProgress(build: Build): number {
    if (!build.stages) return 0;
    const completedStages = build.stages.filter(s =>
      s.status === 'success' || s.status === 'failed'
    ).length;
    return Math.floor((completedStages / build.stages.length) * 100);
  }

  function selectBuild(buildId: string) {
    selectedBuildId = buildId;
    logStream = [];

    // Simulate log streaming
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < mockLogs.length) {
        logStream = [...logStream, `[${new Date().toISOString()}] ${mockLogs[logIndex]}`];
        logIndex++;

        if (autoScroll && logContainer) {
          setTimeout(() => {
            logContainer.scrollTop = logContainer.scrollHeight;
          }, 0);
        }
      } else {
        clearInterval(logInterval);
      }
    }, 500);

    return () => clearInterval(logInterval);
  }

  function getLogLevelClass(log: string) {
    if (log.includes('[ERROR]')) return 'log-error';
    if (log.includes('[WARNING]') || log.includes('[WARN]')) return 'log-warning';
    if (log.includes('[SUCCESS]') || log.includes('[PASS]')) return 'log-success';
    if (log.includes('[INFO]')) return 'log-info';
    return '';
  }

  async function cancelBuild(buildId: string) {
    console.log('Cancelling build:', buildId);
    // API call to cancel build
  }

  async function retryBuild(buildId: string) {
    console.log('Retrying build:', buildId);
    // API call to retry build
  }

  onMount(async () => {
    await buildsStore.loadBuilds();

    const allBuilds = $buildsStore.builds;
    activeBuilds = allBuilds.filter(b => b.status === 'running' || b.status === 'pending');
    recentBuilds = allBuilds.filter(b => b.status !== 'running' && b.status !== 'pending').slice(0, 10);

    // Simulate real-time updates
    updateInterval = setInterval(async () => {
      // Update active builds progress
      activeBuilds = activeBuilds.map(build => {
        if (build.status === 'running') {
          const progress = calculateProgress(build);
          if (progress >= 100) {
            build.status = Math.random() > 0.2 ? 'success' : 'failed';
            build.finishedAt = new Date();
            build.duration = Date.now() - new Date(build.startedAt).getTime();
          }
        }
        return build;
      });

      // Move completed builds to recent
      const completed = activeBuilds.filter(b => b.status !== 'running' && b.status !== 'pending');
      if (completed.length > 0) {
        recentBuilds = [...completed, ...recentBuilds].slice(0, 10);
        activeBuilds = activeBuilds.filter(b => b.status === 'running' || b.status === 'pending');
      }
    }, 2000);
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });
</script>

<div class="builds-page">
  <!-- Header -->
  <div class="page-header">
    <Heading level={1}>BUILD MONITOR</Heading>
    <div class="header-stats">
      <div class="stat">
        <span class="stat-value">{activeBuilds.length}</span>
        <span class="stat-label">ACTIVE</span>
      </div>
      <div class="stat">
        <span class="stat-value">{recentBuilds.filter(b => b.status === 'success').length}</span>
        <span class="stat-label">SUCCESS TODAY</span>
      </div>
      <div class="stat">
        <span class="stat-value">{recentBuilds.filter(b => b.status === 'failed').length}</span>
        <span class="stat-label">FAILED TODAY</span>
      </div>
      <div class="stat">
        <span class="stat-value">87%</span>
        <span class="stat-label">SUCCESS RATE</span>
      </div>
    </div>
  </div>

  <div class="builds-content">
    <!-- Active Builds Section -->
    <div class="active-builds-section">
      <div class="section-header">
        <h2>ACTIVE PIPELINES</h2>
        <Text size="small" muted>{activeBuilds.length} RUNNING</Text>
      </div>

      <div class="pipelines">
        {#each activeBuilds as build}
          <div
            class="pipeline-card {getStatusColor(build.status)}"
            on:click={() => selectBuild(build.id)}
            class:selected={selectedBuildId === build.id}
          >
            <div class="pipeline-header">
              <div class="pipeline-info">
                <div class="pipeline-name">
                  <span class="status-icon">{getStatusIcon(build.status)}</span>
                  {build.projectName} #{build.buildNumber}
                </div>
                <div class="pipeline-meta">
                  <span class="branch">{build.branch}</span>
                  <span class="commit">{build.commit.sha.substring(0, 7)}</span>
                  <span class="user">by {build.triggeredBy.name}</span>
                </div>
              </div>
              <div class="pipeline-actions">
                <Button variant="text" size="small" on:click={(e) => {
                  e.stopPropagation();
                  cancelBuild(build.id);
                }}>CANCEL</Button>
              </div>
            </div>

            <div class="pipeline-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  style="width: {calculateProgress(build)}%"
                ></div>
              </div>
              <div class="progress-text">{calculateProgress(build)}%</div>
            </div>

            <div class="pipeline-stages">
              {#each build.stages || [] as stage}
                <div class="stage {getStatusColor(stage.status)}">
                  <span class="stage-icon">{getStatusIcon(stage.status)}</span>
                  <span class="stage-name">{stage.name}</span>
                </div>
              {/each}
            </div>
          </div>
        {/each}

        {#if activeBuilds.length === 0}
          <div class="empty-state">
            <Text muted>NO ACTIVE BUILDS</Text>
            <Text size="small" muted>All pipelines are idle</Text>
          </div>
        {/if}
      </div>

      <!-- Recent Builds Section -->
      <div class="section-header">
        <h2>RECENT BUILDS</h2>
        <Text size="small" muted>LAST 10 COMPLETED</Text>
      </div>

      <div class="recent-builds-table">
        <div class="table-header">
          <div class="table-cell">BUILD</div>
          <div class="table-cell">STATUS</div>
          <div class="table-cell">BRANCH</div>
          <div class="table-cell">DURATION</div>
          <div class="table-cell">FINISHED</div>
          <div class="table-cell">ACTIONS</div>
        </div>

        {#each recentBuilds as build}
          <div
            class="table-row"
            on:click={() => selectBuild(build.id)}
            class:selected={selectedBuildId === build.id}
          >
            <div class="table-cell">
              <span class="build-name">{build.projectName} #{build.buildNumber}</span>
            </div>
            <div class="table-cell">
              <span class="status-badge {getStatusColor(build.status)}">
                {getStatusIcon(build.status)} {build.status.toUpperCase()}
              </span>
            </div>
            <div class="table-cell mono">{build.branch}</div>
            <div class="table-cell">{formatDuration(build.duration)}</div>
            <div class="table-cell">
              {build.finishedAt ? new Date(build.finishedAt).toLocaleTimeString() : '-'}
            </div>
            <div class="table-cell">
              {#if build.status === 'failed'}
                <Button variant="text" size="small" on:click={(e) => {
                  e.stopPropagation();
                  retryBuild(build.id);
                }}>RETRY</Button>
              {/if}
              <Button variant="text" size="small" on:click={(e) => {
                e.stopPropagation();
                goto(`/builds/${build.id}`);
              }}>VIEW</Button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Log Viewer Section -->
    <div class="log-viewer-section">
      <div class="section-header">
        <h2>BUILD LOGS</h2>
        {#if selectedBuildId}
          <div class="log-controls">
            <label class="auto-scroll">
              <input type="checkbox" bind:checked={autoScroll} />
              AUTO SCROLL
            </label>
            <Button variant="text" size="small">DOWNLOAD</Button>
          </div>
        {/if}
      </div>

      <div class="log-container" bind:this={logContainer}>
        {#if selectedBuildId && logStream.length > 0}
          {#each logStream as log}
            <div class="log-line {getLogLevelClass(log)}">
              <pre>{log}</pre>
            </div>
          {/each}
        {:else if selectedBuildId}
          <div class="log-loading">
            <Text muted>Loading logs...</Text>
          </div>
        {:else}
          <div class="log-empty">
            <Text muted>SELECT A BUILD TO VIEW LOGS</Text>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .builds-page {
    min-height: 100vh;
    background: var(--bg);
  }

  .page-header {
    border-bottom: var(--border-width) solid var(--border-color);
    padding: var(--space-6) var(--space-8);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-stats {
    display: flex;
    gap: var(--space-8);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .stat-value {
    font-size: var(--text-24);
    font-weight: var(--weight-semibold);
  }

  .stat-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .builds-content {
    display: grid;
    grid-template-columns: 1fr 500px;
    height: calc(100vh - 80px);
  }

  /* Active Builds Section */
  .active-builds-section {
    border-right: var(--border-width) solid var(--border-color);
    overflow-y: auto;
  }

  .section-header {
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-header h2 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .pipelines {
    padding: var(--space-4);
  }

  .pipeline-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
    cursor: pointer;
    transition: var(--transition-base);
  }

  .pipeline-card:hover {
    background: var(--surface-1);
  }

  .pipeline-card.selected {
    border-color: var(--fg);
    background: var(--surface-1);
  }

  .pipeline-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: var(--space-3);
  }

  .pipeline-name {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .status-icon {
    font-size: var(--text-14);
  }

  .pipeline-meta {
    font-size: var(--text-12);
    color: var(--muted);
    margin-top: var(--space-1);
    display: flex;
    gap: var(--space-3);
  }

  .pipeline-meta .branch {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  .pipeline-meta .commit {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  .pipeline-progress {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--surface-2);
    border: var(--border-width) solid var(--border-color);
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--fg);
    transition: width 0.5s ease;
  }

  .progress-text {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    min-width: 40px;
  }

  .pipeline-stages {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .stage {
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--border-color);
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .stage.success {
    background: var(--fg);
    color: var(--bg);
  }

  .stage.running {
    border-color: var(--fg);
    background: var(--surface-1);
  }

  .stage.failed {
    background: var(--bg);
    border-color: var(--fg);
    text-decoration: line-through;
  }

  .stage-icon {
    font-size: var(--text-11);
  }

  /* Recent Builds Table */
  .recent-builds-table {
    border-top: var(--border-width) solid var(--border-color);
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .table-header {
    background: var(--fg);
    color: var(--bg);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .table-row {
    cursor: pointer;
    transition: var(--transition-base);
  }

  .table-row:hover {
    background: var(--surface-1);
  }

  .table-row.selected {
    background: var(--surface-1);
  }

  .table-cell {
    padding: var(--space-3) var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .table-cell.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
  }

  .build-name {
    font-weight: var(--weight-medium);
  }

  .status-badge {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .status-badge.success {
    color: var(--fg);
  }

  .status-badge.failed {
    color: var(--muted);
  }

  /* Log Viewer Section */
  .log-viewer-section {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .log-controls {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  .auto-scroll {
    font-size: var(--text-12);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    cursor: pointer;
  }

  .log-container {
    flex: 1;
    background: #000000;
    color: #00ff00;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
    padding: var(--space-4);
    overflow-y: auto;
    line-height: var(--leading-relaxed);
  }

  .log-line {
    margin-bottom: var(--space-1);
  }

  .log-line pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .log-line.log-error {
    color: #ff0000;
  }

  .log-line.log-warning {
    color: #ffff00;
  }

  .log-line.log-success {
    color: #00ff00;
  }

  .log-line.log-info {
    color: #00ffff;
  }

  .log-loading,
  .log-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00ff00;
  }

  .empty-state {
    padding: var(--space-8);
    text-align: center;
    border: var(--border-width) solid var(--border-color);
  }
</style>