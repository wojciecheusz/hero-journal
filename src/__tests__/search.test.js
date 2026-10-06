import { describe, it, expect } from 'vitest';
import { matchesSearch, normalize } from '../utils/search.js';

describe('normalize()', () => {
  it('ignores case and Polish diacritics', () => {
    expect(normalize('Łódź Zbroję')).toBe('lodz zbroje');
  });
});

describe('matchesSearch()', () => {
  const fields = ['Ćwiekowana Skórzana zbroja', 'AC 12', 'pasywna'];
  it('matches everything for an empty query', () => {
    expect(matchesSearch('', fields)).toBe(true);
    expect(matchesSearch('   ', fields)).toBe(true);
  });
  it('matches without diacritics and across fields', () => {
    expect(matchesSearch('cwiekowana', fields)).toBe(true);
    expect(matchesSearch('skorzana ac', fields)).toBe(true);
  });
  it('requires every word to match', () => {
    expect(matchesSearch('zbroja miecz', fields)).toBe(false);
  });
  it('skips empty fields safely', () => {
    expect(matchesSearch('ac', [null, undefined, 'AC 12'])).toBe(true);
  });
});
