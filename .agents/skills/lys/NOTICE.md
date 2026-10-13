# Lys authoring skill provenance

This is a complete, unmodified copy of `skill/SKILL.md` from the upstream Lys
repository, pinned to tag `v1.2.1` at commit
`c553aa5dbc36d5c6ddd819051384fdaf05c8cfd0`.

- Upstream: https://github.com/villetakanen/lys
- Skill version: 1.2.1
- Compatible runtime version: 1.2.1, already vendored in `examples/vendor/`
- License: MIT, as declared by upstream `package.json` at the pinned commit.
  There is no standalone license file in that upstream tree; see the runtime
  provenance in `examples/vendor/NOTICE.md` as well.

The skill has no required companion resource files. Its embedded `LYS:CSS` and
`LYS:JS` template blocks match the vendored runtime files byte for byte after
trimming surrounding whitespace; the project check enforces this. Updates are
deliberate copy-and-review operations: select an upstream commit, compare the
skill's instructions with the vendored Lys runtime and project packaging,
update this pin and its integrity check, then review generated decks. Normal
project work uses this local copy and never fetches moving upstream
instructions.
