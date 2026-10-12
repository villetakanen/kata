I made the one-slide Lys deck at `output/slide.html` and the decision file at `output/decision.json`. Neither has been rendered in a browser, and I did not run a JSON parser on the decision file because that command was blocked. I checked both by reading them.

**The answer on the slide:** Within Partner North, installer scheduling is the most cited barrier (28 of 40 homeowners, 70%). There is no overall ranking, because the two partners used different denominators and South recorded only one barrier. Turnaround change cannot be determined. There is one recent partial median (8 days from 11 of 15 cases) and one unmethoded "around two weeks last spring" note, so there is no comparable baseline. The slide ends with what is needed to answer both parts: shared barrier definitions with an overlap rule, a common denominator and period per partner, and turnaround measured the same way for a baseline and the current period.

**Choices I made:**
- **Form: aligned comparison.** Each partner gets its own panel with bars on a zero-based 0–100% track, and each bar's value and denominator are printed as text. I did not use a time series, because a line or slope would imply a change the data cannot support.
- **Turnaround is stated in text, not plotted.** The unmethoded "last spring" note is not drawn as a bar next to the 8-day median.
- **South's "waiting for an installer" is not equated with North's "installer scheduling."** The slide says the link is not established.
- **Theme:** warm paper background, dark ink, and one teal accent for the bars. Labels carry all the information, so colour is not the only signal.
- **Lys runtime:** I inlined `lys.css` and `lys.iife.js` unchanged, after checking that neither contains a closing `</script>` or `</style>` tag. The slide's content is plain HTML, so it is readable without JavaScript.

**Still to do:** open `output/slide.html` in a browser to check that the 16:9 layout does not clip text at presentation size, and check the arrow-key and print behaviour. The scratch folder I used for assembling the file has been removed.