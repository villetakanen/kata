# Kata living foundations

Open `index.html` for the current design system. Historical alternatives and their
owner decisions live in `../studies/`; this directory is the current implementation.

## Use

Load `tokens.css`, `fonts.css`, then `site.css` for current project documentation.
The first two files provide values and font faces without page layout. `site.css`
provides documentation styles. Add `specimen.css` for the example component.

`tokens.json` is the canonical token source. Colour values are CSS CIE LCH (D50);
original source hex values are recorded where applicable. Token roles separate
site raspberry from example petrol and paper. Petrol and paper are used only
inside example content, never as documentation surfaces, headings or decoration. Do not reuse signature raspberry
for small text. Body text uses silicate black, including captions and metadata.

Use `--kata-paper` by default, or `--kata-paper-warm` / `--kata-paper-mineral`
consistently per example deck. The component reads its local `--paper` variable,
which defaults to `--kata-paper`. Selected text can use `.text_background` or
`.text_underline`. Supplied images retain their original colours.

Edit `tokens.json`, `site.css`, `specimen.css`, or `scripts/build-design-system.mjs`
then run `npm run build` from the repository root. Commit the generated CSS, page
and standalone `examples.html` deck alongside the sources. Run `npm run check`;
visually review meaningful changes at desktop/phone sizes, keyboard, no JS and
print. The checker verifies token freshness and offline dependencies. It does not
replace visual review.

Fonts are bundled with OFL licences and pinned upstream provenance. Historical
study files are read as source content only; they do not import the living styles.
These identity tokens stay outside the portable Kata skill and do not redefine Lys.
