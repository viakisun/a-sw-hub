import { writable, derived } from 'svelte/store';
import type {
  Project,
  FilterOptions,
  SortOptions,
  ProjectCategory,
  ProjectStatus,
  ProgrammingLanguage,
} from '$lib/types';
import { mockProjects } from '$lib/data/mockProjects';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    categories: ProjectCategory[];
    statuses: ProjectStatus[];
    languages: ProgrammingLanguage[];
    visibility: 'all' | 'public' | 'private';
  };
  sort: SortOptions;
  viewMode: 'grid' | 'list';
  page: number;
  pageSize: number;
}

const initialState: ProjectsState = {
  projects: mockProjects,
  loading: false,
  error: null,
  filters: {
    search: '',
    categories: [],
    statuses: [],
    languages: [],
    visibility: 'all',
  },
  sort: {
    field: 'activity',
    order: 'desc',
  },
  viewMode: 'grid',
  page: 1,
  pageSize: 12,
};

function createProjectsStore() {
  const { subscribe, set, update } = writable<ProjectsState>(initialState);

  return {
    subscribe,

    // Load projects (mock async)
    loadProjects: async () => {
      update((state) => ({ ...state, loading: true }));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      update((state) => ({
        ...state,
        projects: mockProjects,
        loading: false,
        error: null,
      }));
    },

    // Search projects
    setSearch: (search: string) => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, search },
        page: 1, // Reset to first page
      }));
    },

    // Filter by category
    toggleCategory: (category: ProjectCategory) => {
      update((state) => {
        const categories = state.filters.categories.includes(category)
          ? state.filters.categories.filter((c) => c !== category)
          : [...state.filters.categories, category];

        return {
          ...state,
          filters: { ...state.filters, categories },
          page: 1,
        };
      });
    },

    // Filter by status
    toggleStatus: (status: ProjectStatus) => {
      update((state) => {
        const statuses = state.filters.statuses.includes(status)
          ? state.filters.statuses.filter((s) => s !== status)
          : [...state.filters.statuses, status];

        return {
          ...state,
          filters: { ...state.filters, statuses },
          page: 1,
        };
      });
    },

    // Filter by language
    toggleLanguage: (language: ProgrammingLanguage) => {
      update((state) => {
        const languages = state.filters.languages.includes(language)
          ? state.filters.languages.filter((l) => l !== language)
          : [...state.filters.languages, language];

        return {
          ...state,
          filters: { ...state.filters, languages },
          page: 1,
        };
      });
    },

    // Set visibility filter
    setVisibility: (visibility: 'all' | 'public' | 'private') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, visibility },
        page: 1,
      }));
    },

    // Clear all filters
    clearFilters: () => {
      update((state) => ({
        ...state,
        filters: initialState.filters,
        page: 1,
      }));
    },

    // Set sort options
    setSort: (sort: SortOptions) => {
      update((state) => ({
        ...state,
        sort,
        page: 1,
      }));
    },

    // Toggle view mode
    toggleViewMode: () => {
      update((state) => ({
        ...state,
        viewMode: state.viewMode === 'grid' ? 'list' : 'grid',
      }));
    },

    // Pagination
    setPage: (page: number) => {
      update((state) => ({ ...state, page }));
    },

    setPageSize: (pageSize: number) => {
      update((state) => ({ ...state, pageSize, page: 1 }));
    },

    // Star/Unstar project (mock)
    toggleStar: (projectId: string) => {
      update((state) => ({
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, stars: p.stars + (Math.random() > 0.5 ? 1 : -1) } : p
        ),
      }));
    },

    // Add new project (mock)
    addProject: (project: Project) => {
      update((state) => ({
        ...state,
        projects: [project, ...state.projects],
      }));
    },

    // Update project (mock)
    updateProject: (projectId: string, updates: Partial<Project>) => {
      update((state) => ({
        ...state,
        projects: state.projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p)),
      }));
    },
  };
}

export const projectsStore = createProjectsStore();

// Derived stores for filtered and sorted projects
export const filteredProjects = derived(projectsStore, ($store) => {
  let filtered = $store.projects;

  // Apply search filter
  if ($store.filters.search) {
    const search = $store.filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.includes(search) ||
        p.language.toLowerCase().includes(search)
    );
  }

  // Apply category filter
  if ($store.filters.categories.length > 0) {
    filtered = filtered.filter((p) => $store.filters.categories.includes(p.category));
  }

  // Apply status filter
  if ($store.filters.statuses.length > 0) {
    filtered = filtered.filter((p) => $store.filters.statuses.includes(p.status));
  }

  // Apply language filter
  if ($store.filters.languages.length > 0) {
    filtered = filtered.filter((p) => $store.filters.languages.includes(p.language));
  }

  // Apply visibility filter
  if ($store.filters.visibility !== 'all') {
    filtered = filtered.filter((p) => p.visibility === $store.filters.visibility);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch ($store.sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = b.createdAt.getTime() - a.createdAt.getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'stars':
        comparison = b.stars - a.stars;
        break;
      case 'activity':
        comparison = b.lastCommit.getTime() - a.lastCommit.getTime();
        break;
    }

    return $store.sort.order === 'asc' ? comparison : -comparison;
  });

  return filtered;
});

// Paginated projects
export const paginatedProjects = derived(
  [filteredProjects, projectsStore],
  ([$filtered, $store]) => {
    const start = ($store.page - 1) * $store.pageSize;
    const end = start + $store.pageSize;
    return $filtered.slice(start, end);
  }
);

// Total pages
export const totalPages = derived([filteredProjects, projectsStore], ([$filtered, $store]) =>
  Math.ceil($filtered.length / $store.pageSize)
);

// Project count
export const projectCount = derived(filteredProjects, ($filtered) => $filtered.length);
