/**
 * Ops Follow-up Detail API
 *
 * GET /api/ops/followups/[id] - Get follow-up by ID
 * PATCH /api/ops/followups/[id] - Update follow-up status/notes
 * DELETE /api/ops/followups/[id] - Delete follow-up
 *
 * Protected by OPS_KEY header check.
 */

import { NextResponse } from 'next/server';
import { getFollowUp, updateFollowUp, deleteFollowUp } from '@/lib/db/followup-store';
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

// Validation schema for updates
const UpdateFollowUpSchema = z.object({
  status: z.enum(['pending', 'completed', 'skipped']).optional(),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ops/followups/[id]
 */
export async function GET(request: Request, { params }: RouteParams) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const followup = await getFollowUp(id);

    if (!followup) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    return NextResponse.json(followup);
  } catch (error) {
    console.error('[Ops Followup API] Error retrieving follow-up:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve follow-up' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ops/followups/[id]
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = UpdateFollowUpSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid update',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const existing = await getFollowUp(id);
    if (!existing) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    const updates = parseResult.data;
    const updated = await updateFollowUp(id, updates);

    // Log activity if status changed to completed
    if (updates.status === 'completed' && existing.status !== 'completed') {
      await logActivity({
        inquiry_id: existing.inquiry_id,
        type: 'followup_completed',
        details: `${existing.type} follow-up completed`,
      }).catch((err) => {
        console.warn('[Ops Followup API] Failed to log activity:', err);
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Ops Followup API] Error updating follow-up:', error);
    return NextResponse.json(
      { error: 'Unable to update follow-up' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ops/followups/[id]
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;

    const existing = await getFollowUp(id);
    if (!existing) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    const success = await deleteFollowUp(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete follow-up' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Ops Followup API] Error deleting follow-up:', error);
    return NextResponse.json(
      { error: 'Unable to delete follow-up' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
