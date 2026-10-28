// The family is RECN. The apps are Rec and Work (never "RECN Rec" in copy);
// the server is RECN Node.
// `accent` is the colour from each product's icon.
export const PRODUCTS = [
  { id: 'rec', name: 'Rec', accent: '#E5494D', kind: 'Audio · musicians', line: 'Takes, sessions, overdubs and loops, with notes beside the sound.', platforms: 'macOS · Windows · iPhone · iPad · Android' },
  { id: 'work', name: 'Work', accent: '#E8942A', kind: 'Notes · drawings', line: 'Notes, drawings and projects.', platforms: 'macOS · Windows · iPhone · iPad · Android' },
  { id: 'node', name: 'RECN Node', accent: '#1F9A62', kind: 'Server · always on', line: 'An always-on server that keeps every library in sync.', platforms: 'macOS · Windows · Linux · NAS' },
] as const;

export type ProductId = (typeof PRODUCTS)[number]['id'];
