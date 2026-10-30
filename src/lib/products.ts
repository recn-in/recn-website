// The family is RECN. The apps are Rec and Work (never "RECN Rec" in copy);
// the server is RECN Node.
// `verb` and `line` are what the product does; `fits` is how it joins the other two;
// `features` are the slugs in src/content/features its page lists.
export const PRODUCTS = [
  {
    id: 'rec', name: 'Rec', verb: 'For recording',
    line: 'Record takes, stack layers, loop the bit you\'re working on. It transcribes too, right on your device.',
    fits: 'Whatever you record shows up next to your Work notes, on every device you\'ve paired.',
    platforms: 'macOS · Windows · iPhone · iPad · Android',
    features: ['recording', 'sessions', 'takes', 'loop-punch-markers', 'transcription', 'quick-record'],
  },
  {
    id: 'work', name: 'Work', verb: 'For notes and drawings',
    line: 'Write notes, sketch ideas, keep it all in projects. Same library as Rec.',
    fits: 'Work and Rec use the same library, so your notes, drawings and recordings end up in the same projects, on every device.',
    platforms: 'macOS · Windows · iPhone · iPad · Android',
    features: ['notes', 'drawing', 'projects', 'search', 'library-views', 'ipad'],
  },
  {
    id: 'node', name: 'RECN Node', verb: 'For keeping it all in sync',
    line: 'Your own server, at home or in the studio. Your data stays local and fully under your control, and every device stays up to date.',
    fits: 'Rec and Work already sync device to device. Node is just the one that never sleeps, so your laptop catches up the second you open it. You don\'t need one to use RECN.',
    platforms: 'macOS · Windows · Linux · NAS',
    features: [],
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]['id'];

// Bumped whenever an icon file in public/ changes: the file names stay, so the
// query string is what gets past the browser and Pages caches.
export const ICON_VERSION = '3';
