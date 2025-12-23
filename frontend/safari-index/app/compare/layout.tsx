/**
 * Compare Page Layout
 *
 * Wraps the compare page with StagingShell.
 * Only renders shell in build mode; production returns 404 from page.
 */

import { StagingShell } from '../components/StagingShell';

export const metadata = {
  title: 'Compare Decisions',
  robots: 'noindex, nofollow',
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StagingShell>{children}</StagingShell>;
}
