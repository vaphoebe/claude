// Shared stage for every composition: loads the brand config, builds the 1080x1920
// SVG canvas, and exposes the render contract used by tools/render-*.mjs:
//   window.__ready (Promise) · window.__duration (s) · window.__seek(t)
import { gsap } from '/node_modules/gsap/index.js';
import { createRobot } from '/character/rig/robot.js';

const NS = 'http://www.w3.org/2000/svg';

export async function createStage({ width, height, background = 'bg' } = {}) {
  const brand = await (await fetch('/brand/brand.config.json')).json();
  const W = width ?? brand.video.vertical.width, H = height ?? brand.video.vertical.height;
  const C = brand.colors;

  const style = document.createElement('style');
  style.textContent = `
    @font-face { font-family: 'Inter'; src: url('/brand/fonts/Inter-Regular.otf'); font-weight: 400; }
    html,body { margin:0; padding:0; background:${C.bg}; overflow:hidden; }
    svg text { font-family: ${brand.typography.fallback}; font-weight: 400; }`;
  document.head.appendChild(style);
  await document.fonts.load("400 40px 'Inter'");

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  document.body.appendChild(svg);
  const bg = document.createElementNS(NS, 'rect');
  bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', C[background] ?? background);
  svg.appendChild(bg);

  const rigs = [], hooks = [], cues = [];
  const tl = gsap.timeline({ paused: true });
  const refresh = () => { const t = tl.time(); hooks.forEach((h) => h(t)); rigs.forEach((r) => r.apply()); };

  const stage = {
    brand, C, W, H, svg, tl, rigs, gsap,
    layer(attrs = {}) {
      const g = document.createElementNS(NS, 'g');
      for (const [k, v] of Object.entries(attrs)) g.setAttribute(k, v);
      svg.appendChild(g);
      return g;
    },
    robot(parent = svg, state = {}) {
      const r = createRobot(parent, C);
      Object.assign(r.state, state);
      r.apply();
      rigs.push(r);
      return r;
    },
    // Per-frame callback (procedural motion: drift, rotation, particles). Receives timeline time.
    onFrame(fn) { hooks.push(fn); return fn; },
    // Animatable transform/opacity for any SVG element: tween the returned object's x, y, s, r, o.
    node(target, init = {}) {
      const n = { x: 0, y: 0, s: 1, r: 0, o: 1, ox: 0, oy: 0, ...init };
      hooks.push(() => {
        target.setAttribute('transform', `translate(${n.x},${n.y}) translate(${n.ox},${n.oy}) rotate(${n.r}) scale(${n.s}) translate(${-n.ox},${-n.oy})`);
        target.setAttribute('opacity', n.o);
        target.setAttribute('display', n.o <= 0.001 ? 'none' : 'inline');
      });
      return n;
    },
    // Sound-effect cue for the audio mixer (exported via window.__cues).
    sfx(name, time, gain = 1) { cues.push({ name, time: Math.max(0, +time.toFixed(3)), gain }); },
    // Call once the timeline is built.
    finish({ duration } = {}) {
      window.__duration = duration ?? tl.duration();
      window.__cues = cues.sort((a, b) => a.time - b.time);
      window.__seek = (t) => { tl.seek(t, false); refresh(); };
      window.__seek(0);
      // live preview when opened in a normal browser: ?play
      if (location.search.includes('play')) { tl.play(); gsap.ticker.add(refresh); }
    },
  };
  return stage;
}
