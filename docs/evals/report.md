# Kata 0.2.0 evaluation report

Run: `release-0.2.0-20261012` · Protocol: `kata-eval/v1` · Date: 12 October 2026

## Question and method

The evaluation asks whether agents can choose, adapt, or reject a visual form
while preserving the source facts in a Lys slide. It does not test whether the
golden ratio is preferred or improves comprehension.

The runner used the same three frozen briefs, shared task prompt, Lys 1.2.1
files, output requirements, and brand-neutral instructions in each condition:

- `plain-lys`: shared Lys authoring prompt without Kata guidance;
- `kata-0.1.0`: skill snapshot from the `v0.1.0` tag; and
- `kata-candidate`: candidate skill snapshot.

The case set contains one primary-message pilot brief, one aligned-options
comparison, and one brief with overlapping categories, differing denominators,
missing observations, and a non-comparable baseline. The source facts and
fidelity keys are in the [case index](../../evals/cases/index.json). All cases
and figures are fictional. The briefs include explicit constraints, so results
show how each tool followed these instructions with this sample; they are not
an unconstrained measure of a model's general pattern knowledge.

## Run completion

| CLI | Observed CLI version | Observed model | Attempts | CLI exit success | Structural pass |
| --- | --- | --- | ---: | ---: | ---: |
| Claude Code | 2.1.296 | `claude-haiku-5-5` (requested alias `haiku`) | 9 | 9 | 8/9 |
| Codex CLI | 0.162.1 | `gpt-6-luna` | 9 | 9 | 9/9 |
| pi | 1.1.0 | `gpt-6-luna` via `openai-codex` | 9 | 9 | 9/9 |

All 27 CLI attempts returned exit code 0 and supplied the required HTML and
decision JSON. Each case used the same task-prompt SHA-256 across all three
conditions and CLIs; the digests are recorded in [semantic-review.json](semantic-review.json).
The prompt asked for output usable without JavaScript, but did not specify
viewport sizes, keyboard operation, or print review. The original matrix still
informs form choice and authored source-fact text coverage. Its phone, keyboard,
and print browser findings are exploratory because those targets were not
specified in the task prompt. Results stay separated by CLI and model below.

## Claude Code

Observed model: `claude-haiku-5-5`; nine attempts across the three conditions.

| Brief | Plain Lys | Kata 0.1.0 | Candidate |
| --- | --- | --- | --- |
| Pilot review | Decision summary with evidence tiles | Composition | Aligned comparison |
| Shuttle options | Comparison table | Aligned comparison | Aligned comparison |
| Retrofit feedback | Separate source panels with an explicit not-answerable conclusion | Aligned comparison | Separate aligned-bar panels by source |

These labels summarize the agents' own decision records. They are not
independent scores of choice quality. For the retrofit brief, the candidate
kept partner figures separate, but the decision record framed them as an
aligned comparison; the overall ranking and change questions remain
unanswerable from the supplied sources.

## Codex CLI

Observed model: `gpt-6-luna`; nine attempts across the three conditions.

| Brief | Plain Lys | Kata 0.1.0 | Candidate |
| --- | --- | --- | --- |
| Pilot review | Decision slide with range and median evidence | Evidence-to-decision pathway | Asymmetric evidence-and-action composition |
| Shuttle options | Comparison table with qualifying option highlighted | Aligned comparison matrix | Aligned comparison matrix |
| Retrofit feedback | Separate evidence panels and answerability callout | Source-separated evidence comparison | Asymmetric summary adapted around the answerability conclusion |

These labels summarize the agents' own decision records and are kept within
this CLI/model condition. They do not establish a performance advantage over
the other CLIs.

## pi

Observed model: `gpt-6-luna` through `openai-codex`; nine attempts across the
three conditions.

| Brief | Plain Lys | Kata 0.1.0 | Candidate |
| --- | --- | --- | --- |
| Pilot review | Decision slide with evidence and limitations | Decision-led evidence summary | Asymmetric composition with adjacent evidence and qualifications |
| Shuttle options | Comparative table | Aligned comparison matrix | Aligned comparison matrix |
| Retrofit feedback | Evidence comparison with answerability gaps | Evidence-gated two-part comparison | Evidence-status asymmetric composition |

These labels summarize the agents' own decision records and are kept within
this CLI/model condition. They do not establish a performance advantage over
the other CLIs.

## Fidelity, reasoning, and Lys artifacts

A separate agent source-fact text review compared authored slide HTML with the
case answer keys; it did not count decision JSON self-assessments as evidence.
The per-attempt record is in [semantic-review.json](semantic-review.json).
Covered facts here are present in HTML source text. This does not establish that
they remained visible after clipping or were readable in the rendered slide.
All nine shuttle HTML artifacts contained the required threshold, four options'
values and units, energy estimate basis and exclusions, and correct qualifying
answer. Eight of nine pilot HTML artifacts contained all six required facts;
pi's candidate showed 12/18 positive but did not explicitly state that six were
not positive. On retrofit, most HTML artifacts contained the source-specific
counts and reasons an overall ranking and turnaround change cannot be
determined. The review records three partial
caveat issues: Codex 0.1.0 omitted that South did not record other barriers;
Codex candidate omitted that North supplied no turnaround times; and pi
candidate only implied that South's other barriers may be present. Claude's
retrofit candidate headline says installer barriers lead in each source, which
is unsupported because South recorded only one barrier; its body correctly
says no South ranking is possible. Targeted encoding review also found a
quantitatively misplaced axis on Codex's plain-Lys pilot slide, despite its
correctly stated numbers; the Codex candidate pilot axis was correctly scaled.
Claude's source-specific retrofit bars and pi 0.1 pilot's 12/18 share were
proportionally encoded. These are selected artifact-level observations, not a
complete encoding audit or comparative scores; details are recorded in the
semantic review JSON.

Independent agent judgment from source text and decisions: all nine shuttle
outputs use aligned comparisons for options with the same threshold and source
values. Pilot outputs use several structures; more than one can support the
cautious measurement decision, so this brief has no unique winning form.
Retrofit outputs generally keep partner evidence separate or make the
answerability gap prominent; the overall ranking and change question remain
unanswerable. Claude's candidate retrofit headline is the noted unsupported
exception. These qualitative judgments are not a scored review of every
rationale or a reader study.

Three preflight runs of three cases each were preserved separately from the 27-attempt
matrix: [runner-smoke](../../evals/results/runner-smoke/) had CLI exits with
status 1; [runner-smoke-access](../../evals/results/runner-smoke-access/) made
CLI calls but produced decision JSON with the wrong protocol; and
[runner-contract-smoke](../../evals/results/runner-contract-smoke/) returned
successful CLI exits but the validator rejected an unreferenced frozen
`evaluator/reader-task.md`. These runs exposed invocation and contract issues;
they are not included in matrix totals. The runner and check were corrected
before the full matrix.

The structural checker accepted 26 of 27 outputs. It rejected Claude Code's
plain-Lys retrofit HTML because its embedded vendored CSS differed by a removed
trailing Vite marker comment. This strict byte mismatch does not by itself show
that the HTML failed to render or that its layout was unreadable. Structural
and browser findings are separate.

Automated browser geometry results are per CLI. For the original matrix, 22
attempts failed because content was clipped by hidden/clip overflow at a target
size, four passed, and one did not run after the strict contract failure. The
checker also records scrollable overflow separately. It does not assess whether
text is readable or table cells overlap. Claude's candidate pilot passed those
geometry checks even though visual review found microscopic text and overlapping
table content.

| CLI | Geometry pass | Geometry fail | Not run |
| --- | ---: | ---: | ---: |
| Claude Code | 2 | 6 | 1 |
| Codex CLI | 1 | 8 | 0 |
| pi | 1 | 8 | 0 |

These are artifact checks, not model-quality scores.

The checked-in 14-slide gallery/deck was separately inspected at presentation
and phone sizes: all 14 rendered with no overflow, keyboard navigation worked,
content remained available without JavaScript, and final print checks showed
no focus rings, blank pages, or clipping. Human judgment is still needed for
grouping, emphasis, label association, and reading order. Screenshots, PDFs,
and the verification record are in the [release review archive](release-review/verification.json).

The original prompt and artifacts remain frozen. The completed corrective run
using the revised skill and expanded prompt is summarized separately below.

## Corrective candidate check

A separate nine-attempt run tested the revised candidate skill together with a
corrected shared prompt. All nine CLI calls succeeded. The revised prompt
spells out 1440×900 and 390×844 review, keyboard navigation, no-JavaScript
content, and print inspection. Per-case task-prompt hashes are recorded in
[corrective-review.json](corrective-review.json). They differ from the original
run, so this combined intervention cannot isolate the effect of the skill
change and must not be pooled with the original matrix.

| CLI | CLI success | Structural pass | Attempt browser pass / fail / not run | Standalone HTML browser pass |
| --- | ---: | ---: | ---: | ---: |
| Claude Code | 3/3 | 1/3 | 1 / 0 / 2 | 2 |
| Codex CLI | 3/3 | 3/3 | 2 / 1 / 0 | 0 |
| pi | 3/3 | 3/3 | 2 / 1 / 0 | 0 |

Claude's pilot and shuttle HTML failed the exact vendored-CSS byte check
because each omitted only the trailing `/*$vite$:1*/` marker; their remaining
vendored CSS matched the frozen file, with the custom theme appended. Separate
HTML-only checks passed for those two renderings; those checks do not establish
the full manifest, result, or decision contract. Codex's pilot phone layout
also uses scrollable overflow, which the corrected validator records separately
from clipping. These are per-artifact validation outcomes, not a CLI quality
comparison.

The authored HTML text for eight of the nine retest slides includes every
answer-key required fact. Pi's pilot slide states 12 of 18 plots were positive,
but leaves the fact that six were not positive implicit; this is partial
coverage of the keyed spread fact. Pi's retrofit slide also omits the source
caveat that North supplied no service-turnaround times, which is not a separate
required-fact ID in the answer key. Separately, pi pilot's chart positions are inaccurate: on a
−3% to +14% scale, zero belongs at 17.65% and +6% at 52.94%; the chart places
them at 50% and 58.82%. Claude's pilot phone chart also has overlapping −3% and
0% labels. Source-text coverage does not guarantee faithful encoding or
readability. The corrected validator distinguishes hidden/clip clipping from scrollable
overflow. Coordinator phone review inspected the top and scrolled bottom for all
nine attempts; text and caveats were reachable by scrolling in each. It found
overlapping chart labels on Claude's pilot, incorrect quantitative positions on
pi's pilot, presentation clipping on both Codex and pi retrofit slides (severe
on pi), and a Codex shuttle units footer extending beyond its rounded card while
remaining reachable.

Coordinator print review inspected all nine PDFs: seven had a print layout
issue (blank first page, content or footer spilling to a second page, or clipped
lower content); the Codex and pi shuttle PDFs were single-page and visually
intact. Some PDFs also showed focus outlines. Print review is separate from
automated browser measurements, and a browser pass does not establish print
acceptance. These are coordinator/agent artifact reviews, not human reader
outcomes. The per-attempt text, encoding, phone, print, and validation review
is in [corrective-review.json](corrective-review.json).

## Reader outcomes and limits

No independent human reader task was run, so there are no comprehension or
reader-outcome observations. Agent rationale, attractive specimens, structural
checks, and browser measurements are not substitutes for that evidence.

The sample has three deliberately authored fictional briefs, one CLI version
and model configuration per tool, and explicit constraints that reveal
important parts of the expected response. Results support debugging these
examples and guidance. They do not establish that Kata generally improves
slides, that one CLI is better, that readers understand the outputs better, or
that people prefer the golden ratio.

## Revisions made from the review

- The candidate guidance now asks authors to reflow phone layouts while keeping
  qualifications readable, and to avoid headlines that rank categories absent
  from the source. See the [delivered skill](../../skills/kata/SKILL.md).
- The shared task prompt now states the 1440×900 and 390×844 targets, keyboard,
  no-JavaScript, and print expectations. The validator separates scrollable
  overflow from clipped content; see the [evaluation protocol](PROTOCOL.md)
  and [Lys review tool](../../evals/lys/README.md).
- The examples received phone and print fixes, then passed the final 14-slide
  review documented in the [release review archive](release-review/verification.json).

## Artifacts

Original attempts are preserved under
[`evals/results/release-0.2.0-20261012/`](../../evals/results/release-0.2.0-20261012/),
with a manifest, result record, decision, response, log, and HTML per attempt.
The protocol, case corpus, validator, and persistent regression checks run by
`npm run check` are described in [`PROTOCOL.md`](PROTOCOL.md), [the case
index](../../evals/cases/index.json), and [`evals/lys/README.md`](../../evals/lys/README.md).
