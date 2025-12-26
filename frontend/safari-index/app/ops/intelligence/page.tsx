/**
 * Ops Intelligence Dashboard Page
 *
 * Internal-only dashboard showing inquiry attribution analytics.
 * Identifies which surfaces, decisions, and trips drive inquiries.
 *
 * Protected by x-ops-key header check.
 *
 * Per governance:
 * - noindex, nofollow
 * - Read-only analytics
 * - No external tracking dependencies
 * - Simple, functional UI
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  TrendingUp,
  Map,
  Compass,
  ExternalLink,
  Eye,
  Globe,
  Tag,
} from 'lucide-react';
import type { IntelligenceSummary } from '../../../lib/db/inquiry-intelligence';

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
 * Format date for display
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Entry surface display names
 */
const SURFACE_LABELS: Record<string, string> = {
  homepage: 'Homepage',
  'decisions-hub': 'Decisions Hub',
  'decision-page': 'Decision Page',
  'trip-page': 'Trip Page',
  'guide-page': 'Guide Page',
  destinations: 'Destinations',
  activities: 'Activities',
  'when-to-go': 'When to Go',
  compare: 'Compare',
  direct: 'Direct',
  unknown: 'Unknown',
};

/**
 * Bar chart row component
 */
function BarRow({
  label,
  count,
  percentage,
  maxPercentage,
  href,
}: {
  label: string;
  count: number;
  percentage: number;
  maxPercentage: number;
  href?: string;
}) {
  const barWidth = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;
  const content = (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-stone-700 group-hover:text-amber-700 transition-colors truncate max-w-[60%]">
          {label}
        </span>
        <span className="text-sm text-stone-500">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:bg-stone-50 -mx-2 px-2 py-1 rounded transition-colors">
        {content}
      </Link>
    );
  }

  return <div className="py-1">{content}</div>;
}

/**
 * Section card component
 */
function SectionCard({
  title,
  icon: Icon,
  children,
  empty,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
        <Icon className="w-5 h-5 text-stone-400" />
        <h2 className="font-semibold text-stone-900">{title}</h2>
      </div>
      <div className="p-6">
        {empty ? (
          <p className="text-sm text-stone-400 text-center py-4">No data available</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export default function OpsIntelligencePage() {
  const [summary, setSummary] = useState<IntelligenceSummary | null>(null);
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

    fetchIntelligence(key);
  }, []);

  async function fetchIntelligence(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ops/intelligence?limit=200', {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        throw new Error('Failed to load intelligence data');
      }

      const data: IntelligenceSummary = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch intelligence:', err);
      setError('Failed to load intelligence data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    if (opsKey) {
      fetchIntelligence(opsKey);
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
              <div className="flex items-center gap-4">
                <Link
                  href={`/ops?ops_key=${opsKey}`}
                  className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-stone-600" />
                  <h1 className="text-xl font-semibold text-stone-900">Conversion Intelligence</h1>
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
              <div className="text-stone-500">Loading intelligence data...</div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && summary && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <p className="text-sm text-stone-500">Total Inquiries</p>
                  <p className="text-2xl font-semibold text-stone-900">{summary.total_inquiries}</p>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <p className="text-sm text-stone-500">Avg Pages Viewed</p>
                  <p className="text-2xl font-semibold text-stone-900">
                    {summary.avg_pages_viewed ?? '-'}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <p className="text-sm text-stone-500">Top Decisions</p>
                  <p className="text-2xl font-semibold text-stone-900">
                    {summary.top_decisions.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <p className="text-sm text-stone-500">Date Range</p>
                  <p className="text-sm font-medium text-stone-900">
                    {summary.date_range.earliest && summary.date_range.latest ? (
                      <>
                        {formatDate(summary.date_range.earliest)} -{' '}
                        {formatDate(summary.date_range.latest)}
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entry Surfaces */}
                <SectionCard
                  title="Entry Surfaces"
                  icon={Map}
                  empty={summary.entry_surfaces.length === 0}
                >
                  <p className="text-sm text-stone-500 mb-4">
                    Where users enter before submitting an inquiry
                  </p>
                  <div className="space-y-3">
                    {summary.entry_surfaces.map((surface) => (
                      <BarRow
                        key={surface.surface}
                        label={SURFACE_LABELS[surface.surface] || surface.surface}
                        count={surface.count}
                        percentage={surface.percentage}
                        maxPercentage={summary.entry_surfaces[0]?.percentage || 100}
                      />
                    ))}
                  </div>
                </SectionCard>

                {/* Top Decisions */}
                <SectionCard
                  title="Top Decisions by Inquiry"
                  icon={TrendingUp}
                  empty={summary.top_decisions.length === 0}
                >
                  <p className="text-sm text-stone-500 mb-4">
                    Decisions linked to the most inquiries
                  </p>
                  <div className="space-y-3">
                    {summary.top_decisions.map((decision) => (
                      <BarRow
                        key={decision.decision_id}
                        label={decision.decision_id}
                        count={decision.inquiry_count}
                        percentage={decision.percentage}
                        maxPercentage={summary.top_decisions[0]?.percentage || 100}
                        href={`/decisions/${decision.decision_id}`}
                      />
                    ))}
                  </div>
                </SectionCard>

                {/* Top Trips */}
                <SectionCard
                  title="Top Trips by Inquiry"
                  icon={Compass}
                  empty={summary.top_trips.length === 0}
                >
                  <p className="text-sm text-stone-500 mb-4">
                    Trips referenced in the most inquiries
                  </p>
                  <div className="space-y-3">
                    {summary.top_trips.map((trip) => (
                      <BarRow
                        key={trip.trip_id}
                        label={trip.trip_id}
                        count={trip.inquiry_count}
                        percentage={trip.percentage}
                        maxPercentage={summary.top_trips[0]?.percentage || 100}
                        href={`/trips/${trip.trip_id}`}
                      />
                    ))}
                  </div>
                </SectionCard>

                {/* UTM Sources */}
                <SectionCard
                  title="UTM Sources"
                  icon={Tag}
                  empty={summary.utm_sources.length === 0}
                >
                  <p className="text-sm text-stone-500 mb-4">
                    Campaign sources from UTM parameters
                  </p>
                  <div className="space-y-3">
                    {summary.utm_sources.map((utm, index) => (
                      <BarRow
                        key={utm.source}
                        label={utm.source}
                        count={utm.count}
                        percentage={Math.round(
                          (utm.count / summary.total_inquiries) * 100
                        )}
                        maxPercentage={
                          summary.utm_sources[0]
                            ? Math.round(
                                (summary.utm_sources[0].count / summary.total_inquiries) * 100
                              )
                            : 100
                        }
                      />
                    ))}
                  </div>
                </SectionCard>

                {/* External Referrers */}
                <SectionCard
                  title="External Referrers"
                  icon={Globe}
                  empty={summary.referrers.length === 0}
                >
                  <p className="text-sm text-stone-500 mb-4">
                    External sites that referred visitors
                  </p>
                  <div className="space-y-3">
                    {summary.referrers.map((ref) => (
                      <BarRow
                        key={ref.referrer}
                        label={ref.referrer}
                        count={ref.count}
                        percentage={Math.round(
                          (ref.count / summary.total_inquiries) * 100
                        )}
                        maxPercentage={
                          summary.referrers[0]
                            ? Math.round(
                                (summary.referrers[0].count / summary.total_inquiries) * 100
                              )
                            : 100
                        }
                      />
                    ))}
                  </div>
                </SectionCard>
              </div>

              {/* Interpretation Guide */}
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
                <h3 className="font-semibold text-stone-900 mb-3">Interpretation Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-600">
                  <div>
                    <p className="font-medium text-stone-700 mb-1">Entry Surfaces</p>
                    <p>
                      Shows where users first landed before submitting an inquiry. High-performing
                      entry surfaces are candidates for additional content investment.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-stone-700 mb-1">Top Decisions</p>
                    <p>
                      Decisions linked to the most inquiries indicate high commercial intent.
                      These are your "money decisions" worth prioritizing.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-stone-700 mb-1">Top Trips</p>
                    <p>
                      Trips most frequently selected by inquiring users. Use this to inform
                      inventory and trip shape development.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-stone-700 mb-1">Avg Pages Viewed</p>
                    <p>
                      Higher numbers suggest users need more information before converting.
                      Lower numbers suggest strong intent from entry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state when no inquiries */}
          {!loading && !error && summary && summary.total_inquiries === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
              <BarChart3 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No inquiry data available yet</p>
              <p className="text-sm text-stone-400 mt-1">
                Intelligence will populate as inquiries come in
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
