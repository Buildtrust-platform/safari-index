/**
 * Ops Inquiries List API
 *
 * GET /api/ops/inquiries - List all inquiries
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { listRecentInquiries } from '@/lib/db/inquiry-store';

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
 * GET /api/ops/inquiries
 * List all recent inquiries
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

    const inquiries = await listRecentInquiries(Math.min(limit, 500));

    return NextResponse.json({
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error('[Ops Inquiries API] Error listing inquiries:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve inquiries' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
