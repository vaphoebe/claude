// Render selected times of a composition into one contact-sheet PNG (quick visual QA).
// Usage: node tools/contact-sheet.mjs <composition.html> <out.png> t1,t2,... [cols]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { serve, loadPlaywright, openComposition } from './lib.mjs';

const [comp, out, list, cols = '6'] = process.argv.slice(2);
const times = list.split(',').map(Number);
const { server, base } = await serve();
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await openComposition(page, base, comp);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-'));
const files = [];
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => window.__seek(t), t);
  const f = path.join(dir, `${String(i).padStart(3, '0')}.png`);
  await page.screenshot({ path: f });
  files.push(f);
}
await browser.close(); server.close();
execFileSync('montage', [...files, '-tile', `${cols}x`, '-geometry', '360x640+6+6', '-background', '#000', out]);
console.log(`wrote ${out}`);
