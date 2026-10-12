The slide and decision file are in `output/`, but I could not render the slide to check its layout.

- **`output/slide.html`**: one Lys slide with the `lys.css` and `lys.iife.js` runtime inlined, so it works offline. The headline is "The pilot supports another measurement cycle, not wider installation". It has four figure tiles (scope, +6% median, 12 of 18 positive, −3% to +14% range) beside two lists: what the evidence supports and what it does not. A footer states the decision and the fictional-scenario note. The slide has `data-notes` with the full scope and limits.
- **`output/decision.json`**: written in the required shape, with the audience question copied exactly and no Markdown fences.

Choices I made:
- **Form:** I used figure tiles rather than a dot plot. The brief gives only summary figures, so a plot would have to invent per-plot values.
- **Reading of the question:** the evidence supports deciding on another measurement cycle, and does not yet support wider installation. The brief's constraints point that way, but the wording is my framing.
- **Causal claim:** the slide does not say lighting caused the differences. It states that plots were not randomly assigned.
- **Fictional note:** I kept the brief's "fictional scenario" note in the footer and in the caveats.

Verification and limits:
- I checked with grep that the inlined JS and both CSS lines appear verbatim in the HTML.
- The sandbox blocked running a build script and reading files outside the task directory, so I could not open the page in a browser. The text fits by estimate only, and the article clips overflow. Please open the file in a browser to confirm the layout.
- I deleted my scratch `build/` directory, so `output/` holds only the two deliverables.