// Automated quality control for an episode's renders. Writes <out>/qc-report.md and
// <out>/crop-preview.png (9:16 with platform UI overlay, 1:1 and 4:5 crops).
// Usage: node tools/qc.mjs episodes/<slug> renders/<slug>
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { ROOT } from './lib.mjs';

const [ep, out] = process.argv.slice(2);
const brand = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand/brand.config.json'), 'utf8'));
const V = brand.video.vertical, SA = brand.safeArea, SUB = brand.subtitles;
const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 });
const runErr = (cmd, args) => { try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }); } catch (e) { return String(e.stderr ?? ''); } };
const ff = (args) => { const r = require_spawn('ffmpeg', args); return r; };
function require_spawn(cmd, args) { const { spawnSync } = awaitImport; return spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 << 20 }).stderr; }
const awaitImport = await import('node:child_process');

const checks = [];
const check = (name, ok, detail) => checks.push({ name, ok, detail });

const masters = ['master_clean.mp4', 'master_captioned.mp4'].map((f) => path.join(out, f)).filter((f) => fs.existsSync(f));
const duration = Number(fs.readFileSync(path.join(ep, 'build/duration.txt'), 'utf8'));
for (const m of masters) {
  const p = JSON.parse(run('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', m]));
  const v = p.streams.find((s) => s.codec_type === 'video'), a = p.streams.find((s) => s.codec_type === 'audio');
  const name = path.basename(m);
  check(`${name}: 1080×1920`, v.width === V.width && v.height === V.height, `${v.width}×${v.height}`);
  check(`${name}: ${V.fps} fps`, v.r_frame_rate === `${V.fps}/1`, v.r_frame_rate);
  check(`${name}: H.264 yuv420p`, v.codec_name === 'h264' && v.pix_fmt === 'yuv420p', `${v.codec_name} ${v.pix_fmt}`);
  check(`${name}: AAC 48 kHz stereo`, a && a.codec_name === 'aac' && a.sample_rate === '48000' && a.channels === 2, a ? `${a.codec_name} ${a.sample_rate} ${a.channels}ch` : 'no audio');
  check(`${name}: duration`, Math.abs(Number(p.format.duration) - duration) < 0.15, `${Number(p.format.duration).toFixed(2)}s (timeline ${duration.toFixed(2)}s)`);
}

const clean = masters[0];
if (clean) {
  const loud = ff(['-hide_banner', '-i', clean, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  const I = Number(/I:\s+(-?[\d.]+) LUFS\s*\n\s*Threshold/.exec(loud)?.[1] ?? /I:\s+(-?[\d.]+) LUFS/.exec(loud.slice(loud.lastIndexOf('Summary')))?.[1]);
  const TP = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(loud.slice(loud.lastIndexOf('True peak')))?.[1]);
  check('Integrated loudness ≈ -14 LUFS (±1)', Math.abs(I + 14) <= 1, `${I} LUFS`);
  check('True peak ≤ -1 dBTP', TP <= -1.0, `${TP} dBTP`);
  const black = ff(['-hide_banner', '-i', clean, '-vf', 'blackdetect=d=0.25:pix_th=0.05', '-an', '-f', 'null', '-']);
  const blacks = [...black.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => `${m[1]}–${m[2]}s`);
  check('No black gaps (>0.25 s)', blacks.length === 0, blacks.join(', ') || 'none');
  const frz = ff(['-hide_banner', '-i', clean, '-vf', 'freezedetect=n=0.001:d=2.5', '-an', '-f', 'null', '-']);
  const freezes = [...frz.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => `${m[1]}s`);
  check('No frozen shots (>2.5 s)', freezes.length === 0, freezes.join(', ') || 'none');
  // visual change cadence: scene-cut-ish changes per second
  const sc = ff(['-hide_banner', '-i', clean, '-vf', "select='gt(scene,0.08)',showinfo", '-an', '-f', 'null', '-']);
  const changes = [...sc.matchAll(/pts_time:([\d.]+)/g)].map((m) => Number(m[1]));
  const gaps = changes.map((t, i) => t - (changes[i - 1] ?? 0));
  check('Visual change at least every ~4 s', Math.max(...gaps, 0) <= 4.5, `${changes.length} major changes; longest hold ${Math.max(...gaps, 0).toFixed(1)}s`);
}

// subtitles
const subs = JSON.parse(fs.readFileSync(path.join(ep, 'build/subtitles.json'), 'utf8'));
const longLines = subs.filter((c) => c.text.length > SUB.maxCharsPerLine * SUB.maxLines);
const short = subs.filter((c) => c.end - c.start < SUB.minDurationSec - 1e-3);
const overlaps = subs.filter((c, i) => i && c.start < subs[i - 1].end - 1e-3);
check(`Subtitles fit ${SUB.maxLines} lines × ${SUB.maxCharsPerLine} chars`, longLines.length === 0, longLines.map((c) => c.text).join(' | ') || `${subs.length} cues OK`);
check(`Subtitle min duration ${SUB.minDurationSec}s`, short.length === 0, short.map((c) => `"${c.text}" ${(c.end - c.start).toFixed(2)}s`).join(', ') || 'OK');
check('Subtitles do not overlap', overlaps.length === 0, overlaps.length ? `${overlaps.length} overlaps` : 'OK');

// crop previews from the captioned master
const cap = masters[1] ?? masters[0];
const times = [0.5, duration * 0.12, duration * 0.3, duration * 0.48, duration * 0.66, duration * 0.85];
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qc-'));
const tiles = [];
for (const [i, t] of times.entries()) {
  const f = path.join(dir, `f${i}.png`);
  run('ffmpeg', ['-v', 'error', '-y', '-ss', t.toFixed(2), '-i', cap, '-frames:v', '1', f]);
  const ui = path.join(dir, `ui${i}.png`);
  const P = SA.platformUI;
  run('convert', [f, '-fill', 'rgba(255,60,60,0.22)', '-draw', `rectangle 0,0 1080,${P.top}`, '-draw', `rectangle 0,${1920 - P.bottom} 1080,1920`, '-draw', `rectangle ${1080 - P.right},0 1080,1920`,
    '-fill', 'none', '-stroke', 'rgba(255,122,61,0.9)', '-strokewidth', '4', '-draw', `rectangle ${SA.crop1x1.x},${SA.crop1x1.y} ${SA.crop1x1.x + SA.crop1x1.w},${SA.crop1x1.y + SA.crop1x1.h}`,
    '-stroke', 'rgba(59,130,246,0.9)', '-draw', `rectangle ${SA.crop4x5.x},${SA.crop4x5.y} ${SA.crop4x5.x + SA.crop4x5.w},${SA.crop4x5.y + SA.crop4x5.h}`, ui]);
  const sq = path.join(dir, `sq${i}.png`), fv = path.join(dir, `fv${i}.png`);
  run('convert', [f, '-crop', `${SA.crop1x1.w}x${SA.crop1x1.h}+${SA.crop1x1.x}+${SA.crop1x1.y}`, '+repage', '-resize', '540x540', '-gravity', 'center', '-background', '#000', '-extent', '540x960', sq]);
  run('convert', [f, '-crop', `${SA.crop4x5.w}x${SA.crop4x5.h}+${SA.crop4x5.x}+${SA.crop4x5.y}`, '+repage', '-resize', '540x675', '-gravity', 'center', '-background', '#000', '-extent', '540x960', fv]);
  run('convert', [ui, '-resize', '540x960', ui]);
  tiles.push(ui, sq, fv);
}
const sheet = path.join(out, 'crop-preview.png');
run('montage', [...tiles, '-tile', '3x', '-geometry', '+8+8', '-background', '#000', sheet]);
check('Crop preview generated', fs.existsSync(sheet), path.relative(ROOT, sheet));

const pass = checks.filter((c) => c.ok).length;
const md = [`# QC report — ${path.basename(ep)}`, '', `Generated ${new Date().toISOString()}. Automated checks: **${pass}/${checks.length} passed**.`, '',
  '| Check | Result | Detail |', '|---|---|---|', ...checks.map((c) => `| ${c.name} | ${c.ok ? '✅' : '❌'} | ${String(c.detail).replace(/\|/g, '/')} |`), '',
  '## Crop preview', 'Rows = moments in the video. Columns: full 9:16 frame with platform UI zones (red), 1:1 crop (orange box), 4:5 crop (blue box); then the 1:1 and 4:5 crops themselves.', '',
  '## Human review still required', '- [ ] Facts and wording match the approved script and source log', '- [ ] No third-party logos, trademarks or likenesses', '- [ ] Narration voice is the approved licensed voice (placeholder voices must not be published)',
  '- [ ] Music/SFX licence record complete (this pipeline: original, generated in code)', '- [ ] AI-content disclosure decision recorded for YouTube and Facebook', '- [ ] Owner final approval'].join('\n');
fs.writeFileSync(path.join(out, 'qc-report.md'), md);
console.log(checks.map((c) => `${c.ok ? 'PASS' : 'FAIL'}  ${c.name} — ${c.detail}`).join('\n'));
