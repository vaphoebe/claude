const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 3300, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto("file://" + __dirname + "/p.html", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  for (const id of ["peach", "flag", "white"]) await p.locator("#" + id).screenshot({ path: `profile-P-${id}.png` });
  await b.close();
})();
