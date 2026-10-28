import assert from 'node:assert/strict';
import test from 'node:test';
import { changes, MOBILE_TAG as t_MOBILE } from './releases.ts';

test('keeps what a person would read, in order', () => {
  const body = [
    '## What changed',
    '',
    'Since [`v0.0.1-beta`](../../releases/tag/v0.0.1-beta):',
    '',
    '- ci: publish a Homebrew cask for each versioned desktop beta (e3b01003)',
    '- The mic indicator turns off once audio goes idle (4c8eec75)',
    '- docs(library-views): the view switcher (a3c63abb)',
    '- desktop(browse): the folded switcher\'s bar sits under its glyph (c462fd5e)',
    '- fix(lattice): scope-vector review fixes (7af1c11c)',
    '- Reset RECN: unpair every device, keep the library',
    '',
    '## Install',
    '',
    '- **macOS:** `RECN-Rec-0.0.1-beta-nightly.204.dmg` — signed + notarized',
  ].join('\n');
  assert.deepEqual(changes(body), [
    'The mic indicator turns off once audio goes idle',
    'The folded switcher\'s bar sits under its glyph',
    'Scope-vector review fixes',
    'Reset RECN: unpair every device, keep the library',
  ]);
});

test('an empty or missing body has no changes', () => {
  assert.deepEqual(changes(null), []);
  assert.deepEqual(changes('Version: 0.0.1+175\n'), []);
});

const release = (tag_name: string, published_at: string | null, lines: string[]) => ({
  tag_name,
  published_at,
  body: lines.map((line) => `- ${line}`).join('\n'),
  html_url: '',
  draft: published_at === null,
  assets: [],
});

test('history shows each change once, by day, newest first', async () => {
  const { history } = await import('./releases.ts');
  const days = history([
    // GitHub answers newest first; desktop bodies are cumulative.
    release('v0.0.1-beta-nightly.206', null, ['Draft']),
    release('v0.0.1-beta-nightly.204', '2026-09-18T15:00:00Z', ['C', 'B', 'ci: noise', 'A', 'Old']),
    release('mobile-0.0.1-175', '2026-09-18T12:00:00Z', ['Mic light turns off']),
    release('v0.0.1-beta-nightly.203', '2026-09-18T09:00:00Z', ['B', 'A', 'Old']),
    release('v0.0.1-beta-nightly.202', '2026-09-17T20:00:00Z', ['A', 'Old']),
    release('v0.0.1-beta-nightly.201', '2026-09-17T08:00:00Z', ['Old']),
    release('dsp-models', '2026-07-19T00:00:00Z', ['Not a build']),
  ]);
  assert.deepEqual(days, [
    {
      date: '2026-09-18',
      entries: [
        { family: 'Desktop', label: 'Nightly 203–204', lines: ['C', 'B'] },
        { family: 'Mobile', label: 'Build 175', lines: ['Mic light turns off'] },
      ],
    },
    { date: '2026-09-17', entries: [{ family: 'Desktop', label: 'Nightly 202', lines: ['A'] }] },
  ]);
});

test('Rec, Work and Node tags never match each other', async () => {
  const t = await import('./releases.ts');
  const tags = {
    rec: 'v0.1.0-beta-nightly.3', mobile: 'mobile-0.1.0-12', work: 'work-v0.1.0-beta-nightly.3',
    workMobile: 'work-mobile-0.1.0-12', node: 'node-v0.1.0-beta-nightly.2',
  };
  const re = { rec: t.NIGHTLY_TAG, mobile: t.MOBILE_TAG, work: t.WORK_NIGHTLY_TAG, workMobile: t.WORK_MOBILE_TAG, node: t.NODE_NIGHTLY_TAG };
  for (const [family, tag] of Object.entries(tags)) {
    for (const [name, regex] of Object.entries(re)) assert.equal(regex.test(tag), name === family, `${name} vs ${tag}`);
  }
});

test('history keeps Work and Node apart from Rec', async () => {
  const { history } = await import('./releases.ts');
  const days = history([
    release('node-v0.1.0-beta-nightly.2', '2026-10-27T10:00:00Z', ['Pairs by QR']),
    release('work-mobile-0.1.0-4', '2026-10-27T09:00:00Z', ['Same line']),
    release('work-v0.1.0-beta-nightly.1', '2026-10-27T08:00:00Z', ['Same line']),
    release('v0.0.1-beta-nightly.5', '2026-10-27T07:00:00Z', ['Same line']),
    release('v0.0.1-beta-nightly.4', '2026-10-26T07:00:00Z', ['Old']),
  ]);
  assert.deepEqual(days[0].entries.map((e) => [e.family, e.label]), [
    ['Desktop', 'Nightly 5'], ['Work desktop', 'Nightly 1'], ['Work mobile', 'Build 4'], ['Node', 'Nightly 2'],
  ]);
});

test('versioned releases lead each product; nightlies and mobile builds sit under them', async () => {
  const { byProduct, buildName } = await import('./releases.ts');
  assert.equal(buildName('work-v0.0.2-beta-nightly.383'), '0.0.2 beta · nightly 383');
  assert.equal(buildName('node-v0.1.0'), '0.1.0');
  assert.ok(t_MOBILE.test('rec-mobile-0.1.0-12'));
  const logs = byProduct([
    release('v0.0.2-beta', '2026-10-28T12:00:00Z', ['Two']),
    release('rec-mobile-0.0.2-301', '2026-10-28T11:00:00Z', ['Phone']),
    release('node-v0.1.0', '2026-10-28T10:00:00Z', ['Service']),
    release('v0.0.2-beta-nightly.383', '2026-10-28T09:00:00Z', ['Two', 'One']),
    release('v0.0.1-beta-nightly.382', '2026-10-27T09:00:00Z', ['One']),
  ]);
  assert.deepEqual(logs.map((log) => [log.id, log.versions.map((v) => v.name), log.builds.map((d) => d.entries.map((e) => e.label))]), [
    ['rec', ['0.0.2 beta'], [['Nightly 383', 'Build 301']]],
    ['work', [], []],
    ['node', ['0.1.0'], []],
  ]);
});
