# Kata 0.3.0 artifact review

Reviewed 13 October 2026. Three GPT-6 Luna agents implemented the pinned Lys
dependency, portable guidance and scope alignment, and field guide; the
coordinator reviewed and integrated their work. A separate Luna pass checked
scope consistency and the field guide's source checks. This is authored
dogfooding and internal artifact review, not a model benchmark or reader study.

## Inputs and coverage

The guide reuses `examples/data.json` and `examples/golden-cut/data.json`.
No new empirical data or catalogue forms were introduced. The local authoring
skill is Lys 1.2.1 at `c553aa5dbc36d5c6ddd819051384fdaf05c8cfd0`; the unchanged
runtime is Lys 1.2.1 from `116d76255c42d5bb2a78de3954462b89979688f1`.
The skill's embedded CSS and JS match the vendored files exactly after trimming
outer whitespace. The skill has no required companion files or remote fetches.

Every guide slide was compared with its portable reference and the shared
layout assessment, then inspected at 1440×900 and 390×844, with JavaScript on
and off, and in landscape print output (960×540 pt).

| Stable slide ID | Supplied specimen and meaning preserved | Fit and limit reviewed |
| --- | --- | --- |
| `aligned-comparison` | All nine option values; six-week and €80k limits; one-time estimates and excluded lifetime cost | Shared supplied criteria; unrelated criteria or long descriptions are a poor fit |
| `whole-and-parts` | €200k total; €100k/50k/30k/20k parts and 50/25/15/10% widths and labels | Supplied exclusive parts of a known whole; overlap and unknown totals are a poor fit |
| `nested-groups` | Launch programme, two equal workstreams, four disciplines and their supplied parents | Supplied single-parent membership; shared membership and inferred authority are a poor fit |
| `directed-dependencies` | All five nodes and four prerequisite edges, including the separate Compliance-to-Launch join | Supplied prerequisites; dense networks and timing questions need other treatment; spacing is not duration |
| `time-series` | Jan–Jun 2026 means 10/9/7/8/6/5 days; 20 completions per cohort; April reversal; causes and variation unknown | Supplied consistent observations; unmeasured sequences and fabricated continuity are a poor fit |
| `asymmetric-composition` | Planned 18 June 2027 launch; security review due 10 June; “Planned, not confirmed” remains visible | Brief-supported primary message; equal-priority claims or unreadable context are a poor fit |

The existing gallery and 14-slide deck also received presentation/phone,
JavaScript/no-JavaScript, keyboard, and print review after their scope copy and
navigation labels changed. Their specimens remain unchanged. Gallery and deck
print output each contain 14 pages; the guide contains six. All printed pages
were rendered with Poppler and inspected, including labels and qualifications.

## Results and evidence

- `npm run build` and `npm run check` pass. A second build reproduces all three
  HTML files byte for byte. Checks include all six catalogue entries, unique
  IDs, local references, nonempty fit/limitation fields, per-slide source
  integrity, runtime packaging, and the pinned authoring skill.
- A fresh standalone copy of `skills/kata/` contains nine Markdown files and
  15 resolved local links, with no local dependency outside that folder.
- [Browser measurements](verification.json) cover 12 artifact/viewport/JS-mode
  combinations and 136 slide observations. There were no page errors or remote
  requests. Both decks advance and return using arrow keys; navigation links
  update the active Lys slide at both viewport sizes. Tab focus is recorded.
- All six guide forms, their explanations, and qualifications remain visible
  in the inspected contexts. The phone dependency diagram scrolls horizontally,
  with an explicit hint and all four relationships also present as readable
  text. Both ends of the diagram were inspected. The time series fits the phone
  width and retains a table of exact observations.
- The phone time-series slide is taller than the available viewport. Its
  article capture omits the bottom link; the separate `time-series-footer.png`
  viewport captures and hit-test verify that the link is reachable by scrolling,
  with and without JavaScript. This is a capture limitation, not missing content.
- The image sheets and guide PNGs in this folder preserve the visual review.
  The three `*-print.pdf` files preserve print output. [Provenance](provenance.json)
  records reviewed source hashes, tool versions, and artifact hashes.

## Dogfooding findings and corrections

1. A scope disclaimer at the skill entry point did not reconcile the older
   references' commands to restructure content or derive headlines. The
   references now describe supplied relationships and historical specimens;
   current work does not authorize those transformations. General rendered
   checks have one home in `layout-assessment.md`.
2. Short fit explanations initially omitted the supplied-relationship
   precondition. The guide now states it explicitly, agreeing with the portable
   references. Rechecked all six slides after that wording correction.
3. The first generated whole-and-parts specimen omitted proportional flex
   widths. Restored source-based widths and added per-segment integrity checks.
   Rechecked labels, widths, and total at both sizes and in print.
4. Bare navigation anchors did not update Lys's active state in direct mode.
   Reused the existing public-API navigation listener and checked link clicks
   as well as arrow keys. Plain anchors still work without JavaScript.
5. The initial time-series SVG overlapped its presentation heading. A bounded
   flex wrapper now keeps it within the specimen area. Phone copy was too small;
   increased it, allowed content-driven slide height, stacked the footer, and
   made horizontal diagram scrolling explicit. Re-rendered and inspected the
   affected slides and print pages.
6. Global checks for isolated digits could succeed even when a specimen lost a
   value. Checks now inspect the relevant slide's table rows, segment widths,
   parent-child membership, edge paths, and time-series points and labels.

All observed release failures above were corrected. The guide demonstrates
six existing forms; it does not resolve whether broader information modeling
belongs in Kata.

## Remaining verification limits

Review used Chromium on macOS, simulated viewports, and browser print PDFs.
Safari, Firefox, physical phones, projectors, and printers were not tested.
This was not a full assistive-technology audit. The retained before-and-after
gallery/deck continue to use text/table equivalents for charts on phones;
the new field guide keeps the actual visual forms visible as well. No human
reader outcomes or independent model-behavior comparisons were collected.

## Reproduce the capture

The capture needs Node and a separately available Playwright installation with
Chromium. These are review tools, not portable-skill or normal-build dependencies.
Pass an absolute `package.json` path that resolves `@playwright/test`:

```sh
npm run build
npm run check
node docs/evals/0.3.0-review/capture.mjs /path/to/package.json /tmp/kata-030-review
pdftoppm -scale-to 1200 -png /tmp/kata-030-review/field-guide-print.pdf /tmp/kata-030-review/print
```

The optional fourth argument restricts capture to one artifact basename,
such as `field-guide`. Final guide captures were refreshed after its last copy
edit and combined with unchanged gallery/deck captures in `verification.json`.
