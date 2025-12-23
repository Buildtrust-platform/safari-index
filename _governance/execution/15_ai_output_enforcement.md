# AI Output Enforcement Rules  
Safari Index  
Status: LOCKED  
Version: 1.0

This document defines the mandatory runtime checks that every AI-generated output
must pass before it can be returned to a user or persisted.

If an output fails any rule below, it must be rejected and regenerated.

These rules override AI defaults, politeness, and verbosity preferences.

---

## 1. Verdict Singularity Rule (NON-NEGOTIABLE)

Every decision output must contain exactly one outcome:

- book
- wait
- switch
- discard
- refused

The output MUST NOT:
- present multiple valid outcomes
- suggest parallel paths
- frame decisions as “equally acceptable”

### Hard fail if any of these appear:
- “both options”
- “either could work”
- “it depends equally”
- “you may choose”
- “another option is”

---

## 2. Verdict Presence & Placement

A decision output is invalid if:
- no verdict is present
- the verdict is buried in explanation
- the summary contradicts the verdict

The verdict must be:
- explicit
- consistent
- reinforced throughout the output

---

## 3. Assumption Integrity Rule

Every decision must include 2–5 assumptions.

Each assumption must:
- be concrete
- be testable or falsifiable
- reference a real constraint (dates, budget, pace, tolerance)

### Hard fail if assumptions contain:
- vague language (“flexible”, “open-minded”, “adventurous”)
- personality traits
- emotional framing

---

## 4. Trade-off Ledger Requirement

Every decision must include at least one trade-off with:

- explicit gains
- explicit losses

Trade-offs must describe:
- what improves
- what worsens

### Hard fail if:
- only positives are listed
- losses are softened or dismissed
- trade-offs are implied but not stated

---

## 5. Change Condition Requirement

Every decision must list 2–4 change conditions.

Change conditions must:
- describe what input change alters the verdict
- not repeat assumptions verbatim

### Hard fail if:
- no change conditions exist
- change conditions are hypothetical or vague
- change conditions promise certainty

---

## 6. Confidence Calibration Rule

Each decision must include a confidence score (0–1).

Confidence must be:
- proportional to input completeness
- reduced when assumptions are weak
- reduced when uncertainty is high

### Hard fail if:
- confidence is high (>0.8) with weak inputs
- confidence language contradicts score

---

## 7. Language Enforcement (Tone & Authority)

AI output MUST NOT contain:

- hype or promotional language
- reassurance phrases
- emotional encouragement
- motivational framing

### Forbidden language includes:
- “you’ll love”
- “perfect choice”
- “ideal for you”
- “great option”
- “amazing”
- “memorable”
- “unforgettable”

Tone must remain:
- calm
- observational
- analytical

---

## 8. Refusal Enforcement

AI must refuse when:
- inputs conflict in practice
- key inputs are missing
- risk cannot be bounded
- guarantees are requested

Refusal output must:
- state the reason
- list missing or conflicting inputs
- suggest one safe next step

### Hard fail if:
- AI “tries anyway”
- AI offers suggestions after refusing
- refusal is softened with reassurance

---

## 9. Clarification Constraint

Clarification is allowed only when:
- it materially affects the decision
- no more than 3 questions are asked

Clarification must:
- explain why each question matters
- avoid open-ended discovery

---

## 10. Output Structure Enforcement

Output must:
- be valid JSON
- match the expected schema exactly
- contain no commentary, markdown, or explanations outside fields

### Hard fail if:
- JSON is invalid
- extra keys appear
- text exists outside schema

---

## 11. Regeneration Protocol

If any rule fails:

1. Reject the output
2. Re-prompt AI with:
   “Your output violated Safari Index enforcement rules. Regenerate a compliant output.”
3. Do not relax constraints
4. Log the failure for review

Repeated failures should:
- downgrade AI confidence
- trigger review thresholds

---

## 12. Authority Preservation Rule (FINAL)

If there is a choice between:
- being helpful
- being correct

The system must choose correctness.

If there is a choice between:
- answering
- refusing

The system must refuse when risk is asymmetric.

---

End of document.
