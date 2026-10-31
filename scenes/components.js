// Reusable scene components (SVG). Every component draws into a parent <g> in a
// 1080x1920 frame, uses only brand colors, and returns its root group so scenes
// can animate it with GSAP. Text is Inter 400 only.
const NS = 'http://www.w3.org/2000/svg';

export function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}

export function text(parent, x, y, str, { size = 44, fill, anchor = 'middle', opacity = 1 } = {}, C) {
  const t = el('text', { x, y, 'font-size': size, 'text-anchor': anchor, fill: fill ?? C.ivory, opacity, 'font-family': 'Inter', 'font-weight': 400 }, parent);
  t.textContent = str;
  return t;
}

// Abstract text lines (no real words) — keeps screens readable without on-screen copy.
export function lines(parent, x, y, widths, { gap = 30, h = 12, color, opacity = 0.85 } = {}, C) {
  const g = el('g', {}, parent);
  widths.forEach((w, i) => el('rect', { x, y: y + i * gap, width: w, height: h, rx: h / 2, fill: color ?? C.ivory, opacity }, g));
  return g;
}

// Floating chat window. mode: 'question' | 'answer' | 'empty'
export function chatCard(parent, C, { x = 540, y = 760, w = 560, h = 640, mode = 'question', answerLines = 5, sendGlow = false } = {}) {
  const g = el('g', { transform: `translate(${x - w / 2},${y - h / 2})` }, parent);
  el('rect', { width: w, height: h, rx: 40, fill: C.bg2, stroke: C.slate, 'stroke-opacity': 0.35, 'stroke-width': 2 }, g);
  for (let i = 0; i < 3; i++) el('circle', { cx: 40 + i * 24, cy: 40, r: 7, fill: C.slate, opacity: 0.35 }, g);
  // user question bubble (right)
  if (mode !== 'empty') {
    const q = el('g', { transform: `translate(${w - 330},90)` }, g);
    el('rect', { width: 290, height: 84, rx: 26, fill: C.ivory, opacity: 0.12 }, q);
    lines(q, 26, 26, [210, 140], { gap: 22, h: 10 }, C);
  }
  if (mode === 'answer') {
    const a = el('g', { transform: 'translate(40,214)' }, g);
    const k = (w - 80) / 470;
    lines(a, 0, 0, [430, 470, 400, 450, 300, 420, 360].slice(0, answerLines).map((v) => v * k), { gap: 40, h: 13 }, C);
  }
  // input bar
  const bar = el('g', { transform: `translate(30,${h - 104})` }, g);
  el('rect', { width: w - 60, height: 74, rx: 37, fill: C.bg, stroke: C.slate, 'stroke-opacity': 0.3, 'stroke-width': 2 }, bar);
  if (mode === 'question') lines(bar, 30, 31, [200], { h: 10, opacity: 0.5 }, C);
  const send = el('g', { transform: `translate(${w - 60 - 37},37)` }, bar);
  el('circle', { r: 26, fill: C.orange, opacity: sendGlow ? 1 : 0.85 }, send);
  el('path', { d: 'M-9 8 L0 -10 L9 8 M0 -10 L0 12', fill: 'none', stroke: C.bg, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'rotate(0)' }, send);
  return g;
}

export function fileCabinet(parent, C, { x = 760, y = 900, crossed = true } = {}) {
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  el('rect', { x: -150, y: -60, width: 300, height: 420, rx: 18, fill: C.bg2, stroke: C.slate, 'stroke-opacity': 0.5, 'stroke-width': 3 }, g);
  for (const dy of [190, 300]) { el('rect', { x: -120, y: dy - 40, width: 240, height: 80, rx: 10, fill: 'none', stroke: C.slate, 'stroke-opacity': 0.4, 'stroke-width': 2 }, g); el('rect', { x: -30, y: dy - 6, width: 60, height: 12, rx: 6, fill: C.slate, opacity: 0.5 }, g); }
  // open top drawer with a finished document
  el('path', { d: 'M-150 -60 L-190 30 L190 30 L150 -60', fill: C.bg2, stroke: C.slate, 'stroke-opacity': 0.5, 'stroke-width': 3 }, g);
  const doc = el('g', { transform: 'translate(-80,-250) rotate(-4)' }, g);
  el('rect', { width: 170, height: 230, rx: 10, fill: C.ivory }, doc);
  lines(doc, 22, 34, [120, 126, 100, 126, 80, 110], { gap: 28, h: 9, color: C.bg, opacity: 0.6 }, C);
  if (crossed) {
    const x1 = el('g', { opacity: 0.95 }, g);
    el('circle', { cx: 5, cy: -135, r: 150, fill: 'none', stroke: C.slate, 'stroke-width': 8 }, x1);
    el('line', { x1: -100, y1: -30, x2: 110, y2: -240, stroke: C.slate, 'stroke-width': 8, 'stroke-linecap': 'round' }, x1);
  }
  return g;
}

// Row of token blocks. tokens: strings; nextSlot adds a glowing empty block.
export function tokenRow(parent, C, { x = 540, y = 900, tokens = [], size = 40, nextSlot = false, highlight = -1, maxW = 820 } = {}) {
  const g = el('g', {}, parent);
  const pad = 22, gap = 12, hgt = size * 1.9;
  const widths = tokens.map((t) => Math.max(56, t.length * size * 0.56 + pad * 2));
  if (nextSlot) widths.push(110);
  // wrap into rows
  const rows = [[]]; let rw = 0;
  widths.forEach((w, i) => { if (rw + w > maxW && rows.at(-1).length) { rows.push([]); rw = 0; } rows.at(-1).push(i); rw += w + gap; });
  rows.forEach((row, ri) => {
    const total = row.reduce((s, i) => s + widths[i] + gap, -gap);
    let cx = x - total / 2;
    for (const i of row) {
      const isSlot = nextSlot && i === widths.length - 1;
      const b = el('g', { transform: `translate(${cx},${y + ri * (hgt + gap) - hgt / 2})` }, g);
      if (isSlot) el('rect', { width: widths[i], height: hgt, rx: 16, fill: 'none', stroke: C.orange, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, b);
      else {
        el('rect', { width: widths[i], height: hgt, rx: 16, fill: i === highlight ? C.orange : C.bg2, 'fill-opacity': i === highlight ? 0.18 : 1, stroke: i === highlight ? C.orange : C.slate, 'stroke-opacity': i === highlight ? 1 : 0.45, 'stroke-width': 2 }, b);
        text(b, widths[i] / 2, hgt / 2 + size * 0.36, tokens[i], { size, fill: i === highlight ? C.orange : C.ivory }, C);
      }
      cx += widths[i] + gap;
    }
  });
  return g;
}

export function phone(parent, C, { x = 540, y = 1180, s = 1 } = {}) {
  const g = el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
  el('rect', { x: -80, y: -150, width: 160, height: 300, rx: 28, fill: C.bg2, stroke: C.ivory, 'stroke-width': 4 }, g);
  el('rect', { x: -60, y: -110, width: 110, height: 34, rx: 12, fill: C.ivory, opacity: 0.15 }, g);
  el('circle', { cx: 0, cy: 118, r: 8, fill: C.slate, opacity: 0.5 }, g);
  return g;
}

export function serverRack(parent, C, { x = 540, y = 560, s = 1 } = {}) {
  const g = el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
  el('rect', { x: -90, y: -200, width: 180, height: 400, rx: 14, fill: C.bg2, stroke: C.slate, 'stroke-opacity': 0.55, 'stroke-width': 3 }, g);
  for (let i = 0; i < 9; i++) {
    const yy = -175 + i * 42;
    el('rect', { x: -70, y: yy, width: 140, height: 30, rx: 6, fill: C.bg, stroke: C.slate, 'stroke-opacity': 0.25, 'stroke-width': 1.5 }, g);
    el('circle', { cx: 52, cy: yy + 15, r: 4.5, fill: (i * 7) % 3 === 0 ? C.orange : C.slate, opacity: (i * 7) % 3 === 0 ? 1 : 0.5 }, g);
    el('rect', { x: -56, y: yy + 12, width: 60, height: 6, rx: 3, fill: C.slate, opacity: 0.3 }, g);
  }
  return g;
}

// Curved signal path with a travelling dot at progress t (0..1).
export function signalPath(parent, C, d, { t = 0.6, dashed = true } = {}) {
  const g = el('g', {}, parent);
  const p = el('path', { d, fill: 'none', stroke: C.orange, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': dashed ? '2 16' : 'none', opacity: 0.8 }, g);
  const dot = el('circle', { r: 12, fill: C.orange }, g);
  const glow = el('circle', { r: 30, fill: C.orange, opacity: 0.18 }, g);
  const place = (tt) => { const pt = p.getPointAtLength(p.getTotalLength() * tt); for (const n of [dot, glow]) { n.setAttribute('cx', pt.x); n.setAttribute('cy', pt.y); } };
  place(t);
  return { g, path: p, place };
}

export function pageStack(parent, C, { x = 300, y = 820, n = 6 } = {}) {
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  for (let i = n - 1; i >= 0; i--) {
    const p = el('g', { transform: `translate(${i * 14 - 80},${-i * 14 - 110}) rotate(${(i % 3) - 1})` }, g);
    el('rect', { width: 160, height: 210, rx: 8, fill: C.ivory, opacity: 1 - i * 0.12, stroke: C.derived.ivoryDeep, 'stroke-width': 1.5 }, p);
    if (i === 0) lines(p, 20, 30, [110, 120, 90, 120, 70, 100], { gap: 26, h: 8, color: C.bg, opacity: 0.5 }, C);
  }
  return g;
}

// Grid of dots standing in for model parameters.
export function paramGrid(parent, C, { x = 760, y = 820, cols = 8, rows = 10, step = 34, seed = 3 } = {}) {
  const g = el('g', { transform: `translate(${x - ((cols - 1) * step) / 2},${y - ((rows - 1) * step) / 2})` }, parent);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = rnd();
    el('circle', { cx: c * step, cy: r * step, r: 3 + v * 7, fill: v > 0.86 ? C.orange : C.slate, opacity: v > 0.86 ? 0.95 : 0.25 + v * 0.5 }, g);
  }
  return g;
}

// Next-token probability bars (illustrative, not real model output).
export function probBars(parent, C, { x = 540, y = 900, items = [], barMax = 420, rowH = 92, size = 42 } = {}) {
  const g = el('g', {}, parent);
  items.forEach(([label, v], i) => {
    const yy = y + i * rowH;
    text(g, x - 40, yy + size * 0.36, label, { size, anchor: 'end', fill: i === 0 ? C.orange : C.ivory }, C);
    el('rect', { x: x - 10, y: yy - 16, width: barMax, height: 32, rx: 16, fill: C.bg2 }, g);
    el('rect', { x: x - 10, y: yy - 16, width: barMax * v, height: 32, rx: 16, fill: i === 0 ? C.orange : C.slate, opacity: i === 0 ? 1 : 0.55 }, g);
  });
  return g;
}

export function magnifier(parent, C, { x = 640, y = 860, r = 90 } = {}) {
  const g = el('g', { transform: `translate(${x},${y})` }, parent);
  el('circle', { r, fill: C.ivory, 'fill-opacity': 0.06, stroke: C.ivory, 'stroke-width': 8 }, g);
  el('line', { x1: r * 0.72, y1: r * 0.72, x2: r * 1.5, y2: r * 1.5, stroke: C.ivory, 'stroke-width': 16, 'stroke-linecap': 'round' }, g);
  return g;
}

// Subtitle preview using the locked subtitle spec.
export function subtitle(parent, C, brand, str) {
  const S = brand.subtitles;
  const g = el('g', { style: `filter: drop-shadow(${S.shadow})` }, parent);
  const words = str.split(' '); const ls = ['']; for (const w of words) { const cand = ls.at(-1) ? `${ls.at(-1)} ${w}` : w; if (cand.length > S.maxCharsPerLine && ls.at(-1)) ls.push(w); else ls[ls.length - 1] = cand; }
  const lh = S.sizePx * S.lineHeight;
  ls.slice(0, S.maxLines).forEach((l, i) => text(g, 540, S.centerY - ((ls.length - 1) * lh) / 2 + i * lh + S.sizePx * 0.35, l, { size: S.sizePx, fill: S.color }, C));
  return g;
}
