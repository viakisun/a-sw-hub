<script lang="ts">
  /**
   * Dashboard Page
   * Main dashboard with stats, charts, and activity feed
   * Monochrome design with Chart.js
   */

  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { projectsStore } from '$lib/stores/projectsStore';
  import { buildsStore, buildMetrics } from '$lib/stores/buildsStore';
  import Stat from '$lib/components/cards/Stat.svelte';
  import Panel from '$lib/components/cards/Panel.svelte';

  let lineChartCanvas: HTMLCanvasElement;
  let doughnutChartCanvas: HTMLCanvasElement;
  let lineChart: Chart;
  let doughnutChart: Chart;

  // Mock activity data
  const activities = [
    { id: 1, action: 'BUILD STARTED', project: 'CropMonitor', time: '2 min ago', status: 'running' },
    { id: 2, action: 'DEPLOYMENT COMPLETED', project: 'IrrigationControl', time: '15 min ago', status: 'success' },
    { id: 3, action: 'APPROVAL REQUESTED', project: 'SoilAnalyzer', time: '1 hour ago', status: 'pending' },
    { id: 4, action: 'BUILD FAILED', project: 'WeatherTracker', time: '2 hours ago', status: 'failed' },
    { id: 5, action: 'PROJECT UPDATED', project: 'HarvestOptimizer', time: '3 hours ago', status: 'success' },
  ];

  onMount(async () => {
    await projectsStore.loadProjects();
    await buildsStore.loadBuilds();

    // Initialize Line Chart - Build Trends
    if (lineChartCanvas) {
      const ctx = lineChartCanvas.getContext('2d');
      if (ctx) {
        lineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [
              {
                label: 'SUCCESSFUL',
                data: [12, 19, 15, 25, 22, 30, 28],
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
              },
              {
                label: 'FAILED',
                data: [3, 5, 2, 3, 1, 4, 2],
                borderColor: '#000000',
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderDash: [5, 5],
                tension: 0.1,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  boxWidth: 20,
                  padding: 15,
                  font: {
                    size: 11,
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                    weight: '500'
                  },
                  color: '#000000'
                }
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.08)',
                  drawBorder: false
                },
                ticks: {
                  font: {
                    size: 10
                  },
                  color: 'rgba(0, 0, 0, 0.6)'
                }
              },
              y: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.08)',
                  drawBorder: false
                },
                ticks: {
                  font: {
                    size: 10
                  },
                  color: 'rgba(0, 0, 0, 0.6)'
                }
              }
            }
          }
        });
      }
    }

    // Initialize Doughnut Chart - Language Distribution
    if (doughnutChartCanvas) {
      const ctx = doughnutChartCanvas.getContext('2d');
      if (ctx) {
        doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['TYPESCRIPT', 'PYTHON', 'JAVA', 'GO', 'OTHER'],
            datasets: [{
              data: [35, 25, 20, 15, 5],
              backgroundColor: [
                '#000000',
                'rgba(0, 0, 0, 0.8)',
                'rgba(0, 0, 0, 0.6)',
                'rgba(0, 0, 0, 0.4)',
                'rgba(0, 0, 0, 0.2)'
              ],
              borderColor: '#FFFFFF',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  boxWidth: 12,
                  padding: 10,
                  font: {
                    size: 11,
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                    weight: '500'
                  },
                  color: '#000000'
                }
              }
            }
          }
        });
      }
    }
  });

  onDestroy(() => {
    if (lineChart) lineChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
  });
</script>

<svelte:head>
  <title>Dashboard | A-SW HUB</title>
</svelte:head>

<div class="dashboard">
  <!-- Stats Grid -->
  <div class="stats-grid">
    <Stat
      label="TOTAL PROJECTS"
      value="142"
      trend="up"
      trendValue="12% FROM LAST MONTH"
    />
    <Stat
      label="BUILDS TODAY"
      value={$buildMetrics.total.toString()}
      trend={$buildMetrics.failed > 2 ? 'down' : 'up'}
      trendValue={`${$buildMetrics.running} RUNNING`}
    />
    <Stat
      label="SUCCESS RATE"
      value={`${$buildMetrics.successRate}%`}
      trend={$buildMetrics.successRate > 90 ? 'up' : 'down'}
      trendValue="LAST 24 HOURS"
    />
    <Stat
      label="ACTIVE USERS"
      value="47"
      trend="neutral"
      trendValue="CURRENTLY ONLINE"
    />
  </div>

  <!-- Charts Row -->
  <div class="charts-row">
    <Panel title="BUILD TRENDS - LAST 7 DAYS">
      <div class="chart-container">
        <canvas bind:this={lineChartCanvas}></canvas>
      </div>
    </Panel>

    <Panel title="LANGUAGE DISTRIBUTION">
      <div class="chart-container">
        <canvas bind:this={doughnutChartCanvas}></canvas>
      </div>
    </Panel>
  </div>

  <!-- Activity Feed -->
  <Panel title="RECENT ACTIVITY">
    <div class="activity-feed">
      {#each activities as activity}
        <div class="activity-item">
          <div class="activity-item__indicator activity-item__indicator--{activity.status}"></div>
          <div class="activity-item__content">
            <div class="activity-item__action">{activity.action}</div>
            <div class="activity-item__project">{activity.project}</div>
          </div>
          <div class="activity-item__time">{activity.time}</div>
        </div>
      {/each}
    </div>

    <div slot="actions">
      <button class="view-all-btn">VIEW ALL →</button>
    </div>
  </Panel>
</div>

<style>
  .dashboard {
    padding: var(--space-6);
    max-width: 1400px;
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .charts-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .chart-container {
    height: 300px;
    padding: var(--space-2);
  }

  .activity-feed {
    display: flex;
    flex-direction: column;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--divider);
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-item__indicator {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  .activity-item__indicator--running {
    background: var(--fg);
    animation: pulse 2s infinite;
  }

  .activity-item__indicator--success {
    background: var(--fg);
  }

  .activity-item__indicator--pending {
    background: var(--muted);
  }

  .activity-item__indicator--failed {
    background: var(--subtle);
  }

  .activity-item__content {
    flex: 1;
  }

  .activity-item__action {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .activity-item__project {
    font-size: var(--text-12);
    color: var(--muted);
    margin-top: 2px;
  }

  .activity-item__time {
    font-size: var(--text-11);
    color: var(--subtle);
    text-transform: uppercase;
  }

  .view-all-btn {
    background: none;
    border: none;
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    padding: var(--space-2);
    transition: opacity var(--transition-fast);
  }

  .view-all-btn:hover {
    opacity: 0.7;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .charts-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: var(--space-4);
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>