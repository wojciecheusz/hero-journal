
export const PALETTES = ["pergamin", "wschod", "oath", "astral", "quill", "feywild", "eldritch", "dungeon", "underdark", "wrath"];

export const THEMES = {

  /* ── WSCHÓD – pomarańcze i granaty ───────────────────────── */
  wschod: {
    bg: "#0e1020",        bgCard: "#181a30",      bgInput: "#141628",     bgNav: "#0c0e18",
    border: "#3a3858",    borderSub: "#2c2a48",   borderInput: "#484060",
    text: "#ffecd8",      textMuted: "#d09060",   textDim: "#8878b0",     textLabel: "#e8a860",
    accent: "#f07030",    accentBorder: "#c05020",
    headerBg: "linear-gradient(180deg,#1e1e38 0%,#181828 100%)",
    navBg:    "linear-gradient(0deg,#0c0e18 0%,#181830 100%)",
    scrollTrack: "#0a0c16",   scrollThumb: "#484060",
    noise: "0.040", shadowBot: "rgba(0,0,0,0.88)", shadowCard: "#0a0c16",
    innerDivBg: "#181a30", hpBg: "#0a0c16", addForm: "#201e38",
    modalBg: "#181a30", emptyColor: "#7870a8",
    sessEntry: "#201e38",  combatBox: "#141628",
    spellSlotBox: "#141628", spellSlotBorder: "#3878c8",
    packItem: "#201e38",   packItemBorder: "#2c2a48", packFieldInput: "#101220",
    spellAccent: "#70b8f0", spellBorder: "#3080c0", spellMuted: "#5890d0",
    spellDim: "#1c4880",    spellText: "#d0eaff",   spellBg: "rgba(112,184,240,0.08)",
    questReward: "#a0d858", selectedBg: "rgba(240,112,48,0.12)",
  },

  /* ── PERGAMIN – złociste żółcienie ────────────────────────── */
  pergamin: {
    bg: "#ede8d0",        bgCard: "#f8f2dc",      bgInput: "#e8e0c4",     bgNav: "#ddd6b8",
    border: "#c0a040",    borderSub: "#d0b060",   borderInput: "#b09030",
    text: "#2c1c08",      textMuted: "#7c5018",   textDim: "#9c7030",     textLabel: "#6c3e10",
    accent: "#9a5608",    accentBorder: "#7a3608",
    headerBg: "linear-gradient(180deg,#ddd6b8 0%,#d0c8a0 100%)",
    navBg:    "linear-gradient(0deg,#d0c8a0 0%,#ddd6b8 100%)",
    scrollTrack: "#d8d0b0",   scrollThumb: "#b09030",
    noise: "0.022", shadowBot: "rgba(80,50,10,0.20)", shadowCard: "#c0a040",
    innerDivBg: "#f8f2dc", hpBg: "#d8d0b0", addForm: "#f5eed8",
    modalBg: "#f8f2dc", emptyColor: "#9c7830",
    sessEntry: "#f5eed8",  combatBox: "#e8e0c4",
    spellSlotBox: "#e8e0c4", spellSlotBorder: "#88a8c8",
    packItem: "#ede8d0",   packItemBorder: "#c0a040", packFieldInput: "#e4dcc0",
    spellAccent: "#3a58a0", spellBorder: "#5878b8", spellMuted: "#4868a0",
    spellDim: "#6878c0",    spellText: "#2a3870",   spellBg: "rgba(58,88,160,0.08)",
    questReward: "#3a8a3a", selectedBg: "rgba(154,86,8,0.1)",
  },

  /* ════════════════ MOTYWY JASNE (LIGHT) ════════════════ */

  /* ── OATH (Przysięga) – świętość, boska sprawiedliwość ──── */
  oath: {
    bg: "#f5f0e8",        bgCard: "#fbf8f2",      bgInput: "#efe8da",     bgNav: "#e8e0cc",
    border: "#c8a850",    borderSub: "#d8c080",   borderInput: "#b89840",
    text: "#2c2818",      textMuted: "#8a7850",   textDim: "#a89868",     textLabel: "#6c5828",
    accent: "#c8a020",    accentBorder: "#a07810",
    headerBg: "linear-gradient(180deg,#e8e0cc 0%,#ddd2b4 100%)",
    navBg:    "linear-gradient(0deg,#ddd2b4 0%,#e8e0cc 100%)",
    scrollTrack: "#ddd4ba",   scrollThumb: "#b89840",
    noise: "0.020", shadowBot: "rgba(100,80,40,0.18)", shadowCard: "#c8b888",
    innerDivBg: "#fbf8f2", hpBg: "#ddd4ba", addForm: "#f8f4ea",
    modalBg: "#fbf8f2", emptyColor: "#a89868",
    sessEntry: "#f8f4ea",  combatBox: "#efe8da",
    spellSlotBox: "#efe8da", spellSlotBorder: "#a8c8e0",
    packItem: "#f5f0e8",   packItemBorder: "#c8a850", packFieldInput: "#ece4d2",
    spellAccent: "#5888c0", spellBorder: "#88a8d8", spellMuted: "#7898c0",
    spellDim: "#a8c0e0",    spellText: "#2c4068",   spellBg: "rgba(88,136,192,0.08)",
    questReward: "#5a9850", selectedBg: "rgba(200,160,32,0.12)",
  },

  /* ── ASTRAL – mistyczna, bezkresna przestrzeń ─────────────── */
  astral: {
    bg: "#ece8ec",        bgCard: "#f6f2f6",      bgInput: "#e4dfe6",     bgNav: "#ddd6e0",
    border: "#b8a0d0",    borderSub: "#cabcdc",   borderInput: "#a890c8",
    text: "#2c2438",      textMuted: "#8070a0",   textDim: "#a090b8",     textLabel: "#6c5890",
    accent: "#9870c8",    accentBorder: "#7850a8",
    headerBg: "linear-gradient(180deg,#ddd6e0 0%,#d0c6da 100%)",
    navBg:    "linear-gradient(0deg,#d0c6da 0%,#ddd6e0 100%)",
    scrollTrack: "#d4cbda",   scrollThumb: "#a890c8",
    noise: "0.018", shadowBot: "rgba(80,60,110,0.16)", shadowCard: "#c0b0d4",
    innerDivBg: "#f6f2f6", hpBg: "#d4cbda", addForm: "#f2ecf4",
    modalBg: "#f6f2f6", emptyColor: "#a090b8",
    sessEntry: "#f2ecf4",  combatBox: "#e4dfe6",
    spellSlotBox: "#e4dfe6", spellSlotBorder: "#58c8c0",
    packItem: "#ece8ec",   packItemBorder: "#b8a0d0", packFieldInput: "#e0dae4",
    spellAccent: "#38b8b0", spellBorder: "#60c0b8", spellMuted: "#50a8a0",
    spellDim: "#80c8c0",    spellText: "#1c4844",   spellBg: "rgba(56,184,176,0.08)",
    questReward: "#5a9850", selectedBg: "rgba(152,112,200,0.12)",
  },

  /* ── QUILL (Pióro) – stare księgi i biblioteki ────────────── */
  quill: {
    bg: "#ece0c4",        bgCard: "#f5ecd6",      bgInput: "#e4d8b8",     bgNav: "#ddd0ac",
    border: "#a87850",    borderSub: "#c09868",   borderInput: "#986040",
    text: "#3c2410",      textMuted: "#8a6038",   textDim: "#a8825c",     textLabel: "#704a20",
    accent: "#a05030",    accentBorder: "#803818",
    headerBg: "linear-gradient(180deg,#ddd0ac 0%,#d0c094 100%)",
    navBg:    "linear-gradient(0deg,#d0c094 0%,#ddd0ac 100%)",
    scrollTrack: "#d4c6a0",   scrollThumb: "#986040",
    noise: "0.030", shadowBot: "rgba(80,50,20,0.22)", shadowCard: "#c0a878",
    innerDivBg: "#f5ecd6", hpBg: "#d4c6a0", addForm: "#f2e8d0",
    modalBg: "#f5ecd6", emptyColor: "#a8825c",
    sessEntry: "#f2e8d0",  combatBox: "#e4d8b8",
    spellSlotBox: "#e4d8b8", spellSlotBorder: "#a05030",
    packItem: "#ece0c4",   packItemBorder: "#a87850", packFieldInput: "#e0d2ae",
    spellAccent: "#984828", spellBorder: "#b87050", spellMuted: "#a05838",
    spellDim: "#c89070",    spellText: "#3c2008",   spellBg: "rgba(152,72,40,0.08)",
    questReward: "#4a8838", selectedBg: "rgba(160,80,48,0.12)",
  },

  /* ════════════════ MOTYWY ŚREDNIE (MEDIUM) ════════════════ */

  /* ── FEYWILD – dzika, magiczna kraina elfów ───────────────── */
  feywild: {
    bg: "#1a2818",        bgCard: "#243420",      bgInput: "#1e2c1a",     bgNav: "#162414",
    border: "#4a6840",    borderSub: "#3a5432",   borderInput: "#587048",
    text: "#e0ecd4",      textMuted: "#98b888",   textDim: "#688858",     textLabel: "#b8d8a0",
    accent: "#a868c8",    accentBorder: "#804898",
    headerBg: "linear-gradient(180deg,#243420 0%,#1c2c18 100%)",
    navBg:    "linear-gradient(0deg,#162414 0%,#243420 100%)",
    scrollTrack: "#142010",   scrollThumb: "#587048",
    noise: "0.045", shadowBot: "rgba(0,0,0,0.85)", shadowCard: "#101c0e",
    innerDivBg: "#243420", hpBg: "#142010", addForm: "#2c3c26",
    modalBg: "#243420", emptyColor: "#688858",
    sessEntry: "#2c3c26",  combatBox: "#1e2c1a",
    spellSlotBox: "#1e2c1a", spellSlotBorder: "#a868c8",
    packItem: "#2c3c26",   packItemBorder: "#3a5432", packFieldInput: "#182612",
    spellAccent: "#c890e0", spellBorder: "#9860b8", spellMuted: "#a878c0",
    spellDim: "#6c4880",    spellText: "#f0e0fa",   spellBg: "rgba(168,104,200,0.08)",
    questReward: "#c89048", selectedBg: "rgba(168,104,200,0.12)",
  },

  /* ── ELDRITCH (Wieczny) – paktowa moc czarnoksiężnika ─────── */
  eldritch: {
    bg: "#1c2424",        bgCard: "#283030",      bgInput: "#202828",     bgNav: "#181e1e",
    border: "#3a5858",    borderSub: "#2c4444",   borderInput: "#486868",
    text: "#d8f0ec",      textMuted: "#80a8a4",   textDim: "#587874",     textLabel: "#a0d0c8",
    accent: "#38e070",    accentBorder: "#28a850",
    headerBg: "linear-gradient(180deg,#283030 0%,#202828 100%)",
    navBg:    "linear-gradient(0deg,#181e1e 0%,#283030 100%)",
    scrollTrack: "#141a1a",   scrollThumb: "#486868",
    noise: "0.050", shadowBot: "rgba(0,0,0,0.88)", shadowCard: "#101616",
    innerDivBg: "#283030", hpBg: "#141a1a", addForm: "#2e3838",
    modalBg: "#283030", emptyColor: "#587874",
    sessEntry: "#2e3838",  combatBox: "#202828",
    spellSlotBox: "#202828", spellSlotBorder: "#38e070",
    packItem: "#2e3838",   packItemBorder: "#2c4444", packFieldInput: "#182020",
    spellAccent: "#48d8e0", spellBorder: "#2898a0", spellMuted: "#389098",
    spellDim: "#1c5860",    spellText: "#d0f8fc",   spellBg: "rgba(72,216,224,0.08)",
    questReward: "#d8c848", selectedBg: "rgba(56,224,112,0.12)",
  },

  /* ── DUNGEON (Loch) – wyprawa do kamiennych podziemi ──────── */
  dungeon: {
    bg: "#24262a",        bgCard: "#303338",      bgInput: "#2a2c30",     bgNav: "#1e2024",
    border: "#50545c",    borderSub: "#3e4146",   borderInput: "#5c6068",
    text: "#e8e8ec",      textMuted: "#a0a4ac",   textDim: "#74787e",     textLabel: "#c8ccd2",
    accent: "#e09040",    accentBorder: "#b06c20",
    headerBg: "linear-gradient(180deg,#303338 0%,#282a2e 100%)",
    navBg:    "linear-gradient(0deg,#1e2024 0%,#303338 100%)",
    scrollTrack: "#18191c",   scrollThumb: "#5c6068",
    noise: "0.050", shadowBot: "rgba(0,0,0,0.85)", shadowCard: "#141518",
    innerDivBg: "#303338", hpBg: "#18191c", addForm: "#383b40",
    modalBg: "#303338", emptyColor: "#74787e",
    sessEntry: "#383b40",  combatBox: "#2a2c30",
    spellSlotBox: "#2a2c30", spellSlotBorder: "#5888c0",
    packItem: "#383b40",   packItemBorder: "#3e4146", packFieldInput: "#202226",
    spellAccent: "#78a8e0", spellBorder: "#4878b0", spellMuted: "#6090c8",
    spellDim: "#305078",    spellText: "#e0ecfc",   spellBg: "rgba(120,168,224,0.08)",
    questReward: "#88c850", selectedBg: "rgba(224,144,64,0.12)",
  },

  /* ════════════════ MOTYWY CIEMNE (DARK) ════════════════ */

  /* ── UNDERDARK (Podmrok) – mroczne jaskinie Drowów ────────── */
  underdark: {
    bg: "#0a0810",        bgCard: "#120e1c",      bgInput: "#0e0b16",     bgNav: "#08060e",
    border: "#382850",    borderSub: "#2a1e3c",   borderInput: "#483064",
    text: "#e8d8f8",      textMuted: "#9070b0",   textDim: "#604880",     textLabel: "#c0a0e0",
    accent: "#c030d0",    accentBorder: "#9020a0",
    headerBg: "linear-gradient(180deg,#120e1c 0%,#0c0a16 100%)",
    navBg:    "linear-gradient(0deg,#08060e 0%,#120e1c 100%)",
    scrollTrack: "#06050a",   scrollThumb: "#382850",
    noise: "0.060", shadowBot: "rgba(0,0,0,0.97)", shadowCard: "#050309",
    innerDivBg: "#120e1c", hpBg: "#06050a", addForm: "#1a1428",
    modalBg: "#120e1c", emptyColor: "#684c88",
    sessEntry: "#1a1428",  combatBox: "#0e0b16",
    spellSlotBox: "#0e0b16", spellSlotBorder: "#c030d0",
    packItem: "#1a1428",   packItemBorder: "#2a1e3c", packFieldInput: "#0a0814",
    spellAccent: "#e070f0", spellBorder: "#a040b8", spellMuted: "#b860c8",
    spellDim: "#682880",    spellText: "#fae0ff",   spellBg: "rgba(192,48,208,0.08)",
    questReward: "#58c870", selectedBg: "rgba(192,48,208,0.12)",
  },

  /* ── WRATH (Gniew) – smocza krew, węgiel drzewny i ogień ──── */
  wrath: {
    bg: "#0c0808",        bgCard: "#160e0e",      bgInput: "#110a0a",     bgNav: "#0a0606",
    border: "#5c1c1c",    borderSub: "#441414",   borderInput: "#6c2020",
    text: "#f0d8d0",      textMuted: "#b87060",   textDim: "#804840",     textLabel: "#d8a090",
    accent: "#e84830",    accentBorder: "#b03018",
    headerBg: "linear-gradient(180deg,#160e0e 0%,#100a0a 100%)",
    navBg:    "linear-gradient(0deg,#0a0606 0%,#160e0e 100%)",
    scrollTrack: "#080404",   scrollThumb: "#6c2020",
    noise: "0.060", shadowBot: "rgba(0,0,0,0.97)", shadowCard: "#060303",
    innerDivBg: "#160e0e", hpBg: "#080404", addForm: "#1e1212",
    modalBg: "#160e0e", emptyColor: "#885848",
    sessEntry: "#1e1212",  combatBox: "#110a0a",
    spellSlotBox: "#110a0a", spellSlotBorder: "#d8a830",
    packItem: "#1e1212",   packItemBorder: "#441414", packFieldInput: "#0c0606",
    spellAccent: "#f0c050", spellBorder: "#c89020", spellMuted: "#d0a838",
    spellDim: "#806010",    spellText: "#fff0d0",   spellBg: "rgba(240,192,80,0.08)",
    questReward: "#88c850", selectedBg: "rgba(232,72,48,0.12)",
  },

};
