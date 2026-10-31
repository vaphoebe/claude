// Body poses. Angles: 0 = limb hanging down, positive = outward/up. Hands: open | point | fist | relaxed.
// A pose only lists what it changes; actions blend from whatever the rig is doing.

export const POSES = {
  idle: {
    armL: { sh: 6, el: -4, wr: 0 }, armR: { sh: 6, el: -4, wr: 0 },
    legL: { hip: 2, knee: 0, ankle: 0 }, legR: { hip: 2, knee: 0, ankle: 0 },
    handL: 'relaxed', handR: 'relaxed', bodyTilt: 0,
  },
  // right hand points up-and-out toward a subject on screen-right
  pointRight: { armR: { sh: 105, el: 8, wr: 4 }, handR: 'point', armL: { sh: 8, el: -6, wr: 0 }, handL: 'relaxed', bodyTilt: -2 },
  pointLeft: { armL: { sh: 105, el: 8, wr: 4 }, handL: 'point', armR: { sh: 8, el: -6, wr: 0 }, handR: 'relaxed', bodyTilt: 2 },
  // open palm presenting something at the side
  presentRight: { armR: { sh: 52, el: 58, wr: 18 }, handR: 'open', armL: { sh: 8, el: -4, wr: 0 }, handL: 'relaxed' },
  presentLeft: { armL: { sh: 52, el: 58, wr: 18 }, handL: 'open', armR: { sh: 8, el: -4, wr: 0 }, handR: 'relaxed' },
  // both palms open, explaining
  explain: { armL: { sh: 30, el: 70, wr: 10 }, armR: { sh: 30, el: 70, wr: 10 }, handL: 'open', handR: 'open' },
  // hand to chin
  think: { armR: { sh: -40, el: -137, wr: -8 }, handR: 'fist', armL: { sh: -12, el: -78, wr: 0 }, handL: 'relaxed', bodyTilt: 2 },
  // hands up, startled
  surprised: { armL: { sh: 38, el: 96, wr: 0 }, armR: { sh: 38, el: 96, wr: 0 }, handL: 'open', handR: 'open', bodyTilt: 0 },
  // shrug
  confused: { armL: { sh: 28, el: 64, wr: 24 }, armR: { sh: 28, el: 64, wr: 24 }, handL: 'open', handR: 'open', bodyTilt: -3 },
  // celebrate
  happy: { armL: { sh: 140, el: 10, wr: 0 }, armR: { sh: 18, el: -10, wr: 0 }, handL: 'open', handR: 'relaxed' },
  // holding something in front to examine it (both hands in)
  examine: { armR: { sh: 20, el: 120, wr: 10 }, handR: 'open', armL: { sh: 8, el: -6, wr: 0 }, handL: 'relaxed', bodyTilt: -3 },
  // typing on a laptop placed in front (use with yaw ~ 35)
  typing: { armL: { sh: -14, el: -70, wr: -8 }, armR: { sh: -14, el: -70, wr: -8 }, handL: 'relaxed', handR: 'relaxed', bodyTilt: 5 },
  wave: { armR: { sh: 125, el: 30, wr: 0 }, handR: 'open' },
};
