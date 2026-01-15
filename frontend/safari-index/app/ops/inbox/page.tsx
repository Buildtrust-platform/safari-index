'use client';

/**
 * Ops Inbox Page
 *
 * Professional split-pane inbox with keyboard navigation.
 * Left: scrollable inquiry list with j/k nav
 * Right: inquiry preview with quick actions
 *
 * Keyboard shortcuts:
 * - j/k or ↑↓: Navigate list
 * - Enter: Open full detail
 * - G: Generate AI response
 * - S: Change status
 * - C: Copy email
 * - R: Refresh
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Inbox,
  RefreshCw,
  Filter,
  SortDesc,
  ChevronDown,
} from 'lucide-react';
import type { InquiryRecord, InquiryStatus } from '../../../lib/contracts';
import { useOpsKey } from '../components/hooks/useOpsKey';
import { useInquiries, useInquiryDetail } from '../components/hooks/useInquiries';
import { InquiryList } from '../components/InquiryList';
import { InquiryPreview } from '../components/InquiryPreview';
import { KeyboardHint } from '../components/KeyboardHint';

type SortOption = 'newest' | 'oldest' | 'urgent';

const FILTER_OPTIONS: { value: InquiryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export default function OpsInboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { opsKey, isAuthenticated, isLoading: authLoading } = useOpsKey();

  // Filter from URL
  const statusParam = searchParams.get('status') as InquiryStatus | null;
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>(statusParam || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Data
  const { inquiries, loading, error, refresh, updateStatus } = useInquiries({
    opsKey,
    status: statusFilter,
  });

  // Selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Detail for preview
  const { inquiry: selectedInquiry, matches, loading: detailLoading } = useInquiryDetail(
    selectedId,
    opsKey
  );

  // Sort inquiries
  const sortedInquiries = [...inquiries].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    // Urgent: new status first, then by oldest
    if (sortBy === 'urgent') {
      if (a.status === 'new' && b.status !== 'new') return -1;
      if (b.status === 'new' && a.status !== 'new') return 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  // Auto-select first item when list loads
  useEffect(() => {
    if (sortedInquiries.length > 0 && !selectedId) {
      setSelectedId(sortedInquiries[0].inquiry_id);
    }
  }, [sortedInquiries, selectedId]);

  // Update URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    const newUrl = params.toString() ? `/ops/inbox?${params}` : '/ops/inbox';
    router.replace(newUrl, { scroll: false });
  }, [statusFilter, router]);

  // Handlers
  const handleSelect = useCallback((inquiry: InquiryRecord) => {
    setSelectedId(inquiry.inquiry_id);
  }, []);

  const handleOpen = useCallback(
    (inquiry: InquiryRecord) => {
      router.push(`/ops/inquiries/${inquiry.inquiry_id}`);
    },
    [router]
  );

  const handleStatusChange = useCallback(
    async (newStatus: InquiryStatus) => {
      if (selectedId) {
        await updateStatus(selectedId, newStatus);
      }
    },
    [selectedId, updateStatus]
  );

  const handleGenerateResponse = useCallback(() => {
    if (selectedId) {
      router.push(`/ops/inquiries/${selectedId}?action=generate`);
    }
  }, [selectedId, router]);

  const handleCopyEmail = useCallback(async () => {
    if (selectedInquiry?.email) {
      await navigator.clipboard.writeText(selectedInquiry.email);
    }
  }, [selectedInquiry]);

  // Global keyboard shortcuts for this page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // G - Generate response
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleGenerateResponse();
        return;
      }

      // C - Copy email
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleCopyEmail();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerateResponse, handleCopyEmail]);

  // Loading states handled by layout
  if (authLoading) return null;
  if (!isAuthenticated) return null;

  const newCount = sortedInquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Inbox className="w-5 h-5 text-stone-500 dark:text-zinc-400" />
            <h1 className="text-lg font-semibold text-stone-900 dark:text-white">
              Inbox
            </h1>
            {newCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                {newCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {FILTER_OPTIONS.find((f) => f.value === statusFilter)?.label || 'All'}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilters && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilters(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-1 right-0 w-40 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-stone-200 dark:border-zinc-800 py-1 z-20"
                  >
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setShowFilters(false);
                        }}
                        className={`w-full px-3 py-1.5 text-sm text-left hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors ${
                          statusFilter === option.value
                            ? 'text-amber-600 dark:text-amber-500 font-medium'
                            : 'text-stone-700 dark:text-zinc-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 text-sm text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 rounded-lg border-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="urgent">Urgent First</option>
            </select>

            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 text-stone-500 dark:text-zinc-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh (R)"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Split pane */}
      <div className="flex-1 flex min-h-0">
        {/* Left: List */}
        <div className="w-[400px] flex-shrink-0 border-r border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 relative">
          <InquiryList
            inquiries={sortedInquiries}
            selectedId={selectedId}
            focusedIndex={focusedIndex}
            loading={loading}
            onSelect={handleSelect}
            onOpen={handleOpen}
            onFocusChange={setFocusedIndex}
            onRefresh={refresh}
          />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-white dark:bg-zinc-900">
          <InquiryPreview
            inquiry={selectedInquiry}
            matches={matches}
            loading={detailLoading}
            onStatusChange={handleStatusChange}
            onGenerateResponse={handleGenerateResponse}
            onOpenDetail={() => selectedId && handleOpen(selectedInquiry!)}
          />
        </div>
      </div>

      {/* Keyboard hints */}
      <KeyboardHint
        shortcuts={[
          { keys: ['↑', '↓'], label: 'Navigate' },
          { keys: ['⏎'], label: 'Open' },
          { keys: ['G'], label: 'Generate' },
          { keys: ['S'], label: 'Status' },
          { keys: ['C'], label: 'Copy' },
          { keys: ['R'], label: 'Refresh' },
        ]}
      />
    </div>
  );
}
