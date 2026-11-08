// Renders every mockup section to PNG: node render.mjs (after `npm run build`)
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join } from "node:path";

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const p = join("dist", decodeURIComponent(req.url.split("?")[0]) === "/" ? "index.html" : req.url.split("?")[0]);
  try { res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" }); res.end(await readFile(p)); }
  catch { res.writeHead(404); res.end(); }
}).listen(4173);

await mkdir("mockups/screens", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2100, height: 1400 }, deviceScaleFactor: Number(process.env.SCALE || 1) });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const ids = await page.$$eval("section[id]", (s) => s.map((x) => x.id));
for (const id of ids) {
  await page.locator(`[id="${id}"]`).screenshot({ path: id.startsWith("plain-") ? `mockups/screens/${id.slice(6)}.png` : `mockups/${id}.png` });
  console.log("saved mockups/" + id + ".png");
}
await browser.close(); server.close();
