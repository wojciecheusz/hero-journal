/* Motywy kolorystyczne (P32, audyt czytelności 2026-10-06).
   Zostało 5 motywów. Usunięte: Świt, Drewno, Feywild, Wieczny, Gniew, Łąka;
   Cienista Otchłań scalona z Arkaną (bardzo podobne). Zapisany wybór
   usuniętego motywu jest mapowany na najbliższy (THEME_MIGRATION).

   Progi kontrastu (WCAG, względem tła karty): tekst ≥ 7:1, etykiety ≥ 6:1,
   tekst pomocniczy (textMuted) ≥ 4.8:1, przygaszony (textDim) ≥ 3.4:1,
   akcent i kolor czarów ≥ 4.6:1, kolory stanów (good/warn/bad) ≥ 4.6:1,
   obramowanie pól ≥ 2.3:1. Sprawdza to test __tests__/themes.test.js.

   iconStrength — ile koloru tematycznego zostaje w ikonach (reszta to kolor
   tekstu). Na jasnym Pergaminie kolory ikon są przyciemniane, żeby jasne
   odcienie (złoto, kość) nie ginęły na jasnym tle. */

export const PALETTES = ["arcane", "pergamin", "bone", "dungeon", "wschod"];

export const THEME_MIGRATION = {
  shadowfell: "arcane", eldritch: "dungeon", wrath: "wschod",
  dawn: "pergamin", meadow: "pergamin", feywild: "pergamin", drewno: "bone",
};

export const THEMES = {

  /* ── ARKANA – głęboki granat i złoto (scalona z Cienistą Otchłanią) ── */
  arcane: {
    bg: "#0b0d1e",        bgCard: "#101426",      bgInput: "#0a0b1e",     bgNav: "#070810",
    border: "#3c316e",    borderSub: "#2c2259",   borderInput: "#584495",
    text: "#dccff8",      textMuted: "#8f81b8",   textDim: "#7460a6",     textLabel: "#b4a2e2",
    accent: "#d8ac44",    accentBorder: "#9a7820",
    headerBg: "linear-gradient(180deg,#151830 0%,#0f1228 60%,#0b0d1e 100%)",
    navBg:    "linear-gradient(0deg,#070810 0%,#0c0e20 100%)",
    scrollTrack: "#060608",   scrollThumb: "#584495",
    noise: "0.022", shadowBot: "rgba(0,0,0,0.85)", shadowCard: "rgba(0,0,0,0.40)",
    shadowSoft: "rgba(0,0,0,0.30)",
    innerDivBg: "#101426", hpBg: "#080a18", addForm: "#141830",
    modalBg: "#101426", emptyColor: "#7460a6",
    sessEntry: "#0a0b1e",  combatBox: "#0a0b1e",
    spellSlotBox: "#0a0b1e", spellSlotBorder: "#2a50a0",
    packItem: "#141830",   packItemBorder: "#3c316e", packFieldInput: "#080a18",
    spellAccent: "#78aef2", spellBorder: "#3060c0", spellMuted: "#5888d4",
    spellDim: "#1a3880",    spellText: "#d8ecff",   spellBg: "rgba(120,174,242,0.08)",
    questReward: "#50c068", selectedBg: "rgba(216,172,68,0.12)",
    good: "#4caf50", warn: "#d08020", bad: "#e05c5c", iconStrength: "100%",
  },

  /* ── PERGAMIN – zgaszony, ciepły, neutralny (jasny) ──────── */
  pergamin: {
    bg: "#ddd6c2",        bgCard: "#ece5d2",      bgInput: "#d8d0bc",     bgNav: "#d2cab4",
    border: "#b4a471",    borderSub: "#c3b898",   borderInput: "#a6956a",
    text: "#2e261c",      textMuted: "#665840",   textDim: "#887858",     textLabel: "#5c4d34",
    accent: "#765422",    accentBorder: "#8a6024",
    headerBg: "linear-gradient(180deg,#d2cab4 0%,#c4bca4 100%)",
    navBg:    "linear-gradient(0deg,#c4bca4 0%,#d2cab4 100%)",
    scrollTrack: "#cfc7b0",   scrollThumb: "#a6956a",
    noise: "0.016", shadowBot: "rgba(60,45,20,0.16)", shadowCard: "rgba(60,45,20,0.10)",
    shadowSoft: "rgba(60,45,20,0.07)",
    innerDivBg: "#ece5d2", hpBg: "#cfc7b0", addForm: "#e8e1cc",
    modalBg: "#ece5d2", emptyColor: "#887858",
    sessEntry: "#e8e1cc",  combatBox: "#d8d0bc",
    spellSlotBox: "#d8d0bc", spellSlotBorder: "#8aa0b0",
    packItem: "#e4ddc8",   packItemBorder: "#b4a471", packFieldInput: "#d4ccb6",
    spellAccent: "#4f6490", spellBorder: "#7888ac", spellMuted: "#5c6e98",
    spellDim: "#8898bc",    spellText: "#2e3a58",   spellBg: "rgba(79,100,144,0.10)",
    questReward: "#3e6e30", selectedBg: "rgba(118,84,34,0.12)",
    good: "#2a722e", warn: "#925600", bad: "#b02a2a", iconStrength: "62%",
  },

  /* ── KOŚĆ – pożółkłe biele, popiel, czernie ──────────────── */
  bone: {
    bg: "#0c0b09",        bgCard: "#181510",      bgInput: "#141210",     bgNav: "#0a0908",
    border: "#443724",    borderSub: "#31281b",   borderInput: "#624f35",
    text: "#ece4d0",      textMuted: "#a89878",   textDim: "#7a6f5c",     textLabel: "#ccbea8",
    accent: "#c8a868",    accentBorder: "#9a7a48",
    headerBg: "linear-gradient(180deg,#181510 0%,#110f0d 100%)",
    navBg:    "linear-gradient(0deg,#0a0908 0%,#141210 100%)",
    scrollTrack: "#080706",   scrollThumb: "#624f35",
    noise: "0.035", shadowBot: "rgba(0,0,0,0.98)", shadowCard: "#080706",
    shadowSoft: "rgba(0,0,0,0.35)",
    innerDivBg: "#181510", hpBg: "#080706", addForm: "#1e1a14",
    modalBg: "#181510", emptyColor: "#7a6f5c",
    sessEntry: "#1e1a14",  combatBox: "#141210",
    spellSlotBox: "#141210", spellSlotBorder: "#443724",
    packItem: "#1e1a14",   packItemBorder: "#31281b", packFieldInput: "#0e0c0a",
    spellAccent: "#a8c0d8", spellBorder: "#607888", spellMuted: "#8090a8",
    spellDim: "#404e5c",    spellText: "#e0f0f8",   spellBg: "rgba(168,192,216,0.08)",
    questReward: "#88a858", selectedBg: "rgba(200,168,104,0.12)",
    good: "#5cae5c", warn: "#d08a30", bad: "#e05c5c", iconStrength: "100%",
  },

  /* ── LOCH – wyprawa do kamiennych podziemi ──────────────── */
  dungeon: {
    bg: "#24262a",        bgCard: "#303338",      bgInput: "#2a2c30",     bgNav: "#1e2024",
    border: "#50545c",    borderSub: "#3e4146",   borderInput: "#666a73",
    text: "#eeeef2",      textMuted: "#a8acb4",   textDim: "#85898f",     textLabel: "#cdd1d7",
    accent: "#e49646",    accentBorder: "#b06c20",
    headerBg: "linear-gradient(180deg,#303338 0%,#282a2e 100%)",
    navBg:    "linear-gradient(0deg,#1e2024 0%,#303338 100%)",
    scrollTrack: "#18191c",   scrollThumb: "#666a73",
    noise: "0.030", shadowBot: "rgba(0,0,0,0.85)", shadowCard: "#141518",
    shadowSoft: "rgba(0,0,0,0.30)",
    innerDivBg: "#303338", hpBg: "#18191c", addForm: "#383b40",
    modalBg: "#303338", emptyColor: "#85898f",
    sessEntry: "#383b40",  combatBox: "#2a2c30",
    spellSlotBox: "#2a2c30", spellSlotBorder: "#5888c0",
    packItem: "#383b40",   packItemBorder: "#3e4146", packFieldInput: "#202226",
    spellAccent: "#80aee4", spellBorder: "#4878b0", spellMuted: "#6896cc",
    spellDim: "#305078",    spellText: "#e0ecfc",   spellBg: "rgba(128,174,228,0.08)",
    questReward: "#88c850", selectedBg: "rgba(228,150,70,0.12)",
    good: "#5ab65e", warn: "#e09030", bad: "#ec8a8a", iconStrength: "100%",
  },

  /* ── WSCHÓD – pomarańcze i granaty ───────────────────────── */
  wschod: {
    bg: "#0e1020",        bgCard: "#181a30",      bgInput: "#141628",     bgNav: "#0c0e18",
    border: "#3b395a",    borderSub: "#2c2a48",   borderInput: "#5a5078",
    text: "#ffecd8",      textMuted: "#d09060",   textDim: "#8f80b6",     textLabel: "#e8a860",
    accent: "#f07030",    accentBorder: "#c05020",
    headerBg: "linear-gradient(180deg,#1e1e38 0%,#181828 100%)",
    navBg:    "linear-gradient(0deg,#0c0e18 0%,#181830 100%)",
    scrollTrack: "#0a0c16",   scrollThumb: "#5a5078",
    noise: "0.030", shadowBot: "rgba(0,0,0,0.88)", shadowCard: "#0a0c16",
    shadowSoft: "rgba(0,0,0,0.30)",
    innerDivBg: "#181a30", hpBg: "#0a0c16", addForm: "#201e38",
    modalBg: "#181a30", emptyColor: "#8f80b6",
    sessEntry: "#201e38",  combatBox: "#141628",
    spellSlotBox: "#141628", spellSlotBorder: "#3878c8",
    packItem: "#201e38",   packItemBorder: "#2c2a48", packFieldInput: "#101220",
    spellAccent: "#70b8f0", spellBorder: "#3080c0", spellMuted: "#5890d0",
    spellDim: "#1c4880",    spellText: "#d0eaff",   spellBg: "rgba(112,184,240,0.08)",
    questReward: "#a0d858", selectedBg: "rgba(240,112,48,0.12)",
    good: "#4caf50", warn: "#d89030", bad: "#e06464", iconStrength: "100%",
  },
};
