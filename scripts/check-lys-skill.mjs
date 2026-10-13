import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const skill = await read('.agents/skills/lys/SKILL.md');
const notice = await read('.agents/skills/lys/NOTICE.md');
const runtimeNotice = await read('examples/vendor/NOTICE.md');
const runtimeCss = await read('examples/vendor/lys.css');
const runtimeJs = await read('examples/vendor/lys.iife.js');

assert.equal(
  createHash('sha256').update(skill).digest('hex'),
  'caf531b04fb23352992e7460f97bf8ab751d0f908ab8a12a90fd727e0267a845',
  'Pinned Lys 1.2.1 skill content changed; review and update its provenance pin',
);
assert.match(notice, /https:\/\/github\.com\/villetakanen\/lys/);
assert.match(notice, /v1\.2\.1/);
assert.match(notice, /c553aa5dbc36d5c6ddd819051384fdaf05c8cfd0/);
assert.match(notice, /Skill version: 1\.2\.1/);
assert.match(notice, /Compatible runtime version: 1\.2\.1/);
assert.match(notice, /MIT/);
assert.match(notice, /copy-and-review/);
assert.match(runtimeNotice, /1\.2\.1/);
assert.match(runtimeNotice, /116d76255c42d5bb2a78de3954462b89979688f1/);

for (const section of ['## When to Use', '## HTML Contract', '## CSS Tokens', '## Slide Patterns', '## Quality Checklist', '## Output Template', '## Anti-Patterns']) {
  assert(skill.includes(section), `Pinned Lys skill is missing ${section}`);
}
assert(skill.includes('<article') && skill.includes('data-lys'), 'Pinned skill must describe the Lys slide contract');
assert(runtimeCss.length > 0 && runtimeJs.length > 0, 'Compatible Lys runtime files must be present locally');
const embedded = marker => {
  const match = skill.match(new RegExp(`<!-- ${marker} -->([\\s\\S]*?)<!-- \/${marker} -->`));
  assert(match, `Pinned skill must include ${marker} runtime resource`);
  return match[1].trim();
};
assert.equal(embedded('LYS:CSS'), runtimeCss.trim(), 'Skill CSS template must match the vendored runtime');
assert.equal(embedded('LYS:JS'), runtimeJs.trim(), 'Skill JavaScript template must match the vendored runtime');
assert(!/https?:\/\//.test(skill.replace(/https?:\/\/github\.com\/villetakanen\/lys/g, '')), 'Skill instructions must not require remote resources');

console.log('Checked the pinned Lys 1.2.1 skill, provenance, local resources, and compatible runtime.');
