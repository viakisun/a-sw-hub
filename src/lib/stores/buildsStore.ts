import { writable, derived, get } from 'svelte/store';
import type { Build, BuildStatus, DeploymentEnvironment } from '$lib/types';
import { mockBuilds, generateBuildLog } from '$lib/data/mockBuilds';
import { nanoid } from 'nanoid';

interface BuildsState {
  builds: Build[];
  runningBuilds: Build[];
  queuedBuilds: Build[];
  loading: boolean;
  error: string | null;
  selectedBuild: Build | null;
  buildLogs: Map<string, string[]>;
  filters: {
    status: BuildStatus | 'all';
    environment: DeploymentEnvironment | 'all';
    projectId: string | null;
  };
}

const initialState: BuildsState = {
  builds: mockBuilds,
  runningBuilds: mockBuilds.filter((b) => b.status === 'running'),
  queuedBuilds: mockBuilds.filter((b) => b.status === 'pending').slice(0, 3),
  loading: false,
  error: null,
  selectedBuild: null,
  buildLogs: new Map(),
  filters: {
    status: 'all',
    environment: 'all',
    projectId: null,
  },
};

function createBuildsStore() {
  const { subscribe, set, update } = writable<BuildsState>(initialState);

  // Interval for fake real-time updates
  let updateInterval: ReturnType<typeof setInterval> | null = null;

  return {
    subscribe,

    // Load builds
    loadBuilds: async () => {
      update((state) => ({ ...state, loading: true }));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      update((state) => ({
        ...state,
        builds: mockBuilds,
        runningBuilds: mockBuilds.filter((b) => b.status === 'running'),
        queuedBuilds: mockBuilds.filter((b) => b.status === 'pending').slice(0, 3),
        loading: false,
      }));
    },

    // Select a build
    selectBuild: (buildId: string | null) => {
      update((state) => ({
        ...state,
        selectedBuild: buildId ? state.builds.find((b) => b.id === buildId) || null : null,
      }));
    },

    // Load logs for a build
    loadBuildLogs: async (buildId: string) => {
      const logs = generateBuildLog(buildId);
      update((state) => {
        const newLogs = new Map(state.buildLogs);
        newLogs.set(buildId, logs);
        return { ...state, buildLogs: newLogs };
      });
    },

    // Append log line (for fake streaming)
    appendLogLine: (buildId: string, line: string) => {
      update((state) => {
        const newLogs = new Map(state.buildLogs);
        const currentLogs = newLogs.get(buildId) || [];
        newLogs.set(buildId, [...currentLogs, line]);
        return { ...state, buildLogs: newLogs };
      });
    },

    // Update build progress (fake)
    updateBuildProgress: (buildId: string) => {
      update((state) => {
        const newBuilds = state.builds.map((build) => {
          if (build.id === buildId && build.status === 'running') {
            // Update stage progress
            const stages = [...build.stages];
            const runningStageIndex = stages.findIndex((s) => s.status === 'running');

            if (runningStageIndex !== -1) {
              // Complete current stage and start next
              stages[runningStageIndex] = {
                ...stages[runningStageIndex],
                status: 'success',
                finishedAt: new Date(),
                duration: Math.floor(Math.random() * 180) + 30,
              };

              if (runningStageIndex < stages.length - 1) {
                stages[runningStageIndex + 1] = {
                  ...stages[runningStageIndex + 1],
                  status: 'running',
                  startedAt: new Date(),
                };
              } else {
                // Build complete
                return {
                  ...build,
                  status: 'success' as BuildStatus,
                  finishedAt: new Date(),
                  duration: Math.floor((new Date().getTime() - build.startedAt.getTime()) / 1000),
                  stages,
                };
              }
            }

            return { ...build, stages };
          }
          return build;
        });

        return {
          ...state,
          builds: newBuilds,
          runningBuilds: newBuilds.filter((b) => b.status === 'running'),
        };
      });
    },

    // Start fake real-time updates
    startRealtimeUpdates: () => {
      if (updateInterval) return;

      updateInterval = setInterval(() => {
        const state = get({ subscribe });

        // Update running builds
        state.runningBuilds.forEach((build) => {
          if (Math.random() > 0.5) {
            // Update progress
            buildsStore.updateBuildProgress(build.id);

            // Add fake log line
            if (Math.random() > 0.3) {
              const logLines = [
                '[INFO] Processing data...',
                '[SUCCESS] Test suite completed',
                '[INFO] Deploying artifacts...',
                '[WARNING] Cache miss, rebuilding...',
                '[INFO] Running quality checks...',
              ];
              buildsStore.appendLogLine(
                build.id,
                `[${new Date().toISOString()}] ${logLines[Math.floor(Math.random() * logLines.length)]}`
              );
            }
          }
        });

        // Occasionally start a queued build
        if (Math.random() > 0.8 && state.queuedBuilds.length > 0) {
          update((s) => {
            const newQueued = [...s.queuedBuilds];
            const startingBuild = newQueued.shift();

            if (startingBuild) {
              const runningBuild = {
                ...startingBuild,
                status: 'running' as BuildStatus,
                startedAt: new Date(),
              };

              return {
                ...s,
                queuedBuilds: newQueued,
                runningBuilds: [...s.runningBuilds, runningBuild],
                builds: s.builds.map((b) => (b.id === runningBuild.id ? runningBuild : b)),
              };
            }
            return s;
          });
        }
      }, 2000); // Update every 2 seconds
    },

    // Stop real-time updates
    stopRealtimeUpdates: () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    },

    // Set filters
    setStatusFilter: (status: BuildStatus | 'all') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, status },
      }));
    },

    setEnvironmentFilter: (environment: DeploymentEnvironment | 'all') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, environment },
      }));
    },

    setProjectFilter: (projectId: string | null) => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, projectId },
      }));
    },

    // Cancel a build
    cancelBuild: (buildId: string) => {
      update((state) => ({
        ...state,
        builds: state.builds.map((b) =>
          b.id === buildId && b.status === 'running'
            ? { ...b, status: 'cancelled' as BuildStatus, finishedAt: new Date() }
            : b
        ),
        runningBuilds: state.runningBuilds.filter((b) => b.id !== buildId),
      }));
    },

    // Retry a build
    retryBuild: (buildId: string) => {
      update((state) => {
        const originalBuild = state.builds.find((b) => b.id === buildId);
        if (!originalBuild) return state;

        const newBuild: Build = {
          ...originalBuild,
          id: nanoid(),
          buildNumber: Math.max(...state.builds.map((b) => b.buildNumber)) + 1,
          status: 'pending',
          startedAt: new Date(),
          finishedAt: undefined,
          duration: undefined,
          stages: originalBuild.stages.map((s) => ({
            ...s,
            status: 'pending',
            startedAt: new Date(),
            finishedAt: undefined,
            duration: undefined,
          })),
        };

        return {
          ...state,
          builds: [newBuild, ...state.builds],
          queuedBuilds: [...state.queuedBuilds, newBuild],
        };
      });
    },
  };
}

export const buildsStore = createBuildsStore();

// Derived stores
export const filteredBuilds = derived(buildsStore, ($store) => {
  let filtered = $store.builds;

  if ($store.filters.status !== 'all') {
    filtered = filtered.filter((b) => b.status === $store.filters.status);
  }

  if ($store.filters.environment !== 'all') {
    filtered = filtered.filter((b) => b.environment === $store.filters.environment);
  }

  if ($store.filters.projectId) {
    filtered = filtered.filter((b) => b.projectId === $store.filters.projectId);
  }

  return filtered;
});

export const buildMetrics = derived(buildsStore, ($store) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysBuilds = $store.builds.filter((b) => b.startedAt >= today);

  const successfulBuilds = todaysBuilds.filter((b) => b.status === 'success');
  const failedBuilds = todaysBuilds.filter((b) => b.status === 'failed');

  return {
    total: todaysBuilds.length,
    successful: successfulBuilds.length,
    failed: failedBuilds.length,
    running: $store.runningBuilds.length,
    queued: $store.queuedBuilds.length,
    successRate:
      todaysBuilds.length > 0
        ? Math.round((successfulBuilds.length / todaysBuilds.length) * 100)
        : 0,
  };
});
