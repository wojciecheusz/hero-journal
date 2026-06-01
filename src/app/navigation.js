export const NAV_GROUPS = [
  {
    id: "hero", label: "Bohater", icon: "⚔️", defaultTab: "character",
    tabs: [
      { id:"character", label:"Postać",    icon:"⚔️" },
      { id:"inventory", label:"Plecak",    icon:"🎒" },
      { id:"spells",    label:"Czary",     icon:"🔮" },
      { id:"skills",    label:"Zdolności", icon:"✨" },
    ],
  },
  {
    id: "world", label: "Świat", icon: "🌍", defaultTab: "npcs",
    tabs: [
      { id:"npcs",      label:"Postacie", icon:"👥" },
      { id:"locations", label:"Miejsca",  icon:"🗺️" },
      { id:"factions",  label:"Frakcje",  icon:"⚜️" },
    ],
  },
  {
    id: "log", label: "Dziennik", icon: "📜", defaultTab: "sessions",
    tabs: [
      { id:"sessions", label:"Kronika", icon:"📖" },
      { id:"quests",   label:"Zadania", icon:"⚡" },
    ],
  },
  {
    id: "compendium", label: "Kompendium", icon: "📚", defaultTab: "compendium-spells",
    tabs: [
      { id:"compendium-races",     label:"Rasy",       icon:"🧝" },
      { id:"compendium-classes",   label:"Klasy",      icon:"⚔️" },
      { id:"compendium-spells",    label:"Czary",      icon:"✨" },
      { id:"compendium-monsters",  label:"Potwory",    icon:"🐉" },
      { id:"compendium-equipment", label:"Przedmioty", icon:"🎒" },
    ],
  },
];
