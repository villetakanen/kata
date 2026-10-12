import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chmod, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const run = (command, args, options = {}) => spawnSync(command, args, {
  cwd: root, encoding: 'utf8', timeout: 30_000, maxBuffer: 8 * 1024 * 1024, ...options
});

function requireObject(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
}

async function checkCaseCorpus() {
  const casesRoot = path.join(root, 'evals/cases');
  const index = await readJson(path.join(casesRoot, 'index.json'));
  requireObject(index, 'case index');
  assert.equal(index.protocol, 'kata-eval-case-index/v1', 'case index protocol');
  assert(Array.isArray(index.cases) && index.cases.length > 0, 'case index must contain cases');
  const ids = new Set();
  for (const item of index.cases) {
    requireObject(item, 'case entry');
    for (const key of ['id', 'revision', 'brief', 'answer_key', 'audience_question', 'reader_task']) {
      assert.equal(typeof item[key], 'string', `${item.id ?? 'case'} ${key} must be text`);
      assert(item[key].trim(), `${item.id ?? 'case'} ${key} must not be empty`);
    }
    assert.match(item.id, /^[A-Za-z0-9][A-Za-z0-9._-]*$/, `unsafe case id: ${item.id}`);
    assert(!ids.has(item.id), `duplicate case id: ${item.id}`);
    ids.add(item.id);
    assert(Array.isArray(item.constraints), `${item.id} constraints must be an array`);
    assert(item.constraints.every(value => typeof value === 'string' && value.trim()), `${item.id} constraints must be non-empty strings`);

    for (const [field, label] of [['brief', 'brief'], ['answer_key', 'answer key']]) {
      const relative = item[field];
      assert(!path.isAbsolute(relative) && !relative.split('/').includes('..'), `${item.id} ${label} path must stay inside evals/cases`);
      const target = await realpath(path.resolve(casesRoot, relative));
      assert(target.startsWith(`${await realpath(casesRoot)}${path.sep}`), `${item.id} ${label} must stay inside evals/cases`);
      const body = await readFile(target, 'utf8');
      assert(body.trim(), `${item.id} ${label} must not be empty`);
      if (field === 'answer_key') {
        const key = JSON.parse(body);
        requireObject(key, `${item.id} answer key`);
        assert.equal(key.protocol, 'kata-eval-answer-key/v1', `${item.id} answer key protocol`);
        assert.equal(key.case_id, item.id, `${item.id} answer key case id`);
        assert.equal(key.revision, item.revision, `${item.id} answer key revision`);
        for (const listName of ['required_facts', 'disallowed_claims', 'acceptable_choices']) {
          assert(Array.isArray(key[listName]) && key[listName].length > 0, `${item.id} ${listName} must be non-empty`);
        }
        const factIds = new Set();
        for (const fact of key.required_facts) {
          requireObject(fact, `${item.id} required fact`);
          assert.equal(typeof fact.id, 'string');
          assert(fact.id.trim());
          assert(!factIds.has(fact.id), `${item.id} has duplicate required fact ${fact.id}`);
          factIds.add(fact.id);
          assert.equal(typeof fact.fact, 'string');
          assert(fact.fact.trim());
        }
        for (const claim of [...key.disallowed_claims, ...key.acceptable_choices]) {
          assert.equal(typeof claim, 'string', `${item.id} answer-key guidance must be text`);
          assert(claim.trim(), `${item.id} answer-key guidance must not be empty`);
        }
      }
    }
  }
  return { casesRoot, index };
}

function assertCommand(result, label) {
  assert.ifError(result.error, `${label}: ${result.error?.message}`);
}

async function checkRunnerContract(index) {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'kata-check-evals-'));
  try {
    const caseIndexPath = path.join(temp, 'index.json');
    const firstCase = index.cases[0];
    for (const relative of [firstCase.brief, firstCase.answer_key]) {
      const from = path.join(root, 'evals/cases', relative);
      const to = path.join(temp, relative);
      await mkdir(path.dirname(to), { recursive: true });
      await writeFile(to, await readFile(from));
    }
    await writeFile(caseIndexPath, `${JSON.stringify({ protocol: index.protocol, cases: [firstCase] }, null, 2)}\n`);
    const promptPath = path.join(temp, 'prompt.md');
    await writeFile(promptPath, await readFile(path.join(root, 'evals/runner/task-prompt.md')));
    const successCli = path.join(temp, 'fake-codex.mjs');
    const fakeSource = `#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
if (process.argv.includes('--version')) { console.log('fake-codex 1.0'); process.exit(0); }
const mode = process.env.KATA_FAKE_MODE || 'success';
if (mode === 'error') { console.error('synthetic adapter failure'); process.exit(17); }
if (mode === 'empty') process.exit(0);
const outputArg = process.argv.indexOf('-o');
const response = process.argv[outputArg + 1];
const out = path.dirname(response);
const css = await readFile(path.join(process.cwd(), 'inputs/lys/lys.css'), 'utf8');
const js = await readFile(path.join(process.cwd(), 'inputs/lys/lys.iife.js'), 'utf8');
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evaluation check</title><style>' + css + '</style></head><body><div data-lys tabindex="0"><article id="evaluation-check"><h1>Evaluation check</h1><p>Stub artifact for contract verification.</p><p>Open the next measurement cycle.</p><aside data-notes="">Review scope and uncertainty.</aside></article></div><script>' + js + '</script></body></html>';
await writeFile(path.join(out, 'slide.html'), html);
await writeFile(path.join(out, 'decision.json'), JSON.stringify({ protocol: 'kata-eval-decision/v1', audience_question: ${JSON.stringify(firstCase.audience_question)}, form: 'summary', fit_rationale: 'The slide states a supported next step.', tradeoff: 'A single slide omits detail.', caveats: ['The stub does not make empirical claims.'] }, null, 2));
await writeFile(response, 'Stub final response.');
`;
    await writeFile(successCli, fakeSource);
    await chmod(successCli, 0o755);

    const missingCli = path.join(temp, 'no-such-cli');
    const spec = {
      case_index: caseIndexPath,
      prompt: 'prompt.md',
      lys: { version: '1.2.1', directory: path.join(root, 'examples/vendor') },
      skills: {
        'kata-0.1.0': { revision: 'v0.1.0', git_repository: root, git_ref: 'v0.1.0', subpath: 'skills/kata' },
        'kata-candidate': { directory: path.join(root, 'skills/kata') }
      },
      timeout_seconds: 5,
      tools: { codex: { path: successCli, model: 'fake-model', settings: {} } }
    };
    const specPath = path.join(temp, 'evaluation.json');
    await writeFile(specPath, `${JSON.stringify(spec, null, 2)}\n`);
    const runnerPath = path.join(root, 'evals/runner/run.mjs');
    const validatorPath = path.join(root, 'evals/lys/check.mjs');
    const out = path.join(temp, 'results');
    const invoke = async (id, extraEnv = {}, dryRun = false, binary = successCli) => {
      spec.tools.codex.path = binary;
      await writeFile(specPath, `${JSON.stringify(spec, null, 2)}\n`);
      return run(process.execPath, [runnerPath, '--spec', specPath, '--case-index', caseIndexPath, '--case', firstCase.id,
        '--cli', 'codex', '--condition', 'plain-lys', '--run-id', id, '--results', out, ...(dryRun ? ['--dry-run'] : [])],
      { env: { ...process.env, ...extraEnv } });
    };
    const attemptAt = id => path.join(out, id, 'codex', `${firstCase.id}--plain-lys--codex`);

    const dry = await invoke('check-dry', {}, true);
    assertCommand(dry, 'runner dry-run');
    assert.equal(dry.status, 0, `runner dry-run: ${dry.stderr}`);
    assert.equal((await readJson(path.join(attemptAt('check-dry'), 'result.json'))).status, 'unavailable');

    const success = await invoke('check-success');
    assertCommand(success, 'runner success stub');
    assert.equal(success.status, 0, `runner success stub: ${success.stderr}`);
    const successAttempt = attemptAt('check-success');
    const successResult = await readJson(path.join(successAttempt, 'result.json'));
    assert.equal(successResult.status, 'succeeded', JSON.stringify(successResult));
    assert(!successResult.frozen_inputs.some(item => item.path.includes('reader-task')), 'reader task must not become a frozen author input');
    const validated = run(process.execPath, [validatorPath, '--attempt', successAttempt]);
    assertCommand(validated, 'contract validator success stub');
    assert.equal(validated.status, 0, `contract validator rejected runner success: ${validated.stderr}\n${validated.stdout}`);

    // Keep the harness sensitive to the two regressions found during the pilot.
    const resultPath = path.join(successAttempt, 'result.json');
    const originalResultText = await readFile(resultPath, 'utf8');
    const originalResult = JSON.parse(originalResultText);
    try {
      const missingProtocol = { ...originalResult };
      delete missingProtocol.protocol;
      await writeFile(resultPath, `${JSON.stringify(missingProtocol, null, 2)}\n`);
      const missingProtocolCheck = run(process.execPath, [validatorPath, '--attempt', successAttempt]);
      assert.notEqual(missingProtocolCheck.status, 0, 'validator must reject result without protocol');
      assert.match(missingProtocolCheck.stdout, /result missing protocol/, 'validator should identify the missing result protocol');

      const extraInput = { ...originalResult, frozen_inputs: [...originalResult.frozen_inputs, { path: 'evaluator/unreferenced.md', sha256: '0'.repeat(64) }] };
      await writeFile(resultPath, `${JSON.stringify(extraInput, null, 2)}\n`);
      const extraInputCheck = run(process.execPath, [validatorPath, '--attempt', successAttempt]);
      assert.notEqual(extraInputCheck.status, 0, 'validator must reject unreferenced frozen input');
      assert.match(extraInputCheck.stdout, /unreferenced file evaluator\/unreferenced\.md/, 'validator should identify the extra frozen input');
    } finally {
      await writeFile(resultPath, originalResultText);
    }

    const noArtifact = await invoke('check-no-artifact', { KATA_FAKE_MODE: 'empty' });
    assertCommand(noArtifact, 'runner missing-output stub');
    assert.equal(noArtifact.status, 0, `runner missing-output stub: ${noArtifact.stderr}`);
    assert.equal((await readJson(path.join(attemptAt('check-no-artifact'), 'result.json'))).status, 'failed');

    const error = await invoke('check-error', { KATA_FAKE_MODE: 'error' });
    assertCommand(error, 'runner error stub');
    assert.equal(error.status, 0, `runner error stub: ${error.stderr}`);
    const errorResult = await readJson(path.join(attemptAt('check-error'), 'result.json'));
    assert.equal(errorResult.status, 'failed');
    assert.match(errorResult.failure.reason, /status 17/);

    const missing = await invoke('check-missing', {}, false, missingCli);
    assertCommand(missing, 'runner unavailable stub');
    assert.equal(missing.status, 0, `runner unavailable stub: ${missing.stderr}`);
    assert.equal((await readJson(path.join(attemptAt('check-missing'), 'result.json'))).status, 'unavailable');
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

const { index } = await checkCaseCorpus();
await checkRunnerContract(index);
console.log('Checked versioned evaluation cases and CLI runner protocol, including dry-run, success, missing CLI, tool failure, and rejected contract regressions.');
