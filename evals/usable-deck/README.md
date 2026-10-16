# Independent use of the compact Kata skill

The first generated deck passed the bounded trial without hand-editing its
layouts. Open the [four-slide NASA excerpt](../results/usable-deck/usable-20261016-b/codex/mars-power--kata-candidate--codex/output/slide.html)
or its [print PDF](../results/usable-deck/usable-20261016-b/codex/mars-power--kata-candidate--codex/review/print.pdf).

This record covers the first delivery's frozen three-file skill. The subsequent
shared-kit refinement expands the form examples, adds shared caption and label
practices, and makes the skill a gateway. It has not been rerun through this trial;
the frozen inputs and output below remain evidence for the earlier guidance.

## Inputs and isolation

The [brief](brief.md) selects text from Michael Chappell's **Mars Surface Power**,
NASA, February 2025: source pages 1, 2, the upper lists of 5, and 13. It preserves
source order, a qualified decision, supporting context, and two technology
categories with six explicitly excluded entries. Logos, illustrations and the
lower rationale table are outside the supplied excerpt. The source URL, hash
and NASA usage information are in [source.json](source.json); no endorsement is
implied.

The existing runner created a fresh temporary workspace containing only that
brief, the three portable Kata files, pinned Lys guidance and runtime, and output
instructions. It supplied neither the CCS example nor the repository history or
this development conversation. The [prompt](prompt.md) contains the pinned Lys
authoring skill verbatim. The evaluator's [answer key](answer-key.json) was withheld.

The run used Codex CLI 0.162.1 with the user's configured default. The tool log
reports `gpt-6-astra`, reasoning effort `xhigh`; no model override was requested.
Frozen inputs, outputs, hashes and the full tool log are retained in the
[attempt](../results/usable-deck/usable-20261016-b/codex/mars-power--kata-candidate--codex/manifest.json).

## What passed

- All four slides preserve exact supplied wording and order, including the
  decision's qualification about initial crewed missions.
- The title has a clear single focus. The supplied decision leads its supporting
  context. The two technology categories have equal columns and matching headings;
  all six excluded technologies retain visible strikeouts.
- All slides were visually inspected at 1440×900 and 390×844. Natural-height phone
  and JavaScript-disabled layouts retain all content without horizontal overflow.
- Arrow navigation, Home/End, visible Tab focus and no-JavaScript content checks
  passed. Resizing restores the current slide. All four
  printed pages were rasterized and inspected. No external assets were requested.
- The output remains byte-for-byte identical to the generated artifact. No manual
  layout corrections or additional layout instructions were needed.

The authoring agent reported that its environment prevented browser verification.
The coordinating agent completed browser and visual review afterwards. See the
[structural and browser record](../results/usable-deck/usable-20261016-b/codex/mars-power--kata-candidate--codex/review/validation.json)
and [content and visual review](../results/usable-deck/usable-20261016-b/codex/mars-power--kata-candidate--codex/review/content-review.json).
The validator's `human_visual_review` field remains unset because this was agent
review, not owner acceptance.

An earlier [infrastructure attempt](../results/usable-deck/usable-20261016-a/codex/mars-power--kata-candidate--codex/result.json)
failed before generation because the sandbox could not initialize the CLI's state
database. It is retained. Attempt `b` ran with the required host access and is the
single generated deck; there was no selection among multiple generated candidates.

This is evidence of usable instructions on one separate text-only task. It does
not establish comparative quality, cross-model reliability, dense-chart handling
or improved comprehension. Review used Chromium on this computer; no physical
device, projector, printer or screen-reader session was performed.

## Repeat when an observed failure warrants it

From the repository root, with Codex CLI configured:

```sh
node evals/runner/run.mjs --spec evals/usable-deck/evaluation.json --cli codex --condition kata-candidate --results ../results/usable-deck
```

The runner freezes a new attempt rather than replacing this evidence. The legacy
baseline field in the configuration is unused in this trial; always select
`kata-candidate`. Visual review is still required after generation.
