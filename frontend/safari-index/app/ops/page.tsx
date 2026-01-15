'use client';

/**
 * Ops Dashboard Home
 *
 * Focus view showing what needs action NOW:
 * - Attention items (new inquiries, overdue follow-ups)
 * - Weekly stats with trends
 * - Pipeline overview
 * - Recent activity feed
 *
 * Keyboard shortcuts:
 * - I: Go to Inbox
 * - A: Go to Analytics
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Inbox,
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Mail,
  Calendar,
  Phone,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useOpsKey } from './components/hooks/useOpsKey';

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
  recentInquiries: Array<{
    inquiry_id: string;
    email: string;
    status?: string;
    traveler_count: number;
    created_at: string;
  }>;
  upcomingFollowUps: Array<{
    followup_id: string;
    inquiry_id: string;
    type: string;
    scheduled_for: string;
    notes?: string;
  }>;
}

// ============================================================
// COMPONENTS
// ============================================================

function AttentionCard({
  icon: Icon,
  variant,
  count,
  label,
  subtext,
  href,
}: {
  icon: React.ElementType;
  variant: 'urgent' | 'warning' | 'info';
  count: number;
  label: string;
  subtext?: string;
  href: string;
}) {
  const variants = {
    urgent: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-600',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-600',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-600',
    },
  };

  const colors = variants[variant];

  if (count === 0) return null;

  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-4 rounded-xl border ${colors.bg} ${colors.border} hover:shadow-md transition-all group`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${colors.badge}`}>
              {count}
            </span>
            <span className="font-medium text-stone-900 dark:text-white">{label}</span>
          </div>
          {subtext && (
            <p className="text-sm text-stone-500 dark:text-zinc-400 mt-0.5">{subtext}</p>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-stone-400 dark:text-zinc-500 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

function StatCard({
  label,
  value,
  previousValue,
  suffix,
  invertTrend = false,
}: {
  label: string;
  value: number | string;
  previousValue?: number;
  suffix?: string;
  invertTrend?: boolean;
}) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const change = previousValue !== undefined ? numValue - previousValue : null;
  const isPositive = invertTrend ? (change !== null && change < 0) : (change !== null && change > 0);
  const isNegative = invertTrend ? (change !== null && change > 0) : (change !== null && change < 0);

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800">
      <p className="text-sm text-stone-500 dark:text-zinc-400 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold text-stone-900 dark:text-white">
          {value}
          {suffix && <span className="text-lg font-normal text-stone-500 dark:text-zinc-400">{suffix}</span>}
        </span>
        {change !== null && change !== 0 && (
          <span className={`flex items-center text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-stone-400'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}
          </span>
        )}
      </div>
    </div>
  );
}

function PipelineBar({
  stages,
}: {
  stages: { label: string; count: number; color: string }[];
}) {
  const total = stages.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6">
      <h3 className="text-sm font-medium text-stone-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
        Pipeline
      </h3>
      <div className="space-y-3">
        {stages.map((stage) => {
          const width = total > 0 ? (stage.count / total) * 100 : 0;
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <div className="w-24 text-sm text-stone-600 dark:text-zinc-400">{stage.label}</div>
              <div className="flex-1 h-6 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full ${stage.color} rounded-full`}
                />
              </div>
              <div className="w-8 text-right text-sm font-medium text-stone-900 dark:text-white">
                {stage.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OpsDashboardPage() {
  const router = useRouter();
  const { opsKey, isAuthenticated, isLoading: authLoading, getAuthHeaders } = useOpsKey();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!opsKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ops/dashboard', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to load dashboard');

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [opsKey, getAuthHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  // Loading / auth states handled by layout
  if (authLoading) return null;
  if (!isAuthenticated) return null;

  const totalAttention = stats
    ? stats.needsAttention.newInquiries.count +
      stats.needsAttention.awaitingResponse.count +
      stats.needsAttention.dueFollowUps.count
    : 0;

  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-white">
              {greeting}
            </h1>
            <p className="text-stone-500 dark:text-zinc-400">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && !stats && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-stone-400 dark:text-zinc-500 animate-spin" />
          </div>
        )}

        {/* Dashboard content */}
        {stats && (
          <>
            {/* Needs Attention */}
            {totalAttention > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Needs Your Attention
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AttentionCard
                    icon={Inbox}
                    variant="urgent"
                    count={stats.needsAttention.newInquiries.count}
                    label="New Inquiries"
                    subtext={stats.needsAttention.newInquiries.oldest ? `Oldest: ${stats.needsAttention.newInquiries.oldest}` : undefined}
                    href="/ops/inbox?status=new"
                  />
                  <AttentionCard
                    icon={Clock}
                    variant="warning"
                    count={stats.needsAttention.awaitingResponse.count}
                    label="Awaiting Response"
                    subtext={stats.needsAttention.awaitingResponse.oldest ? `Oldest: ${stats.needsAttention.awaitingResponse.oldest}` : undefined}
                    href="/ops/inbox?status=contacted"
                  />
                  <AttentionCard
                    icon={Calendar}
                    variant="info"
                    count={stats.needsAttention.dueFollowUps.count}
                    label="Follow-ups Due"
                    href="/ops/inbox"
                  />
                </div>
              </section>
            )}

            {/* All clear message */}
            {totalAttention === 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 dark:text-green-300">All caught up!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  No urgent items requiring attention
                </p>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="This Week"
                value={stats.thisWeek.newInquiries}
                previousValue={stats.lastWeek.newInquiries}
                suffix=" inquiries"
              />
              <StatCard
                label="Responses"
                value={stats.thisWeek.contacted}
                previousValue={stats.lastWeek.contacted}
              />
              <StatCard
                label="Quotes"
                value={stats.thisWeek.quoted}
                previousValue={stats.lastWeek.quoted}
              />
              <StatCard
                label="Avg Response"
                value={stats.thisWeek.avgResponseTimeHours?.toFixed(1) ?? '-'}
                previousValue={stats.lastWeek.avgResponseTimeHours ?? undefined}
                suffix="h"
                invertTrend
              />
            </div>

            {/* Pipeline + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline */}
              <PipelineBar
                stages={[
                  { label: 'New', count: stats.pipeline.new, color: 'bg-blue-500' },
                  { label: 'Contacted', count: stats.pipeline.contacted, color: 'bg-purple-500' },
                  { label: 'Quoted', count: stats.pipeline.quoted, color: 'bg-amber-500' },
                  { label: 'Won', count: stats.pipeline.won, color: 'bg-green-500' },
                  { label: 'Lost', count: stats.pipeline.lost, color: 'bg-red-500' },
                ]}
              />

              {/* Recent Inquiries */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-zinc-800">
                  <h3 className="text-sm font-medium text-stone-500 dark:text-zinc-400 uppercase tracking-wide">
                    Recent Inquiries
                  </h3>
                  <Link
                    href="/ops/inbox"
                    className="text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                {stats.recentInquiries.length > 0 ? (
                  <div className="divide-y divide-stone-100 dark:divide-zinc-800">
                    {stats.recentInquiries.slice(0, 5).map((inquiry) => (
                      <Link
                        key={inquiry.inquiry_id}
                        href={`/ops/inquiries/${inquiry.inquiry_id}`}
                        className="flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors truncate">
                              {inquiry.email}
                            </p>
                            <p className="text-sm text-stone-500 dark:text-zinc-400">
                              {inquiry.traveler_count} travelers
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-stone-400 dark:text-zinc-500 flex-shrink-0">
                          {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Inbox className="w-10 h-10 text-stone-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="text-stone-500 dark:text-zinc-400">No recent inquiries</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/ops/inbox"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-stone-900 dark:bg-white flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-white dark:text-stone-900" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400">
                      Inbox
                    </p>
                    <p className="text-sm text-stone-500 dark:text-zinc-400">
                      {stats.pipeline.total} total
                    </p>
                  </div>
                </Link>
                <Link
                  href="/ops/intelligence"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400">
                      Analytics
                    </p>
                    <p className="text-sm text-stone-500 dark:text-zinc-400">Insights</p>
                  </div>
                </Link>
                <Link
                  href="/ops/questions"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400">
                      Questions
                    </p>
                    <p className="text-sm text-stone-500 dark:text-zinc-400">Quick Q&A</p>
                  </div>
                </Link>
                <Link
                  href="/ops/settings"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400">
                      Automation
                    </p>
                    <p className="text-sm text-stone-500 dark:text-zinc-400">Templates</p>
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
