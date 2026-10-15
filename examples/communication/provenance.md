# Communication studies — phase 1 source

**Pending project-owner design review. Not accepted repertoire.** These are authored design explorations, not reader studies or an active-skill change.

## Frozen photograph

- File: `earthrise.jpg`, JPEG, 1280 × 1280, 67,035 bytes.
- NASA ID: **AS08-14-2383**, Apollo 8, 24 December 1968. Photograph credited to NASA / Bill Anders.
- Catalogue: https://images.nasa.gov/details/as08-14-2383
- Metadata verified through https://images-api.nasa.gov/search?nasa_id=as08-14-2383 ; title: “Apollo 8 Mission image, Earth over the horizon of the moon”. NASA's description identifies Earth about five degrees above the lunar horizon and the Apollo 8 spacecraft as the viewpoint.
- Fixed asset URL: https://images-assets.nasa.gov/image/as08-14-2383/as08-14-2383~medium.jpg
- SHA-256: `4326e44ea3266c7dd28a65f17117290ca16000f2a719af32b8c79b0e36e8c058`
- License/status: NASA-produced imagery is public domain in the United States. NASA's images/media usage policy: https://www.nasa.gov/nasa-brand-center/images-and-media/ . NASA imagery is generally not subject to US copyright; third-party material is excepted. This catalogue record identifies JSC/NASA material without a third-party credit. No NASA endorsement is claimed. NASA identifiers and insignia have separate restrictions; no logo is used here.
- Local copy is the downloaded NASA medium derivative, unmodified. Every variant shows the full image without cropping, retouching, rotation or overlays. The outputs inline the same bytes as a JPEG data URL. Rebuilding requires no network.

The quotation and its attribution are original **fictional demonstration copy**, not historical words by an astronaut. The library proposals, quantities, qualifications and working-group recommendation are also fictional supplied material frozen for these comparisons. Nothing is presented as measured evidence. Supplied proposal text is unchanged in both variants; only the explicitly recommended variant activates the separately supplied recommendation and reason.

## Source schema (version 1)

`data.json` is canonical:

- `status`, `evidenceBoundary`: review/evidence limits, surfaced in gallery and notes.
- `briefs.earthrise`: title, baseline intent, fiction label, quotation, attribution and asset (path/MIME/alt/caption/credit/source/license).
- `briefs.proposals`: title, baseline intent, fiction label, context, shared qualification; `options[]` with stable ID, title, description, estimate and trade-off; a separate `recommendation` with option ID, source label, reason and approval status.
- `variants[]`: stable `id`, brief key, layout key, display name, `intent`, `changedPriority`, visible `choices[]`, consequential `tradeoff`, and `adaptation` limits. Layout keys are authored in the renderer/theme, not an extensible repertoire API.

Each specimen is a single item. Gallery headings and rationale are outside it. A small labelled context strip inside it distinguishes demo context from supplied copy. `data-notes` carries rationale, changed intent, adaptation and review status. There is no universal bad/good ranking. All six IDs are stable deck targets (`deck.html#<id>`, also `#slide=<id>` with JavaScript) and gallery section anchors (`index.html#<id>`).

## Build and coordinator integration

Run from any directory with Node 20+:

```sh
node /absolute/path/to/kata/scripts/build-communication.mjs
```

Or from the repository root:

```sh
node scripts/build-communication.mjs
npm run check
```

Inputs: this directory's JSON, CSS and JPEG, plus the **unmodified pinned Lys 1.2.1** CSS, IIFE and notice in `examples/vendor/`. The script uses only Node built-ins. Outputs: `examples/communication/index.html` and `deck.html`; each is independently copyable and offline, with CSS/photo inlined. The deck also inlines the exact vendored runtime and its notice. Source/provenance links are informational, not runtime dependencies. The gallery's relative deck/provenance links require those companions if followed.

`npm run build` invokes this builder after the existing generator. `npm run check` imports `scripts/check-communication.mjs`, which checks exact frozen wording and asset identity, each specimen's disclosures and recommendation association, reading priority, offline packaging, IDs/links, and isolated deterministic output freshness. README and roadmap link to these working studies. The released 0.3.0 generator, examples and portable skill remain unchanged. Owner acceptance must be recorded separately before these studies inform phase 2.

Desktop deck: Lys keyboard navigation (arrows, Space, Home/End), numeric links, hash deep links. Narrow or short screens (up to 1100px wide or 560px high): destroy the initialized Lys instance so all articles remain visible and accessible as a continuous document with native anchor navigation. Resizing reinstates the same unmodified runtime. Document adaptation is screen-only, so it cannot contaminate the landscape print layout. The word-led variant emits quotation-first markup rather than using CSS visual reordering. No-JS: all articles are readable with native anchors. Print: six specimens, one per landscape page, without review annotations. The same responsive specimen CSS is used by gallery and deck.

## Bounded verification performed

- Initial worker build used `node scripts/build-communication.mjs`; coordinator integration adds both build and check commands as described above. Final checks and review corrections are recorded in the [increment review](../../docs/evals/0.4.0-review/README.md).
- Chrome 155 headless via local DevTools protocol: all six gallery and deck specimens at **1440×900, 1280×720, 390×844**. Captured and visually inspected specimen screenshots/contact sheets. No specimen scroll overflow or unloaded photograph remained. Corrected an intrinsic image-height bug found in the first pass.
- Design observations: image-led version keeps the image larger than in equal presence, word-led version reverses dominance without altering the quotation, quiet version retains a smaller central grouping. Phone layouts retain reading priorities but lose simultaneous side-by-side relationships; their adaptation disclosures name that cost. Proposal items intentionally extend below the phone viewport; they scroll without truncation.
- Keyboard: ArrowRight, End and Home produced indices 1, 5 and 0 at both desktop sizes. Native/direct deep links resolve to the fourth study on desktop and phone. The phone deck has no residual Lys `aria-hidden` attributes after destroying the runtime.
- No-JS: both pages expose six articles, no hidden-article attributes and no document-width overflow at desktop and phone widths. Native ID links remain usable. All supplied quotation/proposal wording was also checked against the rendered DOM (six variants preserved).
- Print: both no-JS gallery and deck produced **six 960×540-point landscape pages**, one specimen per page. Inspected the rendered deck print contact sheet. The JS-active deck also produced six pages. Review rationale is excluded from print, while the small pending-review context and shared proposal qualification remain visible.
- Packaging: exact vendored Lys CSS/IIFE inclusion checked; no external image, script or stylesheet runtime resources. Frozen photo SHA-256 checked on every build. Test scripts, screenshots and PDFs are temporary evidence under `/tmp`, not shipped artifacts.

**Gaps:** no physical phone, Safari/Firefox, screen-reader session or physical printer test. Keyboard checks cover the named controls, not an exhaustive assistive-technology audit. Not all long gallery annotations were visually inspected below each captured viewport; their source is canonical and their layout flows naturally. No project-owner acceptance or comprehension study has occurred. The coordinator records final integration verification separately.
