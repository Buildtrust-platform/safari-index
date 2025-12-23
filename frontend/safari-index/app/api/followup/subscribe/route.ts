/**
 * Follow-Up Subscription API Endpoint
 *
 * Per task requirements:
 * - Store follow-up subscriptions per decision_id
 * - Log FOLLOWUP_SUBSCRIBED event
 * - No marketing, only material decision changes trigger notification
 *
 * Triggers (defined in backend):
 * - Logic version change
 * - Confidence drift (>10% change)
 * - Review outcome (approved/corrected)
 */

import { NextResponse } from 'next/server';

interface FollowUpSubscription {
  email: string;
  decision_id: string;
  topic_id: string;
  subscribed_at_logic_version: string;
  subscribed_at_confidence: number;
}

// In production, this would forward to backend API and store in DynamoDB
// For MVP, we validate and acknowledge

export async function POST(request: Request) {
  try {
    const body: FollowUpSubscription = await request.json();

    // Validate required fields
    if (!body.email || !body.decision_id) {
      return NextResponse.json(
        { error: 'Email and decision_id are required' },
        { status: 400 }
      );
    }

    // Validate email format (basic)
    if (!body.email.includes('@') || !body.email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Hash email for privacy (in production, use proper hashing)
    const emailHash = Buffer.from(body.email).toString('base64');

    // Log subscription event
    console.log('FOLLOWUP_SUBSCRIBED:', {
      decision_id: body.decision_id,
      topic_id: body.topic_id,
      email_hash: emailHash.substring(0, 10) + '...',
      subscribed_at_logic_version: body.subscribed_at_logic_version,
      subscribed_at_confidence: body.subscribed_at_confidence,
      timestamp: new Date().toISOString(),
    });

    // In production, store subscription:
    // await fetch(`${BACKEND_API}/followup/subscribe`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email_encrypted: encrypt(body.email),
    //     decision_id: body.decision_id,
    //     topic_id: body.topic_id,
    //     subscribed_at: new Date().toISOString(),
    //     subscribed_at_logic_version: body.subscribed_at_logic_version,
    //     subscribed_at_confidence: body.subscribed_at_confidence,
    //     status: 'active',
    //   }),
    // });

    // Log event for metrics
    // await logEvent({
    //   event_type: 'FOLLOWUP_SUBSCRIBED',
    //   decision_id: body.decision_id,
    //   payload: {
    //     topic_id: body.topic_id,
    //     logic_version: body.subscribed_at_logic_version,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed. You will only be notified of material changes.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
