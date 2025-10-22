<script lang="ts">
  /**
   * Projects Listing Page
   * Grid layout with extreme B&W design
   */

  import { onMount } from 'svelte';
  import { projectsStore, filteredProjects } from '$lib/stores/projectsStore';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/buttons/Button.svelte';
  import Heading from '$lib/components/typography/Heading.svelte';
  import Text from '$lib/components/typography/Text.svelte';
  import type { ProjectCategory, ProjectStatus, ProgrammingLanguage } from '$lib/types';

  let selectedCategory: ProjectCategory | 'all' = 'all';
  let selectedStatus: ProjectStatus | 'all' = 'all';
  let selectedLanguage: ProgrammingLanguage | 'all' = 'all';
  let searchQuery = '';

  const categories: Array<ProjectCategory | 'all'> = [
    'all',
    'crop-management',
    'soil-analysis',
    'irrigation',
    'pest-control',
    'harvest-optimization',
    'supply-chain',
    'farm-analytics',
    'weather-monitoring',
    'livestock',
    'market-analysis',
  ];

  const statuses: Array<ProjectStatus | 'all'> = ['all', 'active', 'maintenance', 'archived', 'deprecated'];

  const languages: Array<ProgrammingLanguage | 'all'> = [
    'all',
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C++',
    'Ruby',
    'PHP',
    'Swift',
  ];

  function handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    searchQuery = input.value;
    projectsStore.setFilters({
      search: searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      language: selectedLanguage === 'all' ? undefined : selectedLanguage,
    });
  }

  function handleCategoryChange(category: ProjectCategory | 'all') {
    selectedCategory = category;
    projectsStore.setFilters({
      search: searchQuery,
      category: category === 'all' ? undefined : category,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      language: selectedLanguage === 'all' ? undefined : selectedLanguage,
    });
  }

  function handleStatusChange(status: ProjectStatus | 'all') {
    selectedStatus = status;
    projectsStore.setFilters({
      search: searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      status: status === 'all' ? undefined : status,
      language: selectedLanguage === 'all' ? undefined : selectedLanguage,
    });
  }

  function handleLanguageChange(language: ProgrammingLanguage | 'all') {
    selectedLanguage = language;
    projectsStore.setFilters({
      search: searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      language: language === 'all' ? undefined : language,
    });
  }

  function getStatusIndicator(status: ProjectStatus) {
    switch (status) {
      case 'active':
        return '■';
      case 'maintenance':
        return '▣';
      case 'archived':
        return '□';
      case 'deprecated':
        return '▢';
      default:
        return '■';
    }
  }

  function formatCategory(category: string) {
    return category.replace(/-/g, ' ').toUpperCase();
  }

  onMount(() => {
    projectsStore.loadProjects();
  });
</script>

<div class="projects-page">
  <!-- Page Header -->
  <div class="page-header">
    <div class="header-content">
      <Heading level={1}>AGRICULTURAL SOFTWARE PROJECTS</Heading>
      <div class="header-actions">
        <Button variant="primary" on:click={() => goto('/projects/new')}>+ NEW PROJECT</Button>
      </div>
    </div>
  </div>

  <!-- Filters Bar -->
  <div class="filters-bar">
    <div class="filter-group">
      <label class="filter-label">SEARCH</label>
      <input
        type="text"
        class="search-input"
        placeholder="Search projects..."
        on:input={handleSearch}
        bind:value={searchQuery}
      />
    </div>

    <div class="filter-group">
      <label class="filter-label">CATEGORY</label>
      <select class="filter-select" bind:value={selectedCategory} on:change={() => handleCategoryChange(selectedCategory)}>
        {#each categories as category}
          <option value={category}>{category === 'all' ? 'ALL' : formatCategory(category)}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">STATUS</label>
      <select class="filter-select" bind:value={selectedStatus} on:change={() => handleStatusChange(selectedStatus)}>
        {#each statuses as status}
          <option value={status}>{status === 'all' ? 'ALL' : status.toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">LANGUAGE</label>
      <select class="filter-select" bind:value={selectedLanguage} on:change={() => handleLanguageChange(selectedLanguage)}>
        {#each languages as language}
          <option value={language}>{language === 'all' ? 'ALL' : language}</option>
        {/each}
      </select>
    </div>

    <div class="filter-stats">
      <Text size="small" muted>{$filteredProjects.length} PROJECTS</Text>
    </div>
  </div>

  <!-- Projects Grid -->
  <div class="projects-grid">
    {#each $filteredProjects as project}
      <div class="project-card" on:click={() => goto(`/projects/${project.slug}`)}>
        <div class="project-header">
          <div class="project-status">
            <span class="status-indicator">{getStatusIndicator(project.status)}</span>
            <span class="project-language">{project.language}</span>
          </div>
        </div>

        <div class="project-body">
          <h3 class="project-name">{project.name}</h3>
          <p class="project-description">{project.description}</p>

          <div class="project-category">
            {formatCategory(project.category)}
          </div>
        </div>

        <div class="project-footer">
          <div class="project-stats">
            <div class="stat">
              <span class="stat-label">STARS</span>
              <span class="stat-value">{project.stars}</span>
            </div>
            <div class="stat">
              <span class="stat-label">FORKS</span>
              <span class="stat-value">{project.forks}</span>
            </div>
            <div class="stat">
              <span class="stat-label">CONTRIB</span>
              <span class="stat-value">{project.contributors}</span>
            </div>
          </div>

          <div class="project-meta">
            <div class="last-commit">
              UPDATED {new Date(project.lastCommit).toLocaleDateString()}
            </div>
            {#if project.buildStatus}
              <div class="build-status" class:success={project.buildStatus === 'success'} class:failed={project.buildStatus === 'failed'}>
                {project.buildStatus.toUpperCase()}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}

    {#if $filteredProjects.length === 0}
      <div class="no-projects">
        <Text size="large" muted>NO PROJECTS FOUND</Text>
        <Text muted>Try adjusting your filters or create a new project</Text>
      </div>
    {/if}
  </div>
</div>

<style>
  .projects-page {
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

  .filter-label {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .search-input,
  .filter-select {
    height: var(--input-height);
    padding: 0 var(--space-3);
    border: var(--border-width) solid var(--border-color);
    background: var(--bg);
    font-family: inherit;
    font-size: var(--text-14);
    color: var(--fg);
    outline: none;
  }

  .search-input {
    width: 300px;
  }

  .filter-select {
    min-width: 150px;
    cursor: pointer;
  }

  .search-input:focus,
  .filter-select:focus {
    border-color: var(--fg);
  }

  .filter-stats {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 0;
    border-left: var(--border-width) solid var(--border-color);
  }

  .project-card {
    border-right: var(--border-width) solid var(--border-color);
    border-bottom: var(--border-width) solid var(--border-color);
    background: var(--bg);
    cursor: pointer;
    transition: var(--transition-base);
    display: flex;
    flex-direction: column;
    height: 280px;
  }

  .project-card:hover {
    background: var(--surface-1);
  }

  .project-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: var(--border-width) solid var(--divider);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .project-status {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .status-indicator {
    font-size: var(--text-14);
  }

  .project-language {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-12);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .project-body {
    flex: 1;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .project-name {
    font-size: var(--text-20);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    margin: 0;
  }

  .project-description {
    font-size: var(--text-14);
    line-height: var(--leading-normal);
    color: var(--muted);
    margin: 0;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .project-category {
    font-size: var(--text-11);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--fg);
    background: var(--fg);
    color: var(--bg);
    width: fit-content;
  }

  .project-footer {
    padding: var(--space-3) var(--space-4);
    border-top: var(--border-width) solid var(--divider);
    background: var(--surface-1);
  }

  .project-stats {
    display: flex;
    gap: var(--space-6);
    margin-bottom: var(--space-2);
  }

  .stat {
    display: flex;
    gap: var(--space-1);
    align-items: baseline;
  }

  .stat-label {
    font-size: var(--text-11);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    color: var(--muted);
  }

  .stat-value {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: var(--text-14);
    font-weight: var(--weight-semibold);
  }

  .project-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--text-11);
    color: var(--muted);
  }

  .last-commit {
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
  }

  .build-status {
    padding: var(--space-1) var(--space-2);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }

  .build-status.success {
    background: var(--fg);
    color: var(--bg);
  }

  .build-status.failed {
    background: var(--bg);
    border: var(--border-width) solid var(--fg);
    color: var(--fg);
  }

  .no-projects {
    grid-column: 1 / -1;
    padding: var(--space-16) var(--space-8);
    text-align: center;
  }
</style>