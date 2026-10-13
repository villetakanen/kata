# Kata roadmap

This document is a place to discuss direction and next steps. It distinguishes
the current project from agreed plans and questions that still need decisions;
it is not a promise about delivery dates.

## Current: 0.2.0

Kata 0.2.0 implements six slide patterns, seven worked before-and-after pairs,
an offline Lys deck with 14 slides, and a portable framework for choosing,
adapting, or rejecting a form. It also includes a versioned evaluation corpus,
three CLI adapters, Lys validation, and runner regression checks. See the
[README](../../README.md), [evaluation report](../evals/report.md), and
[project vision](../../VISION.md).

The original 27-attempt matrix and separate nine-attempt corrective check are
reported independently in the [evaluation report](../evals/report.md). The
corrective check changed both the shared task prompt and the candidate skill,
so it cannot isolate the skill's effect. No independent reader outcomes were
collected; the results do not establish improved comprehension or preference.
The report includes source-text and visual review, automated checks, print
failures, and evidence limits.

## Evidence boundaries

The golden cut is an optional asymmetric composition. Its 61.8/38.2 proportion
does not encode quantities or establish preference or comprehension. The six
patterns are slide guidance with worked Lys examples, not a general deck
storytelling system or a packaged Kata-Lys integration. Brand-specific work
remains untested.

## Proposed: 0.3.0

The [initial 0.3.0 plan](0.3.0.md) responds to the Lys-side migration
evaluation supplied on 12 October 2026. Its scope is layout around supplied
content: retaining suitable arrangements, placing content and qualifications,
and applying emphasis when priority is supplied. General assessment guidance
would live in a shared reference used across forms, with the number-and-context
case as a small illustration rather than a golden-cut-specific feature.
The main focus area is a Lys field-guide PoC: each current form is visibly
demonstrated on a slide that also explains where it works and its limits.
The deck serves as dogfooding, a demo, and a reproducible review fixture,
alongside the guidance tasks. Verification covers every form, agreement with
the skill references, automated artifact checks, and presentation, phone,
keyboard, no-JavaScript, and print review. Baseline-versus-candidate model runs
are deferred until a specific agent-behavior question calls for them.

The plan also includes aligning the README, vision, development instructions,
delivered skill, and other living materials with that current scope. A later
scope change should update those materials as part of the same decision.
Before demo authoring, the local harness will gain a checked-in, version-pinned
Lys skill and its required resources, compatible with the vendored runtime,
with `AGENTS.md` directing agents to use it for demo decks. This development
dependency stays outside the portable Kata skill.

Prose, videos, infographics, and tables are treated as supplied content.
Creating or internally redesigning them is intentionally outside this release.
The six existing patterns remain; their long-term fit with this boundary is
unresolved. The draft does not expand the catalogue or implement these changes.

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
