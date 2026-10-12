# Lys artifact checks

The checker separates deterministic contract failures from optional browser
measurements and human review. A successful CLI exit is not evidence that its
HTML or decision record is valid.

## Validate one completed attempt

```sh
node evals/lys/check.mjs --attempt evals/results/<run-id>/<cli>/<case>/<condition>
```

The directory must contain `manifest.json` and `result.json` using the v1
contract. On success, the checker verifies:

- manifest/result structure, result status and run ID, and the manifest SHA-256;
- safe relative paths and SHA-256 values for the frozen brief, evaluator key,
  prompt, skill files, Lys snapshot, decision, HTML, final response, and log;
- result input/artifact records against the files on disk and the declared
  output directory;
- decision fields against the decision schema, with unknown fields rejected;
- one `[data-lys]` deck root with direct `<article>` slides;
- the exact snapshotted Lys CSS and JavaScript, either embedded or linked to
  files covered by the snapshot; and
- no remote, escaping, or missing HTML/CSS resource files.

The checker writes `review/validation.json` and returns a non-zero exit status
on structural failure. It preserves the attempt files. For a failed or
incomplete attempt, use `--html` to review any HTML that was produced; that
mode checks the HTML but explicitly does not claim the manifest, result, or
decision contract passed.

## Check an HTML file

```sh
node evals/lys/check.mjs --html examples/kata-lys.html --lys-dir examples/vendor
node evals/lys/check.mjs --html examples/index.html
```

Standalone mode checks basic HTML structure, local resources, and—when the
document has a Lys deck root and `--lys-dir` is given—the exact `lys.css` and
`lys.iife.js` files in that directory. It discovers the repository root for
relative local references. This mode is useful for gallery or deck artifacts
that do not have evaluation manifests.

## Optional browser review evidence

With Playwright Test installed and Chromium available, add `--review` and point
`--playwright-module` at its module directory:

```sh
node evals/lys/check.mjs --html examples/kata-lys.html --lys-dir examples/vendor \
  --review --playwright-module /path/to/node_modules/@playwright/test
```

The checker saves 1440×900 and 390×844 screenshots for each Lys slide and
reports per-slide horizontal and vertical scroll/client dimensions with
computed overflow modes. It also records a keyboard navigation check (or
keyboard focus check for a static gallery), a JavaScript-disabled content
check, and a generated print PDF under
`lys-review/` (or the attempt's `review/`). It records browser failures under
`review`, separately from deterministic `structural` failures. The PDF is
evidence for a person to inspect; generating it does not establish that print
pagination or clipping is acceptable. The dependency is optional and is not
added to Kata's package dependencies.

Measured overflow is reported by axis. Only actual overflow with computed
`hidden` or `clip` is an automated clipping error. `auto` or `scroll` overflow
is recorded for manual review rather than treated as a failure; scrollability
does not establish that the content is readable. Visible overflow is also
reported without being classified as clipping. Each validation report records
the SHA-256 of `evals/lys/check.mjs` so results identify the validator version
that produced the measurements.

Automated checks do not judge grouping, emphasis, label association, reading
order, or whether readers can answer the brief. Record those visual/readability
judgments separately in `human_visual_review`; the generated report leaves
that field `not-recorded` until a reviewer supplies notes. No check establishes
improved comprehension.
