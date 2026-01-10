/**
 * FAQ Page
 *
 * Comprehensive FAQ page with all questions organized by category.
 * Includes FAQPage structured data for Google rich snippets.
 *
 * Documentary tone - factual answers, no marketing speak.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar, Footer, PageGrid } from '../components/layout';
import { FAQSection } from '../components/FAQSection';
import {
  FAQS,
  FAQ_CATEGORIES,
  getFAQsGroupedByCategory,
  type FAQCategory,
} from '../content/faqs';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Vurara Safaris',
  description:
    'Common questions about planning a safari with Vurara Safaris. Answers about timing, costs, destinations, booking process, and travel logistics.',
  openGraph: {
    title: 'Safari FAQ | Vurara Safaris',
    description:
      'Answers to common safari planning questions. Timing, costs, destinations, and logistics.',
  },
};

/**
 * Category section with anchor for navigation
 */
function CategorySection({
  category,
  faqs,
}: {
  category: FAQCategory;
  faqs: typeof FAQS;
}) {
  const categoryInfo = FAQ_CATEGORIES[category];

  if (faqs.length === 0) return null;

  return (
    <section id={category} className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="font-editorial text-xl md:text-2xl font-semibold text-stone-900">
          {categoryInfo.label}
        </h2>
        <p className="text-stone-500 text-sm mt-1">{categoryInfo.description}</p>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <FAQSection faqs={faqs} includeSchema={false} />
      </div>
    </section>
  );
}

/**
 * Quick navigation for categories
 */
function CategoryNav({ categories }: { categories: FAQCategory[] }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <a
          key={category}
          href={`#${category}`}
          className="px-3 py-1.5 text-sm rounded-full bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
        >
          {FAQ_CATEGORIES[category].label}
        </a>
      ))}
    </nav>
  );
}

export default function FAQPage() {
  const groupedFaqs = getFAQsGroupedByCategory();
  const categoryOrder: FAQCategory[] = [
    'planning',
    'booking',
    'destinations',
    'timing',
    'costs',
    'logistics',
  ];

  // Filter to only categories with FAQs
  const activeCategories = categoryOrder.filter(
    (cat) => groupedFaqs[cat].length > 0
  );

  // Generate full schema for all FAQs
  const fullSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* JSON-LD for all FAQs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fullSchema) }}
      />

      <Navbar />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-12">
        <PageGrid maxWidth="default">
          <div className="text-center">
            <p className="text-xs font-medium text-amber-500 uppercase tracking-widest mb-3">
              Safari Planning
            </p>
            <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-stone-400 max-w-xl mx-auto">
              Common questions about planning a safari. If you do not find your answer here,{' '}
              <Link href="/contact" className="text-amber-400 hover:text-amber-300 underline">
                get in touch
              </Link>
              .
            </p>
          </div>
        </PageGrid>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b border-stone-200 py-4 sticky top-16 z-10">
        <PageGrid maxWidth="default">
          <CategoryNav categories={activeCategories} />
        </PageGrid>
      </div>

      {/* FAQ Sections */}
      <div className="py-12">
        <PageGrid maxWidth="default">
          <div className="max-w-3xl mx-auto space-y-12">
            {activeCategories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                faqs={groupedFaqs[category]}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-stone-900 rounded-xl p-8 text-center">
              <h2 className="font-editorial text-xl font-semibold text-white mb-3">
                Still have questions?
              </h2>
              <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
                We respond to every inquiry personally. Schedule a call or send us a message.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-white text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Start Planning
                </Link>
              </div>
            </div>
          </div>
        </PageGrid>
      </div>

      <Footer />
    </main>
  );
}
