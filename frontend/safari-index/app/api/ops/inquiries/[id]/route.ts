/**
 * Ops Inquiry Detail API
 *
 * GET /api/ops/inquiries/[id] - Get inquiry by ID
 * GET /api/ops/inquiries/[id]?timeline=true - Get inquiry with activity timeline
 * PATCH /api/ops/inquiries/[id] - Update inquiry status/notes
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { getInquiry, updateInquiry } from '@/lib/db/inquiry-store';
import { getActivityTimeline, logStatusChange, logNoteAdded } from '@/lib/db/activity-store';
import { InquiryUpdateSchema } from '@/lib/contracts';

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
 * GET /api/ops/inquiries/[id]
 * Get a single inquiry
 * Add ?timeline=true to include activity timeline
 */
export async function GET(request: Request, { params }: RouteParams) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeTimeline = searchParams.get('timeline') === 'true';

    const inquiry = await getInquiry(id);

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Optionally include activity timeline
    if (includeTimeline) {
      const activities = await getActivityTimeline(id);
      return NextResponse.json({ inquiry, activities });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('[Ops Inquiry API] Error retrieving inquiry:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve inquiry' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ops/inquiries/[id]
 * Update inquiry status or notes
 * Automatically logs activities for status changes and note additions
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
    const parseResult = InquiryUpdateSchema.safeParse(body);
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

    // Check inquiry exists
    const existing = await getInquiry(id);
    if (!existing) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Apply updates (now returns oldStatus for activity logging)
    const { record: updated, oldStatus } = await updateInquiry(id, updates);

    // Log activities asynchronously (don't block response)
    const activityPromises: Promise<unknown>[] = [];

    // Log status change if status was updated
    if (updates.status && oldStatus && updates.status !== oldStatus) {
      activityPromises.push(
        logStatusChange(id, oldStatus, updates.status).catch((err) => {
          console.warn('[Ops Inquiry API] Failed to log status change:', err);
        })
      );
    }

    // Log note addition if notes were updated and non-empty
    if (updates.notes !== undefined && updates.notes && updates.notes !== existing.notes) {
      activityPromises.push(
        logNoteAdded(id, updates.notes).catch((err) => {
          console.warn('[Ops Inquiry API] Failed to log note addition:', err);
        })
      );
    }

    // Wait for activity logging (fire-and-forget pattern causes issues in serverless)
    await Promise.all(activityPromises);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Ops Inquiry API] Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Unable to update inquiry' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
