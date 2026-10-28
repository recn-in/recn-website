// The family is RECN. The apps are Rec and Work (never "RECN Rec" in copy);
// the server is RECN Node.
// `accent` is the colour from each product's icon.
export const PRODUCTS = [
  { id: 'rec', name: 'Rec', accent: '#E5494D', kind: 'Audio · musicians', line: 'The audio-first app for musicians: takes, sessions, overdubs and loops, with notes beside the sound.', platforms: 'macOS · Windows · iPhone · iPad · Android' },
  { id: 'work', name: 'Work', accent: '#E8942A', kind: 'Notes · drawings', line: 'Notes, drawings and projects for people who think on paper.', platforms: 'macOS · Windows · iPhone · iPad · Android' },
  { id: 'node', name: 'RECN Node', accent: '#1F9A62', kind: 'Server · always on', line: 'The always-on server for a household or studio. One install keeps every library in sync and reachable.', platforms: 'macOS · Windows · Linux · NAS' },
] as const;

export type ProductId = (typeof PRODUCTS)[number]['id'];
