/* ── Cloud save callback — encapsulated w closure (nie module global) ── */
const _hooks = {
  cloudSave: null,
  quotaExceeded: null,
};

export const setCloudSaveHook      = fn  => { _hooks.cloudSave = fn; };
export const clearCloudSaveHook    = ()  => { _hooks.cloudSave = null; };
export const setQuotaExceededHook  = fn  => { _hooks.quotaExceeded = fn; };

export const CHAR_SLOTS = ["char","inventory","npcs","locations","skills","spells","sessions","quests","factions"];

export const load = (key, fb) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fb; }
  catch { return fb; }
};

export const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    localStorage.setItem(`hj_ts_${key}`, String(Date.now()));
  } catch (e) {
    if (e?.name === 'QuotaExceededError' || e?.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      _hooks.quotaExceeded?.();
    }
    return;
  }
  _hooks.cloudSave?.(key, val);
};

export const remove = (key) => {
  try { localStorage.removeItem(key); } catch {}
};

const charKey              = (slot, id) => `hj_${slot}_${id}`;
export const loadChar       = (slot, id, fb) => load(charKey(slot, id), fb);
export const saveChar       = (slot, id, val) => save(charKey(slot, id), val);
export const deleteCharData = id => CHAR_SLOTS.forEach(s => localStorage.removeItem(`hj_${s}_${id}`));

export const loadProfiles  = () => load("hj_profiles", []);
export const saveProfiles  = p  => save("hj_profiles", p);
export const loadActiveId  = () => load("hj_active_profile", null);
export const saveActiveId  = id => save("hj_active_profile", id);

const PROTECTED_KEYS = new Set([
  "hj_profiles",
  "hj_active_profile",
  "hj_tutorial_seen",
  "hj_enum_migration_v1",
  "hj_lang",
]);

export function pruneOrphanedData() {
  try {
    const knownIds = new Set(loadProfiles().map(p => p.id));
    const slotSet = new Set(CHAR_SLOTS);
    let removed = 0;
    let kept = 0;
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      allKeys.push(localStorage.key(i));
    }
    for (const key of allKeys) {
      if (!key.startsWith("hj_")) continue;
      if (PROTECTED_KEYS.has(key)) { kept++; continue; }
      const withoutPrefix = key.slice(3);
      const underscoreIdx = withoutPrefix.indexOf("_");
      if (underscoreIdx === -1) { kept++; continue; }
      const slot      = withoutPrefix.slice(0, underscoreIdx);
      const profileId = withoutPrefix.slice(underscoreIdx + 1);
      if (slotSet.has(slot) && !knownIds.has(profileId)) {
        localStorage.removeItem(key);
        removed++;
      } else {
        kept++;
      }
    }
    if (removed > 0) {
      console.info(`[HeroJournal] pruneOrphanedData: usunięto ${removed} kluczy, zachowano ${kept}`);
    }
    return { removed, kept };
  } catch (e) {
    console.warn("[HeroJournal] pruneOrphanedData: błąd", e);
    return { removed: 0, kept: 0 };
  }
}

export function validateCharData(data, defaults) {
  if (!data || typeof data !== 'object') return { ...defaults };
  const safe = { ...defaults, ...data };
  const ensureObj  = (key, def) => {
    safe[key] = (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key]))
      ? { ...def, ...data[key] } : { ...def };
  };
  const ensureArr  = (key, def) => {
    safe[key] = Array.isArray(data[key]) ? data[key] : def;
  };
  const ensureNum  = (key, def) => {
    safe[key] = (typeof data[key] === 'number' && !isNaN(data[key])) ? data[key] : def;
  };
  ensureObj('stats',        defaults.stats);
  ensureObj('hp',           defaults.hp);
  ensureObj('coins',        defaults.coins);
  ensureObj('traits',       defaults.traits);
  ensureObj('appearance',   defaults.appearance);
  ensureObj('proficiencies',defaults.proficiencies);
  ensureObj('deathSaves',   defaults.deathSaves);
  ensureObj('conditions',   defaults.conditions);
  ensureArr('classes',      defaults.classes);
  ensureObj('spellSlots',   defaults.spellSlots);
  ensureNum('xp',           defaults.xp ?? 0);
  ensureNum('ac',           defaults.ac ?? 10);
  ensureNum('speed',        defaults.speed ?? 30);
  ensureNum('profBonus',    defaults.profBonus ?? 2);
  if (!safe.classes || safe.classes.length === 0) {
    safe.classes = defaults.classes;
  }
  return safe;
}

export function validateArray(data, defaultVal = []) {
  return Array.isArray(data) ? data : defaultVal;
}

export function exportProfileData(id, profileMeta) {
  const slots = {};
  CHAR_SLOTS.forEach(slot => {
    const val = loadChar(slot, id, null);
    if (val !== null) slots[slot] = val;
  });
  return JSON.stringify({
    hj_export_version: 1,
    exported_at: new Date().toISOString(),
    profile: profileMeta,
    slots,
  }, null, 2);
}

export function importProfileData(json) {
  const data = JSON.parse(json);
  if (!data || data.hj_export_version !== 1 || !data.profile || typeof data.slots !== 'object') {
    throw new Error('invalid_format');
  }
  const newId = 'profile_' + Date.now();
  CHAR_SLOTS.forEach(slot => {
    if (slot in data.slots) saveChar(slot, newId, data.slots[slot]);
  });
  return { ...data.profile, id: newId, created: Date.now() };
}

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

const MIGRATION_KEY = "hj_enum_migration_v1";

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

function mm(val, map) { return map[val] ?? val; }

function migrateQuests(q = [])    { return q.map(x => ({ ...x, status: mm(x.status, QUEST_STATUS_MAP) })); }
function migrateSkills(s = [])    { return s.map(x => ({ ...x, category: mm(x.category, SKILL_CAT_MAP) })); }
function migrateInventory(inv=[]) { return inv.map(x => ({ ...x, type: mm(x.type, ITEM_TYPE_MAP) })); }
function migrateLocations(l=[])   { return l.map(x => ({ ...x, type: mm(x.type, LOC_TYPE_MAP) })); }
function migrateFactions(f=[])    { return f.map(x => ({ ...x, type: mm(x.type, FACTION_TYPE_MAP), rank: mm(x.rank, FACTION_RANK_MAP) })); }
function migrateSpells(s=[])      { return s.map(x => ({ ...x, level: mm(x.level, SPELL_LEVEL_MAP), school: mm(x.school, SPELL_SCHOOL_MAP) })); }
function migrateSpellSlots(slots={}) {
  const r = {};
  for (const [k,v] of Object.entries(slots || {})) r[mm(k, SPELL_LEVEL_MAP)] = v;
  return r;
}
function migrateChar(char={}) {
  if (!char) return char;
  return { ...char, spellSlots: migrateSpellSlots(char.spellSlots) };
}

export function migrateToEnums() {
  if (localStorage.getItem(MIGRATION_KEY)) return;
  loadProfiles().forEach(({ id }) => {
    const c = loadChar("char",      id, null);
    const i = loadChar("inventory", id, null);
    const s = loadChar("skills",    id, null);
    const sp= loadChar("spells",    id, null);
    const l = loadChar("locations", id, null);
    const f = loadChar("factions",  id, null);
    const q = loadChar("quests",    id, null);
    if (c)  saveChar("char",      id, migrateChar(c));
    if (i)  saveChar("inventory", id, migrateInventory(i));
    if (s)  saveChar("skills",    id, migrateSkills(s));
    if (sp) saveChar("spells",    id, migrateSpells(sp));
    if (l)  saveChar("locations", id, migrateLocations(l));
    if (f)  saveChar("factions",  id, migrateFactions(f));
    if (q)  saveChar("quests",    id, migrateQuests(q));
  });
  localStorage.setItem(MIGRATION_KEY, "1");
}

export const _migrationMaps = {
  QUEST_STATUS_MAP, SKILL_CAT_MAP, ITEM_TYPE_MAP,
  LOC_TYPE_MAP, FACTION_TYPE_MAP, FACTION_RANK_MAP,
  SPELL_LEVEL_MAP, SPELL_SCHOOL_MAP,
};
