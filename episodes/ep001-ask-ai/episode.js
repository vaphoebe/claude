// EP001 — What Actually Happens When You Ask AI a Question?
// Every beat is anchored to the narration timing file, so replacing the voiceover
// (e.g. the approved ElevenLabs take) re-times the whole animation automatically.
import { createStage } from '/templates/stage.js';
import { buildCues, mountSubtitles } from '/templates/subtitles.js';
import * as A from '/animations/actions.js';
import * as K from '/scenes/components.js';
import * as F from '/scenes/fx.js';

const params = new URLSearchParams(location.search);
const showCaptions = params.get('captions') !== '0';
const timing = await (await fetch('/episodes/ep001-ask-ai/audio/narration.timing.json')).json();

const st = await createStage();
const { C, svg, tl } = st;
const L = Object.fromEntries(timing.lines.map((l) => [l.id, l]));
const at = (id, f = 0) => L[id].start + (L[id].end - L[id].start) * f;
const END = timing.duration + 0.4;

// ---------- global layers ----------
const bgLayer = st.layer();
const atmo = F.atmosphere(bgLayer, svg, C, { seed: 5, warm: [[820, 560, 640]], cool: [[180, 1350, 620]] });
st.onFrame((t) => atmo.update(t));
const sceneHost = st.layer();

function scene() {
  const root = K.el('g', {}, sceneHost);
  const inner = K.el('g', {}, root);
  return { g: inner, R: st.node(root, { o: 0, ox: 540, oy: 960 }), cam: st.node(inner, { ox: 540, oy: 900 }) };
}
function cut(a, b, t, type = 'push', d = 0.32) {
  const out = { push: { s: 0.96, y: 0 }, whip: { s: 1, y: -340 }, zoom: { s: 1.7, y: 0 }, fade: { s: 1, y: 0 } }[type];
  const inn = { push: { s: 1.07, y: 0 }, whip: { s: 1, y: 380 }, zoom: { s: 0.82, y: 0 }, fade: { s: 1, y: 0 } }[type];
  if (a) tl.to(a.R, { o: 0, s: out.s, y: out.y, duration: d, ease: 'power2.in' }, t - d * 0.4);
  tl.fromTo(b.R, { o: 0, s: inn.s, y: inn.y }, { o: 1, s: 1, y: 0, duration: d, ease: 'power2.out', immediateRender: false }, t - d * 0.4);
  if (type === 'whip' || type === 'zoom') st.sfx('whoosh', t - d * 0.5, 0.8);
  else st.sfx('swish', t - d * 0.4, 0.45);
}
function hero(g, x, ground, s) {
  F.glow(g, svg, C.orange, { x, y: ground - 560 * s, r: 520 * s, opacity: 0.38 });
  F.glow(g, svg, C.orange, { x, y: ground + 4, r: 300 * s, sy: 0.12, opacity: 0.55 });
}
function blinks(r, times) { for (const t of times) tl.add(A.blink(r), t); }
function look(r, dx, dy, t, d = 0.25) { tl.to([r.state.eyeL, r.state.eyeR], { dx, dy, duration: d, ease: 'power2.out' }, t); }
function draw(path, t, d, ease = 'power2.inOut') {
  const len = path.getTotalLength();
  path.setAttribute('stroke-dasharray', len); path.setAttribute('stroke-dashoffset', len);
  tl.to(path, { attr: { 'stroke-dashoffset': 0 }, duration: d, ease }, t);
}
const popIn = (n, t, d = 0.35, from = 0.6) => tl.fromTo(n, { o: 0, s: from }, { o: 1, s: 1, duration: d, ease: 'back.out(1.8)', immediateRender: false }, t);

// =====================================================================
// S1 — Close-up hook: the robot meets a question (0 → "You ask an AI a question.")
// =====================================================================
const s1 = scene();
const t1 = at('01', 0.47);
{
  const r = st.robot(s1.g, { x: 470, y: 1820, scale: 1.95, yaw: 18 });
  hero(s1.g, 470, 1820, 1.95);
  s1.g.appendChild(r.root);
  const q = K.el('g', { transform: 'translate(860,470) scale(1.35)' }, s1.g);
  F.glow(q, svg, C.orange, { x: 0, y: 0, r: 230, opacity: 0.55 });
  const qm = F.neon(q, 'M-62 -78 C-62 -160 78 -168 78 -88 C78 -36 0 -30 0 32', C.orange, { w: 16, halo: 46 });
  const dot = K.el('circle', { cx: 0, cy: 96, r: 13, fill: C.orange }, q);
  st.sfx('music_start', 0, 1);
  tl.set(s1.R, { o: 1 }, 0);
  tl.add(A.idle(r, { duration: t1 + 0.5 }), 0);
  tl.add(A.express(r, 'curious', { duration: 0.01 }), 0);
  for (const p of [qm.core, qm.halo]) draw(p, 0.15, 0.7, 'power2.out');
  tl.fromTo(dot, { attr: { r: 0 } }, { attr: { r: 13 }, duration: 0.25, ease: 'back.out(3)' }, 0.8);
  st.sfx('shimmer', 0.12, 0.7);
  look(r, 16, -10, 0.35);
  tl.to(r.state, { headTilt: -12, headYaw: 14, duration: 0.6, ease: 'power2.inOut' }, 0.35);
  tl.fromTo(s1.cam, { s: 1 }, { s: 1.07, duration: t1 + 0.4, ease: 'none' }, 0);
  blinks(r, [1.15]);
}

// =====================================================================
// S2 — Tap send, the answer pours in ("Seconds later, an answer.")
// =====================================================================
const s2 = scene();
const t2 = L['02'].start;
{
  const panel = K.el('g', {}, s2.g);
  F.glow(panel, svg, C.orange, { x: 380, y: 700, r: 520, opacity: 0.22 });
  F.glass(panel, svg, C, { x: 90, y: 330, w: 560, h: 800, r: 44 });
  for (let i = 0; i < 3; i++) K.el('circle', { cx: 140 + i * 24, cy: 380, r: 7, fill: C.slate, opacity: 0.4 }, panel);
  const qb = K.el('g', { transform: 'translate(330,420)' }, panel);
  K.el('rect', { width: 280, height: 86, rx: 28, fill: C.ivory, opacity: 0.12 }, qb);
  K.lines(qb, 26, 28, [200, 130], { gap: 22, h: 10 }, C);
  const ans = K.el('g', { transform: 'translate(140,560)' }, panel);
  const answerLines = [430, 460, 400, 450, 300, 420, 380, 250].map((w, i) => K.el('rect', { x: 0, y: i * 44, width: w, height: 13, rx: 6.5, fill: C.ivory, opacity: 0 }, ans));
  F.glass(panel, svg, C, { x: 120, y: 1010, w: 500, h: 84, r: 42 });
  const send = K.el('g', {}, panel);
  const sendN = st.node(send, { x: 572, y: 1052 });
  F.glow(send, svg, C.orange, { x: 0, y: 0, r: 90, opacity: 0.7 });
  K.el('circle', { r: 30, fill: C.orange }, send);
  K.el('path', { d: 'M-10 9 L0 -11 L10 9 M0 -11 L0 13', fill: 'none', stroke: C.bg, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, send);
  const ring = K.el('circle', { cx: 572, cy: 1052, r: 30, fill: 'none', stroke: C.orange, 'stroke-width': 4, opacity: 0 }, panel);
  const r = st.robot(s2.g, { x: 830, y: 1250, scale: 1.0, yaw: -28 });
  hero(s2.g, 830, 1250, 1.0); s2.g.appendChild(r.root);
  r.state.eyeL = { ...r.state.eyeL }; // keep refs stable
  cut(s1, s2, t1, 'push', 0.3);
  tl.add(A.idle(r, { duration: t2 - t1 + 0.6 }), t1);
  tl.add(A.express(r, 'curious', { duration: 0.01 }), t1);
  tl.add(A.pose(r, 'pointLeft', { duration: 0.3 }), t1 + 0.05);
  tl.to(sendN, { s: 0.86, duration: 0.08, ease: 'power2.in' }, t1 + 0.32).to(sendN, { s: 1, duration: 0.25, ease: 'back.out(3)' }, t1 + 0.4);
  st.sfx('tap', t1 + 0.32, 0.9);
  tl.fromTo(ring, { attr: { r: 30, opacity: 0.9 } }, { attr: { r: 130, opacity: 0 }, duration: 0.6, ease: 'power2.out', immediateRender: false }, t1 + 0.34);
  tl.fromTo(s2.cam, { s: 1, ox: 572, oy: 1052 }, { s: 1.1, duration: 0.45, ease: 'power2.out', immediateRender: false }, t1);
  const ta = at('01', 0.6);
  answerLines.forEach((ln, i) => tl.fromTo(ln, { attr: { opacity: 0, width: 0 } }, { attr: { opacity: 0.88, width: +ln.getAttribute('width') }, duration: 0.18, ease: 'power2.out', immediateRender: false }, ta + i * 0.09));
  st.sfx('shimmer', ta, 0.8);
  tl.to(s2.cam, { s: 1.0, duration: 0.6, ease: 'power2.inOut' }, ta - 0.1);
  tl.add(A.react(r), ta + 0.1);
  tl.add(A.pose(r, 'idle', { duration: 0.35 }), ta + 0.9);
  blinks(r, [ta + 1.0]);
}

// =====================================================================
// S3 — Not a stored reply ("But it isn't pulling a finished reply from a file.")
// =====================================================================
const s3 = scene();
const t3 = at('02', 0.55);
{
  const g = s3.g;
  F.glow(g, svg, C.blue, { x: 700, y: 760, r: 520, opacity: 0.22 });
  const cab = K.el('g', { transform: 'translate(560,560)' }, g);
  F.glass(cab, svg, C, { x: 0, y: 160, w: 400, h: 560, r: 30 });
  for (const yy of [440, 600]) { F.glass(cab, svg, C, { x: 30, y: yy - 50, w: 340, h: 110, r: 18 }); K.el('rect', { x: 165, y: yy - 2, width: 70, height: 12, rx: 6, fill: C.slate, opacity: 0.6 }, cab); }
  const drawer = K.el('g', {}, cab);
  const drawerN = st.node(drawer, { y: 0 });
  F.glass(drawer, svg, C, { x: 30, y: 180, w: 340, h: 110, r: 18 });
  K.el('rect', { x: 165, y: 228, width: 70, height: 12, rx: 6, fill: C.slate, opacity: 0.6 }, drawer);
  const doc = K.el('g', {}, cab);
  const docN = st.node(doc, { y: 0, o: 0 });
  K.el('rect', { x: 110, y: 0, width: 180, height: 240, rx: 12, fill: C.ivory }, doc);
  K.lines(doc, 134, 34, [130, 120, 136, 96, 126, 80], { gap: 30, h: 9, color: C.bg, opacity: 0.55 }, C);
  const no = K.el('g', { transform: 'translate(760,640)' }, g);
  const ringP = F.neon(no, 'M0 -190 A190 190 0 1 1 -0.1 -190', C.slate, { w: 9, halo: 30 });
  const slash = F.neon(no, 'M-134 134 L134 -134', C.slate, { w: 9, halo: 30 });
  const r = st.robot(g, { x: 270, y: 1250, scale: 0.98, yaw: 22 });
  hero(g, 270, 1250, 0.98); g.appendChild(r.root);
  cut(s2, s3, t2, 'push', 0.3);
  tl.add(A.idle(r, { duration: t3 - t2 + 0.6 }), t2);
  tl.add(A.express(r, 'curious', { duration: 0.01 }), t2);
  tl.add(A.pose(r, 'idle', { duration: 0.01 }), t2);
  tl.fromTo(drawerN, { y: 0 }, { y: -120, duration: 0.45, ease: 'power3.out', immediateRender: false }, t2 + 0.2);
  st.sfx('drawer', t2 + 0.2, 0.8);
  tl.fromTo(docN, { y: 180, o: 0 }, { y: -110, o: 1, duration: 0.55, ease: 'power3.out', immediateRender: false }, t2 + 0.5);
  const tNo = at('02', 0.36);
  for (const p of [ringP.core, ringP.halo]) draw(p, tNo, 0.35, 'power2.out');
  for (const p of [slash.core, slash.halo]) draw(p, tNo + 0.3, 0.22, 'power2.out');
  tl.to(docN, { o: 0.35, duration: 0.3 }, tNo + 0.3);
  st.sfx('thud', tNo + 0.32, 0.7);
  tl.add(A.express(r, 'confused'), tNo);
  tl.add(A.pose(r, 'confused', { duration: 0.3 }), tNo + 0.05);
  tl.to(r.state, { headYaw: -14, duration: 0.14, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tNo + 0.1);
  tl.fromTo(s3.cam, { x: 0 }, { x: -20, duration: t3 - t2, ease: 'none', immediateRender: false }, t2);
}

// =====================================================================
// S4 — Built piece by piece ("It's predicting one, piece by piece.")
// =====================================================================
const s4 = scene();
const t4 = L['03'].start;
{
  const g = s4.g;
  F.glow(g, svg, C.orange, { x: 540, y: 760, r: 560, opacity: 0.3 });
  const words = ['The', 'sky', 'looks', 'blue'];
  const rows = [[0, 1], [2, 3]];
  const pos = [[380, 620], [700, 620], [390, 830], [715, 830]];
  const tiles = words.map((w, i) => { const tt = F.tile(g, svg, C, w, { size: 84 }); return { tt, n: st.node(tt.g, { x: pos[i][0], y: pos[i][1], o: 0 }) }; });
  const slot = F.tile(g, svg, C, '', { size: 84, dashed: true });
  const slotN = st.node(slot.g, { x: 550, y: 1040, o: 0 });
  cut(s3, s4, t3, 'push', 0.3);
  const span = (t4 - 0.4) - (t3 + 0.25);
  tiles.forEach(({ n }, i) => { const t = t3 + 0.2 + (i * span) / 5; popIn(n, t, 0.32, 0.5); st.sfx('tick', t, 0.8); });
  popIn(slotN, t3 + 0.2 + (4 * span) / 5, 0.32, 0.5);
  tl.to(slotN, { s: 1.08, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t3 + 0.25 + (4 * span) / 5);
  tl.fromTo(s4.cam, { s: 1 }, { s: 1.08, duration: t4 - t3 + 0.3, ease: 'none', immediateRender: false }, t3);
}

// =====================================================================
// S5 — "Here's what actually happens." Medium close-up, open hand, push-in.
// =====================================================================
const s5 = scene();
const t5 = L['04'].start;
{
  const g = s5.g;
  const r = st.robot(g, { x: 560, y: 1640, scale: 1.55, yaw: -10 });
  hero(g, 560, 1640, 1.55); g.appendChild(r.root);
  cut(s4, s5, t4 - 0.1, 'push', 0.3);
  tl.add(A.idle(r, { duration: t5 - t4 + 0.6 }), t4 - 0.2);
  tl.add(A.express(r, 'explaining', { duration: 0.01 }), t4 - 0.2);
  tl.add(A.pose(r, 'presentRight', { duration: 0.35 }), t4);
  tl.to(r.state, { yaw: 8, duration: 0.6, ease: 'power2.inOut' }, t4);
  tl.add(A.nod(r, { times: 1, duration: 0.4 }), t4 + 0.6);
  tl.fromTo(s5.cam, { s: 1, ox: 560, oy: 700 }, { s: 1.12, duration: t5 - t4 + 0.2, ease: 'power1.in', immediateRender: false }, t4 - 0.1);
  blinks(r, [t4 + 0.9]);
}

// =====================================================================
// S6 — Message travels: globe → server corridor → the model (chip)
// =====================================================================
const s6a = scene(), s6b = scene(), s6c = scene();
const t6b = at('04', 0.42), t6c = at('04', 0.72), t6end = L['05'].start;
{
  const gl = F.globe(s6a.g, svg, C, { x: 540, y: 800, R: 360 });
  st.onFrame(() => gl.update());
  cut(s5, s6a, t5, 'whip', 0.3);
  tl.fromTo(gl.state, { rot: -0.6 }, { rot: 0.25, duration: t6b - t5 + 0.4, ease: 'none', immediateRender: false }, t5 - 0.2);
  tl.fromTo(gl.state, { arc: 0 }, { arc: 1, duration: t6b - t5 - 0.3, ease: 'power1.inOut', immediateRender: false }, t5 + 0.2);
  st.sfx('pulse', t5 + 0.25, 0.7); st.sfx('pulse', t5 + 1.1, 0.5);
  tl.fromTo(s6a.cam, { s: 0.95 }, { s: 1.1, duration: t6b - t5 + 0.3, ease: 'power1.in', immediateRender: false }, t5);

  const co = F.corridor(s6b.g, svg, C, { vx: 540, vy: 820 });
  st.onFrame(() => co.update());
  cut(s6a, s6b, t6b, 'zoom', 0.35);
  tl.fromTo(co.state, { flow: 0 }, { flow: 3, duration: t6c - t6b + 0.6, ease: 'none', immediateRender: false }, t6b - 0.3);
  tl.fromTo(s6b.cam, { s: 1, ox: 540, oy: 820 }, { s: 1.45, duration: t6c - t6b + 0.4, ease: 'power1.in', immediateRender: false }, t6b - 0.2);
  st.sfx('hum', t6b - 0.2, 0.6);

  const ch = F.chip(s6c.g, svg, C, { x: 540, y: 780, s: 1.15 });
  st.onFrame(() => ch.update());
  cut(s6b, s6c, t6c, 'zoom', 0.35);
  tl.fromTo(ch.state, { flow: 0 }, { flow: 2.2, duration: t6end - t6c + 0.5, ease: 'none', immediateRender: false }, t6c - 0.2);
  tl.fromTo(ch.state, { power: 0 }, { power: 1, duration: 0.8, ease: 'power2.out', immediateRender: false }, t6c + 0.2);
  st.sfx('powerup', t6c + 0.1, 0.7);
  tl.fromTo(s6c.cam, { s: 1.15 }, { s: 1, duration: t6end - t6c + 0.3, ease: 'power2.out', immediateRender: false }, t6c - 0.2);
}

// =====================================================================
// S7 — Tokens ("First, your text is split into tokens: ...")
// =====================================================================
const s7 = scene();
const t7 = L['06'].start;
{
  const g = s7.g;
  F.glow(g, svg, C.orange, { x: 540, y: 600, r: 600, opacity: 0.25 });
  const pane = K.el('g', {}, g);
  const paneN = st.node(pane, { o: 1 });
  F.glass(pane, svg, C, { x: 90, y: 470, w: 900, h: 190, r: 40 });
  const toks = ['How', 'do', 'rain', 'bows', 'form', '?'];
  const accent = [2, 3];
  const sz = 60;
  const made = toks.map((w, i) => F.tile(g, svg, C, w, { size: sz, accent: accent.includes(i) }));
  const sentence = K.text(pane, 540, 565 + sz * 0.36, 'How do rainbows form?', { size: sz, fill: C.ivory }, C);
  const target = [[300, 820], [520, 820], [760, 820], [330, 1000], [580, 1000], [790, 1000]];
  const packedX = [250, 380, 505, 630, 765, 860];
  const nodes = made.map((m, i) => ({ n: st.node(m.g, { x: packedX[i], y: 565, o: 0, s: 0.8 }) }));
  const scan = F.neon(g, 'M0 470 L0 660', C.orange, { w: 5, halo: 30 });
  const scanN = st.node(scan.g, { x: 90, o: 0 });
  cut(s6c, s7, t6end, 'push', 0.32);
  const tSplit = at('05', 0.22);
  tl.fromTo(scanN, { x: 90, o: 1 }, { x: 990, duration: 0.55, ease: 'power1.inOut', immediateRender: false }, tSplit - 0.55);
  tl.to(scanN, { o: 0, duration: 0.15 }, tSplit);
  st.sfx('scan', tSplit - 0.55, 0.6);
  tl.to(paneN, { o: 0, duration: 0.35 }, tSplit);
  tl.to(sentence, { attr: { opacity: 0 }, duration: 0.2 }, tSplit);
  nodes.forEach(({ n }, i) => {
    tl.to(n, { o: 1, duration: 0.15 }, tSplit + i * 0.05);
    tl.to(n, { x: target[i][0], y: target[i][1], s: 1, duration: 0.55, ease: 'back.out(1.4)' }, tSplit + i * 0.05);
    st.sfx('tick', tSplit + i * 0.05, 0.6);
  });
  const pulse = (ids, t) => ids.forEach((i) => { tl.to(nodes[i].n, { s: 1.14, duration: 0.18, ease: 'power2.out' }, t).to(nodes[i].n, { s: 1, duration: 0.3, ease: 'power2.inOut' }, t + 0.18); });
  pulse([0, 1, 4], at('05', 0.5)); st.sfx('blip', at('05', 0.5), 0.5);
  pulse([2, 3], at('05', 0.6)); st.sfx('blip', at('05', 0.6), 0.6);
  pulse([5], at('05', 0.85)); st.sfx('blip', at('05', 0.85), 0.5);
  tl.fromTo(s7.cam, { s: 1 }, { s: 1.06, duration: t7 - t6end, ease: 'none', immediateRender: false }, t6end);
}

// =====================================================================
// S8 — Training → patterns → billions of numbers
// =====================================================================
const s8 = scene(), s8b = scene();
const t8a = at('06', 0.37), t8b = at('06', 0.66), t8 = L['07'].start;
{
  const g = s8.g;
  const pages = K.pageStack(g, C, { x: 180, y: 760, n: 7 });
  const pagesN = st.node(pages, { x: 180, y: 760, o: 1 });
  const streams = [-120, -20, 80].map((dy, i) => F.neon(g, `M250 ${680 + dy} C360 ${680 + dy} 380 ${560 + i * 120} 470 ${560 + i * 120}`, i === 1 ? C.blue : C.orange, { w: 3.5, halo: 16, dash: '24 30' }));
  const net = F.network(g, svg, C, { x: 700, y: 700, w: 460, h: 640, layers: [5, 7, 6, 4] });
  st.onFrame(() => net.update());
  st.onFrame((t) => streams.forEach((s, i) => { const off = -t * 140 - i * 20; s.core.setAttribute('stroke-dashoffset', off); s.halo.setAttribute('stroke-dashoffset', off); }));
  const streamsN = streams.map((s) => st.node(s.g, { o: 0 }));
  const cutRing = K.el('g', { transform: 'translate(190,660)' }, g);
  const cr = F.neon(cutRing, 'M0 -170 A170 170 0 1 1 -0.1 -170', C.slate, { w: 8, halo: 26 });
  const cs = F.neon(cutRing, 'M-120 120 L120 -120', C.slate, { w: 8, halo: 26 });
  const r = st.robot(g, { x: 840, y: 1250, scale: 0.8, yaw: -30 });
  g.appendChild(r.root);
  r.state.opacity = 0;
  cut(s7, s8, t7, 'push', 0.32);
  st.sfx('paper', t7 + 0.1, 0.6);
  tl.fromTo(net.state, { build: 0 }, { build: 1, duration: 1.4, ease: 'power2.out', immediateRender: false }, t7 + 0.2);
  tl.fromTo(net.state, { act: 0 }, { act: 1, duration: 1.6, ease: 'none', repeat: 2, immediateRender: false }, t7 + 0.8);
  streamsN.forEach((n, i) => tl.to(n, { o: 1, duration: 0.4 }, t7 + 0.3 + i * 0.15));
  st.sfx('shimmer', t7 + 1.2, 0.5);
  // "It doesn't look through that text when it answers."
  streamsN.forEach((n) => tl.to(n, { o: 0, duration: 0.3 }, t8a));
  tl.to(pagesN, { o: 0.25, x: 140, duration: 0.5, ease: 'power2.inOut' }, t8a);
  for (const p of [cr.core, cr.halo]) draw(p, t8a + 0.25, 0.35, 'power2.out');
  for (const p of [cs.core, cs.halo]) draw(p, t8a + 0.55, 0.2, 'power2.out');
  st.sfx('thud', t8a + 0.6, 0.5);
  tl.to(r.state, { opacity: 1, duration: 0.3 }, t8a + 0.1);
  tl.add(A.express(r, 'thinking', { duration: 0.01 }), t8a);
  tl.add(A.pose(r, 'think', { duration: 0.01 }), t8a);
  tl.add(A.idle(r, { duration: t8b - t8a + 0.5 }), t8a);
  blinks(r, [t8a + 1.2]);
  tl.fromTo(s8.cam, { s: 1 }, { s: 1.05, duration: t8b - t7, ease: 'none', immediateRender: false }, t7);
  // "The patterns are captured in billions of numbers."
  tl.to(s8.cam, { s: 2.6, ox: 700, oy: 700, duration: 0.5, ease: 'power3.in' }, t8b - 0.3);
  const nf = F.numberField(s8b.g, C, { x: 540, y: 760, cols: 6, rows: 13, dx: 160, dy: 72, size: 34 });
  F.glow(s8b.g, svg, C.orange, { x: 540, y: 760, r: 520, opacity: 0.18 });
  st.onFrame((t) => { nf.state.t = t; nf.update(); });
  cut(s8, s8b, t8b + 0.15, 'zoom', 0.35);
  st.sfx('sparkle', t8b + 0.25, 0.7);
  tl.fromTo(s8b.cam, { s: 1.25 }, { s: 1, duration: t8 - t8b, ease: 'power2.out', immediateRender: false }, t8b);
}

// =====================================================================
// S9 — Next-token probabilities
// =====================================================================
const s9 = scene();
const t9 = L['08'].start;
let s9Winner;
{
  const g = s9.g;
  F.glow(g, svg, C.orange, { x: 400, y: 760, r: 560, opacity: 0.25 });
  const sent = ['The', 'sky', 'looks', 'blue', 'because'];
  const sp = [[180, 470], [355, 470], [560, 470], [775, 470], [330, 610]];
  sent.forEach((w, i) => { const tt = F.tile(g, svg, C, w, { size: 46 }); const n = st.node(tt.g, { x: sp[i][0], y: sp[i][1], o: 0 }); popIn(n, t8 + 0.1 + i * 0.07, 0.3, 0.8); });
  const slot = F.tile(g, svg, C, '', { size: 46, dashed: true });
  const slotN = st.node(slot.g, { x: 600, y: 610, o: 0 });
  popIn(slotN, t8 + 0.5, 0.3, 0.8);
  const cands = [['sunlight', 0.86], ['air', 0.5], ['of', 0.32], ['light', 0.2]];
  const bars = cands.map(([w, v], i) => {
    const row = K.el('g', {}, g);
    const rowN = st.node(row, { x: 0, y: 0, o: 0 });
    const y = 820 + i * 112;
    const lab = F.tile(row, svg, C, w, { size: 42, accent: i === 0 });
    lab.g.setAttribute('transform', `translate(${260},${y})`);
    K.el('rect', { x: 400, y: y - 16, width: 360, height: 32, rx: 16, fill: C.ivory, opacity: 0.06 }, row);
    const bar = K.el('rect', { x: 400, y: y - 16, width: 0, height: 32, rx: 16, fill: i === 0 ? C.orange : C.slate, opacity: i === 0 ? 1 : 0.6 }, row);
    return { rowN, bar, v, lab };
  });
  const r = st.robot(g, { x: 900, y: 1250, scale: 0.74, yaw: -35 });
  g.appendChild(r.root);
  cut(s8b, s9, t8, 'push', 0.32);
  tl.add(A.idle(r, { duration: t9 - t8 + 0.5 }), t8);
  tl.add(A.express(r, 'explaining', { duration: 0.01 }), t8);
  tl.add(A.pose(r, 'presentLeft', { duration: 0.35 }), t8 + 0.4);
  const tBars = at('07', 0.5);
  bars.forEach(({ rowN, bar, v }, i) => {
    tl.fromTo(rowN, { o: 0, x: -30 }, { o: 1, x: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, tBars - 0.4 + i * 0.1);
    tl.to(bar, { attr: { width: 360 * v }, duration: 0.9, ease: 'power2.out' }, tBars + i * 0.12);
  });
  st.sfx('rise', tBars, 0.6);
  const tWin = at('07', 0.9);
  tl.to(bars[0].rowN, { s: 1.06, ox: 540, oy: 820, duration: 0.25, ease: 'power2.out' }, tWin);
  st.sfx('blip', tWin, 0.7);
  tl.to(slotN, { s: 1.1, duration: 0.25, yoyo: true, repeat: 1 }, tWin);
  s9Winner = { bars, slotN };
  blinks(r, [t8 + 1.5, tBars + 1.6]);
}

// =====================================================================
// S10 — Picks one, adds it, repeats: the answer streams out
// =====================================================================
const s10 = scene();
const t10 = L['09'].start;
{
  const g = s10.g;
  F.glow(g, svg, C.orange, { x: 540, y: 700, r: 640, opacity: 0.28 });
  const words = ['The', 'sky', 'looks', 'blue', 'because', 'sunlight', 'scatters', 'off', 'tiny', 'air', 'molecules', '.'];
  const sz = 46, gap = 14, maxW = 900;
  const made = words.map((w, i) => F.tile(g, svg, C, w, { size: sz, accent: i === 5 }));
  let x = 0, y = 0; const pos = [];
  made.forEach((m, i) => { if (x + m.w > maxW) { x = 0; y += m.h + gap; } pos.push([x + m.w / 2, y]); x += m.w + gap; });
  const rowsW = {}; pos.forEach(([px, py], i) => { rowsW[py] = Math.max(rowsW[py] ?? 0, px + made[i].w / 2); });
  const nodes = made.map((m, i) => st.node(m.g, { x: 540 - rowsW[pos[i][1]] / 2 + pos[i][0], y: 470 + pos[i][1], o: i < 5 ? 1 : 0 }));
  const loop = K.el('g', {}, g);
  const loopN = st.node(loop, { x: 540, y: 1010, r: 0, o: 0 });
  F.neon(loop, 'M0 -70 A70 70 0 1 1 -66 -24', C.orange, { w: 6, halo: 22 });
  F.neon(loop, 'M-84 -46 L-66 -22 L-40 -36', C.orange, { w: 6, halo: 22 });
  cut(s9, s10, t9, 'fade', 0.25);
  // first new token drops in from the probability list
  const seq = nodes.slice(5);
  const tEnd = L['08'].end - 0.3;
  const times = seq.map((_, i) => { const f = i / (seq.length - 1); return t9 + 0.25 + (tEnd - t9 - 0.25) * (1 - Math.pow(1 - f, 1.6)); });
  seq.forEach((n, i) => {
    tl.fromTo(n, { o: 0, y: n.y + 120, s: 0.7 }, { o: 1, y: n.y, s: 1, duration: 0.32, ease: 'back.out(1.6)', immediateRender: false }, times[i]);
    st.sfx(i === 0 ? 'pop' : 'tick', times[i], i === 0 ? 0.8 : 0.65);
  });
  tl.to(loopN, { o: 1, duration: 0.3 }, t9 + 0.4);
  tl.fromTo(loopN, { r: 0 }, { r: 720, duration: t10 - t9, ease: 'power1.in', immediateRender: false }, t9 + 0.4);
  tl.to(loopN, { o: 0, duration: 0.3 }, tEnd + 0.2);
  tl.fromTo(s10.cam, { s: 1.04 }, { s: 0.98, duration: t10 - t9, ease: 'none', immediateRender: false }, t9);
}

// =====================================================================
// S11 — Fluent isn't the same as correct
// =====================================================================
const s11 = scene();
const t11 = L['10'].start;
{
  const g = s11.g;
  F.glow(g, svg, C.blue, { x: 760, y: 700, r: 560, opacity: 0.2 });
  const card = K.el('g', {}, g);
  F.glass(card, svg, C, { x: 440, y: 330, w: 580, h: 800, r: 44 });
  for (let i = 0; i < 3; i++) K.el('circle', { cx: 490 + i * 24, cy: 380, r: 7, fill: C.slate, opacity: 0.4 }, card);
  const lw = [470, 500, 440, 490, 360, 480, 420, 300, 450, 390];
  const ls = lw.map((w, i) => K.el('rect', { x: 490, y: 450 + i * 56, width: 0, height: 14, rx: 7, fill: C.ivory, opacity: 0.88 }, card));
  const bad = 4;
  const badGlow = K.el('rect', { x: 476, y: 450 + bad * 56 - 14, width: 0, height: 42, rx: 21, fill: C.orange, opacity: 0 }, card);
  const mag = K.el('g', {}, g);
  const magN = st.node(mag, { x: 1150, y: 450 + bad * 56 + 6, o: 0 });
  F.glow(mag, svg, C.ivory, { x: 0, y: 0, r: 120, opacity: 0.12 });
  K.el('circle', { r: 96, fill: C.ivory, 'fill-opacity': 0.06, stroke: C.ivory, 'stroke-width': 9 }, mag);
  K.el('line', { x1: 70, y1: 70, x2: 150, y2: 150, stroke: C.ivory, 'stroke-width': 18, 'stroke-linecap': 'round' }, mag);
  const r = st.robot(g, { x: 230, y: 1250, scale: 0.98, yaw: 30 });
  hero(g, 230, 1250, 0.98); g.appendChild(r.root);
  cut(s10, s11, t10, 'push', 0.32);
  tl.add(A.idle(r, { duration: t11 - t10 + 0.5 }), t10);
  tl.add(A.express(r, 'happy', { duration: 0.01 }), t10);
  tl.add(A.pose(r, 'presentRight', { duration: 0.35 }), t10 + 0.15);
  ls.forEach((ln, i) => tl.to(ln, { attr: { width: lw[i] }, duration: 0.22, ease: 'power2.out' }, t10 + 0.2 + i * 0.13));
  st.sfx('shimmer', t10 + 0.2, 0.6);
  const tMag = at('09', 0.33), tBad = at('09', 0.55);
  tl.to(magN, { o: 1, x: 900, duration: 0.5, ease: 'power3.out' }, tMag);
  tl.to(magN, { x: 700, duration: tBad - tMag - 0.4, ease: 'sine.inOut' }, tMag + 0.5);
  st.sfx('swish', tMag, 0.5);
  tl.to(ls[bad], { attr: { fill: C.orange }, duration: 0.15 }, tBad);
  tl.to(badGlow, { attr: { width: 470, opacity: 0.18 }, duration: 0.3, ease: 'power2.out' }, tBad);
  st.sfx('impact', tBad, 0.9); st.sfx('music_dip', tBad, 1);
  tl.fromTo(s11.cam, { s: 1, ox: 700, oy: 674 }, { s: 1.12, duration: 0.6, ease: 'power2.out', immediateRender: false }, tBad - 0.1);
  tl.add(A.express(r, 'surprised', { duration: 0.12 }), tBad);
  tl.add(A.express(r, 'confused'), tBad + 0.5);
  tl.add(A.pose(r, 'confused', { duration: 0.3 }), tBad + 0.4);
  const tWrong = at('09', 0.75);
  tl.add(A.express(r, 'thinking'), tWrong);
  tl.add(A.pose(r, 'think', { duration: 0.4 }), tWrong);
  tl.to(s11.cam, { s: 1.0, duration: 0.8, ease: 'power2.inOut' }, tWrong);
  blinks(r, [t10 + 1.4, tWrong + 0.9]);
}

// =====================================================================
// S12 — Close + end card
// =====================================================================
const s12 = scene(), s13 = scene();
const tCard = L['10'].end + 0.15;
{
  const g = s12.g;
  F.glow(g, svg, C.orange, { x: 540, y: 700, r: 640, opacity: 0.25 });
  const card = K.el('g', {}, g);
  const cardN = st.node(card, { o: 1 });
  F.glass(card, svg, C, { x: 560, y: 420, w: 440, h: 600, r: 40 });
  K.lines(card, 610, 510, [330, 350, 300, 340, 260, 320], { gap: 54, h: 14 }, C);
  const ck = K.el('g', {}, g);
  const ckN = st.node(ck, { x: 985, y: 430, o: 0, s: 0.4 });
  F.glow(ck, svg, C.orange, { x: 0, y: 0, r: 120, opacity: 0.6 });
  K.el('circle', { r: 46, fill: C.orange }, ck);
  const tick = K.el('path', { d: 'M-20 0 L-6 15 L21 -14', fill: 'none', stroke: C.bg, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ck);
  const r = st.robot(g, { x: 300, y: 1250, scale: 1.02, yaw: 12 });
  hero(g, 300, 1250, 1.02); g.appendChild(r.root);
  cut(s11, s12, t11, 'push', 0.32);
  tl.add(A.idle(r, { duration: tCard - t11 + 0.5 }), t11);
  tl.add(A.express(r, 'explaining', { duration: 0.01 }), t11);
  tl.add(A.pose(r, 'explain', { duration: 0.4 }), t11 + 0.1);
  const tCheck = at('10', 0.85);
  tl.to(ckN, { o: 1, s: 1, duration: 0.4, ease: 'back.out(2.2)' }, tCheck);
  draw(tick, tCheck + 0.1, 0.3, 'power2.out');
  st.sfx('confirm', tCheck, 0.8);
  tl.add(A.express(r, 'happy'), tCheck);
  tl.add(A.nod(r, { times: 1, duration: 0.45 }), tCheck + 0.2);
  tl.fromTo(s12.cam, { s: 1.08 }, { s: 1, duration: tCard - t11, ease: 'power1.out', immediateRender: false }, t11);
  blinks(r, [t11 + 1.2, t11 + 3.6]);

  // End card: Ivo waves, then the follow call-to-action (no logo animation)
  const e = s13.g;
  F.glow(e, svg, C.orange, { x: 540, y: 760, r: 560, opacity: 0.32 });
  const rb = st.robot(e, { x: 540, y: 1090, scale: 0.86 });
  hero(e, 540, 1090, 0.86); e.appendChild(rb.root);
  const pill = K.el('g', {}, e);
  const pillN = st.node(pill, { x: 540, y: 1225, o: 0, s: 0.6 });
  F.glow(pill, svg, C.orange, { x: 0, y: 0, r: 260, sy: 0.4, opacity: 0.55 });
  K.el('rect', { x: -250, y: -52, width: 500, height: 104, rx: 52, fill: C.orange }, pill);
  K.text(pill, 0, 18, 'Follow Ask Ivo', { size: 50, fill: C.bg }, C);
  const sub = K.text(e, 540, 1340, 'for the next video', { size: 42, fill: C.ivory }, C);
  const tag = K.text(e, 540, 1420, 'Big questions. Simple explanations.', { size: 32, fill: C.slate }, C);
  sub.setAttribute('opacity', 0); tag.setAttribute('opacity', 0);
  cut(s12, s13, tCard, 'fade', 0.45);
  st.sfx('end_tone', tCard + 0.1, 0.7);
  tl.add(A.idle(rb, { duration: 4.5 }), tCard);
  tl.add(A.express(rb, 'happy', { duration: 0.01 }), tCard);
  tl.add(A.wave(rb, { cycles: 2, duration: 1.2 }), tCard + 0.25);
  tl.add(A.pose(rb, 'presentRight', { duration: 0.35 }), tCard + 1.8);
  tl.to(pillN, { o: 1, s: 1, duration: 0.45, ease: 'back.out(2)' }, tCard + 0.6);
  st.sfx('confirm', tCard + 0.6, 0.8);
  tl.to(pillN, { s: 1.05, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tCard + 1.3);
  tl.fromTo(sub, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.4, immediateRender: false }, tCard + 0.9);
  tl.fromTo(tag, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.5, immediateRender: false }, tCard + 1.4);
  blinks(rb, [tCard + 1.6, tCard + 3.2]);
}

F.vignette(st.svg, svg);
mountSubtitles(st, buildCues(timing.lines, st.brand), {
  visible: showCaptions,
  emphasis: ['tokens', 'predicting', 'data center', 'language model', 'patterns', 'billions of numbers', 'likely to come next', 'token by token', 'fluent', 'correct', 'wrong', 'one prediction at a time', 'Check what matters'],
});
st.finish({ duration: tCard + 3.8 });
