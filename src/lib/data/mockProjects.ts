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

// Agricultural project name prefixes and suffixes
const projectPrefixes = [
  'Smart',
  'Agri',
  'Farm',
  'Crop',
  'Soil',
  'Green',
  'Bio',
  'Eco',
  'Harvest',
  'Field',
  'Precision',
  'Digital',
  'Cloud',
  'Auto',
  'AI',
  'ML',
  'IoT',
  'Drone',
  'Satellite',
  'Weather',
];

const projectSuffixes = [
  'Manager',
  'Monitor',
  'Tracker',
  'Analyzer',
  'Optimizer',
  'Assistant',
  'Platform',
  'System',
  'Hub',
  'Suite',
  'Pro',
  'Plus',
  'Connect',
  'Link',
  'Net',
  'Grid',
  'Watch',
  'Guard',
  'Sense',
  'View',
];

const categories: ProjectCategory[] = [
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

const languages: ProgrammingLanguage[] = [
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

const statuses: ProjectStatus[] = ['active', 'maintenance', 'archived', 'deprecated'];
const buildStatuses: BuildStatus[] = ['success', 'failed', 'running', 'pending'];

// Generate project descriptions based on category
function generateDescription(category: ProjectCategory, name: string): string {
  const descriptions: Record<ProjectCategory, string[]> = {
    'crop-management': [
      'Advanced crop lifecycle management system',
      'Intelligent crop monitoring and optimization platform',
      'Real-time crop health tracking solution',
      'Automated crop planning and scheduling system',
    ],
    'soil-analysis': [
      'Comprehensive soil testing and analysis platform',
      'AI-powered soil health monitoring system',
      'Real-time soil nutrient tracking solution',
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

// Generate a single project
function generateProject(index: number): Project {
  const prefix = projectPrefixes[Math.floor(Math.random() * projectPrefixes.length)];
  const suffix = projectSuffixes[Math.floor(Math.random() * projectSuffixes.length)];
  const name = `${prefix}${suffix}`;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const category = categories[Math.floor(Math.random() * categories.length)];
  const status = index < 80 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)];
  const language = languages[Math.floor(Math.random() * languages.length)];
  const buildStatus = buildStatuses[Math.floor(Math.random() * buildStatuses.length)];
  const owner = getRandomUser();

  return {
    id: nanoid(),
    slug: `${slug}-${index}`,
    name: `${name} ${index}`,
    description: generateDescription(category, name),
    category,
    status,
    visibility: Math.random() > 0.3 ? 'public' : 'private',
    owner,
    language,
    icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${slug}`,
    stars: Math.floor(Math.random() * 1000),
    forks: Math.floor(Math.random() * 200),
    contributors: Math.floor(Math.random() * 50) + 1,
    lastCommit:
      index < 20
        ? subMinutes(new Date(), Math.floor(Math.random() * 60))
        : index < 50
          ? subHours(new Date(), Math.floor(Math.random() * 24))
          : subDays(new Date(), Math.floor(Math.random() * 30)),
    createdAt: subDays(new Date(), Math.floor(Math.random() * 365) + 30),
    updatedAt: subDays(new Date(), Math.floor(Math.random() * 30)),
    repository: {
      url: `https://github.com/a-sw-hub/${slug}`,
      defaultBranch: 'main',
      branches: ['main', 'develop', 'staging', 'feature/new-ui', 'feature/api-v2'],
    },
    buildStatus,
    coverage: Math.floor(Math.random() * 40) + 60,
    license: Math.random() > 0.5 ? 'MIT' : Math.random() > 0.5 ? 'Apache-2.0' : 'GPL-3.0',
  };
}

// Generate 142 mock projects
export const mockProjects: Project[] = Array.from({ length: 142 }, (_, i) =>
  generateProject(i + 1)
);

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
