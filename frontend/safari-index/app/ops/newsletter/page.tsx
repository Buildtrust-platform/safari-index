/**
 * Ops Newsletter Dashboard
 *
 * Lists newsletter subscribers with counts and status.
 * Protected by OPS_KEY.
 *
 * Per governance:
 * - noindex, nofollow
 * - Simple, functional UI
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Users,
  UserMinus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import type { NewsletterSubscriberRecord, NewsletterStatus } from '@/lib/contracts';

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
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: NewsletterStatus }) {
  const styles = {
    subscribed: 'bg-green-100 text-green-700',
    unsubscribed: 'bg-stone-100 text-stone-600',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
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
        highlight ? 'bg-green-50 border-green-200' : 'bg-white border-stone-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{label}</p>
          <p className={`text-2xl font-semibold ${highlight ? 'text-green-700' : 'text-stone-900'}`}>
            {value}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${highlight ? 'text-green-400' : 'text-stone-300'}`} />
      </div>
    </div>
  );
}

interface ApiResponse {
  counts: {
    subscribed: number;
    unsubscribed: number;
    total: number;
  };
  subscribers: NewsletterSubscriberRecord[];
  nextCursor?: string;
}

export default function OpsNewsletterPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<NewsletterStatus | 'all'>('all');

  useEffect(() => {
    const key = getOpsKey();
    setOpsKey(key);

    if (!key) {
      setError('Access key required. Add ?ops_key=YOUR_KEY to the URL.');
      setLoading(false);
      return;
    }

    fetchData(key);
  }, []);

  useEffect(() => {
    if (opsKey) {
      fetchData(opsKey);
    }
  }, [statusFilter]);

  async function fetchData(key: string) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/ops/newsletter?${params.toString()}`, {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        throw new Error('Failed to load data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch newsletter data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    if (opsKey) {
      fetchData(opsKey);
    }
  };

  return (
    <>
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
                  className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Ops
                </Link>
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-stone-600" />
                  <h1 className="text-xl font-semibold text-stone-900">Newsletter Subscribers</h1>
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
          {loading && !data && (
            <div className="flex items-center justify-center py-20">
              <div className="text-stone-500">Loading subscribers...</div>
            </div>
          )}

          {/* Content */}
          {data && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Subscribed"
                  value={data.counts.subscribed}
                  icon={Users}
                  highlight={data.counts.subscribed > 0}
                />
                <StatCard
                  label="Unsubscribed"
                  value={data.counts.unsubscribed}
                  icon={UserMinus}
                />
                <StatCard
                  label="Total"
                  value={data.counts.total}
                  icon={Mail}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as NewsletterStatus | 'all')}
                  className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg bg-white"
                >
                  <option value="all">All</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              {/* Subscribers Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Subscribed
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {data.subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-stone-500">
                          No subscribers found
                        </td>
                      </tr>
                    ) : (
                      data.subscribers.map((subscriber) => (
                        <tr
                          key={subscriber.subscriber_id}
                          className="hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm text-stone-900">{subscriber.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={subscriber.status} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-stone-500">{subscriber.source}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-stone-500">
                              {formatDate(subscriber.created_at)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              href={`/ops/newsletter/${subscriber.subscriber_id}?ops_key=${opsKey}`}
                              className="text-sm text-amber-600 hover:text-amber-700"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination hint */}
              {data.nextCursor && (
                <div className="text-center text-sm text-stone-500">
                  More subscribers available. Implement pagination for full list.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
