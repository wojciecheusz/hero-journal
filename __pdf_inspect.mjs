import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'fs';

const bytes = readFileSync('public/templates/karta-postaci-template.pdf');
const pdfDoc = await PDFDocument.load(bytes);
const form = pdfDoc.getForm();
const fields = form.getFields();
console.log('TOTAL FIELDS:', fields.length);
for (const f of fields) {
  console.log(f.constructor.name.padEnd(20), '|', f.getName());
}
