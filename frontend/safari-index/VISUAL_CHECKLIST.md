# Visual Consistency Checklist

Pre-deployment visual regression checklist for Safari Index frontend.

## Access

- **URL**: `/dev/components` (development only)
- **Production**: Returns 404 unless `ENABLE_DEV_PAGES=true`

---

## Components to Verify

### VerdictCard

- [ ] **Book** outcome: Green left border, green badge
- [ ] **Wait** outcome: Amber left border, amber badge
- [ ] **Switch** outcome: Blue left border, blue badge
- [ ] **Discard** outcome: Gray left border, gray badge
- [ ] **Refused** outcome: Red left border, red badge
- [ ] Headline is semibold, gray-900
- [ ] Summary text is gray-600
- [ ] Confidence meter shows correct fill percentage
- [ ] Screen reader: Outcome announced correctly

### TradeoffLedger

- [ ] Two-column layout on desktop
- [ ] Single column on mobile
- [ ] "What you gain" has green bullet markers
- [ ] "What you lose" has red bullet markers
- [ ] Section headings are gray-500, uppercase, small

### FitMisfitBlock

- [ ] Two-column layout on desktop
- [ ] Single column on mobile
- [ ] "Right for" section lists items clearly
- [ ] "Not ideal for" section lists items clearly
- [ ] Gray-600 text color for list items

### AssumptionsBlock

- [ ] Numbered list (1, 2, 3...)
- [ ] Each assumption shows text
- [ ] Confidence indicator visible
- [ ] Low confidence (< 0.6) shows amber styling
- [ ] High confidence shows green styling

### ChangeConditions

- [ ] Yellow/amber background
- [ ] "This recommendation changes if:" header
- [ ] Bullet list of conditions
- [ ] Gray-700 text on amber-50 background

### AnswerOwnershipBlock

- [ ] Styled as blockquote with left border
- [ ] Quotable verdict text in semibold
- [ ] Attribution line: "Travelers should..."
- [ ] Invalidating condition stated clearly

### AttributionFooter

- [ ] Shows decision ID
- [ ] Shows logic version and answer version
- [ ] Timestamp formatted correctly
- [ ] Footer element with appropriate ARIA

### QualityGateFailure

- [ ] Red/error styling
- [ ] Clear headline about failure
- [ ] List of specific failures
- [ ] Decision ID shown for reference

### DecisionEmbed

- [ ] Compact card format
- [ ] Question shown at top
- [ ] Verdict headline prominent
- [ ] Confidence indicator
- [ ] "View full decision" link
- [ ] Copy link button functional
- [ ] Flagged state shows review banner

### DecisionFollowUp

- [ ] Checkbox unchecked by default
- [ ] Checkbox label: "Notify me if this decision changes"
- [ ] Email form appears when checked
- [ ] Submit button enabled with valid email
- [ ] Success state shows confirmation message
- [ ] Error state shows error message

### NextSensibleStep

- [ ] Clear step title
- [ ] Step description text
- [ ] CTA button with correct styling
- [ ] Different outcomes show appropriate suggestions

### RelatedDecisions

- [ ] Shows 3-5 links maximum
- [ ] Links are clickable
- [ ] Hover state visible
- [ ] Nav element with ARIA label

### CTABar

- [ ] Primary button prominent
- [ ] Secondary button (if present) less prominent
- [ ] Buttons stack on mobile
- [ ] Side by side on desktop

### Skeleton States

- [ ] Basic skeleton shows animated pulse
- [ ] SkeletonText shows multiple line placeholders
- [ ] SkeletonHeading shows heading placeholder
- [ ] SkeletonVerdictCard matches VerdictCard layout
- [ ] SkeletonSection shows section with content
- [ ] SkeletonEmbed matches embed layout
- [ ] SkeletonDecisionPage shows full page skeleton
- [ ] Animation respects prefers-reduced-motion

---

## Global Checks

### Typography

- [ ] Headings use correct sizes (text-2xl, text-xl, text-lg)
- [ ] Body text is gray-700
- [ ] Secondary text is gray-500 or gray-600
- [ ] No orphaned headings

### Spacing

- [ ] Consistent section margins (mt-8, mt-12)
- [ ] Consistent component padding (p-4, p-6)
- [ ] Logical visual hierarchy

### Colors

- [ ] Outcome colors consistent across components
- [ ] No jarring color transitions
- [ ] Sufficient contrast for accessibility

### Responsive

- [ ] All components readable on mobile (375px)
- [ ] All components work on tablet (768px)
- [ ] All components work on desktop (1024px+)

### Accessibility

- [ ] Focus states visible (2px solid outline)
- [ ] Skip link functional
- [ ] Screen reader content makes sense
- [ ] Reduced motion respected

---

## Sign-off

| Check | Date | Verified By |
|-------|------|-------------|
| Visual consistency | | |
| Mobile responsive | | |
| Accessibility | | |
| Skeleton states | | |
