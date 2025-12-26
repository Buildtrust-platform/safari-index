#!/usr/bin/env npx ts-node
/**
 * Snapshot Warming Script
 *
 * CLI tool to warm the decision snapshot cache for P0 topics.
 * Calls the /api/ops/warm-snapshots endpoint iteratively until complete.
 *
 * Usage:
 *   npx ts-node scripts/warm-snapshots.ts [options]
 *
 * Options:
 *   --base-url <url>   Base URL (default: http://localhost:3000)
 *   --ops-key <key>    OPS_KEY for auth (or set OPS_KEY env var)
 *   --batch-size <n>   Topics per batch (default: 10, max: 10)
 *   --dry-run          Print what would be warmed without calling API
 *
 * Example:
 *   npx ts-node scripts/warm-snapshots.ts --base-url https://staging.safariindex.com
 */

interface WarmResult {
  scope: string;
  total_topics: number;
  processed: {
    start: number;
    end: number;
    count: number;
  };
  results: {
    succeeded: number;
    failed: number;
    skipped: number;
  };
  details: Array<{
    topic_id: string;
    title: string;
    success: boolean;
    cached?: boolean;
    error?: string;
  }>;
  next_cursor: number | null;
  complete: boolean;
}

async function warmSnapshots(options: {
  baseUrl: string;
  opsKey: string;
  batchSize: number;
  dryRun: boolean;
}) {
  const { baseUrl, opsKey, batchSize, dryRun } = options;

  console.log('='.repeat(60));
  console.log('Safari Index Snapshot Warmer');
  console.log('='.repeat(60));
  console.log(`Target: ${baseUrl}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  if (dryRun) {
    console.log('[DRY RUN] Would call:');
    console.log(`  GET ${baseUrl}/api/ops/warm-snapshots?scope=p0&cursor=0&limit=${batchSize}`);
    console.log('');
    console.log('Set up your environment and run without --dry-run to execute.');
    return;
  }

  let cursor = 0;
  let totalSucceeded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  let batchNumber = 0;

  while (true) {
    batchNumber++;
    const url = `${baseUrl}/api/ops/warm-snapshots?scope=p0&cursor=${cursor}&limit=${batchSize}`;

    console.log(`[Batch ${batchNumber}] Fetching ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'x-ops-key': opsKey,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Error: HTTP ${response.status}`);
        console.error(text);
        process.exit(1);
      }

      const result: WarmResult = await response.json();

      // Print batch results
      console.log(`  Processed: ${result.processed.count} topics (${result.processed.start + 1}-${result.processed.end} of ${result.total_topics})`);
      console.log(`  Succeeded: ${result.results.succeeded}, Failed: ${result.results.failed}, Skipped: ${result.results.skipped}`);

      // Print details for failures
      for (const detail of result.details) {
        if (!detail.success && detail.error !== 'No baseline decision available') {
          console.log(`    [FAIL] ${detail.topic_id}: ${detail.error}`);
        }
      }

      totalSucceeded += result.results.succeeded;
      totalFailed += result.results.failed;
      totalSkipped += result.results.skipped;

      if (result.complete) {
        console.log('');
        console.log('='.repeat(60));
        console.log('Complete');
        console.log('='.repeat(60));
        console.log(`Total topics: ${result.total_topics}`);
        console.log(`Succeeded: ${totalSucceeded}`);
        console.log(`Failed: ${totalFailed}`);
        console.log(`Skipped: ${totalSkipped}`);
        break;
      }

      cursor = result.next_cursor!;

      // Brief pause between batches
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Network error:', error);
      process.exit(1);
    }
  }
}

// Parse CLI arguments
function parseArgs(): {
  baseUrl: string;
  opsKey: string;
  batchSize: number;
  dryRun: boolean;
} {
  const args = process.argv.slice(2);
  let baseUrl = process.env.WARM_BASE_URL || 'http://localhost:3000';
  let opsKey = process.env.OPS_KEY || '';
  let batchSize = 10;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--base-url' && args[i + 1]) {
      baseUrl = args[++i];
    } else if (arg === '--ops-key' && args[i + 1]) {
      opsKey = args[++i];
    } else if (arg === '--batch-size' && args[i + 1]) {
      batchSize = Math.min(parseInt(args[++i], 10), 10);
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: npx ts-node scripts/warm-snapshots.ts [options]

Options:
  --base-url <url>   Base URL (default: http://localhost:3000)
  --ops-key <key>    OPS_KEY for auth (or set OPS_KEY env var)
  --batch-size <n>   Topics per batch (default: 10, max: 10)
  --dry-run          Print what would be warmed without calling API
  --help, -h         Show this help
`);
      process.exit(0);
    }
  }

  return { baseUrl, opsKey, batchSize, dryRun };
}

// Main
const options = parseArgs();
warmSnapshots(options).catch(console.error);
