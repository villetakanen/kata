# Evaluation result sets

This directory preserves CLI attempts and their frozen inputs. Attempt files
are evidence records: do not edit or overwrite `manifest.json`, `result.json`,
`inputs/`, `evaluator/`, or `output/` after a run. Each manifest records the
brief, prompt, skill, Lys, tool, and settings used; result records include
SHA-256 digests for frozen inputs and output artifacts. Browser validation
reports for the two release runs record the checker source digest; older
preflight review files predate that provenance field. The curated example QA
source and temporary verification script hashes are in
`docs/evals/release-review/provenance.json`.

## Run groups

| Directory | Attempts | Tool status | Purpose |
| --- | ---: | --- | --- |
| `release-0.2.0-20261012/` | 27 | 27 succeeded | Original full matrix: three cases × three conditions × three CLIs. |
| `release-0.2.0-corrective-20261012/` | 9 | 9 succeeded | Candidate-only retest: three cases × three CLIs after clarifying the shared viewport, keyboard, no-JavaScript, and print requirements. |
| `runner-contract-smoke/` | 3 | 3 succeeded | Preflight smoke, one CLI attempt per supported tool. |
| `runner-smoke/`, `runner-smoke-access/` | 6 | 6 failed | Earlier Codex-only preflight attempts; preserved to retain harness failures. |

The corrective retest changed both the task prompt and candidate skill relative
to the original matrix. Treat it as a combined task-and-skill intervention, not
as a clean head-to-head test of the skill change. Do not pool preflight attempts
with either evaluation run. Use each attempt's manifest and result for exact
tool, model, prompt, snapshot, and status details.

## Reviews and sharing

Visual, accessibility, and print review must not change the authored attempt.
For a render-only review, point `evals/lys/check.mjs --html` at the existing
`output/slide.html` and write screenshots, PDFs, and validation reports to a
separate `render-only/` directory. Record the source artifact hash and
`validator_source.sha256` with any review notes. Keep curated, selected review
copies and notes under `docs/evals/release-review/`, separate from these
runner records. Browser measurements and a generated PDF do not establish that
the slide is readable or that a reader can answer the brief.

Raw logs are not guaranteed to be free of host paths. The initial audit found
ephemeral temporary workspace paths in Codex manifest arguments and one local
user-home path in a corrective Claude log. It found no bearer tokens, provider
key patterns, or credential assignments in `tool.log` or `final-response.md`.
Before sharing raw logs outside the project, inspect them for environment and
path details. If a sanitized copy is needed, store it separately and preserve
the original artifact and its digest.
