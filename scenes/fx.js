// Cinematic building blocks: atmosphere (glows, bokeh, vignette), glass panels, neon
// lines and set pieces (globe, server corridor, chip, neural network). Everything is
// drawn in brand colors with cheap gradients instead of heavy blur filters so frames
// render fast. Animated pieces expose plain state objects + an update(t) function.
import { el, text } from './components.js';

let uid = 0;
const nid = (p) => `${p}${uid++}`;

export function defs(svg) {
  return svg.querySelector('defs') ?? el('defs', {}, svg);
}

// Radial gradient that fades a color to transparent — the basis of every glow.
export function glowGrad(svg, color, { id = nid('g'), stops = [[0, 1], [0.35, 0.45], [1, 0]] } = {}) {
  const g = el('radialGradient', { id }, defs(svg));
  for (const [o, a] of stops) el('stop', { offset: o, 'stop-color': color, 'stop-opacity': a }, g);
  return `url(#${id})`;
}

export function glow(parent, svg, color, { x, y, r, opacity = 1, sy = 1 }) {
  return el('ellipse', { cx: x, cy: y, rx: r, ry: r * sy, fill: glowGrad(svg, color), opacity }, parent);
}

// Seeded random so every render is identical.
export function rng(seed = 1) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Background atmosphere: soft colored light pools + drifting bokeh + vignette.
export function atmosphere(parent, svg, C, { seed = 1, warm = [[780, 520, 620]], cool = [[220, 1300, 560]], bokeh = 26, drift = 1 } = {}) {
  const g = el('g', {}, parent);
  for (const [x, y, r] of cool) glow(g, svg, C.blue, { x, y, r, opacity: 0.18 });
  for (const [x, y, r] of warm) glow(g, svg, C.orange, { x, y, r, opacity: 0.22 });
  const R = rng(seed), dots = [];
  const warmG = glowGrad(svg, C.orange, { stops: [[0, 0.9], [0.5, 0.35], [1, 0]] });
  const coolG = glowGrad(svg, C.slate, { stops: [[0, 0.7], [0.5, 0.25], [1, 0]] });
  for (let i = 0; i < bokeh; i++) {
    const d = { x: R() * 1080, y: R() * 1920, r: 14 + R() * 70, depth: 0.3 + R() * 0.7, ph: R() * 6.28 };
    d.node = el('circle', { cx: d.x, cy: d.y, r: d.r, fill: R() > 0.55 ? warmG : coolG, opacity: 0.12 + R() * 0.3 }, g);
    dots.push(d);
  }
  return {
    g,
    update(t) {
      for (const d of dots) {
        d.node.setAttribute('cx', d.x + Math.sin(t * 0.25 + d.ph) * 24 * d.depth * drift);
        d.node.setAttribute('cy', d.y - t * 9 * d.depth * drift);
      }
    },
  };
}

export function vignette(parent, svg) {
  const id = nid('v');
  const gr = el('radialGradient', { id, cx: '50%', cy: '46%', r: '75%' }, defs(svg));
  el('stop', { offset: '55%', 'stop-color': '#000', 'stop-opacity': 0 }, gr);
  el('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': 0.72 }, gr);
  return el('rect', { width: 1080, height: 1920, fill: `url(#${id})`, 'pointer-events': 'none' }, parent);
}

// Frosted glass panel with a soft edge highlight. Returns the group (origin = top-left).
export function glass(parent, svg, C, { x, y, w, h, r = 34, accent = false, opacity = 1 }) {
  const g = el('g', { transform: `translate(${x},${y})`, opacity }, parent);
  const edge = nid('e');
  const lg = el('linearGradient', { id: edge, x1: 0, y1: 0, x2: 1, y2: 1 }, defs(svg));
  el('stop', { offset: 0, 'stop-color': accent ? C.orange : C.ivory, 'stop-opacity': accent ? 0.95 : 0.42 }, lg);
  el('stop', { offset: 0.5, 'stop-color': C.ivory, 'stop-opacity': 0.08 }, lg);
  el('stop', { offset: 1, 'stop-color': accent ? C.orange : C.slate, 'stop-opacity': accent ? 0.6 : 0.22 }, lg);
  if (accent) el('rect', { x: -8, y: -8, width: w + 16, height: h + 16, rx: r + 8, fill: 'none', stroke: C.orange, 'stroke-width': 18, opacity: 0.12 }, g);
  el('rect', { width: w, height: h, rx: r, fill: C.bg2, 'fill-opacity': 0.72 }, g);
  el('rect', { width: w, height: h, rx: r, fill: C.ivory, 'fill-opacity': 0.035 }, g);
  el('rect', { width: w, height: h, rx: r, fill: 'none', stroke: `url(#${edge})`, 'stroke-width': 2.5 }, g);
  el('path', { d: `M${r} 2 H${w - r}`, stroke: C.ivory, 'stroke-opacity': 0.35, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
  return g;
}

// Neon stroke: a wide faint halo under a bright core.
export function neon(parent, d, color, { w = 4, halo = 18, opacity = 1, dash } = {}) {
  const g = el('g', { opacity }, parent);
  const extra = dash ? { 'stroke-dasharray': dash } : {};
  const h = el('path', { d, fill: 'none', stroke: color, 'stroke-width': halo, 'stroke-linecap': 'round', opacity: 0.14, ...extra }, g);
  const c = el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', ...extra }, g);
  return { g, halo: h, core: c };
}

// Glass word tile used for tokens.
export function tile(parent, svg, C, str, { x = 0, y = 0, size = 46, accent = false, dashed = false } = {}) {
  const w = dashed ? size * 2.6 : Math.max(size * 1.4, str.length * size * 0.56 + size * 1.1), h = size * 1.9;
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  const inner = el('g', { transform: `translate(${-w / 2},${-h / 2})` }, g);
  if (dashed) {
    el('rect', { width: w, height: h, rx: 18, fill: C.orange, 'fill-opacity': 0.06, stroke: C.orange, 'stroke-width': 3, 'stroke-dasharray': '12 9' }, inner);
  } else {
    glass(inner, svg, C, { x: 0, y: 0, w, h, r: 18, accent });
    text(inner, w / 2, h / 2 + size * 0.36, str, { size, fill: accent ? C.orange : C.ivory }, C);
  }
  return { g, w, h };
}

// Dotted globe with rotating city lights and network arcs.
export function globe(parent, svg, C, { x = 540, y = 820, R = 340, seed = 4 } = {}) {
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  glow(g, svg, C.blue, { x: 0, y: 0, r: R * 1.5, opacity: 0.22 });
  const body = nid('gb');
  const bg = el('radialGradient', { id: body, cx: '38%', cy: '32%', r: '75%' }, defs(svg));
  el('stop', { offset: 0, 'stop-color': '#1d2433' }, bg); el('stop', { offset: 1, 'stop-color': '#0b0d12' }, bg);
  el('circle', { r: R, fill: `url(#${body})`, stroke: C.blue, 'stroke-opacity': 0.45, 'stroke-width': 3 }, g);
  el('circle', { r: R + 10, fill: 'none', stroke: C.blue, 'stroke-opacity': 0.12, 'stroke-width': 18 }, g);
  const pts = [], rnd = rng(seed);
  // pseudo-continents: points kept where a few low-frequency waves overlap
  for (let la = -78; la <= 78; la += 3.4) for (let lo = 0; lo < 360; lo += 3.4) {
    const L = (la * Math.PI) / 180, O = (lo * Math.PI) / 180;
    const land = Math.sin(O * 2 + 1.3) * Math.cos(L * 3) + Math.sin(O * 3 + L * 2) * 0.6 + Math.cos(O + 0.5) * 0.5;
    if (land > 0.3) pts.push({ L, O, city: rnd() > 0.9, n: el('circle', { r: 2.6 }, g) });
  }
  const arcG = el('g', {}, g);
  const state = { rot: 0, arc: 0 };
  const proj = (L, O) => { const o = O + state.rot; return { x: R * Math.cos(L) * Math.sin(o), y: -R * Math.sin(L), z: Math.cos(L) * Math.cos(o) }; };
  const route = [[0.62, -1.4], [0.45, 0.2], [0.2, 0.9]]; // lat, lon (rad)
  const arcs = [neon(arcG, '', C.orange, { w: 3.5, halo: 16 }), neon(arcG, '', C.orange, { w: 3.5, halo: 16 })];
  const packet = el('circle', { r: 11, fill: C.ivory }, arcG);
  const packetGlow = glow(arcG, svg, C.orange, { x: 0, y: 0, r: 46 });
  function arcPath(a, b) {
    const p = proj(...a), q = proj(...b);
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, k = 1.35;
    return { d: `M${p.x} ${p.y} Q${mx * k} ${my * k - 60} ${q.x} ${q.y}`, vis: Math.min(p.z, q.z) > -0.1 };
  }
  return {
    g, state,
    update() {
      for (const p of pts) {
        const q = proj(p.L, p.O);
        const vis = q.z > 0;
        p.n.setAttribute('cx', q.x); p.n.setAttribute('cy', q.y);
        p.n.setAttribute('fill', p.city ? C.orange : C.slate);
        p.n.setAttribute('opacity', vis ? (p.city ? 0.95 : 0.25 + 0.45 * q.z) : 0);
        p.n.setAttribute('r', p.city ? 3.6 : 2.4);
      }
      arcs.forEach((a, i) => {
        const { d, vis } = arcPath(route[i], route[i + 1]);
        a.core.setAttribute('d', d); a.halo.setAttribute('d', d);
        const len = a.core.getTotalLength() || 1;
        const prog = Math.min(1, Math.max(0, state.arc * 2 - i));
        for (const n of [a.core, a.halo]) { n.setAttribute('stroke-dasharray', `${len}`); n.setAttribute('stroke-dashoffset', `${len * (1 - prog)}`); }
        a.g.setAttribute('opacity', vis ? 1 : 0);
        if (prog > 0 && prog < 1) {
          const pt = a.core.getPointAtLength(len * prog);
          packet.setAttribute('cx', pt.x); packet.setAttribute('cy', pt.y);
          packetGlow.setAttribute('cx', pt.x); packetGlow.setAttribute('cy', pt.y);
        }
      });
      const show = state.arc > 0 && state.arc < 1 ? 1 : 0;
      packet.setAttribute('opacity', show); packetGlow.setAttribute('opacity', show);
    },
  };
}

// One-point-perspective server corridor with light streaks flowing to the vanishing point.
export function corridor(parent, svg, C, { vx = 540, vy = 860 } = {}) {
  const g = el('g', {}, parent);
  glow(g, svg, C.orange, { x: vx, y: vy, r: 380, opacity: 0.45 });
  const state = { flow: 0 };
  const racks = [];
  for (const side of [-1, 1]) for (let i = 0; i < 7; i++) {
    const z0 = 1 / (1 + i * 0.55), z1 = 1 / (1 + (i + 1) * 0.55);
    const xo0 = side * 760 * z0, xo1 = side * 760 * z1, xi0 = side * 360 * z0, xi1 = side * 360 * z1;
    const top0 = -900 * z0, bot0 = 1000 * z0, top1 = -900 * z1, bot1 = 1000 * z1;
    const face = el('path', { d: `M${vx + xi0} ${vy + top0} L${vx + xi1} ${vy + top1} L${vx + xi1} ${vy + bot1} L${vx + xi0} ${vy + bot0} Z`, fill: C.bg2, stroke: C.slate, 'stroke-opacity': 0.28, 'stroke-width': 2 }, g);
    for (let k = 1; k < 10; k++) {
      const f = k / 10;
      const ya = vy + top0 + (bot0 - top0) * f, yb = vy + top1 + (bot1 - top1) * f;
      el('line', { x1: vx + xi0, y1: ya, x2: vx + xi1, y2: yb, stroke: C.slate, 'stroke-opacity': 0.16, 'stroke-width': 1.5 }, g);
      if ((k + i) % 3 === 0) el('circle', { cx: vx + xi0 + (xi1 - xi0) * 0.25, cy: ya + (yb - ya) * 0.25 + 8 * z0, r: 5 * z0 + 1, fill: C.orange, opacity: 0.9 }, g);
    }
    racks.push(face);
  }
  // floor streaks
  const streaks = [];
  for (let i = 0; i < 9; i++) {
    const x0 = -420 + i * 105;
    const d = `M${vx + x0} 1920 L${vx + x0 * 0.06} ${vy + 60}`;
    const n = neon(g, d, i % 3 === 1 ? C.blue : C.orange, { w: 3, halo: 14, dash: '60 340', opacity: 0.85 });
    streaks.push(n);
  }
  return {
    g, state,
    update() { streaks.forEach((s, i) => { const off = -state.flow * 900 - i * 47; s.core.setAttribute('stroke-dashoffset', off); s.halo.setAttribute('stroke-dashoffset', off); }); },
  };
}

// Processor with glowing traces and pulses flowing inward.
export function chip(parent, svg, C, { x = 540, y = 820, s = 1 } = {}) {
  const g = el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
  const state = { flow: 0, power: 0 };
  const traces = [];
  const rnd = rng(9);
  for (let i = 0; i < 28; i++) {
    const side = i % 4, k = Math.floor(i / 4) - 3;
    const off = k * 46;
    const len = 260 + rnd() * 260, bend = 60 + rnd() * 80;
    let d;
    if (side === 0) d = `M${off} -150 L${off} ${-150 - bend} L${off + k * 30} ${-150 - bend - 40} L${off + k * 30} ${-150 - len}`;
    if (side === 1) d = `M${off} 150 L${off} ${150 + bend} L${off - k * 30} ${150 + bend + 40} L${off - k * 30} ${150 + len}`;
    if (side === 2) d = `M-150 ${off} L${-150 - bend} ${off} L${-150 - bend - 40} ${off + k * 30} L${-150 - len} ${off + k * 30}`;
    if (side === 3) d = `M150 ${off} L${150 + bend} ${off} L${150 + bend + 40} ${off - k * 30} L${150 + len} ${off - k * 30}`;
    el('path', { d, fill: 'none', stroke: C.slate, 'stroke-opacity': 0.25, 'stroke-width': 3 }, g);
    traces.push(neon(g, d, C.orange, { w: 3, halo: 12, dash: '40 600' }));
  }
  glow(g, svg, C.orange, { x: 0, y: 0, r: 330, opacity: 0.5 });
  const pkg = el('rect', { x: -170, y: -170, width: 340, height: 340, rx: 28, fill: '#151a24', stroke: C.slate, 'stroke-opacity': 0.5, 'stroke-width': 3 }, g);
  for (let i = -3; i <= 3; i++) for (const [dx, dy, w, h] of [[i * 46 - 6, -184, 12, 16], [i * 46 - 6, 168, 12, 16], [-184, i * 46 - 6, 16, 12], [168, i * 46 - 6, 16, 12]]) el('rect', { x: dx, y: dy, width: w, height: h, rx: 3, fill: C.slate, opacity: 0.6 }, g);
  const die = el('rect', { x: -110, y: -110, width: 220, height: 220, rx: 16, fill: '#0b0d12', stroke: C.orange, 'stroke-width': 2.5 }, g);
  const grid = el('g', {}, g);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) el('rect', { x: -96 + i * 33, y: -96 + j * 33, width: 26, height: 26, rx: 4, fill: C.orange, opacity: 0.08 + ((i * 7 + j * 3) % 5) * 0.05 }, grid);
  return {
    g, state,
    update() {
      traces.forEach((t, i) => { const off = state.flow * 640 + i * 37; t.core.setAttribute('stroke-dashoffset', off); t.halo.setAttribute('stroke-dashoffset', off); t.g.setAttribute('opacity', 0.35 + 0.65 * state.power); });
      grid.setAttribute('opacity', 0.4 + 0.6 * state.power);
      die.setAttribute('stroke-opacity', 0.4 + 0.6 * state.power);
    },
  };
}

// Layered neural network. state.act (0..1) sweeps activation left→right.
export function network(parent, svg, C, { x = 540, y = 760, w = 820, h = 760, layers = [5, 7, 7, 5], seed = 7 } = {}) {
  const g = el('g', { transform: `translate(${x - w / 2},${y - h / 2})` }, parent);
  const rnd = rng(seed);
  const nodes = layers.map((n, li) => Array.from({ length: n }, (_, k) => ({ x: (li / (layers.length - 1)) * w, y: ((k + 0.5) / n) * h + (rnd() - 0.5) * 30, li, warm: rnd() > 0.45 })));
  const edges = [];
  for (let li = 0; li < layers.length - 1; li++) for (const a of nodes[li]) for (const b of nodes[li + 1]) if (rnd() > 0.35) {
    const n = el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: a.warm ? C.orange : C.blue, 'stroke-width': 1.6 }, g);
    edges.push({ n, li, k: rnd() });
  }
  const glowW = glowGrad(svg, C.orange), glowC = glowGrad(svg, C.blue);
  for (const a of nodes.flat()) {
    a.halo = el('circle', { cx: a.x, cy: a.y, r: 44, fill: a.warm ? glowW : glowC }, g);
    a.core = el('circle', { cx: a.x, cy: a.y, r: 11, fill: a.warm ? C.orange : C.blue, stroke: C.ivory, 'stroke-opacity': 0.6, 'stroke-width': 2 }, g);
  }
  const state = { act: 0, build: 1 };
  return {
    g, state, nodes,
    update() {
      const L = layers.length - 1;
      for (const a of nodes.flat()) {
        const on = Math.max(0, 1 - Math.abs(state.act * (L + 1) - 0.5 - a.li) * 0.9);
        const built = Math.min(1, Math.max(0, state.build * (L + 1) - a.li));
        a.halo.setAttribute('opacity', built * (0.25 + 0.75 * on));
        a.core.setAttribute('opacity', built);
        a.core.setAttribute('r', 9 + 5 * on);
      }
      for (const e of edges) {
        const on = Math.max(0, 1 - Math.abs(state.act * (L + 1) - 1 - e.li) * 0.9);
        const built = Math.min(1, Math.max(0, state.build * (L + 1) - e.li - 0.5));
        e.n.setAttribute('opacity', built * (0.12 + 0.6 * on * (0.5 + e.k * 0.5)));
      }
    },
  };
}

// Field of small numbers (model parameters) that shimmer.
export function numberField(parent, C, { x = 540, y = 760, cols = 6, rows = 11, dx = 150, dy = 66, seed = 11, size = 30 } = {}) {
  const g = el('g', {}, parent);
  const rnd = rng(seed), cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = (rnd() * 2 - 1).toFixed(2).replace('-0.', '−0.').replace('0.', '0.');
    const t = text(g, x + (c - (cols - 1) / 2) * dx + (r % 2) * 30, y + (r - (rows - 1) / 2) * dy, v, { size, fill: C.slate }, C);
    cells.push({ t, ph: rnd() * 6.28, warm: rnd() > 0.88 });
  }
  const state = { t: 0, on: 1 };
  return {
    g, state,
    update() {
      for (const c of cells) {
        const f = 0.5 + 0.5 * Math.sin(state.t * 3 + c.ph);
        c.t.setAttribute('fill', c.warm && f > 0.6 ? C.orange : C.slate);
        c.t.setAttribute('opacity', state.on * (c.warm ? 0.5 + 0.5 * f : 0.18 + 0.3 * f));
      }
    },
  };
}
