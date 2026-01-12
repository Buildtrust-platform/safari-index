/**
 * Ops Questions List Page
 *
 * Internal-only page for viewing and managing quick questions.
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
  MessageSquare,
  RefreshCw,
  ChevronRight,
  Clock,
  Mail,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
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
 * Get elapsed time since creation
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
 * Status badge component
 */
function StatusBadge({ status }: { status: QuickQuestionStatus }) {
  const colors: Record<QuickQuestionStatus, string> = {
    new: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800',
    closed: 'bg-stone-100 text-stone-600',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function OpsQuestionsPage() {
  const [questions, setQuestions] = useState<QuickQuestionRecord[]>([]);
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

    fetchQuestions(key);
  }, []);

  async function fetchQuestions(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ops/questions', {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Invalid access key or page not found.');
        } else {
          setError('Failed to load questions.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    if (opsKey) {
      fetchQuestions(opsKey);
    }
  };

  // Count by status
  const statusCounts = questions.reduce(
    (acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

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
                  className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-stone-600" />
                  <h1 className="text-xl font-semibold text-stone-900">Quick Questions</h1>
                  {!loading && (
                    <span className="text-sm text-stone-500">
                      ({questions.length} total)
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
              <div className="text-stone-500">Loading questions...</div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && questions.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No questions yet.</p>
            </div>
          )}

          {/* Status Summary */}
          {!loading && !error && questions.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {(['new', 'replied', 'closed'] as QuickQuestionStatus[]).map((status) => (
                <div
                  key={status}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-lg"
                >
                  <span className="text-sm text-stone-500 capitalize">{status}:</span>
                  <span className="ml-2 font-medium text-stone-900">
                    {statusCounts[status] || 0}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Questions List */}
          {!loading && !error && questions.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
              {questions.map((question) => {
                const elapsed = getElapsedTime(question.created_at);
                return (
                  <Link
                    key={question.question_id}
                    href={`/ops/questions/${question.question_id}?ops_key=${opsKey}`}
                    className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <StatusBadge status={question.status} />
                        <span className="flex items-center gap-1 text-sm text-stone-500">
                          <Mail className="w-4 h-4" />
                          {question.email}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs ${
                            elapsed.isUrgent ? 'text-red-600' : 'text-stone-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {elapsed.display}
                        </span>
                      </div>
                      <p className="text-stone-900 truncate">{question.question}</p>
                      {question.source_path && (
                        <p className="text-xs text-stone-400 mt-1">
                          Source: {question.source_path}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors flex-shrink-0 ml-4" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
