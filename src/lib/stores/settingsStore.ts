import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types';

// Settings Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  department: string;
  role: string;
  phone: string;
  location: string;
  bio: string;
  avatar?: string;
  joinDate: string;
}

export interface SecuritySettings {
  password: {
    lastChanged: Date;
    requireChange: boolean;
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
  twoFactor: {
    enabled: boolean;
    method: 'app' | 'sms' | 'email';
    backupCodes: string[];
  };
  apiKeys: ApiKey[];
  sessions: Session[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  permissions: string[];
  expiresAt?: Date;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  browser: string;
  lastActive: Date;
  current: boolean;
}

export interface NotificationSettings {
  channels: {
    email: NotificationPreferences;
    push: NotificationPreferences;
    slack: NotificationPreferences;
  };
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

export interface NotificationPreferences {
  enabled: boolean;
  builds: boolean;
  deployments: boolean;
  approvals: boolean;
  security: boolean;
  updates: boolean;
  mentions: boolean;
  reviews: boolean;
}

export interface PreferencesSettings {
  theme: 'DARK' | 'LIGHT' | 'SYSTEM';
  language: 'EN' | 'KO' | 'JA' | 'ZH';
  timezone: string;
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  timeFormat: '24H' | '12H';
  firstDayOfWeek: 'MONDAY' | 'SUNDAY';
  numberFormat: 'COMMA' | 'PERIOD' | 'SPACE';
  defaultView: 'DASHBOARD' | 'PROJECTS' | 'BUILDS';
}

export interface IntegrationSettings {
  github: {
    enabled: boolean;
    username?: string;
    organizations?: string[];
    webhooks?: string[];
  };
  gitlab: {
    enabled: boolean;
    url?: string;
    token?: string;
  };
  jenkins: {
    enabled: boolean;
    url?: string;
    username?: string;
  };
  slack: {
    enabled: boolean;
    workspace?: string;
    channel?: string;
    webhookUrl?: string;
  };
  jira: {
    enabled: boolean;
    url?: string;
    project?: string;
    apiToken?: string;
  };
  sonarqube: {
    enabled: boolean;
    url?: string;
    token?: string;
    qualityGate?: string;
  };
}

export interface DataPrivacySettings {
  dataRetention: {
    logs: number; // days
    builds: number; // days
    metrics: number; // days
    artifacts: number; // days
  };
  exportHistory: DataExport[];
  gdpr: {
    consentDate?: Date;
    dataProcessingAgreement: boolean;
    marketingEmails: boolean;
    analyticsTracking: boolean;
  };
}

export interface DataExport {
  id: string;
  requestedAt: Date;
  completedAt?: Date;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  format: 'JSON' | 'CSV' | 'XML';
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface SettingsState {
  profile: UserProfile | null;
  security: SecuritySettings | null;
  notifications: NotificationSettings | null;
  preferences: PreferencesSettings | null;
  integrations: IntegrationSettings | null;
  dataPrivacy: DataPrivacySettings | null;
  loading: boolean;
  error: string | null;
  isDirty: boolean;
  lastSaved?: Date;
}

// Mock data
const mockProfile: UserProfile = {
  id: 'USR-001',
  username: 'admin',
  email: 'admin@asw-hub.kr',
  fullName: 'System Administrator',
  department: 'IT OPERATIONS',
  role: 'SYSTEM ADMIN',
  phone: '+82-10-0000-0000',
  location: 'SEOUL, KR',
  bio: 'Agricultural software platform administrator',
  joinDate: '2024-01-01'
};

const mockSecurity: SecuritySettings = {
  password: {
    lastChanged: new Date('2024-01-01'),
    requireChange: false,
    minLength: 12,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true
  },
  twoFactor: {
    enabled: true,
    method: 'app',
    backupCodes: ['XXXX-XXXX', 'YYYY-YYYY', 'ZZZZ-ZZZZ']
  },
  apiKeys: [
    {
      id: 'KEY-001',
      name: 'CI/CD Pipeline',
      key: 'asw_live_xxxxxxxxxxxxx',
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date(),
      permissions: ['read:projects', 'write:builds', 'read:deployments'],
      expiresAt: new Date('2025-01-15')
    },
    {
      id: 'KEY-002',
      name: 'Monitoring Service',
      key: 'asw_live_yyyyyyyyyyyyy',
      createdAt: new Date('2024-02-01'),
      lastUsed: new Date(),
      permissions: ['read:metrics', 'read:logs'],
    }
  ],
  sessions: [
    {
      id: 'SES-001',
      device: 'MacBook Pro',
      location: 'Seoul, South Korea',
      ip: '192.168.1.100',
      browser: 'Chrome 120.0',
      lastActive: new Date(),
      current: true
    },
    {
      id: 'SES-002',
      device: 'iPhone 15',
      location: 'Seoul, South Korea',
      ip: '192.168.1.101',
      browser: 'Safari 17.0',
      lastActive: new Date(Date.now() - 3600000),
      current: false
    }
  ]
};

const mockNotifications: NotificationSettings = {
  channels: {
    email: {
      enabled: true,
      builds: true,
      deployments: true,
      approvals: true,
      security: true,
      updates: false,
      mentions: true,
      reviews: true
    },
    push: {
      enabled: false,
      builds: false,
      deployments: true,
      approvals: true,
      security: true,
      updates: false,
      mentions: true,
      reviews: false
    },
    slack: {
      enabled: true,
      builds: true,
      deployments: true,
      approvals: true,
      security: true,
      updates: false,
      mentions: true,
      reviews: true
    }
  },
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    timezone: 'Asia/Seoul'
  }
};

const mockPreferences: PreferencesSettings = {
  theme: 'DARK',
  language: 'EN',
  timezone: 'Asia/Seoul',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24H',
  firstDayOfWeek: 'MONDAY',
  numberFormat: 'COMMA',
  defaultView: 'DASHBOARD'
};

const mockIntegrations: IntegrationSettings = {
  github: {
    enabled: true,
    username: 'asw-hub',
    organizations: ['asw-org'],
    webhooks: ['https://api.asw-hub.kr/webhooks/github']
  },
  gitlab: {
    enabled: false
  },
  jenkins: {
    enabled: true,
    url: 'https://jenkins.asw-hub.kr',
    username: 'admin'
  },
  slack: {
    enabled: true,
    workspace: 'ASW-HUB',
    channel: '#deployments',
    webhookUrl: 'https://hooks.slack.com/services/xxx'
  },
  jira: {
    enabled: false
  },
  sonarqube: {
    enabled: true,
    url: 'https://sonar.asw-hub.kr',
    token: 'sqp_xxxxxxxxxxxxx',
    qualityGate: 'ASW Quality Gate'
  }
};

const mockDataPrivacy: DataPrivacySettings = {
  dataRetention: {
    logs: 30,
    builds: 90,
    metrics: 365,
    artifacts: 7
  },
  exportHistory: [
    {
      id: 'EXP-001',
      requestedAt: new Date('2024-10-01'),
      completedAt: new Date('2024-10-01'),
      status: 'COMPLETED',
      format: 'JSON',
      downloadUrl: 'https://exports.asw-hub.kr/exp-001.json',
      expiresAt: new Date('2024-11-01')
    }
  ],
  gdpr: {
    consentDate: new Date('2024-01-01'),
    dataProcessingAgreement: true,
    marketingEmails: false,
    analyticsTracking: true
  }
};

// Initial state
const initialState: SettingsState = {
  profile: null,
  security: null,
  notifications: null,
  preferences: null,
  integrations: null,
  dataPrivacy: null,
  loading: false,
  error: null,
  isDirty: false
};

// Create store
function createSettingsStore() {
  const { subscribe, update, set } = writable<SettingsState>(initialState);

  return {
    subscribe,

    // Load all settings
    loadSettings: async () => {
      update(state => ({ ...state, loading: true, error: null }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In mock mode, return mock data
      update(state => ({
        ...state,
        profile: mockProfile,
        security: mockSecurity,
        notifications: mockNotifications,
        preferences: mockPreferences,
        integrations: mockIntegrations,
        dataPrivacy: mockDataPrivacy,
        loading: false,
        isDirty: false,
        lastSaved: new Date()
      }));
    },

    // Update profile
    updateProfile: (profile: Partial<UserProfile>) => {
      update(state => ({
        ...state,
        profile: state.profile ? { ...state.profile, ...profile } : null,
        isDirty: true
      }));
    },

    // Update security
    updateSecurity: (security: Partial<SecuritySettings>) => {
      update(state => ({
        ...state,
        security: state.security ? { ...state.security, ...security } : null,
        isDirty: true
      }));
    },

    // Update notifications
    updateNotifications: (notifications: Partial<NotificationSettings>) => {
      update(state => ({
        ...state,
        notifications: state.notifications ? { ...state.notifications, ...notifications } : null,
        isDirty: true
      }));
    },

    // Update preferences
    updatePreferences: (preferences: Partial<PreferencesSettings>) => {
      update(state => ({
        ...state,
        preferences: state.preferences ? { ...state.preferences, ...preferences } : null,
        isDirty: true
      }));
    },

    // Update integrations
    updateIntegrations: (integrations: Partial<IntegrationSettings>) => {
      update(state => ({
        ...state,
        integrations: state.integrations ? { ...state.integrations, ...integrations } : null,
        isDirty: true
      }));
    },

    // Update data privacy
    updateDataPrivacy: (dataPrivacy: Partial<DataPrivacySettings>) => {
      update(state => ({
        ...state,
        dataPrivacy: state.dataPrivacy ? { ...state.dataPrivacy, ...dataPrivacy } : null,
        isDirty: true
      }));
    },

    // Save all settings
    saveSettings: async () => {
      update(state => ({ ...state, loading: true, error: null }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      update(state => ({
        ...state,
        loading: false,
        isDirty: false,
        lastSaved: new Date()
      }));
    },

    // Reset to defaults
    resetToDefaults: () => {
      set(initialState);
    },

    // Change password
    changePassword: async (currentPassword: string, newPassword: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      update(state => ({
        ...state,
        security: state.security ? {
          ...state.security,
          password: {
            ...state.security.password,
            lastChanged: new Date(),
            requireChange: false
          }
        } : null
      }));
    },

    // Generate API key
    generateApiKey: async (name: string, permissions: string[]) => {
      const newKey: ApiKey = {
        id: `KEY-${Date.now()}`,
        name,
        key: `asw_live_${Math.random().toString(36).substring(2)}`,
        createdAt: new Date(),
        permissions,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };

      update(state => ({
        ...state,
        security: state.security ? {
          ...state.security,
          apiKeys: [...state.security.apiKeys, newKey]
        } : null
      }));

      return newKey;
    },

    // Revoke API key
    revokeApiKey: async (keyId: string) => {
      update(state => ({
        ...state,
        security: state.security ? {
          ...state.security,
          apiKeys: state.security.apiKeys.filter(k => k.id !== keyId)
        } : null
      }));
    },

    // End session
    endSession: async (sessionId: string) => {
      update(state => ({
        ...state,
        security: state.security ? {
          ...state.security,
          sessions: state.security.sessions.filter(s => s.id !== sessionId)
        } : null
      }));
    },

    // Export data
    requestDataExport: async (format: 'JSON' | 'CSV' | 'XML') => {
      const exportRequest: DataExport = {
        id: `EXP-${Date.now()}`,
        requestedAt: new Date(),
        status: 'PENDING',
        format
      };

      update(state => ({
        ...state,
        dataPrivacy: state.dataPrivacy ? {
          ...state.dataPrivacy,
          exportHistory: [...state.dataPrivacy.exportHistory, exportRequest]
        } : null
      }));

      return exportRequest;
    },

    // Delete account
    deleteAccount: async () => {
      // This would actually delete the account
      await new Promise(resolve => setTimeout(resolve, 2000));
      set(initialState);
    }
  };
}

export const settingsStore = createSettingsStore();

// Derived stores
export const currentTheme = derived(
  settingsStore,
  $settings => $settings.preferences?.theme || 'DARK'
);

export const currentLanguage = derived(
  settingsStore,
  $settings => $settings.preferences?.language || 'EN'
);

export const isProfileComplete = derived(
  settingsStore,
  $settings => {
    const profile = $settings.profile;
    if (!profile) return false;
    return !!(profile.fullName && profile.email && profile.department);
  }
);

export const hasPendingChanges = derived(
  settingsStore,
  $settings => $settings.isDirty
);