// Features: one act per feature, looked up by the chapter's `data-act` (the
// feature's slug), so the page's order is the only order there is.
import { Act, band, between, mix, ramp, turn, type XY } from './kit';
import { pairing, record, replicas } from './flat-acts';
import { clipEditing, exportSession, loopPunchMarkers, quickRecord, sessions, takes } from './make-acts';
import { annotations, drawing, libraryViews, notes, projects, search, transcription } from './library-acts';
import { desktopApp, ipad, privateByDefault, updates } from './app-acts';
import type { Build } from './stage';

/** The whole idea: the sound, the words and the context are one thing, on every device. */
const intro = () => {
  const act = new Act();
  const frame = act.rect(0, 0.22, 2.04, 1.0, { tone: 'dim' });
  act.label('ONE RECORDING', -1.02, 0.79, 'left', 'ink');
  act.label('THE SOUND', -0.92, 0.67, 'left');
  const sound = act.wave(0, 0.5, 1.84, 92, 0.12);
  const head = act.seg(0, -0.14, 0, 0.14, { tone: 'accent' });
  const dashes: number[] = [];
  for (let x = -0.92, i = 0; x < 0.84; i += 1) {
    const w = 0.05 + 0.09 * Math.abs(Math.sin(i * 2.7));
    dashes.push(x, 0.22, 0, x + w, 0.22, 0);
    x += w + 0.035;
  }
  const wordsTag = act.label('THE WORDS · TRANSCRIBED ON THE DEVICE', -0.92, 0.29, 'left');
  const words = act.segs(dashes);
  const contextTag = act.label('THE CONTEXT · A NOTE, A MARKER, A PROJECT', -0.92, 0.1, 'left');
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
  const verdict = act.label('KEPT TOGETHER · ON EVERY DEVICE YOU OWN', 0, -0.8, 'center', 'ink');
  act.play = (q, t) => {
    // The page opens part-way into this chapter, so the recording draws itself.
    const drawn = Math.max(ramp(t, 0.2, 2.4), ramp(q, 0.3, 0.4));
    frame.r = ramp(drawn, 0, 0.3);
    sound.r = ramp(drawn, 0.15, 1);
    head.at(-0.92 + 1.84 * sound.r, 0.5).a = band(sound.r, 0, 0.05, 0.95, 1);
    wordsTag.a = ramp(q, 0.3, 0.36);
    words.r = ramp(q, 0.32, 0.46);
    contextTag.a = ramp(q, 0.44, 0.5);
    note.r = ramp(q, 0.46, 0.56);
    noteLines.r = ramp(q, 0.52, 0.6);
    pin.r = ramp(q, 0.5, 0.56);
    tether.r = ramp(q, 0.54, 0.62);
    comment.r = ramp(q, 0.58, 0.66);
    devices.forEach(({ box, tag }, i) => {
      const k = turn(q, i, 5, 0.66, 0.84, 1.4);
      runs[i].r = ramp(q, 0.62, 0.7);
      const [x, y] = between([0, -0.28], [spots[i][0], spots[i][1] + 0.07], k);
      copies.put(i, k > 0 && k < 1 ? x : 9, y);
      box.tone = k >= 1 ? 'safe' : 'ink';
      tag.a = mix(0.5, 1, k);
    });
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

export const ACTS: Record<string, () => Act> = {
  intro,
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
