import { describe, it, expect } from 'vitest';
import { statMod } from '../utils/math.js';

describe('statMod()', () => {
  it('returns +0 for score 10', () => {
    expect(statMod(10)).toBe('+0');
  });

  it('returns +0 for score 11', () => {
    expect(statMod(11)).toBe('+0');
  });

  it('returns positive modifier with + prefix', () => {
    expect(statMod(12)).toBe('+1');
    expect(statMod(14)).toBe('+2');
    expect(statMod(18)).toBe('+4');
    expect(statMod(20)).toBe('+5');
    expect(statMod(30)).toBe('+10');
  });

  it('returns negative modifier without + prefix', () => {
    expect(statMod(9)).toBe('-1');
    expect(statMod(8)).toBe('-1');
    expect(statMod(6)).toBe('-2');
    expect(statMod(1)).toBe('-5');
  });
});
