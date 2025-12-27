import { Metadata } from 'next';

/**
 * Inquire Page Layout
 *
 * Safari inquiry form for trip planning.
 * Public, indexed page for lead generation.
 */

export const metadata: Metadata = {
  title: 'Plan a Safari',
  description:
    'Start planning your African safari. Tell us about your trip preferences and receive tailored recommendations.',
  alternates: {
    canonical: '/inquire',
  },
  openGraph: {
    title: 'Plan a Safari | Safari Index',
    description:
      'Start planning your African safari with personalized recommendations.',
    url: '/inquire',
    type: 'website',
  },
};

export default function InquireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
