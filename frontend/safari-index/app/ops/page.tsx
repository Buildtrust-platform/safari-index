/**
 * Ops Dashboard Landing Page
 *
 * Internal-only dashboard providing overview of operational metrics
 * and quick access to inquiry and proposal management.
 *
 * Protected by x-ops-key header check.
 *
 * Per governance:
 * - noindex, nofollow
 * - Simple, functional UI
 * - No marketing or sales framing
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { InquiryRecord, InquiryStatus, ProposalStatus } from '../../lib/contracts';

/**
 * Get OPS_KEY from client-side
 */
function getOpsKey(): string | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const keyFromUrl = urlParams.get('ops_key');
  if (keyFromUrl) {
    localStorage.setItem('ops_key', keyFromUrl);
    return keyFromUrl;
  }

  return localStorage.getItem('ops_key');
}

/**
 * Calculate time elapsed since creation
 */
function getElapsedTime(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  return 'Just now';
}

interface DashboardStats {
  inquiries: {
    total: number;
    new: number;
    contacted: number;
    quoted: number;
    won: number;
    lost: number;
    recentNew: InquiryRecord[];
  };
  proposals: {
    total: number;
    draft: number;
    sent: number;
  };
}

/**
 * Stat card component
 */
function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{label}</p>
          <p className={`text-2xl font-semibold ${highlight ? 'text-amber-700' : 'text-stone-900'}`}>
            {value}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${highlight ? 'text-amber-400' : 'text-stone-300'}`} />
      </div>
    </div>
  );
}

export default function OpsDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);

  useEffect(() => {
    const key = getOpsKey();
    setOpsKey(key);

    if (!key) {
      setError('Access key required. Add ?ops_key=YOUR_KEY to the URL.');
      setLoading(false);
      return;
    }

    fetchStats(key);
  }, []);

  async function fetchStats(key: string) {
    setLoading(true);
    setError(null);

    try {
      // Fetch inquiries
      const inquiriesResponse = await fetch('/api/ops/inquiries', {
        headers: { 'x-ops-key': key },
      });

      if (!inquiriesResponse.ok) {
        throw new Error('Failed to load data');
      }

      const inquiriesData = await inquiriesResponse.json();
      const inquiries: InquiryRecord[] = inquiriesData.inquiries || [];

      // Calculate inquiry stats
      const statusCounts = inquiries.reduce(
        (acc, inq) => {
          acc[inq.status] = (acc[inq.status] || 0) + 1;
          return acc;
        },
        {} as Record<InquiryStatus, number>
      );

      // Get recent new inquiries (last 5)
      const recentNew = inquiries
        .filter((inq) => inq.status === 'new')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // For now, we don't have a proposals list endpoint, so we'll show placeholder stats
      // In production, this would fetch from /api/ops/proposals
      setStats({
        inquiries: {
          total: inquiries.length,
          new: statusCounts.new || 0,
          contacted: statusCounts.contacted || 0,
          quoted: statusCounts.quoted || 0,
          won: statusCounts.won || 0,
          lost: statusCounts.lost || 0,
          recentNew,
        },
        proposals: {
          total: 0,
          draft: 0,
          sent: 0,
        },
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    if (opsKey) {
      fetchStats(opsKey);
    }
  };

  return (
    <>
      {/* noindex meta tag */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-100">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-6 h-6 text-stone-600" />
                <h1 className="text-xl font-semibold text-stone-900">Ops Dashboard</h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-stone-500">Loading dashboard...</div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && stats && (
            <div className="space-y-8">
              {/* Quick Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href={`/ops/inquiries?ops_key=${opsKey}`}
                  className="flex items-center justify-between p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Inbox className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-stone-900 group-hover:text-blue-700 transition-colors">
                        Inquiries
                      </h2>
                      <p className="text-sm text-stone-500">
                        {stats.inquiries.total} total, {stats.inquiries.new} new
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-blue-600 transition-colors" />
                </Link>

                <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-stone-200 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-stone-900">Proposals</h2>
                      <p className="text-sm text-stone-500">
                        Access via inquiry detail pages
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </div>
              </div>

              {/* Inquiry Stats */}
              <section>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Inquiry Pipeline</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard
                    label="New"
                    value={stats.inquiries.new}
                    icon={Inbox}
                    highlight={stats.inquiries.new > 0}
                  />
                  <StatCard
                    label="Contacted"
                    value={stats.inquiries.contacted}
                    icon={Users}
                  />
                  <StatCard
                    label="Quoted"
                    value={stats.inquiries.quoted}
                    icon={FileText}
                  />
                  <StatCard
                    label="Won"
                    value={stats.inquiries.won}
                    icon={TrendingUp}
                  />
                  <StatCard
                    label="Total"
                    value={stats.inquiries.total}
                    icon={LayoutDashboard}
                  />
                </div>
              </section>

              {/* Recent New Inquiries */}
              {stats.inquiries.recentNew.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-stone-900">Recent New Inquiries</h2>
                    <Link
                      href={`/ops/inquiries?ops_key=${opsKey}`}
                      className="text-sm text-amber-600 hover:text-amber-700"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                    {stats.inquiries.recentNew.map((inquiry) => (
                      <Link
                        key={inquiry.inquiry_id}
                        href={`/ops/inquiries/${inquiry.inquiry_id}?ops_key=${opsKey}`}
                        className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Inbox className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                              {inquiry.email}
                            </p>
                            <p className="text-sm text-stone-500">
                              {inquiry.trip_shape_id || 'General inquiry'} &middot; {inquiry.traveler_count} travelers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-stone-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getElapsedTime(inquiry.created_at)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state for no new inquiries */}
              {stats.inquiries.recentNew.length === 0 && (
                <section className="text-center py-12 bg-white rounded-xl border border-stone-200">
                  <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">No new inquiries</p>
                  <p className="text-sm text-stone-400 mt-1">
                    New inquiries will appear here when they arrive
                  </p>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
