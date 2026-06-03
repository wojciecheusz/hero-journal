import { TRANSLATIONS } from '../i18n/translations';

/* Nawigacja mobilna — wszystkie sub-taby widoczne */
export function getNavGroups(lang) {
  const n = TRANSLATIONS[lang]?.NAV ?? TRANSLATIONS.en.NAV;
  return [
    {
      id: "hero", label: n.hero, icon: "⚔️", defaultTab: "character",
      tabs: [
        { id:"character", label: n.character, icon:"⚔️" },
        { id:"inventory", label: n.inventory, icon:"🎒" },
        { id:"spells",    label: n.spells,    icon:"🔮" },
        { id:"skills",    label: n.skills,    icon:"✨" },
      ],
    },
    {
      id: "world", label: n.world, icon: "🌍", defaultTab: "npcs",
      tabs: [
        { id:"npcs",      label: n.npcs,      icon:"👥" },
        { id:"locations", label: n.locations, icon:"🗺️" },
        { id:"factions",  label: n.factions,  icon:"⚜️" },
      ],
    },
    {
      id: "log", label: n.log, icon: "📜", defaultTab: "sessions",
      tabs: [
        { id:"sessions", label: n.sessions, icon:"📖" },
        { id:"quests",   label: n.quests,   icon:"⚡" },
      ],
    },
  ];
}

/* Nawigacja desktopowa — uproszczona struktura dla sidebara:
   - Hero ma podzakładki Character i Equipment (virtual tab)
   - World to jeden przycisk pokazujący 3 kolumny
   - Inventory/Spells/Skills/NPCs/Locations/Factions znikają z nawigatora */
export function getNavGroupsDesktop(lang) {
  const n = TRANSLATIONS[lang]?.NAV ?? TRANSLATIONS.en.NAV;
  return [
    {
      id: "hero", label: n.hero, icon: "⚔️",
      tabs: [
        { id:"character",  label: n.character,  icon:"⚔️" },
        { id:"equipment",  label: n.equipment,  icon:"🎒" },
      ],
    },
    {
      id: "world", label: n.world, icon: "🌍",
      tabs: [
        { id:"world-all", label: n.world, icon:"🌍" },
      ],
    },
    {
      id: "log", label: n.log, icon: "📜",
      tabs: [
        { id:"sessions", label: n.sessions, icon:"📖" },
        { id:"quests",   label: n.quests,   icon:"⚡" },
      ],
    },
  ];
}
