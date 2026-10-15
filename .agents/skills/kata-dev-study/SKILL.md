---
name: kata-dev-study
description: Create or revise a Kata design-study page with contextual alternatives, provenance and an owner decision. Use for study work, not routine implementation of accepted design tokens.
---

# Design studies

Input: a bounded design question, supplied content, constraints and existing decisions.
Output: one browsable study page, its source/assets, and a verification record.

- Read the relevant plan and VISION.md; inspect the current study and accepted DS.
- Respect the owner's scope and stopping point. Do not reopen accepted choices or require another study to proceed with implementation.
- Start with what the item should communicate. Hold supplied content constant where comparing treatments; identify what varies.
- Show considered alternatives in context. Choose their number to suit the question, not a fixed template.
- Explain each alternative's role and trade-off beside it. Keep the copy direct; avoid slogans, transcripts and speculative reader benefits.
- Distinguish design judgment, personal associations and empirical evidence.
- Record sources, asset licences and whether content is genuine or illustrative. Preserve supplied meaning and qualifications.
- Keep documentation styling separate from the examples. Use the living DS for current surroundings; paper and petrol belong only inside examples.
- For slide demos, read the pinned `.agents/skills/lys/SKILL.md` and deliver Lys decks with readable previews or embedded examples.
- Use `examples/studies/<number>-<topic>/` with local source and styles. Follow the existing build conventions and add the page to the study index.
- Make the question, alternatives, rationale, date, contributors and review status discoverable without chat history. Keep credits factual and proportionate.
- Record the owner's actual choice and accepted trade-offs. Agent recommendations are not owner adoption; mark unresolved choices explicitly.
- Iterate within an unpublished study. Preserve meaningful rejected alternatives or clearly describe their replacement.
- Once published, preserve historical appearance and reasoning. Use a linked successor for substantive changes, with reciprocal supersession links; label corrections.
- After adoption, update current DS/tokens only within the requested scope. Historical studies must not import changing live styles.
- Rebuild changed generated outputs and run `npm run check`. Include sources and generated artifacts.
- Inspect desktop and phone views, keyboard access, no-JavaScript and print with narration. Check relevant contrast, font loading/fallbacks and zoom; record gaps honestly.
- Prepare stable links and bundled assets for publication. Do not claim public availability until hosting is verified, or infer deployment authority from study work.

The workflow stays here in the development harness, outside the portable `skills/kata/` product.
