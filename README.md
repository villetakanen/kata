# Kata

![Kata logo](assets/kata.svg)

*A language of forms for thought.*

Kata is a language of forms, shapes, and patterns for thinking with ideas and
presenting them visually. It helps people and language models choose and adapt
a form to the situation: what needs to be understood, by whom, and in what
medium. Forms make some relationships, comparisons, or priorities easier to
see and others harder to express. Kata explains these affordances and trade-offs
so each choice can be reasoned about rather than treated as a universal rule.

Kata's vision spans post-its, slides, diagrams, and other visual layers. This
release puts that direction into practice as a small repertoire of slide
patterns, with worked examples and guidance for choosing a useful structure
around the audience's question.

**Kata 0.2.0: six patterns, seven worked before-and-after pairs, and an offline Lys deck with 14 slides.**

The sixth pattern, golden cut, gives one already-supported message more space
beside its evidence or qualification. The [choice framework](skills/kata/SKILL.md)
also explains when to adapt a pattern, separate questions, or say that none of
the catalogue fits.

## Try it

Open [the visual gallery](examples/index.html) in a browser to compare the examples.
Open [the Lys deck](examples/kata-lys.html) to present them. Use the arrow keys to
move through all 14 slides, or the top navigation to jump to an after example.
Both files work locally without a server or network connection. The deck is a
single file and can be copied on its own.

To use the guidance with an agent, ask:

> Read `skills/kata/SKILL.md` and use Kata to improve this slide. Preserve the
> supplied figures and choose the structure around the audience's question.

For persistent skill discovery, copy the entire `skills/kata` folder into your
agent's skills directory, such as `~/.codex/skills/kata`. The skill is self-contained;
its installation does not require the gallery, Node, Lys, or a brand skill. This
repository does not install anything automatically.

## Patterns

| Form | Pattern | Audience question |
| --- | --- | --- |
| [Comparison](skills/kata/references/comparison.md) | Aligned matrix | How do these options differ on common criteria? |
| [Composition](skills/kata/references/composition.md) | Whole and parts | Where does the total go? |
| [Hierarchy](skills/kata/references/hierarchy.md) | Nested groups | What belongs where? |
| [Relationship](skills/kata/references/relationship.md) | Directed dependencies | What must happen before what? |
| [Change over time](skills/kata/references/change-over-time.md) | Time series | What changed, by how much, and when? |
| [Golden cut](skills/kata/references/golden-cut.md) | Asymmetric composition | What is primary, with context beside it? |

Each pattern includes when to use it, when it gets in the way, how to structure the
slide, a concrete example, and a review check. All example data is fictional. The
before slides retain the same source information as the after slides; the change
is in structure and the supported headline.

The patterns describe when a form can help and when it gets in the way. Their
rationales distinguish design judgment and Gestalt analogies from empirical
evidence; they do not claim that these layouts or Kata have been empirically
validated. Specific claims about perception or psychology should be supported
by relevant research and presented with its limits. General deck storytelling
is outside this release's scope. The golden cut uses 61.8/38.2 only as an
optional spatial proportion; it does not encode quantities or establish
preference or comprehension.

## Kata, Lys, and brand skills

Kata supplies information structure. Lys supplies slide behavior. An optional
brand skill supplies visual identity. See [integration notes](skills/kata/references/integration.md).

Slides are Kata's first test medium, not a restriction to one screen shape:
Lys can render slide content in different formats, including vertical phone
screens. The projects are intended to inform each other closely: Lys uses Kata
to choose layouts, and Kata uses Lys to demonstrate its forms in realistic
examples. This relationship is a direction for the projects to develop
together, not a claim that a packaged integration already exists.

The example deck embeds the locally available Lys 1.2.1 runtime. Runtime provenance
is recorded in [the vendor notice](examples/vendor/NOTICE.md). The cream and rust
example theme is neutral; Futurice branding has not been supplied or tested.
There is no separate `kata-lys` package in this release.

## Kata and ASDLC.io

[ASDLC.io](https://asdlc.io) is our pattern library for harness engineering:
it documents concepts, patterns, and practices for engineering with agents.
We use its guidance to develop Kata's agent instructions and internal workflows.
Kata's delivered skill supplies a focused vocabulary for choosing visual forms
and presenting information.

Development guidance lives in [AGENTS.md](AGENTS.md); `CLAUDE.md` links to the
same file. Internal development skills, when added, live under `.agents/skills/`
with `kata-dev-` names. The delivered skill lives in `skills/kata/`.

## Work on the examples

Node 20 or newer is enough. There are no npm dependencies to install.

```sh
npm run build
npm run check
```

Edit [example data](examples/data.json), [the generator](scripts/build-examples.mjs),
or [the theme](examples/theme.css), then rebuild. Commit the generated HTML alongside
the sources so the examples stay usable immediately after checkout. The build runs
no network requests and makes no changes to the neighboring Lys project.

`npm run check` checks the harness instructions, data invariants, linked skill
references, slide structure, unique IDs, navigation targets, and offline
packaging. It also checks versioned evaluation cases and runner protocol
success and failure paths without invoking model CLIs. It does not replace
visual review. When changing layouts, inspect
the gallery and deck in a browser, including narrow viewports, keyboard
navigation, no-JavaScript reading, and print layout.

## Evaluation

The versioned cases, shared run contract, CLI adapters, and Lys artifact checks
are under [evals](evals/runner/README.md). The [0.2.0 evaluation report](docs/evals/report.md)
records outcomes separately for Claude Code, Codex CLI, and pi. The report
distinguishes agent review and automated artifact checks from human reader
feedback; it does not claim improved comprehension from generated slides.

## Roadmap

See the [Kata roadmap](docs/plans/ROADMAP.md) for planned work and open questions.

The [original brief](docs/initial-brief.md) records the starting intent from
2 October 2026.
