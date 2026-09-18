export const GROUPS = ['Capture', 'Sessions', 'Notes', 'Find', 'Sync', 'Everywhere', 'Private'] as const;

// RECN is short for three words, and they are the three things the app is for.
// Every group of features belongs to exactly one of them; the Features page
// is laid out, and jumped around, by these.
export const SETS = [
  { id: 'record', word: 'Record', promise: 'Catch it before it goes', groups: ['Capture', 'Sessions'] },
  { id: 'reckon', word: 'Reckon', promise: 'Find it again, and make sense of it', groups: ['Notes', 'Find'] },
  { id: 'reconcile', word: 'Reconcile', promise: 'Every device agrees, with nobody in the middle', groups: ['Sync', 'Everywhere', 'Private'] },
] as const satisfies readonly { id: string; word: string; promise: string; groups: readonly (typeof GROUPS)[number][] }[];

const MONTH = 30 * 24 * 60 * 60 * 1000;

/** A feature is New for its first 30 days; the site rebuilds often enough for the tag to age out by itself. */
export const isNew = (shipped: Date, now = new Date()) => now.getTime() - shipped.getTime() < MONTH;
