/**
 * Inquiry API Route
 *
 * POST /api/inquire - Create a new trip inquiry
 * GET /api/inquire?id=xxx - Retrieve an inquiry by ID
 *
 * Per governance:
 * - Validates payload with zod
 * - Generates inquiry_id server-side
 * - Writes to DynamoDB
 * - Sends operator notification
 * - Fails closed with calm error messages
 */

import { NextResponse } from 'next/server';
import { InquiryRequestSchema } from '@/lib/contracts';
import { createInquiry, getInquiry } from '@/lib/db/inquiry-store';
import { sendInquiryNotification } from '@/lib/email/inquiry-notification';

/**
 * POST /api/inquire
 * Create a new inquiry
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request payload
    const parseResult = InquiryRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const inquiryRequest = parseResult.data;

    // Create inquiry in DynamoDB
    const { inquiry_id, created_at } = await createInquiry(inquiryRequest);

    // Send operator notification (fire-and-forget, don't block response)
    // Retrieve full record for notification
    const fullRecord = await getInquiry(inquiry_id);
    if (fullRecord) {
      sendInquiryNotification(fullRecord).catch((err) => {
        console.error('[Inquiry API] Failed to send notification:', err);
      });
    }

    return NextResponse.json({
      inquiry_id,
      created_at,
    });
  } catch (error) {
    console.error('[Inquiry API] Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Unable to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquire?id=xxx
 * Retrieve an inquiry by ID (for confirmation page)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inquiry_id = searchParams.get('id');

    if (!inquiry_id) {
      return NextResponse.json(
        { error: 'Missing inquiry ID' },
        { status: 400 }
      );
    }

    const inquiry = await getInquiry(inquiry_id);

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('[Inquiry API] Error retrieving inquiry:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
