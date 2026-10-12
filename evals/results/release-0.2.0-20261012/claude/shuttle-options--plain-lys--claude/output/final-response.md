I made the one-slide Lys deck and its decision file. Alder is the answer: it is the lowest upfront cost among the options that meet the 200 km minimum, at 210 km and USD 38k.

**Files in `output/`:**
- `slide.html`: a single self-contained slide, with the Lys CSS and JS inlined. I checked every line of both vendored assets against the copies in the file. Each line matches exactly.
- `decision.json`: the form is a comparison table, and the caveats are the ones from the brief.

**What the slide shows:** all four options in one table, in source order. The columns are range in km, a meets-200-km check, upfront cost in USD thousands, and estimated annual energy cost in USD thousands. Alder's row is highlighted. Cedar is the cheapest upfront at USD 35k but is 10 km short, so it's excluded. The slide also says Alder is not best on every criterion: Birch has the longest range and Dogwood the lowest energy cost.

**Choices I made:**
- No skill snapshot existed, so I used the brief and the vendored Lys runtime only.
- The custom theme is a light palette with green headings and one amber accent.
- The table includes the energy-cost column even though the question is about upfront cost. I kept it so the caveats about 18,000 km per year and the excluded costs stay visible.

**Not verified:**
- I could not run a JSON parser on `decision.json`; that command needed approval. I checked the syntax by reading it, and it's a simple flat object.
- I did not open the slide in a browser. The structure and inlined assets are verified, but the rendering is not.
- The Lys runtime doesn't read `data-notes`, so the presenter notes are only metadata in the HTML.