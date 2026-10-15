---
name: kata-dev-increment
description: Implement or review a bounded Kata development increment with explicit file ownership and verification evidence.
---

# Bounded implementation and review

Use when the coordinator delegates a concrete increment or independent review.
Inputs: task, owned files (for implementation) or exact review boundary, relevant plan, and expected result.

1. Read AGENTS.md, VISION.md, and the relevant plan. For demos, read the complete pinned `.agents/skills/lys/SKILL.md` before editing.
2. Respect the delegated boundary; do not edit other workers' files, commit, push, install dependencies, or fetch moving instructions. Raise cross-boundary needs to the coordinator.
3. Preserve supplied content and distinguish design judgment from evidence. Do not substitute agent approval for required project-owner review.
4. Implementation: create source artifacts, report changed files, run applicable bounded checks, and list gaps. Do not claim tests or visual inspections not performed.
5. Review: do not edit files; inspect the exact boundary, report actionable findings with file references and observable consequences, and distinguish blockers from suggestions.

Expected result: concise file list or ordered findings, checks actually performed, and unresolved decisions. The coordinator integrates, rebuilds, verifies, and publishes.
