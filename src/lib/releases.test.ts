import assert from 'node:assert/strict';
import test from 'node:test';
import { changes } from './releases.ts';

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
