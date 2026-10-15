# Kata development harness

A language of forms helping people and agents make deliberate compositional
choices in service of communication, beyond merely readable arrangements. Built with [ASDLC.io](https://asdlc.io)
as the pattern library for harness engineering, with demos and test examples
rendered via [Lys](https://villetakanen.github.io/lys/).

## Context to load when relevant

- [VISION.md](VISION.md): purpose, form affordances, trade-offs, and evidence boundaries.
- [README.md](README.md): current capabilities, installation, and example workflow.
- [Roadmap](docs/plans/ROADMAP.md): planned work and unresolved decisions.
- [Kata skill](skills/kata/SKILL.md): delivered guidance; read the relevant pattern when editing it.
- [Integration](skills/kata/references/integration.md): responsibilities of Kata, Lys, and brands.

## Toolchain

Node 20 or newer; commands and runtime requirements live in [package.json](package.json).

| Intent | Command | Implementation |
| --- | --- | --- |
| Rebuild examples | `npm run build` | `scripts/build-examples.mjs`, `scripts/build-communication.mjs` |
| Check the project | `npm run check` | `scripts/check.mjs` |

Rebuild after changing example data, generator, or theme; include generated HTML.
Run the checks after changes. For visual changes, also inspect the gallery and
deck at presentation and phone sizes, with keyboard navigation, no JavaScript,
and print. Report what was inspected and any remaining verification gaps.
Deliver demos as Lys decks. Before creating or changing one, read the pinned
[Lys authoring skill](.agents/skills/lys/SKILL.md); its provenance and deliberate
copy-and-review update process are in the same directory. The harness check
verifies the pin and its local resources; normal work must not fetch moving
upstream instructions.

## Project judgment

- Start with what a single presentation item should communicate: intended understanding and expressive character. Read VISION.md before changing the repertoire or its guidance.
- Offer considered compositional alternatives even when the current layout is readable. Explain the communicative role of whitespace, tension, balance, restraint, proximity, contrast, and dominance where relevant; avoid automatic defaults.
- Treat the 0.3.0 catalogue as an artifact to reassess, not the definition of Kata. Follow the 0.4.0 plan when realigning the delivered skill and demos.
- Keep the unit to one presentation item through 1.0.0. Recommending separate items is allowed; sequencing, timing, and narrative orchestration are outside scope.
- Leave content authorship and internal representation to the author: do not turn prose into process steps or redesign a supplied chart. Understand communicative roles sufficiently to compose the supplied material.
- Preserve supplied meaning, quantities, uncertainty, and meaningful relationships while arranging and reflowing it.
- Distinguish empirical evidence, design judgment, and perceptual analogies.
- Support specific psychology claims with relevant research and its limits.
- Keep Kata responsible for composition in service of communication; Lys for rendering; and brands for identity. Expressive compositional choices remain part of Kata within brand constraints.
- Treat plans as proposed work; describe capabilities as available only when implemented.
- Resolve routine choices from context; ask when missing information changes the meaning.

## Internal tools and delivered skills

`skills/kata/` is the delivered, self-contained product. Keep its instructions
and required resources portable when that directory is copied on its own.

Place development skills in `.agents/skills/kata-dev-<task>/SKILL.md` when needed.
Name them for the task and describe their trigger, inputs, and expected result.
Keep their procedures there; list only names and triggers in this file.
The pinned upstream Lys skill in `.agents/skills/lys/` is separate from these
project-authored development skills.
Keep tool-specific subagent configuration in the tool's hidden configuration
directory, with shared task instructions referenced instead of duplicated.
Internal skills and agent configuration belong to the development harness;
exclude them from the delivered Kata skill and its installation instructions.

When using subagents, give each a bounded task, relevant context, and a clear
expected result. The coordinating agent reviews and integrates their work.

- `kata-dev-increment`: bounded implementation or independent review with explicit file ownership and verification evidence.
- `kata-dev-study`: create or revise a design study with alternatives, provenance and owner decisions.
- `.pi/agents/kata-worker.md`: pi delegation adapter for that shared development skill.
