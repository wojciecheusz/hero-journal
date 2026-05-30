/* ═══════════════════════════════════════════════════
   Definicje systemów RPG
═══════════════════════════════════════════════════ */

export const SYSTEMS = [
  {
    id: "dnd5e",
    name: "D&D 5e",
    fullName: "Dungeons & Dragons 5th Edition",
    icon: "⚔️",
    description: "Klasy, czary, umiejętności, atrybuty i cały ekwipunek D&D 5e.",
    color: "#c9943e",
  },
  {
    id: "wfrp",
    name: "Warhammer",
    fullName: "Warhammer Fantasy Roleplay 4e",
    icon: "💀",
    description: "10 cech, kariera, rany, talenty, kondycja i ekwipunek WFRP.",
    color: "#8a3a3a",
  },
  {
    id: "universal",
    name: "Uniwersalny",
    fullName: "Własna karta postaci",
    icon: "📝",
    description: "Sam określasz atrybuty, zasoby i sekcje karty. Dla dowolnego systemu.",
    color: "#4a7aaa",
  },
];

/* ═══ Nawigacja D&D 5e ═════════════════════════════ */
export const DND_NAV_GROUPS = [
  {
    id: "hero", label: "Bohater", icon: "⚔️", defaultTab: "character",
    tabs: [
      { id: "character", label: "Postać",    icon: "⚔️" },
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
  {
    id: "compendium", label: "Kompendium", icon: "📚", defaultTab: "compendium-spells",
    tabs: [
      { id: "compendium-races",     label: "Rasy",       icon: "🧝" },
      { id: "compendium-classes",   label: "Klasy",      icon: "⚔️" },
      { id: "compendium-spells",    label: "Czary",      icon: "✨" },
      { id: "compendium-monsters",  label: "Potwory",    icon: "🐉" },
      { id: "compendium-equipment", label: "Przedmioty", icon: "🎒" },
    ],
  },
];

/* ═══ Nawigacja Warhammer ══════════════════════════ */
export const WFRP_NAV_GROUPS = [
  {
    id: "hero", label: "Bohater", icon: "💀", defaultTab: "character",
    tabs: [
      { id: "character",      label: "Postać",     icon: "💀" },
      { id: "wfrp-inventory", label: "Ekwipunek",  icon: "🎒" },
      { id: "wfrp-skills",    label: "Umiejętności", icon: "🎯" },
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

/* ═══ Nawigacja Uniwersalna ════════════════════════ */
export const buildUniversalNavGroups = (schema = {}) => {
  const heroTabs = [{ id: "character", label: "Postać", icon: "📝" }];
  if (schema.features?.inventory) heroTabs.push({ id: "universal-inventory", label: "Ekwipunek", icon: "🎒" });

  const groups = [
    { id: "hero", label: "Bohater", icon: "📝", defaultTab: "character", tabs: heroTabs },
  ];
  if (schema.features?.world) {
    groups.push({
      id: "world", label: "Świat", icon: "🌍", defaultTab: "npcs",
      tabs: [
        { id: "npcs",      label: "Postacie", icon: "👥" },
        { id: "locations", label: "Miejsca",  icon: "🗺️" },
        ...(schema.features?.factions ? [{ id: "factions", label: "Frakcje", icon: "⚜️" }] : []),
      ],
    });
  }
  if (schema.features?.journal) {
    groups.push({
      id: "log", label: "Dziennik", icon: "📜", defaultTab: "sessions",
      tabs: [
        { id: "sessions", label: "Kronika", icon: "📖" },
        ...(schema.features?.quests ? [{ id: "quests", label: "Zadania", icon: "⚡" }] : []),
      ],
    });
  }
  return groups;
};

/* ═══ Domyślne dane postaci per system ════════════ */

// Cechy WFRP: klucz, polska nazwa, skrót, bazowa wartość
export const WFRP_CHARS = [
  { key: "ww",  name: "Walka Wręcz",            abbr: "WW",  base: 30 },
  { key: "us",  name: "Umiejętność Strzelecka",  abbr: "US",  base: 30 },
  { key: "k",   name: "Krzepkość",               abbr: "K",   base: 30 },
  { key: "odp", name: "Odporność",               abbr: "Odp", base: 30 },
  { key: "ini", name: "Inicjatywa",              abbr: "Ini", base: 30 },
  { key: "zw",  name: "Zwinność",                abbr: "Zw",  base: 30 },
  { key: "sp",  name: "Sprawność",               abbr: "Sp",  base: 20 },
  { key: "int", name: "Inteligencja",            abbr: "Int", base: 30 },
  { key: "sw",  name: "Siła Woli",               abbr: "SW",  base: 30 },
  { key: "og",  name: "Ogłada",                  abbr: "Og",  base: 30 },
];

export const WFRP_SPECIES = [
  { id: "human",    name: "Człowiek",   mods: {} },
  { id: "dwarf",    name: "Krasnolud",  mods: { ww:10, k:10, odp:10, zw:-10, sp:10, sw:20 } },
  { id: "halfling", name: "Halfling",   mods: { us:10, zw:10, sp:10, sw:10, og:10, k:-10 } },
  { id: "high_elf", name: "Wysoki Elf", mods: { ww:10, us:10, ini:20, zw:10, sp:10, int:10, og:10 } },
  { id: "wood_elf", name: "Leśny Elf",  mods: { ww:15, us:10, k:5, ini:20, zw:10, sp:10, sw:10 } },
];

export const WFRP_CONDITIONS = [
  { key: "bleeding",    label: "Krwawienie" },
  { key: "broken",      label: "Złamany" },
  { key: "dying",       label: "Umierający" },
  { key: "exhausted",   label: "Wyczerpany" },
  { key: "fatigued",    label: "Zmęczony" },
  { key: "prone",       label: "Leżący" },
  { key: "stunned",     label: "Ogłuszony" },
  { key: "surprised",   label: "Zaskoczony" },
  { key: "unconscious", label: "Nieprzytomny" },
  { key: "entangled",   label: "Unieruchomiony" },
  { key: "poisoned",    label: "Zatruty" },
];

// Bazowa char WFRP z domyślnymi wartościami cech dla Człowieka
export function makeWFRPDefaultChar(name = "", species = "human", career = "") {
  const speciesData = WFRP_SPECIES.find(s => s.id === species) || WFRP_SPECIES[0];
  const chars = {};
  WFRP_CHARS.forEach(c => {
    chars[c.key] = { start: c.base + (speciesData.mods[c.key] || 0), adv: 0 };
  });
  const tb = Math.floor((chars.odp.start) / 10);
  const sb = Math.floor((chars.k.start) / 10);
  const wpb = Math.floor((chars.sw.start) / 10);
  const maxWounds = sb + tb * 2 + wpb;
  return {
    name, system: "wfrp",
    species, career: { name: career, tier: 1, class: "", status: "Brass", standing: 0 },
    religion: "", motivation: "",
    ambitionShort: "", ambitionLong: "",
    partyName: "", partyAmbition: "",
    age: "", height: "", weight: "", hair: "", eyes: "", handedness: "",
    chars,
    wounds:     { current: maxWounds, max: maxWounds },
    fate:       { current: 0, max: 0 },
    fortune:    0,
    resilience: { current: 0, max: 0 },
    resolve:    0,
    advantage:  0,
    movement:   4,
    xp:         { current: 0, total: 0, spent: 0 },
    conditions: {},
    corruption: 0,
    mutations:  "",
    skills: [],
    talents: [],
    coins:  { gc: 0, ss: 0, bp: 0 },
    armour: { head: 0, arms: 0, body: 0, legs: 0 },
    encMax: 0, encCurrent: 0,
    notes: "", backstory: "",
  };
}

// Domyślny schemat uniwersalny
export const DEFAULT_UNIVERSAL_SCHEMA = {
  statGroups: [
    {
      id: "sg1", name: "Atrybuty",
      stats: [
        { id: "st1", name: "Atrybut 1", value: 0 },
        { id: "st2", name: "Atrybut 2", value: 0 },
      ],
    },
  ],
  resources: [
    { id: "res1", name: "Punkty Życia", current: 10, max: 10 },
  ],
  textFields: [
    { id: "tf1", name: "Notatki" },
  ],
  features: {
    inventory: true,
    journal:   true,
    quests:    true,
    world:     false,
    factions:  false,
  },
};

export function makeUniversalDefaultChar(name = "", schema = DEFAULT_UNIVERSAL_SCHEMA) {
  const custom = {};
  (schema.statGroups || []).forEach(g =>
    g.stats.forEach(s => { custom[s.id] = s.value || 0; })
  );
  (schema.resources || []).forEach(r => {
    custom[r.id + "_current"] = r.current || 0;
    custom[r.id + "_max"]     = r.max || 0;
  });
  (schema.textFields || []).forEach(t => { custom[t.id] = ""; });
  return { name, system: "universal", custom, notes: "", backstory: "" };
}
