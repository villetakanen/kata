import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const head = title => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>`;
const theme = await read('examples/theme.css');
const lysCss = await read('examples/vendor/lys.css');
const lysJs = await read('examples/vendor/lys.iife.js');
const lysNotice = (await read('examples/vendor/NOTICE.md')).replaceAll('--', '—');
const deckNavigation = `const deckRoot = document.querySelector('[data-lys]');
deckRoot.addEventListener('lys:slidechange', event => {
  if (matchMedia('(max-width: 600px)').matches) event.detail.slide.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelector('[data-lys-nav]').addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  event.preventDefault();
  Lys.Lys.from(deckRoot).goTo(decodeURIComponent(link.hash.slice(1)));
});`;
const data = JSON.parse(await read('examples/data.json'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const list = items => `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
const table = (caption, headers, rows) => `<table><caption class="sr-only">${esc(caption)}</caption><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((v, i) => i === 0 ? `<th scope="row">${esc(v)}</th>` : `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const patterns = [];
const c = data.comparison;
patterns.push({ id: 'comparison', name: 'Comparison', principle: 'Align the criteria', question: 'Which options meet the launch limits?',
  why: 'Shared rows let the reader compare one criterion at a time. The constraints support a shortlist, without inventing a winner.',
  beforeTitle: 'Launch options',
  before: `<p class="context">Limits: ${c.maxWeeks} weeks · €${c.maxCost}k initial budget</p>${list(c.options.map(o => `${o.name}: ${o.weeks} weeks, €${o.cost}k initial cost, ${o.control.toLowerCase()} control.`))}`,
  afterTitle: 'Buy and Partner meet both launch limits',
  after: `<p class="context">Limits: ${c.maxWeeks} weeks · €${c.maxCost}k initial budget</p>${table('Estimated launch options', ['Criterion', ...c.options.map(o => o.name)], [['Lead time · weeks', ...c.options.map(o => o.weeks)], ['Initial cost · €k', ...c.options.map(o => o.cost)], ['Control', ...c.options.map(o => o.control)]])}<p class="conclusion">The remaining trade-off is control.</p>`,
  note: 'One-time cost and lead-time estimates. Lifetime cost is outside this comparison.' });
const p = data.composition;
patterns.push({ id: 'composition', name: 'Composition', principle: 'Make the whole visible', question: 'Where does the launch budget go?',
  why: 'A single bounded bar gives each allocation a share of the same whole. Direct labels preserve the exact amounts.',
  beforeTitle: 'Launch budget allocation', before: `<p class="context">Planned budget: €${p.total}k</p>${list(p.parts.map(x => `${x.name}: €${x.value}k`))}`,
  afterTitle: 'Product accounts for half of the launch budget',
  after: `<p class="total">€${p.total}k <span>planned launch budget</span></p><div class="stack" role="img" aria-label="${esc(p.parts.map(x => `${x.name} ${x.value / p.total * 100}%`).join(', '))}">${p.parts.map((x, i) => `<div class="segment s${i}" style="flex:${x.value}">${x.value / p.total * 100}%</div>`).join('')}</div><dl class="parts">${p.parts.map((x, i) => `<div><dt><span class="key s${i}" aria-hidden="true"></span>${esc(x.name)}</dt><dd>€${x.value}k <span>· ${x.value / p.total * 100}%</span></dd></div>`).join('')}</dl>`,
  note: 'Exclusive categories cover the whole planned budget. This is not actual spending.' });
const h = data.hierarchy;
patterns.push({ id: 'hierarchy', name: 'Hierarchy', principle: 'Show what belongs where', question: 'How is the launch work grouped?',
  why: 'Containment expresses membership. Equal areas avoid introducing an unsupported claim about team size.',
  beforeTitle: 'Launch workstreams', before: `<p class="prose">${esc(h.name)} has ${h.groups.map(g => `${esc(g.name)}, which includes ${g.children.map(esc).join(' and ')}`).join(', and ')}.</p>`,
  afterTitle: 'Launch work belongs to two workstreams',
  after: `<div class="programme"><h3>${esc(h.name)}</h3><div class="groups">${h.groups.map(g => `<section><h4>${esc(g.name)}</h4>${list(g.children)}</section>`).join('')}</div></div>`,
  note: 'Workstream membership, not reporting lines. Area does not indicate team size.' });
const r = data.relationship;
const edgeText = r.edges.map(([a, b]) => `${a} must finish before ${b}.`);
const positions = { Research: [10, 50], Design: [245, 50], Build: [480, 50], Launch: [755, 50], Compliance: [480, 225] };
const edges = r.edges.map(([a, b]) => {
  const [x, y] = positions[a], [tx, ty] = positions[b];
  const d = y === ty ? `M ${x + 175} ${y + 40} H ${tx - 10}` : `M ${x + 175} ${y + 40} H ${tx + 87} V ${ty + 90}`;
  return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="3" marker-end="url(#arrow)"/>`;
}).join('');
const nodes = r.nodes.map(n => { const [x, y] = positions[n]; return `<rect x="${x}" y="${y}" width="175" height="80" rx="2" fill="${n === 'Launch' ? 'var(--accent)' : 'var(--paper)'}" stroke="currentColor" stroke-width="2"/><text x="${x + 87.5}" y="${y + 47}" text-anchor="middle" fill="${n === 'Launch' ? '#fff' : 'currentColor'}">${esc(n)}</text>`; }).join('');
patterns.push({ id: 'relationship', name: 'Relationship', principle: 'Keep the dependencies intact', question: 'What must finish before launch?',
  why: 'The separate Compliance branch preserves the join at Launch. There are no dates or durations to support a critical-path claim.',
  beforeTitle: 'Launch prerequisites', before: list(edgeText),
  afterTitle: 'Launch requires both Build and Compliance',
  after: `<p class="context">Arrows mean “must finish before”</p><svg viewBox="0 0 940 340" role="img" aria-labelledby="dependency-title dependency-desc"><title id="dependency-title">Launch prerequisites</title><desc id="dependency-desc">${esc(edgeText.join(' '))}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>${edges}${nodes}</svg><div class="mobile-equivalent"><p>Required sequence:</p>${list(edgeText)}</div>`,
  note: 'Spacing does not represent duration. Build and Compliance are independent prerequisites for Launch.' });
const t = data['change-over-time'];
const px = i => 70 + i * 164;
const py = v => 320 - v / 12 * 264;
const ticks = [0, 3, 6, 9, 12].map(v => `<line x1="70" y1="${py(v)}" x2="890" y2="${py(v)}" stroke="var(--line)"/><text x="45" y="${py(v) + 7}" text-anchor="end">${v}</text>`).join('');
const points = t.points.map((v, i) => `${px(i)},${py(v.days)}`).join(' ');
patterns.push({ id: 'change-over-time', name: 'Change over time', principle: 'Preserve the shape of change', question: 'How did onboarding time change?',
  why: 'The line exposes both the overall fall and the April increase. A zero baseline keeps the magnitude easy to interpret.',
  beforeTitle: 'Average onboarding time', before: `<p class="context">January–June ${t.year} · days</p><p class="prose">${t.points.map(v => `${v.month}: ${v.days}`).join('. ')}.</p>`,
  afterTitle: 'Average onboarding time fell from 10 to 5 days',
  after: `<svg viewBox="0 0 940 390" role="img" aria-labelledby="time-title time-desc"><title id="time-title">Average onboarding time in days, January–June ${t.year}</title><desc id="time-desc">${esc(t.points.map(v => `${v.month}: ${v.days} days`).join('. '))}. April rose before the decline continued.</desc><text x="70" y="25">Days</text>${ticks}<polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="5"/>${t.points.map((v, i) => `<circle cx="${px(i)}" cy="${py(v.days)}" r="6" fill="var(--accent)"/><text x="${px(i)}" y="${py(v.days) - 17}" text-anchor="middle" class="value">${v.days}</text><text x="${px(i)}" y="355" text-anchor="middle">${v.month}</text>`).join('')}</svg><div class="mobile-equivalent">${table(`Monthly onboarding time in ${t.year}`, ['Month', 'Days'], t.points.map(v => [v.month, v.days]))}</div>`,
  note: `${t.year} monthly means · ${t.cohortSize} completed onboardings per month · consistent measurement. Causes and within-cohort variation are unknown.` });

const golden = JSON.parse(await read('examples/golden-cut/data.json'));
const launch = golden.launch;
patterns.push({ id: 'golden-cut', name: 'Golden cut · useful fit', principle: 'Give the primary message room', question: 'What launch date should the team plan around?',
  why: 'The date is the main message; its security-review condition stays visible beside it. The asymmetry follows this brief’s priority and does not make the date certain.',
  beforeTitle: 'Launch date and condition',
  before: `<p class="prose">The service is planned to launch on ${esc(launch.date)}. The ${esc(launch.review.toLowerCase())} is due ${esc(launch.reviewDue)}; the launch date is ${esc(launch.status.toLowerCase())}.</p>`,
  afterTitle: `Plan around ${launch.date}`,
  after: `<div class="golden-layout"><div class="golden-primary"><span>Planned launch</span><strong><time datetime="${esc(launch.dateIso)}">${esc(launch.date)}</time></strong></div><aside class="golden-context"><h3>Condition</h3><p>${esc(launch.review)} due ${esc(launch.reviewDue)}.</p><p>${esc(launch.status)}.</p></aside></div>`,
  note: `${launch.status}. ${launch.review} due ${launch.reviewDue}. Fictional planning data; the condition affects interpretation of the date.` });
const g = golden.comparison;
patterns.push({ id: 'golden-cut-mismatch', name: 'Golden cut · mismatch', principle: 'Keep comparable options aligned', question: 'Which options meet both launch limits, and how do they differ on control?',
  why: 'Buy and Partner both meet the same limits. An asymmetric split would give one candidate extra emphasis; a shared table compares the same measures without implying a winner.',
  beforeTitle: 'An asymmetric view makes Buy look primary', beforeLabel: 'Poor fit · forced emphasis',
  before: `<p class="context">Limits: ${g.maxWeeks} weeks · €${g.maxCost}k initial budget</p><div class="golden-layout"><div class="golden-primary"><span>Buy</span><strong>${g.options[0].weeks} weeks · €${g.options[0].cost}k</strong><p>${g.options[0].control} control</p></div><aside class="golden-context"><h3>Partner</h3><p>${g.options[1].weeks} weeks · €${g.options[1].cost}k</p><p>${g.options[1].control} control</p></aside></div>`,
  afterTitle: 'Buy and Partner both meet the limits',
  after: `<p class="context">Limits: ${g.maxWeeks} weeks · €${g.maxCost}k initial budget</p><div class="equal-comparison">${table('Options that meet both launch limits', ['Criterion', ...g.options.map(o => o.name)], [['Lead time · weeks', ...g.options.map(o => o.weeks)], ['Initial cost · €k', ...g.options.map(o => o.cost)], ['Control', ...g.options.map(o => o.control)]])}</div><p class="conclusion">Both qualify; control differs.</p>`,
  note: 'Initial cost and lead-time estimates. Both options meet the stated limits. Giving Buy more area would imply an unjustified priority; area does not encode these figures.' });

const guide = [
  { id: 'aligned-comparison', name: 'Aligned comparison', ref: 'comparison', title: 'Which options meet the launch limits?',
    fit: 'Use shared rows when supplied alternatives already share criteria and the audience needs to compare their trade-offs.',
    limit: 'Poor fit when options are judged on unrelated criteria or the descriptions need long narrative text.',
    specimen: `<p class="context">Limits: ${c.maxWeeks} weeks · €${c.maxCost}k initial budget</p>${table('Estimated launch options', ['Criterion', ...c.options.map(o => o.name)], [['Lead time · weeks', ...c.options.map(o => o.weeks)], ['Initial cost · €k', ...c.options.map(o => o.cost)], ['Control', ...c.options.map(o => o.control)]])}<p class="conclusion">Buy and Partner meet both limits; control remains a trade-off.</p>`,
    source: 'One-time cost and lead-time estimates. Lifetime cost is outside this comparison.' },
  { id: 'whole-and-parts', name: 'Whole and parts', ref: 'composition', title: 'Where does the launch budget go?',
    fit: 'Use a proportional bar when supplied exclusive parts add up to a known whole and the audience asks about allocation.',
    limit: 'Poor fit when categories overlap or the total is unknown; precise ranking of similar parts is clearer with aligned bars.',
    specimen: `<p class="total">€${p.total}k <span>planned launch budget</span></p><div class="stack" role="img" aria-label="${esc(p.parts.map(x => `${x.name} ${x.value / p.total * 100}%`).join(', '))}">${p.parts.map((x, i) => `<div class="segment s${i}" style="flex:${x.value}">${x.value / p.total * 100}%</div>`).join('')}</div><dl class="parts">${p.parts.map((x, i) => `<div><dt><span class="key s${i}" aria-hidden="true"></span>${esc(x.name)}</dt><dd>€${x.value}k · ${x.value / p.total * 100}%</dd></div>`).join('')}</dl>`,
    source: 'Exclusive categories cover the planned budget. This is an allocation, not actual spending.' },
  { id: 'nested-groups', name: 'Nested groups', ref: 'hierarchy', title: 'What belongs in each workstream?',
    fit: 'Use containment when supplied membership gives each item one parent and the audience needs to see the groups.',
    limit: 'Poor fit for shared membership, cross-group dependencies, or inferred reporting authority.',
    specimen: `<div class="programme"><h3>${esc(h.name)} · workstream membership</h3><div class="groups">${h.groups.map(g => `<section><h4>${esc(g.name)}</h4>${list(g.children)}</section>`).join('')}</div></div>`,
    source: 'Membership is the relationship shown. Equal areas do not indicate team size or capacity.' },
  { id: 'directed-dependencies', name: 'Directed dependencies', ref: 'relationship', title: 'What must finish before launch?',
    fit: 'Use a small directed diagram when supplied prerequisites and their forks or joins matter.',
    limit: 'Poor fit for dense networks or questions about dates and durations; use a timeline when timing is known.',
    specimen: `<p class="context">Arrows mean “must finish before”</p><p class="diagram-hint">Scroll diagram horizontally →</p><div class="guide-diagram"><svg viewBox="0 0 940 340" role="img" aria-labelledby="guide-dependency-title guide-dependency-desc"><title id="guide-dependency-title">Launch prerequisites</title><desc id="guide-dependency-desc">${esc(edgeText.join(' '))}</desc><defs><marker id="guide-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>${edges.replaceAll('url(#arrow)', 'url(#guide-arrow)')}${nodes}</svg></div><div class="mobile-equivalent">${list(edgeText)}</div>`,
    source: 'Build and Compliance are independent prerequisites for Launch. Spacing does not represent duration.' },
  { id: 'time-series', name: 'Time series', ref: 'change-over-time', title: 'How did onboarding time change?',
    fit: 'Use a line when supplied observations track one consistently defined measure over time and the audience asks about change.',
    limit: 'Poor fit for an unmeasured process sequence, missing observations joined as if measured, or a question about only two points.',
    specimen: `<p class="context">Monthly average · days · ${t.cohortSize} completed onboardings per cohort · ${t.year}</p><div class="guide-chart"><svg viewBox="0 0 940 390" role="img" aria-labelledby="guide-time-title guide-time-desc"><title id="guide-time-title">Average onboarding time, January–June ${t.year}</title><desc id="guide-time-desc">${esc(t.points.map(v => `${v.month}: ${v.days} days`).join('. '))}.</desc><text x="70" y="25">Days</text>${ticks}<polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="5"/>${t.points.map((v, i) => `<circle cx="${px(i)}" cy="${py(v.days)}" r="6" fill="var(--accent)"/><text x="${px(i)}" y="${py(v.days) - 17}" text-anchor="middle" class="value">${v.days}</text><text x="${px(i)}" y="355" text-anchor="middle">${v.month}</text>`).join('')}</svg></div><div class="mobile-equivalent">${table(`Monthly onboarding time in ${t.year}`, ['Month', 'Days'], t.points.map(v => [v.month, v.days]))}</div>`,
    source: 'Monthly means; consistent measure. April rises before the decline continues. Causes and within-cohort variation are unknown.' },
  { id: 'asymmetric-composition', name: 'Asymmetric composition', ref: 'golden-cut', title: `What launch date should the team plan around?`,
    fit: 'Use unequal fields when the brief supports one primary message and a smaller adjacent field can keep its qualification visible.',
    limit: 'Poor fit when claims have equal importance or the secondary field cannot remain legible.',
    specimen: `<div class="golden-layout"><div class="golden-primary"><span>Planned launch</span><strong><time datetime="${esc(launch.dateIso)}">${esc(launch.date)}</time></strong></div><aside class="golden-context"><h3>Condition</h3><p>${esc(launch.review)} due ${esc(launch.reviewDue)}.</p><p>${esc(launch.status)}.</p></aside></div>`,
    source: `${launch.status}. ${launch.review} due ${launch.reviewDue}. Fictional planning data; the condition qualifies the date.` }
];

const fieldGuide = `${head('Kata — field guide')}<!-- Generated by scripts/build-examples.mjs.
${lysNotice}
--><style>${lysCss}</style><style>${theme}</style><style>
.field-guide [data-lys] { --lys-slide-max-height: calc(100vh - 64px); height: 100vh; padding-top: 64px; grid-auto-rows: calc(100vh - 64px); }
.field-guide [data-lys] > article { display: flex; flex-direction: column; container-type: inline-size; }
.field-guide .guide-kicker { color: var(--accent); font-size: 1.1cqi; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1cqi; }
.field-guide article h2 { font-size: 3.7cqi; line-height: 1.08; margin-bottom: 1.2cqi; }
.field-guide .guide-specimen { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; font-size: 2.1cqi; }
.field-guide .guide-specimen > .guide-chart { flex: 1 1 0; min-height: 0; display: flex; align-items: center; justify-content: center; }
.field-guide .guide-specimen > .guide-chart svg { width: auto; height: 100%; max-width: 100%; }
.field-guide .diagram-hint { display: none; }
.field-guide .guide-copy { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4cqi; margin-top: 1.2cqi; }
.field-guide .guide-copy section { border-top: 2px solid var(--line); padding-top: .7cqi; }
.field-guide .guide-copy h3 { color: var(--accent); font-size: 1.35cqi; margin-bottom: .45cqi; }
.field-guide .guide-copy p { font-size: 1.35cqi; line-height: 1.35; }
.field-guide .guide-footer { display: flex; justify-content: space-between; align-items: end; gap: 1em; font-size: 1cqi; color: var(--muted); margin-top: 1cqi; }
.field-guide .guide-footer a { color: var(--ink); }
.field-guide .guide-specimen table { font-size: 1.9cqi; }
.field-guide .guide-specimen th, .field-guide .guide-specimen td { padding: 1cqi; }
.field-guide .guide-specimen .context { font-size: 1.45cqi; }
.field-guide .guide-specimen .conclusion { font-size: 1.6cqi; margin-top: 1cqi; }
.field-guide .guide-specimen .total { font-size: 4cqi; margin-bottom: 1.5cqi; }
.field-guide .guide-specimen .total span { font-size: 1.5cqi; }
.field-guide .guide-specimen .stack { height: 7cqi; }
.field-guide .guide-specimen .segment { font-size: 1.7cqi; }
.field-guide .guide-specimen .parts { font-size: 1.35cqi; margin-top: 1.5cqi; }
.field-guide .guide-specimen .parts dd { font-size: 1.65cqi; }
.field-guide .guide-specimen .programme { padding: 1.5cqi; }
.field-guide .guide-specimen .programme h3 { font-size: 1.6cqi; margin-bottom: 1cqi; }
.field-guide .guide-specimen .groups { gap: 1.5cqi; }
.field-guide .guide-specimen .groups section { padding: 1.5cqi; }
.field-guide .guide-specimen .groups h4, .field-guide .guide-specimen .groups ul { font-size: 1.65cqi; }
.field-guide .guide-specimen svg { max-height: 100%; }
.field-guide .guide-specimen svg text { font-size: 24px; }
.field-guide .guide-specimen .golden-primary strong { font-size: 4.6cqi; }
.field-guide .mobile-equivalent { display: none; }
@media (max-width: 600px) {
  .field-guide [data-lys] { display: block; height: auto; min-height: 100vh; padding-top: 56px; overflow: visible; grid-auto-rows: auto; }
  .field-guide [data-lys] > article { position: relative !important; top: auto !important; left: auto !important; transform: none !important; opacity: 1 !important; pointer-events: auto !important; width: 100vw; max-width: 100vw; height: auto; aspect-ratio: auto; min-height: calc(100svh - 56px); max-height: none; overflow: visible; container-type: inline-size; margin: 0 auto 1rem; padding: 1.25rem; scroll-margin-top: 56px; }
  .field-guide .guide-kicker { font-size: .72rem; margin-bottom: .5rem; }
  .field-guide article h2 { font-size: 1.55rem; margin-bottom: .8rem; }
  .field-guide .guide-specimen { flex: 0 0 auto; min-height: auto; font-size: .9rem; }
  .field-guide .guide-copy { grid-template-columns: 1fr; gap: .7rem; margin-top: 1rem; }
  .field-guide .guide-copy section { padding-top: .45rem; }
  .field-guide .guide-copy h3 { font-size: .82rem; margin-bottom: .25rem; }
  .field-guide .guide-copy p { font-size: .9rem; line-height: 1.35; }
  .field-guide .guide-footer { display: grid; grid-template-columns: 1fr; gap: .45rem; font-size: .75rem; line-height: 1.35; margin-top: .8rem; }
  .field-guide .guide-footer a { display: inline-block; }
  .field-guide .guide-specimen table { font-size: .875rem; }
  .field-guide .guide-specimen th, .field-guide .guide-specimen td { padding: .35rem .25rem; }
  .field-guide .guide-specimen .context { font-size: .85rem; }
  .field-guide .guide-specimen .conclusion { font-size: .9rem; }
  .field-guide .guide-specimen .total { font-size: 1.7rem; }
  .field-guide .guide-specimen .total span { font-size: .7rem; }
  .field-guide .guide-specimen .stack { height: 2rem; }
  .field-guide .guide-specimen .segment { font-size: 0; }
  .field-guide .guide-specimen .parts { grid-template-columns: 1fr 1fr; font-size: .8rem; }
  .field-guide .guide-specimen .parts dd { font-size: .875rem; }
  .field-guide .guide-specimen .programme { padding: .6rem; }
  .field-guide .guide-specimen .programme h3, .field-guide .guide-specimen .groups h4 { font-size: .78rem; }
  .field-guide .guide-specimen .groups { gap: .45rem; }
  .field-guide .guide-specimen .groups section { padding: .55rem; }
  .field-guide .guide-specimen .groups ul { font-size: .85rem; }
  .field-guide .guide-specimen .golden-layout { grid-template-columns: 1fr; gap: .6rem; height: auto; }
  .field-guide .guide-specimen .golden-primary { min-height: 6rem; }
  .field-guide .guide-specimen .golden-primary strong { font-size: 1.8rem; }
  .field-guide .guide-specimen .guide-diagram { overflow-x: auto; }
  .field-guide .guide-specimen .guide-diagram svg { min-width: 560px; height: 210px; }
  .field-guide .diagram-hint { display: block; font-size: .75rem; margin: .2rem 0; color: var(--muted); }
  .field-guide .guide-specimen .guide-chart { flex: initial; width: 100%; overflow: visible; }
  .field-guide .guide-specimen .guide-chart svg { width: 100%; height: auto; min-width: 0; max-width: 100%; }
  .field-guide .guide-specimen .guide-chart svg text { font-size: 32px; }
  .field-guide .guide-specimen .mobile-equivalent { display: block; font-size: .75rem; margin-top: .4rem; }
  .field-guide .guide-specimen .mobile-equivalent table { font-size: .875rem; }
  .field-guide [data-lys-nav] { position: fixed; top: 0; }
}
@media print { .field-guide [data-lys] { height: auto; padding: 0; background: none; }.field-guide [data-lys] > article { width: 100vw; max-height: none; }.field-guide .guide-footer { font-size: 8pt; }.field-guide .mobile-equivalent { display: none !important; } }
</style></head><body class="deck field-guide"><div data-lys aria-label="Kata field guide"><nav data-lys-nav aria-label="Field guide forms"><a href="index.html">Kata / Gallery</a>${guide.map(p => `<a href="#${p.id}">${esc(p.name)}</a>`).join('')}<span>← → to navigate</span></nav>${guide.map(p => `<article id="${p.id}" data-transition="direct" data-notes="${esc(`${p.fit} ${p.limit} ${p.source}`)}"><p class="guide-kicker">${esc(p.name)}</p><h2>${esc(p.title)}</h2><div class="guide-specimen">${p.specimen}</div><div class="guide-copy"><section><h3>Works well when</h3><p>${esc(p.fit)}</p></section><section><h3>Limitation</h3><p>${esc(p.limit)}</p></section></div><footer class="guide-footer"><span>${esc(p.source)} · ${esc(data.disclosure)}</span><a href="../skills/kata/references/${p.ref}.md">Read ${esc(p.name.toLowerCase())} guidance ↗</a></footer></article>`).join('')}</div><script>${lysJs}</script><script>${deckNavigation}</script></body></html>`;

const slide = (p, phase, index) => `<article id="${p.id}-${phase}" class="slide ${phase}" data-notes="${esc(phase === 'before' ? `Source information for ${p.name}. ${p.question} ${p.note}` : `${p.why} ${p.note}`)}"><div class="eyebrow">${String(index + 1).padStart(2, '0')} / ${esc(p.name)} <span>${phase === 'before' ? esc(p.beforeLabel || 'Before · prose and lists') : 'After · ' + esc(p.principle)}</span></div><h2>${esc(p[phase + 'Title'])}</h2><div class="visual">${p[phase]}</div><footer><p>${esc(p.note)}</p><p>${esc(data.disclosure)}</p></footer></article>`;
const gallery = `${head('Kata — slide patterns and composition')}<style>${theme}</style></head><body class="gallery"><header class="masthead"><a class="wordmark" href="../README.md"><img src="../assets/kata.svg" width="48" height="48" alt="Kata">Kata <span>First practice / 0.3</span></a><a href="field-guide.html">Open the field guide ↗</a><a href="kata-lys.html">Open before-and-after examples ↗</a></header><main><section class="intro"><p class="overline">A small repertoire for useful layouts</p><h1>Give information<br>a useful shape.</h1><p>Arrange supplied content around the audience’s question.<br>Keep an existing layout when it already works.</p><nav aria-label="Patterns">${patterns.map((p, i) => `<a href="#${p.id}"><span>${String(i + 1).padStart(2, '0')}</span> ${esc(p.name)}</a>`).join('')}</nav><p class="disclosure">${esc(data.disclosure)}. Historical before-and-after specimens are retained; some illustrate work beyond Kata’s current scope.</p></section>${patterns.map((p, i) => `<section id="${p.id}" class="pattern"><div class="pattern-heading"><p class="overline">${i < 5 ? `Pattern 0${i + 1}` : i === 5 ? 'Composition · useful fit' : 'Composition · mismatch'} / ${esc(p.name)}</p><h2>${esc(p.question)}</h2><p>${esc(p.why)} <a href="../skills/kata/references/${i < 5 ? p.id : 'golden-cut'}.md">Read the pattern ↗</a></p></div><div class="pair">${slide(p, 'before', i)}${slide(p, 'after', i)}</div></section>`).join('')}<footer class="site-footer"><p>Kata arranges supplied information. Lys runs the slides. Your brand sets the visual identity.</p><a href="../skills/kata/SKILL.md">Read the skill ↗</a></footer></main></body></html>`;
const deck = `${head('Kata — before-and-after examples with Lys')}<!-- Generated by scripts/build-examples.mjs.
${lysNotice}
--><style>${lysCss}</style><style>${theme}</style></head><body class="deck"><div data-lys aria-label="Kata before and after slide examples"><nav data-lys-nav aria-label="Slide patterns"><a href="index.html">Kata / Gallery</a><a href="field-guide.html">Field guide</a>${patterns.map(p => `<a href="#${p.id}-after">${esc(p.name)}</a>`).join('')}<span>Historical specimens; some exceed current scope</span><span>← → to navigate</span></nav>${patterns.map((p, i) => (slide(p, 'before', i) + slide(p, 'after', i)).replaceAll('<article ', '<article data-transition="direct" ')).join('')}</div><script>${lysJs}</script><script>${deckNavigation}</script></body></html>`;
await writeFile(new URL('examples/index.html', root), gallery);
await writeFile(new URL('examples/kata-lys.html', root), deck);
await writeFile(new URL('examples/field-guide.html', root), fieldGuide);
console.log(`Built ${patterns.length} examples in the gallery, ${patterns.length * 2} slides in the offline Lys deck, and ${guide.length} field-guide slides.`);
