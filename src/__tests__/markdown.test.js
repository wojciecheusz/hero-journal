import { describe, it, expect } from 'vitest';
import { parseMarkdown, parseInline, plainText, restoreFlattened } from '../utils/markdown.js';

describe('parseInline()', () => {
  it('handles bold, italic and both', () => {
    expect(parseInline('a **b** *c* ***d***')).toEqual([
      { t: 'a ' }, { t: 'b', b: true }, { t: ' ' }, { t: 'c', i: true }, { t: ' ' }, { t: 'd', b: true, i: true },
    ]);
  });
  it('drops orphaned double asterisks', () => {
    expect(parseInline('tekst** dalej').map(p => p.t).join('')).toBe('tekst dalej');
  });
});

describe('parseMarkdown()', () => {
  it('builds headings, lists, quotes and rules', () => {
    const blocks = parseMarkdown('## Działanie\nTekst\n\n- jeden\n- dwa\n\n> cytat\n---');
    expect(blocks.map(b => b.type)).toEqual(['h', 'p', 'list', 'quote', 'hr']);
    expect(blocks[0].level).toBe(2);
    expect(blocks[2].items).toHaveLength(2);
  });
  it('keeps plain text as a paragraph', () => {
    expect(parseMarkdown('Zwykły opis.')).toEqual([{ type: 'p', lines: [[{ t: 'Zwykły opis.' }]] }]);
  });
});

describe('restoreFlattened()', () => {
  it('restores block breaks in imported notes without newlines', () => {
    const flat = '(Źródło)*  ## ⚙️ Działanie  **Wypicie** — przez 1 godzinę  ---  ## 💀 Cena  Tekst> Przy odpoczynku';
    const types = parseMarkdown(flat).map(b => b.type);
    expect(types).toContain('h');
    expect(types).toContain('hr');
    expect(types).toContain('quote');
    expect(restoreFlattened(flat)).toContain('\n## 💀 Cena');
    const cena = parseMarkdown(flat).find(b => b.type === 'h' && b.content.some(p => p.t.includes('Cena')));
    expect(cena.content.map(p => p.t).join('')).toBe('💀 Cena');
  });
  it('leaves text that already has newlines untouched', () => {
    expect(restoreFlattened('a  ## b\nc')).toBe('a  ## b\nc');
  });
});

describe('plainText()', () => {
  it('strips markup for previews', () => {
    expect(plainText('## Tytuł\n**Pogrubione** i *kursywa*')).toBe('Tytuł — Pogrubione i kursywa');
  });
});
