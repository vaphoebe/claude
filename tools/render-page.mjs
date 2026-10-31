// Render a full HTML page (e.g. storyboards) to PNG at its natural height.
// Usage: node tools/render-page.mjs <page.html> <out.png> [width]
import fs from 'node:fs';
import path from 'node:path';
import { serve, loadPlaywright, openComposition } from './lib.mjs';

const [page_, out, w] = process.argv.slice(2);
const { server, base } = await serve();
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w ?? 1680), height: 1000 } });
await openComposition(page, base, page_);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await page.screenshot({ path: out, fullPage: true });
await browser.close(); server.close();
console.log(`wrote ${out}`);
