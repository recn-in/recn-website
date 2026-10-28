export interface ReleaseAsset { name: string; browser_download_url: string; size: number }

export interface GitHubRelease {
  tag_name: string;
  body: string | null;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  assets: ReleaseAsset[];
}

export const RELEASES_API = 'https://api.github.com/repos/recn-in/recn-releases/releases';
// One regex per product family, anchored on its own tag prefix, so Rec's
// latest never picks a Work or Node release and the other way round.
export const NIGHTLY_TAG = /^v\d+\.\d+\.\d+-beta-nightly\.(\d+)$/;
export const MOBILE_TAG = /^mobile-\d+\.\d+\.\d+-(\d+)$/;
export const WORK_NIGHTLY_TAG = /^work-v\d+\.\d+\.\d+-beta-nightly\.(\d+)$/;
export const WORK_MOBILE_TAG = /^work-mobile-\d+\.\d+\.\d+-(\d+)$/;
export const NODE_NIGHTLY_TAG = /^node-v\d+\.\d+\.\d+-beta-nightly\.(\d+)$/;

// Release bodies carry one change per `- ` line, under `## What changed` when
// the body has other sections. Older desktop bodies are raw commit subjects:
// drop the tooling ones, then the `scope:` prefix and the trailing `(sha)`.
export const changes = (body: string | null): string[] => (body ?? '')
  .split(/^##\s+/m)
  .filter((section, index, all) => all.length === 1 || /^What changed/i.test(section))
  .join('\n')
  .split('\n')
  .filter((line) => /^\s*-\s+/.test(line))
  .map((line) => line.replace(/^\s*-\s+/, '').replace(/\s*\([0-9a-f]{7,}\)\s*$/, '').trim())
  .filter((line) => !/^(ci|docs|chore|test|refactor|build|style|progress)(\([^)]*\))?:/i.test(line))
  .map((line) => line.replace(/^[a-z_]+(\([^)]*\))?:\s*/i, ''))
  .filter(Boolean)
  .map((line) => line.charAt(0).toUpperCase() + line.slice(1));

const FAMILIES = [
  { family: 'Desktop', tag: NIGHTLY_TAG, word: 'Nightly' },
  { family: 'Mobile', tag: MOBILE_TAG, word: 'Build' },
  { family: 'Work desktop', tag: WORK_NIGHTLY_TAG, word: 'Nightly' },
  { family: 'Work mobile', tag: WORK_MOBILE_TAG, word: 'Build' },
  { family: 'Node', tag: NODE_NIGHTLY_TAG, word: 'Nightly' },
] as const;
type Family = (typeof FAMILIES)[number]['family'];

export interface DayEntry { family: Family; label: string; lines: string[] }
export interface Day { date: string; entries: DayEntry[] }

const span = (word: string, builds: number[]) =>
  builds.length > 1 ? `${word} ${builds[0]}–${builds[builds.length - 1]}` : `${word} ${builds[0]}`;

/** Release history by day, newest first: each change once, under the build that first carried it. */
export const history = (all: GitHubRelease[]): Day[] => {
  const seen = new Map<Family, Set<string>>(FAMILIES.map(({ family }) => [family, new Set()]));
  const days = new Map<string, Map<Family, { builds: number[]; lines: string[] }>>();
  const dated = all
    .filter((release) => !release.draft && release.published_at)
    .sort((a, b) => a.published_at!.localeCompare(b.published_at!));
  let baseline = true;

  for (const release of dated) {
    const found = FAMILIES.map((f) => ({ f, build: f.tag.exec(release.tag_name) })).find((m) => m.build);
    if (!found) continue;
    const { f, build } = found;
    const fresh = changes(release.body).filter((line) => !seen.get(f.family)!.has(line));
    fresh.forEach((line) => seen.get(f.family)!.add(line));
    // ponytail: the oldest surviving Rec nightly's body is everything since the
    // July beta, undated, so it only seeds `seen`. Backfill by hand if wanted.
    if (f.family === 'Desktop' && baseline) { baseline = false; continue; }
    if (fresh.length === 0) continue;

    const date = release.published_at!.slice(0, 10);
    if (!days.has(date)) days.set(date, new Map());
    const day = days.get(date)!;
    if (!day.has(f.family)) day.set(f.family, { builds: [], lines: [] });
    const entry = day.get(f.family)!;
    entry.builds.push(Number(build![1]));
    entry.lines.unshift(...fresh);
  }

  return [...days.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, day]) => ({
      date,
      entries: FAMILIES.filter((f) => day.has(f.family)).map((f) => ({
        family: f.family,
        label: span(f.word, day.get(f.family)!.builds),
        lines: day.get(f.family)!.lines,
      })),
    }));
};
