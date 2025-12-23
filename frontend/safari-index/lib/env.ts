/**
 * Central Environment Authority
 *
 * Single source of truth for all environment configuration.
 * Consolidates app mode, API base, CDN base, and safety checks.
 *
 * Per MVP_FREEZE.md: Production is observation mode, staging is build mode.
 */

import { getAppMode, isBuildMode, isObservationMode } from './app-mode';
import { getApiBase, isApiBaseConfigured } from './api-base';
import { getCdnBase, isCdnEnabled } from './cdn';

// Re-export core functions for convenience
export {
  getAppMode,
  isBuildMode,
  isObservationMode,
  getApiBase,
  isApiBaseConfigured,
  getCdnBase,
  isCdnEnabled,
};

/**
 * Environment name derived from app mode
 */
export function getEnvName(): 'production' | 'staging' | 'development' {
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  return isObservationMode() ? 'production' : 'staging';
}

/**
 * Complete environment configuration snapshot
 */
export interface EnvConfig {
  envName: 'production' | 'staging' | 'development';
  appMode: 'observation' | 'build';
  apiBase: string;
  apiBaseConfigured: boolean;
  cdnBase: string | undefined;
  cdnEnabled: boolean;
  nodeEnv: string;
}

/**
 * Get complete environment configuration
 */
export function getEnvConfig(): EnvConfig {
  return {
    envName: getEnvName(),
    appMode: getAppMode(),
    apiBase: getApiBase(),
    apiBaseConfigured: isApiBaseConfigured(),
    cdnBase: getCdnBase(),
    cdnEnabled: isCdnEnabled(),
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

/**
 * Production Safety Assertion
 *
 * Throws if production build is misconfigured.
 * Call this during app initialization to fail fast.
 *
 * Checks:
 * 1. Production must use observation mode
 * 2. Staging must use build mode
 *
 * @throws Error if environment is misconfigured
 */
export function assertProdSafety(): void {
  const envName = getEnvName();
  const appMode = getAppMode();

  // In development, skip safety checks
  if (envName === 'development') {
    return;
  }

  // Production must be observation mode
  if (envName === 'production' && appMode !== 'observation') {
    throw new Error(
      `Production Safety Violation: Production environment must use observation mode. ` +
        `Current: NEXT_PUBLIC_APP_MODE=${appMode}. ` +
        `Set NEXT_PUBLIC_APP_MODE=observation for production deployments.`
    );
  }

  // Staging should be build mode (warning, not error)
  if (envName === 'staging' && appMode !== 'build') {
    console.warn(
      `[ENV] Staging environment is using observation mode. ` +
        `This limits feature iteration. Consider NEXT_PUBLIC_APP_MODE=build.`
    );
  }
}

/**
 * Log environment configuration at startup
 * Useful for debugging deployments
 */
export function logEnvConfig(): void {
  const config = getEnvConfig();
  const modeEmoji = config.appMode === 'observation' ? '🔒' : '🔧';
  const cdnStatus = config.cdnEnabled ? '✓' : '✗';
  const apiStatus = config.apiBaseConfigured ? '✓' : '(default)';

  console.log(`[ENV] ${modeEmoji} ${config.envName.toUpperCase()}`);
  console.log(`[ENV] App Mode: ${config.appMode}`);
  console.log(`[ENV] API Base: ${config.apiBase} ${apiStatus}`);
  console.log(`[ENV] CDN: ${config.cdnBase || 'not configured'} ${cdnStatus}`);
}

/**
 * Required environment variables for production deployment
 */
export const REQUIRED_ENV_VARS = {
  production: [
    'NEXT_PUBLIC_APP_MODE', // Must be 'observation'
    'NEXT_PUBLIC_API_BASE', // API Gateway URL
  ],
  staging: [
    'NEXT_PUBLIC_APP_MODE', // Should be 'build'
    'NEXT_PUBLIC_API_BASE', // Staging API Gateway URL
  ],
  optional: [
    'NEXT_PUBLIC_ASSETS_CDN_BASE', // CloudFront CDN URL
    'SITE_ORIGIN', // Canonical URL base
  ],
} as const;
