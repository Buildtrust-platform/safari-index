'use client';

/**
 * StatusPill Component
 *
 * Color-coded status indicator with optional dropdown.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import type { InquiryStatus } from '../../../lib/contracts';

const STATUS_CONFIG: Record<InquiryStatus, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: 'New', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  contacted: { label: 'Contacted', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  quoted: { label: 'Quoted', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  won: { label: 'Won', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  lost: { label: 'Lost', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
};

interface StatusPillProps {
  status: InquiryStatus;
  onChange?: (status: InquiryStatus) => void;
  editable?: boolean;
  size?: 'sm' | 'md';
}

export function StatusPill({ status, onChange, editable = false, size = 'md' }: StatusPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const config = STATUS_CONFIG[status];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-2.5 py-1 text-sm';

  if (!editable) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-full font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-full font-medium ${config.bg} ${config.text} hover:opacity-80 transition-opacity`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 right-0 w-40 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-stone-200 dark:border-zinc-800 py-1 z-50"
          >
            {(Object.keys(STATUS_CONFIG) as InquiryStatus[]).map((s) => {
              const conf = STATUS_CONFIG[s];
              const isSelected = s === status;
              return (
                <button
                  key={s}
                  onClick={() => {
                    onChange?.(s);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                  <span className={`flex-1 text-sm ${isSelected ? 'font-medium' : ''} text-stone-700 dark:text-zinc-300`}>
                    {conf.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-stone-400 dark:text-zinc-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StatusPill;
