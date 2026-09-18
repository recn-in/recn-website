// The acts that happen on, or just above, the wire globe.
import * as THREE from 'three';
import { Act, band, clamp01, type Label, mix, ramp, STILL, type Stroke, turn, type Tone, type XY } from './kit';

/** What the stage shares with globe acts; it refreshes these every frame. */
export interface Globe {
  wide: THREE.Vector3; // camera, seeing the whole globe
  close: THREE.Vector3; // camera, just above `home`
  focus: THREE.Vector3; // `home`, in world space
  camera: THREE.PerspectiveCamera;
  fit: number;
}

export const onGlobe = (lat: number, lon: number, r = 1) => {
  const a = THREE.MathUtils.degToRad(lat);
  const o = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(r * Math.cos(a) * Math.sin(o), r * Math.sin(a), r * Math.cos(a) * Math.cos(o));
};
export const HOME = onGlobe(6, -10);

const arc = (act: Act, from: THREE.Vector3, to: THREE.Vector3, lift: number, tone: Tone = 'ink', dashed = false, base = 1) => {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 72; i += 1) {
    const t = i / 72;
    points.push(from.clone().lerp(to, t).normalize().multiplyScalar(1 + lift * Math.sin(Math.PI * t)));
  }
  return Object.assign(act.poly(points, { tone, dashed, base }), { points });
};
/** The point `k` of the way along an arc's points, between the samples. */
const along = (points: THREE.Vector3[], k: number, out: THREE.Vector3) => {
  const at = clamp01(k) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(at));
  return out.lerpVectors(points[i], points[i + 1], at - i);
};
/** Pins a flat mark to the globe; the stage keeps it facing the viewer. */
const pin = <S extends Stroke>(act: Act, stroke: S, at: THREE.Vector3, size: number) => {
  stroke.object.position.copy(at);
  stroke.object.scale.setScalar(size);
  act.facing.push(stroke.object);
  return stroke;
};
const SQUARE: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
const glyph = (act: Act, at: THREE.Vector3, size: number, tone: Tone = 'ink', shape = SQUARE) => pin(act, act.poly(shape, { tone, closed: true }), at, size);
const tag = (act: Act, text: string, at: THREE.Vector3, lift = 1.09) => {
  const label = act.label(text, 0, 0);
  label.pos.copy(at).multiplyScalar(lift);
  return label;
};
const tilt = new THREE.Quaternion();
const shift = new THREE.Vector3();
/**
 * Holds a label `dx, dy` across and up the screen from a point on the globe.
 * The marks shrink as the camera pulls back and the type does not, so the
 * offset grows with the distance (by `clear`) to keep the words off the mark.
 */
const beside = (act: Act, globe: Globe, label: Label, at: THREE.Vector3, dx: number, dy: number, clear = 0.0045) => {
  tilt.copy(act.group.parent!.quaternion).invert().multiply(globe.camera.quaternion);
  const reach = Math.hypot(dx, dy);
  shift.set(dx, dy, 0).multiplyScalar((reach + clear * (globe.camera.position.length() - 1)) / reach);
  label.pos.copy(at).add(shift.applyQuaternion(tilt));
};

// The desk: a patch of ground at HOME small enough to be one point on the
// globe. Devices are drawn in desk units (a phone is one unit tall); the story
// opens this close, and the whole desk is a dot by the time the globe fits.
const DESK = 0.012;
const DESK_WIDE = 2.75;
const DESK_TALL = 1.6;
const out = HOME.clone().normalize();
const east = new THREE.Vector3(0, 1, 0).cross(out).normalize();
const north = out.clone().cross(east);
const onDesk = (x: number, y: number) => HOME.clone().addScaledVector(east, x * DESK).addScaledVector(north, y * DESK);
const desk = (act: Act) => {
  const group = new THREE.Group();
  group.position.copy(HOME);
  group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(east, north, out));
  group.scale.setScalar(DESK);
  act.group.add(group);
  return group;
};

const rounded = (w: number, h: number, r: number) => {
  const points: XY[] = [];
  [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], corner) => {
    for (let i = 0; i <= 6; i += 1) {
      const a = ((corner + i / 6) * Math.PI) / 2;
      points.push([sx * (w / 2 - r) + Math.cos(a) * r, sy * (h / 2 - r) + Math.sin(a) * r]);
    }
  });
  return points;
};
type Kind = 'phone' | 'mac' | 'ipad';
const SCREEN: Record<Kind, [number, number]> = { phone: [0.5, 1], mac: [1.5, 1], ipad: [1.3, 0.95] };
/** A device you would recognise without its name, holding a recording (and, in `rows`, the facts about it). */
const device = (act: Act, kind: Kind, parent: THREE.Object3D) => {
  const body = new THREE.Group();
  parent.add(body);
  const put = <S extends Stroke>(stroke: S) => { body.add(stroke.object); return stroke; };
  const [w, h] = SCREEN[kind];
  const lines = [put(act.poly(rounded(w, h, kind === 'mac' ? 0.05 : 0.09), { closed: true }))];
  if (kind === 'phone') lines.push(put(act.seg(-0.07, 0.42, 0.07, 0.42)), put(act.seg(-0.08, -0.44, 0.08, -0.44, { base: 0.6 })));
  if (kind === 'ipad') lines.push(put(act.seg(-0.12, -0.41, 0.12, -0.41, { base: 0.6 })));
  if (kind === 'mac') {
    lines[0].object.position.y = 0.05;
    lines.push(put(act.poly([[-0.96, -0.49], [0.96, -0.49], [0.9, -0.56], [-0.9, -0.56]], { closed: true })), put(act.seg(-0.13, -0.49, 0.13, -0.49, { base: 0.6 })));
  }
  const rows = put(act.segs([0, 1].flatMap((i) => [-w * 0.34, 0.26 - i * 0.13, 0, w * (0.12 - i * 0.14), 0.26 - i * 0.13, 0]), { base: 0.85 }));
  const sound = put(act.wave(0, -0.12, w * 0.68, Math.round(w * 16), 0.13, { tone: 'single' }));
  rows.r = 0;
  return { body, lines, rows, sound };
};
const big = (label: Label) => { label.el.dataset.size = 'big'; return label; };

const phoneSpot: [number, number] = [-0.95, 0];
const macSpot: [number, number] = [0.75, 0];
const phone = onDesk(...phoneSpot);
const laptop = onDesk(...macSpot);
const farAway = onGlobe(40, 46);
// The three feet between them: from the phone's edge to the Mac's.
const GAP: [number, number] = [-0.6, -0.1];
const gapMid = onDesk((GAP[0] + GAP[1]) / 2, 0);
const EARTH_KM = 6371;
const legs = [phone.angleTo(farAway) * EARTH_KM, farAway.angleTo(laptop) * EARTH_KM];
const km = (n: number) => `${Math.round(n).toLocaleString('en-US')} KM`;
const COPIES = 5;

const TAN = Math.tan(THREE.MathUtils.degToRad(15)); // half the stage camera's field of view
/**
 * How far above the desk the camera sits for `w` by `h` desk units to fit: half
 * the screen's height, and half its width, or a third where the stage has slid
 * the picture aside to make room for the words.
 */
const above = (globe: Globe, w: number, h: number) => {
  const aside = (globe.camera.view?.offsetX ?? 0) < 0;
  return (DESK * Math.max(w / (globe.camera.aspect * (aside ? 0.32 : 0.5)), h / 0.5)) / (2 * TAN);
};
const heading = new THREE.Vector3();
const wideWay = new THREE.Vector3();
/**
 * The camera `k` of the way from just above the desk out to the whole globe.
 * The distance grows by ratio, not by amount, so the desk shrinks to a point at
 * a steady pace and the planet arrives around it: distance, felt as scale.
 */
const flight = (globe: Globe, k: number, pos: THREE.Vector3, look: THREE.Vector3) => {
  const from = above(globe, DESK_WIDE, DESK_TALL);
  const to = globe.wide.length();
  const d = from * (to / from) ** k;
  const open = (d - from) / (to - from);
  look.copy(globe.focus).multiplyScalar(1 - open);
  heading.copy(globe.focus).normalize().lerp(wideWay.copy(globe.wide).normalize(), open).normalize();
  return { pos: pos.copy(look).addScaledVector(heading, d), look };
};

/** The pieces acts 0 and 1 share, so one can hand over to the other unseen. */
const longWay = (act: Act, globe: Globe, homeward = false) => {
  const room = desk(act);
  const sender = device(act, 'phone', room);
  const receiver = device(act, 'mac', room);
  sender.body.position.set(...phoneSpot, 0);
  receiver.body.position.set(...macSpot, 0);
  const onTheDesk = [sender, receiver].flatMap((held) => [...held.lines, held.sound]);
  const here = act.dots(1, 5);
  here.put(0, HOME.x, HOME.y, HOME.z);
  const feet = big(act.label('3 FT', 0, 0, 'center', 'ink'));
  const server = glyph(act, farAway, 0.05);
  const racks = pin(act, act.segs([-1, 0.34, 0, 1, 0.34, 0, -1, -0.34, 0, 1, -0.34, 0]), farAway, 0.05);
  const copies = pin(act, act.dots(COPIES, 3.5, { tone: 'single' }), farAway, 0.05);
  for (let i = 0; i < COPIES; i += 1) copies.put(i, (i - (COPIES - 1) / 2) * 0.8, -1.6);
  const name = act.label('A DATA CENTRE, SOMEWHERE', 0, 0);
  return {
    room, feet, server, racks, copies, name,
    landed: receiver.sound,
    up: arc(act, phone, farAway, 0.26),
    // Drawn from the server when the parcel lays it, from the Mac when it is reeled back in.
    down: homeward ? arc(act, laptop, farAway, 0.16) : arc(act, farAway, laptop, 0.16),
    /** `k` is how far the camera has pulled back: the desk gives way to one dot. */
    place(k: number) {
      const near = 1 - ramp(k, 0.78, 0.96);
      onTheDesk.forEach((stroke) => { stroke.a = near; });
      here.a = 1 - near;
      name.a = ramp(k, 0.6, 0.85);
      beside(act, globe, name, farAway, 0, 0.064);
      beside(act, globe, feet, gapMid, 0, -0.25 * DESK, 0.009);
    },
    /** The data centre is holding `n` copies of your recording. */
    keeps(n: number) { copies.r = (n - 0.5) / COPIES; },
  };
};

const LEAVES = 1.2; // seconds after the page opens that the recording sets off
const OUT = 5; // seconds to the data centre: long enough to feel
const REST = 0.6;
const BACK = 3.6;
const LOOP = OUT + REST + BACK + 2.2;

/** Three feet apart, and the recording goes round the world: the distance is the joke. */
export const usualWay = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  const way = longWay(act, globe);
  const rule = act.segs([GAP[0], 0, 0, GAP[1], 0, 0, GAP[0], -0.06, 0, GAP[0], 0.06, 0, GAP[1], -0.06, 0, GAP[1], 0.06, 0], { base: 0.55 });
  way.room.add(rule.object);
  const parcel = act.dots(1, 7, { tone: 'single' });
  const counter = big(act.label('', 0, 0, 'right', 'single'));
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const spot = new THREE.Vector3();
  const pulledBack = (t: number) => ramp(t, LEAVES + 0.2, LEAVES + OUT);
  // Opens on the desk, then pulls back as far as the recording has to go.
  act.pose = (_q, t) => flight(globe, pulledBack(t), pos, look);
  act.play = (_q, t) => {
    const k = pulledBack(t);
    way.place(k);
    rule.r = ramp(t, 0.2, 0.8);
    rule.a = 1 - ramp(k, 0.78, 0.96);
    way.feet.a = ramp(t, 0.4, 0.9);

    const lap = Math.floor(Math.max(0, t - LEAVES) / LOOP);
    // Reduced motion holds the end of a trip: arrived, and the bill showing.
    const s = t >= STILL ? OUT + REST + BACK : Math.max(0, t - LEAVES) % LOOP;
    const away = ramp(s, 0, OUT);
    const home = ramp(s, OUT + REST, OUT + REST + BACK);
    way.up.r = lap > 0 ? 1 : away;
    way.down.r = lap > 0 ? 1 : home;
    way.landed.a *= lap > 0 ? 1 : ramp(home, 0.97, 1);
    way.keeps(Math.min(COPIES, lap + (away >= 1 ? 1 : 0)));

    if (home > 0) along(way.down.points, home, spot);
    else along(way.up.points, away, spot);
    parcel.put(0, spot.x, spot.y, spot.z);
    parcel.a = ramp(s, 0, 0.15) * (1 - ramp(s, LOOP - 0.5, LOOP - 0.05));
    counter.say(km(legs[0] * away + legs[1] * home));
    counter.a = ramp(t, LEAVES + 0.1, LEAVES + 0.5);
    beside(act, globe, counter, spot, -0.45 * DESK, 0, 0.011);
  };
  return act;
};

/** The strike lands, the copies go, the detour is reeled back in, and we fall back to the desk. */
export const deleted = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  const way = longWay(act, globe, true);
  const strike = pin(act, act.segs([-1.5, -1.5, 0, 1.5, 1.5, 0, -1.5, 1.5, 0, 1.5, -1.5, 0], { tone: 'accent' }), farAway, 0.075);
  const direct = act.seg(GAP[0], 0, GAP[1], 0, { tone: 'accent' });
  way.room.add(direct.object);
  const counter = big(act.label('', 0, 0, 'right', 'single'));
  const shuttle = act.dots(1, 6, { tone: 'accent' });
  const ends = [onDesk(GAP[0], 0), onDesk(GAP[1], 0)];
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const spot = new THREE.Vector3();
  const pulledBack = (q: number) => 1 - ramp(q, 0.46, 0.82);
  act.pose = (q) => flight(globe, pulledBack(q), pos, look);
  act.play = (q, t) => {
    way.place(pulledBack(q));
    strike.r = ramp(q, 0.1, 0.2);
    way.keeps(Math.round(COPIES * (1 - ramp(q, 0.16, 0.32))));
    const fade = 1 - ramp(q, 0.32, 0.42);
    [way.server, way.racks, way.copies, strike].forEach((mark) => { mark.a = fade; });
    way.name.a *= fade;

    // Both arcs wind back to the devices they left from, and the distance with them.
    const left = 1 - ramp(q, 0.24, 0.5);
    way.up.r = left;
    way.down.r = left;
    counter.say(km((legs[0] + legs[1]) * left));
    counter.a = 1 - ramp(q, 0.48, 0.54);
    beside(act, globe, counter, laptop, -0.45 * DESK, 0, 0.011);

    direct.r = ramp(q, 0.76, 0.86);
    way.feet.tone = q > 0.76 ? 'accent' : 'ink';
    // Three feet takes no time at all.
    spot.lerpVectors(ends[0], ends[1], 0.5 - 0.5 * Math.cos(t * 5));
    shuttle.put(0, spot.x, spot.y, spot.z);
    shuttle.a = ramp(q, 0.84, 0.9);
  };
  return act;
};

/** Still at the desk: the iPad joins, and each of the three turns out to hold the whole thing. */
export const everyDevice = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 0;
  // Where each device sits when the act opens (as the last one left them), and where it settles.
  const places: [Kind, [number, number], [number, number]][] = [
    ['phone', phoneSpot, [-1.2, -0.78]],
    ['mac', macSpot, [-0.2, 0.8]],
    ['ipad', [3.4, -0.75], [0.8, -0.75]],
  ];
  const held = places.map(([kind]) => device(act, kind, act.group));
  // Between facing edges, not through the glass.
  const links = act.segs([[1, 0, 0.42, 0.64], [1, 2, 0.42, 0.66], [0, 2, 0.2, 0.62]].flatMap(([a, b, from, to]) => {
    const [ax, ay] = places[a][2];
    const [bx, by] = places[b][2];
    return [mix(ax, bx, from), mix(ay, by, from), 0, mix(ax, bx, to), mix(ay, by, to), 0];
  }), { tone: 'dim', base: 0.8 });
  const facts = act.label('THE FACTS', 0.95, 1.0, 'left', 'ink');
  const bytes = act.label('THE SOUND', 0.95, 0.68, 'left', 'ink');
  const pos = new THREE.Vector3();
  act.pose = () => ({ pos: pos.copy(globe.focus).multiplyScalar(1 + above(globe, 3.8, 3.3)), look: globe.focus });
  act.play = (q) => {
    act.group.position.copy(globe.focus);
    act.group.quaternion.copy(globe.camera.quaternion);
    act.group.scale.setScalar(DESK);
    const settled = ramp(q, 0.02, 0.26);
    held.forEach(({ body, lines, rows, sound }, i) => {
      const [, from, to] = places[i];
      body.position.set(mix(from[0], to[0], settled), mix(from[1], to[1], settled), 0);
      if (i === 2) lines.forEach((line) => { line.a = settled; });
      rows.r = turn(q, i, 3, 0.3, 0.5);
      // The phone and the Mac arrive holding the recording; the iPad gets its copy here.
      sound.r = i === 2 ? ramp(q, 0.52, 0.7) : 1;
    });
    links.r = ramp(q, 0.24, 0.42);
    facts.a = ramp(q, 0.34, 0.46);
    bytes.a = ramp(q, 0.58, 0.7);
  };
  return act;
};

const cityA = onGlobe(40, 28);
const cityB = onGlobe(-24, 46);
const relayAt = onGlobe(52, 2);

export const anywhere = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  act.turn = -0.4;
  [HOME, cityA, cityB].forEach((at) => glyph(act, at, 0.03));
  tag(act, 'YOU', HOME);
  tag(act, 'THE STUDIO', cityA);
  tag(act, 'ON TOUR', cityB);
  const ring: XY[] = Array.from({ length: 32 }, (_, i) => [Math.cos((i / 32) * Math.PI * 2), Math.sin((i / 32) * Math.PI * 2)]);
  const relay = glyph(act, relayAt, 0.045, 'dim', ring);
  const relayName = tag(act, 'RELAY', relayAt, 1.12);
  const byKey = arc(act, HOME, cityA, 0.22, 'accent');
  const up = arc(act, HOME, relayAt, 0.16, 'ink', true, 0.8);
  const down = arc(act, relayAt, cityB, 0.3, 'ink', true, 0.8);
  const parcels = act.dots(2, 6, { tone: 'single' });
  act.pose = () => ({ pos: globe.wide, look: new THREE.Vector3() });
  act.play = (q, t) => {
    byKey.r = ramp(q, 0.14, 0.36);
    relay.a = ramp(q, 0.4, 0.5);
    relayName.a = relay.a;
    up.r = ramp(q, 0.44, 0.6);
    down.r = ramp(q, 0.56, 0.74);
    const k = (t * 0.25) % 1;
    const direct = byKey.points[Math.floor(k * 72)];
    const hop = k < 0.5 ? up.points[Math.floor(k * 2 * 72)] : down.points[Math.floor((k * 2 - 1) * 72)];
    parcels.put(0, direct.x, direct.y, direct.z);
    parcels.put(1, hop.x, hop.y, hop.z);
    parcels.a = ramp(q, 0.74, 0.82);
  };
  return act;
};

export const lattice = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  act.turn = -0.4;
  act.drift = 0.06;
  const nodes = Array.from({ length: 22 }, (_, i) => onGlobe(Math.sin(i * 2.4) * 58, i * 47 + Math.cos(i * 1.3) * 20));
  const points = act.dots(nodes.length, 5);
  nodes.forEach((node, i) => points.put(i, node.x, node.y, node.z));
  // Each node reaches for its two nearest neighbours; a pair is drawn once.
  const pairs = new Set<string>();
  nodes.forEach((node, i) => [...nodes.keys()]
    .filter((j) => j !== i)
    .sort((x, y) => node.distanceTo(nodes[x]) - node.distanceTo(nodes[y]))
    .slice(0, 2)
    .forEach((j) => pairs.add(`${Math.min(i, j)}-${Math.max(i, j)}`)));
  const threads = [...pairs].map((pair, n) => {
    const [i, j] = pair.split('-').map(Number);
    return arc(act, nodes[i], nodes[j], 0.08, n % 5 === 0 ? 'accent' : 'ink', false, 0.7);
  });
  act.pose = () => ({ pos: globe.wide, look: new THREE.Vector3() });
  act.play = (q) => {
    // The page ends before this chapter's centre is passed: finish early.
    points.r = clamp01(ramp(q, 0.02, 0.2));
    threads.forEach((thread, i) => { thread.r = turn(q, i, threads.length, 0.08, 0.42, 3); });
  };
  void band;
  return act;
};
