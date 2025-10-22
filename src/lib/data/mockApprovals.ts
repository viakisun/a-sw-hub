import { nanoid } from 'nanoid';
import type {
  Approval,
  ApprovalType,
  ApprovalStatus,
  QualityCheck,
  Change,
  DeploymentEnvironment,
} from '$lib/types';
import { subHours, subDays } from 'date-fns';
import { getRandomUser } from './mockUsers';
import { mockProjects } from './mockProjects';
import { mockBuilds } from './mockBuilds';

const approvalTitles: Record<ApprovalType, string[]> = {
  deployment: [
    'Deploy v2.3.4 to production',
    'Emergency hotfix deployment',
    'Feature rollout to staging',
    'Database migration deployment',
    'Infrastructure update rollout',
  ],
  merge: [
    'Merge feature/irrigation-v2 to main',
    'Merge security patches',
    'Merge performance improvements',
    'Merge bug fixes from develop',
    'Merge documentation updates',
  ],
  release: [
    'Release version 3.0.0',
    'Quarterly feature release',
    'Security patch release',
    'Mobile app release v1.2.0',
    'API version bump',
  ],
  configuration: [
    'Update environment variables',
    'Change database connection pool',
    'Modify rate limiting rules',
    'Update API keys rotation',
    'Change monitoring thresholds',
  ],
  access: [
    'Grant production access to developer',
    'Add new team member permissions',
    'Modify service account roles',
    'Update API access tokens',
    'Change deployment permissions',
  ],
};

const changeFiles = [
  'src/controllers/harvest.controller.ts',
  'src/services/irrigation.service.ts',
  'src/models/crop.model.ts',
  'config/database.config.js',
  'src/utils/weather-api.ts',
  'package.json',
  'docker-compose.yml',
  '.env.production',
  'src/components/Dashboard.tsx',
  'src/api/routes/analytics.ts',
];

function generateQualityChecks(): QualityCheck[] {
  const checks: QualityCheck[] = [
    {
      name: 'Security',
      status: Math.random() > 0.2 ? 'pass' : Math.random() > 0.5 ? 'warn' : 'fail',
      value: Math.floor(Math.random() * 5),
      threshold: 0,
      details: 'Vulnerability scan completed',
    },
    {
      name: 'Tests',
      status: Math.random() > 0.3 ? 'pass' : Math.random() > 0.5 ? 'warn' : 'fail',
      value: Math.floor(Math.random() * 50) + 50,
      threshold: 80,
      details: 'Unit and integration tests',
    },
    {
      name: 'Performance',
      status: Math.random() > 0.4 ? 'pass' : 'warn',
      value: Math.floor(Math.random() * 500) + 200,
      threshold: 500,
      details: 'Load time in milliseconds',
    },
    {
      name: 'Coverage',
      status: Math.random() > 0.3 ? 'pass' : 'warn',
      value: Math.floor(Math.random() * 30) + 60,
      threshold: 70,
      details: 'Code coverage percentage',
    },
  ];

  // Add Code Quality check randomly
  if (Math.random() > 0.5) {
    checks.push({
      name: 'Code Quality',
      status: Math.random() > 0.4 ? 'pass' : 'warn',
      value: Math.floor(Math.random() * 20) + 80,
      threshold: 75,
      details: 'Sonar quality gate',
    });
  }

  return checks;
}

function generateChanges(): Change[] {
  const numChanges = Math.floor(Math.random() * 5) + 2;
  const changes: Change[] = [];

  for (let i = 0; i < numChanges; i++) {
    const file = changeFiles[Math.floor(Math.random() * changeFiles.length)];
    const type = Math.random() > 0.7 ? 'added' : Math.random() > 0.3 ? 'modified' : 'deleted';

    changes.push({
      type,
      path: file,
      diff:
        type !== 'deleted'
          ? `+${Math.floor(Math.random() * 100)} -${Math.floor(Math.random() * 50)}`
          : undefined,
    });
  }

  return changes;
}

function generateApproval(index: number): Approval {
  const types: ApprovalType[] = ['deployment', 'merge', 'release', 'configuration', 'access'];
  const type = types[Math.floor(Math.random() * types.length)];
  const titles = approvalTitles[type];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const project = mockProjects[Math.floor(Math.random() * Math.min(30, mockProjects.length))];
  const build =
    Math.random() > 0.3
      ? mockBuilds[Math.floor(Math.random() * Math.min(10, mockBuilds.length))]
      : undefined;

  const environments: DeploymentEnvironment[] = ['development', 'staging', 'production', 'testing'];
  const environment = environments[Math.floor(Math.random() * environments.length)];

  const priorities = ['low', 'medium', 'high', 'urgent'] as const;
  const priority =
    Math.random() > 0.7
      ? 'urgent'
      : Math.random() > 0.5
        ? 'high'
        : Math.random() > 0.3
          ? 'medium'
          : 'low';

  const statuses: ApprovalStatus[] = ['pending', 'approved', 'rejected', 'on-hold'];
  const status = index <= 5 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];

  const requestedAt =
    index <= 3
      ? subHours(new Date(), Math.floor(Math.random() * 6) + 1)
      : subDays(new Date(), Math.floor(Math.random() * 7) + 1);

  const requestor = getRandomUser();
  const approver = status !== 'pending' ? getRandomUser() : undefined;
  const approvedAt = approver ? subHours(requestedAt, -Math.floor(Math.random() * 24)) : undefined;

  return {
    id: nanoid(),
    type,
    status,
    priority,
    title,
    description: `${title} - Requires approval for ${environment} environment. This ${type} includes critical updates that need review.`,
    requestor,
    requestedAt,
    approver,
    approvedAt,
    environment,
    projectId: project.id,
    projectName: project.name,
    buildId: build?.id,
    qualityChecks: generateQualityChecks(),
    changes: type === 'merge' || type === 'deployment' ? generateChanges() : undefined,
    comments:
      status !== 'pending' && Math.random() > 0.5
        ? [
            {
              id: nanoid(),
              author: approver!,
              content:
                status === 'approved'
                  ? 'Looks good to me. All checks passed.'
                  : status === 'rejected'
                    ? 'Found issues that need to be addressed before approval.'
                    : 'Putting on hold until dependencies are resolved.',
              createdAt: approvedAt!,
            },
          ]
        : undefined,
  };
}

// Generate mock approvals
export const mockApprovals: Approval[] = Array.from({ length: 25 }, (_, i) =>
  generateApproval(i + 1)
).sort((a, b) => {
  // Sort by status (pending first) then by date
  if (a.status === 'pending' && b.status !== 'pending') return -1;
  if (a.status !== 'pending' && b.status === 'pending') return 1;
  return b.requestedAt.getTime() - a.requestedAt.getTime();
});

// Helper functions
export function getApprovalById(id: string): Approval | undefined {
  return mockApprovals.find((a) => a.id === id);
}

export function getPendingApprovals(): Approval[] {
  return mockApprovals.filter((a) => a.status === 'pending');
}

export function getApprovalsByType(type: ApprovalType): Approval[] {
  return mockApprovals.filter((a) => a.type === type);
}

export function getApprovalsByStatus(status: ApprovalStatus): Approval[] {
  return mockApprovals.filter((a) => a.status === status);
}

export function getApprovalsByProject(projectId: string): Approval[] {
  return mockApprovals.filter((a) => a.projectId === projectId);
}

export function getUrgentApprovals(): Approval[] {
  return mockApprovals.filter((a) => a.priority === 'urgent' && a.status === 'pending');
}

export function getApprovalsByEnvironment(env: DeploymentEnvironment): Approval[] {
  return mockApprovals.filter((a) => a.environment === env);
}
