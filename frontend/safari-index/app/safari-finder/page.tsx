/**
 * Safari Finder - Decision Tree Qualifier
 *
 * Routes new visitors to the right safari based on what they actually care about.
 * Not a quiz—a structured qualification that surfaces alternatives they haven't considered.
 *
 * Purpose:
 * - Solve "I don't know what I don't know" problem
 * - Route based on priorities, not assumptions
 * - Surface alternatives (gorilla trekking, Namibia landscapes, walking safaris)
 */

import { Metadata } from 'next';
import { Navbar } from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { SafariFinderFlow } from './SafariFinderFlow';

export const metadata: Metadata = {
  title: 'Safari Finder | What kind of safari is right for you? | Vurara Safaris',
  description:
    'Answer a few questions to find the right safari for your priorities. No assumptions—just clarity on what fits your travel style, budget, and interests.',
  openGraph: {
    title: 'Safari Finder | Vurara Safaris',
    description: 'Find the right safari for your priorities',
  },
};

export default function SafariFinderPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-900 mb-4">
              What kind of safari is right for you?
            </h1>
            <p className="text-stone-600 max-w-xl mx-auto">
              Most travelers arrive with assumptions about what a safari should be.
              These questions surface what actually matters to you—and what alternatives
              you might not have considered.
            </p>
          </div>

          {/* Decision Tree Flow */}
          <SafariFinderFlow />
        </div>
      </div>

      <Footer />
    </main>
  );
}
