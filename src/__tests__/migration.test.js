import { describe, it, expect } from 'vitest';
import { _migrationMaps } from '../utils/storage.js';

const {
  QUEST_STATUS_MAP, SKILL_CAT_MAP, ITEM_TYPE_MAP,
  LOC_TYPE_MAP, FACTION_RANK_MAP,
  SPELL_LEVEL_MAP, SPELL_SCHOOL_MAP,
} = _migrationMaps;

describe('Migration maps — Polish → enum', () => {
  it('maps all quest statuses', () => {
    expect(QUEST_STATUS_MAP['Aktywne']).toBe('active');
    expect(QUEST_STATUS_MAP['Ukończone']).toBe('completed');
    expect(QUEST_STATUS_MAP['Nieudane']).toBe('failed');
  });

  it('maps all skill categories', () => {
    expect(SKILL_CAT_MAP['Umiejętność']).toBe('skill');
    expect(SKILL_CAT_MAP['Cecha rasowa']).toBe('racial_feature');
    expect(SKILL_CAT_MAP['Atut']).toBe('feat');
  });

  it('maps all item types', () => {
    expect(ITEM_TYPE_MAP['Ogólny']).toBe('general');
    expect(ITEM_TYPE_MAP['Broń']).toBe('weapon');
    expect(ITEM_TYPE_MAP['Pancerz']).toBe('armor');
    expect(ITEM_TYPE_MAP['Zwój z czarem']).toBe('spell_scroll');
    expect(ITEM_TYPE_MAP['Cudowny przedmiot']).toBe('wondrous');
    expect(ITEM_TYPE_MAP['Jednorazowy']).toBe('consumable');
    expect(ITEM_TYPE_MAP['Narzędzie']).toBe('tool');
    expect(ITEM_TYPE_MAP['Inny']).toBe('other');
  });

  it('maps all location types', () => {
    expect(LOC_TYPE_MAP['Osada']).toBe('settlement');
    expect(LOC_TYPE_MAP['Podziemia']).toBe('dungeon');
    expect(LOC_TYPE_MAP['Dzicz']).toBe('wilderness');
    expect(LOC_TYPE_MAP['Budynek']).toBe('building');
    expect(LOC_TYPE_MAP['Ruiny']).toBe('ruins');
    expect(LOC_TYPE_MAP['Punkt Orientacyjny']).toBe('landmark');
    expect(LOC_TYPE_MAP['Inne']).toBe('other');
  });

  it('maps all faction ranks', () => {
    expect(FACTION_RANK_MAP['Nieznany']).toBe('unknown');
    expect(FACTION_RANK_MAP['Sojusznik']).toBe('ally');
    expect(FACTION_RANK_MAP['Neutralny']).toBe('neutral');
    expect(FACTION_RANK_MAP['Wróg']).toBe('enemy');
    expect(FACTION_RANK_MAP['Członek']).toBe('member');
    expect(FACTION_RANK_MAP['Oficer']).toBe('officer');
    expect(FACTION_RANK_MAP['Przywódca']).toBe('leader');
  });

  it('maps all spell levels', () => {
    expect(SPELL_LEVEL_MAP['Sztuczka']).toBe('cantrip');
    expect(SPELL_LEVEL_MAP['1. poziom']).toBe('level1');
    expect(SPELL_LEVEL_MAP['9. poziom']).toBe('level9');
  });

  it('maps all spell schools', () => {
    expect(SPELL_SCHOOL_MAP['Odrzucanie']).toBe('abjuration');
    expect(SPELL_SCHOOL_MAP['Przywoływanie']).toBe('conjuration');
    expect(SPELL_SCHOOL_MAP['Nekromancja']).toBe('necromancy');
    expect(SPELL_SCHOOL_MAP['Inna']).toBe('other');
  });

  it('unknown values pass through unchanged (idempotent)', () => {
    // Already-migrated values should not be re-mapped
    expect(QUEST_STATUS_MAP['active']).toBeUndefined();
    expect(ITEM_TYPE_MAP['weapon']).toBeUndefined();
    expect(SPELL_LEVEL_MAP['cantrip']).toBeUndefined();
  });
});
