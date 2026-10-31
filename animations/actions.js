// Reusable character actions. Every action returns a GSAP timeline that only touches
// rig.state, so actions can be placed anywhere on an episode's master timeline and
// seeked frame-by-frame for deterministic rendering.
import { gsap } from '/node_modules/gsap/index.js';
import { POSES } from '/character/rig/poses.js';
import { EXPRESSIONS } from '/character/rig/expressions.js';

const EASE = 'power2.inOut';
const NESTED = ['armL', 'armR', 'legL', 'legR', 'eyeL', 'eyeR'];

// Tween rig.state toward a partial target. Strings (hand shapes) switch at `swapAt`.
export function to(rig, target, { duration = 0.4, ease = EASE, swapAt = 0.35 } = {}) {
  const S = rig.state, tl = gsap.timeline();
  const flat = {};
  for (const [k, v] of Object.entries(target)) {
    if (NESTED.includes(k)) tl.to(S[k], { ...v, duration, ease }, 0);
    else if (typeof v === 'string') tl.set(S, { [k]: v }, duration * swapAt);
    else flat[k] = v;
  }
  if (Object.keys(flat).length) tl.to(S, { ...flat, duration, ease }, 0);
  return tl;
}

export const pose = (rig, name, opts) => to(rig, POSES[name], opts);

export function express(rig, name, { duration = 0.3, withTilt = true, ...o } = {}) {
  const { headTilt, ...eyes } = EXPRESSIONS[name];
  return to(rig, withTilt ? { ...eyes, headTilt } : eyes, { duration, ease: 'power2.out', ...o });
}

export function blink(rig, { duration = 0.16 } = {}) {
  return gsap.timeline()
    .to(rig.state, { blink: 1, duration: duration * 0.45, ease: 'power1.in' })
    .to(rig.state, { blink: 0, duration: duration * 0.55, ease: 'power1.out' });
}

// Subtle breathing + weight shift. Deterministic (driven by a phase proxy).
export function idle(rig, { duration = 4, amount = 1 } = {}) {
  const p = { t: 0 }, S = rig.state;
  return gsap.timeline().to(p, {
    t: duration, duration, ease: 'none',
    onUpdate() {
      const w = (p.t / 3.2) * Math.PI * 2;
      S.breathe = Math.sin(w) * amount;
      S.bob = Math.sin(w) * 1.6 * amount;
      S.headNod = Math.sin(w + 0.6) * 1.8 * amount;
    },
  });
}

export function turn(rig, yaw, { duration = 0.45, ease = 'power2.inOut' } = {}) {
  return gsap.timeline().to(rig.state, { yaw, duration, ease });
}

export function nod(rig, { times = 2, duration = 0.5 } = {}) {
  const tl = gsap.timeline();
  for (let i = 0; i < times; i++) tl.to(rig.state, { headNod: 8, duration: duration / (2 * times), ease: 'sine.inOut' }).to(rig.state, { headNod: 0, duration: duration / (2 * times), ease: 'sine.inOut' });
  return tl;
}

export function wave(rig, { cycles = 2, duration = 1.2 } = {}) {
  const S = rig.state, p = { t: 0 };
  return gsap.timeline()
    .add(pose(rig, 'wave', { duration: 0.3 }))
    .to(p, { t: 1, duration, ease: 'none', onUpdate() { S.armR.el = 30 + 22 * Math.sin(p.t * cycles * Math.PI * 2); S.armR.wr = 8 * Math.sin(p.t * cycles * Math.PI * 2 - 0.6); } });
}

// Surprised reaction: small hop, hands up, wide eyes.
export function react(rig, { duration = 0.6 } = {}) {
  return gsap.timeline()
    .add(express(rig, 'surprised', { duration: 0.12 }), 0)
    .add(pose(rig, 'surprised', { duration: 0.18, ease: 'back.out(2)' }), 0)
    .to(rig.state, { bob: -22, duration: 0.14, ease: 'power2.out' }, 0)
    .to(rig.state, { bob: 0, duration: duration - 0.14, ease: 'bounce.out' }, 0.14);
}

// Typing at a laptop. Hold a 'typing' pose first.
export function type(rig, { duration = 1.5 } = {}) {
  const S = rig.state, p = { t: 0 };
  return gsap.timeline().to(p, {
    t: duration, duration, ease: 'none',
    onUpdate() {
      S.armL.wr = -8 + 7 * Math.sin(p.t * 21);
      S.armR.wr = -8 + 7 * Math.sin(p.t * 21 + 2.1);
      S.armL.el = -70 + 3 * Math.sin(p.t * 13);
      S.armR.el = -70 + 3 * Math.sin(p.t * 13 + 1.3);
    },
  });
}

// Side-on walk cycle. dir: +1 walks to screen-right, -1 to screen-left.
export function walk(rig, { dir = 1, distance = 300, duration = 2, stepTime = 0.55 } = {}) {
  const S = rig.state, p = { t: 0 }, x0 = { v: null };
  const tl = gsap.timeline();
  tl.add(turn(rig, 80 * dir, { duration: 0.25 }), 0);
  tl.to(p, {
    t: duration, duration, ease: 'none',
    onStart() { x0.v = S.x; },
    onUpdate() {
      if (x0.v === null) x0.v = S.x;
      const ph = (p.t / stepTime) * Math.PI;
      const ramp = Math.min(1, p.t / 0.25, (duration - p.t) / 0.25);
      const hipA = 24 * Math.sin(ph) * ramp, hipB = -hipA;
      const kneeA = (8 + 30 * Math.max(0, Math.cos(ph))) * ramp, kneeB = (8 + 30 * Math.max(0, -Math.cos(ph))) * ramp;
      // screen rotation = side sign * value; forward swing = -dir in screen space
      S.legL.hip = -hipA * dir; S.legR.hip = hipB * dir;
      S.legL.knee = kneeA * dir; S.legR.knee = -kneeB * dir;
      S.legL.ankle = -kneeA * 0.4 * dir; S.legR.ankle = kneeB * 0.4 * dir;
      S.armL.sh = hipB * 0.8 * -dir; S.armR.sh = hipA * 0.8 * dir;
      S.armL.el = -12 * dir; S.armR.el = 12 * dir;
      S.bob = (6 * Math.abs(Math.sin(ph)) - 3) * ramp;
      S.x = x0.v + dir * distance * (p.t / duration);
    },
  }, 0.1);
  tl.add(pose(rig, 'idle', { duration: 0.25 }));
  return tl;
}
