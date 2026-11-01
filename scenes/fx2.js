// Second visual family ("archive & horizon") so episodes don't all share one look.
// Paper elements, a perspective horizon floor, bookshelves, roads, a model orb,
// a mirage reflection and a radar sweep — all in brand colors.
import { el, text } from './components.js';
import { glow, glowGrad, neon, rng, defs } from './fx.js';

// Perspective floor grid that scrolls toward the viewer. update(t) animates it.
export function horizonGrid(parent, svg, C, { horizon = 1060, vx = 540, rows = 14, cols = 13, speed = 0.25 } = {}) {
  const g = el('g', {}, parent);
  glow(g, svg, C.orange, { x: vx, y: horizon, r: 700, sy: 0.18, opacity: 0.55 });
  el('line', { x1: 0, y1: horizon, x2: 1080, y2: horizon, stroke: C.orange, 'stroke-opacity': 0.35, 'stroke-width': 2 }, g);
  for (let i = 0; i < cols; i++) {
    const bx = -900 + (i / (cols - 1)) * 2880;
    el('line', { x1: vx + (bx - vx) * 0.02, y1: horizon, x2: bx, y2: 1920, stroke: C.slate, 'stroke-opacity': 0.16, 'stroke-width': 1.5 }, g);
  }
  const hl = Array.from({ length: rows }, () => el('line', { x1: 0, x2: 1080, stroke: C.slate, 'stroke-width': 1.5 }, g));
  return {
    g,
    update(t) {
      hl.forEach((l, i) => {
        const f = ((i + t * speed) % rows) / rows;       // 0 far → 1 near
        const y = horizon + (1920 - horizon) * f * f;
        l.setAttribute('y1', y); l.setAttribute('y2', y);
        l.setAttribute('stroke-opacity', 0.04 + 0.16 * f);
      });
    },
  };
}

// Archive walls: two receding shelves of books.
export function bookshelves(parent, C, { horizon = 1060, vx = 540, seed = 8 } = {}) {
  const g = el('g', {}, parent);
  const R = rng(seed);
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
    const z0 = 1 / (1 + i * 0.6), z1 = 1 / (1 + (i + 1) * 0.6);
    const x0 = vx + side * 820 * z0, x1 = vx + side * 820 * z1;
    const top0 = horizon - 1100 * z0, top1 = horizon - 1100 * z1, bot0 = horizon + 200 * z0, bot1 = horizon + 200 * z1;
    el('path', { d: `M${x0} ${top0} L${x1} ${top1} L${x1} ${bot1} L${x0} ${bot0} Z`, fill: C.bg2, stroke: C.slate, 'stroke-opacity': 0.18, 'stroke-width': 1.5 }, g);
    for (let s = 0; s < 6; s++) {
      const f = (s + 1) / 7, ya = top0 + (bot0 - top0) * f, yb = top1 + (bot1 - top1) * f;
      el('line', { x1: x0, y1: ya, x2: x1, y2: yb, stroke: C.slate, 'stroke-opacity': 0.22, 'stroke-width': 1.5 }, g);
      // book spines standing on the shelf
      const n = 7;
      for (let k = 0; k < n; k++) {
        const u = (k + 0.5) / n, x = x0 + (x1 - x0) * u, yBase = ya + (yb - ya) * u, z = z0 + (z1 - z0) * u;
        const h = (40 + R() * 50) * z, w = 12 * z;
        const warm = R() > 0.9;
        el('rect', { x: x - w / 2, y: yBase - h, width: w, height: h, rx: 2, fill: warm ? C.orange : (R() > 0.5 ? C.ivory : C.slate), opacity: warm ? 0.8 : 0.12 + R() * 0.2 }, g);
      }
    }
  }
  return g;
}

// Ivory paper strip with a word (tokens in this visual family).
export function paperChip(parent, svg, C, str, { size = 44, accent = false, tilt = 0 } = {}) {
  const w = Math.max(size * 1.5, str.length * size * 0.55 + size * 1.0), h = size * 1.7;
  const g = el('g', {}, parent);
  const inner = el('g', { transform: `rotate(${tilt})` }, g);
  el('rect', { x: -w / 2 + 4, y: -h / 2 + 8, width: w, height: h, rx: 6, fill: '#000', opacity: 0.35 }, inner);
  el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 6, fill: accent ? C.orange : C.ivory }, inner);
  el('rect', { x: -w / 2, y: -h / 2, width: w, height: 6, rx: 3, fill: '#000', opacity: 0.06 }, inner);
  if (str) text(inner, 0, size * 0.36, str, { size, fill: C.bg }, C);
  else el('rect', { x: -w / 2 + 3, y: -h / 2 + 3, width: w - 6, height: h - 6, rx: 5, fill: C.bg, 'fill-opacity': 0.85, stroke: C.orange, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, inner);
  return { g, w, h };
}

// Paper sheet with a folded corner. Origin = top-left.
export function paper(parent, C, { x, y, w, h, fold = 46, opacity = 1 }) {
  const g = el('g', { transform: `translate(${x},${y})`, opacity }, parent);
  el('path', { d: `M10 16 H${w + 10} V${h + 16} H10 Z`, fill: '#000', opacity: 0.3 }, g);
  el('path', { d: `M0 0 H${w - fold} L${w} ${fold} V${h} H0 Z`, fill: C.ivory }, g);
  el('path', { d: `M${w - fold} 0 V${fold} H${w} Z`, fill: C.derived.ivoryShade }, g);
  return g;
}

// Ink lines on paper.
export function ink(parent, C, x, y, widths, { gap = 28, h = 10, color } = {}) {
  widths.forEach((w, i) => el('rect', { x, y: y + i * gap, width: w, height: h, rx: h / 2, fill: color ?? C.bg, opacity: 0.55 }, parent));
}

// Round stamp (✓ / text) in orange or slate.
export function stamp(parent, svg, C, label, { r = 64, color, rot = -12 } = {}) {
  const col = color ?? C.orange;
  const g = el('g', { transform: `rotate(${rot})` }, parent);
  glow(g, svg, col, { x: 0, y: 0, r: r * 2.2, opacity: 0.35 });
  el('circle', { r, fill: 'none', stroke: col, 'stroke-width': 7 }, g);
  el('circle', { r: r - 12, fill: 'none', stroke: col, 'stroke-width': 2.5 }, g);
  text(g, 0, r * 0.22, label, { size: r * 0.62, fill: col }, C);
  return g;
}

// The model as a glowing orb with orbit rings. update(t) spins the rings.
export function orb(parent, svg, C, { x = 540, y = 520, r = 120 } = {}) {
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  glow(g, svg, C.orange, { x: 0, y: 0, r: r * 3, opacity: 0.5 });
  const id = `orb${Math.random().toString(36).slice(2, 7)}`;
  const gr = el('radialGradient', { id, cx: '38%', cy: '34%', r: '70%' }, defs(svg));
  el('stop', { offset: 0, 'stop-color': C.ivory }, gr); el('stop', { offset: 0.35, 'stop-color': C.orange }, gr); el('stop', { offset: 1, 'stop-color': '#7a2a0c' }, gr);
  el('circle', { r, fill: `url(#${id})` }, g);
  const rings = [0, 1, 2].map((i) => el('ellipse', { rx: r * (1.6 + i * 0.35), ry: r * (0.42 + i * 0.1), fill: 'none', stroke: i === 1 ? C.blue : C.slate, 'stroke-opacity': 0.5, 'stroke-width': 2.5 }, g));
  const dots = rings.map((_, i) => el('circle', { r: 7, fill: i === 1 ? C.blue : C.ivory }, g));
  return {
    g,
    update(t) {
      rings.forEach((rg, i) => {
        const rot = (i - 1) * 28 + Math.sin(t * 0.3 + i) * 6;
        rg.setAttribute('transform', `rotate(${rot})`);
        const a = t * (0.9 + i * 0.35) + i * 2, rx = r * (1.6 + i * 0.35), ry = r * (0.42 + i * 0.1);
        const px = rx * Math.cos(a), py = ry * Math.sin(a), c = Math.cos((rot * Math.PI) / 180), s = Math.sin((rot * Math.PI) / 180);
        dots[i].setAttribute('cx', px * c - py * s); dots[i].setAttribute('cy', px * s + py * c);
      });
    },
  };
}

// A road on the floor from near (x0, width w0 at y=1920-ish) to far (x1 at horizon).
export function road(parent, svg, C, { x0, y0 = 1700, x1, y1 = 1070, w0 = 260, w1 = 16, bright = true }) {
  const g = el('g', {}, parent);
  const d = `M${x0 - w0 / 2} ${y0} L${x1 - w1 / 2} ${y1} L${x1 + w1 / 2} ${y1} L${x0 + w0 / 2} ${y0} Z`;
  if (bright) {
    el('path', { d, fill: C.orange, opacity: 0.22 }, g);
    neon(g, `M${x0} ${y0} L${x1} ${y1}`, C.orange, { w: 6, halo: 40 });
  } else {
    el('path', { d, fill: C.slate, opacity: 0.06 }, g);
    neon(g, `M${x0} ${y0} L${x1} ${y1}`, C.slate, { w: 3, halo: 10, dash: '6 22', opacity: 0.7 });
  }
  return g;
}

// Low fog band (rare facts fade into it).
export function fog(parent, svg, C, { x, y, w = 600, opacity = 0.6 }) {
  const g = el('g', {}, parent);
  const R = rng(4);
  for (let i = 0; i < 9; i++) glow(g, svg, C.slate, { x: x + (R() - 0.5) * w, y: y + (R() - 0.5) * 60, r: 120 + R() * 140, sy: 0.35, opacity: opacity * (0.25 + R() * 0.3) });
  return g;
}

// Mirage reflection: a copy of `source` flipped below `baseY`, cut into bands that ripple.
export function mirage(parent, C, buildCopy, { baseY, x = 540, bands = 10, bandH = 12 } = {}) {
  const g = el('g', {}, parent);
  const slices = [];
  for (let i = 0; i < bands; i++) {
    const id = `mir${Math.random().toString(36).slice(2, 8)}`;
    const cp = el('clipPath', { id }, g);
    el('rect', { x: -2000, y: baseY + i * bandH, width: 4000, height: bandH + 1 }, cp);
    const band = el('g', { 'clip-path': `url(#${id})` }, g);
    const inner = el('g', {}, band);
    buildCopy(inner);
    inner.setAttribute('transform', `translate(0,${2 * baseY}) scale(1,-1)`);
    slices.push({ band, i });
  }
  const state = { amp: 0, t: 0, o: 0.45 };
  return {
    g, state,
    update(t) {
      g.setAttribute('opacity', state.o * Math.min(1, state.amp * 2 + 0.0001));
      for (const s of slices) s.band.setAttribute('transform', `translate(${Math.sin(t * 5 + s.i * 0.9) * 14 * state.amp},0)`);
    },
  };
}

// Radar sweep with blips. state.sweep in turns; blips appear when passed.
export function radar(parent, svg, C, { x = 540, y = 620, r = 300, blips = [] } = {}) {
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  glow(g, svg, C.blue, { x: 0, y: 0, r: r * 1.4, opacity: 0.18 });
  for (let i = 1; i <= 4; i++) el('circle', { r: (r * i) / 4, fill: 'none', stroke: C.slate, 'stroke-opacity': 0.25, 'stroke-width': 2 }, g);
  el('line', { x1: -r, y1: 0, x2: r, y2: 0, stroke: C.slate, 'stroke-opacity': 0.18 }, g);
  el('line', { x1: 0, y1: -r, x2: 0, y2: r, stroke: C.slate, 'stroke-opacity': 0.18 }, g);
  const wedgeId = `rw${Math.random().toString(36).slice(2, 7)}`;
  const lg = el('linearGradient', { id: wedgeId, x1: 0, y1: 0, x2: 1, y2: 0 }, defs(svg));
  el('stop', { offset: 0, 'stop-color': C.orange, 'stop-opacity': 0 }, lg); el('stop', { offset: 1, 'stop-color': C.orange, 'stop-opacity': 0.45 }, lg);
  const wedge = el('path', { d: `M0 0 L${r} 0 A${r} ${r} 0 0 0 ${r * Math.cos(-0.6)} ${r * Math.sin(-0.6)} Z`, fill: `url(#${wedgeId})` }, g);
  const arm = el('line', { x1: 0, y1: 0, x2: r, y2: 0, stroke: C.orange, 'stroke-width': 3 }, g);
  const bl = blips.map((b) => { const n = el('g', { transform: `translate(${b.x},${b.y})`, opacity: 0 }, g); glow(n, svg, b.unsure ? C.slate : C.orange, { x: 0, y: 0, r: 40, opacity: 0.7 }); el('circle', { r: 9, fill: b.unsure ? 'none' : C.orange, stroke: b.unsure ? C.slate : 'none', 'stroke-width': 3 }, n); return { n, a: Math.atan2(b.y, b.x), unsure: b.unsure }; });
  const state = { sweep: 0 };
  return {
    g, state, blips: bl,
    update() {
      const a = state.sweep * Math.PI * 2;
      wedge.setAttribute('transform', `rotate(${(a * 180) / Math.PI})`); arm.setAttribute('transform', `rotate(${(a * 180) / Math.PI})`);
      for (const b of bl) {
        let ang = b.a; if (ang < 0) ang += Math.PI * 2;
        const passed = state.sweep >= 1 || (a % (Math.PI * 2)) > ang;
        b.n.setAttribute('opacity', passed || state.sweep >= ang / (Math.PI * 2) ? 1 : 0);
      }
    },
  };
}
