export const today = () => new Date().toISOString().slice(0, 10);

/* XP potrzebne do osiągnięcia kolejnego poziomu (indeks = aktualny poziom 1–20) */
export const XP_THRESHOLDS = [
  0,       // poziom 1 → 2
  300,     // poziom 2 → 3
  900,     // poziom 3 → 4
  2700,    // poziom 4 → 5
  6500,    // poziom 5 → 6
  14000,   // poziom 6 → 7
  23000,   // poziom 7 → 8
  34000,   // poziom 8 → 9
  48000,   // poziom 9 → 10
  64000,   // poziom 10 → 11
  85000,   // poziom 11 → 12
  100000,  // poziom 12 → 13
  120000,  // poziom 13 → 14
  140000,  // poziom 14 → 15
  165000,  // poziom 15 → 16
  195000,  // poziom 16 → 17
  225000,  // poziom 17 → 18
  265000,  // poziom 18 → 19
  305000,  // poziom 19 → 20
  355000,  // poziom 20 (max)
];

export const STAT_KEYS    = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
export const STATUS_CYCLE = { "Aktywne": "Ukończone", "Ukończone": "Nieudane", "Nieudane": "Aktywne" };
export const REL_CYCLE    = { unknown: "ally", ally: "neutral", neutral: "hostile", hostile: "unknown" };
export const REL_LABELS   = { ally: "Sprzymierzeniec", neutral: "Neutralny", hostile: "Wrogi", unknown: "Nieznany" };
export const LOC_TYPES    = ["Osada", "Podziemia", "Dzicz", "Budynek", "Ruiny", "Punkt Orientacyjny", "Inne"];
export const FACTION_TYPES = ["Gildia", "Zakon", "Kult", "Rząd", "Armia", "Przestępcy", "Kupcy", "Religijna", "Polityczna", "Inna"];
export const FACTION_RANKS = ["Nieznany", "Sojusznik", "Neutralny", "Wróg", "Członek", "Oficer", "Przywódca"];
export const FACTION_RANK_COLORS = {
  "Nieznany": "#6a5a38", "Sojusznik": "#5a8a5a", "Neutralny": "#8a7840",
  "Wróg": "#8a3a3a", "Członek": "#4a7aaa", "Oficer": "#c9a84c", "Przywódca": "#e2b94e",
};
export const ALIGNMENTS   = ["Praworządny dobry", "Neutralny dobry", "Chaotyczny dobry", "Praworządny neutralny", "Bezwzględnie neutralny", "Chaotyczny neutralny", "Praworządny zły", "Neutralny zły", "Chaotyczny zły"];
export const ITEM_TYPES   = ["Ogólny", "Broń", "Pancerz", "Zwój z czarem", "Cudowny przedmiot", "Jednorazowy", "Narzędzie", "Inny"];
export const ITEM_ICONS   = { "Ogólny": "📦", "Broń": "⚔️", "Pancerz": "🛡️", "Zwój z czarem": "📜", "Cudowny przedmiot": "✨", "Jednorazowy": "🧪", "Narzędzie": "🔧", "Inny": "◈" };
export const SKILL_CATS   = ["Umiejętność", "Cecha rasowa", "Atut"];
export const SPELL_SCHOOLS = ["Odrzucanie", "Przywoływanie", "Wieszczenie", "Surogacja", "Wywoływanie", "Iluzja", "Nekromancja", "Przemiana", "Inna"];
export const SPELL_LEVELS = ["Sztuczka", "1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];
export const SPELL_SLOT_LABELS = ["1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];

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
  { key: "str", label: "Siła",       attr: "STR" },
  { key: "dex", label: "Zręczność",  attr: "DEX" },
  { key: "con", label: "Budowa",     attr: "CON" },
  { key: "int", label: "Intelekt",   attr: "INT" },
  { key: "wis", label: "Mądrość",    attr: "WIS" },
  { key: "cha", label: "Charyzma",   attr: "CHA" },
];

export const GENERIC_SKILLS = [
  { key: "acrobatics",    label: "Akrobatyka",                attr: "DEX" },
  { key: "athletics",     label: "Atletyka",                  attr: "STR" },
  { key: "arcana",        label: "Wiedza tajemna",            attr: "INT" },
  { key: "deception",     label: "Oszustwo",                  attr: "CHA" },
  { key: "history",       label: "Historia",                  attr: "INT" },
  { key: "insight",       label: "Intuicja",                  attr: "WIS" },
  { key: "intimidation",  label: "Zastraszanie",              attr: "CHA" },
  { key: "investigation", label: "Śledztwo",                  attr: "INT" },
  { key: "medicine",      label: "Medycyna",                  attr: "WIS" },
  { key: "nature",        label: "Przyroda",                  attr: "INT" },
  { key: "perception",    label: "Percepcja",                 attr: "WIS" },
  { key: "performance",   label: "Występy",                   attr: "CHA" },
  { key: "persuasion",    label: "Perswazja",                 attr: "CHA" },
  { key: "religion",      label: "Religia",                   attr: "INT" },
  { key: "sleightzhand",  label: "Zwinne dłonie",             attr: "DEX" },
  { key: "stealth",       label: "Skradanie",                 attr: "DEX" },
  { key: "survival",      label: "Sztuka przetrwania",        attr: "WIS" },
  { key: "animalhandling",label: "Opieka nad zwierzętami",    attr: "WIS" },
];

export const DEFAULT_CHAR = {
  name: "", classes: [{ name: "Poszukiwacz przygód", level: 1 }],
  stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  profBonus: 2, hp: { current: 10, max: 10, temp: 0 }, ac: 10,
  initiativeBonus: undefined,
  savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
  skills: {}, skillExp: {},
  alignment: "Bezwzględnie neutralny", background: "",
  traits: { personality: "", ideals: "", bonds: "", flaws: "" },
  personalNotes: "", backstory: "",
  spellSlots: {}, spellcastingAbility: "INT",
  hitDice: { type: "d8", max: 1, used: 0 },
  xp: 0,
  speed: 30,
  coins: { gold: 0, silver: 0, copper: 0 },
  appearance: { age: "", height: "", weight: "", eyes: "", skin: "", hair: "" },
  conditions: {},
  proficiencies: { weapons: "", armor: "", languages: "", tools: "" },
  deathSaves: { successes: 0, failures: 0 },
};

export const CHAR_SLOTS = ["char", "inventory", "npcs", "locations", "skills", "spells", "sessions", "quests", "factions"];

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

export const NAV_GROUPS = [
  {
    id: "hero", label: "Bohater", icon: "⚔️", defaultTab: "character",
    tabs: [
      { id: "character", label: "Bohater",   icon: "⚔️" },
      { id: "inventory", label: "Plecak",    icon: "🎒" },
      { id: "spells",    label: "Czary",     icon: "🔮" },
      { id: "skills",    label: "Zdolności", icon: "✨" },
    ],
  },
  {
    id: "world", label: "Świat", icon: "🌍", defaultTab: "npcs",
    tabs: [
      { id: "npcs",      label: "Postacie", icon: "👥" },
      { id: "locations", label: "Miejsca",  icon: "🗺️" },
      { id: "factions",  label: "Frakcje",  icon: "⚜️" },
    ],
  },
  {
    id: "log", label: "Dziennik", icon: "📜", defaultTab: "sessions",
    tabs: [
      { id: "sessions", label: "Kronika", icon: "📖" },
      { id: "quests",   label: "Zadania", icon: "⚡" },
    ],
  },
];
