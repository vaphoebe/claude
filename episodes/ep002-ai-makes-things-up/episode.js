// EP002 — Why Does AI Make Things Up?
// Same brand look as EP001 (glass, neon, warm/cool light, bokeh) with episode-specific set pieces:
// archive shelves, model orb, bright road vs faint trail, mirage, exam, radar.
import { createEpisode } from '/templates/episode-kit.js';
import * as P from '/scenes/fx2.js';

const E = await createEpisode('ep002-ai-makes-things-up', { atmosphere: { seed: 12 } });
const { st, C, svg, tl, L, phraseAt, scene, cut, open, ivo, blinks, draw, noMark, endCard, finish, A, K, F } = E;

const HZ = 1060; // horizon line for the scenes that use a floor (scene coordinates)
function localFloor(g) { const f = P.horizonGrid(g, svg, C, { horizon: HZ }); st.onFrame((t) => f.update(t)); return f; }

// ---------- local builders ----------
function citation(g, { x, y, s = 1, tilt = -4 }) {
  const root = K.el('g', {}, g);
  const n = st.node(root, { x, y, s, r: tilt, o: 0 });
  const c = K.el('g', { transform: 'translate(-190,-240)' }, root);
  F.glass(c, svg, C, { x: 0, y: 0, w: 380, h: 480, r: 34 });
  const book = K.el('g', { transform: 'translate(190,112)' }, c);
  F.glow(book, svg, C.orange, { x: 0, y: 0, r: 110, opacity: 0.45 });
  K.el('rect', { x: -48, y: -60, width: 96, height: 120, rx: 8, fill: 'none', stroke: C.orange, 'stroke-width': 6 }, book);
  K.el('line', { x1: -32, y1: -60, x2: -32, y2: 60, stroke: C.orange, 'stroke-width': 6 }, book);
  const mark = (yy, w, h) => K.el('rect', { x: 44, y: yy - 8, width: w + 16, height: h + 16, rx: (h + 16) / 2, fill: C.orange, opacity: 0 }, c);
  const hi = [mark(232, 290, 34), mark(306, 180, 10), mark(368, 110, 30)];
  K.lines(c, 52, 232, [290, 210], { gap: 24, h: 12 }, C);
  K.lines(c, 52, 306, [180], { h: 10, color: C.slate }, C);
  K.text(c, 52, 392, 'p. 142', { size: 32, anchor: 'start', fill: C.slate }, C);
  return { n, hi };
}
function chipRow(g, words, { y, size = 42, slot = true, tilt = true }) {
  const all = [...words, ...(slot ? [''] : [])].map((w) => F.tile(g, svg, C, w, { size, dashed: !w }));
  let cx = 0; const xs = [];
  all.forEach((m) => { xs.push(cx + m.w / 2); cx += m.w + 14; });
  const total = cx - 14;
  return all.map((m, i) => st.node(m.g, { x: 540 - total / 2 + xs[i], y, o: 0 }));
}
const dropIn = (n, t) => tl.fromTo(n, { o: 0, y: n.y - 90, r: -8 }, { o: 1, y: n.y, r: 0, duration: 0.32, ease: 'back.out(1.6)', immediateRender: false }, t);

// =====================================================================
// S1 — Archive: Ivo hands over a paper citation
// =====================================================================
const s1 = scene(); open(s1);
const t1b = phraseAt('01', 'and it might');
{
  P.bookshelves(s1.g, C, { horizon: HZ });
  const r = ivo(s1.g, { x: 330, y: 1250, scale: 1.05, yaw: 24 }, { t0: 0, t1: t1b, expr: 'happy' });
  const card = citation(s1.g, { x: 770, y: 700, s: 0.78, tilt: 6 });
  st.sfx('music_start', 0, 1);
  tl.add(A.pose(r, 'presentRight', { duration: 0.35 }), 0.15);
  tl.fromTo(card.n, { o: 0, y: 820, r: 18 }, { o: 1, y: 690, r: 6, duration: 0.6, ease: 'back.out(1.4)', immediateRender: false }, 0.3);
  st.sfx('paper', 0.3, 0.8);
  tl.to(card.n, { y: 670, r: 3, duration: t1b - 0.9, ease: 'sine.inOut' }, 0.9);
  tl.fromTo(s1.cam, { s: 1 }, { s: 1.06, duration: t1b + 0.3, ease: 'none', immediateRender: false }, 0);
  blinks(r, [1.2]);
}

// =====================================================================
// S2 — The citation up close… and it doesn't exist
// =====================================================================
const s2 = scene();
const t2 = L['02'].start;
{
  F.glow(s2.g, svg, C.orange, { x: 540, y: 640, r: 520, opacity: 0.22 });
  const card = citation(s2.g, { x: 540, y: 660, s: 1.35, tilt: -3 });
  tl.set(card.n, { o: 1 }, t1b - 0.2);
  cut(s1, s2, t1b, 'push', 0.3);
  const tList = phraseAt('01', 'Title');
  card.hi.forEach((h, i) => { tl.to(h, { attr: { opacity: 0.35 }, duration: 0.18 }, tList + i * 0.55); st.sfx('tick', tList + i * 0.55, 0.7); });
  tl.to(card.n, { o: 0.5, duration: 0.06, yoyo: true, repeat: 5, ease: 'none' }, t1b + 1.2);
  noMark(s2.g, 540, 660, 340)(L['01'].end - 0.35);
  tl.to(card.n, { o: 0.15, s: 1.25, r: -8, duration: 0.5 }, L['01'].end - 0.1);
  tl.fromTo(s2.cam, { s: 1.02 }, { s: 1.1, duration: t2 - t1b, ease: 'none', immediateRender: false }, t1b);
}

// =====================================================================
// S3 — "It isn't lying. It's doing what it was built to do."
// =====================================================================
const s3 = scene();
const t3 = L['03'].start;
{
  const drift = K.el('g', { opacity: 0.5 }, s3.g);
  const words = ['the', 'most', 'likely', 'next', 'word'];
  const ch = words.map((w, i) => st.node(F.tile(drift, svg, C, w, { size: 36 }).g, { x: -150 - i * 210, y: 400 + (i % 2) * 70 }));
  const r = ivo(s3.g, { x: 540, y: 1250, scale: 1.15 }, { t0: t2 - 0.3, t1: t3, expr: 'neutral' });
  cut(s2, s3, t2, 'push', 0.3);
  ch.forEach((n) => tl.to(n, { x: n.x + 1500, duration: t3 - t2 + 0.6, ease: 'none' }, t2 - 0.3));
  tl.add(A.pose(r, 'confused', { duration: 0.3 }), t2 + 0.1);
  tl.to(r.state, { headYaw: -12, duration: 0.14, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t2 + 0.15);
  const tBuilt = phraseAt('02', "It's doing");
  tl.add(A.express(r, 'explaining'), tBuilt);
  tl.add(A.pose(r, 'explain', { duration: 0.35 }), tBuilt);
  tl.add(A.nod(r, { times: 1, duration: 0.4 }), tBuilt + 0.8);
  blinks(r, [t2 + 1.4]);
}

// =====================================================================
// S4 — Close-up in the archive, thinking
// =====================================================================
const s4 = scene();
const t4 = L['04'].start;
{
  P.bookshelves(s4.g, C, { horizon: HZ, seed: 3 });
  const r = ivo(s4.g, { x: 560, y: 1640, scale: 1.6, yaw: -12 }, { t0: t3 - 0.3, t1: t4, expr: 'thinking', pose: 'think' });
  cut(s3, s4, t3, 'push', 0.3);
  tl.fromTo(s4.cam, { s: 1, ox: 560, oy: 700 }, { s: 1.14, duration: t4 - t3 + 0.2, ease: 'power1.in', immediateRender: false }, t3 - 0.1);
  tl.add(A.express(r, 'curious'), t3 + 0.8);
  blinks(r, [t3 + 0.5]);
}

// =====================================================================
// S5 — The model (orb) writes by predicting the next word, chip by chip
// =====================================================================
const s5 = scene();
const t5 = L['05'].start;
{
  const o = P.orb(s5.g, svg, C, { x: 0, y: 0, r: 110 });
  const oN = st.node(o.g, { x: 540, y: 420, o: 0, s: 0.6 });
  st.onFrame((t) => o.update(t));
  const chips = chipRow(s5.g, ['The', 'study', 'was', 'published', 'in'], { y: 820, size: 46 });
  cut(s4, s5, t4, 'whip', 0.3);
  tl.to(oN, { o: 1, s: 1, duration: 0.6, ease: 'back.out(1.5)' }, t4 + 0.1);
  st.sfx('powerup', t4 + 0.1, 0.6);
  const tTok = phraseAt('04', 'A language') + 0.5, span = phraseAt('04', 'using') - tTok;
  chips.forEach((n, i) => { dropIn(n, tTok + (i * span) / chips.length); st.sfx('tick', tTok + (i * span) / chips.length, 0.6); });
  tl.to(chips.at(-1), { s: 1.12, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, phraseAt('04', 'using'));
  tl.to(oN, { s: 1.08, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, phraseAt('04', 'using'));
  st.sfx('shimmer', phraseAt('04', 'using'), 0.5);
  tl.fromTo(s5.cam, { s: 1 }, { s: 1.05, duration: t5 - t4, ease: 'none', immediateRender: false }, t4);
}

// =====================================================================
// S6 — Common facts: a bright, well-travelled road. Rare facts: a faint trail into fog.
// =====================================================================
const s6 = scene();
const t6b = phraseAt('06', 'The model still');
{
  const g = s6.g;
  localFloor(g);
  P.road(g, svg, C, { x0: 260, y0: 1500, x1: 430, y1: HZ, w0: 300, w1: 18, bright: true });
  const sheets = Array.from({ length: 7 }, (_, i) => {
    const f = i / 7, x = 260 + (430 - 260) * f + (i % 2 ? 90 : -90) * (1 - f), y = 1430 - (1430 - HZ - 10) * f, s = 0.55 * (1 - f * 0.75);
    const sg = K.el('g', {}, g); F.glass(sg, svg, C, { x: -60, y: -80, w: 120, h: 150, r: 14 }); K.lines(sg, -38, -46, [76, 60, 70], { gap: 22, h: 8 }, C);
    return st.node(sg, { x, y, s, o: 0, r: (i % 3) - 1 });
  });
  const beacon = K.el('g', {}, g); const bN = st.node(beacon, { x: 430, y: HZ - 90, o: 0, s: 0.4 });
  F.glow(beacon, svg, C.orange, { x: 0, y: 0, r: 200, opacity: 0.85 });
  K.el('circle', { r: 50, fill: C.orange }, beacon);
  K.el('path', { d: 'M-22 0 L-6 16 L24 -16', fill: 'none', stroke: C.bg, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, beacon);
  P.road(g, svg, C, { x0: 860, y0: 1500, x1: 690, y1: HZ, w0: 120, w1: 8, bright: false });
  const lone = K.el('g', {}, g); F.glass(lone, svg, C, { x: -60, y: -80, w: 120, h: 150, r: 14 }); K.lines(lone, -38, -46, [76, 50], { gap: 22, h: 8, color: C.slate }, C); const loneN = st.node(lone, { x: 860, y: 1360, s: 0.6, o: 0, r: 4 });
  P.fog(g, svg, C, { x: 700, y: HZ - 30, w: 420, opacity: 0.9 });
  const dim = K.el('g', {}, g); const dimN = st.node(dim, { x: 690, y: HZ - 80, o: 0 });
  K.el('circle', { r: 34, fill: 'none', stroke: C.slate, 'stroke-width': 5 }, dim);
  K.text(dim, 0, 16, '?', { size: 44, fill: C.slate }, C);
  cut(s5, s6, t5, 'push', 0.32);
  // focus left road, then truck across to the faint trail (x offsets put each road at frame centre)
  tl.fromTo(s6.cam, { s: 1.35, ox: 540, oy: 1150, x: 324 }, { s: 1.35, duration: 0.01, immediateRender: false }, t5);
  sheets.forEach((n, i) => { tl.to(n, { o: 1, duration: 0.25 }, t5 + 0.3 + i * 0.16); st.sfx('paper', t5 + 0.3 + i * 0.16, 0.25); });
  tl.to(bN, { o: 1, s: 1, duration: 0.5, ease: 'back.out(2)' }, phraseAt('05', 'so those'));
  st.sfx('confirm', phraseAt('05', 'so those'), 0.7);
  const tRare = L['06'].start;
  tl.to(s6.cam, { x: -337, duration: 0.9, ease: 'power2.inOut' }, tRare - 0.1);
  st.sfx('swish', tRare - 0.1, 0.5);
  tl.to(loneN, { o: 1, duration: 0.3 }, tRare + 0.5);
  tl.to(dimN, { o: 0.8, duration: 0.15, yoyo: true, repeat: 7, ease: 'none' }, tRare + 1.2);
  tl.to(s6.cam, { s: 1, x: 0, duration: 0.6, ease: 'power2.inOut' }, t6b - 1.0);
}

// =====================================================================
// S7 — It writes what sounds right… a mirage (hallucination)
// =====================================================================
const s7 = scene();
const t8 = L['08'].start;
{
  const g = s7.g;
  localFloor(g);
  F.glow(g, svg, C.orange, { x: 540, y: 680, r: 560, sy: 0.6, opacity: 0.25 });
  const rowY = 640;
  const words = ['The', 'study', 'was', 'published', 'in'];
  const chips = chipRow(g, words, { y: rowY, size: 40, tilt: false });
  const slot = chips.at(-1);
  const ans = F.tile(g, svg, C, '2019', { size: 46, accent: true });
  const ansN = st.node(ans.g, { x: slot.x, y: rowY, o: 0 });
  // mirage: a rippling reflection of the whole sentence on the floor
  const mir = P.mirage(g, C, (into) => {
    words.forEach((w, i) => { const c = F.tile(into, svg, C, w, { size: 40 }); c.g.setAttribute('transform', `translate(${chips[i].x},${rowY})`); });
    const a = F.tile(into, svg, C, '2019', { size: 46, accent: true }); a.g.setAttribute('transform', `translate(${slot.x},${rowY})`);
  }, { baseY: rowY + 46, bands: 9, bandH: 11 });
  st.onFrame((t) => mir.update(t));
  const r = ivo(g, { x: 540, y: 1250, scale: 0.6, yaw: 0 }, { t0: t6b - 0.4, t1: t8, expr: 'neutral' });
  cut(s6, s7, t6b, 'push', 0.3);
  chips.forEach((n) => tl.set(n, { o: 1 }, t6b - 0.3));
  tl.to(slot, { s: 1.1, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t6b + 0.2);
  const tFill = phraseAt('06', 'so it writes') + 0.4;
  tl.to(slot, { o: 0, duration: 0.15 }, tFill);
  tl.fromTo(ansN, { o: 0, y: rowY - 120, r: -10 }, { o: 1, y: rowY, r: 0, duration: 0.4, ease: 'back.out(1.8)', immediateRender: false }, tFill);
  st.sfx('pop', tFill, 0.9); st.sfx('shimmer', tFill + 0.1, 0.6);
  tl.add(A.express(r, 'happy'), tFill + 0.1);
  tl.add(A.pose(r, 'presentRight', { duration: 0.3 }), tFill + 0.1);
  const t7 = L['07'].start;
  tl.fromTo(mir.state, { amp: 0 }, { amp: 1, duration: 0.5, immediateRender: false }, t7 - 0.1);
  tl.to(ansN, { y: rowY - 10, duration: 0.35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t7);
  st.sfx('sparkle', t7, 0.7);
  tl.add(A.express(r, 'surprised', { duration: 0.12 }), t7 + 0.1);
  tl.add(A.express(r, 'confused'), t7 + 0.9);
  tl.add(A.pose(r, 'confused', { duration: 0.3 }), t7 + 0.9);
  tl.fromTo(s7.cam, { s: 1, ox: 540, oy: 760 }, { s: 1.08, duration: t8 - t6b, ease: 'none', immediateRender: false }, t6b);
  blinks(r, [t6b + 1.0]);
}

// =====================================================================
// S8 — The exam: a guess earns +1, "I'm not sure" earns 0
// =====================================================================
const s8 = scene();
const t9 = L['09'].start;
{
  const g = s8.g;
  const sheet = K.el('g', {}, g); st.node(sheet, { r: -2, ox: 440, oy: 640 });
  F.glass(sheet, svg, C, { x: 110, y: 320, w: 660, h: 640, r: 40 });
  K.lines(sheet, 160, 380, [300, 200], { gap: 30, h: 14 }, C);
  const box = (y, label) => { K.el('rect', { x: 160, y: y - 28, width: 56, height: 56, rx: 12, fill: 'none', stroke: C.ivory, 'stroke-width': 4, opacity: 0.7 }, sheet); K.text(sheet, 240, y + 15, label, { size: 44, anchor: 'start', fill: C.ivory }, C); };
  box(560, "I'm not sure"); box(760, 'Guess');
  const tickG = K.el('path', { d: 'M168 760 L184 778 L210 742', fill: 'none', stroke: C.orange, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '0 999' }, sheet);
  const z = K.el('g', {}, g); const zN = st.node(z, { x: 650, y: 560, o: 0, s: 1.6 }); P.stamp(z, svg, C, '0', { r: 54, color: C.slate, rot: 8 });
  const p1 = K.el('g', {}, g); const pN = st.node(p1, { x: 650, y: 760, o: 0, s: 1.6 }); P.stamp(p1, svg, C, '+1', { r: 58, rot: -10 });
  const r = ivo(g, { x: 900, y: 1250, scale: 0.66, yaw: -30 }, { t0: t8 - 0.3, t1: t9, expr: 'curious', light: false });
  cut(s7, s8, t8, 'push', 0.32);
  st.sfx('paper', t8, 0.6);
  const tR = phraseAt('08', 'reward');
  draw(tickG, tR, 0.3, 'power2.out');
  tl.to(pN, { o: 1, s: 1, duration: 0.22, ease: 'power3.in' }, tR + 0.35); st.sfx('thud', tR + 0.55, 0.6); st.sfx('confirm', tR + 0.6, 0.6);
  tl.to(zN, { o: 1, s: 1, duration: 0.22, ease: 'power3.in' }, tR + 1.0); st.sfx('thud', tR + 1.2, 0.4);
  tl.add(A.express(r, 'confused'), tR + 0.6);
  tl.add(A.pose(r, 'confused', { duration: 0.3 }), tR + 0.6);
  tl.fromTo(s8.cam, { s: 1 }, { s: 1.06, ox: 440, oy: 640, duration: t9 - t8, ease: 'none', immediateRender: false }, t8);
  blinks(r, [t8 + 1.2]);
}

// =====================================================================
// S9 — Search tools help (radar finds real sources)… but one blip stays unsure
// =====================================================================
const s9 = scene();
const t10 = L['10'].start;
{
  const g = s9.g;
  const rd = P.radar(g, svg, C, { x: 0, y: 0, r: 320, blips: [{ x: 150, y: -120 }, { x: -190, y: 70 }, { x: 90, y: 200 }, { x: -110, y: -210 }, { x: 230, y: 90, unsure: true }] });
  const rdN = st.node(rd.g, { x: 540, y: 620, o: 0, s: 0.8 });
  st.onFrame(() => rd.update());
  const unsure = rd.blips.find((b) => b.unsure);
  const r = ivo(g, { x: 170, y: 1250, scale: 0.7, yaw: 30 }, { t0: t9 - 0.3, t1: t10, expr: 'curious', light: false });
  r.state.opacity = 0;
  cut(s8, s9, t9, 'push', 0.32);
  tl.to(rdN, { o: 1, s: 1, duration: 0.5, ease: 'power2.out' }, t9);
  const tNo = phraseAt('09', 'But no AI');
  tl.fromTo(rd.state, { sweep: 0 }, { sweep: 1, duration: tNo - t9 - 0.2, ease: 'none', immediateRender: false }, t9 + 0.2);
  [0.2, 0.9, 1.6].forEach((d) => st.sfx('pulse', t9 + d, 0.45));
  st.sfx('blip', t9 + 1.0, 0.5); st.sfx('blip', t9 + 1.9, 0.5);
  const qT = K.text(rd.g, 230, 150, '?', { size: 46, fill: C.slate }, C); qT.setAttribute('opacity', 0);
  tl.to(qT, { attr: { opacity: 1 }, duration: 0.3 }, tNo);
  tl.to(unsure.n, { attr: { opacity: 0.25 }, duration: 0.25, yoyo: true, repeat: 5 }, tNo);
  tl.to(r.state, { opacity: 1, duration: 0.3 }, tNo - 0.2);
  tl.add(A.express(r, 'thinking'), tNo);
  tl.add(A.pose(r, 'think', { duration: 0.3 }), tNo);
  tl.fromTo(s9.cam, { s: 1 }, { s: 1.06, duration: t10 - t9, ease: 'none', immediateRender: false }, t9);
}

// =====================================================================
// S10 — Takeaway: ideas & drafts vs. checked sources
// =====================================================================
const s10 = scene();
const tCard = L['10'].end + 0.15;
{
  const g = s10.g;
  const left = K.el('g', {}, g); const leftN = st.node(left, { o: 0, r: -4, ox: 280, oy: 540 });
  F.glass(left, svg, C, { x: 100, y: 320, w: 360, h: 440, r: 36 });
  const bulb = K.el('g', { transform: 'translate(280,520)' }, left);
  F.neon(bulb, 'M-34 30 C-70 0 -60 -70 0 -72 C60 -70 70 0 34 30 L30 52 L-30 52 Z', C.orange, { w: 7, halo: 18 });
  F.neon(bulb, 'M-24 70 L24 70 M-16 86 L16 86', C.orange, { w: 7, halo: 14 });
  K.lines(left, 150, 660, [220, 160], { gap: 26, h: 10 }, C);
  const right = K.el('g', {}, g); const rightN = st.node(right, { o: 0, r: 4, ox: 800, oy: 540 });
  F.glass(right, svg, C, { x: 620, y: 320, w: 360, h: 440, r: 36 });
  const bk = K.el('g', { transform: 'translate(800,470)' }, right);
  K.el('rect', { x: -46, y: -58, width: 92, height: 116, rx: 8, fill: 'none', stroke: C.ivory, 'stroke-width': 5 }, bk);
  K.el('line', { x1: -30, y1: -58, x2: -30, y2: 58, stroke: C.ivory, 'stroke-width': 5 }, bk);
  K.lines(right, 670, 600, [250, 190, 220], { gap: 26, h: 10 }, C);
  const st1 = K.el('g', {}, g); const stN = st.node(st1, { x: 860, y: 640, o: 0, s: 1.7 }); P.stamp(st1, svg, C, '✓', { r: 66, rot: -14 });
  const r = ivo(g, { x: 540, y: 1250, scale: 0.9 }, { t0: t10 - 0.3, t1: tCard, expr: 'explaining' });
  cut(s9, s10, t10, 'push', 0.32);
  tl.add(A.pose(r, 'presentLeft', { duration: 0.35 }), t10 + 0.1);
  tl.fromTo(leftN, { o: 0, y: 60 }, { o: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)', immediateRender: false }, t10 + 0.15); st.sfx('paper', t10 + 0.15, 0.6);
  const tFacts = phraseAt('10', 'For facts');
  tl.add(A.pose(r, 'presentRight', { duration: 0.35 }), tFacts);
  tl.fromTo(rightN, { o: 0, y: 60 }, { o: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)', immediateRender: false }, tFacts); st.sfx('paper', tFacts, 0.6);
  tl.to(leftN, { o: 0.5, duration: 0.4 }, tFacts + 0.2);
  const tReal = phraseAt('10', 'make sure') + 0.2;
  tl.to(stN, { o: 1, s: 1, duration: 0.2, ease: 'power3.in' }, tReal);
  st.sfx('thud', tReal + 0.2, 0.6); st.sfx('confirm', tReal + 0.25, 0.8);
  tl.add(A.express(r, 'happy'), tReal + 0.2);
  tl.add(A.nod(r, { times: 1, duration: 0.45 }), tReal + 0.4);
  tl.fromTo(s10.cam, { s: 1.05 }, { s: 1, duration: tCard - t10, ease: 'power1.out', immediateRender: false }, t10);
  blinks(r, [t10 + 1.3]);
}

endCard(s10, tCard);
finish({ emphasis: ["doesn't exist", 'lying', 'next token', 'strong patterns', 'usually right', 'weak patterns', 'sound like', 'hallucination', 'confident guess', "I'm not sure", 'right every time', 'check the source', "make sure it's real"] });
