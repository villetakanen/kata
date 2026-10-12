# Evaluation runner

`run.mjs` creates one protocol-v1 attempt for each selected case, condition, and
CLI. It freezes the brief, shared prompt, skill snapshot, and vendored Lys files,
records a digest for each, then runs the authoring CLI in a temporary directory
outside the Kata repository. The evaluator key remains under the attempt's
`evaluator/` directory; it is never copied into the CLI workspace. Frozen
workspace inputs are read-only.

The default spec is [`evaluation.json`](evaluation.json). It points to the case
index, vendored Lys runtime, current Kata skill, and the `v0.1.0` Git tag. It
requests Claude's `haiku` alias, Codex `gpt-6-luna`, and pi's
`openai-codex/gpt-6-luna`. Claude's JSON response metadata is used to record the
resolved model ID. Those IDs and non-secret settings are recorded in each
manifest and result. The runner never copies environment variables or
credentials into artifacts.

## Prerequisites and commands

Use Node 20 or newer, a checkout containing the `v0.1.0` Git tag and frozen
`examples/vendor/` Lys files, and signed-in CLI installations for the tools
being evaluated. Use the same model and settings for a given CLI across all
conditions. `model` is passed through the CLI's model option. Extra non-secret
CLI flags belong in that tool's `args` array and are passed verbatim. The
`settings` object is descriptive metadata only; it is recorded but not applied
to the CLI. Do not put credentials or secret values in the spec.

Run the full matrix:

```sh
node evals/runner/run.mjs --spec evals/runner/evaluation.json
```

Run one CLI or condition:

```sh
node evals/runner/run.mjs --spec evals/runner/evaluation.json --cli codex
node evals/runner/run.mjs --spec evals/runner/evaluation.json --cli claude --condition kata-candidate
```

`--cli all` and `--condition all` are the defaults. The runner executes up to
three CLI processes at once for each case and condition. Results are written
under `evals/results/<run-id>/<cli>/<case--condition--cli>/`. A dry run freezes
the inputs and writes unavailable results without invoking a CLI:

```sh
node evals/runner/run.mjs --spec evals/runner/evaluation.json --dry-run
```

If the case index is elsewhere, pass `--case-index <path>`. A failed CLI,
missing executable, authentication error, timeout, or missing deliverable is
recorded in that attempt's `result.json`; it is not omitted. A successful CLI
must create both `output/slide.html` and a valid `output/decision.json`.
Structural and visual Lys validation is handled separately by issue #6.

The shared authoring prompt gives every condition the same review targets:
readability at 1440×900 and 390×844, Lys keyboard navigation, readable content
with JavaScript disabled, and print output without clipped essential content.
These are task requirements; the prompt leaves form choice to the evidence and
audience question. Browser measurements and generated print output are recorded
separately from human visual review.

The output directories are unique and never overwritten. Choose a new `--run-id`
to start a separate run. Each CLI runs from an isolated temporary workspace
outside the repository so Kata's development instructions do not enter the
plain Lys condition; the workspace is removed after the outputs are preserved.
