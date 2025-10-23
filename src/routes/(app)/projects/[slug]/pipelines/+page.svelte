<script lang="ts">
  /**
   * Pipelines Page
   * Manage CI/CD pipelines for the project
   */

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { projectsStore } from '$lib/stores/projectsStore';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import type { Project, Pipeline } from '$lib/types';

  let project: Project | null = null;
  let pipelines: Pipeline[] = [];
  let selectedPipelineId: string | null = null;
  let activeTab: 'overview' | 'configuration' | 'history' | 'settings' = 'overview';

  // Dialogs
  let showCreateDialog = false;
  let showEditDialog = false;
  let showDeleteDialog = false;

  // Create/Edit form
  let formName = '';
  let formDescription = '';
  let formStatus: 'active' | 'inactive' | 'paused' = 'active';
  let formTriggers: Array<{type: string, branches?: string[], schedule?: string}> = [];
  let formStages: Array<{name: string, jobs: string[], dependsOn?: string[]}> = [];
  let formEnvironment: 'development' | 'staging' | 'production' | 'testing' = 'development';

  // Execution history mock data
  interface PipelineExecution {
    id: string;
    pipelineId: string;
    status: 'success' | 'failed' | 'running' | 'cancelled';
    startedAt: Date;
    finishedAt?: Date;
    duration?: number;
    triggeredBy: string;
    trigger: string;
    commit?: {
      sha: string;
      message: string;
    };
  }

  let executions: PipelineExecution[] = [];

  $: slug = $page.params.slug;
  $: selectedPipeline = selectedPipelineId
    ? pipelines.find(p => p.id === selectedPipelineId)
    : pipelines[0];

  function getStatusIndicator(status: string) {
    switch (status) {
      case 'success': return '■';
      case 'failed': return '□';
      case 'running': return '▣';
      case 'cancelled': return '▢';
      default: return '○';
    }
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  function selectPipeline(pipelineId: string) {
    selectedPipelineId = pipelineId;
    activeTab = 'overview';
  }

  function openCreateDialog() {
    formName = '';
    formDescription = '';
    formStatus = 'active';
    formTriggers = [{ type: 'push', branches: ['main'] }];
    formStages = [
      { name: 'Build', jobs: ['compile', 'test'] },
      { name: 'Deploy', jobs: ['deploy'], dependsOn: ['Build'] }
    ];
    formEnvironment = 'development';
    showCreateDialog = true;
  }

  function closeCreateDialog() {
    showCreateDialog = false;
  }

  function createPipeline() {
    console.log('Creating pipeline:', { formName, formDescription, formStatus });
    alert(`PIPELINE CREATED: ${formName}`);
    closeCreateDialog();
    // TODO: Add to pipelines array
  }

  function openEditDialog() {
    if (!selectedPipeline) return;
    formName = selectedPipeline.name;
    formDescription = selectedPipeline.description || '';
    formStatus = selectedPipeline.status;
    showEditDialog = true;
  }

  function closeEditDialog() {
    showEditDialog = false;
  }

  function savePipeline() {
    console.log('Saving pipeline:', selectedPipeline?.id);
    alert(`PIPELINE UPDATED: ${formName}`);
    closeEditDialog();
  }

  function openDeleteDialog() {
    showDeleteDialog = true;
  }

  function closeDeleteDialog() {
    showDeleteDialog = false;
  }

  function deletePipeline() {
    if (!selectedPipeline) return;
    console.log('Deleting pipeline:', selectedPipeline.id);
    alert(`PIPELINE DELETED: ${selectedPipeline.name}`);
    closeDeleteDialog();
    selectedPipelineId = null;
  }

  function runPipeline() {
    if (!selectedPipeline) return;
    alert(`PIPELINE TRIGGERED: ${selectedPipeline.name}\nSTATUS: RUNNING`);
  }

  function pausePipeline() {
    if (!selectedPipeline) return;
    alert(`PIPELINE PAUSED: ${selectedPipeline.name}`);
  }

  function enablePipeline() {
    if (!selectedPipeline) return;
    alert(`PIPELINE ACTIVATED: ${selectedPipeline.name}`);
  }

  onMount(async () => {
    await projectsStore.loadProjects();
    const projects = $projectsStore.projects;
    project = projects.find((p) => p.slug === slug) || null;

    if (!project) {
      goto('/projects');
      return;
    }

    // Mock pipelines data
    pipelines = [
      {
        id: 'pipeline-1',
        projectId: project.id,
        name: 'Main CI/CD Pipeline',
        description: 'Primary build, test, and deployment pipeline',
        status: 'active',
        config: {
          triggers: [
            { type: 'push', branches: ['main', 'develop'] },
            { type: 'pull_request', branches: ['main'] },
            { type: 'schedule', schedule: '0 2 * * *' }
          ],
          stages: [
            { name: 'Checkout', jobs: ['git-clone'] },
            { name: 'Build', jobs: ['compile', 'package'], dependsOn: ['Checkout'] },
            { name: 'Test', jobs: ['unit-tests', 'integration-tests'], dependsOn: ['Build'] },
            { name: 'Quality', jobs: ['lint', 'sonar', 'security-scan'], dependsOn: ['Test'] },
            { name: 'Deploy', jobs: ['deploy-staging'], dependsOn: ['Quality'], condition: 'branch == "develop"' }
          ],
          environment: 'development',
          notifications: {
            email: true,
            slack: true,
            onSuccess: false,
            onFailure: true,
            recipients: ['dev-team@example.com']
          }
        },
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'pipeline-2',
        projectId: project.id,
        name: 'Production Deployment',
        description: 'Production-only deployment pipeline with manual approval',
        status: 'active',
        config: {
          triggers: [
            { type: 'tag' },
            { type: 'manual' }
          ],
          stages: [
            { name: 'Pre-Deploy', jobs: ['backup-db', 'health-check'] },
            { name: 'Deploy', jobs: ['deploy-production'], dependsOn: ['Pre-Deploy'] },
            { name: 'Post-Deploy', jobs: ['smoke-tests', 'notify'], dependsOn: ['Deploy'] }
          ],
          environment: 'production',
          notifications: {
            email: true,
            slack: true,
            onSuccess: true,
            onFailure: true,
            recipients: ['ops@example.com', 'dev-team@example.com']
          }
        },
        lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'pipeline-3',
        projectId: project.id,
        name: 'Nightly Build',
        description: 'Automated nightly build for comprehensive testing',
        status: 'paused',
        config: {
          triggers: [
            { type: 'schedule', schedule: '0 0 * * *' }
          ],
          stages: [
            { name: 'Full Build', jobs: ['clean', 'compile', 'package'] },
            { name: 'Extended Tests', jobs: ['unit', 'integration', 'e2e', 'performance'], dependsOn: ['Full Build'] },
            { name: 'Reports', jobs: ['generate-reports', 'upload-artifacts'], dependsOn: ['Extended Tests'] }
          ],
          environment: 'testing',
          notifications: {
            email: true,
            slack: false,
            onSuccess: true,
            onFailure: true,
            recipients: ['qa-team@example.com']
          }
        },
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 17 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    // Mock execution history
    executions = [
      {
        id: 'exec-1',
        pipelineId: 'pipeline-1',
        status: 'success',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        duration: 5 * 60 * 1000,
        triggeredBy: 'GitHub Webhook',
        trigger: 'push',
        commit: {
          sha: 'a3f2c1b',
          message: 'feat: Add new authentication module'
        }
      },
      {
        id: 'exec-2',
        pipelineId: 'pipeline-1',
        status: 'failed',
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 3 * 60 * 1000),
        duration: 3 * 60 * 1000,
        triggeredBy: 'John Developer',
        trigger: 'manual',
        commit: {
          sha: 'b2e4d7a',
          message: 'fix: Resolve database connection issue'
        }
      },
      {
        id: 'exec-3',
        pipelineId: 'pipeline-1',
        status: 'success',
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 6 * 60 * 1000),
        duration: 6 * 60 * 1000,
        triggeredBy: 'Scheduled Trigger',
        trigger: 'schedule',
        commit: {
          sha: 'c7a9f3e',
          message: 'chore: Update dependencies'
        }
      },
      {
        id: 'exec-4',
        pipelineId: 'pipeline-2',
        status: 'success',
        startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000 + 8 * 60 * 1000),
        duration: 8 * 60 * 1000,
        triggeredBy: 'Deploy Bot',
        trigger: 'tag',
        commit: {
          sha: 'd1b8e4f',
          message: 'release: v2.5.0'
        }
      }
    ];

    if (pipelines.length > 0) {
      selectedPipelineId = pipelines[0].id;
    }
  });

  $: pipelineExecutions = selectedPipeline
    ? executions.filter(e => e.pipelineId === selectedPipeline.id)
    : [];
</script>

{#if project}
  <div class="pipelines-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <Button variant="text" on:click={() => goto(`/projects/${slug}`)}>
            ← {project.name.toUpperCase()}
          </Button>
          <Heading level={1}>PIPELINES</Heading>
          <span class="pipeline-count">{pipelines.length} PIPELINES</span>
        </div>
        <div class="header-actions">
          <Button variant="primary" on:click={openCreateDialog}>+ NEW PIPELINE</Button>
        </div>
      </div>
    </div>

    <div class="pipelines-layout">
      <!-- Pipeline List Sidebar -->
      <div class="pipelines-sidebar">
        <div class="sidebar-header">
          <h3>PIPELINES</h3>
        </div>
        <div class="pipelines-list">
          {#each pipelines as pipeline}
            <button
              class="pipeline-item"
              class:active={selectedPipelineId === pipeline.id}
              on:click={() => selectPipeline(pipeline.id)}
            >
              <div class="pipeline-item-header">
                <span class="pipeline-name">{pipeline.name}</span>
                <span class="pipeline-status {pipeline.status}">
                  {pipeline.status === 'active' ? '●' : pipeline.status === 'paused' ? '◐' : '○'}
                </span>
              </div>
              {#if pipeline.description}
                <div class="pipeline-desc">{pipeline.description}</div>
              {/if}
              <div class="pipeline-meta">
                <span>LAST RUN: {pipeline.lastRun ? getRelativeTime(pipeline.lastRun) : 'NEVER'}</span>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Pipeline Detail -->
      {#if selectedPipeline}
        <div class="pipeline-detail">
          <!-- Detail Header -->
          <div class="detail-header">
            <div class="detail-title">
              <h2>{selectedPipeline.name}</h2>
              <span class="status-badge {selectedPipeline.status}">
                {selectedPipeline.status.toUpperCase()}
              </span>
            </div>
            <div class="detail-actions">
              {#if selectedPipeline.status === 'active'}
                <button class="btn-secondary" on:click={runPipeline}>▶ RUN</button>
                <button class="btn-secondary" on:click={pausePipeline}>◐ PAUSE</button>
              {:else if selectedPipeline.status === 'paused'}
                <button class="btn-secondary" on:click={enablePipeline}>● ACTIVATE</button>
              {/if}
              <button class="btn-secondary" on:click={openEditDialog}>EDIT</button>
              <button class="btn-secondary" on:click={openDeleteDialog}>DELETE</button>
            </div>
          </div>

          {#if selectedPipeline.description}
            <div class="detail-description">{selectedPipeline.description}</div>
          {/if}

          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              class:active={activeTab === 'overview'}
              on:click={() => activeTab = 'overview'}
            >
              OVERVIEW
            </button>
            <button
              class="tab"
              class:active={activeTab === 'configuration'}
              on:click={() => activeTab = 'configuration'}
            >
              CONFIGURATION
            </button>
            <button
              class="tab"
              class:active={activeTab === 'history'}
              on:click={() => activeTab = 'history'}
            >
              HISTORY ({pipelineExecutions.length})
            </button>
            <button
              class="tab"
              class:active={activeTab === 'settings'}
              on:click={() => activeTab = 'settings'}
            >
              SETTINGS
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            {#if activeTab === 'overview'}
              <div class="overview">
                <div class="overview-grid">
                  <!-- Status Card -->
                  <div class="overview-card">
                    <h3>STATUS</h3>
                    <div class="status-info">
                      <div class="status-row">
                        <span>STATE:</span>
                        <span class="value {selectedPipeline.status}">
                          {selectedPipeline.status.toUpperCase()}
                        </span>
                      </div>
                      <div class="status-row">
                        <span>LAST RUN:</span>
                        <span class="value">
                          {selectedPipeline.lastRun ? formatDate(selectedPipeline.lastRun) : 'NEVER'}
                        </span>
                      </div>
                      {#if selectedPipeline.nextRun}
                        <div class="status-row">
                          <span>NEXT RUN:</span>
                          <span class="value">{formatDate(selectedPipeline.nextRun)}</span>
                        </div>
                      {/if}
                    </div>
                  </div>

                  <!-- Triggers Card -->
                  <div class="overview-card">
                    <h3>TRIGGERS ({selectedPipeline.config.triggers.length})</h3>
                    <div class="triggers-list">
                      {#each selectedPipeline.config.triggers as trigger}
                        <div class="trigger-item">
                          <span class="trigger-icon">→</span>
                          <div class="trigger-info">
                            <div class="trigger-type">{trigger.type.toUpperCase()}</div>
                            {#if trigger.branches}
                              <div class="trigger-detail">BRANCHES: {trigger.branches.join(', ')}</div>
                            {/if}
                            {#if trigger.schedule}
                              <div class="trigger-detail mono">CRON: {trigger.schedule}</div>
                            {/if}
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>

                  <!-- Environment Card -->
                  <div class="overview-card">
                    <h3>ENVIRONMENT</h3>
                    <div class="env-info">
                      <div class="env-badge">
                        {selectedPipeline.config.environment.toUpperCase()}
                      </div>
                      <div class="env-details">
                        <div class="env-row">
                          <span>EMAIL:</span>
                          <span>{selectedPipeline.config.notifications.email ? '■ YES' : '□ NO'}</span>
                        </div>
                        <div class="env-row">
                          <span>SLACK:</span>
                          <span>{selectedPipeline.config.notifications.slack ? '■ YES' : '□ NO'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Stage Visualization -->
                <div class="stages-visualization">
                  <h3>PIPELINE STAGES</h3>
                  <div class="stages-flow">
                    {#each selectedPipeline.config.stages as stage, i}
                      <div class="stage-block">
                        <div class="stage-header">
                          <span class="stage-number">{i + 1}</span>
                          <span class="stage-name">{stage.name}</span>
                        </div>
                        <div class="stage-jobs">
                          {#each stage.jobs as job}
                            <div class="job-item">■ {job}</div>
                          {/each}
                        </div>
                        {#if stage.dependsOn}
                          <div class="stage-depends">
                            DEPENDS ON: {stage.dependsOn.join(', ')}
                          </div>
                        {/if}
                        {#if stage.condition}
                          <div class="stage-condition mono">
                            IF: {stage.condition}
                          </div>
                        {/if}
                      </div>
                      {#if i < selectedPipeline.config.stages.length - 1}
                        <div class="stage-arrow">→</div>
                      {/if}
                    {/each}
                  </div>
                </div>

                <!-- Recent Executions -->
                {#if pipelineExecutions.length > 0}
                  <div class="recent-executions">
                    <h3>RECENT EXECUTIONS</h3>
                    <div class="executions-list">
                      {#each pipelineExecutions.slice(0, 5) as execution}
                        <div class="execution-item {execution.status}">
                          <div class="execution-status">
                            {getStatusIndicator(execution.status)}
                          </div>
                          <div class="execution-info">
                            <div class="execution-header">
                              <span class="execution-trigger">{execution.trigger.toUpperCase()}</span>
                              <span class="execution-time">{formatDate(execution.startedAt)}</span>
                            </div>
                            {#if execution.commit}
                              <div class="execution-commit">
                                <span class="commit-sha mono">{execution.commit.sha}</span>
                                <span class="commit-msg">{execution.commit.message}</span>
                              </div>
                            {/if}
                            <div class="execution-meta">
                              <span>BY: {execution.triggeredBy}</span>
                              {#if execution.duration}
                                <span>• DURATION: {formatDuration(execution.duration)}</span>
                              {/if}
                            </div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}

            {#if activeTab === 'configuration'}
              <div class="configuration">
                <!-- Triggers Section -->
                <div class="config-section">
                  <h3>TRIGGERS</h3>
                  <div class="config-list">
                    {#each selectedPipeline.config.triggers as trigger, i}
                      <div class="config-item">
                        <div class="config-header">
                          <span class="config-label">TRIGGER {i + 1}</span>
                          <span class="config-type">{trigger.type.toUpperCase()}</span>
                        </div>
                        <div class="config-details">
                          {#if trigger.branches}
                            <div class="config-row">
                              <span class="label">BRANCHES:</span>
                              <span class="value mono">{trigger.branches.join(', ')}</span>
                            </div>
                          {/if}
                          {#if trigger.schedule}
                            <div class="config-row">
                              <span class="label">SCHEDULE:</span>
                              <span class="value mono">{trigger.schedule}</span>
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- Stages Section -->
                <div class="config-section">
                  <h3>STAGES</h3>
                  <div class="config-list">
                    {#each selectedPipeline.config.stages as stage, i}
                      <div class="config-item">
                        <div class="config-header">
                          <span class="config-label">STAGE {i + 1}</span>
                          <span class="config-type">{stage.name.toUpperCase()}</span>
                        </div>
                        <div class="config-details">
                          <div class="config-row">
                            <span class="label">JOBS:</span>
                            <span class="value">{stage.jobs.length} JOBS</span>
                          </div>
                          <div class="jobs-grid">
                            {#each stage.jobs as job}
                              <div class="job-badge">■ {job}</div>
                            {/each}
                          </div>
                          {#if stage.dependsOn}
                            <div class="config-row">
                              <span class="label">DEPENDS ON:</span>
                              <span class="value">{stage.dependsOn.join(', ')}</span>
                            </div>
                          {/if}
                          {#if stage.condition}
                            <div class="config-row">
                              <span class="label">CONDITION:</span>
                              <span class="value mono">{stage.condition}</span>
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- Notifications Section -->
                <div class="config-section">
                  <h3>NOTIFICATIONS</h3>
                  <div class="config-item">
                    <div class="config-details">
                      <div class="config-row">
                        <span class="label">EMAIL:</span>
                        <span class="value">{selectedPipeline.config.notifications.email ? '■ ENABLED' : '□ DISABLED'}</span>
                      </div>
                      <div class="config-row">
                        <span class="label">SLACK:</span>
                        <span class="value">{selectedPipeline.config.notifications.slack ? '■ ENABLED' : '□ DISABLED'}</span>
                      </div>
                      <div class="config-row">
                        <span class="label">ON SUCCESS:</span>
                        <span class="value">{selectedPipeline.config.notifications.onSuccess ? '■ YES' : '□ NO'}</span>
                      </div>
                      <div class="config-row">
                        <span class="label">ON FAILURE:</span>
                        <span class="value">{selectedPipeline.config.notifications.onFailure ? '■ YES' : '□ NO'}</span>
                      </div>
                      <div class="config-row">
                        <span class="label">RECIPIENTS:</span>
                        <span class="value mono">{selectedPipeline.config.notifications.recipients.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/if}

            {#if activeTab === 'history'}
              <div class="history">
                <div class="history-header">
                  <h3>EXECUTION HISTORY</h3>
                  <p>{pipelineExecutions.length} TOTAL EXECUTIONS</p>
                </div>

                <div class="history-timeline">
                  {#each pipelineExecutions as execution}
                    <div class="timeline-item">
                      <div class="timeline-marker {execution.status}">
                        {getStatusIndicator(execution.status)}
                      </div>
                      <div class="timeline-content">
                        <div class="timeline-header">
                          <span class="timeline-status {execution.status}">
                            {execution.status.toUpperCase()}
                          </span>
                          <span class="timeline-date">{formatDate(execution.startedAt)}</span>
                        </div>
                        <div class="timeline-details">
                          <div class="detail-row">
                            <span class="label">TRIGGER:</span>
                            <span class="value">{execution.trigger.toUpperCase()}</span>
                          </div>
                          <div class="detail-row">
                            <span class="label">TRIGGERED BY:</span>
                            <span class="value">{execution.triggeredBy}</span>
                          </div>
                          {#if execution.duration}
                            <div class="detail-row">
                              <span class="label">DURATION:</span>
                              <span class="value">{formatDuration(execution.duration)}</span>
                            </div>
                          {/if}
                          {#if execution.commit}
                            <div class="detail-row">
                              <span class="label">COMMIT:</span>
                              <span class="value mono">{execution.commit.sha}</span>
                            </div>
                            <div class="timeline-commit">{execution.commit.message}</div>
                          {/if}
                        </div>
                        <button class="btn-text">VIEW DETAILS →</button>
                      </div>
                    </div>
                  {/each}
                </div>

                {#if pipelineExecutions.length === 0}
                  <div class="empty-state">
                    <p>NO EXECUTIONS YET</p>
                    <button class="btn-secondary" on:click={runPipeline}>RUN PIPELINE</button>
                  </div>
                {/if}
              </div>
            {/if}

            {#if activeTab === 'settings'}
              <div class="settings">
                <div class="settings-section">
                  <h3>GENERAL SETTINGS</h3>
                  <div class="settings-item">
                    <div class="settings-label">
                      <label>PIPELINE NAME</label>
                      <p>The name of this pipeline</p>
                    </div>
                    <input type="text" class="input" value={selectedPipeline.name} readonly />
                  </div>
                  <div class="settings-item">
                    <div class="settings-label">
                      <label>DESCRIPTION</label>
                      <p>A description of what this pipeline does</p>
                    </div>
                    <textarea class="input" rows="3" readonly>{selectedPipeline.description || ''}</textarea>
                  </div>
                  <div class="settings-item">
                    <div class="settings-label">
                      <label>STATUS</label>
                      <p>Control whether this pipeline is active</p>
                    </div>
                    <select class="input" disabled>
                      <option value="active" selected={selectedPipeline.status === 'active'}>ACTIVE</option>
                      <option value="paused" selected={selectedPipeline.status === 'paused'}>PAUSED</option>
                      <option value="inactive" selected={selectedPipeline.status === 'inactive'}>INACTIVE</option>
                    </select>
                  </div>
                </div>

                <div class="settings-section">
                  <h3>METADATA</h3>
                  <div class="metadata-grid">
                    <div class="metadata-item">
                      <span class="metadata-label">CREATED:</span>
                      <span class="metadata-value">{formatDate(selectedPipeline.createdAt)}</span>
                    </div>
                    <div class="metadata-item">
                      <span class="metadata-label">UPDATED:</span>
                      <span class="metadata-value">{formatDate(selectedPipeline.updatedAt)}</span>
                    </div>
                    <div class="metadata-item">
                      <span class="metadata-label">PIPELINE ID:</span>
                      <span class="metadata-value mono">{selectedPipeline.id}</span>
                    </div>
                    <div class="metadata-item">
                      <span class="metadata-label">ENVIRONMENT:</span>
                      <span class="metadata-value">{selectedPipeline.config.environment.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div class="settings-section danger">
                  <h3>DANGER ZONE</h3>
                  <div class="danger-actions">
                    <div class="danger-item">
                      <div>
                        <div class="danger-title">PAUSE PIPELINE</div>
                        <div class="danger-desc">Temporarily disable this pipeline</div>
                      </div>
                      <button class="btn-secondary" on:click={pausePipeline}>PAUSE</button>
                    </div>
                    <div class="danger-item">
                      <div>
                        <div class="danger-title">DELETE PIPELINE</div>
                        <div class="danger-desc">Permanently delete this pipeline and all its history</div>
                      </div>
                      <button class="btn-secondary" on:click={openDeleteDialog}>DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <div class="empty-detail">
          <h2>NO PIPELINE SELECTED</h2>
          <p>Select a pipeline from the list or create a new one</p>
          <Button variant="primary" on:click={openCreateDialog}>+ NEW PIPELINE</Button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Create Pipeline Dialog -->
  {#if showCreateDialog}
    <div class="dialog-overlay" on:click={closeCreateDialog}>
      <div class="dialog" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>CREATE NEW PIPELINE</h2>
          <button class="close-btn" on:click={closeCreateDialog}>✕</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>PIPELINE NAME</label>
            <input
              type="text"
              class="input"
              bind:value={formName}
              placeholder="My Pipeline"
            />
          </div>
          <div class="form-group">
            <label>DESCRIPTION</label>
            <textarea
              class="input"
              bind:value={formDescription}
              placeholder="What does this pipeline do?"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label>ENVIRONMENT</label>
            <select class="input" bind:value={formEnvironment}>
              <option value="development">DEVELOPMENT</option>
              <option value="staging">STAGING</option>
              <option value="production">PRODUCTION</option>
              <option value="testing">TESTING</option>
            </select>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={closeCreateDialog}>CANCEL</button>
          <button class="btn-primary" on:click={createPipeline}>CREATE PIPELINE</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Delete Pipeline Dialog -->
  {#if showDeleteDialog}
    <div class="dialog-overlay" on:click={closeDeleteDialog}>
      <div class="dialog danger" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>DELETE PIPELINE</h2>
          <button class="close-btn" on:click={closeDeleteDialog}>✕</button>
        </div>
        <div class="dialog-body">
          <div class="warning-box danger">
            <div class="warning-icon">✕</div>
            <div class="warning-content">
              <h3>PERMANENT DELETION</h3>
              <p>This action CANNOT be undone. This will permanently delete:</p>
              <ul>
                <li>Pipeline configuration</li>
                <li>All execution history</li>
                <li>All logs and artifacts</li>
                <li>All scheduled runs</li>
              </ul>
            </div>
          </div>
          <p class="confirm-text">Are you sure you want to delete <strong>{selectedPipeline?.name}</strong>?</p>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" on:click={closeDeleteDialog}>CANCEL</button>
          <button class="btn-danger" on:click={deletePipeline}>DELETE PIPELINE</button>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .pipelines-page {
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

  .header-title {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .pipeline-count {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    border: var(--border-width) solid var(--fg);
    color: var(--muted);
  }

  /* Layout */
  .pipelines-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    min-height: calc(100vh - 120px);
  }

  /* Sidebar */
  .pipelines-sidebar {
    border-right: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
  }

  .sidebar-header {
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--fg);
    color: var(--bg);
  }

  .sidebar-header h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .pipelines-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .pipeline-item {
    padding: var(--space-4);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--bg);
    border-left: 3px solid transparent;
    cursor: pointer;
    transition: var(--transition-base);
    text-align: left;
    font-family: inherit;
    border-right: none;
    border-top: none;
  }

  .pipeline-item:hover {
    background: var(--surface-2);
  }

  .pipeline-item.active {
    background: var(--surface-2);
    border-left-color: var(--fg);
  }

  .pipeline-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .pipeline-name {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .pipeline-status {
    font-size: var(--text-16);
  }

  .pipeline-status.active {
    color: var(--fg);
  }

  .pipeline-status.paused {
    color: var(--muted);
  }

  .pipeline-desc {
    font-size: var(--text-12);
    color: var(--muted);
    margin-bottom: var(--space-2);
    line-height: var(--leading-relaxed);
  }

  .pipeline-meta {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
  }

  /* Detail */
  .pipeline-detail {
    padding: var(--space-6) var(--space-8);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-4);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .detail-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .detail-title h2 {
    font-size: var(--text-20);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .status-badge {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    border: var(--border-width) solid var(--fg);
  }

  .status-badge.active {
    background: var(--fg);
    color: var(--bg);
  }

  .status-badge.paused {
    border-style: dashed;
    color: var(--muted);
  }

  .detail-actions {
    display: flex;
    gap: var(--space-2);
  }

  .detail-description {
    font-size: var(--text-14);
    line-height: var(--leading-relaxed);
    color: var(--muted);
    margin-bottom: var(--space-6);
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: var(--border-width) solid var(--border-color);
    margin-bottom: var(--space-6);
  }

  .tab {
    padding: var(--space-3) var(--space-5);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
    cursor: pointer;
    transition: var(--transition-base);
    border-right: var(--border-width) solid var(--border-color);
  }

  .tab:hover {
    background: var(--surface-1);
  }

  .tab.active {
    background: var(--fg);
    color: var(--bg);
  }

  /* Overview */
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .overview-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
  }

  .overview-card h3 {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-3) 0;
    padding-bottom: var(--space-2);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .status-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-12);
    padding: var(--space-2) 0;
  }

  .status-row span:first-child {
    color: var(--muted);
  }

  .status-row .value {
    font-weight: var(--weight-medium);
  }

  .status-row .value.active {
    color: var(--fg);
  }

  /* Triggers */
  .triggers-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .trigger-item {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-2);
    border: var(--border-width) solid var(--border-color);
  }

  .trigger-icon {
    font-size: var(--text-16);
  }

  .trigger-info {
    flex: 1;
  }

  .trigger-type {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .trigger-detail {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
  }

  /* Environment */
  .env-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .env-badge {
    padding: var(--space-2) var(--space-3);
    border: var(--border-width) solid var(--fg);
    background: var(--fg);
    color: var(--bg);
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-align: center;
  }

  .env-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .env-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-11);
    letter-spacing: var(--tracking-wide);
  }

  /* Stage Visualization */
  .stages-visualization {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .stages-visualization h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .stages-flow {
    display: flex;
    align-items: stretch;
    gap: var(--space-2);
    overflow-x: auto;
    padding: var(--space-4) 0;
  }

  .stage-block {
    min-width: 200px;
    border: var(--border-width) solid var(--fg);
    padding: var(--space-3);
  }

  .stage-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .stage-number {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-width) solid var(--fg);
    background: var(--fg);
    color: var(--bg);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
  }

  .stage-name {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .stage-jobs {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-2);
  }

  .job-item {
    font-size: var(--text-11);
    padding: var(--space-1) var(--space-2);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
    letter-spacing: var(--tracking-wide);
  }

  .stage-depends,
  .stage-condition {
    font-size: var(--text-10);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
    margin-top: var(--space-2);
    padding-top: var(--space-2);
    border-top: var(--border-width) solid var(--border-color);
  }

  .stage-arrow {
    display: flex;
    align-items: center;
    font-size: var(--text-24);
    color: var(--fg);
  }

  /* Recent Executions */
  .recent-executions {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
  }

  .recent-executions h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .executions-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .execution-item {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .execution-item:last-child {
    border-bottom: none;
  }

  .execution-status {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-width) solid var(--fg);
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    flex-shrink: 0;
  }

  .execution-item.success .execution-status {
    background: var(--fg);
    color: var(--bg);
  }

  .execution-item.failed .execution-status {
    border-style: dashed;
  }

  .execution-info {
    flex: 1;
  }

  .execution-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }

  .execution-trigger {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--border-color);
  }

  .execution-time {
    font-size: var(--text-11);
    color: var(--muted);
  }

  .execution-commit {
    display: flex;
    gap: var(--space-2);
    font-size: var(--text-12);
    margin-bottom: var(--space-2);
  }

  .commit-sha {
    padding: var(--space-1) var(--space-2);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  .commit-msg {
    color: var(--muted);
  }

  .execution-meta {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
  }

  /* Configuration */
  .config-section {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .config-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .config-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .config-item {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-3);
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .config-label {
    font-size: var(--text-11);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
  }

  .config-type {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .config-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .config-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-12);
    padding: var(--space-1) 0;
  }

  .config-row .label {
    color: var(--muted);
  }

  .config-row .value {
    font-weight: var(--weight-medium);
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .job-badge {
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
    font-size: var(--text-11);
    letter-spacing: var(--tracking-wide);
  }

  /* History */
  .history-header {
    margin-bottom: var(--space-6);
  }

  .history-header h3 {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    margin: 0 0 var(--space-2) 0;
  }

  .history-header p {
    font-size: var(--text-12);
    color: var(--muted);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .history-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-left: 2px solid var(--border-color);
    padding-left: var(--space-6);
  }

  .timeline-item {
    position: relative;
    padding: var(--space-4) 0;
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .timeline-item:last-child {
    border-bottom: none;
  }

  .timeline-marker {
    position: absolute;
    left: calc(-1 * var(--space-6) - 16px);
    top: var(--space-4);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-width) solid var(--fg);
    background: var(--bg);
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
  }

  .timeline-marker.success {
    background: var(--fg);
    color: var(--bg);
  }

  .timeline-marker.failed {
    border-style: dashed;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-3);
  }

  .timeline-status {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--fg);
  }

  .timeline-status.success {
    background: var(--fg);
    color: var(--bg);
  }

  .timeline-status.failed {
    border-style: dashed;
  }

  .timeline-date {
    font-size: var(--text-11);
    color: var(--muted);
  }

  .timeline-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .detail-row {
    display: flex;
    gap: var(--space-2);
    font-size: var(--text-12);
  }

  .detail-row .label {
    color: var(--muted);
    min-width: 120px;
  }

  .detail-row .value {
    font-weight: var(--weight-medium);
  }

  .timeline-commit {
    font-size: var(--text-12);
    color: var(--muted);
    padding-left: calc(120px + var(--space-2));
  }

  /* Settings */
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

  .settings-item {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--space-4);
    align-items: start;
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
    margin-bottom: var(--space-3);
  }

  .settings-label label {
    display: block;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-1);
  }

  .settings-label p {
    font-size: var(--text-12);
    color: var(--muted);
    margin: 0;
  }

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
  .settings-section.danger {
    border-color: var(--fg);
    border-style: dashed;
  }

  .danger-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .danger-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
  }

  .danger-title {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-1);
  }

  .danger-desc {
    font-size: var(--text-12);
    color: var(--muted);
  }

  /* Empty States */
  .empty-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12);
    text-align: center;
  }

  .empty-detail h2 {
    font-size: var(--text-20);
    font-weight: var(--weight-semibold);
    margin: 0 0 var(--space-2) 0;
  }

  .empty-detail p {
    font-size: var(--text-14);
    color: var(--muted);
    margin: 0 0 var(--space-4) 0;
  }

  .empty-state {
    padding: var(--space-8);
    text-align: center;
    border: var(--border-width) dashed var(--border-color);
  }

  .empty-state p {
    color: var(--muted);
    font-size: var(--text-14);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  /* Buttons */
  .btn-secondary,
  .btn-primary,
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

  .btn-text {
    padding: var(--space-1) var(--space-2);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--fg);
    cursor: pointer;
    text-decoration: underline;
    transition: var(--transition-base);
  }

  .btn-text:hover {
    opacity: 0.7;
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

  .confirm-text {
    font-size: var(--text-14);
    text-align: center;
  }

  /* Utilities */
  .mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
</style>
