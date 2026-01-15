'use client';

/**
 * useKeyboard Hook
 *
 * Global keyboard shortcut handler for ops dashboard.
 * Handles navigation, actions, and command palette.
 */

import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardAction {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
  when?: () => boolean;
}

interface UseKeyboardOptions {
  actions: KeyboardAction[];
  enabled?: boolean;
}

export function useKeyboard({ actions, enabled = true }: UseKeyboardOptions) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger in input/textarea unless it's Escape
      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const action of actionsRef.current) {
        const keyMatch = event.key.toLowerCase() === action.key.toLowerCase();
        const ctrlMatch = !action.ctrl || event.ctrlKey;
        const metaMatch = !action.meta || event.metaKey;
        const shiftMatch = !action.shift || event.shiftKey;
        const conditionMatch = !action.when || action.when();

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && conditionMatch) {
          // Allow Escape in inputs, block others
          if (isInputFocused && action.key.toLowerCase() !== 'escape') {
            continue;
          }

          event.preventDefault();
          event.stopPropagation();
          action.action();
          return;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Common keyboard actions for reference
 */
export const KEYBOARD_HINTS = {
  navigate: { keys: ['↑', '↓'], description: 'Navigate' },
  navigateVim: { keys: ['j', 'k'], description: 'Navigate (vim)' },
  open: { keys: ['↵'], description: 'Open' },
  back: { keys: ['esc'], description: 'Back' },
  search: { keys: ['/', '⌘K'], description: 'Search' },
  email: { keys: ['e'], description: 'Email' },
  status: { keys: ['s'], description: 'Status' },
  note: { keys: ['n'], description: 'Note' },
  followup: { keys: ['f'], description: 'Follow-up' },
  generate: { keys: ['g'], description: 'Generate' },
  copy: { keys: ['c'], description: 'Copy' },
  send: { keys: ['⌘↵'], description: 'Send' },
};

export default useKeyboard;
