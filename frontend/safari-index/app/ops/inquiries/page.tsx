/**
 * Ops Inquiries List Page
 *
 * Internal-only page for viewing and managing inquiries.
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
  Inbox,
  RefreshCw,
  ChevronRight,
  Clock,
  Mail,
  Users,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import type { InquiryRecord, InquiryStatus } from '../../../lib/contracts';
import { BUDGET_BANDS } from '../../../lib/inquiry';

/**
 * Get OPS_KEY from client-side (passed via cookie or localStorage in real implementation)
 * For now, we use a prompt or URL param for testing
 */
function getOpsKey(): string | null {
  if (typeof window === 'undefined') return null;

  // Check URL param first (for testing)
  const urlParams = new URLSearchParams(window.location.search);
  const keyFromUrl = urlParams.get('ops_key');
  if (keyFromUrl) {
    localStorage.setItem('ops_key', keyFromUrl);
    return keyFromUrl;
  }

  // Check localStorage
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format budget band for display
 */
function formatBudgetBand(band: string): string {
  const found = BUDGET_BANDS.find((b) => b.value === band);
  return found?.label.replace(' per person', '') || band;
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: InquiryStatus }) {
  const colors: Record<InquiryStatus, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-stone-100 text-stone-600',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}

/**
 * Format date window
 */
function formatDateWindow(month: number | null, year: number | null): string {
  if (!month && !year) return '-';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (month && year) return `${months[month - 1]} ${year}`;
  if (year) return `${year}`;
  return month ? months[month - 1] : '-';
}

export default function OpsInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
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

    fetchInquiries(key);
  }, []);

  async function fetchInquiries(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ops/inquiries', {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Invalid access key or page not found.');
        } else {
          setError('Failed to load inquiries.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setError('Failed to load inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    if (opsKey) {
      fetchInquiries(opsKey);
    }
  };

  // Count by status
  const statusCounts = inquiries.reduce(
    (acc, inq) => {
      acc[inq.status] = (acc[inq.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

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
                <Inbox className="w-6 h-6 text-stone-600" />
                <h1 className="text-xl font-semibold text-stone-900">Inquiries</h1>
                {!loading && (
                  <span className="text-sm text-stone-500">
                    ({inquiries.length} total)
                  </span>
                )}
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
              <div className="text-stone-500">Loading inquiries...</div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && inquiries.length === 0 && (
            <div className="text-center py-20">
              <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No inquiries yet.</p>
            </div>
          )}

          {/* Status Summary */}
          {!loading && !error && inquiries.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {(['new', 'contacted', 'quoted', 'won', 'lost'] as InquiryStatus[]).map(
                (status) => (
                  <div
                    key={status}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-lg"
                  >
                    <span className="text-sm text-stone-500 capitalize">{status}:</span>
                    <span className="ml-2 font-medium text-stone-900">
                      {statusCounts[status] || 0}
                    </span>
                  </div>
                )
              )}
            </div>
          )}

          {/* Inquiries Table */}
          {!loading && !error && inquiries.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Trip
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Budget
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Travelers
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Date Window
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {inquiries.map((inquiry) => (
                      <tr
                        key={inquiry.inquiry_id}
                        className="hover:bg-stone-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Clock className="w-4 h-4 text-stone-400" />
                            {formatDate(inquiry.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={inquiry.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-stone-900">
                            {inquiry.trip_shape_id || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-stone-600">
                            <Wallet className="w-4 h-4 text-stone-400" />
                            {formatBudgetBand(inquiry.budget_band)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-stone-600">
                            <Users className="w-4 h-4 text-stone-400" />
                            {inquiry.traveler_count}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-stone-600">
                          {formatDateWindow(inquiry.travel_month, inquiry.travel_year)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-stone-600">
                            <Mail className="w-4 h-4 text-stone-400" />
                            {inquiry.email}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/ops/inquiries/${inquiry.inquiry_id}?ops_key=${opsKey}`}
                            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                          >
                            View
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
