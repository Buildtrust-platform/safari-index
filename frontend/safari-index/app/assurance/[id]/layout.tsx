/**
 * Assurance Page Layout
 *
 * Per SEO requirements:
 * - Assurance pages are purchase-gated, should not be indexed
 * - noindex to prevent search engine crawling
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decision Assurance',
  robots: 'noindex, nofollow',
};

export default function AssuranceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
