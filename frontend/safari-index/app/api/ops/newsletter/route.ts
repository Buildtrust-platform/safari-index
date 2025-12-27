/**
 * Ops Newsletter List API
 *
 * GET /api/ops/newsletter - List all subscribers
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import {
  listAllSubscribers,
  listSubscribersByStatus,
  getSubscriberCounts,
} from '@/lib/db/newsletter-store';
import type { NewsletterStatus } from '@/lib/contracts';

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
 * GET /api/ops/newsletter
 * List subscribers with optional status filter
 */
export async function GET(request: Request) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as NewsletterStatus | null;
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor') || undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    // Get counts for summary
    const counts = await getSubscriberCounts();

    // Get subscribers based on filter
    let result;
    if (status && (status === 'subscribed' || status === 'unsubscribed')) {
      result = await listSubscribersByStatus(status, Math.min(limit, 500), cursor);
    } else {
      result = await listAllSubscribers(Math.min(limit, 500), cursor);
    }

    return NextResponse.json({
      counts,
      subscribers: result.subscribers,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    console.error('[Ops Newsletter API] Error listing subscribers:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve subscribers' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
