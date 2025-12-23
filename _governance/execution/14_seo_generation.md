SEO Page Generation Logic for Safari Index

(How to scale pages without sounding AI-ish or thin)

This document explains how Safari Index creates hundreds of high-quality, decision-worthy pages without manual blogging and without triggering Google’s “generic AI content” penalties.

This is the layer that replaces WordPress as an SEO engine.

1. CORE PRINCIPLE (LOCK THIS)

Safari Index does not generate “content.”
It generates decisions, then publishes explanations of those decisions.

This single rule is why the system works.

Google, users, and AI models all reward:

specificity

judgments

constraints

trade-offs

conditional reasoning

They punish:

generic advice

listicles

keyword stuffing

vague inspiration

2. PAGE TYPES (ONLY THREE, NO MORE)

Safari Index only publishes pages that map to real user intent.

1) Decision Pages

Primary SEO surface.

Examples:

“Is February a good time for a Tanzania safari?”

“Should families avoid Serengeti in April?”

“Kenya or Tanzania for a first safari?”

These pages answer a question and issue a verdict.

2) Comparison Pages

Used sparingly.

Examples:

“Masai Mara vs Serengeti in shoulder season”

“February vs March safaris in East Africa”

These always end in:

“Choose X if…”

“Choose Y if…”

No neutral comparisons.

3) Guide Pages (rare, foundational)

Used only when they support decisions.

Examples:

“Understanding safari driving fatigue”

“Why timing matters more than lodge choice”

These pages exist to support other decisions, not rank alone.

3. WHAT MAKES A PAGE ELIGIBLE TO EXIST

Before a page is generated, it must pass five gates.

Gate 1: A real decision question exists

Bad:

“Best safaris in Africa”

Good:

“Is July too crowded for a Masai Mara safari?”

Gate 2: The platform can issue a verdict

If the outcome would always be “it depends,” the page is forbidden.

Gate 3: There are at least two trade-offs

If no real trade-offs exist, the page is marketing fluff.

Gate 4: The page can produce change conditions

If nothing would change the verdict, the page is dishonest.

Gate 5: The page improves the internal decision graph

If it doesn’t link meaningfully to other decisions, it’s noise.

4. PAGE GENERATION INPUT MODEL (STRUCTURED)

You do not generate pages from keywords.
You generate them from decision objects.

Each page is created from a Decision Topic Record.

Decision Topic Record (example)
{
  "topic_id": "topic_tz_february",
  "question": "Is February a good time for a Tanzania safari?",
  "page_type": "decision",
  "destinations": ["Tanzania"],
  "time_context": {
    "month": "February"
  },
  "traveler_profiles": ["first_time", "family", "couple"],
  "primary_risks": [
    "rain_variability",
    "road_conditions",
    "migration_location_uncertainty"
  ],
  "key_tradeoffs": [
    "predictability_vs_privacy",
    "cost_vs_access",
    "route_flexibility_vs_drive_time"
  ],
  "eligible_outcomes": ["wait", "switch", "book"],
  "default_outcome": "wait",
  "confidence_range": [0.6, 0.8]
}


This record feeds:

AI generation

page structure

schema markup

internal linking

confidence language

5. HOW AI IS USED (IMPORTANT)

AI does not invent topics.
AI does not invent opinions.

AI is used only to:

explain an existing verdict

articulate trade-offs

clarify assumptions

generate FAQs from known objections

Forbidden AI uses

brainstorming “best places”

writing inspirational intros

expanding thin ideas

guessing outcomes

This keeps pages grounded and non-AI-ish.

6. PAGE ASSEMBLY PIPELINE (STEP BY STEP)
Step 1: Select Decision Topic Record

From your curated topic list (not keywords).

Step 2: Generate Decision Explanation

AI is called with:

fixed verdict

allowed outcome range

trade-offs

risks

AI fills:

summary

assumptions

trade-off explanations

change conditions

Step 3: Inject Structured Blocks

The page is assembled using the Decision Page Template:

Question (H1)

Verdict Card

Trade-off Ledger

Fit / Misfit block

“What people get wrong”

Decision detail sections

Change conditions

FAQ

Internal links

No free-form layout.

Step 4: Generate FAQs (bounded)

FAQs are generated from:

common objections

clarification requests

refusal reasons

Rules:

3–6 FAQs max

each answer < 80 words

no overlap with main content

Step 5: Apply Schema Markup

Automatically inject:

FAQPage schema (if FAQs exist)

Breadcrumb schema

Article schema (editorial tone)

Step 6: Internal Linking (non-random)

Links are chosen from the Topic Graph, not by AI creativity.

Example:

February Tanzania → March Tanzania

February Tanzania → Kenya February

February Tanzania → “Understanding shoulder season risk”

Step 7: Publish or Hold

If the page fails quality checks, it stays draft.

7. QUALITY CONTROL (ANTI-THIN CONTENT SYSTEM)

Before publishing, every page must pass these checks:

Mandatory checks

Verdict is explicit

At least 2 trade-offs

At least 2 assumptions

At least 2 change conditions

One “Not ideal for” list

Language checks

No hype words

No guarantees

No “best”, “perfect”, “ultimate”

No sales CTA

Length check

Not less than ~800–1,200 words unless the decision is genuinely narrow

Length comes from substance, not padding

8. WHY THIS RANKS (SEO + AEO)
For Google

Clear intent match

Structured answers

Original reasoning

High dwell time

Low pogo-sticking

For AI / AEO

Verdict-first answers

Conditional logic

Citable language

Neutral tone

AI models prefer:

“Safari Index recommends waiting rather than booking in February because…”

over:

“February can be a good time depending on your preferences…”

9. SCALE STRATEGY (SAFE GROWTH)
Phase 1: 10–20 pages

Core months

Core destinations

First-time travelers

Phase 2: 50–100 pages

Comparisons

Family vs couple

Timing shifts

Phase 3: 200+ pages

Edge cases

Revision pages

“What changed if…” content

You never mass-generate blindly.

10. WHAT THIS AVOIDS (VERY IMPORTANT)

This system avoids:

AI blog farms

keyword stuffing

“Top 10” nonsense

shallow guides

WordPress plugin dependency

content decay

Every page has a reason to exist.

11. DEFINITION OF DONE FOR SEO ENGINE

You are done when:

pages are generated from decision records

publishing is controlled, not automatic

pages link into each other logically

Google starts ranking pages for questions, not keywords

users land, read, and act

If pages rank but users don’t act, the system is wrong.

FINAL LOCK STATEMENT

Safari Index does not chase traffic.
It answers questions people are afraid to answer themselves.
Pages exist to reduce regret, not increase clicks.

Where we are now

You now have:

Constitutional governance

Architecture

Data model

MVP plan

AI prompts

Frontend templates

SEO engine logic

At this point, you can build.