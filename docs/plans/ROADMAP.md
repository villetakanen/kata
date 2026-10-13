# Kata roadmap

This document is a place to discuss direction and next steps. It distinguishes
the current project from agreed plans and questions that still need decisions;
it is not a promise about delivery dates.

## Current: 0.3.0

Kata arranges supplied content: placement, available space, grouping, reading
order, and emphasis supported by the brief. It can retain a suitable existing
layout. Content authorship, rewriting, internal chart/table redesign, and
inference of information relationships are outside the current responsibility.
See the [README](../../README.md) and [project vision](../../VISION.md).

The [0.3.0 release](../releases/0.3.0.md) adds a six-slide offline Lys
[field guide](../../examples/field-guide.html), with a visible specimen, fit,
limitation, and reference for every current form. Shared
[layout assessment](../../skills/kata/references/layout-assessment.md)
consolidates checks across forms. The development harness includes pinned Lys
authoring guidance compatible with the vendored 1.2.1 runtime, separate from
the portable Kata skill.

The six forms and seven before-and-after pairs (14 slides) from 0.2.0 remain.
These historical specimens include information-authoring examples beyond the
current scope; their presence does not authorize those tasks. The existing
versioned evaluation corpus, three CLI adapters, and runner checks remain.
The [0.3.0 plan](0.3.0.md) records the release rationale and acceptance criteria;
the [review record](../evals/0.3.0-review/README.md) records verification and
limitations.

## Evidence boundaries

The field guide is an authored demonstration and dogfooding fixture. It is not
an independent measure of agent behavior or reader comprehension.
Baseline-versus-candidate model runs are deferred until a specific behavior
question calls for them. The original 27-attempt matrix and separate
nine-attempt corrective check remain independently reported in the
[0.2.0 evaluation](../evals/report.md). The corrective check changed both prompt
and skill, so it cannot isolate the skill's effect. No independent reader
outcomes were collected.

The golden cut is an optional asymmetric composition. Its 61.8/38.2 proportion
does not encode quantities or establish preference or comprehension. Kata is
not a general deck storytelling system or a packaged Kata-Lys integration.
Brand-specific work remains untested. The six forms' long-term fit with the
supplied-content boundary remains unresolved; this release does not expand or
remove the catalogue. Future scope decisions must update the affected living
materials together.

[Out-of-scope work](out-of-scope.md) records information-structure research,
content-authoring questions, separate harness improvements, and Lys-owned
follow-ups. Whether graphs, flows, tiers, and relationship semantics belong in
Kata needs substantial study. These items are unscheduled, may remain outside
Kata, and are not 0.3.0 dependencies.

## Questions for the next discussion

Slides remain the first test medium. Lys can render slide content in different
formats, including vertical phone screens, so the next step can test how forms
work across screen shapes without abandoning a practical, inspectable artifact.

Kata and Lys are intended to develop together:

- Lys uses Kata to choose layouts.
- Kata uses Lys to demonstrate forms in realistic examples.

This should be a feedback loop: using Kata in Lys tests whether the layout
guidance is useful, and Lys gives Kata concrete demonstrations that can
improve its patterns and examples. The exact integration points and sequence of
work remain to be decided; this roadmap does not imply that an integration is
already implemented.

Kata also has a clear place alongside [ASDLC.io](https://asdlc.io), our pattern
library for harness engineering. ASDLC.io gives the broader agentic engineering
context; Kata contributes visual-form and layout patterns that a harness can
use when an agent needs to present information. Decide how the projects should
cross-reference and demonstrate this relationship as the Kata–Lys work develops.

Other questions to resolve before committing to a next release:

- Which Lys output formats should be used first to test the forms, and what
  should stay stable or adapt as the screen shape changes?
- Which Lys use case is the strongest first demonstration of Kata-guided
  layout, and how should its results feed back into Kata?
- Where should ASDLC.io point to Kata, and what is the most useful example of a
  harness using Kata to choose and present a visual form?
- What evidence is practical and meaningful for evaluating the guidance: task
  fidelity, reader understanding, model consistency, or some combination?
- Which forms or situations are genuinely missing from the current repertoire,
  based on use with unfamiliar material?
- What criteria should explain a form's affordances and trade-offs consistently
  without turning them into fixed layout rules?

Keep these as questions until evidence or a project decision resolves them.
