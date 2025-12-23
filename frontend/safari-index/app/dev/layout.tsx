/**
 * Dev Tools Layout
 *
 * Wraps all /dev/* pages with StagingShell.
 * Only renders shell in build mode; production returns 404 from page.
 */

import { StagingShell } from '../components/StagingShell';

export const metadata = {
  title: 'Dev Tools',
  robots: 'noindex, nofollow',
};

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StagingShell>{children}</StagingShell>;
}
