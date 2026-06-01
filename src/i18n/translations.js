import { createContext, useContext } from 'react';

/* ── Wykrywanie języka ─────────────────────────────────────────
   Kolejność: localStorage → navigator.language → domyślnie 'en' */
export function detectLang() {
  const stored = localStorage.getItem('hj_lang');
  if (stored === 'pl' || stored === 'en') return stored;
  return navigator.language?.startsWith('pl') ? 'pl' : 'en';
}

/* ── Context ────────────────────────────────────────────────── */
export const LangContext = createContext('en');
export const useLang = () => useContext(LangContext);
export const useT    = () => TRANSLATIONS[useContext(LangContext)];

/* ── Słownik ────────────────────────────────────────────────── */
export const TRANSLATIONS = {

  /* ═══════════════════════════════════════════════════════════
     POLSKI
  ═══════════════════════════════════════════════════════════ */
  pl: {
    PALETTE_LABELS: {
      mrok:     "🩸 Mrok",       obsydian: "🔮 Obsydian",
      drewno:   "🪵 Drewno",     wschod:   "🌅 Wschód",
      las:      "🌿 Las",        lupek:    "🌊 Łupek",
      pergamin: "📜 Pergamin",   kosc:     "🤍 Kość Słoniowa",
    },

    STATUS_CYCLE:  { "Aktywne": "Ukończone", "Ukończone": "Nieudane", "Nieudane": "Aktywne" },
    REL_LABELS:    { ally: "Sprzymierzeniec", neutral: "Neutralny", hostile: "Wrogi", unknown: "Nieznany" },
    LOC_TYPES:     ["Osada", "Podziemia", "Dzicz", "Budynek", "Ruiny", "Punkt Orientacyjny", "Inne"],
    FACTION_TYPES: ["Gildia", "Zakon", "Kult", "Rząd", "Armia", "Przestępcy", "Kupcy", "Religijna", "Polityczna", "Inna"],
    FACTION_RANKS: ["Nieznany", "Sojusznik", "Neutralny", "Wróg", "Członek", "Oficer", "Przywódca"],
    ALIGNMENTS:    ["Praworządny dobry", "Neutralny dobry", "Chaotyczny dobry", "Praworządny neutralny", "Bezwzględnie neutralny", "Chaotyczny neutralny", "Praworządny zły", "Neutralny zły", "Chaotyczny zły"],
    ITEM_TYPES:    ["Ogólny", "Broń", "Pancerz", "Zwój z czarem", "Cudowny przedmiot", "Jednorazowy", "Narzędzie", "Inny"],
    SKILL_CATS:    ["Umiejętność", "Cecha rasowa", "Atut"],
    SPELL_SCHOOLS: ["Odrzucanie", "Przywoływanie", "Wieszczenie", "Surogacja", "Wywoływanie", "Iluzja", "Nekromancja", "Przemiana", "Inna"],
    SPELL_LEVELS:  ["Sztuczka", "1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"],

    SAVING_THROWS: [
      { key:"str", label:"Siła",      attr:"STR" },
      { key:"dex", label:"Zręczność", attr:"DEX" },
      { key:"con", label:"Budowa",    attr:"CON" },
      { key:"int", label:"Intelekt",  attr:"INT" },
      { key:"wis", label:"Mądrość",   attr:"WIS" },
      { key:"cha", label:"Charyzma",  attr:"CHA" },
    ],

    GENERIC_SKILLS: [
      { key:"acrobatics",    label:"Akrobatyka",              attr:"DEX" },
      { key:"athletics",     label:"Atletyka",                attr:"STR" },
      { key:"arcana",        label:"Wiedza tajemna",          attr:"INT" },
      { key:"deception",     label:"Oszustwo",                attr:"CHA" },
      { key:"history",       label:"Historia",                attr:"INT" },
      { key:"insight",       label:"Intuicja",                attr:"WIS" },
      { key:"intimidation",  label:"Zastraszanie",            attr:"CHA" },
      { key:"investigation", label:"Śledztwo",                attr:"INT" },
      { key:"medicine",      label:"Medycyna",                attr:"WIS" },
      { key:"nature",        label:"Przyroda",                attr:"INT" },
      { key:"perception",    label:"Percepcja",               attr:"WIS" },
      { key:"performance",   label:"Występy",                 attr:"CHA" },
      { key:"persuasion",    label:"Perswazja",               attr:"CHA" },
      { key:"religion",      label:"Religia",                 attr:"INT" },
      { key:"sleightzhand",  label:"Zwinne dłonie",           attr:"DEX" },
      { key:"stealth",       label:"Skradanie",               attr:"DEX" },
      { key:"survival",      label:"Sztuka przetrwania",      attr:"WIS" },
      { key:"animalhandling",label:"Opieka nad zwierzętami",  attr:"WIS" },
    ],

    NAV: {
      hero:      "Bohater",    character: "Postać",    inventory:  "Plecak",
      spells:    "Czary",      skills:    "Zdolności", world:      "Świat",
      npcs:      "Postacie",   locations: "Miejsca",   factions:   "Frakcje",
      log:       "Dziennik",   sessions:  "Kronika",   quests:     "Zadania",
      compendium: "Kompendium",
      "compendium-races":     "Rasy",
      "compendium-classes":   "Klasy",
      "compendium-spells":    "Czary",
      "compendium-monsters":  "Potwory",
      "compendium-equipment": "Przedmioty",
    },

    UI: {
      themeColor:   "Motyw kolorystyczny",
      resetChar:    "↺ Reset postaci",
      syncData:     "☁ Synchronizuj dane",
      logout:       "⎋ Wyloguj",
      changeHero:   "Zmień bohatera",
      hero:         "Bohater",
      langToggle:   "EN",
    },
  },

  /* ═══════════════════════════════════════════════════════════
     ENGLISH
  ═══════════════════════════════════════════════════════════ */
  en: {
    PALETTE_LABELS: {
      mrok:     "🩸 Darkness",  obsydian: "🔮 Obsidian",
      drewno:   "🪵 Wood",      wschod:   "🌅 Dawn",
      las:      "🌿 Forest",    lupek:    "🌊 Slate",
      pergamin: "📜 Parchment", kosc:     "🤍 Ivory",
    },

    STATUS_CYCLE:  { "Active": "Completed", "Completed": "Failed", "Failed": "Active" },
    REL_LABELS:    { ally: "Ally", neutral: "Neutral", hostile: "Hostile", unknown: "Unknown" },
    LOC_TYPES:     ["Settlement", "Dungeon", "Wilderness", "Building", "Ruins", "Landmark", "Other"],
    FACTION_TYPES: ["Guild", "Order", "Cult", "Government", "Military", "Criminals", "Merchants", "Religious", "Political", "Other"],
    FACTION_RANKS: ["Unknown", "Ally", "Neutral", "Enemy", "Member", "Officer", "Leader"],
    ALIGNMENTS:    ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"],
    ITEM_TYPES:    ["General", "Weapon", "Armor", "Spell Scroll", "Wondrous Item", "Consumable", "Tool", "Other"],
    SKILL_CATS:    ["Skill", "Racial Feature", "Feat"],
    SPELL_SCHOOLS: ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation", "Other"],
    SPELL_LEVELS:  ["Cantrip", "1st level", "2nd level", "3rd level", "4th level", "5th level", "6th level", "7th level", "8th level", "9th level"],

    SAVING_THROWS: [
      { key:"str", label:"Strength",     attr:"STR" },
      { key:"dex", label:"Dexterity",    attr:"DEX" },
      { key:"con", label:"Constitution", attr:"CON" },
      { key:"int", label:"Intelligence", attr:"INT" },
      { key:"wis", label:"Wisdom",       attr:"WIS" },
      { key:"cha", label:"Charisma",     attr:"CHA" },
    ],

    GENERIC_SKILLS: [
      { key:"acrobatics",    label:"Acrobatics",     attr:"DEX" },
      { key:"athletics",     label:"Athletics",      attr:"STR" },
      { key:"arcana",        label:"Arcana",         attr:"INT" },
      { key:"deception",     label:"Deception",      attr:"CHA" },
      { key:"history",       label:"History",        attr:"INT" },
      { key:"insight",       label:"Insight",        attr:"WIS" },
      { key:"intimidation",  label:"Intimidation",   attr:"CHA" },
      { key:"investigation", label:"Investigation",  attr:"INT" },
      { key:"medicine",      label:"Medicine",       attr:"WIS" },
      { key:"nature",        label:"Nature",         attr:"INT" },
      { key:"perception",    label:"Perception",     attr:"WIS" },
      { key:"performance",   label:"Performance",    attr:"CHA" },
      { key:"persuasion",    label:"Persuasion",     attr:"CHA" },
      { key:"religion",      label:"Religion",       attr:"INT" },
      { key:"sleightzhand",  label:"Sleight of Hand",attr:"DEX" },
      { key:"stealth",       label:"Stealth",        attr:"DEX" },
      { key:"survival",      label:"Survival",       attr:"WIS" },
      { key:"animalhandling",label:"Animal Handling", attr:"WIS" },
    ],

    NAV: {
      hero:      "Hero",        character: "Character",  inventory:  "Inventory",
      spells:    "Spells",      skills:    "Abilities",  world:      "World",
      npcs:      "Characters",  locations: "Locations",  factions:   "Factions",
      log:       "Journal",     sessions:  "Chronicle",  quests:     "Quests",
      compendium: "Compendium",
      "compendium-races":     "Races",
      "compendium-classes":   "Classes",
      "compendium-spells":    "Spells",
      "compendium-monsters":  "Monsters",
      "compendium-equipment": "Equipment",
    },

    UI: {
      themeColor:   "Color theme",
      resetChar:    "↺ Reset character",
      syncData:     "☁ Sync data",
      logout:       "⎋ Log out",
      changeHero:   "Change hero",
      hero:         "Hero",
      langToggle:   "PL",
    },
  },
};
