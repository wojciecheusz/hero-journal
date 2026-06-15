import { TRANSLATIONS } from '../i18n/translations';

/* Nawigacja mobilna — wszystkie sub-taby widoczne */
export function getNavGroups(lang) {
  const n = TRANSLATIONS[lang]?.NAV ?? TRANSLATIONS.en.NAV;
  return [
    {
      id: "hero", label: n.hero, icon: "sword", defaultTab: "character",
      tabs: [
        { id:"character", label: n.character, icon:"sword" },
        { id:"inventory", label: n.inventory, icon:"backpack" },
        { id:"skills",    label: n.skills,    icon:"sparkles" },
        { id:"spells",    label: n.spells,    icon:"wand" },
      ],
    },
    {
      id: "world", label: n.world, icon: "globe", defaultTab: "npcs",
      tabs: [
        { id:"npcs",      label: n.npcs,      icon:"users" },
        { id:"locations", label: n.locations, icon:"map" },
        { id:"factions",  label: n.factions,  icon:"flag" },
      ],
    },
    {
      id: "log", label: n.log, icon: "scroll", defaultTab: "sessions",
      tabs: [
        { id:"sessions", label: n.sessions, icon:"book-open" },
        { id:"quests",   label: n.quests,   icon:"zap" },
      ],
    },
  ];
}

/* Etykieta aktualnej zakładki — wyświetlana w trwałym nagłówku (Header/Sidebar) */
export function getTabLabel(T, tab) {
  const n = T.NAV;
  const map = {
    character: n.character, equipment: n.equipment, inventory: n.inventory,
    skills: n.skills, spells: n.spells, "world-all": n.world,
    npcs: n.npcs, locations: n.locations, factions: n.factions,
    sessions: n.sessions, quests: n.quests,
  };
  return map[tab] || n.character;
}

/* Nawigacja desktopowa — uproszczona struktura dla sidebara:
   - Hero ma podzakładki Character i Equipment (virtual tab)
   - World to jeden przycisk pokazujący 3 kolumny
   - Inventory/Spells/Skills/NPCs/Locations/Factions znikają z nawigatora */
export function getNavGroupsDesktop(lang) {
  const n = TRANSLATIONS[lang]?.NAV ?? TRANSLATIONS.en.NAV;
  return [
    {
      id: "hero", label: n.hero, icon: "sword",
      tabs: [
        { id:"character",  label: n.character,  icon:"sword" },
        { id:"equipment",  label: n.equipment,  icon:"backpack" },
      ],
    },
    {
      id: "world", label: n.world, icon: "globe",
      tabs: [
        { id:"world-all", label: n.world, icon:"globe" },
      ],
    },
    {
      id: "log", label: n.log, icon: "scroll",
      tabs: [
        { id:"sessions", label: n.sessions, icon:"book-open" },
        { id:"quests",   label: n.quests,   icon:"zap" },
      ],
    },
  ];
}
