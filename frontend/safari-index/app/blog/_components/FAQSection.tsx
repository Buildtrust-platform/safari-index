/**
 * FAQ Section Component
 *
 * Visual accordion-style FAQ display.
 * Complements the FAQPage schema in BlogSchema for SEO.
 */

'use client';

import { useState } from 'react';
import type { BlogContent } from '../../../lib/blog-content';

interface FAQSectionProps {
  faq: NonNullable<BlogContent['faq']>;
}

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <button
        className="w-full py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-stone-800 pr-4">{question}</span>
        <span
          className={`flex-shrink-0 text-amber-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pr-8 text-stone-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FAQSection({ faq }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faq.items?.length) return null;

  return (
    <section className="my-10" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-editorial text-xl font-semibold text-stone-900 mb-4"
      >
        Frequently Asked Questions
      </h2>
      <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-200">
        {faq.items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}
