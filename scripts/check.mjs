import { readFile, readdir, readlink, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFile(resolve(root, path), 'utf8');
const instructions = await read('AGENTS.md');
const instructionLines = instructions.split(/\r?\n/);
if (instructionLines.at(-1) === '') instructionLines.pop();
assert(instructions.trim().length > 0, 'AGENTS.md must contain development guidance');
assert(instructionLines.length < 100, 'AGENTS.md must be fewer than 100 lines, including blank lines');
assert.equal(await readlink(resolve(root, 'CLAUDE.md')), 'AGENTS.md', 'CLAUDE.md must link to AGENTS.md');

const data = JSON.parse(await read('examples/data.json'));
const golden = JSON.parse(await read('examples/golden-cut/data.json'));
assert.equal(data.composition.parts.reduce((sum, p) => sum + p.value, 0), data.composition.total, 'Parts must exhaust the stated total');
assert(data.composition.parts.every(p => p.value >= 0), 'A composition cannot contain negative parts');
const nodes = new Set(data.relationship.nodes);
for (const edge of data.relationship.edges) assert(edge.length === 2 && edge.every(n => nodes.has(n)), 'Every dependency endpoint must exist');
assert.equal(new Set(data['change-over-time'].points.map(p => p.month)).size, data['change-over-time'].points.length, 'Time observations must be distinct');
assert(data['change-over-time'].points.every(p => Number.isFinite(p.days) && p.days >= 0 && p.days <= 12), 'Observations must fit the example scale');
assert(golden.launch.date && golden.launch.dateIso && golden.launch.review && golden.launch.reviewDue && golden.launch.status, 'Golden-cut fit must retain its message and condition');
assert(golden.comparison.options.length === 2 && golden.comparison.options.every(o => o.weeks <= golden.comparison.maxWeeks && o.cost <= golden.comparison.maxCost), 'Golden-cut mismatch must compare two candidates meeting the stated limits');

async function markdownLinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await markdownLinks(path);
    else if (entry.name.endsWith('.md')) {
      const body = await readFile(path, 'utf8');
      for (const [, target] of body.matchAll(/\]\(([^)]+)\)/g)) {
        if (/^(https?:|#)/.test(target)) continue;
        await stat(resolve(dirname(path), target.split('#')[0]));
      }
    }
  }
}
await markdownLinks(resolve(root, 'skills'));
for (const name of ['index.html', 'kata-lys.html']) {
  const html = await read(`examples/${name}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${name}: IDs must be unique`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(target), `${name}: missing anchor ${target}`);
  assert.equal([...html.matchAll(/<article\b/g)].length, 14, `${name}: seven before/after pairs, preserving the original five`);
  assert.equal([...html.matchAll(/data-notes="/g)].length, 14, `${name}: every slide needs notes`);
  assert(!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(html), 'Examples must work offline');
  assert(html.includes(data.disclosure), 'Fictional data must be disclosed');
}
const gallery = await read('examples/index.html');
const deck = await read('examples/kata-lys.html');
for (const html of [gallery, deck]) {
  assert(html.includes('18 June 2027') && html.includes('10 June 2027') && html.includes('Planned, not confirmed'), 'Golden-cut fit must preserve its date and caveat');
  assert(html.includes('Buy') && html.includes('Partner') && html.includes('Limited') && html.includes('Shared'), 'Mismatch must preserve both candidate labels and control values');
  assert(html.includes('both meet') || html.includes('both launch limits'), 'Mismatch must state that both options qualify');
}
assert(gallery.includes('references/golden-cut.md'), 'Gallery must link to the delivered golden-cut reference');
assert(gallery.includes('golden-cut-mismatch'), 'Gallery must include the explicit mismatch case');
assert(deck.includes('golden-cut-mismatch'), 'Lys deck must include the explicit mismatch case');
console.log('Checked harness instructions, example data, skill links, slide structure, navigation targets, and offline packaging.');
