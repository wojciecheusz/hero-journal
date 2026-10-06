import { describe, it, expect } from 'vitest';
import {
  totalLevelOf, profBonusForLevel, hitDieAverage, xpProgress,
  applyDamage, applyHeal, applyTempHp, levelUp,
} from '../utils/character.js';

describe('totalLevelOf()', () => {
  it('sums multiclass levels and clamps to 1–20', () => {
    expect(totalLevelOf({ classes: [{ level: 6 }] })).toBe(6);
    expect(totalLevelOf({ classes: [{ level: 3 }, { level: 2 }] })).toBe(5);
    expect(totalLevelOf({ classes: [] })).toBe(1);
    expect(totalLevelOf({ classes: [{ level: 15 }, { level: 9 }] })).toBe(20);
  });
});

describe('profBonusForLevel()', () => {
  it('follows the 5e table', () => {
    expect([1, 4, 5, 8, 9, 12, 13, 16, 17, 20].map(profBonusForLevel))
      .toEqual([2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  });
});

describe('hitDieAverage()', () => {
  it('is half the die plus one', () => {
    expect(hitDieAverage('d6')).toBe(4);
    expect(hitDieAverage('d8')).toBe(5);
    expect(hitDieAverage('d12')).toBe(7);
  });
});

describe('xpProgress()', () => {
  it('reports level-up availability without changing the level (level comes from classes)', () => {
    const p = xpProgress({ classes: [{ level: 6 }], xp: 23000 });
    expect(p.level).toBe(6);
    expect(p.xpNext).toBe(23000);
    expect(p.canLevelUp).toBe(true);
  });
  it('measures progress within the current level', () => {
    const p = xpProgress({ classes: [{ level: 7 }], xp: 28500 });
    expect(p.xpFloor).toBe(23000);
    expect(p.xpNext).toBe(34000);
    expect(p.pct).toBe(50);
    expect(p.canLevelUp).toBe(false);
  });
  it('caps at level 20', () => {
    const p = xpProgress({ classes: [{ level: 20 }], xp: 400000 });
    expect(p.xpNext).toBe(null);
    expect(p.canLevelUp).toBe(false);
  });
});

describe('HP helpers', () => {
  it('damage removes temporary HP first', () => {
    expect(applyDamage({ current: 40, max: 45, temp: 5 }, 8)).toEqual({ current: 37, max: 45, temp: 0 });
    expect(applyDamage({ current: 3, max: 45, temp: 0 }, 10)).toEqual({ current: 0, max: 45, temp: 0 });
  });
  it('healing does not exceed max', () => {
    expect(applyHeal({ current: 40, max: 45, temp: 0 }, 10).current).toBe(45);
  });
  it('temporary HP does not stack — the higher value stays', () => {
    expect(applyTempHp({ current: 1, max: 1, temp: 8 }, 5).temp).toBe(8);
    expect(applyTempHp({ current: 1, max: 1, temp: 3 }, 5).temp).toBe(5);
  });
});

describe('levelUp()', () => {
  const base = {
    classes: [{ name: 'Rogue', level: 6 }],
    hp: { current: 40, max: 45, temp: 0 },
    hitDice: { type: 'd8', max: 5, used: 2 },
    profBonus: 3,
  };
  it('raises the class level, HP, hit dice and proficiency bonus', () => {
    const c = levelUp(base, { classIndex: 0, hpGain: 7 });
    expect(c.classes[0].level).toBe(7);
    expect(c.hp).toEqual({ current: 47, max: 52, temp: 0 });
    expect(c.hitDice).toEqual({ type: 'd8', max: 7, used: 2 });
    expect(c.profBonus).toBe(3);
  });
  it('levels the chosen class in a multiclass build', () => {
    const c = levelUp({ ...base, classes: [{ name: 'Rogue', level: 3 }, { name: 'Wizard', level: 4 }] }, { classIndex: 1, hpGain: 0 });
    expect(c.classes.map(x => x.level)).toEqual([3, 5]);
    expect(c.profBonus).toBe(3); // łącznie poziom 8 → +3
    const c9 = levelUp(c, { classIndex: 0 });
    expect(c9.profBonus).toBe(4); // poziom 9 → +4
  });
  it('takes the new max HP typed by the player after a physical roll', () => {
    const c = levelUp(base, { newMaxHp: 51 });
    expect(c.hp).toEqual({ current: 46, max: 51, temp: 0 });
    expect(c.classes[0].level).toBe(7);
  });
  it('keeps current HP within the new maximum even if the typed max is lower', () => {
    const c = levelUp({ ...base, hp: { current: 45, max: 45, temp: 0 } }, { newMaxHp: 40 });
    expect(c.hp).toEqual({ current: 40, max: 40, temp: 0 });
  });
  it('ignores an empty or invalid typed max and falls back to the gain', () => {
    expect(levelUp(base, { newMaxHp: '', hpGain: 5 }).hp.max).toBe(50);
    expect(levelUp(base, { newMaxHp: 0, hpGain: 5 }).hp.max).toBe(50);
  });
  it('does nothing at level 20', () => {
    const c20 = { ...base, classes: [{ name: 'Rogue', level: 20 }] };
    expect(levelUp(c20, { hpGain: 5 })).toBe(c20);
  });
});
