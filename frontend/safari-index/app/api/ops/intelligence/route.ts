/**
 * Ops Intelligence API
 *
 * GET /api/ops/intelligence - Get inquiry attribution intelligence summary
 *
 * Protected by OPS_KEY header check.
 * Returns aggregated attribution data for market validation.
 *
 * Per governance:
 * - Read-only operations
 * - No external analytics dependencies
 * - Returns 404 (not 401) if unauthorized to reduce discoverability
 */

import { NextResponse } from 'next/server';
import { getIntelligenceSummary } from '@/lib/db/inquiry-intelligence';

const OPS_KEY = process.env.OPS_KEY;

/**
 * Verify ops authorization
 * Returns 404 to reduce discoverability
 */
function verifyOpsAuth(request: Request): boolean {
  if (!OPS_KEY) {
    // In development without OPS_KEY, allow access
    return process.env.NODE_ENV === 'development';
  }

  const providedKey = request.headers.get('x-ops-key');
  return providedKey === OPS_KEY;
}

/**
 * GET /api/ops/intelligence
 * Get aggregated inquiry attribution intelligence
 */
export async function GET(request: Request) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const summary = await getIntelligenceSummary(Math.min(limit, 500));

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[Ops Intelligence API] Error generating summary:', error);
    return NextResponse.json(
      { error: 'Unable to generate intelligence summary' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
