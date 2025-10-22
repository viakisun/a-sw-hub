/**
 * Module: Application Configuration
 * Description: Centralized configuration management for all application settings
 * Dependencies: None (pure TypeScript)
 * Notes: All environment-specific settings should be defined here
 * @module config
 */

/**
 * Application environment types
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * API Configuration
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  mockMode: boolean;
}

/**
 * Authentication Configuration
 */
export interface AuthConfig {
  sessionKey: string;
  tokenPrefix: string;
  sessionDurationHours: number;
  rememberMeDurationHours: number;
  allowMockAuth: boolean;
}

/**
 * Feature Flags
 */
export interface FeatureFlags {
  enableRealTimeUpdates: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  enableMockData: boolean;
}

/**
 * UI Configuration
 */
export interface UiConfig {
  defaultPageSize: number;
  maxPageSize: number;
  debounceDelay: number;
  toastDuration: number;
  animationDuration: number;
  chartUpdateInterval: number;
}

/**
 * Application Limits
 */
export interface AppLimits {
  maxFileSize: number;
  maxProjectNameLength: number;
  maxDescriptionLength: number;
  maxConcurrentBuilds: number;
  maxApprovalQueueSize: number;
}

/**
 * Complete Application Configuration
 */
export interface AppConfig {
  environment: Environment;
  version: string;
  buildTimestamp: string;
  api: ApiConfig;
  auth: AuthConfig;
  features: FeatureFlags;
  ui: UiConfig;
  limits: AppLimits;
}

/**
 * Get the current environment
 */
function getEnvironment(): Environment {
  const env = import.meta.env.MODE;
  console.log('[Config] Environment MODE:', env);
  switch (env) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'test':
      return 'test';
    default:
      return 'development';
  }
}

/**
 * Application configuration singleton
 * All configuration should be accessed through this object
 */
export const config: AppConfig = {
  environment: getEnvironment(),
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  buildTimestamp: import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString(),

  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
    mockMode: (() => {
      const viteEnv = import.meta.env.VITE_MOCK_API;
      const isDev = getEnvironment() === 'development';
      const result = viteEnv === 'true' || isDev;
      console.log('[Config] Mock mode calculation:', { viteEnv, isDev, result });
      return result;
    })(),
  },

  auth: {
    sessionKey: 'asw-hub-session',
    tokenPrefix: 'Bearer',
    sessionDurationHours: 24,
    rememberMeDurationHours: 24 * 7,
    allowMockAuth: getEnvironment() !== 'production',
  },

  features: {
    enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: getEnvironment() === 'development',
    enableMockData: getEnvironment() === 'development',
  },

  ui: {
    defaultPageSize: 12,
    maxPageSize: 100,
    debounceDelay: 300,
    toastDuration: 5000,
    animationDuration: 150,
    chartUpdateInterval: 5000,
  },

  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxProjectNameLength: 100,
    maxDescriptionLength: 500,
    maxConcurrentBuilds: 5,
    maxApprovalQueueSize: 50,
  },
};

/**
 * Configuration validator
 * Ensures all required configuration values are present and valid
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Validate API config
  if (!config.api.mockMode && !config.api.baseUrl) {
    errors.push('API base URL is required when not in mock mode');
  }

  // Validate numeric values
  if (config.api.timeout <= 0) {
    errors.push('API timeout must be positive');
  }

  if (config.ui.defaultPageSize <= 0 || config.ui.defaultPageSize > config.ui.maxPageSize) {
    errors.push('Invalid page size configuration');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Validate configuration on module load in development
if (config.environment === 'development') {
  validateConfig();
}

// Freeze configuration to prevent runtime modifications
export default Object.freeze(config);
