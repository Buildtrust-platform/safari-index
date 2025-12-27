import { Metadata } from 'next';

/**
 * Ops Dashboard Layout
 *
 * Internal operations pages - not for public indexing.
 * Protected by x-ops-key header validation.
 */

export const metadata: Metadata = {
  title: 'Operations Dashboard',
  robots: 'noindex, nofollow',
};

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
