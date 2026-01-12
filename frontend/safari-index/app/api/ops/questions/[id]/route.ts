/**
 * Ops Question Detail API
 *
 * GET /api/ops/questions/[id] - Get question by ID
 * PATCH /api/ops/questions/[id] - Update question status/reply
 *
 * Protected by OPS_KEY header check.
 * Returns 404 (not 401) if unauthorized to reduce discoverability.
 */

import { NextResponse } from 'next/server';
import { getQuestion, updateQuestion } from '@/lib/db/question-store';
import { z } from 'zod';

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

// Validation schema for question updates
const QuestionUpdateSchema = z.object({
  status: z.enum(['new', 'replied', 'closed']).optional(),
  reply: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ops/questions/[id]
 * Get a single question
 */
export async function GET(request: Request, { params }: RouteParams) {
  // Verify authorization
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const question = await getQuestion(id);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('[Ops Question API] Error retrieving question:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve question' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ops/questions/[id]
 * Update question status or add reply
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
    const parseResult = QuestionUpdateSchema.safeParse(body);
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

    // Check question exists
    const existing = await getQuestion(id);
    if (!existing) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Apply updates
    const updated = await updateQuestion(id, updates);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[Ops Question API] Error updating question:', error);
    return NextResponse.json(
      { error: 'Unable to update question' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
