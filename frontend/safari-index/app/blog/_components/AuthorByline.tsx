/**
 * Author Byline Component
 *
 * Displays author information with E-E-A-T signals.
 * Shows name, role, and credentials for trust building.
 */

import type { BlogContent } from '../../../lib/blog-content';

interface AuthorBylineProps {
  author: NonNullable<BlogContent['author']>;
}

export function AuthorByline({ author }: AuthorBylineProps) {
  const { name, role, credentials } = author;

  return (
    <div
      className="my-8 flex items-center gap-4 p-4 rounded-lg bg-stone-50 border border-stone-200"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
        <span className="text-amber-700 font-semibold text-lg" aria-hidden="true">
          {name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <p className="font-semibold text-stone-900" itemProp="name">
          {name}
        </p>
        <p className="text-sm text-stone-600" itemProp="jobTitle">
          {role}
        </p>
        {credentials && (
          <p className="text-xs text-stone-500 mt-0.5" itemProp="description">
            {credentials}
          </p>
        )}
      </div>
    </div>
  );
}
