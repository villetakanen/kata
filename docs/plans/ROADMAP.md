# Kata roadmap

This document is a place to discuss direction and next steps. It distinguishes
the current project from agreed plans and questions that still need decisions;
it is not a promise about delivery dates.

## Current

The first iteration is a small slide-pattern repertoire: five patterns, worked
before-and-after examples, an offline gallery and Lys deck, and an agent skill
for choosing and adapting a pattern. Its examples use fictional data. See the
[README](../../README.md) and the project [vision](../../VISION.md).

## Planned: 0.2.0

The [redesigned 0.2.0 plan](0.2.0.md) is planned. It focuses the release on
three outcomes:

- Give people and agents a clear framework to choose, adapt, or reject a visual
  pattern and explain the trade-off.
- Add the golden cut as an optional asymmetric-composition pattern, with
  explicit fit and mismatch examples and no unsupported claims about beauty or
  comprehension.
- Evaluate the guidance through Lys using repeatable briefs and a common runner
  for Claude Code, Codex CLI, and pi, recording fidelity, failures, and reader
  outcomes where available.

The scope keeps the five current data patterns and adds the golden cut as a
sixth pattern. It defers brand-specific and temporal demonstrations unless the
evaluation exposes a concrete need. These are planned outcomes, not current
capabilities; see the plan for runner requirements, evaluation criteria, and
completion checks.

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
