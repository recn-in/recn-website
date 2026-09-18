// Feature acts for making sound: quick record and everything in a session.
import { Act, band, mix, ramp, type Tone } from './kit';

const X0 = -0.74;
const X1 = 1.02;
const LANE = 0.26;

/** Where a fraction `u` of the ruler sits, for a timeline ending at `x1`. */
const at = (u: number, x1 = X1) => mix(X0, x1, u);

/** The shape these acts share: a bar ruler with a lane under it per name. */
const timeline = (act: Act, names: string[], top: number, x1 = X1) => {
  act.seg(X0, top, x1, top, { tone: 'dim' });
  act.segs(
    Array.from({ length: 9 }, (_, i) => [at(i / 8, x1), top, 0, at(i / 8, x1), top + (i % 2 ? 0.03 : 0.06), 0]).flat(),
    { tone: 'dim' },
  );
  const y = (i: number) => top - 0.16 - i * LANE;
  names.forEach((name, i) => {
    act.label(name, X0 - 0.09, y(i) - 0.02, 'right');
    act.rect((X0 + x1) / 2, y(i), x1 - X0, LANE - 0.09, { tone: 'dim' });
  });
  return {
    y,
    /** A clip on lane `i` covering `a`→`b` of the ruler, with its audio in it. */
    clip(i: number, a: number, b: number, look: { tone?: Tone } = {}, seed = 1) {
      const left = at(a, x1);
      const right = at(b, x1);
      const box = act.rect((left + right) / 2, y(i), right - left, LANE - 0.09, look);
      const sound = act.wave((left + right) / 2, y(i), right - left - 0.04, 34, 0.062, look, seed);
      return { box, sound };
    },
  };
};

/** No window at all: the hotkey and the menu-bar item reach the recorder the app uses. */
export const quickRecord = () => {
  const act = new Act();
  act.seg(-1.12, 0.72, 1.12, 0.72, { tone: 'dim' });
  act.label('MENU BAR · TRAY ON WINDOWS', -1.12, 0.76, 'left');
  const item = act.circle(0.5, 0.76, 0.04);
  const menu = act.rect(0.5, 0.52, 0.58, 0.22);
  const stop = act.label('STOP RECORDING', 0.5, 0.57, 'center', 'accent');
  act.label('OPEN RECN', 0.5, 0.47);
  const caps = ['CTRL', 'ALT', 'R'].map((name, i) => ({
    key: act.rect(-0.86 + i * 0.3, 0.52, 0.26, 0.15),
    tag: act.label(name, -0.86 + i * 0.3, 0.52),
  }));
  const anywhere = act.label('FROM INSIDE ANY OTHER APP', -0.56, 0.68);
  const doors = act.segs([-0.56, 0.44, 0, -0.14, 0.26, 0, 0.5, 0.4, 0, 0.14, 0.26, 0], { tone: 'dim' });
  const core = act.rect(0, 0.16, 1.16, 0.2, { tone: 'ink' });
  const same = act.label('THE SAME RECORDER THE WINDOW USES', 0, 0.16);
  const drops = act.dots(3, 4, { tone: 'accent' });
  const file = act.rect(0, -0.24, 1.5, 0.22, { tone: 'dim' });
  const written = act.wave(0, -0.24, 1.44, 76, 0.07);
  const onDisk = act.label('WRITTEN TO DISK AS IT IS CAPTURED', 0, -0.44);
  const shelf = [-0.55, 0, 0.55].map((x) => act.rect(x, -0.6, 0.5, 0.13, { tone: 'dim' }));
  act.label('YOUR LIBRARY', -1.12, -0.6, 'left');
  const landed = act.rect(0.55, -0.6, 0.5, 0.13, { tone: 'safe' });
  const verdict = act.label('NO WINDOW, NO REVIEW STEP · THE TAKE ARRIVES IN THE LIBRARY, NAMED', 0, -0.76, 'center', 'ink');
  act.play = (q, t) => {
    const live = band(q, 0.32, 0.4, 0.86, 0.94);
    caps.forEach(({ key, tag }, i) => {
      key.a = ramp(q, 0.06 + i * 0.03, 0.2 + i * 0.03);
      key.tone = live > 0.5 ? 'accent' : 'ink';
      tag.a = key.a;
    });
    anywhere.a = ramp(q, 0.14, 0.26);
    menu.r = ramp(q, 0.1, 0.24);
    stop.a = live;
    item.tone = live > 0.5 ? 'accent' : 'ink';
    item.object.scale.setScalar(1 + live * 0.25 * Math.abs(Math.sin(t * 3.1)));
    doors.r = ramp(q, 0.34, 0.46);
    core.r = ramp(q, 0.4, 0.52);
    same.a = ramp(q, 0.44, 0.54);
    file.r = ramp(q, 0.5, 0.6);
    written.r = ramp(q, 0.52, 0.8);
    for (let i = 0; i < 3; i += 1) drops.put(i, 0, mix(0.06, -0.14, (t * 1.7 + i / 3) % 1));
    drops.a = band(q, 0.5, 0.56, 0.8, 0.86);
    onDisk.a = ramp(q, 0.56, 0.66);
    shelf.forEach((slot, i) => { slot.a = ramp(q, 0.66 + i * 0.02, 0.76 + i * 0.02); });
    landed.a = ramp(q, 0.8, 0.88);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** A pass records onto its own lane, anchored to the frame of the session it was played on. */
export const sessions = () => {
  const act = new Act();
  const rail = timeline(act, ['GUITAR', 'VOX', 'BASS'], 0.52);
  const guitar = rail.clip(0, 0.04, 0.6, {}, 3);
  const bass = rail.clip(2, 0.3, 0.96, {}, 7);
  const pass = rail.clip(1, 0.22, 0.82, { tone: 'accent' }, 11);
  const arm = act.circle(X0 - 0.05, rail.y(1), 0.03, { tone: 'accent' });
  const head = act.seg(0, rail.y(2) - 0.12, 0, 0.52, { tone: 'accent' });
  const anchor = act.seg(at(0.22), rail.y(2) - 0.12, at(0.22), 0.52, { tone: 'single', dashed: true });
  const playing = act.label('THE LANES YOU HAVE PLAY WHILE THE NEW ONE RECORDS', 0.14, 0.72);
  const placed = act.label('PLACED AT THE FRAME IT WAS PLAYED · INPUT LATENCY SUBTRACTED', 0.14, -0.42, 'center', 'single');
  const verdict = act.label('A LANE PER PASS · THE RECORDINGS UNDERNEATH ARE NEVER REWRITTEN', 0.14, -0.74, 'center', 'ink');
  act.play = (q) => {
    guitar.box.r = ramp(q, 0.04, 0.16);
    guitar.sound.r = ramp(q, 0.06, 0.2);
    bass.box.r = ramp(q, 0.1, 0.22);
    bass.sound.r = ramp(q, 0.12, 0.26);
    playing.a = band(q, 0.16, 0.24, 0.66, 0.74);
    const run = ramp(q, 0.28, 0.76);
    head.at(mix(at(0.04), at(1), run), 0).a = band(q, 0.26, 0.32, 0.76, 0.82);
    arm.a = band(q, 0.24, 0.3, 0.86, 0.94);
    // The new lane only fills in behind the playhead: it lands where it was played.
    pass.box.r = ramp(q, 0.3, 0.42);
    pass.sound.r = Math.min(1, Math.max(0, (run - 0.18) / 0.6));
    anchor.a = ramp(q, 0.64, 0.74);
    placed.a = ramp(q, 0.66, 0.78);
    pass.box.tone = q > 0.82 ? 'safe' : 'accent';
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** Record the part again and the take you replaced drops under the lane, still whole. */
export const takes = () => {
  const act = new Act();
  const rail = timeline(act, ['VOX'], 0.38);
  const lane = rail.y(0);
  const passes = [3, 17, 29].map((seed) => rail.clip(0, 0.08, 0.92, {}, seed));
  const strips = [0, 1, 2].map((i) => act.rect(at(0.5), lane - 0.14 - i * 0.09, at(0.92) - at(0.08), 0.045, { tone: 'dim' }));
  [0, 1, 2].forEach((i) => act.label(`TAKE ${i + 1}`, X0 - 0.09, lane - 0.14 - i * 0.09, 'right'));
  const menu = act.rect(0.5, -0.4, 0.56, 0.42);
  act.label('TAKES', 0.5, -0.24);
  act.seg(0.22, -0.29, 0.78, -0.29, { tone: 'dim' });
  const rows = [0, 1, 2].map((i) => act.label(`TAKE ${i + 1}`, 0.5, -0.35 - i * 0.1));
  const tick = act.poly([[-0.03, 0], [-0.01, -0.025], [0.035, 0.03]], { tone: 'accent' });
  const held = act.label('ONE TAKE IS ACTIVE · THE OTHERS STAY WITH THE TRACK', -0.5, -0.3);
  const lap = act.label('LOOP ARMED? ONE TAKE PER LAP', -0.5, -0.46);
  const verdict = act.label('NOTHING YOU PLAYED IS DELETED · GOING BACK IS A MENU PICK', 0, -0.72, 'center', 'ink');
  act.play = (q) => {
    const second = ramp(q, 0.22, 0.4);
    const third = ramp(q, 0.44, 0.6);
    const back = ramp(q, 0.76, 0.86);
    const alive = [1 - second, mix(second * (1 - third), 1, back), third * (1 - back)];
    passes.forEach(({ box, sound }, i) => {
      box.r = i === 0 ? ramp(q, 0.04, 0.18) : 1;
      sound.r = i === 0 ? ramp(q, 0.06, 0.22) : i === 1 ? second : third;
      box.a = alive[i];
      sound.a = alive[i];
      box.tone = (i === 1 && second < 1) || (i === 2 && third < 1) ? 'accent' : 'ink';
      sound.tone = box.tone;
    });
    strips[0].a = second;
    strips[1].a = third * (1 - back);
    strips[2].a = back;
    menu.r = ramp(q, 0.6, 0.72);
    rows.forEach((row) => { row.a = ramp(q, 0.64, 0.74); });
    tick.at(0.26, mix(-0.55, -0.45, back)).a = ramp(q, 0.68, 0.76);
    held.a = band(q, 0.4, 0.5, 0.88, 0.96);
    lap.a = band(q, 0.5, 0.6, 0.88, 0.96);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** A clip is a window onto the file: trim moves its edge, split makes two, moving it changes nothing on disk. */
export const clipEditing = () => {
  const act = new Act();
  const source = act.rect((X0 + X1) / 2, 0.52, X1 - X0, 0.26, { tone: 'dim' });
  const audio = act.wave((X0 + X1) / 2, 0.52, X1 - X0 - 0.04, 96, 0.1);
  act.label('THE RECORDING ON DISK · NEVER REWRITTEN', (X0 + X1) / 2, 0.72);
  const windows = [0, 1].map(() => act.rect(0, 0.52, 1, 0.2, { tone: 'accent' }));
  const rail = timeline(act, ['VOX'], 0.2);
  const lane = rail.y(0);
  const clips = [0, 1].map(() => act.rect(0, lane, 1, LANE - 0.09));
  const down = act.poly([[-0.088, 0.075], [-0.03, 0.05], [0.03, -0.05], [0.088, -0.075]], { tone: 'accent' });
  const up = act.poly([[-0.088, -0.075], [-0.03, -0.05], [0.03, 0.05], [0.088, 0.075]], { tone: 'accent' });
  const steps = [
    act.label('TRIM MOVES THE WINDOW’S EDGE · THE FILE IS NOT CUT', 0.14, -0.3),
    act.label('SPLIT MAKES TWO WINDOWS ONTO ONE FILE', 0.14, -0.3),
    act.label('MOVE SLIDES THE CLIP IN TIME · ITS WINDOW STAYS PUT', 0.14, -0.3),
    act.label('THE OVERLAP IS THE CROSSFADE · IT IS NEVER WRITTEN DOWN', 0.14, -0.3, 'center', 'accent'),
  ];
  const thesis = act.label('A CLIP IS A WINDOW ONTO THE FILE, NOT A COPY OF IT', 0.14, -0.52, 'center', 'ink');
  const verdict = act.label('PULL THE EDGE BACK OUT AND THE AUDIO IS STILL THERE', 0.14, -0.74, 'center', 'ink');
  const span = (box: ReturnType<Act['rect']>, a: number, b: number, y: number) => {
    box.at((at(a) + at(b)) / 2, y).object.scale.x = at(b) - at(a);
  };
  act.play = (q) => {
    source.r = ramp(q, 0.02, 0.14);
    audio.r = ramp(q, 0.06, 0.24);
    const trim = ramp(q, 0.26, 0.4);
    const split = ramp(q, 0.44, 0.56);
    const move = ramp(q, 0.6, 0.74);
    const end = mix(1, 0.62, trim);
    const cut = mix(end, 0.3, split);
    const slide = 0.1 * move;
    span(windows[0], 0, cut, 0.52);
    span(windows[1], cut, end, 0.52);
    span(clips[0], 0, cut, lane);
    span(clips[1], cut - slide, end - slide, lane);
    const born = ramp(q, 0.14, 0.26);
    windows[0].a = born;
    clips[0].a = born;
    windows[1].a = split;
    clips[1].a = split;
    const fade = ramp(q, 0.76, 0.86);
    down.at(at(cut - slide / 2), lane).a = fade;
    up.at(at(cut - slide / 2), lane).a = fade;
    steps.forEach((step, i) => { step.a = band(q, 0.26 + i * 0.17, 0.32 + i * 0.17, 0.4 + i * 0.17, 0.46 + i * 0.17); });
    thesis.a = ramp(q, 0.3, 0.42);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** Ranges on the ruler: the playhead wraps a loop, recording only lands inside the punch. */
export const loopPunchMarkers = () => {
  const act = new Act();
  const rail = timeline(act, ['VOX'], 0.42);
  const lane = rail.y(0);
  const kept = rail.clip(0, 0.04, 0.96, { tone: 'dim' }, 5);
  const region = act.rect((at(0.25) + at(0.62)) / 2, 0.53, at(0.62) - at(0.25), 0.1, { tone: 'accent' });
  const grips = act.segs([at(0.25), 0.47, 0, at(0.25), 0.59, 0, at(0.62), 0.47, 0, at(0.62), 0.59, 0], { tone: 'accent' });
  const punch = act.rect((at(0.36) + at(0.52)) / 2, 0.37, at(0.52) - at(0.36), 0.05, { tone: 'accent' });
  const inside = rail.clip(0, 0.36, 0.52, { tone: 'accent' }, 23);
  const marks: [number, string][] = [[0.13, 'VERSE'], [0.71, 'CHORUS']];
  const flags = marks.map(([u, name]) => ({
    stem: act.seg(at(u), 0.42, at(u), 0.6),
    box: act.rect(at(u) + 0.12, 0.65, 0.24, 0.09),
    tag: act.label(name, at(u) + 0.12, 0.65),
  }));
  const head = act.seg(0, lane - 0.12, 0, 0.48, { tone: 'accent' });
  const notes = [
    act.label('A LOOP REGION · PLAY STARTS AND STOPS INSIDE IT', 0.14, 0.02),
    act.label('THE PLAYHEAD WRAPS AT THE END · NO GAP AT THE SEAM', 0.14, 0.02),
    act.label('A PUNCH RANGE · THE LEAD-IN PLAYS, ONLY THE INSIDE IS KEPT', 0.14, 0.02, 'center', 'accent'),
    act.label('MARKERS · NAMED FLAGS YOU DROP AND DRAG ON THE RULER', 0.14, 0.02),
  ];
  const armed = act.circle(X0 - 0.05, lane, 0.03, { tone: 'accent' });
  const verdict = act.label('RANGES ON THE RULER · NOT A LONG TAKE YOU CUT UP AFTERWARDS', 0.14, -0.74, 'center', 'ink');
  act.play = (q, t) => {
    kept.box.r = ramp(q, 0.02, 0.14);
    kept.sound.r = ramp(q, 0.04, 0.2);
    region.r = ramp(q, 0.16, 0.3);
    grips.a = ramp(q, 0.22, 0.34);
    const wrap = (q * 3 + t * 0.22) % 1;
    head.at(mix(at(0.25), at(0.62), wrap), 0).a = ramp(q, 0.24, 0.32);
    punch.r = ramp(q, 0.46, 0.58);
    const recording = wrap > 0.3 && wrap < 0.73;
    armed.a = ramp(q, 0.46, 0.56);
    armed.tone = recording ? 'accent' : 'dim';
    inside.box.a = ramp(q, 0.54, 0.68);
    inside.sound.a = inside.box.a;
    flags.forEach(({ stem, box, tag }, i) => {
      const drop = ramp(q, 0.68 + i * 0.04, 0.78 + i * 0.04);
      stem.r = drop;
      box.a = drop;
      tag.a = drop;
    });
    notes.forEach((note, i) => { note.a = band(q, 0.18 + i * 0.17, 0.24 + i * 0.17, 0.32 + i * 0.17, 0.38 + i * 0.17); });
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** Two ways out: every lane mixed down to new audio, or the session itself wrapped up with its audio. */
export const exportSession = () => {
  const act = new Act();
  const rail = timeline(act, ['GUITAR', 'VOX', 'BASS'], 0.5, 0.06);
  const clips = [rail.clip(0, 0.05, 0.85, {}, 3), rail.clip(1, 0.2, 1, {}, 13), rail.clip(2, 0.1, 0.7, {}, 21)];
  const knobs = [0, 1, 2].map((i) => ({
    pan: act.circle(0.18, rail.y(i), 0.035),
    point: act.seg(0.18, rail.y(i), 0.2, rail.y(i) + 0.03),
    gain: act.rect(0.3, rail.y(i), 0.025, 0.13, { tone: 'dim' }),
    handle: act.seg(0.275, rail.y(i) + 0.02, 0.325, rail.y(i) + 0.02),
  }));
  act.label('EVERY LANE THROUGH ITS OWN LEVEL AND PAN', 0.1, 0.72);
  const funnel = act.segs([0.36, rail.y(0), 0, 0.54, 0.3, 0, 0.36, rail.y(1), 0, 0.54, 0.3, 0, 0.36, rail.y(2), 0, 0.54, 0.3, 0], { tone: 'dim' });
  const render = act.rect(0.8, 0.3, 0.52, 0.2, { tone: 'safe' });
  const renderName = act.label('MIXDOWN.WAV', 0.8, 0.3, 'center', 'safe');
  const renderTag = act.label('NEW AUDIO', 0.8, 0.46);
  const held = act.rect(-0.34, 0.08, 0.88, 0.76, { tone: 'single', dashed: true });
  const route = act.poly([[-0.34, -0.3], [-0.34, -0.66], [0.54, -0.66], [0.54, -0.42]], { tone: 'single' });
  const bundle = act.rect(0.8, -0.42, 0.52, 0.3, { tone: 'single' });
  const bundleName = act.label('REHEARSAL 04.RECN', 0.8, -0.2, 'center', 'single');
  const parts = [act.label('SESSION.JSON', 0.8, -0.36), act.label('DATA/ · THE AUDIO', 0.8, -0.49)];
  const formats = act.label('MIXDOWN, ONE FILE PER TRACK, OR BOTH · WAV OR AAC', 0.1, 0.62);
  const honest = act.label('MUTES ARE RENDERED · SOLO IS NEVER SAVED, SO IT NEVER RENDERS', 0.1, 0.62);
  const verdict = act.label('A RENDER IS NEW AUDIO · A COPY IS THE SESSION ITSELF, AUDIO AND ALL', 0, -0.76, 'center', 'ink');
  act.play = (q) => {
    clips.forEach(({ box, sound }, i) => {
      box.r = ramp(q, 0.02 + i * 0.04, 0.14 + i * 0.04);
      sound.r = ramp(q, 0.04 + i * 0.04, 0.2 + i * 0.04);
    });
    const mixed = ramp(q, 0.24, 0.38);
    knobs.forEach(({ pan, point, gain, handle }) => {
      pan.r = mixed;
      point.a = mixed;
      gain.r = mixed;
      handle.a = mixed;
    });
    formats.a = band(q, 0.3, 0.38, 0.54, 0.6);
    funnel.r = ramp(q, 0.4, 0.52);
    render.r = ramp(q, 0.5, 0.62);
    renderName.a = ramp(q, 0.54, 0.64);
    renderTag.a = ramp(q, 0.52, 0.62);
    honest.a = band(q, 0.6, 0.66, 0.9, 0.96);
    held.a = ramp(q, 0.62, 0.72);
    route.r = ramp(q, 0.66, 0.78);
    bundle.r = ramp(q, 0.74, 0.84);
    bundleName.a = ramp(q, 0.76, 0.86);
    parts.forEach((part, i) => { part.a = ramp(q, 0.78 + i * 0.03, 0.88 + i * 0.03); });
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};
