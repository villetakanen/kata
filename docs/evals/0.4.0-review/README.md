# 0.4.0 implementation review — phase 1

Original phase-1 status: **working demonstrations ready for project-owner review; not a release**.
The [plan](../../plans/0.4.0.md) requires that review before the examples become
the repertoire. Agent reviews below do not supply owner acceptance. The portable
skill and released 0.3.0 examples remain unchanged; package version stays 0.3.0.

## Delivery disposition · 15 October 2026

The owner approved closing this increment with the existing skill/catalogue
explicitly provisional. This supersedes the original review gates below for
release purposes; it does not adopt every specimen as a reference form. The
skill remains unchanged from 0.3.0. The preparation task left version metadata
at 0.4.0 without publishing. The subsequent delivery published
[v0.4.0](https://github.com/villetakanen/kata/releases/tag/v0.4.0) on GitHub;
no website deployment or catalogue alignment is implied.

See [0.4.0 release notes](../../releases/0.4.0.md) for the complete increment,
including design foundations and the bounded trial. Original phase-1 findings
and outstanding alignment work below remain historical evidence, not hidden
completion claims.

## Delivered increment

- [Gallery](../../../examples/communication/index.html) with review annotations,
  and independently copyable [offline Lys deck](../../../examples/communication/deck.html).
- Two [frozen briefs](../../../examples/communication/data.json): genuine NASA
  Earthrise photograph plus fictional quotation; three fictional library proposals.
- Four photograph/quotation intentions: image lead, comparable presence, quiet
  reflection, direct word emphasis. Two proposal intentions: equal consideration
  and an explicitly supplied working-group recommendation. Recommendation reason
  and status are activated only for the changed brief, not inferred from cost.
- Each variant records intention, priority change, visible choices, trade-off and
  phone-adaptation limits. Annotations are distinguished from supplied copy;
  print contains specimens and labelled demo context, not review annotations.
- Local photograph with [provenance](../../../examples/communication/provenance.md)
  and SHA-256; unmodified pinned Lys 1.2.1 runtime. No network build dependencies.
- `npm run build` builds both historical examples and new studies.
  `npm run check` adds exact per-specimen fidelity, recommendation association,
  reading-order, offline packaging, disclosure, negative-control and isolated
  deterministic output-freshness checks. Source hashes freeze these briefs, not
  the future repertoire or its count.

One subagent authored the demo, one implemented the checker, one independently
reviewed the increment, and a follow-up review verified corrections. The
coordinator reviewed sources and representative final desktop, full-height phone
recommendation and print contact sheets, integrated commands/docs, and reran checks.

## Findings corrected

1. Word-led markup originally emitted the photograph first and reversed it only
   with CSS. It now emits quotation-first DOM; the checker enforces this priority.
2. A 600px breakpoint left text too small at intermediate widths. Screen-only
   document mode now applies up to 1100px width or 560px height, using readable
   rem-based text rather than shrinking a fixed landscape slide. The runtime is
   destroyed in this mode to remove inactive-slide accessibility attributes,
   and reinstated when returning to presentation mode.
3. Width-only responsive rules could contaminate print media. Responsive rules
   and matching JavaScript now explicitly target screen media. Actual PDFs from
   phone-origin printing retain landscape compositions.

## Verification performed

`npm run build`, `npm run check`, and `git diff --check` passed. The build leaves
released gallery/deck/field-guide outputs unchanged. The new checker rebuilds
in an isolated temporary directory twice to check determinism and freshness;
checking does not overwrite stale committed artifacts. In-memory negative
controls reject altered brief/asset text, quotation, photo and recommendation.

Independent follow-up used Chromium 155 with Node 24 and DevTools Protocol,
CSS-pixel emulation at device scale 1 (`mobile:false`, not a physical phone):

| Check | Coverage and result |
| --- | --- |
| Specimen geometry, text bounds, decoded images | Both outputs × six specimens × 1440×900, 1280×720, 390×844, 601×844, 768×844, 1100×844, 1101×844, 844×390: 96 checks; no measured clipping or document-width overflow |
| Document text | Body/trade-offs/reason 16px; estimates 15.2px; shared qualification 12.8px; recommendation label/status 11.2px |
| Visual inspection | All six desktop specimens, intermediate presentation boundary, landscape-phone specimens, individual full-height phone deck specimens and both phone gallery proposals; representative rather than every viewport permutation |
| Reading order | Direct emphasis quotation then photograph in both outputs; all other photograph studies image first |
| Desktop keyboard | ArrowRight / End / Home reached indices 1 / 5 / 0 at 1440×900, 1280×720, 1101×844 |
| Document navigation | Trusted click on sixth native deck anchor at 390, 601, 768, 1100px and 844×390 reached target; no residual hidden slides |
| Resize | Width 1100→1101px and height 560→561px destroy/recreate runtime correctly and preserve direct-emphasis hash |
| No JavaScript | Disabled before navigation; gallery/deck at 1440×900 and 390×844 expose all six articles, loaded photos, no measured clipping or width overflow |
| Print | From 390×844 with JS enabled, gallery/deck produce six 960×540pt landscape PDF pages each. Text extraction retains four quotations and two shared proposal qualifications. All six deck PDF pages visually inspected |

The initial author additionally inspected 1280×720/1440×900/390×844 screenshots,
no-JS outputs and six-page no-JS PDFs. Final independent follow-up supersedes
initial breakpoint/read-order claims. Temporary scripts, numeric results,
individual screenshots and PDFs were stored under `/tmp/kata-followup-evidence/`
and are not durable shipped evidence; this record preserves scope and results.
Raw CDP print screenshots showed capture artifacts; actual PDF rasters, not those
screenshots, supplied the final print evidence.

## Design observations and remaining gaps

These are design judgments, not empirical findings:

- Desktop variants visibly change dominance and restraint without changing the
  photograph or quotation. The dark photograph may still outweigh the quotation
  in the comparable-presence variant; owner judgment is needed.
- Document mode preserves priority but loses simultaneous comparison. Near its
  broad breakpoint a large square photograph can delay the supporting quotation.
- Equal proposals become sequential on phones. The recommended proposal retains
  greater presence, its supplied access rationale and its unapproved status.
- Desktop captions/qualifications remain restrained and may not suit a distant
  room. Their retention does not establish sophisticated prominence assessment.

No physical phone/touch, Safari/Firefox, browser zoom/text-scaling, screen-reader
session, PDF tag/accessibility or physical-printer verification was performed.
Gallery PDF page count/text were checked; only deck PDF rasters were visually
inspected in the final follow-up. Tab traversal and every individual nav link
were not exhaustively tested. Screen `aria-hidden` state remains on inactive
slides while printing; PDF painting includes all six, but accessible PDF output
is not established. No reader study or improved-comprehension claim is made.

## Required owner decision / next work

Please review the gallery/deck: do these alternatives express Kata's intended
practice, and which should be retained or revised? Acceptance must be explicitly
recorded before phase 2 repertoire migration.

Still outstanding: owner review, repertoire names/size, portable skill and
assessment alignment, active/historical navigation separation, unfamiliar-brief
trial, broader release-facing alignment, final review and 0.4.0 release/version.
The old six-form mandatory checks still describe the unchanged 0.3.0 artifacts;
they have not been imposed on the new repertoire.

## Follow-up: bounded selection-guidance pilot · 15 October 2026

A [controlled four-output trial](../../../evals/experiments/communication-choice/review.md)
compared the existing skill with a small selection-guidance edit on two venue
briefs. The candidate made a supplied recommendation more prominent, but also
introduced a new headline; both versions already distinguished the two intents.
The candidate remains an experiment, not a promoted skill change. The delivered
skill was restored to its baseline. This does not complete repertoire/skill
alignment or constitute owner acceptance of the generated compositions.
