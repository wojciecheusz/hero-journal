import { describe, it, expect } from 'vitest';
import { clamp, numMod } from '../utils/math.js';

describe('clamp()', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('clamps to minimum', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-100, 0, 10)).toBe(0);
  });

  it('clamps to maximum', () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(999, 0, 10)).toBe(10);
  });
});

describe('numMod()', () => {
  it('prefixes positive numbers with +', () => {
    expect(numMod(3)).toBe('+3');
    expect(numMod(0)).toBe('+0');
  });

  it('keeps negative sign', () => {
    expect(numMod(-2)).toBe('-2');
    expect(numMod(-10)).toBe('-10');
  });
});

describe('D&D ability modifier calculation', () => {
  const abilityMod = score => Math.floor((score - 10) / 2);

  it('calculates standard modifier values', () => {
    expect(abilityMod(10)).toBe(0);
    expect(abilityMod(12)).toBe(1);
    expect(abilityMod(14)).toBe(2);
    expect(abilityMod(18)).toBe(4);
    expect(abilityMod(20)).toBe(5);
    expect(abilityMod(8)).toBe(-1);
    expect(abilityMod(6)).toBe(-2);
    expect(abilityMod(1)).toBe(-5);
  });
});

describe('D&D proficiency bonus by total level', () => {
  const profBonus = level => Math.ceil(level / 4) + 1;

  it('returns +2 for levels 1-4', () => {
    [1, 2, 3, 4].forEach(l => expect(profBonus(l)).toBe(2));
  });

  it('returns +3 for levels 5-8', () => {
    [5, 6, 7, 8].forEach(l => expect(profBonus(l)).toBe(3));
  });

  it('returns +6 for level 20', () => {
    expect(profBonus(20)).toBe(6);
  });
});
