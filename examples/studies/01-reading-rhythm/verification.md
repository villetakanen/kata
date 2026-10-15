# Study 01 verification

15 October 2026. Codex implementation and rendering review; owner design review remains open.

## Coverage

- Inspected the original gallery introduction and first complete item at 1440px before proposing alternatives. The audit in the study distinguishes observations and design judgment.
- Inspected all three alternatives at 1440px and 390px in Chromium on macOS. Checked document width and image loading at 1440, 720, 390 and 320px: no horizontal overflow, all local images loaded. The 720px check is a reduced-width reflow proxy, not an actual browser-zoom test.
- The study has no JavaScript. Repeated the reading checks with scripting disabled; all alternatives and commentary remained available. Tab reaches the visible skip link first. Links and the audit disclosure have explicit focus styles.
- Inspected the copied Lys deck at presentation size, checked ArrowRight advancing from item 1 to item 2, phone reflow at 390px without horizontal overflow, and six available articles with JavaScript disabled. Inspected its first printed specimen. The copied deck is otherwise unchanged; its gallery backlink is adjusted for the new location.
- Reviewed the study's A4 print rendering, including all three alternatives and their narration. Tightened print spacing after early versions produced short continuation pages. Print deliberately uses smaller specimen previews and more compact type; the desktop proportions are the primary design comparison. The optional collapsed baseline image is available on screen; the audit reasoning prints regardless.
- `npm run build` and `npm run check` passed. Existing example outputs were unchanged. Local page links, anchors and assets were checked separately; the existing repository checker does not yet cover this new study.

## Assets and preservation

`source.json` is a frozen copy of the communication brief and commentary. `source-deck.html` copies the complete six-item offline Lys deck (including runtime notice), with only its gallery backlink changed. The study uses the first item. `specimen.png` captures that original gallery specimen at a 1440px browser viewport and 2× device scale; `baseline.png` captures the whole first gallery item at 1×. They are intentional historical assets, not regenerated against the live theme during builds. `study.css` belongs only to this study.

The initial round used installed system fonts. Round 2 now bundles unmodified Archivo, Newsreader and Literata variable fonts, roman and italic, together with OFL 1.1 licenses and copyright notices. The source revision, URLs and SHA-256 hashes are retained in `fonts/manifest.json`. Font rendering was reviewed on this Mac only; Windows, Linux and forced fallback rendering remain unverified.

## Remaining limits

- Owner adoption, cross-browser review, actual 200% browser zoom and assistive-technology testing remain open.
- Raster specimen text becomes small on phones and in print. The adjacent link opens the preserved, selectable Lys specimen with phone reflow; alt text retains the quotation and fictional attribution. This is a preview trade-off, not a new responsive composition.
- The original specimen's palette is retained. New page text uses #242424 or #555 on white; no new palette has been adopted.
- Public hosting and deployment have not been configured or verified. The repository has no checked-in publishing workflow; the local index and README make the study discoverable now.
- No claim about reader comprehension, preference or empirical superiority follows from these checks.

## Round 2: F/OSS type comparison

15 October 2026, following owner feedback. The owner rejected Georgia, Times New Roman and Palatino and required F/OSS licensing, contemporary design and deliberate selection. The reflective editorial direction remains under investigation; no family is adopted.

- All six bundled font faces reported loaded in Chromium at 1440, 390 and 320px with JavaScript disabled. No horizontal document overflow at those widths.
- Visually inspected each candidate’s extended reading excerpt at 1440 and 390px, including real italics, bold, labels and caption links, and the complete Newsreader sample at desktop size.
- Inspected the new printed comparison pages: each candidate keeps its original specimen and commentary on one page, followed by the longer reading excerpt and design rationale on a second page. All narration remains present. Print is a compact reading adaptation; the screen settings are the primary comparison.
- All local study links, anchors and assets resolve; all vendored font files match the saved SHA-256 manifest. Candidate reading text and original commentary remain identical across the three treatments.
- Rebuilt generated outputs; `npm run check` passed. The original presentation deck and raster previews were not changed in this round.
- Browser zoom, other browsers, forced fallback and screen-reader review remain open. There is no claim that a serif slows reading or improves comprehension.

## Owner decision: font roles

15 October 2026. After reviewing Newsreader’s philosophy, the owner associated it with Kata’s deliberate character and web “slow media”. They retained Archivo and Chivo Mono as supplementary defaults wherever sans-serif or monospace is needed, excluding reading copy, and supplied their blog design system as a reference.

The public reference was read at https://villetakanen.com/sundry/design-system/ on 15 October 2026. It defines Archivo as primary voice (headlines, body and major labels), and Chivo Mono as secondary data typography (captions, timestamps, code, numbering and technical specifications). Kata adapts those responsibilities: Newsreader takes the reading voice, Archivo supports interfaces, and Chivo Mono supports technical notation. Explanatory captions are copy. The blog’s other styling and scale rules were not adopted.

This update records the decision and supersedes the earlier “no family adopted” status. It does not restyle the historical comparisons. Combined typography settings remain unverified, and Chivo Mono is not yet bundled or rendered. The next implementation is a combined-role sample, not a new selection among the three earlier candidates.

## Round 3: the selected families together

15 October 2026. Added a combined study-page excerpt; family roles remain selected, while its numerical settings await owner review. Chivo Mono roman and italic are now bundled with the original OFL 1.1 notice, metadata and hashes at the same pinned Google Fonts revision. This supersedes the earlier implementation gap about Chivo Mono not being rendered.

- Inspected the complete combined sample at 1440px and 390px. At 1440, 390 and 320px, with JavaScript disabled, the document had no horizontal overflow and the native type-settings disclosure opened with Enter.
- Browser font inspection confirmed custom Newsreader glyphs in the title, Archivo in navigation, and Chivo Mono in the study identifier. This checks actual rendered fonts, not only declared CSS families.
- Inspected the combined sample and settings in A4 print. The specimen and original commentary occupy one page; the longer reading excerpt, settings and rationale follow. Narration and license links remain present. Removed the keyboard focus outline from print after the initial check.
- New font assets match the manifest hashes. Local links and anchors resolve. The combined sample retains the same original intention, choices and trade-offs, with the existing vision excerpt added unchanged.
- `npm run build`, `npm run check` and whitespace checks passed. Earlier specimen images, the Lys deck and earlier type comparisons are unchanged.
- Actual browser zoom, other browsers and screen-reader review remain open. Font files are unmodified for this historical study; production subsetting or delivery optimisation has not been performed. No numerical setting is owner-adopted yet.

## Acceptance and next foundation

15 October 2026. The owner responded “good, lets move to next” to the combined treatment. This is recorded as acceptance of the Round 3 documentation typography settings as an initial foundation. Verification gaps remain open. Study 02 continues with colour roles; it does not supersede this typography record.
