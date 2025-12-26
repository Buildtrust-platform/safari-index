/**
 * Topic Breakdown Aggregation
 *
 * Provides per-topic health metrics by querying the events table GSI.
 * Uses event_type-created_at-index (type-created-index) for efficient queries.
 *
 * Safety limits:
 * - Hard limit of 5000 items per query
 * - Aborts breakdown if limit exceeded
 * - Never degrades base /ops/health
 */
import { EventRecord } from '../db/types';
/**
 * Per-topic counter structure
 */
export interface TopicCounter {
    topic_id: string;
    issued: number;
    refused: number;
    clarifications: number;
    quality_gate_failed: number;
    refusal_rate: number | null;
}
/**
 * Topic breakdown result
 */
export interface TopicBreakdownResult {
    success: boolean;
    topic_counters?: TopicCounter[];
    top_refusal_reasons?: string[];
    skipped?: boolean;
    skip_reason?: string;
}
/**
 * Aggregate events into per-topic counters
 * Pure function for easy testing
 */
export declare function aggregateByTopic(issuedEvents: EventRecord[], refusedEvents: EventRecord[], knownTopicIds: string[]): {
    counters: TopicCounter[];
    refusalReasons: Map<string, number>;
};
/**
 * Get top N refusal reasons sorted by count
 */
export declare function getTopRefusalReasons(refusalReasons: Map<string, number>, topN?: number): string[];
/**
 * Fetch topic breakdown from events table
 * Returns null if safety limits exceeded
 */
export declare function fetchTopicBreakdown(): Promise<TopicBreakdownResult>;
//# sourceMappingURL=topic-breakdown.d.ts.map