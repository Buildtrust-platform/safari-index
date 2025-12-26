/**
 * Shared Footer Component
 *
 * Consistent footer across all Safari Index pages.
 * Documentary, operator-grade tone. No promotional language.
 */

import Link from 'next/link';

interface FooterProps {
  /** Tagline variant */
  variant?: 'operator' | 'decision-system';
}

export function Footer({ variant = 'operator' }: FooterProps) {
  const tagline = variant === 'operator'
    ? 'Private Safari Operator'
    : 'Pan-African Decision System';

  return (
    <footer className="bg-stone-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-editorial text-xl font-semibold">Safari Index</span>
            <p className="text-stone-400 text-sm mt-2 max-w-sm">
              {variant === 'operator'
                ? 'Private safari operator specializing in East and Southern Africa. Logic-backed decisions. Custom-built itineraries.'
                : 'Decision support for safari planning across East and Southern Africa. Clear verdicts. Visible trade-offs.'
              }
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-medium text-stone-300 mb-3">Explore</h4>
            <div className="space-y-2">
              <Link href="/trips" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Safaris
              </Link>
              <Link href="/destinations" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Destinations
              </Link>
              <Link href="/activities" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Activities
              </Link>
              <Link href="/when-to-go" className="block text-sm text-stone-400 hover:text-white transition-colors">
                When to Go
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-medium text-stone-300 mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="/decisions" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Decisions
              </Link>
              <Link href="/guides" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/how-it-works" className="block text-sm text-stone-400 hover:text-white transition-colors">
                How it works
              </Link>
              <Link href="/inquire" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Plan a Safari
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-stone-500 text-sm">
            Safari Index · {tagline}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/compare" className="text-sm text-stone-400 hover:text-white transition-colors">
              Compare
            </Link>
            <Link href="/explore" className="text-sm text-stone-400 hover:text-white transition-colors">
              Explore
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
