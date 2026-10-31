// Host robot — permanent 2D rig.
// One SVG cut-out rig with a continuous `yaw` (body turn) so front, three-quarter,
// side and back views are the same character, never redrawn per episode.
//
// Coordinates: feet on y = 0, character ~760 units tall, x = 0 is the body centre.
// Limb angles are in degrees; 0 = hanging straight down, positive = outward/up
// (the rig mirrors the right side for you).

const NS = 'http://www.w3.org/2000/svg';
let uid = 0;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}

// Proportions — locked. Changing these changes the character.
export const DIM = Object.freeze({
  headRX: 142, headRY: 128, headCY: -664,
  visorW: 222, visorH: 148, visorR: 66, visorCY: -650,
  eyeOff: 50, eyeRX: 20, eyeRY: 33,
  neckTop: -540, neckBase: -505,
  waist: -330, shoulderY: -478, shoulderX: 106, lift: 60, chestW: 1.2,
  upperArm: 112, foreArm: 100,
  hipY: -318, hipX: 42, thigh: 122, shin: 110,
});

export const defaultEye = () => ({ w: 1, h: 1, dx: 0, dy: 0, rot: 0, lidT: 0, lidB: 0, smile: 0 });

export function defaultState() {
  return {
    x: 0, y: 0, scale: 1, opacity: 1,
    yaw: 0, headYaw: 0, headTilt: 0, headNod: 0, bodyTilt: 0, bob: 0, breathe: 0,
    armL: { sh: 6, el: -4, wr: 0 }, armR: { sh: 6, el: -4, wr: 0 },
    legL: { hip: 2, knee: 0, ankle: 0 }, legR: { hip: 2, knee: 0, ankle: 0 },
    handL: 'relaxed', handR: 'relaxed',
    eyeL: defaultEye(), eyeR: defaultEye(),
    blink: 0, glow: 1, shadow: 1,
  };
}

export function createRobot(parent, palette) {
  const id = `rb${uid++}`;
  const P = palette;
  const D = DIM;
  const S = defaultState();

  // ---------- defs ----------
  const defs = el('defs', {}, parent);
  const headGrad = el('radialGradient', { id: `${id}-head`, cx: '40%', cy: '32%', r: '75%' }, defs);
  el('stop', { offset: '0%', 'stop-color': P.ivory }, headGrad);
  el('stop', { offset: '70%', 'stop-color': P.ivory }, headGrad);
  el('stop', { offset: '100%', 'stop-color': P.derived.ivoryShade }, headGrad);
  const glow = el('filter', { id: `${id}-glow`, x: '-100%', y: '-100%', width: '300%', height: '300%' }, defs);
  el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '7', result: 'b' }, glow);
  const fm = el('feMerge', {}, glow);
  el('feMergeNode', { in: 'b' }, fm);
  el('feMergeNode', { in: 'SourceGraphic' }, fm);
  const visorClip = el('clipPath', { id: `${id}-visor` }, defs);
  const visorClipRect = el('rect', {}, visorClip);
  const lidClip = {};
  for (const side of ['L', 'R']) {
    const cp = el('clipPath', { id: `${id}-lid${side}` }, defs);
    lidClip[side] = el('rect', { x: -60 }, cp);
  }

  const ivoryPart = { fill: P.ivory, stroke: P.derived.ivoryDeep, 'stroke-width': 2, 'stroke-linejoin': 'round' };

  // ---------- hierarchy ----------
  const root = el('g', { class: 'robot' }, parent);
  const shadow = el('ellipse', { cx: 0, cy: 4, rx: 130, ry: 16, fill: '#000', opacity: 0.35 }, root);
  const legBack = el('g', {}, root);
  const legFront = el('g', {}, root);
  const pelvisG = el('g', {}, root);
  const torso = el('g', {}, root);           // rotates around the waist
  const armBack = el('g', {}, torso);
  const chest = el('g', {}, torso);
  const headPivot = el('g', {}, torso);      // rotates around the neck base
  const armFront = el('g', {}, torso);

  // ---------- pelvis & spine ----------
  const pelvis = el('path', { ...ivoryPart, d: 'M-58 -342 Q0 -356 58 -342 L46 -300 Q0 -284 -46 -300 Z' }, pelvisG);
  const spineCol = el('rect', { x: -11, y: -410, width: 22, height: 80, rx: 8, fill: P.derived.joint }, chest);
  for (const vy of [-398, -376, -354]) el('rect', { x: -16, y: vy, width: 32, height: 11, rx: 5, fill: P.derived.ivoryShade }, chest);

  // front ribcage
  const ribsFront = el('g', {}, chest);
  el('path', { d: 'M-66 -492 Q0 -506 66 -492 Q78 -440 56 -384 Q0 -370 -56 -384 Q-78 -440 -66 -492 Z', fill: P.derived.jointDeep }, ribsFront);
  el('path', { d: 'M-70 -486 Q-36 -500 0 -498 Q36 -500 70 -486', fill: 'none', stroke: P.ivory, 'stroke-width': 15, 'stroke-linecap': 'round' }, ribsFront);
  const ribYs = [-470, -446, -422, -400];
  ribYs.forEach((y, i) => {
    const reach = 80 - i * 7, drop = 22 + i * 2;
    for (const sg of [-1, 1]) {
      el('path', {
        d: `M${sg * 14} ${y} C${sg * 48} ${y - 8} ${sg * (reach + 8)} ${y + 4} ${sg * (reach - 2)} ${y + drop}`,
        fill: 'none', stroke: i % 2 ? P.derived.ivoryShade : P.ivory, 'stroke-width': 16 - i, 'stroke-linecap': 'round',
      }, ribsFront);
    }
  });
  el('rect', { x: -17, y: -498, width: 34, height: 104, rx: 13, ...ivoryPart }, ribsFront);
  const core = el('circle', { cx: 0, cy: -452, r: 8, fill: P.orange, filter: `url(#${id}-glow)` }, ribsFront);

  // side ribcage (drawn facing +x, mirrored by sign of yaw)
  const ribsSide = el('g', {}, chest);
  el('path', { d: 'M-34 -496 Q20 -506 46 -490 Q52 -440 40 -384 Q0 -372 -30 -390 Z', fill: P.derived.jointDeep }, ribsSide);
  el('rect', { x: -34, y: -496, width: 20, height: 100, rx: 8, fill: P.derived.joint }, ribsSide);
  ribYs.forEach((y, i) => {
    el('path', { d: `M-26 ${y} C4 ${y - 12} 40 ${y - 2} 42 ${y + 20 + i * 2}`, fill: 'none', stroke: i % 2 ? P.derived.ivoryShade : P.ivory, 'stroke-width': 13 - i, 'stroke-linecap': 'round' }, ribsSide);
  });
  el('rect', { x: 30, y: -494, width: 18, height: 96, rx: 8, ...ivoryPart }, ribsSide);
  el('circle', { cx: 42, cy: -452, r: 6, fill: P.orange, filter: `url(#${id}-glow)` }, ribsSide);

  // back (spine + shoulder blades)
  const ribsBack = el('g', {}, chest);
  el('path', { d: 'M-66 -492 Q0 -506 66 -492 Q78 -440 56 -384 Q0 -370 -56 -384 Q-78 -440 -66 -492 Z', fill: P.derived.jointDeep }, ribsBack);
  ribYs.forEach((y, i) => {
    for (const sg of [-1, 1]) el('path', { d: `M${sg * 8} ${y + 4} C${sg * 40} ${y - 4} ${sg * (70 - i * 6)} ${y + 6} ${sg * (64 - i * 7)} ${y + 24}`, fill: 'none', stroke: P.derived.ivoryShade, 'stroke-width': 12 - i, 'stroke-linecap': 'round' }, ribsBack);
  });
  for (const sg of [-1, 1]) el('path', { ...ivoryPart, d: `M${sg * 18} -492 L${sg * 70} -488 Q${sg * 62} -450 ${sg * 26} -432 Z` }, ribsBack);
  for (let vy = -500; vy < -400; vy += 17) el('rect', { x: -10, y: vy, width: 20, height: 12, rx: 5, ...ivoryPart }, ribsBack);

  // ---------- head ----------
  const headG = el('g', {}, headPivot);
  const neck = el('g', {}, headG);
  el('rect', { x: -15, y: D.neckTop - D.neckBase, width: 30, height: 44, rx: 8, fill: P.derived.joint }, neck);
  for (const ny of [-28, -14]) el('rect', { x: -17, y: ny, width: 34, height: 5, rx: 2.5, fill: P.derived.jointDeep }, neck);
  const headY = D.headCY - D.neckBase; // head centre relative to neck pivot
  const earBehind = el('g', {}, headG);
  const shell = el('ellipse', { cx: 0, cy: headY, rx: D.headRX, ry: D.headRY, fill: `url(#${id}-head)`, stroke: P.derived.ivoryDeep, 'stroke-width': 2 }, headG);
  const seamF = el('path', { fill: 'none', stroke: P.derived.ivoryDeep, 'stroke-width': 2.5, opacity: 0.8 }, headG);
  const seamB = el('path', { fill: 'none', stroke: P.derived.ivoryDeep, 'stroke-width': 2.5, opacity: 0.8 }, headG);
  const backPanel = el('rect', { width: 120, height: 70, rx: 30, fill: 'none', stroke: P.derived.ivoryDeep, 'stroke-width': 2.5 }, headG);
  const earFront = el('g', {}, headG);
  const ears = {};
  for (const side of ['L', 'R']) {
    const g = el('g', {});
    el('circle', { r: 34, fill: P.derived.ivoryShade, stroke: P.derived.ivoryDeep, 'stroke-width': 2 }, g);
    el('circle', { r: 24, fill: P.derived.jointDeep }, g);
    el('circle', { r: 11, fill: P.orange }, g);
    ears[side] = g;
  }
  const visorG = el('g', {}, headG);
  const visorRim = el('rect', { fill: P.derived.displayRim }, visorG);
  const visor = el('rect', { fill: P.derived.display }, visorG);
  const eyesG = el('g', { 'clip-path': `url(#${id}-visor)` }, visorG);
  const eyes = {};
  for (const side of ['L', 'R']) {
    const outer = el('g', { filter: `url(#${id}-glow)` }, eyesG);
    const lidded = el('g', { 'clip-path': `url(#${id}-lid${side})` }, outer);
    const shape = el('ellipse', { fill: P.orange }, lidded);
    const arc = el('path', { fill: 'none', stroke: P.orange, 'stroke-linecap': 'round' }, outer);
    eyes[side] = { outer, shape, arc };
  }

  // ---------- limbs ----------
  function joint(parent, r) { return el('circle', { r, fill: P.derived.joint }, parent); }

  function makeHands(parent, mirror) {
    const wrap = el('g', { transform: `scale(${mirror ? -1.35 : 1.35},1.35)` }, parent);
    const finger = (g, x, y, len, rot, w = 8) => {
      const f = el('g', { transform: `translate(${x},${y}) rotate(${rot})` }, g);
      el('rect', { x: -w / 2, y: 0, width: w, height: len, rx: w / 2, ...ivoryPart, 'stroke-width': 1.5 }, f);
      el('line', { x1: -w / 2 + 1, x2: w / 2 - 1, y1: len * 0.48, y2: len * 0.48, stroke: P.derived.ivoryDeep, 'stroke-width': 1.5 }, f);
    };
    const palm = (g) => el('rect', { x: -16, y: 4, width: 32, height: 28, rx: 9, ...ivoryPart }, g);
    const h = {};
    h.open = el('g', {}, wrap); palm(h.open);
    [[-11, -12], [-4, -4], [4, 4], [11, 12]].forEach(([x, r], i) => finger(h.open, x, 28, [22, 27, 26, 21][i], r));
    finger(h.open, 14, 10, 20, -58, 9);
    h.point = el('g', {}, wrap); palm(h.point);
    finger(h.point, -9, 28, 36, 0);
    [[-1], [6], [12]].forEach(([x]) => el('rect', { x: x - 4, y: 26, width: 8, height: 11, rx: 4, ...ivoryPart, 'stroke-width': 1.5 }, h.point));
    finger(h.point, 14, 12, 15, -35, 9);
    h.fist = el('g', {}, wrap);
    el('rect', { x: -18, y: 4, width: 36, height: 34, rx: 12, ...ivoryPart }, h.fist);
    for (const x of [-9, -1, 7]) el('line', { x1: x + 4, x2: x + 4, y1: 26, y2: 37, stroke: P.derived.ivoryDeep, 'stroke-width': 1.5 }, h.fist);
    finger(h.fist, 16, 12, 16, -20, 9);
    h.relaxed = el('g', {}, wrap); palm(h.relaxed);
    [-10, -3, 4, 11].forEach((x, i) => finger(h.relaxed, x, 27, [19, 23, 22, 18][i], 6 + i * 2, 7.5));
    finger(h.relaxed, 15, 12, 17, -28, 8);
    return h;
  }

  function makeArm(side) {
    const mount = el('g', {});
    const sh = el('g', {}, mount);
    el('rect', { x: -15, y: 0, width: 30, height: D.upperArm, rx: 15, ...ivoryPart }, sh);
    const elb = el('g', { transform: `translate(0,${D.upperArm})` }, sh);
    const elbRot = el('g', {}, elb);
    el('rect', { x: -13, y: 0, width: 26, height: D.foreArm, rx: 13, ...ivoryPart }, elbRot);
    joint(elb, 15);
    const wr = el('g', { transform: `translate(0,${D.foreArm})` }, elbRot);
    const wrRot = el('g', {}, wr);
    const hands = makeHands(wrRot, side === 'R');
    joint(wr, 11);
    // shoulder pauldron drawn last so it caps the arm
    const pauld = el('g', {}, sh);
    el('circle', { r: 37, ...ivoryPart }, pauld);
    const disc = el('g', {}, pauld);
    el('circle', { r: 22, fill: P.derived.jointDeep }, disc);
    el('circle', { r: 12, fill: P.orange }, disc);
    return { mount, sh, elbRot, wrRot, hands, disc };
  }

  function makeLeg() {
    const mount = el('g', {});
    const hip = el('g', {}, mount);
    el('rect', { x: -17, y: 0, width: 34, height: D.thigh, rx: 16, ...ivoryPart }, hip);
    const knee = el('g', { transform: `translate(0,${D.thigh})` }, hip);
    const kneeRot = el('g', {}, knee);
    el('rect', { x: -14, y: 0, width: 28, height: D.shin, rx: 14, ...ivoryPart }, kneeRot);
    joint(knee, 17);
    const ank = el('g', { transform: `translate(0,${D.shin})` }, kneeRot);
    const ankRot = el('g', {}, ank);
    const foot = el('path', { ...ivoryPart }, ankRot);
    joint(ank, 9);
    el('circle', { r: 16, fill: P.derived.jointDeep, cy: 0 }, hip);
    return { mount, hip, kneeRot, ankRot, foot };
  }

  const arms = { L: makeArm('L'), R: makeArm('R') };
  const legs = { L: makeLeg(), R: makeLeg() };

  // ---------- apply ----------
  const rad = (d) => (d * Math.PI) / 180;

  function headSeam(yawDeg, angleDeg) {
    // vertical meridian over the top of the head at a given angle around the head
    const a = rad(yawDeg + angleDeg);
    const vis = Math.cos(a);
    let d = '';
    for (let i = 0; i <= 12; i++) {
      const lat = lerp(-Math.PI / 2, -0.32, i / 12); // from top of head to just above the visor
      const x = D.headRX * Math.sin(a) * Math.cos(lat);
      const y = headY + D.headRY * Math.sin(lat);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return { d, vis };
  }

  function apply() {
    const s = Math.sin(rad(S.yaw)), c = Math.cos(rad(S.yaw));
    const hy = S.yaw + S.headYaw;
    const hs = Math.sin(rad(hy)), hc = Math.cos(rad(hy));

    root.setAttribute('transform', `translate(${S.x},${S.y}) scale(${S.scale})`);
    root.setAttribute('opacity', S.opacity);
    shadow.setAttribute('opacity', 0.35 * S.shadow);
    shadow.setAttribute('rx', 110 + 30 * Math.abs(s));

    // torso
    torso.setAttribute('transform', `translate(0,${S.bob + D.lift}) rotate(${S.bodyTilt},0,${D.waist})`);
    pelvisG.setAttribute('transform', `translate(0,${S.bob + D.lift}) scale(${1.1 * (0.6 + 0.4 * Math.abs(c))},1)`);
    const fOp = clamp((c - 0.2) * 4), sOp = clamp((Math.abs(s) - 0.8) * 6), bOp = clamp(-c * 3);
    const br = 1 + 0.012 * S.breathe;
    ribsFront.setAttribute('opacity', fOp);
    ribsFront.setAttribute('transform', `translate(${s * 24},${D.waist}) scale(${D.chestW * Math.max(0.2, Math.abs(c))},${br}) translate(0,${-D.waist})`);
    ribsSide.setAttribute('opacity', sOp);
    ribsSide.setAttribute('transform', `translate(0,${D.waist}) scale(${Math.sign(s) || 1},${br}) translate(0,${-D.waist})`);
    ribsBack.setAttribute('opacity', bOp);
    ribsBack.setAttribute('transform', `translate(${-s * 20},0) scale(${D.chestW * Math.max(0.2, Math.abs(c))},1)`);

    // head
    headPivot.setAttribute('transform', `translate(0,${D.neckBase + S.headNod}) rotate(${S.headTilt})`);
    const vScale = 0.22 + 0.78 * clamp(hc);
    const vw = D.visorW * vScale, vh = D.visorH;
    const vx = hs * (D.headRX * 0.96 - vw / 2);
    const vy = D.visorCY - D.neckBase;
    const vOp = clamp((hc + 0.3) / 0.2);
    visorG.setAttribute('opacity', vOp);
    for (const [r, pad] of [[visorRim, 5], [visor, 0], [visorClipRect, 0]]) {
      r.setAttribute('x', vx - vw / 2 - pad); r.setAttribute('y', vy - vh / 2 - pad);
      r.setAttribute('width', vw + pad * 2); r.setAttribute('height', vh + pad * 2);
      r.setAttribute('rx', Math.min(D.visorR, vw / 2) + pad);
    }
    for (const side of ['L', 'R']) {
      const E = side === 'L' ? S.eyeL : S.eyeR;
      const sg = side === 'L' ? -1 : 1;
      const far = (sg < 0 && hs > 0) || (sg > 0 && hs < 0);
      const op = far ? clamp(1 - (Math.abs(hs) - 0.82) / 0.12) : 1;
      const ex = vx + (sg * D.eyeOff + E.dx) * vScale;
      const ey = vy + E.dy;
      const w = D.eyeRX * E.w * (0.55 + 0.45 * vScale), h = D.eyeRY * E.h;
      const lidT = E.lidT + S.blink * (0.55 - E.lidT), lidB = E.lidB + S.blink * (0.48 - E.lidB);
      const { outer, shape, arc } = eyes[side];
      outer.setAttribute('transform', `translate(${ex},${ey}) rotate(${sg * E.rot})`);
      outer.setAttribute('opacity', op);
      shape.setAttribute('rx', w); shape.setAttribute('ry', h);
      shape.setAttribute('opacity', 1 - E.smile);
      lidClip[side].setAttribute('y', -h - 2 + lidT * 2 * h);
      lidClip[side].setAttribute('height', Math.max(0, 2 * h + 4 - (lidT + lidB) * 2 * h));
      lidClip[side].setAttribute('width', 120);
      arc.setAttribute('d', `M${-w * 1.15} ${h * 0.3} Q0 ${-h * 1.05} ${w * 1.15} ${h * 0.3}`);
      arc.setAttribute('stroke-width', w * 0.75);
      arc.setAttribute('opacity', E.smile);
    }
    eyesG.setAttribute('opacity', S.glow);

    const sf = headSeam(hy, 0), sb = headSeam(hy, 180);
    seamF.setAttribute('d', sf.d); seamF.setAttribute('opacity', 0.8 * clamp(sf.vis * 3));
    seamB.setAttribute('d', sb.d); seamB.setAttribute('opacity', 0.8 * clamp(sb.vis * 3));
    backPanel.setAttribute('x', -hs * 40 - 60 * Math.max(0.25, Math.abs(hc)));
    backPanel.setAttribute('width', 120 * Math.max(0.25, Math.abs(hc)));
    backPanel.setAttribute('y', headY + 6);
    backPanel.setAttribute('opacity', 0.8 * clamp(-hc * 3));

    for (const side of ['L', 'R']) {
      const a = rad(hy + (side === 'L' ? -90 : 90));
      const x = D.headRX * 0.97 * Math.sin(a);
      const facing = Math.cos(a);
      const g = ears[side];
      g.setAttribute('transform', `translate(${x},${headY + 4}) scale(${Math.max(0.12, Math.abs(facing))},1)`);
      (facing >= 0 ? earFront : earBehind).appendChild(g);
      g.setAttribute('opacity', facing > -0.25 ? 1 : 0);
    }

    // arms
    for (const side of ['L', 'R']) {
      const A = arms[side], st = side === 'L' ? S.armL : S.armR;
      const sg = side === 'L' ? 1 : -1;          // outward rotation sign in screen space
      const a = rad(S.yaw + (side === 'L' ? -90 : 90));
      const x = D.shoulderX * Math.sin(a), depth = Math.cos(a);
      A.mount.setAttribute('transform', `translate(${x},${D.shoulderY})`);
      A.sh.setAttribute('transform', `rotate(${sg * st.sh})`);
      A.elbRot.setAttribute('transform', `rotate(${sg * st.el})`);
      A.wrRot.setAttribute('transform', `rotate(${sg * st.wr})`);
      A.disc.setAttribute('transform', `scale(${0.6 + 0.4 * Math.abs(s)},1)`);
      const hand = side === 'L' ? S.handL : S.handR;
      for (const [k, g] of Object.entries(A.hands)) g.setAttribute('display', k === hand ? 'inline' : 'none');
      (depth < -0.35 ? armBack : armFront).appendChild(A.mount);
    }
    // keep the near arm drawn last
    const nearArm = s >= 0 ? arms.L : arms.R;
    if (nearArm.mount.parentNode === armFront) armFront.appendChild(nearArm.mount);

    // legs
    for (const side of ['L', 'R']) {
      const Lg = legs[side], st = side === 'L' ? S.legL : S.legR;
      const sg = side === 'L' ? 1 : -1;
      const a = rad(S.yaw + (side === 'L' ? -90 : 90));
      const x = D.hipX * Math.sin(a), depth = Math.cos(a);
      Lg.mount.setAttribute('transform', `translate(${x},${D.hipY + D.lift + S.bob})`);
      Lg.hip.setAttribute('transform', `rotate(${sg * st.hip})`);
      Lg.kneeRot.setAttribute('transform', `rotate(${sg * st.knee})`);
      Lg.ankRot.setAttribute('transform', `rotate(${sg * st.ankle})`);
      const fs = Math.abs(s), dir = Math.sign(s) || 1;
      const left = lerp(-24, dir > 0 ? -18 : -52, fs), right = lerp(24, dir > 0 ? 52 : 18, fs);
      Lg.foot.setAttribute('d', `M${left} 6 Q${left} -6 ${left + 10} -6 L${right - 12} -6 Q${right} -4 ${right} 14 L${right} 26 L${left} 26 Z`);
      (depth < -0.2 ? legBack : legFront).appendChild(Lg.mount);
    }
  }

  apply();
  return { id, root, state: S, apply };
}
