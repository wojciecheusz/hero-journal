import { chromium } from 'file:///C:/Users/mwoj/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const pdfPath = path.resolve('public/templates/karta-postaci-template.pdf');
const pdfUrl = 'file:///' + pdfPath.split(path.sep).join('/');
const html = `<!doctype html><html><body style="margin:0">
<embed src="${pdfUrl}#page=1" type="application/pdf" width="1200" height="1700" id="pdf"/>
</body></html>`;
fs.writeFileSync('__pdf_wrapper.html', html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1250, height: 1750 } });
const wrapperUrl = 'file:///' + path.resolve('__pdf_wrapper.html').split(path.sep).join('/');
await page.goto(wrapperUrl);
await page.waitForTimeout(3000);
await page.screenshot({ path: '__pdf_p0.png' });
await browser.close();
