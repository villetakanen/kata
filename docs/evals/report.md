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
The runner's prompt did not require specific viewport sizes,
keyboard operation, no-JavaScript reading, or print review. The original matrix
still informs form choice and visible source-fact coverage; its browser findings
are exploratory for phone and print usability. Results stay separated by CLI
and model below.

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

A separate visible-text review compared each slide with the case answer key;
it did not count decision JSON self-assessments as evidence. The per-attempt
record is in [semantic-review.json](semantic-review.json). All nine shuttle
slides showed the required threshold, four options' values and units, energy
estimate basis and exclusions, and correct qualifying answer. Eight of nine
pilot slides stated all six required facts; pi's candidate showed 12/18 positive
but did not explicitly state that six were not positive. On retrofit, most
slides preserved the source-specific counts and the reasons an overall ranking
and turnaround change cannot be determined. The review records three partial
caveat issues: Codex 0.1.0 omitted that South did not record other barriers;
Codex candidate omitted that North supplied no turnaround times; and pi
candidate only implied that South's other barriers may be present. Claude's
retrofit candidate headline says installer barriers lead in each source, which
is unsupported because South recorded only one barrier; its body correctly
says no South ranking is possible. These are artifact-level observations, not
comparative scores.

The structural checker accepted 26 of 27 outputs. It rejected Claude Code's
plain-Lys retrofit HTML because its embedded vendored CSS differed by a removed
trailing Vite marker comment. This strict byte mismatch does not by itself show
that the HTML failed to render or that its layout was unreadable. Structural
and browser findings are separate.

Automated browser geometry results are per CLI. They detect content taller
than visible slide boxes, but do not assess whether text is readable or table
cells overlap. Claude's candidate pilot passed those geometry checks even
though visual review found microscopic text and overlapping table content.

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
grouping, emphasis, label association, and reading order.

A follow-up 9-attempt candidate check is using both the revised skill and a
corrected shared prompt that explicitly requests 1440×900 and 390×844 review,
keyboard use, no-JavaScript content, and print. It is a combined intervention,
not an isolated test of the skill revision, and must remain separate from these
27 attempts. The original prompt and artifacts remain frozen.

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

## Artifacts

Original attempts are preserved under
[`evals/results/release-0.2.0-20261012/`](../../evals/results/release-0.2.0-20261012/),
with a manifest, result record, decision, response, log, and HTML per attempt.
The protocol, case corpus, validator, and persistent regression checks run by
`npm run check` are described in [`PROTOCOL.md`](PROTOCOL.md), [the case
index](../../evals/cases/index.json), and [`evals/lys/README.md`](../../evals/lys/README.md).
