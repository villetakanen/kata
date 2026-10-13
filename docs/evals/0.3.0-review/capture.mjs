// Run with Node 20+, passing a package.json whose dependencies include Playwright.
// Example: node docs/evals/0.3.0-review/capture.mjs /path/to/package.json /tmp/kata-030-review
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { chromium } = createRequire(resolve(process.argv[2]))('@playwright/test');
const out = resolve(process.argv[3]);
const root = fileURLToPath(new URL('../../../', import.meta.url));
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const records = [];
for (const file of (process.argv[4] ? [process.argv[4]] : ['field-guide', 'index', 'kata-lys'])) {
  for (const [size, width, height] of [['presentation', 1440, 900], ['phone', 390, 844]]) {
    for (const javaScriptEnabled of [true, false]) {
      const mode = javaScriptEnabled ? 'js' : 'nojs';
      const context = await browser.newContext({ viewport: { width, height }, javaScriptEnabled });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const network = [];
      page.on('request', req => { if (/^https?:/.test(req.url())) network.push(req.url()); });
      await page.goto(pathToFileURL(`${root}/examples/${file}.html`).href);
      const ids = await page.locator('article').evaluateAll(es => es.map(e => e.id));
      const record = { file, size, width, height, javaScriptEnabled, errors, network, slides: [] };
      for (const id of ids) {
        if (file !== 'index' && javaScriptEnabled) {
          await page.evaluate(id => Lys.Lys.from(document.querySelector('[data-lys]')).goTo(id), id);
        }
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(80);
        const metrics = await page.locator(`#${id}`).evaluate(el => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            id: el.id, width: r.width, height: r.height,
            scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
            scrollHeight: el.scrollHeight, clientHeight: el.clientHeight,
            display: cs.display, visibility: cs.visibility,
            textLength: el.innerText.length,
            footer: [...el.querySelectorAll('.guide-footer, .guide-footer > *')].map(node => {
              const box = node.getBoundingClientRect();
              return { tag: node.tagName, top: box.top - r.top, bottom: box.bottom - r.top, text: node.textContent };
            }),
          };
        });
        record.slides.push(metrics);
        await page.locator(`#${id}`).screenshot({ path: `${out}/${file}-${size}-${mode}-${id}.png` });
        if (file === 'field-guide' && size === 'phone' && id === 'time-series') {
          await page.locator(`#${id} .guide-footer a`).scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          await page.screenshot({ path: `${out}/${file}-${size}-${mode}-${id}-footer.png` });
          metrics.footerReachable = await page.locator(`#${id} .guide-footer a`).evaluate(el => {
            const r = el.getBoundingClientRect();
            const hit = document.elementFromPoint(r.left + 5, r.top + r.height / 2);
            return el === hit || el.contains(hit);
          });
          assert(metrics.footerReachable, 'Phone time-series reference must be reachable by scrolling');
        }
        if (file === 'field-guide' && size === 'phone' && id === 'directed-dependencies') {
          await page.locator(`#${id} .guide-diagram`).evaluate(el => { el.scrollLeft = el.scrollWidth; });
          await page.locator(`#${id}`).screenshot({ path: `${out}/${file}-${size}-${mode}-${id}-scrolled.png` });
        }
      }
      if (file === 'index') {
        await page.goto(pathToFileURL(`${root}/examples/${file}.html`).href);
        await page.screenshot({ path: `${out}/index-${size}-${mode}-intro.png`, fullPage: false });
      }
      if (javaScriptEnabled && file !== 'index') {
        await page.evaluate(() => Lys.Lys.from(document.querySelector('[data-lys]')).goTo(0));
        const active = () => page.locator('[data-lys-active]').getAttribute('id');
        const before = await active();
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(150);
        const next = await active();
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(150);
        record.keyboard = { before, next, previous: await active() };
        assert.equal(next, ids[1], `${file}: ArrowRight must advance`);
        assert.equal(record.keyboard.previous, ids[0], `${file}: ArrowLeft must return`);
        const navLink = page.locator('[data-lys-nav] a[href^="#"]').last();
        const target = (await navLink.getAttribute('href')).slice(1);
        await navLink.click();
        await page.waitForTimeout(200);
        record.navigation = { target, actual: await active() };
        assert.equal(record.navigation.actual, target, `${file}: navigation must update active slide`);
      }
      await page.goto(pathToFileURL(`${root}/examples/${file}.html`).href);
      await page.keyboard.press('Tab');
      record.tabFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, text: document.activeElement.textContent, href: document.activeElement.getAttribute('href') }));
      if (size === 'presentation' && javaScriptEnabled) {
        await page.emulateMedia({ media: 'print' });
        await page.pdf({ path: `${out}/${file}-print.pdf`, preferCSSPageSize: true, printBackground: true });
      }
      records.push(record);
      assert.equal(errors.length, 0, `${file}: browser errors`);
      assert.equal(network.length, 0, `${file}: remote runtime requests`);
      await context.close();
    }
  }
}
await browser.close();
await writeFile(`${out}/verification.json`, JSON.stringify(records, null, 2) + '\n');
console.log(`Captured ${records.length} artifact/mode/viewport combinations to ${out}`);
