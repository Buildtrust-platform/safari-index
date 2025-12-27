/**
 * Custom 404 Page
 *
 * User-friendly 404 page with navigation options.
 * Follows Safari Index design system.
 */

import Link from 'next/link';
import { Navbar, Footer } from './components/layout';
import { ArrowRight, Home, Search, Map, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center">
          {/* 404 indicator */}
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
            <Compass className="w-10 h-10 text-stone-400" />
          </div>

          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-900 mb-3">
            Page not found
          </h1>

          <p className="text-stone-600 mb-8">
            The page you're looking for doesn't exist or may have moved.
            Let's get you back on track.
          </p>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <Link
              href="/"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Home className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                  Homepage
                </p>
                <p className="text-xs text-stone-500">Start fresh</p>
              </div>
            </Link>

            <Link
              href="/decisions"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Search className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                  Decisions
                </p>
                <p className="text-xs text-stone-500">Browse questions</p>
              </div>
            </Link>

            <Link
              href="/destinations"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Map className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                  Destinations
                </p>
                <p className="text-xs text-stone-500">Explore Africa</p>
              </div>
            </Link>

            <Link
              href="/trips"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                  Trips
                </p>
                <p className="text-xs text-stone-500">Safari itineraries</p>
              </div>
            </Link>
          </div>

          {/* Contact option */}
          <p className="text-sm text-stone-500">
            Looking for something specific?{' '}
            <Link
              href="/contact"
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
