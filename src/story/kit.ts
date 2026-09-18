// Drawing primitives for the How it works story. Everything is a stroke, a dot
// or a mono label: no fills, no lighting. An Act owns its strokes and says,
// for a given moment `q` of its chapter, how much of each is drawn.
import * as THREE from 'three';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ramp = (x: number, a: number, b: number) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
export const band = (x: number, a: number, b: number, c: number, d: number) => ramp(x, a, b) * (1 - ramp(x, c, d));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** Progress of item `i` of `n` when the items take turns between `from` and `to`. */
export const turn = (q: number, i: number, n: number, from: number, to: number, overlap = 1.6) => {
  const each = (to - from) / n;
  return ramp(q, from + i * each, from + i * each + each * overlap);
};

/** The clock every act is given when the viewer asks for reduced motion: every intro is over. */
export const STILL = 1000;

export type Tone = 'ink' | 'dim' | 'accent' | 'single' | 'safe';
export type XY = [number, number, number?];
interface Look { tone?: Tone; base?: number; dashed?: boolean; closed?: boolean }

const DPR = Math.min(globalThis.devicePixelRatio ?? 1, 2);

export class Stroke {
  /** Opacity, 0–1, on top of the act's own presence. */
  a = 1;
  /** How much of the stroke is drawn, 0–1, from its first point. */
  r = 1;
  constructor(
    public object: THREE.Line | THREE.LineSegments | THREE.Points,
    public tone: Tone,
    public base: number,
    private count: number,
    private step: number,
  ) {}

  at(x: number, y: number, z = 0) { this.object.position.set(x, y, z); return this; }

  apply(presence: number, palette: Record<Tone, THREE.Color>) {
    const alpha = this.base * this.a * presence;
    this.object.visible = alpha > 0.004 && this.r > 0;
    if (!this.object.visible) return;
    const material = this.object.material as THREE.LineBasicMaterial;
    material.opacity = alpha;
    material.color.copy(palette[this.tone]);
    this.object.geometry.setDrawRange(0, Math.ceil((this.r * this.count) / this.step) * this.step);
  }
}

export class Label {
  a = 1;
  tone: Tone = 'dim';
  readonly pos = new THREE.Vector3();
  readonly el = document.createElement('span');
  constructor(text: string, x: number, y: number, align: 'left' | 'center' | 'right') {
    this.el.textContent = text;
    this.el.dataset.align = align;
    this.pos.set(x, y, 0);
  }
  say(text: string) { if (this.el.textContent !== text) this.el.textContent = text; return this; }
}

export class Act {
  readonly group = new THREE.Group();
  readonly strokes: Stroke[] = [];
  readonly labels: Label[] = [];
  /** Strokes that must turn to face the viewer (glyphs pinned to the globe). */
  readonly facing: THREE.Object3D[] = [];
  /** How much of the globe this act wants behind it, 0–1. */
  globe = 0;
  /** Where a globe act wants the globe turned to, and how fast it drifts. */
  turn = 0.15;
  drift = 0;
  /** Flat acts get the stage's gentle sway; globe acts do not. */
  flat = true;
  /** Camera for this act; the default looks straight at a flat diagram. */
  pose: ((q: number, t: number) => { pos: THREE.Vector3; look: THREE.Vector3 }) | null = null;
  /** Called every frame with the chapter's progress and the clock. */
  play: (q: number, t: number) => void = () => {};

  private add(object: THREE.Line | THREE.LineSegments | THREE.Points, look: Look, count: number, step: number) {
    const stroke = new Stroke(object, look.tone ?? 'ink', look.base ?? 1, count, step);
    object.frustumCulled = false; // several strokes move their own points every frame
    this.group.add(object);
    this.strokes.push(stroke);
    return stroke;
  }

  private material(look: Look) {
    return look.dashed
      ? new THREE.LineDashedMaterial({ transparent: true, depthTest: false, dashSize: 0.03, gapSize: 0.025 })
      : new THREE.LineBasicMaterial({ transparent: true, depthTest: false });
  }

  /** A polyline through `points`; it draws on from its first point. */
  poly(points: XY[] | THREE.Vector3[], look: Look = {}) {
    const vectors = points.map((p) => (p instanceof THREE.Vector3 ? p : new THREE.Vector3(p[0], p[1], p[2] ?? 0)));
    if (look.closed) vectors.push(vectors[0].clone());
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vectors), this.material(look));
    if (look.dashed) line.computeLineDistances();
    return this.add(line, look, vectors.length, 1);
  }

  /** Unconnected segments, as a flat list of x,y,z pairs. */
  segs(flat: number[], look: Look = {}) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3));
    const lines = new THREE.LineSegments(geometry, this.material(look));
    if (look.dashed) lines.computeLineDistances();
    return this.add(lines, look, flat.length / 3, 2);
  }

  seg(x1: number, y1: number, x2: number, y2: number, look: Look = {}) {
    return this.poly([[x1, y1], [x2, y2]], look);
  }

  /** A rectangle centred on x,y. */
  rect(x: number, y: number, w: number, h: number, look: Look = {}) {
    return this.poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], { ...look, closed: true }).at(x, y);
  }

  circle(x: number, y: number, radius: number, look: Look = {}, steps = 48) {
    const points: XY[] = [];
    for (let i = 0; i < steps; i += 1) points.push([Math.cos((i / steps) * Math.PI * 2) * radius, Math.sin((i / steps) * Math.PI * 2) * radius]);
    return this.poly(points, { ...look, closed: true }).at(x, y);
  }

  /** A waveform: `n` vertical ticks across width `w`, centred on x,y. */
  wave(x: number, y: number, w: number, n: number, height: number, look: Look = {}, seed = 1) {
    const flat: number[] = [];
    for (let i = 0; i < n; i += 1) {
      const px = -w / 2 + (i / (n - 1)) * w;
      const h = height * (0.18 + 0.82 * Math.abs(Math.sin(i * 1.7 + seed) * Math.cos(i * 0.43 + seed * 2.1)));
      flat.push(px, -h, 0, px, h, 0);
    }
    return this.segs(flat, look).at(x, y);
  }

  /** `n` dots whose positions the act sets each frame. */
  dots(n: number, size: number, look: Look = {}) {
    const geometry = new THREE.BufferGeometry().setFromPoints(Array.from({ length: n }, () => new THREE.Vector3()));
    const material = new THREE.PointsMaterial({ transparent: true, depthTest: false, size: size * DPR, sizeAttenuation: false });
    const stroke = this.add(new THREE.Points(geometry, material), look, n, 1);
    const spots = geometry.getAttribute('position') as THREE.BufferAttribute;
    return Object.assign(stroke, {
      put(i: number, x: number, y: number, z = 0) { spots.setXYZ(i, x, y, z); spots.needsUpdate = true; },
    });
  }

  /** `n` vertical bars the act places and sizes each frame (characters, columns). */
  bars(n: number, look: Look = {}) {
    const geometry = new THREE.BufferGeometry();
    const spots = new THREE.Float32BufferAttribute(new Float32Array(n * 6), 3);
    geometry.setAttribute('position', spots);
    const stroke = this.add(new THREE.LineSegments(geometry, this.material(look)), look, n * 2, 2);
    return Object.assign(stroke, {
      /** Bar `i` rises from x,y by `h`; a bar of no height is not drawn. */
      put(i: number, x: number, y: number, h: number) {
        spots.setXYZ(i * 2, x, y, 0);
        spots.setXYZ(i * 2 + 1, x, y + h, 0);
        spots.needsUpdate = true;
      },
    });
  }

  /** Any line geometry of your own, for the few shapes that are truly 3D. */
  solid(geometry: THREE.BufferGeometry, look: Look = {}) {
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), this.material(look));
    if (look.dashed) lines.computeLineDistances();
    return this.add(lines, look, lines.geometry.getAttribute('position').count, 2);
  }

  label(text: string, x: number, y: number, align: 'left' | 'center' | 'right' = 'center', tone: Tone = 'dim') {
    const label = new Label(text, x, y, align);
    label.tone = tone;
    this.labels.push(label);
    return label;
  }
}

/** A point moving along a straight run, for packets and pulses. */
export const between = (from: XY, to: XY, k: number): [number, number] => [mix(from[0], to[0], k), mix(from[1], to[1], k)];
