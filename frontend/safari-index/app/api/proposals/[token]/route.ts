/**
 * Public Proposal API
 *
 * GET /api/proposals/[token] - Get proposal by public token
 *
 * No authentication required - token serves as authorization.
 * Only returns proposals with status='sent' (not drafts).
 */

import { NextResponse } from 'next/server';
import { getProposalByToken } from '@/lib/db/proposal-store';
import { getInquiry } from '@/lib/db/inquiry-store';

interface RouteParams {
  params: Promise<{ token: string }>;
}

/**
 * GET /api/proposals/[token]
 * Get a proposal by its public token
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { token } = await params;

    // Validate token format (16 alphanumeric chars)
    if (!token || !/^[a-f0-9]{16}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const proposal = await getProposalByToken(token);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Only return sent proposals, not drafts
    if (proposal.status !== 'sent') {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Fetch associated inquiry data (for display)
    const inquiry = await getInquiry(proposal.inquiry_id);

    if (!inquiry) {
      // Orphaned proposal - should not happen
      console.error('[Public Proposal API] Orphaned proposal:', proposal.proposal_id);
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Return proposal with relevant inquiry fields
    return NextResponse.json({
      proposal,
      inquiry: {
        budget_band: inquiry.budget_band,
        travel_month: inquiry.travel_month,
        travel_year: inquiry.travel_year,
        traveler_count: inquiry.traveler_count,
        travel_style: inquiry.travel_style,
      },
    });
  } catch (error) {
    console.error('[Public Proposal API] Error retrieving proposal:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve proposal' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
