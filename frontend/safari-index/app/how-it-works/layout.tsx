import { Metadata } from 'next';

/**
 * How It Works Page Metadata
 *
 * SEO Configuration:
 * - No "AI-powered" or "intelligent" language
 * - Canonical URL enforced
 * - Clear, factual description
 *
 * Governance:
 * - 14_seo_generation.md: SEO requirements
 * - 01_brand_voice.md: No marketing hype
 */

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'The decision process, refusal policy, and accountability structure.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How Safari Index Works',
    description:
      'The decision process, refusal policy, and accountability structure.',
    url: '/how-it-works',
    type: 'website',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
