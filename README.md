# Kata

![Kata logo](assets/kata.svg)

*A language of forms for thought.*

Kata helps people and agents make deliberate compositional choices, beyond
merely producing a readable arrangement. Start with **what should this item
communicate?** That includes intended understanding and expressive character.
Whitespace, tension, balance, restraint, proximity, contrast, and dominance
help give supplied content a considered form.

The unit through 1.0.0 is one presentation item, such as a slide, poster, or
book cover. Slides are the first test medium. Kata arranges supplied content;
its authorship and internal representation remain with the author. See
[VISION.md](VISION.md) for the agreed direction and boundaries.

**0.4.0 released:** [GitHub release](https://github.com/villetakanen/kata/releases/tag/v0.4.0). This increment clarifies
Kata's direction and delivers visual foundations, design studies, a living design
system and shared tokens. See the [release notes](docs/releases/0.4.0.md).

The portable skill and six-form catalogue remain unchanged from 0.3.0 and
provisional relative to [VISION.md](VISION.md). The owner considers golden cut
the closest existing example to the intended compositional practice. This
release does not claim catalogue or skill alignment. The communication examples
are exploratory material, not an adopted replacement catalogue.

**Kata 0.3.0: six forms, a six-slide field guide, seven retained before-and-after pairs, and an offline 14-slide Lys deck.**

The sixth pattern, golden cut, gives a supplied item more space when the brief
supports that emphasis. The [Kata skill](skills/kata/SKILL.md) explains when an
existing arrangement should stay and how to use the catalogue within the
current scope.

## Visual foundations delivered in 0.4.0

The first [design study](examples/studies/01-reading-rhythm/index.html) compares
three typography and reading-rhythm treatments using the same composition and
commentary. A second round compares bundled F/OSS Archivo, Newsreader and Literata
in the reflective editorial direction. The owner selected Newsreader for copy,
with Archivo and Chivo Mono as supplementary defaults. The combined typography settings are accepted;
the typography and colour foundation is adopted. A third round shows those roles together
in a working documentation excerpt. [Study 02](examples/studies/02-colour-roles/index.html)
records the adopted light surface, silicate black and Reasonable Colors raspberry
accents, with paper reserved for the example slides. Round 4 compares four
paper surfaces against ceramic in a dedicated Lys deck. Papers 1–3 are adopted;
Round 5 adopts toned-black reading ink, petrol headings/emphasis and paper-coloured
lettering on petrol text backgrounds. The colour study is complete.
The [living design system](examples/design-system/index.html) implements the adopted
foundations. Its [token source](examples/design-system/tokens.json) generates shared
CSS custom properties for current documentation and the live Lys specimen.
Historical studies retain their scoped styles. Design exploration for this phase
is closed by owner decision; integration does not require further visual studies.
The [study index](examples/studies/index.html) collects these historical records.

## Explore the 0.4.0 communication studies

Open the [study gallery](examples/communication/index.html) for intentions,
visible choices, priority disclosures, and trade-offs. Use the
[Lys deck](examples/communication/deck.html) to compare the compositions at
presentation size. Both are offline; narrow screens use a scrolling document.

The photograph and fictional quotation remain identical across four variants:
image-led, comparable presence, quiet reflection, and word-led. Three fictional
library proposals retain their wording across equal-consideration and explicitly
recommended variants. The changed recommendation brief is disclosed, not inferred
from the estimates. These are design explorations, not accepted patterns or
claims of improved comprehension.

The owner chose to retain these as exploratory evidence and defer catalogue/skill
alignment. Further selection or revision is future product work, not a 0.4.0
release gate.

## Try the released 0.3.0 artifacts

Open [the visual gallery](examples/index.html) in a browser to compare the examples.
Open [the Lys deck](examples/kata-lys.html) to present them. Use the arrow keys to
move through all 14 slides, or the top navigation to jump to an after example.
Both files work locally without a server or network connection. The deck is a
single file and can be copied on its own.

To use the guidance with an agent, ask:

> Read `skills/kata/SKILL.md` and review this slide's layout using Kata.
> Preserve the supplied content and tell me whether a layout change is needed.

The [field guide](examples/field-guide.html) presents the six current forms,
with a specimen and fit explanation on each slide.

For persistent skill discovery, copy the entire `skills/kata` folder into your
agent's skills directory, such as `~/.codex/skills/kata`. The skill is self-contained;
its installation does not require the gallery, Node, Lys, or a brand skill. This
repository does not install anything automatically.

## Existing 0.3.0 catalogue

This inventory describes the released artifacts, not the intended organization
of the future repertoire. Golden cut is closest to the compositional direction;
the other five chiefly describe information representations.

| Form | Pattern | Audience question |
| --- | --- | --- |
| [Comparison](skills/kata/references/comparison.md) | Aligned matrix | How do these options differ on common criteria? |
| [Composition](skills/kata/references/composition.md) | Whole and parts | Where does the total go? |
| [Hierarchy](skills/kata/references/hierarchy.md) | Nested groups | What belongs where? |
| [Relationship](skills/kata/references/relationship.md) | Directed dependencies | What must happen before what? |
| [Change over time](skills/kata/references/change-over-time.md) | Time series | What changed, by how much, and when? |
| [Golden cut](skills/kata/references/golden-cut.md) | Asymmetric composition | What is primary, with context beside it? |

Each pattern includes its affordances, constraints, a worked specimen, and a
review check. All example data is fictional. Some retained specimens show
information restructuring or headline writing beyond Kata's current scope;
they document the existing catalogue and are not instructions to perform that
work. For current layout guidance, begin with the supplied-content boundary in
the [Kata skill](skills/kata/SKILL.md) and its [shared layout assessment](skills/kata/references/layout-assessment.md).

The patterns describe when a form can help and when it gets in the way. Their
rationales distinguish design judgment and Gestalt analogies from empirical
evidence; they do not claim that these layouts or Kata have been empirically
validated. Specific claims about perception or psychology should be supported
by relevant research and presented with its limits. General deck storytelling
is outside this release's scope. The golden cut uses 61.8/38.2 only as an
optional spatial proportion; it does not encode quantities or establish
preference or comprehension.

## Kata, Lys, and brand skills

Kata makes compositional choices in service of communication. Lys supplies
output behavior. An optional brand skill supplies visual identity; Kata considers
expressive arrangements within those constraints. See [integration notes](skills/kata/references/integration.md).

Slides are Kata's current medium; Lys can render them in different formats,
including vertical phone screens. The projects may inform each other as they
develop. This is a direction, not a claim that a packaged integration exists.

The example deck embeds the locally available Lys 1.2.1 runtime. Runtime provenance
is recorded in [the vendor notice](examples/vendor/NOTICE.md). The cream and rust
example theme is neutral; Futurice branding has not been supplied or tested.
There is no separate `kata-lys` package in this release.

## Kata and ASDLC.io

[ASDLC.io](https://asdlc.io) is our pattern library for harness engineering:
it documents concepts, patterns, and practices for engineering with agents.
We use its guidance to develop Kata's agent instructions and internal workflows.
Kata's delivered skill supplies focused guidance for arranging supplied
content.

Development guidance lives in [AGENTS.md](AGENTS.md); `CLAUDE.md` links to the
same file. Internal development skills live under `.agents/skills/` with
`kata-dev-` names. When authoring Lys decks, repository agents use the
[version-pinned Lys skill](.agents/skills/lys/SKILL.md), which is development
guidance and is not part of the portable delivered skill in `skills/kata/`.

## Work on the examples

Node 20 or newer is enough. There are no npm dependencies to install.

```sh
npm run build
npm run check
```

Edit [example data](examples/data.json), [the generator](scripts/build-examples.mjs),
or [the theme](examples/theme.css), then rebuild. The new studies have separate
[frozen briefs](examples/communication/data.json), a
[theme](examples/communication/theme.css), a
[builder](scripts/build-communication.mjs), and
[asset provenance](examples/communication/provenance.md). `npm run build` rebuilds
both sets without fetching anything. Commit the generated HTML alongside
the sources so the examples stay usable immediately after checkout. The build runs
no network requests and makes no changes to the neighboring Lys project.

`npm run check` checks harness instructions, source data, portable and
development skill references, the field guide's form coverage and content
integrity, slide structure, unique IDs, navigation targets, and offline
packaging. The pending-review studies additionally check exact per-specimen
frozen wording, asset identity, recommendation placement, disclosures, and isolated
deterministic rebuild freshness, with negative controls. It also checks versioned
evaluation cases and runner protocol paths
without invoking model CLIs. These structural checks do not replace visual
review. When changing a rendered layout, inspect the affected gallery, field
guide, or deck at presentation and phone sizes, with keyboard navigation,
no-JavaScript reading, and print where supported; record any gaps.

## Evaluation

The [0.3.0 artifact review](docs/evals/0.3.0-review/README.md) records field-guide
coverage, source checks, visual review, dogfooding corrections, and remaining
verification limits. See the [0.3.0 release notes](docs/releases/0.3.0.md) and
[current delivery notes](docs/releases/0.4.0.md).

The versioned cases, shared run contract, CLI adapters, and Lys artifact checks
are under [evals](evals/runner/README.md). The [0.2.0 evaluation report](docs/evals/report.md)
records outcomes separately for Claude Code, Codex CLI, and pi. The report
distinguishes agent review and automated artifact checks from human reader
feedback; it does not claim improved comprehension from generated slides.

## Roadmap

See the [Kata roadmap](docs/plans/ROADMAP.md) for planned work and open questions.

The [original brief](docs/initial-brief.md) records the starting intent from
2 October 2026.
