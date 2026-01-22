/**
 * Blog Content Template
 *
 * Copy this template when creating a new blog article.
 * Follow the Content Protocol checklist below.
 *
 * ============================================================
 * CONTENT PROTOCOL CHECKLIST (All 7 required before publish)
 * ============================================================
 *
 * □ 1. ANSWER-FIRST (Verdict Box)
 *   - verdictBox.verdict: 2-3 sentences with direct answer
 *   - verdictBox.recommendation: 1 clear next step
 *   - verdictBox.outcome: 'yes' | 'no' | 'depends' | 'wait'
 *   - Test: If user reads ONLY this, are they satisfied?
 *
 * □ 2. VISUAL LOGIC (Comparison Table)
 *   - comparisonTable with leftHeader, rightHeader, rows
 *   - Common formats: Pros vs Cons, A vs B, Cost vs Value
 *   - Minimum 4 rows for meaningful comparison
 *
 * □ 3. E-E-A-T SIGNALS (Expert Byline)
 *   - author.name: Real name, never "Admin"
 *   - author.role: Specific title (e.g., "Safari Consultant")
 *   - author.credentials: Years/experience (e.g., "20 years guiding")
 *
 * □ 4. RADICAL HONESTY (Trade-offs Section)
 *   - tradeoffs field must include real negatives
 *   - "It is expensive" / "Roads are bumpy" / "You might hate this"
 *   - Test: Would a competitor publish this criticism?
 *
 * □ 5. SPECIFICS TEST (Kogatende Rule)
 *   - Minimum 3 proper nouns per major section
 *   - Bad: "the northern part" → Good: "Lamai Wedge and Kogatende"
 *   - Bad: "bug spray" → Good: "Rid-brand spray with 40% DEET"
 *   - Bad: "local lodge" → Good: "Sayari Camp or Nomad Lamai"
 *
 * □ 6. BOLD KEY PHRASES
 *   - Use **bold** for the most important phrase per paragraph
 *   - Guide F-pattern scanning to key takeaways
 *   - Example: "**avoid April due to heavy rain**"
 *
 * □ 7. FAQ SECTION
 *   - faq.items: 3-5 questions
 *   - Use actual search queries people type
 *   - Answers: 2-3 sentences, direct and factual
 *
 * ============================================================
 */

import { registerBlog, type BlogContent } from '../../../lib/blog-content';

// ============================================================
// [DECISION-SLUG]: [Question Title]
// ============================================================
const templateBlog: BlogContent = {
  // URL: /blog/decisions/[decisionSlug]
  decisionSlug: 'your-decision-slug',

  // Title: The question being answered (no year suffix for evergreen)
  title: 'Your Decision Question Here?',

  // Subtitle: One-line context setter
  subtitle: 'Understanding the key factors that affect this decision',

  // Last updated (YYYY-MM format)
  updatedAt: '2025-01',

  // Approximate word count (aim for 1200-1800)
  wordCount: 1500,

  // Set to true only when all 7 checklist items pass
  published: false,

  // Hero image (optional, falls back to default)
  heroImage: {
    src: '/images/heroes/your-image.jpg',
    alt: 'Descriptive alt text for accessibility and SEO',
  },

  // ============================================================
  // 1. ANSWER-FIRST: The Verdict Box
  // ============================================================
  verdictBox: {
    // Direct answer in 2-3 sentences with nuance
    verdict:
      'Your direct verdict here. Include the key trade-off. Name the deciding factor.',

    // Clear recommendation or next step
    recommendation:
      'One actionable recommendation the reader can take immediately.',

    // Outcome type: 'yes' | 'no' | 'depends' | 'wait'
    outcome: 'depends',
  },

  // ============================================================
  // 2. VISUAL LOGIC: Comparison Table
  // ============================================================
  comparisonTable: {
    leftHeader: 'Option A',
    rightHeader: 'Option B',
    rows: [
      { left: 'Feature/aspect of A', right: 'Feature/aspect of B' },
      { left: 'Cost comparison', right: 'Cost comparison' },
      { left: 'Timing consideration', right: 'Timing consideration' },
      { left: 'Experience factor', right: 'Experience factor' },
    ],
  },

  // ============================================================
  // 3. E-E-A-T: Expert Byline
  // ============================================================
  author: {
    name: 'Emmanuel Mollel', // Real name, never "Admin"
    role: 'Safari Consultant', // Specific role
    credentials: '20 years planning East Africa safaris', // Experience proof
  },

  // ============================================================
  // 7. FAQ Section (for schema + visual display)
  // ============================================================
  faq: {
    items: [
      {
        // Use actual search queries people type
        question: 'What is the most common question about this topic?',
        answer:
          'Direct 2-3 sentence answer. Include a specific fact or number. End with actionable insight.',
      },
      {
        question: 'Second most searched question?',
        answer:
          'Answer that addresses a common misconception or provides clarity.',
      },
      {
        question: 'Third question addressing a trade-off or edge case?',
        answer:
          'Answer that shows expertise and builds trust through honesty.',
      },
    ],
  },

  // ============================================================
  // CONTENT SECTIONS (Apply rules 4, 5, 6 throughout)
  // ============================================================

  // Why this decision is complex (set up the problem)
  // - Include **bold** for key phrases
  // - Use proper nouns (Kogatende Rule)
  whyNotSimple: `Start with the core tension. Why do people struggle with this decision?

Frame it as "you see this question everywhere" to validate the reader's confusion. Then explain why the simple answer is insufficient.

**The real issue is X, not Y.** Most advice misses this because they focus on [generic factor] instead of [specific factor that matters].

Link to related decisions where relevant: see [related decision title](/decisions/related-slug).`,

  // Variables that change the answer
  // - Bold the variable names
  // - Include specific proper nouns
  variables: `**Your travel dates** matter most. Explain why timing affects this decision. Reference specific months and what happens: **January through March** sees X, while **July through October** offers Y.

**Your budget** changes the calculus. At **$300-400/day**, you get [specific options]. At **$600+/day**, you unlock [specific lodges like Singita or andBeyond].

**Your priorities** determine the trade-off. If you care about [specific thing], then [recommendation]. If you prioritize [other thing], then [alternative].

**Trip length** affects feasibility. With **4-5 days**, you can cover [specific itinerary]. With **8+ days**, you can add [specific extension like Zanzibar or Ruaha].`,

  // ============================================================
  // 4. RADICAL HONESTY: Trade-offs Section
  // ============================================================
  tradeoffs: `Name the real downsides. **The roads are brutal** during rainy season—4 hours of washboard corrugation. Some travelers find this exhausting.

Cost and quality often conflict. **Budget options exist but vary wildly** in reliability. The cheapest camps sometimes cancel or deliver substandard vehicles.

Crowds and exclusivity pull opposite directions. **Peak season means 15 vehicles at a lion sighting.** Some find this tolerable; others find it ruins the experience.

Be specific about what might disappoint: "You might spend 3 days at the **Mara River** and see no crossings. The herds decide, not your schedule."`,

  // Common misconceptions
  misconceptions: `People believe [common myth]. Actually, [truth with evidence].

The idea that [misconception] comes from [source of confusion]. In reality, **[specific correction]**.

Another myth: [second misconception]. This is backwards because [explanation]. The data shows [specific fact].`,

  // When this decision breaks down (edge cases)
  breaksDown: `If your dates are fixed to [specific constraint], this decision makes itself. You cannot choose X because Y is unavailable.

If budget is under **$X per day**, option A becomes impractical. The [specific lodges/camps] start at $X and there's nothing comparable below that.

If [specific health/mobility requirement], your options narrow to [specific alternatives]. The **[destination]** works well for this.`,

  // How Vurara approaches this decision
  ourApproach: `We evaluate this using your [input 1], [input 2], and [input 3]. The system weighs these against [criteria] and produces a recommendation.

The verdict is not permanent. Change your [variable] and the answer might flip.

We assume you want honest assessment. If constraints exist, we name them. If concerns are unfounded, we explain why.`,

  // ============================================================
  // INTERNAL LINKING (Spiderweb Strategy)
  // ============================================================

  // Max 3 related decisions (same category/bucket)
  relatedDecisions: [
    {
      slug: 'related-decision-1',
      title: 'Related Question 1?',
      type: 'decision',
    },
    {
      slug: 'related-decision-2',
      title: 'Related Question 2?',
      type: 'decision',
    },
    {
      slug: 'related-decision-3',
      title: 'Related Question 3?',
      type: 'decision',
    },
  ],

  // Max 2 trips that solve this decision
  relatedTrips: [
    {
      slug: 'relevant-trip-itinerary',
      title: 'Trip That Addresses This',
      type: 'trip',
    },
  ],

  // Max 2 guides for deeper reading
  relatedGuides: [
    { slug: 'category/guide-slug', title: 'Deeper Guide Title', type: 'guide' },
  ],
};

// ============================================================
// REGISTRATION (uncomment when ready to publish)
// ============================================================
// registerBlog(templateBlog);

export { templateBlog };
