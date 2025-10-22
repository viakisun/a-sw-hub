// Core type definitions for A-SW Hub

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: 'admin' | 'developer' | 'viewer';
  githubUsername?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  visibility: 'public' | 'private';
  owner: User;
  language: ProgrammingLanguage;
  icon?: string;
  stars: number;
  forks: number;
  contributors: number;
  lastCommit: Date;
  createdAt: Date;
  updatedAt: Date;
  repository: {
    url: string;
    defaultBranch: string;
    branches: string[];
  };
  buildStatus?: BuildStatus;
  coverage?: number;
  license?: string;
}

export interface Build {
  id: string;
  projectId: string;
  projectName: string;
  pipelineId: string;
  buildNumber: number;
  status: BuildStatus;
  branch: string;
  commit: {
    sha: string;
    message: string;
    author: string;
    timestamp: Date;
  };
  startedAt: Date;
  finishedAt?: Date;
  duration?: number;
  stages: BuildStage[];
  triggeredBy: User;
  environment: DeploymentEnvironment;
}

export interface BuildStage {
  id: string;
  name: string;
  status: BuildStatus;
  startedAt: Date;
  finishedAt?: Date;
  duration?: number;
  logs?: string[];
  jobs?: BuildJob[];
}

export interface BuildJob {
  id: string;
  name: string;
  status: BuildStatus;
  runner?: string;
  startedAt: Date;
  finishedAt?: Date;
  exitCode?: number;
}

export interface Pipeline {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'paused';
  config: PipelineConfig;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineConfig {
  triggers: PipelineTrigger[];
  stages: PipelineStage[];
  environment: DeploymentEnvironment;
  notifications: NotificationConfig;
}

export interface PipelineTrigger {
  type: 'push' | 'pull_request' | 'schedule' | 'manual' | 'tag';
  branches?: string[];
  schedule?: string; // Cron expression
}

export interface PipelineStage {
  name: string;
  jobs: string[];
  dependsOn?: string[];
  condition?: string;
}

export interface Approval {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  requestor: User;
  requestedAt: Date;
  approver?: User;
  approvedAt?: Date;
  environment: DeploymentEnvironment;
  projectId: string;
  projectName: string;
  buildId?: string;
  qualityChecks: QualityCheck[];
  changes?: Change[];
  comments?: ApprovalComment[];
}

export interface QualityCheck {
  name: 'Security' | 'Tests' | 'Performance' | 'Coverage' | 'Code Quality';
  status: 'pass' | 'warn' | 'fail';
  value?: number;
  threshold?: number;
  details?: string;
}

export interface Change {
  type: 'added' | 'modified' | 'deleted';
  path: string;
  diff?: string;
}

export interface ApprovalComment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: User;
  target: {
    type: 'project' | 'build' | 'approval' | 'deployment';
    id: string;
    name: string;
  };
  action: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  userId: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalProjects: number;
  buildsToday: number;
  successRate: number;
  activeUsers: number;
  buildTrends: BuildTrend[];
  languageDistribution: LanguageStat[];
}

export interface BuildTrend {
  date: string;
  successful: number;
  failed: number;
  total: number;
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

// Enums and Types

export type ProjectCategory =
  | 'crop-management'
  | 'soil-analysis'
  | 'irrigation'
  | 'pest-control'
  | 'harvest-optimization'
  | 'supply-chain'
  | 'farm-analytics'
  | 'weather-monitoring'
  | 'livestock'
  | 'market-analysis';

export type ProjectStatus = 'active' | 'maintenance' | 'archived' | 'deprecated';

export type BuildStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'on-hold';

export type ApprovalType = 'deployment' | 'merge' | 'release' | 'configuration' | 'access';

export type DeploymentEnvironment = 'development' | 'staging' | 'production' | 'testing';

export type ProgrammingLanguage =
  | 'TypeScript'
  | 'JavaScript'
  | 'Python'
  | 'Java'
  | 'Go'
  | 'Rust'
  | 'C++'
  | 'Ruby'
  | 'PHP'
  | 'Swift';

export type ActivityType =
  | 'project_created'
  | 'project_updated'
  | 'build_started'
  | 'build_completed'
  | 'deployment_initiated'
  | 'deployment_completed'
  | 'approval_requested'
  | 'approval_granted'
  | 'approval_rejected'
  | 'user_joined'
  | 'comment_added';

export interface NotificationConfig {
  email: boolean;
  slack: boolean;
  onSuccess: boolean;
  onFailure: boolean;
  recipients: string[];
}

// Helper types for forms and UI

export interface FilterOptions {
  categories?: ProjectCategory[];
  statuses?: ProjectStatus[];
  languages?: ProgrammingLanguage[];
  environments?: DeploymentEnvironment[];
  priorities?: ('low' | 'medium' | 'high' | 'urgent')[];
}

export interface SortOptions {
  field: 'name' | 'date' | 'status' | 'stars' | 'activity';
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
  rememberMe: boolean;
}

export interface FormError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: any;
  options?: any;
}

// Project creation wizard types

export interface ProjectWizardData {
  basic: {
    name: string;
    category: ProjectCategory;
    description: string;
    visibility: 'public' | 'private';
    license?: string;
  };
  repository: {
    type: 'new' | 'existing' | 'import';
    url?: string;
    importFrom?: 'github' | 'gitlab' | 'bitbucket';
    initWithReadme?: boolean;
    gitignoreTemplate?: string;
  };
  cicd: {
    enabled: boolean;
    triggers: PipelineTrigger[];
    environment: DeploymentEnvironment;
    autoTest: boolean;
    autoDeploy: boolean;
    notifications: NotificationConfig;
  };
}

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error' | 'debug';
  message: string;
  source?: string;
}
