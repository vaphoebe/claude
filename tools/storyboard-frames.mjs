// Capture storyboard frames from an episode's real composition.
// Usage: node tools/storyboard-frames.mjs episodes/<slug>   (reads <slug>/storyboard-final.json → <slug>/build/sb/NN.jpg)
import fs from 'node:fs';
import path from 'node:path';
import { serve, loadPlaywright, openComposition, ROOT } from './lib.mjs';
const ep = process.argv[2];
const data = JSON.parse(fs.readFileSync(path.join(ROOT, ep, 'storyboard-final.json'), 'utf8'));
const shots = Array.isArray(data) ? data : data.shots;
const out = path.join(ROOT, ep, 'build/sb'); fs.mkdirSync(out, { recursive: true });
const { server, base } = await serve();
const { chromium } = loadPlaywright();
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await openComposition(p, base, `${ep}/composition.html?captions=1`);
for (const [i, s] of shots.entries()) {
  await p.evaluate((t) => window.__seek(t), s.t);
  await p.screenshot({ path: path.join(out, `${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
}
await b.close(); server.close();
console.log(`${shots.length} frames → ${path.relative(ROOT, out)}`);
