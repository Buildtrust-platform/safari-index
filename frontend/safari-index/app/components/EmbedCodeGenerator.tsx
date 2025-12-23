/**
 * Embed Code Generator Component
 *
 * Per task requirements:
 * - Visible only on Decision Assurance view (not free pages)
 * - Provides copy-paste embed code
 * - Calm, informational language only
 *
 * Generates iframe embed code that:
 * - Cannot be modified by host site
 * - Always includes attribution
 * - Links to canonical source
 */

'use client';

import { useState } from 'react';

interface EmbedCodeGeneratorProps {
  assuranceId: string;
  answerVersion: string;
}

export function EmbedCodeGenerator({
  assuranceId,
  answerVersion,
}: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://safariindex.com/embed/decision/${assuranceId}?v=${answerVersion}`;

  // Generate iframe code with fixed dimensions and no modification options
  const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="400"
  style="max-width: 640px; border: none; overflow: hidden;"
  title="Safari Index Decision"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin allow-popups"
></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = iframeCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Embed this decision
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Add this decision to your website or documentation. The embed displays
        the verdict, reasoning, and attribution. Content updates automatically
        if the decision is revised.
      </p>

      <div className="relative">
        <pre className="p-4 bg-gray-900 text-gray-100 text-xs rounded overflow-x-auto">
          <code>{iframeCode}</code>
        </pre>

        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>Embed version: {answerVersion}</p>
        <p>
          The embed will show a warning if this decision is placed under review.
        </p>
        <p>Attribution footer is required and cannot be removed.</p>
      </div>
    </section>
  );
}
