I wrote `output/slide.html` and `output/decision.json`. I could not run a JSON parser or open the slide in a browser, so neither file has been checked by execution.

**The slide** is one 16:9 Lys slide with the vendored `lys.css` and `lys.iife.js` inlined, so it works offline. Its heading is "Installer scheduling leads North's survey; the sources cannot yet show whether turnaround improved." It has three parts:
- **Partner North:** horizontal bars for the 40 respondents, with the overlap noted (28 installer scheduling, 17 upfront cost, 9 unclear eligibility; the counts total 54).
- **Partner South:** 9 of 15 support cases mention waiting for an installer. Other barriers were not recorded, so South is not ranked against North.
- **Two verdicts:** the most common barrier overall cannot be determined, and turnaround improvement cannot be shown. South's recent partial median is 8 days from 11 of 15 cases, and the "around two weeks last spring" note has no method, so it is not a baseline.

It closes with what is needed to answer: a shared period and denominator, per-homeowner barrier data or an overlap rule, turnaround times for the same period from both partners, and a dated baseline with its method. The speaker notes in `data-notes` repeat the same points.

**The decision record** uses the form "annotated horizontal bars with separate per-source evidence panels and explicit not-answerable verdicts." The trade-off is that the audience gets no single headline barrier figure, which is less immediate but avoids a pooled ranking built on incompatible denominators.

**Two things to know:**
- **Inlining was done by hand.** The sandbox blocked the splice script, so I copied the CSS and JS text into the HTML directly. Please check that the embedded runtime matches `inputs/lys/` byte for byte before relying on it.
- **No skill snapshot.** `inputs/skill/` does not exist, so I did not use one.