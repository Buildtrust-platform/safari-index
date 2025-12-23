/**
 * Single CTA Bar Component
 *
 * Per 13_frontend_templates.md Section 1F:
 * - Purpose: one calm step forward
 * - One primary CTA per screen
 * - One secondary action allowed only if it is a defer action
 * - No other buttons
 *
 * Per Global UI rules:
 * - Calm, specific, non-salesy
 * - No exclamation marks
 */

import { buttonPrimary, buttonSecondary } from '../ui/styles';

interface CTAAction {
  label: string;
  href: string;
}

interface CTABarProps {
  primary: CTAAction;
  secondary?: CTAAction;
}

export function CTABar({ primary, secondary }: CTABarProps) {
  return (
    <nav className="mt-12 pt-8 border-t border-gray-200" aria-label="Next steps">
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={primary.href}
          className={`${buttonPrimary} px-6 py-3 text-center`}
        >
          {primary.label}
        </a>
        {secondary && (
          <a
            href={secondary.href}
            className={`${buttonSecondary} px-6 py-3 text-center`}
          >
            {secondary.label}
          </a>
        )}
      </div>
    </nav>
  );
}
