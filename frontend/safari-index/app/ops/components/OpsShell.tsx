'use client';

/**
 * OpsShell Component
 *
 * Professional sidebar layout with:
 * - Collapsible navigation
 * - Status counts
 * - Dark mode toggle
 * - Command palette trigger
 * - Weekly stats
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  LayoutDashboard,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Command,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  XCircle,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpsShellProps {
  children: React.ReactNode;
  counts?: {
    new: number;
    contacted: number;
    quoted: number;
    won: number;
    lost: number;
    total: number;
  };
  weeklyStats?: {
    inquiries: number;
    avgResponseTime: number | null;
  };
  onOpenPalette?: () => void;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { href: '/ops', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/ops/inbox', icon: Inbox, label: 'Inbox', countKey: 'total' as const },
];

const STATUS_ITEMS = [
  { href: '/ops/inbox?status=new', icon: Mail, label: 'New', countKey: 'new' as const, color: 'text-blue-500' },
  { href: '/ops/inbox?status=contacted', icon: MessageSquare, label: 'Contacted', countKey: 'contacted' as const, color: 'text-purple-500' },
  { href: '/ops/inbox?status=quoted', icon: FileCheck, label: 'Quoted', countKey: 'quoted' as const, color: 'text-amber-500' },
  { href: '/ops/inbox?status=won', icon: CheckCircle2, label: 'Won', countKey: 'won' as const, color: 'text-green-500' },
  { href: '/ops/inbox?status=lost', icon: XCircle, label: 'Lost', countKey: 'lost' as const, color: 'text-red-500' },
];

const FOOTER_ITEMS = [
  { href: '/ops/intelligence', icon: BarChart3, label: 'Analytics' },
  { href: '/ops/settings', icon: Settings, label: 'Settings' },
];

export function OpsShell({
  children,
  counts,
  weeklyStats,
  onOpenPalette,
  onLogout,
}: OpsShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const stored = localStorage.getItem('ops_dark_mode');
    if (stored === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('ops_dark_mode', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-zinc-950' : 'bg-stone-100'}`}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 h-full z-40 flex flex-col border-r ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-white border-stone-200'
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-inherit">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-amber-500' : 'bg-stone-900'
                }`}>
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                  Ops
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-md transition-colors ${
              darkMode
                ? 'hover:bg-zinc-800 text-zinc-400'
                : 'hover:bg-stone-100 text-stone-400'
            }`}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {/* Primary items */}
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const count = item.countKey && counts ? counts[item.countKey] : undefined;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                    isActive(item.href, item.exact)
                      ? darkMode
                        ? 'bg-zinc-800 text-white'
                        : 'bg-stone-100 text-stone-900'
                      : darkMode
                        ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {count !== undefined && count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Status items */}
          {!collapsed && counts && (
            <div className="mt-4 pt-4 border-t border-inherit">
              <p className={`px-3 mb-2 text-xs font-medium uppercase tracking-wide ${
                darkMode ? 'text-zinc-500' : 'text-stone-400'
              }`}>
                Pipeline
              </p>
              <div className="space-y-1">
                {STATUS_ITEMS.map((item) => {
                  const count = counts[item.countKey];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                        darkMode
                          ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="flex-1 text-sm">{item.label}</span>
                      <span className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer items */}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-zinc-800' : 'border-stone-200'}`}>
            {FOOTER_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? darkMode
                      ? 'bg-zinc-800 text-white'
                      : 'bg-stone-100 text-stone-900'
                    : darkMode
                      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom stats & actions */}
        <div className={`border-t ${darkMode ? 'border-zinc-800' : 'border-stone-200'} p-3`}>
          {!collapsed && weeklyStats && (
            <div className={`mb-3 px-2 py-2 rounded-lg ${darkMode ? 'bg-zinc-800' : 'bg-stone-50'}`}>
              <p className={`text-xs font-medium ${darkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
                This week
              </p>
              <p className={`text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                {weeklyStats.inquiries} inquiries
              </p>
              {weeklyStats.avgResponseTime !== null && (
                <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                  {weeklyStats.avgResponseTime.toFixed(1)}h avg response
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Command palette trigger */}
            <button
              onClick={onOpenPalette}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                darkMode
                  ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              <Command className="w-4 h-4" />
              {!collapsed && <span>⌘K</span>}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-zinc-500 hover:bg-zinc-800 hover:text-red-400'
                    : 'text-stone-400 hover:bg-stone-100 hover:text-red-500'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main content area */}
      <main
        className={`flex-1 transition-all duration-200 ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default OpsShell;
