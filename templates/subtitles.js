// Locked subtitle renderer. Splits narration lines into short cues (max 2 lines),
// times them inside each line's audio span, draws them in the lower-middle safe zone
// (Inter 400, ivory, optional orange emphasis, soft shadow, 0.12 s fade) and exposes
// window.__subs for SRT export.
import { el } from '/scenes/components.js';

export function buildCues(lines, brand, { maxChars = 40 } = {}) {
  const S = brand.subtitles, cues = [];
  // use measured phrase timings when the narration provides them (more accurate than proportional timing)
  const units = lines.flatMap((ln) => ln.phrases ?? [ln]);
  for (const ln of units) {
    // 1) phrases at punctuation, 2) merge fragments that are too short, 3) split long phrases near the middle
    let phrases = ln.text.match(/[^,.:;?!]+[,.:;?!]*/g).map((p) => p.trim()).filter(Boolean);
    const merged = [];
    for (const p of phrases) {
      const prev = merged.at(-1);
      if (prev && ((prev.length < 16 || p.length < 12) || `${prev} ${p}`.length <= 30) && `${prev} ${p}`.length <= maxChars) merged[merged.length - 1] = `${prev} ${p}`;
      else merged.push(p);
    }
    const chunks = [];
    const split = (p) => {
      if (p.length <= maxChars) return chunks.push(p);
      const words = p.split(' '); let best = 1, bestD = 1e9, acc = 0;
      const weak = /^(a|an|the|to|of|in|on|and|or|is|it|its|it's|that|from|by|as|be|which|your)$/i;
      words.forEach((w, i) => { acc += w.length + 1; const d = Math.abs(acc - p.length / 2) + (weak.test(w) ? 12 : 0); if (i < words.length - 1 && d < bestD) { bestD = d; best = i + 1; } });
      split(words.slice(0, best).join(' ')); split(words.slice(best).join(' '));
    };
    merged.forEach(split);
    // fold very short fragments (e.g. "remember:") into the next chunk when it still fits two lines
    for (let i = 0; i < chunks.length - 1; i++) if (chunks[i].length < 12 && `${chunks[i]} ${chunks[i + 1]}`.length <= S.maxCharsPerLine * 2) { chunks[i + 1] = `${chunks[i]} ${chunks[i + 1]}`; chunks.splice(i, 1); i--; }
    const total = chunks.reduce((n, c) => n + c.length, 0);
    let t = ln.start;
    for (const c of chunks) {
      const d = ((ln.end - ln.start) * c.length) / total;
      cues.push({ text: c, start: +t.toFixed(3), end: +(t + d).toFixed(3) });
      t += d;
    }
  }
  for (let i = 0; i < cues.length - 1; i++) if (cues[i + 1].start - cues[i].end < 0.9) cues[i].end = cues[i + 1].start;
  for (const c of cues) c.end = Math.max(c.end, c.start + S.minDurationSec);
  for (let i = 0; i < cues.length - 1; i++) cues[i].end = Math.min(cues[i].end, cues[i + 1].start); // never overlap
  return cues;
}

function wrap(str, max) {
  if (str.length <= max) return [str];
  const words = str.split(' '); let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
    const score = Math.max(a.length, b.length);
    if (!best || score < best.score) best = { score, lines: [a, b] };
  }
  return best.lines;
}

export function mountSubtitles(stage, cues, { emphasis = [], visible = true } = {}) {
  const { brand, C } = stage, S = brand.subtitles;
  window.__subs = cues;
  if (!visible) return;
  const g = el('g', { style: `filter: drop-shadow(${S.shadow})` }, stage.svg);
  const lh = S.sizePx * S.lineHeight;
  const nodes = cues.map((c) => {
    const grp = el('g', { opacity: 0 }, g);
    const ls = wrap(c.text, S.maxCharsPerLine).slice(0, S.maxLines);
    ls.forEach((l, i) => {
      const t = el('text', { x: 540, y: S.centerY - ((ls.length - 1) * lh) / 2 + i * lh + S.sizePx * 0.35, 'font-size': S.sizePx, 'text-anchor': 'middle', fill: S.color, 'font-family': 'Inter', 'font-weight': 400 }, grp);
      // orange emphasis for listed words/phrases (whole words only)
      let rest = l;
      while (rest.length) {
        let hit = null;
        for (const e of emphasis) { const i2 = rest.toLowerCase().indexOf(e.toLowerCase()); if (i2 >= 0 && (!hit || i2 < hit.i)) hit = { i: i2, e }; }
        if (!hit) { const sp = el('tspan', {}, t); sp.textContent = rest; break; }
        if (hit.i) { const sp = el('tspan', {}, t); sp.textContent = rest.slice(0, hit.i); }
        const em = el('tspan', { fill: S.emphasisColor }, t); em.textContent = rest.slice(hit.i, hit.i + hit.e.length);
        rest = rest.slice(hit.i + hit.e.length);
      }
    });
    return { grp, c };
  });
  const fade = 0.12;
  stage.onFrame((t) => {
    for (const { grp, c } of nodes) {
      const o = Math.min(1, Math.max(0, (t - c.start) / fade), Math.max(0, (c.end - t) / fade));
      grp.setAttribute('opacity', o);
      grp.setAttribute('display', o > 0 ? 'inline' : 'none');
    }
  });
}

export function toSRT(cues) {
  const ts = (s) => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  return cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${wrap(c.text, 32).slice(0, 2).join('\n')}\n`).join('\n');
}
