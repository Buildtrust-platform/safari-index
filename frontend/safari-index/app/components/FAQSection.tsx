/**
 * FAQ Section Component
 *
 * Reusable FAQ display with JSON-LD FAQPage schema for SEO.
 * Uses accordion/disclosure pattern for compact display.
 *
 * Features:
 * - FAQPage structured data (Google rich snippets)
 * - Accessible accordion interaction
 * - Documentary tone styling
 * - Contextual or full-page use
 */

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '../content/faqs';

interface FAQSectionProps {
  /** FAQs to display */
  faqs: FAQ[];
  /** Section heading (optional for contextual use) */
  heading?: string;
  /** Subheading text */
  subheading?: string;
  /** Include JSON-LD schema in output */
  includeSchema?: boolean;
  /** Compact mode for sidebar/contextual use */
  compact?: boolean;
  /** Initially expand first item */
  expandFirst?: boolean;
}

/**
 * Generate FAQPage JSON-LD schema
 */
function generateFAQSchema(faqs: FAQ[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Single FAQ Item with accordion behavior
 */
function FAQItem({
  faq,
  isOpen,
  onToggle,
  compact,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`border-b border-stone-200 last:border-b-0 ${compact ? '' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-full text-left flex items-start justify-between gap-4 ${
          compact ? 'py-3' : 'py-4'
        } group`}
        aria-expanded={isOpen}
      >
        <span
          className={`font-medium text-stone-900 group-hover:text-amber-700 transition-colors ${
            compact ? 'text-sm' : 'text-base'
          }`}
        >
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-stone-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className={`text-stone-600 leading-relaxed ${compact ? 'text-sm' : 'text-sm'}`}>
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

/**
 * FAQ Section with optional heading and schema
 */
export function FAQSection({
  faqs,
  heading,
  subheading,
  includeSchema = true,
  compact = false,
  expandFirst = false,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(expandFirst ? 0 : null);

  if (faqs.length === 0) {
    return null;
  }

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={compact ? '' : ''}>
      {/* JSON-LD Schema */}
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
        />
      )}

      {/* Heading */}
      {heading && (
        <div className={compact ? 'mb-4' : 'mb-6'}>
          <h2
            className={`font-editorial font-semibold text-stone-900 ${
              compact ? 'text-lg' : 'text-xl md:text-2xl'
            }`}
          >
            {heading}
          </h2>
          {subheading && (
            <p className={`text-stone-500 mt-1 ${compact ? 'text-sm' : 'text-sm'}`}>
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* FAQ List */}
      <div className={compact ? '' : 'divide-y divide-stone-200 border-t border-stone-200'}>
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact FAQ list for contextual display (e.g., sidebar)
 * Shows questions as links that expand inline
 */
export function FAQCompact({ faqs, title }: { faqs: FAQ[]; title?: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <div>
      {title && (
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {faqs.map((faq) => (
          <div key={faq.id}>
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="text-left text-sm text-stone-700 hover:text-amber-700 transition-colors"
            >
              {faq.question}
            </button>
            {expandedId === faq.id && (
              <p className="mt-2 text-xs text-stone-500 leading-relaxed pl-0">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
