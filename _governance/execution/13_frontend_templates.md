Frontend Page Templates for Safari Index

(Decision · Tool · Itinerary)
These templates are the UI constitution in practice. They prevent “vibe-coded layouts” from drifting into SaaS clichés, clutter, or sales tone.

Everything here is designed for:

verdict-first

one decision per screen

calm editorial pacing

AEO-ready structure

programmatic SEO pages at scale

0. Global UI rules (apply everywhere)
Layout rules

Single primary column for reading (max width enforced).

Whitespace is functional, not decorative.

No busy sections. If a section feels “full”, it is too full.

Typographic rules

Use 3 levels only:

Page Title

Section Heading

Body text

Avoid decorative typography. No “hero marketing” type ramps.

Interaction rules

One primary CTA per screen.

One secondary action allowed only if it is a defer action (Save, Wait, Revisit).

No popups on first view.

No sticky “Book now” bars.

Copy rules (microcopy)

Calm, specific, non-salesy.

No exclamation marks.

Never use hype words (from the Language Constitution).

Visual rules

Images are rare and purposeful.

No animal iconography for decoration.

Icons are functional labels only.

1. Shared components library (use across all pages)

These components are the building blocks that keep the site consistent.

A. Verdict Card (required)

Purpose: display decision outcome instantly, above the fold.

Contains:

Outcome label: Book | Wait | Switch | Discard | Refused

Headline (max 90 chars)

Summary (2–4 sentences)

Confidence indicator (subtle): “High, Medium, Low” (not numeric on UI)

Rules:

Must appear before any deep explanation.

Must not look like a promotional banner.

B. Trade-off Ledger (required for decision pages and tool outputs)

Purpose: show reality plainly.

Contains:

Gains list (2–5 bullets)

Losses list (2–5 bullets)

Rules:

No softening language.

No “but don’t worry” phrasing.

C. Fit / Misfit Block (required)

Purpose: stop wrong-fit conversions early.

Contains:

“Right for” bullets

“Not ideal for” bullets

D. Assumptions Block (required where decisions appear)

Purpose: enforce responsibility boundary.

Contains:

2–5 assumptions

Each is short, specific, testable

Rules:

Never hide assumptions in fine print.

E. Change Conditions (required)

Purpose: tell users what would change the verdict.

Contains:

2–4 “This changes if…” bullets

F. Single CTA Bar (required)

Purpose: one calm step forward.

Formats (choose one):

“Check fit for your dates”

“Generate a draft itinerary”

“Compare with another month”

“Request a decision report”

Secondary action allowed only as:

“Save and revisit later”

No other buttons.

G. Inline Evidence Notes (optional, restrained)

Purpose: add credibility without overwhelming.

Format:

One line, small text:

“In practice: roads can slow after sustained rain.”

“Common mistake: underestimating daily drive fatigue.”

No long citations on page. Keep it readable.

2. Template 1: Decision Page Template

(SEO and AEO core page)

URL pattern

/decisions/<topic-slug>
Example: /decisions/tanzania-safari-february

Primary goal

User leaves with a clear decision outcome or proceeds to a tool for personalization.

Page structure (fixed order)
1) Title + Context line

H1: clear question

One sentence context: why this question matters

Example:

Title: “Is February a good time for a Tanzania safari?”

Context: “February rewards flexibility, but it is uneven.”

2) Verdict Card (above the fold)

Mandatory.

3) Trade-off Ledger

Mandatory.

4) Fit / Misfit Block

Mandatory.

5) What people get wrong

Short section. 2–4 bullets max.

6) Decision detail sections (2–4 sections only)

Choose only what matters for the topic:

Timing and predictability

Crowds and vehicle density

Driving fatigue and routing risk

Cost pressure and availability

Do not add sections just to look complete.

7) Change Conditions

Mandatory.

8) Single CTA Bar

Primary CTA example:

“Check fit for your dates”

Secondary CTA:

“Save and revisit later”

9) FAQ (AEO)

3–6 questions max

Must be real user questions

Answers must be short and precise

10) Related decisions (internal linking)

3–5 links max

Must be contextually adjacent, not random

Decision Page states

Default state

Verdict shown

CTA to personalize

Refusal state
If the topic cannot be responsibly generalized:

Verdict Card shows Refused

Clarifies what input is needed

CTA becomes “Answer 2 questions to get a recommendation”

SEO requirements (built into template)

JSON-LD: FAQPage when FAQs present

Canonical URL always set

Breadcrumb schema

Clean headings (H1 once, H2 for sections)

No thin content. If the page is under-informative, do not publish it.

3. Template 2: Tool Page Template

(Fit Engine, Timing Verdict tool)

URL pattern

/tools/<tool-slug>
Example: /tools/safari-fit

Primary goal

Convert uncertainty into a stored decision object.

Tool page structure (fixed order)
1) Title + One-sentence definition

Example:

Title: “Safari Fit”

Definition: “Checks timing, pace, and constraints to produce a clear recommendation.”

2) What it does / does not do

Two short blocks:

Does:

clarifies fit

names trade-offs

recommends an action

Does not:

guarantee sightings

replace local conditions

force booking

3) Input panel (5 inputs ideal, 7 max)

Recommended inputs

Dates: fixed or month/year

Group size

Budget band (budget | fair value | premium)

Drive tolerance (hours per day)

Priority (density | privacy | comfort | pace)

Optional:

Children under 12 (yes/no)

Prior safari experience (first-time/repeat)

Rules

Inputs must be plain language.

Explain why each matters in one short line.

No open-ended text boxes except one optional “note”.

4) Submit

Button label must be calm:

“Get a recommendation”
Not “Start”, not “Go”.

5) Output screen (new state, not inline chaos)

After submit, show a clean result page section:

Verdict Card

Trade-off Ledger

Assumptions

Change Conditions

Single CTA Bar

Primary CTA options

If outcome = Book: “Generate a draft itinerary”

If outcome = Wait: “See what changes if you wait”

If outcome = Switch: “Generate a plan for the better fit”

If outcome = Discard: “Save this decision” (no pressure)

If refusal: “Answer 2 questions”

6) Save state

After output, user can:

Save decision

Copy link

Email to self (optional later)

No “share on social”. Keep it serious.

Tool states (required)

Idle

Input validation error (specific, calm)

Processing

Decision issued

Refusal

Revision (if user changes inputs)

Save confirmed

Error copy example:

“We need at least a month and year to evaluate season risk.”

Not:

“Oops.”

4. Template 3: Itinerary Page Template

(Decision anchor, conversion asset)

URL pattern

/itineraries/<itinerary-id-or-slug>
Example: /itineraries/itin_8c31…

Primary goal

Turn decision into a concrete plan that can be accepted, revised, or held.

Page structure (fixed order)
1) Itinerary header

Title

Duration, pace, style

Created date

Linked decision outcome

2) “This plan assumes” block (mandatory)

2–5 assumptions.

3) “Risks to be aware of” block (mandatory)

2–6 risks.

4) Overview map or route list (optional)

If map adds complexity, do route list instead.

5) Day-by-day plan (high-level)

Each day: Location + key activities

Keep it readable, not brochure-like

Avoid long prose

6) Inclusions / exclusions

Simple lists.

7) Decision Assurance block (if enabled)

Calm explanation:

what it is

what it includes

what it does not promise
CTA:

“Request a decision report”

8) Single CTA Bar

Primary CTA options:

“Confirm availability”

“Revise this plan”

“Hold and revisit later”

Only one.

9) Export

Download PDF

Copy link

No upsells.

Itinerary revision rules

Revisions create a new itinerary version.

UI shows:

“Version 2, revised because dates changed”

Never overwrite silently.

5. Homepage template

(because you will need it immediately)

Goal

Explain what Safari Index is in 10 seconds without sounding like a startup.

Structure

What Safari Index is (one sentence)

What it helps decide (3 examples)

How it works (3 steps, restrained)

Start with a decision (one CTA)

Trust posture (trade-offs, no guarantees, calm authority)

Homepage CTA:

“Start with a decision”

Not:

“Get started”

“Join now”

“Explore”

6. Navigation and IA

(keeps SEO and UX aligned)

Primary nav (max 4 items):

Decisions

Tools

Itineraries

About

Footer can contain:

Method

Boundaries

Contact

Avoid mega menus.

7. Content component constraints for programmatic pages

(prevents “AI-ish page factory” syndrome)

Every programmatic Decision Page must meet:

At least 1 specific trade-off ledger

At least 1 fit/misfit block

At least 2 change conditions

A verdict that is not generic

No filler section that says nothing

If a page cannot satisfy these, it stays draft.

8. What to build first (frontend scope for MVP)

Build these in order:

Decision Page template (published pages 1–3)

Tool Page template (one tool)

Output result screen (verdict + ledger + CTA)

Itinerary Page template (basic)

Save decision and share link

Do not build a full CMS UI yet. Use seeded content in DynamoDB.

9. Definition of done for frontend templates

You are done when:

Decision pages render with verdict above the fold

Tool produces a stored decision and renders output correctly

Itinerary renders from stored itinerary object

All pages obey one primary action per screen

No page looks like a SaaS landing page

Copy never sounds like marketing