'use client';

/**
 * Global Navbar Component
 *
 * Premium safari/travel navigation with scroll behavior.
 * Transparent on hero, solid on scroll.
 *
 * Structure:
 * - Left: Safari Index logo text
 * - Primary nav: Explore decisions, Compare, When to go, How it works
 * - Right: Decision Assurance (quiet link)
 *
 * Mobile: Collapses into simple menu
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '../../ui/utils';

interface NavbarProps {
  /** Whether navbar is over a hero image (transparent mode) */
  variant?: 'transparent' | 'solid';
}

const NAV_LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Activities', href: '/activities' },
  { label: 'Safaris', href: '/trips' },
  { label: 'Decisions', href: '/decisions' },
  { label: 'How it works', href: '/how-it-works' },
];

export function Navbar({ variant = 'transparent' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position for navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showSolid = variant === 'solid' || isScrolled;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        showSolid
          ? 'bg-white/95 backdrop-blur-sm border-b border-stone-200/80 shadow-sm'
          : 'bg-transparent'
      )}
      data-testid="navbar"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'font-editorial text-lg font-semibold tracking-tight transition-colors',
              showSolid ? 'text-stone-900' : 'text-white'
            )}
            data-testid="navbar-logo"
          >
            Safari Index
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  showSolid
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
                data-testid={`navbar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Plan a Safari CTA (desktop) */}
          <div className="hidden md:flex items-center">
            <Link
              href="/inquire"
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                showSolid
                  ? 'bg-stone-900 text-white hover:bg-stone-800'
                  : 'bg-white text-stone-900 hover:bg-stone-100'
              )}
              data-testid="navbar-plan-link"
            >
              Plan a Safari
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-md transition-colors',
              showSolid
                ? 'text-stone-600 hover:bg-stone-100'
                : 'text-white hover:bg-white/10'
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            data-testid="navbar-mobile-toggle"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-white border-t border-stone-200"
          data-testid="navbar-mobile-menu"
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-stone-100 pt-3 mt-3">
              <Link
                href="/inquire"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 bg-stone-900 text-white text-center rounded-md hover:bg-stone-800 transition-colors"
              >
                Plan a Safari
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
