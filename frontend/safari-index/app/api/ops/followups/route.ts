/**
 * Ops Follow-ups API
 *
 * GET /api/ops/followups - List follow-ups (with filters)
 * POST /api/ops/followups - Create a new follow-up
 *
 * Protected by OPS_KEY header check.
 */

import { NextResponse } from 'next/server';
import {
  createFollowUp,
  listFollowUpsByStatus,
  listFollowUpsByInquiry,
  getDueFollowUps,
} from '@/lib/db/followup-store';
import { logActivity } from '@/lib/db/activity-store';
import { z } from 'zod';

const OPS_KEY = process.env.OPS_KEY;

function verifyOpsAuth(request: Request): boolean {
  if (!OPS_KEY) {
    return process.env.NODE_ENV === 'development';
  }
  const providedKey = request.headers.get('x-ops-key');
  return providedKey === OPS_KEY;
}

// Validation schema for creating follow-ups
const CreateFollowUpSchema = z.object({
  inquiry_id: z.string(),
  scheduled_for: z.string(),
  type: z.enum(['call', 'email', 'proposal_review']),
  notes: z.string().optional(),
});

/**
 * GET /api/ops/followups
 * List follow-ups with optional filters
 *
 * Query params:
 * - inquiry_id: Filter by inquiry
 * - status: Filter by status (pending, completed, skipped)
 * - due: If "true", get only due follow-ups
 */
export async function GET(request: Request) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('inquiry_id');
    const status = searchParams.get('status') as 'pending' | 'completed' | 'skipped' | null;
    const due = searchParams.get('due') === 'true';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    let followups;

    if (due) {
      followups = await getDueFollowUps(limit);
    } else if (inquiryId) {
      followups = await listFollowUpsByInquiry(inquiryId, limit);
    } else if (status) {
      followups = await listFollowUpsByStatus(status, limit);
    } else {
      // Default: get pending follow-ups
      followups = await listFollowUpsByStatus('pending', limit);
    }

    return NextResponse.json({
      count: followups.length,
      followups,
    });
  } catch (error) {
    console.error('[Ops Followups API] Error listing follow-ups:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve follow-ups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ops/followups
 * Create a new follow-up
 */
export async function POST(request: Request) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    const parseResult = CreateFollowUpSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const followup = await createFollowUp(data);

    // Log activity for the inquiry
    await logActivity({
      inquiry_id: data.inquiry_id,
      type: 'followup_scheduled',
      details: `${data.type} scheduled for ${data.scheduled_for}`,
    }).catch((err) => {
      console.warn('[Ops Followups API] Failed to log activity:', err);
    });

    return NextResponse.json(followup, { status: 201 });
  } catch (error) {
    console.error('[Ops Followups API] Error creating follow-up:', error);
    return NextResponse.json(
      { error: 'Unable to create follow-up' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
