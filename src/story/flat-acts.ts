// The mechanism acts: flat diagrams that float in the stage's 3D space. Each
// one is a true picture of something Lattice does, played by its chapter's
// progress `q` (0 → 1) with the clock `t` adding life.
import * as THREE from 'three';
import { Act, band, between, mix, ramp, turn, type Tone, type XY } from './kit';

const device = (act: Act, x: number, y: number, name: string, w = 0.3, h = 0.22) => {
  const box = act.rect(x, y, w, h);
  const tag = act.label(name, x, y + h / 2 + 0.07);
  return { box, tag, at: [x, y] as XY };
};

/** A recording is born: captured, drawn and written to disk at the same moment. */
export const record = () => {
  const act = new Act();
  act.circle(-1.02, 0.3, 0.07);
  act.seg(-1.02, 0.23, -1.02, 0.12);
  act.seg(-1.08, 0.12, -0.96, 0.12);
  act.label('MICROPHONE', -1.02, 0.45);
  const meter = act.bars(2, { tone: 'ink' });
  act.rect(-1.02, -0.2, 0.06, 0.4, { tone: 'dim' });
  const live = act.wave(0.1, 0.3, 1.7, 86, 0.2);
  const head = act.seg(0, -0.26, 0, 0.26, { tone: 'accent' });
  const file = act.rect(0.1, -0.42, 1.7, 0.2, { tone: 'dim' });
  const written = act.wave(0.1, -0.42, 1.62, 86, 0.07, { tone: 'ink', base: 0.8 });
  const drops = act.dots(3, 4, { tone: 'accent' });
  act.label('THE FILE, ON DISK', -0.75, -0.24, 'left');
  const note = act.label('WRITTEN AS IT IS CAPTURED · NOTHING WAITS IN MEMORY', 0.1, -0.62);
  const split = act.label('ONE RECORDING = A SMALL FACT + A BIG FILE', 0.1, 0.66, 'center', 'ink');
  act.play = (q, t) => {
    const k = ramp(q, 0.12, 0.72);
    const x = 0.1 - 0.85 + 1.7 * k;
    live.r = k;
    written.r = k;
    head.at(x, 0.3).a = band(q, 0.1, 0.16, 0.72, 0.8);
    file.r = ramp(q, 0.05, 0.2);
    const level = 0.08 + 0.3 * Math.abs(Math.sin(t * 7.3) * Math.cos(t * 3.1)) * band(q, 0.1, 0.16, 0.72, 0.8);
    meter.put(0, -1.03, -0.4, level);
    meter.put(1, -1.01, -0.4, level * 0.86);
    for (let i = 0; i < 3; i += 1) {
      const fall = (t * 1.6 + i / 3) % 1;
      drops.put(i, x, mix(0.08, -0.34, fall));
    }
    drops.a = band(q, 0.14, 0.2, 0.7, 0.76);
    note.a = ramp(q, 0.3, 0.45);
    split.a = ramp(q, 0.78, 0.9);
  };
  return act;
};

/** One recording, two devices, two different edits: both survive. */
export const fields = () => {
  const act = new Act();
  const names = ['NAME', 'PROJECT', 'LENGTH', 'TAGS'];
  const cards = [-0.62, 0.62].map((x, side) => {
    act.rect(x, 0, 0.92, 0.98);
    act.label(side === 0 ? 'PHONE' : 'MAC', x, 0.58);
    return names.map((name, i) => {
      const y = 0.3 - i * 0.2;
      act.label(name, x - 0.4, y + 0.045, 'left');
      const value = act.seg(x - 0.4, y - 0.03, x + 0.12 + (i % 2) * 0.1, y - 0.03);
      const clock = act.segs([x + 0.33, y - 0.05, 0, x + 0.33, y + 0.03, 0, x + 0.37, y - 0.05, 0, x + 0.37, y + 0.01, 0, x + 0.41, y - 0.05, 0, x + 0.41, y + 0.03, 0], { tone: 'dim' });
      return { value, clock, y };
    });
  });
  const parcels = act.dots(2, 6);
  const parcelTone = act.dots(1, 6, { tone: 'single' });
  const renamed = act.label('RENAMED HERE', -0.62, -0.6, 'center', 'accent');
  const moved = act.label('MOVED HERE, AT THE SAME MOMENT', 0.62, -0.6, 'center', 'single');
  const verdict = act.label('DIFFERENT FIELDS · EACH CARRIES ITS OWN CLOCK · BOTH EDITS SURVIVE', 0, -0.74, 'center', 'ink');
  parcels.tone = 'accent';
  act.play = (q) => {
    const edit = ramp(q, 0.14, 0.26);
    const cross = ramp(q, 0.36, 0.6);
    const settled = ramp(q, 0.78, 0.9);
    const paint = (side: number, row: number, on: number, tone: Tone) => {
      const cell = cards[side][row];
      cell.value.tone = settled > 0.5 ? 'safe' : on > 0.5 ? tone : 'ink';
      cell.clock.tone = on > 0.5 ? tone : 'dim';
    };
    paint(0, 0, edit, 'accent');
    paint(1, 1, edit, 'single');
    paint(1, 0, ramp(q, 0.58, 0.62), 'accent');
    paint(0, 1, ramp(q, 0.58, 0.62), 'single');
    parcels.put(0, mix(-0.16, 0.16, cross), 0.27);
    parcels.put(1, 9, 9);
    parcelTone.put(0, mix(0.16, -0.16, cross), 0.07);
    parcels.a = band(q, 0.34, 0.38, 0.58, 0.62);
    parcelTone.a = parcels.a;
    renamed.a = band(q, 0.14, 0.22, 0.74, 0.8);
    moved.a = renamed.a;
    verdict.a = settled;
  };
  return act;
};

/** Hybrid logical clocks: the same winner on every device. */
export const clocks = () => {
  const act = new Act();
  const rows: [string, number][] = [['PHONE', 0.38], ['MAC', 0.04], ['IPAD', -0.3]];
  const lines = rows.map(([name, y]) => {
    act.label(name, -1.12, y + 0.07, 'left');
    return act.seg(-1.12, y, 1.12, y, { tone: 'dim' });
  });
  const events: [number, number][] = [[0, -0.85], [1, -0.6], [2, -0.4], [0, -0.2], [1, 0.12], [2, 0.3], [0, 0.62], [1, 0.7]];
  const ticks = events.map(([row, x]) => act.seg(x, rows[row][1] - 0.05, x, rows[row][1] + 0.05));
  const message = act.poly([[-0.2, 0.38], [0.1, 0.06]], { dashed: true });
  const nudge = act.label('A MESSAGE ARRIVES · THE RECEIVER’S CLOCK MOVES FORWARD', -0.05, 0.22, 'left');
  const shape = act.label('EVERY EDIT CARRIES A CLOCK = TIME · COUNTER · DEVICE', 0, 0.66, 'center', 'ink');
  const ring = act.circle(0.7, 0.04, 0.09, { tone: 'accent' });
  const rule = act.label('SAME FIELD, TWICE? TIME, THEN COUNTER, THEN DEVICE ID. THE SAME WINNER EVERYWHERE.', 0, -0.62, 'center', 'ink');
  act.play = (q) => {
    lines.forEach((line, i) => { line.r = ramp(q, 0.04 + i * 0.04, 0.24 + i * 0.04); });
    ticks.forEach((tick, i) => {
      tick.a = turn(q, i, ticks.length, 0.12, 0.62);
      tick.tone = i === 6 ? 'single' : i === 7 ? 'accent' : 'ink';
    });
    message.r = ramp(q, 0.36, 0.5);
    nudge.a = band(q, 0.4, 0.5, 0.66, 0.72);
    shape.a = ramp(q, 0.08, 0.2);
    ring.r = ramp(q, 0.7, 0.82);
    rule.a = ramp(q, 0.74, 0.88);
  };
  return act;
};

/** Note text merges piece by piece: two people typing, one result. */
export const noteMerge = () => {
  const act = new Act();
  const BASE = 26;
  const GAP = 0.066;
  const replicas = [0.34, -0.12].map((y, side) => {
    act.label(side === 0 ? 'THE NOTE, ON THE PHONE' : 'THE SAME NOTE, ON THE MAC', -0.92, y + 0.17, 'left');
    act.seg(-0.95, y - 0.05, 0.98, y - 0.05, { tone: 'dim' });
    return { y, base: act.bars(BASE), typed: act.bars(3, { tone: 'accent' }), also: act.bars(2, { tone: 'single' }) };
  });
  const parcels = act.dots(1, 6, { tone: 'accent' });
  const parcelBack = act.dots(1, 6, { tone: 'single' });
  const verdict = act.label('BOTH SETS OF WORDS, IN THE SAME ORDER ON EVERY DEVICE · NO LOCK, NO SHARED DRAFT', 0, -0.52, 'center', 'ink');
  act.play = (q) => {
    const own = ramp(q, 0.12, 0.34);
    const theirs = ramp(q, 0.62, 0.82);
    replicas.forEach(({ y, base, typed, also }, side) => {
      const a = side === 0 ? own : theirs; // the three red characters
      const b = side === 0 ? theirs : own; // the two amber ones
      for (let i = 0; i < BASE; i += 1) {
        const shift = (i >= 8 ? 3 * a : 0) + (i >= 17 ? 2 * b : 0);
        base.put(i, -0.9 + (i + shift) * GAP, y, i % 6 === 5 ? 0 : 0.1);
      }
      for (let j = 0; j < 3; j += 1) typed.put(j, -0.9 + (8 + j) * GAP, y, 0.1 * a);
      for (let j = 0; j < 2; j += 1) also.put(j, -0.9 + (17 + j + 3 * a) * GAP, y, 0.1 * b);
      typed.a = a;
      also.a = b;
    });
    const cross = ramp(q, 0.4, 0.6);
    parcels.put(0, -0.3, mix(0.26, -0.04, cross));
    parcelBack.put(0, 0.35, mix(-0.04, 0.26, cross));
    parcels.a = band(q, 0.38, 0.42, 0.58, 0.62);
    parcelBack.a = parcels.a;
    verdict.a = ramp(q, 0.8, 0.92);
  };
  return act;
};

/** Catch-up: each side says what it has seen, and only the gap travels. */
export const catchUp = () => {
  const act = new Act();
  const sides = [-0.66, 0.66].map((x, side) => {
    act.rect(x, 0, 0.8, 0.9);
    act.label(side === 0 ? 'PHONE' : 'MAC, BACK ONLINE', x, 0.54);
    ['P', 'M', 'I'].forEach((name, i) => act.label(name, x - 0.2 + i * 0.2, -0.4));
    act.seg(x - 0.32, -0.32, x + 0.32, -0.32, { tone: 'dim' });
    return { x, columns: act.bars(3), wide: act.bars(3) };
  });
  const gap = act.rect(0.46, 0.12, 0.1, 0.24, { tone: 'accent', dashed: true });
  const hello = act.dots(2, 5);
  const facts = act.dots(3, 6, { tone: 'accent' });
  const said = act.label('“HERE IS HOW FAR I HAVE SEEN, PER DEVICE”', 0, 0.7);
  const manifest = act.label('MANIFEST: 3 FACTS COMING', 0, -0.56, 'center', 'accent');
  const verdict = act.label('ONLY THE GAP TRAVELS · NEVER THE WHOLE LIBRARY', 0, -0.72, 'center', 'ink');
  act.play = (q) => {
    const filled = ramp(q, 0.58, 0.8);
    const heights = [[0.56, 0.4, 0.32], [mix(0.32, 0.56, filled), 0.4, 0.32]];
    sides.forEach(({ x, columns, wide }, side) => heights[side].forEach((h, i) => {
      columns.put(i, x - 0.22 + i * 0.2, -0.32, h);
      wide.put(i, x - 0.18 + i * 0.2, -0.32, h);
    }));
    sides[1].columns.tone = filled > 0.98 ? 'safe' : 'ink';
    sides[1].wide.tone = sides[1].columns.tone;
    const cross = ramp(q, 0.14, 0.3);
    hello.put(0, mix(-0.24, 0.24, cross), 0.3);
    hello.put(1, mix(0.24, -0.24, cross), 0.2);
    hello.a = band(q, 0.12, 0.16, 0.28, 0.32);
    said.a = band(q, 0.1, 0.18, 0.4, 0.46);
    gap.a = band(q, 0.32, 0.4, 0.74, 0.8);
    manifest.a = band(q, 0.4, 0.48, 0.8, 0.86);
    for (let i = 0; i < 3; i += 1) {
      const k = turn(q, i, 3, 0.5, 0.76, 1.2);
      facts.put(i, mix(-0.24, 0.4, k), 0.0 + i * 0.08);
    }
    facts.a = band(q, 0.48, 0.52, 0.76, 0.8);
    verdict.a = ramp(q, 0.8, 0.92);
  };
  return act;
};

const SLOTS = 8;
const slotX = (i: number, x = 0, w = 1.84) => x - w / 2 + (i + 0.5) * (w / SLOTS);

/** Audio is cut into pieces, and every piece is hashed before it goes anywhere. */
export const pieces = () => {
  const act = new Act();
  const audio = act.wave(0, 0.42, 1.84, 110, 0.15);
  const cuts = act.segs(Array.from({ length: SLOTS + 1 }, (_, i) => [-0.92 + i * 0.23, 0.22, 0, -0.92 + i * 0.23, 0.62, 0]).flat(), { tone: 'dim', dashed: true });
  act.label('ONE RECORDING', -0.92, 0.7, 'left');
  const size = act.label('4 MIB PIECES', 0.92, 0.7, 'right');
  const hashes = Array.from({ length: SLOTS }, (_, i) => act.segs([slotX(i) - 0.04, 0.13, 0, slotX(i) + 0.04, 0.13, 0, slotX(i) - 0.04, 0.09, 0, slotX(i) + 0.04, 0.09, 0, slotX(i) - 0.015, 0.06, 0, slotX(i) - 0.015, 0.16, 0, slotX(i) + 0.02, 0.06, 0, slotX(i) + 0.02, 0.16, 0], { tone: 'dim' }));
  const hashed = act.label('EACH PIECE GETS ITS OWN SHA-256 · SO DOES THE WHOLE FILE', 0, -0.02);
  const slots = Array.from({ length: SLOTS }, (_, i) => act.rect(slotX(i), -0.42, 0.2, 0.22, { tone: 'dim', dashed: true }));
  const flying = Array.from({ length: SLOTS }, () => act.rect(0, 0, 0.2, 0.22, { tone: 'single' }));
  const landed = Array.from({ length: SLOTS }, (_, i) => act.rect(slotX(i), -0.42, 0.2, 0.22, { tone: 'safe' }));
  act.label('THE OTHER DEVICE', -0.92, -0.22, 'left');
  const verdict = act.label('A PIECE IS CHECKED THE MOMENT IT LANDS · A BAD ONE IS FETCHED AGAIN, ALONE', 0, -0.66, 'center', 'ink');
  act.play = (q) => {
    audio.r = ramp(q, 0.02, 0.16);
    cuts.r = ramp(q, 0.14, 0.26);
    size.a = ramp(q, 0.2, 0.28);
    hashes.forEach((hash, i) => { hash.a = turn(q, i, SLOTS, 0.24, 0.42); });
    hashed.a = ramp(q, 0.3, 0.42);
    slots.forEach((slot) => { slot.a = ramp(q, 0.36, 0.44); });
    flying.forEach((piece, i) => {
      const k = turn(q, i, SLOTS, 0.44, 0.84, 1.4);
      piece.at(slotX(i), mix(0.42, -0.42, k)).a = band(k, 0.0, 0.08, 0.92, 1);
      landed[i].a = ramp(k, 0.92, 1);
    });
    verdict.a = ramp(q, 0.78, 0.9);
  };
  return act;
};

/** A dropped connection costs nothing, and two devices can share the sending. */
export const resume = () => {
  const act = new Act();
  const mac = device(act, -0.95, 0.36, 'MAC');
  const ipad = device(act, -0.95, -0.36, 'IPAD');
  const phone = act.rect(0.42, 0, 1.2, 0.5);
  act.label('PHONE, FETCHING', 0.42, 0.34);
  const slots = Array.from({ length: SLOTS }, (_, i) => act.rect(slotX(i, 0.42, 1.08), 0, 0.115, 0.26, { tone: 'dim', dashed: true }));
  const landed = Array.from({ length: SLOTS }, (_, i) => act.rect(slotX(i, 0.42, 1.08), 0, 0.115, 0.26, { tone: 'safe' }));
  const fromMac = act.seg(-0.8, 0.36, -0.18, 0.06, { tone: 'dim' });
  const fromIpad = act.seg(-0.8, -0.36, -0.18, -0.06, { tone: 'dim' });
  const cut = act.segs([-0.55, 0.3, 0, -0.43, 0.16, 0, -0.55, 0.16, 0, -0.43, 0.3, 0], { tone: 'accent' });
  const flying = act.dots(SLOTS, 8, { tone: 'single' });
  const dropped = act.label('CONNECTION DROPS', -0.49, 0.42, 'center', 'accent');
  const journal = act.label('JOURNAL ON DISK: 3 PIECES VERIFIED', 0.42, -0.34);
  const again = act.label('RESUMES AT PIECE 4, NOT AT ZERO · AND THE IPAD JOINS IN', 0.42, -0.48, 'center', 'ink');
  const verdict = act.label('WHOLE-FILE SHA-256 MATCHES · ONLY NOW DOES IT COUNT AS A COPY', 0, -0.72, 'center', 'safe');
  void mac; void ipad;
  act.play = (q) => {
    const down = band(q, 0.3, 0.34, 0.46, 0.5);
    fromMac.a = 1 - down * 0.85;
    fromIpad.a = ramp(q, 0.5, 0.56);
    cut.a = down;
    dropped.a = down;
    journal.a = band(q, 0.3, 0.36, 0.86, 0.9);
    again.a = band(q, 0.5, 0.56, 0.86, 0.9);
    for (let i = 0; i < SLOTS; i += 1) {
      const viaIpad = i >= 6;
      const k = i < 3 ? turn(q, i, 3, 0.08, 0.3, 1.3) : viaIpad ? turn(q, i - 6, 2, 0.56, 0.84, 1.2) : turn(q, i - 3, 3, 0.54, 0.84, 1.3);
      const from: XY = viaIpad ? [-0.8, -0.36] : [-0.8, 0.36];
      const [x, y] = between(from, [slotX(i, 0.42, 1.08), 0], k);
      flying.put(i, k > 0 && k < 1 ? x : 9, y);
      landed[i].a = ramp(k, 0.94, 1);
      slots[i].a = 1 - landed[i].a;
    }
    phone.tone = q > 0.88 ? 'safe' : 'ink';
    verdict.a = ramp(q, 0.86, 0.94);
  };
  return act;
};

/** Two lanes between every pair: a heavy transfer cannot starve the heartbeat. */
export const lanes = () => {
  const act = new Act();
  device(act, -0.98, 0, 'PHONE', 0.26, 0.5);
  device(act, 0.98, 0, 'MAC', 0.26, 0.5);
  act.seg(-0.85, 0.15, 0.85, 0.15);
  act.seg(-0.85, -0.15, 0.85, -0.15);
  act.label('CONTROL · HEARTBEATS, FACTS, ACKNOWLEDGEMENTS', 0, 0.26);
  act.label('BULK · AUDIO PIECES AND NOTHING ELSE', 0, -0.3);
  const beats = act.dots(6, 4);
  const bulk = act.dots(16, 9, { tone: 'single' });
  const pulse = act.poly([[-0.08, 0], [-0.04, 0], [-0.02, 0.07], [0.01, -0.05], [0.03, 0], [0.08, 0]], { tone: 'safe' });
  const verdict = act.label('THE WATCHDOG LISTENS ON THE QUIET LANE · A FULL PIPE NEVER LOOKS LIKE A DEAD PEER', 0, -0.62, 'center', 'ink');
  act.play = (q, t) => {
    for (let i = 0; i < 6; i += 1) beats.put(i, mix(-0.85, 0.85, (t * 0.16 + i / 6) % 1), 0.15);
    const load = ramp(q, 0.18, 0.6);
    for (let i = 0; i < 16; i += 1) {
      const on = i < 2 + load * 14;
      bulk.put(i, on ? mix(0.85, -0.85, (t * 0.22 + i / 16) % 1) : 9, -0.15);
    }
    pulse.at(0, 0.5).a = ramp(q, 0.3, 0.42) * (0.4 + 0.6 * Math.abs(Math.sin(t * 2.4)));
    verdict.a = ramp(q, 0.62, 0.78);
  };
  return act;
};

/** Discovery in a room with no internet: a real 3D room, seen from above. */
export const discovery = () => {
  const act = new Act();
  act.flat = false;
  const walls = act.solid(new THREE.BoxGeometry(2.1, 1.5, 0.62), { tone: 'dim', dashed: true });
  walls.object.position.z = 0.31;
  const spots: XY[] = [[-0.62, -0.32], [0.55, 0.36], [0.62, -0.42], [-0.3, 0.42]];
  const names = ['PHONE', 'MAC', 'IPAD', 'WINDOWS PC'];
  const boxes = spots.map(([x, y], i) => ({ box: act.rect(x, y, 0.2, 0.14), tag: act.label(names[i], x, y - 0.14) }));
  const rings = [0, 1, 2].map(() => act.circle(spots[0][0] as number, spots[0][1] as number, 1, { tone: 'accent' }, 72));
  const shout = act.label('“I AM HERE” · A DEVICE NAME AND A KEY · NEVER YOUR NAME', 0, -1.05, 'center', 'ink');
  const roof = act.label('NO INTERNET IN THIS ROOM', 0, 0.96);
  act.play = (q, t) => {
    act.group.rotation.set(-0.95, 0, -0.35 + (q - 0.5) * 0.7 + t * 0.03);
    act.group.position.set(0, 0.05, 0);
    act.group.scale.setScalar(0.66);
    walls.r = ramp(q, 0.02, 0.3);
    rings.forEach((ring, i) => {
      const k = (t * 0.28 + i / 3) % 1;
      ring.object.scale.setScalar(0.05 + k * 1.35);
      ring.a = (1 - k) * ramp(q, 0.12, 0.24);
    });
    boxes.forEach(({ box, tag }, i) => {
      const reach = Math.hypot((spots[i][0] as number) - (spots[0][0] as number), (spots[i][1] as number) - (spots[0][1] as number)) / 1.4;
      const heard = ramp(q, 0.24 + reach * 0.3, 0.34 + reach * 0.3);
      box.tone = i === 0 ? 'accent' : heard > 0.5 ? 'safe' : 'ink';
      tag.a = i === 0 ? 1 : 0.4 + 0.6 * heard;
    });
    shout.a = ramp(q, 0.2, 0.34);
    roof.a = ramp(q, 0.08, 0.2);
  };
  return act;
};

/** Pairing by QR: the first introduction, when no network connects them yet. */
export const pairing = () => {
  const act = new Act();
  act.rect(-0.6, 0.04, 0.86, 0.86);
  act.label('MAC · SHOWS A CODE', -0.6, 0.58);
  const N = 11;
  const cell = 0.06;
  const finder = [[0, 0], [0, N - 3], [N - 3, 0]].map(([cx, cy]) => act.rect(-0.6 - (N * cell) / 2 + (cx + 1.5) * cell, 0.04 - (N * cell) / 2 + (cy + 1.5) * cell, cell * 3, cell * 3));
  const lit: [number, number][] = [];
  for (let x = 0; x < N; x += 1) {
    for (let y = 0; y < N; y += 1) {
      const corner = (x < 3 && y < 3) || (x < 3 && y > N - 4) || (x > N - 4 && y < 3);
      if (!corner && Math.sin(x * 12.9 + y * 78.2) * 43758.5 % 1 > 0.08) lit.push([x, y]);
    }
  }
  const cells = act.dots(lit.length, 5);
  lit.forEach(([x, y], i) => cells.put(i, -0.6 - (N * cell) / 2 + (x + 0.5) * cell, 0.04 - (N * cell) / 2 + (y + 0.5) * cell));
  act.rect(0.72, 0.04, 0.42, 0.78);
  act.label('PHONE · SCANS IT', 0.72, 0.54);
  const finderFrame = act.segs([0.58, 0.22, 0, 0.58, 0.3, 0, 0.58, 0.3, 0, 0.66, 0.3, 0, 0.86, 0.22, 0, 0.86, 0.3, 0, 0.86, 0.3, 0, 0.78, 0.3, 0, 0.58, -0.14, 0, 0.58, -0.22, 0, 0.58, -0.22, 0, 0.66, -0.22, 0, 0.86, -0.14, 0, 0.86, -0.22, 0, 0.86, -0.22, 0, 0.78, -0.22, 0], { tone: 'dim' });
  const sweep = act.seg(0.58, 0, 0.86, 0, { tone: 'accent' });
  const holds = act.label('NODE ID · RELAY · DEVICE · A ONE-TIME TOKEN, GOOD FOR 5 MINUTES', -0.6, -0.5, 'center');
  const edge = act.seg(-0.17, 0.04, 0.51, 0.04, { tone: 'safe' });
  const verdict = act.label('BOTH SIDES CONFIRM · A TRUST EDGE EXISTS · NO ACCOUNT WAS INVOLVED', 0, -0.72, 'center', 'ink');
  void finderFrame;
  act.play = (q, t) => {
    finder.forEach((f, i) => { f.r = ramp(q, 0.06 + i * 0.03, 0.2 + i * 0.03); });
    cells.r = ramp(q, 0.14, 0.42);
    holds.a = ramp(q, 0.3, 0.44);
    sweep.at(0, 0.04 + Math.sin(t * 2.6) * 0.22).a = band(q, 0.42, 0.48, 0.64, 0.7);
    edge.r = ramp(q, 0.66, 0.8);
    verdict.a = ramp(q, 0.78, 0.9);
  };
  return act;
};

/** Trust is a graph: pair once and the set syncs; remove one and the rest hold. */
export const trust = () => {
  const act = new Act();
  const at: XY[] = [[-0.85, 0.3], [-0.15, 0.48], [0.62, 0.3], [0.2, -0.36], [-0.62, -0.4]];
  const names = ['PHONE', 'MAC', 'IPAD', 'WINDOWS PC', 'ANDROID'];
  const paired: [number, number][] = [[0, 1], [1, 2], [1, 3], [0, 4]];
  const implied: [number, number][] = [[0, 2], [0, 3], [4, 1], [2, 3], [4, 3]];
  const nodes = at.map(([x, y], i) => ({ box: act.rect(x, y, 0.16, 0.12), tag: act.label(names[i], x, y + 0.13) }));
  const solid = paired.map(([a, b]) => act.seg(at[a][0], at[a][1], at[b][0], at[b][1]));
  const dashed = implied.map(([a, b]) => act.seg(at[a][0], at[a][1], at[b][0], at[b][1], { tone: 'dim', dashed: true }));
  const mark = act.circle(0.36, -0.44, 0.07, { tone: 'accent' });
  const once = act.label('YOU PAIRED FOUR TIMES', 0, 0.72);
  const closure = act.label('…AND EVERY DEVICE NOW SYNCS WITH EVERY OTHER', 0, 0.72, 'center', 'ink');
  const removed = act.label('REMOVE ONE: A MARK ON THAT DEVICE ALONE · THE OTHERS STAY CONNECTED', 0, -0.72, 'center', 'ink');
  act.play = (q) => {
    const gone = ramp(q, 0.72, 0.84);
    solid.forEach((edge, i) => { edge.r = turn(q, i, solid.length, 0.08, 0.36); edge.a = paired[i].includes(3) ? 1 - gone * 0.85 : 1; });
    dashed.forEach((edge, i) => { edge.r = turn(q, i, dashed.length, 0.42, 0.64); edge.a = implied[i].includes(3) ? 1 - gone : 1; });
    once.a = band(q, 0.06, 0.14, 0.4, 0.46);
    closure.a = ramp(q, 0.46, 0.56);
    mark.r = gone;
    nodes[3].box.tone = gone > 0.5 ? 'accent' : 'ink';
    nodes[3].tag.a = 1 - gone * 0.6;
    removed.a = ramp(q, 0.8, 0.92);
  };
  return act;
};

const network = (act: Act, x: number, name: string) => {
  const side = x < 0 ? 1 : -1; // which way the inner wall faces
  const inner = x + side * 0.42;
  act.poly([[inner, 0.5], [x - side * 0.42, 0.5], [x - side * 0.42, -0.5], [inner, -0.5]], { tone: 'dim' });
  act.label(name, x, 0.6);
  const upper = act.seg(0, 0, 0, 0.5, { tone: 'dim' });
  const lower = act.seg(0, 0, 0, -0.5, { tone: 'dim' });
  act.rect(x - side * 0.12, 0, 0.2, 0.14);
  return { inner, open(gap: number) { upper.at(inner, gap).object.scale.y = (0.5 - gap) / 0.5; lower.at(inner, -gap).object.scale.y = (0.5 - gap) / 0.5; } };
};

/** Apart: introduced by key, then both sides reach out at once and meet. */
export const punch = () => {
  const act = new Act();
  const home = network(act, -0.72, 'HOME NETWORK');
  const studio = network(act, 0.72, 'STUDIO NETWORK');
  const meet = act.circle(0, 0.62, 0.06, { tone: 'dim' });
  const askLeft = act.seg(-0.5, 0.06, -0.04, 0.58, { tone: 'dim', dashed: true });
  const askRight = act.seg(0.5, 0.06, 0.04, 0.58, { tone: 'dim', dashed: true });
  const intro = act.label('A RELAY INTRODUCES THEM · BY KEY, NOT BY NAME', 0, 0.78);
  const shots = act.dots(2, 6, { tone: 'single' });
  const direct = act.seg(-0.5, 0, 0.5, 0, { tone: 'accent' });
  const both = act.label('BOTH REACH OUT AT THE SAME INSTANT · EACH WALL OPENS FOR ITS OWN DEVICE', 0, -0.64, 'center');
  const verdict = act.label('DIRECT · THE RELAY STEPS ASIDE', 0, -0.78, 'center', 'ink');
  act.play = (q) => {
    askLeft.r = ramp(q, 0.08, 0.22);
    askRight.r = askLeft.r;
    const helped = 1 - ramp(q, 0.62, 0.74);
    askLeft.a = helped; askRight.a = helped; meet.a = 0.3 + 0.7 * helped;
    intro.a = band(q, 0.1, 0.2, 0.6, 0.68);
    const fire = ramp(q, 0.3, 0.52);
    shots.put(0, mix(-0.5, 0.3, fire), 0.02);
    shots.put(1, mix(0.5, -0.3, fire), -0.02);
    shots.a = band(q, 0.28, 0.32, 0.5, 0.54);
    const gap = 0.07 * ramp(q, 0.36, 0.5);
    home.open(gap);
    studio.open(gap);
    both.a = band(q, 0.3, 0.4, 0.86, 0.9);
    direct.r = ramp(q, 0.54, 0.7);
    verdict.a = ramp(q, 0.7, 0.82);
  };
  return act;
};

/** When a wall will not open: a relay that forwards what it cannot read. */
export const relay = () => {
  const act = new Act();
  const home = network(act, -0.72, 'HOME NETWORK');
  const studio = network(act, 0.72, 'A STRICT NETWORK');
  act.seg(0.27, -0.5, 0.27, 0.5, { tone: 'ink' });
  const ring = act.circle(0, 0.6, 0.09);
  act.label('RELAY', 0, 0.76);
  const up = act.poly([[-0.62, 0.07], [-0.62, 0.6], [-0.09, 0.6]], { dashed: true });
  const down = act.poly([[0.09, 0.6], [0.62, 0.6], [0.62, 0.07]], { dashed: true });
  const sealed = [0, 1, 2].map(() => act.rect(0, 0, 0.07, 0.07, { tone: 'single' }));
  const keys = [-0.84, 0.84].map((x) => [act.circle(x, -0.2, 0.03, { tone: 'safe' }, 20), act.seg(x, -0.23, x, -0.34, { tone: 'safe' })]);
  const keyed = act.label('THE KEYS LIVE ON YOUR TWO DEVICES AND NOWHERE ELSE', 0, -0.62);
  const blind = act.label('QUIC · TLS 1.3 · THE RELAY FORWARDS SEALED PACKETS IT CANNOT OPEN, AND KEEPS NOTHING', 0, -0.78, 'center', 'ink');
  void ring;
  act.play = (q, t) => {
    home.open(0.07);
    studio.open(0);
    up.r = ramp(q, 0.1, 0.3);
    down.r = ramp(q, 0.26, 0.46);
    sealed.forEach((packet, i) => {
      const k = (t * 0.2 + i / 3) % 1;
      const path: XY[] = [[-0.62, 0.07], [-0.62, 0.6], [0.62, 0.6], [0.62, 0.07]];
      const leg = Math.min(2, Math.floor(k * 3));
      const [x, y] = between(path[leg], path[leg + 1], k * 3 - leg);
      packet.at(x, y).a = ramp(q, 0.4, 0.5);
    });
    keys.flat().forEach((stroke) => { stroke.a = ramp(q, 0.5, 0.62); });
    keyed.a = ramp(q, 0.54, 0.66);
    blind.a = ramp(q, 0.68, 0.82);
  };
  return act;
};

/** Replicas: amber until a verified copy is on every device. Then lose one. */
export const replicas = () => {
  const act = new Act();
  const hubs: XY[] = [[-0.85, -0.38], [0, 0.52], [0.85, -0.38]];
  const names = ['PHONE', 'MAC', 'IPAD'];
  const boxes = hubs.map(([x, y], i) => ({ box: act.rect(x, y, 0.22, 0.16), tag: act.label(names[i], x, y + 0.16) }));
  const COUNT = 15;
  const amber = act.dots(COUNT, 7, { tone: 'single' });
  const green = act.dots(COUNT, 7, { tone: 'safe' });
  const lost = act.segs([-0.97, -0.5, 0, -0.73, -0.26, 0, -0.97, -0.26, 0, -0.73, -0.5, 0], { tone: 'accent' });
  const one = act.label('AMBER · NOT ON EVERY DEVICE YET', 0, -0.62, 'center', 'single');
  const all = act.label('GREEN · A VERIFIED COPY ON EVERY DEVICE YOU HAVE PAIRED', 0, -0.62, 'center', 'safe');
  const verdict = act.label('LOSE A PHONE AND NOTHING IS MISSING · EVERY COPY WAS A WHOLE COPY', 0, -0.78, 'center', 'ink');
  act.play = (q, t) => {
    const gone = ramp(q, 0.78, 0.88);
    for (let i = 0; i < COUNT; i += 1) {
      const hub = hubs[i % 3];
      const startX = (hub[0] as number) * 0.62 + Math.sin(i * 2.3) * 0.16;
      const startY = (hub[1] as number) * 0.62 + Math.cos(i * 1.7) * 0.12;
      const restX = Math.sin(i * 1.1) * 0.24 + gone * 0.2;
      const restY = -0.06 + Math.cos(i * 2.9) * 0.16 + gone * 0.12;
      const k = turn(q, i, COUNT, 0.14, 0.7, 2.2);
      const x = mix(startX, restX, k) + Math.sin(t * 0.7 + i) * 0.008;
      const y = mix(startY, restY, k) + Math.cos(t * 0.6 + i * 2) * 0.008;
      const done = k > 0.97;
      amber.put(i, done ? 9 : x, y);
      green.put(i, done ? x : 9, y);
    }
    one.a = band(q, 0.08, 0.16, 0.5, 0.58);
    all.a = band(q, 0.58, 0.66, 0.96, 1.2);
    lost.a = gone;
    boxes[0].box.tone = gone > 0.5 ? 'accent' : 'ink';
    boxes[0].box.a = 1 - gone * 0.6;
    boxes[0].tag.a = 1 - gone * 0.6;
    verdict.a = ramp(q, 0.84, 0.94);
  };
  return act;
};
