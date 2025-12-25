/**
 * Ops Proposals API
 *
 * POST /api/ops/proposals - Create a proposal from an inquiry
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { createProposal, listProposalsForInquiry } from '@/lib/db/proposal-store';
import { getInquiry } from '@/lib/db/inquiry-store';
import { ProposalCreateSchema } from '@/lib/contracts';

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
 * POST /api/ops/proposals
 * Create a new proposal from an inquiry
 */
export async function POST(request: Request) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Validate request
    const parseResult = ProposalCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { inquiry_id } = parseResult.data;

    // Verify inquiry exists
    const inquiry = await getInquiry(inquiry_id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Create proposal
    const proposal = await createProposal(inquiry_id);

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('[Ops Proposals API] Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Unable to create proposal' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ops/proposals?inquiry_id=xxx
 * List proposals for an inquiry
 */
export async function GET(request: Request) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const inquiry_id = searchParams.get('inquiry_id');

    if (!inquiry_id) {
      return NextResponse.json(
        { error: 'Missing inquiry_id parameter' },
        { status: 400 }
      );
    }

    const proposals = await listProposalsForInquiry(inquiry_id);

    return NextResponse.json({
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error('[Ops Proposals API] Error listing proposals:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve proposals' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
