# Kata development harness

A layout language for helping people and agents arrange supplied content in
visual forms that support its message. Built with [ASDLC.io](https://asdlc.io)
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
| Rebuild examples | `npm run build` | `scripts/build-examples.mjs` |
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

- Arrange supplied content around the audience's question; explain useful layout alternatives and trade-offs.
- Preserve supplied meaning, quantities, uncertainty, and meaningful relationships while arranging and reflowing it.
- Distinguish empirical evidence, design judgment, and perceptual analogies.
- Support specific psychology claims with relevant research and its limits.
- Keep Kata responsible for placement, grouping, emphasis, and reading order; Lys for rendering; and brands for identity.
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

No project-local development skills or persistent subagent configurations are
defined yet. Add them when a concrete workflow benefits from reuse.
