# Project command rules

`.codex/rules/git-gh.rules` auto-approves common, reviewable Git and GitHub
CLI operations for this repository. Codex loads project rules when the project
is trusted. After adding or changing rules, restart the Codex session so the
rules are loaded.

The rules cover routine status and diff inspection, commits, worktree setup,
fast-forward-only pulls, pushes to `origin`, and the listed pull request,
issue, repository, and run commands. They do not allow broad `git` or `gh`
access, and they request approval for reset, clean, repository deletion, and
the listed force-push and admin-merge forms.

Rules match command prefixes. The prompt guards cover common destructive flag
positions, but they are not a complete argument parser: `git push origin`
still matches later arguments, and a force flag after an unlisted branch name
may not match a prompt guard. The same limitation applies to `--admin` after
an unlisted PR argument. Review complete commands before running them; use an
explicit approval for destructive forms not covered by a guard.

Project rules apply only when Codex trusts this repository. User or managed
policy may impose a stricter decision; a project rule cannot override it. Check
a decision with `codex execpolicy check --rules .codex/rules/git-gh.rules --
<command> <arguments>` when needed.
