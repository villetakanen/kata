I wrote the single-slide Lys deck to `output/slide.html` and the decision record to `output/decision.json`. I did not render the slide in a browser, so the layout is checked only by reading the CSS, not by looking at it. I also did not run a JSON parser on `decision.json`; I checked its syntax by eye.

**Slide**
- **Form:** whole-and-parts (composition). A grid of 18 squares shows 12 positive and 6 not positive, so the denominator stays visible. The grid is verified by grep: 12 positive, 6 not.
- **Headline:** "The pilot supports deciding on another measurement cycle, not wider installation."
- **Body:** the median +6%, the −3% to +14% range, and the scope (18 plots, 3 sites, one winter cycle) are text beside the grid. Two columns separate what the evidence supports from what it does not yet support.
- **Caveats kept:** non-random assignment, differing crop mix and baseline conditions, no causal claim, and cost and energy use unmeasured. The footer keeps the "fictional scenario" note from the brief.
- **Offline and no-JS:** `lys.css` and `lys.iife.js` are inlined. The bundle contains no `</script` or `<!--`, so inlining is safe. The text reads without JavaScript, and square states carry a text label as well as color.
- **Speaker notes:** `data-notes` restates the pilot facts and the limits.

**Decision record**
- `form` is `composition`. The trade-off I recorded is that the grid shows counts but not magnitudes, so the +6% and the range rely on the text.