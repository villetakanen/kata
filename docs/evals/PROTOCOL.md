# Kata 0.2.0 evaluation protocol

Protocol version: `kata-eval/v1`. The protocol keeps each attempt self-contained
so the same frozen task can be run with different CLIs and conditions. The
schemas and minimal fixtures in `schemas/` are the machine-readable reference.

## One attempt

An attempt is one case × one condition × one CLI. A manifest is the input to
one attempt; a result records what happened. The runner copies all referenced
inputs into the attempt directory before invoking a CLI. It records SHA-256
hashes for those copies and never reads a moving source file after freezing.
The brief and prompt are available to the authoring CLI; the fidelity key is
for later review and MUST NOT be included in the authoring prompt or its input
files.

Conditions are `plain-lys`, `kata-0.1.0`, and `kata-candidate`. For the
`kata-0.1.0` condition, freeze the delivered skill from tag `v0.1.0`; for
`kata-candidate`, freeze the complete candidate `skills/kata/` tree. Record the
revision and a SHA-256 digest for every file in each skill snapshot. Plain Lys
has no skill snapshot. Keep prompts byte-identical across conditions and CLIs
for the same case. Also freeze the exact Lys runtime/assets made available to
the authoring CLI (including vendored runtime files) and record its version and
the SHA-256 digest of every file. This prevents a later Lys update from
silently changing the task environment.

The attempt directory contains:

```text
manifest.json                 exact input manifest
inputs/brief.md               frozen authoring brief
inputs/prompt.md              frozen shared task prompt
inputs/skill/                  frozen skill tree, when applicable
output/slide.html             actual Lys-compatible HTML deliverable
output/decision.json          required decision and rationale record
output/final-response.md      final CLI response, unedited
output/tool.log               captured stdout/stderr or equivalent log
result.json                   metadata and outcome
```

The Lys artifact is the actual HTML produced for that attempt, copied into its
directory. A URL, screenshot, HTML excerpt, or source pointer is not a
deliverable. A successful result requires both `slide.html` and a valid
`decision.json`; a failure may preserve partial outputs and names each missing
file in `failure.reason`. Do not repair an output before preserving it.

## Manifest

Use `schemas/manifest.schema.json`. Paths are relative to the manifest and may
not escape the attempt directory. SHA-256 values are lowercase hexadecimal.
`tool.settings` is a JSON object for reproducibility (model parameters and
non-secret CLI flags); credentials, tokens, environment dumps, and secret
values are prohibited. Executable path is local runner configuration and is
not part of a checked-in manifest. `lys_snapshot` is required for all
conditions. The runner makes its frozen files available to the authoring CLI
and validates the produced HTML against that same runtime.

`answer_key` is metadata for the evaluator, not authoring input. The runner
must keep it outside the CLI's task folder or otherwise prove that the CLI
could not read it. Missing or failed tools receive an unavailable or failed
result rather than being omitted.

## Deliverables

`decision.json` follows `schemas/decision.schema.json`. It records the chosen
form (or `none`), the audience question, the reason the form fits or does not
fit, one consequential trade-off, and preserved caveats. It is the agent's
own decision record; it does not replace external fidelity review.

`slide.html` must be a real, local, Lys-compatible rendered document that can
be copied and later validated/rendered offline. The protocol does not prescribe
layout or claim that structural validity establishes readability. Issue #6
defines the validator and visual review procedure.

## Result and reproducibility

Use `schemas/result.schema.json`. There is one result per attempt, including
unavailable and failed attempts. Record UTC start/end times, requested and
observed CLI/version/model/settings, exit code when a process ran, status,
manifest digest, frozen brief/prompt/skill/Lys file digests, response/log paths, and
artifact paths plus digests when files exist. `unavailable` has no exit code;
`failed` records an exit code when available and a concise failure reason.
Never store credentials, authorization headers, secret environment values, or
unfiltered environment dumps. Logs must be reviewed or redacted before they
are retained.

Use a unique run ID and preserve all attempts, including incomplete attempts.
Do not overwrite source examples, the live skill, or a prior result. Human
review and automated Lys checks are separate records; neither can be inferred
from a successful CLI exit.

## Minimal fixtures

`schemas/examples/manifest.json` and `schemas/examples/result.json` show one
attempt. `schemas/examples/decision.json` shows the required decision shape.
Their paths and digests are illustrative; a runner replaces them with the
actual frozen files and hashes for each attempt.
