# Communication-choice pilot review

15 October 2026. Agent review, not owner acceptance or a reader study.

## Result and disposition

The candidate shows a useful local change in recommendation hierarchy, but this
trial does not establish an overall improvement in compositional judgment.
Keep the candidate in this experiment; the two edited portable skill files have
been restored to the frozen baseline. No catalogue replacement or version bump.

| Brief | Baseline | Candidate | Assessment |
| --- | --- | --- | --- |
| Equal consideration | Equal columns in a shared table; common criteria align directly | Equal-size cards; attributes repeat inside each | Both express equality. No demonstrated composition gain. Candidate phone view stacks long cards; baseline retains a narrow table with more wrapping. |
| Supplied recommendation | Equal-width cards, Station hall border/badge, recommendation and reason below the options | Recommendation and reason above the options; Station hall gets a wider desktop area; alternative stays visible | Candidate better prioritises the answer, particularly on phones. Baseline also responds to the changed intent; it is not indifferent to the brief. |

The candidate's recommendation headline (“Station hall is the provisional
recommendation”) is newly authored. It is supported by the brief, but violates
the supplied-wording boundary of this trial and the skill's no-authorship scope.
The exact recommendation sentence is also retained, so this is not a fabricated
claim or missing approval caveat. The baseline adds smaller organising labels
as well. Neither output merits a strict claim of no added wording.

All four retain venue values, access details, storage constraints and cost scope.
Both recommendation outputs retain the exact supplied recommendation, reason and
“booking is not approved”. The candidate names a compositional trade-off; the
baseline's decision records mainly restate venue trade-offs. Better explanation
is useful, but not sufficient evidence of better composition.

Familiar cards, borders and badges remain prominent in both recommendation
outputs. Do not mistake the candidate's departure from the table for progress,
or its larger headline for proof of deliberate judgment. No need for a new form
name was established by this pilot.

## Verification

All four CLI attempts succeeded and passed the existing evaluation contract/Lys
structural checker. Frozen inputs, hashes, model request, output and logs are in
`evals/results/communication-choice/choice-{baseline,candidate}/`.

Reviewed all four at 1440×900 and 390×844, and all four first-page PDF rasters.
No horizontal page overflow was measured. Content is present without JavaScript;
phone views remain readable, with the noted comparison trade-offs. Each output
is one slide: there is no multi-slide navigation to test. Tab inspection ended
on BODY, so this review does not certify a meaningful keyboard focus treatment.
Print retains the supplied information; candidate recommendation print changes
proportions and line lengths relative to desktop. These are inspected artifacts,
not corrected examples; no generated output was repaired after the runs.

Only one requested model (gpt-6-luna), one run per cell and one unfamiliar content
set were used. No causal/statistical conclusion, cross-model result, ChatGPT or
Cowork validation, screen-reader session, physical-device or printer claim.
The evaluator is also the change author; independent review has not occurred.

## What this answers

The old skill already distinguishes equal consideration from a supplied
recommendation on this straightforward brief. The small candidate edit can make
intent more prominent, but it has not solved the tendency toward arbitrary,
familiar layouts. This is evidence against treating catalogue wording cleanup
alone as a completed 0.4.0 product improvement. Further changes should follow a
specific observed failure, not an expansion of the catalogue.
