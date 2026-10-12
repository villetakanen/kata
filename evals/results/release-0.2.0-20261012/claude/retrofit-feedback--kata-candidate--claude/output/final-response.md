The slide and decision file are in `output/`: `slide.html` (single file, Lys CSS and JS inlined) and `decision.json`.

**The answer the slide gives:**
- **Most common barrier:** there is no overall ranking, because the two sources can't be pooled. Within Partner North, installer scheduling leads (28 of 40 homeowners, 70%). Within Partner South, "waiting for an installer" is the only barrier recorded (9 of 15 cases, 60%), so it can't be ranked against others.
- **Turnaround:** no improvement is claimed. South's recent median is 8 days from 11 of 15 cases, and it is partial. The "around two weeks last spring" note has no sample or method, so it isn't a comparable baseline. North reported no turnaround times.
- **Needed to answer:** a shared period definition and denominator, South barrier counts that record every barrier, turnaround measured the same way for a baseline and the recent period (with case and missing-time counts), and turnaround data from North.

**Choices I made:**
- **Form:** aligned bars in separate panels per source, each scaled to its own denominator. Turnaround is text, not a chart, since a chart would imply a trend.
- **Theme:** a neutral custom palette set through Lys public tokens, with labels carrying the meaning rather than colour alone.
- **Caveats:** the fictional-scenario note, overlapping selections (counts sum to 54), and the missing turnaround times are all kept on the slide.

**Not verified:** I could not render the slide in a browser. Reads outside the task folder were blocked, and running Python or `sed` needed approval. I built the file with `cat`/`head`/`tail` instead, and checked it by tag balance and byte counts. I also estimated the layout by hand at 1280×720 and trimmed it to fit, but I haven't seen it rendered, so check it in a browser before relying on it.