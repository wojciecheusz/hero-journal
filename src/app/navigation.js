import { TRANSLATIONS } from '../i18n/translations';

/* Grupy podzakładek (P29/A1–A2): Wyposażenie i Świat */
export const EQUIPMENT_TABS = ["inventory", "skills", "spells"];
export const WORLD_TABS     = ["npcs", "locations", "factions"];
export const isEquipmentTab = t => t === "equipment" || EQUIPMENT_TABS.includes(t);
export const isWorldTab     = t => t === "world-all" || WORLD_TABS.includes(t);

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

/* Nawigacja główna (sidebar na desktopie i dolne menu na mobile, P29):
   Postać · Wyposażenie · Świat · Kronika · Zadania. Wyposażenie i Świat
   mają własne podzakładki na górze obszaru roboczego (SubTabBar). */
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
