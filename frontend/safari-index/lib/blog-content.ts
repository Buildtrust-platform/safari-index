/**
 * Blog Content Types and Registry
 *
 * Decision-anchored blog system for Safari Index.
 * Every blog extends a decision—no orphan blogs allowed.
 *
 * Structure:
 * - Blogs live at /blog/decisions/[slug]
 * - Each blog references its source decision
 * - Content follows strict 9-section template
 */

export interface BlogSection {
  heading: string;
  content: string;
}

export interface RelatedLink {
  slug: string;
  title: string;
  type: 'decision' | 'trip' | 'guide' | 'activity';
}

/**
 * Blog content structure matching the editorial template
 */
export interface BlogContent {
  /** Must match a valid decision slug */
  decisionSlug: string;

  /** H1 - exact question from decision */
  title: string;

  /** Subhead */
  subtitle: string;

  /** Last updated date (YYYY-MM-DD) */
  updatedAt: string;

  /** Word count for validation */
  wordCount: number;

  /** Section 1: Why This Decision Is Not Simple */
  whyNotSimple: string;

  /** Section 2: The Variables That Change the Answer */
  variables: string;

  /** Section 3: Trade-offs People Underestimate */
  tradeoffs: string;

  /** Section 4: Common Misconceptions */
  misconceptions: string;

  /** Section 5: When This Decision Breaks Down */
  breaksDown: string;

  /** Section 6: How Safari Index Approaches This Decision */
  ourApproach: string;

  /** Related decisions (max 6) */
  relatedDecisions: RelatedLink[];

  /** Related trips (max 3) */
  relatedTrips: RelatedLink[];

  /** Related guides (max 3) */
  relatedGuides: RelatedLink[];

  /** Published status */
  published: boolean;
}

/**
 * Blog registry - maps decision slugs to blog content
 */
const blogRegistry: Map<string, BlogContent> = new Map();

/**
 * Register a blog
 *
 * Link limits per editorial spec:
 * - Related decisions: max 3 (same or adjacent bucket)
 * - Related trips: max 2
 * - Related guides: max 2
 */
export function registerBlog(blog: BlogContent): void {
  // Validate link limits
  if (blog.relatedDecisions.length > 3) {
    console.warn(`Blog ${blog.decisionSlug}: Too many related decisions (max 3)`);
  }
  if (blog.relatedTrips.length > 2) {
    console.warn(`Blog ${blog.decisionSlug}: Too many related trips (max 2)`);
  }
  if (blog.relatedGuides.length > 2) {
    console.warn(`Blog ${blog.decisionSlug}: Too many related guides (max 2)`);
  }

  blogRegistry.set(blog.decisionSlug, blog);
}

/**
 * Get blog by decision slug
 */
export function getBlogByDecision(slug: string): BlogContent | null {
  return blogRegistry.get(slug) || null;
}

/**
 * Get all published blogs
 */
export function getAllBlogs(): BlogContent[] {
  return Array.from(blogRegistry.values()).filter(b => b.published);
}

/**
 * Get all decision slugs with blogs
 */
export function getDecisionSlugsWithBlogs(): string[] {
  return Array.from(blogRegistry.keys()).filter(
    slug => blogRegistry.get(slug)?.published
  );
}

/**
 * Check if a decision has a blog
 */
export function hasBlog(decisionSlug: string): boolean {
  const blog = blogRegistry.get(decisionSlug);
  return blog?.published === true;
}

/**
 * Get blogs by bucket (for index organization)
 */
export function getBlogsByBucket(bucket: string): BlogContent[] {
  // This would need topic lookup to filter by bucket
  // For now, return all published blogs
  return getAllBlogs();
}

/**
 * Validate blog content meets requirements
 *
 * Per editorial spec:
 * - Word count: 1200-1800
 * - Related decisions: 1-3 (same or adjacent bucket)
 * - Related trips: 1-2
 * - Related guides: 0-2
 */
export function validateBlog(blog: BlogContent): string[] {
  const errors: string[] = [];

  if (blog.wordCount < 1200) {
    errors.push(`Word count too low: ${blog.wordCount} (min 1200)`);
  }
  if (blog.wordCount > 1800) {
    errors.push(`Word count too high: ${blog.wordCount} (max 1800)`);
  }
  if (blog.relatedDecisions.length < 1) {
    errors.push(`Too few related decisions: ${blog.relatedDecisions.length} (min 1)`);
  }
  if (blog.relatedDecisions.length > 3) {
    errors.push(`Too many related decisions: ${blog.relatedDecisions.length} (max 3)`);
  }
  if (blog.relatedTrips.length > 2) {
    errors.push(`Too many related trips: ${blog.relatedTrips.length} (max 2)`);
  }
  if (!blog.whyNotSimple || blog.whyNotSimple.length < 200) {
    errors.push('Section "Why Not Simple" too short or missing');
  }
  if (!blog.variables || blog.variables.length < 200) {
    errors.push('Section "Variables" too short or missing');
  }
  if (!blog.tradeoffs || blog.tradeoffs.length < 200) {
    errors.push('Section "Trade-offs" too short or missing');
  }
  if (!blog.misconceptions || blog.misconceptions.length < 100) {
    errors.push('Section "Misconceptions" too short or missing');
  }
  if (!blog.breaksDown || blog.breaksDown.length < 100) {
    errors.push('Section "Breaks Down" too short or missing');
  }
  if (!blog.ourApproach || blog.ourApproach.length < 100) {
    errors.push('Section "Our Approach" too short or missing');
  }

  return errors;
}
