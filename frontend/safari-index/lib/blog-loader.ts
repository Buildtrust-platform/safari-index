/**
 * Blog Loader
 *
 * Utilities for loading and parsing blog content from the insights folder.
 * Handles markdown parsing, frontmatter extraction, and content validation.
 */

import type { Blog, BlogMetadata, BlogType, DecisionBlogCollection } from './blog-types';

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): { metadata: Partial<BlogMetadata>; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { metadata: {}, body: content };
  }

  const frontmatterStr = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  const metadata: Partial<BlogMetadata> = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterStr.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      const items = arrayContent.split(',').map(item =>
        item.trim().replace(/^['"]|['"]$/g, '')
      ).filter(Boolean);
      (metadata as Record<string, unknown>)[key] = items;
    }
    // Handle booleans
    else if (value === 'true' || value === 'false') {
      (metadata as Record<string, unknown>)[key] = value === 'true';
    }
    // Handle numbers
    else if (/^\d+$/.test(value)) {
      (metadata as Record<string, unknown>)[key] = parseInt(value, 10);
    }
    // Handle strings (remove quotes if present)
    else {
      (metadata as Record<string, unknown>)[key] = value.replace(/^['"]|['"]$/g, '');
    }
  }

  return { metadata, body };
}

/**
 * Convert filename to blog type
 */
function filenameToType(filename: string): BlogType | null {
  if (filename === 'deep-dive.md') return 'deep-dive';
  if (filename === 'edge-cases.md') return 'edge-cases';
  if (filename === 'mistakes.md') return 'mistakes';
  return null;
}

/**
 * Create a Blog object from raw content and metadata
 */
export function createBlog(
  decisionSlug: string,
  type: BlogType,
  rawContent: string
): Blog | null {
  const { metadata, body } = parseFrontmatter(rawContent);

  // Validate required fields
  if (!metadata.parent_decision || metadata.parent_decision !== decisionSlug) {
    console.warn(`Blog parent_decision mismatch: expected ${decisionSlug}, got ${metadata.parent_decision}`);
    return null;
  }

  if (metadata.type && metadata.type !== type) {
    console.warn(`Blog type mismatch: expected ${type}, got ${metadata.type}`);
    return null;
  }

  return {
    slug: type,
    type,
    parentDecision: decisionSlug,
    relatedDecisions: (metadata.related_decisions as string[]) || [],
    updated: (metadata.updated as string) || new Date().toISOString().split('T')[0],
    rawContent,
    content: body.trim(),
    published: metadata.published !== false,
  };
}

/**
 * Blog registry for static imports
 * This will be populated by the insights index file
 */
const blogRegistry: Map<string, DecisionBlogCollection> = new Map();

/**
 * Register a blog collection for a decision
 */
export function registerBlogCollection(
  decisionSlug: string,
  collection: Partial<DecisionBlogCollection>
): void {
  blogRegistry.set(decisionSlug, {
    decisionSlug,
    deepDive: collection.deepDive || null,
    edgeCases: collection.edgeCases || null,
    mistakes: collection.mistakes || null,
  });
}

/**
 * Get all blogs for a decision
 */
export function getBlogCollection(decisionSlug: string): DecisionBlogCollection | null {
  return blogRegistry.get(decisionSlug) || null;
}

/**
 * Get a specific blog by decision and type
 */
export function getBlog(decisionSlug: string, type: BlogType): Blog | null {
  const collection = blogRegistry.get(decisionSlug);
  if (!collection) return null;

  switch (type) {
    case 'deep-dive':
      return collection.deepDive;
    case 'edge-cases':
      return collection.edgeCases;
    case 'mistakes':
      return collection.mistakes;
    default:
      return null;
  }
}

/**
 * Get all decision slugs that have blogs
 */
export function getDecisionsWithBlogs(): string[] {
  return Array.from(blogRegistry.keys());
}

/**
 * Check if a decision has a complete blog collection (at least deep-dive)
 */
export function hasCompleteBlogCollection(decisionSlug: string): boolean {
  const collection = blogRegistry.get(decisionSlug);
  return collection?.deepDive !== null;
}

/**
 * Get blog statistics
 */
export function getBlogStats(): {
  totalDecisions: number;
  completedDeepDives: number;
  edgeCasesCount: number;
  mistakesCount: number;
} {
  let completedDeepDives = 0;
  let edgeCasesCount = 0;
  let mistakesCount = 0;

  for (const collection of blogRegistry.values()) {
    if (collection.deepDive) completedDeepDives++;
    if (collection.edgeCases) edgeCasesCount++;
    if (collection.mistakes) mistakesCount++;
  }

  return {
    totalDecisions: blogRegistry.size,
    completedDeepDives,
    edgeCasesCount,
    mistakesCount,
  };
}
