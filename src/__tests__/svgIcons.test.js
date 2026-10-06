import { describe, it, expect } from 'vitest';
import { parseSvg, SVG_ICONS } from '../shared/svgIcons.js';

describe('parseSvg()', () => {
  it('reads viewBox and path data, ignoring colors', () => {
    const r = parseSvg('<svg viewBox="0 0 512 512"><path fill="#f00" d="M0 0h10v10z"/></svg>');
    expect(r.viewBox).toBe('0 0 512 512');
    expect(r.shapes).toEqual([{ tag: 'path', props: { d: 'M0 0h10v10z' }, outline: false }]);
  });
  it('keeps basic shapes and marks unfilled ones as outlines', () => {
    const r = parseSvg('<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke-width="2"/><rect x="1" y="1" width="4" height="4"/></svg>');
    expect(r.shapes.map(s => s.tag)).toEqual(['circle', 'rect']);
    expect(r.shapes[0].outline).toBe(true);
    expect(r.shapes[0].props.strokeWidth).toBe('2');
  });
  it('drops anything that is not a basic shape (no script injection)', () => {
    const r = parseSvg('<svg viewBox="0 0 1 1"><script>alert(1)</script><path d="M0 0" onclick="x()"/></svg>');
    expect(r.shapes).toEqual([{ tag: 'path', props: { d: 'M0 0' }, outline: false }]);
  });
});

describe('icon folder', () => {
  it('loads every Game Icons file referenced by the app', () => {
    for (const name of ['backpack', 'sword', 'quest', 'unknown', 'faction-guild', 'cond-blinded', 'stat-str', 'dmg-fire']) {
      expect(SVG_ICONS[name]?.shapes.length, name).toBeGreaterThan(0);
    }
  });
});
