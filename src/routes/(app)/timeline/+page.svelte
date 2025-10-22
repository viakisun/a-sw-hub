<script lang="ts">
  /**
   * Project Timeline Page
   * 5-year A-SW business plan Gantt chart visualization
   *
   * 연차별 기간:
   * - 1단계 1차년도: 2025년 9월 ~ 2025년 12월 (4개월)
   * - 1단계 2차년도: 2026년 1월 ~ 2026년 12월 (12개월)
   * - 1단계 3차년도: 2027년 1월 ~ 2027년 12월 (12개월)
   * - 2단계 1차년도: 2028년 1월 ~ 2028년 12월 (12개월)
   * - 2단계 2차년도: 2029년 1월 ~ 2029년 12월 (12개월)
   */

  import { onMount } from 'svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import { ganttData } from '$lib/data/ganttData';
  import { institutions } from '$lib/data/institutions';
  import { deliverables } from '$lib/data/deliverables';

  // View options
  type ViewMode = 'YEAR' | 'QUARTER' | 'MONTH';
  type GroupBy = 'INSTITUTION' | 'PHASE' | 'DELIVERABLE';

  let viewMode: ViewMode = 'QUARTER';
  let groupBy: GroupBy = 'PHASE';
  let selectedYear = 2025;
  let showMilestones = true;
  let showProgress = true;
  let expandedGroups = new Set<string>();

  // Timeline configuration (Project starts Sept 2025)
  const projectStartDate = new Date(2025, 8, 1); // September 1, 2025
  const projectEndDate = new Date(2029, 11, 31); // December 31, 2029
  const startYear = 2025;
  const endYear = 2029;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Phase and year mapping
  const phaseInfo = [
    { phase: 1, year: 1, label: '1단계 1차년도', period: '2025.09-12', yearNum: 2025 },
    { phase: 1, year: 2, label: '1단계 2차년도', period: '2026.01-12', yearNum: 2026 },
    { phase: 1, year: 3, label: '1단계 3차년도', period: '2027.01-12', yearNum: 2027 },
    { phase: 2, year: 4, label: '2단계 1차년도', period: '2028.01-12', yearNum: 2028 },
    { phase: 2, year: 5, label: '2단계 2차년도', period: '2029.01-12', yearNum: 2029 },
  ];

  // Calculate timeline positions based on project timeline
  function getTimelinePosition(date: Date): number {
    const totalDays = Math.floor((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceStart = Math.floor((date.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100));
  }

  function getTaskWidth(startDate: Date, endDate: Date): number {
    const totalDays = Math.floor((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const taskDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, (taskDays / totalDays) * 100);
  }

  function toggleGroup(groupId: string) {
    if (expandedGroups.has(groupId)) {
      expandedGroups.delete(groupId);
    } else {
      expandedGroups.add(groupId);
    }
    expandedGroups = expandedGroups;
  }

  function getProgressChar(progress: number): string {
    if (progress >= 100) return '█';
    if (progress >= 75) return '▓';
    if (progress >= 50) return '▒';
    if (progress >= 25) return '░';
    return '·';
  }

  function getStatusIndicator(status: string): string {
    switch(status) {
      case 'completed': return '■';
      case 'in-progress': return '▣';
      case 'planned': return '□';
      case 'delayed': return '▲';
      default: return '·';
    }
  }

  function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // Get current date position for today marker
  const todayPosition = getTimelinePosition(new Date());

  // Expand first few groups by default
  onMount(() => {
    ganttData.forEach((task, index) => {
      if (index < 3 && task.children) {
        expandedGroups.add(task.id);
      }
    });
    expandedGroups = expandedGroups;
  });
</script>

<div class="timeline-page">
  <!-- Header -->
  <div class="page-header">
    <div class="header-content">
      <Heading level={1}>PROJECT TIMELINE</Heading>
      <Text muted>A-SW 5-YEAR BUSINESS PLAN (2025.09 - 2029.12)</Text>
    </div>

    <div class="header-stats">
      <div class="stat">
        <span class="stat-value">2</span>
        <span class="stat-label">PHASES</span>
      </div>
      <div class="stat">
        <span class="stat-value">5</span>
        <span class="stat-label">YEARS</span>
      </div>
      <div class="stat">
        <span class="stat-value">5</span>
        <span class="stat-label">INSTITUTIONS</span>
      </div>
      <div class="stat">
        <span class="stat-value">136</span>
        <span class="stat-label">DELIVERABLES</span>
      </div>
    </div>
  </div>

  <!-- Controls -->
  <div class="controls-bar">
    <div class="control-group">
      <label>VIEW</label>
      <div class="button-group">
        {#each ['YEAR', 'QUARTER', 'MONTH'] as mode}
          <button
            class="view-btn"
            class:active={viewMode === mode}
            on:click={() => viewMode = mode as ViewMode}
            type="button"
          >
            {mode}
          </button>
        {/each}
      </div>
    </div>

    <div class="control-group">
      <label>GROUP BY</label>
      <div class="button-group">
        {#each ['INSTITUTION', 'PHASE', 'DELIVERABLE'] as group}
          <button
            class="view-btn"
            class:active={groupBy === group}
            on:click={() => groupBy = group as GroupBy}
            type="button"
          >
            {group}
          </button>
        {/each}
      </div>
    </div>

    <div class="control-group">
      <label>OPTIONS</label>
      <div class="checkbox-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={showMilestones}
          />
          <span>{showMilestones ? '■' : '□'} MILESTONES</span>
        </label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={showProgress}
          />
          <span>{showProgress ? '■' : '□'} PROGRESS</span>
        </label>
      </div>
    </div>

    <div class="control-group">
      <Button variant="outline" size="small">
        ↓ EXPORT
      </Button>
    </div>
  </div>

  <!-- Timeline Grid -->
  <div class="timeline-container">
    <!-- Phase Indicator Bar -->
    <div class="phase-indicator-bar">
      <div class="task-column-header">PHASE / YEAR</div>
      <div class="phase-scale">
        <div class="phase-block phase-1" style="width: 60%">
          【1단계】 핵심 기술 개발 (2025.09 - 2027.12)
        </div>
        <div class="phase-block phase-2" style="width: 40%">
          【2단계】 통합 검증 (2028.01 - 2029.12)
        </div>
      </div>
    </div>

    <!-- Timeline Header -->
    <div class="timeline-header">
      <div class="task-column-header">TASK / DELIVERABLE</div>
      <div class="timeline-scale">
        {#if viewMode === 'YEAR'}
          {#each phaseInfo as info}
            <div class="time-unit year phase-{info.phase}" class:current={info.yearNum === new Date().getFullYear()}>
              <div class="year-label">{info.label}</div>
              <div class="year-period">{info.period}</div>
            </div>
          {/each}
        {:else if viewMode === 'QUARTER'}
          {#each years as year, yearIndex}
            {#if year === 2025}
              <!-- 2025년은 Q3, Q4만 표시 (9월-12월) -->
              {#each ['Q3', 'Q4'] as quarter}
                <div class="time-unit quarter">
                  {year}-{quarter}
                </div>
              {/each}
            {:else}
              <!-- 나머지 연도는 모든 분기 표시 -->
              {#each quarters as quarter}
                <div class="time-unit quarter">
                  {year}-{quarter}
                </div>
              {/each}
            {/if}
          {/each}
        {:else}
          {#each years as year}
            {#if year === 2025}
              <!-- 2025년은 9월-12월만 표시 -->
              {#each ['SEP', 'OCT', 'NOV', 'DEC'] as month}
                <div class="time-unit month">
                  {month}
                </div>
              {/each}
            {:else}
              <!-- 나머지 연도는 모든 월 표시 -->
              {#each months as month}
                <div class="time-unit month">
                  {month.slice(0, 3)}
                </div>
              {/each}
            {/if}
          {/each}
        {/if}
      </div>
    </div>

    <!-- Today Marker -->
    <div class="today-marker" style="left: calc(300px + {todayPosition}%)">
      <div class="today-line"></div>
      <div class="today-label">TODAY</div>
    </div>

    <!-- Tasks -->
    <div class="timeline-body">
      {#each ganttData as task}
        <div class="task-group" class:expanded={expandedGroups.has(task.id)}>
          <!-- Group Header -->
          <div class="task-row group-header">
            <button
              class="task-name"
              on:click={() => toggleGroup(task.id)}
              type="button"
            >
              <span class="expand-icon">
                {expandedGroups.has(task.id) ? '▼' : '▶'}
              </span>
              <span class="task-title">{task.name}</span>
              {#if task.institution}
                <span class="task-meta">[{task.institution}]</span>
              {/if}
            </button>
            <div class="timeline-bars">
              <div
                class="task-bar parent"
                style="left: {getTimelinePosition(task.startDate)}%; width: {getTaskWidth(task.startDate, task.endDate)}%"
              >
                {#if showProgress}
                  <div class="progress-fill" style="width: {task.progress}%"></div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Child Tasks -->
          {#if expandedGroups.has(task.id) && task.children}
            {#each task.children as child}
              <div class="task-row child">
                <div class="task-name">
                  <span class="indent">└─</span>
                  <span class="status-icon">{getStatusIndicator(child.status || 'planned')}</span>
                  <span class="task-title">{child.name}</span>
                  {#if child.deliverableId}
                    <span class="task-meta">[{child.deliverableId}]</span>
                  {/if}
                </div>
                <div class="timeline-bars">
                  <div
                    class="task-bar child status-{child.status || 'planned'}"
                    style="left: {getTimelinePosition(child.startDate)}%; width: {getTaskWidth(child.startDate, child.endDate)}%"
                  >
                    {#if showProgress}
                      <div class="progress-fill" style="width: {child.progress}%"></div>
                    {/if}
                  </div>

                  {#if showMilestones && child.milestones}
                    {#each child.milestones as milestone}
                      <div
                        class="milestone"
                        style="left: {getTimelinePosition(milestone.date)}%"
                        title={milestone.name}
                      >
                        ◆
                      </div>
                    {/each}
                  {/if}
                </div>
              </div>

              <!-- Sub-children (if any) -->
              {#if child.children}
                {#each child.children as subchild}
                  <div class="task-row subchild">
                    <div class="task-name">
                      <span class="indent">    └─</span>
                      <span class="status-icon">{getStatusIndicator(subchild.status || 'planned')}</span>
                      <span class="task-title">{subchild.name}</span>
                    </div>
                    <div class="timeline-bars">
                      <div
                        class="task-bar subchild status-{subchild.status || 'planned'}"
                        style="left: {getTimelinePosition(subchild.startDate)}%; width: {getTaskWidth(subchild.startDate, subchild.endDate)}%"
                      >
                        {#if showProgress}
                          <div class="progress-fill" style="width: {subchild.progress}%"></div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              {/if}
            {/each}
          {/if}
        </div>
      {/each}
    </div>

    <!-- Legend -->
    <div class="timeline-legend">
      <div class="legend-title">LEGEND</div>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-icon">■</span>
          <span>COMPLETED</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon">▣</span>
          <span>IN PROGRESS</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon">□</span>
          <span>PLANNED</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon">▲</span>
          <span>DELAYED</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon">◆</span>
          <span>MILESTONE</span>
        </div>
        <div class="legend-item">
          <div class="progress-sample">
            <span>█▓▒░·</span>
          </div>
          <span>PROGRESS</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Summary Section -->
  <div class="summary-section">
    <div class="summary-grid">
      {#each institutions as institution}
        <div class="institution-card">
          <div class="institution-header">
            <h3>{institution.code}</h3>
            <span class="institution-type">{institution.type}</span>
          </div>
          <div class="institution-stats">
            <div class="stat-item">
              <span class="stat-label">DELIVERABLES</span>
              <span class="stat-value">
                {deliverables.filter(d => d.institutionCode === institution.code).length}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">PROGRESS</span>
              <span class="stat-value">
                {Math.round(
                  deliverables
                    .filter(d => d.institutionCode === institution.code)
                    .reduce((sum, d) => sum + (d.progress || 0), 0) /
                  deliverables.filter(d => d.institutionCode === institution.code).length
                )}%
              </span>
            </div>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: {Math.round(
                deliverables
                  .filter(d => d.institutionCode === institution.code)
                  .reduce((sum, d) => sum + (d.progress || 0), 0) /
                deliverables.filter(d => d.institutionCode === institution.code).length
              )}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .timeline-page {
    min-height: 100vh;
    background: var(--bg);
  }

  /* Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6) var(--space-8);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .header-stats {
    display: flex;
    gap: var(--space-6);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .stat-value {
    font-size: var(--text-24);
    font-weight: var(--weight-bold);
  }

  .stat-label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  /* Controls */
  .controls-bar {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    padding: var(--space-4) var(--space-8);
    background: var(--surface-1);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .control-group label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--muted);
  }

  .button-group {
    display: flex;
    border: var(--border-width) solid var(--border-color);
  }

  .view-btn {
    padding: var(--space-2) var(--space-3);
    background: var(--bg);
    border: none;
    border-right: var(--border-width) solid var(--border-color);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    transition: var(--transition-base);
  }

  .view-btn:last-child {
    border-right: none;
  }

  .view-btn:hover {
    background: var(--surface-2);
  }

  .view-btn.active {
    background: var(--fg);
    color: var(--bg);
  }

  .checkbox-group {
    display: flex;
    gap: var(--space-4);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Timeline Container */
  .timeline-container {
    position: relative;
    background: var(--bg);
    border: var(--border-width) solid var(--border-color);
    margin: var(--space-6);
    overflow-x: auto;
  }

  /* Phase Indicator Bar */
  .phase-indicator-bar {
    display: flex;
    background: var(--surface-2);
    border-bottom: 2px solid var(--fg);
    position: sticky;
    top: 0;
    z-index: 11;
  }

  .phase-scale {
    flex: 1;
    display: flex;
    min-width: 800px;
  }

  .phase-block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3);
    font-size: var(--text-12);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-wide);
    border-right: 2px solid var(--fg);
    text-transform: uppercase;
  }

  .phase-block.phase-1 {
    background: var(--fg);
    color: var(--bg);
  }

  .phase-block.phase-2 {
    background: var(--surface-1);
    color: var(--fg);
  }

  /* Timeline Header */
  .timeline-header {
    display: flex;
    background: var(--fg);
    color: var(--bg);
    border-bottom: 2px solid var(--fg);
    position: sticky;
    top: 40px;
    z-index: 10;
  }

  .timeline-header .time-unit.year {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-2);
  }

  .year-label {
    font-size: var(--text-11);
    font-weight: var(--weight-bold);
  }

  .year-period {
    font-size: var(--text-10);
    opacity: 0.8;
  }

  .task-column-header {
    width: 300px;
    min-width: 300px;
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    border-right: var(--border-width) solid var(--bg);
  }

  .timeline-scale {
    flex: 1;
    display: flex;
    min-width: 800px;
  }

  .time-unit {
    flex: 1;
    padding: var(--space-3);
    font-size: var(--text-10);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-align: center;
    border-right: var(--border-width) solid var(--bg);
  }

  .time-unit.current {
    background: var(--bg);
    color: var(--fg);
  }

  /* Today Marker */
  .today-marker {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 5;
    pointer-events: none;
  }

  .today-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--fg);
    opacity: 0.5;
  }

  .today-label {
    position: absolute;
    top: -20px;
    left: -20px;
    padding: var(--space-1) var(--space-2);
    background: var(--fg);
    color: var(--bg);
    font-size: var(--text-10);
    font-weight: var(--weight-semibold);
  }

  /* Timeline Body */
  .timeline-body {
    position: relative;
  }

  .task-group {
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .task-row {
    display: flex;
    min-height: 40px;
    border-bottom: var(--border-width) solid var(--surface-2);
  }

  .task-row.group-header {
    background: var(--surface-1);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .task-row.child {
    background: var(--bg);
  }

  .task-row.subchild {
    background: var(--surface-1);
    opacity: 0.8;
  }

  .task-name {
    width: 300px;
    min-width: 300px;
    padding: var(--space-2) var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-12);
    border-right: var(--border-width) solid var(--border-color);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-family: var(--font-mono);
  }

  .group-header .task-name {
    font-weight: var(--weight-semibold);
  }

  .expand-icon {
    font-size: var(--text-10);
    width: 12px;
  }

  .task-title {
    flex: 1;
  }

  .task-meta {
    font-size: var(--text-10);
    color: var(--muted);
  }

  .status-icon {
    font-size: var(--text-10);
  }

  .indent {
    color: var(--muted);
    font-family: var(--font-mono);
  }

  /* Timeline Bars */
  .timeline-bars {
    flex: 1;
    position: relative;
    min-width: 800px;
  }

  .task-bar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
    background: var(--fg);
    border: var(--border-width) solid var(--fg);
    transition: var(--transition-base);
  }

  .task-bar.parent {
    height: 24px;
    background: var(--fg);
  }

  .task-bar.child {
    height: 18px;
  }

  .task-bar.subchild {
    height: 14px;
    opacity: 0.7;
  }

  .task-bar.status-completed {
    background: var(--fg);
  }

  .task-bar.status-in-progress {
    background: repeating-linear-gradient(
      45deg,
      var(--fg),
      var(--fg) 4px,
      var(--bg) 4px,
      var(--bg) 8px
    );
  }

  .task-bar.status-planned {
    background: var(--bg);
  }

  .task-bar.status-delayed {
    background: var(--bg);
    border-style: dashed;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--fg);
    opacity: 0.3;
  }

  .milestone {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--text-14);
    color: var(--fg);
  }

  /* Legend */
  .timeline-legend {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    padding: var(--space-4);
    background: var(--surface-1);
    border-top: var(--border-width) solid var(--border-color);
  }

  .legend-title {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .legend-items {
    display: flex;
    gap: var(--space-4);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-11);
  }

  .legend-icon {
    font-size: var(--text-12);
  }

  .progress-sample {
    font-family: var(--font-mono);
  }

  /* Summary Section */
  .summary-section {
    padding: var(--space-6);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .institution-card {
    padding: var(--space-4);
    background: var(--surface-1);
    border: var(--border-width) solid var(--border-color);
  }

  .institution-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .institution-header h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .institution-type {
    font-size: var(--text-10);
    color: var(--muted);
  }

  .institution-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-3);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .stat-item .stat-label {
    font-size: var(--text-10);
  }

  .stat-item .stat-value {
    font-size: var(--text-16);
    font-weight: var(--weight-semibold);
  }

  .progress-bar {
    height: 8px;
    background: var(--surface-2);
    border: var(--border-width) solid var(--border-color);
    position: relative;
  }

  .progress-bar .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--fg);
    opacity: 1;
  }
</style>