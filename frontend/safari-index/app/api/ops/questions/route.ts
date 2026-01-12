/**
 * Ops Questions List API
 *
 * GET /api/ops/questions - List all quick questions
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { listRecentQuestions } from '@/lib/db/question-store';

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

/**
 * GET /api/ops/questions
 * List all recent questions
 */
export async function GET(request: Request) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const questions = await listRecentQuestions(Math.min(limit, 500));

    return NextResponse.json({
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error('[Ops Questions API] Error listing questions:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve questions' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
