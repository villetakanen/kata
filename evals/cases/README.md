# Evaluation cases

`index.json` is the versioned case index consumed by the runner. Each entry
maps directly to the attempt manifest in `docs/evals/PROTOCOL.md`:

- `id` and `revision` become `case.id` and `case.revision`.
- `brief` and `answer_key` resolve relative to this directory and become the
  manifest's frozen file references after copying and hashing.
- `audience_question` and `constraints` become `task.audience_question` and
  `task.constraints`.
- `reader_task` is reserved for the later reader review. Do not include it in
  the authoring prompt.

Each `brief.md` contains the author-visible source facts, audience question,
and constraints. Keep `answer-key.json` evaluator-only. Its `required_facts`
are factual checks; `disallowed_claims` identify unsupported conclusions;
`acceptable_choices` describe valid representation or response options without
requiring a particular layout.

The index and each answer key carry explicit protocol/version identifiers and
each case has a revision so attempts can record the exact frozen case.
All three cases and their figures are fictional and were written for this
evaluation; they are not drawn from the curated service-launch examples.
