'use client';

/**
 * Ops Dashboard Layout
 *
 * Professional-grade ops shell with:
 * - Sidebar navigation with pipeline counts
 * - Command palette (⌘K)
 * - Dark mode support
 * - Keyboard shortcuts
 *
 * Protected by x-ops-key header validation.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { OpsShell } from './components/OpsShell';
import { CommandPalette } from './components/CommandPalette';
import { useOpsKey } from './components/hooks/useOpsKey';
import { AlertCircle, Lock } from 'lucide-react';

interface DashboardCounts {
  new: number;
  contacted: number;
  quoted: number;
  won: number;
  lost: number;
  total: number;
}

interface WeeklyStats {
  inquiries: number;
  avgResponseTime: number | null;
}

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { opsKey, isLoading, isAuthenticated, logout, getAuthHeaders } = useOpsKey();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Array<{
    inquiry_id: string;
    email: string;
    status: string;
  }>>([]);

  // Fetch dashboard stats for sidebar
  const fetchStats = useCallback(async () => {
    if (!opsKey) return;

    try {
      const response = await fetch('/api/ops/dashboard', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setCounts({
          new: data.pipeline?.new ?? 0,
          contacted: data.pipeline?.contacted ?? 0,
          quoted: data.pipeline?.quoted ?? 0,
          won: data.pipeline?.won ?? 0,
          lost: data.pipeline?.lost ?? 0,
          total: data.pipeline?.total ?? 0,
        });
        setWeeklyStats({
          inquiries: data.thisWeek?.newInquiries ?? 0,
          avgResponseTime: data.thisWeek?.avgResponseTimeHours ?? null,
        });
        setRecentInquiries(
          data.recentInquiries?.slice(0, 5).map((i: { inquiry_id: string; email: string; status?: string }) => ({
            inquiry_id: i.inquiry_id,
            email: i.email,
            status: i.status || 'new',
          })) ?? []
        );
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  }, [opsKey, getAuthHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      // Refresh stats every 30 seconds
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchStats]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger in inputs
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // ⌘K or Ctrl+K - Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }

      // / - Also opens palette
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }

      // i - Go to Inbox
      if (e.key === 'i' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push('/ops/inbox');
        return;
      }

      // a - Go to Analytics
      if (e.key === 'a' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push('/ops/intelligence');
        return;
      }

      // , - Go to Settings
      if (e.key === ',' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push('/ops/settings');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-stone-500 dark:text-zinc-500">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          </div>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-white mb-2">
            Access Required
          </h1>
          <p className="text-stone-600 dark:text-zinc-400 mb-4">
            Add your ops key to the URL to access the dashboard.
          </p>
          <div className="bg-stone-50 dark:bg-zinc-800 rounded-lg p-3 text-left">
            <code className="text-sm text-stone-700 dark:text-zinc-300 break-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}/ops?ops_key=YOUR_KEY
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <OpsShell
        counts={counts ?? undefined}
        weeklyStats={weeklyStats ?? undefined}
        onOpenPalette={() => setPaletteOpen(true)}
        onLogout={logout}
      >
        {children}
      </OpsShell>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        recentInquiries={recentInquiries}
      />
    </>
  );
}
