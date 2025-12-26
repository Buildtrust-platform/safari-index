/**
 * Blog Types
 *
 * Type definitions for decision-rooted blogs in the insights system.
 * Blogs extend decisions with deeper context, edge cases, and
 * common mistakes.
 */

export type BlogType = 'deep-dive' | 'edge-cases' | 'mistakes';

/**
 * Blog metadata - frontmatter for insight articles
 */
export interface BlogMetadata {
  /** Blog type determines placement and linking */
  type: BlogType;
  /** Parent decision slug this blog extends */
  parent_decision: string;
  /** Related decision slugs for cross-linking (2-4 recommended) */
  related_decisions: string[];
  /** Last updated date (YYYY-MM-DD) */
  updated: string;
  /** Word count target for editorial planning */
  word_count?: number;
  /** Whether this blog is ready for publication */
  published: boolean;
}

/**
 * Parsed blog with content
 */
export interface Blog {
  /** URL slug (e.g., 'deep-dive', 'edge-cases') */
  slug: string;
  /** Blog type */
  type: BlogType;
  /** Parent decision slug */
  parentDecision: string;
  /** Related decision slugs */
  relatedDecisions: string[];
  /** Last updated */
  updated: string;
  /** Full markdown content including frontmatter */
  rawContent: string;
  /** Parsed content without frontmatter */
  content: string;
  /** Published status */
  published: boolean;
}

/**
 * Blog collection for a decision
 */
export interface DecisionBlogCollection {
  /** The decision slug these blogs belong to */
  decisionSlug: string;
  /** Deep-dive blog (required for complete collections) */
  deepDive: Blog | null;
  /** Edge cases blog (optional) */
  edgeCases: Blog | null;
  /** Common mistakes blog (optional) */
  mistakes: Blog | null;
}

/**
 * Blog content requirements per type
 */
export const BLOG_REQUIREMENTS: Record<BlogType, {
  required: boolean;
  description: string;
  sections: string[];
}> = {
  'deep-dive': {
    required: true,
    description: 'Comprehensive exploration of the decision context, with nuance beyond the quick verdict',
    sections: [
      'Context that shapes this decision',
      'Key factors the verdict weighs',
      'When the default answer flips',
      'Real-world scenarios',
    ],
  },
  'edge-cases': {
    required: false,
    description: 'Unusual situations where standard advice may not apply',
    sections: [
      'Non-obvious exceptions',
      'Combination scenarios',
      'When rules collide',
    ],
  },
  'mistakes': {
    required: false,
    description: 'Common errors travelers make related to this decision',
    sections: [
      'The mistake',
      'Why it happens',
      'How to avoid it',
    ],
  },
};
