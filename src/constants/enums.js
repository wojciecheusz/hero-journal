/**
 * Language-neutral enum constants used as stored data values.
 * Display labels live exclusively in src/i18n/translations.js (LABELS section).
 * Never use human-readable strings as data keys — use these exports instead.
 */

export const QUEST_STATUS = {
  ACTIVE:    "active",
  COMPLETED: "completed",
  FAILED:    "failed",
};

/** Cycle: active → completed → failed → active */
export const STATUS_CYCLE = {
  active:    "completed",
  completed: "failed",
  failed:    "active",
};

export const SKILL_CAT = {
  SKILL:   "skill",
  RACIAL:  "racial_feature",
  FEAT:    "feat",
};

export const ITEM_TYPE = {
  GENERAL:  "general",
  WEAPON:   "weapon",
  ARMOR:    "armor",
  SHIELD:   "shield",
  SCROLL:   "spell_scroll",
  WONDROUS: "wondrous",
  CONSUMABLE:"consumable",
  TOOL:     "tool",
  OTHER:    "other",
};

export const LOC_TYPE = {
  SETTLEMENT: "settlement",
  DUNGEON:    "dungeon",
  WILDERNESS: "wilderness",
  BUILDING:   "building",
  RUINS:      "ruins",
  LANDMARK:   "landmark",
  OTHER:      "other",
};

export const FACTION_TYPE = {
  GUILD:      "guild",
  ORDER:      "order",
  CULT:       "cult",
  GOVERNMENT: "government",
  MILITARY:   "military",
  CRIMINALS:  "criminals",
  MERCHANTS:  "merchants",
  RELIGIOUS:  "religious",
  POLITICAL:  "political",
  OTHER:      "other",
};

export const FACTION_RANK = {
  UNKNOWN: "unknown",
  ALLY:    "ally",
  NEUTRAL: "neutral",
  ENEMY:   "enemy",
  MEMBER:  "member",
  OFFICER: "officer",
  LEADER:  "leader",
};

export const SPELL_LEVEL = {
  CANTRIP: "cantrip",
  L1: "level1", L2: "level2", L3: "level3",
  L4: "level4", L5: "level5", L6: "level6",
  L7: "level7", L8: "level8", L9: "level9",
};

export const SPELL_SCHOOL = {
  ABJURATION:    "abjuration",
  CONJURATION:   "conjuration",
  DIVINATION:    "divination",
  ENCHANTMENT:   "enchantment",
  EVOCATION:     "evocation",
  ILLUSION:      "illusion",
  NECROMANCY:    "necromancy",
  TRANSMUTATION: "transmutation",
  OTHER:         "other",
};

export const DAMAGE_TYPE = {
  SLASHING:    "slashing",
  PIERCING:    "piercing",
  BLUDGEONING: "bludgeoning",
  ACID:        "acid",
  COLD:        "cold",
  FIRE:        "fire",
  FORCE:       "force",
  LIGHTNING:   "lightning",
  NECROTIC:    "necrotic",
  POISON:      "poison",
  PSYCHIC:     "psychic",
  RADIANT:     "radiant",
  THUNDER:     "thunder",
};

/* Ordered arrays used for UI rendering and index-based label lookup */
export const SKILL_CATS_ENUM   = [SKILL_CAT.SKILL, SKILL_CAT.RACIAL, SKILL_CAT.FEAT];
export const ITEM_TYPES_ENUM   = [ITEM_TYPE.GENERAL, ITEM_TYPE.WEAPON, ITEM_TYPE.ARMOR, ITEM_TYPE.SHIELD, ITEM_TYPE.SCROLL, ITEM_TYPE.WONDROUS, ITEM_TYPE.CONSUMABLE, ITEM_TYPE.TOOL, ITEM_TYPE.OTHER];
export const LOC_TYPES_ENUM    = [LOC_TYPE.SETTLEMENT, LOC_TYPE.DUNGEON, LOC_TYPE.WILDERNESS, LOC_TYPE.BUILDING, LOC_TYPE.RUINS, LOC_TYPE.LANDMARK, LOC_TYPE.OTHER];
export const FACTION_TYPES_ENUM= [FACTION_TYPE.GUILD, FACTION_TYPE.ORDER, FACTION_TYPE.CULT, FACTION_TYPE.GOVERNMENT, FACTION_TYPE.MILITARY, FACTION_TYPE.CRIMINALS, FACTION_TYPE.MERCHANTS, FACTION_TYPE.RELIGIOUS, FACTION_TYPE.POLITICAL, FACTION_TYPE.OTHER];
export const FACTION_RANKS_ENUM= [FACTION_RANK.UNKNOWN, FACTION_RANK.ALLY, FACTION_RANK.NEUTRAL, FACTION_RANK.ENEMY, FACTION_RANK.MEMBER, FACTION_RANK.OFFICER, FACTION_RANK.LEADER];
export const SPELL_LEVELS_ENUM = [SPELL_LEVEL.CANTRIP, SPELL_LEVEL.L1, SPELL_LEVEL.L2, SPELL_LEVEL.L3, SPELL_LEVEL.L4, SPELL_LEVEL.L5, SPELL_LEVEL.L6, SPELL_LEVEL.L7, SPELL_LEVEL.L8, SPELL_LEVEL.L9];
export const SPELL_SCHOOLS_ENUM= [SPELL_SCHOOL.ABJURATION, SPELL_SCHOOL.CONJURATION, SPELL_SCHOOL.DIVINATION, SPELL_SCHOOL.ENCHANTMENT, SPELL_SCHOOL.EVOCATION, SPELL_SCHOOL.ILLUSION, SPELL_SCHOOL.NECROMANCY, SPELL_SCHOOL.TRANSMUTATION, SPELL_SCHOOL.OTHER];
export const DAMAGE_TYPES_ENUM = [DAMAGE_TYPE.SLASHING, DAMAGE_TYPE.PIERCING, DAMAGE_TYPE.BLUDGEONING, DAMAGE_TYPE.ACID, DAMAGE_TYPE.COLD, DAMAGE_TYPE.FIRE, DAMAGE_TYPE.FORCE, DAMAGE_TYPE.LIGHTNING, DAMAGE_TYPE.NECROTIC, DAMAGE_TYPE.POISON, DAMAGE_TYPE.PSYCHIC, DAMAGE_TYPE.RADIANT, DAMAGE_TYPE.THUNDER];
export const QUEST_STATUSES    = [QUEST_STATUS.ACTIVE, QUEST_STATUS.COMPLETED, QUEST_STATUS.FAILED];
