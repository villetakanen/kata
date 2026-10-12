Create one single-file Lys slide that answers the audience question using the supplied brief. Use the standard Lys structure: a `<div data-lys>` containing one or more `<article>` slides. Include a document language, character set, viewport, title, a heading on each slide, and useful `data-notes`. Inline the supplied `lys.css` in a `<style>` element and `lys.iife.js` in a `<script>` element so the HTML works offline. Keep the content readable without JavaScript and use a custom theme. Choose the form that best preserves the evidence and makes the answer clear; do not choose a form just to satisfy these review targets.

Make the complete message and its necessary evidence, uncertainty, and caveats readable at both a 1440×900 presentation viewport and a 390×844 phone viewport. Keep the deck keyboard-operable using Lys navigation; if it has multiple slides, verify ArrowLeft and ArrowRight move between them. Keep the information available when JavaScript is disabled, and make the HTML print without clipping or losing essential labels and qualifications. Preserve uncertainty, caveats, units, denominators, and meaningful relationships. Do not invent facts. Save only the requested deliverables in the output directory.

Write `output/decision.json` as valid JSON with exactly this shape and protocol value (replace the example values):

```json
{
  "protocol": "kata-eval-decision/v1",
  "audience_question": "copy the audience question",
  "form": "chosen form, or none",
  "fit_rationale": "why the form fits or does not fit",
  "tradeoff": "one consequential trade-off",
  "caveats": ["preserved caveat"]
}
```

Do not include Markdown fences in `decision.json`.

Case brief: inputs/brief.md
Audience question: Which shuttle option meets the minimum range at the lowest upfront cost?
Constraints:
- Use one slide.
- Compare all options on the same criteria.
- Show range in kilometres and costs in thousands of dollars.
If a skill snapshot exists, read it from inputs/skill/. The vendored Lys runtime and assets are in inputs/lys/. Embed the supplied Lys CSS and JavaScript into the HTML artifact so it works offline. Write the actual local HTML artifact to output/slide.html and make output/decision.json match the JSON example above exactly. Do not look for or request an answer key. The task directory is isolated; do not access files outside it.
