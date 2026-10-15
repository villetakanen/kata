import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Phase-1 working studies; owner review is required before repertoire migration.
const root = new URL('../', import.meta.url);
const dir = new URL('examples/communication/', root);
const read = path => readFile(new URL(path, root), 'utf8');
const data = JSON.parse(await readFile(new URL('data.json', dir), 'utf8'));
const theme = await readFile(new URL('theme.css', dir), 'utf8');
const css = await read('examples/vendor/lys.css');
const js = await read('examples/vendor/lys.iife.js');
const notice = await read('examples/vendor/NOTICE.md');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const b = data.briefs;
const photo = await readFile(new URL(b.earthrise.asset.file, dir));
const digest = createHash('sha256').update(photo).digest('hex');
if (digest !== '4326e44ea3266c7dd28a65f17117290ca16000f2a719af32b8c79b0e36e8c058') throw new Error('Frozen photo changed; review provenance before updating the asset.');
if (data.schemaVersion !== 1) throw new Error('Unsupported schema version');
const ids = new Set();
for (const v of data.variants) {
  if (!/^[a-z][a-z0-9-]+$/.test(v.id) || ids.has(v.id)) throw new Error(`Invalid/duplicate id: ${v.id}`);
  ids.add(v.id);
  if (!b[v.brief] || !v.intent || !v.changedPriority || !v.choices?.length || !v.tradeoff || !v.adaptation) throw new Error(`Incomplete variant: ${v.id}`);
}
const asset = b.earthrise.asset;
const image = `data:${asset.mime};base64,${photo.toString('base64')}`;
const figure = () => `<figure><img src="${image}" width="1280" height="1280" alt="${esc(asset.alt)}"><figcaption>${esc(asset.caption)}<br>${esc(asset.credit)}</figcaption></figure>`;
const quote = () => `<blockquote><p>${esc(b.earthrise.quote)}</p><footer>${esc(b.earthrise.attribution)}</footer></blockquote>`;
const option = (o, recommended = false) => `<section class="option${recommended ? ' recommended' : ''}" data-option-id="${esc(o.id)}">${recommended ? `<p class="recommendation-label">${esc(b.proposals.recommendation.label)}</p>` : ''}<h3>${esc(o.title)}</h3><p>${esc(o.description)}</p><p class="estimate">${esc(o.estimate)}</p><p class="tradeoff">${esc(o.tradeoff)}</p>${recommended ? `<p class="reason">${esc(b.proposals.recommendation.reason)}</p><p class="recommendation-status">${esc(b.proposals.recommendation.status)}</p>` : ''}</section>`;
const notes = v => `${data.status}\n${b[v.brief].fictional}\nIntent: ${v.intent}\nPriority disclosure: ${v.changedPriority}\nVisible choices: ${v.choices.join(' ')}\nTrade-off: ${v.tradeoff}\nAdaptation: ${v.adaptation}\n${data.evidenceBoundary}`;
function specimen(v, deck) {
  const content = v.brief === 'earthrise'
    ? `<h2 class="sr-only">${esc(b.earthrise.title)}</h2><div class="composition">${v.layout === 'direct-emphasis' ? quote() + figure() : figure() + quote()}</div>`
    : `<div class="proposals-body"><h2>${esc(b.proposals.title)}</h2><div class="options">${v.layout === 'equal-consideration' ? b.proposals.options.map(o => option(o)).join('') : `${option(b.proposals.options.find(o => o.id === b.proposals.recommendation.optionId), true)}<div class="alternatives">${b.proposals.options.filter(o => o.id !== b.proposals.recommendation.optionId).map(o => option(o)).join('')}</div>`}</div><p class="qualification">${esc(b.proposals.qualification)}</p></div>`;
  return `<article id="${esc(v.id)}${deck ? '' : '-specimen'}" class="specimen ${esc(v.layout)}" data-variant-id="${esc(v.id)}"${deck ? ' data-transition="direct"' : ''} data-notes="${esc(notes(v))}"><div class="context" aria-label="Demo context, not specimen copy"><span>${v.brief === 'earthrise' ? 'Fictional quotation · genuine NASA photograph' : esc(b.proposals.context) + ' · fictional'}</span><span>Study ${String(data.variants.indexOf(v) + 1).padStart(2, '0')} · pending owner review</span></div>${content}</article>`;
}
const head = title => `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>`;
const paragraphs = v => `<div class="annotation" aria-label="Review annotations, not specimen copy"><div><h3>Intended communication</h3><p>${esc(v.intent)}</p><h3>Priority disclosure</h3><p>${esc(v.changedPriority)}</p></div><div><h3>Visible choices · design judgment</h3><ul>${v.choices.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div><div><h3>Consequential trade-off</h3><p>${esc(v.tradeoff)}</p></div><div><h3>Phone adaptation</h3><p>${esc(v.adaptation)}</p></div></div>`;
const gallery = `${head('Composition studies · pending owner review')}<style>${theme}</style></head><body><main class="gallery"><header class="intro"><p class="eyebrow">Kata / 0.4.0 / phase 1</p><h1>Same material.<br>Different intentions.</h1><p>Six compositions, two frozen content briefs. Start with what one item should communicate, then consider what the arrangement gives presence to and what it leaves quiet.</p><p class="status">${esc(data.status)}</p><p>${esc(data.evidenceBoundary)}</p><p>${esc(b.earthrise.fictional)} ${esc(b.proposals.fictional)} The recommendation variant activates a separately supplied priority; it does not infer a winner.</p><p><a href="deck.html">Open the offline Lys deck</a> · Use arrow keys, Home and End on desktop. On narrow screens, read as a scrolling document. Without JavaScript, every specimen remains available. Printing produces one specimen per page; review annotations are omitted.</p><nav class="contents" aria-label="Composition studies">${data.variants.map((v, i) => `<a href="#${v.id}">${i + 1}. ${esc(v.name)}</a>`).join('')}</nav></header>${data.variants.map(v => `<section class="comparison" id="${v.id}" aria-labelledby="heading-${v.id}"><header class="variant-heading"><h2 id="heading-${v.id}">${esc(v.name)}</h2><a href="deck.html#${v.id}">View in deck ↗</a></header>${specimen(v, false)}${paragraphs(v)}</section>`).join('\n')}<footer class="gallery-footer"><p><strong>Owner review remains open.</strong> Do these choices express the intended communication, and are the trade-offs worth making? Rendering checks do not answer that design question.</p><p>Asset: ${esc(asset.credit)}. NASA imagery is public domain in the United States; no endorsement is implied. <a href="${esc(asset.source)}">NASA catalogue record</a> · <a href="https://www.nasa.gov/nasa-brand-center/images-and-media/">NASA media policy</a>. Source, hash and integration details: <a href="provenance.md">provenance.md</a>.</p></footer></main></body></html>\n`;
// Local pinned runtime is included byte-for-byte; only the surrounding integration is ours.
const integration = `
const root = document.querySelector('[data-lys]');
const narrow = matchMedia('screen and (max-width: 1100px), screen and (max-height: 560px)');
function adapt() {
  const target = decodeURIComponent(location.hash.replace(/^#(?:slide=)?/, ''));
  if (narrow.matches) {
    Lys.Lys.from(root).destroy();
    if (target) document.getElementById(target)?.scrollIntoView({ block: 'start' });
  } else {
    const deck = Lys.Lys.from(root);
    if (target && document.getElementById(target)) deck.goTo(target);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', adapt, { once: true });
else adapt();
narrow.addEventListener('change', adapt);
root.querySelector('[data-lys-nav]').addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || narrow.matches) return;
  event.preventDefault();
  Lys.Lys.from(root).goTo(decodeURIComponent(link.hash.slice(1)));
});
`;
const deck = `${head('Composition studies · Lys deck')}<!-- ${notice.replaceAll('--', '—')} --><style>${css}</style><style>${theme}</style></head><body><div data-lys aria-label="Composition studies, pending owner review"><nav data-lys-nav class="deck-nav" aria-label="Study navigation"><a href="index.html">Gallery & rationale</a><div class="deck-links">${data.variants.map((v, i) => `<a href="#${v.id}" aria-label="${esc(v.name)}">${String(i + 1).padStart(2, '0')}</a>`).join('')}</div><span class="review-label">Working studies · pending owner review</span></nav>${data.variants.map(v => specimen(v, true)).join('\n')}</div><script>${js}</script><script>${integration}</script></body></html>\n`;
await Promise.all([writeFile(new URL('index.html', dir), gallery), writeFile(new URL('deck.html', dir), deck)]);
console.log(`Built communication gallery and Lys deck: ${data.variants.length} variants, photo SHA-256 ${digest}`);
