<script lang="ts">
  /**
   * Quality Gate Page
   * Comprehensive code quality analysis and reporting
   */

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';

  // Types
  interface QualityReport {
    projectId: string;
    projectName: string;
    overallScore: number;
    grade: string;
    lastAnalysis: Date;
    codeQuality: {
      score: number;
      issues: number;
      duplicateLines: number;
      complexFunctions: Array<{
        name: string;
        complexity: number;
        file: string;
        line: number;
      }>;
    };
    security: {
      score: number;
      vulnerabilities: {
        high: number;
        medium: number;
        low: number;
      };
      hotspots: Array<{
        type: string;
        severity: string;
        file: string;
        line: number;
        description: string;
      }>;
    };
    coverage: {
      score: number;
      lines: number;
      coveredLines: number;
      branches: number;
      coveredBranches: number;
      uncoveredFiles: Array<{
        file: string;
        coverage: number;
        lines: number;
      }>;
    };
    dependencies: {
      score: number;
      total: number;
      outdated: number;
      vulnerable: number;
      licenses: Array<{
        license: string;
        count: number;
        compatible: boolean;
      }>;
    };
  }

  let selectedProject: QualityReport | null = null;
  let projects: QualityReport[] = [];
  let qualityTrend: Array<{date: string; score: number}> = [];
  let selectedTab: 'overview' | 'code' | 'security' | 'coverage' | 'dependencies' = 'overview';

  // Generate mock data
  function generateMockReports(): QualityReport[] {
    return [
      {
        projectId: '1',
        projectName: 'smart-tractor-control',
        overallScore: 82,
        grade: 'B+',
        lastAnalysis: new Date(),
        codeQuality: {
          score: 85,
          issues: 12,
          duplicateLines: 234,
          complexFunctions: [
            { name: 'calculateOptimalPath', complexity: 28, file: 'src/navigation/pathfinder.py', line: 145 },
            { name: 'processTerrainData', complexity: 24, file: 'src/sensors/terrain.py', line: 67 },
            { name: 'adjustSteeringAngle', complexity: 18, file: 'src/control/steering.py', line: 234 }
          ]
        },
        security: {
          score: 72,
          vulnerabilities: { high: 3, medium: 7, low: 15 },
          hotspots: [
            { type: 'SQL Injection', severity: 'HIGH', file: 'src/database/queries.py', line: 89, description: 'Unsanitized user input in SQL query' },
            { type: 'Path Traversal', severity: 'HIGH', file: 'src/files/upload.py', line: 45, description: 'User input not validated for path traversal' },
            { type: 'Weak Crypto', severity: 'MEDIUM', file: 'src/auth/hash.py', line: 12, description: 'MD5 hash used for password storage' }
          ]
        },
        coverage: {
          score: 78,
          lines: 12456,
          coveredLines: 9716,
          branches: 3421,
          coveredBranches: 2668,
          uncoveredFiles: [
            { file: 'src/utils/helpers.py', coverage: 45, lines: 234 },
            { file: 'src/legacy/old_controller.py', coverage: 12, lines: 567 },
            { file: 'src/experimental/ml_model.py', coverage: 34, lines: 890 }
          ]
        },
        dependencies: {
          score: 94,
          total: 156,
          outdated: 8,
          vulnerable: 2,
          licenses: [
            { license: 'MIT', count: 89, compatible: true },
            { license: 'Apache-2.0', count: 45, compatible: true },
            { license: 'GPL-3.0', count: 2, compatible: false },
            { license: 'BSD-3-Clause', count: 20, compatible: true }
          ]
        }
      },
      {
        projectId: '2',
        projectName: 'irrigation-controller',
        overallScore: 91,
        grade: 'A-',
        lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 2),
        codeQuality: {
          score: 92,
          issues: 5,
          duplicateLines: 89,
          complexFunctions: [
            { name: 'optimizeWaterFlow', complexity: 15, file: 'src/flow/optimizer.py', line: 234 }
          ]
        },
        security: {
          score: 95,
          vulnerabilities: { high: 0, medium: 2, low: 8 },
          hotspots: []
        },
        coverage: {
          score: 88,
          lines: 8234,
          coveredLines: 7246,
          branches: 2145,
          coveredBranches: 1887,
          uncoveredFiles: [
            { file: 'src/debug/logger.py', coverage: 23, lines: 123 }
          ]
        },
        dependencies: {
          score: 90,
          total: 89,
          outdated: 12,
          vulnerable: 0,
          licenses: [
            { license: 'MIT', count: 67, compatible: true },
            { license: 'Apache-2.0', count: 22, compatible: true }
          ]
        }
      }
    ];
  }

  function generateTrendData() {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        score: 70 + Math.random() * 20 + (30 - i) * 0.3
      });
    }
    return data;
  }

  function getGradeColor(grade: string) {
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    if (grade.startsWith('D')) return 'grade-d';
    return 'grade-f';
  }

  function getSeverityColor(severity: string) {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  }

  function calculateBarHeight(value: number, max: number = 100): string {
    return `${(value / max) * 100}%`;
  }

  onMount(() => {
    projects = generateMockReports();
    selectedProject = projects[0];
    qualityTrend = generateTrendData();
  });
</script>

<div class="quality-page">
  <!-- Header -->
  <div class="page-header">
    <Heading level={1}>QUALITY GATE</Heading>
    <div class="header-actions">
      <Button variant="outline">CONFIGURE RULES</Button>
      <Button variant="primary">RUN ANALYSIS</Button>
    </div>
  </div>

  <!-- Project Selector -->
  <div class="project-selector">
    <div class="selector-group">
      <label>PROJECT</label>
      <select
        class="project-select"
        on:change={(e) => {
          selectedProject = projects.find(p => p.projectName === e.target.value) || null;
        }}
      >
        {#each projects as project}
          <option value={project.projectName}>{project.projectName.toUpperCase()}</option>
        {/each}
      </select>
    </div>

    {#if selectedProject}
      <div class="analysis-info">
        <Text size="small" muted>
          Last analyzed: {new Date(selectedProject.lastAnalysis).toLocaleString()}
        </Text>
      </div>
    {/if}
  </div>

  {#if selectedProject}
    <!-- Overall Score Dashboard -->
    <div class="score-dashboard">
      <div class="overall-score-card">
        <div class="score-circle {getGradeColor(selectedProject.grade)}">
          <div class="score-value">{selectedProject.overallScore}</div>
          <div class="score-grade">{selectedProject.grade}</div>
        </div>
        <div class="score-label">OVERALL SCORE</div>
      </div>

      <div class="score-categories">
        <div class="score-category">
          <div class="category-header">
            <span class="category-name">CODE QUALITY</span>
            <span class="category-score">{selectedProject.codeQuality.score}%</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: {selectedProject.codeQuality.score}%"></div>
          </div>
          <div class="category-meta">
            <span>{selectedProject.codeQuality.issues} issues</span>
          </div>
        </div>

        <div class="score-category">
          <div class="category-header">
            <span class="category-name">SECURITY</span>
            <span class="category-score">{selectedProject.security.score}%</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: {selectedProject.security.score}%"></div>
          </div>
          <div class="category-meta">
            <span>{selectedProject.security.vulnerabilities.high} high vulnerabilities</span>
          </div>
        </div>

        <div class="score-category">
          <div class="category-header">
            <span class="category-name">TEST COVERAGE</span>
            <span class="category-score">{selectedProject.coverage.score}%</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: {selectedProject.coverage.score}%"></div>
          </div>
          <div class="category-meta">
            <span>{selectedProject.coverage.coveredLines}/{selectedProject.coverage.lines} lines</span>
          </div>
        </div>

        <div class="score-category">
          <div class="category-header">
            <span class="category-name">DEPENDENCIES</span>
            <span class="category-score">{selectedProject.dependencies.score}%</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: {selectedProject.dependencies.score}%"></div>
          </div>
          <div class="category-meta">
            <span>{selectedProject.dependencies.outdated} outdated packages</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab"
        class:active={selectedTab === 'overview'}
        on:click={() => selectedTab = 'overview'}
      >
        OVERVIEW
      </button>
      <button
        class="tab"
        class:active={selectedTab === 'code'}
        on:click={() => selectedTab = 'code'}
      >
        CODE QUALITY
      </button>
      <button
        class="tab"
        class:active={selectedTab === 'security'}
        on:click={() => selectedTab = 'security'}
      >
        SECURITY
      </button>
      <button
        class="tab"
        class:active={selectedTab === 'coverage'}
        on:click={() => selectedTab = 'coverage'}
      >
        COVERAGE
      </button>
      <button
        class="tab"
        class:active={selectedTab === 'dependencies'}
        on:click={() => selectedTab = 'dependencies'}
      >
        DEPENDENCIES
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      {#if selectedTab === 'overview'}
        <div class="overview-content">
          <!-- Quality Trend Chart -->
          <div class="trend-section">
            <h3>QUALITY TREND (30 DAYS)</h3>
            <div class="trend-chart">
              <div class="chart-grid">
                {#each [100, 80, 60, 40, 20, 0] as yValue}
                  <div class="grid-line">
                    <span class="grid-label">{yValue}</span>
                  </div>
                {/each}
              </div>
              <div class="chart-bars">
                {#each qualityTrend.slice(-30) as point}
                  <div class="trend-bar" style="height: {calculateBarHeight(point.score)}">
                    <div class="bar-tooltip">{Math.round(point.score)}</div>
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- Quality Criteria -->
          <div class="criteria-section">
            <h3>QUALITY CRITERIA</h3>
            <div class="criteria-grid">
              <div class="criterion">
                <div class="criterion-name">Minimum Coverage</div>
                <div class="criterion-value">70%</div>
                <div class="criterion-status pass">✓ PASS</div>
              </div>
              <div class="criterion">
                <div class="criterion-name">Security Vulnerabilities</div>
                <div class="criterion-value">0 High</div>
                <div class="criterion-status fail">✕ FAIL</div>
              </div>
              <div class="criterion">
                <div class="criterion-name">Code Duplication</div>
                <div class="criterion-value">&lt; 5%</div>
                <div class="criterion-status pass">✓ PASS</div>
              </div>
              <div class="criterion">
                <div class="criterion-name">Complexity</div>
                <div class="criterion-value">&lt; 20</div>
                <div class="criterion-status warn">⚠ WARN</div>
              </div>
            </div>
          </div>

          <!-- AI Recommendations -->
          <div class="recommendations-section">
            <h3>AI RECOMMENDATIONS</h3>
            <div class="recommendations">
              <div class="recommendation">
                <div class="rec-icon">💡</div>
                <div class="rec-content">
                  <div class="rec-title">Split calculateOptimalPath function</div>
                  <div class="rec-desc">This function has complexity of 28. Breaking it into 3 smaller functions would reduce complexity by 40%</div>
                </div>
              </div>
              <div class="recommendation">
                <div class="rec-icon">🔒</div>
                <div class="rec-content">
                  <div class="rec-title">Update numpy to 1.21.0</div>
                  <div class="rec-desc">Current version has 2 known vulnerabilities. Updating would fix both security issues.</div>
                </div>
              </div>
              <div class="recommendation">
                <div class="rec-icon">🧪</div>
                <div class="rec-content">
                  <div class="rec-title">Add tests for src/utils/helpers.py</div>
                  <div class="rec-desc">This file has only 45% coverage. Adding 10 test cases would reach the 80% threshold.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'code'}
        <div class="code-content">
          <div class="code-metrics">
            <div class="metric-card">
              <div class="metric-value">{selectedProject.codeQuality.issues}</div>
              <div class="metric-label">TOTAL ISSUES</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{selectedProject.codeQuality.duplicateLines}</div>
              <div class="metric-label">DUPLICATE LINES</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{selectedProject.codeQuality.complexFunctions.length}</div>
              <div class="metric-label">COMPLEX FUNCTIONS</div>
            </div>
          </div>

          <div class="complex-functions">
            <h3>HIGH COMPLEXITY FUNCTIONS</h3>
            <div class="functions-table">
              <div class="table-header">
                <div class="table-cell">FUNCTION</div>
                <div class="table-cell">COMPLEXITY</div>
                <div class="table-cell">FILE</div>
                <div class="table-cell">LINE</div>
                <div class="table-cell">ACTION</div>
              </div>
              {#each selectedProject.codeQuality.complexFunctions as func}
                <div class="table-row">
                  <div class="table-cell mono">{func.name}()</div>
                  <div class="table-cell">
                    <span class="complexity-badge" class:high={func.complexity > 20}>
                      {func.complexity}
                    </span>
                  </div>
                  <div class="table-cell mono">{func.file}</div>
                  <div class="table-cell">{func.line}</div>
                  <div class="table-cell">
                    <Button variant="text" size="small">VIEW</Button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'security'}
        <div class="security-content">
          <div class="vulnerability-summary">
            <div class="vuln-card high">
              <div class="vuln-count">{selectedProject.security.vulnerabilities.high}</div>
              <div class="vuln-label">HIGH</div>
            </div>
            <div class="vuln-card medium">
              <div class="vuln-count">{selectedProject.security.vulnerabilities.medium}</div>
              <div class="vuln-label">MEDIUM</div>
            </div>
            <div class="vuln-card low">
              <div class="vuln-count">{selectedProject.security.vulnerabilities.low}</div>
              <div class="vuln-label">LOW</div>
            </div>
          </div>

          <div class="security-hotspots">
            <h3>SECURITY HOTSPOTS</h3>
            {#each selectedProject.security.hotspots as hotspot}
              <div class="hotspot-card {getSeverityColor(hotspot.severity)}">
                <div class="hotspot-header">
                  <span class="hotspot-type">{hotspot.type}</span>
                  <span class="hotspot-severity">{hotspot.severity}</span>
                </div>
                <div class="hotspot-location">
                  <span class="mono">{hotspot.file}:{hotspot.line}</span>
                </div>
                <div class="hotspot-desc">{hotspot.description}</div>
                <div class="hotspot-actions">
                  <Button variant="text" size="small">VIEW CODE</Button>
                  <Button variant="text" size="small">FIX SUGGESTION</Button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if selectedTab === 'coverage'}
        <div class="coverage-content">
          <div class="coverage-overview">
            <div class="coverage-metric">
              <div class="metric-header">LINE COVERAGE</div>
              <div class="metric-visual">
                <div class="coverage-ring">
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--divider)" stroke-width="10"/>
                    <circle
                      cx="60" cy="60" r="50" fill="none" stroke="var(--fg)" stroke-width="10"
                      stroke-dasharray={`${selectedProject.coverage.score * 3.14} 314`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div class="ring-value">{selectedProject.coverage.score}%</div>
                </div>
              </div>
              <div class="metric-details">
                {selectedProject.coverage.coveredLines} / {selectedProject.coverage.lines} lines
              </div>
            </div>

            <div class="coverage-metric">
              <div class="metric-header">BRANCH COVERAGE</div>
              <div class="metric-visual">
                <div class="coverage-ring">
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--divider)" stroke-width="10"/>
                    <circle
                      cx="60" cy="60" r="50" fill="none" stroke="var(--fg)" stroke-width="10"
                      stroke-dasharray={`${(selectedProject.coverage.coveredBranches / selectedProject.coverage.branches * 100) * 3.14} 314`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div class="ring-value">
                    {Math.round(selectedProject.coverage.coveredBranches / selectedProject.coverage.branches * 100)}%
                  </div>
                </div>
              </div>
              <div class="metric-details">
                {selectedProject.coverage.coveredBranches} / {selectedProject.coverage.branches} branches
              </div>
            </div>
          </div>

          <div class="uncovered-files">
            <h3>FILES WITH LOW COVERAGE</h3>
            <div class="files-list">
              {#each selectedProject.coverage.uncoveredFiles as file}
                <div class="file-item">
                  <div class="file-info">
                    <div class="file-name mono">{file.file}</div>
                    <div class="file-lines">{file.lines} lines</div>
                  </div>
                  <div class="file-coverage">
                    <div class="coverage-bar">
                      <div class="coverage-fill" style="width: {file.coverage}%"></div>
                    </div>
                    <span class="coverage-percent">{file.coverage}%</span>
                  </div>
                  <Button variant="text" size="small">ADD TESTS</Button>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'dependencies'}
        <div class="dependencies-content">
          <div class="dependency-stats">
            <div class="stat-card">
              <div class="stat-value">{selectedProject.dependencies.total}</div>
              <div class="stat-label">TOTAL PACKAGES</div>
            </div>
            <div class="stat-card outdated">
              <div class="stat-value">{selectedProject.dependencies.outdated}</div>
              <div class="stat-label">OUTDATED</div>
            </div>
            <div class="stat-card vulnerable">
              <div class="stat-value">{selectedProject.dependencies.vulnerable}</div>
              <div class="stat-label">VULNERABLE</div>
            </div>
          </div>

          <div class="license-analysis">
            <h3>LICENSE COMPATIBILITY</h3>
            <div class="licenses-grid">
              {#each selectedProject.dependencies.licenses as license}
                <div class="license-item" class:incompatible={!license.compatible}>
                  <div class="license-name">{license.license}</div>
                  <div class="license-count">{license.count} packages</div>
                  <div class="license-status">
                    {#if license.compatible}
                      ✓ COMPATIBLE
                    {:else}
                      ✕ INCOMPATIBLE
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div class="sbom-section">
            <h3>SOFTWARE BILL OF MATERIALS</h3>
            <div class="sbom-actions">
              <Button variant="outline">GENERATE SBOM</Button>
              <Button variant="outline">DOWNLOAD JSON</Button>
              <Button variant="outline">DOWNLOAD SPDX</Button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .quality-page {
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

  .header-actions {
    display: flex;
    gap: var(--space-3);
  }

  /* Project Selector */
  .project-selector {
    padding: var(--space-4) var(--space-8);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--surface-1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selector-group {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .selector-group label {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .project-select {
    padding: var(--space-2) var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-14);
    cursor: pointer;
  }

  /* Score Dashboard */
  .score-dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--space-8);
    padding: var(--space-8);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .overall-score-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .score-circle {
    width: 160px;
    height: 160px;
    border: 8px solid var(--fg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  .score-value {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
  }

  .score-grade {
    font-size: var(--text-24);
    font-weight: var(--weight-semibold);
  }

  .score-label {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .score-circle.grade-a {
    background: var(--fg);
    color: var(--bg);
  }

  .score-circle.grade-b {
    border-width: 6px;
  }

  .score-circle.grade-c {
    border-width: 4px;
  }

  .score-circle.grade-d {
    border-width: 2px;
  }

  .score-categories {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }

  .score-category {
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-3);
  }

  .category-name {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .category-score {
    font-size: var(--text-20);
    font-weight: var(--weight-semibold);
  }

  .score-bar {
    height: 8px;
    background: var(--surface-2);
    border: var(--border-width) solid var(--border-color);
    position: relative;
    margin-bottom: var(--space-2);
  }

  .score-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--fg);
  }

  .category-meta {
    font-size: var(--text-11);
    color: var(--muted);
  }

  /* Tabs */
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
  .overview-content {
    display: grid;
    gap: var(--space-8);
  }

  .trend-section,
  .criteria-section,
  .recommendations-section {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
  }

  .trend-section h3,
  .criteria-section h3,
  .recommendations-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .trend-chart {
    position: relative;
    height: 200px;
    padding: var(--space-4) 0;
  }

  .chart-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .grid-line {
    border-bottom: var(--border-width) solid var(--divider);
    position: relative;
  }

  .grid-label {
    position: absolute;
    left: -30px;
    font-size: var(--text-11);
    color: var(--muted);
  }

  .chart-bars {
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2px;
  }

  .trend-bar {
    flex: 1;
    background: var(--fg);
    position: relative;
  }

  .trend-bar:hover .bar-tooltip {
    display: block;
  }

  .bar-tooltip {
    display: none;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--fg);
    color: var(--bg);
    padding: 2px var(--space-1);
    font-size: var(--text-11);
  }

  .criteria-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .criterion {
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
  }

  .criterion-name {
    font-size: var(--text-12);
    color: var(--muted);
    margin-bottom: var(--space-2);
  }

  .criterion-value {
    font-size: var(--text-20);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-2);
  }

  .criterion-status {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .criterion-status.pass {
    color: var(--fg);
  }

  .criterion-status.warn {
    color: var(--muted);
  }

  .criterion-status.fail {
    text-decoration: line-through;
  }

  .recommendations {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .recommendation {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
  }

  .rec-icon {
    font-size: var(--text-24);
  }

  .rec-title {
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .rec-desc {
    font-size: var(--text-12);
    color: var(--muted);
  }

  /* Code Tab */
  .code-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .metric-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    text-align: center;
  }

  .metric-value {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-2);
  }

  .metric-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .complex-functions {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
  }

  .complex-functions h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .functions-table {
    border: var(--border-width) solid var(--border-color);
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 1fr 1fr;
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .table-header {
    background: var(--fg);
    color: var(--bg);
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-cell {
    padding: var(--space-3) var(--space-4);
  }

  .table-cell.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
  }

  .complexity-badge {
    padding: 2px var(--space-2);
    border: var(--border-width) solid var(--border-color);
    font-weight: var(--weight-semibold);
  }

  .complexity-badge.high {
    background: var(--fg);
    color: var(--bg);
  }

  /* Security Tab */
  .vulnerability-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .vuln-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    text-align: center;
  }

  .vuln-card.high {
    background: var(--fg);
    color: var(--bg);
  }

  .vuln-card.medium {
    border-width: 2px;
  }

  .vuln-count {
    font-size: var(--text-32);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-2);
  }

  .vuln-label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .security-hotspots h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .hotspot-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .hotspot-card.severity-high {
    border-width: 2px;
    border-color: var(--fg);
  }

  .hotspot-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }

  .hotspot-type {
    font-weight: var(--weight-semibold);
  }

  .hotspot-severity {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    padding: 2px var(--space-2);
    border: var(--border-width) solid var(--fg);
  }

  .hotspot-location {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-11);
    color: var(--muted);
    margin-bottom: var(--space-2);
  }

  .hotspot-desc {
    font-size: var(--text-12);
    margin-bottom: var(--space-3);
  }

  .hotspot-actions {
    display: flex;
    gap: var(--space-2);
  }

  /* Coverage Tab */
  .coverage-overview {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .coverage-metric {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    text-align: center;
  }

  .metric-header {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-4);
  }

  .coverage-ring {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto var(--space-4);
  }

  .ring-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--text-24);
    font-weight: var(--weight-semibold);
  }

  .metric-details {
    font-size: var(--text-12);
    color: var(--muted);
  }

  .uncovered-files {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
  }

  .uncovered-files h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .files-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3);
    border: var(--border-width) solid var(--border-color);
  }

  .file-info {
    flex: 1;
  }

  .file-name {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
    margin-bottom: var(--space-1);
  }

  .file-lines {
    font-size: var(--text-11);
    color: var(--muted);
  }

  .file-coverage {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .coverage-bar {
    width: 100px;
    height: 8px;
    background: var(--surface-2);
    border: var(--border-width) solid var(--border-color);
    position: relative;
  }

  .coverage-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--fg);
  }

  .coverage-percent {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    min-width: 35px;
  }

  /* Dependencies Tab */
  .dependency-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .stat-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    text-align: center;
  }

  .stat-card.outdated {
    border-color: var(--fg);
  }

  .stat-card.vulnerable {
    background: var(--fg);
    color: var(--bg);
  }

  .license-analysis,
  .sbom-section {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .license-analysis h3,
  .sbom-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin: 0 0 var(--space-4) 0;
  }

  .licenses-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .license-item {
    padding: var(--space-4);
    border: var(--border-width) solid var(--border-color);
  }

  .license-item.incompatible {
    background: var(--fg);
    color: var(--bg);
  }

  .license-name {
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .license-count {
    font-size: var(--text-12);
    color: var(--muted);
    margin-bottom: var(--space-2);
  }

  .license-status {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .sbom-actions {
    display: flex;
    gap: var(--space-3);
  }
</style>