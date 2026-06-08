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
await new Promise(r => server.listen(8925, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
await page.goto('http://localhost:8925/__pdf_render_hires.html');
await page.waitForFunction(() => window.RENDER_DONE === true, { timeout: 120000 });
await page.waitForTimeout(500);

const crops = JSON.parse(fs.readFileSync('__pdf_crops.json', 'utf-8'));
for (const c of crops) {
  const dataUrl = await page.evaluate(({ pageNum, x, y, w, h }) => {
    const src = document.getElementById('page-' + pageNum);
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const ctx = out.getContext('2d');
    ctx.drawImage(src, x, y, w, h, 0, 0, w, h);
    return out.toDataURL('image/png');
  }, { pageNum: c.page, x: c.x, y: c.y, w: c.w, h: c.h });
  const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(c.out, Buffer.from(b64, 'base64'));
  console.log('wrote', c.out);
}

await browser.close();
server.close();
