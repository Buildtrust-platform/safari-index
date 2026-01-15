'use client';

/**
 * CommandPalette Component
 *
 * ⌘K command palette for quick actions and navigation.
 * Built with cmdk for accessibility and keyboard support.
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Inbox,
  LayoutDashboard,
  BarChart3,
  Settings,
  Mail,
  MessageSquare,
  CheckCircle2,
  FileCheck,
  Send,
  Calendar,
  Copy,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recentInquiries?: Array<{
    inquiry_id: string;
    email: string;
    status: string;
  }>;
  currentInquiryId?: string;
  onAction?: (action: string, data?: unknown) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  recentInquiries = [],
  currentInquiryId,
  onAction,
}: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
      // ⌘K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <Command
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden"
              filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                return 0;
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-200 dark:border-zinc-800">
                <Search className="w-5 h-5 text-stone-400 dark:text-zinc-500" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search or type a command..."
                  className="flex-1 bg-transparent border-none outline-none text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500"
                />
                <kbd className="hidden sm:block px-2 py-1 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400 rounded">
                  esc
                </kbd>
              </div>

              <Command.List className="max-h-80 overflow-y-auto py-2">
                <Command.Empty className="py-6 text-center text-sm text-stone-500 dark:text-zinc-500">
                  No results found.
                </Command.Empty>

                {/* Recent Inquiries */}
                {recentInquiries.length > 0 && (
                  <Command.Group
                    heading={
                      <span className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide px-4">
                        Recent
                      </span>
                    }
                  >
                    {recentInquiries.slice(0, 3).map((inquiry) => (
                      <Command.Item
                        key={inquiry.inquiry_id}
                        value={`recent ${inquiry.email}`}
                        onSelect={() =>
                          runCommand(() => router.push(`/ops/inquiries/${inquiry.inquiry_id}`))
                        }
                        className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                      >
                        <Mail className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                        <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300 truncate">
                          {inquiry.email}
                        </span>
                        <span className="text-xs text-stone-400 dark:text-zinc-500 capitalize">
                          {inquiry.status}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Actions (only show when viewing an inquiry) */}
                {currentInquiryId && (
                  <Command.Group
                    heading={
                      <span className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide px-4">
                        Actions
                      </span>
                    }
                  >
                    <Command.Item
                      value="generate response"
                      onSelect={() => runCommand(() => onAction?.('generate'))}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <RefreshCw className="w-4 h-4 text-purple-500" />
                      <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                        Generate AI Response
                      </span>
                      <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                        G
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="change status"
                      onSelect={() => runCommand(() => onAction?.('status'))}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <ArrowRight className="w-4 h-4 text-amber-500" />
                      <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                        Change Status
                      </span>
                      <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                        S
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="schedule followup"
                      onSelect={() => runCommand(() => onAction?.('followup'))}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                        Schedule Follow-up
                      </span>
                      <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                        F
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="copy email"
                      onSelect={() => runCommand(() => onAction?.('copy'))}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <Copy className="w-4 h-4 text-stone-500" />
                      <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                        Copy Email Address
                      </span>
                      <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                        C
                      </kbd>
                    </Command.Item>
                    <Command.Item
                      value="send email"
                      onSelect={() => runCommand(() => onAction?.('send'))}
                      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <Send className="w-4 h-4 text-green-500" />
                      <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                        Send Email
                      </span>
                      <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                        E
                      </kbd>
                    </Command.Item>
                  </Command.Group>
                )}

                {/* Navigation */}
                <Command.Group
                  heading={
                    <span className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide px-4">
                      Navigation
                    </span>
                  }
                >
                  <Command.Item
                    value="go to dashboard"
                    onSelect={() => runCommand(() => router.push('/ops'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <LayoutDashboard className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Go to Dashboard
                    </span>
                  </Command.Item>
                  <Command.Item
                    value="go to inbox"
                    onSelect={() => runCommand(() => router.push('/ops/inbox'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <Inbox className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Go to Inbox
                    </span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                      I
                    </kbd>
                  </Command.Item>
                  <Command.Item
                    value="go to analytics"
                    onSelect={() => runCommand(() => router.push('/ops/intelligence'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <BarChart3 className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Go to Analytics
                    </span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                      A
                    </kbd>
                  </Command.Item>
                  <Command.Item
                    value="go to settings"
                    onSelect={() => runCommand(() => router.push('/ops/settings'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <Settings className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Go to Settings
                    </span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 rounded">
                      ,
                    </kbd>
                  </Command.Item>
                </Command.Group>

                {/* Filter by status */}
                <Command.Group
                  heading={
                    <span className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide px-4">
                      Filter by Status
                    </span>
                  }
                >
                  <Command.Item
                    value="filter new inquiries"
                    onSelect={() => runCommand(() => router.push('/ops/inbox?status=new'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Show New Inquiries
                    </span>
                  </Command.Item>
                  <Command.Item
                    value="filter contacted inquiries"
                    onSelect={() => runCommand(() => router.push('/ops/inbox?status=contacted'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Show Contacted
                    </span>
                  </Command.Item>
                  <Command.Item
                    value="filter quoted inquiries"
                    onSelect={() => runCommand(() => router.push('/ops/inbox?status=quoted'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <FileCheck className="w-4 h-4 text-amber-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Show Quoted
                    </span>
                  </Command.Item>
                  <Command.Item
                    value="filter won inquiries"
                    onSelect={() => runCommand(() => router.push('/ops/inbox?status=won'))}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="flex-1 text-sm text-stone-700 dark:text-zinc-300">
                      Show Won
                    </span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
