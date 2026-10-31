// Render one frame of a composition to PNG (thumbnails, character sheets).
// Usage: node tools/render-still.mjs <composition.html> <out.png> [width] [height] [--t seconds]
import fs from 'node:fs';
import path from 'node:path';
import { serve, loadPlaywright, openComposition } from './lib.mjs';

const args = process.argv.slice(2);
const [comp, out] = args;
const width = Number(args[2] ?? 1080), height = Number(args[3] ?? 1920);
const ti = args.indexOf('--t'); const t = ti >= 0 ? Number(args[ti + 1]) : 0;

const { server, base } = await serve();
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await openComposition(page, base, comp);
await page.evaluate((t) => window.__seek(t), t);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await page.screenshot({ path: out, type: 'png' });
await browser.close(); server.close();
console.log(`wrote ${out}`);
