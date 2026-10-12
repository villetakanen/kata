I wrote the one-slide deck to `output/slide.html` and the decision record to `output/decision.json`. I could not render or test the slide in a browser, and I could not run Node to parse the JSON, so the layout, print, keyboard and phone checks are unverified.

**The answer on the slide:**
- **Most common barrier: not established overall.** Within Partner North's survey, installer scheduling is the most-selected barrier (28 of 40, 70%). Upfront cost is 17 of 40 (42.5%) and unclear eligibility is 9 of 40 (22.5%). Partner South's 9 of 15 cases (60%) mention waiting for an installer, but South did not record other barriers, so it cannot be ranked. The two sources are not pooled.
- **Did turnaround improve: cannot tell.** The only turnaround median is South's 8 days from 11 cases with a recorded time, which is recent and partial. The "around two weeks last spring" note has no cases, sample or method. North has no turnaround times. No improvement is claimed.
- **Needed to answer:** a shared barrier question with an overlap rule and common denominators, a mapping between the partners' categories (not assuming "installer scheduling" equals "waiting for an installer"), and a defined turnaround measure applied to a baseline and a recent period from both partners.

**Form:** separate-source aligned bars, one panel per source with its own denominator. Turnaround is text-only because no comparable measure exists, so a chart would imply a comparison the data cannot support.

**Build notes:**
- The Lys CSS and JS are inlined verbatim. I confirmed this with `grep -F -f` against the vendored files, not by eye.
- The theme is a custom paper-and-teal palette. Phone layout stacks the two columns. Print is set to A4 portrait with the content allowed to flow across pages.
- The sandbox blocked Node and the sed pipeline, so I wrote both files by hand. The JSON follows the example shape but has not been parsed.

**Not checked:** rendering at 1440×900 and 390×844, the no-JavaScript view, print output, and ArrowLeft/ArrowRight. This is a single slide, so arrow keys have nothing to move between.