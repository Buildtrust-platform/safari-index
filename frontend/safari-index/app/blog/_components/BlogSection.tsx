/**
 * Blog Section Component
 *
 * Renders a single section of blog content.
 * Handles:
 * - Paragraph splitting
 * - Bold formatting (**text**)
 * - Internal links [text](/path)
 */

import { type ReactNode } from 'react';
import Link from 'next/link';

interface BlogSectionProps {
  heading: string;
  content: string;
}

export function BlogSection({ heading, content }: BlogSectionProps) {
  // Split content by double newlines for paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <section className="mb-10">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
        {heading}
      </h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => {
          // Check if it's a list item (starts with **)
          if (paragraph.trim().startsWith('**')) {
            // Parse as definition-style content
            const lines = paragraph.split('\n').filter(l => l.trim());
            return (
              <div key={idx} className="space-y-3">
                {lines.map((line, lineIdx) => {
                  const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)$/);
                  if (boldMatch) {
                    return (
                      <p key={lineIdx} className="text-stone-700 leading-relaxed">
                        <strong className="font-semibold text-stone-900">
                          {boldMatch[1]}
                        </strong>
                        {renderInlineFormatting(boldMatch[2])}
                      </p>
                    );
                  }
                  return (
                    <p key={lineIdx} className="text-stone-700 leading-relaxed">
                      {renderInlineFormatting(line)}
                    </p>
                  );
                })}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-stone-700 leading-relaxed">
              {renderInlineFormatting(paragraph)}
            </p>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Render inline formatting (bold and links)
 * Supports:
 * - **bold text**
 * - [link text](/path)
 */
function renderInlineFormatting(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Combined regex for bold and links
  // Matches either **bold** or [text](url)
  const formatRegex = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/;

  while (remaining.length > 0) {
    const match = remaining.match(formatRegex);

    if (match && match.index !== undefined) {
      // Add text before the match
      if (match.index > 0) {
        parts.push(remaining.slice(0, match.index));
      }

      if (match[1]) {
        // Bold match: **text**
        parts.push(
          <strong key={`b-${keyIdx++}`} className="font-semibold">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // Link match: [text](url)
        const linkText = match[4];
        const linkUrl = match[5];

        // Internal links use Next.js Link
        if (linkUrl.startsWith('/')) {
          parts.push(
            <Link
              key={`l-${keyIdx++}`}
              href={linkUrl}
              className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
            >
              {linkText}
            </Link>
          );
        } else {
          // External links
          parts.push(
            <a
              key={`l-${keyIdx++}`}
              href={linkUrl}
              className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>
          );
        }
      }

      remaining = remaining.slice(match.index + match[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
}
