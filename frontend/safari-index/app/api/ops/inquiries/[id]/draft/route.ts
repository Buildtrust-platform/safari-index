/**
 * Ops Inquiry Draft API
 *
 * POST /api/ops/inquiries/[id]/draft - Generate AI response draft
 *
 * Generates personalized email responses using inquiry context
 * and optional trip match selection.
 *
 * Protected by OPS_KEY header check.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getInquiry } from '@/lib/db/inquiry-store';
import { generateResponse, generateBasicResponse, type ResponseTemplate } from '@/lib/ai/response-generator';
import { getTopTripMatches, type TripMatch } from '@/lib/ai/trip-matcher';
import { z } from 'zod';

const OPS_KEY = process.env.OPS_KEY;

function verifyOpsAuth(request: Request): boolean {
  if (!OPS_KEY) {
    return process.env.NODE_ENV === 'development';
  }
  const providedKey = request.headers.get('x-ops-key');
  return providedKey === OPS_KEY;
}

// Request validation schema
const DraftRequestSchema = z.object({
  template: z.enum(['first_response', 'follow_up', 'quote_sent', 'checking_in']).default('first_response'),
  trip_id: z.string().optional(),
  use_ai: z.boolean().default(true),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/ops/inquiries/[id]/draft
 * Generate an email response draft
 */
export async function POST(request: NextRequest, context: RouteContext) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    // Validate request
    const parseResult = DraftRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { template, trip_id, use_ai } = parseResult.data;

    // Get inquiry
    const inquiry = await getInquiry(id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Get trip match if specified, otherwise use top match
    let selectedTrip: TripMatch | undefined;

    if (trip_id) {
      const allMatches = getTopTripMatches(inquiry, 10);
      selectedTrip = allMatches.find((m) => m.trip_id === trip_id);
    } else {
      // Use top match by default for first_response
      if (template === 'first_response') {
        const topMatches = getTopTripMatches(inquiry, 1);
        selectedTrip = topMatches[0];
      }
    }

    // Generate response
    let response;

    if (use_ai && process.env.ANTHROPIC_API_KEY) {
      try {
        response = await generateResponse(inquiry, template as ResponseTemplate, selectedTrip);
      } catch (error) {
        console.warn('[Draft API] AI generation failed, falling back to basic template:', error);
        response = generateBasicResponse(inquiry, template as ResponseTemplate, selectedTrip);
      }
    } else {
      response = generateBasicResponse(inquiry, template as ResponseTemplate, selectedTrip);
    }

    return NextResponse.json({
      draft: response,
      inquiry_id: id,
      selected_trip: selectedTrip
        ? {
            trip_id: selectedTrip.trip_id,
            trip_title: selectedTrip.trip_title,
            match_score: selectedTrip.match_score,
          }
        : null,
    });
  } catch (error) {
    console.error('[Draft API] Error:', error);
    return NextResponse.json(
      { error: 'Unable to generate draft' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
