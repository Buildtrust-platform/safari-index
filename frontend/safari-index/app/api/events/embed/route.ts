/**
 * Embed Events API Endpoint
 *
 * Per task requirements:
 * - Track EMBED_RENDERED and EMBED_VIEWED events
 * - No tracking pixels
 * - No user profiling
 * - Purpose is reach measurement, not optimization
 *
 * This endpoint receives beacon events from embedded decisions.
 * Data is stored for truth metrics only.
 */

import { NextResponse } from 'next/server';

interface EmbedEvent {
  event_type: 'EMBED_RENDERED' | 'EMBED_VIEWED';
  decision_id: string;
  answer_version: string;
  referrer: string;
  timestamp: string;
}

// In production, this would forward to the backend API
// For MVP, we log and acknowledge
export async function POST(request: Request) {
  try {
    const event: EmbedEvent = await request.json();

    // Validate required fields
    if (!event.event_type || !event.decision_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate event type
    if (!['EMBED_RENDERED', 'EMBED_VIEWED'].includes(event.event_type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Log event for monitoring (in production, forward to backend)
    console.log('Embed event:', {
      type: event.event_type,
      decision_id: event.decision_id,
      version: event.answer_version,
      referrer: sanitizeReferrer(event.referrer),
      timestamp: event.timestamp,
    });

    // In production, forward to backend API:
    // await fetch(`${BACKEND_API}/events/embed`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     event_type: event.event_type,
    //     decision_id: event.decision_id,
    //     payload: {
    //       answer_version: event.answer_version,
    //       referrer_domain: sanitizeReferrer(event.referrer),
    //     },
    //   }),
    // });

    // Acknowledge receipt (no data returned to prevent tracking)
    return new NextResponse(null, { status: 204 });
  } catch {
    // Silent failure - embed should not break if logging fails
    return new NextResponse(null, { status: 204 });
  }
}

/**
 * Sanitize referrer to domain only
 * Per governance: no user profiling, only domain-level reach
 */
function sanitizeReferrer(referrer: string): string {
  if (!referrer || referrer === 'direct') {
    return 'direct';
  }

  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return 'unknown';
  }
}

// Disable caching for event logging
export const dynamic = 'force-dynamic';
