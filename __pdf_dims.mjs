import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
const bytes = fs.readFileSync('public/templates/karta-postaci-template.pdf');
const doc = await PDFDocument.load(bytes);
doc.getPages().forEach((p,i) => console.log(i, p.getWidth(), p.getHeight()));
