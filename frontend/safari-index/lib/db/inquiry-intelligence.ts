/**
 * Inquiry Intelligence Aggregation
 *
 * Read-only utilities for aggregating inquiry attribution data.
 * Powers the ops intelligence dashboard for market validation.
 *
 * Per governance:
 * - No modification of inquiry data
 * - No external analytics services
 * - Simple in-memory aggregation from DynamoDB
 * - All operations are read-only
 */

import type { InquiryRecord, EntrySurface } from '../contracts';
import { listRecentInquiries } from './inquiry-store';

/**
 * Entry surface breakdown with count and percentage
 */
export interface EntrySurfaceStats {
  surface: EntrySurface;
  count: number;
  percentage: number;
}

/**
 * Decision influence stats
 */
export interface DecisionInfluenceStats {
  decision_id: string;
  inquiry_count: number;
  percentage: number;
}

/**
 * Trip influence stats
 */
export interface TripInfluenceStats {
  trip_id: string;
  inquiry_count: number;
  percentage: number;
}

/**
 * Complete intelligence summary
 */
export interface IntelligenceSummary {
  total_inquiries: number;
  date_range: {
    earliest: string | null;
    latest: string | null;
  };
  entry_surfaces: EntrySurfaceStats[];
  top_decisions: DecisionInfluenceStats[];
  top_trips: TripInfluenceStats[];
  utm_sources: { source: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  avg_pages_viewed: number | null;
}

/**
 * Get entry surface breakdown from inquiries
 */
export function aggregateEntrySurfaces(inquiries: InquiryRecord[]): EntrySurfaceStats[] {
  const counts = new Map<EntrySurface, number>();
  let total = 0;

  for (const inquiry of inquiries) {
    const surface = inquiry.attribution?.entry_surface || 'unknown';
    counts.set(surface, (counts.get(surface) || 0) + 1);
    total++;
  }

  if (total === 0) return [];

  // Sort by count descending
  return Array.from(counts.entries())
    .map(([surface, count]) => ({
      surface,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get top decisions by inquiry influence
 * Counts how many inquiries have each decision_id in their linked_decision_ids
 */
export function aggregateTopDecisions(
  inquiries: InquiryRecord[],
  limit: number = 10
): DecisionInfluenceStats[] {
  const counts = new Map<string, number>();
  const total = inquiries.length;

  for (const inquiry of inquiries) {
    const decisionIds = inquiry.linked_decision_ids || [];
    for (const decisionId of decisionIds) {
      counts.set(decisionId, (counts.get(decisionId) || 0) + 1);
    }
  }

  if (total === 0) return [];

  // Sort by count descending and limit
  return Array.from(counts.entries())
    .map(([decision_id, inquiry_count]) => ({
      decision_id,
      inquiry_count,
      percentage: Math.round((inquiry_count / total) * 100),
    }))
    .sort((a, b) => b.inquiry_count - a.inquiry_count)
    .slice(0, limit);
}

/**
 * Get top trips by inquiry influence
 * Counts how many inquiries reference each trip_shape_id
 */
export function aggregateTopTrips(
  inquiries: InquiryRecord[],
  limit: number = 10
): TripInfluenceStats[] {
  const counts = new Map<string, number>();
  let withTrip = 0;

  for (const inquiry of inquiries) {
    if (inquiry.trip_shape_id) {
      counts.set(inquiry.trip_shape_id, (counts.get(inquiry.trip_shape_id) || 0) + 1);
      withTrip++;
    }
  }

  if (withTrip === 0) return [];

  // Sort by count descending and limit
  return Array.from(counts.entries())
    .map(([trip_id, inquiry_count]) => ({
      trip_id,
      inquiry_count,
      percentage: Math.round((inquiry_count / withTrip) * 100),
    }))
    .sort((a, b) => b.inquiry_count - a.inquiry_count)
    .slice(0, limit);
}

/**
 * Aggregate UTM sources
 */
export function aggregateUtmSources(
  inquiries: InquiryRecord[],
  limit: number = 10
): { source: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const inquiry of inquiries) {
    const source = inquiry.attribution?.utm_source;
    if (source) {
      counts.set(source, (counts.get(source) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Aggregate referrers (external traffic sources)
 */
export function aggregateReferrers(
  inquiries: InquiryRecord[],
  limit: number = 10
): { referrer: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const inquiry of inquiries) {
    const referrer = inquiry.attribution?.referrer;
    if (referrer) {
      // Extract hostname from referrer URL for grouping
      try {
        const url = new URL(referrer);
        const hostname = url.hostname;
        counts.set(hostname, (counts.get(hostname) || 0) + 1);
      } catch {
        // If not a valid URL, use as-is
        counts.set(referrer, (counts.get(referrer) || 0) + 1);
      }
    }
  }

  return Array.from(counts.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Calculate average pages viewed before inquiry
 */
export function calculateAvgPagesViewed(inquiries: InquiryRecord[]): number | null {
  const pagesViewedList: number[] = [];

  for (const inquiry of inquiries) {
    const pagesViewed = inquiry.attribution?.pages_viewed;
    if (typeof pagesViewed === 'number') {
      pagesViewedList.push(pagesViewed);
    }
  }

  if (pagesViewedList.length === 0) return null;

  const sum = pagesViewedList.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / pagesViewedList.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Get complete intelligence summary
 * Main entry point for ops dashboard
 */
export async function getIntelligenceSummary(
  limit: number = 100
): Promise<IntelligenceSummary> {
  const inquiries = await listRecentInquiries(limit);

  // Get date range
  let earliest: string | null = null;
  let latest: string | null = null;
  for (const inquiry of inquiries) {
    if (!earliest || inquiry.created_at < earliest) earliest = inquiry.created_at;
    if (!latest || inquiry.created_at > latest) latest = inquiry.created_at;
  }

  return {
    total_inquiries: inquiries.length,
    date_range: { earliest, latest },
    entry_surfaces: aggregateEntrySurfaces(inquiries),
    top_decisions: aggregateTopDecisions(inquiries, 10),
    top_trips: aggregateTopTrips(inquiries, 10),
    utm_sources: aggregateUtmSources(inquiries, 10),
    referrers: aggregateReferrers(inquiries, 10),
    avg_pages_viewed: calculateAvgPagesViewed(inquiries),
  };
}

/**
 * Get inquiries with attribution data for detailed view
 * Returns only inquiries that have attribution information
 */
export async function getInquiriesWithAttribution(
  limit: number = 50
): Promise<InquiryRecord[]> {
  const inquiries = await listRecentInquiries(limit);

  // Filter to only those with some attribution data
  return inquiries.filter(
    (inquiry) =>
      inquiry.attribution &&
      (inquiry.attribution.entry_surface ||
        inquiry.attribution.first_touch_path ||
        inquiry.attribution.referrer ||
        inquiry.attribution.utm_source)
  );
}
