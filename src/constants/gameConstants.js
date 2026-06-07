import {
  SKILL_CATS_ENUM, ITEM_TYPES_ENUM, LOC_TYPES_ENUM,
  FACTION_TYPES_ENUM, FACTION_RANKS_ENUM,
  SPELL_LEVELS_ENUM, SPELL_SCHOOLS_ENUM, DAMAGE_TYPES_ENUM,
  FACTION_RANK, SKILL_CAT, SPELL_SCHOOL,
} from './enums.js';

export { STATUS_CYCLE } from './enums.js';

export const REL_CYCLE = { unknown:"ally", ally:"neutral", neutral:"hostile", hostile:"unknown" };

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

export const SUGGESTED_LOCATION_TAGS = ["miasto", "stolica", "metropolia", "wioska", "twierdza", "świątynia"];

export const SKILL_CAT_ICONS = {
  [SKILL_CAT.SKILL]:  "🎯",
  [SKILL_CAT.RACIAL]: "🧬",
  [SKILL_CAT.FEAT]:   "⭐",
};

export const SPELL_SCHOOL_ICONS = {
  [SPELL_SCHOOL.ABJURATION]:    "🛡️",
  [SPELL_SCHOOL.CONJURATION]:   "🌀",
  [SPELL_SCHOOL.DIVINATION]:    "👁️",
  [SPELL_SCHOOL.ENCHANTMENT]:   "💫",
  [SPELL_SCHOOL.EVOCATION]:     "🔥",
  [SPELL_SCHOOL.ILLUSION]:      "🎭",
  [SPELL_SCHOOL.NECROMANCY]:    "💀",
  [SPELL_SCHOOL.TRANSMUTATION]: "🔄",
  [SPELL_SCHOOL.OTHER]:         "✨",
};

export const FACTION_RANK_COLORS = {
  [FACTION_RANK.UNKNOWN]: "#6a5a38",
  [FACTION_RANK.ALLY]:    "#5a8a5a",
  [FACTION_RANK.NEUTRAL]: "#8a7840",
  [FACTION_RANK.ENEMY]:   "#8a3a3a",
  [FACTION_RANK.MEMBER]:  "#4a7aaa",
  [FACTION_RANK.OFFICER]: "#c9a84c",
  [FACTION_RANK.LEADER]:  "#e2b94e",
};

export const ITEM_ICONS = {
  // Enum keys (po migracji)
  general:      "📦",
  weapon:       "⚔️",
  armor:        "🛡️",
  spell_scroll: "📜",
  wondrous:     "✨",
  consumable:   "🧪",
  tool:         "🔧",
  other:        "◈",
  // Legacy Polish keys (przed migracją — backward compatibility)
  "Ogólny":          "📦",
  "Broń":            "⚔️",
  "Pancerz":         "🛡️",
  "Zwój z czarem":   "📜",
  "Cudowny przedmiot":"✨",
  "Jednorazowy":     "🧪",
  "Narzędzie":       "🔧",
  "Inny":            "◈",
};

export const CONDITIONS = [
  { key: "blinded",       label: "Oślepiony" },
  { key: "charmed",       label: "Oczarowany" },
  { key: "deafened",      label: "Ogłuchy" },
  { key: "frightened",    label: "Przestraszony" },
  { key: "grappled",      label: "Chwycony" },
  { key: "incapacitated", label: "Ubezwłasnowolniony" },
  { key: "invisible",     label: "Niewidzialny" },
  { key: "paralyzed",     label: "Sparaliżowany" },
  { key: "petrified",     label: "Skamieniały" },
  { key: "poisoned",      label: "Zatruty" },
  { key: "prone",         label: "Leżący" },
  { key: "restrained",    label: "Obezwładniony" },
  { key: "stunned",       label: "Ogłuszony" },
  { key: "unconscious",   label: "Nieprzytomny" },
];

export const SAVING_THROWS = [
  { key: "str", label: "Siła",      attr: "STR" },
  { key: "dex", label: "Zręczność", attr: "DEX" },
  { key: "con", label: "Budowa",    attr: "CON" },
  { key: "int", label: "Intelekt",  attr: "INT" },
  { key: "wis", label: "Mądrość",   attr: "WIS" },
  { key: "cha", label: "Charyzma",  attr: "CHA" },
];

export const GENERIC_SKILLS = [
  { key: "acrobatics",    label: "Akrobatyka",              attr: "DEX" },
  { key: "athletics",     label: "Atletyka",                attr: "STR" },
  { key: "arcana",        label: "Wiedza tajemna",          attr: "INT" },
  { key: "deception",     label: "Oszustwo",                attr: "CHA" },
  { key: "history",       label: "Historia",                attr: "INT" },
  { key: "insight",       label: "Intuicja",                attr: "WIS" },
  { key: "intimidation",  label: "Zastraszanie",            attr: "CHA" },
  { key: "investigation", label: "Śledztwo",                attr: "INT" },
  { key: "medicine",      label: "Medycyna",                attr: "WIS" },
  { key: "nature",        label: "Przyroda",                attr: "INT" },
  { key: "perception",    label: "Percepcja",               attr: "WIS" },
  { key: "performance",   label: "Występy",                 attr: "CHA" },
  { key: "persuasion",    label: "Perswazja",               attr: "CHA" },
  { key: "religion",      label: "Religia",                 attr: "INT" },
  { key: "sleightzhand",  label: "Zwinne dłonie",           attr: "DEX" },
  { key: "stealth",       label: "Skradanie",               attr: "DEX" },
  { key: "survival",      label: "Sztuka przetrwania",      attr: "WIS" },
  { key: "animalhandling",label: "Opieka nad zwierzętami",  attr: "WIS" },
];

export const DEFAULT_CHAR = {
  name: "", classes: [{ name: "Poszukiwacz przygód", level: 1 }],
  stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  profBonus: 2, hp: { current: 10, max: 10, temp: 0 }, ac: 10,
  initiativeBonus: undefined,
  savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
  skills: {}, skillExp: {},
  alignment: "Bezwzględnie neutralny", background: "", race: "",
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
  { type: "npc",       color: "rgba(201,148,62,0.35)", border: "rgba(201,148,62,0.7)",  label: "Postacie" },
  { type: "location",  color: "rgba(74,138,170,0.35)", border: "rgba(74,138,170,0.7)",  label: "Miejsca" },
  { type: "quest",     color: "rgba(170,68,68,0.35)",  border: "rgba(170,68,68,0.7)",   label: "Zadania" },
  { type: "inventory", color: "rgba(58,138,90,0.35)",  border: "rgba(58,138,90,0.7)",   label: "Plecak" },
  { type: "skill",     color: "rgba(122,90,170,0.35)", border: "rgba(122,90,170,0.7)",  label: "Zdolności" },
];

export const DND_CLASSES = [
  { name: "Barbarzyńca", icon: "🪓" }, { name: "Bard",      icon: "🎶" },
  { name: "Kleryk",      icon: "✝️" }, { name: "Druid",     icon: "🌿" },
  { name: "Wojownik",    icon: "⚔️" }, { name: "Mnich",     icon: "☯️" },
  { name: "Paladyn",     icon: "🛡️" }, { name: "Łowca",     icon: "🏹" },
  { name: "Łotrzyk",     icon: "🗡️" }, { name: "Czarownik", icon: "💫" },
  { name: "Zaklinacz",   icon: "👁️" }, { name: "Mag",       icon: "📚" },
  { name: "Inna",        icon: "⚡" },
];

export const STAT_ARRAYS = {
  "Zestaw standardowy": { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 },
  "Heroiczny (Silny)":  { STR: 16, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 11 },
  "Zrównoważony":       { STR: 13, DEX: 13, CON: 13, INT: 13, WIS: 13, CHA: 13 },
};
