import { nanoid } from 'nanoid';
import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  ProgrammingLanguage,
  BuildStatus,
} from '$lib/types';
import { subDays, subHours, subMinutes } from 'date-fns';
import { mockUsers, getRandomUser } from './mockUsers';
import { institutions } from './institutions';
import { deliverables } from './deliverables';

// 실제 A-SW 사업 프로젝트 데이터
const aswProjects: Partial<Project>[] = [
  // 메인 프로젝트
  {
    id: 'PRJ-ASW-2024',
    name: 'A-SW 통합 플랫폼',
    slug: 'asw-integrated-platform',
    category: 'farm-analytics',
    status: 'active',
    language: 'TypeScript',
    description: '무인자율 농작업 소프트웨어 통합 플랫폼 - 1단계 3개년 + 2단계 2개년 국가 R&D 사업',
    visibility: 'public',
    stars: 342,
    forks: 89,
    contributors: 45,
    // issues:12,
    // pullRequests:5,
    createdAt: new Date('2024-01-01'),
    lastCommit: new Date(),
    buildStatus: 'success',
    // tags:['국가R&D', '스마트팜', 'ISOBUS', 'V2X', 'MIL/HIL'],
    // readme:'# A-SW 통합 플랫폼\n\n무인자율 농작업을 위한 개방형 소프트웨어 플랫폼',
    repository: {
      url: 'https://github.com/asw-hub/integrated-platform',
      defaultBranch: 'main',
      branches: ['main', 'develop', 'feature/v2.0', 'release/1.0']
    },
    // documentation:'https://docs.asw-hub.kr',
    // homepage:'https://asw-hub.kr',
  },

  // KITECH 프로젝트들
  {
    id: 'PRJ-KITECH-001',
    name: '농작업 분석 모듈',
    slug: 'agricultural-task-analysis',
    category: 'crop-management',
    status: 'active',
    language: 'Python',
    description: '무인자율 농작업 분석 및 A-SW 모듈화 파라미터 정립 시스템',
    visibility: 'public',
    stars: 156,
    forks: 34,
    contributors: 12,
    owner: mockUsers[0], // KITECH lead user
    createdAt: new Date('2024-01-15'),
    lastCommit: subDays(new Date(), 2),
    buildStatus: 'success',
    // tags:['작업분석', '파라미터', '시퀀스', '모듈화'],
  },
  {
    id: 'PRJ-KITECH-002',
    name: '경로 제어 시스템',
    slug: 'path-control-system',
    category: 'farm-analytics',
    status: 'active',
    language: 'C++',
    description: '경로 생성/추종/속도 제어 통합 시스템',
    visibility: 'public',
    stars: 203,
    forks: 45,
    contributors: 8,
    owner: mockUsers[0], // KITECH lead user
    createdAt: new Date('2025-01-01'),
    lastCommit: subHours(new Date(), 5),
    buildStatus: 'running',
    // tags:['경로생성', '경로추종', '속도제어', 'ISOBUS'],
  },
  {
    id: 'PRJ-KITECH-003',
    name: 'V2X 협업 플랫폼',
    slug: 'v2x-collaboration',
    category: 'farm-analytics',
    status: 'maintenance',
    language: 'Go',
    description: 'V2X 기반 다수 장비 협업 제어 플랫폼',
    visibility: 'public',
    stars: 89,
    forks: 23,
    contributors: 6,
    owner: mockUsers[0], // KITECH lead user
    createdAt: new Date('2027-01-01'),
    lastCommit: subDays(new Date(), 10),
    buildStatus: 'success',
    // tags:['V2X', '군집제어', '협업', '통신표준'],
  },

  // TYMICT 프로젝트들
  {
    id: 'PRJ-TYMICT-001',
    name: '통합제어기(ICU)',
    slug: 'integrated-control-unit',
    category: 'farm-analytics',
    status: 'active',
    language: 'C++',
    description: '농업용 통합제어기 하드웨어 및 소프트웨어 플랫폼',
    visibility: 'private',
    stars: 67,
    forks: 12,
    contributors: 10,
    owner: mockUsers[1], // TYMICT lead user
    createdAt: new Date('2025-01-01'),
    lastCommit: subDays(new Date(), 1),
    buildStatus: 'success',
    // tags:['ICU', 'RTOS', '하드웨어', '임베디드'],
  },
  {
    id: 'PRJ-TYMICT-002',
    name: 'HMI 시스템',
    slug: 'hmi-system',
    category: 'farm-analytics',
    status: 'active',
    language: 'TypeScript',
    description: '농업용 특화 Human-Machine Interface 시스템',
    visibility: 'public',
    stars: 234,
    forks: 56,
    contributors: 15,
    owner: mockUsers[1], // TYMICT lead user
    createdAt: new Date('2025-04-01'),
    lastCommit: new Date(),
    buildStatus: 'success',
    // tags:['HMI', 'UI/UX', '터치스크린', '대시보드'],
  },
  {
    id: 'PRJ-TYMICT-003',
    name: 'AI 미들웨어',
    slug: 'ai-middleware',
    category: 'farm-analytics',
    status: 'active',
    language: 'Python',
    description: '멀티모달 AI 융합 미들웨어 플랫폼',
    visibility: 'public',
    stars: 178,
    forks: 42,
    contributors: 9,
    owner: mockUsers[1], // TYMICT lead user
    createdAt: new Date('2026-03-01'),
    lastCommit: subHours(new Date(), 12),
    buildStatus: 'failed',
    // tags:['AI', '센서융합', '미들웨어', '실시간처리'],
  },

  // JBN 프로젝트들
  {
    id: 'PRJ-JBN-001',
    name: '측위 알고리즘',
    slug: 'positioning-algorithm',
    category: 'weather-monitoring',
    status: 'active',
    language: 'Python',
    description: '고정밀 측위 및 SLAM 알고리즘',
    visibility: 'public',
    stars: 298,
    forks: 78,
    contributors: 8,
    owner: mockUsers[2], // JBN lead user
    createdAt: new Date('2025-01-01'),
    lastCommit: subDays(new Date(), 3),
    buildStatus: 'success',
    // tags:['SLAM', 'GPS', 'RTK', '측위'],
  },
  {
    id: 'PRJ-JBN-002',
    name: '환경인지 모듈',
    slug: 'environment-perception',
    category: 'farm-analytics',
    status: 'active',
    language: 'Python',
    description: '딥러닝 기반 농업환경 인지 시스템',
    visibility: 'public',
    stars: 412,
    forks: 123,
    contributors: 12,
    owner: mockUsers[2], // JBN lead user
    createdAt: new Date('2025-02-01'),
    lastCommit: new Date(),
    buildStatus: 'running',
    // tags:['컴퓨터비전', '딥러닝', '장애물검출', '작물인식'],
  },
  {
    id: 'PRJ-JBN-003',
    name: '학습 데이터베이스',
    slug: 'training-database',
    category: 'farm-analytics',
    status: 'active',
    language: 'Python',
    description: '농업 AI 학습용 대규모 데이터셋 및 라벨링 플랫폼',
    visibility: 'public',
    stars: 189,
    forks: 45,
    contributors: 20,
    owner: mockUsers[2], // JBN lead user
    createdAt: new Date('2025-01-01'),
    lastCommit: subDays(new Date(), 5),
    buildStatus: 'success',
    // tags:['데이터셋', '라벨링', '학습데이터', 'AI'],
  },

  // VIA 프로젝트들
  {
    id: 'PRJ-VIA-001',
    name: 'A-SW Hub Platform',
    slug: 'asw-hub-platform',
    category: 'farm-analytics',
    status: 'active',
    language: 'TypeScript',
    description: '개방형 A-SW 공유 및 협업 플랫폼',
    visibility: 'public',
    stars: 567,
    forks: 156,
    contributors: 25,
    owner: mockUsers[3], // VIA lead user
    createdAt: new Date('2024-02-01'),
    lastCommit: new Date(),
    buildStatus: 'success',
    // tags:['플랫폼', 'MSA', 'DevOps', 'CI/CD'],
  },
  {
    id: 'PRJ-VIA-002',
    name: '인증/권한 시스템',
    slug: 'auth-system',
    category: 'farm-analytics',
    status: 'active',
    language: 'TypeScript',
    description: 'OAuth2/OIDC 기반 통합 인증 시스템',
    visibility: 'public',
    stars: 234,
    forks: 67,
    contributors: 8,
    owner: mockUsers[3], // VIA lead user
    createdAt: new Date('2025-02-01'),
    lastCommit: subHours(new Date(), 2),
    buildStatus: 'success',
    // tags:['OAuth2', 'OIDC', 'RBAC', '보안'],
  },
  {
    id: 'PRJ-VIA-003',
    name: 'Git 협업 시스템',
    slug: 'git-collaboration',
    category: 'farm-analytics',
    status: 'active',
    language: 'Go',
    description: 'Git 기반 A-SW 저장소 및 협업 워크플로우',
    visibility: 'public',
    stars: 389,
    forks: 98,
    contributors: 18,
    owner: mockUsers[3], // VIA lead user
    createdAt: new Date('2025-04-01'),
    lastCommit: subDays(new Date(), 1),
    buildStatus: 'success',
    // tags:['Git', 'Repository', 'Fork', 'PR'],
  },

  // OntarioTech 프로젝트들
  {
    id: 'PRJ-ONTARIO-001',
    name: 'Path Optimizer',
    slug: 'path-optimizer',
    category: 'harvest-optimization',
    status: 'active',
    language: 'Python',
    description: 'Multi-agent path optimization for agricultural machinery',
    visibility: 'public',
    stars: 145,
    forks: 38,
    contributors: 6,
    owner: mockUsers[4], // OntarioTech lead user
    createdAt: new Date('2025-02-01'),
    lastCommit: subDays(new Date(), 7),
    buildStatus: 'success',
    // tags:['Optimization', 'Heuristics', 'PathPlanning', 'MultiAgent'],
  },
  {
    id: 'PRJ-ONTARIO-002',
    name: 'Task Scheduler',
    slug: 'task-scheduler',
    category: 'farm-analytics',
    status: 'active',
    language: 'Java',
    description: 'Cooperative task allocation and scheduling system',
    visibility: 'public',
    stars: 98,
    forks: 25,
    contributors: 5,
    owner: mockUsers[4], // OntarioTech lead user
    createdAt: new Date('2025-04-01'),
    lastCommit: subDays(new Date(), 4),
    buildStatus: 'success',
    // tags:['Scheduling', 'TaskAllocation', 'Cooperation', 'Algorithm'],
  },
];

// Generate project descriptions based on category
function generateDescription(category: ProjectCategory, name: string): string {
  const descriptions: Record<ProjectCategory, string[]> = {
    'crop-management': [
      '작물 생육 전주기 관리 시스템',
      '지능형 작물 모니터링 및 최적화 플랫폼',
      '실시간 작물 건강 추적 솔루션',
      '자동화된 작물 계획 및 일정 관리 시스템',
    ],
    'soil-analysis': [
      '종합 토양 검사 및 분석 플랫폼',
      'AI 기반 토양 건강 모니터링 시스템',
      '실시간 토양 영양소 추적 솔루션',
      'Predictive soil quality management tool',
    ],
    irrigation: [
      'Smart irrigation scheduling and control system',
      'Water-efficient irrigation management platform',
      'Automated drip irrigation controller',
      'Precision water distribution system',
    ],
    'pest-control': [
      'Integrated pest management solution',
      'AI-based pest detection and prevention system',
      'Natural pest control monitoring platform',
      'Early warning pest detection system',
    ],
    'harvest-optimization': [
      'Harvest timing prediction and optimization tool',
      'Yield forecasting and planning platform',
      'Automated harvest scheduling system',
      'Post-harvest quality management solution',
    ],
    'supply-chain': [
      'Farm-to-market supply chain tracker',
      'Agricultural logistics management platform',
      'Cold chain monitoring system',
      'Produce traceability solution',
    ],
    'farm-analytics': [
      'Comprehensive farm data analytics platform',
      'Agricultural business intelligence dashboard',
      'Farm performance monitoring system',
      'Predictive farm analytics tool',
    ],
    'weather-monitoring': [
      'Hyperlocal weather forecasting system',
      'Climate-smart agriculture platform',
      'Weather-based farm advisory system',
      'Microclimate monitoring solution',
    ],
    livestock: [
      'Smart livestock management system',
      'Animal health monitoring platform',
      'Automated feeding control system',
      'Livestock tracking and analytics tool',
    ],
    'market-analysis': [
      'Agricultural commodity price tracker',
      'Market demand forecasting platform',
      'Crop price prediction system',
      'Agricultural trading analytics tool',
    ],
  };

  const categoryDescriptions = descriptions[category];
  return `${categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]} - ${name}`;
}

// Complete project data with defaults
function completeProject(partial: Partial<Project>): Project {
  const owner = partial.owner || getRandomUser();
  const slug = partial.slug || partial.name?.toLowerCase().replace(/\s+/g, '-') || 'project';

  return {
    id: partial.id || nanoid(),
    slug: slug,
    name: partial.name || 'Unnamed Project',
    description: partial.description || '',
    category: partial.category || 'farm-analytics',
    status: partial.status || 'active',
    visibility: partial.visibility || 'public',
    owner,
    language: partial.language || 'TypeScript',
    icon: partial.icon || `https://api.dicebear.com/7.x/identicon/svg?seed=${slug}`,
    stars: partial.stars || 0,
    forks: partial.forks || 0,
    contributors: partial.contributors || 1,
    // issues:partial.issues || 0,
    // pullRequests:partial.pullRequests || 0,
    lastCommit: partial.lastCommit || new Date(),
    createdAt: partial.createdAt || new Date(),
    updatedAt: partial.updatedAt || new Date(),
    repository: partial.repository || {
      url: `https://github.com/asw-hub/${slug}`,
      defaultBranch: 'main',
      branches: ['main', 'develop'],
    },
    buildStatus: partial.buildStatus || 'success',
    coverage: partial.coverage || 75,
    license: partial.license || 'MIT',
    // tags:partial.tags || [],
    // readme:partial.readme || '',
    // documentation:partial.documentation || '',
    // homepage:partial.homepage || '',
  };
}

// Export A-SW projects as mockProjects
export const mockProjects: Project[] = aswProjects.map(p => completeProject(p));

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return mockProjects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return mockProjects.filter((p) => p.category === category);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return mockProjects.filter((p) => p.status === status);
}

export function getProjectsByLanguage(language: ProgrammingLanguage): Project[] {
  return mockProjects.filter((p) => p.language === language);
}

export function searchProjects(query: string): Project[] {
  const lowerQuery = query.toLowerCase();
  return mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.includes(lowerQuery) ||
      p.language.toLowerCase().includes(lowerQuery)
  );
}

export function getRecentProjects(limit: number = 10): Project[] {
  return [...mockProjects]
    .sort((a, b) => b.lastCommit.getTime() - a.lastCommit.getTime())
    .slice(0, limit);
}

export function getPopularProjects(limit: number = 10): Project[] {
  return [...mockProjects].sort((a, b) => b.stars - a.stars).slice(0, limit);
}
