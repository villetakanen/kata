The slide and decision file are written, but **the HTML is not finished**. The Lys CSS and JavaScript are not yet inlined, so `output/slide.html` still has `/*LYS_CSS*/` and `/*LYS_JS*/` placeholders and won't run offline.

**What's blocked:** Inlining needs a script that reads `inputs/lys/lys.css` and `inputs/lys/lys.iife.js` and splices them into the HTML. The sandbox rejected both `python3 -I embed_lys.py` and a `sed` splice because it can't verify them against the read restriction. I didn't retype the 7 KB runtime by hand, since one wrong character would break it.

**To finish:** approve running `python3 -I embed_lys.py` from the workspace root. The script is already there and only reads the two vendored Lys files and rewrites `output/slide.html`. Afterwards I'll delete it and check that no placeholders remain. If you'd rather not approve it, tell me another way to splice the files and I'll use that.

**What's done:**
- `output/slide.html`: a `<div data-lys>` with one `<article>` carrying `data-notes`, a `lang`/charset/viewport/title head, a heading, and a custom theme in a second `<style>` block. The layout is readable without JavaScript.
  - Left: the pilot facts (18 plots, 3 sites, one winter; median +6%; range −3% to +14%; 12 of 18 positive). A range bar with a 0% line and an 18-dot count grid show these. I did not draw a per-plot dot plot because the brief has no per-plot values.
  - Right: the supported step (authorize another measurement cycle) and two unsupported claims (wider installation on yield alone, and any causal claim). Cost and energy use are noted as unmeasured.
  - Footer: scope and the "fictional scenario" note from the brief.
- `output/decision.json`: valid JSON in the exact required shape, with no Markdown fences. Its form is "single annotated slide", the trade-off is that per-plot magnitudes aren't shown, and the caveats cover the pilot scope, non-random assignment, the lack of a causal claim, and unmeasured cost and energy.