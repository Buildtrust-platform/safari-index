/**
 * Ops Newsletter Single Subscriber API
 *
 * GET /api/ops/newsletter/[id] - Get single subscriber
 * PATCH /api/ops/newsletter/[id] - Update subscriber status
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { getSubscriberById, updateSubscriber } from '@/lib/db/newsletter-store';
import { NewsletterUpdateSchema } from '@/lib/contracts';

const OPS_KEY = process.env.OPS_KEY;

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Verify ops authorization
 */
function verifyOpsAuth(request: Request): boolean {
  if (!OPS_KEY) {
    return process.env.NODE_ENV === 'development';
  }

  const providedKey = request.headers.get('x-ops-key');
  return providedKey === OPS_KEY;
}

/**
 * GET /api/ops/newsletter/[id]
 * Get single subscriber
 */
export async function GET(request: Request, { params }: RouteParams) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const subscriber = await getSubscriberById(id);

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error('[Ops Newsletter API] Error getting subscriber:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve subscriber' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ops/newsletter/[id]
 * Update subscriber status
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate update payload
    const parsed = NewsletterUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid update data',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check subscriber exists
    const existing = await getSubscriberById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Update subscriber
    const updated = await updateSubscriber(id, parsed.data);

    return NextResponse.json({ subscriber: updated });
  } catch (error) {
    console.error('[Ops Newsletter API] Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Unable to update subscriber' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
