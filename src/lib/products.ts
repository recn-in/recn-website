// The family is RECN. The apps are Rec and Work (never "RECN Rec" in copy);
// the server is RECN Node. Every claim here is on main today; what isn't
// finished says so in the copy.
export const PRODUCTS = [
  {
    id: 'rec', name: 'Rec', who: 'For musicians',
    line: 'Record takes, build sessions, share a project with your band. It all stays on your own devices.',
    points: [
      ['Press record', 'Audio goes straight to disk. There is no project to set up first. On the Mac and on Windows you can record from the menu bar without opening a window.'],
      ['Sessions', 'Play along to what you have and each pass lands as a new clip. Loop a section and every lap is a take. Punch in over a range with pre-roll.'],
      ['Edit and mix', 'Trim, split, move, crossfade. Volume, pan, mute, solo. Markers for the places you keep going back to.'],
      ['Get it out', 'Export a mixdown or stems as WAV or AAC. Or drag a clip straight into your DAW.'],
      ['Words', 'Transcription runs on the device. The audio never leaves it. Search a rehearsal for the thing someone said.'],
      ['Your phone is part of it', 'Record on the phone, edit on the laptop. The session is the same on both, and it syncs without a server.'],
    ],
    together: 'Share a project with the people you play with. They join from a code and come in as a viewer or an editor. You see each other\'s cursors. On the same wifi it works with no internet. Across the internet it goes through an encrypted relay that can\'t read anything. That last part is still in beta.',
    platforms: 'macOS · Windows · iPhone · iPad · Android',
  },
  {
    id: 'work', name: 'Work', who: 'For the thinking around the work',
    line: 'Notes, drawings and projects that live on your devices, and that you can open up to other people and to agents.',
    points: [
      ['Notes', 'A block editor. Headings, lists, tables, code. Paste Markdown and it becomes a note.'],
      ['Drawings', 'Shapes, connectors, labels, and Mermaid diagrams you can edit. A drawing sits inside a note or on its own.'],
      ['Projects', 'Folders that hold notes and drawings and sit inside each other. Three levels deep.'],
      ['Find it', 'One search box across everything. A quick switcher to jump anywhere. Shortcuts you can rebind.'],
      ['Together', 'Share a project and write in the same note at the same time. Edits merge character by character, so nobody loses a sentence.'],
      ['Agents', 'Through RECN Node, Claude Code and Codex can list your projects and add notes and drawings today. Reading and editing what\'s already there is next.'],
    ],
    together: 'Work and Rec are separate apps with separate libraries, built on the same engine. Same sync, same sharing, same rule: your data is on your hardware.',
    platforms: 'macOS · Windows · iPhone and Android soon',
  },
  {
    id: 'node', name: 'RECN Node', who: 'Your own server',
    line: 'A copy of your library that is always on, on a machine you own. Nothing in RECN needs it. Everything in RECN gets better with it.',
    points: [
      ['Always awake', 'Runs as a service on a Mac, a PC, a Linux box or a NAS. Close every laptop and your library is still reachable.'],
      ['A full copy', 'Every recording, note and drawing, on its own disk, so a device that was off catches up from it.'],
      ['Backups', 'A snapshot a day. Restore from the dashboard.'],
      ['A dashboard', 'Devices, libraries, transfers, who a project is shared with. Only your machine can open it.'],
      ['Agents', 'It speaks MCP. Point Claude Code or Codex at it and they can work in your library.'],
      ['Not a backend', 'The apps never depend on it. A Node is one more device, one that never sleeps.'],
    ],
    together: 'This is the piece that makes local-first real. Your data stays local, on hardware you own, and you decide what you keep, who you share with and what gets backed up.',
    platforms: 'macOS · Windows · Linux · NAS · Docker',
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]['id'];

// Bumped whenever an icon file in public/ changes: the file names stay, so the
// query string is what gets past the browser and Pages caches.
export const ICON_VERSION = '4';
