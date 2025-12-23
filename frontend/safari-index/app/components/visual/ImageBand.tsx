/**
 * ImageBand Component
 *
 * Environmental context imagery for staging pages.
 * Documentary treatment: dark gradient overlay, optional grain, no parallax.
 *
 * STAGING ONLY: Gated by isBuildMode() - does not render in observation mode.
 *
 * Governance:
 * - 01_brand_voice.md: Documentary/editorial aesthetic
 * - 03_ux_flow.md: Images as context above analytical surfaces
 * - 13_frontend_templates.md: Reusable component pattern
 * - MVP_FREEZE.md: Production unchanged (gated)
 */

import Image from 'next/image';
import { isBuildMode } from '../../../lib/app-mode';
import { getCdnUrl } from '../../../lib/cdn';
import { cn } from '../../ui/utils';

export type ImageBandHeight = 'hero' | 'explore' | 'compare' | 'decision' | 'decision-hero' | 'arrival';
export type ImageBandOverlay = 'standard' | 'strong' | 'cinematic';
export type ImageBandAlign = 'bottom' | 'center';

export interface ImageBandImage {
  src: string;
  alt: string;
}

export interface ImageBandProps {
  /** Image source and alt text (alt required for accessibility) */
  image: ImageBandImage;
  /** Height preset for different page contexts */
  height: ImageBandHeight;
  /** Overlay intensity - strong for text overlays, standard for subtle context */
  overlay: ImageBandOverlay;
  /** Image alignment within container */
  align?: ImageBandAlign;
  /** Content to overlay on the image (headlines, meta) */
  children?: React.ReactNode;
  /** Whether this is above-the-fold (controls loading priority) */
  priority?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Bypass build mode gate - use for homepage arrival hero that must always render */
  alwaysRender?: boolean;
}

/** Height values for each preset (in Tailwind classes) */
const HEIGHT_CLASSES: Record<ImageBandHeight, string> = {
  hero: 'h-[480px] md:h-[600px]',
  explore: 'h-[320px] md:h-[400px]',
  compare: 'h-[240px] md:h-[300px]',
  decision: 'h-[180px] md:h-[220px]',
  'decision-hero': 'h-[420px] md:h-[520px]', // Cinematic decision hero
  arrival: 'min-h-screen', // Full viewport for arrival moment
};

/** Overlay gradient intensities */
const OVERLAY_CLASSES: Record<ImageBandOverlay, string> = {
  standard: 'from-black/40 via-black/20 to-transparent',
  strong: 'from-black/60 via-black/40 to-black/20',
  // Cinematic: lighter at horizon/top, darker at bottom where text sits
  cinematic: 'from-black/25 via-black/35 to-black/70',
};

/** Object position based on alignment */
const ALIGN_CLASSES: Record<ImageBandAlign, string> = {
  bottom: 'object-bottom',
  center: 'object-center',
};

/**
 * ImageBand - Environmental context imagery
 *
 * Documentary treatment with gradient overlay.
 * Renders only in build mode (staging).
 */
export function ImageBand({
  image,
  height,
  overlay,
  align = 'bottom',
  children,
  priority = false,
  className,
  alwaysRender = false,
}: ImageBandProps) {
  // Gate: Do not render in observation mode (production) unless alwaysRender is true
  if (!alwaysRender && !isBuildMode()) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        HEIGHT_CLASSES[height],
        className
      )}
      data-testid="image-band"
    >
      {/* Background image - uses CDN URL if NEXT_PUBLIC_ASSETS_CDN_BASE is set */}
      <Image
        src={getCdnUrl(image.src)}
        alt={image.alt}
        fill
        priority={priority}
        className={cn(
          'object-cover',
          ALIGN_CLASSES[align],
          // Subtle fade-in animation (respects reduced-motion)
          'motion-safe:animate-[fadeIn_0.6s_ease-out]'
        )}
        sizes="100vw"
      />

      {/* Gradient overlay - documentary treatment */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b',
          OVERLAY_CLASSES[overlay]
        )}
        aria-hidden="true"
      />

      {/* Optional grain/noise overlay - subtle documentary texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Content overlay (headlines, meta) */}
      {children && (
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="relative z-10 px-4 pb-8 md:px-8 md:pb-10">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ImageBandContent - Container for overlay content
 *
 * Provides consistent spacing and max-width for content within ImageBand.
 */
export function ImageBandContent({
  children,
  maxWidth = 'default',
  className,
}: {
  children: React.ReactNode;
  maxWidth?: 'narrow' | 'default' | 'wide';
  className?: string;
}) {
  const maxWidthClasses = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
  };

  return (
    <div className={cn('mx-auto w-full', maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}
