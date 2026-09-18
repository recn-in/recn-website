// The acts that happen on, or just above, the wire globe.
import * as THREE from 'three';
import { Act, band, clamp01, ramp, turn, type Tone, type XY } from './kit';

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
const glyph = (act: Act, at: THREE.Vector3, size: number, tone: Tone = 'ink', shape: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]) => {
  const mark = act.poly(shape, { tone, closed: true });
  mark.object.position.copy(at);
  mark.object.scale.setScalar(size);
  act.facing.push(mark.object);
  return mark;
};
const tag = (act: Act, text: string, at: THREE.Vector3, lift = 1.09) => {
  const label = act.label(text, 0, 0);
  label.pos.copy(at).multiplyScalar(lift);
  return label;
};

const phone = onGlobe(9, -13);
const laptop = onGlobe(3, -7);
const farAway = onGlobe(40, 46);

/** The pieces acts 0 and 1 share, so one can hand over to the other unseen. */
const longWay = (act: Act) => {
  glyph(act, phone, 0.022);
  glyph(act, laptop, 0.03);
  tag(act, 'PHONE', phone, 1.1);
  tag(act, 'MAC', laptop, 0.9);
  const server = glyph(act, farAway, 0.05);
  const racks = act.segs([-1, 0.34, 0, 1, 0.34, 0, -1, -0.34, 0, 1, -0.34, 0]);
  racks.object.position.copy(farAway);
  racks.object.scale.setScalar(0.05);
  act.facing.push(racks.object);
  const name = tag(act, 'A DATA CENTRE, SOMEWHERE', farAway, 1.14);
  return { server, racks, name, up: arc(act, phone, farAway, 0.26), down: arc(act, farAway, laptop, 0.16) };
};

export const usualWay = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  const way = longWay(act);
  const parcel = act.dots(1, 7, { tone: 'single' });
  act.pose = () => ({ pos: globe.wide, look: new THREE.Vector3() });
  act.play = (_q, t) => {
    way.up.r = ramp(t, 0.4, 1.7);
    way.down.r = ramp(t, 1.5, 2.7);
    const trip = (t * 0.22) % 1;
    const spot = trip < 0.5 ? way.up.points[Math.floor(trip * 2 * 72)] : way.down.points[Math.floor((trip * 2 - 1) * 72)];
    parcel.put(0, spot.x, spot.y, spot.z);
    parcel.a = ramp(t, 2.7, 3.2);
  };
  return act;
};

export const deleted = (globe: Globe) => {
  const act = new Act();
  act.flat = false;
  act.globe = 1;
  const way = longWay(act);
  const strike = act.segs([-1.5, -1.5, 0, 1.5, 1.5, 0, -1.5, 1.5, 0, 1.5, -1.5, 0], { tone: 'accent' });
  strike.object.position.copy(farAway);
  strike.object.scale.setScalar(0.075);
  act.facing.push(strike.object);
  const direct = arc(act, phone, laptop, 0.03, 'accent');
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  act.pose = (q) => {
    const k = ramp(q, 0.6, 1.05);
    return { pos: pos.lerpVectors(globe.wide, globe.close, k), look: look.copy(globe.focus).multiplyScalar(k) };
  };
  act.play = (q) => {
    const fade = 1 - ramp(q, 0.4, 0.6);
    strike.r = ramp(q, 0.18, 0.34);
    strike.a = fade;
    [way.server, way.racks, way.up, way.down].forEach((stroke) => { stroke.a = fade; });
    way.name.a = fade;
    direct.r = ramp(q, 0.5, 0.72);
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
