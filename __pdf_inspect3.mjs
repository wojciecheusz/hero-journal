import { PDFDocument, PDFName, PDFString, PDFHexString } from 'pdf-lib';
import fs from 'fs';

const bytes = fs.readFileSync('public/templates/karta-postaci-template.pdf');
const doc = await PDFDocument.load(bytes);
const form = doc.getForm();
const fields = form.getFields();

const decode = (v) => {
  if (!v) return '';
  if (v instanceof PDFString || v instanceof PDFHexString) return v.decodeText();
  return String(v);
};

for (const f of fields) {
  const name = f.getName();
  if (!/^(K|W|kropka|czar)/.test(name)) continue;
  const dict = f.acroField.dict;
  const tu = dict.get(PDFName.of('TU'));
  const tm = dict.get(PDFName.of('TM'));
  console.log(name, '| TU=', decode(tu), '| TM=', decode(tm));
}
