'use client';

/**
 * KeyboardHint Component
 *
 * Bottom bar showing available keyboard shortcuts.
 * Contextual based on current view.
 */

import { motion } from 'framer-motion';

interface Shortcut {
  keys: string[];
  label: string;
}

interface KeyboardHintProps {
  shortcuts: Shortcut[];
  className?: string;
}

export function KeyboardHint({ shortcuts, className = '' }: KeyboardHintProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-2">
        <div className="flex items-center gap-6 overflow-x-auto">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIdx) => (
                  <kbd
                    key={keyIdx}
                    className="px-1.5 py-0.5 text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400 rounded border border-stone-200 dark:border-zinc-700"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-xs text-stone-500 dark:text-zinc-500">
                {shortcut.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default KeyboardHint;
