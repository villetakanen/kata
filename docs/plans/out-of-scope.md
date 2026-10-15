# Work outside the initial Kata layout scope

Recorded 12 October 2026 during review of the [0.3.0 plan](0.3.0.md).
Status: excluded from 0.3.0; unscheduled. This is a record of questions and
possible follow-ups, not a commitment to deliver them in a future release.
Some may remain outside Kata permanently.

## Later alignment

The [vision](../../VISION.md) and [0.4.0 plan](0.4.0.md), agreed on 14 October
2026, supersede this record where composition and item separation are concerned.
Communicative composition includes expressive character, and Kata may recommend
separate items for competing content without designing their narrative sequence.
The exclusions on content authorship and internal representation remain. The
sections below preserve the rationale and deferrals recorded for 0.3.0.

## Boundary to study before expanding Kata

The initial scope is layout around supplied content. Prose, videos,
infographics, tables, and similar material can be inputs without Kata owning
their creation or internal design. Missing authoring guidance for these
content types is not automatically a catalogue gap.

Substantial study is needed to decide whether information structures, graphs,
and relationships belong in Kata at all. First establish what a layout tool
needs to understand to preserve supplied meaning, what belongs to authors or
specialist tools, and whether existing Kata patterns cross that boundary in
ways worth retaining. An acceptable outcome is to exclude these subjects.

The current hierarchy, dependency, comparison, composition, and time-series
patterns already touch content structure. Their presence is historical
capability, not evidence that Kata should expand into a general information
modeling system. The 0.3.0 scope decision does not remove those patterns.

## Information structures and relationships

The Lys usage report described near-identical progressive-enhancement tier
slides receiving different suggestions: dependencies or nesting versus aligned
comparison. It also reported a feedback loop present in notes but omitted from
a diagram. These are reasons to investigate the boundary, not sufficient
justification for new Kata patterns.

Moved out of the release:

- Guidance on ordered and cumulative tiers, inheritance, complete capabilities
  versus increments, and choosing matrices or nested representations for them.
- Distinctions among procedures, prerequisites, information flow, and lifecycle
  feedback, including arrow semantics and mixed edge types.
- Proposed tier and process examples and paired selection evaluations.
- Any seventh pattern motivated by these cases.

If the scope study supports further work, retain source-supported relations,
unknown values, and cycles. Do not infer capabilities or prerequisites from
names or visual order. Those are fidelity constraints on a possible future
study, not an implementation assignment.

## Content authorship and internal representation

The following remain outside the initial layout scope:

- Writing or rewriting prose, headlines, claims, or narrative arguments.
- Producing videos or designing an infographic's internal explanation.
- Classifying glossary, comparison, and ordered-lookup content to decide its
  internal representation, or converting it into a different form.
- Developing a taxonomy of lists, code samples, quotes, scales, and callouts
  as content-authoring patterns.
- Diagnosing multiple audience questions and restructuring them into a deck
  narrative or new slide sequence.

The earlier plan proposed glossary-versus-comparison guidance in
`comparison.md`, ordered-scale cases, a mixed-question split case, and a
changelog-versus-time-series case. These are moved here because they test
content organization or representation choice beyond arranging supplied
content. Existing safeguards against inventing measurements or changing
meaning remain valid; the release need not build a new taxonomy to retain
those safeguards.

## Separate evaluation-harness follow-ups

The report says one evaluator stopped at slide seven of ten and completed the
rest only after prompting. It also reports consistently long rationales.

Possible follow-ups are a review-only output contract, expected-versus-returned
slide-ID checks, missing/duplicate detection, and explicit preservation of
partial hand-backs and retries. These are potentially useful development
harness improvements, not content or layout capabilities. They are deferred
because 0.3.0 verifies its field-guide artifact directly; no release acceptance
criterion depends on implementing them. Simple checks that the guide covers
every current form remain in scope and do not require an agent-review protocol.

Freezing the original Lys deck revisions and raw evaluator reports would be
needed before claiming to reproduce that review. Until available, the report
is supplied evidence and derived briefs must be labeled as reconstructions.
A broader relationship-selection benchmark or human comprehension study would
need its own question, scope, and protocol.

## Deferred model-comparison evaluation

The earlier plan proposed comparing frozen 0.2.0 and candidate skills on new
supplied-content authoring briefs, including retained arrangements, prose or
code/table blocks, media with captions, a qualified number, and equal-priority
statements. That comparison and its new case corpus are deferred. The field
guide's artifact checks, visual review, and recorded dogfooding findings are
the release verification focus.

Revisit model runs when there is a specific question about agent behavior
that inspecting the guide cannot answer. Define the question and required
evidence before choosing cases, models, or attempt counts. A future comparison
should freeze inputs, hold prompts and settings constant within conditions,
keep answer keys outside authoring inputs, and report failed or incomplete
attempts. Skill changes and prompt experiments must remain distinguishable.
The existing runner and historical results remain available; this deferral
neither removes them nor requires new runs for 0.3.0.

## Lys-owned follow-ups

The report proposes these changes in the neighboring project:

- Preserve the feedback loop described in `themed.html` notes.
- Correct misnumbered slide comments in `full.html`.
- Consider capability matrices for progressive-enhancement tiers in
  `full.html` and `demo.html` only with source-supported cell values.

These are reported observations, not independently verified defects or
approved implementation tasks here. Any claim that a matrix improves the
slides requires actual output review. They are not Kata release dependencies.
A Lys runtime upgrade or separate Kata-Lys integration package is also outside
the proposed release.

## Re-entry decision

Before bringing an item back, establish why it belongs to Kata's layout
responsibility, what evidence motivates it, and the smallest bounded outcome.
If it requires content authorship or specialist modeling, consider leaving it
with another tool. Record an explicit scope decision before turning it into
release work; deferral alone is not approval.
