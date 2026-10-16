import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFile(resolve(root,p),'utf8');
const data = JSON.parse(await read('examples/presentation/content.json'));
const normalize = s => s.replace(/\s+/g,' ').trim();
const decode = s => s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const text = s => normalize(decode(s.replace(/<[^>]*>/g,' ')));
const excluded = new Set(['id','page','kind','choice','alternative']);
function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  return Object.entries(value).filter(([k])=>!excluded.has(k)).flatMap(([,v])=>strings(v));
}
function verifyContent(html) {
  const slides=[...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m=>m[0]);
  assert.equal(slides.length,data.slides.length,'Every supplied slide must be present');
  for(let i=0;i<slides.length;i++) {
    const s=data.slides[i], rendered=slides[i];
    assert(rendered.includes(`data-source-page="${s.page}"`),'Source slide order must remain intact');
    const body=rendered.slice(rendered.indexOf('<div class="content">'),rendered.indexOf('<footer class="source-line">'));
    assert.equal(text(body),normalize(strings(s).join(' ')),`Source wording/reading order changed on ${s.id}`);
    assert(rendered.includes('data-notes='),'Every slide needs notes');
  }
}
const deck=await read('examples/presentation/deck.html');
const gallery=await read('examples/index.html');
for(const html of [deck,gallery]) {
  verifyContent(html);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,'IDs must be unique');
  assert(!/<(?:script|link)[^>]+(?:src|href)="(?!data:)/i.test(html),'Runtime and styles must be embedded');
  for(const [,url] of html.matchAll(/url\(([^)]+)\)/g)) assert(url.startsWith('data:'),'Fonts/assets must be embedded');
  assert(html.includes('SIL OPEN FONT LICENSE'),'Embedded fonts need their licence');
  assert(html.includes('Open Government Licence'),'Reused source needs attribution');
}
assert.throws(()=>verifyContent(deck.replace('Nearly 90%','90%')),'Removing a qualifier must fail');
assert.throws(()=>verifyContent(deck.replace('Supplier IPR/Source code','Customer IPR/Source code')),'Changing a relationship must fail');
for(const p of ['lys.css','lys.iife.js']) assert(deck.includes(await read(`examples/vendor/${p}`)),`Pinned ${p} missing`);
// Copy only the portable product; every Markdown resource must be reachable locally.
const pending=['SKILL.md'],seen=new Set();
while(pending.length) {
  const p=pending.pop();if(seen.has(p))continue;seen.add(p);
  const body=await read(`skills/kata/${p}`);
  for(const [,target] of body.matchAll(/\]\(([^)]+)\)/g)) {
    if(/^(https?:|#)/.test(target))continue;
    const dest=resolve(root,'skills/kata',dirname(p),target.split('#')[0]);
    assert(dest.startsWith(resolve(root,'skills/kata')+'/'),'Portable instruction escapes its folder');
    pending.push(dest.slice(resolve(root,'skills/kata').length+1));
  }
}
const portable=(await readdir(resolve(root,'skills/kata/references'))).filter(p=>p.endsWith('.md'));
for(const p of portable)assert(seen.has(`references/${p}`),`Unreachable portable guidance ${p}`);
// Rebuild in isolation: the check must not repair stale committed output.
const temp=await mkdtemp(resolve(tmpdir(),'kata-presentation-check-'));
try {
  for(const p of ['scripts/build-presentation.mjs','examples/presentation/content.json','examples/presentation/theme.css','examples/design-system/tokens.css','examples/design-system/fonts','examples/vendor']) {
    await mkdir(dirname(resolve(temp,p)),{recursive:true});await cp(resolve(root,p),resolve(temp,p),{recursive:true});
  }
  execFileSync(process.execPath,[resolve(temp,'scripts/build-presentation.mjs')],{stdio:'pipe'});
  for(const p of ['examples/index.html','examples/presentation/deck.html']) assert.equal(await read(p),await readFile(resolve(temp,p),'utf8'),`${p} needs rebuilding`);
} finally {await rm(temp,{recursive:true,force:true});}
console.log('Checked current presentation fidelity (including negative controls), portable guidance, offline packaging and isolated build freshness.');
