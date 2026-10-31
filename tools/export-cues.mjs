// Export a composition's sound cues, duration and subtitle cues (JSON + SRT).
// Usage: node tools/export-cues.mjs <composition.html> <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { serve, loadPlaywright, openComposition } from './lib.mjs';

const [comp, outDir] = process.argv.slice(2);
const { server, base } = await serve();
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const duration = await openComposition(page, base, comp);
const { cues, subs, srt } = await page.evaluate(async () => {
  const { toSRT } = await import('/templates/subtitles.js');
  return { cues: window.__cues, subs: window.__subs, srt: toSRT(window.__subs) };
});
await browser.close(); server.close();
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'cues.json'), JSON.stringify(cues, null, 1));
fs.writeFileSync(path.join(outDir, 'subtitles.json'), JSON.stringify(subs, null, 1));
fs.writeFileSync(path.join(outDir, 'captions.srt'), srt);
fs.writeFileSync(path.join(outDir, 'duration.txt'), String(duration));
console.log(`duration ${duration.toFixed(2)}s · ${cues.length} sound cues · ${subs.length} subtitle cues → ${outDir}`);
