# Living design-system verification

Implementation of the owner-adopted typography and colour foundation, 15 October 2026. Design exploration is closed for this phase. Canonical values are in tokens.json; tokens.css is generated. The page, current study index and live specimen use these files; the offline Lys deck embeds the same generated tokens and fonts. Historical study styles and specimen snapshots are not changed by this integration.

Font binaries and SIL Open Font Licenses are copied from the pinned Study 01 source. source-manifest.json preserves upstream provenance (including the additional Literata study candidate, which is not bundled in the living system). The supplied Earthrise image and fictional quote retain their provenance. Project identity tokens do not become portable Kata rules or a global Lys theme.

Verification results are recorded below after rendering.

## Checks performed

- `npm run build` and `npm run check` pass, including the new canonical-token freshness, local link, bundled-font/license, standalone-deck dependency and token-consistency checks. `git diff --check` passes.
- Chromium at 1440, 390 and 320px with JavaScript disabled: no page or study-index horizontal overflow, all images load, and Newsreader resolves from the bundled font. Inspected the page header and live specimen at desktop and phone sizes.
- Standalone Lys deck: desktop and 390px phone reviewed; fixed an initial desktop image/caption clipping issue. Home then ArrowRight selects the second paper. Three articles remain available without scripting and their content fits. Tab on the documentation page reaches the visible skip link.
- Reviewed A4 documentation output (including the live specimen and token table) and landscape deck PDF output. Print keeps narration and avoids splitting the paper swatch group. No physical print review.
- These checks do not establish full WCAG conformance. Cross-browser, assistive-technology and actual browser zoom remain unverified. Public hosting and repository-wide restyling are outside this implementation; only the current study index joins the new documentation surface.

## Scope correction

Owner clarified that petrol and paper are exclusively example styling. Removed
paper swatches from the documentation presentation, grouped the guidance under
“Inside the examples”, and marked the tokens as examples-only. Removed the
personal contributor footer and phase-management commentary from the page.
Rebuilt and reran checks; desktop/390px/320px no-JavaScript overflow, fonts,
images and keyboard checks pass. Reviewed the updated example section.
