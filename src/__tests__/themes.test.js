import { describe, it, expect } from 'vitest';
import { THEMES, PALETTES, THEME_MIGRATION } from '../theme/themes.js';

/* Kontrast WCAG 2.x między dwoma kolorami #rrggbb */
const lum = h => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/* [kolor, tło, minimalny kontrast] — te same progi co w komentarzu themes.js */
const RULES = [
  ['text', 'bgCard', 7], ['text', 'bg', 7],
  ['textLabel', 'bgCard', 6],
  ['textMuted', 'bgCard', 4.8], ['textMuted', 'bg', 4.5],
  ['textDim', 'bgCard', 3.4],
  ['accent', 'bgCard', 4.6], ['accent', 'bg', 4.5],
  ['spellAccent', 'bgCard', 4.6],
  ['good', 'bgCard', 4.6], ['warn', 'bgCard', 4.6], ['bad', 'bgCard', 4.6],
  ['borderInput', 'bgCard', 2.3], ['border', 'bg', 1.7],
];

describe('motywy kolorystyczne — czytelność (P32)', () => {
  it('lista motywów zgadza się z definicjami', () => {
    expect(PALETTES.sort()).toEqual(Object.keys(THEMES).sort());
  });
  for (const name of Object.keys(THEMES)) {
    it(`${name}: wszystkie teksty i akcenty spełniają progi kontrastu`, () => {
      const t = THEMES[name];
      const failures = RULES
        .map(([fg, bg, min]) => [fg, bg, min, contrast(t[fg], t[bg])])
        .filter(([, , min, v]) => v < min)
        .map(([fg, bg, min, v]) => `${fg}/${bg} ${v.toFixed(2)} < ${min}`);
      expect(failures).toEqual([]);
    });
  }
  it('usunięte motywy mają zamiennik wśród istniejących', () => {
    for (const target of Object.values(THEME_MIGRATION)) expect(PALETTES).toContain(target);
  });
});
