/**
 * Shared API Client
 *
 * Handles:
 * - Fetch with configurable timeout
 * - Error normalization
 * - Typed results
 * - Optional schema validation
 *
 * Does NOT change:
 * - Request bodies or payloads
 * - Endpoint URLs
 * - Any business logic
 * - Error messages shown to users
 */

import { Validator, isContractError } from './adapters';
import { getApiBase } from './api-base';

// Re-export Validator type for consumers
export type { Validator } from './adapters';

// Re-export getApiBase for direct use
export { getApiBase } from './api-base';

/**
 * API base URL - sourced from NEXT_PUBLIC_API_BASE environment variable.
 * Falls back to default for development/build compatibility.
 *
 * @see lib/api-base.ts for configuration details
 */
export const API_BASE = getApiBase();

/** Default timeout in milliseconds */
const DEFAULT_TIMEOUT = 10000;

/** Normalized error structure */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

/** Result type for API calls */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Normalize error from various sources
 */
function normalizeError(error: unknown, status: number = 500): ApiError {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return { status: 408, message: 'Request timeout', code: 'TIMEOUT' };
    }
    return { status, message: error.message, code: 'FETCH_ERROR' };
  }
  return { status, message: 'Unknown error', code: 'UNKNOWN' };
}

/**
 * GET request with typed response
 * @param validate - Optional validator function. If validation fails, returns error result.
 */
export async function apiGet<T>(
  endpoint: string,
  options: { timeout?: number; headers?: Record<string, string>; validate?: Validator<T> } = {}
): Promise<ApiResult<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      },
      options.timeout
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          status: response.status,
          message: errorBody.message || response.statusText,
          code: errorBody.code,
        },
      };
    }

    const data = await response.json();

    // Apply optional validation
    if (options.validate) {
      try {
        const validated = options.validate(data);
        return { success: true, data: validated };
      } catch (error) {
        if (isContractError(error)) {
          return {
            success: false,
            error: { status: 500, message: 'Invalid response format', code: 'CONTRACT_ERROR' },
          };
        }
        throw error;
      }
    }

    return { success: true, data: data as T };
  } catch (error) {
    return { success: false, error: normalizeError(error) };
  }
}

/**
 * POST request with typed response
 * @param validate - Optional validator function. If validation fails, returns error result.
 */
export async function apiPost<T, B = unknown>(
  endpoint: string,
  body: B,
  options: { timeout?: number; headers?: Record<string, string>; validate?: Validator<T> } = {}
): Promise<ApiResult<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(body),
      },
      options.timeout
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          status: response.status,
          message: errorBody.message || response.statusText,
          code: errorBody.code,
        },
      };
    }

    const data = await response.json();

    // Apply optional validation
    if (options.validate) {
      try {
        const validated = options.validate(data);
        return { success: true, data: validated };
      } catch (error) {
        if (isContractError(error)) {
          return {
            success: false,
            error: { status: 500, message: 'Invalid response format', code: 'CONTRACT_ERROR' },
          };
        }
        throw error;
      }
    }

    return { success: true, data: data as T };
  } catch (error) {
    return { success: false, error: normalizeError(error) };
  }
}

/**
 * Check if result is successful (type guard)
 */
export function isSuccess<T>(result: ApiResult<T>): result is { success: true; data: T } {
  return result.success;
}

/**
 * Check if result is an error (type guard)
 */
export function isError<T>(result: ApiResult<T>): result is { success: false; error: ApiError } {
  return !result.success;
}
