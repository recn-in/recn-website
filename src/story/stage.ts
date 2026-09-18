// Runs a story: one renderer, one globe, and an Act per chapter, which the
// page's own story module builds (sync-story, features-story). `c` is the
// chapter the viewport is centred on, as a float; act `i` plays its `q` from
// 0 to 1 while c runs from i - 0.5 to i + 0.5, and fades at both ends. Nothing
// depends on scroll direction, so it scrubs backwards as well as forwards.
import * as THREE from 'three';
import { type Act, band, ramp, STILL, type Tone } from './kit';
import { HOME, type Globe, onGlobe } from './globe-acts';

export type Build = (globe: Globe, chapters: HTMLElement[]) => Act[];

export const start = (canvas: HTMLCanvasElement, story: HTMLElement, overlay: HTMLElement, count: HTMLElement | null, build: Build) => {
  const chapters = Array.from(story.querySelectorAll<HTMLElement>('[data-story-chapter]'));
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  story.classList.add('story--live');

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 60);
  const world = new THREE.Group();
  scene.add(world);

  const globe: Globe = { wide: new THREE.Vector3(0, 0.3, 5.7), close: new THREE.Vector3(), focus: new THREE.Vector3(), camera, fit: 1 };

  const acts = build(globe, chapters);
  if (acts.length !== chapters.length) throw new Error(`story: ${acts.length} acts for ${chapters.length} chapters`);
  acts.forEach((act) => {
    // Glyphs pinned to the globe turn with it; everything else floats in the scene.
    (act.globe > 0 ? world : scene).add(act.group);
    act.labels.forEach((label) => overlay.append(label.el));
  });

  // The globe itself: a graticule, and a silhouette that always faces the viewer.
  const palette = { ink: new THREE.Color(), dim: new THREE.Color(), accent: new THREE.Color(), single: new THREE.Color(), safe: new THREE.Color() } satisfies Record<Tone, THREE.Color>;
  const tokens: Record<Tone, string> = { ink: '--ink', dim: '--tertiary', accent: '--accent', single: '--single', safe: '--safe' };
  const paint = () => {
    const style = getComputedStyle(document.documentElement);
    (Object.keys(tokens) as Tone[]).forEach((tone) => palette[tone].set(style.getPropertyValue(tokens[tone]).trim()));
  };
  const grid: number[] = [];
  for (let lat = -60; lat <= 60; lat += 30) for (let lon = 0; lon < 360; lon += 6) grid.push(...onGlobe(lat, lon).toArray(), ...onGlobe(lat, lon + 6).toArray());
  for (let lon = 0; lon < 360; lon += 30) for (let lat = -90; lat < 90; lat += 6) grid.push(...onGlobe(lat, lon).toArray(), ...onGlobe(lat + 6, lon).toArray());
  const wire = (flat: number[]) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3));
    return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ transparent: true, depthTest: false }));
  };
  const graticule = wire(grid);
  world.add(graticule);
  const rim: number[] = [];
  for (let i = 0; i < 120; i += 1) rim.push(Math.cos((i / 120) * Math.PI * 2), Math.sin((i / 120) * Math.PI * 2), 0, Math.cos(((i + 1) / 120) * Math.PI * 2), Math.sin(((i + 1) / 120) * Math.PI * 2), 0);
  const silhouette = wire(rim);
  scene.add(silhouette);

  const chapterAt = () => {
    const centre = innerHeight / 2;
    let nearest = 0;
    for (let i = 0; i < chapters.length; i += 1) {
      const box = chapters[i].getBoundingClientRect();
      nearest = i;
      if (centre < box.bottom) break;
    }
    const box = chapters[nearest].getBoundingClientRect();
    return nearest + (centre - box.top) / box.height - 0.5;
  };

  let wideScreen = true;
  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    wideScreen = width >= 900;
    // The words sit on the left of a wide screen and at the bottom of a
    // narrow one; slide the picture out from under them.
    if (wideScreen) camera.setViewOffset(width, height, -width * 0.19, 0, width, height);
    else camera.setViewOffset(width, height, 0, height * 0.2, width, height);
    camera.updateProjectionMatrix();
    // A portrait screen is narrower than the pictures are wide: stand further back.
    globe.fit = Math.max(1, 0.78 / camera.aspect);
    globe.wide.set(0, 0.3, 5.7 * globe.fit);
  };

  const pointer = new THREE.Vector2();
  const lean = new THREE.Vector2();
  const flatPos = new THREE.Vector3();
  const origin = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const inverse = new THREE.Quaternion();
  const spot = new THREE.Vector3();
  const began = performance.now();
  let c = chapterAt();
  let frame = 0;
  let visible = true;

  const draw = (ms: number) => {
    // Reduced motion: no idle movement, and every self-drawing intro is complete.
    // (The first frame's timestamp can be a hair earlier than `began`.)
    const t = still.matches ? STILL : Math.max(0, ms - began) / 1000;
    c += (chapterAt() - c) * (still.matches ? 1 : 0.1);
    lean.lerp(pointer, 0.06);

    const presence = acts.map((_, i) => {
      const q = c - i + 0.5;
      if (i === 0) return 1 - ramp(q, 0.9, 1.1);
      if (i === acts.length - 1) return ramp(q, -0.1, 0.1);
      return band(q, -0.1, 0.1, 0.9, 1.1);
    });

    // The globe turns to whatever the acts on it want, and drifts for the last.
    let turnSum = 0; let turnWeight = 0; let drift = 0; let globeShown = 0;
    acts.forEach((act, i) => {
      if (act.globe <= 0 && act.flat) return;
      turnSum += act.turn * presence[i];
      turnWeight += presence[i];
      drift += act.drift * presence[i];
      globeShown = Math.max(globeShown, act.globe * presence[i]);
    });
    world.rotation.y = (turnWeight > 0 ? turnSum / turnWeight : 0.15) + (still.matches ? 0 : t * drift);
    world.updateMatrixWorld();
    globe.focus.copy(HOME).applyMatrix4(world.matrixWorld);
    globe.close.copy(globe.focus).multiplyScalar(1 + 0.95 * globe.fit);
    // Far enough back for a 2.5-wide diagram to fit beside the words (wide) or
    // across the whole screen (narrow).
    flatPos.set(0, 0, Math.max(4.4, (wideScreen ? 2.12 : 1.32) / (camera.aspect * Math.tan(THREE.MathUtils.degToRad(15)))));

    // Camera: the weighted blend of what each present act asks for.
    pos.set(0, 0, 0); look.set(0, 0, 0);
    let weight = 0;
    acts.forEach((act, i) => {
      if (presence[i] <= 0.001) return;
      const q = c - i + 0.5;
      const want = act.pose ? act.pose(q, t) : { pos: flatPos, look: origin };
      pos.addScaledVector(want.pos, presence[i]);
      look.addScaledVector(want.look, presence[i]);
      weight += presence[i];
    });
    camera.position.copy(pos.multiplyScalar(1 / weight));
    camera.lookAt(look.multiplyScalar(1 / weight));
    camera.updateMatrixWorld();

    const distance = camera.position.length();
    silhouette.position.copy(camera.position).multiplyScalar(1 / (distance * distance));
    silhouette.scale.setScalar(Math.sqrt(Math.max(0, 1 - 1 / (distance * distance))));
    silhouette.quaternion.copy(camera.quaternion);
    [[graticule, 0.85, 'dim'], [silhouette, 0.9, 'ink']].forEach(([object, base, tone]) => {
      const mesh = object as THREE.LineSegments;
      const material = mesh.material as THREE.LineBasicMaterial;
      mesh.visible = globeShown > 0.004;
      material.opacity = (base as number) * globeShown;
      material.color.copy(palette[tone as Tone]);
    });
    inverse.copy(world.quaternion).invert().multiply(camera.quaternion);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    acts.forEach((act, i) => {
      const shown = presence[i];
      act.group.visible = shown > 0.004;
      if (!act.group.visible) {
        act.labels.forEach((label) => { label.el.style.opacity = '0'; });
        return;
      }
      const q = c - i + 0.5;
      if (act.flat) {
        // A flat diagram turns slowly as it passes, and leans to the pointer.
        act.group.rotation.set(lean.y * -0.05, (q - 0.5) * -0.5 + lean.x * 0.08, 0);
        act.group.position.set(0, 0, (0.5 - q) * 0.5);
      }
      act.play(q, t);
      act.facing.forEach((mark) => mark.quaternion.copy(inverse));
      act.strokes.forEach((stroke) => stroke.apply(shown, palette));
      act.group.updateMatrixWorld(true);
      act.labels.forEach((label) => {
        const alpha = label.a * shown;
        if (alpha < 0.02) { label.el.style.opacity = '0'; return; }
        spot.copy(label.pos).applyMatrix4(act.group.matrixWorld).project(camera);
        label.el.style.opacity = String(alpha);
        label.el.dataset.tone = label.tone;
        label.el.style.transform = `translate(${((spot.x + 1) / 2) * width}px, ${((1 - spot.y) / 2) * height}px)`;
      });
    });

    const current = Math.min(acts.length - 1, Math.max(0, Math.round(c)));
    if (count) count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(acts.length).padStart(2, '0')}`;
    chapters.forEach((chapter, i) => chapter.style.setProperty('--near', String(presence[i])));
    renderer.render(scene, camera);
  };

  const tick = (ms: number) => {
    draw(ms);
    frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

  paint();
  resize();
  wake();
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }).observe(story);
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', wake);
  addEventListener('pointermove', (event) => pointer.set((event.clientX / innerWidth) * 2 - 1, (event.clientY / innerHeight) * 2 - 1), { passive: true });
};
