# 0.2.0 release visual review evidence

This folder contains selected rendered examples and review records for the
updated gallery (`index`) and Lys deck (`kata-lys`). The automated browser pass
used 1440×900 and 390×844 viewports. It checked all 14 slides in each artifact
(seven before/after pairs), recorded horizontal and vertical dimensions, tested
keyboard navigation for the deck and keyboard focus in the gallery, and
confirmed content was present with JavaScript disabled. The generated print
PDFs contain 14 pages each.

The coordinator visually reviewed the gallery and deck screenshots at both
sizes, the golden-cut fit and mismatch examples, and print output. Four selected
after-state screenshots preserve those golden-cut examples at desktop and
phone sizes. `verification.json` contains the recorded browser measurements,
keyboard/no-JavaScript results, and structural errors. This was internal visual
QA, not a human reader study; it does not establish comprehension or improved
decision-making.

The files in this folder are review copies. The evaluation attempts and their
authored outputs remain in `../../../evals/results/`; do not edit them to
create review evidence. `provenance.json` records SHA-256 digests for the
reviewed gallery, deck, theme, build script, and temporary verification script.
The temporary script itself is not part of this archive.
