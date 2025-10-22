/**
 * Module: Authentication Types and Validation
 * Description: Type definitions and validation schemas for authentication domain
 * Dependencies: zod
 * Notes: All auth-related types should be defined here with corresponding validation
 * @module domains/auth/types
 */

import { z } from 'zod';
import type { User } from '../../lib/types';

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email is too long');

/**
 * Password validation schema
 */
const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

/**
 * Login credentials schema
 */
export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Login request schema
 */
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});

/**
 * OAuth provider schema
 */
export const oauthProviderSchema = z.enum(['github', 'google', 'microsoft']);

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Registration schema
 */
export const registrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username is too long')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and dashes'
      ),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Auth namespace for all validation schemas
 */
export const authSchema = {
  credentials: credentialsSchema,
  loginRequest: loginRequestSchema,
  oauthProvider: oauthProviderSchema,
  passwordResetRequest: passwordResetRequestSchema,
  passwordResetConfirm: passwordResetConfirmSchema,
  registration: registrationSchema,
} as const;

/**
 * TypeScript types derived from schemas
 */
export type AuthCredentials = z.infer<typeof credentialsSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>;
export type Registration = z.infer<typeof registrationSchema>;

/**
 * Authentication response from server
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * OAuth callback parameters
 */
export interface OAuthCallbackParams {
  code: string;
  state: string;
  provider: OAuthProvider;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Token payload structure
 */
export interface TokenPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expiration
  jti?: string; // JWT ID
}

/**
 * Session metadata
 */
export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceId?: string;
  lastActivity: Date;
}

/**
 * Authentication events
 */
export enum AuthEvent {
  LOGIN_SUCCESS = 'auth:login:success',
  LOGIN_FAILURE = 'auth:login:failure',
  LOGOUT = 'auth:logout',
  SESSION_EXPIRED = 'auth:session:expired',
  SESSION_REFRESHED = 'auth:session:refreshed',
  TOKEN_INVALID = 'auth:token:invalid',
}

/**
 * Authentication error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'AUTH_ACCOUNT_DISABLED',
  EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  MFA_REQUIRED = 'AUTH_MFA_REQUIRED',
  MFA_INVALID = 'AUTH_MFA_INVALID',
  OAUTH_ERROR = 'AUTH_OAUTH_ERROR',
  NETWORK_ERROR = 'AUTH_NETWORK_ERROR',
}
