// Feature acts for what sits beside the sound and how it is found again.
import { Act, band, clamp01, mix, ramp, turn } from './kit';
import { device } from './flat-acts';

/** A note is a column of blocks, and a recording block points at the library item itself. */
export const notes = () => {
  const act = new Act();
  act.label('ONE NOTE', -1.08, 0.78, 'left', 'ink');
  const page = act.rect(-0.54, 0.06, 1.08, 1.32, { tone: 'dim' });
  const heading = act.seg(-1.0, 0.56, -0.64, 0.56);
  const text = act.segs([-1.0, 0.44, 0, -0.2, 0.44, 0, -1.0, 0.37, 0, -0.46, 0.37, 0]);
  const tick = act.rect(-0.97, 0.26, 0.06, 0.06);
  const todo = act.seg(-0.9, 0.26, -0.34, 0.26);
  const block = act.rect(-0.54, 0.06, 0.9, 0.22, { tone: 'accent' });
  const play = act.poly([[-0.94, 0.01], [-0.86, 0.06], [-0.94, 0.11]], { tone: 'accent', closed: true });
  const clip = act.wave(-0.42, 0.06, 0.62, 30, 0.07);
  const head = act.seg(0, -0.09, 0, 0.09, { tone: 'accent' });
  const blockTag = act.label('A RECORDING BLOCK', -0.54, -0.12);
  const picture = act.rect(-0.78, -0.3, 0.44, 0.2, { tone: 'dim' });
  const hills = act.poly([[-0.97, -0.36], [-0.87, -0.26], [-0.8, -0.32], [-0.62, -0.22]]);
  const tail = act.seg(-1.0, -0.5, -0.5, -0.5);
  act.label('THE LIBRARY', 0.66, 0.78, 'center', 'ink');
  const rows = [0.44, 0.16, -0.12].map((y) => act.rect(0.66, y, 0.74, 0.2, { tone: 'dim' }));
  const item = act.rect(0.66, 0.16, 0.74, 0.2, { tone: 'accent' });
  const itemWave = act.wave(0.66, 0.16, 0.62, 26, 0.06);
  const tether = act.poly([[-0.09, 0.06], [0.29, 0.16]], { tone: 'accent', dashed: true });
  const same = act.label('THE SAME ITEM · NOT A COPY OF IT', 0.66, -0.34);
  const verdict = act.label('BLOCKS STACK IN ONE COLUMN · THE RECORDING PLAYS WHERE IT SITS', 0, -0.76, 'center', 'ink');
  act.play = (q, t) => {
    page.r = ramp(q, 0.02, 0.14);
    heading.r = turn(q, 0, 6, 0.08, 0.46);
    text.r = turn(q, 1, 6, 0.08, 0.46);
    tick.r = turn(q, 2, 6, 0.08, 0.46);
    todo.r = tick.r;
    block.r = turn(q, 3, 6, 0.08, 0.46);
    play.r = block.r;
    clip.r = block.r;
    picture.r = turn(q, 4, 6, 0.08, 0.46);
    hills.r = picture.r;
    tail.r = turn(q, 5, 6, 0.08, 0.46);
    blockTag.a = ramp(q, 0.36, 0.46);
    rows.forEach((row, i) => { row.r = turn(q, i, 3, 0.44, 0.64); });
    item.a = ramp(q, 0.6, 0.68);
    itemWave.r = item.a;
    tether.r = ramp(q, 0.64, 0.76);
    same.a = ramp(q, 0.7, 0.8);
    head.at(-0.73 + 0.62 * ((t * 0.32) % 1), 0.06).a = ramp(q, 0.76, 0.86);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** A shape is an object — its points, its label, a bend that follows — merged one shape at a time. */
export const drawing = () => {
  const act = new Act();
  act.label('YOU SKETCH A STROKE', -0.68, 0.74, 'center', 'ink');
  const N = 24;
  const curve = (i: number): [number, number] => {
    const k = i / (N - 1);
    return [-1.1 + k * 0.82, 0.42 + Math.sin(k * 5.6) * 0.14 - k * 0.2];
  };
  const stroke = act.poly(Array.from({ length: N }, (_, i) => curve(i)));
  const points = act.dots(N, 5, { tone: 'accent' });
  for (let i = 0; i < N; i += 1) points.put(i, curve(i)[0], curve(i)[1]);
  const kept = act.label('KEPT AS POINTS, NOT PIXELS', -0.68, -0.08);
  act.label('A BOX, ITS LABEL, A BENDING CONNECTOR', 0.5, 0.74, 'center', 'ink');
  const top = act.rect(0.3, 0.44, 0.38, 0.18);
  const topTag = act.label('VERSE', 0.3, 0.44);
  const moving = act.rect(0.94, 0.16, 0.38, 0.18);
  const movingTag = act.label('CHORUS', 0.94, 0.16);
  const down = act.seg(0, 0, 0, -1);
  const across = act.seg(0, 0, 1, 0);
  const bend = act.circle(0.3, 0.16, 0.035, { tone: 'accent' }, 16);
  const follows = act.label('THE BEND FOLLOWS THE BOX', 0.9, -0.34, 'right');
  const ipad = device(act, 1.0, -0.52, 'IPAD', 0.26, 0.16);
  const lane = act.seg(-0.5, -0.52, 0.85, -0.52, { tone: 'dim' });
  const shapes = act.dots(3, 6, { tone: 'single' });
  const oneByOne = act.label('EACH SHAPE TRAVELS ON ITS OWN', -0.46, -0.64, 'right');
  const verdict = act.label('A DRAWING IS AN ITEM LIKE A RECORDING · IT MERGES SHAPE BY SHAPE', 0, -0.78, 'center', 'ink');
  act.play = (q) => {
    stroke.r = ramp(q, 0.04, 0.24);
    stroke.a = 1 - ramp(q, 0.26, 0.4) * 0.75;
    points.r = ramp(q, 0.26, 0.42);
    kept.a = ramp(q, 0.3, 0.42);
    top.r = ramp(q, 0.3, 0.42);
    topTag.a = top.r;
    moving.r = ramp(q, 0.34, 0.46);
    movingTag.a = moving.r;
    const y = mix(0.16, -0.16, ramp(q, 0.48, 0.68));
    moving.at(0.94, y);
    movingTag.pos.set(0.94, y, 0);
    down.at(0.3, 0.35).object.scale.y = 0.35 - y;
    down.r = ramp(q, 0.4, 0.52);
    across.at(0.3, y).object.scale.x = 0.45;
    across.r = down.r;
    bend.at(0.3, y).a = ramp(q, 0.46, 0.56);
    follows.a = ramp(q, 0.56, 0.68);
    lane.r = ramp(q, 0.66, 0.76);
    for (let i = 0; i < 3; i += 1) {
      const k = turn(q, i, 3, 0.7, 0.92, 1.3);
      shapes.put(i, k > 0 && k < 1 ? mix(-0.5, 0.85, k) : 9, -0.52);
    }
    shapes.a = band(q, 0.68, 0.74, 0.92, 0.96);
    oneByOne.a = ramp(q, 0.72, 0.82);
    ipad.box.tone = q > 0.9 ? 'safe' : 'ink';
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** A comment is stored as a time on the recording, so the playhead brings it back. */
export const annotations = () => {
  const act = new Act();
  act.label('TAKE 03', -1.02, 0.72, 'left');
  const rail = act.seg(-1.02, 0.56, 1.02, 0.56, { tone: 'dim' });
  const sound = act.wave(0, 0.28, 2.04, 96, 0.16, { tone: 'dim' });
  const AT = [-0.54, 0.08, 0.62];
  const ticks = AT.map((x) => act.seg(x, 0.56, x, 0.12, { tone: 'accent' }));
  const bubbles = AT.map((x) => act.rect(x, 0.3, 0.38, 0.13));
  const said = AT.map((x) => act.seg(x - 0.15, 0.28, x + 0.1, 0.28));
  const head = act.seg(0, -0.18, 0, 0.18, { tone: 'accent' });
  const key = act.rect(-0.8, -0.26, 0.14, 0.14);
  const keyTag = act.label('M', -0.8, -0.26);
  const press = act.label('PRESS M · OR HOLD THE WAVEFORM', -0.8, -0.44);
  const card = act.rect(0.36, -0.3, 0.92, 0.46);
  const cardTag = act.label('MARKER · A TIME IN MILLISECONDS', 0.36, -0.16);
  const cardText = act.segs([-0.04, -0.28, 0, 0.72, -0.28, 0, -0.04, -0.35, 0, 0.5, -0.35, 0]);
  const swatches = [0, 1, 2, 3, 4, 5].map((i) => act.rect(-0.02 + i * 0.16, -0.46, 0.1, 0.1, { tone: i === 3 ? 'accent' : 'dim' }));
  const tether = act.poly([[0.08, 0.12], [0.08, -0.07]], { tone: 'accent', dashed: true });
  const verdict = act.label('IT BELONGS TO THE RECORDING · PLAY PAST IT AND THE COMMENT COMES BACK', 0, -0.74, 'center', 'ink');
  act.play = (q) => {
    sound.r = ramp(q, 0.02, 0.18);
    rail.r = ramp(q, 0.04, 0.16);
    key.r = ramp(q, 0.12, 0.2);
    keyTag.a = key.r;
    press.a = ramp(q, 0.14, 0.24);
    ticks[1].r = ramp(q, 0.22, 0.3);
    tether.r = ramp(q, 0.3, 0.4);
    card.r = ramp(q, 0.32, 0.44);
    cardTag.a = ramp(q, 0.38, 0.46);
    cardText.r = ramp(q, 0.4, 0.5);
    swatches.forEach((swatch, i) => { swatch.r = turn(q, i, 6, 0.44, 0.56); });
    ticks[0].r = ramp(q, 0.54, 0.6);
    ticks[2].r = ramp(q, 0.56, 0.62);
    const playing = band(q, 0.58, 0.62, 0.96, 1.0);
    const x = mix(-1.02, 1.02, ramp(q, 0.6, 0.94));
    head.at(x, 0.28).a = playing;
    AT.forEach((mark, i) => {
      const near = Math.max(0, 1 - Math.abs(x - mark) / 0.2) * playing;
      bubbles[i].a = near;
      said[i].a = near;
    });
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** Speech becomes text on the phone that heard it; only the text travels onward. */
export const transcription = () => {
  const act = new Act();
  const phone = act.rect(-0.74, 0.0, 0.74, 1.36);
  act.label('IPHONE OR IPAD', -0.74, 0.78, 'center', 'ink');
  const sound = act.wave(-0.74, 0.5, 0.62, 44, 0.1);
  const model = act.rect(-0.74, 0.24, 0.62, 0.2, { tone: 'dim' });
  const modelTag = act.label('ON-DEVICE MODEL', -0.74, 0.24);
  const grind = act.dots(5, 5, { tone: 'accent' });
  const LINES = 4;
  const rows = Array.from({ length: LINES }, (_, i) => {
    const y = -0.04 - i * 0.14;
    return { time: act.seg(-1.04, y, -0.95, y, { tone: 'dim' }), words: act.seg(-0.9, y, -0.52 + (i % 2) * 0.08, y) };
  });
  const timed = act.label('EVERY LINE IS TIMED', -0.74, -0.6);
  const mac = device(act, 0.86, 0.34, 'MAC', 0.34, 0.22);
  const ipad = device(act, 0.86, -0.26, 'IPAD', 0.34, 0.22);
  const lanes = [0.34, -0.26].map((y) => act.seg(-0.36, 0.0, 0.67, y, { tone: 'dim' }));
  const parcels = act.dots(2, 6, { tone: 'single' });
  const travels = act.label('ONLY THE TEXT SYNCS · DESKTOP SHOWS IT', 0.62, -0.58);
  const verdict = act.label('NO AUDIO IS UPLOADED · THE MODEL READS IT WHERE IT ALREADY IS', 0, -0.78, 'center', 'ink');
  act.play = (q, t) => {
    phone.r = ramp(q, 0.02, 0.14);
    sound.r = ramp(q, 0.06, 0.22);
    model.r = ramp(q, 0.2, 0.3);
    modelTag.a = ramp(q, 0.24, 0.34);
    for (let i = 0; i < 5; i += 1) grind.put(i, -1.0 + ((t * 0.5 + i / 5) % 1) * 0.52, 0.16);
    grind.a = band(q, 0.3, 0.36, 0.7, 0.76);
    rows.forEach(({ time, words }, i) => {
      time.r = turn(q, i, LINES, 0.36, 0.7);
      words.r = time.r;
      words.tone = i === 1 ? 'accent' : 'ink';
    });
    timed.a = ramp(q, 0.56, 0.66);
    lanes.forEach((lane, i) => { lane.r = turn(q, i, 2, 0.7, 0.82); });
    const fly = ramp(q, 0.74, 0.9);
    parcels.put(0, mix(-0.36, 0.67, fly), mix(0.0, 0.34, fly));
    parcels.put(1, mix(-0.36, 0.67, fly), mix(0.0, -0.26, fly));
    parcels.a = band(q, 0.72, 0.78, 0.9, 0.94);
    mac.box.tone = fly > 0.98 ? 'safe' : 'ink';
    ipad.box.tone = mac.box.tone;
    travels.a = ramp(q, 0.78, 0.88);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** One query fans over four sources, and a big library routes it to an index off the UI thread. */
export const search = () => {
  const act = new Act();
  act.label('ONE QUERY', -0.62, 0.8, 'center', 'ink');
  const field = act.rect(-0.62, 0.62, 0.92, 0.18);
  const lens = act.circle(-1.0, 0.62, 0.045, { tone: 'dim' }, 20);
  const typed = act.seg(-0.9, 0.62, -0.5, 0.62, { tone: 'accent' });
  const SOURCES = ['NAMES', 'NOTE TEXT', 'TRANSCRIPTS', 'PROJECT NAMES'];
  const sources = SOURCES.map((label, i) => {
    const y = 0.3 - i * 0.19;
    return { y, box: act.rect(-0.76, y, 0.66, 0.15, { tone: 'dim' }), tag: act.label(label, -0.76, y) };
  });
  const fans = sources.map(({ y }) => act.seg(-0.62, 0.53, -0.76, y + 0.075, { tone: 'dim' }));
  act.label('ONE RANKED LIST, ALL KINDS TOGETHER', 0.6, 0.52, 'center', 'ink');
  const KINDS = ['TAKE · NAME MATCH', 'NOTE', 'PROJECT', 'TAKE · IN A TRANSCRIPT'];
  const results = KINDS.map((kind, i) => {
    const y = 0.34 - i * 0.18;
    return {
      y,
      row: act.seg(0.06, y, 0.4 + (i % 2) * 0.16, y, { tone: i === 0 ? 'accent' : 'ink' }),
      tag: act.label(kind, 1.16, y, 'right', i === 0 ? 'accent' : i === 3 ? 'single' : 'dim'),
    };
  });
  const hits = act.dots(4, 6, { tone: 'single' });
  const RANK = [0, 2, 3, 1];
  const fork = act.poly([[0, -0.36], [0, -0.44]], { tone: 'dim' });
  const arms = [-0.52, 0.52].map((x) => act.poly([[0, -0.44], [x, -0.52]], { tone: 'dim' }));
  const small = act.label('UNDER 1500 ITEMS · FILTERS AS YOU TYPE', -0.04, -0.6, 'right');
  const big = act.label('OVER 1500 · AN INDEX, OFF THE UI THREAD', 0.04, -0.6, 'left');
  const verdict = act.label('A NAME MATCH OUTRANKS ONE BURIED IN A TRANSCRIPT', 0, -0.76, 'center', 'ink');
  act.play = (q) => {
    field.r = ramp(q, 0.02, 0.12);
    lens.r = field.r;
    typed.r = ramp(q, 0.08, 0.2);
    sources.forEach(({ box, tag }, i) => {
      const k = turn(q, i, 4, 0.16, 0.44);
      fans[i].r = k;
      box.r = k;
      tag.a = k;
    });
    results.forEach(({ row, tag }, i) => {
      const k = turn(q, RANK.indexOf(i), 4, 0.42, 0.66, 1.2);
      row.r = k;
      tag.a = k;
    });
    sources.forEach(({ y }, i) => {
      const k = turn(q, i, 4, 0.4, 0.64, 1.1);
      const to = results[RANK[i]].y;
      hits.put(i, k > 0 && k < 1 ? mix(-0.43, 0.06, k) : 9, mix(y, to, k));
    });
    hits.a = band(q, 0.38, 0.44, 0.66, 0.7);
    fork.r = ramp(q, 0.66, 0.74);
    arms.forEach((arm) => { arm.r = ramp(q, 0.7, 0.78); });
    small.a = ramp(q, 0.72, 0.8);
    big.a = ramp(q, 0.74, 0.82);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** Filing an item is one field on it; the audio file on disk never moves. */
export const projects = () => {
  const act = new Act();
  const node = (x: number, y: number, name: string) => ({
    box: act.rect(x, y, 0.13, 0.1),
    tag: act.label(name, x + 0.1, y, 'left'),
  });
  const elbow = (px: number, py: number, cx: number, cy: number) =>
    act.poly([[px, py - 0.05], [px, cy], [cx - 0.065, cy]], { tone: 'dim' });
  const reveal = (n: ReturnType<typeof node>, k: number) => { n.box.r = k; n.tag.a = k; };
  act.label('NESTED · THREE LEVELS AT MOST', -0.62, 0.78, 'center', 'ink');
  const library = node(-1.06, 0.56, 'LIBRARY');
  const album = node(-0.86, 0.36, 'ALBUM');
  const song = node(-0.66, 0.16, 'SONG');
  const take = node(-0.46, -0.04, 'TAKE 03');
  const note = node(-0.46, -0.2, 'NOTE');
  const demos = node(-0.86, -0.36, 'DEMOS');
  const toAlbum = elbow(-1.06, 0.56, -0.86, 0.36);
  const toSong = elbow(-0.86, 0.36, -0.66, 0.16);
  const toTake = elbow(-0.66, 0.16, -0.46, -0.04);
  const toNote = elbow(-0.66, 0.16, -0.46, -0.2);
  const toDemos = elbow(-1.06, 0.56, -0.86, -0.36);
  const refiled = act.poly([[-0.86, -0.41], [-0.86, -0.52], [-0.525, -0.52]], { tone: 'accent' });
  act.label('THE ITEM’S RECORD', 0.62, 0.7, 'center', 'ink');
  const card = act.rect(0.62, 0.34, 0.96, 0.56);
  const nameKey = act.label('NAME', 0.2, 0.5, 'left');
  const nameValue = act.seg(0.56, 0.48, 0.96, 0.48, { tone: 'dim' });
  const projectKey = act.label('PROJECT', 0.2, 0.32, 'left');
  const projectValue = act.label('SONG', 0.56, 0.32, 'left', 'ink');
  const fileKey = act.label('FILE', 0.2, 0.14, 'left');
  const fileValue = act.seg(0.56, 0.12, 1.02, 0.12, { tone: 'dim' });
  const diskTag = act.label('THE AUDIO FILE, ON DISK', 0.62, -0.06);
  const disk = act.rect(0.62, -0.28, 0.96, 0.26, { tone: 'dim' });
  const diskWave = act.wave(0.62, -0.28, 0.86, 44, 0.09);
  const untouched = act.label('NOT COPIED · NOT MOVED', 0.62, -0.52, 'center', 'safe');
  const verdict = act.label('A MOVE IS ONE WRITE · THE PROJECT FIELD · AND NOTHING ELSE', 0, -0.76, 'center', 'ink');
  act.play = (q) => {
    reveal(library, ramp(q, 0.02, 0.12));
    toAlbum.r = turn(q, 0, 4, 0.06, 0.34);
    reveal(album, toAlbum.r);
    toSong.r = turn(q, 1, 4, 0.06, 0.34);
    reveal(song, toSong.r);
    toTake.r = turn(q, 2, 4, 0.06, 0.34);
    toNote.r = toTake.r;
    reveal(note, toTake.r);
    reveal(take, toTake.r);
    toDemos.r = turn(q, 3, 4, 0.06, 0.34);
    reveal(demos, toDemos.r);
    card.r = ramp(q, 0.3, 0.44);
    [nameKey, projectKey, fileKey].forEach((key, i) => { key.a = turn(q, i, 3, 0.34, 0.52); });
    nameValue.r = ramp(q, 0.36, 0.46);
    fileValue.r = ramp(q, 0.44, 0.54);
    disk.r = ramp(q, 0.4, 0.52);
    diskWave.r = disk.r;
    diskTag.a = ramp(q, 0.42, 0.52);
    const moved = ramp(q, 0.54, 0.74);
    const y = mix(-0.04, -0.52, moved);
    take.box.at(-0.46, y);
    take.tag.pos.set(-0.36, y, 0);
    toTake.a = 1 - moved;
    refiled.r = ramp(q, 0.6, 0.76);
    projectValue.say(moved > 0.5 ? 'DEMOS' : 'SONG');
    projectValue.tone = band(q, 0.54, 0.6, 0.86, 0.92) > 0.5 ? 'accent' : 'ink';
    projectValue.a = ramp(q, 0.4, 0.5);
    untouched.a = ramp(q, 0.74, 0.84);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** One list of rows underneath; the five desktop views are five ways to place the same rows. */
export const libraryViews = () => {
  const act = new Act();
  const N = 12;
  const LAYOUT: ((i: number) => [number, number, number, number])[] = [
    (i) => [0, 0.42 - i * 0.085, 1.68, 0.065],
    (i) => [-0.56 + (i % 3) * 0.56, 0.3 - Math.floor(i / 3) * 0.2, 0.5, 0.1],
    (i) => [-0.72 + (i % 4) * 0.48, 0.28 - Math.floor(i / 4) * 0.38, 0.4, 0.3],
    (i) => [-0.6 + Math.floor(i / 4) * 0.6, 0.32 - (i % 4) * 0.17, 0.52, 0.11],
    (i) => {
      const day = (i * 5 + 3) % 28;
      return [-0.84 + (day % 7) * 0.28, 0.28 - Math.floor(day / 7) * 0.24, 0.2, 0.15];
    },
  ];
  const NAMES = ['FEED', 'TABLE', 'GALLERY', 'COLUMNS', 'CALENDAR'];
  const cells = Array.from({ length: N }, (_, i) => act.rect(0, 0, 1, 1, { tone: i === 4 ? 'accent' : 'ink' }));
  const header = act.seg(-0.84, 0.42, 0.84, 0.42, { tone: 'dim' });
  const dividers = act.segs([-0.3, 0.44, 0, -0.3, -0.32, 0, 0.3, 0.44, 0, 0.3, -0.32, 0], { tone: 'dim' });
  const grid: number[] = [];
  for (let c = 0; c <= 7; c += 1) grid.push(-0.98 + c * 0.28, 0.4, 0, -0.98 + c * 0.28, -0.56, 0);
  for (let r = 0; r <= 4; r += 1) grid.push(-0.98, 0.4 - r * 0.24, 0, 0.98, 0.4 - r * 0.24, 0);
  const month = act.segs(grid, { tone: 'dim' });
  const name = act.label('FEED', 0, 0.7, 'center', 'ink');
  const keys = act.label('COMMAND-1 TO COMMAND-5', 0, 0.59);
  const verdict = act.label('ONE LIST UNDERNEATH · THE SAME ROW IN ALL FIVE · DESKTOP ONLY', 0, -0.76, 'center', 'ink');
  act.play = (q) => {
    const k = clamp01((q - 0.08) / 0.68) * 4;
    const v = Math.min(3, Math.floor(k));
    const f = ramp(k - v, 0.3, 0.7); // each view holds still before it moves on
    const near = (n: number) => Math.max(0, 1 - Math.abs(k - n) * 1.4);
    const drawn = ramp(q, 0.02, 0.14);
    cells.forEach((cell, i) => {
      const a = LAYOUT[v](i);
      const b = LAYOUT[v + 1](i);
      cell.at(mix(a[0], b[0], f), mix(a[1], b[1], f));
      cell.object.scale.set(mix(a[2], b[2], f), mix(a[3], b[3], f), 1);
      cell.r = drawn;
    });
    header.a = near(1);
    dividers.a = near(3);
    month.a = near(4) * 0.8;
    name.say(NAMES[Math.round(k)]).a = drawn;
    keys.a = band(q, 0.06, 0.16, 0.78, 0.84);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};
