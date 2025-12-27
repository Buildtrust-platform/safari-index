/**
 * Newsletter Subscribe API
 *
 * POST /api/newsletter - Subscribe to newsletter
 *
 * Public endpoint. No authentication required.
 * Always returns 200 with ok: true for valid email input.
 */

import { NextResponse } from 'next/server';
import { NewsletterSubscribeRequestSchema } from '@/lib/contracts';
import { createOrResubscribe } from '@/lib/db/newsletter-store';

/**
 * POST /api/newsletter
 * Subscribe to newsletter
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const parsed = NewsletterSubscribeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid email address',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, source } = parsed.data;

    // Extract metadata from request headers (optional, never fails)
    const meta = {
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    };

    // Create or resubscribe
    const result = await createOrResubscribe(email, source || 'homepage', meta);

    return NextResponse.json({
      ok: true,
      status: result.status,
    });
  } catch (error) {
    console.error('[Newsletter API] Error subscribing:', error);

    // Return generic error - don't expose internals
    return NextResponse.json(
      { ok: false, error: 'Unable to process subscription' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
