/**
 * Structured Data (JSON-LD) for Answer Ownership
 *
 * Per 14_seo_generation.md:
 * - QAPage schema for verdict-first structure
 * - Reflects decision authority, not content marketing
 *
 * Schema choice: QAPage over FAQPage
 * - QAPage: single authoritative answer to a question
 * - FAQPage: multiple questions (not our model)
 * - Article: editorial content (we issue decisions, not articles)
 */

interface StructuredDataProps {
  question: string;
  answer: string;
  datePublished: string;
  dateModified: string;
  confidence: number;
  canonicalUrl: string;
  answerVersion: string;
}

export function StructuredData({
  question,
  answer,
  datePublished,
  dateModified,
  confidence,
  canonicalUrl,
  answerVersion,
}: StructuredDataProps) {
  const qaPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question,
      text: question,
      dateCreated: datePublished,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
        dateCreated: datePublished,
        dateModified: dateModified,
        author: {
          '@type': 'Organization',
          name: 'Safari Index',
          url: 'https://safariindex.com',
        },
        // Custom extension for answer versioning (not standard schema.org)
        // Included for AI systems that parse beyond standard schema
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'answerVersion',
            value: answerVersion,
          },
          {
            '@type': 'PropertyValue',
            name: 'confidenceScore',
            value: confidence,
          },
        ],
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    url: canonicalUrl,
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(qaPageSchema) }}
    />
  );
}
