#!/usr/bin/env npx ts-node
/**
 * Snapshot Cache Prewarm Script
 *
 * Production-safe script to warm the snapshot cache for all P0 topics.
 * This ensures instant responses for the /decisions hub and individual pages.
 *
 * Usage:
 *   npx ts-node scripts/prewarm-snapshots.ts [--env staging|production] [--rate-limit 2000]
 *
 * Behavior:
 * - Iterates through all P0 topics
 * - Builds default StandardInputEnvelope for each
 * - Calls the decision evaluation endpoint
 * - Logs observability headers (snapshot_status, lock_status, bedrock_called)
 * - Rate-limits to 1 request per 2 seconds (default)
 *
 * The script is idempotent: if a snapshot already exists (cache hit), it will skip.
 */

import { generateP0Topics, generateSlugFromId } from '../frontend/safari-index/app/content/p0-topics-bridge';
import type { DecisionTopic } from '../frontend/safari-index/app/content/decision-topics';

// Configuration
const API_ENDPOINTS = {
  staging: 'https://api.staging.safariindex.com/decision/evaluate',
  production: 'https://api.safariindex.com/decision/evaluate',
  local: 'http://localhost:3001/decision/evaluate',
};

// Parse CLI args
const args = process.argv.slice(2);
const envArg = args.find((a) => a.startsWith('--env='))?.split('=')[1] || 'staging';
const rateLimitArg = parseInt(args.find((a) => a.startsWith('--rate-limit='))?.split('=')[1] || '2000', 10);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');

const API_ENDPOINT = API_ENDPOINTS[envArg as keyof typeof API_ENDPOINTS] || API_ENDPOINTS.staging;
const RATE_LIMIT_MS = rateLimitArg;

interface PrewarmResult {
  topic_id: string;
  slug: string;
  status: 'success' | 'cached' | 'error' | 'refusal';
  snapshot_status?: string;
  lock_status?: string;
  bedrock_called?: boolean;
  decision_id?: string;
  duration_ms: number;
  error?: string;
}

/**
 * Build StandardInputEnvelope for a topic (matches page-assembly.ts)
 */
function buildRequestEnvelope(topic: DecisionTopic): Record<string, unknown> {
  const deriveBudgetBand = (profiles: string[] | undefined): string => {
    if (!profiles) return 'fair_value';
    if (profiles.includes('budget_conscious')) return 'budget';
    if (profiles.includes('luxury')) return 'premium';
    return 'fair_value';
  };

  return {
    task: 'DECISION',
    tracking: {
      session_id: `sess_prewarm_${topic.topic_id}`,
      traveler_id: null,
      lead_id: null,
    },
    user_context: {
      traveler_type: topic.traveler_profiles?.[0] || 'first_time',
      budget_band: deriveBudgetBand(topic.traveler_profiles),
      pace_preference: 'balanced',
      drive_tolerance_hours: 4,
      risk_tolerance: 'medium',
      dates: topic.time_context?.month
        ? { type: 'month_year', month: topic.time_context.month, year: 2026 }
        : { type: 'flexible' },
      group_size: 2,
      prior_decisions: [],
    },
    request: {
      question: topic.question,
      scope: 'thin_edge_scope_only=true',
      destinations_considered: topic.destinations,
      constraints: {},
    },
    facts: {
      known_constraints: topic.primary_risks,
      known_tradeoffs: topic.key_tradeoffs,
      destination_notes: [],
    },
    policy: {
      must_refuse_if: [
        'guarantee_requested',
        'inputs_conflict_unbounded',
        'missing_material_inputs',
      ],
      forbidden_phrases: ['unforgettable', 'magical', 'once-in-a-lifetime'],
    },
  };
}

/**
 * Prewarm a single topic
 */
async function prewarmTopic(topic: DecisionTopic): Promise<PrewarmResult> {
  const startTime = Date.now();
  const slug = generateSlugFromId(topic.topic_id);

  if (dryRun) {
    return {
      topic_id: topic.topic_id,
      slug,
      status: 'success',
      snapshot_status: 'dry-run',
      lock_status: 'dry-run',
      bedrock_called: false,
      duration_ms: 0,
    };
  }

  try {
    const envelope = buildRequestEnvelope(topic);
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelope),
    });

    const duration_ms = Date.now() - startTime;

    if (!response.ok) {
      return {
        topic_id: topic.topic_id,
        slug,
        status: 'error',
        duration_ms,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Extract observability headers
    const snapshot_status = response.headers.get('X-Snapshot-Status') || undefined;
    const lock_status = response.headers.get('X-Lock-Status') || undefined;
    const bedrock_called = response.headers.get('X-Bedrock-Called') === 'true';
    const decision_id = response.headers.get('X-Decision-Id') || undefined;

    const data = await response.json();
    const output_type = data.output?.type;

    // Determine status
    let status: PrewarmResult['status'] = 'success';
    if (snapshot_status === 'hit') {
      status = 'cached';
    } else if (output_type === 'refusal') {
      status = 'refusal';
    }

    return {
      topic_id: topic.topic_id,
      slug,
      status,
      snapshot_status,
      lock_status,
      bedrock_called,
      decision_id,
      duration_ms,
    };
  } catch (err) {
    return {
      topic_id: topic.topic_id,
      slug,
      status: 'error',
      duration_ms: Date.now() - startTime,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main prewarm function
 */
async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Safari Index Snapshot Prewarm');
  console.log('='.repeat(60));
  console.log(`Environment: ${envArg}`);
  console.log(`API Endpoint: ${API_ENDPOINT}`);
  console.log(`Rate Limit: ${RATE_LIMIT_MS}ms between requests`);
  console.log(`Dry Run: ${dryRun}`);
  console.log('');

  const topics = generateP0Topics();
  console.log(`Found ${topics.length} P0 topics to prewarm`);
  console.log('');

  const results: PrewarmResult[] = [];
  let successCount = 0;
  let cachedCount = 0;
  let errorCount = 0;
  let refusalCount = 0;

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const progress = `[${i + 1}/${topics.length}]`;

    if (verbose) {
      console.log(`${progress} Prewarming: ${topic.topic_id}`);
    }

    const result = await prewarmTopic(topic);
    results.push(result);

    // Update counters
    switch (result.status) {
      case 'success':
        successCount++;
        break;
      case 'cached':
        cachedCount++;
        break;
      case 'error':
        errorCount++;
        break;
      case 'refusal':
        refusalCount++;
        break;
    }

    // Log result
    const statusIcon = {
      success: '✓',
      cached: '⚡',
      error: '✗',
      refusal: '⚠',
    }[result.status];

    const observability = [
      `snapshot=${result.snapshot_status || 'n/a'}`,
      `lock=${result.lock_status || 'n/a'}`,
      `bedrock=${result.bedrock_called ?? 'n/a'}`,
    ].join(' ');

    console.log(
      `${progress} ${statusIcon} ${result.slug.padEnd(40)} ${result.duration_ms}ms  ${observability}`
    );

    if (result.error && verbose) {
      console.log(`    Error: ${result.error}`);
    }

    // Rate limit (except for last item)
    if (i < topics.length - 1 && !dryRun) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Total topics:     ${topics.length}`);
  console.log(`Success (fresh):  ${successCount}`);
  console.log(`Cached (hit):     ${cachedCount}`);
  console.log(`Refusals:         ${refusalCount}`);
  console.log(`Errors:           ${errorCount}`);
  console.log('');

  // Exit with error code if any failures
  if (errorCount > 0) {
    console.log('Prewarm completed with errors.');
    process.exit(1);
  }

  console.log('Prewarm completed successfully.');
}

// Run
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
