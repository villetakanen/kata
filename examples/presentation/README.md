# A real briefing composed with Kata

Open [the presentation](deck.html) to use the seven-slide example, or
[the gallery](../index.html) to read its compositional choices and alternatives.
The HTML embeds Lys and its fonts and works when copied on its own.

The input is an explicitly selected excerpt of Crown Commercial Service's
**techUk Event**, 25 February 2020. Source pages 1, 3, 5, 6, 8, 13 and 21 retain
their wording and original order. Other pages, logos and decorative background
shapes are outside the supplied fixture. These are historical statements, not
current procurement guidance. Line breaks and spatial arrangements change;
content, values, qualifiers and associations do not.

[content.json](content.json) freezes the supplied text, source pages, source-file
hash and design rationales. [theme.css](theme.css) and the
[builder](../../scripts/build-presentation.mjs) generate the deck and gallery.
The checked-in HTML is ready to open; rebuilding does not fetch anything.

## Public presentation sample

The web scan considered different kinds of real presentation, rather than only
layout templates. The two selected inputs were downloaded and text-extracted; their comparison
and priority pages were also visually inspected. The other entries were considered through
their publisher's description or document text and are reference candidates.

| Presentation | Why it is useful for Kata | Use here |
| --- | --- | --- |
| [CCS supplier briefing, February 2020](https://assets.crowncommercial.gov.uk/wp-content/uploads/techUK-25-Feb-2020.pdf) | Short titles, purpose with supporting capabilities, ordinary lists, peer comparison, descriptions of unequal length | Seven-slide worked excerpt |
| [NASA Mars Surface Power, February 2025](https://www.nasa.gov/wp-content/uploads/2025/02/2025-ia-workshop-wp-mars-surface-power.pdf) | A supplied decision, supporting context and two technology categories with explicit excluded entries | Separate fresh-context trial using a declared text-only excerpt |
| [GitLab investor presentation, Q4 FY2026](https://s204.q4cdn.com/984476563/files/doc_financials/2026/q4/Q4-FY2026-GitLab-Overview-Investor-Presentation.pdf) | Numerous metrics, qualifications and mixed business content | Considered as a later density test; not copied into this delivery |
| [Buffer's original fundraising deck](https://buffer.com/resources/the-slide-deck-we-used-to-raise-half-a-million-dollars/) | Short business statements and competitive positioning | Publisher's account reviewed; not copied into this delivery |

## Attribution and reuse

Source text: Crown Commercial Service, Crown copyright. The
[CCS terms](https://www.crowncommercial.gov.uk/terms-and-conditions) publish its
content under the [Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/1/open-government-licence.htm)
unless otherwise identified. The source PDF contains no separate attribution on
the selected text. Logos are excluded. Kata's rearrangement is not endorsed by CCS.
The source was retrieved on 16 October 2026; its SHA-256 is in the content file.

The example uses the adopted Kata paper, ink and petrol colours, Newsreader and
Archivo fonts under the SIL Open Font License. Font licences and the pinned Lys
runtime notice are embedded in the HTML. The portable skill requires neither
these fonts nor this identity.

## Verification

The current gallery and deck were inspected at 1440×900 and 390×844 with JavaScript
on and off. All seven slides retain their supplied wording and reading order.
Equal options have matching treatment; the purpose leads its supporting material;
longer service descriptions retain their labels and readable text. Phone layouts
stack fields instead of shrinking the presentation canvas. Side-by-side comparison
is consequently reduced on phones.

Keyboard checks cover ArrowRight, Home, End and visible Tab focus. The deck is
also checked when resizing between presentation and reading modes. Both gallery
and deck produce seven print pages, inspected after PDF rasterization. Offline
browser requests are blocked during testing; no external assets are requested.
The compact [verification record](verification.json) records the checked artifact
hashes and browser measurements. Automated fidelity checks include negative
controls that remove a qualifier or change an ownership relationship.

This is agent visual review, not owner acceptance, a reader study, or proof of
improved comprehension. Testing uses Chromium on this computer, not physical
phones, projectors, screen readers or printers. The source is a selected excerpt;
this delivery does not demonstrate arbitrary dense-chart recomposition.

Run `npm run build` and `npm run check` from the repository root. Visual review
is required after changing rendered layouts. The separate
[fresh-context trial](../../evals/usable-deck/README.md) tests use of the portable
instructions without the example or this development conversation.
