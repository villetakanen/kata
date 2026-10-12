# Project command rules

`.codex/rules/git-gh.rules` auto-approves common, reviewable Git and GitHub
CLI operations for this repository. Codex loads project rules when the project
is trusted. After adding or changing rules, restart the Codex session so the
rules are loaded.

The rules cover routine status and diff inspection, commits, worktree setup,
fast-forward-only pulls, pushes to `origin`, and the listed pull request,
issue, repository, and run commands. They do not allow broad `git` or `gh`
access, destructive cleanup or reset commands, repository administration, or
API calls. Command prefixes match following arguments, so a push rule for
`git push origin` also matches later options such as `--force`; review push
arguments and use an explicit approval when a force push is requested.

Project rules apply only when Codex trusts this repository. User or managed
policy may impose a stricter decision; a project rule cannot override it. Check
a decision with `codex execpolicy check --rules .codex/rules/git-gh.rules --
<command> <arguments>` when needed.
