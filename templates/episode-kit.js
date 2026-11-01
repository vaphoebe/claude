// Shared episode helpers: stage + narration timing + scene/transition/robot utilities.
// Every beat is anchored to the narration timing file via at(lineId, fraction), so a new
// voiceover re-times the whole episode automatically.
import { createStage } from '/templates/stage.js';
import { buildCues, mountSubtitles } from '/templates/subtitles.js';
import * as A from '/animations/actions.js';
import * as K from '/scenes/components.js';
import * as F from '/scenes/fx.js';

export async function createEpisode(slug, { atmosphere = {} } = {}) {
  const params = new URLSearchParams(location.search);
  const showCaptions = params.get('captions') !== '0';
  const timing = await (await fetch(`/episodes/${slug}/audio/narration.timing.json`)).json();
  const st = await createStage();
  const { C, svg, tl } = st;
  const L = Object.fromEntries(timing.lines.map((l) => [l.id, l]));
  const at = (id, f = 0) => L[id].start + (L[id].end - L[id].start) * f;
  // time of the first phrase of a line containing `text` (falls back to line start)
  const phraseAt = (id, text) => (L[id].phrases ?? []).find((p) => p.text.includes(text))?.start ?? L[id].start;

  const bgLayer = st.layer();
  const atmo = F.atmosphere(bgLayer, svg, C, { seed: 5, warm: [[820, 560, 640]], cool: [[180, 1350, 620]], ...atmosphere });
  st.onFrame((t) => atmo.update(t));
  // scenes sit 120 px lower so the subject is in the vertical middle of the 9:16 frame
  const sceneHost = st.layer({ transform: 'translate(0,120)' });

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
  const open = (s) => tl.set(s.R, { o: 1 }, 0);
  function hero(g, x, ground, s) {
    F.glow(g, svg, C.orange, { x, y: ground - 560 * s, r: 520 * s, opacity: 0.38 });
    F.glow(g, svg, C.orange, { x, y: ground + 4, r: 300 * s, sy: 0.12, opacity: 0.55 });
  }
  // robot with hero lighting, idle motion and a starting expression/pose for [t0, t1]
  function ivo(g, state, { t0, t1, expr = 'neutral', pose = 'idle', light = true }) {
    const r = st.robot(g, state);
    if (light) hero(g, state.x, state.y, state.scale ?? 1);
    g.appendChild(r.root);
    tl.add(A.idle(r, { duration: t1 - t0 + 0.6 }), t0);
    tl.add(A.express(r, expr, { duration: 0.01 }), t0);
    tl.add(A.pose(r, pose, { duration: 0.01 }), t0);
    return r;
  }
  const blinks = (r, times) => times.forEach((t) => tl.add(A.blink(r), t));
  const look = (r, dx, dy, t, d = 0.25) => tl.to([r.state.eyeL, r.state.eyeR], { dx, dy, duration: d, ease: 'power2.out' }, t);
  function draw(path, t, d, ease = 'power2.inOut') {
    const len = path.getTotalLength();
    path.setAttribute('stroke-dasharray', len); path.setAttribute('stroke-dashoffset', len);
    tl.to(path, { attr: { 'stroke-dashoffset': 0 }, duration: d, ease }, t);
  }
  const popIn = (n, t, d = 0.35, from = 0.6) => tl.fromTo(n, { o: 0, s: from }, { o: 1, s: 1, duration: d, ease: 'back.out(1.8)', immediateRender: false }, t);
  const fadeAttr = (el, t, d = 0.4, to = 1) => { el.setAttribute('opacity', 0); tl.to(el, { attr: { opacity: to }, duration: d }, t); };

  // "no" ring + slash (used when something doesn't exist / isn't happening)
  function noMark(g, x, y, r = 170) {
    const m = K.el('g', { transform: `translate(${x},${y})` }, g);
    const ring = F.neon(m, `M0 ${-r} A${r} ${r} 0 1 1 -0.1 ${-r}`, C.slate, { w: 8, halo: 26 });
    const sl = F.neon(m, `M${-r * 0.7} ${r * 0.7} L${r * 0.7} ${-r * 0.7}`, C.slate, { w: 8, halo: 26 });
    for (const p of [ring.core, ring.halo, sl.core, sl.halo]) p.setAttribute('stroke-dasharray', '0 99999');
    return (t) => { for (const p of [ring.core, ring.halo]) draw(p, t, 0.35, 'power2.out'); for (const p of [sl.core, sl.halo]) draw(p, t + 0.3, 0.2, 'power2.out'); st.sfx('thud', t + 0.32, 0.6); };
  }

  // Standard end card: Ivo waves, "Follow Ask Ivo" / "for the next video".
  function endCard(prev, tCard) {
    const s = scene(), e = s.g;
    F.glow(e, svg, C.orange, { x: 540, y: 760, r: 560, opacity: 0.32 });
    const rb = st.robot(e, { x: 540, y: 1090, scale: 0.86 });
    hero(e, 540, 1090, 0.86); e.appendChild(rb.root);
    const pill = K.el('g', {}, e);
    const pillN = st.node(pill, { x: 540, y: 1225, o: 0, s: 0.6 });
    F.glow(pill, svg, C.orange, { x: 0, y: 0, r: 260, sy: 0.4, opacity: 0.55 });
    K.el('rect', { x: -250, y: -52, width: 500, height: 104, rx: 52, fill: C.orange }, pill);
    K.text(pill, 0, 18, 'Follow Ask Ivo', { size: 50, fill: C.bg }, C);
    const sub = K.text(e, 540, 1340, 'for the next video', { size: 42, fill: C.ivory }, C);
    sub.setAttribute('opacity', 0);
    cut(prev, s, tCard, 'fade', 0.45);
    st.sfx('end_tone', tCard + 0.1, 0.7);
    tl.add(A.idle(rb, { duration: 4.5 }), tCard);
    tl.add(A.express(rb, 'happy', { duration: 0.01 }), tCard);
    tl.add(A.wave(rb, { cycles: 2, duration: 1.2 }), tCard + 0.25);
    tl.add(A.pose(rb, 'presentRight', { duration: 0.35 }), tCard + 1.8);
    tl.to(pillN, { o: 1, s: 1, duration: 0.45, ease: 'back.out(2)' }, tCard + 0.6);
    st.sfx('confirm', tCard + 0.6, 0.8);
    tl.to(pillN, { s: 1.05, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tCard + 1.3);
    tl.to(sub, { attr: { opacity: 1 }, duration: 0.4 }, tCard + 0.9);
    blinks(rb, [tCard + 1.6, tCard + 3.2]);
    return s;
  }

  function finish({ emphasis = [], tail = 3.8 } = {}) {
    F.vignette(st.svg, svg);
    mountSubtitles(st, buildCues(timing.lines, st.brand), { visible: showCaptions, emphasis });
    st.finish({ duration: L[timing.lines.at(-1).id].end + 0.15 + tail });
  }

  return { st, C, svg, tl, L, at, phraseAt, timing, bgLayer, scene, cut, open, hero, ivo, blinks, look, draw, popIn, fadeAttr, noMark, endCard, finish, A, K, F };
}
