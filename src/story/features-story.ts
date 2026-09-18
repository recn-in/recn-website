// Features: one act per chapter, looked up by the chapter's `data-act` (a
// feature's slug, or `set-…` for a set's opening), so the page's order is the
// only order there is.
import { Act, band, between, mix, ramp, turn, type XY } from './kit';
import { pairing, record, replicas } from './flat-acts';
import { clipEditing, exportSession, loopPunchMarkers, quickRecord, sessions, takes } from './make-acts';
import { annotations, drawing, libraryViews, notes, projects, search, transcription } from './library-acts';
import { desktopApp, ipad, privateByDefault, updates } from './app-acts';
import type { Build } from './stage';

const VERDICTS = [
  'STRAIGHT TO DISK · NOTHING YOU PLAY IS THROWN AWAY',
  'THE WORDS SIT BESIDE THE SOUND · SO IT CAN BE FOUND AGAIN',
  'EVERY DEVICE HOLDS THE WHOLE LIBRARY · NOBODY IN THE MIDDLE',
];

/**
 * The whole idea in one picture: a recording is its sound (record), the words
 * and context beside it (reckon), and a whole copy on every device (reconcile).
 * The intro builds it; each set's opening chapter comes back to it with its
 * own third lit (`focus`) and the rest dimmed.
 */
const overview = (focus?: 0 | 1 | 2) => () => {
  const act = new Act();
  const frame = act.rect(0, 0.22, 2.04, 1.0, { tone: 'dim' });
  act.label('ONE RECORDING', -1.02, 0.79, 'left', 'ink');
  const soundTag = act.label('RECORD · THE SOUND', -0.92, 0.67, 'left');
  const sound = act.wave(0, 0.5, 1.84, 92, 0.12);
  const head = act.seg(0, -0.14, 0, 0.14, { tone: 'accent' });
  const dashes: number[] = [];
  for (let x = -0.92, i = 0; x < 0.84; i += 1) {
    const w = 0.05 + 0.09 * Math.abs(Math.sin(i * 2.7));
    dashes.push(x, 0.22, 0, x + w, 0.22, 0);
    x += w + 0.035;
  }
  const wordsTag = act.label('RECKON · THE WORDS, TRANSCRIBED ON THE DEVICE', -0.92, 0.29, 'left');
  const words = act.segs(dashes);
  const scan = act.seg(-0.06, 0.22, 0.06, 0.22, { tone: 'accent' });
  const contextTag = act.label('AND THE CONTEXT · A NOTE, A MARKER, A PROJECT', -0.92, 0.1, 'left');
  const note = act.rect(-0.5, -0.08, 0.84, 0.2);
  const noteLines = act.segs([-0.86, -0.04, 0, -0.3, -0.04, 0, -0.86, -0.11, 0, -0.5, -0.11, 0], { tone: 'dim' });
  const pin = act.poly([[0.34, 0.66], [0.34, 0.36]], { tone: 'accent' });
  const tether = act.poly([[0.34, 0.36], [0.34, 0.02]], { tone: 'accent', dashed: true });
  const comment = act.rect(0.52, -0.08, 0.62, 0.2, { tone: 'accent' });
  const names = ['MAC', 'WINDOWS', 'IPHONE', 'IPAD', 'ANDROID'];
  const spots: XY[] = names.map((_, i) => [-0.84 + i * 0.42, -0.52]);
  const devices = spots.map(([x, y], i) => ({ box: act.rect(x, y, 0.24, 0.14), tag: act.label(names[i], x, y - 0.13) }));
  const runs = spots.map(([x, y]) => act.seg(0, -0.28, x, y + 0.07, { tone: 'dim' }));
  const copies = act.dots(5, 6, { tone: 'single' });
  const verdict = act.label(focus === undefined ? 'RECONCILE · EVERY DEVICE YOU OWN HOLDS ALL OF IT' : VERDICTS[focus], 0, -0.8, 'center', 'ink');
  const land = (i: number, k: number) => {
    const [x, y] = between([0, -0.28], [spots[i][0], spots[i][1] + 0.07], k);
    copies.put(i, k > 0 && k < 1 ? x : 9, y);
  };
  const regions = [
    { strokes: [sound, head], labels: [soundTag] },
    { strokes: [words, scan, note, noteLines, pin, tether, comment], labels: [wordsTag, contextTag] },
    { strokes: [...runs, copies, ...devices.map(({ box }) => box)], labels: devices.map(({ tag }) => tag) },
  ];

  if (focus === undefined) {
    act.play = (q, t) => {
      // The page opens part-way into this chapter, so the recording draws itself.
      const drawn = Math.max(ramp(t, 0.2, 2.4), ramp(q, 0.3, 0.4));
      frame.r = ramp(drawn, 0, 0.3);
      sound.r = ramp(drawn, 0.15, 1);
      head.at(-0.92 + 1.84 * sound.r, 0.5).a = band(sound.r, 0, 0.05, 0.95, 1);
      wordsTag.a = ramp(q, 0.3, 0.36);
      words.r = ramp(q, 0.32, 0.46);
      scan.a = 0;
      contextTag.a = ramp(q, 0.44, 0.5);
      note.r = ramp(q, 0.46, 0.56);
      noteLines.r = ramp(q, 0.52, 0.6);
      pin.r = ramp(q, 0.5, 0.56);
      tether.r = ramp(q, 0.54, 0.62);
      comment.r = ramp(q, 0.58, 0.66);
      devices.forEach(({ box, tag }, i) => {
        const k = turn(q, i, 5, 0.66, 0.84, 1.4);
        runs[i].r = ramp(q, 0.62, 0.7);
        land(i, k);
        box.tone = k >= 1 ? 'safe' : 'ink';
        tag.a = mix(0.5, 1, k);
      });
      verdict.a = ramp(q, 0.8, 0.9);
    };
    return act;
  }

  // A set's opening: the finished picture, this third alive and the rest at rest.
  regions.forEach((region, i) => {
    region.strokes.forEach((stroke) => { stroke.a = i === focus ? 1 : 0.25; });
    region.labels.forEach((label) => { label.a = i === focus ? 1 : 0.35; label.tone = i === focus ? 'ink' : 'dim'; });
  });
  devices.forEach(({ box }) => { box.tone = focus === 2 ? 'safe' : 'ink'; });
  act.play = (q, t) => {
    const drawn = ramp(q, -0.05, 0.2);
    act.strokes.forEach((stroke) => { if (stroke !== copies && stroke !== head && stroke !== scan) stroke.r = drawn; });
    const beat = (t * 0.14) % 1;
    head.at(-0.92 + 1.84 * beat, 0.5).a = focus === 0 ? 1 : 0;
    scan.at(-0.86 + 1.66 * beat, 0).a = focus === 1 ? 1 : 0;
    devices.forEach((_, i) => land(i, focus === 2 ? (t * 0.3 + i / 5) % 1 : 0));
    verdict.a = ramp(q, 0.3, 0.45);
  };
  return act;
};

export const ACTS: Record<string, () => Act> = {
  intro: overview(),
  'set-record': overview(0),
  'set-reckon': overview(1),
  'set-reconcile': overview(2),
  recording: record,
  'quick-record': quickRecord,
  sessions,
  takes,
  'clip-editing': clipEditing,
  'loop-punch-markers': loopPunchMarkers,
  export: exportSession,
  notes,
  drawing,
  annotations,
  transcription,
  search,
  projects,
  'library-views': libraryViews,
  sync: replicas,
  devices: pairing,
  ipad,
  'desktop-app': desktopApp,
  updates,
  private: privateByDefault,
};

export const build: Build = (_globe, chapters) => chapters.map((chapter) => {
  const make = ACTS[chapter.dataset.act ?? ''];
  if (!make) throw new Error(`features story: no act for "${chapter.dataset.act}"`);
  return make();
});
