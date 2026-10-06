import {
  SKILL_CATS_ENUM, ITEM_TYPES_ENUM, LOC_TYPES_ENUM,
  FACTION_TYPES_ENUM, FACTION_RANKS_ENUM,
  SPELL_LEVELS_ENUM, SPELL_SCHOOLS_ENUM, DAMAGE_TYPES_ENUM,
  FACTION_RANK, SKILL_CAT, SPELL_SCHOOL, LOC_TYPE,
} from './enums.js';

export { STATUS_CYCLE } from './enums.js';

export const today = () => new Date().toISOString().slice(0, 10);

export const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

export const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/* Ordered arrays — index matches TRANSLATIONS.LABELS arrays */
export const LOC_TYPES     = LOC_TYPES_ENUM;
export const FACTION_TYPES = FACTION_TYPES_ENUM;
export const FACTION_RANKS = FACTION_RANKS_ENUM;
export const ITEM_TYPES    = ITEM_TYPES_ENUM;
export const SKILL_CATS    = SKILL_CATS_ENUM;
export const SPELL_SCHOOLS = SPELL_SCHOOLS_ENUM;
export const SPELL_LEVELS  = SPELL_LEVELS_ENUM;
export const SPELL_SLOT_LABELS = SPELL_LEVELS_ENUM.filter(l => l !== "cantrip");
export const DAMAGE_TYPES = DAMAGE_TYPES_ENUM;


export const SKILL_CAT_ICONS = {
  [SKILL_CAT.SKILL]:  "target",
  [SKILL_CAT.RACIAL]: "dna",
  [SKILL_CAT.FEAT]:   "star",
};

export const SPELL_SCHOOL_ICONS = {
  [SPELL_SCHOOL.ABJURATION]:    "shield",
  [SPELL_SCHOOL.CONJURATION]:   "rotate-cw",
  [SPELL_SCHOOL.DIVINATION]:    "eye",
  [SPELL_SCHOOL.ENCHANTMENT]:   "sparkles",
  [SPELL_SCHOOL.EVOCATION]:     "flame",
  [SPELL_SCHOOL.ILLUSION]:      "drama",
  [SPELL_SCHOOL.NECROMANCY]:    "skull",
  [SPELL_SCHOOL.TRANSMUTATION]: "orbit",
  [SPELL_SCHOOL.OTHER]:         "sparkle",
};

export const REL_ICONS = {
  ally:    "handshake",
  neutral: "scale",
  hostile: "swords",
  unknown: "unknown",
};

export const FACTION_RANK_ICONS = {
  [FACTION_RANK.UNKNOWN]: "unknown",
  [FACTION_RANK.ALLY]:    "handshake",
  [FACTION_RANK.NEUTRAL]: "scale",
  [FACTION_RANK.ENEMY]:   "swords",
  [FACTION_RANK.MEMBER]:  "user",
  [FACTION_RANK.OFFICER]: "medal",
  [FACTION_RANK.LEADER]:  "crown",
};

/* Typy frakcji → ikony (P30) */
export const FACTION_TYPE_ICONS = Object.fromEntries(
  FACTION_TYPES_ENUM.map(t => [t, `faction-${t}`])
);

export const LOC_TYPE_ICONS = {
  [LOC_TYPE.SETTLEMENT]: "home",
  [LOC_TYPE.DUNGEON]:    "door-open",
  [LOC_TYPE.WILDERNESS]: "trees",
  [LOC_TYPE.BUILDING]:   "landmark",
  [LOC_TYPE.RUINS]:      "castle",
  [LOC_TYPE.LANDMARK]:   "gem",
  [LOC_TYPE.OTHER]:      "diamond",
};

export const ITEM_ICONS = {
  // Enum keys (po migracji)
  general:      "package",
  weapon:       "sword",
  armor:        "shirt",
  shield:       "shield",
  spell_scroll: "scroll",
  wondrous:     "sparkles",
  consumable:   "flask",
  tool:         "wrench",
  other:        "diamond",
  // Legacy Polish keys (przed migracją — backward compatibility)
  "Ogólny":          "package",
  "Broń":            "sword",
  "Pancerz":         "shirt",
  "Tarcza":          "shield",
  "Zwój z czarem":   "scroll",
  "Cudowny przedmiot":"sparkles",
  "Jednorazowy":     "flask",
  "Narzędzie":       "wrench",
  "Inny":            "diamond",
};

export const CONDITIONS = [
  { key: "blinded",       label: "Oślepiony" },
  { key: "charmed",       label: "Zauroczony" },
  { key: "deafened",      label: "Głuchy" },
  { key: "frightened",    label: "Przerażony" },
  { key: "grappled",      label: "Schwytany" },
  { key: "incapacitated", label: "Obezwładniony" },
  { key: "invisible",     label: "Niewidzialny" },
  { key: "paralyzed",     label: "Sparaliżowany" },
  { key: "petrified",     label: "Skamieniały" },
  { key: "poisoned",      label: "Otruty" },
  { key: "prone",         label: "Powalony" },
  { key: "restrained",    label: "Unieruchomiony" },
  { key: "stunned",       label: "Oszołomiony" },
  { key: "unconscious",   label: "Nieprzytomny" },
  // "Wyczerpany" (exhausted) celowo pominięte — 5e to stan poziomowany (0-6),
  // obsługiwany osobno w CombatCard jako conditions.exhaustion
];

export const DEFAULT_CHAR = {
  name: "", classes: [{ name: "", level: 1 }],
  stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  profBonus: 2, hp: { current: 10, max: 10, temp: 0 }, ac: 10,
  initiativeBonus: undefined,
  passivePerceptionOverride: undefined, skillDCOverride: undefined, spellAttackOverride: undefined,
  savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
  skills: {}, skillExp: {},
  alignment: "", background: "", race: "",
  traits: { personality: "", ideals: "", bonds: "", flaws: "" },
  personalNotes: "", backstory: "",
  spellSlots: {}, spellcastingAbility: "INT",
  hitDice: { type: "d8", max: 1, used: 0 },
  xp: 0, speed: 30,
  coins: { gold: 0, silver: 0, copper: 0 },
  appearance: { age: "", height: "", weight: "", eyes: "", skin: "", hair: "" },
  conditions: {},
  proficiencies: { weapons: "", armor: "", languages: "", tools: "" },
  deathSaves: { successes: 0, failures: 0 },
};

export const CHAR_SLOTS = ["char","inventory","npcs","locations","skills","spells","sessions","quests","factions"];

export const LEGEND_ITEMS = [
  { type: "npc",       color: "rgba(201,148,62,0.35)", border: "rgba(201,148,62,0.7)" },
  { type: "location",  color: "rgba(74,138,170,0.35)", border: "rgba(74,138,170,0.7)" },
  { type: "quest",     color: "rgba(170,68,68,0.35)",  border: "rgba(170,68,68,0.7)" },
  { type: "inventory", color: "rgba(58,138,90,0.35)",  border: "rgba(58,138,90,0.7)" },
  { type: "skill",     color: "rgba(122,90,170,0.35)", border: "rgba(122,90,170,0.7)" },
];

export const DND_CLASSES = [
  { name: "Barbarzyńca", en: "Barbarian", icon: "axe" },    { name: "Bard",      en: "Bard",     icon: "music" },
  { name: "Kleryk",      en: "Cleric",    icon: "cross" },  { name: "Druid",     en: "Druid",    icon: "leaf" },
  { name: "Wojownik",    en: "Fighter",   icon: "sword" },  { name: "Mnich",     en: "Monk",     icon: "hand" },
  { name: "Paladyn",     en: "Paladin",   icon: "shield" }, { name: "Łowca",     en: "Ranger",   icon: "crosshair" },
  { name: "Łotrzyk",     en: "Rogue",     icon: "footprints" }, { name: "Czarownik", en: "Sorcerer", icon: "flame" },
  { name: "Zaklinacz",   en: "Warlock",   icon: "sparkles" }, { name: "Mag",     en: "Wizard",   icon: "book" },
  { name: "Inna",        en: "Other",     icon: "circle-ellipsis" },
];

export const STAT_ARRAYS = {
  standard: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 },
  heroic:   { STR: 16, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 11 },
  balanced: { STR: 13, DEX: 13, CON: 13, INT: 13, WIS: 13, CHA: 13 },
};
