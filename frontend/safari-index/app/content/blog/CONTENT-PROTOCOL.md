# Vurara Safaris Content Protocol

A checklist for creating blog articles that rank and convert. Every article must pass all 7 criteria before publishing.

---

## The 7 Non-Negotiables

### 1. Answer-First Architecture

**Never bury the lead.** In the age of AI Overviews, you win by giving the answer immediately.

**Implementation:**
```typescript
verdictBox: {
  verdict: '2-3 sentences of nuance + direct answer',
  recommendation: '1 clear next step',
  outcome: 'yes' | 'no' | 'depends' | 'wait',
}
```

**The Test:** If a user reads *nothing else*, they should still feel satisfied.

**Good Example:**
> "Kenya for budget flexibility, shorter trips, and off-road photography. Tanzania for scale, solitude, and year-round migration access."

**Bad Example:**
> "It depends on many factors which we'll explore below."

---

### 2. Visual Logic (Comparison Tables)

**Blocks of text don't rank for comparison keywords.** Google needs structure.

**Implementation:**
```typescript
comparisonTable: {
  leftHeader: 'Kenya',
  rightHeader: 'Tanzania',
  rows: [
    { left: '10-20% cheaper mid-range', right: 'Higher costs but more space' },
    { left: 'Migration Jul-Oct only', right: 'Migration 8 months/year' },
    // Minimum 4 rows
  ],
}
```

**Common Table Types:**
- Pros vs Cons
- Option A vs Option B
- Cost vs Value
- Month A vs Month B
- Lodge Tier comparison

---

### 3. E-E-A-T Signals (Expert Byline)

**A generic blog looks like AI trash.** Prove a human with expertise wrote it.

**Implementation:**
```typescript
author: {
  name: 'Emmanuel Mollel',      // Real name, NEVER "Admin"
  role: 'Safari Consultant',    // Specific title
  credentials: '20 years planning East Africa safaris',
}
```

**Rules:**
- Always use a real name
- Include years of experience or specific credentials
- Role should be specific (not "Writer" or "Team Member")

---

### 4. Radical Honesty (Trade-offs Section)

**This is the brand differentiator.** It prevents sounding like a brochure.

**Implementation:**
The `tradeoffs` field must include genuine negatives:
- "It is expensive"
- "The roads are brutal"
- "You might wait 3 days and see no crossings"

**The Test:** Would a competitor publish this criticism?

**Good Example:**
> "Peak season means 15 vehicles at a lion sighting. Some find this tolerable; others find it ruins the experience. Budget options exist but vary wildly in reliability."

**Bad Example:**
> "Every experience is wonderful and our team ensures satisfaction."

---

### 5. The Specifics Test (Kogatende Rule)

**Every article must contain 2-3 proper nouns per section** that a generic AI wouldn't know or emphasize.

| Bad (Generic) | Good (Specific) |
|---------------|-----------------|
| "the northern part" | "the **Lamai Wedge** and **Kogatende** sectors" |
| "bug spray" | "**Rid-brand** spray with **40% DEET** for tsetse" |
| "a nice lodge" | "**Sayari Camp** or **Nomad Lamai**" |
| "local airline" | "**Coastal Aviation** or **Auric Air**" |
| "the dry season" | "**June through October**, peaking in **August**" |

**Proper Noun Categories to Include:**
- Place names (camps, regions, rivers)
- Brand names (gear, airlines)
- Specific species (not "big cats" but "leopard" and "cheetah")
- Time specifics (months, not "dry season")

---

### 6. Bold Key Phrases

**Users scan in an F-pattern.** Guide their eyes to key takeaways.

**Rule:** Bold the most important phrase in every paragraph.

**Example:**
> Your travel dates matter most. **The migration is in Kenya July-October only.** The rest of the year, you'll find the herds in Tanzania. If your dates are locked to August, this alone makes the decision.

**What to Bold:**
- The core insight of each paragraph
- Specific numbers or dates
- Warnings or important caveats
- The "answer" within explanation

---

### 7. FAQ Section

**Serves dual purpose:** Visual display for users + FAQPage schema for SEO.

**Implementation:**
```typescript
faq: {
  items: [
    {
      question: 'Is Kenya or Tanzania better for first safari?',
      answer: 'Neither is objectively better. Kenya is more compact and budget-friendly. Tanzania offers more space and year-round migration. Your dates and budget matter more than destination.',
    },
    // 3-5 questions total
  ],
}
```

**FAQ Rules:**
- Use actual search queries people type
- Answers: 2-3 sentences, direct and factual
- Include at least one "misconception buster"
- Include at least one "practical logistics" question

---

## Internal Linking Strategy (Spiderweb)

**Never let users hit a dead end.**

### The Next Logical Step

| If they read about... | Link to... |
|-----------------------|------------|
| Timing | Cost |
| Cost | Itineraries |
| Destination A vs B | Best time for each |
| First safari | What to expect |

### Anchor Text Rules

**Never link the word "here."** Always link the topic.

| Bad | Good |
|-----|------|
| "Click here for more" | "See our [guide to tipping on safari]" |
| "Read more here" | "The [Tanzania budget breakdown] shows..." |

### Link Limits Per Article

- `relatedDecisions`: Max 3 (same category)
- `relatedTrips`: Max 2 (relevant itineraries)
- `relatedGuides`: Max 2 (deeper reading)

---

## URL Discipline

**Keep it flat.** No date paths, no nested categories.

| Bad | Good |
|-----|------|
| `/blog/2025/01/safari-tips` | `/blog/decisions/safari-tips` |
| `/articles/category/timing/best-month` | `/blog/decisions/best-month-safari` |

---

## Title Tag Modifiers

**Always include a modifier** to differentiate from competitors:

- `(Honest Guide)`
- `(2026 Update)` - only for time-sensitive content
- `(Cost Breakdown)`
- `(With Prices)`
- `(Expert Analysis)`

---

## Writer Prompt Template

When commissioning content, use this prompt:

> Write a guide on [Topic]. It must include:
> 1. A 'Verdict' box at the top with a direct answer
> 2. A comparison table (Pros/Cons or A vs B)
> 3. A section explicitly named 'Trade-offs' detailing the negatives
> 4. At least 3 specific proper nouns per section (location names, lodge names, specific gear brands)
> 5. Bold the key phrase in each paragraph
> 6. An FAQ section with 3-5 real search queries
> 7. Internal links using topic anchor text (not "click here")
>
> Do not write fluff. Get straight to the logic.

---

## Pre-Publish Checklist

Before setting `published: true`, verify:

- [ ] Verdict box gives complete answer in isolation
- [ ] Comparison table has 4+ meaningful rows
- [ ] Author has real name and credentials
- [ ] Trade-offs section includes genuine negatives
- [ ] 3+ proper nouns per major section (Kogatende test)
- [ ] Key phrase bolded in each paragraph
- [ ] FAQ has 3-5 actual search queries
- [ ] All internal links use topic anchor text
- [ ] No "click here" or "read more" links
- [ ] Word count: 1,200-1,800 words
- [ ] Title has modifier (Honest Guide, etc.)

---

## File Locations

- **Template:** `app/content/blog/_template.ts`
- **Category files:** `app/content/blog/[category]-blogs.ts`
- **Types:** `lib/blog-content.ts`
- **Components:** `app/blog/_components/`

---

## Quality Over Quantity

A mediocre article following this protocol won't rank. A strong article will rank even with minor gaps. But combining strong content with proper structure maximizes ranking potential.

The protocol ensures consistency at scale. When you have 300+ articles, systematic structure compounds.
