export const GROUPS = ['Record', 'Sessions', 'Notes', 'Find', 'Sync', 'Everywhere', 'Private'] as const;

const MONTH = 30 * 24 * 60 * 60 * 1000;

/** A feature is New for its first 30 days; the site rebuilds often enough for the tag to age out by itself. */
export const isNew = (shipped: Date, now = new Date()) => now.getTime() - shipped.getTime() < MONTH;
