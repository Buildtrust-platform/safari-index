/**
 * Blog Section Component
 *
 * Renders a single section of blog content.
 * Handles paragraph splitting and basic formatting.
 */

import { type ReactNode } from 'react';

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
                        {boldMatch[2]}
                      </p>
                    );
                  }
                  return (
                    <p key={lineIdx} className="text-stone-700 leading-relaxed">
                      {line}
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
 * Render inline bold formatting
 */
function renderInlineFormatting(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      // Add text before bold
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      // Add bold text
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
}
