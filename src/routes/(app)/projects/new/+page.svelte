<script lang="ts">
  /**
   * Project Creation Wizard
   * 4-step wizard for creating new agricultural software projects
   */

  import { goto } from '$app/navigation';
  import { projectsStore } from '$lib/stores/projectsStore';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import Input from '$lib/components/inputs/Input.svelte';
  import type { ProjectCategory, ProjectStatus, ProgrammingLanguage } from '$lib/types';

  let currentStep = 1;
  const totalSteps = 4;

  // Form data
  let formData = {
    // Step 1: Basic Info
    basic: {
      name: '',
      slug: '',
      description: '',
      category: 'crop-management' as ProjectCategory,
      visibility: 'public' as 'public' | 'private',
      license: 'Apache-2.0'
    },
    // Step 2: Repository
    repository: {
      type: 'new' as 'new' | 'existing' | 'import',
      url: '',
      importFrom: 'github' as 'github' | 'gitlab' | 'bitbucket',
      initWithReadme: true,
      gitignoreTemplate: 'Python',
      defaultBranch: 'main'
    },
    // Step 3: CI/CD
    cicd: {
      enabled: true,
      triggers: {
        onPush: true,
        onPullRequest: true,
        scheduled: false,
        manual: true
      },
      environment: {
        ros2Version: 'humble',
        pythonVersion: '3.10',
        nodeVersion: '18'
      },
      testing: {
        unitTests: true,
        integrationTests: false,
        coverageThreshold: 80,
        securityScan: true
      },
      quality: {
        minCoverage: 70,
        maxVulnerabilities: 0,
        testPassRate: 95
      }
    }
  };

  // Reactive slug generation
  $: if (formData.basic.name && currentStep === 1) {
    formData.basic.slug = formData.basic.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  async function createProject() {
    // Here you would normally send to API
    console.log('Creating project with data:', formData);

    // Mock creation
    setTimeout(() => {
      goto(`/projects/${formData.basic.slug}`);
    }, 1000);
  }

  function validateStep(step: number): boolean {
    switch (step) {
      case 1:
        return formData.basic.name.length > 0 &&
               formData.basic.slug.length > 0 &&
               formData.basic.description.length > 0;
      case 2:
        if (formData.repository.type === 'existing' || formData.repository.type === 'import') {
          return formData.repository.url.length > 0;
        }
        return true;
      case 3:
        return true; // CI/CD settings are optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  }
</script>

<div class="wizard-page">
  <!-- Header -->
  <div class="wizard-header">
    <Button variant="text" on:click={() => goto('/projects')}>← CANCEL</Button>
    <Heading level={1}>CREATE NEW PROJECT</Heading>
    <div class="step-indicator">
      {#each Array(totalSteps) as _, i}
        <div
          class="step"
          class:active={i + 1 === currentStep}
          class:completed={i + 1 < currentStep}
        >
          {i + 1}
        </div>
        {#if i < totalSteps - 1}
          <div class="step-line" class:completed={i + 1 < currentStep}></div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Content -->
  <div class="wizard-content">
    {#if currentStep === 1}
      <!-- Step 1: Basic Information -->
      <div class="step-content">
        <div class="step-title">
          <Heading level={2}>BASIC INFORMATION</Heading>
          <Text muted>Define your project's core details</Text>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="name">PROJECT NAME *</label>
            <input
              id="name"
              type="text"
              class="input"
              bind:value={formData.basic.name}
              placeholder="e.g., Smart Tractor Control"
            />
            <Text size="small" muted>Human-readable project name</Text>
          </div>

          <div class="form-group">
            <label for="slug">PROJECT SLUG *</label>
            <input
              id="slug"
              type="text"
              class="input"
              bind:value={formData.basic.slug}
              placeholder="e.g., smart-tractor-control"
              pattern="[a-z0-9-]+"
            />
            <Text size="small" muted>URL-friendly identifier (auto-generated)</Text>
          </div>

          <div class="form-group full-width">
            <label for="description">DESCRIPTION *</label>
            <textarea
              id="description"
              class="textarea"
              bind:value={formData.basic.description}
              placeholder="Describe your project's purpose and functionality..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="category">CATEGORY *</label>
            <select id="category" class="select" bind:value={formData.basic.category}>
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
            <label for="visibility">VISIBILITY *</label>
            <select id="visibility" class="select" bind:value={formData.basic.visibility}>
              <option value="public">PUBLIC - Anyone can view</option>
              <option value="private">PRIVATE - Team members only</option>
            </select>
          </div>

          <div class="form-group">
            <label for="license">LICENSE</label>
            <select id="license" class="select" bind:value={formData.basic.license}>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="MIT">MIT</option>
              <option value="GPL-3.0">GPL 3.0</option>
              <option value="BSD-3-Clause">BSD 3-Clause</option>
              <option value="Proprietary">Proprietary</option>
            </select>
          </div>
        </div>
      </div>
    {/if}

    {#if currentStep === 2}
      <!-- Step 2: Repository Setup -->
      <div class="step-content">
        <div class="step-title">
          <Heading level={2}>REPOSITORY SETUP</Heading>
          <Text muted>Connect or create your code repository</Text>
        </div>

        <div class="repo-options">
          <label class="option-card">
            <input
              type="radio"
              name="repo-type"
              value="new"
              bind:group={formData.repository.type}
            />
            <div class="option-content">
              <div class="option-title">CREATE NEW REPOSITORY</div>
              <div class="option-desc">Initialize a new Git repository</div>
            </div>
          </label>

          <label class="option-card">
            <input
              type="radio"
              name="repo-type"
              value="existing"
              bind:group={formData.repository.type}
            />
            <div class="option-content">
              <div class="option-title">CONNECT EXISTING</div>
              <div class="option-desc">Link to an existing repository</div>
            </div>
          </label>

          <label class="option-card">
            <input
              type="radio"
              name="repo-type"
              value="import"
              bind:group={formData.repository.type}
            />
            <div class="option-content">
              <div class="option-title">IMPORT FROM PLATFORM</div>
              <div class="option-desc">Import from GitHub/GitLab/Bitbucket</div>
            </div>
          </label>
        </div>

        {#if formData.repository.type === 'new'}
          <div class="form-grid">
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  bind:checked={formData.repository.initWithReadme}
                />
                Initialize with README
              </label>
            </div>

            <div class="form-group">
              <label for="gitignore">GITIGNORE TEMPLATE</label>
              <select id="gitignore" class="select" bind:value={formData.repository.gitignoreTemplate}>
                <option value="Python">Python</option>
                <option value="Node">Node.js</option>
                <option value="C++">C++</option>
                <option value="ROS">ROS</option>
                <option value="None">None</option>
              </select>
            </div>

            <div class="form-group">
              <label for="branch">DEFAULT BRANCH</label>
              <input
                id="branch"
                type="text"
                class="input"
                bind:value={formData.repository.defaultBranch}
              />
            </div>
          </div>
        {/if}

        {#if formData.repository.type === 'existing' || formData.repository.type === 'import'}
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="repo-url">REPOSITORY URL *</label>
              <input
                id="repo-url"
                type="url"
                class="input"
                bind:value={formData.repository.url}
                placeholder="https://github.com/username/repository.git"
              />
            </div>

            {#if formData.repository.type === 'import'}
              <div class="form-group">
                <label for="import-from">IMPORT FROM</label>
                <select id="import-from" class="select" bind:value={formData.repository.importFrom}>
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                  <option value="bitbucket">Bitbucket</option>
                </select>
              </div>
            {/if}

            <Button variant="outline">TEST CONNECTION</Button>
          </div>
        {/if}
      </div>
    {/if}

    {#if currentStep === 3}
      <!-- Step 3: CI/CD Configuration -->
      <div class="step-content">
        <div class="step-title">
          <Heading level={2}>CI/CD CONFIGURATION</Heading>
          <Text muted>Set up automated build and deployment pipelines</Text>
        </div>

        <div class="form-section">
          <h3>BUILD TRIGGERS</h3>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" bind:checked={formData.cicd.triggers.onPush} />
              On Push to Main Branch
            </label>
            <label>
              <input type="checkbox" bind:checked={formData.cicd.triggers.onPullRequest} />
              On Pull Request
            </label>
            <label>
              <input type="checkbox" bind:checked={formData.cicd.triggers.scheduled} />
              Scheduled (Daily at 2 AM)
            </label>
            <label>
              <input type="checkbox" bind:checked={formData.cicd.triggers.manual} />
              Manual Trigger
            </label>
          </div>
        </div>

        <div class="form-section">
          <h3>BUILD ENVIRONMENT</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="ros2">ROS2 VERSION</label>
              <select id="ros2" class="select" bind:value={formData.cicd.environment.ros2Version}>
                <option value="humble">Humble Hawksbill</option>
                <option value="iron">Iron Irwini</option>
                <option value="rolling">Rolling</option>
                <option value="none">Not Using ROS2</option>
              </select>
            </div>

            <div class="form-group">
              <label for="python">PYTHON VERSION</label>
              <select id="python" class="select" bind:value={formData.cicd.environment.pythonVersion}>
                <option value="3.8">3.8</option>
                <option value="3.9">3.9</option>
                <option value="3.10">3.10</option>
                <option value="3.11">3.11</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>TEST SETTINGS</h3>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" bind:checked={formData.cicd.testing.unitTests} />
              Run Unit Tests
            </label>
            <label>
              <input type="checkbox" bind:checked={formData.cicd.testing.integrationTests} />
              Run Integration Tests
            </label>
            <label>
              <input type="checkbox" bind:checked={formData.cicd.testing.securityScan} />
              Security Vulnerability Scan
            </label>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="coverage">MINIMUM COVERAGE (%)</label>
              <input
                id="coverage"
                type="number"
                class="input"
                bind:value={formData.cicd.quality.minCoverage}
                min="0"
                max="100"
              />
            </div>

            <div class="form-group">
              <label for="pass-rate">TEST PASS RATE (%)</label>
              <input
                id="pass-rate"
                type="number"
                class="input"
                bind:value={formData.cicd.quality.testPassRate}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if currentStep === 4}
      <!-- Step 4: Review & Create -->
      <div class="step-content">
        <div class="step-title">
          <Heading level={2}>REVIEW & CREATE</Heading>
          <Text muted>Confirm your project configuration</Text>
        </div>

        <div class="review-sections">
          <div class="review-section">
            <h3>BASIC INFORMATION</h3>
            <div class="review-items">
              <div class="review-item">
                <span class="label">Name:</span>
                <span class="value">{formData.basic.name}</span>
              </div>
              <div class="review-item">
                <span class="label">Slug:</span>
                <span class="value mono">{formData.basic.slug}</span>
              </div>
              <div class="review-item">
                <span class="label">Category:</span>
                <span class="value">{formData.basic.category.replace(/-/g, ' ').toUpperCase()}</span>
              </div>
              <div class="review-item">
                <span class="label">Visibility:</span>
                <span class="value">{formData.basic.visibility.toUpperCase()}</span>
              </div>
              <div class="review-item">
                <span class="label">License:</span>
                <span class="value">{formData.basic.license}</span>
              </div>
            </div>
          </div>

          <div class="review-section">
            <h3>REPOSITORY</h3>
            <div class="review-items">
              <div class="review-item">
                <span class="label">Type:</span>
                <span class="value">{formData.repository.type.toUpperCase()}</span>
              </div>
              {#if formData.repository.type === 'new'}
                <div class="review-item">
                  <span class="label">Initialize with README:</span>
                  <span class="value">{formData.repository.initWithReadme ? 'YES' : 'NO'}</span>
                </div>
                <div class="review-item">
                  <span class="label">Default Branch:</span>
                  <span class="value mono">{formData.repository.defaultBranch}</span>
                </div>
              {/if}
              {#if formData.repository.url}
                <div class="review-item">
                  <span class="label">URL:</span>
                  <span class="value mono">{formData.repository.url}</span>
                </div>
              {/if}
            </div>
          </div>

          <div class="review-section">
            <h3>CI/CD</h3>
            <div class="review-items">
              <div class="review-item">
                <span class="label">Build Triggers:</span>
                <span class="value">
                  {Object.entries(formData.cicd.triggers)
                    .filter(([_, v]) => v)
                    .map(([k]) => k.replace(/([A-Z])/g, ' $1').toUpperCase())
                    .join(', ')}
                </span>
              </div>
              <div class="review-item">
                <span class="label">ROS2 Version:</span>
                <span class="value">{formData.cicd.environment.ros2Version.toUpperCase()}</span>
              </div>
              <div class="review-item">
                <span class="label">Python Version:</span>
                <span class="value">{formData.cicd.environment.pythonVersion}</span>
              </div>
              <div class="review-item">
                <span class="label">Min Coverage:</span>
                <span class="value">{formData.cicd.quality.minCoverage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="estimated-resources">
          <div class="resource-card">
            <div class="resource-label">ESTIMATED BUILD TIME</div>
            <div class="resource-value">~5 MINUTES</div>
          </div>
          <div class="resource-card">
            <div class="resource-label">STORAGE REQUIRED</div>
            <div class="resource-value">~500 MB</div>
          </div>
          <div class="resource-card">
            <div class="resource-label">MONTHLY COST</div>
            <div class="resource-value">$0 (FREE TIER)</div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <div class="wizard-footer">
    <div class="footer-left">
      {#if currentStep > 1}
        <Button variant="outline" on:click={prevStep}>← PREVIOUS</Button>
      {/if}
    </div>

    <div class="footer-center">
      <Text muted>STEP {currentStep} OF {totalSteps}</Text>
    </div>

    <div class="footer-right">
      {#if currentStep < totalSteps}
        <Button
          variant="primary"
          on:click={nextStep}
          disabled={!validateStep(currentStep)}
        >
          NEXT →
        </Button>
      {:else}
        <Button variant="primary" on:click={createProject}>
          CREATE PROJECT
        </Button>
      {/if}
    </div>
  </div>
</div>

<style>
  .wizard-page {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
  }

  .wizard-header {
    border-bottom: var(--border-width) solid var(--border-color);
    padding: var(--space-6) var(--space-8);
    display: flex;
    align-items: center;
    gap: var(--space-8);
  }

  .step-indicator {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .step {
    width: 32px;
    height: 32px;
    border: var(--border-width) solid var(--fg);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--weight-semibold);
    font-size: var(--text-14);
  }

  .step.active {
    background: var(--fg);
    color: var(--bg);
  }

  .step.completed {
    background: var(--fg);
    color: var(--bg);
  }

  .step-line {
    width: 40px;
    height: var(--border-width);
    background: var(--border-color);
  }

  .step-line.completed {
    background: var(--fg);
  }

  .wizard-content {
    flex: 1;
    padding: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .step-content {
    animation: fadeIn var(--transition-base);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .step-title {
    margin-bottom: var(--space-8);
  }

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

  label {
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .input,
  .select,
  .textarea {
    height: var(--input-height);
    padding: 0 var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-14);
    color: var(--fg);
    outline: none;
  }

  .textarea {
    height: auto;
    padding: var(--space-3);
    resize: vertical;
  }

  .input:focus,
  .select:focus,
  .textarea:focus {
    border-color: var(--fg);
  }

  .select {
    cursor: pointer;
  }

  /* Repository Options */
  .repo-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .option-card {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-4);
    cursor: pointer;
    transition: var(--transition-base);
    position: relative;
  }

  .option-card:hover {
    background: var(--surface-1);
  }

  .option-card input[type="radio"] {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
  }

  .option-card:has(input:checked) {
    border-color: var(--fg);
    background: var(--surface-1);
  }

  .option-title {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-1);
  }

  .option-desc {
    font-size: var(--text-12);
    color: var(--muted);
  }

  /* Form Sections */
  .form-section {
    margin-bottom: var(--space-8);
  }

  .form-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .checkbox-group label {
    font-size: var(--text-14);
    font-weight: var(--weight-regular);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  /* Review Section */
  .review-sections {
    display: grid;
    gap: var(--space-8);
    margin-bottom: var(--space-8);
  }

  .review-section {
    border: var(--border-width) solid var(--border-color);
    padding: var(--space-6);
  }

  .review-section h3 {
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-4);
  }

  .review-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .review-item {
    display: flex;
    justify-content: space-between;
    padding: var(--space-2) 0;
    border-bottom: var(--border-width) solid var(--divider);
  }

  .review-item:last-child {
    border-bottom: none;
  }

  .review-item .label {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .review-item .value {
    font-size: var(--text-14);
    font-weight: var(--weight-medium);
  }

  .review-item .value.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
  }

  .estimated-resources {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: var(--border-width) solid var(--border-color);
    margin-bottom: var(--space-8);
  }

  .resource-card {
    padding: var(--space-6);
    text-align: center;
    border-right: var(--border-width) solid var(--border-color);
  }

  .resource-card:last-child {
    border-right: none;
  }

  .resource-label {
    font-size: var(--text-12);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
    margin-bottom: var(--space-2);
  }

  .resource-value {
    font-size: var(--text-20);
    font-weight: var(--weight-semibold);
  }

  .wizard-footer {
    border-top: var(--border-width) solid var(--border-color);
    padding: var(--space-4) var(--space-8);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .footer-center {
    justify-content: center;
  }

  .footer-right {
    justify-content: flex-end;
  }
</style>