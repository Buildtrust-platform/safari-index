/**
 * Ops Proposal Detail API
 *
 * GET /api/ops/proposals/[id] - Get proposal by ID
 * PATCH /api/ops/proposals/[id] - Update proposal
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { getProposal, updateProposal } from '@/lib/db/proposal-store';
import { ProposalUpdateSchema } from '@/lib/contracts';

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

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ops/proposals/[id]
 * Get a single proposal
 */
export async function GET(request: Request, { params }: RouteParams) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const proposal = await getProposal(id);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('[Ops Proposal API] Error retrieving proposal:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve proposal' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ops/proposals/[id]
 * Update proposal fields
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate update payload
    const parseResult = ProposalUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid update',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const updates = parseResult.data;

    // Check proposal exists
    const existing = await getProposal(id);
    if (!existing) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Apply updates
    const updated = await updateProposal(id, updates);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Ops Proposal API] Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Unable to update proposal' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
