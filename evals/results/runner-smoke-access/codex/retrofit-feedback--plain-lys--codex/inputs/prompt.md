Create a single Lys slide that answers the audience question using the supplied brief. Choose the form that best preserves the evidence and makes the answer clear. Preserve uncertainty, caveats, units, denominators, and meaningful relationships. Do not invent facts. Save only the requested deliverables in the output directory.

Case brief: inputs/brief.md
Audience question: Which retrofit barrier is most common overall, and did service turnaround improve?
Constraints:
- Use one slide.
- Do not combine the two reporting sources or rank barriers across them without compatible denominators.
- Do not infer change without a comparable baseline.
- State what information is needed to answer the audience question.
If a skill snapshot exists, read it from inputs/skill/. The vendored Lys runtime and assets are in inputs/lys/. Embed the supplied Lys CSS and JavaScript into the HTML artifact so it works offline. Write the actual local HTML artifact to output/slide.html and your decision record to output/decision.json. The decision record must be valid JSON following kata-eval-decision/v1 with audience_question, form, fit_rationale, tradeoff, and caveats. Do not look for or request an answer key. The task directory is isolated; do not access files outside it.
