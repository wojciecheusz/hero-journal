
export const PALETTES = ["wschod", "forest", "oath", "astral", "shore", "feywild", "eldritch", "dungeon", "wrath", "shadowfell"];

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

  /* ════════════════ MOTYWY JASNE (LIGHT) ════════════════ */

  /* ── OATH (Przysięga) – świętość, boska sprawiedliwość ──── */
  oath: {
    bg: "#FFF9D2",        bgCard: "#FFFCE6",      bgInput: "#FFEBCC",     bgNav: "#fbe4bc",
    border: "#8CC0EB",    borderSub: "#BFDDF0",   borderInput: "#6ca8d8",
    text: "#3c3424",      textMuted: "#7c6840",   textDim: "#a89868",     textLabel: "#5a4824",
    accent: "#8CC0EB",    accentBorder: "#5a98c8",
    headerBg: "linear-gradient(180deg,#FFEBCC 0%,#fbe4bc 100%)",
    navBg:    "linear-gradient(0deg,#fbe4bc 0%,#FFEBCC 100%)",
    scrollTrack: "#f5ddb0",   scrollThumb: "#6ca8d8",
    noise: "0.020", shadowBot: "rgba(120,100,60,0.18)", shadowCard: "#e8d4a8",
    innerDivBg: "#FFFCE6", hpBg: "#f5ddb0", addForm: "#fff6e0",
    modalBg: "#FFFCE6", emptyColor: "#a89868",
    sessEntry: "#fff6e0",  combatBox: "#FFEBCC",
    spellSlotBox: "#FFEBCC", spellSlotBorder: "#BFDDF0",
    packItem: "#FFF9D2",   packItemBorder: "#8CC0EB", packFieldInput: "#fdf0d8",
    spellAccent: "#5a98c8", spellBorder: "#8CC0EB", spellMuted: "#7ab0dc",
    spellDim: "#BFDDF0",    spellText: "#2c4868",   spellBg: "rgba(140,192,235,0.10)",
    questReward: "#5a9850", selectedBg: "rgba(140,192,235,0.18)",
  },

  /* ── SHORE (Wybrzeże) – turkusowe fale i piaszczyste plaże ─ */
  shore: {
    bg: "#0e3a38",        bgCard: "#155048",      bgInput: "#114440",     bgNav: "#0a2c2a",
    border: "#26CCC2",    borderSub: "#1a9890",   borderInput: "#6AECE1",
    text: "#e0fffc",      textMuted: "#6AECE1",   textDim: "#4ab8b0",     textLabel: "#FFF57E",
    accent: "#FFB76C",    accentBorder: "#e09040",
    headerBg: "linear-gradient(180deg,#155048 0%,#0e3a38 100%)",
    navBg:    "linear-gradient(0deg,#0a2c2a 0%,#155048 100%)",
    scrollTrack: "#082220",   scrollThumb: "#1a9890",
    noise: "0.040", shadowBot: "rgba(0,10,10,0.55)", shadowCard: "#071c1a",
    innerDivBg: "#155048", hpBg: "#082220", addForm: "#1a5c52",
    modalBg: "#155048", emptyColor: "#4ab8b0",
    sessEntry: "#1a5c52",  combatBox: "#114440",
    spellSlotBox: "#114440", spellSlotBorder: "#FFF57E",
    packItem: "#1a5c52",   packItemBorder: "#0a2c2a", packFieldInput: "#0a2c2a",
    spellAccent: "#6AECE1", spellBorder: "#26CCC2", spellMuted: "#4ab8b0",
    spellDim: "#1a9890",    spellText: "#dafffc",   spellBg: "rgba(106,236,225,0.10)",
    questReward: "#FFF57E", selectedBg: "rgba(255,183,108,0.20)",
  },

  /* ── FEYWILD – dzika, magiczna kraina elfów ───────────────── */
  feywild: {
    bg: "#1a2e28",        bgCard: "#243c34",      bgInput: "#1e342c",     bgNav: "#162420",
    border: "#59B292",    borderSub: "#3c8068",   borderInput: "#59B292",
    text: "#FAE7CB",      textMuted: "#a8d4c0",   textDim: "#7ca890",     textLabel: "#FFC94D",
    accent: "#FA6781",    accentBorder: "#d8475c",
    headerBg: "linear-gradient(180deg,#243c34 0%,#1e342c 100%)",
    navBg:    "linear-gradient(0deg,#162420 0%,#243c34 100%)",
    scrollTrack: "#0f1c18",   scrollThumb: "#3c8068",
    noise: "0.040", shadowBot: "rgba(5,20,15,0.55)", shadowCard: "#0c1814",
    innerDivBg: "#243c34", hpBg: "#0f1c18", addForm: "#2c463c",
    modalBg: "#243c34", emptyColor: "#7ca890",
    sessEntry: "#2c463c",  combatBox: "#1e342c",
    spellSlotBox: "#1e342c", spellSlotBorder: "#FFC94D",
    packItem: "#2c463c",   packItemBorder: "#162420", packFieldInput: "#162420",
    spellAccent: "#FFC94D", spellBorder: "#59B292", spellMuted: "#a8d4c0",
    spellDim: "#3c8068",    spellText: "#FAE7CB",   spellBg: "rgba(255,201,77,0.10)",
    questReward: "#FFC94D", selectedBg: "rgba(250,103,129,0.20)",
  },

  /* ════════════════ MOTYWY ŚREDNIE (MEDIUM) ════════════════ */

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

  /* ── ASTRAL – mistyczna, bezkresna przestrzeń ─────────────── */
  astral: {
    bg: "#1c1d36",        bgCard: "#262848",      bgInput: "#20223c",     bgNav: "#181930",
    border: "#6367FF",    borderSub: "#3e3f70",   borderInput: "#8494FF",
    text: "#e8e8fc",      textMuted: "#8494FF",   textDim: "#6668a8",     textLabel: "#C9BEFF",
    accent: "#6367FF",    accentBorder: "#4548c8",
    headerBg: "linear-gradient(180deg,#262848 0%,#1e2040 100%)",
    navBg:    "linear-gradient(0deg,#181930 0%,#262848 100%)",
    scrollTrack: "#14152a",   scrollThumb: "#4548c8",
    noise: "0.035", shadowBot: "rgba(0,0,0,0.82)", shadowCard: "#101124",
    innerDivBg: "#262848", hpBg: "#14152a", addForm: "#2e3052",
    modalBg: "#262848", emptyColor: "#6668a8",
    sessEntry: "#2e3052",  combatBox: "#20223c",
    spellSlotBox: "#20223c", spellSlotBorder: "#FFDBFD",
    packItem: "#2e3052",   packItemBorder: "#3e3f70", packFieldInput: "#181930",
    spellAccent: "#C9BEFF", spellBorder: "#8494FF", spellMuted: "#a0a8e0",
    spellDim: "#5a5c98",    spellText: "#f0ecff",   spellBg: "rgba(201,190,255,0.10)",
    questReward: "#FFDBFD", selectedBg: "rgba(99,103,255,0.18)",
  },

  /* ════════════════ MOTYWY CIEMNE (DARK) ════════════════ */

  /* ── FOREST (Puszcza) – wilgotna, gęsta gęstwina ─────────── */
  forest: {
    bg: "#1e2a2c",        bgCard: "#283a38",      bgInput: "#223230",     bgNav: "#182422",
    border: "#618764",    borderSub: "#3e5650",   borderInput: "#5a7c68",
    text: "#dce8da",      textMuted: "#9cb080",   textDim: "#6c8470",     textLabel: "#b8cc9c",
    accent: "#9cb080",    accentBorder: "#618764",
    headerBg: "linear-gradient(180deg,#283a38 0%,#1e2c2a 100%)",
    navBg:    "linear-gradient(0deg,#182422 0%,#283a38 100%)",
    scrollTrack: "#141e1e",   scrollThumb: "#5a7c68",
    noise: "0.045", shadowBot: "rgba(0,0,0,0.85)", shadowCard: "#101816",
    innerDivBg: "#283a38", hpBg: "#141e1e", addForm: "#2e423e",
    modalBg: "#283a38", emptyColor: "#6c8470",
    sessEntry: "#2e423e",  combatBox: "#223230",
    spellSlotBox: "#223230", spellSlotBorder: "#9cb080",
    packItem: "#2e423e",   packItemBorder: "#3e5650", packFieldInput: "#182422",
    spellAccent: "#9cb080", spellBorder: "#618764", spellMuted: "#7c9c80",
    spellDim: "#3e5650",    spellText: "#e0ecdc",   spellBg: "rgba(156,176,128,0.08)",
    questReward: "#e6c060", selectedBg: "rgba(156,176,128,0.12)",
  },

  /* ── WRATH (Gniew) – smocza krew, węgiel drzewny i ogień ──── */
  wrath: {
    bg: "#0c0504",        bgCard: "#1a0c09",      bgInput: "#150906",     bgNav: "#0a0403",
    border: "#740A03",    borderSub: "#5c0e08",   borderInput: "#C3110C",
    text: "#f4ddd6",      textMuted: "#d97c5c",   textDim: "#a85040",     textLabel: "#e6803c",
    accent: "#E6501B",    accentBorder: "#C3110C",
    headerBg: "linear-gradient(180deg,#1a0c09 0%,#140a08 100%)",
    navBg:    "linear-gradient(0deg,#0a0403 0%,#1a0c09 100%)",
    scrollTrack: "#080302",   scrollThumb: "#740A03",
    noise: "0.060", shadowBot: "rgba(0,0,0,0.95)", shadowCard: "#050202",
    innerDivBg: "#1a0c09", hpBg: "#080302", addForm: "#220f0b",
    modalBg: "#1a0c09", emptyColor: "#a85040",
    sessEntry: "#220f0b",  combatBox: "#150906",
    spellSlotBox: "#150906", spellSlotBorder: "#E6501B",
    packItem: "#220f0b",   packItemBorder: "#5c0e08", packFieldInput: "#0c0504",
    spellAccent: "#E6501B", spellBorder: "#C3110C", spellMuted: "#d97050",
    spellDim: "#740A03",    spellText: "#ffe4d8",   spellBg: "rgba(230,80,27,0.10)",
    questReward: "#f0c050", selectedBg: "rgba(195,17,12,0.18)",
  },

  /* ── SHADOWFELL – mroczna, wyssana z barw kraina cieni ────── */
  shadowfell: {
    bg: "#2a2638",        bgCard: "#363248",      bgInput: "#302c40",     bgNav: "#252132",
    border: "#5c5478",    borderSub: "#454058",   borderInput: "#7a6ea0",
    text: "#ece4fc",      textMuted: "#a898c0",   textDim: "#807898",     textLabel: "#FFCC00",
    accent: "#B13BFF",    accentBorder: "#8420d0",
    headerBg: "linear-gradient(180deg,#363248 0%,#302c40 100%)",
    navBg:    "linear-gradient(0deg,#252132 0%,#363248 100%)",
    scrollTrack: "#1e1a2a",   scrollThumb: "#5c5478",
    noise: "0.040", shadowBot: "rgba(20,16,32,0.55)", shadowCard: "#1c1828",
    innerDivBg: "#363248", hpBg: "#1e1a2a", addForm: "#3e3a52",
    modalBg: "#363248", emptyColor: "#807898",
    sessEntry: "#3e3a52",  combatBox: "#302c40",
    spellSlotBox: "#302c40", spellSlotBorder: "#FFCC00",
    packItem: "#3e3a52",   packItemBorder: "#454058", packFieldInput: "#252132",
    spellAccent: "#B13BFF", spellBorder: "#471396", spellMuted: "#9858d0",
    spellDim: "#471396",    spellText: "#f0e4ff",   spellBg: "rgba(177,59,255,0.10)",
    questReward: "#FFCC00", selectedBg: "rgba(177,59,255,0.18)",
  },

};
