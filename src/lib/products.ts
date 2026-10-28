// The family is RECN. The apps are Rec and Work (never "RECN Rec" in copy);
// the server is RECN Node.
export const PRODUCTS = [
  { id: 'rec', name: 'Rec', line: 'The audio-first app for musicians: takes, sessions, overdubs and loops, with notes beside the sound.', platforms: 'macOS · Windows · iPhone · iPad · Android' },
  { id: 'work', name: 'Work', line: 'Notes, drawings and projects for people who think on paper.', platforms: 'macOS · Windows · iPhone · iPad · Android' },
  { id: 'node', name: 'RECN Node', line: 'The always-on server for a household or studio. One install keeps every library in sync and reachable.', platforms: 'macOS · Windows · Linux · NAS' },
] as const;

export type ProductId = (typeof PRODUCTS)[number]['id'];
