import { chromium } from 'file:///C:/Users/mwoj/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const mime = { '.html':'text/html', '.mjs':'text/javascript', '.js':'text/javascript', '.pdf':'application/pdf', '.map':'application/json' };

const server = http.createServer((req, res) => {
  const filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found: ' + filePath); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8923, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1700 } });
page.on('console', m => console.log('PAGE:', m.text()));
page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('http://localhost:8923/__pdf_render.html');
await page.waitForFunction(() => window.RENDER_DONE === true, { timeout: 60000 });
await page.waitForTimeout(500);

const numCanvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
console.log('canvases:', numCanvases);
for (let i = 1; i <= numCanvases; i++) {
  const el = await page.$('#page-' + i);
  await el.screenshot({ path: `__pdf_page${i}.png` });
}

await browser.close();
server.close();
