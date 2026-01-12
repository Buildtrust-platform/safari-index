/**
 * Ops Unified Inbox Page
 *
 * Internal-only page showing all incoming communications (inquiries + questions)
 * in a single unified view for efficient operator workflow.
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
  Inbox,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Clock,
  ChevronRight,
  Filter,
  Mail,
  Users,
} from 'lucide-react';
import type { InquiryRecord, InquiryStatus } from '../../../lib/contracts';
import type { QuickQuestionRecord, QuickQuestionStatus } from '../../../lib/contracts';

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
function getElapsedTime(createdAt: string): { display: string; isUrgent: boolean } {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let display: string;
  if (diffDays > 0) {
    display = `${diffDays}d ago`;
  } else if (diffHours > 0) {
    display = `${diffHours}h ago`;
  } else {
    display = 'Just now';
  }

  return {
    display,
    isUrgent: diffHours >= 24,
  };
}

/**
 * Unified inbox item type
 */
interface InboxItem {
  id: string;
  type: 'inquiry' | 'question';
  email: string;
  preview: string;
  status: string;
  created_at: string;
  isNew: boolean;
}

/**
 * Filter options
 */
type FilterType = 'all' | 'inquiry' | 'question';
type FilterStatus = 'all' | 'new' | 'in_progress';

export default function OpsInboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const key = getOpsKey();
    setOpsKey(key);

    if (!key) {
      setError('Access key required. Add ?ops_key=YOUR_KEY to the URL.');
      setLoading(false);
      return;
    }

    fetchInbox(key);
  }, []);

  async function fetchInbox(key: string) {
    setLoading(true);
    setError(null);

    try {
      // Fetch both inquiries and questions in parallel
      const [inquiriesRes, questionsRes] = await Promise.all([
        fetch('/api/ops/inquiries', { headers: { 'x-ops-key': key } }),
        fetch('/api/ops/questions', { headers: { 'x-ops-key': key } }),
      ]);

      if (!inquiriesRes.ok || !questionsRes.ok) {
        throw new Error('Failed to load inbox data');
      }

      const inquiriesData = await inquiriesRes.json();
      const questionsData = await questionsRes.json();

      const inquiries: InquiryRecord[] = inquiriesData.inquiries || [];
      const questions: QuickQuestionRecord[] = questionsData.questions || [];

      // Transform to unified format
      const inboxItems: InboxItem[] = [
        ...inquiries.map((inq): InboxItem => ({
          id: inq.inquiry_id,
          type: 'inquiry',
          email: inq.email,
          preview: inq.trip_shape_id
            ? `${inq.trip_shape_id} - ${inq.traveler_count} travelers`
            : `${inq.traveler_count} travelers`,
          status: inq.status,
          created_at: inq.created_at,
          isNew: inq.status === 'new',
        })),
        ...questions.map((q): InboxItem => ({
          id: q.question_id,
          type: 'question',
          email: q.email,
          preview: q.question.substring(0, 80) + (q.question.length > 80 ? '...' : ''),
          status: q.status,
          created_at: q.created_at,
          isNew: q.status === 'new',
        })),
      ];

      // Sort by created_at descending (newest first)
      inboxItems.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setItems(inboxItems);
    } catch (err) {
      console.error('Failed to fetch inbox:', err);
      setError('Failed to load inbox. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    if (opsKey) {
      fetchInbox(opsKey);
    }
  };

  // Apply filters
  const filteredItems = items.filter((item) => {
    // Type filter
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }

    // Status filter
    if (filterStatus === 'new' && !item.isNew) {
      return false;
    }
    if (filterStatus === 'in_progress' && item.isNew) {
      return false;
    }

    return true;
  });

  // Count stats
  const newCount = items.filter((i) => i.isNew).length;
  const inquiryCount = items.filter((i) => i.type === 'inquiry').length;
  const questionCount = items.filter((i) => i.type === 'question').length;

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
                  href={`/ops?ops_key=${opsKey}`}
                  className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <Inbox className="w-6 h-6 text-stone-600" />
                  <h1 className="text-xl font-semibold text-stone-900">Unified Inbox</h1>
                  {newCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      {newCount} new
                    </span>
                  )}
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-stone-500">Loading inbox...</div>
            </div>
          )}

          {/* Inbox Content */}
          {!loading && !error && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Filter className="w-4 h-4" />
                    <span>Filters:</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Type Filter */}
                    <div className="flex rounded-lg border border-stone-200 overflow-hidden">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1.5 text-sm transition-colors ${
                          filterType === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        All ({items.length})
                      </button>
                      <button
                        onClick={() => setFilterType('inquiry')}
                        className={`px-3 py-1.5 text-sm border-l border-stone-200 transition-colors ${
                          filterType === 'inquiry'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Inquiries ({inquiryCount})
                        </span>
                      </button>
                      <button
                        onClick={() => setFilterType('question')}
                        className={`px-3 py-1.5 text-sm border-l border-stone-200 transition-colors ${
                          filterType === 'question'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Questions ({questionCount})
                        </span>
                      </button>
                    </div>

                    {/* Status Filter */}
                    <div className="flex rounded-lg border border-stone-200 overflow-hidden">
                      <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 text-sm transition-colors ${
                          filterStatus === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterStatus('new')}
                        className={`px-3 py-1.5 text-sm border-l border-stone-200 transition-colors ${
                          filterStatus === 'new'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        New ({newCount})
                      </button>
                      <button
                        onClick={() => setFilterStatus('in_progress')}
                        className={`px-3 py-1.5 text-sm border-l border-stone-200 transition-colors ${
                          filterStatus === 'in_progress'
                            ? 'bg-stone-900 text-white'
                            : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        In Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {filteredItems.length > 0 ? (
                <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                  {filteredItems.map((item) => {
                    const elapsed = getElapsedTime(item.created_at);
                    const href =
                      item.type === 'inquiry'
                        ? `/ops/inquiries/${item.id}?ops_key=${opsKey}`
                        : `/ops/questions/${item.id}?ops_key=${opsKey}`;

                    return (
                      <Link
                        key={`${item.type}-${item.id}`}
                        href={href}
                        className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Type Icon */}
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              item.type === 'inquiry' ? 'bg-blue-50' : 'bg-purple-50'
                            }`}
                          >
                            {item.type === 'inquiry' ? (
                              <Mail className="w-5 h-5 text-blue-600" />
                            ) : (
                              <MessageSquare className="w-5 h-5 text-purple-600" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={`font-medium truncate group-hover:text-amber-700 transition-colors ${
                                  item.isNew ? 'text-stone-900' : 'text-stone-600'
                                }`}
                              >
                                {item.email}
                              </p>
                              {item.isNew && (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-stone-500 truncate">{item.preview}</p>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          <span
                            className={`text-xs flex items-center gap-1 ${
                              elapsed.isUrgent && item.isNew
                                ? 'text-red-600'
                                : 'text-stone-400'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {elapsed.display}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              item.type === 'inquiry'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {item.type === 'inquiry' ? 'Inquiry' : 'Question'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
                  <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">
                    {items.length === 0
                      ? 'No messages yet'
                      : 'No messages match your filters'}
                  </p>
                  {items.length > 0 && (
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setFilterStatus('all');
                      }}
                      className="mt-2 text-sm text-amber-600 hover:text-amber-700"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
