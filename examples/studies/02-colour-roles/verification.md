# Study 02 verification

15 October 2026. Colour roles are exploratory; owner acceptance applies to the typography inherited from Study 01, not these colours.

- Built the study with three treatments of the same frozen composition and commentary. No presentation composition, deck, image or font file changed. The typography CSS is a local snapshot with asset paths adjusted to Study 01’s historical font files.
- Chromium checks at 1440, 390 and 320px, with JavaScript disabled: no horizontal overflow; all preview images loaded. Inspected the three treatments at desktop and phone sizes. The action links use the proposed blue and a solid focus outline; all links retain underlines.
- Inspected A4 print with specimens and narration retained. The paper setting uses smaller previews and compact type, so the screen view remains the primary composition comparison.
- Calculated contrast: accent #285e76 on white 7.11:1; on the pale #edf4f6 surface 6.39:1. Reading ink #242424 on white 15.52:1; secondary text #555555 on white 7.46:1. Status is explicit in words; colour is supplementary.
- Ran `npm run build` and `npm run check`; existing project checks passed. Local study links and anchors checked separately. The existing checker does not yet exercise the new study directly.

Remaining limits: no owner colour decision; no cross-browser, assistive-technology or actual browser-zoom review; no empirical attention or comprehension evidence. The frozen raster specimen is a preview whose small text is not a phone reading layout; the linked Lys deck provides selectable, responsive content. Public hosting has not been configured or verified.

Source and licenses: see the page’s provenance and Study 01’s font manifest. No palette is adopted by this implementation. Later changes should preserve this study’s local stylesheet and referenced historical assets.

## Round 2: paper, industrial frame and sakura

15 October 2026. Owner feedback redirected the study from functional blue accents to paper within their Orbital Industrialism identity, with sakura pink/lilac identifying Kata. The owner associated paper with Japanese paper walls and Western/Eastern calligraphy; the study records this as their design association, not a historical or psychological claim.

Read the public site stylesheet and retained the source URL, hash and extracted monochrome values in `site-colours.json`. The owner then explicitly selected #111217 instead of the site's #111111. The new frame uses that override; reading ink remains #222222 on #f4f1e9 paper. Pink and lilac remain proposals, not adopted colours.

Inspected both complete variants at 1440px and 390px in Chromium. At 1440, 390 and 320px with JavaScript disabled there was no horizontal overflow. Tab advanced from the Kata badge to the next frame link. Inspected both variants and their rationale in A4 print after compacting the contrast table. The frozen presentation preview remains unchanged and is deliberately small in print; its linked Lys deck remains the full-size version.

Computed contrast with the selected black: frame text 17.74:1; pink badge/focus on black 10.75:1; lilac badge/focus on black 10.72:1. Pink link ink on paper is 6.50:1; lilac 6.36:1; reading ink 14.10:1. The light accent rules are decorative. Links remain underlined and status is explicit in text.

Build and project checks passed. Existing browser/zoom/assistive-technology gaps remain. No changes were made to the user's public site, and no public deployment was performed.

## Round 3: corrected Kata direction

15 October 2026. Owner rejected the paper-wrapped article and pastel badge treatment. The new proposal restores the earlier reading layout on #f8f9fa, keeps #111217 ink, and confines paper to the unchanged slide preview. The supplied reference’s #d14063 informs the decorative wordmark underline; #b62c50 is a deeper derivative for links and focus. No Lys changes or family comparison were made. The supplied image is described but not republished; attribution/usage rights are not verified.

Inspected the corrected sample at 1440 and 390px with scripting disabled. The 320px check found a long source-image filename in the rationale overflowing; enabled wrapping for that reference. Keyboard Tab advances from the wordmark to the next link. Inspected A4 print with narration retained. Build and project checks passed. Earlier browser, zoom and assistive-technology gaps remain. The stronger pink settings are a proposal awaiting owner response.

## Closure: Reasonable Colors raspberry roles

15 October 2026. The owner authorised applying the suggested raspberry family and closing the study. Adopted: #ff426c (Raspberry 3) for the decorative wordmark underline; #de0051 (Raspberry 4) for links and focus; #82002c (Raspberry 5) for link hover. Source: https://www.reasonable.work/colors/ and the Reasonable Colors v0.4.0 tokens already present in the owner's site stylesheet. The initial custom pink pair remains documented in the decision record as replaced.

Against #f8f9fa, calculated contrast is 3.19:1 for the decorative underline, 4.72:1 for links/focus and 10.03:1 for hover. Raspberry 3 is not used for small text. The selected #111217 ink, accepted typography and paper-only specimen treatment remain unchanged.

Rechecked 1440, 390 and 320px with scripting disabled: no horizontal overflow; keyboard traversal works. Reviewed the final phone rendering and printed specimen. Build, project checks and whitespace checks pass. Previously recorded cross-browser, zoom and assistive-technology gaps remain; study closure does not claim those checks or completion of the whole 0.5.0 release. No public deployment was performed.


## Round 4: paper surfaces beside ceramic

15 October 2026. Site palette acceptance stands. Four example-slide papers are now under review: original #f4f1e9, warmer ivory #f2e8d5, deeper parchment #e7d7b9, mineral #dfe7dc. Exact new values are design proposals, not Reasonable Colors tokens. Only paper varies; the frozen specimen content, composition, typography and ink are retained. No Lys theme change is implied.

Generated a four-item Lys deck from the frozen source. Inspected the desktop comparison, responsive deck at 390px, and gallery at phone size. Gallery checks with JavaScript disabled pass at 1440, 390 and 320px without horizontal overflow. Fixed wrapping of the deck navigation; its 390px overflow check passes. Home then ArrowRight selects item two. The no-JavaScript deck exposes all four items. Inspected the ivory gallery and deck print pages. Fixed preview capture selection so all four images show their respective papers rather than the initial slide. Previews were captured at 1440 × 1000, 2× density and must be refreshed when the deck changes.

Build and project checks pass. Owner paper choice remains open. Previous cross-browser, assistive-technology and zoom verification gaps remain. Print review uses browser PDF output, not physical paper; these flat colours do not establish material authenticity.


## Round 4 revision: LCH mid-tones

The owner replaced the broad candidates with original plus three equal blends, then requested perceptual colour coordinates before proceeding. The interrupted RGB-average draft was superseded. Study 02 styling now uses CSS CIE LCH (D50); the frozen typography stylesheet remains intact, with an LCH copy used by this study. The paper deck generator converts its style colours using lch-colours.json. Original hex provenance remains recorded; accepted site colours are converted equivalents, not new palette selections.

Blends use CSS color-mix(in lch shorter hue, … 50%, … 50%), resolved through Chromium and saved as numeric LCH values. variants.json records the LCH inputs and weights. Original: lch(95.2132 4.24718 89.5919); original/warmer: lch(93.8137 7.43229 86.5692); original/mineral: lch(93.0059 5.17116 111.736); warmer/mineral: lch(91.6063 8.35627 108.714). Reference: https://www.w3.org/TR/css-color-4/. LCH is an approximation of perceptual uniformity, not a claim of perceptually exact midpoints.

Refreshed all four previews. Inspected desktop comparison, phone gallery and phone deck; gallery has no overflow at 1440, 390 and 320px without JavaScript, deck has none at 390px. Home/ArrowRight selects the second item and the no-JavaScript deck retains all four. Inspected the second deck page in PDF print output. Build and project checks pass. Cross-browser and physical-print checks remain outstanding. Owner paper selection remains open.


## Round 5: adopted papers, proposed example accents

Owner adopted papers 1–3 as a family: original default, warm and mineral alternatives, one consistent paper per example deck, no semantic categories. Paper 4 remains exploration-only. Adoption is recorded in variants.json and the study; no global theme rollout is claimed.

Built six Lys specimens: petrol alone and petrol with lily-green support on each adopted paper. Original proposed LCH tokens are petrol lch(34 25 220) and green lch(84 20 135), inspired by the supplied reference rather than imported Reasonable Colors shades. Matching quote padding is used in both treatments; the second adds a flat supporting field. Ordinary metadata ink remains dark. All six preserve the source photograph and text; automated comparison confirms identical visible text to the frozen specimen.

Chromium: captured all six previews, inspected the desktop paired comparison and green phone slide, and inspected the second PDF print page. Home then ArrowRight selects item two. No horizontal gallery overflow at 1440, 390 or 320px with scripting disabled; six deck articles available without JavaScript. Phone deck at 390px has no horizontal overflow. Browser-rendered sRGB contrast estimates for petrol are 7.07:1, 6.83:1 and 6.68:1 on the three papers and 5.24:1 on green. Build and project checks pass. Prior cross-browser, assistive-technology, zoom and physical-print gaps remain. Accent adoption is still open.


### Round 5 correction: one authored ink

Owner rejected the green panel and the combined petrol/green/black/paper palette. Revised all six examples to paper plus petrol: quotation, captions, metadata and rules use the same ink. Each paper compares plain text against a phrase-level text_background span, reversing “share harder to ignore.” to paper on petrol. The supplied photograph retains its colours. Removed panel padding from both alternatives. Earlier deck retained as previous-deck.html, linked as rejected history.

Build and project checks passed. Refreshed six previews, inspected the desktop comparison, highlighted phone specimen and PDF print specimen. Keyboard Home/ArrowRight selects item two. No gallery overflow at 1440/390/320px without JavaScript; six articles remain available. Phone deck has no overflow at 390px. Petrol/paper contrast remains 7.07, 6.83 and 6.68:1 respectively, including reversed text. Prior browser/assistive-technology/physical-print gaps remain. This is a proposal, not an adopted ink decision.

### Final adoption: toned-black reading ink, petrol emphasis

Owner accepted #111217 for body text, captions and metadata; petrol lch(34 25 220) for headings, highlights, underlines and emphasis; paper lettering on petrol for selected text backgrounds. Papers 1–3 remain adopted, with 1 default. Recorded adoption in palette.json, the study, index and README. The final paired specimens show petrol underline versus petrol text background, with black reading ink in both. No green or enclosing panel is used.

Build/check passed; six previews refreshed. Inspected desktop comparison, highlighted phone slide and PDF print slide. Keyboard and no-JavaScript checks pass; no gallery overflow at 1440/390/320px or deck overflow at 390px. Black/paper contrast estimates are 16.57, 16.02 and 15.67:1; petrol/paper remains 7.07, 6.83 and 6.68:1. Colour decisions are complete. Full WCAG conformance, cross-browser, assistive-technology and physical print remain unverified; 0.5.0 rollout and living design-system work are separate.
