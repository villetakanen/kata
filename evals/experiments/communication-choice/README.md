# Communication-choice pilot

Bounded 0.4.0 trial: does changing the skill's selection guidance produce visibly
better choices than the current skill? This is not a catalogue replacement or
proof of general improvement.

## Controlled comparison

- Baseline: frozen `baseline-skill/` copied before the edit.
- Candidate: `candidate-skill/`, retained after the pilot; the runner froze the
  identical candidate from the working skill directory during the original runs.
- Same runner prompt, Lys 1.2.1, model (`gpt-6-luna`) and settings in both conditions.
- Two unfamiliar venue briefs share the same factual material in `content.md`.
  One asks for equal consideration; the other explicitly supplies a provisional
  recommendation and its reason. Only the latter adds that recommendation sentence.
- Four outputs: baseline/candidate × equal/recommended. One attempt each; no
  cherry-picking or retrying successful outputs. Run IDs distinguish the versions;
  both use the runner's `kata-candidate` slot to avoid labelling today's baseline
  as the historical 0.1.0 condition. The required unused 0.1.0 slot is not run.
- The evaluator keys stay out of author workspaces. This case is authored for the
  pilot and has not been added to the release benchmark case index.

## Review criteria (set before inspecting outputs)

1. Fidelity: preserve both options, every supplied value/constraint, provisional
   cost scope, and recommendation/approval status where supplied. No invented ranking.
2. Equal brief: neither option acquires an unsupported visual preference.
3. Recommendation brief: the supplied recommendation and reason have visible
   priority while the alternative remains available and readable.
4. Observable choices: explain hierarchy, grouping or spatial relationships
   actually visible in the output. A different template or stronger prose is not
   evidence of better judgment by itself; a matrix or familiar layout can pass.
5. Practical output: inspect presentation and phone sizes, keyboard focus,
   no-JavaScript access and print. Record failures separately from design judgment.

Compare the two briefs within each skill version, then compare versions. If both
versions already respond appropriately, report no demonstrated improvement. With
one model and one attempt per condition, findings are descriptive and stochastic;
there is no reader study, statistical result or ChatGPT/Cowork validation.

## Run

Use `node evals/runner/run.mjs --spec evals/experiments/communication-choice/baseline.json
--cli codex --condition kata-candidate --run-id <unique-baseline-id>
--results ../../results/communication-choice` (one command); repeat with
`candidate.json` and a distinct run ID. Retain manifests and failed attempts.

## Outcome

See [review.md](review.md) and [visual comparison](index.html). The candidate is
retained for inspection, not promoted to the delivered skill.
