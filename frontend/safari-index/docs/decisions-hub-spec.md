# /decisions Hub Page Specification

## 1. Page Structure

### Purpose
The `/decisions` hub serves as the primary index for Safari Index's decision library. It organizes 45 decision topics by category, enabling visitors to locate specific planning questions and navigate directly to actionable verdicts.

### H1
**Safari Decisions**

### Section Order

1. **Page Header** (above fold)
   - H1: Safari Decisions
   - Subhead: 45 decisions across 8 planning categories
   - No hero image, no decorative elements

2. **Bucket Navigation** (above fold on desktop, scrollable on mobile)
   - Anchor links to each of the 8 bucket sections
   - Horizontal row, no icons

3. **Bucket Sections** (below fold, sequential)
   - One section per bucket (8 total)
   - Each contains: bucket heading, framing paragraph, topic list

4. **Footer** (standard site footer)

### Static vs Data-Driven Content

| Element | Source |
|---------|--------|
| H1, subhead | Static |
| Bucket headings | Static |
| Bucket framing copy | Static |
| Topic count per bucket | Derived from `decisionTopics` |
| Topic titles | From `topic.question` |
| Topic links | From `topic.slug` |

---

## 2. Bucket Framing Copy

### Personal Fit
Safari travel demands more than interest—it requires honest self-assessment. These decisions help you evaluate whether your expectations, travel style, and group composition align with what a safari actually delivers. Answer these before booking anything.

### Destination Choice
East Africa and Southern Africa offer fundamentally different experiences at different price points. These decisions address country-level and park-level trade-offs, helping you choose where to go based on your priorities rather than marketing claims.

### Timing
When you travel determines what you see, what you pay, and how crowded it will be. These decisions cover month-by-month conditions, migration patterns, and seasonal trade-offs that most travelers underestimate until it's too late to adjust.

### Experience Type
The difference between a guided game drive and a walking safari is not just activity—it's a different relationship with the bush. These decisions help you understand what each experience type requires and whether it fits your goals.

### Accommodation
Lodge versus tented camp. Inside the park versus outside. Luxury versus mid-range. These decisions address where you sleep and why it matters beyond comfort—including game access, atmosphere, and cost efficiency.

### Logistics
Trip length, internal flights, vehicle arrangements, and booking channels all affect your experience in ways that aren't obvious until you're on the ground. These decisions cover the operational questions that separate smooth trips from frustrating ones.

### Risk & Ethics
Malaria zones, safety considerations, and conservation impact deserve direct answers, not vague reassurances. These decisions address the concerns that make some travelers hesitate—and clarify when those concerns are warranted.

### Value & Cost
Safari pricing varies by a factor of ten depending on choices you may not realize you're making. These decisions help you understand what drives cost, where to allocate budget, and how to avoid common pricing traps.

---

## 3. Decision Topic Listing Rules

### Display Format
Each topic appears as a single line:
- **Title**: The topic's `question` field (e.g., "Is February a good time for Tanzania safari?")
- **No description, no preview, no metadata displayed**
- Entire row is clickable

### Ordering Rules
Within each bucket:
1. P0 topics appear first (all current topics are P0)
2. Within P0, order by logical progression:
   - General questions before specific
   - Binary decisions before multi-factor
   - Common traveler paths prioritized

### Click Behavior
- Each topic links to `/decisions/{slug}`
- No modal, no preview pane
- Standard navigation (not SPA transition)

### Visual Treatment
- Simple list with subtle dividers
- Hover state: background highlight only
- No icons, badges, or status indicators

---

## 4. Internal Linking Rules

### Hub → Decision Pages
- Every published topic appears exactly once on the hub
- Link text matches topic question exactly
- No duplicate links to the same decision

### Decision → Hub
- Each decision page includes a "Back to all decisions" link in the header
- Links to `/decisions` (hub root), not to a specific bucket anchor
- Single link only; no breadcrumb trail

### Decision → Related Decisions
Strict rules to prevent link sprawl:

1. **Same-bucket links only**: A decision may link to at most 2 other decisions from the same bucket
2. **Adjacent-bucket exception**: One link to an adjacent bucket is permitted if directly relevant (e.g., Timing → Destination for migration topics)
3. **No cross-hub links**: Decisions do not link to unrelated buckets
4. **No reciprocal requirement**: If A links to B, B is not required to link to A
5. **Link placement**: Related decisions appear at page bottom, after verdict content, labeled "Related decisions"

### Prohibited Patterns
- No "see also" link clusters
- No automatic "similar topics" generation
- No links embedded in body copy
- No links to /explore, /compare, or other tooling pages from decision content

---

## 5. SEO & Indexing Considerations

### Topical Authority
The hub establishes Safari Index as a structured authority on safari planning by:
- Grouping decisions into coherent, named categories
- Using question-based titles that match search intent
- Providing clear hierarchy: hub → bucket → decision

### Indexability Without Long-Form Content
The hub is indexable because:
- Each bucket section contains unique framing copy (not duplicated elsewhere)
- Topic listings provide genuine navigation value
- Page structure follows semantic HTML (proper heading hierarchy, landmark regions)
- Internal links create crawl paths to all decision pages

### Avoiding Thin/Spammy Patterns
- No keyword-stuffed descriptions
- No auto-generated summaries or previews
- No pagination or infinite scroll
- No duplicate content across buckets
- Bucket framing copy is substantive (2-3 sentences of original content each)

### Meta Configuration
```
title: Safari Decisions | Safari Index
description: 45 safari planning decisions organized by category. Find answers to timing, destination, accommodation, and cost questions.
robots: index, follow
```

No schema markup required for hub page. Decision pages carry their own structured data.

---

## 6. Implementation Notes

### Data Requirements
The page requires only:
- `getPublishedTopics()` from `decision-topics.ts`
- `TopicBucket` type from `topic-inventory.ts`
- Static bucket metadata (order, labels, framing copy)

### Bucket Assignment
Topics are grouped by their `bucket` field. If a topic lacks a bucket assignment, it should not appear on the hub (indicates data error).

### File Location
`app/decisions/page.tsx` (new file)

### Route Behavior
- Static generation (no dynamic data)
- Rebuild on topic registry changes
- No client-side interactivity required
