/**
 * Debug endpoint to check environment variable availability
 * TEMPORARY - Remove after debugging
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // Only show in non-production or with debug flag
  const isDebug = process.env.DEBUG_ENV === 'true' || process.env.NODE_ENV !== 'production';

  if (!isDebug) {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  return NextResponse.json({
    // Check which credential sources are available (don't expose actual values)
    credentials: {
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT_SET',
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT_SET',
      AWS_REGION: process.env.AWS_REGION || 'NOT_SET',
      DYNAMO_ACCESS_KEY_ID: !!process.env.DYNAMO_ACCESS_KEY_ID ? 'SET' : 'NOT_SET',
      DYNAMO_SECRET_ACCESS_KEY: !!process.env.DYNAMO_SECRET_ACCESS_KEY ? 'SET' : 'NOT_SET',
      DYNAMO_REGION: process.env.DYNAMO_REGION || 'NOT_SET',
    },
    // Other useful env vars
    runtime: {
      NODE_ENV: process.env.NODE_ENV,
      INQUIRY_TABLE: process.env.INQUIRY_TABLE || 'safari-index-inquiries (default)',
    },
    // Timestamp to verify fresh response
    timestamp: new Date().toISOString(),
  });
}

export const dynamic = 'force-dynamic';
