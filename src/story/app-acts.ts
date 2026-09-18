// Feature acts for the apps themselves: iPad, desktop, updates, privacy.
import { Act, band, between, mix, ramp, turn, type XY } from './kit';

/** The same app, measured: past 900 points wide the phone's stack becomes three panes. */
export const ipad = () => {
  const act = new Act();
  const L = -1.05;
  const Y = 0.12;
  const H = 0.9;
  const NARROW = 0.8;
  const WIDE = 2.1;
  const TICK = L + (900 / 1024) * WIDE;
  act.seg(L, Y - H / 2, L, Y + H / 2);
  const top = act.poly([[0, 0], [1, 0]]);
  const bottom = act.poly([[0, 0], [1, 0]]);
  const right = act.poly([[0, -H / 2], [0, H / 2]]);
  const railWall = act.seg(L + 0.3, Y - H / 2, L + 0.3, Y + H / 2, { tone: 'dim' });
  const listWall = act.seg(L + 0.92, Y - H / 2, L + 0.92, Y + H / 2, { tone: 'dim' });
  const glyphs = [0.44, 0.3, 0.16].map((y) => act.rect(L + 0.15, y, 0.16, 0.08, { tone: 'dim' }));
  const ROWS = [0.3, 0.16, 0.02, -0.12, -0.26];
  const rows = ROWS.map(() => act.poly([[0, 0], [1, 0]], { tone: 'dim' }));
  const picked = act.rect(0, 0, 1, 0.1, { tone: 'accent' });
  const card = act.rect(0, 0, 1, 1, { tone: 'accent' });
  const cardWave = act.wave(0, 0, 1, 26, 0.08, { tone: 'accent' });
  act.seg(L, -0.44, L + WIDE, -0.44, { tone: 'dim' });
  const mark = act.seg(TICK, -0.49, TICK, -0.39);
  const edge = act.dots(1, 7, { tone: 'accent' });
  act.label('SCREEN WIDTH', L, -0.57, 'left');
  act.label('900 PT', TICK, -0.57);
  const stacked = act.label('ONE PANE · IT OPENS ON TOP', -0.65, 0.66);
  const three = act.label('NAVIGATION · THE LIST · WHAT YOU SELECTED', 0, 0.68);
  const verdict = act.label('PAST 900 POINTS THE SAME APP LAYS OUT IN THREE · THE ITEM OPENS BESIDE THE LIST', 0, -0.72, 'center', 'ink');
  act.play = (q) => {
    const wide = ramp(q, 0.38, 0.62);
    const w = mix(NARROW, WIDE, wide);
    top.at(L, Y + H / 2).object.scale.x = w;
    bottom.at(L, Y - H / 2).object.scale.x = w;
    right.at(L + w, Y);
    const split = ramp(q, 0.6, 0.72);
    railWall.a = split;
    listWall.a = split;
    glyphs.forEach((glyph, i) => { glyph.a = turn(q, i, 3, 0.62, 0.78); });
    const rowX = mix(-0.99, -0.71, wide);
    const rowW = mix(0.68, 0.54, wide);
    rows.forEach((row, i) => { row.at(rowX, ROWS[i]).object.scale.x = rowW; row.r = turn(q, i, 5, 0.04, 0.22); });
    picked.at(rowX + rowW / 2, ROWS[1]).object.scale.x = rowW;
    picked.a = ramp(q, 0.16, 0.24);
    const over = ramp(q, 0.18, 0.3);
    const beside = ramp(q, 0.66, 0.82);
    const cx = mix(mix(0.62, -0.65, over), 0.46, beside);
    const cw = mix(0.68, 1.1, beside);
    card.at(cx, Y).object.scale.set(cw, 0.72, 1);
    cardWave.at(cx, Y).object.scale.x = cw;
    card.a = over;
    cardWave.a = over;
    edge.put(0, L + w, -0.44);
    edge.a = band(q, 0.36, 0.42, 0.66, 0.72);
    mark.tone = w > TICK - L ? 'safe' : 'ink';
    stacked.a = band(q, 0.2, 0.28, 0.38, 0.44);
    three.a = ramp(q, 0.64, 0.74);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** The desktop shell: a key instead of a trip to the mouse, and a menu that acts on the whole selection. */
export const desktopApp = () => {
  const act = new Act();
  const frame = act.rect(0, -0.01, 2.2, 1.18);
  const railWall = act.seg(-0.78, -0.6, -0.78, 0.58, { tone: 'dim' });
  const listWall = act.seg(0.18, -0.6, 0.18, 0.58, { tone: 'dim' });
  const glyphs = [0.42, 0.22, 0.02].map((y) => act.rect(-0.94, y, 0.2, 0.1, { tone: 'dim' }));
  const field = act.rect(-0.3, 0.46, 0.88, 0.12);
  const ROWS = Array.from({ length: 8 }, (_, i) => 0.3 - i * 0.085);
  const rows = ROWS.map((y) => act.seg(-0.7, y, 0.1, y));
  const marks = act.dots(2, 6, { tone: 'accent' });
  const bar = act.seg(-1.1, -0.42, 1.1, -0.42, { tone: 'dim' });
  act.poly([[-1.04, -0.55], [-1.04, -0.47], [-0.98, -0.51]], { closed: true, tone: 'dim' });
  act.seg(-0.9, -0.51, 0.9, -0.51, { tone: 'dim' });
  const preview = act.wave(0.64, 0.4, 0.8, 30, 0.07, { tone: 'dim' });
  const chip = act.rect(0.64, 0.12, 0.34, 0.14);
  const chipText = act.label('CMD F', 0.64, 0.115, 'center', 'ink');
  const wire = act.seg(0.47, 0.14, 0.17, 0.42, { tone: 'dim', dashed: true });
  const caret = act.poly([[0, 0], [0, -0.09], [0.022, -0.055], [0.05, -0.07]], { tone: 'accent' });
  const point = act.seg(0.07, -0.08, 0.31, -0.13, { tone: 'dim', dashed: true });
  const menu = act.rect(0.64, -0.17, 0.66, 0.34);
  const moveItem = act.label('MOVE 5 ITEMS', 0.36, -0.06, 'left', 'accent');
  const deleteItem = act.label('DELETE 5 ITEMS', 0.36, -0.17, 'left');
  const rest = act.seg(0.36, -0.28, 0.72, -0.28, { tone: 'dim' });
  const moving = act.dots(5, 7, { tone: 'accent' });
  act.label('NAV', -0.94, 0.68);
  act.label('THE LIBRARY', -0.3, 0.68);
  act.label('WHAT IS SELECTED', 0.64, 0.68);
  const keyed = act.label('A KEY, NOT A TRIP TO THE MOUSE', 0.64, 0.26);
  const ranged = act.label('CLICK · SHIFT-CLICK · EVERY ROW BETWEEN', -0.3, -0.36);
  const verdict = act.label('THE MENU ACTS ON WHAT IS SELECTED, NOT ON THE ROW UNDER THE CURSOR', 0, -0.72, 'center', 'ink');
  act.play = (q) => {
    frame.r = ramp(q, 0.02, 0.14);
    railWall.a = ramp(q, 0.06, 0.18);
    listWall.a = railWall.a;
    glyphs.forEach((glyph, i) => { glyph.a = turn(q, i, 3, 0.06, 0.2); });
    bar.r = ramp(q, 0.1, 0.22);
    preview.r = ramp(q, 0.12, 0.26);
    rows.forEach((row, i) => { row.r = turn(q, i, 8, 0.08, 0.28); });
    chip.r = ramp(q, 0.24, 0.34);
    chipText.a = ramp(q, 0.28, 0.36);
    wire.r = ramp(q, 0.3, 0.4);
    field.tone = band(q, 0.34, 0.38, 0.52, 0.58) > 0.5 ? 'accent' : 'ink';
    keyed.a = band(q, 0.26, 0.34, 0.54, 0.6);
    const sweep = ramp(q, 0.44, 0.62);
    marks.put(0, -0.66, ROWS[2]);
    marks.put(1, -0.66, mix(ROWS[2], ROWS[6], sweep));
    marks.a = band(q, 0.42, 0.46, 0.9, 0.96);
    const sent = ramp(q, 0.78, 0.94);
    rows.forEach((row, i) => {
      const held = i >= 2 && i <= 6 ? turn(q, i - 2, 5, 0.44, 0.62) : 0;
      row.tone = held > 0.5 ? (sent > 0.6 ? 'safe' : 'accent') : 'ink';
    });
    ranged.a = band(q, 0.44, 0.52, 0.88, 0.94);
    caret.at(0.02, -0.04).a = band(q, 0.56, 0.62, 0.92, 0.96);
    point.r = ramp(q, 0.58, 0.66);
    menu.r = ramp(q, 0.6, 0.72);
    moveItem.a = ramp(q, 0.64, 0.74);
    deleteItem.a = moveItem.a;
    rest.r = moveItem.a;
    for (let i = 0; i < 5; i += 1) {
      const k = turn(q, i, 5, 0.76, 0.94, 1.5);
      const [x, y] = between([-0.3, ROWS[i + 2]], [-0.94, 0.22], k);
      moving.put(i, k > 0 && k < 1 ? x : 9, y);
    }
    glyphs[1].tone = sent > 0.9 ? 'safe' : 'dim';
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** One feed, two endings: the desktop swaps itself in, the phone hands you to the store. */
export const updates = () => {
  const act = new Act();
  const R = 0.17;
  act.rect(0, 0.66, 0.46, 0.16, { tone: 'dim' });
  act.label('THE RELEASE FEED', 0, 0.655);
  const asked = act.label('CHECKED ONCE A DAY ON A COMPUTER, AT EVERY LAUNCH ON A PHONE', 0, 0.78);
  const toMac = act.poly([[-0.24, 0.66], [-0.66, 0.66], [-0.66, 0.47]], { dashed: true });
  const toPhone = act.poly([[0.24, 0.66], [0.66, 0.66], [0.66, 0.5]], { dashed: true });
  act.label('DESKTOP', -1.18, 0.26, 'left');
  act.label('PHONE', 1.18, 0.5, 'right');
  act.circle(-0.66, 0.26, R, { tone: 'dim' });
  const fill = act.poly(Array.from({ length: 49 }, (_, i): XY => {
    const a = Math.PI / 2 - (i / 48) * Math.PI * 2;
    return [Math.cos(a) * R, Math.sin(a) * R];
  }), { tone: 'accent' }).at(-0.66, 0.26);
  const percent = act.label('0%', -0.66, 0.245, 'center', 'accent');
  const quiet = act.label('DOWNLOADS IN THE BACKGROUND · PERCENT AND SPEED IN SETTINGS', -0.6, 0.02);
  const tick = act.poly([[-0.72, -0.14], [-0.68, -0.19], [-0.6, -0.09]], { tone: 'safe' });
  const checked = act.label('SIGNATURE CHECKED · SWAPS ON RELAUNCH', -0.62, -0.3);
  const phone = act.rect(0.66, 0.12, 0.52, 0.72);
  const nudge = act.rect(0.66, 0.3, 0.44, 0.2, { tone: 'accent' });
  const notes = act.segs([0.48, 0.34, 0, 0.84, 0.34, 0, 0.48, 0.27, 0, 0.72, 0.27, 0], { tone: 'accent' });
  const listRows = act.segs([0.46, 0.08, 0, 0.86, 0.08, 0, 0.46, -0.02, 0, 0.86, -0.02, 0, 0.46, -0.12, 0, 0.86, -0.12, 0], { tone: 'dim' });
  const told = act.label('A ROW ON TOP · WHAT CHANGED IN IT', 0.66, -0.32);
  const handoff = act.seg(0.66, -0.4, 0.66, -0.47, { tone: 'single' });
  const store = act.rect(0.66, -0.56, 0.62, 0.14, { tone: 'single' });
  const storeText = act.label('TESTFLIGHT · PLAY', 0.66, -0.565, 'center', 'single');
  const verdict = act.label('NOTHING INSTALLS OVER A RECORDING · THE NEW BUILD WAITS FOR THE NEXT LAUNCH', 0, -0.74, 'center', 'ink');
  act.play = (q) => {
    asked.a = band(q, 0.04, 0.14, 0.9, 1);
    toMac.r = ramp(q, 0.1, 0.24);
    toPhone.r = toMac.r;
    const got = ramp(q, 0.26, 0.6);
    fill.r = got;
    percent.say(`${Math.round(got * 100)}%`).tone = got > 0.99 ? 'safe' : 'accent';
    percent.a = band(q, 0.24, 0.3, 0.72, 0.78);
    quiet.a = band(q, 0.3, 0.38, 0.72, 0.78);
    tick.r = ramp(q, 0.62, 0.72);
    checked.a = ramp(q, 0.66, 0.76);
    phone.r = ramp(q, 0.2, 0.34);
    listRows.r = ramp(q, 0.26, 0.4);
    nudge.r = ramp(q, 0.36, 0.5);
    notes.r = ramp(q, 0.44, 0.58);
    told.a = ramp(q, 0.5, 0.6);
    handoff.r = ramp(q, 0.62, 0.7);
    store.r = ramp(q, 0.66, 0.76);
    storeText.a = ramp(q, 0.7, 0.78);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};

/** A closed loop of your own devices, and the server-shaped hole where an account would go. */
export const privateByDefault = () => {
  const act = new Act();
  const corners: XY[] = [[-0.85, 0.42], [0.05, 0.42], [0.05, -0.18], [-0.85, -0.18]];
  const names = ['MAC', 'IPHONE', 'IPAD', 'WINDOWS PC'];
  corners.forEach(([x, y], i) => {
    act.rect(x, y, 0.26, 0.14);
    act.label(names[i], x, y + (i < 2 ? 0.14 : -0.14)); // clear of the loop's own lines
  });
  // The loop runs from box edge to box edge, not through the boxes.
  const edges = corners.map((from, i) => {
    const to = corners[(i + 1) % 4];
    const dx = Math.sign(to[0] - from[0]) * 0.13;
    const dy = Math.sign(to[1] - from[1]) * 0.07;
    return act.seg(from[0] + dx, from[1] + dy, to[0] - dx, to[1] - dy);
  });
  const traffic = act.dots(4, 6, { tone: 'safe' });
  const server = act.rect(0.75, 0.42, 0.5, 0.2, { tone: 'dim', dashed: true });
  const serverText = act.label('SERVER', 0.75, 0.415);
  const account = act.rect(0.75, 0.12, 0.5, 0.2, { tone: 'dim', dashed: true });
  const accountText = act.label('ACCOUNT', 0.75, 0.115);
  const reach = act.seg(0.2, 0.42, 0.48, 0.42, { tone: 'dim', dashed: true });
  const cut = act.segs([0.28, 0.36, 0, 0.4, 0.48, 0, 0.28, 0.48, 0, 0.4, 0.36, 0], { tone: 'accent' });
  const never = act.label('NOTHING CONNECTS TO IT', 0.72, -0.16);
  const wire = act.poly([[-0.4, -0.25], [-0.4, -0.48], [0.12, -0.48]], { tone: 'single' });
  const snip = act.segs([-0.06, -0.54, 0, 0.06, -0.42, 0, -0.06, -0.42, 0, 0.06, -0.54, 0], { tone: 'accent' });
  const toggle = act.rect(0.24, -0.48, 0.16, 0.08);
  const knob = act.dots(1, 7, { tone: 'single' });
  const on = act.label('CRASH REPORTS · ON BY DEFAULT', -0.3, -0.62, 'center', 'single');
  const off = act.label('ONE SWITCH IN SETTINGS AND THE LINE IS CUT', -0.3, -0.62);
  const verdict = act.label('YOUR RECORDINGS STAY ON THE DEVICES YOU PAIRED · NO ACCOUNT, NO HOSTED LIBRARY', 0, -0.76, 'center', 'ink');
  act.play = (q, t) => {
    edges.forEach((edge, i) => { edge.r = turn(q, i, 4, 0.04, 0.3); });
    const alive = ramp(q, 0.24, 0.34);
    for (let i = 0; i < 4; i += 1) {
      const k = (t * 0.18 + i / 4) % 1;
      const leg = Math.min(3, Math.floor(k * 4));
      const [x, y] = between(corners[leg], corners[(leg + 1) % 4], k * 4 - leg);
      traffic.put(i, x, y);
    }
    traffic.a = alive;
    const gone = ramp(q, 0.5, 0.64);
    server.r = ramp(q, 0.34, 0.46);
    account.r = server.r;
    serverText.a = server.r * (1 - gone * 0.8);
    accountText.a = serverText.a;
    server.a = 1 - gone * 0.8;
    account.a = server.a;
    reach.r = band(q, 0.4, 0.48, 0.62, 0.7);
    cut.a = ramp(q, 0.48, 0.56);
    never.a = ramp(q, 0.54, 0.64);
    const flip = ramp(q, 0.76, 0.86);
    wire.r = 1 - flip * 0.42;
    toggle.a = ramp(q, 0.66, 0.74);
    knob.put(0, mix(0.28, 0.2, flip), -0.48);
    knob.a = toggle.a;
    knob.tone = flip > 0.5 ? 'dim' : 'single';
    wire.tone = flip > 0.5 ? 'dim' : 'single';
    snip.a = flip;
    on.a = band(q, 0.68, 0.74, 0.76, 0.82);
    off.a = ramp(q, 0.82, 0.9);
    verdict.a = ramp(q, 0.8, 0.9);
  };
  return act;
};
