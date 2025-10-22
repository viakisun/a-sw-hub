import { nanoid } from 'nanoid';
import type { Build, BuildStage, BuildStatus, DeploymentEnvironment } from '$lib/types';
import { subMinutes, subHours, addMinutes } from 'date-fns';
import { mockProjects } from './mockProjects';
import { getRandomUser } from './mockUsers';

const commitMessages = [
  'Fix critical bug in data processing pipeline',
  'Update dependencies to latest versions',
  'Implement new feature for crop monitoring',
  'Optimize database queries for better performance',
  'Add unit tests for irrigation controller',
  'Refactor soil analysis module',
  'Fix memory leak in sensor data collection',
  'Update documentation for API endpoints',
  'Improve error handling in harvest module',
  'Add support for new weather API',
  'Implement caching for analytics dashboard',
  'Fix timezone issues in scheduling system',
  'Update UI components for better accessibility',
  'Add validation for user inputs',
  'Optimize image processing algorithms',
];

const stageNames = [
  'Checkout',
  'Install Dependencies',
  'Lint',
  'Unit Tests',
  'Integration Tests',
  'Build',
  'Security Scan',
  'Deploy',
  'Smoke Tests',
];

const environments: DeploymentEnvironment[] = ['development', 'staging', 'production', 'testing'];

function generateBuildStage(name: string, status: BuildStatus, startTime: Date): BuildStage {
  const duration = Math.floor(Math.random() * 300) + 30; // 30s to 5m
  const finishedAt =
    status !== 'running' && status !== 'pending' ? addMinutes(startTime, duration / 60) : undefined;

  return {
    id: nanoid(),
    name,
    status,
    startedAt: startTime,
    finishedAt,
    duration: finishedAt ? duration : undefined,
    jobs: [],
  };
}

function generateBuild(index: number, isRunning: boolean = false): Build {
  const project = mockProjects[Math.floor(Math.random() * Math.min(20, mockProjects.length))];
  const triggeredBy = getRandomUser();
  const environment = environments[Math.floor(Math.random() * environments.length)];

  // Determine build status
  let status: BuildStatus;
  if (isRunning) {
    status = 'running';
  } else {
    const statusOptions: BuildStatus[] = ['success', 'failed', 'cancelled'];
    status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    // Favor success
    if (Math.random() > 0.3) status = 'success';
  }

  const startedAt = isRunning
    ? subMinutes(new Date(), Math.floor(Math.random() * 10) + 1)
    : subHours(new Date(), Math.floor(Math.random() * 24) + 1);

  // Generate stages
  const stages: BuildStage[] = [];
  let currentTime = startedAt;
  let allStagesComplete = true;

  for (let i = 0; i < stageNames.length; i++) {
    let stageStatus: BuildStatus;

    if (status === 'running') {
      if (i < 3) {
        stageStatus = 'success';
      } else if (i === 3) {
        stageStatus = 'running';
        allStagesComplete = false;
      } else {
        stageStatus = 'pending';
        allStagesComplete = false;
      }
    } else if (status === 'failed' && i === Math.floor(Math.random() * 6) + 2) {
      stageStatus = 'failed';
      allStagesComplete = false;
    } else if (status === 'cancelled' && i > 4) {
      stageStatus = 'cancelled';
      allStagesComplete = false;
    } else if (i < stageNames.length - 2 || status === 'success') {
      stageStatus = 'success';
    } else {
      stageStatus = 'skipped';
    }

    const stage = generateBuildStage(stageNames[i], stageStatus, currentTime);
    stages.push(stage);

    if (stage.finishedAt) {
      currentTime = stage.finishedAt;
    }

    if (stageStatus === 'failed' || stageStatus === 'cancelled') {
      break;
    }
  }

  const finishedAt =
    !isRunning && stages.length > 0 && stages[stages.length - 1].finishedAt
      ? stages[stages.length - 1].finishedAt
      : undefined;

  const duration = finishedAt
    ? Math.floor((finishedAt.getTime() - startedAt.getTime()) / 1000)
    : undefined;

  return {
    id: nanoid(),
    projectId: project.id,
    projectName: project.name,
    pipelineId: nanoid(),
    buildNumber: 1000 + index,
    status,
    branch: Math.random() > 0.6 ? 'main' : Math.random() > 0.5 ? 'develop' : 'feature/new-feature',
    commit: {
      sha: Math.random().toString(36).substring(2, 9),
      message: commitMessages[Math.floor(Math.random() * commitMessages.length)],
      author: triggeredBy.name,
      timestamp: startedAt,
    },
    startedAt,
    finishedAt,
    duration,
    stages,
    triggeredBy,
    environment,
  };
}

// Generate builds
const historicalBuilds = Array.from({ length: 50 }, (_, i) => generateBuild(i + 1, false));
const runningBuilds = Array.from({ length: 3 }, (_, i) => generateBuild(100 + i, true));

export const mockBuilds: Build[] = [...runningBuilds, ...historicalBuilds].sort(
  (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
);

// Helper functions
export function getBuildById(id: string): Build | undefined {
  return mockBuilds.find((b) => b.id === id);
}

export function getBuildsByProject(projectId: string): Build[] {
  return mockBuilds.filter((b) => b.projectId === projectId);
}

export function getBuildsByStatus(status: BuildStatus): Build[] {
  return mockBuilds.filter((b) => b.status === status);
}

export function getRunningBuilds(): Build[] {
  return mockBuilds.filter((b) => b.status === 'running');
}

export function getRecentBuilds(limit: number = 10): Build[] {
  return mockBuilds.slice(0, limit);
}

export function getBuildsByEnvironment(env: DeploymentEnvironment): Build[] {
  return mockBuilds.filter((b) => b.environment === env);
}

// Generate build logs with sections
export type LogSection = {
  name: string;
  status: 'success' | 'warning' | 'error' | 'running' | 'pending';
  expanded: boolean;
  logs: string[];
  duration?: number;
};

export function generateBuildLog(buildId: string): LogSection[] {
  const build = getBuildById(buildId);
  const timestamp = () => new Date().toISOString().substring(11, 23);

  const sections: LogSection[] = [
    {
      name: '1. Initialize Build Environment',
      status: 'success',
      expanded: false,
      duration: 3.2,
      logs: [
        `[${timestamp()}] [INFO] Starting build #${build?.buildNumber || '0'}`,
        `[${timestamp()}] [INFO] Build ID: ${buildId}`,
        `[${timestamp()}] [INFO] Triggered by: ${build?.triggeredBy?.name || 'System'}`,
        `[${timestamp()}] [INFO] Branch: ${build?.branch || 'main'}`,
        `[${timestamp()}] [INFO] Commit: ${build?.commit?.sha.substring(0, 7) || 'unknown'}`,
        `[${timestamp()}] [SUCCESS] Build environment initialized`,
      ]
    },
    {
      name: '2. Checkout Code',
      status: 'success',
      expanded: false,
      duration: 5.8,
      logs: [
        `[${timestamp()}] [INFO] Fetching from origin`,
        `[${timestamp()}] [INFO] git clone https://github.com/asw-hub/${build?.projectName || 'project'}.git`,
        `[${timestamp()}] [INFO] Cloning into workspace...`,
        `[${timestamp()}] [INFO] Receiving objects: 100% (4523/4523), 12.34 MB | 5.67 MB/s`,
        `[${timestamp()}] [INFO] Resolving deltas: 100% (2891/2891)`,
        `[${timestamp()}] [INFO] Checking out branch: ${build?.branch || 'main'}`,
        `[${timestamp()}] [SUCCESS] Repository cloned successfully`,
      ]
    },
    {
      name: '3. Install Dependencies',
      status: 'success',
      expanded: false,
      duration: 45.3,
      logs: [
        `[${timestamp()}] [INFO] Running: npm ci`,
        `[${timestamp()}] [INFO] npm WARN using --force Recommended protections disabled`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] added 1523 packages in 42.156s`,
        `[${timestamp()}] [INFO] ├── @sveltejs/kit@2.8.1`,
        `[${timestamp()}] [INFO] ├── @sveltejs/adapter-auto@3.3.1`,
        `[${timestamp()}] [INFO] ├── @sveltejs/vite-plugin-svelte@5.0.2`,
        `[${timestamp()}] [INFO] ├── svelte@5.2.10`,
        `[${timestamp()}] [INFO] ├── vite@6.0.3`,
        `[${timestamp()}] [INFO] ├── typescript@5.7.2`,
        `[${timestamp()}] [INFO] └── 1517 more packages`,
        `[${timestamp()}] [SUCCESS] All dependencies installed`,
      ]
    },
    {
      name: '4. Code Quality Checks',
      status: build?.status === 'failed' ? 'error' : 'warning',
      expanded: false,
      duration: 12.7,
      logs: [
        `[${timestamp()}] [INFO] Running ESLint...`,
        `[${timestamp()}] [INFO] Checking 234 files...`,
        `[${timestamp()}] [WARNING] src/lib/stores/projectsStore.ts:45:10 - Variable 'unused' is defined but never used`,
        `[${timestamp()}] [WARNING] src/routes/+page.svelte:12:5 - Missing semicolon`,
        `[${timestamp()}] [WARNING] src/lib/utils.ts:78:15 - Prefer const over let`,
        `[${timestamp()}] [INFO] Running Prettier...`,
        `[${timestamp()}] [INFO] Checking formatting...`,
        `[${timestamp()}] [SUCCESS] Code formatted successfully`,
        `[${timestamp()}] [INFO] Running svelte-check...`,
        build?.status === 'failed'
          ? `[${timestamp()}] [ERROR] Error: Type 'string' is not assignable to type 'number'`
          : `[${timestamp()}] [SUCCESS] No type errors found`,
      ]
    },
    {
      name: '5. Run Tests',
      status: build?.status === 'failed' ? 'error' : 'success',
      expanded: false,
      duration: 34.2,
      logs: [
        `[${timestamp()}] [INFO] Running test suites...`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] PASS  src/lib/utils.test.ts`,
        `[${timestamp()}] [INFO]   ✓ formatDate should format dates correctly (3ms)`,
        `[${timestamp()}] [INFO]   ✓ calculateProgress should return correct percentage (1ms)`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] PASS  src/domains/auth/auth.test.ts`,
        `[${timestamp()}] [INFO]   Auth Service`,
        `[${timestamp()}] [INFO]     ✓ should authenticate valid credentials (15ms)`,
        `[${timestamp()}] [INFO]     ✓ should reject invalid credentials (2ms)`,
        `[${timestamp()}] [INFO]     ✓ should handle token refresh (8ms)`,
        `[${timestamp()}] [INFO] `,
        build?.status === 'failed'
          ? `[${timestamp()}] [ERROR] FAIL  src/domains/projects/projects.test.ts`
          : `[${timestamp()}] [INFO] PASS  src/domains/projects/projects.test.ts`,
        build?.status === 'failed'
          ? `[${timestamp()}] [ERROR]   ✕ should create new project (45ms)`
          : `[${timestamp()}] [INFO]   ✓ should create new project (12ms)`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] Test Suites: ${build?.status === 'failed' ? '11 passed, 1 failed' : '12 passed'}, 12 total`,
        `[${timestamp()}] [INFO] Tests: ${build?.status === 'failed' ? '87 passed, 1 failed' : '88 passed'}, 88 total`,
        `[${timestamp()}] [INFO] Coverage: 78.5% (statements), 72.3% (branches)`,
        build?.status === 'failed'
          ? `[${timestamp()}] [ERROR] Tests failed`
          : `[${timestamp()}] [SUCCESS] All tests passed`,
      ]
    },
    {
      name: '6. Build Application',
      status: build?.status === 'cancelled' ? 'warning' : 'success',
      expanded: false,
      duration: 58.9,
      logs: [
        `[${timestamp()}] [INFO] Running: npm run build`,
        `[${timestamp()}] [INFO] > a-sw-hub@1.0.0 build`,
        `[${timestamp()}] [INFO] > vite build`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] vite v6.0.3 building SSR bundle for production...`,
        `[${timestamp()}] [INFO] transforming...`,
        `[${timestamp()}] [INFO] ✓ 3751 modules transformed.`,
        `[${timestamp()}] [INFO] rendering chunks...`,
        `[${timestamp()}] [INFO] vite v6.0.3 building for production...`,
        `[${timestamp()}] [INFO] ✓ 4108 modules transformed.`,
        `[${timestamp()}] [INFO] computing gzip size...`,
        `[${timestamp()}] [INFO] .svelte-kit/output/client/_app/version.json                  0.03 kB │ gzip:  0.05 kB`,
        `[${timestamp()}] [INFO] .svelte-kit/output/client/_app/immutable/assets/0.css       9.01 kB │ gzip:  2.49 kB`,
        `[${timestamp()}] [INFO] .svelte-kit/output/client/_app/immutable/chunks/index.js   23.42 kB │ gzip:  9.28 kB`,
        `[${timestamp()}] [INFO] .svelte-kit/output/client/_app/immutable/entry/app.js      78.74 kB │ gzip: 11.06 kB`,
        `[${timestamp()}] [INFO] ✓ built in 54.23s`,
        build?.status === 'cancelled'
          ? `[${timestamp()}] [WARNING] Build cancelled by user`
          : `[${timestamp()}] [SUCCESS] Build completed successfully`,
      ]
    },
    {
      name: '7. Security Scan',
      status: 'success',
      expanded: false,
      duration: 22.4,
      logs: [
        `[${timestamp()}] [INFO] Running security audit...`,
        `[${timestamp()}] [INFO] npm audit`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] === npm audit security report ===`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] found 0 vulnerabilities (0 low, 0 moderate, 0 high, 0 critical)`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] Running license check...`,
        `[${timestamp()}] [INFO] All dependencies have compatible licenses`,
        `[${timestamp()}] [INFO] `,
        `[${timestamp()}] [INFO] Scanning for secrets...`,
        `[${timestamp()}] [INFO] No hardcoded secrets found`,
        `[${timestamp()}] [SUCCESS] Security scan completed`,
      ]
    },
    {
      name: '8. Deploy to Environment',
      status: build?.status === 'running' ? 'running' : 'success',
      expanded: build?.status === 'running',
      duration: build?.status === 'running' ? undefined : 35.7,
      logs: [
        `[${timestamp()}] [INFO] Deploying to: ${build?.environment || 'staging'}`,
        `[${timestamp()}] [INFO] Creating deployment package...`,
        `[${timestamp()}] [INFO] Package size: 45.2 MB`,
        `[${timestamp()}] [INFO] Uploading to CDN...`,
        `[${timestamp()}] [INFO] ████████████████████████████████ 100%`,
        `[${timestamp()}] [INFO] Updating load balancer configuration...`,
        `[${timestamp()}] [INFO] Starting new instances...`,
        `[${timestamp()}] [INFO] Health check: Instance 1 - OK`,
        `[${timestamp()}] [INFO] Health check: Instance 2 - OK`,
        `[${timestamp()}] [INFO] Switching traffic to new deployment...`,
        build?.status === 'running'
          ? `[${timestamp()}] [INFO] Deployment in progress...`
          : `[${timestamp()}] [SUCCESS] Deployment completed`,
      ]
    },
    {
      name: '9. Post-Deployment Tests',
      status: build?.status === 'running' ? 'pending' : 'success',
      expanded: false,
      duration: build?.status === 'running' ? undefined : 18.3,
      logs: build?.status === 'running' ? [] : [
        `[${timestamp()}] [INFO] Running smoke tests...`,
        `[${timestamp()}] [INFO] Testing: Health check endpoint`,
        `[${timestamp()}] [SUCCESS] ✓ GET /health returned 200 OK`,
        `[${timestamp()}] [INFO] Testing: Authentication flow`,
        `[${timestamp()}] [SUCCESS] ✓ Login successful`,
        `[${timestamp()}] [INFO] Testing: Core functionality`,
        `[${timestamp()}] [SUCCESS] ✓ Project creation works`,
        `[${timestamp()}] [SUCCESS] ✓ Build pipeline triggers correctly`,
        `[${timestamp()}] [INFO] Testing: Database connectivity`,
        `[${timestamp()}] [SUCCESS] ✓ Database connection established`,
        `[${timestamp()}] [SUCCESS] All post-deployment tests passed`,
      ]
    },
  ];

  // If build failed, only show sections up to the failure point
  if (build?.status === 'failed') {
    const failIndex = sections.findIndex(s => s.status === 'error');
    if (failIndex !== -1) {
      return sections.slice(0, failIndex + 1);
    }
  }

  return sections;
}
