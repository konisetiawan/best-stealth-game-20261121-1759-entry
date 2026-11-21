const { chromium } = require('playwright');
const { mkdirSync, readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = __dirname;
const output = path.join(__dirname, 'screenshots');
mkdirSync(output, { recursive: true });
const cases = [
  { file: '1-cover.jpg', query: { level: 0, state: 'play', player: '94,91' } },
  { file: '2-gallery.jpg', query: { level: 1, suspicion: 82, state: 'play' } },
  { file: '3-alarm.jpg', query: { level: 2, state: 'spotted' } },
  { file: '4-victory.jpg', query: { level: 2, state: 'victory' } }
];

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(root, urlPath === '/' ? 'game/index.html' : urlPath);
      if (!existsSync(filePath) || !filePath.startsWith(root)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 300)));
    for (const shot of cases) {
      const url = new URL(`http://127.0.0.1:${port}/game/index.html`);
      for (const [key, value] of Object.entries(shot.query)) url.searchParams.set(key, String(value));
      await page.goto(url.href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(output, shot.file), type: 'jpeg', quality: 82 });
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
