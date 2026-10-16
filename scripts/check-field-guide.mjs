import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFile(resolve(root, path), 'utf8');
const guide = await read('examples/field-guide.html');
const data = JSON.parse(await read('examples/data.json'));
const golden = JSON.parse(await read('examples/golden-cut/data.json'));
const skill = await read('docs/history/catalogue/SKILL.md');
const lysCss = await read('examples/vendor/lys.css');
const lysJs = await read('examples/vendor/lys.iife.js');
const notice = await read('examples/vendor/NOTICE.md');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const forms = [
  ['aligned-comparison', 'comparison'],
  ['whole-and-parts', 'composition'],
  ['nested-groups', 'hierarchy'],
  ['directed-dependencies', 'relationship'],
  ['time-series', 'change-over-time'],
  ['asymmetric-composition', 'golden-cut']
];
const catalogue = [...skill.matchAll(/^\|\s*([^|]+?)\s*\|[^\n]*?\]\(references\/([^)]+)\)\s*\|$/gm)].map(([, name, ref]) => ({ name: name.trim(), ref }));
assert.deepEqual(catalogue.map(item => item.ref), forms.map(([, ref]) => `${ref}.md`), 'Guide coverage must match the six forms in the historical catalogue');
const ids = [...guide.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Field-guide IDs must be unique');
const articles = [...guide.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(match => match[0]);
assert.equal(articles.length, catalogue.length, 'The guide must have exactly one slide per current form');
const slideFor = id => {
  const slide = articles.find(article => article.includes(`id="${id}"`));
  assert(slide, `Missing stable slide ID ${id}`);
  return slide;
};
const contains = (slide, expected, message) => assert(slide.includes(expected), message || `Slide is missing ${expected}`);

for (let index = 0; index < forms.length; index++) {
  const [id, reference] = forms[index];
  const slide = slideFor(id);
  contains(slide, `references/${reference}.md`, `${id}: missing historical reference link`);
  contains(slide, 'class="guide-specimen"', `${id}: missing visible specimen`);
  assert(/<h3>Works well when<\/h3><p>[^<]+<\/p>/.test(slide), `${id}: missing fit explanation`);
  assert(/<h3>Limitation<\/h3><p>[^<]+<\/p>/.test(slide), `${id}: missing limitation`);
  contains(slide, esc(data.disclosure), `${id}: missing fictional data disclosure`);
  assert(/data-notes="[^"]+"/.test(slide), `${id}: missing useful notes`);
  assert(new RegExp(`href="#${id}"`).test(guide), `${id}: missing navigation link`);
}

const comparison = slideFor('aligned-comparison');
contains(comparison, `<p class="context">Limits: ${data.comparison.maxWeeks} weeks · €${data.comparison.maxCost}k initial budget</p>`);
contains(comparison, `<th scope="col">${data.comparison.options.map(o => esc(o.name)).join('</th><th scope="col">')}</th>`);
for (const [label, key] of [['Lead time · weeks', 'weeks'], ['Initial cost · €k', 'cost'], ['Control', 'control']]) {
  const values = data.comparison.options.map(o => esc(o[key])).join('</td><td>');
  contains(comparison, `<th scope="row">${label}</th><td>${values}</td>`, `Comparison row ${label} must preserve all option values`);
}
for (const option of data.comparison.options) contains(comparison, `<th scope="col">${esc(option.name)}</th>`);

const partsSlide = slideFor('whole-and-parts');
const parts = data.composition.parts;
contains(partsSlide, `<p class="total">€${data.composition.total}k`);
contains(partsSlide, `aria-label="${esc(parts.map(part => `${part.name} ${part.value / data.composition.total * 100}%`).join(', '))}"`);
for (const [index, part] of parts.entries()) {
  const share = part.value / data.composition.total * 100;
  contains(partsSlide, `<div class="segment s${index}" style="flex:${part.value}">${share}%</div>`, `${part.name}: segment width must use its supplied value`);
  contains(partsSlide, `<dt><span class="key s${index}" aria-hidden="true"></span>${esc(part.name)}</dt><dd>€${part.value}k · ${share}%</dd>`, `${part.name}: exact amount and share label missing`);
}
assert.equal(parts.reduce((sum, part) => sum + part.value, 0), data.composition.total, 'Source parts must exhaust the stated whole');

const groupsSlide = slideFor('nested-groups');
contains(groupsSlide, `<h3>${esc(data.hierarchy.name)} · workstream membership</h3>`);
for (const group of data.hierarchy.groups) {
  contains(groupsSlide, `<section><h4>${esc(group.name)}</h4><ul>${group.children.map(child => `<li>${esc(child)}</li>`).join('')}</ul></section>`, `${group.name}: exact parent and child membership missing`);
}

const dependencySlide = slideFor('directed-dependencies');
const positions = { Research: [10, 50], Design: [245, 50], Build: [480, 50], Launch: [755, 50], Compliance: [480, 225] };
for (const [from, to] of data.relationship.edges) {
  const [x, y] = positions[from], [targetX, targetY] = positions[to];
  const d = y === targetY ? `M ${x + 175} ${y + 40} H ${targetX - 10}` : `M ${x + 175} ${y + 40} H ${targetX + 87} V ${targetY + 90}`;
  contains(dependencySlide, `d="${d}"`, `Dependency edge ${from} → ${to} is missing`);
  contains(dependencySlide, `<li>${esc(from)} must finish before ${esc(to)}.</li>`, `Dependency text equivalent missing ${from} → ${to}`);
}
for (const node of data.relationship.nodes) contains(dependencySlide, `>${esc(node)}</text>`, `Dependency node ${node} is missing`);
contains(dependencySlide, 'Arrows mean “must finish before”');
contains(dependencySlide, 'Spacing does not represent duration');

const timeSlide = slideFor('time-series');
const time = data['change-over-time'];
contains(timeSlide, `Monthly average · days · ${time.cohortSize} completed onboardings per cohort · ${time.year}`);
const x = index => 70 + index * 164;
const y = value => 320 - value / 12 * 264;
const expectedPoints = time.points.map((point, index) => `${x(index)},${y(point.days)}`).join(' ');
contains(timeSlide, `<polyline points="${expectedPoints}"`);
contains(timeSlide, `Average onboarding time, January–June ${time.year}`);
contains(timeSlide, esc(time.points.map(point => `${point.month}: ${point.days} days`).join('. ')));
for (const [index, point] of time.points.entries()) {
  contains(timeSlide, `<circle cx="${x(index)}" cy="${y(point.days)}"`);
  contains(timeSlide, `<text x="${x(index)}" y="${y(point.days) - 17}" text-anchor="middle" class="value">${point.days}</text>`);
  contains(timeSlide, `<text x="${x(index)}" y="355" text-anchor="middle">${esc(point.month)}</text>`);
  contains(timeSlide, `<th scope="row">${esc(point.month)}</th><td>${point.days}</td>`, `Phone equivalent missing ${point.month} observation`);
}

const asymmetric = slideFor('asymmetric-composition');
contains(asymmetric, `<time datetime="${golden.launch.dateIso}">${esc(golden.launch.date)}</time>`);
contains(asymmetric, `<p>${esc(golden.launch.review)} due ${esc(golden.launch.reviewDue)}.</p>`);
contains(asymmetric, `<p>${esc(golden.launch.status)}.</p>`);
contains(asymmetric, 'condition qualifies the date');

const hrefs = [...guide.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
for (const href of hrefs) {
  if (href.startsWith('#')) assert(ids.includes(decodeURIComponent(href.slice(1))), `Missing slide target ${href}`);
  else if (!/^(https?:|mailto:)/i.test(href)) await stat(resolve(root, 'examples', href.split('#')[0]));
}
assert(guide.includes(lysCss), 'The guide must package the local Lys stylesheet');
assert(guide.includes(lysJs), 'The guide must package the local Lys runtime');
assert(guide.includes(notice.replaceAll('--', '—')), 'The guide must retain runtime provenance');
assert(!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(guide), 'The guide must have no remote runtime dependencies');
assert.equal([...guide.matchAll(/<script\b/g)].length, 2, 'The guide must include only the local Lys runtime and navigation script');
contains(guide, 'Lys.Lys.from(deckRoot).goTo(decodeURIComponent(link.hash.slice(1)))', 'Navigation must update Lys through its public API');
contains(guide, 'aria-label="Field guide forms"');
console.log('Checked field-guide catalogue coverage, IDs, per-slide source integrity, references, navigation, and offline Lys packaging.');
