import { useState, useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════
   SYSTEM MOTYWÓW GRAFICZNYCH
═══════════════════════════════════════════════ */
const PALETTES = ["obsidian", "dark", "slate", "parchment", "ivory", "daylight"];
const PALETTE_LABELS = {
  obsidian: "⬛ Obsydian", dark: "🌑 Mrok", slate: "🌊 Łupek",
  parchment: "📜 Pergamin", ivory: "🪶 Kość Słoniowa", daylight: "☀ Światło Dnia",
};
const THEMES = {
  obsidian: {
    bg: "#080608", bgCard: "#110d12", bgInput: "#0d0a0f", bgNav: "#07050a",
    border: "#2e2438", borderSub: "#231c2e", borderInput: "#2e2040",
    text: "#e8ddf5", textMuted: "#9a88b8", textDim: "#6a5880", textLabel: "#c8b8e8",
    accent: "#c89eff", accentBorder: "#9060d0",
    headerBg: "linear-gradient(180deg,#110d12 0%,#0a0810 100%)", navBg: "linear-gradient(0deg,#07050a 0%,#100c14 100%)",
    scrollTrack: "#060408", scrollThumb: "#2e2040",
    noise: "0.055", shadowBot: "rgba(0,0,0,0.9)", shadowCard: "#060408",
    innerDivBg: "#110d12", hpBg: "#060408", addForm: "#130f18",
    modalBg: "#110d12", emptyColor: "#5a4870",
    sessEntry: "#130f18", combatBox: "#0d0a0f",
    spellSlotBox: "#110d12", spellSlotBorder: "#2e2040",
    packItem: "#130f18", packItemBorder: "#1e1830", packFieldInput: "#0a0810",
    spellAccent: "#c89eff", spellBorder: "#6040a0", spellMuted: "#9070c0",
    spellDim: "#4a3070", spellText: "#e8d8ff", spellBg: "rgba(200,158,255,0.08)",
    questReward: "#5a9a5a",
  },
  dark: {
    bg: "#0f0d0b", bgCard: "#1c1810", bgInput: "#130f0c", bgNav: "#0d0b08",
    border: "#352e1e", borderSub: "#2a2418", borderInput: "#3a3220",
    text: "#ddd5bb", textMuted: "#9a8050", textDim: "#6a5830", textLabel: "#b09050",
    accent: "#e2b94e", accentBorder: "#8a6830",
    headerBg: "linear-gradient(180deg,#1c1810 0%,#141008 100%)", navBg: "linear-gradient(0deg,#0d0b08 0%,#161210 100%)",
    scrollTrack: "#0a0806", scrollThumb: "#3a3020",
    noise: "0.045", shadowBot: "rgba(0,0,0,0.8)", shadowCard: "#0a0806",
    innerDivBg: "#1c1810", hpBg: "#0a0806", addForm: "#171208",
    modalBg: "#1c1810", emptyColor: "#6a5a38",
    sessEntry: "#171208", combatBox: "#130f0c",
    spellSlotBox: "#130f0c", spellSlotBorder: "#1a3a6a",
    packItem: "#1a1510", packItemBorder: "#2e2618", packFieldInput: "#0f0c09",
    spellAccent: "#64a0e6", spellBorder: "#1a4a8a", spellMuted: "#4a7aaa",
    spellDim: "#2a4a6a", spellText: "#c8d8f0", spellBg: "rgba(100,160,230,0.08)",
    questReward: "#5a9a5a",
  },
  slate: {
    bg: "#0d1117", bgCard: "#161b22", bgInput: "#0d1117", bgNav: "#090d13",
    border: "#30363d", borderSub: "#21262d", borderInput: "#3a4149",
    text: "#c9d1d9", textMuted: "#8b949e", textDim: "#484f58", textLabel: "#8b949e",
    accent: "#58a6ff", accentBorder: "#1f6feb",
    headerBg: "linear-gradient(180deg,#161b22 0%,#0d1117 100%)", navBg: "linear-gradient(0deg,#090d13 0%,#131920 100%)",
    scrollTrack: "#090d13", scrollThumb: "#21262d",
    noise: "0.03", shadowBot: "rgba(0,0,0,0.85)", shadowCard: "#090d13",
    innerDivBg: "#161b22", hpBg: "#090d13", addForm: "#0d1117",
    modalBg: "#161b22", emptyColor: "#484f58",
    sessEntry: "#0d1117", combatBox: "#161b22",
    spellSlotBox: "#161b22", spellSlotBorder: "#1f4a8a",
    packItem: "#161b22", packItemBorder: "#21262d", packFieldInput: "#090d13",
    spellAccent: "#58a6ff", spellBorder: "#1f6feb", spellMuted: "#388bfd",
    spellDim: "#0a2a5a", spellText: "#cae8ff", spellBg: "rgba(88,166,255,0.08)",
    questReward: "#3fb950",
  },
  parchment: {
    bg: "#f0e8d5", bgCard: "#faf3e4", bgInput: "#ede3cc", bgNav: "#e8dcc8",
    border: "#c8a86a", borderSub: "#d4b87a", borderInput: "#c0a060",
    text: "#2a1e0a", textMuted: "#6a4a1a", textDim: "#8a6030", textLabel: "#7a5020",
    accent: "#9a5a10", accentBorder: "#7a4008",
    headerBg: "linear-gradient(180deg,#e8dcc8 0%,#ddd0b0 100%)", navBg: "linear-gradient(0deg,#ddd0b0 0%,#e8dcc8 100%)",
    scrollTrack: "#e0d4b8", scrollThumb: "#c0a060",
    noise: "0.025", shadowBot: "rgba(80,50,10,0.25)", shadowCard: "#c8a86a",
    innerDivBg: "#faf3e4", hpBg: "#e0d4b8", addForm: "#f5ecda",
    modalBg: "#faf3e4", emptyColor: "#9a7840",
    sessEntry: "#f5ecda", combatBox: "#ede3cc",
    spellSlotBox: "#ede3cc", spellSlotBorder: "#8ab0d0",
    packItem: "#f0e8d5", packItemBorder: "#c8a86a", packFieldInput: "#e8dcc8",
    spellAccent: "#3a5a9a", spellBorder: "#5a7ab0", spellMuted: "#4a5a8a",
    spellDim: "#6a7aaa", spellText: "#2a3a6a", spellBg: "rgba(58,90,154,0.08)",
    questReward: "#3a6a3a",
  },
  ivory: {
    bg: "#f8f6f0", bgCard: "#ffffff", bgInput: "#f2ede4", bgNav: "#ede8de",
    border: "#d4c8a8", borderSub: "#e0d8c0", borderInput: "#c8b890",
    text: "#1a1508", textMuted: "#5a4a20", textDim: "#8a7840", textLabel: "#4a3a10",
    accent: "#0f7a6a", accentBorder: "#0a5a4a",
    headerBg: "linear-gradient(180deg,#f0ece0 0%,#e8e0d0 100%)", navBg: "linear-gradient(0deg,#e8e0d0 0%,#f0ece0 100%)",
    scrollTrack: "#ede8de", scrollThumb: "#c8b890",
    noise: "0.018", shadowBot: "rgba(60,50,30,0.18)", shadowCard: "#d4c8a8",
    innerDivBg: "#ffffff", hpBg: "#e8e0d0", addForm: "#f8f4ec",
    modalBg: "#ffffff", emptyColor: "#8a7840",
    sessEntry: "#f8f4ec", combatBox: "#f2ede4",
    spellSlotBox: "#f2ede4", spellSlotBorder: "#5a9ab0",
    packItem: "#f8f6f0", packItemBorder: "#d4c8a8", packFieldInput: "#f0ece0",
    spellAccent: "#0f8a78", spellBorder: "#0a6a58", spellMuted: "#2a7a6a",
    spellDim: "#0a4a3a", spellText: "#e0f8f4", spellBg: "rgba(15,122,106,0.08)",
    questReward: "#2a7a3a",
  },
  daylight: {
    bg: "#ffffff", bgCard: "#f8f8fc", bgInput: "#f0f0f8", bgNav: "#e8e8f4",
    border: "#c8c0e0", borderSub: "#d8d0f0", borderInput: "#b8b0d8",
    text: "#1a1430", textMuted: "#5a5070", textDim: "#8a8098", textLabel: "#3a304a",
    accent: "#c0392b", accentBorder: "#922b21",
    headerBg: "linear-gradient(180deg,#f0f0f8 0%,#e8e8f4 100%)", navBg: "linear-gradient(0deg,#e0e0ec 0%,#ebebf5 100%)",
    scrollTrack: "#e8e8f4", scrollThumb: "#c0b8d8",
    noise: "0.012", shadowBot: "rgba(40,30,60,0.15)", shadowCard: "#c8c0e0",
    innerDivBg: "#f8f8fc", hpBg: "#e8e8f4", addForm: "#f4f4fa",
    modalBg: "#f8f8fc", emptyColor: "#8a8098",
    sessEntry: "#f4f4fa", combatBox: "#f0f0f8",
    spellSlotBox: "#f0f0f8", spellSlotBorder: "#8ab8d0",
    packItem: "#f8f8fc", packItemBorder: "#d8d0f0", packFieldInput: "#ebebf5",
    spellAccent: "#2980b9", spellBorder: "#1a6a9a", spellMuted: "#3a90c9",
    spellDim: "#0a3a5a", spellText: "#d0eeff", spellBg: "rgba(41,128,185,0.08)",
    questReward: "#27ae60",
  },
};

function buildCSS(t) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100vh; background: ${t.bg}; }
  .hj-root { position: relative; min-height: 100vh; background: ${t.bg}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; line-height: 1.55; padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px)); }
  .hj-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: ${t.noise}; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); background-repeat: repeat; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${t.scrollTrack}; }
  ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; }

  .hj-header { position: sticky; top: 0; z-index: 50; background: ${t.headerBg}; border-bottom: 1px solid ${t.border}; box-shadow: 0 4px 32px ${t.shadowBot}; padding: calc(env(safe-area-inset-top,0px) + 0.75rem) 1.25rem 0.75rem; }
  .hj-logo { font-family: 'Cinzel Decorative', serif; font-size: 1.05rem; font-weight: 700; color: ${t.accent}; letter-spacing: 0.1em; display: flex; align-items: center; gap: 0.5rem; }
  .hj-char-name { font-family: 'Cinzel', serif; font-size: 0.72rem; color: ${t.textMuted}; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }

  .hj-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: ${t.navBg}; border-top: 1px solid ${t.border}; box-shadow: 0 -4px 32px ${t.shadowBot}; display: flex; align-items: flex-start; padding-top: 0; padding-bottom: env(safe-area-inset-bottom, 0px); padding-left: env(safe-area-inset-left, 0px); padding-right: env(safe-area-inset-right, 0px); }

  .hj-nav-btn { flex: 1; height: 68px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem; background: transparent; border: none; cursor: pointer; transition: all 0.18s; padding: 0.3rem 0.25rem; position: relative; }
  .hj-nav-btn::before { content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 2px; background: ${t.accent}; transform: scaleX(0); transition: transform 0.2s; border-radius: 0 0 2px 2px; }
  .hj-nav-btn.active::before { transform: scaleX(1); }
  .hj-nav-icon { font-size: 1.2rem; line-height: 1; filter: grayscale(1) brightness(0.45); transition: filter 0.18s; }
  .hj-nav-btn.active .hj-nav-icon, .hj-nav-btn.group-active .hj-nav-icon { filter: grayscale(0) brightness(1); }
  .hj-nav-label { font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.textDim}; transition: color 0.18s; }
  .hj-nav-btn.active .hj-nav-label, .hj-nav-btn.group-active .hj-nav-label { color: ${t.accent}; }
  .hj-nav-sub { font-family: 'Cinzel', serif; font-size: 0.38rem; letter-spacing: 0.06em; text-transform: uppercase; color: ${t.textDim}; opacity: 0.6; transition: color 0.18s; margin-top: 0.05rem; }
  .hj-nav-btn.active .hj-nav-sub, .hj-nav-btn.group-active .hj-nav-sub { color: ${t.textMuted}; opacity: 0.8; }

  .nav-drawer-overlay { position: fixed; inset: 0; z-index: 98; background: transparent; }

  .nav-drawer { position: fixed; bottom: calc(68px + env(safe-area-inset-bottom, 0px)); left: 0; right: 0; z-index: 99; background: ${t.navBg}; border-top: 1px solid ${t.border}; border-bottom: none; box-shadow: 0 -8px 32px ${t.shadowBot}; padding: 0.6rem 0.5rem calc(0.6rem + env(safe-area-inset-bottom,0px)); display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .nav-drawer-item { flex: 1; min-width: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; background: transparent; border: 1px solid transparent; cursor: pointer; transition: all 0.15s; padding: 0.5rem 0.4rem; border-radius: 2px; }
  .nav-drawer-item:hover { background: rgba(226,185,78,0.06); border-color: ${t.border}; }
  .nav-drawer-item.active { background: rgba(226,185,78,1.0); border-color: ${t.accentBorder}; }
  .nav-drawer-icon { font-size: 1.3rem; line-height: 1; }
  .nav-drawer-label { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; }
  .nav-drawer-item.active .nav-drawer-label { color: ${t.accent}; }

  .hj-content { max-width: 780px; margin: 0 auto; padding: 1.4rem 1rem 2rem; display: flex; flex-direction: column; gap: 1rem; }

  .card { background: ${t.bgCard}; border: 1px solid ${t.border}; box-shadow: 0 3px 0 ${t.shadowCard}, inset 0 1px 0 rgba(226,185,78,0.05); padding: 1.25rem; position: relative; border-radius: 2px; }
  .card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(226,185,78,0.02) 0%,transparent 55%); pointer-events: none; }
  .card::before { border-radius: 2px; }
  .card.pinned { border-color: ${t.accentBorder}; }
  .card.pinned::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,${t.accent},transparent); pointer-events: none; }
  .card.inuse-active { border-color: #5a3a8a; }
  .card.inuse-active::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,#a87acc,transparent); pointer-events: none; }
  .card.spell-active { border-color: #1a3a6a; }
  .card.spell-active::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,#64a0e6,transparent); pointer-events: none; }

  .inner-divider { border: none; border-top: 1px solid ${t.borderSub}; margin: 1.1rem 0; position: relative; }
  .inner-divider::before { content: attr(data-label); position: absolute; top: 50%; left: 0; transform: translateY(-50%); background: ${t.innerDivBg}; padding-right: 0.6rem; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.textLabel}; }

  .sect-label { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: ${t.textLabel}; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.85rem; }
  .sect-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg,${t.border},transparent); }

  .iedit { background: transparent; border: none; border-bottom: 1px dashed ${t.borderInput}; color: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; font-style: inherit; outline: none; width: 100%; transition: border-color 0.15s; line-height: inherit; padding: 0; }
  .iedit:focus { border-bottom-color: ${t.accent}; }
  .iedit::placeholder { color: ${t.textDim}; }

  .g-input { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; padding: 0.5rem 0.85rem; outline: none; width: 100%; transition: border-color 0.15s; }
  .g-input:focus { border-color: ${t.accentBorder}; box-shadow: 0 0 0 1px ${t.accentBorder}; }
  .g-input::placeholder { color: ${t.textDim}; font-style: italic; }

  .g-select { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1rem; padding: 0.45rem 0.75rem; outline: none; width: 100%; transition: border-color 0.15s; appearance: none; cursor: pointer; }
  .g-select:focus { border-color: ${t.accentBorder}; box-shadow: 0 0 0 1px ${t.accentBorder}; }

  .g-textarea { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; padding: 0.75rem 0.85rem; outline: none; width: 100%; resize: vertical; transition: border-color 0.15s; line-height: 1.65; }
  .g-textarea:focus { border-color: ${t.accentBorder}; box-shadow: 0 0 0 1px ${t.accentBorder}; }
  .g-textarea::placeholder { color: ${t.textDim}; font-style: italic; }

  .btn-gold { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; background: transparent; color: ${t.accent}; border: 1px solid ${t.accentBorder}; padding: 0.48rem 1.1rem; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-gold:hover { background: rgba(226,185,78,0.12); border-color: ${t.accent}; }
  .btn-ghost { background: transparent; border: 1px solid ${t.borderInput}; color: ${t.textMuted}; font-size: 0.72rem; padding: 0.28rem 0.65rem; cursor: pointer; transition: all 0.15s; font-family: 'Cinzel', serif; letter-spacing: 0.06em; }
  .btn-ghost:hover { border-color: #9b2c2c; color: #c04040; }
  .btn-danger { background: transparent; border: 1px solid #6a2a2a; color: #c04040; font-size: 0.68rem; padding: 0.28rem 0.65rem; cursor: pointer; transition: all 0.15s; font-family: 'Cinzel', serif; letter-spacing: 0.08em; text-transform: uppercase; }
  .btn-danger:hover { background: rgba(192,64,64,0.12); border-color: #c04040; }
  .btn-sm { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; color: ${t.textMuted}; border: 1px solid ${t.borderInput}; padding: 0.25rem 0.6rem; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-sm:hover { border-color: ${t.accentBorder}; color: ${t.accent}; }
  .btn-pm { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1px solid ${t.borderInput}; color: ${t.textMuted}; font-size: 1.2rem; cursor: pointer; transition: all 0.15s; flex-shrink: 0; font-family: monospace; }
  .btn-pm.minus:hover { border-color: #7a2a2a; color: #e04040; }
  .btn-pm.plus:hover  { border-color: #2a6a2a; color: #5acc5a; }

  .btn-rest { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; border: 1px solid ${t.borderInput}; color: ${t.textMuted}; padding: 0.3rem 0.4rem; cursor: pointer; transition: all 0.15s; white-space: normal; min-width: 0; overflow: hidden; border-radius: 2px; }
  .btn-rest.short:hover { border-color: #8a7030; color: #d4a030; background: rgba(212,160,48,0.08); }
  .btn-rest.long:hover  { border-color: #2a5a8a; color: #64a0d4; background: rgba(100,160,212,0.08); }

  .tags-row { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin-top: 0.55rem; }
  .tag { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.18rem 0.55rem; display: inline-flex; align-items: center; gap: 0.3rem; white-space: nowrap; border-radius: 2px; }
  .tag-default { background: rgba(226,185,78,0.08); border: 1px solid ${t.border}; color: ${t.textLabel}; }
  .tag-remove { background: transparent; border: none; color: ${t.textDim}; cursor: pointer; font-size: 0.6rem; padding: 0; line-height: 1; transition: color 0.15s; }
  .tag-remove:hover { color: #c04040; }
  .tag-input { background: transparent; border: none; border-bottom: 1px dashed ${t.borderInput}; color: ${t.textLabel}; font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; outline: none; width: 80px; padding: 0.1rem 0; }
  .tag-add-btn { background: transparent; border: 1px dashed ${t.borderSub}; color: ${t.textDim}; font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.08em; padding: 0.18rem 0.5rem; cursor: pointer; transition: all 0.15s; }
  .tag-add-btn:hover { border-color: ${t.accentBorder}; color: ${t.textLabel}; }

  .filter-bar { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; margin-bottom: 0.8rem; }
  .filter-tag { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border: 1px solid ${t.border}; color: ${t.textMuted}; cursor: pointer; transition: all 0.15s; background: transparent; }
  .filter-tag.active-filter { background: rgba(226,185,78,0.1); border-color: ${t.accentBorder}; color: ${t.accent}; }
  .filter-tag:hover:not(.active-filter) { border-color: ${t.borderInput}; color: ${t.textLabel}; }

  .stat-grid-6 { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.5rem; }
  @media (max-width:500px) { .stat-grid-6 { grid-template-columns: repeat(3,1fr); } }
  .stat-box { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.65rem 0.3rem 0.55rem; cursor: pointer; transition: all 0.15s; user-select: none; border-radius: 2px; }
  .stat-box:hover { border-color: ${t.accentBorder}; }
  .stat-box.editing { border-color: ${t.accent}; }
  .stat-box.stat-box-prz { border-color: ${t.accentBorder}; background: rgba(226,185,78,0.05); }
  .stat-box.stat-box-exp  { border-color: var(--spell-border); background: var(--spell-bg); }
  .stat-name { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.15em; color: ${t.textLabel}; display: block; margin-bottom: 0.25rem; }
  .stat-val  { font-family: 'Cinzel', serif; font-size: 1.5rem; font-weight: 700; color: ${t.accent}; line-height: 1.1; display: block; }
  .stat-mod  { font-family: 'Cinzel', serif; font-size: 0.62rem; color: ${t.textMuted}; display: block; margin-top: 0.15rem; }
  .stat-input { background: transparent; border: none; border-bottom: 1px solid ${t.accent}; color: ${t.accent}; font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; width: 100%; text-align: center; outline: none; }

  .hp-bar-bg { height: 10px; background: ${t.hpBg}; border: 1px solid ${t.borderSub}; position: relative; overflow: hidden; margin-top: 0.7rem; }
  .hp-bar-fill { height: 100%; transition: width 0.35s ease, background 0.5s ease; }
  .hp-display { font-family: 'Cinzel', serif; font-size: 1.5rem; display: flex; align-items: center; gap: 0.2rem; }
  .hp-pct { font-family: 'Cinzel', serif; font-size: 0.58rem; text-align: right; margin-top: 0.25rem; transition: color 0.5s; }
  .combat-box { background: ${t.combatBox}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.5rem 0.3rem; border-radius: 2px; }
  .combat-box-label { font-family: 'Cinzel', serif; font-size: 0.54rem; letter-spacing: 0.14em; color: ${t.textLabel}; display: block; margin-bottom: 0.2rem; }
  .combat-box-val { font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 700; color: ${t.accent}; display: block; }
  .combat-box-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 700; color: ${t.accent}; text-align: center; width: 100%; }

  .check-row { display: flex; align-items: center; gap: 0.45rem; padding: 0.22rem 0.3rem; border-bottom: 1px solid ${t.borderSub}; }
  .check-row:last-child { border-bottom: none; }
  .check-label { font-family: 'Crimson Text', Georgia, serif; font-size: 0.95rem; color: ${t.text}; flex: 1; }
  .check-bonus { font-family: 'Cinzel', serif; font-size: 0.82rem; font-weight: 700; color: ${t.accent}; min-width: 28px; text-align: right; }

  .trait-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
  @media (max-width:480px) { .trait-grid { grid-template-columns: 1fr; } }
  .trait-block { display: flex; flex-direction: column; gap: 0.3rem; }
  .trait-label { font-family: 'Cinzel', serif; font-size: 0.54rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.textLabel}; }
  .trait-ta { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 0.95rem; padding: 0.5rem 0.65rem; outline: none; width: 100%; resize: vertical; line-height: 1.55; }
  .trait-ta:focus { border-color: ${t.accentBorder}; }
  .trait-ta::placeholder { color: ${t.textDim}; font-style: italic; }
  .class-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.2rem 0; }

  .subtab-bar { display: flex; gap: 0; border-bottom: 1px solid ${t.border}; margin-bottom: 0.85rem; }
  .subtab-btn { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.4rem 0.9rem 0.45rem; background: transparent; border: none; border-bottom: 2px solid transparent; color: ${t.textDim}; cursor: pointer; transition: all 0.15s; margin-bottom: -1px; border-radius: 2px 2px 0 0; }
  .subtab-btn.active { color: ${t.accent}; border-bottom-color: ${t.accent}; }
  .subtab-btn:hover:not(.active) { color: ${t.textMuted}; }

  .equipped-item { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.5rem 0; border-bottom: 1px solid ${t.borderSub}; border-left: 2px solid transparent; padding-left: 0.4rem; transition: border-color 0.15s; }
  .equipped-item:last-child { border-bottom: none; }
  .equipped-item:hover { border-left-color: ${t.accent}; }
  .equipped-icon { font-size: 1.05rem; flex-shrink: 0; line-height: 1.3; }
  .equipped-name { font-family: 'Cinzel', serif; font-size: 0.78rem; font-weight: 700; color: ${t.text}; }
  .equipped-stat { font-family: 'Crimson Text', Georgia, serif; font-size: 0.88rem; color: ${t.textMuted}; font-style: italic; }
  .equipped-type-badge { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.1rem 0.35rem; border: 1px solid ${t.borderInput}; color: ${t.textMuted}; flex-shrink: 0; }
  .equipped-skill-badge { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.1rem 0.35rem; border: 1px solid #5a3a8a; color: #a87acc; background: rgba(168,122,204,0.08); flex-shrink: 0; }
  .equipped-spell-badge { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.1rem 0.35rem; border: 1px solid #1a4a8a; color: var(--spell-accent); background: rgba(100,160,230,0.08); flex-shrink: 0; }

  .spell-slot-box { background: ${t.spellSlotBox}; border: 1px solid ${t.spellSlotBorder}; text-align: center; padding: 0.4rem 0.2rem; }
  .spell-slot-label { font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.1em; color: var(--spell-muted); display: block; margin-bottom: 0.2rem; }
  .spell-slot-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 700; color: var(--spell-accent); text-align: center; width: 100%; }

  .pack-item { background: ${t.packItem}; border: 1px solid ${t.packItemBorder}; padding: 0.7rem 0.85rem; margin-bottom: 0.4rem; transition: border-color 0.15s; border-radius: 2px; }
  .pack-item.equipped-active { border-color: ${t.accentBorder}; border-left: 3px solid ${t.accent}; }
  .pack-item-header { display: flex; align-items: center; gap: 0.5rem; }
  .pack-item-body { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem; }
  .pack-item-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .pack-field { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; min-width: 80px; }
  .pack-field-label { font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.textMuted}; }
  .pack-field-input { background: ${t.packFieldInput}; border: 1px solid ${t.packItemBorder}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 0.9rem; padding: 0.25rem 0.45rem; outline: none; width: 100%; transition: border-color 0.15s; }
  .pack-field-input:focus { border-color: ${t.accentBorder}; }
  .pack-field-input::placeholder { color: ${t.textDim}; font-style: italic; }

  .toggle-wrap { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; user-select: none; }
  .toggle-track { width: 32px; height: 17px; border-radius: 9px; background: ${t.borderSub}; border: 1px solid ${t.borderInput}; position: relative; transition: all 0.2s; flex-shrink: 0; }
  .toggle-track.on { background: rgba(226,185,78,0.25); border-color: ${t.accentBorder}; }
  .toggle-track.on-purple { background: rgba(168,122,204,0.25); border-color: #9a6acc; }
  .toggle-track.on-blue   { background: rgba(100,160,230,0.22); border-color: #4a90d6; }
  .toggle-thumb { width: 11px; height: 11px; border-radius: 50%; background: ${t.textDim}; position: absolute; top: 2px; left: 2px; transition: all 0.2s; }
  .toggle-track.on .toggle-thumb, .toggle-track.on-purple .toggle-thumb, .toggle-track.on-blue .toggle-thumb { left: 17px; }
  .toggle-track.on .toggle-thumb { background: ${t.accent}; }
  .toggle-track.on-purple .toggle-thumb { background: #a87acc; }
  .toggle-track.on-blue .toggle-thumb   { background: #64a0e6; }
  .toggle-label { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textDim}; transition: color 0.15s; }

  .skill-pips { display: flex; gap: 3px; align-items: center; flex-shrink: 0; }
  .pip { width: 8px; height: 8px; border: 1px solid ${t.borderInput}; cursor: pointer; transition: all 0.15s; }
  .pip.filled { background: ${t.accent}; border-color: ${t.accentBorder}; }

  .hj-root { --spell-accent: ${t.spellAccent}; --spell-border: ${t.spellBorder}; --spell-muted: ${t.spellMuted}; --spell-dim: ${t.spellDim}; --spell-text: ${t.spellText}; --spell-bg: ${t.spellBg}; --quest-reward: ${t.questReward}; }
  .spell-level-badge { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; padding: 0.15rem 0.5rem; border: 1px solid var(--spell-border); color: var(--spell-accent); background: var(--spell-bg); flex-shrink: 0; text-transform: uppercase; }
  .spell-school-badge { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; padding: 0.15rem 0.5rem; border: 1px solid #2a2a5a; color: #8888cc; background: rgba(100,100,200,0.06); flex-shrink: 0; text-transform: uppercase; }

  .entity-header { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.5rem; }
  .pin-btn { background: transparent; border: none; cursor: pointer; font-size: 0.9rem; padding: 0.1rem; opacity: 0.4; transition: opacity 0.15s; flex-shrink: 0; line-height: 1; }
  .pin-btn.pinned { opacity: 1; }
  .entity-toggle { background: transparent; border: none; color: ${t.textDim}; cursor: pointer; font-size: 0.6rem; padding: 0; transition: color 0.15s; flex-shrink: 0; font-family: 'Cinzel', serif; }
  .entity-toggle:hover { color: ${t.textMuted}; }
  .rel-badge { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; padding: 0.15rem 0.5rem; cursor: pointer; flex-shrink: 0; transition: all 0.15s; user-select: none; text-transform: uppercase; }
  .rel-ally    { border: 1px solid #3a6a3a; color: #6acc6a; background: rgba(74,122,74,0.08); }
  .rel-neutral { border: 1px solid #4a4030; color: ${t.textMuted}; background: rgba(74,64,48,0.08); }
  .rel-hostile { border: 1px solid #6a2a2a; color: #cc4444; background: rgba(122,44,44,0.08); }
  .rel-unknown { border: 1px solid ${t.border}; color: ${t.textDim}; background: transparent; }
  .rel-badge:hover { filter: brightness(1.2); }
  .loc-type { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.15rem 0.55rem; border: 1px solid ${t.border}; color: ${t.textMuted}; background: rgba(226,185,78,0.04); flex-shrink: 0; }

  .sess-entry { border: 1px solid ${t.border}; background: ${t.sessEntry}; overflow: hidden; box-shadow: 0 2px 0 ${t.shadowCard}; border-radius: 2px; }
  .sess-header { display: flex; align-items: center; gap: 0.6rem; padding: 0.8rem 1rem; cursor: pointer; transition: background 0.15s; user-select: none; }
  .sess-header:hover { background: rgba(226,185,78,0.04); }
  .sess-header.open { background: rgba(226,185,78,0.06); border-bottom: 1px solid ${t.border}; }
  .sess-num { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.08em; color: ${t.textDim}; flex-shrink: 0; min-width: 24px; }
  .sess-body { padding: 0.9rem 1rem 1.1rem; }
  .sess-rendered { font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; color: ${t.text}; line-height: 1.75; white-space: pre-wrap; word-break: break-word; padding: 0.75rem 0.85rem; background: ${t.bgInput}; border: 1px solid ${t.border}; min-height: 80px; cursor: text; }

  .entity-link { cursor: pointer; padding: 0 2px; font-weight: 600; transition: all 0.15s; display: inline; position: relative; }
  .entity-link-npc       { color:#c9943e; background:rgba(201,148,62,0.12); border-bottom:1px solid rgba(201,148,62,0.4); }
  .entity-link-npc:hover  { background:rgba(201,148,62,0.22); }
  .entity-link-location        { color:#4a8aaa; background:rgba(74,138,170,0.12); border-bottom:1px solid rgba(74,138,170,0.4); }
  .entity-link-location:hover  { background:rgba(74,138,170,0.22); }
  .entity-link-quest        { color:#aa4444; background:rgba(170,68,68,0.12); border-bottom:1px solid rgba(170,68,68,0.4); }
  .entity-link-quest:hover  { background:rgba(170,68,68,0.22); }
  .entity-link-inventory        { color:#3a8a5a; background:rgba(58,138,90,0.12); border-bottom:1px solid rgba(58,138,90,0.4); }
  .entity-link-inventory:hover  { background:rgba(58,138,90,0.22); }
  .entity-link-skill        { color:#7a5aaa; background:rgba(122,90,170,0.12); border-bottom:1px solid rgba(122,90,170,0.4); }
  .entity-link-skill:hover  { background:rgba(122,90,170,0.22); }

  .entity-tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: ${t.bgCard}; border: 1px solid ${t.border}; padding: 0.55rem 0.75rem; min-width: 200px; max-width: 280px; z-index: 500; pointer-events: none; box-shadow: 0 6px 24px ${t.shadowBot}; display: flex; flex-direction: column; gap: 0.2rem; white-space: normal; word-break: normal; }
  .entity-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: ${t.border}; }
  .entity-tooltip-name { font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.12em; font-weight: 700; color: ${t.accent}; display: block; line-height: 1.3; }
  .entity-tooltip-sub  { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.textMuted}; display: block; opacity: 0.8; }
  .entity-tooltip-body { font-family: 'Crimson Text', Georgia, serif; font-size: 0.9rem; color: ${t.text}; line-height: 1.5; display: block; margin-top: 0.15rem; border-top: 1px solid ${t.borderSub}; padding-top: 0.2rem; }

  .sess-legend { display:flex; gap:0.7rem; flex-wrap:wrap; padding:0.5rem 0.7rem; background:rgba(226,185,78,0.03); border:1px solid ${t.border}; margin-bottom:0.6rem; align-items:center; }
  .sess-legend-item { display:flex; align-items:center; gap:0.3rem; font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.08em; text-transform:uppercase; }
  .legend-dot { width:8px; height:8px; flex-shrink:0; }

  .quest-entry { background: ${t.bgCard}; border: 1px solid ${t.border}; padding: 0.9rem 1rem; box-shadow: 0 2px 0 ${t.shadowCard}; border-radius: 2px; }
  .quest-entry.active    { border-left: 2px solid ${t.accent}; }
  .quest-entry.completed { border-left: 2px solid #5a9a5a; opacity: 0.78; }
  .quest-entry.failed    { border-left: 2px solid #8a2a2a; opacity: 0.62; }
  .badge { font-family:'Cinzel',serif; font-size:0.57rem; letter-spacing:0.12em; text-transform:uppercase; padding:0.15rem 0.55rem; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all 0.15s; user-select:none; }
  .badge.active    { border:1px solid ${t.accentBorder}; color:${t.accent}; background:rgba(226,185,78,0.1); }
  .badge.completed { border:1px solid #3a6a3a; color:#6acc6a; background:rgba(74,122,74,0.1); }
  .badge.failed    { border:1px solid #6a2a2a; color:#cc4444; background:rgba(122,44,44,0.1); }
  .badge:hover { filter:brightness(1.25); }

  .checklist-item { display:flex; align-items:center; gap:0.5rem; padding:0.3rem 0; border-bottom:1px solid ${t.borderSub}; }
  .checklist-item:last-child { border-bottom:none; }
  .check-box { width:14px; height:14px; border:1px solid ${t.borderInput}; background:transparent; flex-shrink:0; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; }
  .check-box.checked { background:rgba(226,185,78,0.2); border-color:${t.accentBorder}; }
  .check-box.checked::after { content:'✓'; font-size:0.6rem; color:${t.accent}; }
  .checklist-text.done { text-decoration:line-through; color:${t.textDim}; }

  .profile-screen { position: fixed; inset: 0; background: ${t.bg}; z-index: 200; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem 6rem; overflow-y: auto; }
  .profile-logo { font-family: 'Cinzel Decorative', serif; font-size: 1.8rem; font-weight: 700; color: ${t.accent}; letter-spacing: 0.12em; text-align: center; margin-bottom: 0.4rem; text-shadow: 0 0 30px rgba(226,185,78,0.3); }
  .profile-tagline { font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; color: ${t.textMuted}; font-style: italic; text-align: center; margin-bottom: 2rem; }
  .profile-list { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
  .profile-card { background: ${t.bgCard}; border: 1px solid ${t.border}; padding: 0.9rem 1.1rem; display: flex; align-items: center; gap: 0.8rem; cursor: pointer; transition: all 0.18s; position: relative; border-radius: 2px; }
  .profile-card:hover { border-color: ${t.accentBorder}; box-shadow: 0 0 0 1px ${t.accentBorder}; }
  .profile-card.active-profile { border-color: ${t.accent}; border-left: 3px solid ${t.accent}; }
  .profile-card-icon { font-size: 1.8rem; flex-shrink: 0; line-height: 1; }
  .profile-card-name { font-family: 'Cinzel', serif; font-size: 0.95rem; font-weight: 700; color: ${t.text}; }
  .profile-card-sub { font-family: 'Crimson Text', Georgia, serif; font-size: 0.88rem; color: ${t.textMuted}; font-style: italic; margin-top: 0.1rem; }
  .profile-card-del { position: absolute; top: 0.4rem; right: 0.5rem; background: transparent; border: none; cursor: pointer; font-size: 0.75rem; color: ${t.textDim}; opacity: 0.4; transition: all 0.15s; padding: 0.15rem 0.3rem; }
  .profile-card-del:hover { color: #c04040; opacity: 1; }
  .btn-new-profile { font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; background: transparent; color: ${t.accent}; border: 1px dashed ${t.accentBorder}; padding: 0.75rem 1.5rem; cursor: pointer; transition: all 0.2s; width: 100%; max-width: 440px; }
  .btn-new-profile:hover { background: rgba(226,185,78,0.08); border-style: solid; }

  .wizard-screen { position: fixed; inset: 0; background: ${t.bg}; z-index: 300; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem 4rem; overflow-y: auto; }
  .wizard-box { width: 100%; max-width: 480px; }
  .wizard-title { font-family: 'Cinzel Decorative', serif; font-size: 1.3rem; font-weight: 700; color: ${t.accent}; margin-bottom: 0.3rem; }
  .wizard-sub { font-family: 'Crimson Text', Georgia, serif; font-size: 1rem; color: ${t.textMuted}; font-style: italic; margin-bottom: 1.5rem; }
  .wizard-step-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.textDim}; margin-bottom: 0.4rem; }
  .wizard-class-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.5rem; margin-bottom: 0.6rem; }
  .wizard-class-btn { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; padding: 0.6rem 0.3rem; cursor: pointer; transition: all 0.15s; text-align: center; border-radius: 2px; }
  .wizard-class-btn:hover { border-color: ${t.accentBorder}; }
  .wizard-class-btn.selected { border-color: ${t.accent}; background: rgba(226,185,78,0.08); }
  .wizard-class-icon { font-size: 1.3rem; display: block; margin-bottom: 0.2rem; }
  .wizard-class-name { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.08em; color: ${t.textLabel}; }
  .wizard-stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.4rem; margin-bottom: 0.8rem; }
  .wizard-stat-box { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.4rem 0.2rem; border-radius: 2px; }
  .wizard-stat-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.12em; color: ${t.textLabel}; display: block; margin-bottom: 0.15rem; }
  .wizard-stat-val { font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 700; color: ${t.accent}; }
  .wizard-step-dots { display: flex; gap: 0.4rem; justify-content: center; margin-bottom: 1.5rem; }
  .wizard-dot { width: 7px; height: 7px; border-radius: 50%; background: ${t.borderInput}; transition: all 0.2s; }
  .wizard-dot.active { background: ${t.accent}; }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:1000; display:flex; align-items:center; justify-content:center; padding:1rem; }
  .modal-box { background:${t.modalBg}; border:1px solid #6a2a2a; padding:1.5rem; max-width:380px; width:100%; }
  .modal-title { font-family:'Cinzel',serif; font-size:0.9rem; letter-spacing:0.18em; text-transform:uppercase; color:#cc4444; margin-bottom:0.75rem; }
  .modal-text { font-family:'Crimson Text',serif; font-size:1rem; color:${t.textMuted}; line-height:1.6; margin-bottom:1.2rem; }
  .modal-detail { font-family:'Crimson Text',serif; font-size:0.9rem; color:${t.text}; background:${t.bgInput}; border:1px solid ${t.borderInput}; padding:0.5rem 0.75rem; margin-bottom:1rem; line-height:1.6; }

  .add-form { background:${t.addForm}; border:1px dashed ${t.border}; padding:1.1rem; }

  @media (min-width: 600px) {
    .hj-nav-label { font-size: 0.46rem; }
    .hj-nav-icon  { font-size: 1.2rem; }
  }

  .empty-state { text-align:center; padding:2.5rem; color:${t.emptyColor}; font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.12em; line-height:1.9; }
  .row   { display:flex; align-items:center; gap:0.6rem; }
  .col   { display:flex; flex-direction:column; gap:0.5rem; }
  .flex1 { flex:1; min-width:0; }
  .mt05  { margin-top:0.5rem; }
  .mt1   { margin-top:1rem; }
  @media (max-width:480px) { .hj-logo { font-size:0.95rem; } }
  `;
}

/* ═══ STAŁE PROJEKTOWE ══════════════════════════ */
const today   = () => new Date().toISOString().slice(0,10);
const statMod = v  => { const m=Math.floor((v-10)/2); return m>=0?`+${m}`:String(m); };
const numMod  = v  => v>=0?`+${v}`:String(v);
const clamp   = (n,lo,hi) => Math.max(lo,Math.min(hi,n));

const STAT_KEYS    = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const STATUS_CYCLE = { "Aktywne": "Ukończone", "Ukończone": "Nieudane", "Nieudane": "Aktywne" };
const REL_CYCLE    = { unknown: "ally", ally: "neutral", neutral: "hostile", hostile: "unknown" };
const REL_LABELS   = { ally: "Sprzymierzeniec", neutral: "Neutralny", hostile: "Wrogi", unknown: "Nieznany" };
const LOC_TYPES    = ["Osada", "Podziemia", "Dzicz", "Budynek", "Ruiny", "Punkt Orientacyjny", "Inne"];
const FACTION_TYPES = ["Gildia", "Zakon", "Kult", "Rząd", "Armia", "Przestępcy", "Kupcy", "Religijna", "Polityczna", "Inna"];
const FACTION_RANKS = ["Nieznany", "Sojusznik", "Neutralny", "Wróg", "Członek", "Oficer", "Przywódca"];
const FACTION_RANK_COLORS = {
  "Nieznany": "#6a5a38", "Sojusznik": "#5a8a5a", "Neutralny": "#8a7840",
  "Wróg": "#8a3a3a", "Członek": "#4a7aaa", "Oficer": "#c9a84c", "Przywódca": "#e2b94e"
};
const ALIGNMENTS   = ["Praworządny dobry", "Neutralny dobry", "Chaotyczny dobry", "Praworządny neutralny", "Bezwzględnie neutralny", "Chaotyczny neutralny", "Praworządny zły", "Neutralny zły", "Chaotyczny zły"];
const ITEM_TYPES   = ["Ogólny", "Broń", "Pancerz", "Zwój z czarem", "Cudowny przedmiot", "Jednorazowy", "Narzędzie", "Inny"];
const ITEM_ICONS   = { "Ogólny": "📦", "Broń": "⚔️", "Pancerz": "🛡️", "Zwój z czarem": "📜", "Cudowny przedmiot": "✨", "Jednorazowy": "🧪", "Narzędzie": "🔧", "Inny": "◈" };
const SKILL_CATS   = ["Umiejętność", "Cecha rasowa", "Atut"];
const SPELL_SCHOOLS = ["Odrzucanie", "Przywoływanie", "Wieszczenie", "Surogacja", "Wywoływanie", "Iluzja", "Nekromancja", "Przemiana", "Inna"];
const SPELL_LEVELS = ["Sztuczka", "1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];
const SPELL_SLOT_LABELS = ["1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];

const SAVING_THROWS = [
  {key:"str", label:"Siła",         attr:"STR"},
  {key:"dex", label:"Zręczność",     attr:"DEX"},
  {key:"con", label:"Budowa",        attr:"CON"},
  {key:"int", label:"Intelekt",      attr:"INT"},
  {key:"wis", label:"Mądrość",       attr:"WIS"},
  {key:"cha", label:"Charyzma",      attr:"CHA"},
];
const GENERIC_SKILLS = [
  {key:"acrobatics",    label:"Akrobatyka",       attr:"DEX"},
  {key:"athletics",     label:"Atletyka",         attr:"STR"},
  {key:"arcana",        label:"Wiedza tajemna",   attr:"INT"},
  {key:"deception",     label:"Oszustwo",         attr:"CHA"},
  {key:"history",       label:"Historia",         attr:"INT"},
  {key:"insight",       label:"Intuicja",         attr:"WIS"},
  {key:"intimidation",  label:"Zastraszanie",     attr:"CHA"},
  {key:"investigation", label:"Śledztwo",         attr:"INT"},
  {key:"medicine",      label:"Medycyna",         attr:"WIS"},
  {key:"nature",        label:"Przyroda",         attr:"INT"},
  {key:"perception",    label:"Percepcja",        attr:"WIS"},
  {key:"performance",   label:"Występy",          attr:"CHA"},
  {key:"persuasion",    label:"Perswazja",        attr:"CHA"},
  {key:"religion",      label:"Religia",          attr:"INT"},
  {key:"sleightzhand",  label:"Zwinne dłonie",    attr:"DEX"},
  {key:"stealth",       label:"Skradanie",        attr:"DEX"},
  {key:"survival",      label:"Sztuka przetrwania", attr:"WIS"},
  {key:"animalhandling",label:"Opieka nad zwierzętami", attr:"WIS"},
];

const DEFAULT_CHAR = {
  name: "", classes: [{name: "Poszukiwacz przygód", level: 1}],
  stats: {STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10},
  profBonus: 2, hp: {current: 10, max: 10, temp: 0}, ac: 10,
  initiativeBonus: undefined,
  savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
  skills: {}, skillExp: {},
  alignment: "Bezwzględnie neutralny", background: "",
  traits: {personality: "", ideals: "", bonds: "", flaws: ""},
  personalNotes: "", backstory: "",
  spellSlots: {}, spellcastingAbility: "INT",
  hitDice: { type: "d8", max: 1, used: 0 },
  deathSaves: { successes: 0, failures: 0 },
};

const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const CHAR_SLOTS = ["char", "inventory", "npcs", "locations", "skills", "spells", "sessions", "quests", "factions"];

const charKey = (slot, id) => `hj_${slot}_${id}`;
const loadChar = (slot, id, fb) => load(charKey(slot, id), fb);
const saveChar = (slot, id, val) => save(charKey(slot, id), val);
const deleteCharData = id => CHAR_SLOTS.forEach(s => localStorage.removeItem(charKey(s, id)));

const loadProfiles = () => load("hj_profiles", []);
const saveProfiles = p => save("hj_profiles", p);
const loadActiveId = () => load("hj_active_profile", null);
const saveActiveId = id => save("hj_active_profile", id);

const migrateLegacy = () => {
  if (loadProfiles().length > 0) return;
  const legacyChar = load("hj_char", null);
  if (!legacyChar) return;
  const id = "profile_" + Date.now();
  const name = legacyChar.name?.trim() || "Mój Bohater";
  CHAR_SLOTS.forEach(slot => {
    const val = load("hj_" + slot, null);
    if (val !== null) saveChar(slot, id, val);
  });
  saveProfiles([{ id, name, class: (legacyChar.classes || [{name: ""}])[0]?.name || "", level: (legacyChar.classes || [{level: 1}])[0]?.level || 1, created: Date.now() }]);
  saveActiveId(id);
};

const hpBarColor = pct => pct > 70 ? "linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)" : pct > 35 ? "linear-gradient(90deg,#7a4a10,#cc7020,#e08030)" : "linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

const LEGEND_ITEMS = [
  {type: "npc",       color: "rgba(201,148,62,0.35)", border: "rgba(201,148,62,0.7)",  label: "Postacie"},
  {type: "location",  color: "rgba(74,138,170,0.35)", border: "rgba(74,138,170,0.7)",  label: "Miejsca"},
  {type: "quest",     color: "rgba(170,68,68,0.35)",  border: "rgba(170,68,68,0.7)",   label: "Zadania"},
  {type: "inventory", color: "rgba(58,138,90,0.35)",  border: "rgba(58,138,90,0.7)",   label: "Plecak"},
  {type: "skill",     color: "rgba(122,90,170,0.35)", border: "rgba(122,90,170,0.7)",  label: "Zdolności"},
];

/* ═══ INTERAKTYWNY PARSER LINKÓW W NOTATKACH ═════ */
function parseEntityLinksWithTooltips(text, npcs, locations, quests, inventory, skills, onNavigate) {
  if (!text) return null;
  const entityMap = new Map();
  const addEntities = (list, tab, type, getTooltip) =>
    list.forEach(e => e.name?.trim().length > 1 && entityMap.set(e.name.toLowerCase(), { name: e.name, tab, type, tooltip: getTooltip(e) }));
  
  addEntities(npcs,      "npcs",      "npc",       e => ({ sub: e.role || "", body: e.notes || "" }));
  addEntities(locations, "locations", "location",  e => ({ sub: e.type || "", body: e.notes || "" }));
  addEntities(quests,    "quests",    "quest",     e => ({ sub: e.status || "", body: e.description || "" }));
  addEntities(inventory, "inventory", "inventory", e => ({ sub: e.type || "", body: e.note || "" }));
  addEntities(skills,    "skills",    "skill",     e => ({ sub: e.category || "", body: e.description || "" }));

  const sorted = [...entityMap.values()].sort((a, b) => b.name.length - a.name.length);
  if (!sorted.length) return text;
  const pattern = new RegExp(`(${sorted.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const TAB_LABELS = {npc: "Postacie", location: "Miejsca", quest: "Zadania", inventory: "Plecak", skill: "Zdolności"};

  return text.split(pattern).map((part, i) => {
    const key = part.toLowerCase();
    const match = entityMap.get(key);
    if (match) {
      return <EntityLink key={i} match={match} part={part} onNavigate={onNavigate} tabLabel={TAB_LABELS[match.type]}/>;
    }
    return part;
  });
}

function EntityLink({ match, part, onNavigate, tabLabel }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setVisible(true), 350); };
  const hide = () => { clearTimeout(timerRef.current); setVisible(false); };

  return (
    <span
      className={`entity-link entity-link-${match.type}`}
      onClick={() => onNavigate(match.tab)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={e => { e.preventDefault(); show(); }}
      onTouchEnd={hide}
      title={match.name}
      style={{position: "relative", display: "inline"}}
    >
      {part}
      {visible && (
        <span className="entity-tooltip" onClick={e => e.stopPropagation()}>
          <span className="entity-tooltip-name">{match.name}</span>
          {match.tooltip.sub && (
            <span className="entity-tooltip-sub">{match.tooltip.sub}</span>
          )}
          {match.tooltip.body && (
            <span className="entity-tooltip-body">
              {match.tooltip.body.slice(0, 140)}{match.tooltip.body.length > 140 ? "…" : ""}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/* ═══ WSPÓLNE KOMPONENTY INTERFEJSU ══════════════ */
function TagsEditor({tags, onChange}) {
  const [adding, setAdding] = useState(false); const [draft, setDraft] = useState("");
  const commit = () => { const t = draft.trim().toLowerCase(); if (t && !tags.includes(t)) onChange([...tags, t]); setDraft(""); setAdding(false); };
  return <div className="tags-row">
    {tags.map(tag => <span key={tag} className="tag tag-default">{tag}<button className="tag-remove" onClick={() => onChange(tags.filter(x => x !== tag))}>✕</button></span>)}
    {adding ? <input className="tag-input" autoFocus value={draft} placeholder="tag…" onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setAdding(false); setDraft(""); } }}/>
            : <button className="tag-add-btn" onClick={() => setAdding(true)}>+ tag</button>}
  </div>;
}

function FilterBar({allTags, activeTag, onSelect}) {
  if (!allTags.length) return null;
  return <div className="filter-bar">
    <span style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase"}}>Filtr:</span>
    <button className={`filter-tag${!activeTag ? " active-filter" : ""}`} onClick={() => onSelect(null)}>Wszystkie</button>
    {allTags.map(tag => <button key={tag} className={`filter-tag${activeTag === tag ? " active-filter" : ""}`} onClick={() => onSelect(activeTag === tag ? null : tag)}>{tag}</button>)}
  </div>;
}

function PrzypnijBtn({pinned, onToggle}) {
  return <button className={`pin-btn${pinned ? " pinned" : ""}`} onClick={onToggle} title={pinned ? "Odepnij" : "Przypnij"}>{pinned ? "📌" : "📍"}</button>;
}

function Toggle({on, onToggle, label, color}) {
  const cls = on ? (color === "purple" ? "on-purple" : color === "blue" ? "on-blue" : "on") : "";
  return <div className="toggle-wrap" onClick={onToggle}>
    <div className={`toggle-track${cls ? " " + cls : ""}`}><div className="toggle-thumb"/></div>
    <span className="toggle-label">{label}</span>
  </div>;
}

function StatBox({label, value, onChange}) {
  const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(String(value));
  const commit = () => { const n = parseInt(draft, 10); if (!isNaN(n)) onChange(clamp(n, 1, 30)); setEditing(false); };
  return <div className={`stat-box${editing ? " editing" : ""}`} onClick={() => { if (!editing) { setDraft(String(value)); setEditing(true); } }}>
    <span className="stat-name">{label}</span>
    {editing ? <input className="stat-input" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }} onClick={e => e.stopPropagation()}/>
             : <span className="stat-val">{value}</span>}
    <span className="stat-mod">{statMod(value)}</span>
  </div>;
}

function SkillPips({value, onChange}) {
  return <div className="skill-pips">{[1, 2, 3, 4, 5].map(i => <div key={i} className={`pip${i <= value ? " filled" : ""}`} onClick={() => onChange(i === value ? 0 : i)}/>)}</div>;
}

/* ── MODAL ODPOZCYNKU ── */
function RestModal({ type, char, setChar, onClose }) {
  const hd = char.hitDice || {type: "d8", max: 1, used: 0};
  const available = Math.max(0, hd.max - hd.used);
  const [hdWydaj, setHdWydaj] = useState(1);

  const doShortRest = () => {
    const spend = clamp(hdWydaj, 0, available);
    const dieMax = parseInt(hd.type.replace("d", "")) || 8;
    const conMod = Math.floor((char.stats.CON - 10) / 2);
    const healed = spend > 0 ? spend * Math.ceil(dieMax / 2) + spend * conMod : 0;
    setChar(c => ({
      ...c,
      hp: { ...c.hp, current: clamp(c.hp.current + Math.max(0, healed), 0, c.hp.max) },
      hitDice: { ...hd, used: hd.used + spend },
    }));
    onClose();
  };

  const doLongRest = () => {
    const recover = Math.max(1, Math.floor(hd.max / 2));
    const newUsed = Math.max(0, hd.used - recover);
    const newSlots = {};
    Object.entries(char.spellSlots || {}).forEach(([k, v]) => { newSlots[k] = { ...v, used: 0 }; });
    setChar(c => ({
      ...c,
      hp: { ...c.hp, current: c.hp.max, temp: 0 },
      hitDice: { ...hd, used: newUsed },
      spellSlots: newSlots,
      deathSaves: { successes: 0, failures: 0 },
    }));
    onClose();
  };

  const isShort = type === "short";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{isShort ? "☽ Krótki odpoczynek" : "☀ Długi odpoczynek"}</div>
        {isShort ? <>
          <p className="modal-text">
            Wydaj Kości Wytrzymałości, aby odzyskać punkty życia.{" "}
            <strong style={{color: "inherit"}}>{available}</strong> z <strong style={{color: "inherit"}}>{hd.max}</strong> kości {hd.type} dostępnych.
          </p>
          <div style={{display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap"}}>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7}}>Typ kości</span>
            <select className="g-select" style={{width: "auto", fontSize: "0.9rem", padding: "0.3rem 0.5rem"}} value={hd.type}
              onChange={e => setChar(c => ({...c, hitDice: {...hd, type: e.target.value}}))}>
              {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7}}>Maks.</span>
            <input type="number" min={1} value={hd.max}
              onChange={e => setChar(c => ({...c, hitDice: {...hd, max: parseInt(e.target.value) || 1}}))}
              style={{width: 44, fontFamily: "Cinzel,serif", fontSize: "0.9rem", background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", textAlign: "center"}}/>
          </div>
          <div className="modal-detail">
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem"}}>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8}}>Wydaj</span>
              <button onClick={() => setHdWydaj(s => Math.max(0, s - 1))} style={{width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: pointer, fontFamily: "monospace", fontSize: "1rem", opacity: 0.7}}>−</button>
              <input type="number" min={0} max={available} value={hdWydaj}
                onChange={e => setHdWydaj(clamp(parseInt(e.target.value) || 0, 0, available))}
                style={{width: 36, fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, background: "transparent", border: "none", borderBottom: "1px solid currentColor", outline: "none", textAlign: "center"}}/>
              <button onClick={() => setHdWydaj(s => Math.min(available, s + 1))} style={{width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: pointer, fontFamily: "monospace", fontSize: "1rem", opacity: 0.7}}>+</button>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.72rem", opacity: 0.7}}>{hd.type}</span>
            </div>
            {(() => {
              const spend = clamp(hdWydaj, 0, available);
              const dieMax = parseInt(hd.type.replace("d", "")) || 8;
              const conMod = Math.floor((char.stats.CON - 10) / 2);
              const avg = spend * Math.ceil(dieMax / 2) + spend * conMod;
              const min = spend * 1 + spend * conMod;
              const max = spend * dieMax + spend * conMod;
              return <span style={{fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.95rem", fontStyle: "italic", opacity: 0.85}}>
                Przywraca ok. <strong>{Math.max(0, avg)}</strong> PŻ (zakres {Math.max(0, min)}–{Math.max(0, max)}, śr. + MOD Budowy {conMod >= 0 ? "+" : ""}{conMod})
              </span>;
            })()}
          </div>
          <div className="row" style={{justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.8rem"}}>
            <button className="btn-ghost" onClick={onClose}>Anuluj</button>
            <button className="btn-gold" onClick={doShortRest}>☽ Odpoczywaj</button>
          </div>
        </> : <>
          <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem"}}>
            {[
              ["❤️", "Przywróć pełne punkty życia", `Z ${char.hp.current} → ${char.hp.max}`],
              ["💫", "Zresetuj komórki czarów", "Wszystkie zużyte gniazda czarów zostaną odnowione"],
              ["🎲", "Odzyskaj Kości Wytrzymałości", (() => { const rec = Math.max(1, Math.floor((char.hitDice?.max || 1) / 2)); const cur = (char.hitDice?.max || 1) - (char.hitDice?.used || 0); return `${cur} → ${Math.min(char.hitDice?.max || 1, cur + rec)} (odzyskano ${rec})`; })()],
              ["☠️", "Wyczyść rzuty obronne przeciw śmierci", "Sukcesy i porażki zostały zresetowane"],
            ].map(([icon, label, detail]) => (
              <div key={label} style={{display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.35rem 0", borderBottom: `1px solid rgba(128,128,128,0.15)`}}>
                <span style={{fontSize: "1rem", flexShrink: 0}}>{icon}</span>
                <div>
                  <div style={{fontFamily: "Cinzel,serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase"}}>{label}</div>
                  <div style={{fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.88rem", opacity: 0.65, fontStyle: "italic"}}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{justifyContent: "flex-end", gap: "0.6rem"}}>
            <button className="btn-ghost" onClick={onClose}>Anuluj</button>
            <button className="btn-gold" onClick={doLongRest}>☀ Odpocznij Długo</button>
          </div>
        </>}
      </div>
    </div>
  );
}

function ResetModal({onConfirm, onAnuluj}) {
  return <div className="modal-overlay" onClick={onAnuluj}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div className="modal-title">⚠ Pełny reset karty</div>
      <p className="modal-text">Spowoduje to trwałe usunięcie wszystkich danych postaci. Tej operacji nie można cofnąć.</p>
      <div className="row" style={{justifyContent: "flex-end", gap: "0.6rem"}}>
        <button className="btn-ghost" onClick={onAnuluj}>Anuluj</button>
        <button className="btn-danger" onClick={onConfirm}>Usuń wszystko</button>
      </div>
    </div>
  </div>;
}

/* ═══ WIDGET GNIAZD CZARÓW ══════════════════════ */
function SpellSlotsWidget({ char, setChar, spells }) {
  const usedLevels = [...new Set((spells || []).map(s => s.level).filter(l => l !== "Sztuczka"))];
  if (!usedLevels.length) return <p style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", opacity: 0.5, textAlign: "center", padding: "1rem 0"}}>Brak zapisanych czarów poziomowych (innych niż sztuczki).</p>;
  usedLevels.sort((a, b) => SPELL_SLOT_LABELS.indexOf(a) - SPELL_SLOT_LABELS.indexOf(b));
  return (
    <div style={{display: "grid", gap: "0.35rem", gridTemplateColumns: `repeat(${usedLevels.length},1fr)`}}>
      {usedLevels.map(lv => {
        const sl = (char.spellSlots || {})[lv] || {max: 0, used: 0};
        const count = (spells || []).filter(s => s.level === lv).length;
        return (
          <div key={lv} className="spell-slot-box">
            <span className="spell-slot-label">{lv}</span>
            <div style={{display: "flex", alignItems: "center", justifyCenter: "center", gap: "2px"}}>
              <input className="spell-slot-input" type="number" min={0} value={sl.used || 0}
                onChange={e => setChar(c => ({...c, spellSlots: {...(c.spellSlots || {}), [lv]: {...((c.spellSlots || {})[lv] || {max: 0, used: 0}), used: Math.max(0, parseInt(e.target.value) || 0)}}}))}
                style={{width: 28, fontSize: "0.9rem"}}/>
              <span style={{color: "var(--spell-border)", fontSize: "0.7rem"}}>/</span>
              <input className="spell-slot-input" type="number" min={0} value={sl.max || 0}
                onChange={e => setChar(c => ({...c, spellSlots: {...(c.spellSlots || {}), [lv]: {...((c.spellSlots || {})[lv] || {max: 0, used: 0}), max: Math.max(0, parseInt(e.target.value) || 0)}}}))}
                style={{width: 28, fontSize: "0.9rem", color: "var(--spell-muted)"}}/>
            </div>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.42rem", color: "var(--spell-dim)", textTransform: "uppercase", marginTop: "0.1rem", display: "block"}}>{count} czar{count !== 1 ? "y" : ""}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ KARTA POSTACI (ARKUSZ GŁÓWNY) ══════════════ */
function PostaćSheet({ char, setChar, inventory, skills, spells }) {
  const upd   = (f, v) => setChar(c => ({...c, [f]: v}));
  const updSt = (s, v) => setChar(c => ({...c, stats: {...c.stats, [s]: v}}));
  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));
  const pb    = char.profBonus || 2;
  const [restModal, setRestModal] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if ((inventory || []).some(i => i.equipped)) return "items";
    if ((skills || []).some(s => s.inUse)) return "skills";
    return "spells";
  });

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills || []).filter(s => s.inUse);
  const activeSpells  = (spells || []).filter(s => s.inUse);
  const hasActive     = equippedItems.length || activeSkills.length || activeSpells.length;

  const cycleSave = useCallback(key => setChar(c => {
    const wasP = !!(c.savingThrows || {})[key]; const wasE = !!(c.savingThrowExp || {})[key];
    if (!wasP && !wasE) return {...c, savingThrows: {...(c.savingThrows || {}), [key]: true}, savingThrowExp: {...(c.savingThrowExp || {}), [key]: false}};
    if (wasP && !wasE)  return {...c, savingThrows: {...(c.savingThrows || {}), [key]: true}, savingThrowExp: {...(c.savingThrowExp || {}), [key]: true}};
    const s2 = {...(c.savingThrows || {})}; delete s2[key];
    const e2 = {...(c.savingThrowExp || {})}; delete e2[key];
    return {...c, savingThrows: s2, savingThrowExp: e2};
  }), [setChar]);

  const cycleSkill = useCallback(key => setChar(c => {
    const wasP = !!(c.skills || {})[key]; const wasE = !!(c.skillExp || {})[key];
    if (!wasP && !wasE) return {...c, skills: {...(c.skills || {}), [key]: true}, skillExp: {...(c.skillExp || {}), [key]: false}};
    if (wasP && !wasE)  return {...c, skills: {...(c.skills || {}), [key]: true}, skillExp: {...(c.skillExp || {}), [key]: true}};
    const s2 = {...(c.skills || {})}; delete s2[key];
    const e2 = {...(c.skillExp || {})}; delete e2[key];
    return {...c, skills: s2, skillExp: e2};
  }), [setChar]);

  return <>
    {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={() => setRestModal(null)}/>}

    <div className="card">
      <div className="sect-label">Bohater</div>

      <div style={{display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.8rem"}}>
        {(char.classes || []).map((cls, i) => (
          <div key={i} className="class-row" style={{alignItems: "baseline", gap: "0.4rem"}}>
            <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: i === 0 ? "1.15rem" : "0.95rem", fontWeight: 700, letterSpacing: "0.03em"}} value={cls.name} onChange={e => setChar(c => { const cl = [...c.classes]; cl[i] = {...cl[i], name: e.target.value}; return {...c, classes: cl}; })} placeholder={`Klasa ${i + 1}…`}/>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.14em", opacity: 0.45, flexShrink: 0, textTransform: "uppercase"}}>Poz.</span>
            <input type="number" className="iedit" style={{width: 32, textAlign: "center", fontFamily: "Cinzel,serif", fontSize: i === 0 ? "1rem" : "0.88rem", fontWeight: 600, opacity: 0.85}} value={cls.level} min={1} max={20} onChange={e => setChar(c => { const cl = [...c.classes]; cl[i] = {...cl[i], level: clamp(parseInt(e.target.value) || 1, 1, 20)}; return {...c, classes: cl}; })}/>
            {i > 0 && <button className="btn-ghost" style={{padding: "0.1rem 0.35rem", fontSize: "0.65rem"}} onClick={() => setChar(c => ({...c, classes: c.classes.filter((_, j) => j !== i)}))}>✕</button>}
          </div>
        ))}
        {(char.classes || []).length < 4 && <button className="btn-sm" style={{alignSelf: "flex-start", marginTop: "0.2rem"}} onClick={() => setChar(c => ({...c, classes: [...(c.classes || []), {name: "", level: 1}]}))}>+ Wieloklasowość</button>}
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 90px 1fr", gap: "0.6rem", alignItems: "end"}}>
        <div>
          <div style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.25rem"}}>Przeszłość</div>
          <input className="iedit" style={{fontSize: "0.9rem"}} value={char.background || ""} onChange={e => upd("background", e.target.value)} placeholder="Przeszłość postaci…"/>
        </div>
        <div>
          <div style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.25rem"}}>Premia z Biegłości</div>
          <input type="number" className="iedit" style={{textAlign: "center", fontFamily: "Cinzel,serif", fontSize: "0.95rem"}} value={pb} onChange={e => upd("profBonus", parseInt(e.target.value) || 2)}/>
        </div>
        <div>
          <div style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.25rem"}}>Charakter</div>
          <select className="g-select" value={char.alignment || "Bezwzględnie neutralny"} onChange={e => upd("alignment", e.target.value)} style={{fontSize: "0.78rem", padding: "0.3rem 0.5rem"}}>{ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}</select>
        </div>
      </div>

      <hr className="inner-divider" data-label="Cechy — Kliknij, aby edytować modyfikator rzutu obronnego (ST)" style={{marginTop: "1.1rem"}}/>
      <div className="stat-grid-6" style={{marginTop: "0.8rem"}}>
        {SAVING_THROWS.map(st => {
          const prz = !!(char.savingThrows || {})[st.key];
          const exp = !!(char.savingThrowExp || {})[st.key];
          const base = Math.floor((char.stats[st.attr] - 10) / 2);
          const auto = exp ? base + pb * 2 : prz ? base + pb : base;
          const over = (char.savingThrowOverride || {})[st.key];
          const stVal = over !== undefined ? over : auto;
          const stColor = exp ? "var(--spell-accent)" : prz ? "#c9a84c" : "inherit";
          return (
            <div key={st.key} style={{display: "flex", flexDirection: "column", gap: 0}} onClick={() => cycleSave(st.key)}>
              <StatBox label={st.attr} value={char.stats[st.attr]} onChange={v => updSt(st.attr, v)}/>
              <div className="stat-box" style={{borderTop: "none", textAlign: "center", padding: "0.25rem 0.1rem 0.2rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 0}}>
                <span style={{fontFamily: "Cinzel,serif", fontSize: "0.44rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.45, lineHeight: 1}}>ST</span>
                <input type="number" value={stVal}
                  title={over !== undefined ? "Wartość ręczna — kliknij dwukrotnie, aby zresetować" : "Wartość automatyczna — kliknij dwukrotnie, aby zresetować"}
                  style={{background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.85rem", fontWeight: 700, color: stColor, textAlign: "center", width: "100%", padding: "0.15rem 0", lineHeight: 1, display: "block"}}
                  onChange={e => { const n = parseInt(e.target.value); setChar(c => ({...c, savingThrowOverride: {...(c.savingThrowOverride || {}), [st.key]: isNaN(n) ? undefined : n}})); }}
                  onDoubleClick={() => setChar(c => { const o = {...(c.savingThrowOverride || {})}; delete o[st.key]; return {...c, savingThrowOverride: o}; })}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          );
        })}
      </div>

      <hr className="inner-divider" data-label="Żywotność i Walka" style={{marginTop: "1.1rem"}}/>
      <div style={{marginTop: "0.8rem", display: "grid", gridTemplateColumns: "34px auto 34px 1fr 1fr 1fr", gap: "0.35rem", alignItems: "stretch"}}>
        <button className="btn-pm minus" style={{height: "100%", minHeight: 52}} onClick={() => setChar(c => ({...c, hp: {...c.hp, current: clamp(c.hp.current - 1, 0, c.hp.max)}}))}>−</button>
        
        <div className="combat-box" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", padding: "0.2rem 0.3rem", gap: 0}}>
          <span className="combat-box-label">PŻ (HP)</span>
          <div style={{display: "flex", alignItems: "baseline", gap: "0.15rem"}}>
            <input type="number" value={char.hp.current}
              style={{background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", textAlign: "center", fontSize: "1.3rem", fontWeight: 700, width: 40, color: hpNumColor(hpPct), transition: "color 0.5s"}}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => ({...c, hp: {...c.hp, current: e.target.value === "" ? 0 : clamp(parseInt(e.target.value) || 0, 0, c.hp.max)}}))}
              onBlur={e => setChar(c => ({...c, hp: {...c.hp, current: clamp(parseInt(e.target.value) || 0, 0, c.hp.max)}}))}/>
            <span style={{color: "inherit", opacity: 0.35, fontSize: "0.8rem"}}>/</span>
            <input type="number" value={char.hp.max}
              style={{background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", textAlign: "center", fontSize: "0.85rem", width: 34, opacity: 0.6}}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => ({...c, hp: {...c.hp, max: e.target.value === "" ? 1 : Math.max(1, parseInt(e.target.value) || 1)}}))}
              onBlur={e => setChar(c => ({...c, hp: {...c.hp, max: Math.max(1, parseInt(e.target.value) || 1)}}))}/>
          </div>
        </div>

        <button className="btn-pm plus" style={{height: "100%", minHeight: 52}} onClick={() => setChar(c => ({...c, hp: {...c.hp, current: clamp(c.hp.current + 1, 0, c.hp.max)}}))}>+</button>
        
        <div className="combat-box">
          <span className="combat-box-label">Tymcz. PŻ</span>
          <input className="combat-box-input" type="number" value={char.hp.temp || 0}
            onFocus={e => e.target.select()}
            onChange={e => setChar(c => ({...c, hp: {...c.hp, temp: e.target.value === "" ? 0 : parseInt(e.target.value) || 0}}))}
            onBlur={e => setChar(c => ({...c, hp: {...c.hp, temp: parseInt(e.target.value) || 0}}))}/>
        </div>
        <div className="combat-box">
          <span className="combat-box-label">Klasa Panc. (AC)</span>
          <input className="combat-box-input" type="number" value={char.ac || 0}
            onFocus={e => e.target.select()}
            onChange={e => setChar(c => ({...c, ac: e.target.value === "" ? 0 : parseInt(e.target.value) || 0}))}
            onBlur={e => setChar(c => ({...c, ac: parseInt(e.target.value) || 0}))}/>
        </div>
        <div className="combat-box" title="Modyfikator Zręczności — edytuj, aby nadpisać">
          <span className="combat-box-label">Inicjatywa</span>
          <input className="combat-box-input" type="number"
            value={char.initiativeBonus !== undefined ? char.initiativeBonus : Math.floor((char.stats.DEX - 10) / 2)}
            onFocus={e => e.target.select()}
            onChange={e => setChar(c => ({...c, initiativeBonus: e.target.value === "" ? undefined : parseInt(e.target.value)}))}
            onBlur={e => { if (e.target.value === "") setChar(c => { const o = {...c}; delete o.initiativeBonus; return o; }); }}/>
        </div>
      </div>
      <div className="hp-bar-bg" style={{marginTop: "0.5rem"}}><div className="hp-bar-fill" style={{width: `${hpPct}%`, background: hpBarColor(hpPct)}}/></div>
      <div className="hp-pct" style={{color: hpNumColor(hpPct)}}>{hpPct}% żywotności pozostało</div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem", marginTop: "0.6rem", alignItems: "stretch"}}>
        <div className="combat-box" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", padding: "0.3rem 0.6rem", gap: "0.15rem"}}>
          <span className="combat-box-label">Kości Wytrzymałości</span>
          <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
            <select className="combat-box-input" style={{width: "auto", cursor: "pointer", fontSize: "0.78rem"}}
              value={(char.hitDice || {type: "d8"}).type}
              onChange={e => setChar(c => ({...c, hitDice: {...(c.hitDice || {type: "d8", max: 1, used: 0}), type: e.target.value}}))}>
              {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="number" min={0} value={(char.hitDice || {used: 0}).used || 0}
              onChange={e => setChar(c => ({...c, hitDice: {...(c.hitDice || {type: "d8", max: 1, used: 0}), used: parseInt(e.target.value) || 0}}))}
              style={{width: 32, background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.95rem", fontWeight: 700, textAlign: "center", color: "inherit"}}/>
            <span style={{fontSize: "0.65rem", opacity: 0.4}}>/</span>
            <input type="number" min={1} value={(char.hitDice || {max: 1}).max || 1}
              onChange={e => setChar(c => ({...c, hitDice: {...(c.hitDice || {type: "d8", max: 1, used: 0}), max: parseInt(e.target.value) || 1}}))}
              style={{width: 32, background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.95rem", textAlign: "center", color: "inherit", opacity: 0.7}}/>
          </div>
        </div>
        <button className="btn-rest short" onClick={() => setRestModal("short")}
          style={{display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", gap: "0.1rem", padding: "0.4rem 0.5rem"}}>
          <span style={{fontSize: "1.1rem", lineHeight: 1}}>☽</span>
          <span style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3}}>Krótki odp.</span>
        </button>
        <button className="btn-rest long" onClick={() => setRestModal("long")}
          style={{display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", gap: "0.1rem", padding: "0.4rem 0.5rem"}}>
          <span style={{fontSize: "1.1rem", lineHeight: 1}}>☀</span>
          <span style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase"}}>Długi odp.</span>
        </button>
      </div>

      <hr className="inner-divider" data-label="Umiejętności" style={{marginTop: "1.1rem"}}/>
      <div style={{marginTop: "0.6rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.3rem"}}>
        {GENERIC_SKILLS.map(sk => {
          const prz = !!(char.skills || {})[sk.key];
          const exp = !!(char.skillExp || {})[sk.key];
          const base = Math.floor((char.stats[sk.attr] - 10) / 2);
          const bonus = exp ? base + pb * 2 : prz ? base + pb : base;
          const pipColor = exp ? "#64c8e0" : prz ? "#c9a84c" : "transparent";
          const pipBorder = exp ? "2px solid #64c8e0" : prz ? "1.5px solid #c9a84c" : "1.5px solid #5a4a28";
          const pipClip = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
          const statColor = exp ? "#64c8e0" : prz ? "#c9a84c" : "inherit";
          return (
            <div key={sk.key} className={`stat-box${exp ? " stat-box-exp" : prz ? " stat-box-prz" : ""}`}
              onClick={() => cycleSkill(sk.key)}
              style={{position: "relative", cursor: "pointer", padding: "0.35rem 0.25rem 0.3rem", textAlign: "center", minHeight: 0, userSelect: "none"}}>
              <div style={{position: "absolute", top: "0.22rem", right: "0.22rem", width: 10, height: 10,
                  borderRadius: "50%", border: pipBorder, background: pipColor,
                  clipPath: pipClip,
                  boxShadow: exp ? "0 0 4px rgba(100,200,224,0.5)" : prz ? "0 0 4px rgba(201,168,76,0.5)" : "none",
                  transition: "all 0.15s", pointerEvents: "none"}}/>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.42rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55, display: "block", marginBottom: "0.15rem", lineHeight: 1.2, paddingRight: "0.7rem"}}>{sk.label}</span>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700, color: statColor, display: "block", lineHeight: 1}}>{numMod(bonus)}</span>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.38rem", opacity: 0.35, display: "block", marginTop: "0.1rem"}}>{sk.attr}</span>
            </div>
          );
        })}
      </div>
    </div>

    {hasActive > 0 && <div className="card">
      <div className="sect-label">Aktywne i wyposażone</div>
      <div className="subtab-bar">
        {equippedItems.length > 0 && <button className={`subtab-btn${activeTab === "items" ? " active" : ""}`} onClick={() => setActiveTab("items")}>Przedmioty ({equippedItems.length})</button>}
        {activeSkills.length > 0 && <button className={`subtab-btn${activeTab === "skills" ? " active" : ""}`} onClick={() => setActiveTab("skills")}>Zdolności ({activeSkills.length})</button>}
        <button className={`subtab-btn${activeTab === "spells" ? " active" : ""}`} onClick={() => setActiveTab("spells")}>Czary{activeSpells.length > 0 ? ` (${activeSpells.length})` : ""}</button>
      </div>

      {activeTab === "items" && (equippedItems.length === 0
        ? <div className="empty-state" style={{padding: "1.5rem"}}>Brak wyposażonych przedmiotów.</div>
        : equippedItems.map(item => (
          <div key={item.id} className="equipped-item">
            <span className="equipped-icon">{ITEM_ICONS[item.type] || "◈"}</span>
            <div className="flex1">
              <div className="row" style={{gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap"}}>
                <span className="equipped-name">{item.name}</span>
                <span className="equipped-type-badge">{item.type}</span>
                {item.qty && item.qty !== "1" && <span className="equipped-type-badge">×{item.qty}</span>}
              </div>
              {item.damage && <div className="equipped-stat">⚔ Obrażenia: {item.damage}{item.damageType ? ` (${item.damageType})` : ""}{item.modifier ? ` · +${parseInt(item.modifier) || 0} do trafienia` : ""}</div>}
              {!item.damage && item.modifier !== undefined && item.modifier !== "" && <div className="equipped-stat">Modyfikator trafienia: {numMod(parseInt(item.modifier) || 0)}</div>}
              {item.charges && <div className="equipped-stat">Ładunki: {item.charges}</div>}
              {item.effect && <div className="equipped-stat" style={{color: "var(--spell-muted)"}}>{item.effect}</div>}
              {item.note && <div className="equipped-stat" style={{fontStyle: "italic", opacity: 0.7}}>{item.note}</div>}
            </div>
          </div>
        ))
      )}

      {activeTab === "skills" && (activeSkills.length === 0
        ? <div className="empty-state" style={{padding: "1.5rem"}}>Zaznacz zdolności jako aktywne w zakładce „Zdolności”.</div>
        : activeSkills.map(sk => (
          <div key={sk.id} className="equipped-item">
            <span className="equipped-icon">✨</span>
            <div className="flex1">
              <div className="row" style={{gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap"}}>
                <span className="equipped-name">{sk.name}</span>
                <span className="equipped-skill-badge">{sk.category}</span>
                {sk.level > 0 && <span className="equipped-skill-badge">{"●".repeat(sk.level)}</span>}
              </div>
              {sk.description && <div className="equipped-stat">{sk.description}</div>}
              {sk.tags && sk.tags.length > 0 && <div className="equipped-stat" style={{opacity: 0.55, fontSize: "0.8rem"}}>{sk.tags.join(" · ")}</div>}
            </div>
          </div>
        ))
      )}

      {activeTab === "spells" && <>
        <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
        {activeSpells.length > 0 && <div style={{marginTop: "0.8rem"}}>
          {activeSpells.map(sp => (
            <div key={sp.id} className="equipped-item">
              <span className="equipped-icon">🔮</span>
              <div className="flex1">
                <div className="row" style={{gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap"}}>
                  <span className="equipped-name" style={{color: "var(--spell-text)"}}>{sp.name}</span>
                  <span className="equipped-spell-badge">{sp.level}</span>
                  {sp.school && <span className="equipped-spell-badge">Szkoła: {sp.school}</span>}
                </div>
                {(sp.castingTime || sp.range || sp.duration) &&
                  <div className="equipped-stat" style={{color: "var(--spell-muted)"}}>
                    {[sp.castingTime && `⏱ Czas rzucania: ${sp.castingTime}`, sp.range && `↗ Zasięg: ${sp.range}`, sp.duration && `⧗ Czas trwania: ${sp.duration}`].filter(Boolean).join("  ·  ")}
                  </div>}
                {sp.components && <div className="equipped-stat" style={{opacity: 0.6, fontSize: "0.85rem"}}>Komponenty: {sp.components}</div>}
                {sp.description && <div className="equipped-stat">{sp.description}</div>}
                {sp.notes && <div className="equipped-stat" style={{fontStyle: "italic", opacity: 0.7, borderTop: "1px solid rgba(128,128,128,0.12)", paddingTop: "0.2rem", marginTop: "0.2rem"}}>{sp.notes}</div>}
              </div>
            </div>
          ))}
        </div>}
        {activeSpells.length === 0 && <div className="empty-state" style={{padding: "1rem"}}>Zaznacz czary jako przygotowane w zakładce „Czary”.</div>}
      </>}
    </div>}

    <div className="card">
      <div className="sect-label">Cechy osobowości</div>
      <div className="trait-grid">
        {[["personality", "Cechy charakteru", "Jak Twoja postać się zachowuje, co mówi…"],
          ["ideals", "Ideały", "W co wierzy i jakimi zasadami się kieruje…"],
          ["bonds", "Więzi", "Co łączy Twoją postać ze światem lub drużyną…"],
          ["flaws", "Wady i słabości", "Największe skazy i słabości Twojego bohatera…"]].map(([key, label, ph]) => (
          <div key={key} className="trait-block">
            <span className="trait-label">{label}</span>
            <textarea className="trait-ta" rows={3} placeholder={ph} value={char.traits?.[key] || ""} onChange={e => setChar(c => ({...c, traits: {...(c.traits || {}), [key]: e.target.value}}))}/>
          </div>
        ))}
      </div>
    </div>

    <div className="card">
      <div className="sect-label">Notatki osobiste</div>
      <textarea className="g-textarea" rows={4} placeholder="Wskazówki Mistrza Gry, przypomnienia, cele drużynowe…" value={char.personalNotes || ""} onChange={e => upd("personalNotes", e.target.value)}/>
    </div>

    <div className="card">
      <div className="sect-label">Historia postaci</div>
      <textarea className="g-textarea" rows={6} placeholder="Skąd pochodzi Twój bohater? Co go ukształtowało i czego szuka w świecie?…" value={char.backstory || ""} onChange={e => upd("backstory", e.target.value)}/>
    </div>
  </>;
}

/* ═══ PANEL PLECAKA (EKWIPUNEK) ══════════════════ */
function Plecak({inventory, setInventory}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:"", type:"Ogólny", qty:"1", damage:"", damageType:"", modifier:"", charges:"", effect:"", note:""});
  const [expanded, setExpanded] = useState({});
  const [filterType, setFilterType] = useState(null);
  
  const addItem = () => { const n = form.name.trim(); if (!n) return; setInventory(inv => [...inv, {id: Date.now(), equipped: false, ...form, name: n}]); setForm({name:"", type:"Ogólny", qty:"1", damage:"", damageType:"", modifier:"", charges:"", effect:"", note:""}); setShowForm(false); };
  const upd = (id, f, v) => setInventory(inv => inv.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => setInventory(inv => inv.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  const toggleEquip = id => setInventory(inv => inv.map(x => x.id === id ? {...x, equipped: !x.equipped} : x));
  
  const visible = filterType ? inventory.filter(i => i.type === filterType) : inventory;
  const equippedCount = inventory.filter(i => i.equipped).length;
  const needsExtras = t => ["Broń", "Zwój z czarem", "Cudowny przedmiot", "Jednorazowy"].includes(t);
  
  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em"}}>{inventory.length} przedmiotów{equippedCount > 0 ? ` · ${equippedCount} wyposażonych` : ""}</span>
      <button className="btn-gold" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj przedmiot"}</button>
    </div>
    
    {showForm && <div className="add-form"><div className="col">
      <div className="row"><input className="g-input flex1" placeholder="Nazwa przedmiotu…" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && addItem()}/><input className="g-input" style={{width: 60}} placeholder="Ilość" value={form.qty} onChange={e => setForm(f => ({...f, qty: e.target.value}))}/></div>
      <div className="row" style={{gap: "0.4rem", flexWrap: "wrap"}}>{ITEM_TYPES.map(t => <button key={t} className="filter-tag" style={{opacity: form.type === t ? 1 : 0.5, borderColor: form.type === t ? "currentColor" : ""}} onClick={() => setForm(f => ({...f, type: t}))}>{ITEM_ICONS[t]} {t}</button>)}</div>
      {needsExtras(form.type) && <>
        {form.type === "Broń" && <div className="pack-item-row">
          <div className="pack-field"><span className="pack-field-label">Kości obrażeń</span><input className="pack-field-input" placeholder="e.g. 1d8" value={form.damage} onChange={e => setForm(f => ({...f, damage: e.target.value}))}/></div>
          <div className="pack-field"><span className="pack-field-label">Typ obrażeń</span><input className="pack-field-input" placeholder="e.g. Cięte" value={form.damageType} onChange={e => setForm(f => ({...f, damageType: e.target.value}))}/></div>
          <div className="pack-field"><span className="pack-field-label">Premia do trafienia</span><input className="pack-field-input" type="number" value={form.modifier} onChange={e => setForm(f => ({...f, modifier: e.target.value}))}/></div>
        </div>}
        {["Zwój z czarem", "Cudowny przedmiot", "Jednorazowy"].includes(form.type) && <div className="pack-item-row">
          <div className="pack-field"><span className="pack-field-label">Ładunki</span><input className="pack-field-input" value={form.charges} onChange={e => setForm(f => ({...f, charges: e.target.value}))}/></div>
          <div className="pack-field" style={{flex: 2}}><span className="pack-field-label">Efekt działania</span><input className="pack-field-input" value={form.effect} onChange={e => setForm(f => ({...f, effect: e.target.value}))}/></div>
        </div>}
      </>}
      <input className="g-input" placeholder="Własne notatki…" value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))}/>
      <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addItem}>⊕ Zapisz przedmiot</button></div>
    </div></div>}

    <div className="filter-bar">
      <button className={`filter-tag${!filterType ? " active-filter" : ""}`} onClick={() => setFilterType(null)}>Wszystkie</button>
      {ITEM_TYPES.map(t => { const c = inventory.filter(i => i.type === t).length; if (!c) return null; return <button key={t} className={`filter-tag${filterType === t ? " active-filter" : ""}`} onClick={() => setFilterType(filterType === t ? null : t)}>{ITEM_ICONS[t]} {t} ({c})</button>; })}
    </div>

    {inventory.length === 0 && <div className="card empty-state">Twój plecak jest pusty…</div>}
    {visible.map(item => { const open = !!expanded[item.id]; return (
      <div key={item.id} className={`pack-item${item.equipped ? " equipped-active" : ""}`}>
        <div className="pack-item-header">
          <span style={{fontSize: "1.1rem", flexShrink: 0}}>{ITEM_ICONS[item.type] || "◈"}</span>
          <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700}} value={item.name} onChange={e => upd(item.id, "name", e.target.value)}/>
          <span style={{fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.08em", border: "1px solid currentColor", padding: "0.1rem 0.35rem", flexShrink: 0, opacity: 0.6}}>{item.type}</span>
          <Toggle on={!!item.equipped} onToggle={() => toggleEquip(item.id)} label={item.equipped ? "Wyposażony" : "W plecaku"} color="gold"/>
          <button className="entity-toggle" onClick={() => toggle(item.id)}>{open ? "▲" : "▼"}</button>
        </div>
        {open && <div className="pack-item-body">
          <div className="pack-item-row">
            <div className="pack-field"><span className="pack-field-label">Ilość</span><input className="pack-field-input" value={item.qty || "1"} onChange={e => upd(item.id, "qty", e.target.value)}/></div>
            {item.type === "Broń" && <>
              <div className="pack-field"><span className="pack-field-label">Obrażenia</span><input className="pack-field-input" value={item.damage || ""} onChange={e => upd(item.id, "damage", e.target.value)}/></div>
              <div className="pack-field"><span className="pack-field-label">Typ</span><input className="pack-field-input" value={item.damageType || ""} onChange={e => upd(item.id, "damageType", e.target.value)}/></div>
              <div className="pack-field"><span className="pack-field-label">Premia rzutu</span><input className="pack-field-input" type="number" value={item.modifier || ""} onChange={e => upd(item.id, "modifier", e.target.value)}/></div>
            </>}
            {["Zwój z czarem", "Cudowny przedmiot", "Jednorazowy"].includes(item.type) && <>
              <div className="pack-field"><span className="pack-field-label">Ładunki</span><input className="pack-field-input" value={item.charges || ""} onChange={e => upd(item.id, "charges", e.target.value)}/></div>
              <div className="pack-field" style={{flex: 2}}><span className="pack-field-label">Działanie</span><input className="pack-field-input" value={item.effect || ""} onChange={e => upd(item.id, "effect", e.target.value)}/></div>
            </>}
          </div>
          <div className="pack-field"><span className="pack-field-label">Notatki</span><input className="pack-field-input" value={item.note || ""} onChange={e => upd(item.id, "note", e.target.value)}/></div>
          <div className="row" style={{justifyContent: "flex-end", marginTop: "0.3rem"}}><button className="btn-ghost" onClick={() => del(item.id)}>Usuń</button></div>
        </div>}
      </div>
    ); })}
  </>;
}

/* ═══ PANEL ZDOLNOŚCI I ATUTÓW ═══════════════════ */
function UmiejętnościTab({skills, setUmiejętności}) {
  const [form, setForm] = useState({name:"", category:"Umiejętność", description:"", level:0});
  const [showForm, setShowForm] = useState(false); const [expanded, setExpanded] = useState({}); const [activeTag, setAktywnyTag] = useState(null); const [activeCat, setAktywnyCat] = useState(null);
  const allTags = [...new Set(skills.flatMap(s => s.tags || []))].sort();
  
  const addSkill = () => { const n = form.name.trim(); if (!n) return; setUmiejętności(l => [...l, {id: Date.now(), name: n, category: form.category, description: form.description.trim(), level: form.level, tags: [], pinned: false, inUse: false}]); setForm({name:"", category:"Umiejętność", description:"", level:0}); setShowForm(false); };
  const upd = (id, f, v) => setUmiejętności(l => l.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => setUmiejętności(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  const toggleInUse = id => setUmiejętności(l => l.map(x => x.id === id ? {...x, inUse: !x.inUse} : x));
  
  const visible = skills.filter(s => (!activeTag || (s.tags || []).includes(activeTag)) && (!activeCat || s.category === activeCat)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const catColor = cat => ({"Umiejętność": "#c9943e", "Cecha rasowa": "#4a8aaa", "Atut": "#9a6030"})[cat] || "#8a7848";
  const inUseCount = skills.filter(s => s.inUse).length;
  
  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em"}}>{skills.length} wpisów{inUseCount > 0 ? ` · ${inUseCount} aktywnych` : ""}</span>
      <button className="btn-gold" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj wpis"}</button>
    </div>
    {showForm && <div className="add-form"><div className="col">
      <input className="g-input" placeholder="Nazwa zdolności…" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && addSkill()}/>
      <div className="row" style={{gap: "0.4rem", flexWrap: "wrap"}}>{SKILL_CATS.map(c => <button key={c} className="filter-tag" style={{opacity: form.category === c ? 1 : 0.45, borderColor: form.category === c ? catColor(c) + "88" : "", color: form.category === c ? catColor(c) : ""}} onClick={() => setForm(f => ({...f, category: c}))}>{c}</button>)}</div>
      <div className="row" style={{gap: "0.6rem"}}><span style={{fontFamily: "Cinzel,serif", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.12em"}}>Poziom Mistrzostwa</span><SkillPips value={form.level} onChange={v => setForm(f => ({...f, level: v}))}/></div>
      <textarea className="g-textarea" rows={3} placeholder="Opis działania, wymagania, modyfikatory mechaniczne…" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}/>
      <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addSkill}>⊕ Dodaj</button></div>
    </div></div>}
    
    <div className="filter-bar">
      <button className={`filter-tag${!activeCat ? " active-filter" : ""}`} onClick={() => setAktywnyCat(null)}>Wszystkie</button>
      {SKILL_CATS.map(c => { const count = skills.filter(s => s.category === c).length; if (!count) return null; return <button key={c} className={`filter-tag${activeCat === c ? " active-filter" : ""}`} style={{borderColor: activeCat === c ? catColor(c) + "88" : "", color: activeCat === c ? catColor(c) : ""}} onClick={() => setAktywnyCat(activeCat === c ? null : c)}>{c} ({count})</button>; })}
    </div>
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setAktywnyTag}/>
    
    {skills.length === 0 && <div className="card empty-state">Brak zapisanych umiejętności, cech rasowych ani atutów.</div>}
    {visible.map(sk => { const open = !!expanded[sk.id]; const cc = catColor(sk.category); return (
      <div key={sk.id} className={`card${sk.pinned ? " pinned" : ""}${sk.inUse ? " inuse-active" : ""}`} style={{padding: "1rem 1.1rem", borderLeftColor: cc + "55", borderLeftWidth: 2}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap"}}>
              <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "0.98rem", fontWeight: 700}} value={sk.name} onChange={e => upd(sk.id, "name", e.target.value)} placeholder="Nazwa…"/>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: cc, border: `1px solid ${cc}55`, padding: "0.15rem 0.5rem", background: `${cc}0d`, flexShrink: 0}}>{sk.category}</span>
            </div>
            {sk.level > 0 && <SkillPips value={sk.level} onChange={v => upd(sk.id, "level", v)}/>}
          </div>
          <Toggle on={!!sk.inUse} onToggle={() => toggleInUse(sk.id)} label={sk.inUse ? "Aktywna" : "Nieaktywna"} color="purple"/>
          <PrzypnijBtn pinned={sk.pinned} onToggle={() => upd(sk.id, "pinned", !sk.pinned)}/>
          <button className="entity-toggle" onClick={() => toggle(sk.id)}>{open ? "▲" : "▼"}</button>
        </div>
        {!open && sk.description && <p style={{fontSize: "0.92rem", fontStyle: "italic", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.7}}>{sk.description}</p>}
        <TagsEditor tags={sk.tags || []} onChange={v => upd(sk.id, "tags", v)}/>
        {open && <div style={{marginTop: "0.8rem"}}>
          <div className="row" style={{gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem"}}>{SKILL_CATS.map(c => <button key={c} className="filter-tag" style={{opacity: sk.category === c ? 1 : 0.4, borderColor: sk.category === c ? catColor(c) + "88" : "", color: sk.category === c ? catColor(c) : ""}} onClick={() => upd(sk.id, "category", c)}>{c}</button>)}</div>
          <div className="row" style={{gap: "0.6rem", marginBottom: "0.7rem"}}><span style={{fontFamily: "Cinzel,serif", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.12em"}}>Mistrzostwo</span><SkillPips value={sk.level} onChange={v => upd(sk.id, "level", v)}/></div>
          <textarea className="g-textarea" rows={4} placeholder="Opis efektu działania cechy…" value={sk.description || ""} onChange={e => upd(sk.id, "description", e.target.value)}/>
          <div className="row mt05" style={{justifyContent: "flex-end"}}><button className="btn-ghost" onClick={() => del(sk.id)}>Usuń</button></div>
        </div>}
      </div>
    ); })}
  </>;
}

/* ═══ PANEL KSIĘGI CZARÓW ════════════════════════ */
function CzaryTab({spells, setCzary, char, setChar}) {
  const [form, setForm] = useState({name:"", level:"Sztuczka", school:"Wywoływanie", castingTime:"1 akcja", zakres:"", duration:"", components:"", description:"", notes:""});
  const [showForm, setShowForm] = useState(false); const [expanded, setExpanded] = useState({}); const [activeLevel, setAktywnyLevel] = useState(null); const [showSlots, setShowSlots] = useState(false);

  const addSpell = () => { const n = form.name.trim(); if (!n) return; setCzary(l => [...l, {id: Date.now(), ...form, name: n, tags: [], pinned: false, inUse: false}]); setForm({name:"", level:"Sztuczka", school:"Wywoływanie", castingTime:"1 akcja", zakres:"", duration:"", components:"", description:"", notes:""}); setShowForm(false); };
  const upd = (id, f, v) => setCzary(l => l.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => setCzary(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  const toggleInUse = id => setCzary(l => l.map(x => x.id === id ? {...x, inUse: !x.inUse} : x));
  
  const pb = char.profBonus || 2;
  const spMod = Math.floor(((char.stats || {})[char.spellcastingAbility || "INT"] || 10) - 10) / 2;
  const visible = activeLevel ? spells.filter(s => s.level === activeLevel) : spells;
  const inUseCount = spells.filter(s => s.inUse).length;

  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--spell-muted)"}}>{spells.length} czarów{inUseCount > 0 ? ` · ${inUseCount} przygotowanych` : ""}</span>
      <div className="row" style={{gap: "0.5rem"}}>
        <button className="btn-shadow" style={{borderColor: "var(--spell-border)", color: "var(--spell-accent)", background: "transparent", cursor: "pointer"}} onClick={() => setShowSlots(s => !s)}>{showSlots ? "✕ Ukryj komórki" : "⚙ Zarządzaj komórkami"}</button>
        <button className="btn-gold" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj czar"}</button>
      </div>
    </div>

    {showSlots && <div className="card" style={{borderColor: "var(--spell-border)"}}>
      <div className="sect-label" style={{color: "var(--spell-accent)"}}>Komórki czarów i rzucanie magii</div>
      <div style={{display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem", flexWrap: "wrap"}}>
        <span style={{fontFamily: "Cinzel,serif", fontSize: "0.54rem", letterSpacing: "0.14em", color: "var(--spell-muted)", textTransform: "uppercase"}}>Cecha rzucania</span>
        <select className="g-select" style={{width: "auto", fontSize: "0.82rem", padding: "0.25rem 0.5rem", borderColor: "#1a3a6a"}} value={char.spellcastingAbility || "INT"} onChange={e => setChar(c => ({...c, spellcastingAbility: e.target.value}))}>{STAT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}</select>
        <span style={{fontFamily: "Cinzel,serif", fontSize: "0.72rem", color: "var(--spell-accent)"}}>Trudność czarów (DC): {8 + pb + spMod} · Modyfikator ataku: {numMod(pb + spMod)}</span>
      </div>
      <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
    </div>}

    {showForm && <div className="add-form" style={{borderColor: "var(--spell-border)"}}><div className="col">
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem"}}>
        <input className="g-input" placeholder="Nazwa zaklęcia…" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && addSpell()}/>
        <select className="g-select" value={form.school} onChange={e => setForm(f => ({...f, school: e.target.value}))}>{SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}</select>
      </div>
      <div className="row" style={{gap: "0.4rem", flexWrap: "wrap"}}>{SPELL_LEVELS.map(lv => <button key={lv} className="filter-tag" style={{opacity: form.level === lv ? 1 : 0.45, borderColor: form.level === lv ? "#1a5a9a" : "", color: form.level === lv ? "#64a0e6" : ""}} onClick={() => setForm(f => ({...f, level: lv}))}>{lv}</button>)}</div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem"}}>
        <div className="pack-field"><span className="pack-field-label">Czas rzucania</span><input className="pack-field-input" placeholder="e.g. 1 akcja" value={form.castingTime} onChange={e => setForm(f => ({...f, castingTime: e.target.value}))}/></div>
        <div className="pack-field"><span className="pack-field-label">Zasięg</span><input className="pack-field-input" placeholder="e.g. 60 stóp" value={form.zakres} onChange={e => setForm(f => ({...f, zakres: e.target.value}))}/></div>
        <div className="pack-field"><span className="pack-field-label">Czas trwania</span><input className="pack-field-input" placeholder="e.g. Natychmiastowy" value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))}/></div>
      </div>
      <input className="g-input" placeholder="Komponenty (V, S, M…)" value={form.components} onChange={e => setForm(f => ({...f, components: e.target.value}))}/>
      <textarea className="g-textarea" rows={3} placeholder="Opis działania czaru i jego efekty rzutu…" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}/>
      <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addSpell}>⊕ Zapisz czar</button></div>
    </div></div>}

    <div className="filter-bar">
      <button className={`filter-tag${!activeLevel ? " active-filter" : ""}`} onClick={() => setAktywnyLevel(null)}>Wszystkie</button>
      {SPELL_LEVELS.map(lv => { const count = spells.filter(s => s.level === lv).length; if (!count) return null; return <button key={lv} className={`filter-tag${activeLevel === lv ? " active-filter" : ""}`} style={{borderColor: activeLevel === lv ? "#1a5a9a" : "", color: activeLevel === lv ? "#64a0e6" : ""}} onClick={() => setAktywnyLevel(activeLevel === lv ? null : lv)}>{lv} ({count})</button>; })}
    </div>

    {spells.length === 0 && <div className="card empty-state">Brak zapisanych czarów w księdze.</div>}
    {visible.map(sp => { const open = !!expanded[sp.id]; return (
      <div key={sp.id} className={`card${sp.pinned ? " pinned" : ""}${sp.inUse ? " spell-active" : ""}`} style={{padding: "1rem 1.1rem", borderLeftColor: "#1a4a8a", borderLeftWidth: 2}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap"}}>
              <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "0.98rem", color: "var(--spell-text)", fontWeight: 700}} value={sp.name} onChange={e => upd(sp.id, "name", e.target.value)} placeholder="Nazwa czaru…"/>
              <span className="spell-level-badge">{sp.level}</span>
              {sp.school && <span className="spell-school-badge">{sp.school}</span>}
            </div>
            {!open && <div style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.08em", color: "var(--spell-muted)"}}>
              {[sp.castingTime, sp.zakres && `Zasięg: ${sp.zakres}`, sp.duration && `Czas trwania: ${sp.duration}`].filter(Boolean).join(" · ")}
            </div>}
          </div>
          <Toggle on={!!sp.inUse} onToggle={() => toggleInUse(sp.id)} label={sp.inUse ? "Przygotowany" : "Znany"} color="blue"/>
          <PrzypnijBtn pinned={sp.pinned} onToggle={() => upd(sp.id, "pinned", !sp.pinned)}/>
          <button className="entity-toggle" onClick={() => toggle(sp.id)}>{open ? "▲" : "▼"}</button>
        </div>
        {!open && sp.description && <p style={{fontSize: "0.9rem", color: "var(--spell-muted)", fontStyle: "italic", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{sp.description}</p>}
        <TagsEditor tags={sp.tags || []} onChange={v => upd(sp.id, "tags", v)}/>
        {open && <div style={{marginTop: "0.8rem"}}>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.7rem"}}>
            <div><span style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--spell-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.2rem"}}>Poziom</span><select className="g-select" style={{fontSize: "0.82rem", padding: "0.25rem 0.5rem", borderColor: "var(--spell-border)"}} value={sp.level} onChange={e => upd(sp.id, "level", e.target.value)}>{SPELL_LEVELS.map(lv => <option key={lv} value={lv}>{lv}</option>)}</select></div>
            <div><span style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--spell-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.2rem"}}>Szkoła magii</span><select className="g-select" style={{fontSize: "0.82rem", padding: "0.25rem 0.5rem", borderColor: "var(--spell-border)"}} value={sp.school} onChange={e => upd(sp.id, "school", e.target.value)}>{SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.7rem"}}>
            <div className="pack-field"><span className="pack-field-label">Czas rzucania</span><input className="pack-field-input" value={sp.castingTime || ""} onChange={e => upd(sp.id, "castingTime", e.target.value)}/></div>
            <div className="pack-field"><span className="pack-field-label">Zasięg</span><input className="pack-field-input" value={sp.zakres || ""} onChange={e => upd(sp.id, "zakres", e.target.value)}/></div>
            <div className="pack-field"><span className="pack-field-label">Czas trwania</span><input className="pack-field-input" value={sp.duration || ""} onChange={e => upd(sp.id, "duration", e.target.value)}/></div>
          </div>
          <div className="pack-field" style={{marginBottom: "0.6rem"}}><span className="pack-field-label">Komponenty czaru</span><input className="pack-field-input" value={sp.components || ""} placeholder="V, S, M (komponenty materialne)" onChange={e => upd(sp.id, "components", e.target.value)}/></div>
          <textarea className="g-textarea" rows={4} placeholder="Pełny opis działania czaru…" value={sp.description || ""} onChange={e => upd(sp.id, "description", e.target.value)}/>
          <div style={{marginTop: "0.5rem"}}>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--spell-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.25rem"}}>Na wyższych poziomach / Notatki dodatkowe</span>
            <textarea className="g-textarea" rows={2} value={sp.notes || ""} placeholder="Efekty, gdy rzucasz czar za pomocą wyższego slotu magii…" onChange={e => upd(sp.id, "notes", e.target.value)}/>
          </div>
          <div className="row mt05" style={{justifyContent: "flex-end"}}><button className="btn-ghost" onClick={() => del(sp.id)}>Usuń</button></div>
        </div>}
      </div>
    ); })}
  </>;
}

/* ═══ PANEL KRONIKI KRONIK NPC ═══════════════════ */
function NPCTracker({npcs, setNPCs}) {
  const [formState, setForm] = useState({name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:""});
  const [showForm, setShowForm] = useState(false); const [expanded, setExpanded] = useState({}); const [activeTag, setAktywnyTag] = useState(null);
  const allTags = [...new Set(npcs.flatMap(n => n.tags || []))].sort();
  
  const addNPC = () => { const n = formState.name.trim(); if (!n) return; setNPCs(l => [...l, {id: Date.now(), ...formState, name: n, tags: [], pinned: false}]); setForm({name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:""}); setShowForm(false); };
  const upd = (id, f, v) => setNPCs(l => l.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => setNPCs(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  const cycleRel = id => setNPCs(l => l.map(x => x.id === id ? {...x, relation: REL_CYCLE[x.relation || "unknown"]} : x));
  
  const visible = npcs.filter(n => !activeTag || (n.tags || []).includes(activeTag)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em"}}>{npcs.length} znanych postaci</span>
      <button className="btn-gold" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj postać"}</button>
    </div>
    {showForm && <div className="add-form"><div className="col">
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem"}}>
        <input className="g-input" placeholder="Imię / Nazwa postaci…" value={formState.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && addNPC()}/>
        <input className="g-input" placeholder="Rola / Profesja postaci…" value={formState.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}/>
        <input className="g-input" placeholder="Przynależność / Frakcja…" value={formState.affiliation} onChange={e => setForm(f => ({...f, affiliation: e.target.value}))}/>
        <input className="g-input" placeholder="Miejsce poznania…" value={formState.metAt} onChange={e => setForm(f => ({...f, metAt: e.target.value}))}/>
      </div>
      <input className="g-input" placeholder="Powiązania z innymi bohaterami…" value={formState.connections} onChange={e => setForm(f => ({...f, connections: e.target.value}))}/>
      <div className="row" style={{gap: "0.5rem", flexWrap: "wrap"}}>{["unknown", "ally", "neutral", "hostile"].map(r => <button key={r} className={`rel-badge rel-${r}`} style={{opacity: formState.relation === r ? 1 : 0.45}} onClick={() => setForm(f => ({...f, relation: r}))}>{REL_LABELS[r]}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Notatki dodatkowe, sekrety postawy…" value={formState.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}/>
      <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addNPC}>⊕ Dodaj postać</button></div>
    </div></div>}
    
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setAktywnyTag}/>
    {npcs.length === 0 && <div className="card empty-state">Brak zapisanych postaci w kartotece świata.</div>}
    {visible.map(npc => { const open = !!expanded[npc.id]; const rel = npc.relation || "unknown"; return (
      <div key={npc.id} className={`card${npc.pinned ? " pinned" : ""}`} style={{padding: "1rem 1.1rem"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap"}}>
              <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "1rem", fontWeight: 700}} value={npc.name} onChange={e => upd(npc.id, "name", e.target.value)} placeholder="Imię postaci…"/>
              <span className={`rel-badge rel-${rel}`} onClick={() => cycleRel(npc.id)}>{REL_LABELS[rel]}</span>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 0.6rem"}}>
              <input className="iedit" style={{fontSize: "0.88rem", fontStyle: "italic"}} value={npc.role || ""} onChange={e => upd(npc.id, "role", e.target.value)} placeholder="Rola…"/>
              <input className="iedit" style={{fontSize: "0.88rem"}} value={npc.affiliation || ""} onChange={e => upd(npc.id, "affiliation", e.target.value)} placeholder="Frakcja…"/>
              <input className="iedit" style={{fontSize: "0.85rem"}} value={npc.metAt || ""} onChange={e => upd(npc.id, "metAt", e.target.value)} placeholder="Miejsce poznania…"/>
              <input className="iedit" style={{fontSize: "0.85rem"}} value={npc.connections || ""} onChange={e => upd(npc.id, "connections", e.target.value)} placeholder="Powiązania…"/>
            </div>
          </div>
          <PrzypnijBtn pinned={npc.pinned} onToggle={() => upd(npc.id, "pinned", !npc.pinned)}/>
          <button className="entity-toggle" onClick={() => toggle(npc.id)}>{open ? "▲" : "▼"}</button>
        </div>
        <TagsEditor tags={npc.tags || []} onChange={v => upd(npc.id, "tags", v)}/>
        {open && <div style={{marginTop: "0.8rem"}}>
          <textarea className="g-textarea" rows={4} placeholder="Zgromadzone fakty, sekrety, plotki, cechy charakterystyczne…" value={npc.notes || ""} onChange={e => upd(npc.id, "notes", e.target.value)}/>
          <div className="row mt05" style={{justifyContent: "flex-end"}}><button className="btn-ghost" onClick={() => del(npc.id)}>Usuń</button></div>
        </div>}
      </div>
    ); })}
  </>;
}

/* ═══ PANEL KARTOTEKI LOKACJI ════════════════════ */
function Locations({locations, setLocations}) {
  const [form, setForm] = useState({name:"", type:"Osada", notes:""});
  const [showForm, setShowForm] = useState(false); const [expanded, setExpanded] = useState({}); const [activeTag, setAktywnyTag] = useState(null);
  const allTags = [...new Set(locations.flatMap(l => l.tags || []))].sort();
  
  const addLoc = () => { const n = form.name.trim(); if (!n) return; setLocations(l => [...l, {id: Date.now(), name: n, type: form.type, notes: form.notes.trim(), tags: [], pinned: false}]); setForm({name:"", type:"Osada", notes:""}); setShowForm(false); };
  const upd = (id, f, v) => setLocations(l => l.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => setLocations(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  
  const visible = locations.filter(l => !activeTag || (l.tags || []).includes(activeTag)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em"}}>{locations.length} lokacji naniesionych na mapę</span>
      <button className="btn-gold" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj lokację"}</button>
    </div>
    {showForm && <div className="add-form"><div className="col">
      <input className="g-input" placeholder="Nazwa geograficzna lokacji…" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && addLoc()}/>
      <div className="row" style={{gap: "0.4rem", flexWrap: "wrap"}}>{LOC_TYPES.map(t => <button key={t} className="filter-tag" style={{opacity: form.type === t ? 1 : 0.45, borderColor: form.type === t ? "currentColor" : ""}} onClick={() => setForm(f => ({...f, type: t}))}>{t}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Opis, klimat, geografia, niebezpieczeństwa, ważne punkty…" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}/>
      <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addLoc}>⊕ Dodaj</button></div>
    </div></div>}
    
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setAktywnyTag}/>
    {locations.length === 0 && <div className="card empty-state">Brak zapisanych lokacji. Mapuj odkryty świat!</div>}
    {visible.map(loc => { const open = !!expanded[loc.id]; return (
      <div key={loc.id} className={`card${loc.pinned ? " pinned" : ""}`} style={{padding: "1rem 1.1rem"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap: "0.5rem", marginBottom: "0.25rem"}}>
              <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "1rem", fontWeight: 700}} value={loc.name} onChange={e => upd(loc.id, "name", e.target.value)} placeholder="Nazwa lokacji…"/>
              <span className="loc-type">{loc.type}</span>
            </div>
          </div>
          <PrzypnijBtn pinned={loc.pinned} onToggle={() => upd(loc.id, "pinned", !loc.pinned)}/>
          <button className="entity-toggle" onClick={() => toggle(loc.id)}>{open ? "▲" : "▼"}</button>
        </div>
        <TagsEditor tags={loc.tags || []} onChange={v => upd(loc.id, "tags", v)}/>
        {open && <div style={{marginTop: "0.8rem"}}>
          <div className="row" style={{gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.7rem"}}>{LOC_TYPES.map(t => <button key={t} className="filter-tag" style={{opacity: loc.type === t ? 1 : 0.4, borderColor: loc.type === t ? "currentColor" : ""}} onClick={() => upd(loc.id, "type", t)}>{t}</button>)}</div>
          <textarea className="g-textarea" rows={4} placeholder="Atmosfera, rezydenci, zagrożenia, historia lokacji…" value={loc.notes || ""} onChange={e => upd(loc.id, "notes", e.target.value)}/>
          <div className="row mt05" style={{justifyContent: "flex-end"}}><button className="btn-ghost" onClick={() => del(loc.id)}>Usuń</button></div>
        </div>}
      </div>
    ); })}
  </>;
}

/* ═══ PANEL KARTOTEKI FRAKCJI ════════════════════ */
function Factions({factions, setFactions}) {
  const [form, setForm] = useState({name:"", type:"Gildia", rank:"Nieznany", leader:"", headquarters:"", goal:"", notes:""});
  const [showForm, setShowForm] = useState(false); const [expanded, setExpanded] = useState({}); const [activeTag, setActiveTag] = useState(null); const [filterType, setFilterType] = useState(null);

  const allTags = [...new Set(factions.flatMap(f => f.tags || []))].sort();
  const addFaction = () => {
    const n = form.name.trim(); if (!n) return;
    setFactions(l => [...l, {id: Date.now(), ...form, name: n, tags: [], pinned: false, reputation: 0}]);
    setForm({name:"", type:"Gildia", rank:"Nieznany", leader:"", headquarters:"", goal:"", notes:""});
    setShowForm(false);
  };
  const upd = (id, f, v) => setFactions(l => l.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => setFactions(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  const cycleRank = id => setFactions(l => l.map(x => {
    if (x.id !== id) return x;
    const idx = FACTION_RANKS.indexOf(x.rank || "Nieznany");
    return {...x, rank: FACTION_RANKS[(idx + 1) % FACTION_RANKS.length]};
  }));

  const visible = factions.filter(f => (!activeTag || (f.tags || []).includes(activeTag)) && (!filterType || f.type === filterType)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const rankColor = r => FACTION_RANK_COLORS[r] || "#6a5a38";

  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em"}}>{factions.length} udokumentowanych frakcji</span>
      <button className="btn-gold" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj frakcję"}</button>
    </div>

    {showForm && <div className="add-form"><div className="col">
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem"}}>
        <input className="g-input" placeholder="Nazwa ugrupowania / frakcji…" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && addFaction()}/>
        <input className="g-input" placeholder="Przywódca / Dowódca struktury…" value={form.leader} onChange={e => setForm(f => ({...f, leader: e.target.value}))}/>
        <input className="g-input" placeholder="Główna kwatera / Terytorium wpływów…" value={form.headquarters} onChange={e => setForm(f => ({...f, headquarters: e.target.value}))}/>
        <input className="g-input" placeholder="Główny cel organizacji…" value={form.goal} onChange={e => setForm(f => ({...f, goal: e.target.value}))}/>
      </div>
      <div className="row" style={{gap: "0.35rem", flexWrap: "wrap"}}>{FACTION_TYPES.map(t => <button key={t} className="filter-tag" style={{opacity: form.type === t ? 1 : 0.45, borderColor: form.type === t ? "currentColor" : ""}} onClick={() => setForm(f => ({...f, type: t}))}>{t}</button>)}</div>
      <div className="row" style={{gap: "0.35rem", flexWrap: "wrap"}}>{FACTION_RANKS.map(r => <button key={r} className="filter-tag" style={{opacity: form.rank === r ? 1 : 0.4, borderColor: form.rank === r ? rankColor(r) + "88" : "", color: form.rank === r ? rankColor(r) : ""}} onClick={() => setForm(f => ({...f, rank: r}))}>{r}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Historia ugrupowania, dogmaty wewnętrzne, sekrety kapituły…" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}/>
      <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addFaction}>⊕ Dodaj ugrupowanie</button></div>
    </div></div>}

    <div className="filter-bar">
      <button className={`filter-tag${!filterType?" active-filter":""}`} onClick={()=>setFilterType(null)}>Wszystkie</button>
      {FACTION_TYPES.map(t => { const c = factions.filter(f => f.type === t).length; if (!c) return null; return <button key={t} className={`filter-tag${filterType === t ? " active-filter" : ""}`} onClick={() => setFilterType(filterType === t ? null : t)}>{t} ({c})</button>; })}
    </div>
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>

    {factions.length === 0 && <div className="card empty-state">Brak zapisanych organizacji w świecie gry.<br/><span style={{fontSize: "0.62rem"}}>Zapisuj gildie kupieckie, potężne zakony rycerskie lub tajne sekty…</span></div>}
    {visible.map(fac => { const open = !!expanded[fac.id]; const rc = rankColor(fac.rank || "Nieznany"); const rep = fac.reputation || 0; return (
      <div key={fac.id} className={`card${fac.pinned ? " pinned" : ""}`} style={{padding: "1rem 1.1rem", borderLeftWidth: 2, borderLeftColor: rc + "55"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap"}}>
              <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "1rem", fontWeight: 700}} value={fac.name} onChange={e => upd(fac.id, "name", e.target.value)} placeholder="Nazwa frakcji…"/>
              <span onClick={() => cycleRank(fac.id)} style={{fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.15rem 0.55rem", border: `1px solid ${rc}55`, color: rc, background: `${rc}12`, cursor: "pointer", flexShrink: 0, transition: "all 0.15s", userSelect: "none"}}>{fac.rank || "Nieznany"}</span>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.2rem 0.6rem"}}>
              <input className="iedit" style={{fontSize: "0.82rem", fontStyle: "italic", opacity: 0.7}} value={fac.type || ""} onChange={e => upd(fac.id, "type", e.target.value)} placeholder="Typ…"/>
              <input className="iedit" style={{fontSize: "0.82rem", opacity: 0.7}} value={fac.leader || ""} onChange={e => upd(fac.id, "leader", e.target.value)} placeholder="Przywódca…"/>
              <input className="iedit" style={{fontSize: "0.8rem", opacity: 0.55}} value={fac.headquarters || ""} onChange={e => upd(fac.id, "headquarters", e.target.value)} placeholder="Siedziba główna…"/>
              <input className="iedit" style={{fontSize: "0.8rem", opacity: 0.55}} value={fac.goal || ""} onChange={e => upd(fac.id, "goal", e.target.value)} placeholder="Nadrzędny cel…"/>
            </div>
            <div style={{marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.44rem", letterSpacing: "0.1em", opacity: 0.5, textTransform: "uppercase", flexShrink: 0}}>Reputacja</span>
              <input type="range" min={-100} max={100} value={rep} onChange={e => upd(fac.id, "reputation", parseInt(e.target.value))} style={{flex: 1, accentColor: rep > 0 ? "#5a9a5a" : rep < 0 ? "#8a3a3a" : "#6a5a38", cursor: "pointer"}}/>
              <span style={{fontFamily: "Cinzel,serif", fontSize: "0.65rem", fontWeight: 700, minWidth: 36, textAlign: "right", color: rep > 50 ? "#5a9a5a" : rep > 0 ? "#8a9a5a" : rep < -50 ? "#8a3a3a" : rep < 0 ? "#9a6a3a" : "#6a5a38"}}>{rep > 0 ? "+" : ""}{rep}</span>
            </div>
          </div>
          <PrzypnijBtn pinned={fac.pinned} onToggle={() => upd(fac.id, "pinned", !fac.pinned)}/>
          <button className="entity-toggle" onClick={() => toggle(fac.id)}>{open ? "▲" : "▼"}</button>
        </div>
        <TagsEditor tags={fac.tags || []} onChange={v => upd(fac.id, "tags", v)}/>
        {open && <div style={{marginTop: "0.8rem"}}>
          <div className="row" style={{gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem"}}>{FACTION_RANKS.map(r => <button key={r} className="filter-tag" style={{opacity: fac.rank === r ? 1 : 0.35, borderColor: fac.rank === r ? rankColor(r) + "88" : "", color: fac.rank === r ? rankColor(r) : ""}} onClick={() => upd(fac.id, "rank", r)}>{r}</button>)}</div>
          <textarea className="g-textarea" rows={4} placeholder="Zgromadzone fakty, wewnętrzne dogmaty, hierarchia, sekrety operacyjne ugrupowania…" value={fac.notes || ""} onChange={e => upd(fac.id, "notes", e.target.value)}/>
          <div className="row mt05" style={{justifyContent: "flex-end"}}><button className="btn-ghost" onClick={() => del(fac.id)}>Usuń</button></div>
        </div>}
      </div>
    ); })}
  </>;
}

/* ═══ PANEL KRONIKI SESJI (DZIENNIK PRZYGÓD) ═════ */
function SesjaDziennik({sessions, setSesjas, npcs, locations, quests, inventory, skills, onNavigate}) {
  const [openIds, setOpenIds] = useState({}); const [editingId, setEditingId] = useState(null);
  const addSesja = () => { const e = {id: Date.now(), number: sessions.length + 1, date: today(), title: `Sesja ${sessions.length + 1}`, notes: ""}; setSesjas(s => [e, ...s]); setOpenIds(o => ({...o, [e.id]: true})); setEditingId(e.id); };
  const upd = (id, f, v) => setSesjas(s => s.map(x => x.id === id ? {...x, [f]: v} : x));
  const del = id => { setSesjas(s => s.filter(x => x.id !== id)); if (editingId === id) setEditingId(null); };
  const toggle = id => { setOpenIds(o => ({...o, [id]: !o[id]})); if (!openIds[id]) setEditingId(null); };
  
  const hasAny = npcs.length || locations.length || quests.length || inventory.length || skills.length;
  const hasNotes = sessions.some(s => s.notes);
  return <>
    <div className="row" style={{justifyContent: "space-between"}}>
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em"}}>{sessions.length} sesji udokumentowanych</span>
      <button className="btn-gold" onClick={addSesja}>⊕ Nowy wpis</button>
    </div>
    {hasAny && hasNotes && <div className="sess-legend">
      <span style={{fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase"}}>Podgląd encyklopedyczny linku po najechaniu →</span>
      {LEGEND_ITEMS.map(li => { const counts = {npc: npcs.length, location: locations.length, quest: quests.length, inventory: inventory.length, skill: skills.length}; if (!counts[li.type]) return null; return <div key={li.type} className="sess-legend-item"><div className="legend-dot" style={{background: li.color, border: `1px solid ${li.border}`}}/><span style={{color: li.border}}>{li.label}</span></div>; })}
    </div>}
    {sessions.length === 0 && <div className="card empty-state">Brak spisanych przygód w kronikach kampanii.</div>}
    {sessions.map(sess => {
      const open = !!openIds[sess.id]; const editing = editingId === sess.id;
      const parsed = parseEntityLinksWithTooltips(sess.notes, npcs, locations, quests, inventory, skills, onNavigate);
      return <div key={sess.id} className="sess-entry">
        <div className={`sess-header${open ? " open" : ""}`} onClick={() => toggle(sess.id)}>
          <span className="sess-num">#{String(sess.number).padStart(2, "0")}</span>
          <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "0.92rem"}} value={sess.title} onChange={e => { e.stopPropagation(); upd(sess.id, "title", e.target.value); }} onClick={e => e.stopPropagation()}/>
          <input type="date" style={{background: "transparent", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "0.75rem", outline: "none", flexShrink: 0, opacity: 0.6}} value={sess.date} onChange={e => { e.stopPropagation(); upd(sess.id, "date", e.target.value); }} onClick={e => e.stopPropagation()}/>
          <span style={{fontSize: "0.65rem", flexShrink: 0, opacity: 0.5}}>{open ? "▲" : "▼"}</span>
        </div>
        {open && <div className="sess-body">
          {editing ? <>
            <textarea className="g-textarea" rows={6} autoFocus placeholder="Zapisuj szczegóły z gry. Imiona postaci, nazwy miast lub zadań automatycznie zamienią się w interaktywne hiperłącza encyklopedyczne…" value={sess.notes} onChange={e => upd(sess.id, "notes", e.target.value)}/>
            <div className="row mt05" style={{justifyContent: "space-between"}}>
              <button className="btn-ghost" onClick={() => del(sess.id)}>Usuń wpis</button>
              <button className="btn-gold" onClick={() => setEditingId(null)}>✓ Gotowe</button>
            </div>
          </> : <>
            <div className="sess-rendered" data-placeholder="Brak sporządzonych notatek. Dotknij, aby zacząć pisać kronikę sesji…" onClick={() => setEditingId(sess.id)}>{sess.notes ? parsed : null}</div>
            <div className="row mt05" style={{justifyContent: "space-between"}}>
              <button className="btn-ghost" onClick={() => del(sess.id)}>Usuń wpis</button>
              <button className="btn-ghost" style={{opacity: 0.7}} onClick={() => setEditingId(sess.id)}>✎ Edytuj kronikę</button>
            </div>
          </>}
        </div>}
      </div>;
    })}
  </>;
}

/* ═══ PANEL TRACKERA ZADAŃ (QUESTÓW) ══════════════ */
function QuestTracker({quests, setZadania}) {
  const [name, setImie] = useState(""); const [desc, setDesc] = useState(""); const [reward, setNagroda] = useState("");
  const [expanded, setExpanded] = useState({});
  const addQuest = () => { const n = name.trim(); if (!n) return; setZadania(q => [...q, {id: Date.now(), name: n, description: desc.trim(), reward: reward.trim(), status: "Aktywne", kroks: []}]); setImie(""); setDesc(""); setNagroda(""); };
  const cycle = id => setZadania(q => q.map(x => x.id === id ? {...x, status: STATUS_CYCLE[x.status]} : x));
  const del = id => setZadania(q => q.filter(x => x.id !== id));
  const upd = (id, f, v) => setZadania(q => q.map(x => x.id === id ? {...x, [f]: v} : x));
  const toggle = id => setExpanded(e => ({...e, [id]: !e[id]}));
  
  const addStep = id => setZadania(q => q.map(x => x.id === id ? {...x, kroks: [...(x.kroks || []), {id: Date.now(), text: "", done: false}]} : x));
  const updStep = (id, sid, f, v) => setZadania(q => q.map(x => x.id === id ? {...x, kroks: (x.kroks || []).map(s => s.id === sid ? {...s, [f]: v} : s)} : x));
  const delStep = (id, sid) => setZadania(q => q.map(x => x.id === id ? {...x, kroks: (x.kroks || []).filter(s => s.id !== sid)} : x));
  
  return <>
    <div className="card">
      <div className="sect-label">Nowe zadanie w dzienniku</div>
      <div className="col">
        <input className="g-input" placeholder="Nazwa zlecenia / misji głównej…" value={name} onChange={e => setImie(e.target.value)} onKeyDown={e => e.key === "Enter" && addQuest()}/>
        <input className="g-input" placeholder="Krótki opis celów zlecenia…" value={desc} onChange={e => setDesc(e.target.value)}/>
        <input className="g-input" placeholder="Przewidziana nagroda (np. złoto, unikalny artefakt, PD)…" value={reward} onChange={e => setNagroda(e.target.value)}/>
        <div className="row" style={{justifyContent: "flex-end"}}><button className="btn-gold" onClick={addQuest}>⊕ Aktywuj zadanie</button></div>
      </div>
    </div>
    
    {quests.length === 0 && <div className="card empty-state">Brak aktywnych zleceń i zadań w dzienniku. Pokonaj marazm!</div>}
    {["Aktywne", "Ukończone", "Nieudane"].map(status => {
      const filtered = quests.filter(q => q.status === status); if (!filtered.length) return null;
      const lc = status === "Aktywne" ? "#c9943e" : status === "Ukończone" ? "#5a8a5a" : "#8a3a3a";
      return <div key={status} style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
        <div className="sect-label" style={{color: lc}}>{status} <span style={{opacity: 0.5}}>({filtered.length})</span></div>
        {filtered.map(quest => { const open = !!expanded[quest.id]; const kroks = quest.kroks || []; const doneCount = kroks.filter(s => s.done).length;
          return <div key={quest.id} className={`quest-entry ${status.toLowerCase()}`}>
            <div className="row" style={{alignItems: "flex-start"}}>
              <div className="flex1">
                <div className="row" style={{marginBottom: "0.3rem", flexWrap: "wrap", gap: "0.4rem"}}>
                  <input className="iedit flex1" style={{fontFamily: "Cinzel,serif", fontSize: "0.95rem", fontWeight: 700}} value={quest.name} onChange={e => upd(quest.id, "name", e.target.value)} placeholder="Nazwa zlecenia…"/>
                  <span className={`badge ${status.toLowerCase()}`} onClick={() => cycle(quest.id)}>{status}</span>
                </div>
                <input className="iedit" style={{fontSize: "0.92rem", fontStyle: "italic"}} value={quest.description || ""} onChange={e => upd(quest.id, "description", e.target.value)} placeholder="Opis…"/>
                {quest.reward && <div style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.1em", color: "var(--quest-reward)", marginTop: "0.3rem"}}>⭐ Nagroda: {quest.reward}</div>}
                {kroks.length > 0 && <div style={{fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.08em", marginTop: "0.2rem", opacity: 0.6}}>Postęp krokowy: {doneCount}/{kroks.length} wykonanych celów</div>}
              </div>
              <button className="entity-toggle" onClick={() => toggle(quest.id)} style={{marginTop: "0.1rem"}}>{open ? "▲" : "▼"}</button>
              <button onClick={() => del(quest.id)} style={{background: "transparent", border: "none", cursor: pointer, fontSize: "0.85rem", padding: "0.1rem 0.2rem", transition: "color 0.15s", flexShrink: 0, opacity: 0.4}} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}>✕</button>
            </div>
            {open && <div style={{marginTop: "0.7rem"}}>
              {kroks.map(krok => <div key={krok.id} className="checklist-item">
                <div className={`check-box${krok.done ? " checked" : ""}`} onClick={() => updStep(quest.id, krok.id, "done", !krok.done)}/>
                <input className={`iedit flex1 checklist-text${krok.done ? " done" : ""}`} style={{fontSize: "0.92rem"}} value={krok.text} onChange={e => updStep(quest.id, krok.id, "text", e.target.value)} placeholder="Opis kroku szczegółowego…"/>
                <button style={{background: "transparent", border: "none", cursor: pointer, fontSize: "0.75rem", transition: "opacity 0.15s", opacity: 0.3}} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.3"} onClick={() => delStep(quest.id, krok.id)}>✕</button>
              </div>)}
              <div className="row mt05" style={{justifyContent: "space-between", alignItems: "flex-end"}}>
                <button className="btn-sm" onClick={() => addStep(quest.id)}>+ Dodaj krok</button>
                <div style={{display: "flex", flexDirection: "column", gap: "0.1rem"}}>
                  <span style={{fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6}}>Modyfikuj nagrodę</span>
                  <input className="iedit" style={{fontSize: "0.88rem", color: "var(--quest-reward)", minWidth: 120}} value={quest.reward || ""} onChange={e => upd(quest.id, "reward", e.target.value)} placeholder="Nagroda…"/>
                </div>
              </div>
            </div>}
          </div>;
        })}
      </div>;
    })}
  </>;
}

/* ═══ EKRAN WYBORU PROFILU POSTACI ═══════════════ */
const DND_CLASSES = [
  {name: "Barbarzyńca", icon: "🪓"}, {name: "Bard",          icon: "🎶"},
  {name: "Kleryk",      icon: "✝️"}, {name: "Druid",         icon: "🌿"},
  {name: "Wojownik",    icon: "⚔️"}, {name: "Mnich",         icon: "☯️"},
  {name: "Paladyn",     icon: "🛡️"}, {name: "Łowca",         icon: "🏹"},
  {name: "Łotrzyk",     icon: "🗡️"}, {name: "Czarownik",     icon: "💫"},
  {name: "Zaklinacz",   icon: "👁️"}, {name: "Mag",           icon: "📚"},
  {name: "Inna",        icon: "⚡"},
];

const STAT_ARRAYS = {
  "Zestaw standardowy": {STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8},
  "Heroiczny (Silny)":  {STR: 16, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 11},
  "Zrównoważony":       {STR: 13, DEX: 13, CON: 13, INT: 13, WIS: 13, CHA: 13},
};

function ProfileScreen({ profiles, activeId, onSelect, onCreate, onDelete, theme }) {
  const t = THEMES[theme] || THEMES.dark;
  return (
    <div className="profile-screen">
      <div style={{position: "absolute", top: "1rem", right: "1rem"}}>
        <button
          onClick={() => { const idx = PALETTES.indexOf(theme); const next = PALETTES[(idx + 1) % PALETTES.length]; localStorage.setItem("hj_theme", JSON.stringify(next)); window.location.reload(); }}
          style={{background: "transparent", border: `1px solid ${t.borderInput}`, color: t.textMuted, fontFamily: "Cinzel,serif", fontSize: "0.55rem", letterSpacing: "0.1em", padding: "0.2rem 0.5rem", cursor: pointer, textTransform: "uppercase"}}
        >Zmień motyw</button>
      </div>

      <div className="profile-logo">⚔ Hero Journal</div>
      <div className="profile-tagline">Wybierz postać bohatera, aby kontynuować kampanię RPG</div>

      <div className="profile-list">
        {profiles.map(p => (
          <div key={p.id} className={`profile-card${p.id === activeId ? " active-profile" : ""}`}
            onClick={() => onSelect(p.id)}>
            <span className="profile-card-icon">
              {DND_CLASSES.find(c => c.name === p.class)?.icon || "⚔️"}
            </span>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="profile-card-name">{p.name || "Bezimienny Bohater"}</div>
              <div className="profile-card-sub">
                {[p.class, p.level && `Poziom ${p.level}`].filter(Boolean).join(" · ")}
                {p.id === activeId && <span style={{fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, marginLeft: "0.6rem"}}>● Aktywny</span>}
              </div>
            </div>
            {profiles.length > 1 && (
              <button className="profile-card-del" onClick={e => { e.stopPropagation(); onDelete(p.id); }}>✕</button>
            )}
          </div>
        ))}
      </div>

      <button className="btn-new-profile" onClick={onCreate}>
        ⊕ Stwórz Nowego Bohatera
      </button>

      <div style={{marginTop: "2rem", fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", color: t.textDim, textTransform: "uppercase", textAlign: "center"}}>
        {profiles.length} herosów w dzienniku
      </div>
    </div>
  );
}

/* ═══ KREATOR POSTACI (WIZARD KROKOWY) ════════════ */
function PostaćWizard({ onFinish, onAnuluj, theme }) {
  const t = THEMES[theme] || THEMES.dark;
  const [krok, setStep] = useState(0);
  const [name, setImie] = useState("");
  const [cls, setCls] = useState(null);
  const [level, setPoziom] = useState(1);
  const [bg, setBg] = useState("");
  const [align, setAlign] = useState("Bezwzględnie neutralny");
  const [statArray, setStatArray] = useState("Zestaw standardowy");
  const [customCechy, setWlasneCechy] = useState({STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10});
  const [useWlasne, setUseWlasne] = useState(false);

  const STEPS = ["Imię", "Klasa", "Atrybuty", "Przeszłość i charakter"];
  const stats = useWlasne ? customCechy : (STAT_ARRAYS[statArray] || STAT_ARRAYS["Zestaw standardowy"]);

  const canNext = [
    name.trim().length > 0,
    cls !== null,
    true,
    true,
  ][krok];

  const handleFinish = () => {
    const id = "profile_" + Date.now();
    const newChar = {
      ...DEFAULT_CHAR,
      name: name.trim(),
      classes: [{ name: cls?.name || "Poszukiwacz przygód", level }],
      background: bg.trim(),
      alignment: align,
      stats: { ...stats },
    };
    onFinish(id, newChar, { name: name.trim(), class: cls?.name || "", level, created: Date.now() });
  };

  const inputStyle = {
    background: t.bgInput, border: `1px solid ${t.borderInput}`, color: t.text,
    fontFamily: "Crimson Text,Georgia,serif", fontSize: "1.05rem",
    padding: "0.5rem 0.85rem", outline: "none", width: "100%",
  };

  return (
    <div className="wizard-screen">
      <div className="wizard-box">
        <div className="wizard-step-dots">
          {STEPS.map((s, i) => <div key={s} className={`wizard-dot${i <= krok ? " active" : ""}`}/>)}
        </div>

        <div className="wizard-title">Tworzenie Bohatera</div>
        <div className="wizard-sub">{STEPS[krok]} — Krok {krok + 1} z {STEPS.length}</div>

        {krok === 0 && <>
          <div className="wizard-step-label">Jak ma na imię Twój bohater?</div>
          <input autoFocus style={inputStyle} placeholder="Wpisz imię bohatera…"
            value={name} onChange={e => setImie(e.target.value)}
            onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}/>
          <div style={{marginTop: "0.6rem", fontFamily: "Crimson Text,serif", fontSize: "0.9rem", color: t.textDim, fontStyle: "italic"}}>
            Imię pojawi się w nagłówku dziennika karty.
          </div>
        </>}

        {krok === 1 && <>
          <div className="wizard-step-label">Wybierz klasę postaci</div>
          <div className="wizard-class-grid">
            {DND_CLASSES.map(c => (
              <button key={c.name} className={`wizard-class-btn${cls?.name === c.name ? " selected" : ""}`}
                onClick={() => setCls(c)}>
                <span className="wizard-class-icon">{c.icon}</span>
                <span className="wizard-class-name">{c.name}</span>
              </button>
            ))}
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.4rem"}}>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.14em", color: t.textLabel, textTransform: "uppercase"}}>Poziom (Lvl)</span>
            <input type="number" min={1} max={20} value={level}
              onChange={e => setPoziom(clamp(parseInt(e.target.value) || 1, 1, 20))}
              style={{...inputStyle, width: 64, textAlign: "center", fontFamily: "Cinzel,serif", fontSize: "1rem"}}/>
          </div>
        </>}

        {krok === 2 && <>
          <div className="wizard-step-label">Wybierz dystrybucję cech atrybutów</div>
          <div style={{display: "flex", gap: "0.4rem", marginBottom: "0.8rem", flexWrap: "wrap"}}>
            {Object.keys(STAT_ARRAYS).map(arr => (
              <button key={arr}
                style={{fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${!useWlasne && statArray === arr ? t.accent : t.borderInput}`, color: !useWlasne && statArray === arr ? t.accent : t.textMuted, padding: "0.3rem 0.7rem", cursor: pointer, transition: "all 0.15s"}}
                onClick={() => { setStatArray(arr); setUseWlasne(false); }}>
                {arr}
              </button>
            ))}
            <button
              style={{fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${useWlasne ? t.accent : t.borderInput}`, color: useWlasne ? t.accent : t.textMuted, padding: "0.3rem 0.7rem", cursor: pointer, transition: "all 0.15s"}}
              onClick={() => setUseWlasne(true)}>
              Ręczne (Własne)
            </button>
          </div>
          <div className="wizard-stat-grid">
            {STAT_KEYS.map(k => (
              <div key={k} className="wizard-stat-box">
                <span className="wizard-stat-label">{k}</span>
                {useWlasne
                  ? <input type="number" min={1} max={30} value={customCechy[k]}
                      onChange={e => setWlasneCechy(s => ({...s, [k]: clamp(parseInt(e.target.value) || 10, 1, 30)}))}
                      style={{background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, color: t.accent, textAlign: "center", width: "100%"}}/>
                  : <span className="wizard-stat-val">{stats[k]}</span>}
                <div style={{fontFamily: "Cinzel,serif", fontSize: "0.55rem", color: t.textMuted}}>{statMod(stats[k])}</div>
              </div>
            ))}
          </div>
        </>}

        {krok === 3 && <>
          <div className="wizard-step-label">Przeszłość bohatera</div>
          <input style={{...inputStyle, marginBottom: "0.6rem"}} placeholder="np. Żołnierz, Szlachcic, Mędrczec…"
            value={bg} onChange={e => setBg(e.target.value)}/>
          <div className="wizard-step-label">Charakter moralny</div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.3rem", marginBottom: "0.6rem"}}>
            {ALIGNMENTS.map(a => (
              <button key={a}
                style={{fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${align === a ? t.accent : t.borderInput}`, color: align === a ? t.accent : t.textMuted, padding: "0.35rem 0.2rem", cursor: pointer, transition: "all 0.15s", lineHeight: 1.3, textAlign: "center"}}
                onClick={() => setAlign(a)}>{a}</button>
            ))}
          </div>
          <div style={{fontFamily: "Crimson Text,serif", fontSize: "0.9rem", color: t.textDim, fontStyle: "italic", marginTop: "0.5rem", lineHeight: 1.6}}>
            Twój bohater jest gotowy do drogi. Każdą wartość będziesz mógł swobodnie edytować podczas kampanii.
          </div>
        </>}

        <div style={{display: "flex", justifyContent: "space-between", marginTop: "1.5rem", gap: "0.6rem"}}>
          <button
            onClick={krok === 0 ? onAnuluj : () => setStep(s => s - 1)}
            style={{fontFamily: "Cinzel,serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${t.borderInput}`, color: t.textMuted, padding: "0.5rem 1rem", cursor: pointer, flex: "0 0 auto"}}>
            {krok === 0 ? "Anuluj" : "← Wstecz"}
          </button>
          {krok < STEPS.length - 1
            ? <button disabled={!canNext}
                onClick={() => setStep(s => s + 1)}
                style={{fontFamily: "Cinzel,serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", background: canNext ? "rgba(226,185,78,0.1)" : "transparent", border: `1px solid ${canNext ? t.accent : t.borderInput}`, color: canNext ? t.accent : t.textDim, padding: "0.5rem 1.5rem", cursor: canNext ? "pointer" : "default", flex: 1, transition: "all 0.15s"}}>
                Dalej →
              </button>
            : <button
                onClick={handleFinish}
                style={{fontFamily: "Cinzel,serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(226,185,78,0.12)", border: `1px solid ${t.accent}`, color: t.accent, padding: "0.5rem 1.5rem", cursor: pointer, flex: 1, boxShadow: `0 0 16px rgba(226,185,78,0.2)`}}>
                ⚔ Rozpocznij Przygodę
              </button>}
        </div>
      </div>
    </div>
  );
}

/* ═══ SZABLON STRUKTURY MENU NAWIGACYJNEGO ═══════ */
const NAV_GROUPS = [
  {
    id: "hero",
    label: "Bohater",
    icon: "⚔️",
    defaultTab: "character",
    tabs: [
      {id:"character", label:"Bohater",      icon:"⚔️"},
      {id:"inventory", label:"Plecak",       icon:"🎒"},
      {id:"spells",    label:"Czary",        icon:"🔮"},
      {id:"skills",    label:"Zdolności",    icon:"✨"},
    ],
  },
  {
    id: "world",
    label: "Świat",
    icon: "🌍",
    defaultTab: "npcs",
    tabs: [
      {id:"npcs",      label:"Postacie",  icon:"👥"},
      {id:"locations", label:"Miejsca",   icon:"🗺️"},
      {id:"factions",  label:"Frakcje",   icon:"⚜️"},
    ],
  },
  {
    id: "log",
    label: "Dziennik",
    icon: "📜",
    defaultTab: "sessions",
    tabs: [
      {id:"sessions",  label:"Kronika",    icon:"📖"},
      {id:"quests",    label:"Zadania",   icon:"⚡"},
    ],
  },
];

/* ═══ KORZEŃ APLIKACJI (MAIN NODE) ═══════════════ */
export default function HeroJournal() {
  const [theme, setTheme] = useState(() => { const s = load("hj_theme", "dark"); return PALETTES.includes(s) ? s : "dark"; });
  const [profiles, setProfilesState] = useState(() => { migrateLegacy(); return loadProfiles(); });
  const [activeId, setActiveIdState] = useState(() => { migrateLegacy(); return loadActiveId(); });
  const [screen, setScreen] = useState(() => {
    migrateLegacy();
    const przs = loadProfiles();
    const aid = loadActiveId();
    if (przs.length === 0) return "wizard";
    if (!aid || !przs.find(p => p.id === aid)) return "profiles";
    return "app";
  });

  const [tab, setTab] = useState("character");
  const [char, setChar] = useState(() => activeId ? loadChar("char", activeId, DEFAULT_CHAR) : DEFAULT_CHAR);
  const [inventory, setInventory] = useState(() => activeId ? loadChar("inventory", activeId, []) : []);
  const [npcs, setNPCs] = useState(() => activeId ? loadChar("npcs", activeId, []) : []);
  const [locations, setLocations] = useState(() => activeId ? loadChar("locations", activeId, []) : []);
  const [skills, setUmiejętności] = useState(() => activeId ? loadChar("skills", activeId, []) : []);
  const [spells, setCzary] = useState(() => activeId ? loadChar("spells", activeId, []) : []);
  const [sessions, setSesjas] = useState(() => activeId ? loadChar("sessions", activeId, []) : []);
  const [quests, setZadania] = useState(() => activeId ? loadChar("quests", activeId, []) : []);
  const [factions, setFactions] = useState(() => activeId ? loadChar("factions", activeId, []) : []);
  
  const [showReset, setShowReset] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => { save("hj_theme", theme); }, [theme]);
  useEffect(() => { if (activeId) saveChar("char",      activeId, char);      }, [char, activeId]);
  useEffect(() => { if (activeId) saveChar("inventory", activeId, inventory); }, [inventory, activeId]);
  useEffect(() => { if (activeId) saveChar("npcs",      activeId, npcs);      }, [npcs, activeId]);
  useEffect(() => { if (activeId) saveChar("locations", activeId, locations); }, [locations, activeId]);
  useEffect(() => { if (activeId) saveChar("skills",    activeId, skills);    }, [skills, activeId]);
  useEffect(() => { if (activeId) saveChar("spells",    activeId, spells);    }, [spells, activeId]);
  useEffect(() => { if (activeId) saveChar("sessions",  activeId, sessions);  }, [sessions, activeId]);
  useEffect(() => { if (activeId) saveChar("quests",    activeId, quests);    }, [quests, activeId]);
  useEffect(() => { if (activeId) saveChar("factions",  activeId, factions);  }, [factions, activeId]);

  useEffect(() => {
    if (!activeId) return;
    setProfilesState(prev => {
      const updated = prev.map(p => p.id === activeId
        ? { ...p, name: char.name?.trim() || p.name, class: (char.classes || [])[0]?.name || p.class, level: (char.classes || [])[0]?.level || p.level }
        : p);
      saveProfiles(updated);
      return updated;
    });
  }, [char.name, char.classes, activeId]);

  const handleNavigate = useCallback(tt => setTab(tt), []);
  const t = THEMES[theme] || THEMES.dark;

  const switchProfile = useCallback(id => {
    saveActiveId(id);
    setActiveIdState(id);
    setChar(loadChar("char", id, DEFAULT_CHAR));
    setInventory(loadChar("inventory", id, []));
    setNPCs(loadChar("npcs", id, []));
    setLocations(loadChar("locations", id, []));
    setUmiejętności(loadChar("skills", id, []));
    setCzary(loadChar("spells", id, []));
    setSesjas(loadChar("sessions", id, []));
    setZadania(loadChar("quests", id, []));
    setFactions(loadChar("factions", id, []));
    setTab("character");
    setScreen("app");
  }, []);

  const handleWizardFinish = useCallback((id, newChar, profileMeta) => {
    CHAR_SLOTS.forEach(slot => saveChar(slot, id, slot === "char" ? newChar : []));
    const newProfile = { ...profileMeta, id };
    const updated = [ ...loadProfiles(), newProfile ];
    saveProfiles(updated);
    saveActiveId(id);
    setProfilesState(updated);
    setChar(newChar);
    setInventory([]); setNPCs([]); setLocations([]); setUmiejętności([]); setCzary([]); setSesjas([]); setZadania([]); setFactions([]);
    setActiveIdState(id);
    setTab("character");
    setScreen("app");
  }, []);

  const deleteProfile = useCallback(id => {
    deleteCharData(id);
    const updated = loadProfiles().filter(p => p.id !== id);
    saveProfiles(updated);
    setProfilesState(updated);
    if (id === activeId) {
      if (updated.length > 0) {
        switchProfile(updated[0].id);
      } else {
        saveActiveId(null);
        setActiveIdState(null);
        setScreen("wizard");
      }
    }
  }, [activeId, switchProfile]);

  const handleReset = () => {
    if (!activeId) return;
    CHAR_SLOTS.forEach(s => saveChar(s, activeId, s === "char" ? DEFAULT_CHAR : []));
    setChar(DEFAULT_CHAR); setInventory([]); setNPCs([]); setLocations([]); setUmiejętności([]); setCzary([]); setSesjas([]); setZadania([]); setFactions([]);
    setShowReset(false);
  };

  if (screen === "profiles") {
    return <>
      <style>{buildCSS(t)}</style>
      <ProfileScreen
        profiles={profiles} activeId={activeId} theme={theme}
        onSelect={switchProfile}
        onCreate={() => setScreen("wizard")}
        onDelete={deleteProfile}
      />
    </>;
  }

  if (screen === "wizard") {
    return <>
      <style>{buildCSS(t)}</style>
      <PostaćWizard
        theme={theme}
        onFinish={handleWizardFinish}
        onAnuluj={profiles.length > 0 ? () => setScreen("profiles") : undefined}
      />
    </>;
  }

  return <>
    <style>{buildCSS(t)}</style>
    {showReset && <ResetModal onConfirm={handleReset} onAnuluj={() => setShowReset(false)}/>}
    <div className="hj-root">

      <header className="hj-header">
        <div style={{maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem"}}>
          <div style={{display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, cursor: "pointer"}} onClick={() => setScreen("profiles")} title="Zmień bohatera">
            <div className="hj-logo">⚔ HJ</div>
            <span className="hj-char-name">{char.name?.trim() || "Bohater"}</span>
            <span style={{fontFamily: "Cinzel,serif", fontSize: "0.48rem", color: t.textDim, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0}}>▾ Zmień</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0}}>
            <div style={{position: "relative"}}>
              <button
                onClick={() => setShowPalette(s => !s)}
                style={{background: "transparent", border: `1px solid ${t.borderInput}`, color: t.textMuted, fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.08em", padding: "0.22rem 0.5rem", cursor: pointer, textTransform: "uppercase", transition: "all 0.2s", whiteSpace: "nowrap"}}
              >{PALETTE_LABELS[theme] || "🎨"}</button>
              {showPalette && <>
                <div style={{position: "fixed", inset: 0, zIndex: 199}} onClick={() => setShowPalette(false)}/>
                <div style={{position: "absolute", top: "calc(100% + 6px)", right: 0, background: t.modalBg, border: `1px solid ${t.border}`, boxShadow: `0 8px 24px ${t.shadowBot}`, zIndex: 200, minWidth: 148}}>
                  {PALETTES.map(p => (
                    <button key={p} onClick={() => { setTheme(p); save("hj_theme", p); setShowPalette(false); }} style={{display: "block", width: "100%", background: theme === p ? `rgba(226,185,78,0.1)` : "transparent", border: "none", borderBottom: `1px solid ${t.borderSub}`, color: theme === p ? t.accent : t.text, fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.08em", padding: "0.45rem 0.8rem", cursor: pointer, textAlign: "left", transition: "background 0.12s"}}>
                      {PALETTE_LABELS[p]}
                    </button>
                  ))}
                </div>
              </>}
            </div>
            <button className="btn-danger" style={{fontSize: "0.55rem", padding: "0.2rem 0.55rem", letterSpacing: "0.1em"}} onClick={() => setShowReset(true)} title="Zresetuj aktualną postać">↺ Reset</button>
          </div>
        </div>
      </header>

      <main className="hj-content">
        {tab === "character" && <PostaćSheet char={char} setChar={setChar} inventory={inventory} skills={skills} spells={spells}/>}
        {tab === "inventory" && <Plecak inventory={inventory} setInventory={setInventory}/>}
        {tab === "skills"    && <UmiejętnościTab skills={skills} setUmiejętności={setUmiejętności}/>}
        {tab === "spells"    && <CzaryTab spells={spells} setCzary={setCzary} char={char} setChar={setChar}/>}
        {tab === "npcs"      && <NPCTracker npcs={npcs} setNPCs={setNPCs}/>}
        {tab === "locations" && <Locations locations={locations} setLocations={setLocations}/>}
        {tab === "factions"  && <Factions factions={factions} setFactions={setFactions}/>}
        {tab === "sessions"  && <SesjaDziennik sessions={sessions} setSesjas={setSesjas} npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab === "quests"    && <QuestTracker quests={quests} setZadania={setZadania}/>}
      </main>

      {openGroup && <div className="nav-drawer-overlay" onClick={() => setOpenGroup(null)}/>}

      {openGroup && (() => {
        const group = NAV_GROUPS.find(g => g.id === openGroup);
        if (!group) return null;
        return (
          <div className="nav-drawer" onClick={e => e.stopPropagation()}>
            {group.tabs.map(t => (
              <button key={t.id} className={`nav-drawer-item${tab === t.id ? " active" : ""}`}
                onClick={() => { setTab(t.id); setOpenGroup(null); }}>
                <span className="nav-drawer-icon">{t.icon}</span>
                <span className="nav-drawer-label">{t.label}</span>
              </button>
            ))}
          </div>
        );
      })()}

      <nav className="hj-bottom-nav">
        {NAV_GROUPS.map(g => {
          const isGroupActive = g.tabs.some(t => t.id === tab);
          const activeTabInGroup = g.tabs.find(t => t.id === tab);
          const isOpen = openGroup === g.id;
          return (
            <button key={g.id}
              className={`hj-nav-btn${isGroupActive ? " group-active" : ""}${isOpen ? " active" : ""}`}
              onClick={() => {
                if (isOpen) { setOpenGroup(null); }
                else if (g.tabs.length === 1) { setTab(g.tabs[0].id); setOpenGroup(null); }
                else { setOpenGroup(g.id); }
              }}>
              <span className="hj-nav-icon">
                {activeTabInGroup ? activeTabInGroup.icon : g.icon}
              </span>
              <span className="hj-nav-label">
                {activeTabInGroup ? activeTabInGroup.label : g.label}
              </span>
              {!activeTabInGroup && <span className="hj-nav-sub">
                {g.tabs.map(t => t.icon).join(" ")}
              </span>}
            </button>
          );
        })}
      </nav>
    </div>
  </>;
}