import { describe, it, expect } from 'vitest';
import {
  STATUS_CYCLE, QUEST_STATUSES,
  SKILL_CATS_ENUM, ITEM_TYPES_ENUM,
  FACTION_RANKS_ENUM,
  SPELL_LEVELS_ENUM, SPELL_SCHOOLS_ENUM,
  QUEST_STATUS, SKILL_CAT, ITEM_TYPE, LOC_TYPE,
  FACTION_TYPE, FACTION_RANK, SPELL_LEVEL, SPELL_SCHOOL,
} from '../constants/enums.js';

describe('STATUS_CYCLE', () => {
  it('cycles active → completed → failed → active', () => {
    expect(STATUS_CYCLE[QUEST_STATUS.ACTIVE]).toBe(QUEST_STATUS.COMPLETED);
    expect(STATUS_CYCLE[QUEST_STATUS.COMPLETED]).toBe(QUEST_STATUS.FAILED);
    expect(STATUS_CYCLE[QUEST_STATUS.FAILED]).toBe(QUEST_STATUS.ACTIVE);
  });

  it('covers all quest statuses', () => {
    QUEST_STATUSES.forEach(s => {
      expect(STATUS_CYCLE[s]).toBeDefined();
      expect(QUEST_STATUSES).toContain(STATUS_CYCLE[s]);
    });
  });
});

describe('Enum arrays are ordered and complete', () => {
  it('SKILL_CATS_ENUM contains all 3 categories', () => {
    expect(SKILL_CATS_ENUM).toHaveLength(3);
    expect(SKILL_CATS_ENUM).toContain(SKILL_CAT.SKILL);
    expect(SKILL_CATS_ENUM).toContain(SKILL_CAT.RACIAL);
    expect(SKILL_CATS_ENUM).toContain(SKILL_CAT.FEAT);
  });

  it('ITEM_TYPES_ENUM contains all 8 types', () => {
    expect(ITEM_TYPES_ENUM).toHaveLength(8);
    expect(ITEM_TYPES_ENUM).toContain(ITEM_TYPE.WEAPON);
    expect(ITEM_TYPES_ENUM).toContain(ITEM_TYPE.ARMOR);
    expect(ITEM_TYPES_ENUM).toContain(ITEM_TYPE.SCROLL);
  });

  it('SPELL_LEVELS_ENUM has cantrip + 9 levels', () => {
    expect(SPELL_LEVELS_ENUM).toHaveLength(10);
    expect(SPELL_LEVELS_ENUM[0]).toBe(SPELL_LEVEL.CANTRIP);
    expect(SPELL_LEVELS_ENUM[1]).toBe(SPELL_LEVEL.L1);
    expect(SPELL_LEVELS_ENUM[9]).toBe(SPELL_LEVEL.L9);
  });

  it('SPELL_SCHOOLS_ENUM has 9 schools', () => {
    expect(SPELL_SCHOOLS_ENUM).toHaveLength(9);
    expect(SPELL_SCHOOLS_ENUM).toContain(SPELL_SCHOOL.ABJURATION);
    expect(SPELL_SCHOOLS_ENUM).toContain(SPELL_SCHOOL.NECROMANCY);
  });

  it('FACTION_RANKS_ENUM has 7 ranks', () => {
    expect(FACTION_RANKS_ENUM).toHaveLength(7);
    expect(FACTION_RANKS_ENUM[0]).toBe(FACTION_RANK.UNKNOWN);
    expect(FACTION_RANKS_ENUM[6]).toBe(FACTION_RANK.LEADER);
  });

  it('all enum values are non-empty strings', () => {
    const allEnums = [
      ...Object.values(QUEST_STATUS),
      ...Object.values(SKILL_CAT),
      ...Object.values(ITEM_TYPE),
      ...Object.values(LOC_TYPE),
      ...Object.values(FACTION_TYPE),
      ...Object.values(FACTION_RANK),
      ...Object.values(SPELL_LEVEL),
      ...Object.values(SPELL_SCHOOL),
    ];
    allEnums.forEach(v => {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    });
  });
});
