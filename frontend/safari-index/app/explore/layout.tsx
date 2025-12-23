import { Metadata } from 'next';

/**
 * Explore Page Layout
 *
 * PRODUCTION-CORE: Topic discovery page.
 * Indexed, accessible to all users.
 */

export const metadata: Metadata = {
  title: 'Explore Decisions',
  description: 'Browse safari decisions with clear verdicts. Filter by region, travel style, and decision type.',
  alternates: {
    canonical: '/explore',
  },
  openGraph: {
    title: 'Explore Safari Decisions',
    description: 'Browse safari decisions with clear verdicts.',
    url: '/explore',
    type: 'website',
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
