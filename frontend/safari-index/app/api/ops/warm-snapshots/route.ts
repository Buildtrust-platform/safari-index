/**
 * Snapshot Warming API Route (Ops Only)
 *
 * Warms the snapshot cache by calling the decision evaluate endpoint
 * for P0 topics with deterministic standard envelopes.
 *
 * Per constraints:
 * - No new AWS services (uses existing snapshot cache via existing endpoints)
 * - Gated by OPS_KEY header
 * - Sequential execution with hard cap to avoid token spikes
 * - Returns progress for monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTopicsByPriority, TopicInventoryItem } from '../../../content/topic-inventory';
import { getBaselineDecision } from '../../../../lib/baseline-decisions';

// Configuration
const MAX_TOPICS_PER_RUN = 10;
const DELAY_BETWEEN_CALLS_MS = 1000;

// Standard envelope values for P0 topics
// These are deterministic, non-personal values that produce stable snapshots
const STANDARD_ENVELOPE_VALUES = {
  travel_month: 7, // July - peak dry season
  travel_year: 2025,
  party_size: 2,
  budget_band: '10k-20k',
  traveler_type: 'couple',
  is_first_safari: true,
  flexibility: 'moderate',
};

/**
 * Verify ops authentication
 */
function isAuthorized(request: NextRequest): boolean {
  const opsKey = process.env.OPS_KEY;
  const enableDevPages = process.env.ENABLE_DEV_PAGES === 'true';

  // Allow in development mode or with valid OPS_KEY
  if (enableDevPages) return true;
  if (!opsKey) return false;

  const providedKey = request.headers.get('x-ops-key');
  return providedKey === opsKey;
}

/**
 * Build a standard request envelope for a topic
 */
function buildStandardEnvelope(topic: TopicInventoryItem): Record<string, unknown> {
  // Get baseline decision to extract required_inputs pattern
  const baseline = getBaselineDecision(topic.id);

  return {
    topic_id: topic.id,
    inputs: {
      // Standard traveler profile
      travel_month: STANDARD_ENVELOPE_VALUES.travel_month,
      travel_year: STANDARD_ENVELOPE_VALUES.travel_year,
      party_size: STANDARD_ENVELOPE_VALUES.party_size,
      budget_band: STANDARD_ENVELOPE_VALUES.budget_band,
      traveler_type: STANDARD_ENVELOPE_VALUES.traveler_type,
      is_first_safari: STANDARD_ENVELOPE_VALUES.is_first_safari,
      flexibility: STANDARD_ENVELOPE_VALUES.flexibility,

      // Topic-specific defaults from baseline if available
      ...(baseline?.assumptions?.reduce((acc, a) => {
        // Use assumption IDs as input keys if they look like inputs
        if (a.id && !a.id.includes('-')) {
          acc[a.id] = true;
        }
        return acc;
      }, {} as Record<string, unknown>) || {}),
    },
    source: 'snapshot-warmer',
    cache_mode: 'populate', // Signal to cache layer to store result
  };
}

/**
 * Call the decision evaluate endpoint
 */
async function warmTopic(
  topic: TopicInventoryItem,
  apiBase: string
): Promise<{ success: boolean; error?: string; cached?: boolean }> {
  try {
    const envelope = buildStandardEnvelope(topic);

    const response = await fetch(`${apiBase}/decision/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelope),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${text.substring(0, 100)}` };
    }

    const data = await response.json();

    // Check if this was a cache hit or capacity issue
    if (data.output?.type === 'refusal' && data.output?.refusal?.code === 'SERVICE_DEGRADED') {
      return { success: false, error: 'Service at capacity' };
    }

    return {
      success: true,
      cached: data.metadata?.cache_hit === true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * GET /api/ops/warm-snapshots
 *
 * Query params:
 * - scope: 'p0' (default) - which topics to warm
 * - cursor: offset to start from (for pagination)
 * - limit: max topics to process this run (default: 10, max: 10)
 */
export async function GET(request: NextRequest) {
  // Auth check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide x-ops-key header or enable ENABLE_DEV_PAGES.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get('scope') || 'p0';
  const cursor = parseInt(searchParams.get('cursor') || '0', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), MAX_TOPICS_PER_RUN);

  // Get API base from environment
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE;
  if (!apiBase) {
    return NextResponse.json(
      { error: 'API_BASE not configured' },
      { status: 500 }
    );
  }

  // Get topics to warm
  let topics: TopicInventoryItem[] = [];
  if (scope === 'p0') {
    topics = getTopicsByPriority('P0');
  } else {
    return NextResponse.json(
      { error: 'Invalid scope. Use: p0' },
      { status: 400 }
    );
  }

  // Apply cursor and limit
  const totalTopics = topics.length;
  const startIndex = Math.min(cursor, totalTopics);
  const endIndex = Math.min(startIndex + limit, totalTopics);
  const topicsToWarm = topics.slice(startIndex, endIndex);

  // Track results
  const results: {
    topic_id: string;
    title: string;
    success: boolean;
    cached?: boolean;
    error?: string;
  }[] = [];

  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  // Process topics sequentially with delay
  for (const topic of topicsToWarm) {
    // Check if baseline exists (prerequisite for meaningful warming)
    if (!getBaselineDecision(topic.id)) {
      results.push({
        topic_id: topic.id,
        title: topic.title,
        success: false,
        error: 'No baseline decision available',
      });
      skipped++;
      continue;
    }

    const result = await warmTopic(topic, apiBase);

    results.push({
      topic_id: topic.id,
      title: topic.title,
      success: result.success,
      cached: result.cached,
      error: result.error,
    });

    if (result.success) {
      succeeded++;
    } else {
      failed++;
    }

    // Delay between calls to avoid rate limiting
    if (topicsToWarm.indexOf(topic) < topicsToWarm.length - 1) {
      await sleep(DELAY_BETWEEN_CALLS_MS);
    }
  }

  // Calculate next cursor
  const hasMore = endIndex < totalTopics;
  const nextCursor = hasMore ? endIndex : null;

  return NextResponse.json({
    scope,
    total_topics: totalTopics,
    processed: {
      start: startIndex,
      end: endIndex,
      count: topicsToWarm.length,
    },
    results: {
      succeeded,
      failed,
      skipped,
    },
    details: results,
    next_cursor: nextCursor,
    complete: !hasMore,
  });
}

// Disable caching for this route
export const dynamic = 'force-dynamic';
