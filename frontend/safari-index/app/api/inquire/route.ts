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
import { verifyReCaptchaToken } from '@/lib/recaptcha';

/**
 * POST /api/inquire
 * Create a new inquiry
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify reCAPTCHA token if provided
    if (body.recaptchaToken) {
      const recaptchaResult = await verifyReCaptchaToken(body.recaptchaToken, 'inquiry_submit');
      if (!recaptchaResult.success) {
        console.warn('[Inquiry API] reCAPTCHA failed:', recaptchaResult.error);
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Remove recaptchaToken from body before validation
    const { recaptchaToken, ...requestBody } = body;

    // Validate request payload
    const parseResult = InquiryRequestSchema.safeParse(requestBody);
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

    // Send operator notification (await to ensure it completes before response)
    // In serverless environments, fire-and-forget may not complete
    const fullRecord = await getInquiry(inquiry_id);
    if (fullRecord) {
      try {
        await sendInquiryNotification(fullRecord);
      } catch (err) {
        console.error('[Inquiry API] Failed to send notification:', err);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      inquiry_id,
      created_at,
    });
  } catch (error) {
    // Enhanced logging for debugging AWS/DynamoDB issues
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3).join('\n') : undefined,
    };
    console.error('[Inquiry API] Error creating inquiry:', JSON.stringify(errorDetails, null, 2));
    console.error('[Inquiry API] Environment check:', {
      hasAwsAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasDynamoAccessKey: !!process.env.DYNAMO_ACCESS_KEY_ID,
      region: process.env.AWS_REGION || process.env.DYNAMO_REGION || 'eu-central-1 (default)',
      inquiryTable: process.env.INQUIRY_TABLE || 'safari-index-inquiries (default)',
    });
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
