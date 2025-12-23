/**
 * Explore Page Layout
 *
 * Wraps the explore page with StagingShell.
 * Only renders shell in build mode; production returns 404 from page.
 */

import { StagingShell } from '../components/StagingShell';

export const metadata = {
  title: 'Explore Decisions',
  robots: 'noindex, nofollow',
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StagingShell>{children}</StagingShell>;
}
