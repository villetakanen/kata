I wrote the single-slide deck to `output/slide.html` and the decision record to `output/decision.json`. I could not render or test the deck, so its layout at 1440×900 and 390×844, its print output, and the no-JavaScript view are unverified.

**Form:** a headline answer with a labelled range scale. The brief gives only the median (+6%), the range (−3% to +14%), and 12 of 18 positive, with no per-plot values. A dot plot of individual plots would have required inventing data. The scale marks the zero line, the median, and both ends, with the counts and caveats in text beside it.

**Answer on the slide:** the pilot supports deciding whether to run another measurement cycle, not wider installation. The slide states the scope (18 plots, three sites, one winter cycle) and the limits: non-random assignment, sites that differed, no cost or energy data, and no claim that lighting caused the differences. The speaker notes carry the same caveats.

**Choices I made:**
- The phone view stacks the slide as a normal scrolling page. The default Lys slide is 16:9 and would crop at 390 px wide.
- The desktop sizes are in container units, so print keeps the same proportions as the screen.
- The slide carries a footer noting the source is a fictional scenario with invented figures, since the brief says so.

**Problems and gaps:**
- Shell commands that execute code, including `node`, were blocked by an approval prompt. I could not run the assembler in `build/`, so I wrote `output/slide.html` by hand, copying the vendored `lys.css` and `lys.iife.js` in verbatim. I checked the asset files for closing-tag collisions. I could not byte-compare the copied runtime, and it has not been executed.
- Not verified: rendering at 1440×900 and 390×844, print, JavaScript-disabled view, and keyboard navigation. The deck has one slide, so ArrowLeft and ArrowRight have nothing to move between.
- `build/` (the template and assembler) is still in the task directory, outside `output/`. I could not delete it without shell access.