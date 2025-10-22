<script lang="ts">
  /**
   * Approval Queue Page
   * Manage deployment approvals with quality gate checks
   */

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import type { Approval, ApprovalStatus, ApprovalType, QualityCheck } from '$lib/types';

  let approvals: Approval[] = [];
  let selectedApprovalId: string | null = null;
  let selectedFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';
  let selectedPriority: 'all' | 'urgent' | 'high' | 'medium' | 'low' = 'all';
  let selectedType: ApprovalType | 'all' = 'all';
  let rejectReason = '';
  let showRejectDialog = false;
  let rejectingApprovalId: string | null = null;

  // Mock data generation
  function generateMockApprovals(): Approval[] {
    return [
      {
        id: '1',
        type: 'deployment',
        status: 'pending',
        priority: 'urgent',
        title: 'Production Deployment - Smart Tractor v2.1.0',
        description: 'Deploy critical security patch to production environment',
        requestor: {
          id: 'user1',
          username: 'john.doe',
          email: 'john@aswtech.com',
          name: 'John Doe',
          avatar: '',
          role: 'developer',
          createdAt: new Date(),
          lastLogin: new Date()
        },
        requestedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        environment: 'production',
        projectId: 'proj1',
        projectName: 'smart-tractor-control',
        buildId: 'build123',
        qualityChecks: [
          { name: 'Security', status: 'pass', value: 100, threshold: 100 },
          { name: 'Tests', status: 'pass', value: 342, details: '342/342 tests passed' },
          { name: 'Coverage', status: 'warn', value: 78, threshold: 80, details: 'Below threshold' },
          { name: 'Performance', status: 'pass', value: 95, threshold: 90 },
          { name: 'Code Quality', status: 'pass', value: 85, threshold: 80 }
        ],
        changes: [
          { type: 'modified', path: 'src/navigation/auto_pilot.py' },
          { type: 'added', path: 'src/security/patch.py' },
          { type: 'modified', path: 'requirements.txt' }
        ]
      },
      {
        id: '2',
        type: 'deployment',
        status: 'pending',
        priority: 'high',
        title: 'Staging Deployment - Irrigation Controller v1.5.0',
        description: 'New feature: Smart water management based on weather forecast',
        requestor: {
          id: 'user2',
          username: 'sarah.chen',
          email: 'sarah@aswtech.com',
          name: 'Sarah Chen',
          avatar: '',
          role: 'developer',
          createdAt: new Date(),
          lastLogin: new Date()
        },
        requestedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        environment: 'staging',
        projectId: 'proj2',
        projectName: 'irrigation-controller',
        buildId: 'build456',
        qualityChecks: [
          { name: 'Security', status: 'pass', value: 100, threshold: 100 },
          { name: 'Tests', status: 'pass', value: 256, details: '256/256 tests passed' },
          { name: 'Coverage', status: 'pass', value: 92, threshold: 80 },
          { name: 'Performance', status: 'pass', value: 98, threshold: 90 },
          { name: 'Code Quality', status: 'pass', value: 94, threshold: 80 }
        ]
      },
      {
        id: '3',
        type: 'configuration',
        status: 'pending',
        priority: 'medium',
        title: 'Configuration Update - Database Connection Pool',
        description: 'Increase connection pool size for harvest season load',
        requestor: {
          id: 'user3',
          username: 'mike.kim',
          email: 'mike@aswtech.com',
          name: 'Mike Kim',
          avatar: '',
          role: 'developer',
          createdAt: new Date(),
          lastLogin: new Date()
        },
        requestedAt: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        environment: 'production',
        projectId: 'proj3',
        projectName: 'harvest-optimizer',
        qualityChecks: [
          { name: 'Security', status: 'pass', value: 100, threshold: 100 },
          { name: 'Tests', status: 'fail', value: 310, details: '310/315 tests passed (5 failed)' },
          { name: 'Coverage', status: 'pass', value: 88, threshold: 80 },
          { name: 'Performance', status: 'warn', value: 85, threshold: 90, details: 'Potential performance impact' },
          { name: 'Code Quality', status: 'pass', value: 82, threshold: 80 }
        ]
      }
    ];
  }

  function getStatusIcon(status: ApprovalStatus) {
    switch (status) {
      case 'pending':
        return '○';
      case 'approved':
        return '■';
      case 'rejected':
        return '□';
      case 'on-hold':
        return '▣';
      default:
        return '·';
    }
  }

  function getPriorityClass(priority: string) {
    switch (priority) {
      case 'urgent':
        return 'priority-urgent';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  function getQualityCheckIcon(status: 'pass' | 'warn' | 'fail') {
    switch (status) {
      case 'pass':
        return '✓';
      case 'warn':
        return '⚠';
      case 'fail':
        return '✕';
    }
  }

  function getQualityCheckClass(status: 'pass' | 'warn' | 'fail') {
    switch (status) {
      case 'pass':
        return 'check-pass';
      case 'warn':
        return 'check-warn';
      case 'fail':
        return 'check-fail';
    }
  }

  function formatTimeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  }

  function selectApproval(approval: Approval) {
    selectedApprovalId = approval.id;
  }

  async function approveRequest(approvalId: string) {
    console.log('Approving:', approvalId);
    // API call to approve
    const approval = approvals.find(a => a.id === approvalId);
    if (approval) {
      approval.status = 'approved';
      approval.approvedAt = new Date();
      approvals = [...approvals];
    }
  }

  function showRejectDialogFor(approvalId: string) {
    rejectingApprovalId = approvalId;
    rejectReason = '';
    showRejectDialog = true;
  }

  async function rejectRequest() {
    if (!rejectingApprovalId || !rejectReason.trim()) return;

    console.log('Rejecting:', rejectingApprovalId, 'Reason:', rejectReason);
    // API call to reject
    const approval = approvals.find(a => a.id === rejectingApprovalId);
    if (approval) {
      approval.status = 'rejected';
      approvals = [...approvals];
    }

    showRejectDialog = false;
    rejectingApprovalId = null;
    rejectReason = '';
  }

  async function holdRequest(approvalId: string) {
    console.log('Holding:', approvalId);
    // API call to hold
    const approval = approvals.find(a => a.id === approvalId);
    if (approval) {
      approval.status = 'on-hold';
      approvals = [...approvals];
    }
  }

  $: filteredApprovals = approvals.filter(approval => {
    if (selectedFilter !== 'all' && approval.status !== selectedFilter) return false;
    if (selectedPriority !== 'all' && approval.priority !== selectedPriority) return false;
    if (selectedType !== 'all' && approval.type !== selectedType) return false;
    return true;
  });

  $: selectedApproval = approvals.find(a => a.id === selectedApprovalId);

  onMount(() => {
    approvals = generateMockApprovals();
    if (approvals.length > 0) {
      selectedApprovalId = approvals[0].id;
    }
  });
</script>

<div class="approvals-page">
  <!-- Header -->
  <div class="page-header">
    <Heading level={1}>APPROVAL QUEUE</Heading>
    <div class="header-stats">
      <div class="stat">
        <span class="stat-value urgent">
          {approvals.filter(a => a.status === 'pending' && a.priority === 'urgent').length}
        </span>
        <span class="stat-label">URGENT</span>
      </div>
      <div class="stat">
        <span class="stat-value">
          {approvals.filter(a => a.status === 'pending').length}
        </span>
        <span class="stat-label">PENDING</span>
      </div>
      <div class="stat">
        <span class="stat-value">
          {approvals.filter(a => a.status === 'approved').length}
        </span>
        <span class="stat-label">APPROVED TODAY</span>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters-bar">
    <div class="filter-group">
      <label>STATUS</label>
      <select bind:value={selectedFilter} class="filter-select">
        <option value="all">ALL</option>
        <option value="pending">PENDING</option>
        <option value="approved">APPROVED</option>
        <option value="rejected">REJECTED</option>
      </select>
    </div>

    <div class="filter-group">
      <label>PRIORITY</label>
      <select bind:value={selectedPriority} class="filter-select">
        <option value="all">ALL</option>
        <option value="urgent">URGENT</option>
        <option value="high">HIGH</option>
        <option value="medium">MEDIUM</option>
        <option value="low">LOW</option>
      </select>
    </div>

    <div class="filter-group">
      <label>TYPE</label>
      <select bind:value={selectedType} class="filter-select">
        <option value="all">ALL</option>
        <option value="deployment">DEPLOYMENT</option>
        <option value="merge">MERGE</option>
        <option value="release">RELEASE</option>
        <option value="configuration">CONFIGURATION</option>
        <option value="access">ACCESS</option>
      </select>
    </div>

    <div class="filter-stats">
      <Text size="small" muted>{filteredApprovals.length} REQUESTS</Text>
    </div>
  </div>

  <div class="approvals-content">
    <!-- Approvals List -->
    <div class="approvals-list">
      {#each filteredApprovals as approval}
        <div
          class="approval-card"
          class:selected={selectedApprovalId === approval.id}
          on:click={() => selectApproval(approval)}
        >
          <div class="card-header">
            <div class="approval-status">
              <span class="status-icon">{getStatusIcon(approval.status)}</span>
              <span class="priority-badge {getPriorityClass(approval.priority)}">
                {approval.priority.toUpperCase()}
              </span>
            </div>
            <span class="approval-time">{formatTimeAgo(approval.requestedAt)}</span>
          </div>

          <div class="card-body">
            <h3 class="approval-title">{approval.title}</h3>
            <p class="approval-description">{approval.description}</p>

            <div class="approval-meta">
              <span class="meta-item">
                <span class="meta-label">PROJECT:</span>
                {approval.projectName}
              </span>
              <span class="meta-item">
                <span class="meta-label">ENV:</span>
                {approval.environment.toUpperCase()}
              </span>
              <span class="meta-item">
                <span class="meta-label">BY:</span>
                {approval.requestor.name}
              </span>
            </div>

            <div class="quality-checks">
              {#each approval.qualityChecks as check}
                <span class="quality-check {getQualityCheckClass(check.status)}">
                  <span class="check-icon">{getQualityCheckIcon(check.status)}</span>
                  {check.name}
                </span>
              {/each}
            </div>
          </div>

          {#if approval.status === 'pending'}
            <div class="card-actions">
              <Button
                variant="primary"
                size="small"
                on:click={(e) => {
                  e.stopPropagation();
                  approveRequest(approval.id);
                }}
              >
                APPROVE
              </Button>
              <Button
                variant="outline"
                size="small"
                on:click={(e) => {
                  e.stopPropagation();
                  showRejectDialogFor(approval.id);
                }}
              >
                REJECT
              </Button>
            </div>
          {/if}
        </div>
      {/each}

      {#if filteredApprovals.length === 0}
        <div class="empty-state">
          <Text muted>NO APPROVAL REQUESTS</Text>
          <Text size="small" muted>All clear! No pending approvals.</Text>
        </div>
      {/if}
    </div>

    <!-- Approval Details -->
    <div class="approval-details">
      {#if selectedApproval}
        <div class="details-header">
          <h2>APPROVAL DETAILS</h2>
          {#if selectedApproval.status === 'pending'}
            <div class="details-actions">
              <Button variant="primary" on:click={() => approveRequest(selectedApproval.id)}>
                APPROVE
              </Button>
              <Button variant="outline" on:click={() => showRejectDialogFor(selectedApproval.id)}>
                REJECT
              </Button>
              <Button variant="text" on:click={() => holdRequest(selectedApproval.id)}>
                HOLD
              </Button>
            </div>
          {/if}
        </div>

        <div class="details-content">
          <!-- Quality Gate Section -->
          <div class="details-section">
            <h3>QUALITY GATE CHECKS</h3>
            <div class="quality-details">
              {#each selectedApproval.qualityChecks as check}
                <div class="quality-row {getQualityCheckClass(check.status)}">
                  <div class="quality-name">
                    <span class="check-icon">{getQualityCheckIcon(check.status)}</span>
                    {check.name}
                  </div>
                  <div class="quality-value">
                    {#if check.value !== undefined}
                      {check.value}{check.threshold ? `/${check.threshold}` : ''}
                    {/if}
                  </div>
                  {#if check.details}
                    <div class="quality-details-text">{check.details}</div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>

          <!-- Changes Section -->
          {#if selectedApproval.changes && selectedApproval.changes.length > 0}
            <div class="details-section">
              <h3>CHANGES</h3>
              <div class="changes-list">
                {#each selectedApproval.changes as change}
                  <div class="change-item">
                    <span class="change-type {change.type}">{change.type.toUpperCase()}</span>
                    <span class="change-path">{change.path}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Request Information -->
          <div class="details-section">
            <h3>REQUEST INFORMATION</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">TYPE</span>
                <span class="info-value">{selectedApproval.type.toUpperCase()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">PRIORITY</span>
                <span class="info-value">{selectedApproval.priority.toUpperCase()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ENVIRONMENT</span>
                <span class="info-value">{selectedApproval.environment.toUpperCase()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">PROJECT</span>
                <span class="info-value">{selectedApproval.projectName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">REQUESTED BY</span>
                <span class="info-value">{selectedApproval.requestor.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">REQUESTED AT</span>
                <span class="info-value">
                  {new Date(selectedApproval.requestedAt).toLocaleString()}
                </span>
              </div>
              {#if selectedApproval.buildId}
                <div class="info-item">
                  <span class="info-label">BUILD ID</span>
                  <span class="info-value mono">{selectedApproval.buildId}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="empty-details">
          <Text muted>SELECT AN APPROVAL REQUEST TO VIEW DETAILS</Text>
        </div>
      {/if}
    </div>
  </div>

  <!-- Reject Dialog -->
  {#if showRejectDialog}
    <div class="dialog-overlay" on:click={() => (showRejectDialog = false)}>
      <div class="dialog" on:click|stopPropagation>
        <div class="dialog-header">
          <h2>REJECT APPROVAL REQUEST</h2>
        </div>
        <div class="dialog-body">
          <label for="reject-reason">REJECTION REASON *</label>
          <textarea
            id="reject-reason"
            bind:value={rejectReason}
            placeholder="Please provide a reason for rejection..."
            rows="4"
            class="reject-textarea"
          ></textarea>
        </div>
        <div class="dialog-actions">
          <Button variant="outline" on:click={() => (showRejectDialog = false)}>CANCEL</Button>
          <Button
            variant="primary"
            on:click={rejectRequest}
            disabled={!rejectReason.trim()}
          >
            REJECT
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .approvals-page {
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

  .stat-value.urgent {
    background: var(--fg);
    color: var(--bg);
    padding: 0 var(--space-2);
  }

  .stat-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  /* Filters */
  .filters-bar {
    display: flex;
    gap: var(--space-6);
    padding: var(--space-4) var(--space-8);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
    align-items: flex-end;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .filter-group label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .filter-select {
    height: var(--input-height);
    padding: 0 var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-14);
    color: var(--fg);
    outline: none;
    min-width: 120px;
    cursor: pointer;
  }

  .filter-stats {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  /* Content */
  .approvals-content {
    display: grid;
    grid-template-columns: 1fr 500px;
    height: calc(100vh - 180px);
  }

  /* Approvals List */
  .approvals-list {
    padding: var(--space-6);
    overflow-y: auto;
    border-right: var(--border-width) solid var(--border-color);
  }

  .approval-card {
    border: var(--border-width) solid var(--border-color);
    margin-bottom: var(--space-4);
    cursor: pointer;
    transition: var(--transition-base);
  }

  .approval-card:hover {
    background: var(--surface-1);
  }

  .approval-card.selected {
    border-color: var(--fg);
    background: var(--surface-1);
  }

  .card-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: var(--border-width) solid var(--divider);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .approval-status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .status-icon {
    font-size: var(--text-14);
  }

  .priority-badge {
    padding: 2px var(--space-2);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    border: var(--border-width) solid var(--fg);
  }

  .priority-badge.priority-urgent {
    background: var(--fg);
    color: var(--bg);
  }

  .priority-badge.priority-high {
    border-color: var(--fg);
  }

  .approval-time {
    font-size: var(--text-11);
    color: var(--muted);
  }

  .card-body {
    padding: var(--space-4);
  }

  .approval-title {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    margin: 0 0 var(--space-2) 0;
  }

  .approval-description {
    font-size: var(--text-14);
    color: var(--muted);
    margin: 0 0 var(--space-3) 0;
  }

  .approval-meta {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-3);
    font-size: var(--text-12);
  }

  .meta-label {
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
    margin-right: var(--space-1);
  }

  .quality-checks {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .quality-check {
    padding: 2px var(--space-2);
    border: var(--border-width) solid var(--border-color);
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .quality-check.check-pass {
    background: var(--fg);
    color: var(--bg);
  }

  .quality-check.check-warn {
    border-color: var(--fg);
  }

  .quality-check.check-fail {
    background: var(--bg);
    border-color: var(--fg);
    text-decoration: line-through;
  }

  .check-icon {
    font-size: var(--text-11);
  }

  .card-actions {
    padding: var(--space-3) var(--space-4);
    border-top: var(--border-width) solid var(--divider);
    display: flex;
    gap: var(--space-2);
  }

  /* Approval Details */
  .approval-details {
    overflow-y: auto;
    background: var(--surface-1);
  }

  .details-header {
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .details-header h2 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .details-actions {
    display: flex;
    gap: var(--space-2);
  }

  .details-content {
    padding: var(--space-6);
  }

  .details-section {
    margin-bottom: var(--space-8);
  }

  .details-section h3 {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
    padding-bottom: var(--space-2);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .quality-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .quality-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    border: var(--border-width) solid var(--border-color);
  }

  .quality-row.check-pass {
    background: var(--surface-1);
  }

  .quality-row.check-warn {
    border-color: var(--fg);
  }

  .quality-row.check-fail {
    background: var(--bg);
    border-color: var(--fg);
  }

  .quality-name {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--weight-medium);
  }

  .quality-value {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-14);
  }

  .quality-details-text {
    font-size: var(--text-12);
    color: var(--muted);
    width: 100%;
    margin-top: var(--space-1);
  }

  .changes-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .change-item {
    display: flex;
    gap: var(--space-3);
    font-size: var(--text-12);
    padding: var(--space-2) 0;
    border-bottom: var(--border-width) solid var(--divider);
  }

  .change-type {
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    min-width: 70px;
  }

  .change-type.added {
    color: var(--fg);
  }

  .change-type.modified {
    color: var(--muted);
  }

  .change-type.deleted {
    text-decoration: line-through;
  }

  .change-path {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-11);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .info-label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
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

  .empty-details {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
  }

  .empty-state {
    padding: var(--space-8);
    text-align: center;
  }

  /* Reject Dialog */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
  }

  .dialog {
    background: var(--bg);
    border: var(--border-width) solid var(--fg);
    max-width: 500px;
    width: 90%;
  }

  .dialog-header {
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .dialog-header h2 {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .dialog-body {
    padding: var(--space-6);
  }

  .dialog-body label {
    display: block;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-2);
  }

  .reject-textarea {
    width: 100%;
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-14);
    color: var(--fg);
    outline: none;
    resize: vertical;
  }

  .reject-textarea:focus {
    border-color: var(--fg);
  }

  .dialog-actions {
    padding: var(--space-4) var(--space-6);
    border-top: var(--border-width) solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
  }
</style>