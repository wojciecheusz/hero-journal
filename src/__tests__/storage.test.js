import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateArray, validateCharData, pruneOrphanedData } from '../utils/storage.js';

const DEFAULTS = {
  name: "", race: "", classes: [{ name: "Adventurer", level: 1 }],
  stats: { STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10 },
  hp: { current:10, max:10, temp:0 },
  coins: { gold:0, silver:0, copper:0 },
  traits: { personality:"", ideals:"", bonds:"", flaws:"" },
  appearance: { age:"", height:"", weight:"", eyes:"", skin:"", hair:"" },
  proficiencies: { weapons:"", armor:"", languages:"", tools:"" },
  deathSaves: { successes:0, failures:0 },
  conditions: {},
  spellSlots: {},
  xp: 0, ac: 10, speed: 30, profBonus: 2,
};

describe('validateArray()', () => {
  it('returns the array unchanged when valid', () => {
    expect(validateArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(validateArray([])).toEqual([]);
  });

  it('returns default when input is not an array', () => {
    expect(validateArray(null)).toEqual([]);
    expect(validateArray(undefined)).toEqual([]);
    expect(validateArray("string")).toEqual([]);
    expect(validateArray(42)).toEqual([]);
    expect(validateArray({})).toEqual([]);
  });

  it('uses provided default value', () => {
    expect(validateArray(null, [0])).toEqual([0]);
    expect(validateArray(undefined, ["x"])).toEqual(["x"]);
  });
});

describe('validateCharData()', () => {
  it('returns defaults when data is null', () => {
    const result = validateCharData(null, DEFAULTS);
    expect(result.stats).toEqual(DEFAULTS.stats);
    expect(result.hp).toEqual(DEFAULTS.hp);
  });

  it('returns defaults when data is not an object', () => {
    expect(validateCharData("invalid", DEFAULTS).ac).toBe(10);
    expect(validateCharData(42, DEFAULTS).speed).toBe(30);
  });

  it('merges valid data with defaults', () => {
    const data = { name: "Aragorn", ac: 18, stats: { STR:16, DEX:14, CON:15, INT:12, WIS:13, CHA:11 } };
    const result = validateCharData(data, DEFAULTS);
    expect(result.name).toBe("Aragorn");
    expect(result.ac).toBe(18);
    expect(result.stats.STR).toBe(16);
  });

  it('normalizes legacy spellSlots array to object', () => {
    const data = { ...DEFAULTS, spellSlots: [] };
    const result = validateCharData(data, DEFAULTS);
    expect(result.spellSlots).toEqual({});
  });

  it('guarantees classes array is never empty', () => {
    const data = { ...DEFAULTS, classes: [] };
    const result = validateCharData(data, DEFAULTS);
    expect(result.classes.length).toBeGreaterThan(0);
  });

  it('falls back to default for non-numeric xp', () => {
    const data = { ...DEFAULTS, xp: "invalid" };
    const result = validateCharData(data, DEFAULTS);
    expect(