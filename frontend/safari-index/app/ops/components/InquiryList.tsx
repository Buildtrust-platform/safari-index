'use client';

/**
 * InquiryList Component
 *
 * Left pane list container with keyboard navigation.
 * Supports j/k and arrow keys for navigation.
 */

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Inbox, RefreshCw } from 'lucide-react';
import type { InquiryRecord, InquiryStatus } from '../../../lib/contracts';
import { InquiryRow } from './InquiryRow';

interface InquiryListProps {
  inquiries: InquiryRecord[];
  selectedId: string | null;
  focusedIndex: number;
  loading?: boolean;
  onSelect: (inquiry: InquiryRecord) => void;
  onOpen: (inquiry: InquiryRecord) => void;
  onFocusChange: (index: number) => void;
  onRefresh?: () => void;
}

export function InquiryList({
  inquiries,
  selectedId,
  focusedIndex,
  loading = false,
  onSelect,
  onOpen,
  onFocusChange,
  onRefresh,
}: InquiryListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll focused item into view
  useEffect(() => {
    const row = rowRefs.current.get(focusedIndex);
    if (row) {
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // j or ArrowDown - Move down
      if ((e.key === 'j' || e.key === 'ArrowDown') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const newIndex = Math.min(focusedIndex + 1, inquiries.length - 1);
        onFocusChange(newIndex);
        if (inquiries[newIndex]) onSelect(inquiries[newIndex]);
        return;
      }

      // k or ArrowUp - Move up
      if ((e.key === 'k' || e.key === 'ArrowUp') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const newIndex = Math.max(focusedIndex - 1, 0);
        onFocusChange(newIndex);
        if (inquiries[newIndex]) onSelect(inquiries[newIndex]);
        return;
      }

      // Enter - Open detail
      if (e.key === 'Enter' && inquiries[focusedIndex]) {
        e.preventDefault();
        onOpen(inquiries[focusedIndex]);
        return;
      }

      // r - Refresh
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onRefresh?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, inquiries, onFocusChange, onSelect, onOpen, onRefresh]);

  // Empty state
  if (!loading && inquiries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-stone-400 dark:text-zinc-600">
        <div className="text-center">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No inquiries found</p>
          <p className="text-xs mt-1 opacity-75">Try changing filters</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="h-full overflow-y-auto">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center z-10">
          <RefreshCw className="w-6 h-6 text-stone-400 dark:text-zinc-500 animate-spin" />
        </div>
      )}

      {/* List */}
      <div role="listbox" aria-label="Inquiries list">
        {inquiries.map((inquiry, index) => (
          <InquiryRow
            key={inquiry.inquiry_id}
            ref={(el) => {
              if (el) rowRefs.current.set(index, el);
              else rowRefs.current.delete(index);
            }}
            inquiry={inquiry}
            isSelected={inquiry.inquiry_id === selectedId}
            isFocused={index === focusedIndex}
            onClick={() => {
              onFocusChange(index);
              onSelect(inquiry);
            }}
            onDoubleClick={() => onOpen(inquiry)}
          />
        ))}
      </div>
    </div>
  );
}

export default InquiryList;
