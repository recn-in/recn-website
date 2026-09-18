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
export const NIGHTLY_TAG = /^v\d+\.\d+\.\d+-beta-nightly\.(\d+)$/;
export const MOBILE_TAG = /^mobile-\d+\.\d+\.\d+-(\d+)$/;

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

export interface DayEntry { family: 'Desktop' | 'Mobile'; label: string; lines: string[] }
export interface Day { date: string; entries: DayEntry[] }

const span = (word: string, builds: number[]) =>
  builds.length > 1 ? `${word} ${builds[0]}–${builds[builds.length - 1]}` : `${word} ${builds[0]}`;

/** Release history by day, newest first: each change once, under the build that first carried it. */
export const history = (all: GitHubRelease[]): Day[] => {
  const seen = { Desktop: new Set<string>(), Mobile: new Set<string>() };
  const days = new Map<string, Record<'Desktop' | 'Mobile', { builds: number[]; lines: string[] }>>();
  const dated = all
    .filter((release) => !release.draft && release.published_at)
    .sort((a, b) => a.published_at!.localeCompare(b.published_at!));
  let baseline = true;

  for (const release of dated) {
    const nightly = NIGHTLY_TAG.exec(release.tag_name);
    const build = nightly ?? MOBILE_TAG.exec(release.tag_name);
    if (!build) continue;
    const family = nightly ? 'Desktop' : 'Mobile';
    const fresh = changes(release.body).filter((line) => !seen[family].has(line));
    fresh.forEach((line) => seen[family].add(line));
    // ponytail: the oldest surviving nightly's body is everything since the
    // July beta, undated, so it only seeds `seen`. Backfill by hand if wanted.
    if (nightly && baseline) { baseline = false; continue; }
    if (fresh.length === 0) continue;

    const date = release.published_at!.slice(0, 10);
    if (!days.has(date)) {
      days.set(date, { Desktop: { builds: [], lines: [] }, Mobile: { builds: [], lines: [] } });
    }
    const entry = days.get(date)![family];
    entry.builds.push(Number(build[1]));
    entry.lines.unshift(...fresh);
  }

  return [...days.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, families]) => ({
      date,
      entries: (['Desktop', 'Mobile'] as const)
        .filter((family) => families[family].lines.length > 0)
        .map((family) => ({
          family,
          label: span(family === 'Desktop' ? 'Nightly' : 'Build', families[family].builds),
          lines: families[family].lines,
        })),
    }));
};
