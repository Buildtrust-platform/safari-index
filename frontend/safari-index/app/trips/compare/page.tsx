/**
 * Trip Comparison Page
 *
 * Side-by-side comparison of 2-3 safari trips.
 * Shows what matters: duration, cost, wildlife time vs transit time, trade-offs.
 */

import { Metadata } from 'next';
import { Navbar } from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { TripComparisonTool } from './TripComparisonTool';

export const metadata: Metadata = {
  title: 'Compare Safari Trips | Vurara Safaris',
  description:
    'Compare safari itineraries side-by-side. See duration, cost, destinations, and trade-offs clearly.',
  openGraph: {
    title: 'Compare Safari Trips | Vurara Safaris',
    description: 'Side-by-side safari comparison tool',
  },
};

export default function TripComparePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-900 mb-3">
              Compare safaris
            </h1>
            <p className="text-stone-600 max-w-2xl">
              Select two or three trips to see them side by side. Focus on what
              actually matters: how time is spent, what you get, and what you
              trade off.
            </p>
          </div>

          {/* Comparison Tool */}
          <TripComparisonTool />
        </div>
      </div>

      <Footer />
    </main>
  );
}
