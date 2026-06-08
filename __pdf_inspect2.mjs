import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'fs';

const bytes = readFileSync('public/templates/karta-postaci-template.pdf');
const pdfDoc = await PDFDocument.load(bytes);
const form = pdfDoc.getForm();
const fields = form.getFields();
const pages = pdfDoc.getPages();

function pageIndexOfRef(ref) {
  for (let i=0;i<pages.length;i++) {
    if (pages[i].ref === ref) return i;
  }
  return -1;
}

const rows = [];
for (const f of fields) {
  const widgets = f.acroField.getWidgets();
  for (const w of widgets) {
    const rect = w.getRectangle();
    const pageRef = w.P();
    let pageIdx = -1;
    if (pageRef) pageIdx = pageIndexOfRef(pageRef);
    rows.push({ name: f.getName(), type: f.constructor.name.replace('PDF',''), page: pageIdx, x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) });
  }
}
// sort by page, then y desc (top to bottom), then x
rows.sort((a,b) => a.page - b.page || b.y - a.y || a.x - b.x);
for (const r of rows) {
  console.log(`p${r.page} y=${String(r.y).padStart(4)} x=${String(r.x).padStart(4)} w=${String(r.w).padStart(3)} h=${String(r.h).padStart(2)} | ${r.type.padEnd(9)} | ${r.name}`);
}
