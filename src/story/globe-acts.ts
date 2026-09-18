// The acts that happen on, or just above, the wire globe.
import * as THREE from 'three';
import { Act, band, clamp01, type Label, ramp, STILL, type Stroke, turn, type Tone, type XY } from './kit';

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
 * offset grows with the distance to keep the words clear of the mark.
 */
const beside = (act: Act, globe: Globe, label: Label, at: THREE.Vector3, dx: number, dy: number) => {
  tilt.copy(act.group.parent!.quaternion).invert().multiply(globe.camera.quaternion);
  const reach = Math.hypot(dx, dy);
  shift.set(dx, dy, 0).multiplyScalar((reach + 0.0045 * (globe.camera.position.length() - 1)) / reach);
  label.pos.copy(at).add(shift.applyQuaternion(tilt));
};

const phone = onGlobe(9, -13);
const laptop = onGlobe(3, -7);
const farAway = onGlobe(40, 46);
// The three feet between them, clear of both outlines.
const gapFrom = phone.clone().lerp(laptop, 0.3).normalize();
const gapTo = phone.clone().lerp(laptop, 0.66).normalize();
const gapMid = gapFrom.clone().lerp(gapTo, 0.5).normalize();
const PHONE: XY[] = [[-0.55, -1], [0.55, -1], [0.55, 1], [-0.55, 1]];
// The hinge, the screen, then the base; closing the path retraces the hinge.
const LAPTOP: XY[] = [[1, -0.45], [-1, -0.45], [-1, 0.85], [1, 0.85], [1, -0.45], [1.4, -0.75], [-1.4, -0.75], [-1, -0.45]];
const EARTH_KM = 6371;
const legs = [phone.angleTo(farAway) * EARTH_KM, farAway.angleTo(laptop) * EARTH_KM];
const km = (n: number) => `${Math.round(n).toLocaleString('en-US')} KM`;
const COPIES = 5;

/** The pieces acts 0 and 1 share, so one can hand over to the other unseen. */
const longWay = (act: Act, globe: Globe, homeward = false) => {
  glyph(act, phone, 0.026, 'ink', PHONE);
  glyph(act, laptop, 0.034, 'ink', LAPTOP);
  pin(act, act.wave(0, 0, 0.7, 5, 0.42, { tone: 'single' }), phone, 0.026);
  const landed = pin(act, act.wave(0, 0.2, 1.3, 9, 0.36, { tone: 'single' }), laptop, 0.034);
  const phoneName = act.label('PHONE', 0, 0);
  const macName = act.label('MAC', 0, 0);
  const server = glyph(act, farAway, 0.05);
  const racks = pin(act, act.segs([-1, 0.34, 0, 1, 0.34, 0, -1, -0.34, 0, 1, -0.34, 0]), farAway, 0.05);
  const copies = pin(act, act.dots(COPIES, 3.5, { tone: 'single' }), farAway, 0.05);
  for (let i = 0; i < COPIES; i += 1) copies.put(i, (i - (COPIES - 1) / 2) * 0.8, -1.6);
  const name = act.label('A DATA CENTRE, SOMEWHERE', 0, 0);
  const kept = act.label('', 0, 0, 'center', 'single');
  return {
    server, racks, copies, name, kept, landed,
    up: arc(act, phone, farAway, 0.26),
    // Drawn from the server when the parcel lays it, from the Mac when it is reeled back in.
    down: homeward ? arc(act, laptop, farAway, 0.16) : arc(act, farAway, laptop, 0.16),
    place() {
      beside(act, globe, phoneName, phone, 0, 0.038);
      beside(act, globe, macName, laptop, 0, -0.038);
      beside(act, globe, name, farAway, 0, 0.064);
      beside(act, globe, kept, farAway, 0, -0.1);
    },
    /** The data centre is holding `n` copies of your recording. */
    keeps(n: number) {
      copies.r = (n - 0.5) / COPIES;
      kept.say(`KEEPS ${n} ${n === 1 ? 'COPY' : 'COPIES'}`);
      kept.a = n > 0 ? 1 : 0;
    },
  };
};

const LEAVES = 1.4; // seconds after the page opens that the recording sets off
const LOOP = 6.4; // seconds for one round trip, the pause at each end included

/** Three feet apart, and the recording goes round the world: the distance is the joke. */
export const usualWay = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  const way = longWay(act, globe);
  const gap = arc(act, gapFrom, gapTo, 0, 'ink', false, 0.55);
  const feet = act.label('3 FT', 0, 0);
  const parcel = act.dots(1, 7, { tone: 'single' });
  const counter = act.label('', 0, 0, 'left', 'single');
  const near = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const spot = new THREE.Vector3();
  // Opens on the two devices, then pulls back as far as the recording has to go.
  act.pose = (_q, t) => {
    const k = ramp(t, 1.2, 4);
    near.copy(globe.focus).multiplyScalar(1 + 0.85 * globe.fit);
    return { pos: pos.lerpVectors(near, globe.wide, k), look: look.copy(globe.focus).multiplyScalar(1 - k) };
  };
  act.play = (_q, t) => {
    way.place();
    const since = Math.max(0, t - LEAVES) / LOOP;
    const lap = Math.floor(since);
    // Reduced motion holds the end of a trip: arrived, and the bill showing.
    const p = t >= STILL ? 0.9 : since % 1;
    const out = ramp(p, 0, 0.42);
    const back = ramp(p, 0.5, 0.9);
    way.up.r = lap > 0 ? 1 : out;
    way.down.r = lap > 0 ? 1 : back;
    way.landed.a = lap > 0 ? 1 : ramp(p, 0.88, 0.94);
    way.keeps(Math.min(COPIES, lap + (p >= 0.42 ? 1 : 0)));
    way.name.a = ramp(t, 1.8, 3);

    if (back > 0) along(way.down.points, back, spot);
    else along(way.up.points, out, spot);
    parcel.put(0, spot.x, spot.y, spot.z);
    parcel.a = ramp(p, 0, 0.03) * (1 - ramp(p, 0.92, 0.99));
    const total = legs[0] + legs[1];
    counter.say(p >= 0.9 ? `${km(total)} TO MOVE 3 FT` : km(legs[0] * out + legs[1] * back));
    counter.a = ramp(t, LEAVES + 0.1, LEAVES + 0.6);
    beside(act, globe, counter, spot, 0.045, 0);

    gap.r = ramp(t, 0.2, 0.8);
    feet.a = ramp(t, 0.4, 0.9);
    beside(act, globe, feet, gapMid, 0.014, 0.012);
  };
  return act;
};

/** The strike lands, the copies go, and the whole detour is reeled back in to three feet. */
export const deleted = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  const way = longWay(act, globe, true);
  const strike = pin(act, act.segs([-1.5, -1.5, 0, 1.5, 1.5, 0, -1.5, 1.5, 0, 1.5, -1.5, 0], { tone: 'accent' }), farAway, 0.075);
  const direct = arc(act, gapFrom, gapTo, 0, 'accent');
  const feet = act.label('3 FT', 0, 0, 'center', 'accent');
  const counter = act.label('', 0, 0, 'left', 'single');
  const shuttle = act.dots(1, 5, { tone: 'accent' });
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const spot = new THREE.Vector3();
  act.pose = (q) => {
    const k = ramp(q, 0.6, 1.05);
    return { pos: pos.lerpVectors(globe.wide, globe.close, k), look: look.copy(globe.focus).multiplyScalar(k) };
  };
  act.play = (q, t) => {
    way.place();
    strike.r = ramp(q, 0.12, 0.24);
    way.keeps(Math.round(COPIES * (1 - ramp(q, 0.2, 0.36))));
    const fade = 1 - ramp(q, 0.36, 0.48);
    [way.server, way.racks, way.copies, way.name, strike].forEach((mark) => { mark.a = fade; });
    way.kept.a *= fade;

    // Both arcs wind back to the devices they left from, and the distance with them.
    const left = 1 - ramp(q, 0.3, 0.58);
    way.up.r = left;
    way.down.r = left;
    counter.say(km((legs[0] + legs[1]) * left));
    counter.a = 1 - ramp(q, 0.54, 0.6);
    // Clear of the strike while the tip is still at the data centre.
    beside(act, globe, counter, along(way.up.points, left, spot), 0.045 + 0.075 * ramp(left, 0.9, 1), 0);

    direct.r = ramp(q, 0.56, 0.7);
    feet.a = ramp(q, 0.6, 0.7);
    beside(act, globe, feet, gapMid, 0.014, 0.012);
    // Three feet takes no time at all.
    along(direct.points, 0.5 - 0.5 * Math.cos(t * 4), spot);
    shuttle.put(0, spot.x, spot.y, spot.z);
    shuttle.a = ramp(q, 0.7, 0.78);
  };
  return act;
};

/** Down on the surface: one room, three devices, and what each of them holds. */
export const everyDevice = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 0;
  const places: [number, number, number, number, string][] = [[0, 0.6, 0.78, 0.5, 'MAC'], [-0.72, -0.42, 0.34, 0.56, 'PHONE'], [0.72, -0.42, 0.6, 0.44, 'IPAD']];
  const held = places.map(([x, y, w, h, name]) => {
    act.rect(x, y, w, h);
    act.label(name, x, y + h / 2 + 0.08);
    const rows = act.segs([0, 1, 2].flatMap((i) => [x - w * 0.36, y + h * (0.28 - i * 0.16), 0, x + w * (0.1 - i * 0.08), y + h * (0.28 - i * 0.16), 0]), { tone: 'ink', base: 0.85 });
    const sound = act.wave(x, y - h * 0.24, w * 0.74, 18, h * 0.12, { tone: 'ink', base: 0.85 });
    return { rows, sound };
  });
  act.segs(places.flatMap(([x, y], i) => [x, y, 0, places[(i + 1) % 3][0], places[(i + 1) % 3][1], 0]), { tone: 'dim', base: 0.6 });
  const facts = act.label('THE FACTS · NAMES, NOTES, PROJECTS · A DATABASE ON THE DEVICE', 0, -0.92, 'center', 'ink');
  const bytes = act.label('THE SOUND · THE AUDIO ITSELF · FILES ON ITS OWN DISK', 0, -1.04, 'center', 'ink');
  const pos = new THREE.Vector3();
  act.pose = () => ({ pos: pos.copy(globe.close), look: globe.focus });
  act.play = (q) => {
    act.group.position.copy(globe.focus);
    act.group.quaternion.copy(globe.camera.quaternion);
    act.group.scale.setScalar(0.15 * globe.fit);
    held.forEach(({ rows, sound }, i) => {
      rows.r = turn(q, i, 3, 0.16, 0.44);
      sound.r = turn(q, i, 3, 0.4, 0.7);
    });
    facts.a = ramp(q, 0.26, 0.4);
    bytes.a = ramp(q, 0.52, 0.66);
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
