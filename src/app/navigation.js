import { TRANSLATIONS } from '../i18n/translations';

/* Buduje tablicę NAV_GROUPS z etykietami w wybranym języku.
   ID i ikony są niezmienne — tylko .label pochodzi z TRANSLATIONS. */
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
    {
      id: "compendium", label: n.compendium, icon: "📚", defaultTab: "compendium-spells",
      tabs: [
        { id:"compendium-races",     label: n["compendium-races"],     icon:"🧝" },
        { id:"compendium-classes",   label: n["compendium-classes"],   icon:"⚔️" },
        { id:"compendium-spells",    label: n["compendium-spells"],    icon:"✨" },
        { id:"compendium-monsters",  label: n["compendium-monsters"],  icon:"🐉" },
        { id:"compendium-equipment", label: n["compendium-equipment"], icon:"🎒" },
      ],
    },
  ];
}
