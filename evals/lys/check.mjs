#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { access, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const protocol = 'kata-eval/v1';
const decisionProtocol = 'kata-eval-decision/v1';
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function fail(message) {
  throw new Error(message);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function assertKeys(value, required, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`);
  for (const key of required) if (!(key in value)) fail(`${label} missing ${key}`);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${label} has unknown field ${key}`);
}

function assertString(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`);
}

function validateDigest(value, label) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) fail(`${label} must be a lowercase SHA-256 digest`);
}

function relativeSafePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value) || value.includes('\\') || value.split('/').includes('..') || value.split('/').includes('')) {
    fail(`${label} must be a safe relative path: ${value}`);
  }
  return value;
}

async function safeFile(root, relative, label) {
  relativeSafePath(relative, label);
  const rootReal = await realpath(root);
  const file = path.resolve(rootReal, relative);
  const fileReal = await realpath(file).catch(() => fail(`${label} does not exist: ${relative}`));
  if (!fileReal.startsWith(rootReal + path.sep)) fail(`${label} escapes its root: ${relative}`);
  return fileReal;
}

async function checkFileDigest(root, descriptor, label) {
  assertKeys(descriptor, ['path', 'sha256'], ['path', 'sha256'], label);
  validateDigest(descriptor.sha256, `${label}.sha256`);
  const file = await safeFile(root, descriptor.path, `${label}.path`);
  const actual = sha256(await readFile(file));
  if (actual !== descriptor.sha256) fail(`${label} digest mismatch for ${descriptor.path}`);
  return { path: descriptor.path, sha256: actual, absolute: file };
}

function validateManifest(manifest) {
  assertKeys(manifest, ['protocol', 'run_id', 'case', 'task', 'condition', 'tool', 'prompt', 'lys_snapshot', 'output_dir'],
    ['protocol', 'run_id', 'case', 'task', 'condition', 'tool', 'prompt', 'skill_snapshot', 'lys_snapshot', 'output_dir'], 'manifest');
  if (manifest.protocol !== protocol) fail(`manifest protocol must be ${protocol}`);
  assertString(manifest.run_id, 'manifest.run_id');
  assertKeys(manifest.case, ['id', 'revision', 'brief', 'answer_key'], ['id', 'revision', 'brief', 'answer_key'], 'manifest.case');
  assertString(manifest.case.id, 'manifest.case.id');
  assertString(manifest.case.revision, 'manifest.case.revision');
  for (const name of ['brief', 'answer_key']) assertKeys(manifest.case[name], ['path', 'sha256'], ['path', 'sha256'], `manifest.case.${name}`);
  if (!manifest.case.answer_key.path.startsWith('evaluator/')) fail('manifest.case.answer_key must be stored under evaluator/ so it is outside authoring inputs');
  assertKeys(manifest.task, ['audience_question', 'constraints'], ['audience_question', 'constraints'], 'manifest.task');
  assertString(manifest.task.audience_question, 'manifest.task.audience_question');
  if (!Array.isArray(manifest.task.constraints) || manifest.task.constraints.some((item) => typeof item !== 'string')) fail('manifest.task.constraints must be an array of strings');
  if (!['plain-lys', 'kata-0.1.0', 'kata-candidate'].includes(manifest.condition)) fail('manifest.condition is invalid');
  assertKeys(manifest.tool, ['id', 'requested_version', 'model', 'settings'], ['id', 'requested_version', 'model', 'settings'], 'manifest.tool');
  if (!['claude', 'codex', 'pi'].includes(manifest.tool.id)) fail('manifest.tool.id is invalid');
  for (const key of ['requested_version', 'model']) if (manifest.tool[key] !== null && typeof manifest.tool[key] !== 'string') fail(`manifest.tool.${key} must be a string or null`);
  if (typeof manifest.tool.settings !== 'object' || manifest.tool.settings === null || Array.isArray(manifest.tool.settings)) fail('manifest.tool.settings must be an object');
  assertKeys(manifest.prompt, ['path', 'sha256'], ['path', 'sha256'], 'manifest.prompt');
  relativeSafePath(manifest.output_dir, 'manifest.output_dir');
  if (manifest.condition === 'plain-lys' && manifest.skill_snapshot !== null) fail('plain-lys condition must have a null skill_snapshot');
  if (manifest.condition !== 'plain-lys' && !manifest.skill_snapshot) fail(`${manifest.condition} requires a skill_snapshot`);
  if (manifest.skill_snapshot !== null) {
    assertKeys(manifest.skill_snapshot, ['revision', 'directory', 'files'], ['revision', 'directory', 'files'], 'manifest.skill_snapshot');
    assertString(manifest.skill_snapshot.revision, 'manifest.skill_snapshot.revision');
    relativeSafePath(manifest.skill_snapshot.directory, 'manifest.skill_snapshot.directory');
    if (!Array.isArray(manifest.skill_snapshot.files) || !manifest.skill_snapshot.files.length) fail('skill_snapshot.files must be non-empty');
    for (const file of manifest.skill_snapshot.files) {
      assertKeys(file, ['path', 'sha256'], ['path', 'sha256'], 'skill_snapshot file');
      relativeSafePath(file.path, 'skill_snapshot file path'); validateDigest(file.sha256, 'skill_snapshot file sha256');
    }
  }
  assertKeys(manifest.lys_snapshot, ['version', 'directory', 'files'], ['version', 'directory', 'files'], 'manifest.lys_snapshot');
  assertString(manifest.lys_snapshot.version, 'manifest.lys_snapshot.version');
  relativeSafePath(manifest.lys_snapshot.directory, 'manifest.lys_snapshot.directory');
  if (!Array.isArray(manifest.lys_snapshot.files) || !manifest.lys_snapshot.files.length) fail('lys_snapshot.files must be non-empty');
  for (const file of manifest.lys_snapshot.files) {
    assertKeys(file, ['path', 'sha256'], ['path', 'sha256'], 'lys_snapshot file');
    relativeSafePath(file.path, 'lys_snapshot file path'); validateDigest(file.sha256, 'lys_snapshot file sha256');
  }
}

function validateDecision(decision) {
  assertKeys(decision, ['protocol', 'audience_question', 'form', 'fit_rationale', 'tradeoff', 'caveats'],
    ['protocol', 'audience_question', 'form', 'fit_rationale', 'tradeoff', 'caveats'], 'decision');
  if (decision.protocol !== decisionProtocol) fail(`decision protocol must be ${decisionProtocol}`);
  for (const key of ['audience_question', 'form', 'fit_rationale', 'tradeoff']) assertString(decision[key], `decision.${key}`);
  if (!Array.isArray(decision.caveats) || decision.caveats.some((item) => typeof item !== 'string')) fail('decision.caveats must be an array of strings');
}

function validateResult(result, manifest, manifestDigest) {
  assertKeys(result, ['protocol', 'run_id', 'manifest', 'status', 'started_at', 'ended_at', 'tool', 'frozen_inputs', 'artifacts', 'failure'],
    ['protocol', 'run_id', 'manifest', 'status', 'started_at', 'ended_at', 'tool', 'frozen_inputs', 'artifacts', 'failure'], 'result');
  if (result.protocol !== protocol) fail(`result protocol must be ${protocol}`);
  if (result.run_id !== manifest.run_id) fail('result.run_id does not match manifest');
  if (!['succeeded', 'failed', 'unavailable'].includes(result.status)) fail('result.status is invalid');
  if (result.status !== 'succeeded') fail(`attempt status is ${result.status}; there is no successful HTML artifact to validate`);
  assertKeys(result.manifest, ['path', 'sha256'], ['path', 'sha256'], 'result.manifest');
  if (result.manifest.path !== 'manifest.json') fail('result.manifest.path must be manifest.json');
  validateDigest(result.manifest.sha256, 'result.manifest.sha256');
  if (result.manifest.sha256 !== manifestDigest) fail('result.manifest.sha256 does not match manifest.json');
  assertKeys(result.tool, ['id', 'observed_version', 'model', 'settings', 'exit_code'], ['id', 'observed_version', 'model', 'settings', 'exit_code'], 'result.tool');
  if (result.tool.id !== manifest.tool.id || result.tool.exit_code !== 0) fail('successful result must record the manifest CLI and exit_code 0');
  for (const key of ['observed_version', 'model']) if (result.tool[key] !== null && typeof result.tool[key] !== 'string') fail(`result.tool.${key} must be a string or null`);
  if (typeof result.tool.settings !== 'object' || result.tool.settings === null || Array.isArray(result.tool.settings)) fail('result.tool.settings must be an object');
  for (const key of ['started_at', 'ended_at']) if (typeof result[key] !== 'string' || Number.isNaN(Date.parse(result[key]))) fail(`successful result.${key} must be a timestamp`);
  if (!Array.isArray(result.frozen_inputs)) fail('result.frozen_inputs must be an array');
  for (const file of result.frozen_inputs) {
    assertKeys(file, ['path', 'sha256'], ['path', 'sha256'], 'result.frozen_inputs item');
    relativeSafePath(file.path, 'result.frozen_inputs.path');
    validateDigest(file.sha256, 'result.frozen_inputs.sha256');
  }
  assertKeys(result.artifacts, ['decision', 'lys_html', 'final_response', 'log'], ['decision', 'lys_html', 'final_response', 'log'], 'result.artifacts');
  if (result.failure !== null) fail('successful result.failure must be null');
  for (const [key, value] of Object.entries(result.artifacts)) if (!value) fail(`successful result.artifacts.${key} is required`);
}

function parseAttributes(raw) {
  const attrs = {};
  const body = raw.replace(/^<\/?[a-zA-Z][\w:-]*/, '').replace(/\/?\s*>\s*$/, '');
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of body.matchAll(re)) attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  return attrs;
}

function scanHtml(html) {
  if (!/^\s*<!doctype\s+html\s*>/i.test(html)) fail('HTML must begin with an HTML5 doctype');
  const rawSafe = html.replace(/<(script|style)\b([^>]*)>[\s\S]*?<\/\1\s*>/gi, (_all, tag, attrs) => `<${tag}${attrs}></${tag}>`);
  const stack = [];
  const roots = [];
  const slideCounts = new Map();
  const tags = [];
  const tagRe = /<!--[^]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>/g;
  for (const match of rawSafe.matchAll(tagRe)) {
    const token = match[0];
    if (token.startsWith('<!--') || token.startsWith('<!')) continue;
    const closing = /^<\//.test(token);
    const name = token.match(/^<\/?([A-Za-z][\w:-]*)/)?.[1]?.toLowerCase();
    if (!name) continue;
    if (closing) {
      const idx = stack.map((node) => node.name).lastIndexOf(name);
      if (idx >= 0) stack.length = idx;
      tags.push({ name, closing: true, attrs: {} });
      continue;
    }
    const attrs = parseAttributes(token);
    const node = { name, attrs, isLys: Object.hasOwn(attrs, 'data-lys') };
    if (node.isLys) { roots.push(node); slideCounts.set(node, 0); }
    const activeRoot = [...stack].reverse().find((item) => item.isLys);
    if (name === 'article' && activeRoot) {
      if (stack.at(-1) !== activeRoot) fail('Lys slide <article> elements must be direct children of the [data-lys] root');
      slideCounts.set(activeRoot, slideCounts.get(activeRoot) + 1);
    }
    tags.push({ name, closing: false, attrs, raw: token });
    if (!voidTags.has(name)) stack.push(node);
  }
  for (const required of ['html', 'head', 'body']) {
    if (!tags.some((item) => item.name === required && !item.closing)) fail(`HTML is missing <${required}>`);
    if (!tags.some((item) => item.name === required && item.closing)) fail(`HTML is missing </${required}>`);
  }
  if (roots.length > 1) fail('HTML must have exactly one [data-lys] deck root');
  if (roots.length === 1 && slideCounts.get(roots[0]) < 1) fail('[data-lys] root must contain at least one direct <article> slide');
  return { tags, hasLysRoot: roots.length === 1, slides: roots.length ? slideCounts.get(roots[0]) : 0 };
}

function resourceTag(tag) {
  const attrs = tag.attrs;
  if (tag.name === 'script' && attrs.src) return attrs.src;
  if (tag.name === 'link' && attrs.href && /(?:^|\s)(?:stylesheet|preload|icon|modulepreload)(?:\s|$)/i.test(attrs.rel ?? '')) return attrs.href;
  if (['img', 'source', 'iframe', 'audio', 'video', 'object', 'embed', 'track'].includes(tag.name)) return attrs.src || attrs.data || attrs.href || '';
  return '';
}

async function validateCss(css, baseDir, root, issues, seen = new Set()) {
  const urls = [];
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) urls.push(match[2].trim());
  for (const match of css.matchAll(/@import\s+(?:url\()?\s*(['"])(.*?)\1\s*\)?/gi)) urls.push(match[2].trim());
  const rootReal = await realpath(root);
  for (const url of new Set(urls)) {
    if (/^(?:https?:|\/\/|ftp:|file:|javascript:)/i.test(url)) { issues.push(`remote CSS resource ${url}`); continue; }
    if (url.startsWith('data:') || url.startsWith('#')) continue;
    const resolved = path.resolve(baseDir, decodeURIComponent(url.split(/[?#]/, 1)[0]));
    if (!resolved.startsWith(rootReal + path.sep)) { issues.push(`CSS resource escapes allowed root: ${url}`); continue; }
    let asset;
    try { asset = await safeFile(root, path.relative(rootReal, resolved).split(path.sep).join('/'), `CSS ${url}`); }
    catch { issues.push(`missing CSS resource ${url}`); continue; }
    if (/\.css$/i.test(asset) && !seen.has(asset)) {
      seen.add(asset);
      await validateCss(await readFile(asset, 'utf8'), path.dirname(asset), root, issues, seen);
    }
  }
}

async function validateResources(html, htmlPath, root, scan) {
  const problems = [];
  const htmlDir = path.dirname(htmlPath);
  for (const tag of scan.tags) {
    if (tag.closing) continue;
    const url = resourceTag(tag);
    if (url) {
      if (/^(?:https?:|\/\/|ftp:|file:|javascript:)/i.test(url)) problems.push(`remote or unsafe resource ${url}`);
      else if (/^(?:data:)/i.test(url)) {
        if (tag.name !== 'img' && tag.name !== 'source') problems.push(`data URI not allowed on <${tag.name}>`);
      } else if (!url.startsWith('#')) {
        const decoded = decodeURIComponent(url.split(/[?#]/, 1)[0]);
        const resolved = path.resolve(htmlDir, decoded);
        const rootReal = await realpath(root);
        if (resolved !== rootReal && !resolved.startsWith(rootReal + path.sep)) problems.push(`local resource escapes attempt: ${url}`);
        else {
          try { await safeFile(root, path.relative(rootReal, resolved).split(path.sep).join('/'), `HTML resource ${url}`); }
          catch { problems.push(`missing local resource ${url}`); }
        }
      }
    }
    const srcset = tag.attrs.srcset;
    if (srcset) for (const item of srcset.split(',')) {
      const candidate = item.trim().split(/\s+/)[0];
      if (/^(?:https?:|\/\/|ftp:)/i.test(candidate)) problems.push(`remote srcset resource ${candidate}`);
      else if (!candidate.startsWith('data:')) {
        const resolved = path.resolve(htmlDir, decodeURIComponent(candidate.split(/[?#]/, 1)[0]));
        const rootReal = await realpath(root);
        if (!resolved.startsWith(rootReal + path.sep)) problems.push(`srcset resource escapes attempt: ${candidate}`);
        else { try { await safeFile(root, path.relative(rootReal, resolved).split(path.sep).join('/'), `srcset ${candidate}`); } catch { problems.push(`missing srcset resource ${candidate}`); } }
      }
    }
  }
  const cssBlocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map((m) => m[1]);
  for (const block of cssBlocks) await validateCss(block, htmlDir, root, problems);
  for (const tag of scan.tags) {
    if (tag.closing) continue;
    if (tag.attrs.style) await validateCss(tag.attrs.style, htmlDir, root, problems);
    if (tag.name === 'link' && tag.attrs.href && /(?:^|\s)stylesheet(?:\s|$)/i.test(tag.attrs.rel ?? '')) {
      const file = path.resolve(htmlDir, decodeURIComponent(tag.attrs.href.split(/[?#]/, 1)[0]));
      try { await validateCss(await readFile(file, 'utf8'), path.dirname(file), root, problems); }
      catch { /* Missing and escaping links were reported by the resource pass above. */ }
    }
  }
  return problems;
}

async function validateLysAssets(html, htmlPath, attemptRoot, lysFiles) {
  const issues = [];
  const lowerHtml = html.toLowerCase();
  for (const asset of lysFiles.filter((file) => /\.(?:css|js)$/i.test(file.path))) {
    const bytes = await readFile(asset.absolute);
    const source = bytes.toString('utf8').trim();
    const element = asset.path.toLowerCase().endsWith('.css') ? 'style' : 'script';
    const embedded = [...html.matchAll(new RegExp(`<${element}\\b[^>]*>([\\s\\S]*?)<\\/${element}\\s*>`, 'gi'))].some((match) => match[1].includes(source));
    const base = await realpath(path.dirname(htmlPath));
    const assetReal = await realpath(asset.absolute);
    const relativeUrl = path.relative(base, assetReal).split(path.sep).join('/');
    const linked = lowerHtml.includes(`${element === 'style' ? 'href' : 'src'}="${relativeUrl.toLowerCase()}"`) || lowerHtml.includes(`${element === 'style' ? 'href' : 'src'}='${relativeUrl.toLowerCase()}'`);
    if (!embedded && !linked) issues.push(`Lys ${element} ${asset.path} is neither embedded exactly nor linked from the snapshot`);
  }
  if (!lysFiles.some((file) => /\.css$/i.test(file.path))) issues.push('Lys snapshot has no CSS file');
  if (!lysFiles.some((file) => /\.js$/i.test(file.path))) issues.push('Lys snapshot has no JavaScript file');
  return issues;
}

async function checkAttempt(attemptDir) {
  const root = path.resolve(attemptDir);
  const manifestPath = await safeFile(root, 'manifest.json', 'manifest');
  const resultPath = await safeFile(root, 'result.json', 'result');
  const manifestBytes = await readFile(manifestPath);
  const manifest = JSON.parse(manifestBytes);
  const result = JSON.parse(await readFile(resultPath, 'utf8'));
  validateManifest(manifest);
  const manifestDigest = sha256(manifestBytes);
  validateResult(result, manifest, manifestDigest);

  const expectedFiles = [manifest.case.brief, manifest.case.answer_key, manifest.prompt,
    ...(manifest.skill_snapshot?.files ?? []), ...manifest.lys_snapshot.files];
  const frozen = [];
  for (const descriptor of expectedFiles) frozen.push(await checkFileDigest(root, descriptor, 'frozen input'));
  const resultInputs = new Map(result.frozen_inputs.map((item) => [item.path, item.sha256]));
  if (resultInputs.size !== result.frozen_inputs.length) fail('result.frozen_inputs contains duplicate paths');
  for (const file of frozen) if (resultInputs.get(file.path) !== file.sha256) fail(`result.frozen_inputs does not record ${file.path} with its digest`);
  for (const file of result.frozen_inputs) if (!frozen.some((expected) => expected.path === file.path)) fail(`result.frozen_inputs has unreferenced file ${file.path}`);

  const outputDir = manifest.output_dir;
  const artifactMap = {};
  for (const [name, descriptor] of Object.entries(result.artifacts)) {
    assertKeys(descriptor, ['path', 'sha256'], ['path', 'sha256'], `result.artifacts.${name}`);
    if (!descriptor.path.startsWith(`${outputDir}/`)) fail(`result.artifacts.${name} must be inside ${outputDir}`);
    artifactMap[name] = await checkFileDigest(root, descriptor, `result.artifacts.${name}`);
  }
  const decisionPath = artifactMap.decision.absolute;
  const htmlPath = artifactMap.lys_html.absolute;
  if (path.basename(decisionPath) !== 'decision.json') fail('decision artifact must be named decision.json');
  if (path.basename(htmlPath) !== 'slide.html') fail('Lys artifact must be named slide.html');
  const decision = JSON.parse(await readFile(decisionPath, 'utf8'));
  validateDecision(decision);
  if (decision.audience_question !== manifest.task.audience_question) fail('decision question does not match manifest.task.audience_question');
  const html = await readFile(htmlPath, 'utf8');
  const scan = scanHtml(html);
  if (!scan.hasLysRoot) fail('Lys HTML must contain one [data-lys] deck root');
  const resourceIssues = await validateResources(html, htmlPath, root, scan);
  if (resourceIssues.length) fail(resourceIssues.join('; '));
  const lysAssets = [];
  for (const descriptor of manifest.lys_snapshot.files) lysAssets.push(await checkFileDigest(root, descriptor, 'Lys snapshot asset'));
  const lysIssues = await validateLysAssets(html, htmlPath, root, lysAssets);
  if (lysIssues.length) fail(lysIssues.join('; '));

  return { root, manifest, result, manifestPath, resultPath, manifestDigest, htmlPath, html, scan, artifactMap, frozen, lysAssets };
}

async function checkStandalone(htmlFile, lysDir) {
  const htmlPath = await realpath(htmlFile);
  let root = path.dirname(htmlPath);
  let cursor = root;
  while (true) {
    try {
      await access(path.join(cursor, '.git'));
      root = cursor;
      break;
    } catch {}
    try {
      await access(path.join(cursor, 'package.json'));
      root = cursor;
      break;
    } catch {}
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  const html = await readFile(htmlPath, 'utf8');
  const scan = scanHtml(html);
  const resourceIssues = await validateResources(html, htmlPath, root, scan);
  if (resourceIssues.length) fail(resourceIssues.join('; '));
  let assetIssues = [];
  if (lysDir && scan.hasLysRoot) {
    const dir = await realpath(lysDir);
    const files = [];
    for (const name of ['lys.css', 'lys.iife.js']) {
      const assetPath = await realpath(path.join(dir, name)).catch(() => fail(`missing expected vendor asset ${name} in ${lysDir}`));
      files.push({ path: name, absolute: assetPath });
    }
    assetIssues = await validateLysAssets(html, htmlPath, root, files);
    if (assetIssues.length) fail(assetIssues.join('; '));
  }
  return { root, htmlPath, html, scan, standalone: true, assetIssues };
}

async function reviewWithBrowser(context, outputDir) {
  const { chromium } = context.playwright;
  const browser = await chromium.launch({ headless: true });
  const notes = [];
  const errors = [];
  await mkdir(outputDir, { recursive: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(pathToFileURL(context.htmlPath).href, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(outputDir, 'presentation-1440x900.png') });
    const text = await page.locator('body').innerText().catch(() => '');
    if (!text.trim()) errors.push('presentation viewport has no readable body text');
    const overflowPresentation = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflowPresentation) errors.push('presentation viewport has horizontal overflow');
    notes.push({ check: 'presentation-1440x900', passed: !overflowPresentation });

    const slides = page.locator('[data-lys] > article');
    const slideCount = await slides.count();
    const captureSlides = async (prefix) => {
      const count = await slides.count();
      const layouts = [];
      for (let index = 0; index < count; index++) {
        const active = await page.locator('[data-lys] > article[data-lys-active]').count();
        if (active === 0) await slides.nth(index).scrollIntoViewIfNeeded();
        else if (index > 0) {
          const previous = await page.locator('[data-lys] > article[data-lys-active]').getAttribute('id');
          await page.locator('[data-lys]').focus();
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction((priorId) => document.querySelector('[data-lys] > article[data-lys-active]')?.id !== priorId, previous, { timeout: 1500 }).catch(() => {});
        }
        await page.screenshot({ path: path.join(outputDir, `${prefix}-slide-${String(index + 1).padStart(2, '0')}.png`) });
        const layout = await slides.nth(index).evaluate((element) => ({
          id: element.id || null,
          active: element.hasAttribute('data-lys-active'),
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
          clippedVertically: element.clientHeight > 0 && element.scrollHeight > element.clientHeight + 2
        }));
        layouts.push(layout);
        if (layout.clippedVertically) errors.push(`${prefix} slide ${layout.id ?? index + 1} has content taller than its visible slide box`);
      }
      return layouts;
    };
    const presentationLayouts = slideCount ? await captureSlides('presentation') : [];

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(outputDir, 'phone-390x844.png') });
    const overflowPhone = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflowPhone) errors.push('phone viewport has horizontal overflow');
    notes.push({ check: 'phone-390x844', passed: !overflowPhone });
    let phoneLayouts = [];
    if (slideCount) {
      await page.goto(pathToFileURL(context.htmlPath).href, { waitUntil: 'load' });
      phoneLayouts = await captureSlides('phone');
    }

    const root = page.locator('[data-lys]');
    if (await root.count()) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pathToFileURL(context.htmlPath).href, { waitUntil: 'load' });
      const before = await page.locator('[data-lys] > article[data-lys-active]').getAttribute('id').catch(() => null);
      await root.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction((priorId) => document.querySelector('[data-lys] > article[data-lys-active]')?.id !== priorId, before, { timeout: 1500 }).catch(() => {});
      const after = await page.locator('[data-lys] > article[data-lys-active]').getAttribute('id').catch(() => null);
      const count = await root.locator(':scope > article').count();
      const keyboardPassed = count < 2 || before !== after;
      if (!keyboardPassed) errors.push('ArrowRight did not change the active Lys slide');
      notes.push({ check: 'keyboard-navigation', passed: keyboardPassed, slides: count });
    } else {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement && document.activeElement !== document.body);
      if (!focused) errors.push('Tab did not focus an interactive element');
      notes.push({ check: 'keyboard-focus', passed: Boolean(focused) });
    }

    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: path.join(outputDir, 'print.pdf'), printBackground: true, preferCSSPageSize: true });
    notes.push({ check: 'print-pdf-generated', passed: null, artifact: 'print.pdf', note: 'Inspect this PDF manually for pagination and clipping.' });

    const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const noJsPage = await noJsContext.newPage();
    noJsPage.on('pageerror', (error) => errors.push(`no-JS: ${error.message}`));
    await noJsPage.goto(pathToFileURL(context.htmlPath).href, { waitUntil: 'load' });
    const noJsText = await noJsPage.locator('body').innerText().catch(() => '');
    const noJsPassed = Boolean(noJsText.trim());
    if (!noJsPassed) errors.push('body has no readable content with JavaScript disabled');
    notes.push({ check: 'no-javascript-content', passed: noJsPassed });
    await noJsContext.close();
  } finally {
    await browser.close();
  }
  return { checks: notes, slide_layouts: { presentation: presentationLayouts, phone: phoneLayouts }, errors, passed: errors.length === 0 };
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (!arg.startsWith('--')) {
      if (options.attempt || options.html) fail(`unexpected argument ${arg}`);
      options.attempt = arg;
      continue;
    }
    const key = arg.slice(2);
    if (key === 'review') { options.review = true; continue; }
    if (!['attempt', 'html', 'lys-dir', 'out', 'playwright-module'].includes(key)) fail(`unknown option ${arg}`);
    const value = args[++index];
    if (!value) fail(`${arg} requires a value`);
    options[key] = value;
  }
  if (options.attempt && options.html) fail('choose either --attempt or --html');
  if (!options.attempt && !options.html) fail('usage: check.mjs --attempt <attempt-dir> [--review --playwright-module <module>] | --html <file> [--lys-dir <dir>] [--review --playwright-module <module>]');
  if (options.review && !options['playwright-module']) fail('--review requires --playwright-module <installed Playwright module>');
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const targetRoot = options.attempt ? path.resolve(options.attempt) : path.dirname(path.resolve(options.html));
  const outputDir = path.resolve(options.out ?? (options.attempt ? path.join(targetRoot, 'review') : path.join(targetRoot, 'lys-review')));
  let context;
  let structuralError = null;
  let review = { checks: [], errors: [], passed: null, status: 'not-run' };
  try {
    context = options.attempt ? await checkAttempt(options.attempt) : await checkStandalone(options.html, options['lys-dir']);
  } catch (error) {
    structuralError = error.message;
  }
  if (options.review && !structuralError) {
    try {
      const require = createRequire(path.join(process.cwd(), 'package.json'));
      context.playwright = require(options['playwright-module']);
      review = { ...(await reviewWithBrowser(context, outputDir)), status: 'complete' };
    } catch (error) {
      review = { checks: [], errors: [error.message], passed: false, status: 'failed' };
    }
  }
  const report = {
    protocol: 'kata-eval-lys-validation/v1',
    target: options.attempt ? { kind: 'attempt', path: path.resolve(options.attempt) } : { kind: 'html', path: path.resolve(options.html) },
    contract_status: options.attempt ? 'checked' : 'HTML-only; full manifest/result/decision contract not checked',
    structural: { passed: structuralError === null, error: structuralError, lysRoot: context?.scan.hasLysRoot ?? false, slides: context?.scan.slides ?? 0,
      manifestSha256: context?.manifestDigest ?? null,
      resultSha256: context?.resultPath ? sha256(await readFile(context.resultPath)) : null,
      artifacts: context?.artifactMap ? Object.fromEntries(Object.entries(context.artifactMap).map(([key, item]) => [key, { path: item.path, sha256: item.sha256 }])) : {} },
    review,
    human_visual_review: { status: 'not-recorded', notes: null },
    limits: 'Structural checks and browser measurements do not establish visual quality or reader comprehension.'
  };
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'validation.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (structuralError !== null || review.passed === false) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`Lys validation failed: ${error.message}\n`);
  process.exitCode = 1;
});
