The slide and decision file are in `output/`. I did not render the slide in a browser or parse the JSON with a tool, because Python and `sed` were blocked by the sandbox. I checked the JSON by reading it and checked the HTML structure by grep.

**What I made**
- **`output/slide.html`**: one Lys slide with the Lys CSS and JS inlined, so it works offline. The headline is "The pilot supports deciding on another measurement cycle. It does not yet support wider installation." The slide has two tables:
  - **What the pilot measured:** 18 plots at 3 sites over one winter cycle, median +6% vs. each site's reference plots, range −3% to +14%, 12 of 18 positive, non-random assignment, and cost and energy not measured.
  - **Next steps the evidence speaks to:** another measurement cycle (the group can decide this; the pilot doesn't answer cost, energy, or causal questions) and wider installation (not yet supported).
  - A footer states that the +6% is an observed difference and that the pilot did not show lighting caused it.
  - Speaker notes carry the same scope and limits.
- **`output/decision.json`**: protocol `kata-eval-decision/v1`, form "aligned comparison", with six preserved caveats.

**Choices I made**
- **Form:** I used a comparison table rather than a chart. The brief has only summary figures and no per-plot values, so a plot chart would have to invent data.
- **Wording:** I kept the recommendation to what the evidence supports and did not recommend wider installation.

**Not done**
- The `work/` folder (template and a build script that didn't run) is still in the task directory, outside `output/`.