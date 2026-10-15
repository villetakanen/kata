import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

// Phase-1 studies only: not a contract for the active skill or its repertoire size.
// Top-level checks intentionally run both on direct invocation and on import.
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = 'examples/communication/';
const read = path => readFile(resolve(root, path), 'utf8');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const photoHash = '4326e44ea3266c7dd28a65f17117290ca16000f2a719af32b8c79b0e36e8c058';
// Freeze all supplied wording, quantities, associations and asset metadata, not
// just agreement between a potentially changed source and its generated output.
// JSON serialization makes whitespace-only source formatting changes harmless.
const briefsHash = 'c52a76dc1eb4932997c49a08c3c4d592f056a4e788f91dd8158432f78ea8e79c';
const studies = [
  ['earthrise-image-lead', 'earthrise', 'image-lead'],
  ['earthrise-equal-presence', 'earthrise', 'equal-presence'],
  ['earthrise-quiet-reflection', 'earthrise', 'quiet-reflection'],
  ['earthrise-direct-emphasis', 'earthrise', 'direct-emphasis'],
  ['proposals-equal-consideration', 'proposals', 'equal-consideration'],
  ['proposals-recommended-option', 'proposals', 'recommended-option']
];
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const contains = (html, text, message) => assert(html.includes(text), message || `Missing ${text}`);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const occurrences = (text, fragment) => text.split(fragment).length - 1;

function checkSource(source) {
  assert.equal(source.schemaVersion, 1, 'Unsupported communication source schema');
  assert.equal(sha256(JSON.stringify(source.briefs)), briefsHash, 'Frozen supplied briefs changed; review wording, quantities and asset provenance explicitly');
  assert.match(source.status, /Pending project-owner design review.*not accepted repertoire/, 'Owner review must remain pending');
  assert.match(source.evidenceBoundary, /design judgments, not reader-study findings/);
  assert.match(source.evidenceBoundary, /one independent presentation item/);
  assert.deepEqual(source.variants.map(v => [v.id, v.brief, v.layout]), studies, 'Phase-1 study IDs, brief associations and layout keys must remain stable');
  for (const v of source.variants) {
    assert(/^[a-z][a-z0-9-]+$/.test(v.id), `Invalid study ID ${v.id}`);
    for (const key of ['name', 'intent', 'changedPriority', 'tradeoff', 'adaptation']) assert(nonempty(v[key]), `${v.id}: missing ${key}`);
    assert(Array.isArray(v.choices) && v.choices.length && v.choices.every(nonempty), `${v.id}: missing visible choices`);
  }
  const proposals = source.briefs.proposals;
  assert.equal(new Set(proposals.options.map(o => o.id)).size, proposals.options.length, 'Option IDs must be unique');
  assert(proposals.options.some(o => o.id === proposals.recommendation.optionId), 'Recommendation must identify a supplied option');
}
function checkPhoto(bytes) {
  assert.equal(sha256(bytes), photoHash, 'Frozen Earthrise asset SHA-256 differs');
  assert.equal(bytes.length, 67035, 'Frozen Earthrise derivative size differs');
}

const data = JSON.parse(await read(`${directory}data.json`));
checkSource(data);
const photo = await readFile(resolve(root, directory, data.briefs.earthrise.asset.file));
checkPhoto(photo);
const theme = await read(`${directory}theme.css`);
const provenance = await read(`${directory}provenance.md`);
const css = await read('examples/vendor/lys.css');
const js = await read('examples/vendor/lys.iife.js');
const notice = await read('examples/vendor/NOTICE.md');
const pages = Object.fromEntries(await Promise.all(['index.html', 'deck.html'].map(async name => [name, await read(`${directory}${name}`)])));
const asset = data.briefs.earthrise.asset;
const image = `data:${asset.mime};base64,${photo.toString('base64')}`;

function checkSpecimen(article, v) {
  const opening = article.slice(0, article.indexOf('>') + 1);
  const body = article.slice(opening.length);
  const label = v.id;
  contains(opening, `data-variant-id="${v.id}"`, `${label}: missing source association`);
  contains(opening, `class="specimen ${v.layout}"`, `${label}: wrong composition class`);
  const notes = opening.match(/data-notes="([^"]+)"/)?.[1];
  assert(notes, `${label}: useful notes required`);
  for (const text of [data.status, data.evidenceBoundary, data.briefs[v.brief].fictional,
    `Intent: ${v.intent}`, `Priority disclosure: ${v.changedPriority}`,
    `Visible choices: ${v.choices.join(' ')}`, `Trade-off: ${v.tradeoff}`, `Adaptation: ${v.adaptation}`]) {
    contains(notes, esc(text), `${label}: missing source/intent disclosure in notes`);
  }
  assert(/<h[1-6]\b/.test(body), `${label}: missing heading`);
  contains(body, 'aria-label="Demo context, not specimen copy"');
  contains(body, 'pending owner review');
  if (v.brief === 'earthrise') {
    const brief = data.briefs.earthrise;
    assert.equal(occurrences(body, '<blockquote>'), 1, `${label}: exactly one quotation required`);
    contains(body, `<blockquote><p>${esc(brief.quote)}</p><footer>${esc(brief.attribution)}</footer></blockquote>`, `${label}: quotation and attribution must remain exact and associated`);
    contains(body, `<h2 class="sr-only">${esc(brief.title)}</h2>`);
    contains(body, `<figure><img src="${image}" width="1280" height="1280" alt="${esc(asset.alt)}"><figcaption>${esc(asset.caption)}<br>${esc(asset.credit)}</figcaption></figure>`, `${label}: exact photo, caption, credit and alt association required`);
    assert.equal(occurrences(body, '<img '), 1, `${label}: exactly one photograph required`);
    assert.equal(body.indexOf('<blockquote>') < body.indexOf('<figure>'), v.layout === 'direct-emphasis', `${label}: DOM reading order must match declared priority`);
    contains(body, 'Fictional quotation · genuine NASA photograph');
  } else {
    const brief = data.briefs.proposals;
    contains(body, `<h2>${esc(brief.title)}</h2>`);
    contains(body, `${esc(brief.context)} · fictional`);
    contains(body, `<p class="qualification">${esc(brief.qualification)}</p>`);
    const options = [...body.matchAll(/<section\b[^>]*data-option-id="([^"]+)"[^>]*>[\s\S]*?<\/section>/g)];
    assert.equal(options.length, brief.options.length, `${label}: every supplied option exactly once`);
    const recommended = v.id === 'proposals-recommended-option';
    const expectedOrder = recommended
      ? [brief.recommendation.optionId, ...brief.options.filter(o => o.id !== brief.recommendation.optionId).map(o => o.id)]
      : brief.options.map(o => o.id);
    assert.deepEqual(options.map(m => m[1]), expectedOrder, `${label}: option association/order changed`);
    for (const [section, id] of options) {
      const o = brief.options.find(item => item.id === id);
      const chosen = recommended && id === brief.recommendation.optionId;
      const r = brief.recommendation;
      const expected = `<section class="option${chosen ? ' recommended' : ''}" data-option-id="${id}">${chosen ? `<p class="recommendation-label">${esc(r.label)}</p>` : ''}<h3>${esc(o.title)}</h3><p>${esc(o.description)}</p><p class="estimate">${esc(o.estimate)}</p><p class="tradeoff">${esc(o.tradeoff)}</p>${chosen ? `<p class="reason">${esc(r.reason)}</p><p class="recommendation-status">${esc(r.status)}</p>` : ''}</section>`;
      assert.equal(section, expected, `${label}/${id}: exact supplied option texts and recommendation association required`);
    }
  }
  const recommended = v.id === 'proposals-recommended-option';
  for (const key of ['label', 'reason', 'status']) {
    assert.equal(occurrences(body, esc(data.briefs.proposals.recommendation[key])), recommended ? 1 : 0, `${label}: recommendation ${key} only belongs in designated variant`);
  }
  assert.equal(occurrences(body, 'class="option recommended"'), recommended ? 1 : 0, `${label}: unexpected recommendation emphasis`);
}

function checkPage(html, name) {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta charset="utf-8">/);
  assert.match(html, /<meta name="viewport"/);
  contains(html, `<style>${theme}</style>`, `${name}: exact shared theme required`);
  // Exclude scripts/styles from structural scans (and IDs embedded in JS strings).
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '');
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${name}: IDs must be unique`);
  for (const [, id] of markup.matchAll(/(?:href="#|aria-labelledby=")([^" ]+)"/g)) assert(ids.includes(decodeURIComponent(id)), `${name}: missing anchor/label ${id}`);
  assert(!/<script\b[^>]*\bsrc\s*=/i.test(html), `${name}: external script dependency`);
  assert(!/<link\b/i.test(markup), `${name}: stylesheet/dependency links must be inlined`);
  assert(!/\s(?:srcset|poster|on\w+)\s*=/i.test(markup), `${name}: unexpected resource or inline handler`);
  for (const [, src] of markup.matchAll(/\ssrc="([^"]+)"/g)) assert.equal(src, image, `${name}: only the frozen inline photograph is allowed`);
  assert(!/@import\b|url\s*\(/i.test(theme + css), 'Styles must not load external resources');
  assert(!/\sdata-lys-(?:active|current|mode|ready)(?:[\s=>])/i.test(markup), `${name}: no pre-authored runtime state`);
  const articles = [...markup.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(articles.length, data.variants.length, `${name}: one article per phase-1 study`);
  for (const [index, v] of data.variants.entries()) {
    const article = articles[index];
    contains(article.slice(0, article.indexOf('>')), `id="${v.id}${name === 'deck.html' ? '' : '-specimen'}"`);
    checkSpecimen(article, v);
    contains(markup, `href="#${v.id}"`, `${name}: missing stable study anchor`);
  }
  return articles;
}
const galleryArticles = checkPage(pages['index.html'], 'index.html');
checkPage(pages['deck.html'], 'deck.html');
const gallery = pages['index.html'];
const deck = pages['deck.html'];
contains(gallery, esc(data.status));
contains(gallery, esc(data.evidenceBoundary));
for (const brief of Object.values(data.briefs)) contains(gallery, esc(brief.fictional));
for (const v of data.variants) {
  const comparison = gallery.slice(gallery.indexOf(`<section class="comparison" id="${v.id}"`));
  const annotation = comparison.slice(comparison.indexOf('<div class="annotation"'), comparison.indexOf('</section>\n<section class="comparison"') < 0 ? undefined : comparison.indexOf('</section>\n<section class="comparison"'));
  contains(annotation, 'aria-label="Review annotations, not specimen copy"');
  for (const text of [v.intent, v.changedPriority, ...v.choices, v.tradeoff, v.adaptation]) contains(annotation, esc(text), `${v.id}: missing gallery rationale`);
  contains(gallery, `href="deck.html#${v.id}"`);
}
contains(gallery, 'Owner review remains open.');
contains(deck, `<style>${css}</style>`, 'Deck must package exact pinned Lys CSS');
contains(deck, `<script>${js}</script>`, 'Deck must package exact pinned Lys runtime');
contains(deck, notice.replaceAll('--', '—'), 'Deck must retain runtime provenance');
assert.equal(occurrences(deck, '<script>'), 2, 'Only pinned Lys and local integration scripts expected');
assert.equal(occurrences(gallery, '<script'), 0, 'Gallery must remain a plain document');
contains(deck, '<div data-lys aria-label="Composition studies, pending owner review">');
contains(deck, 'data-lys-nav');
for (const integration of ["Lys.Lys.from(root).destroy()", "deck.goTo(target)", "goTo(decodeURIComponent(link.hash.slice(1)))", "matchMedia('screen and (max-width: 1100px), screen and (max-height: 560px)')", "narrow.addEventListener('change', adapt)", "replace(/^#(?:slide=)?/, '')"]) contains(deck, integration, 'Missing public-API responsive/deep-link integration');
for (const text of [photoHash, asset.source, asset.download, 'AS08-14-2383', 'Pending project-owner design review', 'fictional', 'not reader studies']) contains(provenance, text, 'Missing frozen source/review provenance');
for (const text of ['object-fit: contain', '@media screen and (max-width: 1100px), screen and (max-height: 560px)', '@media print', '.annotation', 'display: none !important']) contains(theme, text);

// Bounded negative controls run in memory: prove that agreeing generated text
// alone cannot bless a changed source, and that per-specimen checks are local.
const wrongSource = structuredClone(data);
wrongSource.briefs.earthrise.asset.caption = 'Wrong mission';
assert.throws(() => checkSource(wrongSource), /Frozen supplied briefs changed/);
const wrongEstimate = structuredClone(data);
wrongEstimate.briefs.proposals.options[0].estimate = '€0';
assert.throws(() => checkSource(wrongEstimate), /Frozen supplied briefs changed/);
const wrongPhoto = Buffer.from(photo);
wrongPhoto[100] ^= 1;
assert.throws(() => checkPhoto(wrongPhoto), /SHA-256 differs/);
assert.throws(() => checkSpecimen(galleryArticles[0].replace(esc(data.briefs.earthrise.quote), 'Wrong quotation'), data.variants[0]), /quotation and attribution/);
assert.throws(() => checkSpecimen(galleryArticles[0].replace(image, 'data:image/jpeg;base64,AA=='), data.variants[0]), /exact photo/);
assert.throws(() => checkSpecimen(galleryArticles[4].replace('</article>', `<p>${esc(data.briefs.proposals.recommendation.label)}</p></article>`), data.variants[4]), /only belongs in designated variant/);

// Snapshot the checked outputs, then rebuild twice in an isolated project-shaped
// directory. The builder resolves paths relative to import.meta.url; copying its
// bounded inputs avoids changing it or overwriting stale checked-in artifacts.
const temporary = await mkdtemp(resolve(tmpdir(), 'kata-communication-check-'));
try {
  const inputs = ['scripts/build-communication.mjs', ...['data.json', 'theme.css', asset.file].map(name => directory + name), ...['lys.css', 'lys.iife.js', 'NOTICE.md'].map(name => `examples/vendor/${name}`)];
  for (const path of inputs) {
    const target = resolve(temporary, path);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(resolve(root, path), target);
  }
  const run = promisify(execFile);
  let first;
  for (let pass = 0; pass < 2; pass++) {
    await run(process.execPath, [resolve(temporary, 'scripts/build-communication.mjs')], { cwd: temporary, timeout: 30000 });
    const outputs = await Promise.all(Object.keys(pages).map(name => readFile(resolve(temporary, directory, name), 'utf8')));
    if (first) assert.deepEqual(outputs, first, 'Communication build must be deterministic');
    else first = outputs;
  }
  for (const [index, name] of Object.keys(pages).entries()) assert(first[index] === pages[name], `${directory}${name} is stale; run node scripts/build-communication.mjs (checker did not modify it)`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}

// Check local informational links too, including cross-page fragment targets.
for (const [name, html] of Object.entries(pages)) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(?:https?:|#)/i.test(href)) continue;
    const [file, fragment] = href.split('#');
    await stat(resolve(root, directory, file));
    if (fragment) contains(await read(directory + file), `id="${decodeURIComponent(fragment)}"`, `${name}: missing linked fragment ${href}`);
  }
}
console.log('Checked pending-review communication sources, per-specimen frozen copy, disclosures, IDs, offline assets/runtime, negative controls, and isolated deterministic freshness. Owner design review and visual verification remain separate.');
