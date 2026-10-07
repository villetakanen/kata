# Kata

![Kata logo](assets/kata.svg)

A small repertoire for making good slides. Kata helps an agent recognise the form
of information, choose a useful visual structure, and adapt it to the audience's
question.

**First iteration: five patterns, five worked before-and-after pairs, and an offline Lys deck.**

## Try it

Open [the visual gallery](examples/index.html) in a browser to compare the examples.
Open [the Lys deck](examples/kata-lys.html) to present them. Use the arrow keys to
move through all ten slides, or the top navigation to jump to an after example.
Both files work locally without a server or network connection. The deck is a
single file and can be copied on its own.

To use the guidance with an agent, ask:

> Read `skills/kata/SKILL.md` and use Kata to improve this slide. Preserve the
> supplied figures and choose the structure around the audience's question.

For persistent skill discovery, copy the entire `skills/kata` folder into your
agent's skills directory, such as `~/.codex/skills/kata`. The skill is self-contained;
its installation does not require the gallery, Node, Lys, or a brand skill. This
repository does not install anything automatically.

## The first five patterns

| Form | Pattern | Audience question |
| --- | --- | --- |
| [Comparison](skills/kata/references/comparison.md) | Aligned matrix | How do these options differ on common criteria? |
| [Composition](skills/kata/references/composition.md) | Whole and parts | Where does the total go? |
| [Hierarchy](skills/kata/references/hierarchy.md) | Nested groups | What belongs where? |
| [Relationship](skills/kata/references/relationship.md) | Directed dependencies | What must happen before what? |
| [Change over time](skills/kata/references/change-over-time.md) | Time series | What changed, by how much, and when? |

Each pattern includes when to use it, when it gets in the way, how to structure the
slide, a concrete example, and a review check. All example data is fictional. The
before slides retain the same source information as the after slides; the change
is in structure and the supported headline.

Gestalt ideas supply design analogies. This iteration does not claim empirical
validation for the layouts. General deck storytelling is outside its scope.

## Kata, Lys, and brand skills

Kata supplies information structure. Lys supplies slide behavior. An optional
brand skill supplies visual identity. See [integration notes](skills/kata/references/integration.md).

The example deck embeds the locally available Lys 1.2.1 runtime. Runtime provenance
is recorded in [the vendor notice](examples/vendor/NOTICE.md). The cream and rust
example theme is neutral; Futurice branding has not been supplied or tested.
There is no separate `kata-lys` package in this iteration.

## Work on the examples

Node 20 or newer is enough. There are no npm dependencies to install.

```sh
npm run build
npm run check
```

Edit [example data](examples/data.json), [the generator](scripts/build-examples.mjs),
or [the theme](examples/theme.css), then rebuild. Commit the generated HTML alongside
the sources so the examples stay usable immediately after checkout. The build runs
o network requests and makes no changes to the neighboring Lys project.

`npm run check` checks data invariants, linked skill references, slide structure,
unique IDs, navigation targets, and offline packaging. It does not replace visual
review. When changing layouts, inspect the gallery and deck in a browser, including
narrow viewports, keyboard navigation, no-JavaScript reading, and print layout.

## What comes next

Try the skill on real, messy slide material. Use those results to refine pattern
selection and the integration boundary before adding more patterns. A real brand
application and empirical evaluation remain future work.

The [original brief](docs/initial-brief.md) records the starting intent from
2 October 2026.
