import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=new URL('../examples/design-system/',import.meta.url);
const read=p=>readFile(new URL(p,base),'utf8');
const data=JSON.parse(await read('tokens.json')), css=await read('tokens.css');
const expected='/* Generated from tokens.json. Edit the source, then npm run build. */\n:root {\n'+Object.entries(data.tokens).map(([k,t])=>`  --kata-${k}: ${t.value};`).join('\n')+'\n}\n';
assert.equal(css,expected,'Shared CSS tokens must match their canonical source');
for(const name of ['index.html','examples.html']){
 const html=await read(name);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
  const ref=match[1]; if(/^(https?:|data:)/.test(ref))continue;
  await access(new URL(ref,base));
 }
 assert(html.includes('var(--kata-paper)'),'Live specimens must consume shared paper tokens');
 assert(html.includes('share harder to ignore.'),'Keep the fictional source quotation');
}
const deck=await read('examples.html');
assert.equal((deck.match(/<article\b/g)||[]).length,3);
assert(deck.includes(css),'Standalone deck must embed the same generated tokens');
assert(!/<(?:link|script)[^>]+(?:href|src)=/.test(deck),'Standalone deck must bundle dependencies');
const fonts=await read('fonts.css');
for(const match of fonts.matchAll(/url\('([^']+)'\)/g))await access(new URL(match[1],base));
for(const family of ['newsreader','archivo','chivomono'])await access(new URL(`fonts/${family}/OFL.txt`,base));
console.log('Checked living DS token freshness, local links, bundled fonts, and shared standalone deck tokens.');
