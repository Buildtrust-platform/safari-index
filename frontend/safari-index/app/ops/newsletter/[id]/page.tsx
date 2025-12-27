/**
 * Ops Newsletter Subscriber Detail Page
 *
 * View and update individual subscriber.
 * Protected by OPS_KEY.
 *
 * Per governance:
 * - noindex, nofollow
 * - Simple, functional UI
 */

'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  ChevronLeft,
  Save,
  AlertCircle,
  Clock,
  Globe,
  Monitor,
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
function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OpsNewsletterDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [subscriber, setSubscriber] = useState<NewsletterSubscriberRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<NewsletterStatus>('subscribed');

  useEffect(() => {
    const key = getOpsKey();
    setOpsKey(key);

    if (!key) {
      setError('Access key required. Add ?ops_key=YOUR_KEY to the URL.');
      setLoading(false);
      return;
    }

    fetchSubscriber(key);
  }, [resolvedParams.id]);

  async function fetchSubscriber(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ops/newsletter/${resolvedParams.id}`, {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Subscriber not found');
        } else {
          throw new Error('Failed to load subscriber');
        }
        return;
      }

      const data = await response.json();
      setSubscriber(data.subscriber);
      setSelectedStatus(data.subscriber.status);
    } catch (err) {
      console.error('Failed to fetch subscriber:', err);
      setError('Failed to load subscriber. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!opsKey || !subscriber) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/ops/newsletter/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscriber');
      }

      const data = await response.json();
      setSubscriber(data.subscriber);
      setSuccess('Subscriber updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update subscriber:', err);
      setError('Failed to update subscriber. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = subscriber && selectedStatus !== subscriber.status;

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-100">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href={`/ops/newsletter?ops_key=${opsKey}`}
                  className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Subscribers
                </Link>
              </div>
              {hasChanges && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-stone-500">Loading subscriber...</div>
            </div>
          )}

          {/* Content */}
          {subscriber && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold text-stone-900">
                      {subscriber.email}
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                      Subscriber ID: {subscriber.subscriber_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Status</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Subscription Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as NewsletterStatus)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="subscribed">Subscribed</option>
                      <option value="unsubscribed">Unsubscribed</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <span className="font-medium">Source:</span>
                      <span className="capitalize">{subscriber.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Timeline</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <div>
                      <p className="text-sm text-stone-500">Subscribed</p>
                      <p className="text-sm font-medium text-stone-900">
                        {formatDateTime(subscriber.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <div>
                      <p className="text-sm text-stone-500">Last Updated</p>
                      <p className="text-sm font-medium text-stone-900">
                        {formatDateTime(subscriber.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Card */}
              {(subscriber.last_ip || subscriber.user_agent) && (
                <div className="bg-white rounded-xl border border-stone-200 p-6">
                  <h2 className="text-lg font-semibold text-stone-900 mb-4">Metadata</h2>
                  <div className="space-y-3">
                    {subscriber.last_ip && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-stone-400" />
                        <div>
                          <p className="text-sm text-stone-500">IP Address</p>
                          <p className="text-sm font-mono text-stone-900">
                            {subscriber.last_ip}
                          </p>
                        </div>
                      </div>
                    )}
                    {subscriber.user_agent && (
                      <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-stone-400" />
                        <div>
                          <p className="text-sm text-stone-500">User Agent</p>
                          <p className="text-sm text-stone-900 break-all">
                            {subscriber.user_agent}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
