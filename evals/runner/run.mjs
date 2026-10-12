#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const TOOLS = ['claude', 'codex', 'pi'];
const CONDITIONS = ['plain-lys', 'kata-0.1.0', 'kata-candidate'];
const SECRET_NAME = /(key|token|secret|password|credential|authorization)/i;
const SECRET_VALUE = /(Bearer\s+)[A-Za-z0-9._~+/-]+=*|((?:sk|pk)-[A-Za-z0-9_-]{16,})/gi;
const activeWorkspaces = new Set();

function usage() {
  console.log(`Usage: node evals/runner/run.mjs --spec <evaluation.json> [options]

Options:
  --cli <claude|codex|pi|all>       Default: all configured CLIs
  --condition <condition|all>       Default: all three conditions
  --case-index <path>                Override the case index from the spec
  --case <id>                        Run one case from the index
  --run-id <id>                     Default: generated UTC timestamp + random suffix
  --results <directory>             Default: ../results (relative to spec)
  --timeout <seconds>               Override each configured tool timeout
  --dry-run                         Prepare frozen attempts without invoking CLIs
  --help

Each case in the spec is run once for every selected condition and CLI. Missing
CLIs are recorded as unavailable. Credentials are read from each CLI's normal
sign-in or environment mechanism and are never copied into manifests or logs.`);
}

function parseArgs(argv) {
  const args = { cli: 'all', condition: 'all', results: '../results', dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') { args.help = true; continue; }
    if (arg === '--dry-run') { args.dryRun = true; continue; }
    if (['--spec', '--cli', '--condition', '--case-index', '--case', '--run-id', '--results', '--timeout'].includes(arg)) {
      if (!argv[i + 1]) throw new Error(`Expected a value after ${arg}`);
      args[arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = argv[++i];
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }
  if (!args.help && !args.spec) throw new Error('--spec is required');
  return args;
}

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const digestFile = async (file) => hash(await fs.readFile(file));
const now = () => new Date().toISOString();
const rel = (base, file) => path.relative(base, file).split(path.sep).join('/');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

function safeRelative(value, label) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value)) throw new Error(`${label} must be a non-empty relative path`);
  const normalized = path.normalize(value);
  if (normalized === '..' || normalized.startsWith(`..${path.sep}`)) throw new Error(`${label} may not escape its directory`);
  return normalized;
}

function configuredPath(base, value, label) {
  if (typeof value !== 'string' || !value) throw new Error(`${label} must be a non-empty path`);
  return path.resolve(base, value);
}

async function copyTree(source, destination) {
  const info = await fs.lstat(source);
  if (!info.isDirectory()) throw new Error(`Snapshot source is not a directory: ${source}`);
  await fs.mkdir(destination, { recursive: true });
  const files = [];
  async function visit(from, to, prefix) {
    for (const entry of await fs.readdir(from, { withFileTypes: true })) {
      const sourceFile = path.join(from, entry.name);
      const targetFile = path.join(to, entry.name);
      const relative = path.posix.join(prefix, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Refusing symlink in frozen snapshot: ${sourceFile}`);
      if (entry.isDirectory()) await visit(sourceFile, targetFile, relative);
      else if (entry.isFile()) {
        await fs.mkdir(path.dirname(targetFile), { recursive: true });
        await fs.copyFile(sourceFile, targetFile);
        files.push({ path: relative, sha256: await digestFile(targetFile) });
      } else throw new Error(`Unsupported snapshot entry: ${sourceFile}`);
    }
  }
  await visit(source, destination, '');
  if (!files.length) throw new Error(`Snapshot contains no files: ${source}`);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

async function copyCaseFile(source, caseBase, destination, label) {
  const sourcePath = path.resolve(caseBase, safeRelative(source, label));
  const bytes = await fs.readFile(sourcePath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
  return { sha256: hash(bytes) };
}

async function copyGitTree(repo, ref, subpath, destination) {
  const relative = safeRelative(subpath, 'skill path');
  const archive = spawnSync('git', ['-C', path.resolve(repo), 'archive', ref, relative], { encoding: 'buffer', maxBuffer: 128 * 1024 * 1024 });
  if (archive.error || archive.status !== 0) throw new Error(`Could not read skill ${ref}:${relative} from ${repo}: ${(archive.stderr || archive.error?.message || 'git archive failed').toString().trim()}`);
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'kata-skill-'));
  try {
    const unpack = spawnSync('tar', ['-xf', '-', '-C', scratch], { input: archive.stdout, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    if (unpack.error || unpack.status !== 0) throw new Error(`Could not unpack frozen skill: ${(unpack.stderr || unpack.error?.message || 'tar failed').toString().trim()}`);
    return await copyTree(path.join(scratch, relative), destination);
  } finally { await fs.rm(scratch, { recursive: true, force: true }); }
}

async function makeReadOnly(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await makeReadOnly(file); await fs.chmod(file, 0o555); }
    else if (entry.isFile()) await fs.chmod(file, 0o444);
  }
  await fs.chmod(directory, 0o555);
}

function validateSpec(spec) {
  if (!spec || typeof spec !== 'object') throw new Error('Spec must be a JSON object');
  if (typeof spec.case_index !== 'string' || !spec.case_index) throw new Error('Spec must define case_index');
  if (typeof spec.prompt !== 'string' || !spec.lys?.directory || !spec.lys?.version) throw new Error('Spec must define prompt and lys.directory/version');
  if (!(spec.skills?.['kata-0.1.0']?.directory || spec.skills?.['kata-0.1.0']?.git_repository) || !spec.skills?.['kata-candidate']?.directory) throw new Error('Both skill snapshot sources are required');
  if (spec.skills['kata-0.1.0'].git_repository && !spec.skills['kata-0.1.0'].git_ref) throw new Error('The v0.1.0 skill git_ref is required');
  for (const name of TOOLS) {
    if (spec.tools?.[name]?.settings) assertNoSecrets(spec.tools[name].settings, `tools.${name}.settings`);
    if (spec.tools?.[name]?.args) {
      if (!Array.isArray(spec.tools[name].args) || spec.tools[name].args.some((arg) => typeof arg !== 'string')) throw new Error(`tools.${name}.args must be an array of strings`);
      if (spec.tools[name].args.some((arg) => /^--?(?:(?:.*(?:key|token|secret|password|auth)|api-key))(?:=|$)/i.test(arg) || /(?:Bearer\s+[A-Za-z0-9._~+/-]+=*|(?:sk|pk)-[A-Za-z0-9_-]{16,})/i.test(arg))) throw new Error(`tools.${name}.args may not pass credentials`);
    }
  }
}

function assertNoSecrets(value, at) {
  if (Array.isArray(value)) return value.forEach((v, i) => assertNoSecrets(v, `${at}[${i}]`));
  if (!value || typeof value !== 'object') return;
  for (const [key, val] of Object.entries(value)) {
    if (SECRET_NAME.test(key)) throw new Error(`Secret-like setting key prohibited at ${at}.${key}`);
    assertNoSecrets(val, `${at}.${key}`);
  }
  if (/(?:Bearer\s+[A-Za-z0-9._~+/-]+=*|(?:sk|pk)-[A-Za-z0-9_-]{16,})/i.test(JSON.stringify(value))) throw new Error(`Secret-like value prohibited at ${at}`);
}

async function versionOf(binary) {
  const result = spawnSync(binary, ['--version'], { encoding: 'utf8', timeout: 10000, env: process.env });
  if (result.error) return { value: null, error: result.error.code || result.error.message };
  const combined = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  return { value: combined.split(/\r?\n/)[0]?.trim() || null, error: result.status === 0 ? null : `version command exited ${result.status}` };
}

function cliCommand(tool, binary, model, workspace, args = []) {
  if (tool === 'claude') {
    const cliArgs = ['-p', '--output-format', 'json', '--safe-mode', '--no-session-persistence', '--permission-mode', 'acceptEdits'];
    if (model) cliArgs.push('--model', model);
    cliArgs.push(...args, taskPromptPlaceholder);
    return { binary, args: cliArgs };
  }
  if (tool === 'codex') {
    const cliArgs = ['exec', '--ephemeral', '--skip-git-repo-check', '-C', workspace, '-s', 'workspace-write', '-o', path.join(workspace, 'output/final-response.md')];
    if (model) cliArgs.push('-m', model);
    cliArgs.push(...args, '-');
    return { binary, args: cliArgs, input: true };
  }
  const cliArgs = ['--print', '--no-session', '--no-context-files', '--no-skills', '--no-extensions', '--no-mcp'];
  if (model) cliArgs.push('--model', model);
  cliArgs.push(...args, '--', taskPromptPlaceholder);
  return { binary, args: cliArgs };
}

// Replaced with the frozen task prompt immediately before each process starts.
const taskPromptPlaceholder = '__KATA_EVAL_PROMPT__';

function redacted(text) {
  let safe = text.replace(SECRET_VALUE, '$1[REDACTED]');
  for (const [name, value] of Object.entries(process.env)) {
    if (SECRET_NAME.test(name) && value && value.length >= 6) safe = safe.split(value).join('[REDACTED]');
  }
  return safe.replace(/((?:api[_-]?key|access[_-]?token|authorization|password|secret)\s*[:=]\s*)([^\s,;"']+)/gi, '$1[REDACTED]');
}

function extractFinalResponse(tool, stdout) {
  if (tool !== 'claude') return { text: stdout, model: null };
  try {
    const event = JSON.parse(stdout);
    const model = event.model || (event.modelUsage && Object.keys(event.modelUsage)[0]) || null;
    return { text: typeof event.result === 'string' ? event.result : stdout, model };
  } catch { return { text: stdout, model: null }; }
}

function runProcess(command, { cwd, timeoutMs, prompt }) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    const child = spawn(command.binary, command.args, { cwd, env: process.env, stdio: ['pipe', 'pipe', 'pipe'] });
    const finish = (result) => { if (!settled) { settled = true; clearTimeout(timer); resolve(result); } };
    child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => finish({ exitCode: null, error: error.code || error.message, stdout, stderr }));
    child.stdin.on('error', () => {});
    child.stdin.end(prompt);
    let timedOut = false;
    child.on('close', (code, signal) => finish({ exitCode: code, signal, timeout: timedOut, stdout, stderr }));
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); setTimeout(() => child.kill('SIGKILL'), 2000).unref(); }, timeoutMs);
  });
}

async function makeAttempt({ spec, base, caseBase, resultsRoot, runId, caseItem, condition, toolId, dryRun, timeoutOverride, sharedSnapshots }) {
  const configured = spec.tools?.[toolId] || {};
  const binary = configured.path || toolId;
  const attemptId = `${caseItem.id}--${condition}--${toolId}`;
  const attemptDir = path.join(resultsRoot, runId, toolId, attemptId);
  try { await fs.access(attemptDir); throw new Error(`Refusing to overwrite existing attempt: ${attemptDir}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const inputsDir = path.join(attemptDir, 'inputs');
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'kata-eval-workspace-'));
  activeWorkspaces.add(workspace);
  const outputDir = path.join(attemptDir, 'output');
  const evaluatorDir = path.join(attemptDir, 'evaluator');
  await Promise.all([fs.mkdir(inputsDir, { recursive: true }), fs.mkdir(outputDir, { recursive: true }), fs.mkdir(evaluatorDir, { recursive: true })]);

  const brief = await copyCaseFile(caseItem.brief, caseBase, path.join(inputsDir, 'brief.md'), `${caseItem.id}.brief`);
  const answerName = `answer-key${path.extname(caseItem.answer_key) || '.md'}`;
  const answerPath = path.join(evaluatorDir, answerName);
  const answer = await copyCaseFile(caseItem.answer_key, caseBase, answerPath, `${caseItem.id}.answer_key`);
  const constraints = (caseItem.constraints || []).map((item) => `- ${item}`).join('\n') || '- None specified';
  const promptText = `${await fs.readFile(path.resolve(base, safeRelative(spec.prompt, 'prompt path')), 'utf8').then((v) => v.trimEnd())}\n\nCase brief: inputs/brief.md\nAudience question: ${caseItem.audience_question}\nConstraints:\n${constraints}\nIf a skill snapshot exists, read it from inputs/skill/. The vendored Lys runtime and assets are in inputs/lys/. Embed the supplied Lys CSS and JavaScript into the HTML artifact so it works offline. Write the actual local HTML artifact to output/slide.html and make output/decision.json match the JSON example above exactly. Do not look for or request an answer key. The task directory is isolated; do not access files outside it.\n`;
  await fs.mkdir(path.dirname(path.join(inputsDir, 'prompt.md')), { recursive: true });
  await fs.writeFile(path.join(inputsDir, 'prompt.md'), promptText);
  const prompt = { path: 'inputs/prompt.md', sha256: await digestFile(path.join(inputsDir, 'prompt.md')) };
  const lysFiles = await copyTree(path.resolve(base, spec.lys.directory), path.join(inputsDir, 'lys'));
  let skillSnapshot = null;
  if (condition !== 'plain-lys') {
    const skill = spec.skills[condition];
    const skillFiles = skill.git_repository
      ? await copyGitTree(path.resolve(base, skill.git_repository), skill.git_ref, skill.subpath || 'skills/kata', path.join(inputsDir, 'skill'))
      : await copyTree(path.resolve(base, skill.directory), path.join(inputsDir, 'skill'));
    const revisionCommand = skill.directory ? spawnSync('git', ['-C', path.resolve(base, skill.directory), 'rev-parse', 'HEAD'], { encoding: 'utf8' }) : null;
    const skillRevision = skill.revision || skill.git_ref || (revisionCommand?.status === 0 ? revisionCommand.stdout.trim() : 'unversioned');
    skillSnapshot = { revision: skillRevision, directory: 'inputs/skill', files: skillFiles.map((f) => ({ path: `inputs/skill/${f.path}`, sha256: f.sha256 })) };
  }

  // The authoring process sees only workspace, with frozen, read-only inputs and an output folder.
  await fs.mkdir(path.join(workspace, 'inputs'), { recursive: true });
  await fs.mkdir(path.join(workspace, 'output'), { recursive: true });
  await fs.cp(path.join(inputsDir, 'brief.md'), path.join(workspace, 'inputs', 'brief.md'), { recursive: true });
  await fs.cp(path.join(inputsDir, 'prompt.md'), path.join(workspace, 'inputs', 'prompt.md'), { recursive: true });
  await fs.cp(path.join(inputsDir, 'lys'), path.join(workspace, 'inputs', 'lys'), { recursive: true });
  if (condition !== 'plain-lys') await fs.cp(path.join(inputsDir, 'skill'), path.join(workspace, 'inputs', 'skill'), { recursive: true });
  await makeReadOnly(path.join(workspace, 'inputs'));
  const taskPrompt = await fs.readFile(path.join(workspace, 'inputs/prompt.md'), 'utf8');
  const command = cliCommand(toolId, binary, configured.model, workspace, configured.args || []);
  command.args = command.args.map((arg) => arg === taskPromptPlaceholder ? taskPrompt : arg);
  const manifest = {
    protocol: 'kata-eval/v1', run_id: runId,
    case: { id: caseItem.id, revision: caseItem.revision, brief: { path: 'inputs/brief.md', sha256: brief.sha256 }, answer_key: { path: `evaluator/${answerName}`, sha256: answer.sha256 } },
    task: { audience_question: caseItem.audience_question, constraints: caseItem.constraints || [] },
    condition,
    tool: { id: toolId, requested_version: configured.version ?? null, model: configured.model ?? null, settings: { ...(configured.settings || {}), cli_args: command.args.map((arg) => arg === taskPrompt ? '<frozen prompt>' : arg), runner_adapter: { id: 'kata-eval-runner/v1', sha256: hash(await fs.readFile(new URL(import.meta.url))) } } },
    prompt: { path: 'inputs/prompt.md', sha256: prompt.sha256 },
    skill_snapshot: skillSnapshot,
    lys_snapshot: { version: spec.lys.version, directory: 'inputs/lys', files: lysFiles.map((f) => ({ path: `inputs/lys/${f.path}`, sha256: f.sha256 })) },
    output_dir: 'output'
  };
  const manifestPath = path.join(attemptDir, 'manifest.json');
  await fs.writeFile(manifestPath, json(manifest));

  const frozenInputs = [
    { path: 'inputs/brief.md', sha256: brief.sha256 }, { path: 'inputs/prompt.md', sha256: prompt.sha256 },
    ...lysFiles.map((f) => ({ path: `inputs/lys/${f.path}`, sha256: f.sha256 })),
    ...(skillSnapshot?.files || []), { path: `evaluator/${answerName}`, sha256: answer.sha256 }
  ];
  const shared = JSON.stringify({ brief: brief.sha256, answer: answer.sha256, prompt: prompt.sha256, lys: lysFiles.map((f) => [f.path, f.sha256]) });
  if (sharedSnapshots.has(caseItem.id) && sharedSnapshots.get(caseItem.id) !== shared) throw new Error(`Frozen brief, prompt, or Lys inputs changed between attempts for ${caseItem.id}`);
  sharedSnapshots.set(caseItem.id, shared);
  const conditionKey = `${caseItem.id}:${condition}`;
  const skillDigest = JSON.stringify(skillSnapshot?.files || []);
  if (sharedSnapshots.has(conditionKey) && sharedSnapshots.get(conditionKey) !== skillDigest) throw new Error(`Frozen skill snapshot changed between CLI attempts for ${conditionKey}`);
  sharedSnapshots.set(conditionKey, skillDigest);
  const result = { protocol: 'kata-eval/v1', run_id: runId, manifest: { path: 'manifest.json', sha256: await digestFile(manifestPath) }, status: 'failed', started_at: null, ended_at: null,
    tool: { id: toolId, observed_version: null, model: configured.model ?? null, settings: manifest.tool.settings, exit_code: null }, frozen_inputs: frozenInputs,
    artifacts: { decision: null, lys_html: null, final_response: null, log: null }, failure: null };
  const resultPath = path.join(attemptDir, 'result.json');
  if (dryRun) {
    result.status = 'unavailable'; result.failure = { reason: 'dry-run: CLI was not invoked' };
    await fs.writeFile(resultPath, json(result));
    return { attemptDir, status: result.status, reason: result.failure.reason };
  }

  result.started_at = now();
  const version = await versionOf(binary);
  result.tool.observed_version = version.value;
  if (!version.value) {
    result.status = 'unavailable'; result.failure = { reason: `CLI unavailable: ${version.error || 'version was not reported'}` };
    result.ended_at = now();
    await fs.writeFile(resultPath, json(result));
    return { attemptDir, status: result.status, reason: result.failure.reason };
  }

  const timeoutMs = (timeoutOverride || configured.timeout_seconds || spec.timeout_seconds || 300) * 1000;
  const proc = await runProcess(command, { cwd: workspace, timeoutMs, prompt: command.input ? taskPrompt : undefined });
  result.tool.exit_code = proc.exitCode;
  const extracted = extractFinalResponse(toolId, proc.stdout || '');
  if (extracted.model) result.tool.model = extracted.model;
  const responsePath = path.join(outputDir, 'final-response.md');
  const logPath = path.join(outputDir, 'tool.log');
  let responseText = extracted.text || '';
  try { responseText = await fs.readFile(path.join(workspace, 'output/final-response.md'), 'utf8'); } catch {}
  await fs.writeFile(responsePath, redacted(responseText), 'utf8');
  await fs.writeFile(logPath, redacted([proc.stdout ? `--- stdout ---\n${proc.stdout}` : '', proc.stderr ? `--- stderr ---\n${proc.stderr}` : ''].filter(Boolean).join('\n')), 'utf8');
  await fs.cp(path.join(workspace, 'output'), outputDir, { recursive: true, force: true, errorOnExist: false });
  // Restore runner-owned response/log after copying generated files.
  await fs.writeFile(responsePath, redacted(responseText), 'utf8');
  await fs.writeFile(logPath, redacted([proc.stdout ? `--- stdout ---\n${proc.stdout}` : '', proc.stderr ? `--- stderr ---\n${proc.stderr}` : ''].filter(Boolean).join('\n')), 'utf8');
  for (const file of [path.join(outputDir, 'slide.html'), path.join(outputDir, 'decision.json')]) {
    try { const content = await fs.readFile(file, 'utf8'); await fs.writeFile(file, redacted(content), 'utf8'); } catch {}
  }

  const slidePath = path.join(outputDir, 'slide.html');
  const decisionPath = path.join(outputDir, 'decision.json');
  const missing = [];
  for (const file of [slidePath, decisionPath]) {
    try { if ((await fs.stat(file)).size === 0) missing.push(path.basename(file)); }
    catch { missing.push(path.basename(file)); }
  }
  if (!proc.exitCode && !proc.error && !proc.timeout && !missing.length) {
    try { validateDecision(JSON.parse(await fs.readFile(decisionPath, 'utf8'))); }
    catch (error) { missing.push(`valid decision.json (${error.message})`); }
  }
  if (proc.timeout) result.failure = { reason: `timed out after ${timeoutMs / 1000} seconds` };
  else if (proc.error) result.failure = { reason: `could not start CLI: ${proc.error}` };
  else if (proc.exitCode !== 0) {
    const combined = `${proc.stdout || ''}\n${proc.stderr || ''}`;
    const category = /auth(?:entication)?|unauthori[sz]ed|not logged in|sign[ -]?in|invalid api key|login required|missing credentials|api key.{0,20}(?:missing|invalid|not)/i.test(combined) ? 'authentication error' : 'CLI failure';
    result.failure = { reason: `${category}: exited with status ${proc.exitCode}${proc.signal ? ` (${proc.signal})` : ''}` };
  }
  else if (missing.length) result.failure = { reason: `missing or invalid required deliverable(s): ${missing.join(', ')}` };
  result.status = result.failure ? 'failed' : 'succeeded';
  result.ended_at = now();
  const artifact = async (file) => {
    try { return { path: rel(attemptDir, file), sha256: await digestFile(file) }; } catch { return null; }
  };
  result.artifacts = { decision: await artifact(decisionPath), lys_html: await artifact(slidePath), final_response: await artifact(responsePath), log: await artifact(logPath) };
  // Keep response and log digests, but never keep secret-like authentication text.
  await fs.writeFile(resultPath, json(result));
  return { attemptDir, status: result.status, reason: result.failure?.reason || null };
}

function validateDecision(value) {
  const required = ['audience_question', 'form', 'fit_rationale', 'tradeoff', 'caveats'];
  if (value?.protocol !== 'kata-eval-decision/v1') throw new Error('wrong protocol');
  const allowed = new Set(['protocol', ...required]);
  for (const key of Object.keys(value || {})) if (!allowed.has(key)) throw new Error(`unexpected ${key}`);
  for (const key of required) if (!(key in value)) throw new Error(`missing ${key}`);
  for (const key of ['audience_question', 'form', 'fit_rationale', 'tradeoff']) if (typeof value[key] !== 'string' || !value[key].trim()) throw new Error(`${key} must be non-empty text`);
  if (!Array.isArray(value.caveats) || value.caveats.some((entry) => typeof entry !== 'string')) throw new Error('caveats must be an array of strings');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { usage(); return; }
  const specPath = path.resolve(args.spec);
  const base = path.dirname(specPath);
  const spec = JSON.parse(await fs.readFile(specPath, 'utf8'));
  validateSpec(spec);
  const caseIndexPath = args.caseIndex ? path.resolve(args.caseIndex) : configuredPath(base, spec.case_index, 'case_index');
  const caseIndex = JSON.parse(await fs.readFile(caseIndexPath, 'utf8'));
  if (caseIndex.protocol !== 'kata-eval-case-index/v1' || !Array.isArray(caseIndex.cases) || !caseIndex.cases.length) throw new Error('Case index must follow kata-eval-case-index/v1 and contain cases');
  let cases = caseIndex.cases;
  if (args.case) {
    cases = cases.filter((item) => item.id === args.case);
    if (!cases.length) throw new Error(`Case not found in index: ${args.case}`);
  }
  for (const [i, item] of cases.entries()) for (const field of ['id', 'revision', 'brief', 'answer_key', 'audience_question']) {
    if (typeof item[field] !== 'string' || !item[field]) throw new Error(`Case index entry ${i} is missing ${field}`);
  }
  const caseBase = path.dirname(caseIndexPath);
  const selectedTools = args.cli === 'all' ? TOOLS.filter((id) => spec.tools?.[id]?.enabled !== false) : [args.cli];
  const selectedConditions = args.condition === 'all' ? CONDITIONS : [args.condition];
  if (selectedTools.some((id) => !TOOLS.includes(id))) throw new Error(`Unknown CLI: ${args.cli}`);
  if (selectedConditions.some((id) => !CONDITIONS.includes(id))) throw new Error(`Unknown condition: ${args.condition}`);
  const runId = args.runId || `${new Date().toISOString().replace(/[-:.]/g, '').replace('Z', 'Z')}-${randomUUID().slice(0, 8)}`;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(runId)) throw new Error('run-id must be a safe path segment (letters, numbers, dot, underscore, dash)');
  for (const item of cases) if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(item.id)) throw new Error(`Unsafe case id: ${item.id}`);
  const resultsRoot = path.resolve(base, args.results);
  const outcomes = [];
  const sharedSnapshots = new Map();
  try {
    for (const caseItem of cases) for (const condition of selectedConditions) {
      const rows = await Promise.all(selectedTools.map(async (toolId) => {
        const outcome = await makeAttempt({ spec, base, caseBase, resultsRoot, runId, caseItem, condition, toolId, dryRun: args.dryRun, timeoutOverride: args.timeout, sharedSnapshots });
        return { case: caseItem.id, condition, cli: toolId, ...outcome };
      }));
      for (const row of rows) {
        outcomes.push(row);
        console.log(`${row.status.padEnd(11)} ${row.case} ${row.condition} ${row.cli}${row.reason ? `: ${row.reason}` : ''}`);
      }
    }
  } finally {
    await Promise.allSettled([...activeWorkspaces].map((workspace) => fs.rm(workspace, { recursive: true, force: true })));
  }
  const summary = { run_id: runId, attempts: outcomes.length, succeeded: outcomes.filter((x) => x.status === 'succeeded').length, failed: outcomes.filter((x) => x.status === 'failed').length, unavailable: outcomes.filter((x) => x.status === 'unavailable').length };
  console.log(json(summary).trim());
}

main().catch(async (error) => {
  await Promise.allSettled([...activeWorkspaces].map((workspace) => fs.rm(workspace, { recursive: true, force: true })));
  console.error(`runner: ${error.message}`);
  process.exitCode = 1;
});
