// EP001 storyboard: one entry per shot. `draw` renders the shot's key frame (1080x1920);
// the same drawing code becomes the animated scene in the episode composition.
import * as K from '/scenes/components.js';
import { EXPRESSIONS } from '/character/rig/expressions.js';
import { POSES } from '/character/rig/poses.js';

const GROUND = 1230;

function bot(ctx, g, { pose = 'idle', expr = 'neutral', ...state } = {}) {
  const r = ctx.robot(g);
  const P = POSES[pose], E = EXPRESSIONS[expr];
  Object.assign(r.state, {
    armL: { ...r.state.armL, ...P.armL }, armR: { ...r.state.armR, ...P.armR },
    handL: P.handL ?? 'relaxed', handR: P.handR ?? 'relaxed', bodyTilt: P.bodyTilt ?? 0,
    eyeL: { ...E.eyeL }, eyeR: { ...E.eyeR }, headTilt: E.headTilt, y: GROUND, ...state,
  });
  r.apply();
  return r;
}

export const SHOTS = [
  {
    time: '0:00–0:02', vo: 'You ask an AI a question.', sub: 'You ask an AI a question.',
    visual: 'Opening frame (also the thumbnail). Robot in ¾ view reaches toward a floating chat window and taps Send.',
    robot: 'Curious → taps the send button (point pose)', camera: 'Static, tight framing', transition: 'Hard open, no logo', sfx: 'Soft UI tap; music starts low',
    draw(g, ctx) { K.chatCard(g, ctx.C, { x: 700, y: 700, w: 520, h: 680, mode: 'question', sendGlow: true }); bot(ctx, g, { x: 290, yaw: 30, scale: 0.92, pose: 'pointRight', expr: 'curious', headYaw: 10 }); },
  },
  {
    time: '0:02–0:04', vo: 'Seconds later, an answer.', sub: 'Seconds later, an answer.',
    visual: 'The answer appears in the chat window, line by line.',
    robot: 'Surprised hop, hands up', camera: 'Quick push-in (≈8%) on the window', transition: 'Continuous shot', sfx: 'Soft digital shimmer as text fills',
    draw(g, ctx) { K.chatCard(g, ctx.C, { x: 700, y: 690, w: 540, h: 720, mode: 'answer', answerLines: 7 }); bot(ctx, g, { x: 280, yaw: 25, scale: 0.92, pose: 'surprised', expr: 'surprised', y: GROUND - 18 }); },
  },
  {
    time: '0:04–0:06', vo: "But it isn't pulling a finished reply from a file.", sub: "But it isn't pulling a finished reply from a file.",
    visual: 'Match cut: the answer card becomes a document sliding out of a filing cabinet, then a slate "no" mark draws over it.',
    robot: 'Shakes head (head turn left-right), shrug', camera: 'Static', transition: 'Match cut: card → document (0.3 s morph)', sfx: 'Drawer slide, soft muted thud on the "no" mark',
    draw(g, ctx) { K.fileCabinet(g, ctx.C, { x: 730, y: 800 }); bot(ctx, g, { x: 280, yaw: 20, scale: 0.92, pose: 'confused', expr: 'confused' }); },
  },
  {
    time: '0:06–0:09', vo: "It's predicting one, piece by piece.", sub: "It's predicting one, piece by piece.",
    visual: 'Document dissolves into word blocks that appear one at a time; an orange dashed slot waits for the next piece.',
    robot: 'Points at the next slot, explaining', camera: 'Slow drift right', transition: 'Shape morph: page lines → token blocks', sfx: 'Light tick per block',
    draw(g, ctx) { K.tokenRow(g, ctx.C, { x: 540, y: 470, tokens: ['The', 'sky', 'looks', 'blue'], nextSlot: true, size: 58, maxW: 860 }); bot(ctx, g, { x: 400, scale: 0.92, pose: 'pointRight', expr: 'explaining', yaw: 15 }); },
  },
  {
    time: '0:09–0:11', vo: "Here's what actually happens.", sub: "Here's what actually happens.",
    visual: 'Robot turns toward a phone; an orange signal leaves it and heads up out of frame.',
    robot: 'Turns from front to side (walk start)', camera: 'Tilt up following the signal', transition: 'Whip-pan up (0.25 s)', sfx: 'Rising soft whoosh',
    draw(g, ctx) { K.phone(g, ctx.C, { x: 720, y: 1030, s: 1.1 }); K.signalPath(g, ctx.C, 'M720 860 C720 640 790 480 860 260', { t: 0.7 }); bot(ctx, g, { x: 330, yaw: 70, scale: 0.92, expr: 'curious' }); },
  },
  {
    time: '0:11–0:17', vo: 'With popular AI chat apps, your message travels to computers in a data center, running a large language model.', sub: 'Your message travels to computers in a data center,',
    visual: 'Full-screen diagram: phone at bottom, signal climbs to a row of server racks. Robot not on screen.',
    robot: 'Off screen (diagram shot)', camera: 'Push up from phone to racks', transition: 'Continue from whip-pan', sfx: 'Data pulse; low server hum (very quiet)',
    draw(g, ctx) { K.phone(g, ctx.C, { x: 540, y: 1100, s: 0.95 }); K.signalPath(g, ctx.C, 'M540 950 C540 860 540 820 540 790', { t: 0.5 }); [280, 540, 800].forEach((x) => K.serverRack(g, ctx.C, { x, y: 540, s: 1.15 })); },
  },
  {
    time: '0:17–0:23', vo: 'First, your text is split into tokens: small chunks like words, parts of words, or punctuation.', sub: 'First, your text is split into tokens:',
    visual: 'A typed question breaks apart into blocks, including a word split into two parts. Labelled "simplified".',
    robot: 'Examines the blocks, hand raised (examine pose)', camera: 'Push-in on the blocks', transition: 'Push-in through the rack (0.3 s)', sfx: 'Quick soft clicks as it splits',
    draw(g, ctx) { K.tokenRow(g, ctx.C, { x: 540, y: 380, tokens: ['Why', 'is', 'the', 'sky', 'un', 'believ', 'ably', 'blue', '?'], size: 52, highlight: 5, maxW: 860 }); bot(ctx, g, { x: 460, scale: 0.78, pose: 'examine', expr: 'curious' }); },
  },
  {
    time: '0:23–0:33', vo: "During training, the model learned patterns from huge amounts of text. It doesn't look through that text when it answers. The patterns are captured in billions of numbers.", sub: 'The patterns are captured in billions of numbers.',
    visual: 'A stack of pages compresses into a grid of glowing dots (the numbers). The pages fade away to show nothing is being searched.',
    robot: 'Thinking, hand to chin', camera: 'Slow push-in on the grid', transition: 'Pages slide into the grid (shape morph)', sfx: 'Paper rustle → soft digital settle',
    draw(g, ctx) { K.pageStack(g, ctx.C, { x: 290, y: 560 }); K.el('path', { d: 'M440 450 L560 450 M540 430 L562 450 L540 470', fill: 'none', stroke: ctx.C.slate, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); K.paramGrid(g, ctx.C, { x: 780, y: 450, cols: 7, rows: 8, step: 40 }); bot(ctx, g, { x: 540, scale: 0.72, pose: 'think', expr: 'thinking' }); },
  },
  {
    time: '0:33–0:40', vo: 'Now it uses those patterns, and everything in the conversation, to calculate which token is likely to come next.', sub: 'to calculate which token is likely to come next.',
    visual: 'Unfinished sentence on top; candidate next tokens with probability bars (illustrative, no numbers). Highest bar in orange.',
    robot: 'Leans in, explaining with open hand', camera: 'Static; bars grow', transition: 'Grid dots fly into the bars', sfx: 'Soft rising tones as bars grow',
    draw(g, ctx) { K.tokenRow(g, ctx.C, { x: 540, y: 470, tokens: ['The', 'sky', 'looks', 'blue', 'because'], nextSlot: true, size: 42, maxW: 980 }); K.probBars(g, ctx.C, { x: 430, y: 580, items: [['sunlight', 0.78], ['air', 0.46], ['of', 0.3], ['light', 0.2]], size: 48, barMax: 330, rowH: 100 }); bot(ctx, g, { x: 870, scale: 0.6, pose: 'presentLeft', expr: 'explaining', yaw: -25 }); },
  },
  {
    time: '0:40–0:45', vo: 'It picks one, adds it, and repeats, token by token, until the answer is complete.', sub: 'It picks one, adds it, and repeats,',
    visual: 'The chosen block slides into the slot; a new slot appears; the loop repeats faster until the sentence is complete.',
    robot: 'Presents the growing sentence, pleased', camera: 'Slight pull-back to show the growing line', transition: 'Chosen bar flies into the slot', sfx: 'Rhythmic soft ticks, accelerating',
    draw(g, ctx) { K.tokenRow(g, ctx.C, { x: 540, y: 360, tokens: ['The', 'sky', 'looks', 'blue', 'because', 'sunlight', 'scatters'], nextSlot: true, highlight: 6, size: 46, maxW: 880 }); K.el('path', { d: 'M860 640 A60 60 0 1 1 800 580', fill: 'none', stroke: ctx.C.orange, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); K.el('path', { d: 'M788 562 L802 582 L778 590', fill: 'none', stroke: ctx.C.orange, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); bot(ctx, g, { x: 400, scale: 0.8, pose: 'presentRight', expr: 'happy' }); },
  },
  {
    time: '0:45–0:52', vo: "That's why AI sounds so fluent. But fluent isn't the same as correct. It can sound confident and still be wrong.", sub: "But fluent isn't the same as correct.",
    visual: 'A polished answer card. A magnifier passes over it and one line turns orange: an error hidden in smooth text.',
    robot: 'Neutral → confused, then thinking', camera: 'Push-in on the magnifier', transition: 'Match cut: token line → answer card', sfx: 'Restrained low impact on the orange reveal',
    draw(g, ctx) { const c = K.chatCard(g, ctx.C, { x: 680, y: 680, w: 540, h: 720, mode: 'answer', answerLines: 7 }); K.el('rect', { x: 450, y: 574, width: 390, height: 13, rx: 6.5, fill: ctx.C.orange }, g); K.magnifier(g, ctx.C, { x: 640, y: 580, r: 90 }); bot(ctx, g, { x: 260, scale: 0.88, pose: 'confused', expr: 'confused', yaw: 25 }); },
  },
  {
    time: '0:52–1:00', vo: 'So when an answer appears in seconds, remember: it was built one prediction at a time. Check what matters.', sub: 'Check what matters.',
    visual: 'Robot faces camera beside the answer card with a small check mark. Last 1.5 s: quiet end card with the brand name and tagline.',
    robot: 'Front view, confident explain, then a small nod', camera: 'Slow pull-back', transition: 'Gentle fade to end card (0.4 s)', sfx: 'Music resolves; soft final tone',
    draw(g, ctx) { K.chatCard(g, ctx.C, { x: 720, y: 700, w: 460, h: 620, mode: 'answer', answerLines: 6 }); const ck = K.el('g', { transform: 'translate(910,430)' }, g); K.el('circle', { r: 40, fill: ctx.C.orange }, ck); K.el('path', { d: 'M-17 0 L-5 13 L18 -12', fill: 'none', stroke: ctx.C.bg, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ck); bot(ctx, g, { x: 310, scale: 0.92, pose: 'explain', expr: 'happy' }); },
  },
];
