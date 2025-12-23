/**
 * Variants Layout
 *
 * Adds noindex, nofollow metadata to prevent indexing.
 * This is a staging-only route.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decision Variants',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VariantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
