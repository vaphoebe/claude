// Facial display expressions. Each preset sets both eyes (+ an optional head tilt).
// Eye fields: w/h = size multipliers, dx/dy = look offset, rot = tilt (mirrored per eye),
// lidT/lidB = 0..1 top/bottom lid closure, smile = 0..1 blend to "^" happy arcs.
import { defaultEye } from './robot.js';

const eye = (o = {}) => ({ ...defaultEye(), ...o });

export const EXPRESSIONS = {
  neutral:    { eyeL: eye(),                                   eyeR: eye(),                                   headTilt: 0 },
  curious:    { eyeL: eye({ w: 1.08, h: 1.14, dy: -3 }),       eyeR: eye({ w: 0.96, h: 0.94, dy: 2, lidT: 0.1 }), headTilt: -9 },
  thinking:   { eyeL: eye({ dx: 14, dy: -14, lidB: 0.35, rot: -6 }), eyeR: eye({ dx: 14, dy: -14, lidB: 0.35, rot: -6 }), headTilt: 7 },
  surprised:  { eyeL: eye({ w: 1.2, h: 1.3 }),                 eyeR: eye({ w: 1.2, h: 1.3 }),                 headTilt: 0 },
  happy:      { eyeL: eye({ smile: 1, dy: -2 }),               eyeR: eye({ smile: 1, dy: -2 }),               headTilt: -4 },
  explaining: { eyeL: eye({ h: 0.94, lidT: 0.08 }),            eyeR: eye({ h: 0.94, lidT: 0.08 }),            headTilt: 3 },
  confused:   { eyeL: eye({ w: 1.12, h: 1.16, rot: 8, dy: -4 }), eyeR: eye({ w: 0.9, h: 0.72, rot: -14, dy: 5, lidT: 0.28 }), headTilt: 10 },
};

export const EXPRESSION_NAMES = Object.keys(EXPRESSIONS);
