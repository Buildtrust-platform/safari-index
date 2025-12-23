'use client';

/**
 * Safari Index Arrival Page
 *
 * Clean decision tool aesthetic - minimal, functional, content-focused.
 * Photography and typography do the heavy lifting.
 *
 * Structure:
 * 1. ARRIVAL - Full viewport hero with photography
 * 2. THE PROMISE - What Safari Index does (simple text)
 * 3. ENTRY POINTS - Start here (clean cards)
 * 4. BOUNDARIES - What we won't do (trust section)
 */

import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, Scale, RefreshCw, Compass, GitCompare, Sliders, ShieldX, Sparkles, AlertCircle, CloudOff } from 'lucide-react';
import { ImageBand, ImageBandContent, pageImages } from './components/visual';
import { PageGrid } from './components/layout';

/**
 * Scroll Indicator
 */
function ScrollIndicator() {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-white/60" />
      <ChevronDown
        className="w-5 h-5 text-white/60 animate-bounce-subtle"
        strokeWidth={1.5}
      />
    </div>
  );
}

/**
 * Button - Clean, solid colors
 */
function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Link
      href={href}
      className={`
        group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium
        rounded-md transition-colors duration-200
        ${variant === 'primary'
          ? 'bg-white text-neutral-900 hover:bg-neutral-100'
          : 'bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/60'
        }
      `}
    >
      {children}
      {variant === 'primary' && (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

/**
 * Entry Card - Warm safari styling with icons
 */
function EntryCard({
  title,
  description,
  href,
  icon: Icon,
  primary = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group block rounded-xl transition-all duration-200
        ${primary
          ? 'bg-stone-900 text-white'
          : 'bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md'
        }
      `}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
            ${primary
              ? 'bg-amber-500/20'
              : 'bg-amber-100 group-hover:bg-amber-200'
            }
          `}>
            <Icon className={`w-6 h-6 ${primary ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            {primary && (
              <span className="inline-block px-2 py-0.5 mb-2 text-xs font-medium bg-amber-500/20 rounded text-amber-300">
                Recommended
              </span>
            )}
            <h3 className={`font-editorial text-lg font-semibold mb-2 ${primary ? 'text-white' : 'text-stone-900'}`}>
              {title}
            </h3>
            <p className={`font-editorial text-sm leading-relaxed ${primary ? 'text-stone-400' : 'text-stone-600'}`}>
              {description}
            </p>
          </div>
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${primary
              ? 'bg-white/10 group-hover:bg-white/20'
              : 'bg-stone-100 group-hover:bg-amber-100'
            }
          `}>
            <ArrowRight className={`w-4 h-4 ${primary ? 'text-white' : 'text-stone-500 group-hover:text-amber-600'}`} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Arrival Page
 */
export default function Home() {
  return (
    <>
      {/* ================================================================
          SECTION 1 — ARRIVAL
          Full viewport, photography-first. Let the image speak.
          ================================================================ */}
      <ImageBand
        image={pageImages.home}
        height="arrival"
        overlay="cinematic"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="wide" className="flex flex-col justify-end min-h-screen pb-28 md:pb-36">
          {/* Identity badge - glass effect kept */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 w-fit animate-fade-in-up">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="font-ui text-xs font-medium text-white/90 uppercase tracking-wider">
              Safari Index
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-5 max-w-3xl animate-fade-in-up animation-delay-100">
            Your safari decision,
            <br />
            treated seriously.
          </h1>

          {/* Subhead */}
          <p className="font-editorial text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl animate-fade-in-up animation-delay-200">
            Clear verdicts, real trade-offs, and honest refusals when we can't help.
          </p>

          {/* CTAs - solid buttons */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-300">
            <Button href="/explore" variant="primary">
              Start exploring
            </Button>
            <Button href="/how-it-works" variant="secondary">
              How it works
            </Button>
          </div>
        </ImageBandContent>

        <ScrollIndicator />
      </ImageBand>

      {/* ================================================================
          SECTION 2 — THE PROMISE
          Warm safari aesthetic with icons.
          ================================================================ */}
      <div className="bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100 py-20 md:py-28">
        <PageGrid maxWidth="narrow">
          <div className="text-center mb-12">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              Decisions, not suggestions
            </h2>
            <p className="font-editorial text-stone-600 max-w-lg mx-auto">
              We don't give you inspiration. We give you verdicts you can act on.
            </p>
          </div>

          {/* Feature cards with icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-stone-900 mb-2">
                Clear Verdicts
              </h3>
              <p className="font-editorial text-sm text-stone-600 leading-relaxed">
                Book, wait, switch, or discard. Every question gets a direct answer.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-stone-900 mb-2">
                Real Trade-offs
              </h3>
              <p className="font-editorial text-sm text-stone-600 leading-relaxed">
                See what you gain and what you lose. No hidden downsides.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-stone-900 mb-2">
                Change Conditions
              </h3>
              <p className="font-editorial text-sm text-stone-600 leading-relaxed">
                Know exactly what would flip our recommendation.
              </p>
            </div>
          </div>
        </PageGrid>
      </div>

      {/* ================================================================
          SECTION 3 — ENTRY POINTS
          Warm cards with icons
          ================================================================ */}
      <div className="bg-white py-20 md:py-28">
        <PageGrid maxWidth="default">
          <div className="text-center mb-10">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-3">
              Choose your path
            </h2>
            <p className="font-editorial text-stone-600">
              Three ways to find the answers you need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EntryCard
              title="Explore Decisions"
              description="Browse safari planning questions by region, travel style, or topic."
              href="/explore"
              icon={Compass}
              primary
            />
            <EntryCard
              title="Compare Options"
              description="View two decisions side by side to understand the trade-offs."
              href="/compare"
              icon={GitCompare}
            />
            <EntryCard
              title="Test Variants"
              description="See how recommendations change when your constraints change."
              href="/explore"
              icon={Sliders}
            />
          </div>
        </PageGrid>
      </div>

      {/* ================================================================
          SECTION 4 — BOUNDARIES
          What we won't do. Warm dark stone with amber accents.
          ================================================================ */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-20 md:py-28">
        <PageGrid maxWidth="narrow">
          <div className="text-center mb-10">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold mb-3">
              What we won't do
            </h2>
            <p className="font-editorial text-stone-400">
              Trust comes from transparency about our limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldX className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-editorial font-semibold mb-1.5">We don't sell tours</h3>
                  <p className="text-sm text-stone-400">No commissions, no rankings, no sponsored placements.</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-editorial font-semibold mb-1.5">We don't fake inspiration</h3>
                  <p className="text-sm text-stone-400">No listicles, no "top 10" fluff, no aspirational content.</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-editorial font-semibold mb-1.5">We refuse when we should</h3>
                  <p className="text-sm text-stone-400">Missing inputs? Outside our scope? We'll say so clearly.</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <CloudOff className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-editorial font-semibold mb-1.5">We don't guarantee outcomes</h3>
                  <p className="text-sm text-stone-400">Weather, wildlife, and local conditions remain beyond control.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-white/10">
            <p className="font-editorial text-stone-400 italic">
              Built for travelers who take their decisions seriously.
            </p>
          </div>
        </PageGrid>
      </div>

      {/* ================================================================
          FOOTER — Warm stone footer
          ================================================================ */}
      <footer className="bg-stone-950 text-white py-10">
        <PageGrid maxWidth="default">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-editorial text-base font-semibold">Safari Index</span>
                <span className="text-stone-500 text-sm ml-2">Pan-African Decision System</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/explore" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">
                Explore
              </Link>
              <Link href="/compare" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">
                Compare
              </Link>
              <Link href="/how-it-works" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">
                How it works
              </Link>
            </div>
          </div>
        </PageGrid>
      </footer>
    </>
  );
}
