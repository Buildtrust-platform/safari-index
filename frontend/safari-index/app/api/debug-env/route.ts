/**
 * Debug endpoint to check environment variable availability
 * TEMPORARY - Remove after debugging
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Allow access with secret query param or DEBUG_ENV flag
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const isDebug = process.env.DEBUG_ENV === 'true' ||
                  process.env.NODE_ENV !== 'production' ||
                  secret === 'safari2024debug';

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
    // Build identifier to verify deployment
    build_commit: '7902878-rebuild',
  });
}

export const dynamic = 'force-dynamic';
