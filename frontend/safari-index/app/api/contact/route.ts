/**
 * Contact API Route
 *
 * POST /api/contact - Submit a quick question
 *
 * Per governance:
 * - Validates payload with zod
 * - Generates question_id server-side
 * - Writes to DynamoDB
 * - Sends operator notification
 * - Fails closed with calm error messages
 */

import { NextResponse } from 'next/server';
import { QuickQuestionRequestSchema } from '@/lib/contracts';
import { createQuestion } from '@/lib/db/question-store';
import { sendQuestionNotification } from '@/lib/email/question-notification';

/**
 * POST /api/contact
 * Submit a quick question
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request payload
    const parseResult = QuickQuestionRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const questionRequest = parseResult.data;

    // Create question in DynamoDB
    const { question_id, created_at } = await createQuestion(questionRequest);

    // Send operator notification (fire-and-forget)
    sendQuestionNotification({
      question_id,
      created_at,
      email: questionRequest.email,
      question: questionRequest.question,
      source_path: questionRequest.source_path,
    }).catch((err) => {
      console.error('[Contact API] Failed to send notification:', err);
    });

    return NextResponse.json({
      question_id,
      created_at,
    });
  } catch (error) {
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3).join('\n') : undefined,
    };
    console.error('[Contact API] Error creating question:', JSON.stringify(errorDetails, null, 2));
    console.error('[Contact API] Environment check:', {
      hasAwsAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasDynamoAccessKey: !!process.env.DYNAMO_ACCESS_KEY_ID,
      region: process.env.AWS_REGION || process.env.DYNAMO_REGION || 'eu-central-1 (default)',
      questionTable: process.env.QUESTION_TABLE || 'safari-index-questions (default)',
    });
    return NextResponse.json(
      { error: 'Unable to send question. Please try again.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
