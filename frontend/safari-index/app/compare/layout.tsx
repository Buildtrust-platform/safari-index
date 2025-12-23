import { Metadata } from 'next';

/**
 * Compare Page Layout
 *
 * PRODUCTION-SAFE: Side-by-side decision comparison.
 * Read-only tool, indexed for discovery.
 */

export const metadata: Metadata = {
  title: 'Compare Decisions',
  description: 'Compare two safari decisions side by side to understand the trade-offs.',
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'Compare Safari Decisions',
    description: 'Compare two safari decisions side by side.',
    url: '/compare',
    type: 'website',
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
