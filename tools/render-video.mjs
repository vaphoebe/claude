// Deterministic frame-by-frame renderer: seeks the composition's GSAP timeline to each
// frame time, screenshots it, and pipes frames into FFmpeg.
// Usage: node tools/render-video.mjs <composition.html> <out.mp4> [--audio mix.wav] [--from s] [--to s]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { serve, loadPlaywright, openComposition, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const [comp, out] = args;
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
if (!comp || !out) { console.error('usage: render-video.mjs <composition.html> <out.mp4> [--audio file] [--from s] [--to s]'); process.exit(1); }

const brand = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand/brand.config.json'), 'utf8'));
const { width, height, fps } = brand.video.vertical;
const V = brand.video.codec;
const audio = opt('--audio');

const { server, base } = await serve();
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const duration = await openComposition(page, base, comp);
const t0 = Number(opt('--from') ?? 0), t1 = Number(opt('--to') ?? duration);
const frames = Math.round((t1 - t0) * fps);

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const ff = spawn('ffmpeg', [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
  ...(audio ? ['-ss', String(t0), '-i', audio] : []),
  '-c:v', V.video, '-profile:v', V.profile, '-pix_fmt', V.pixFmt, '-crf', String(V.crf), '-preset', V.preset,
  '-r', String(fps), '-movflags', '+faststart',
  ...(audio ? ['-c:a', V.audio, '-b:a', V.audioBitrate, '-ar', String(V.sampleRate), '-shortest'] : ['-an']),
  out,
], { stdio: ['pipe', 'inherit', 'inherit'] });

const started = Date.now();
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.__seek(t), t0 + i / fps);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % fps === 0) process.stdout.write(`\rframe ${i}/${frames}`);
}
ff.stdin.end();
await new Promise((r, j) => ff.on('close', (code) => (code === 0 ? r() : j(new Error(`ffmpeg exited ${code}`)))));
await browser.close(); server.close();
console.log(`\nrendered ${frames} frames (${(t1 - t0).toFixed(2)}s) in ${((Date.now() - started) / 1000).toFixed(1)}s → ${out}`);
