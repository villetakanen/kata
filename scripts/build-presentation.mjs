import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = p => readFile(new URL(p, root), 'utf8');
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const data = JSON.parse(await read('examples/presentation/content.json'));
const tokens = await read('examples/design-system/tokens.css');
const theme = await read('examples/presentation/theme.css');
const lysCss = await read('examples/vendor/lys.css');
const lysJs = await read('examples/vendor/lys.iife.js');
const notice = await read('examples/vendor/NOTICE.md');
let fonts = '', licences = '';
for (const [family, dir, file] of [['Kata Newsreader','newsreader','Newsreader[opsz,wght].ttf'],['Kata Archivo','archivo','Archivo[wdth,wght].ttf']]) {
  const bytes = await readFile(new URL(`examples/design-system/fonts/${dir}/${file}`, root));
  fonts += `@font-face{font-family:'${family}';src:url(data:font/ttf;base64,${bytes.toString('base64')}) format('truetype');font-weight:100 900;font-display:swap}\n`;
  licences += (await read(`examples/design-system/fonts/${dir}/OFL.txt`)).replace(/[ \t]+$/gm, '');
}
const list = items => `<ul>${items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
function body(s) {
  let content = '';
  if (s.kind === 'focus') content = s.paragraphs.map(t => `<p>${esc(t)}</p>`).join('');
  else if (s.kind === 'lead') content = `<div class="lead-layout"><p class="lead-copy">${esc(s.lead)}</p>${list(s.items)}</div><p class="note">${esc(s.note)}</p>`;
  else if (s.kind === 'list' || s.kind === 'facts') content = list(s.items);
  else if (s.kind === 'peers') content = `<div class="peers-layout">${s.groups.map(g=>`<section class="peer"><h3>${esc(g.title)}</h3>${list(g.items)}</section>`).join('')}</div>`;
  else if (s.kind === 'rows') content = `<div class="service-rows">${s.groups.map(g=>`<section class="service-row"><span class="number">${esc(g.number)}</span><h3>${esc(g.title)}</h3><p>${esc(g.text)}</p></section>`).join('')}</div>`;
  else throw new Error(`Unsupported example composition: ${s.kind}`);
  return `<div class="content"><h2>${esc(s.title)}</h2>${content}</div>`;
}
function article(s, i, deck) {
  return `<article id="${s.id}${deck?'':'-preview'}" class="${s.kind}"${deck?' data-transition="direct"':''} data-source-page="${s.page}" data-notes="${esc(`Crown Commercial Service, 25 February 2020. Historical excerpt from source slide ${s.page}; these details describe the original briefing, not current procurement guidance.`)}"><header class="slide-header"><span>Crown Commercial Service · 25 February 2020</span><span>${String(i+1).padStart(2,'0')} / ${String(data.slides.length).padStart(2,'0')}</span></header>${body(s)}<footer class="source-line">Historical excerpt · source slide ${s.page} · Crown copyright / Open Government Licence</footer></article>`;
}
const head = title => `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><!-- ${notice.replaceAll('--','—')}\n${licences.replaceAll('--','—')} --><style>${fonts}\n${tokens}</style>`;
const behavior = `
const surface = document.querySelector('[data-lys]');
const reading = matchMedia('(max-width: 900px), (max-height: 560px)');
let selected = 0;
function adapt() {
  const deck = Lys.Lys.from(surface);
  if (reading.matches) {
    selected = deck.current;
    deck.destroy();
    document.body.classList.remove('presenting');
  } else {
    document.body.classList.add('presenting');
    const id = decodeURIComponent(location.hash.replace(/^#(?:slide=)?/, ''));
    deck.goTo(id || selected);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', adapt, {once:true}); else adapt();
reading.addEventListener('change', adapt);
document.querySelector('.deck-nav').addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  if (!reading.matches) { event.preventDefault(); Lys.Lys.from(surface).goTo(link.hash.slice(1)); }
});
surface.addEventListener('lys:slidechange', event => {
  selected = event.detail.to;
  document.querySelectorAll('.deck-nav .links a').forEach((a,i) => {
    if (i === selected) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
});
`;
const deck = `${head('Digital Marketplace briefing · Kata composition example')}<style>${lysCss}</style><style>${theme}</style></head><body><nav class="deck-nav" aria-label="Slide navigation"><span>CCS · historical excerpt</span><div class="links">${data.slides.map((s,i)=>`<a href="#${s.id}" aria-label="Slide ${i+1}: ${esc(s.title)}">${i+1}</a>`).join('')}</div><span class="hint">← → Home End</span></nav><div data-lys aria-label="Digital Marketplace briefing">${data.slides.map((s,i)=>article(s,i,true)).join('\n')}</div><script>${lysJs}</script><script>${behavior}</script></body></html>\n`;
const gallery = `${head('Kata · compose a useful presentation')}<style>${theme}</style></head><body class="gallery"><main><header class="intro"><p class="eyebrow">Kata / a first usable practice</p><h1>Give the content<br>its proper place.</h1><p>One focus. Equal alternatives. A lead with support. Start with what a slide should communicate, then choose its scale, alignment and space.</p><p>This working example recomposes seven slides from a real supplier briefing. The supplied wording and order stay intact. The explanations below connect each choice to what you can see.</p><nav class="actions" aria-label="Get started"><a href="presentation/deck.html">Open the Lys presentation ↗</a><a href="../skills/kata/SKILL.md">Use the portable skill ↗</a><a href="presentation/README.md">Sources and verification ↗</a></nav></header>${data.slides.map((s,i)=>`<section class="example" aria-labelledby="label-${s.id}"><h2 id="label-${s.id}">${String(i+1).padStart(2,'0')} / ${esc(s.title)} · source slide ${s.page}</h2><div class="preview">${article(s,i,false)}</div><div class="explanation"><p>${esc(s.choice)}</p><p><strong>Alternative.</strong> ${esc(s.alternative)}</p><p><a href="presentation/deck.html#slide=${s.id}">View this slide ↗</a></p></div></section>`).join('\n')}<footer><p>${esc(data.description)}</p><p>Source: <a href="${data.source.url}">Crown Commercial Service presentation</a> · <a href="${data.source.licenceUrl}">Open Government Licence</a>. Composition by Kata; no endorsement implied.</p><p><a href="../README.md">Get started</a> · <a href="design-system/index.html">Visual foundation</a> · <a href="catalogue.html">Historical catalogue</a> · <a href="studies/index.html">Historical studies</a></p></footer></main></body></html>\n`;
await writeFile(new URL('examples/presentation/deck.html',root),deck);
await writeFile(new URL('examples/index.html',root),gallery);
console.log(`Built current Kata gallery and ${data.slides.length}-slide standalone Lys presentation.`);
