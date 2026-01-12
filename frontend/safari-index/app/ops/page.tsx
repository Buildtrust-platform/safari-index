/**
 * Ops Dashboard Home
 *
 * Intelligent dashboard showing actionable overview:
 * - Needs Attention section (urgent items)
 * - Recent Activity feed
 * - Weekly metrics with trends
 * - Quick navigation to all tools
 *
 * Protected by x-ops-key header check.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Mail,
  MessageSquare,
  Layers,
  Calendar,
  Phone,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

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

interface DashboardStats {
  needsAttention: {
    newInquiries: { count: number; oldest: string | null };
    awaitingResponse: { count: number; oldest: string | null };
    dueFollowUps: { count: number };
  };
  pipeline: {
    new: number;
    contacted: number;
    quoted: number;
    won: number;
    lost: number;
    total: number;
  };
  thisWeek: {
    newInquiries: number;
    contacted: number;
    quoted: number;
    won: number;
    avgResponseTimeHours: number | null;
  };
  lastWeek: {
    newInquiries: number;
    contacted: number;
    quoted: number;
    won: number;
    avgResponseTimeHours: number | null;
  };
  trends: {
    responseTimeChange: number | null;
    inquiryVolumeChange: number;
  };
  recentInquiries: Array<{
    inquiry_id: string;
    email: string;
    trip_shape_id?: string;
    traveler_count: number;
    created_at: string;
    elapsed: string;
  }>;
  upcomingFollowUps: Array<{
    followup_id: string;
    inquiry_id: string;
    type: string;
    scheduled_for: string;
    notes?: string;
  }>;
}

/**
 * Attention item card
 */
function AttentionCard({
  icon: Icon,
  color,
  count,
  label,
  subtext,
  href,
}: {
  icon: React.ElementType;
  color: 'red' | 'yellow' | 'blue';
  count: number;
  label: string;
  subtext?: string;
  href: string;
}) {
  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      badge: 'bg-red-600',
      hover: 'hover:border-red-300',
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      badge: 'bg-amber-600',
      hover: 'hover:border-amber-300',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      badge: 'bg-blue-600',
      hover: 'hover:border-blue-300',
    },
  };

  const colors = colorClasses[color];

  if (count === 0) return null;

  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-4 rounded-xl border ${colors.bg} ${colors.border} ${colors.hover} transition-all group`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${colors.badge}`}>
              {count}
            </span>
            <span className="font-medium text-stone-900">{label}</span>
          </div>
          {subtext && (
            <p className="text-sm text-stone-500 mt-0.5">{subtext}</p>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

/**
 * Stat metric with optional trend
 */
function MetricCard({
  label,
  value,
  previousValue,
  suffix,
  showTrend = true,
  invertTrend = false,
}: {
  label: string;
  value: number | string;
  previousValue?: number;
  suffix?: string;
  showTrend?: boolean;
  invertTrend?: boolean;
}) {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  const change = previousValue !== undefined ? numValue - previousValue : null;
  const isPositive = invertTrend ? (change !== null && change < 0) : (change !== null && change > 0);
  const isNegative = invertTrend ? (change !== null && change > 0) : (change !== null && change < 0);

  return (
    <div className="p-4 bg-white rounded-xl border border-stone-200">
      <p className="text-sm text-stone-500 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold text-stone-900">
          {value}{suffix && <span className="text-lg font-normal text-stone-500">{suffix}</span>}
        </span>
        {showTrend && change !== null && change !== 0 && (
          <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-stone-400'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(change)}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Quick action link
 */
function QuickAction({
  icon: Icon,
  label,
  sublabel,
  href,
  color,
  featured,
}: {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  href: string;
  color: string;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={href}
        className="flex items-center justify-between p-5 bg-gradient-to-r from-stone-800 to-stone-900 rounded-xl border border-stone-700 hover:from-stone-700 hover:to-stone-800 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors">
              {label}
            </h3>
            <p className="text-sm text-stone-400">{sublabel}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
            {label}
          </h3>
          <p className="text-sm text-stone-500">{sublabel}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

/**
 * Pipeline stage indicator
 */
function PipelineStage({
  label,
  count,
  icon: Icon,
  color,
  isLast,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-semibold text-stone-900 mt-2">{count}</span>
        <span className="text-xs text-stone-500">{label}</span>
      </div>
      {!isLast && (
        <div className="w-8 h-0.5 bg-stone-200 mx-2 mt-[-24px]" />
      )}
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
      const response = await fetch('/api/ops/dashboard', {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        throw new Error('Failed to load dashboard');
      }

      const data = await response.json();
      setStats(data);
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

  const totalAttention = stats
    ? stats.needsAttention.newInquiries.count +
      stats.needsAttention.awaitingResponse.count +
      stats.needsAttention.dueFollowUps.count
    : 0;

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-100">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-stone-900">Vurara Ops</h1>
                </div>
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

        <div className="max-w-6xl mx-auto px-4 py-6">
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
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-stone-400 animate-spin mx-auto mb-3" />
                <p className="text-stone-500">Loading dashboard...</p>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && stats && (
            <div className="space-y-8">
              {/* Needs Attention Section */}
              {totalAttention > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Needs Attention
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AttentionCard
                      icon={Inbox}
                      color="red"
                      count={stats.needsAttention.newInquiries.count}
                      label="New Inquiries"
                      subtext={stats.needsAttention.newInquiries.oldest ? `oldest: ${stats.needsAttention.newInquiries.oldest}` : undefined}
                      href={`/ops/inquiries?status=new&ops_key=${opsKey}`}
                    />
                    <AttentionCard
                      icon={Clock}
                      color="yellow"
                      count={stats.needsAttention.awaitingResponse.count}
                      label="Awaiting Response"
                      subtext={stats.needsAttention.awaitingResponse.oldest ? `oldest: ${stats.needsAttention.awaitingResponse.oldest}` : undefined}
                      href={`/ops/inquiries?status=contacted&ops_key=${opsKey}`}
                    />
                    <AttentionCard
                      icon={Calendar}
                      color="blue"
                      count={stats.needsAttention.dueFollowUps.count}
                      label="Follow-ups Due"
                      href={`/ops/inquiries?ops_key=${opsKey}`}
                    />
                  </div>
                </section>
              )}

              {/* Quick Actions */}
              <section>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <QuickAction
                    icon={Layers}
                    label="Unified Inbox"
                    sublabel="All messages"
                    href={`/ops/inbox?ops_key=${opsKey}`}
                    color="bg-stone-900 text-white"
                    featured
                  />
                  <QuickAction
                    icon={Inbox}
                    label="Inquiries"
                    sublabel={`${stats.pipeline.total} total`}
                    href={`/ops/inquiries?ops_key=${opsKey}`}
                    color="bg-blue-100 text-blue-600"
                  />
                  <QuickAction
                    icon={MessageSquare}
                    label="Quick Questions"
                    sublabel="Fast responses"
                    href={`/ops/questions?ops_key=${opsKey}`}
                    color="bg-purple-100 text-purple-600"
                  />
                  <QuickAction
                    icon={BarChart3}
                    label="Intelligence"
                    sublabel="Analytics"
                    href={`/ops/intelligence?ops_key=${opsKey}`}
                    color="bg-amber-100 text-amber-600"
                  />
                </div>
              </section>

              {/* Pipeline Overview */}
              <section>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Pipeline Overview</h2>
                <div className="bg-white rounded-xl border border-stone-200 p-6">
                  <div className="flex items-center justify-center gap-4 overflow-x-auto">
                    <PipelineStage
                      label="New"
                      count={stats.pipeline.new}
                      icon={Inbox}
                      color="bg-blue-500"
                    />
                    <PipelineStage
                      label="Contacted"
                      count={stats.pipeline.contacted}
                      icon={Users}
                      color="bg-amber-500"
                    />
                    <PipelineStage
                      label="Quoted"
                      count={stats.pipeline.quoted}
                      icon={FileText}
                      color="bg-purple-500"
                    />
                    <PipelineStage
                      label="Won"
                      count={stats.pipeline.won}
                      icon={CheckCircle2}
                      color="bg-green-500"
                      isLast
                    />
                  </div>
                </div>
              </section>

              {/* This Week Stats */}
              <section>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">This Week</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    label="New Inquiries"
                    value={stats.thisWeek.newInquiries}
                    previousValue={stats.lastWeek.newInquiries}
                  />
                  <MetricCard
                    label="Responses Sent"
                    value={stats.thisWeek.contacted}
                    previousValue={stats.lastWeek.contacted}
                  />
                  <MetricCard
                    label="Quotes Sent"
                    value={stats.thisWeek.quoted}
                    previousValue={stats.lastWeek.quoted}
                  />
                  <MetricCard
                    label="Avg Response Time"
                    value={stats.thisWeek.avgResponseTimeHours ?? '-'}
                    previousValue={stats.lastWeek.avgResponseTimeHours ?? undefined}
                    suffix="h"
                    invertTrend
                  />
                </div>
              </section>

              {/* Two Column: Recent Inquiries & Upcoming Follow-ups */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Inquiries */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-stone-900">Recent Inquiries</h2>
                    <Link
                      href={`/ops/inquiries?ops_key=${opsKey}`}
                      className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {stats.recentInquiries.length > 0 ? (
                    <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                      {stats.recentInquiries.map((inquiry) => (
                        <Link
                          key={inquiry.inquiry_id}
                          href={`/ops/inquiries/${inquiry.inquiry_id}?ops_key=${opsKey}`}
                          className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Inbox className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors truncate">
                                {inquiry.email}
                              </p>
                              <p className="text-sm text-stone-500 truncate">
                                {inquiry.trip_shape_id || 'General'} · {inquiry.traveler_count} travelers
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-stone-400 flex-shrink-0 ml-2">
                            {inquiry.elapsed}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
                      <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500">No new inquiries</p>
                    </div>
                  )}
                </section>

                {/* Upcoming Follow-ups */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-stone-900">Upcoming Follow-ups</h2>
                  </div>
                  {stats.upcomingFollowUps.length > 0 ? (
                    <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                      {stats.upcomingFollowUps.map((followup) => (
                        <Link
                          key={followup.followup_id}
                          href={`/ops/inquiries/${followup.inquiry_id}?ops_key=${opsKey}`}
                          className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              followup.type === 'call'
                                ? 'bg-green-50'
                                : followup.type === 'email'
                                ? 'bg-blue-50'
                                : 'bg-purple-50'
                            }`}>
                              {followup.type === 'call' ? (
                                <Phone className="w-4 h-4 text-green-600" />
                              ) : followup.type === 'email' ? (
                                <Mail className="w-4 h-4 text-blue-600" />
                              ) : (
                                <FileText className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors capitalize">
                                {followup.type.replace('_', ' ')}
                              </p>
                              {followup.notes && (
                                <p className="text-sm text-stone-500 truncate">{followup.notes}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-stone-400 flex-shrink-0 ml-2">
                            {new Date(followup.scheduled_for).toLocaleDateString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
                      <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500">No upcoming follow-ups</p>
                    </div>
                  )}
                </section>
              </div>

              {/* Additional Tools */}
              <section>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">More Tools</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <QuickAction
                    icon={Mail}
                    label="Newsletter"
                    sublabel="Subscribers"
                    href={`/ops/newsletter?ops_key=${opsKey}`}
                    color="bg-green-100 text-green-600"
                  />
                  <QuickAction
                    icon={TrendingUp}
                    label="Conversion"
                    sublabel="Funnel analysis"
                    href={`/ops/intelligence?ops_key=${opsKey}`}
                    color="bg-indigo-100 text-indigo-600"
                  />
                  <QuickAction
                    icon={FileText}
                    label="Proposals"
                    sublabel="Manage quotes"
                    href={`/ops/inquiries?ops_key=${opsKey}`}
                    color="bg-rose-100 text-rose-600"
                  />
                  <QuickAction
                    icon={Calendar}
                    label="Follow-ups"
                    sublabel="Schedule tasks"
                    href={`/ops/inquiries?ops_key=${opsKey}`}
                    color="bg-cyan-100 text-cyan-600"
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
