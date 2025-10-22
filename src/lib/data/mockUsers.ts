import { nanoid } from 'nanoid';
import type { User } from '$lib/types';
import { subDays, subHours } from 'date-fns';

// Generate mock users with GitHub-style data
export const mockUsers: User[] = [
  {
    id: nanoid(),
    username: 'sarah.chen',
    email: 'sarah.chen@aswtech.com',
    name: 'Sarah Chen',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sarah`,
    role: 'admin',
    githubUsername: 'sarahchen',
    createdAt: subDays(new Date(), 365),
    lastLogin: subHours(new Date(), 2),
  },
  {
    id: nanoid(),
    username: 'james.wilson',
    email: 'james.wilson@aswtech.com',
    name: 'James Wilson',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=james`,
    role: 'developer',
    githubUsername: 'jwilson',
    createdAt: subDays(new Date(), 280),
    lastLogin: subHours(new Date(), 5),
  },
  {
    id: nanoid(),
    username: 'maria.garcia',
    email: 'maria.garcia@aswtech.com',
    name: 'Maria Garcia',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=maria`,
    role: 'developer',
    githubUsername: 'mgarcia',
    createdAt: subDays(new Date(), 200),
    lastLogin: subHours(new Date(), 1),
  },
  {
    id: nanoid(),
    username: 'alex.kumar',
    email: 'alex.kumar@aswtech.com',
    name: 'Alex Kumar',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alex`,
    role: 'developer',
    githubUsername: 'alexkumar',
    createdAt: subDays(new Date(), 150),
    lastLogin: subHours(new Date(), 12),
  },
  {
    id: nanoid(),
    username: 'emma.johnson',
    email: 'emma.johnson@aswtech.com',
    name: 'Emma Johnson',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=emma`,
    role: 'developer',
    githubUsername: 'emmaj',
    createdAt: subDays(new Date(), 90),
    lastLogin: subHours(new Date(), 3),
  },
  {
    id: nanoid(),
    username: 'michael.brown',
    email: 'michael.brown@aswtech.com',
    name: 'Michael Brown',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=michael`,
    role: 'viewer',
    githubUsername: 'mbrown',
    createdAt: subDays(new Date(), 60),
    lastLogin: subHours(new Date(), 24),
  },
  {
    id: nanoid(),
    username: 'lisa.anderson',
    email: 'lisa.anderson@aswtech.com',
    name: 'Lisa Anderson',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=lisa`,
    role: 'developer',
    githubUsername: 'landerson',
    createdAt: subDays(new Date(), 45),
    lastLogin: subHours(new Date(), 6),
  },
  {
    id: nanoid(),
    username: 'david.lee',
    email: 'david.lee@aswtech.com',
    name: 'David Lee',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=david`,
    role: 'admin',
    githubUsername: 'davidlee',
    createdAt: subDays(new Date(), 400),
    lastLogin: subHours(new Date(), 0),
  },
  {
    id: nanoid(),
    username: 'sophia.martinez',
    email: 'sophia.martinez@aswtech.com',
    name: 'Sophia Martinez',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sophia`,
    role: 'developer',
    githubUsername: 'sophiam',
    createdAt: subDays(new Date(), 120),
    lastLogin: subHours(new Date(), 4),
  },
  {
    id: nanoid(),
    username: 'ryan.taylor',
    email: 'ryan.taylor@aswtech.com',
    name: 'Ryan Taylor',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=ryan`,
    role: 'developer',
    githubUsername: 'ryant',
    createdAt: subDays(new Date(), 75),
    lastLogin: subHours(new Date(), 8),
  },
];

// Helper to get a random user
export function getRandomUser(): User {
  return mockUsers[Math.floor(Math.random() * mockUsers.length)];
}

// Helper to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

// Helper to get users by role
export function getUsersByRole(role: User['role']): User[] {
  return mockUsers.filter((user) => user.role === role);
}

// Get the current logged-in user (mock)
export function getCurrentUser(): User {
  return mockUsers[0]; // Sarah Chen as default admin
}
