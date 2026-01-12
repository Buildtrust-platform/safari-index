/**
 * Ops Question Detail Page
 *
 * Internal-only page for viewing and replying to a quick question.
 * Protected by x-ops-key header check.
 *
 * Per governance:
 * - noindex, nofollow
 * - Simple, functional UI
 * - No marketing or sales framing
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Mail,
  Save,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-react';
import type { QuickQuestionRecord, QuickQuestionStatus } from '../../../../lib/contracts';

/**
 * Get OPS_KEY from URL or localStorage
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
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
 * Status options
 */
const STATUS_OPTIONS: { value: QuickQuestionStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'replied', label: 'Replied' },
  { value: 'closed', label: 'Closed' },
];

export default function OpsQuestionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const questionId = params.id as string;

  const [question, setQuestion] = useState<QuickQuestionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);

  // Editable fields
  const [status, setStatus] = useState<QuickQuestionStatus>('new');
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const key = getOpsKey() || searchParams.get('ops_key');
    setOpsKey(key);

    if (!key) {
      setError('Access key required.');
      setLoading(false);
      return;
    }

    fetchQuestion(key);
  }, [questionId, searchParams]);

  async function fetchQuestion(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ops/questions/${questionId}`, {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Question not found or access denied.');
        } else {
          setError('Failed to load question.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setQuestion(data);
      setStatus(data.status);
      setReply(data.reply || '');
    } catch (err) {
      console.error('Failed to fetch question:', err);
      setError('Failed to load question.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!opsKey || !question) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/ops/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({ status, reply: reply || undefined }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const updated = await response.json();
      setQuestion(updated);
      setSaveMessage('Saved');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function handleCopyId() {
    if (question) {
      navigator.clipboard.writeText(question.question_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  }

  function handleCopyEmail() {
    if (question) {
      navigator.clipboard.writeText(question.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  }

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-100">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/ops/questions?ops_key=${opsKey}`}
                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </Link>
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
              <div className="text-stone-500">Loading question...</div>
            </div>
          )}

          {/* Question Content */}
          {!loading && !error && question && (
            <div className="space-y-6">
              {/* ID and Status Header */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                      Question ID
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-lg text-stone-900">
                        {question.question_id}
                      </code>
                      <button
                        onClick={handleCopyId}
                        className="p-1 text-stone-400 hover:text-stone-600"
                        title="Copy ID"
                      >
                        {copiedId ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(question.created_at)}
                    </p>
                    {/* Elapsed time badge with urgency highlighting */}
                    {(() => {
                      const elapsed = getElapsedTime(question.created_at);
                      return (
                        <span
                          className={`inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs rounded-full ${
                            elapsed.isUrgent
                              ? 'bg-red-100 text-red-700'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {elapsed.display}
                          {elapsed.isUrgent && ' - needs attention'}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as QuickQuestionStatus)}
                        className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : saveMessage || 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Contact
                </h2>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400" />
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${question.email}`}
                      className="text-stone-900 hover:text-amber-700"
                    >
                      {question.email}
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 text-stone-400 hover:text-stone-600"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-stone-400" />
                  Question
                </h2>
                <div className="p-4 bg-stone-50 rounded-lg">
                  <p className="text-stone-700 whitespace-pre-wrap">{question.question}</p>
                </div>
              </div>

              {/* Reply Section */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-stone-400" />
                  Reply
                </h2>

                {question.replied_at && (
                  <p className="text-xs text-stone-500 mb-3">
                    Replied on {formatDate(question.replied_at)}
                  </p>
                )}

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Enter your reply here... (This is for tracking purposes, you'll need to send the actual email separately)"
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />

                <p className="text-xs text-stone-500 mt-2">
                  Note: This reply is stored for tracking. Use{' '}
                  <a
                    href={`mailto:${question.email}`}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    email
                  </a>{' '}
                  to send the actual response.
                </p>
              </div>

              {/* Source */}
              {question.source_path && (
                <div className="text-sm text-stone-500">
                  Source: {question.source_path}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
