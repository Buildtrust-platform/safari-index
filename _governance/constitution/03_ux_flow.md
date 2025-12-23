UX & Task Flow Constitution

(Guidance · Restraint · Cognitive Load Control)

1. PURPOSE OF THIS DOCUMENT

This document defines how users are guided, constrained, and protected as they move through the platform.

It exists to prevent three silent failures:

Cognitive overload

False choice

Decision avoidance disguised as exploration

Without this constitution:

UX becomes opinion-driven

features pile up

users feel “busy” instead of confident

the platform drifts toward aggregator behavior

This document ensures the product ends decisions instead of extending them.

2. CORE UX PRINCIPLE (NON-NEGOTIABLE)

The platform removes decisions before asking users to make them.

If a screen asks the user to choose something the system could reasonably infer or decide, the screen is wrong.

3. DEFINITION OF UX (DICTIONARY)
UX (as defined here)

UX is not:

aesthetics

delight

speed alone

clever interactions

UX is:

reduction of cognitive load

removal of unnecessary responsibility

guidance toward clarity

protection from premature commitment

Task

A task is any action the user must consciously complete:

selecting

choosing

comparing

confirming

deciding

Every task consumes trust capital.

Flow

A flow is a sequence of screens that:

begins with uncertainty

ends with clarity

has no unnecessary branching

If a flow ends without clarity, it is incomplete.

4. THE “ONE DECISION PER SCREEN” LAW

Each screen may ask the user to make one meaningful decision only.

Not:

multiple filters

several CTAs

competing actions

secondary “just in case” paths

Allowed

one primary action

one optional defer action (“wait”, “save”, “revisit”)

Forbidden

dual primary CTAs

distracting side actions

exploration detours mid-flow

If a screen feels “busy”, it is violating this law.

5. THE VERDICT-FIRST RULE
Rule

Every meaningful screen must surface a verdict before explanation.

Explanation without verdict:

increases anxiety

invites doubt

prolongs indecision

Correct pattern

Verdict

Context

Trade-offs

Next step

Incorrect pattern

Context → context → options → more context → CTA

That is how people abandon.

6. THE ANTI-FILTER DOCTRINE

Filters feel empowering but offload responsibility onto the user.

Therefore:

The platform does not expose large filter sets

The system applies constraints silently

The user is told what was removed and why

Correct

We removed options involving daily drives longer than five hours, based on what you told us.

Incorrect

Filter by drive time, accommodation class, park, region, season…

7. INPUT MINIMIZATION LAW
Rule

The platform asks only for information that materially changes the recommendation.

Inputs must satisfy at least one:

eliminate options

change trade-offs

change timing

change risk

If an input does not change the outcome, it is forbidden.

Maximum inputs per flow

Absolute maximum: 7

Ideal: 5 or fewer

If more information is needed, the platform must pause and explain why.

8. FRICTION IS A TOOL, NOT A BUG

The platform is allowed to introduce friction only to:

prevent premature decisions

slow unrealistic expectations

surface responsibility

Example (Correct friction)

Before proceeding, note that this choice assumes tolerance for long daily drives.

This slows, but protects.

Example (Incorrect friction)

unnecessary confirmations

decorative animations

progress bars without meaning

9. THE “NO DEAD ENDS” RULE

Every flow must end in one of four outcomes:

Book

Wait

Switch

Discard

If a user exits without one of these, the flow failed.

10. HESITATION IS A STATE, NOT A FAILURE
Rule

Hesitation is respected, not punished.

The platform must:

normalize waiting

explain consequences of waiting

preserve context

allow return without penalty

Forbidden behaviors

countdown timers

artificial urgency

“only X spots left” unless factual and explained

repeated nudges without condition change

11. RETURNING USER RECOGNITION LAW

When a user returns, the platform must:

remember prior context

acknowledge previous conclusions

avoid asking the same questions again

Correct

Last time, timing was the main concern. That has now shifted.

Incorrect

Start over.

12. ERROR & UNCERTAINTY HANDLING IN UX

Errors are framed as insufficient information, not mistakes.

Correct

We don’t have enough information to make a reliable recommendation yet.

Incorrect

Something went wrong.

13. HOW AI IS CONSTRAINED BY THIS UX CONSTITUTION

AI-generated interfaces and flows must:

reduce choices

end with a verdict or refusal

avoid branching suggestions

never overwhelm with options

AI is not allowed to:

brainstorm paths

ask open-ended exploratory questions mid-flow

offer “things you might like” lists

AI output must conform to flow discipline, not creativity.

14. EDGE CASE COMPASS

When choosing between:

adding flexibility

adding guidance

Always choose guidance.

When choosing between:

speed

clarity

Always choose clarity.

When choosing between:

user control

responsibility transfer

Always choose responsibility transfer.

15. CROSS-REFERENCES

This document is subordinate to:

Brand Voice & Language Constitution

Decision Philosophy & Responsibility Doctrine

This document governs:

All UX flows

All tools

All forms

All interactive components

All AI-driven experiences

16. FINAL LOCK STATEMENT

We do not design for exploration.
We design for resolution.
We remove burden before offering choice.
We slow users down only to protect them.
Every interaction must end in clarity.

Status

LOCKED — Version 1.0

No screen, feature, or flow may violate this constitution.