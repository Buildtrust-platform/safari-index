/**
 * Ops Dashboard Stats API
 *
 * GET /api/ops/dashboard - Get dashboard overview stats
 *
 * Returns:
 * - Needs attention counts (new inquiries, awaiting response, due follow-ups)
 * - Pipeline stats by status
 * - Weekly metrics with trends
 * - Recent activity feed
 *
 * Protected by OPS_KEY header check.
 */

import { NextResponse } from 'next/server';
import { listRecentInquiries, listInquiriesByStatus } from '@/lib/db/inquiry-store';
import { listFollowUpsByStatus, getDueFollowUps } from '@/lib/db/followup-store';
import type { InquiryRecord, InquiryStatus, FollowUpRecord } from '@/lib/contracts';

const OPS_KEY = process.env.OPS_KEY;

function verifyOpsAuth(request: Request): boolean {
  if (!OPS_KEY) {
    return process.env.NODE_ENV === 'development';
  }
  const providedKey = request.headers.get('x-ops-key');
  return providedKey === OPS_KEY;
}

/**
 * Calculate average response time in hours
 * (Time from inquiry creation to first status change to 'contacted')
 */
function calculateAvgResponseTime(inquiries: InquiryRecord[]): number | null {
  const contactedInquiries = inquiries.filter(
    (inq) => inq.contacted_at && inq.created_at
  );

  if (contactedInquiries.length === 0) return null;

  const totalHours = contactedInquiries.reduce((sum, inq) => {
    const created = new Date(inq.created_at).getTime();
    const contacted = new Date(inq.contacted_at!).getTime();
    const diffHours = (contacted - created) / (1000 * 60 * 60);
    return sum + diffHours;
  }, 0);

  return Math.round((totalHours / contactedInquiries.length) * 10) / 10;
}

/**
 * Get stats for a date range
 */
function getStatsForPeriod(
  inquiries: InquiryRecord[],
  startDate: Date,
  endDate: Date
): {
  newInquiries: number;
  contacted: number;
  quoted: number;
  won: number;
} {
  const inPeriod = inquiries.filter((inq) => {
    const created = new Date(inq.created_at);
    return created >= startDate && created <= endDate;
  });

  return {
    newInquiries: inPeriod.length,
    contacted: inPeriod.filter((inq) => inq.contacted_at).length,
    quoted: inPeriod.filter((inq) => inq.quoted_at).length,
    won: inPeriod.filter((inq) => inq.status === 'won').length,
  };
}

/**
 * Format relative time for display
 */
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Get oldest item timestamp from a list
 */
function getOldestTimestamp(items: { created_at: string }[]): string | null {
  if (items.length === 0) return null;

  const sorted = [...items].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return formatRelativeTime(sorted[0].created_at);
}

export async function GET(request: Request) {
  if (!verifyOpsAuth(request)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    // Fetch all data in parallel
    const [
      allInquiries,
      newInquiries,
      contactedInquiries,
      pendingFollowUps,
      dueFollowUps,
    ] = await Promise.all([
      listRecentInquiries(500),
      listInquiriesByStatus('new', 100),
      listInquiriesByStatus('contacted', 100),
      listFollowUpsByStatus('pending', 100),
      getDueFollowUps(50),
    ]);

    // Calculate date ranges
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    // Calculate weekly stats
    const thisWeekStats = getStatsForPeriod(allInquiries, thisWeekStart, now);
    const lastWeekStats = getStatsForPeriod(allInquiries, lastWeekStart, lastWeekEnd);

    // Calculate response time for this week vs last week
    const thisWeekInquiries = allInquiries.filter((inq) => {
      const created = new Date(inq.created_at);
      return created >= thisWeekStart && created <= now;
    });
    const lastWeekInquiries = allInquiries.filter((inq) => {
      const created = new Date(inq.created_at);
      return created >= lastWeekStart && created <= lastWeekEnd;
    });

    const thisWeekResponseTime = calculateAvgResponseTime(thisWeekInquiries);
    const lastWeekResponseTime = calculateAvgResponseTime(lastWeekInquiries);

    // Count inquiries awaiting response (contacted but not yet quoted, older than 24h)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const awaitingResponse = contactedInquiries.filter((inq) => {
      const contacted = inq.contacted_at ? new Date(inq.contacted_at) : null;
      return contacted && contacted < twentyFourHoursAgo && !inq.quoted_at;
    });

    // Get status counts
    const statusCounts = allInquiries.reduce(
      (acc, inq) => {
        acc[inq.status] = (acc[inq.status] || 0) + 1;
        return acc;
      },
      {} as Record<InquiryStatus, number>
    );

    // Build response
    const dashboardStats = {
      needsAttention: {
        newInquiries: {
          count: newInquiries.length,
          oldest: getOldestTimestamp(newInquiries),
        },
        awaitingResponse: {
          count: awaitingResponse.length,
          oldest: awaitingResponse.length > 0
            ? formatRelativeTime(awaitingResponse[awaitingResponse.length - 1].contacted_at!)
            : null,
        },
        dueFollowUps: {
          count: dueFollowUps.length,
        },
      },
      pipeline: {
        new: statusCounts.new || 0,
        contacted: statusCounts.contacted || 0,
        quoted: statusCounts.quoted || 0,
        won: statusCounts.won || 0,
        lost: statusCounts.lost || 0,
        total: allInquiries.length,
      },
      thisWeek: {
        newInquiries: thisWeekStats.newInquiries,
        contacted: thisWeekStats.contacted,
        quoted: thisWeekStats.quoted,
        won: thisWeekStats.won,
        avgResponseTimeHours: thisWeekResponseTime,
      },
      lastWeek: {
        newInquiries: lastWeekStats.newInquiries,
        contacted: lastWeekStats.contacted,
        quoted: lastWeekStats.quoted,
        won: lastWeekStats.won,
        avgResponseTimeHours: lastWeekResponseTime,
      },
      trends: {
        responseTimeChange:
          thisWeekResponseTime !== null && lastWeekResponseTime !== null
            ? Math.round((thisWeekResponseTime - lastWeekResponseTime) * 10) / 10
            : null,
        inquiryVolumeChange: thisWeekStats.newInquiries - lastWeekStats.newInquiries,
      },
      recentInquiries: newInquiries.slice(0, 5).map((inq) => ({
        inquiry_id: inq.inquiry_id,
        email: inq.email,
        trip_shape_id: inq.trip_shape_id,
        traveler_count: inq.traveler_count,
        created_at: inq.created_at,
        elapsed: formatRelativeTime(inq.created_at),
      })),
      upcomingFollowUps: pendingFollowUps.slice(0, 5).map((fu) => ({
        followup_id: fu.followup_id,
        inquiry_id: fu.inquiry_id,
        type: fu.type,
        scheduled_for: fu.scheduled_for,
        notes: fu.notes,
      })),
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('[Ops Dashboard API] Error:', error);
    return NextResponse.json(
      { error: 'Unable to load dashboard stats' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
