import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const source = readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
const jobs = Object.fromEntries([...source.matchAll(/^  ([\w-]+):\n([\s\S]*?)(?=^  [\w-]+:|$(?![\s\S]))/gm)].map(([, name, body]) => [name, body]));
test('publication uses a fresh dependency-free runner after browser checks', () => {
  assert(jobs.checks, 'browser checks must be separate from publication build');
  assert.match(jobs.build, /needs: checks/);
  assert.match(jobs.build, /runs-on: ubuntu-latest/);
  assert.match(jobs.build, /run: node scripts\/build-site\.mjs/);
  assert.doesNotMatch(jobs.build, /npm|npx|playwright|cache:/i);
  assert.match(jobs.build, /actions\/upload-pages-artifact@[a-f0-9]{40}/);
  assert.doesNotMatch(jobs.checks, /actions\/upload-pages-artifact|pages: write|id-token: write/);
});
test('all existing browser release gates remain required', () => {
  for (const command of ['npm run check', 'npm run build', 'npm run test:browser:repeat', 'npm run build:root', 'npm run build:enquiry-preview', 'npm run test:root', 'npm run test:enquiry-preview']) assert(jobs.checks?.includes(command), command);
  assert.match(jobs.checks, /chromium firefox webkit/);
  assert.match(jobs.checks, /node --test scripts\/workflow-security\.test\.mjs/);
  assert.match(jobs.deploy, /needs: build/);
  assert.match(jobs.deploy, /github.ref == 'refs\/heads\/main' && github.event_name != 'pull_request'/);
  assert.doesNotMatch(jobs.build, /if:.*always\(/);
  assert.doesNotMatch(jobs.deploy, /if:.*always\(/);
});
test('only the deployment action has Pages and OIDC authority', () => {
  assert.match(jobs.deploy, /pages: write\n\s+id-token: write/);
  assert.equal((jobs.deploy.match(/uses:/g) || []).length, 1);
  assert.match(jobs.deploy, /uses: actions\/deploy-pages@[a-f0-9]{40}/);
  assert.doesNotMatch(jobs.deploy, /run:|checkout|setup-node|contents:/);
  for (const [name, job] of Object.entries(jobs)) if (name !== 'deploy') assert.doesNotMatch(job, /pages: write|id-token: write/);
});
test('post-deployment verification is read-only and retains revision checks', () => {
  assert(jobs.verify, 'verification needs a separate runner');
  assert.match(jobs.verify, /needs: deploy/);
  assert.match(jobs.verify, /permissions:\n\s+contents: read/);
  assert.match(jobs.verify, /needs.deploy.outputs.page_url/);
  assert.match(jobs.verify, /scripts\/smoke-deployed\.mjs/);
  assert.match(jobs.verify, /scripts\/measure-deployed\.mjs/);
  for (const job of Object.values(jobs)) for (const checkout of job.matchAll(/uses: actions\/checkout@[^\n]+\n([\s\S]*?)(?=\n      -|$)/g)) assert.match(checkout[1], /persist-credentials: false/);
});

