/**
 * Topic Health Types
 *
 * Types for the /dev/topic-health dashboard (dev/staging only).
 * Provides visibility into decision health per topic.
 */

/**
 * Status badge levels
 */
export type HealthStatus = 'healthy' | 'watch' | 'critical' | 'unknown';

/**
 * Per-topic health metrics (when available)
 */
export interface TopicHealthMetrics {
  decisions_issued: number | null;
  decisions_refused: number | null;
  clarifications: number | null;
  quality_gate_failed: number | null;
}

/**
 * Per-topic health row
 */
export interface TopicHealthRow {
  topic_id: string;
  title: string;
  slug: string;
  metrics: TopicHealthMetrics;
  refusal_rate: number | null;
  status: HealthStatus;
}

/**
 * Topic counter from API (matches backend TopicCounter)
 */
export interface ApiTopicCounter {
  topic_id: string;
  issued: number;
  refused: number;
  clarifications: number;
  quality_gate_failed: number;
  refusal_rate: number | null;
}

/**
 * Global health from /ops/health endpoint
 */
export interface GlobalHealth {
  status: 'healthy' | 'degraded' | 'critical';
  logic_version: string;
  counters: {
    decisions_issued: number;
    decisions_refused: number;
    decisions_failed: number;
    window_age_seconds: number;
  };
  guardrails: {
    bedrock_circuit_open: boolean;
    assurance_paused: boolean;
    embeds_disabled: boolean;
    active_alerts: number;
  };
  // Optional: per-topic breakdown (when topic_breakdown=true)
  topic_counters?: ApiTopicCounter[];
  top_refusal_reasons?: string[];
  topic_breakdown_skipped?: boolean;
  topic_breakdown_reason?: string;
}

/**
 * Calculate refusal rate
 */
export function calculateRefusalRate(
  issued: number | null,
  refused: number | null
): number | null {
  if (issued === null || refused === null) return null;
  const total = issued + refused;
  if (total === 0) return null;
  return refused / total;
}

/**
 * Determine status from refusal rate
 */
export function getStatusFromRefusalRate(rate: number | null): HealthStatus {
  if (rate === null) return 'unknown';
  if (rate < 0.3) return 'healthy';
  if (rate <= 0.5) return 'watch';
  return 'critical';
}

/**
 * Status badge colors
 */
export const STATUS_STYLES: Record<HealthStatus, { bg: string; text: string }> = {
  healthy: { bg: 'bg-green-100', text: 'text-green-800' },
  watch: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  critical: { bg: 'bg-red-100', text: 'text-red-800' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

/**
 * Format percentage
 */
export function formatPercent(value: number | null): string {
  if (value === null) return 'n/a';
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * Format counter
 */
export function formatCount(value: number | null): string {
  if (value === null) return 'n/a';
  return value.toLocaleString();
}
