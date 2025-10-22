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

// Generate build logs
export function generateBuildLog(buildId: string): string[] {
  const logs: string[] = [];
  const logTemplates = [
    '[INFO] Starting build process...',
    '[INFO] Checking out code from repository',
    '[SUCCESS] Code checkout completed',
    '[INFO] Installing dependencies...',
    '[INFO] npm install',
    '[INFO] Found 1247 packages',
    '[SUCCESS] Dependencies installed successfully',
    '[INFO] Running linter...',
    '[WARNING] Found 3 minor style issues',
    '[INFO] Running unit tests...',
    '[INFO] Test suite: Authentication',
    '[SUCCESS] ✓ All tests passed (47/47)',
    '[INFO] Building application...',
    '[INFO] Webpack compilation in progress',
    '[SUCCESS] Build completed successfully',
    '[INFO] Running security scan...',
    '[INFO] Scanning for vulnerabilities',
    '[SUCCESS] No critical vulnerabilities found',
    '[INFO] Deploying to staging environment...',
    '[INFO] Uploading artifacts',
    '[SUCCESS] Deployment completed',
    '[INFO] Running smoke tests...',
    '[SUCCESS] All smoke tests passed',
  ];

  const build = getBuildById(buildId);
  if (build?.status === 'failed') {
    logTemplates.push('[ERROR] Build failed with exit code 1');
    logTemplates.push('[ERROR] Error: Module not found');
  }

  return logTemplates;
}
