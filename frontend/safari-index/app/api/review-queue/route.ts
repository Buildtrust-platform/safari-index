/**
 * Review Queue API Route (Placeholder)
 *
 * Per 06_review_correction.md:
 * - Minimal interface for reviewing flagged decisions
 * - Developer-only, no auth yet
 *
 * For MVP: This returns instructions for CLI access.
 * Full implementation requires backend API endpoint that queries DynamoDB.
 *
 * GET /api/review-queue - List pending reviews
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // For MVP, return instructions until backend review endpoint is deployed
  // The actual review data is in DynamoDB (safari-index-reviews table)

  return NextResponse.json({
    count: 0,
    reviews: [],
    access: {
      message: 'Review queue accessible via AWS CLI',
      commands: {
        list_pending: 'aws dynamodb scan --table-name safari-index-reviews --filter-expression "#s = :pending" --expression-attribute-names \'{"#s":"status"}\' --expression-attribute-values \'{":pending":{"S":"pending"}}\' --region eu-central-1',
        list_all: 'aws dynamodb scan --table-name safari-index-reviews --region eu-central-1',
      },
      reason_codes: [
        'QUALITY_GATE_FAILED',
        'REPEATED_TOPIC_VISIT',
        'OUTCOME_CHANGED',
        'HIGH_REFUSAL_RATE',
        'CONFIDENCE_DRIFT',
        'MANUAL_FLAG',
      ],
    },
  });
}
