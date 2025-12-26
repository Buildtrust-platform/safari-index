'use client';

/**
 * Markdown Renderer
 *
 * Renders markdown content with proper styling for insight articles.
 * Uses a simple regex-based approach for markdown parsing.
 *
 * Supports:
 * - Headings (##, ###)
 * - Paragraphs
 * - Bold and italic
 * - Unordered lists
 * - Blockquotes
 * - Links
 * - Code inline
 */

import { type ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let i = 0;
  let listItems: string[] = [];
  let blockquoteLines: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside mb-4 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-stone-700">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote
          key={`bq-${elements.length}`}
          className="border-l-4 border-amber-300 pl-4 italic text-stone-600 my-4"
        >
          {blockquoteLines.map((line, idx) => (
            <p key={idx}>{parseInline(line)}</p>
          ))}
        </blockquote>
      );
      blockquoteLines = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Empty line - flush lists and blockquotes
    if (line.trim() === '') {
      flushList();
      flushBlockquote();
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      flushList();
      flushBlockquote();
      elements.push(
        <h2 key={`h2-${i}`} className="font-editorial text-xl font-semibold text-stone-900 mt-8 mb-4">
          {parseInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      flushList();
      flushBlockquote();
      elements.push(
        <h3 key={`h3-${i}`} className="font-editorial text-lg font-semibold text-stone-800 mt-6 mb-3">
          {parseInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Unordered list item
    if (line.match(/^[-*]\s/)) {
      flushBlockquote();
      listItems.push(line.slice(2));
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      blockquoteLines.push(line.slice(2));
      i++;
      continue;
    }

    // Regular paragraph
    flushList();
    flushBlockquote();

    // Collect paragraph lines
    const paragraphLines: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !isSpecialLine(lines[i])) {
      paragraphLines.push(lines[i]);
      i++;
    }

    elements.push(
      <p key={`p-${elements.length}`} className="text-stone-700 leading-relaxed mb-4">
        {parseInline(paragraphLines.join(' '))}
      </p>
    );
  }

  // Flush remaining
  flushList();
  flushBlockquote();

  return <>{elements}</>;
}

/**
 * Check if a line is a special markdown element
 */
function isSpecialLine(line: string): boolean {
  return (
    line.startsWith('## ') ||
    line.startsWith('### ') ||
    line.match(/^[-*]\s/) !== null ||
    line.startsWith('> ')
  );
}

/**
 * Parse inline markdown (bold, italic, links, code)
 */
function parseInline(text: string): ReactNode[] {
  const elements: ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      elements.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^[*_](.+?)[*_]/);
    if (italicMatch) {
      elements.push(
        <em key={`i-${keyIdx++}`} className="italic">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`(.+?)`/);
    if (codeMatch) {
      elements.push(
        <code key={`c-${keyIdx++}`} className="bg-stone-100 px-1 py-0.5 rounded text-sm font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[(.+?)\]\((.+?)\)/);
    if (linkMatch) {
      const isInternal = linkMatch[2].startsWith('/');
      elements.push(
        <a
          key={`a-${keyIdx++}`}
          href={linkMatch[2]}
          className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
          {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular character - collect until next special character
    const nextSpecial = remaining.search(/[\*_`\[]/);
    if (nextSpecial === -1) {
      elements.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Single special char that didn't match patterns - treat as text
      elements.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      elements.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return elements;
}
