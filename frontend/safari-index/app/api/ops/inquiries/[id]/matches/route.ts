/**
 * Trip Matches API
 *
 * Returns matched trip archetypes for an inquiry with scoring and reasoning.
 * Protected by x-ops-key header check.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInquiry } from '../../../../../../lib/db/inquiry-store';
import { getTopTripMatches, getTripArchetype } from '../../../../../../lib/ai/trip-matcher';

const OPS_KEY = process.env.OPS_KEY;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Auth check
  const opsKey = request.headers.get('x-ops-key');
  if (!OPS_KEY || opsKey !== OPS_KEY) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await context.params;

  try {
    // Get inquiry
    const inquiry = await getInquiry(id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Get matches
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3;
    const matches = getTopTripMatches(inquiry, limit);

    // Enrich with trip details
    const enrichedMatches = matches.map((match) => {
      const trip = getTripArchetype(match.trip_id);
      return {
        ...match,
        trip_details: trip
          ? {
              subtitle: trip.subtitle,
              regions: trip.regions,
              duration_days: trip.duration_days,
              comfort_tier: trip.comfort_tier,
              cost_band: trip.cost_band,
              best_months: trip.best_months,
              core_parks_or_areas: trip.core_parks_or_areas,
              traveler_fit: trip.traveler_fit,
              what_this_trip_is_for: trip.what_this_trip_is_for,
            }
          : null,
      };
    });

    return NextResponse.json({
      inquiry_id: id,
      matches: enrichedMatches,
    });
  } catch (error) {
    console.error('[Matches API] Error:', error);
    return NextResponse.json({ error: 'Failed to get matches' }, { status: 500 });
  }
}
