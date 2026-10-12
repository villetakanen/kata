Create one single-file Lys slide that answers the audience question using the supplied brief. Use the standard Lys structure: a `<div data-lys>` containing one or more `<article>` slides. Include a document language, character set, viewport, title, a heading on each slide, and useful `data-notes`. Inline the supplied `lys.css` in a `<style>` element and `lys.iife.js` in a `<script>` element so the HTML works offline. Keep the content readable without JavaScript and use a custom theme. Choose the form that best preserves the evidence and makes the answer clear. Preserve uncertainty, caveats, units, denominators, and meaningful relationships. Do not invent facts. Save only the requested deliverables in the output directory.

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
Audience question: Which retrofit barrier is most common overall, and did service turnaround improve?
Constraints:
- Use one slide.
- Do not combine the two reporting sources or rank barriers across them without compatible denominators.
- Do not infer change without a comparable baseline.
- State what information is needed to answer the audience question.
If a skill snapshot exists, read it from inputs/skill/. The vendored Lys runtime and assets are in inputs/lys/. Embed the supplied Lys CSS and JavaScript into the HTML artifact so it works offline. Write the actual local HTML artifact to output/slide.html and make output/decision.json match the JSON example above exactly. Do not look for or request an answer key. The task directory is isolated; do not access files outside it.
