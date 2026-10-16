# Kata

![Kata logo](assets/kata.svg)

Kata is a shared kit of compositional forms and practices for people and agents.
Start with what an item should communicate, then choose a form and adapt its
scale, alignment, grouping and space. The first repertoire covers **one focus**,
**equal peers**, and **a lead with support**, with concrete arrangements,
alternatives and trade-offs.

## Use the kit yourself

Read the [forms](skills/kata/references/composition.md): each has a brief, two
schematic arrangements using the same content, reasons to choose between them,
limits and narrow-view adaptation. The [shared practices](skills/kata/references/practices.md)
cover choosing a form, preserving authored material, and placing captions, labels,
qualifications, headings and footers. Use them in your own authoring tool or when
reviewing work with an agent. Both readers use the same material.

## Use it with an agent

Copy the entire [skills/kata](skills/kata/SKILL.md) folder into your agent's skills
directory, for example `~/.codex/skills/kata`. It contains four Markdown files:
the agent entry point, shared forms, shared practices and rendering integration.
It needs no repository, Node installation or Kata-specific theme. The skill
routes the agent into the same forms and practices you can read directly.

For a presentation, also supply a Lys authoring skill. Then ask:

> Use Kata and Lys to compose these supplied slides into a presentation.
> Preserve the wording and meaning. Choose the layouts, inspect the rendered
> deck, and deliver the finished HTML.

Supply the slide content and order, with the audience or purpose where useful.
You do not need to select layouts. The agent should resolve routine choices and
ask only when missing intent changes the meaning. A brand can be supplied too.

For a repository-local trial, ask the agent to read `skills/kata/SKILL.md` and
`.agents/skills/lys/SKILL.md`, then give it your content. The pinned Lys skill is
available here for development; it is not bundled in the portable Kata folder.

Kata preserves supplied wording, facts, uncertainty and associations. It arranges
charts, tables and diagrams with their surroundings without redesigning their
internal representation. It can recommend separating overloaded content, while
leaving content authorship and deck sequence to you. See [VISION.md](VISION.md).

## Open a working example

- [Example gallery](examples/index.html): seven real source slides recomposed,
  with an explanation and alternative for each composition.
- [Standalone Lys presentation](examples/presentation/deck.html): open locally,
  use arrow keys, Home and End on desktop, or scroll on a phone. The HTML embeds
  its runtime and fonts and can be copied on its own.
- [Source material and verification](examples/presentation/README.md): the public
  presentation sample, frozen inputs, provenance, inspected modes and limits.
- [Fresh-context trial](evals/usable-deck/README.md): a separate agent receives
  different source content and the portable skill, without the worked example
  or the development conversation.

The worked example is a **historical excerpt** from Crown Commercial Service's
25 February 2020 supplier briefing. It preserves selected source slides and is
not current procurement guidance. Kata supplies the composition; Lys renders it.
The adopted [visual foundation](examples/design-system/index.html) supplies this
repository's identity. Work made with Kata can use other identities.

## Develop from experience

Use the kit on a real presentation. When something needs improvement, keep the
input, the resulting slide and the desired correction. Change the smallest useful
part of the shared material and check it against that case. Keep forms and practices
publishable for people and agents as they develop. The [roadmap](docs/plans/ROADMAP.md) describes
the bounded first delivery and this approach to subsequent work.

Node 20 or newer; no npm dependencies to install:

```sh
npm run build
npm run check
```

The current example's [content](examples/presentation/content.json),
[theme](examples/presentation/theme.css) and [builder](scripts/build-presentation.mjs)
generate the gallery and deck. Include generated HTML after rebuilding. Builds
make no network requests. Checks cover source fidelity, portable references,
offline packaging, deterministic freshness and retained historical artifacts.
Visual verification remains necessary after rendered changes; see [AGENTS.md](AGENTS.md).

## Project history

The [old catalogue](examples/catalogue.html), [old field guide](examples/field-guide.html),
[communication studies](examples/communication/index.html) and
[design studies](examples/studies/index.html) are retained as historical material.
Some earlier examples author or restructure information beyond Kata's present
scope. Their [frozen guidance](docs/history/catalogue/SKILL.md) is not the installed
skill. Earlier [release records](docs/releases/0.4.0.md) describe what shipped then.

Kata uses [ASDLC.io](https://asdlc.io) as a pattern library for development harness
engineering. Internal development skills live in `.agents/skills/`; the portable
product lives only in `skills/kata/`. The [original brief](docs/initial-brief.md)
records the starting idea.
