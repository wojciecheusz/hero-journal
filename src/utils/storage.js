export let _cloudSaveHook = null;
export const setCloudSaveHook = fn => { _cloudSaveHook = fn; };

export const CHAR_SLOTS = ["char","inventory","npcs","locations","skills","spells","sessions","quests","factions"];

export const load    = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
export const save    = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} _cloudSaveHook?.(key, val); };

const charKey              = (slot, id) => `hj_${slot}_${id}`;
export const loadChar       = (slot, id, fb) => load(charKey(slot, id), fb);
export const saveChar       = (slot, id, val) => save(charKey(slot, id), val);
export const deleteCharData = id => CHAR_SLOTS.forEach(s => localStorage.removeItem(`hj_${s}_${id}`));

export const loadProfiles  = () => load("hj_profiles", []);
export const saveProfiles  = p  => save("hj_profiles", p);
export const loadActiveId  = () => load("hj_active_profile", null);
export const saveActiveId  = id => save("hj_active_profile", id);

export const migrateLegacy = () => {
  if (loadProfiles().length > 0) return;
  const legacyChar = load("hj_char", null);
  if (!legacyChar) return;
  const id = "profile_" + Date.now();
  CHAR_SLOTS.forEach(slot => {
    const val = load("hj_" + slot, null);
    if (val !== null) saveChar(slot, id, val);
  });
  saveProfiles([{
    id,
    name:    legacyChar.name?.trim() || "Mój Bohater",
    class:   (legacyChar.classes || [{name:""}])[0]?.name || "",
    level:   (legacyChar.classes || [{level:1}])[0]?.level || 1,
    created: Date.now(),
  }]);
  saveActiveId(id);
};

/* ── Migracja danych do language-neutral enumów (uruchamiana raz per profil) ── */

const MIGRATION_KEY = "hj_enum_migration_v1";

/** Mapy z polskich wartości na enums */
const QUEST_STATUS_MAP = {
  "Aktywne":"active", "Ukończone":"completed", "Nieudane":"failed",
};
const SKILL_CAT_MAP = {
  "Umiejętność":"skill", "Cecha rasowa":"racial_feature", "Atut":"feat",
};
const ITEM_TYPE_MAP = {
  "Ogólny":"general", "Broń":"weapon", "Pancerz":"armor",
  "Zwój z czarem":"spell_scroll", "Cudowny przedmiot":"wondrous",
  "Jednorazowy":"consumable", "Narzędzie":"tool", "Inny":"other",
};
const LOC_TYPE_MAP = {
  "Osada":"settlement", "Podziemia":"dungeon", "Dzicz":"wilderness",
  "Budynek":"building", "Ruiny":"ruins", "Punkt Orientacyjny":"landmark", "Inne":"other",
};
const FACTION_TYPE_MAP = {
  "Gildia":"guild", "Zakon":"order", "Kult":"cult", "Rząd":"government",
  "Armia":"military", "Przestępcy":"criminals", "Kupcy":"merchants",
  "Religijna":"religious", "Polityczna":"political", "Inna":"other",
};
const FACTION_RANK_MAP = {
  "Nieznany":"unknown", "Sojusznik":"ally", "Neutralny":"neutral",
  "Wróg":"enemy", "Członek":"member", "Oficer":"officer", "Przywódca":"leader",
};
const SPELL_LEVEL_MAP = {
  "Sztuczka":"cantrip",
  "1. poziom":"level1", "2. poziom":"level2", "3. poziom":"level3",
  "4. poziom":"level4", "5. poziom":"level5", "6. poziom":"level6",
  "7. poziom":"level7", "8. poziom":"level8", "9. poziom":"level9",
};
const SPELL_SCHOOL_MAP = {
  "Odrzucanie":"abjuration", "Przywoływanie":"conjuration", "Wieszczenie":"divination",
  "Surogacja":"enchantment", "Wywoływanie":"evocation", "Iluzja":"illusion",
  "Nekromancja":"necromancy", "Przemiana":"transmutation", "Inna":"other",
};

function migrateMap(val, map) { return map[val] ?? val; }

function migrateQuests(quests = []) {
  return quests.map(q => ({
    ...q,
    status: migrateMap(q.status, QUEST_STATUS_MAP),
  }));
}

function migrateSkills(skills = []) {
  return skills.map(s => ({
    ...s,
    category: migrateMap(s.category, SKILL_CAT_MAP),
  }));
}

function migrateInventory(inv = []) {
  return inv.map(item => ({
    ...item,
    type: migrateMap(item.type, ITEM_TYPE_MAP),
  }));
}

function migrateLocations(locs = []) {
  return locs.map(l => ({
    ...l,
    type: migrateMap(l.type, LOC_TYPE_MAP),
  }));
}

function migrateFactions(factions = []) {
  return factions.map(f => ({
    ...f,
    type: migrateMap(f.type, FACTION_TYPE_MAP),
    rank: migrateMap(f.rank, FACTION_RANK_MAP),
  }));
}

function migrateSpells(spells = []) {
  return spells.map(sp => ({
    ...sp,
    level:  migrateMap(sp.level,  SPELL_LEVEL_MAP),
    school: migrateMap(sp.school, SPELL_SCHOOL_MAP),
  }));
}

function migrateSpellSlots(slots = {}) {
  const result = {};
  for (const [key, val] of Object.entries(slots)) {
    result[migrateMap(key, SPELL_LEVEL_MAP)] = val;
  }
  return result;
}

function migrateChar(char = {}) {
  if (!char) return char;
  return {
    ...char,
    spellSlots: migrateSpellSlots(char.spellSlots),
  };
}

/**
 * Idempotent migration: runs once per installation (tracked via localStorage flag).
 * Converts all stored Polish enum strings to language-neutral enum values.
 */
export function migrateToEnums() {
  if (localStorage.getItem(MIGRATION_KEY)) return;

  const profiles = loadProfiles();
  profiles.forEach(({ id }) => {
    const char      = loadChar("char",      id, null);
    const inventory = loadChar("inventory", id, null);
    const skills    = loadChar("skills",    id, null);
    const spells    = loadChar("spells",    id, null);
    const locations = loadChar("locations", id, null);
    const factions  = loadChar("factions",  id, null);
    const quests    = loadChar("quests",    id, null);

    if (char)      saveChar("char",      id, migrateChar(char));
    if (inventory) saveChar("inventory", id, migrateInventory(inventory));
    if (skills)    saveChar("skills",    id, migrateSkills(skills));
    if (spells)    saveChar("spells",    id, migrateSpells(spells));
    if (locations) saveChar("locations", id, migrateLocations(locations));
    if (factions)  saveChar("factions",  id, migrateFactions(factions));
    if (quests)    saveChar("quests",    id, migrateQuests(quests));
  });

  localStorage.setItem(MIGRATION_KEY, "1");
}

/* Eksport map do użycia w testach */
export const _migrationMaps = {
  QUEST_STATUS_MAP, SKILL_CAT_MAP, ITEM_TYPE_MAP,
  LOC_TYPE_MAP, FACTION_TYPE_MAP, FACTION_RANK_MAP,
  SPELL_LEVEL_MAP, SPELL_SCHOOL_MAP,
};
