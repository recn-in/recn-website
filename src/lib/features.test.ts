import assert from 'node:assert/strict';
import test from 'node:test';
import { GROUPS, isNew, SETS } from './features.ts';

test('a feature is New for thirty days', () => {
  const now = new Date('2026-09-18T12:00:00Z');
  assert.equal(isNew(new Date('2026-09-17T00:00:00Z'), now), true);
  assert.equal(isNew(new Date('2026-08-20T00:00:00Z'), now), true);
  assert.equal(isNew(new Date('2026-08-18T00:00:00Z'), now), false);
});

test('every group of features belongs to exactly one set, in page order', () => {
  assert.deepEqual(SETS.flatMap((set) => [...set.groups]), [...GROUPS]);
});
