---
name: kata
description: Choose and adapt slide patterns for comparisons, parts of a whole, hierarchies, dependencies, and change over time. Use when turning structured information into a clear slide or improving its visual structure. Works with a slide renderer and optional brand skill; does not plan a whole deck narrative.
---

# Kata

Start with the relationship the audience needs to understand. Choose the visual structure before applying a theme. A slide may communicate a useful fact without making a recommendation.

## Choose a pattern

| Audience question | Pattern | Read |
| --- | --- | --- |
| How do these options differ on the same criteria? | Aligned comparison | [comparison](references/comparison.md) |
| What makes up this total? | Whole and parts | [composition](references/composition.md) |
| What belongs inside what? | Nested groups | [hierarchy](references/hierarchy.md) |
| What depends on what? | Directed dependencies | [relationship](references/relationship.md) |
| How did this measure change? | Time series | [change-over-time](references/change-over-time.md) |

Read the relevant reference, rather than all five. If the data mixes relationships, choose the one that answers the audience's main question, or separate the questions into slides. Do not force geographic, distributional, or other unsupported data into this set. Offer a more suitable structure and explain the mismatch briefly.

## Adapt to the information

Identify the audience question, the units and scope of the supplied data, and a supportable headline. Preserve missing values as unknown; distinguish them from zero. Ask for missing information when it changes the meaning, such as whether categories overlap or what a dependency arrow represents. Otherwise proceed with a stated assumption.

Keep labels, units, denominators, dates, uncertainty, and sources that affect interpretation. Do not invent measurements, causal explanations, option weights, or winners. The worked examples use fictional data and are layout specimens, not evidence to reuse in a real presentation.

Each reference includes a message, a layout, an example, a failure condition, and a rationale. The rationales are design judgments. Gestalt vocabulary supplies analogies, not proof that a layout is universally effective. When making empirical psychology claims, find and cite research supporting the particular claim.

## Render with the available tools

Kata owns the information structure and its reading order. The renderer owns slide behavior and output format. The brand skill owns typography, colors, imagery, and other visual identity. Preserve meaningful scales, grouping, and labels when applying a brand. The examples' cream and rust theme is replaceable and is not a Futurice theme.

For Lys, read [the integration note](references/integration.md) and use the available Lys skill or documented HTML contract. For another output format, use its authoring workflow. Kata works without Lys or a brand skill and does not install either. Only claim an integration was tested when the actual output has been inspected.

## Review the slide

Check whether a reader can answer the audience question from the visual without reconstructing the source prose. Check data fidelity, meaningful grouping, and the suggested reading order. Make numeric encodings proportional; do not use decorative size or area to imply magnitude. Inspect at presentation size for clipped text, unreadable labels, and connectors that imply the wrong relationship. Preserve a text equivalent for charts and diagrams, and use labels or shape as well as color.

Deliver the slide in the requested format. Include the chosen pattern and consequential assumptions in the accompanying explanation when useful; keep authoring instructions out of the audience's slide.
