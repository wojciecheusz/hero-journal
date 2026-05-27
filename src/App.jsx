import { useState, useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════
   THEME SYSTEM
   dark  = original dark parchment
   light = old paper / parchment (bright)
═══════════════════════════════════════════════ */
const THEMES = {
  dark: {
    bg:"#0f0d0b", bgCard:"#1c1810", bgInput:"#130f0c", bgNav:"#0d0b08",
    border:"#352e1e", borderSub:"#2a2418", borderInput:"#3a3220",
    text:"#ddd5bb", textMuted:"#9a8050", textDim:"#6a5830", textLabel:"#b09050",
    accent:"#e2b94e", accentBorder:"#8a6830",
    headerBg:"linear-gradient(180deg,#1c1810 0%,#141008 100%)",
    navBg:"linear-gradient(0deg,#0d0b08 0%,#161210 100%)",
    scrollTrack:"#0a0806", scrollThumb:"#3a3020",
    noise:"0.045", shadowBot:"rgba(0,0,0,0.8)", shadowCard:"#0a0806",
    innerDivBg:"#1c1810", hpBg:"#0a0806", addForm:"#171208",
    modalBg:"#1c1810", emptyColor:"#6a5a38",
    sessEntry:"#171208", combatBox:"#130f0c",
    spellSlotBox:"#130f0c", spellSlotBorder:"#1a3a6a",
    packItem:"#1a1510", packItemBorder:"#2e2618", packFieldInput:"#0f0c09",
    spellAccent:"#64a0e6", spellBorder:"#1a4a8a", spellMuted:"#4a7aaa",
    spellDim:"#2a4a6a", spellText:"#c8d8f0", spellBg:"rgba(100,160,230,0.08)",
    questReward:"#5a9a5a",
  },
  light: {
    bg:"#f0e8d5", bgCard:"#faf3e4", bgInput:"#ede3cc", bgNav:"#e8dcc8",
    border:"#c8a86a", borderSub:"#d4b87a", borderInput:"#c0a060",
    text:"#2a1e0a", textMuted:"#6a4a1a", textDim:"#8a6030", textLabel:"#7a5020",
    accent:"#9a5a10", accentBorder:"#7a4008",
    headerBg:"linear-gradient(180deg,#e8dcc8 0%,#ddd0b0 100%)",
    navBg:"linear-gradient(0deg,#ddd0b0 0%,#e8dcc8 100%)",
    scrollTrack:"#e0d4b8", scrollThumb:"#c0a060",
    noise:"0.025", shadowBot:"rgba(80,50,10,0.25)", shadowCard:"#c8a86a",
    innerDivBg:"#faf3e4", hpBg:"#e0d4b8", addForm:"#f5ecda",
    modalBg:"#faf3e4", emptyColor:"#9a7840",
    sessEntry:"#f5ecda", combatBox:"#ede3cc",
    spellSlotBox:"#ede3cc", spellSlotBorder:"#8ab0d0",
    packItem:"#f0e8d5", packItemBorder:"#c8a86a", packFieldInput:"#e8dcc8",
    spellAccent:"#3a5a9a", spellBorder:"#5a7ab0", spellMuted:"#4a5a8a",
    spellDim:"#6a7aaa", spellText:"#2a3a6a", spellBg:"rgba(58,90,154,0.08)",
    questReward:"#3a6a3a",
  },
};

function buildCSS(t) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100vh; background: ${t.bg}; }
  .hj-root { position: relative; min-height: 100vh; background: ${t.bg}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; line-height: 1.55; padding-bottom: 80px; }
  .hj-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: ${t.noise}; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); background-repeat: repeat; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${t.scrollTrack}; }
  ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; }

  .hj-header { position: sticky; top: 0; z-index: 50; background: ${t.headerBg}; border-bottom: 1px solid ${t.border}; box-shadow: 0 4px 32px ${t.shadowBot}; padding: 0.75rem 1.25rem; }
  .hj-logo { font-family: 'Cinzel Decorative', serif; font-size: 1.05rem; font-weight: 700; color: ${t.accent}; letter-spacing: 0.1em; display: flex; align-items: center; gap: 0.5rem; }
  .hj-char-name { font-family: 'Cinzel', serif; font-size: 0.72rem; color: ${t.textMuted}; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }

  .hj-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: ${t.navBg}; border-top: 1px solid ${t.border}; box-shadow: 0 -4px 32px ${t.shadowBot}; display: flex; align-items: stretch; height: 68px; padding-bottom: env(safe-area-inset-bottom,0px); }
  .hj-nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.18rem; background: transparent; border: none; cursor: pointer; transition: all 0.18s; padding: 0.3rem 0.05rem; position: relative; }
  .hj-nav-btn::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 2px; background: ${t.accent}; transform: scaleX(0); transition: transform 0.2s; border-radius: 0 0 2px 2px; }
  .hj-nav-btn.active::before { transform: scaleX(1); }
  .hj-nav-icon { font-size: 1.1rem; line-height: 1; filter: grayscale(1) brightness(0.45); transition: filter 0.18s; }
  .hj-nav-btn.active .hj-nav-icon { filter: grayscale(0) brightness(1); }
  .hj-nav-label { font-family: 'Cinzel', serif; font-size: 0.4rem; letter-spacing: 0.06em; text-transform: uppercase; color: ${t.textDim}; transition: color 0.18s; }
  .hj-nav-btn.active .hj-nav-label { color: ${t.accent}; }
  .hj-nav-btn:hover:not(.active) .hj-nav-label { color: ${t.textMuted}; }

  .hj-content { max-width: 780px; margin: 0 auto; padding: 1.4rem 1rem 2rem; display: flex; flex-direction: column; gap: 1rem; }

  .card { background: ${t.bgCard}; border: 1px solid ${t.border}; box-shadow: 0 3px 0 ${t.shadowCard}, inset 0 1px 0 rgba(226,185,78,0.05); padding: 1.25rem; position: relative; }
  .card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(226,185,78,0.02) 0%,transparent 55%); pointer-events: none; }
  .card.pinned { border-color: ${t.accentBorder}; }
  .card.pinned::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,${t.accent},transparent); pointer-events: none; }
  .card.inuse-active { border-color: #5a3a8a; }
  .card.inuse-active::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,#a87acc,transparent); pointer-events: none; }
  .card.spell-active { border-color: #1a3a6a; }
  .card.spell-active::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,#64a0e6,transparent); pointer-events: none; }

  .inner-divider { border: none; border-top: 1px solid ${t.borderSub}; margin: 1.1rem 0; position: relative; }
  .inner-divider::before { content: attr(data-label); position: absolute; top: 50%; left: 0; transform: translateY(-50%); background: ${t.innerDivBg}; padding-right: 0.6rem; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.textLabel}; }

  .sect-label { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: ${t.textLabel}; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
  .sect-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg,${t.border},transparent); }

  .iedit { background: transparent; border: none; border-bottom: 1px dashed ${t.borderInput}; color: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; font-style: inherit; outline: none; width: 100%; transition: border-color 0.15s; line-height: inherit; padding: 0; }
  .iedit:focus { border-bottom-color: ${t.accent}; }
  .iedit::placeholder { color: ${t.textDim}; }

  .g-input { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; padding: 0.5rem 0.85rem; outline: none; width: 100%; transition: border-color 0.15s; }
  .g-input:focus { border-color: ${t.accentBorder}; }
  .g-input::placeholder { color: ${t.textDim}; font-style: italic; }

  .g-select { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1rem; padding: 0.45rem 0.75rem; outline: none; width: 100%; transition: border-color 0.15s; appearance: none; cursor: pointer; }
  .g-select:focus { border-color: ${t.accentBorder}; }

  .g-textarea { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; padding: 0.75rem 0.85rem; outline: none; width: 100%; resize: vertical; transition: border-color 0.15s; line-height: 1.65; }
  .g-textarea:focus { border-color: ${t.accentBorder}; }
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

  /* Rest buttons */
  .btn-rest { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; background: transparent; border: 1px solid ${t.borderInput}; color: ${t.textMuted}; padding: 0.35rem 0.75rem; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-rest.short:hover { border-color: #8a7030; color: #d4a030; background: rgba(212,160,48,0.08); }
  .btn-rest.long:hover  { border-color: #2a5a8a; color: #64a0d4; background: rgba(100,160,212,0.08); }

  /* Tags */
  .tags-row { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin-top: 0.55rem; }
  .tag { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.18rem 0.55rem; display: inline-flex; align-items: center; gap: 0.3rem; white-space: nowrap; }
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

  /* Stat boxes */
  .stat-grid-6 { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.5rem; }
  @media (max-width:500px) { .stat-grid-6 { grid-template-columns: repeat(3,1fr); } }
  .stat-box { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.65rem 0.3rem 0.55rem; cursor: pointer; transition: all 0.15s; user-select: none; }
  .stat-box:hover { border-color: ${t.accentBorder}; }
  .stat-box.editing { border-color: ${t.accent}; }
  .stat-box.stat-box-prof { border-color: ${t.accentBorder}; background: rgba(226,185,78,0.06); }
  .stat-box.stat-box-exp  { border-color: #1a5a6a; background: rgba(100,200,224,0.06); }
  .stat-name { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.15em; color: ${t.textLabel}; display: block; margin-bottom: 0.25rem; }
  .stat-val  { font-family: 'Cinzel', serif; font-size: 1.5rem; font-weight: 700; color: ${t.accent}; line-height: 1.1; display: block; }
  .stat-mod  { font-family: 'Cinzel', serif; font-size: 0.62rem; color: ${t.textMuted}; display: block; margin-top: 0.15rem; }
  .stat-input { background: transparent; border: none; border-bottom: 1px solid ${t.accent}; color: ${t.accent}; font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; width: 100%; text-align: center; outline: none; }

  /* HP */
  .hp-bar-bg { height: 10px; background: ${t.hpBg}; border: 1px solid ${t.borderSub}; position: relative; overflow: hidden; margin-top: 0.7rem; }
  .hp-bar-fill { height: 100%; transition: width 0.35s ease, background 0.5s ease; }
  .hp-display { font-family: 'Cinzel', serif; font-size: 1.5rem; display: flex; align-items: baseline; gap: 0.2rem; }
  .hp-sep { color: ${t.textDim}; font-size: 1rem; }
  .hp-label { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.18em; color: ${t.textDim}; }
  .hp-pct { font-family: 'Cinzel', serif; font-size: 0.58rem; text-align: right; margin-top: 0.25rem; transition: color 0.5s; }
  .combat-box { background: ${t.combatBox}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.5rem 0.3rem; }
  .combat-box-label { font-family: 'Cinzel', serif; font-size: 0.54rem; letter-spacing: 0.14em; color: ${t.textLabel}; display: block; margin-bottom: 0.2rem; }
  .combat-box-val { font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 700; color: ${t.accent}; display: block; }
  .combat-box-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 700; color: ${t.accent}; text-align: center; width: 100%; }

  /* Saves & Skills */
  .save-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1rem; }
  @media (max-width:480px) { .save-grid { grid-template-columns: 1fr; } }
  .check-row { display: flex; align-items: center; gap: 0.45rem; padding: 0.22rem 0.3rem; border-bottom: 1px solid ${t.borderSub}; }
  .check-row:last-child { border-bottom: none; }
  .prof-dot-btn { width: 13px; height: 13px; border-radius: 50%; border: 1.5px solid ${t.borderInput}; background: transparent; cursor: pointer; flex-shrink: 0; transition: all 0.15s; padding: 0; appearance: none; -webkit-appearance: none; }
  .prof-dot-btn.prof { background: ${t.accent}; border-color: ${t.accentBorder}; }
  .check-label { font-family: 'Crimson Text', Georgia, serif; font-size: 0.95rem; color: ${t.text}; flex: 1; }
  .check-attr { font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.1em; color: ${t.textMuted}; flex-shrink: 0; }
  .check-bonus { font-family: 'Cinzel', serif; font-size: 0.82rem; font-weight: 700; color: ${t.accent}; min-width: 28px; text-align: right; }

  /* Hit Dice */
  .hd-box { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.4rem 0.3rem; }
  .hd-label { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.12em; color: ${t.textLabel}; display: block; margin-bottom: 0.15rem; }
  .hd-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 700; color: ${t.accent}; text-align: center; width: 100%; }

  /* Traits */
  .trait-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
  @media (max-width:480px) { .trait-grid { grid-template-columns: 1fr; } }
  .trait-block { display: flex; flex-direction: column; gap: 0.3rem; }
  .trait-label { font-family: 'Cinzel', serif; font-size: 0.54rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.textLabel}; }
  .trait-ta { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 0.95rem; padding: 0.5rem 0.65rem; outline: none; width: 100%; resize: vertical; line-height: 1.55; }
  .trait-ta:focus { border-color: ${t.accentBorder}; }
  .trait-ta::placeholder { color: ${t.textDim}; font-style: italic; }
  .class-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; border-bottom: 1px solid ${t.borderSub}; }
  .class-row:last-child { border-bottom: none; }

  /* Active & Equipped subtabs */
  .subtab-bar { display: flex; gap: 0; border-bottom: 1px solid ${t.border}; margin-bottom: 1rem; }
  .subtab-btn { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.4rem 0.9rem 0.45rem; background: transparent; border: none; border-bottom: 2px solid transparent; color: ${t.textDim}; cursor: pointer; transition: all 0.15s; margin-bottom: -1px; }
  .subtab-btn.active { color: ${t.accent}; border-bottom-color: ${t.accent}; }
  .subtab-btn:hover:not(.active) { color: ${t.textMuted}; }

  /* Equipped items */
  .equipped-item { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.5rem 0; border-bottom: 1px solid ${t.borderSub}; }
  .equipped-item:last-child { border-bottom: none; }
  .equipped-icon { font-size: 1.05rem; flex-shrink: 0; line-height: 1.3; }
  .equipped-name { font-family: 'Cinzel', serif; font-size: 0.78rem; font-weight: 700; color: ${t.text}; }
  .equipped-stat { font-family: 'Crimson Text', Georgia, serif; font-size: 0.88rem; color: ${t.textMuted}; font-style: italic; }
  .equipped-type-badge { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.1rem 0.35rem; border: 1px solid ${t.borderInput}; color: ${t.textMuted}; flex-shrink: 0; }
  .equipped-skill-badge { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.1rem 0.35rem; border: 1px solid #5a3a8a; color: #a87acc; background: rgba(168,122,204,0.08); flex-shrink: 0; }
  .equipped-spell-badge { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.1rem 0.35rem; border: 1px solid #1a4a8a; color: var(--spell-accent); background: rgba(100,160,230,0.08); flex-shrink: 0; }

  /* Spell slots (inside subtab) */
  .spell-slot-box { background: ${t.spellSlotBox}; border: 1px solid ${t.spellSlotBorder}; text-align: center; padding: 0.4rem 0.2rem; }
  .spell-slot-label { font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.1em; color: var(--spell-muted); display: block; margin-bottom: 0.2rem; }
  .spell-slot-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 700; color: var(--spell-accent); text-align: center; width: 100%; }

  /* Pack items */
  .pack-item { background: ${t.packItem}; border: 1px solid ${t.packItemBorder}; padding: 0.7rem 0.85rem; margin-bottom: 0.4rem; transition: border-color 0.15s; }
  .pack-item.equipped-active { border-color: ${t.accentBorder}; border-left: 3px solid ${t.accent}; }
  .pack-item-header { display: flex; align-items: center; gap: 0.5rem; }
  .pack-item-body { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem; }
  .pack-item-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .pack-field { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; min-width: 80px; }
  .pack-field-label { font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.textMuted}; }
  .pack-field-input { background: ${t.packFieldInput}; border: 1px solid ${t.packItemBorder}; color: ${t.text}; font-family: 'Crimson Text', Georgia, serif; font-size: 0.9rem; padding: 0.25rem 0.45rem; outline: none; width: 100%; transition: border-color 0.15s; }
  .pack-field-input:focus { border-color: ${t.accentBorder}; }
  .pack-field-input::placeholder { color: ${t.textDim}; font-style: italic; }

  /* Toggle switch */
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

  /* Skill pips */
  .skill-pips { display: flex; gap: 3px; align-items: center; flex-shrink: 0; }
  .pip { width: 8px; height: 8px; border: 1px solid ${t.borderInput}; cursor: pointer; transition: all 0.15s; }
  .pip.filled { background: ${t.accent}; border-color: ${t.accentBorder}; }

  /* Spell badges */
  /* Spell color adapts to theme */
  .hj-root { --spell-accent: ${t.spellAccent}; --spell-border: ${t.spellBorder}; --spell-muted: ${t.spellMuted}; --spell-dim: ${t.spellDim}; --spell-text: ${t.spellText}; --spell-bg: ${t.spellBg}; --quest-reward: ${t.questReward}; }
  .spell-level-badge { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; padding: 0.15rem 0.5rem; border: 1px solid var(--spell-border); color: var(--spell-accent); background: var(--spell-bg); flex-shrink: 0; text-transform: uppercase; }
  .spell-school-badge { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; padding: 0.15rem 0.5rem; border: 1px solid #2a2a5a; color: #8888cc; background: rgba(100,100,200,0.06); flex-shrink: 0; text-transform: uppercase; }

  /* NPC / Location */
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

  /* Session */
  .sess-entry { border: 1px solid ${t.border}; background: ${t.sessEntry}; overflow: hidden; box-shadow: 0 2px 0 ${t.shadowCard}; }
  .sess-header { display: flex; align-items: center; gap: 0.6rem; padding: 0.8rem 1rem; cursor: pointer; transition: background 0.15s; user-select: none; }
  .sess-header:hover { background: rgba(226,185,78,0.04); }
  .sess-header.open { background: rgba(226,185,78,0.06); border-bottom: 1px solid ${t.border}; }
  .sess-num { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.08em; color: ${t.textDim}; flex-shrink: 0; min-width: 24px; }
  .sess-body { padding: 0.9rem 1rem 1.1rem; }
  .sess-rendered { font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; color: ${t.text}; line-height: 1.75; white-space: pre-wrap; word-break: break-word; padding: 0.75rem 0.85rem; background: ${t.bgInput}; border: 1px solid ${t.border}; min-height: 80px; cursor: text; }

  /* Entity links */
  .entity-link { cursor: pointer; padding: 0 2px; font-weight: 600; transition: all 0.15s; display: inline; position: relative; }
  .entity-link-npc        { color:#c9943e; background:rgba(201,148,62,0.12); border-bottom:1px solid rgba(201,148,62,0.4); }
  .entity-link-npc:hover  { background:rgba(201,148,62,0.22); }
  .entity-link-location        { color:#4a8aaa; background:rgba(74,138,170,0.12); border-bottom:1px solid rgba(74,138,170,0.4); }
  .entity-link-location:hover  { background:rgba(74,138,170,0.22); }
  .entity-link-quest        { color:#aa4444; background:rgba(170,68,68,0.12); border-bottom:1px solid rgba(170,68,68,0.4); }
  .entity-link-quest:hover  { background:rgba(170,68,68,0.22); }
  .entity-link-inventory        { color:#3a8a5a; background:rgba(58,138,90,0.12); border-bottom:1px solid rgba(58,138,90,0.4); }
  .entity-link-inventory:hover  { background:rgba(58,138,90,0.22); }
  .entity-link-skill        { color:#7a5aaa; background:rgba(122,90,170,0.12); border-bottom:1px solid rgba(122,90,170,0.4); }
  .entity-link-skill:hover  { background:rgba(122,90,170,0.22); }

  /* Session log tooltip */
  .entity-tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: ${t.bgCard}; border: 1px solid ${t.border}; padding: 0.55rem 0.75rem; min-width: 200px; max-width: 280px; z-index: 500; pointer-events: none; box-shadow: 0 6px 24px ${t.shadowBot}; display: flex; flex-direction: column; gap: 0.2rem; white-space: normal; word-break: normal; }
  .entity-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: ${t.border}; }
  .entity-tooltip-name { font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.12em; font-weight: 700; color: ${t.accent}; display: block; line-height: 1.3; }
  .entity-tooltip-sub  { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.textMuted}; display: block; opacity: 0.8; }
  .entity-tooltip-body { font-family: 'Crimson Text', Georgia, serif; font-size: 0.9rem; color: ${t.text}; line-height: 1.5; display: block; margin-top: 0.15rem; border-top: 1px solid ${t.borderSub}; padding-top: 0.2rem; }

  .sess-legend { display:flex; gap:0.7rem; flex-wrap:wrap; padding:0.5rem 0.7rem; background:rgba(226,185,78,0.03); border:1px solid ${t.border}; margin-bottom:0.6rem; align-items:center; }
  .sess-legend-item { display:flex; align-items:center; gap:0.3rem; font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.08em; text-transform:uppercase; }
  .legend-dot { width:8px; height:8px; flex-shrink:0; }

  /* Quest */
  .quest-entry { background: ${t.bgCard}; border: 1px solid ${t.border}; padding: 0.9rem 1rem; box-shadow: 0 2px 0 ${t.shadowCard}; }
  .quest-entry.active    { border-left: 2px solid ${t.accent}; }
  .quest-entry.completed { border-left: 2px solid #5a9a5a; opacity: 0.78; }
  .quest-entry.failed    { border-left: 2px solid #8a2a2a; opacity: 0.62; }
  .badge { font-family:'Cinzel',serif; font-size:0.57rem; letter-spacing:0.12em; text-transform:uppercase; padding:0.15rem 0.55rem; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all 0.15s; user-select:none; }
  .badge.active    { border:1px solid ${t.accentBorder}; color:${t.accent}; background:rgba(226,185,78,0.1); }
  .badge.completed { border:1px solid #3a6a3a; color:#6acc6a; background:rgba(74,122,74,0.1); }
  .badge.failed    { border:1px solid #6a2a2a; color:#cc4444; background:rgba(122,44,44,0.1); }
  .badge:hover { filter:brightness(1.25); }

  /* Checklist */
  .checklist-item { display:flex; align-items:center; gap:0.5rem; padding:0.3rem 0; border-bottom:1px solid ${t.borderSub}; }
  .checklist-item:last-child { border-bottom:none; }
  .check-box { width:14px; height:14px; border:1px solid ${t.borderInput}; background:transparent; flex-shrink:0; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; }
  .check-box.checked { background:rgba(226,185,78,0.2); border-color:${t.accentBorder}; }
  .check-box.checked::after { content:'✓'; font-size:0.6rem; color:${t.accent}; }
  .checklist-text.done { text-decoration:line-through; color:${t.textDim}; }

  /* Modal */
  /* ── Profile / character select screen ── */
  .profile-screen { position: fixed; inset: 0; background: ${t.bg}; z-index: 200; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem 6rem; overflow-y: auto; }
  .profile-logo { font-family: 'Cinzel Decorative', serif; font-size: 1.8rem; font-weight: 700; color: ${t.accent}; letter-spacing: 0.12em; text-align: center; margin-bottom: 0.4rem; text-shadow: 0 0 30px rgba(226,185,78,0.3); }
  .profile-tagline { font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; color: ${t.textMuted}; font-style: italic; text-align: center; margin-bottom: 2rem; }
  .profile-list { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
  .profile-card { background: ${t.bgCard}; border: 1px solid ${t.border}; padding: 0.9rem 1.1rem; display: flex; align-items: center; gap: 0.8rem; cursor: pointer; transition: all 0.18s; position: relative; }
  .profile-card:hover { border-color: ${t.accentBorder}; box-shadow: 0 0 0 1px ${t.accentBorder}; }
  .profile-card.active-profile { border-color: ${t.accent}; border-left: 3px solid ${t.accent}; }
  .profile-card-icon { font-size: 1.8rem; flex-shrink: 0; line-height: 1; }
  .profile-card-name { font-family: 'Cinzel', serif; font-size: 0.95rem; font-weight: 700; color: ${t.text}; }
  .profile-card-sub { font-family: 'Crimson Text', Georgia, serif; font-size: 0.88rem; color: ${t.textMuted}; font-style: italic; margin-top: 0.1rem; }
  .profile-card-del { position: absolute; top: 0.4rem; right: 0.5rem; background: transparent; border: none; cursor: pointer; font-size: 0.75rem; color: ${t.textDim}; opacity: 0.4; transition: all 0.15s; padding: 0.15rem 0.3rem; }
  .profile-card-del:hover { color: #c04040; opacity: 1; }
  .btn-new-profile { font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; background: transparent; color: ${t.accent}; border: 1px dashed ${t.accentBorder}; padding: 0.75rem 1.5rem; cursor: pointer; transition: all 0.2s; width: 100%; max-width: 440px; }
  .btn-new-profile:hover { background: rgba(226,185,78,0.08); border-style: solid; }

  /* ── Wizard / creator ── */
  .wizard-screen { position: fixed; inset: 0; background: ${t.bg}; z-index: 300; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem 4rem; overflow-y: auto; }
  .wizard-box { width: 100%; max-width: 480px; }
  .wizard-title { font-family: 'Cinzel Decorative', serif; font-size: 1.3rem; font-weight: 700; color: ${t.accent}; margin-bottom: 0.3rem; }
  .wizard-sub { font-family: 'Crimson Text', Georgia, serif; font-size: 1rem; color: ${t.textMuted}; font-style: italic; margin-bottom: 1.5rem; }
  .wizard-step-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.textDim}; margin-bottom: 0.4rem; }
  .wizard-class-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.5rem; margin-bottom: 0.6rem; }
  .wizard-class-btn { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; padding: 0.6rem 0.3rem; cursor: pointer; transition: all 0.15s; text-align: center; }
  .wizard-class-btn:hover { border-color: ${t.accentBorder}; }
  .wizard-class-btn.selected { border-color: ${t.accent}; background: rgba(226,185,78,0.08); }
  .wizard-class-icon { font-size: 1.3rem; display: block; margin-bottom: 0.2rem; }
  .wizard-class-name { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.08em; color: ${t.textLabel}; }
  .wizard-stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.4rem; margin-bottom: 0.8rem; }
  .wizard-stat-box { background: ${t.bgInput}; border: 1px solid ${t.borderInput}; text-align: center; padding: 0.4rem 0.2rem; }
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
  .empty-state { text-align:center; padding:2.5rem; color:${t.emptyColor}; font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.12em; line-height:1.9; }
  .row   { display:flex; align-items:center; gap:0.6rem; }
  .col   { display:flex; flex-direction:column; gap:0.5rem; }
  .flex1 { flex:1; min-width:0; }
  .mt05  { margin-top:0.5rem; }
  .mt1   { margin-top:1rem; }
  @media (max-width:480px) { .hj-logo { font-size:0.95rem; } }
  `;
}

/* ═══ CONSTANTS ═════════════════════════════════ */
const today   = () => new Date().toISOString().slice(0,10);
const statMod = v  => { const m=Math.floor((v-10)/2); return m>=0?`+${m}`:String(m); };
const numMod  = v  => v>=0?`+${v}`:String(v);
const clamp   = (n,lo,hi) => Math.max(lo,Math.min(hi,n));

const STAT_KEYS    = ["STR","DEX","CON","INT","WIS","CHA"];
const STATUS_CYCLE = { Active:"Completed", Completed:"Failed", Failed:"Active" };
const REL_CYCLE    = { unknown:"ally", ally:"neutral", neutral:"hostile", hostile:"unknown" };
const REL_LABELS   = { ally:"Ally", neutral:"Neutral", hostile:"Hostile", unknown:"Unknown" };
const LOC_TYPES    = ["Settlement","Dungeon","Wilderness","Building","Ruin","Landmark","Other"];
const ALIGNMENTS   = ["Lawful Good","Neutral Good","Chaotic Good","Lawful Neutral","True Neutral","Chaotic Neutral","Lawful Evil","Neutral Evil","Chaotic Evil"];
const ITEM_TYPES   = ["General","Weapon","Armor","Spell Scroll","Wondrous Item","Consumable","Tool","Other"];
const ITEM_ICONS   = { General:"📦", Weapon:"⚔️", Armor:"🛡️", "Spell Scroll":"📜", "Wondrous Item":"✨", Consumable:"🧪", Tool:"🔧", Other:"◈" };
const SKILL_CATS   = ["Skill","Trait","Feat"];
const SPELL_SCHOOLS= ["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation","Other"];
const SPELL_LEVELS = ["Cantrip","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
const SPELL_SLOT_LABELS = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];

const SAVING_THROWS = [
  {key:"str",label:"Strength",    attr:"STR"},
  {key:"dex",label:"Dexterity",   attr:"DEX"},
  {key:"con",label:"Constitution",attr:"CON"},
  {key:"int",label:"Intelligence",attr:"INT"},
  {key:"wis",label:"Wisdom",      attr:"WIS"},
  {key:"cha",label:"Charisma",    attr:"CHA"},
];
const GENERIC_SKILLS = [
  {key:"acrobatics",    label:"Acrobatics",     attr:"DEX"},
  {key:"athletics",     label:"Athletics",      attr:"STR"},
  {key:"arcana",        label:"Arcana",         attr:"INT"},
  {key:"deception",     label:"Deception",      attr:"CHA"},
  {key:"history",       label:"History",        attr:"INT"},
  {key:"insight",       label:"Insight",        attr:"WIS"},
  {key:"intimidation",  label:"Intimidation",   attr:"CHA"},
  {key:"investigation", label:"Investigation",  attr:"INT"},
  {key:"medicine",      label:"Medicine",       attr:"WIS"},
  {key:"nature",        label:"Nature",         attr:"INT"},
  {key:"perception",    label:"Perception",     attr:"WIS"},
  {key:"performance",   label:"Performance",    attr:"CHA"},
  {key:"persuasion",    label:"Persuasion",     attr:"CHA"},
  {key:"religion",      label:"Religion",       attr:"INT"},
  {key:"sleightofhand", label:"Sleight of Hand",attr:"DEX"},
  {key:"stealth",       label:"Stealth",        attr:"DEX"},
  {key:"survival",      label:"Survival",       attr:"WIS"},
  {key:"animalhandling",label:"Animal Handling",attr:"WIS"},
];

const DEFAULT_CHAR = {
  name:"", classes:[{name:"Adventurer",level:1}],
  stats:{STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10},
  profBonus:2, hp:{current:10,max:10,temp:0}, ac:10,
  initiativeBonus:undefined,
  savingThrows:{}, savingThrowExp:{}, savingThrowOverride:{},
  skills:{}, skillExp:{},
  alignment:"True Neutral", background:"",
  traits:{personality:"",ideals:"",bonds:"",flaws:""},
  personalNotes:"", backstory:"",
  spellSlots:{}, spellcastingAbility:"INT",
  hitDice:{ type:"d8", max:1, used:0 },
  deathSaves:{ successes:0, failures:0 },
};

const load = (key,fb) => { try { return JSON.parse(localStorage.getItem(key))??fb; } catch { return fb; } };
const save = (key,val) => { try { localStorage.setItem(key,JSON.stringify(val)); } catch {} };

/* ═══════════════════════════════════════════════
   MULTI-CHARACTER STORAGE
   Global: hj_theme, hj_profiles (index of all chars)
   Per character: hj_char_{id}, hj_inventory_{id}, etc.
═══════════════════════════════════════════════ */
const CHAR_SLOTS = ["char","inventory","npcs","locations","skills","spells","sessions","quests"];
const ALL_GLOBAL_KEYS = ["hj_theme","hj_profiles","hj_active_profile"];

const charKey  = (slot, id) => `hj_${slot}_${id}`;
const loadChar = (slot, id, fb) => load(charKey(slot,id), fb);
const saveChar = (slot, id, val) => save(charKey(slot,id), val);
const deleteCharData = id => CHAR_SLOTS.forEach(s=>localStorage.removeItem(charKey(s,id)));

const loadProfiles = () => load("hj_profiles", []);
const saveProfiles = p => save("hj_profiles", p);
const loadActiveId = () => load("hj_active_profile", null);
const saveActiveId = id => save("hj_active_profile", id);

// Migrate legacy data (single-char) to profile system on first run
const migrateLegacy = () => {
  if (loadProfiles().length > 0) return; // already migrated
  const legacyChar = load("hj_char", null);
  if (!legacyChar) return; // no legacy data
  const id = "profile_" + Date.now();
  const name = legacyChar.name?.trim() || "My Hero";
  // copy legacy data to new profile slot
  CHAR_SLOTS.forEach(slot => {
    const val = load("hj_" + slot, null);
    if (val !== null) saveChar(slot, id, val);
  });
  saveProfiles([{ id, name, class: (legacyChar.classes||[{name:""}])[0]?.name||"", level: (legacyChar.classes||[{level:1}])[0]?.level||1, created: Date.now() }]);
  saveActiveId(id);
};


const hpBarColor = pct => pct>70?"linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)":pct>35?"linear-gradient(90deg,#7a4a10,#cc7020,#e08030)":"linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct>70?"#3a9a3a":pct>35?"#c06010":"#c03030";

const LEGEND_ITEMS = [
  {type:"npc",      color:"rgba(201,148,62,0.35)", border:"rgba(201,148,62,0.7)",  label:"People"},
  {type:"location", color:"rgba(74,138,170,0.35)", border:"rgba(74,138,170,0.7)",  label:"Places"},
  {type:"quest",    color:"rgba(170,68,68,0.35)",  border:"rgba(170,68,68,0.7)",   label:"Quests"},
  {type:"inventory",color:"rgba(58,138,90,0.35)",  border:"rgba(58,138,90,0.7)",   label:"Pack"},
  {type:"skill",    color:"rgba(122,90,170,0.35)", border:"rgba(122,90,170,0.7)",  label:"Skills"},
];

/* ═══ ENTITY LINK PARSER with tooltip data ══════ */
function parseEntityLinksWithTooltips(text, npcs, locations, quests, inventory, skills, onNavigate) {
  if (!text) return null;
  const entityMap = new Map();
  const addEntities = (list, tab, type, getTooltip) =>
    list.forEach(e => e.name?.trim().length > 1 && entityMap.set(e.name.toLowerCase(), { name:e.name, tab, type, tooltip:getTooltip(e) }));
  addEntities(npcs,      "npcs",      "npc",       e=>({ sub:e.role||"", body:e.notes||"" }));
  addEntities(locations, "locations", "location",  e=>({ sub:e.type||"", body:e.notes||"" }));
  addEntities(quests,    "quests",    "quest",     e=>({ sub:e.status||"", body:e.description||"" }));
  addEntities(inventory, "inventory", "inventory", e=>({ sub:e.type||"", body:e.note||"" }));
  addEntities(skills,    "skills",    "skill",     e=>({ sub:e.category||"", body:e.description||"" }));

  const sorted = [...entityMap.values()].sort((a,b)=>b.name.length-a.name.length);
  if (!sorted.length) return text;
  const pattern = new RegExp(`(${sorted.map(e=>e.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`, 'gi');
  const TAB_LABELS = {npc:"People",location:"Places",quest:"Quests",inventory:"Pack",skill:"Skills"};

  return text.split(pattern).map((part, i) => {
    const key = part.toLowerCase();
    const match = entityMap.get(key);
    if (match) {
      return <EntityLink key={i} match={match} part={part} onNavigate={onNavigate} tabLabel={TAB_LABELS[match.type]}/>;
    }
    return part;
  });
}

/* ── EntityLink with hover tooltip ── */
function EntityLink({ match, part, onNavigate, tabLabel }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => { clearTimeout(timerRef.current); timerRef.current = setTimeout(()=>setVisible(true), 350); };
  const hide = () => { clearTimeout(timerRef.current); setVisible(false); };

  return (
    <span
      className={`entity-link entity-link-${match.type}`}
      onClick={() => onNavigate(match.tab)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={e=>{e.preventDefault();show();}}
      onTouchEnd={hide}
      title={match.name}
      style={{position:"relative",display:"inline"}}
    >
      {part}
      {visible && (
        <span className="entity-tooltip" onClick={e=>e.stopPropagation()}>
          <span className="entity-tooltip-name">{match.name}</span>
          {match.tooltip.sub && (
            <span className="entity-tooltip-sub">{match.tooltip.sub}</span>
          )}
          {match.tooltip.body && (
            <span className="entity-tooltip-body">
              {match.tooltip.body.slice(0,140)}{match.tooltip.body.length>140?"…":""}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/* ═══ SHARED COMPONENTS ════════════════════════ */
function TagsEditor({tags,onChange}) {
  const [adding,setAdding]=useState(false); const [draft,setDraft]=useState("");
  const commit=()=>{const t=draft.trim().toLowerCase();if(t&&!tags.includes(t))onChange([...tags,t]);setDraft("");setAdding(false);};
  return <div className="tags-row">
    {tags.map(tag=><span key={tag} className="tag tag-default">{tag}<button className="tag-remove" onClick={()=>onChange(tags.filter(x=>x!==tag))}>✕</button></span>)}
    {adding?<input className="tag-input" autoFocus value={draft} placeholder="tag…" onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setAdding(false);setDraft("");}}}/>
           :<button className="tag-add-btn" onClick={()=>setAdding(true)}>+ tag</button>}
  </div>;
}

function FilterBar({allTags,activeTag,onSelect}) {
  if (!allTags.length) return null;
  return <div className="filter-bar">
    <span style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.12em",textTransform:"uppercase"}}>Filter:</span>
    <button className={`filter-tag${!activeTag?" active-filter":""}`} onClick={()=>onSelect(null)}>All</button>
    {allTags.map(tag=><button key={tag} className={`filter-tag${activeTag===tag?" active-filter":""}`} onClick={()=>onSelect(activeTag===tag?null:tag)}>{tag}</button>)}
  </div>;
}

function PinBtn({pinned,onToggle}) {
  return <button className={`pin-btn${pinned?" pinned":""}`} onClick={onToggle} title={pinned?"Unpin":"Pin"}>{pinned?"📌":"📍"}</button>;
}

function Toggle({on,onToggle,label,color}) {
  const cls = on ? (color==="purple"?"on-purple":color==="blue"?"on-blue":"on") : "";
  return <div className="toggle-wrap" onClick={onToggle}>
    <div className={`toggle-track${cls?" "+cls:""}`}><div className="toggle-thumb"/></div>
    <span className="toggle-label">{label}</span>
  </div>;
}

function StatBox({label,value,onChange}) {
  const [editing,setEditing]=useState(false); const [draft,setDraft]=useState(String(value));
  const commit=()=>{const n=parseInt(draft,10);if(!isNaN(n))onChange(clamp(n,1,30));setEditing(false);};
  return <div className={`stat-box${editing?" editing":""}`} onClick={()=>{if(!editing){setDraft(String(value));setEditing(true);}}}>
    <span className="stat-name">{label}</span>
    {editing?<input className="stat-input" value={draft} autoFocus onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} onClick={e=>e.stopPropagation()}/>
            :<span className="stat-val">{value}</span>}
    <span className="stat-mod">{statMod(value)}</span>
  </div>;
}

function SkillPips({value,onChange}) {
  return <div className="skill-pips">{[1,2,3,4,5].map(i=><div key={i} className={`pip${i<=value?" filled":""}`} onClick={()=>onChange(i===value?0:i)}/>)}</div>;
}

/* ── Rest Modal ── */
function RestModal({ type, char, setChar, onClose }) {
  const pb = char.profBonus||2;
  const hd = char.hitDice||{type:"d8",max:1,used:0};
  const available = Math.max(0, hd.max - hd.used);
  const [hdSpend, setHdSpend] = useState(1);

  const doShortRest = () => {
    const spend = clamp(hdSpend, 0, available);
    const dieMax = parseInt(hd.type.replace("d",""))||8;
    const conMod = Math.floor((char.stats.CON-10)/2);
    // average roll per die for simplicity display; player tracks actual
    const healed = spend>0 ? spend*Math.ceil(dieMax/2)+spend*conMod : 0;
    setChar(c=>({
      ...c,
      hp:{ ...c.hp, current: clamp(c.hp.current+Math.max(0,healed), 0, c.hp.max) },
      hitDice:{ ...hd, used: hd.used+spend },
    }));
    onClose();
  };

  const doLongRest = () => {
    // Long rest: full HP, reset spell slots used to 0, recover half hit dice (min 1)
    const recover = Math.max(1, Math.floor(hd.max/2));
    const newUsed = Math.max(0, hd.used - recover);
    const newSlots = {};
    Object.entries(char.spellSlots||{}).forEach(([k,v])=>{ newSlots[k]={...v,used:0}; });
    setChar(c=>({
      ...c,
      hp:{ ...c.hp, current:c.hp.max, temp:0 },
      hitDice:{ ...hd, used:newUsed },
      spellSlots: newSlots,
      deathSaves:{ successes:0, failures:0 },
    }));
    onClose();
  };

  const isShort = type==="short";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">{isShort?"☽ Short Rest":"☀ Long Rest"}</div>
        {isShort ? <>
          {/* Short Rest — available dice info */}
          <p className="modal-text">
            Spend Hit Dice to recover HP.{" "}
            <strong style={{color:"inherit"}}>{available}</strong> of <strong style={{color:"inherit"}}>{hd.max}</strong> {hd.type} available.
          </p>
          {/* Die type + max editor */}
          <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.8rem",flexWrap:"wrap"}}>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",letterSpacing:"0.12em",textTransform:"uppercase",opacity:0.7}}>Die type</span>
            <select className="g-select" style={{width:"auto",fontSize:"0.9rem",padding:"0.3rem 0.5rem"}} value={hd.type}
              onChange={e=>setChar(c=>({...c,hitDice:{...hd,type:e.target.value}}))}>
              {["d4","d6","d8","d10","d12"].map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",letterSpacing:"0.12em",textTransform:"uppercase",opacity:0.7}}>Max</span>
            <input type="number" min={1} value={hd.max}
              onChange={e=>setChar(c=>({...c,hitDice:{...hd,max:parseInt(e.target.value)||1}}))}
              style={{width:44,fontFamily:"Cinzel,serif",fontSize:"0.9rem",background:"transparent",border:"none",borderBottom:"1px dashed currentColor",outline:"none",textAlign:"center"}}/>
          </div>
          {/* Spend stepper */}
          <div className="modal-detail">
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.35rem"}}>
              <span style={{fontFamily:"Cinzel,serif",fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",opacity:0.8}}>Spend</span>
              <button onClick={()=>setHdSpend(s=>Math.max(0,s-1))} style={{width:26,height:26,background:"transparent",border:"1px solid currentColor",cursor:"pointer",fontFamily:"monospace",fontSize:"1rem",opacity:0.7}}>−</button>
              <input type="number" min={0} max={available} value={hdSpend}
                onChange={e=>setHdSpend(clamp(parseInt(e.target.value)||0,0,available))}
                style={{width:36,fontFamily:"Cinzel,serif",fontSize:"1.1rem",fontWeight:700,background:"transparent",border:"none",borderBottom:"1px solid currentColor",outline:"none",textAlign:"center"}}/>
              <button onClick={()=>setHdSpend(s=>Math.min(available,s+1))} style={{width:26,height:26,background:"transparent",border:"1px solid currentColor",cursor:"pointer",fontFamily:"monospace",fontSize:"1rem",opacity:0.7}}>+</button>
              <span style={{fontFamily:"Cinzel,serif",fontSize:"0.72rem",opacity:0.7}}>{hd.type}</span>
            </div>
            {(() => {
              const spend = clamp(hdSpend, 0, available);
              const dieMax = parseInt(hd.type.replace("d",""))||8;
              const conMod = Math.floor((char.stats.CON-10)/2);
              const avg = spend * Math.ceil(dieMax/2) + spend * conMod;
              const min = spend * 1 + spend * conMod;
              const max = spend * dieMax + spend * conMod;
              return <span style={{fontFamily:"Crimson Text,Georgia,serif",fontSize:"0.95rem",fontStyle:"italic",opacity:0.85}}>
                Heals ~<strong>{Math.max(0,avg)}</strong> HP (range {Math.max(0,min)}–{Math.max(0,max)}, avg + CON {conMod>=0?"+":""}{conMod})
              </span>;
            })()}
          </div>
          <div className="row" style={{justifyContent:"flex-end",gap:"0.6rem",marginTop:"0.8rem"}}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-gold" onClick={doShortRest}>☽ Rest</button>
          </div>
        </> : <>
          {/* Long Rest — summary */}
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1rem"}}>
            {[
              ["❤️","Restore full HP","From " + char.hp.current + " → " + char.hp.max],
              ["💫","Reset all Spell Slots","Used slots restored to 0"],
              ["🎲","Recover Hit Dice", (() => { const rec=Math.max(1,Math.floor((char.hitDice?.max||1)/2)); const cur=(char.hitDice?.max||1)-(char.hitDice?.used||0); return `${cur} → ${Math.min(char.hitDice?.max||1, cur+rec)} (regain ${rec})`; })()],
              ["☠️","Clear Death Saves","Successes & failures reset"],
            ].map(([icon,label,detail])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.35rem 0",borderBottom:`1px solid rgba(128,128,128,0.15)`}}>
                <span style={{fontSize:"1rem",flexShrink:0}}>{icon}</span>
                <div>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</div>
                  <div style={{fontFamily:"Crimson Text,Georgia,serif",fontSize:"0.88rem",opacity:0.65,fontStyle:"italic"}}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{justifyContent:"flex-end",gap:"0.6rem"}}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-gold" onClick={doLongRest}>☀ Long Rest</button>
          </div>
        </>}
      </div>
    </div>
  );
}

function ResetModal({onConfirm,onCancel}) {
  return <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={e=>e.stopPropagation()}>
      <div className="modal-title">"⚠ Full Reset"</div>
      <p className="modal-text">"This will permanently erase all character data. This cannot be undone."</p>
      <div className="row" style={{justifyContent:"flex-end",gap:"0.6rem"}}>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Erase Everything</button>
      </div>
    </div>
  </div>;
}

/* ═══ SPELL SLOTS WIDGET (reusable) ════════════ */
function SpellSlotsWidget({ char, setChar, spells }) {
  const usedLevels = [...new Set((spells||[]).map(s=>s.level).filter(l=>l!=="Cantrip"))];
  if (!usedLevels.length) return <p style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",opacity:0.5,textAlign:"center",padding:"1rem 0"}}>No non-cantrip spells added yet.</p>;
  usedLevels.sort((a,b)=>SPELL_SLOT_LABELS.indexOf(a)-SPELL_SLOT_LABELS.indexOf(b));
  return (
    <div style={{display:"grid",gap:"0.35rem",gridTemplateColumns:`repeat(${usedLevels.length},1fr)`}}>
      {usedLevels.map(lv=>{
        const sl=(char.spellSlots||{})[lv]||{max:0,used:0};
        const count=(spells||[]).filter(s=>s.level===lv).length;
        return (
          <div key={lv} className="spell-slot-box">
            <span className="spell-slot-label">{lv}</span>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"2px"}}>
              <input className="spell-slot-input" type="number" min={0} value={sl.used||0}
                onChange={e=>setChar(c=>({...c,spellSlots:{...(c.spellSlots||{}),[lv]:{...((c.spellSlots||{})[lv]||{max:0,used:0}),used:Math.max(0,parseInt(e.target.value)||0)}}}))}
                style={{width:28,fontSize:"0.9rem"}}/>
              <span style={{color:"var(--spell-border)",fontSize:"0.7rem"}}>/</span>
              <input className="spell-slot-input" type="number" min={0} value={sl.max||0}
                onChange={e=>setChar(c=>({...c,spellSlots:{...(c.spellSlots||{}),[lv]:{...((c.spellSlots||{})[lv]||{max:0,used:0}),max:Math.max(0,parseInt(e.target.value)||0)}}}))}
                style={{width:28,fontSize:"0.9rem",color:"var(--spell-muted)"}}/>
            </div>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.42rem",color:"var(--spell-dim)",textTransform:"uppercase",marginTop:"0.1rem",display:"block"}}>{count} spell{count!==1?"s":""}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ CHARACTER SHEET ══════════════════════════ */
function CharacterSheet({ char, setChar, inventory, skills, spells }) {
  const upd  = (f,v) => setChar(c=>({...c,[f]:v}));
  const updSt= (s,v) => setChar(c=>({...c,stats:{...c.stats,[s]:v}}));
  const hpPct= Math.round(clamp((char.hp.current/char.hp.max)*100,0,100));
  const pb   = char.profBonus||2;
  const [restModal, setRestModal] = useState(null); // "short"|"long"|null
  const [activeTab, setActiveTab] = useState("items"); // subtab in Active & Equipped

  const toggleSave = useCallback(key=>setChar(c=>({...c,savingThrows:{...(c.savingThrows||{}),[key]:!(c.savingThrows||{})[key]}})),[setChar]);

  const equippedItems = (inventory||[]).filter(i=>i.equipped);
  const activeSkills  = (skills||[]).filter(s=>s.inUse);
  const activeSpells  = (spells||[]).filter(s=>s.inUse);
  const hasActive     = equippedItems.length||activeSkills.length||activeSpells.length;

  const profPip = (prof, exp, cycle) => (
    <button type="button" onClick={cycle}
      title="none → proficient → expertise → none"
      style={{
        width:13,height:13,borderRadius:"50%",padding:0,cursor:"pointer",flexShrink:0,
        border: exp?"2px solid #64c8e0": prof?"1.5px solid #c9a84c":"1.5px solid #5a4a28",
        background: exp?"#64c8e0": prof?"#e2b94e":"transparent",
        clipPath: exp?"polygon(50% 0%,100% 50%,50% 100%,0% 50%)":"none",
        boxShadow: exp?"0 0 5px rgba(100,200,224,0.6)": prof?"0 0 5px rgba(226,185,78,0.5)":"none",
        transition:"all 0.15s", appearance:"none",WebkitAppearance:"none",
      }}
    />
  );

  const cycleSave = key => setChar(c=>{
    const wasP=!!(c.savingThrows||{})[key]; const wasE=!!(c.savingThrowExp||{})[key];
    if(!wasP&&!wasE) return {...c,savingThrows:{...(c.savingThrows||{}),[key]:true}};
    if(wasP&&!wasE)  return {...c,savingThrowExp:{...(c.savingThrowExp||{}),[key]:true}};
    const s2={...(c.savingThrows||{})};delete s2[key];
    const e2={...(c.savingThrowExp||{})};delete e2[key];
    return {...c,savingThrows:s2,savingThrowExp:e2};
  });

  const cycleSkill = key => setChar(c=>{
    const wasP=!!(c.skills||{})[key]; const wasE=!!(c.skillExp||{})[key];
    if(!wasP&&!wasE) return {...c,skills:{...(c.skills||{}),[key]:true}};
    if(wasP&&!wasE)  return {...c,skillExp:{...(c.skillExp||{}),[key]:true}};
    const s2={...(c.skills||{})};delete s2[key];
    const e2={...(c.skillExp||{})};delete e2[key];
    return {...c,skills:s2,skillExp:e2};
  });

  return <>
    {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={()=>setRestModal(null)}/>}

    {/* ══ CHARACTER card ══ */}
    <div className="card">
      <div className="sect-label">"Character"</div>

      {/* Name */}
      <div style={{marginBottom:"1rem"}}>
        <input className="iedit" style={{fontFamily:"Cinzel,serif",fontSize:"1.4rem",fontWeight:700,letterSpacing:"0.04em"}} value={char.name||""} onChange={e=>upd("name",e.target.value)} placeholder="Enter your hero's name…"/>
      </div>

      {/* Classes */}
      <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",marginBottom:"0.8rem"}}>
        {(char.classes||[]).map((cls,i)=>(
          <div key={i} className="class-row">
            <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.95rem",color:i===0?"var(--accent)":"inherit",fontWeight:600}} value={cls.name} onChange={e=>setChar(c=>{const cl=[...c.classes];cl[i]={...cl[i],name:e.target.value};return{...c,classes:cl};})} placeholder={`Class ${i+1}…`}/>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.56rem",letterSpacing:"0.1em",flexShrink:0}}>LVL</span>
            <input type="number" className="iedit" style={{width:38,textAlign:"center",fontFamily:"Cinzel,serif",fontSize:"0.95rem"}} value={cls.level} min={1} max={20} onChange={e=>setChar(c=>{const cl=[...c.classes];cl[i]={...cl[i],level:clamp(parseInt(e.target.value)||1,1,20)};return{...c,classes:cl};})}/>
            {i>0&&<button className="btn-ghost" style={{padding:"0.1rem 0.35rem",fontSize:"0.65rem"}} onClick={()=>setChar(c=>({...c,classes:c.classes.filter((_,j)=>j!==i)}))}>✕</button>}
          </div>
        ))}
        {(char.classes||[]).length<4&&<button className="btn-sm" style={{alignSelf:"flex-start",marginTop:"0.2rem"}} onClick={()=>setChar(c=>({...c,classes:[...(c.classes||[]),{name:"",level:1}]}))}>+ Multiclass</button>}
      </div>

      {/* Background / ProfBonus / Alignment */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 90px 1fr",gap:"0.6rem",alignItems:"end"}}>
        <div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:"0.25rem"}}>Background</div>
          <input className="iedit" style={{fontSize:"0.9rem"}} value={char.background||""} onChange={e=>upd("background",e.target.value)} placeholder="Background…"/>
        </div>
        <div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:"0.25rem"}}>Prof. Bonus</div>
          <input type="number" className="iedit" style={{textAlign:"center",fontFamily:"Cinzel,serif",fontSize:"0.95rem"}} value={pb} onChange={e=>upd("profBonus",parseInt(e.target.value)||2)}/>
        </div>
        <div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:"0.25rem"}}>Alignment</div>
          <select className="g-select" value={char.alignment||"True Neutral"} onChange={e=>upd("alignment",e.target.value)} style={{fontSize:"0.78rem",padding:"0.3rem 0.5rem"}}>{ALIGNMENTS.map(a=><option key={a} value={a}>{a}</option>)}</select>
        </div>
      </div>

      {/* ─ Attributes + ST inline — one grid, ST sits inside each stat box ─ */}
      <hr className="inner-divider" data-label="Attributes — tap to edit" style={{marginTop:"1.1rem"}}/>
      <div className="stat-grid-6" style={{marginTop:"0.8rem"}}>
        {SAVING_THROWS.map(st=>{
          const prof=!!(char.savingThrows||{})[st.key];
          const exp =!!(char.savingThrowExp||{})[st.key];
          const base=Math.floor((char.stats[st.attr]-10)/2);
          const auto=exp?base+pb*2:prof?base+pb:base;
          const over=(char.savingThrowOverride||{})[st.key];
          const stVal=over!==undefined?over:auto;
          const stColor=exp?"#64c8e0":prof?"#c9a84c":"inherit";
          return (
            <div key={st.key} style={{display:"flex",flexDirection:"column",gap:0}}>
              {/* Stat box — tap to edit */}
              <StatBox label={st.key.toUpperCase()} value={char.stats[st.attr]} onChange={v=>updSt(st.attr,v)}/>
              {/* ST value — directly below, same width */}
              <div className="stat-box" style={{borderTop:"none",textAlign:"center",padding:"0.2rem 0.1rem",cursor:"default"}}>
                <span style={{fontFamily:"Cinzel,serif",fontSize:"0.44rem",letterSpacing:"0.12em",textTransform:"uppercase",opacity:0.45,display:"block",lineHeight:1}}>ST</span>
                <input type="number" value={stVal}
                  title={over!==undefined?"Manual override — double-click to reset":"Auto · double-click to reset"}
                  style={{background:"transparent",border:"none",outline:"none",fontFamily:"Cinzel,serif",fontSize:"0.85rem",fontWeight:700,color:stColor,textAlign:"center",width:"100%",padding:"0.1rem 0",lineHeight:1}}
                  onChange={e=>{const n=parseInt(e.target.value);setChar(c=>({...c,savingThrowOverride:{...(c.savingThrowOverride||{}),[st.key]:isNaN(n)?undefined:n}}));}}
                  onDoubleClick={()=>setChar(c=>{const o={...(c.savingThrowOverride||{})};delete o[st.key];return{...c,savingThrowOverride:o};})}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─ Vitality ─ */}
      <hr className="inner-divider" data-label="Vitality" style={{marginTop:"1.1rem"}}/>
      {/* HP row — minus | cur/max | plus | Temp HP inline */}
      <div style={{marginTop:"0.8rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>
        <button className="btn-pm minus" onClick={()=>setChar(c=>({...c,hp:{...c.hp,current:clamp(c.hp.current-1,0,c.hp.max)}}))}>−</button>
        <div className="hp-display">
          <input type="number" value={char.hp.current} style={{background:"transparent",border:"none",outline:"none",fontFamily:"Cinzel,serif",textAlign:"center",fontSize:"1.5rem",width:52,color:hpNumColor(hpPct),transition:"color 0.5s"}} onChange={e=>setChar(c=>({...c,hp:{...c.hp,current:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}/>
          <span className="hp-sep">/</span>
          <input type="number" value={char.hp.max} style={{background:"transparent",border:"none",outline:"none",fontFamily:"Cinzel,serif",textAlign:"center",fontSize:"1rem",width:44}} onChange={e=>setChar(c=>({...c,hp:{...c.hp,max:Math.max(1,parseInt(e.target.value)||1)}}))}/>
        </div>
        <button className="btn-pm plus" onClick={()=>setChar(c=>({...c,hp:{...c.hp,current:clamp(c.hp.current+1,0,c.hp.max)}}))}>+</button>
        {/* Temp HP — uses combat-box class for consistent styling */}
        <div className="combat-box" style={{marginLeft:"0.3rem",minWidth:56,padding:"0.25rem 0.4rem"}}>
          <span className="combat-box-label">Tmp HP</span>
          <input className="combat-box-input" type="number" value={char.hp.temp||0}
            onChange={e=>setChar(c=>({...c,hp:{...c.hp,temp:parseInt(e.target.value)||0}}))}/>
        </div>
      </div>
      {/* HP bar + pct */}
      <div className="hp-bar-bg" style={{marginTop:"0.5rem"}}><div className="hp-bar-fill" style={{width:`${hpPct}%`,background:hpBarColor(hpPct)}}/></div>
      <div className="hp-pct" style={{color:hpNumColor(hpPct)}}>{hpPct}% vitality remaining</div>
      {/* AC + Initiative — full width below bar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginTop:"0.5rem"}}>
        <div className="combat-box"><span className="combat-box-label">Armor Class</span><input className="combat-box-input" type="number" value={char.ac||10} onChange={e=>setChar(c=>({...c,ac:parseInt(e.target.value)||10}))}/></div>
        <div className="combat-box" title="DEX mod by default — edit to override"><span className="combat-box-label">Initiative</span><input className="combat-box-input" type="number" value={char.initiativeBonus!==undefined?char.initiativeBonus:Math.floor((char.stats.DEX-10)/2)} onChange={e=>setChar(c=>({...c,initiativeBonus:parseInt(e.target.value)||0}))}/></div>
      </div>

      {/* Hit Dice + Rest — grid: [HD tracker] [Short] [Long] */}
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr",gap:"0.5rem",marginTop:"0.6rem",alignItems:"stretch"}}>
        {/* Hit Dice tracker — combat-box for consistent bg/border */}
        <div className="combat-box" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0.3rem 0.6rem",gap:"0.15rem"}}>
          <span className="combat-box-label">Hit Dice</span>
          <div style={{display:"flex",alignItems:"center",gap:"0.25rem"}}>
            <select className="combat-box-input" style={{width:"auto",cursor:"pointer",fontSize:"0.78rem"}}
              value={(char.hitDice||{type:"d8"}).type}
              onChange={e=>setChar(c=>({...c,hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),type:e.target.value}}))}>
              {["d4","d6","d8","d10","d12"].map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <input type="number" min={0} value={(char.hitDice||{used:0}).used||0}
              onChange={e=>setChar(c=>({...c,hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),used:parseInt(e.target.value)||0}}))}
              className="combat-box-input" style={{width:26,borderBottom:"1px dashed currentColor"}}/>
            <span style={{fontSize:"0.65rem",opacity:0.4}}>/</span>
            <input type="number" min={1} value={(char.hitDice||{max:1}).max||1}
              onChange={e=>setChar(c=>({...c,hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),max:parseInt(e.target.value)||1}}))}
              className="combat-box-input" style={{width:26,opacity:0.55}}/>
          </div>
        </div>
        {/* Short Rest */}
        <button className="btn-rest short" onClick={()=>setRestModal("short")}
          style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.1rem",padding:"0.4rem 0.5rem"}}>
          <span style={{fontSize:"1.1rem",lineHeight:1}}>☽</span>
          <span style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>Short Rest</span>
        </button>
        {/* Long Rest */}
        <button className="btn-rest long" onClick={()=>setRestModal("long")}
          style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.1rem",padding:"0.4rem 0.5rem"}}>
          <span style={{fontSize:"1.1rem",lineHeight:1}}>☀</span>
          <span style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>Long Rest</span>
        </button>
      </div>

      {/* ─ Saving Throws ─ */}
      <hr className="inner-divider" data-label="Saving Throws" style={{marginTop:"1.1rem"}}/>
      <div className="stat-grid-6" style={{marginTop:"0.8rem"}}>
        {SAVING_THROWS.map(st=>{
          const prof=!!(char.savingThrows||{})[st.key];
          const exp =!!(char.savingThrowExp||{})[st.key];
          const base=Math.floor((char.stats[st.attr]-10)/2);
          const bonus=exp?base+pb*2:prof?base+pb:base;
          const stateColor=exp?"#64c8e0":prof?"#e2b94e":"inherit";
          return (
            <div key={st.key} className={`stat-box${exp?" stat-box-exp":prof?" stat-box-prof":""}`}
              style={{cursor:"default",paddingTop:"0.5rem",paddingBottom:"0.5rem",position:"relative"}}>
              {profPip(prof,exp,()=>cycleSave(st.key))}
              <span className="stat-name">{st.key.toUpperCase()}</span>
              <span className="stat-val" style={{fontSize:"1.1rem",color:stateColor}}>{numMod(bonus)}</span>
              <span className="stat-mod" style={{fontSize:"0.52rem",color:stateColor,opacity:0.8}}>{exp?"expertise":prof?"prof":"—"}</span>
            </div>
          );
        })}
      </div>

      {/* ─ Skills ─ */}
      <hr className="inner-divider" data-label="Skills" style={{marginTop:"1.1rem"}}/>
      <div className="save-grid" style={{marginTop:"0.8rem"}}>
        {GENERIC_SKILLS.map(sk=>{
          const prof=!!(char.skills||{})[sk.key];
          const exp =!!(char.skillExp||{})[sk.key];
          const base=Math.floor((char.stats[sk.attr]-10)/2);
          const bonus=exp?base+pb*2:prof?base+pb:base;
          return (
            <div key={sk.key} className="check-row">
              {profPip(prof,exp,()=>cycleSkill(sk.key))}
              <span className="check-attr">{sk.attr}</span>
              <span className="check-label" style={{color:exp?"#64c8e0":prof?"inherit":"inherit"}}>{sk.label}</span>
              <span className="check-bonus" style={{color:exp?"#64c8e0":prof?"#c9a84c":"inherit"}}>{numMod(bonus)}</span>
            </div>
          );
        })}
      </div>

      {/* ─ Spell Slots ─ */}
      {(()=>{
        const usedLevels=[...new Set((spells||[]).map(s=>s.level).filter(l=>l!=="Cantrip"))];
        if (!usedLevels.length) return null;
        return <>
          <hr className="inner-divider" data-label="Spell Slots" style={{marginTop:"1.1rem"}}/>
          <div style={{marginTop:"0.8rem"}}><SpellSlotsWidget char={char} setChar={setChar} spells={spells}/></div>
        </>;
      })()}

    </div>

    {/* ══ Active & Equipped with subtabs ══ */}
    {hasActive>0&&<div className="card">
      <div className="sect-label">Active & Equipped</div>
      <div className="subtab-bar">
        {[["items","Items",equippedItems.length],["skills","Skills",activeSkills.length],["spells","Spells",activeSpells.length]].map(([id,label,count])=>(
          count>0&&<button key={id} className={`subtab-btn${activeTab===id?" active":""}`} onClick={()=>setActiveTab(id)}>{label} ({count})</button>
        ))}
      </div>

      {activeTab==="items"&&equippedItems.map(item=>(
        <div key={item.id} className="equipped-item">
          <span className="equipped-icon">{ITEM_ICONS[item.type]||"◈"}</span>
          <div className="flex1">
            <div className="row" style={{gap:"0.4rem",marginBottom:"0.15rem"}}><span className="equipped-name">{item.name}</span><span className="equipped-type-badge">{item.type}</span></div>
            {item.damage&&<div className="equipped-stat">Damage: {item.damage}{item.damageType?` ${item.damageType}`:""}</div>}
            {item.modifier!==undefined&&item.modifier!==""&&<div className="equipped-stat">To Hit: {numMod(parseInt(item.modifier)||0)}</div>}
            {item.charges&&<div className="equipped-stat">Charges: {item.charges}</div>}
            {item.effect&&<div className="equipped-stat" style={{color:"#a87acc"}}>{item.effect}</div>}
          </div>
        </div>
      ))}

      {activeTab==="skills"&&activeSkills.map(sk=>(
        <div key={sk.id} className="equipped-item">
          <span className="equipped-icon">✨</span>
          <div className="flex1">
            <div className="row" style={{gap:"0.4rem",marginBottom:"0.15rem"}}><span className="equipped-name">{sk.name}</span><span className="equipped-skill-badge">{sk.category}</span></div>
            {sk.description&&<div className="equipped-stat">{sk.description}</div>}
          </div>
        </div>
      ))}

      {activeTab==="spells"&&<>
        {/* Spell Slots at top of Spells subtab */}
        {(()=>{
          const usedLevels=[...new Set((spells||[]).map(s=>s.level).filter(l=>l!=="Cantrip"))];
          if (!usedLevels.length) return null;
          return <div style={{marginBottom:"1rem"}}>
            <div style={{fontFamily:"Cinzel,serif",fontSize:"0.54rem",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:"0.4rem",color:"var(--spell-muted)"}}>Spell Slots</div>
            <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
          </div>;
        })()}
        {activeSpells.map(sp=>(
          <div key={sp.id} className="equipped-item">
            <span className="equipped-icon">🔮</span>
            <div className="flex1">
              <div className="row" style={{gap:"0.4rem",marginBottom:"0.15rem",flexWrap:"wrap"}}>
                <span className="equipped-name">{sp.name}</span>
                <span className="equipped-spell-badge">{sp.level}</span>
                {sp.school&&<span className="equipped-spell-badge">{sp.school}</span>}
              </div>
              {sp.castingTime&&<div className="equipped-stat">Cast: {sp.castingTime} · Range: {sp.range||"—"}</div>}
              {sp.description&&<div className="equipped-stat">{sp.description.slice(0,100)}{sp.description.length>100?"…":""}</div>}
            </div>
          </div>
        ))}
      </>}
    </div>}

    {/* ══ Traits ══ */}
    <div className="card">
      <div className="sect-label">Character Traits</div>
      <div className="trait-grid">
        {[["personality","Personality Traits","How your character acts and speaks…"],
          ["ideals","Ideals","What your character believes in…"],
          ["bonds","Bonds","What ties your character to the world…"],
          ["flaws","Flaws","Your character's weaknesses…"]].map(([key,label,ph])=>(
          <div key={key} className="trait-block">
            <span className="trait-label">{label}</span>
            <textarea className="trait-ta" rows={3} placeholder={ph} value={char.traits?.[key]||""} onChange={e=>setChar(c=>({...c,traits:{...(c.traits||{}),[key]:e.target.value}}))}/>
          </div>
        ))}
      </div>
    </div>

    <div className="card">
      <div className="sect-label">Personal Notes</div>
      <textarea className="g-textarea" rows={4} placeholder="Session reminders, GM hints, party notes…" value={char.personalNotes||""} onChange={e=>upd("personalNotes",e.target.value)}/>
    </div>

    <div className="card">
      <div className="sect-label">Backstory</div>
      <textarea className="g-textarea" rows={6} placeholder="Where did your hero come from? What shaped them? What do they seek?…" value={char.backstory||""} onChange={e=>upd("backstory",e.target.value)}/>
    </div>
  </>;
}

/* ═══ PACK ══════════════════════════════════════ */
function Pack({inventory,setInventory}) {
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",type:"General",qty:"1",damage:"",damageType:"",modifier:"",charges:"",effect:"",note:""});
  const [expanded,setExpanded]=useState({});
  const [filterType,setFilterType]=useState(null);
  const addItem=()=>{const n=form.name.trim();if(!n)return;setInventory(inv=>[...inv,{id:Date.now(),equipped:false,...form,name:n}]);setForm({name:"",type:"General",qty:"1",damage:"",damageType:"",modifier:"",charges:"",effect:"",note:""});setShowForm(false);};
  const upd=(id,f,v)=>setInventory(inv=>inv.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setInventory(inv=>inv.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const toggleEquip=id=>setInventory(inv=>inv.map(x=>x.id===id?{...x,equipped:!x.equipped}:x));
  const visible=filterType?inventory.filter(i=>i.type===filterType):inventory;
  const equippedCount=inventory.filter(i=>i.equipped).length;
  const needsExtras=t=>["Weapon","Spell Scroll","Wondrous Item","Consumable"].includes(t);
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em"}}>{inventory.length} items{equippedCount>0?` · ${equippedCount} equipped`:""}</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Item"}</button>
    </div>
    {showForm&&<div className="add-form"><div className="col">
      <div className="row"><input className="g-input flex1" placeholder="Item name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addItem()}/><input className="g-input" style={{width:60}} placeholder="Qty" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
      <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{ITEM_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:form.type===t?1:0.5,borderColor:form.type===t?"currentColor":""}} onClick={()=>setForm(f=>({...f,type:t}))}>{ITEM_ICONS[t]} {t}</button>)}</div>
      {needsExtras(form.type)&&<>
        {form.type==="Weapon"&&<div className="pack-item-row">
          <div className="pack-field"><span className="pack-field-label">Damage Dice</span><input className="pack-field-input" placeholder="1d8" value={form.damage} onChange={e=>setForm(f=>({...f,damage:e.target.value}))}/></div>
          <div className="pack-field"><span className="pack-field-label">Damage Type</span><input className="pack-field-input" placeholder="Slashing" value={form.damageType} onChange={e=>setForm(f=>({...f,damageType:e.target.value}))}/></div>
          <div className="pack-field"><span className="pack-field-label">To Hit</span><input className="pack-field-input" type="number" value={form.modifier} onChange={e=>setForm(f=>({...f,modifier:e.target.value}))}/></div>
        </div>}
        {["Spell Scroll","Wondrous Item","Consumable"].includes(form.type)&&<div className="pack-item-row">
          <div className="pack-field"><span className="pack-field-label">Charges</span><input className="pack-field-input" value={form.charges} onChange={e=>setForm(f=>({...f,charges:e.target.value}))}/></div>
          <div className="pack-field" style={{flex:2}}><span className="pack-field-label">Effect</span><input className="pack-field-input" value={form.effect} onChange={e=>setForm(f=>({...f,effect:e.target.value}))}/></div>
        </div>}
      </>}
      <input className="g-input" placeholder="Notes…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addItem}>⊕ Add Item</button></div>
    </div></div>}
    <div className="filter-bar">
      <button className={`filter-tag${!filterType?" active-filter":""}`} onClick={()=>setFilterType(null)}>All</button>
      {ITEM_TYPES.map(t=>{const c=inventory.filter(i=>i.type===t).length;if(!c)return null;return<button key={t} className={`filter-tag${filterType===t?" active-filter":""}`} onClick={()=>setFilterType(filterType===t?null:t)}>{ITEM_ICONS[t]} {t} ({c})</button>;})}
    </div>
    {inventory.length===0&&<div className="card empty-state">Your pack lies empty…</div>}
    {visible.map(item=>{const open=!!expanded[item.id];return(
      <div key={item.id} className={`pack-item${item.equipped?" equipped-active":""}`}>
        <div className="pack-item-header">
          <span style={{fontSize:"1.1rem",flexShrink:0}}>{ITEM_ICONS[item.type]||"◈"}</span>
          <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.9rem",fontWeight:700}} value={item.name} onChange={e=>upd(item.id,"name",e.target.value)}/>
          <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.08em",border:"1px solid currentColor",padding:"0.1rem 0.35rem",flexShrink:0,opacity:0.6}}>{item.type}</span>
          <Toggle on={!!item.equipped} onToggle={()=>toggleEquip(item.id)} label={item.equipped?"Equipped":"Stowed"} color="gold"/>
          <button className="entity-toggle" onClick={()=>toggle(item.id)}>{open?"▲":"▼"}</button>
        </div>
        {open&&<div className="pack-item-body">
          <div className="pack-item-row">
            <div className="pack-field"><span className="pack-field-label">Qty</span><input className="pack-field-input" value={item.qty||"1"} onChange={e=>upd(item.id,"qty",e.target.value)}/></div>
            {item.type==="Weapon"&&<>
              <div className="pack-field"><span className="pack-field-label">Damage</span><input className="pack-field-input" value={item.damage||""} onChange={e=>upd(item.id,"damage",e.target.value)}/></div>
              <div className="pack-field"><span className="pack-field-label">Type</span><input className="pack-field-input" value={item.damageType||""} onChange={e=>upd(item.id,"damageType",e.target.value)}/></div>
              <div className="pack-field"><span className="pack-field-label">To Hit</span><input className="pack-field-input" type="number" value={item.modifier||""} onChange={e=>upd(item.id,"modifier",e.target.value)}/></div>
            </>}
            {["Spell Scroll","Wondrous Item","Consumable"].includes(item.type)&&<>
              <div className="pack-field"><span className="pack-field-label">Charges</span><input className="pack-field-input" value={item.charges||""} onChange={e=>upd(item.id,"charges",e.target.value)}/></div>
              <div className="pack-field" style={{flex:2}}><span className="pack-field-label">Effect</span><input className="pack-field-input" value={item.effect||""} onChange={e=>upd(item.id,"effect",e.target.value)}/></div>
            </>}
          </div>
          <div className="pack-field"><span className="pack-field-label">Notes</span><input className="pack-field-input" value={item.note||""} onChange={e=>upd(item.id,"note",e.target.value)}/></div>
          <div className="row" style={{justifyContent:"flex-end",marginTop:"0.3rem"}}><button className="btn-ghost" onClick={()=>del(item.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ SKILLS TAB ════════════════════════════════ */
function SkillsTab({skills,setSkills}) {
  const [form,setForm]=useState({name:"",category:"Skill",description:"",level:0});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeTag,setActiveTag]=useState(null);
  const [activeCat,setActiveCat]=useState(null);
  const allTags=[...new Set(skills.flatMap(s=>s.tags||[]))].sort();
  const addSkill=()=>{const n=form.name.trim();if(!n)return;setSkills(l=>[...l,{id:Date.now(),name:n,category:form.category,description:form.description.trim(),level:form.level,tags:[],pinned:false,inUse:false}]);setForm({name:"",category:"Skill",description:"",level:0});setShowForm(false);};
  const upd=(id,f,v)=>setSkills(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setSkills(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const toggleInUse=id=>setSkills(l=>l.map(x=>x.id===id?{...x,inUse:!x.inUse}:x));
  const visible=skills.filter(s=>(!activeTag||(s.tags||[]).includes(activeTag))&&(!activeCat||s.category===activeCat)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  const catColor=cat=>({Skill:"#c9943e",Trait:"#4a8aaa",Feat:"#9a6030"})[cat]||"#8a7848";
  const inUseCount=skills.filter(s=>s.inUse).length;
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em"}}>{skills.length} entries{inUseCount>0?` · ${inUseCount} active`:""}</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Entry"}</button>
    </div>
    {showForm&&<div className="add-form"><div className="col">
      <input className="g-input" placeholder="Name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSkill()}/>
      <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{SKILL_CATS.map(c=><button key={c} className="filter-tag" style={{opacity:form.category===c?1:0.45,borderColor:form.category===c?catColor(c)+"88":"",color:form.category===c?catColor(c):""}} onClick={()=>setForm(f=>({...f,category:c}))}>{c}</button>)}</div>
      <div className="row" style={{gap:"0.6rem"}}><span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",textTransform:"uppercase",letterSpacing:"0.12em"}}>Mastery</span><SkillPips value={form.level} onChange={v=>setForm(f=>({...f,level:v}))}/></div>
      <textarea className="g-textarea" rows={3} placeholder="Description, effect, source, prerequisites…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addSkill}>⊕ Add</button></div>
    </div></div>}
    <div className="filter-bar">
      <button className={`filter-tag${!activeCat?" active-filter":""}`} onClick={()=>setActiveCat(null)}>All</button>
      {SKILL_CATS.map(c=>{const count=skills.filter(s=>s.category===c).length;if(!count)return null;return<button key={c} className={`filter-tag${activeCat===c?" active-filter":""}`} style={{borderColor:activeCat===c?catColor(c)+"88":"",color:activeCat===c?catColor(c):""}} onClick={()=>setActiveCat(activeCat===c?null:c)}>{c} ({count})</button>;})}
    </div>
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
    {skills.length===0&&<div className="card empty-state">No skills, traits or feats recorded.</div>}
    {visible.map(sk=>{const open=!!expanded[sk.id];const cc=catColor(sk.category);return(
      <div key={sk.id} className={`card${sk.pinned?" pinned":""}${sk.inUse?" inuse-active":""}`} style={{padding:"1rem 1.1rem",borderLeftColor:cc+"55",borderLeftWidth:2}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.98rem",fontWeight:700}} value={sk.name} onChange={e=>upd(sk.id,"name",e.target.value)} placeholder="Name…"/>
              <span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase",color:cc,border:`1px solid ${cc}55`,padding:"0.15rem 0.5rem",background:`${cc}0d`,flexShrink:0}}>{sk.category}</span>
            </div>
            {sk.level>0&&<SkillPips value={sk.level} onChange={v=>upd(sk.id,"level",v)}/>}
          </div>
          <Toggle on={!!sk.inUse} onToggle={()=>toggleInUse(sk.id)} label={sk.inUse?"Active":"Inactive"} color="purple"/>
          <PinBtn pinned={sk.pinned} onToggle={()=>upd(sk.id,"pinned",!sk.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(sk.id)}>{open?"▲":"▼"}</button>
        </div>
        {!open&&sk.description&&<p style={{fontSize:"0.92rem",fontStyle:"italic",marginTop:"0.3rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",opacity:0.7}}>{sk.description}</p>}
        <TagsEditor tags={sk.tags||[]} onChange={v=>upd(sk.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <div className="row" style={{gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>{SKILL_CATS.map(c=><button key={c} className="filter-tag" style={{opacity:sk.category===c?1:0.4,borderColor:sk.category===c?catColor(c)+"88":"",color:sk.category===c?catColor(c):""}} onClick={()=>upd(sk.id,"category",c)}>{c}</button>)}</div>
          <div className="row" style={{gap:"0.6rem",marginBottom:"0.7rem"}}><span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",textTransform:"uppercase",letterSpacing:"0.12em"}}>Mastery</span><SkillPips value={sk.level} onChange={v=>upd(sk.id,"level",v)}/></div>
          <textarea className="g-textarea" rows={4} placeholder="Description, effect, source, requirements…" value={sk.description||""} onChange={e=>upd(sk.id,"description",e.target.value)}/>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(sk.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ SPELLS TAB ════════════════════════════════ */
function SpellsTab({spells,setSpells,char,setChar}) {
  const [form,setForm]=useState({name:"",level:"Cantrip",school:"Evocation",castingTime:"1 action",range:"",duration:"",components:"",description:"",notes:""});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeLevel,setActiveLevel]=useState(null);
  const [showSlots,setShowSlots]=useState(false);

  const addSpell=()=>{const n=form.name.trim();if(!n)return;setSpells(l=>[...l,{id:Date.now(),...form,name:n,tags:[],pinned:false,inUse:false}]);setForm({name:"",level:"Cantrip",school:"Evocation",castingTime:"1 action",range:"",duration:"",components:"",description:"",notes:""});setShowForm(false);};
  const upd=(id,f,v)=>setSpells(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setSpells(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const toggleInUse=id=>setSpells(l=>l.map(x=>x.id===id?{...x,inUse:!x.inUse}:x));
  const slots=char.spellSlots||{};
  const pb=char.profBonus||2;
  const spMod=Math.floor(((char.stats||{})[char.spellcastingAbility||"INT"]||10)-10)/2;
  const visible=activeLevel?spells.filter(s=>s.level===activeLevel):spells;
  const inUseCount=spells.filter(s=>s.inUse).length;

  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"var(--spell-muted)"}}>{spells.length} spells{inUseCount>0?` · ${inUseCount} prepared`:""}</span>
      <div className="row" style={{gap:"0.5rem"}}>
        <button className="btn-sm" style={{borderColor:"var(--spell-border)",color:"var(--spell-accent)"}} onClick={()=>setShowSlots(s=>!s)}>{showSlots?"✕ Slots":"⚙ Slots"}</button>
        <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Spell"}</button>
      </div>
    </div>

    {showSlots&&<div className="card" style={{borderColor:"var(--spell-border)"}}>
      <div className="sect-label" style={{color:"var(--spell-accent)"}}>Spell Slots & Casting</div>
      <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.7rem",flexWrap:"wrap"}}>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.54rem",letterSpacing:"0.14em",color:"var(--spell-muted)",textTransform:"uppercase"}}>Casting Ability</span>
        <select className="g-select" style={{width:"auto",fontSize:"0.82rem",padding:"0.25rem 0.5rem",borderColor:"#1a3a6a"}} value={char.spellcastingAbility||"INT"} onChange={e=>setChar(c=>({...c,spellcastingAbility:e.target.value}))}>{STAT_KEYS.map(s=><option key={s} value={s}>{s}</option>)}</select>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.72rem",color:"var(--spell-accent)"}}>DC {8+pb+spMod} · Atk {numMod(pb+spMod)}</span>
      </div>
      <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
    </div>}

    {showForm&&<div className="add-form" style={{borderColor:"var(--spell-border)"}}><div className="col">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
        <input className="g-input" placeholder="Spell name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSpell()}/>
        <select className="g-select" value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))}>{SPELL_SCHOOLS.map(s=><option key={s} value={s}>{s}</option>)}</select>
      </div>
      <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{SPELL_LEVELS.map(lv=><button key={lv} className="filter-tag" style={{opacity:form.level===lv?1:0.45,borderColor:form.level===lv?"#1a5a9a":"",color:form.level===lv?"#64a0e6":""}} onClick={()=>setForm(f=>({...f,level:lv}))}>{lv}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.5rem"}}>
        <div className="pack-field"><span className="pack-field-label">Casting Time</span><input className="pack-field-input" placeholder="1 action" value={form.castingTime} onChange={e=>setForm(f=>({...f,castingTime:e.target.value}))}/></div>
        <div className="pack-field"><span className="pack-field-label">Range</span><input className="pack-field-input" placeholder="60 ft" value={form.range} onChange={e=>setForm(f=>({...f,range:e.target.value}))}/></div>
        <div className="pack-field"><span className="pack-field-label">Duration</span><input className="pack-field-input" placeholder="Instantaneous" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/></div>
      </div>
      <input className="g-input" placeholder="Components (V, S, M…)" value={form.components} onChange={e=>setForm(f=>({...f,components:e.target.value}))}/>
      <textarea className="g-textarea" rows={3} placeholder="Spell description and effects…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addSpell}>⊕ Add Spell</button></div>
    </div></div>}

    <div className="filter-bar">
      <button className={`filter-tag${!activeLevel?" active-filter":""}`} onClick={()=>setActiveLevel(null)}>All</button>
      {SPELL_LEVELS.map(lv=>{const count=spells.filter(s=>s.level===lv).length;if(!count)return null;return<button key={lv} className={`filter-tag${activeLevel===lv?" active-filter":""}`} style={{borderColor:activeLevel===lv?"#1a5a9a":"",color:activeLevel===lv?"#64a0e6":""}} onClick={()=>setActiveLevel(activeLevel===lv?null:lv)}>{lv} ({count})</button>;})}
    </div>

    {spells.length===0&&<div className="card empty-state">No spells recorded.</div>}

    {visible.map(sp=>{const open=!!expanded[sp.id];return(
      <div key={sp.id} className={`card${sp.pinned?" pinned":""}${sp.inUse?" spell-active":""}`} style={{padding:"1rem 1.1rem",borderLeftColor:"#1a4a8a",borderLeftWidth:2}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.3rem",flexWrap:"wrap"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.98rem",color:"var(--spell-text)",fontWeight:700}} value={sp.name} onChange={e=>upd(sp.id,"name",e.target.value)} placeholder="Spell name…"/>
              <span className="spell-level-badge">{sp.level}</span>
              {sp.school&&<span className="spell-school-badge">{sp.school}</span>}
            </div>
            {!open&&<div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.08em",color:"var(--spell-muted)"}}>
              {[sp.castingTime,sp.range&&`Range: ${sp.range}`,sp.duration&&`Duration: ${sp.duration}`].filter(Boolean).join(" · ")}
            </div>}
          </div>
          <Toggle on={!!sp.inUse} onToggle={()=>toggleInUse(sp.id)} label={sp.inUse?"Prepared":"Known"} color="blue"/>
          <PinBtn pinned={sp.pinned} onToggle={()=>upd(sp.id,"pinned",!sp.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(sp.id)}>{open?"▲":"▼"}</button>
        </div>
        {!open&&sp.description&&<p style={{fontSize:"0.9rem",color:"var(--spell-muted)",fontStyle:"italic",marginTop:"0.3rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sp.description}</p>}
        <TagsEditor tags={sp.tags||[]} onChange={v=>upd(sp.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.7rem"}}>
            <div><span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.12em",color:"var(--spell-muted)",textTransform:"uppercase",display:"block",marginBottom:"0.2rem"}}>Level</span><select className="g-select" style={{fontSize:"0.82rem",padding:"0.25rem 0.5rem",borderColor:"var(--spell-border)"}} value={sp.level} onChange={e=>upd(sp.id,"level",e.target.value)}>{SPELL_LEVELS.map(lv=><option key={lv} value={lv}>{lv}</option>)}</select></div>
            <div><span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.12em",color:"var(--spell-muted)",textTransform:"uppercase",display:"block",marginBottom:"0.2rem"}}>School</span><select className="g-select" style={{fontSize:"0.82rem",padding:"0.25rem 0.5rem",borderColor:"var(--spell-border)"}} value={sp.school} onChange={e=>upd(sp.id,"school",e.target.value)}>{SPELL_SCHOOLS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.5rem",marginBottom:"0.7rem"}}>
            <div className="pack-field"><span className="pack-field-label">Casting Time</span><input className="pack-field-input" value={sp.castingTime||""} onChange={e=>upd(sp.id,"castingTime",e.target.value)}/></div>
            <div className="pack-field"><span className="pack-field-label">Range</span><input className="pack-field-input" value={sp.range||""} onChange={e=>upd(sp.id,"range",e.target.value)}/></div>
            <div className="pack-field"><span className="pack-field-label">Duration</span><input className="pack-field-input" value={sp.duration||""} onChange={e=>upd(sp.id,"duration",e.target.value)}/></div>
          </div>
          <div className="pack-field" style={{marginBottom:"0.6rem"}}><span className="pack-field-label">Components</span><input className="pack-field-input" value={sp.components||""} placeholder="V, S, M (material)" onChange={e=>upd(sp.id,"components",e.target.value)}/></div>
          <textarea className="g-textarea" rows={4} placeholder="Spell description…" value={sp.description||""} onChange={e=>upd(sp.id,"description",e.target.value)}/>
          <div style={{marginTop:"0.5rem"}}>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.12em",color:"var(--spell-muted)",textTransform:"uppercase",display:"block",marginBottom:"0.25rem"}}>At Higher Levels / Notes</span>
            <textarea className="g-textarea" rows={2} value={sp.notes||""} placeholder="When cast using a higher level slot…" onChange={e=>upd(sp.id,"notes",e.target.value)}/>
          </div>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(sp.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ NPC TRACKER ══════════════════════════════ */
function NPCTracker({npcs,setNPCs}) {
  const [formState,setForm]=useState({name:"",role:"",relation:"unknown",affiliation:"",metAt:"",connections:"",notes:""});
  const [showForm,setShowForm]=useState(false);const [expanded,setExpanded]=useState({});const [activeTag,setActiveTag]=useState(null);
  const allTags=[...new Set(npcs.flatMap(n=>n.tags||[]))].sort();
  const addNPC=()=>{const n=formState.name.trim();if(!n)return;setNPCs(l=>[...l,{id:Date.now(),...formState,name:n,tags:[],pinned:false}]);setForm({name:"",role:"",relation:"unknown",affiliation:"",metAt:"",connections:"",notes:""});setShowForm(false);};
  const upd=(id,f,v)=>setNPCs(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setNPCs(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const cycleRel=id=>setNPCs(l=>l.map(x=>x.id===id?{...x,relation:REL_CYCLE[x.relation||"unknown"]}:x));
  const visible=npcs.filter(n=>!activeTag||(n.tags||[]).includes(activeTag)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em"}}>{npcs.length} {npcs.length===1?"character":"characters"} known</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add NPC"}</button>
    </div>
    {showForm&&<div className="add-form"><div className="col">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
        <input className="g-input" placeholder="Name…" value={formState.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addNPC()}/>
        <input className="g-input" placeholder="Role / occupation…" value={formState.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/>
        <input className="g-input" placeholder="Affiliation…" value={formState.affiliation} onChange={e=>setForm(f=>({...f,affiliation:e.target.value}))}/>
        <input className="g-input" placeholder="First met at…" value={formState.metAt} onChange={e=>setForm(f=>({...f,metAt:e.target.value}))}/>
      </div>
      <input className="g-input" placeholder="Connections…" value={formState.connections} onChange={e=>setForm(f=>({...f,connections:e.target.value}))}/>
      <div className="row" style={{gap:"0.5rem",flexWrap:"wrap"}}>{["unknown","ally","neutral","hostile"].map(r=><button key={r} className={`rel-badge rel-${r}`} style={{opacity:formState.relation===r?1:0.45}} onClick={()=>setForm(f=>({...f,relation:r}))}>{REL_LABELS[r]}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Notes…" value={formState.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addNPC}>⊕ Add</button></div>
    </div></div>}
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
    {npcs.length===0&&<div className="card empty-state">No characters recorded.</div>}
    {visible.map(npc=>{const open=!!expanded[npc.id];const rel=npc.relation||"unknown";return(
      <div key={npc.id} className={`card${npc.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",fontWeight:700}} value={npc.name} onChange={e=>upd(npc.id,"name",e.target.value)} placeholder="Name…"/>
              <span className={`rel-badge rel-${rel}`} onClick={()=>cycleRel(npc.id)}>{REL_LABELS[rel]}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.25rem 0.6rem"}}>
              <input className="iedit" style={{fontSize:"0.88rem",fontStyle:"italic"}} value={npc.role||""} onChange={e=>upd(npc.id,"role",e.target.value)} placeholder="Role…"/>
              <input className="iedit" style={{fontSize:"0.88rem"}} value={npc.affiliation||""} onChange={e=>upd(npc.id,"affiliation",e.target.value)} placeholder="Affiliation…"/>
              <input className="iedit" style={{fontSize:"0.85rem"}} value={npc.metAt||""} onChange={e=>upd(npc.id,"metAt",e.target.value)} placeholder="First met at…"/>
              <input className="iedit" style={{fontSize:"0.85rem"}} value={npc.connections||""} onChange={e=>upd(npc.id,"connections",e.target.value)} placeholder="Connections…"/>
            </div>
          </div>
          <PinBtn pinned={npc.pinned} onToggle={()=>upd(npc.id,"pinned",!npc.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(npc.id)}>{open?"▲":"▼"}</button>
        </div>
        <TagsEditor tags={npc.tags||[]} onChange={v=>upd(npc.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <textarea className="g-textarea" rows={4} placeholder="Known facts, personality, secrets…" value={npc.notes||""} onChange={e=>upd(npc.id,"notes",e.target.value)}/>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(npc.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ LOCATIONS ════════════════════════════════ */
function Locations({locations,setLocations}) {
  const [form,setForm]=useState({name:"",type:"Settlement",notes:""});
  const [showForm,setShowForm]=useState(false);const [expanded,setExpanded]=useState({});const [activeTag,setActiveTag]=useState(null);
  const allTags=[...new Set(locations.flatMap(l=>l.tags||[]))].sort();
  const addLoc=()=>{const n=form.name.trim();if(!n)return;setLocations(l=>[...l,{id:Date.now(),name:n,type:form.type,notes:form.notes.trim(),tags:[],pinned:false}]);setForm({name:"",type:"Settlement",notes:""});setShowForm(false);};
  const upd=(id,f,v)=>setLocations(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setLocations(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const visible=locations.filter(l=>!activeTag||(l.tags||[]).includes(activeTag)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em"}}>{locations.length} {locations.length===1?"location":"locations"} mapped</span>
      <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Location"}</button>
    </div>
    {showForm&&<div className="add-form"><div className="col">
      <input className="g-input" placeholder="Location name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLoc()}/>
      <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>{LOC_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:form.type===t?1:0.45,borderColor:form.type===t?"currentColor":""}} onClick={()=>setForm(f=>({...f,type:t}))}>{t}</button>)}</div>
      <textarea className="g-textarea" rows={3} placeholder="Description, atmosphere, notable features…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
      <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addLoc}>⊕ Add</button></div>
    </div></div>}
    <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
    {locations.length===0&&<div className="card empty-state">No locations recorded.</div>}
    {visible.map(loc=>{const open=!!expanded[loc.id];return(
      <div key={loc.id} className={`card${loc.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem"}}>
        <div className="entity-header">
          <div className="flex1">
            <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem"}}>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",fontWeight:700}} value={loc.name} onChange={e=>upd(loc.id,"name",e.target.value)} placeholder="Location name…"/>
              <span className="loc-type">{loc.type}</span>
            </div>
          </div>
          <PinBtn pinned={loc.pinned} onToggle={()=>upd(loc.id,"pinned",!loc.pinned)}/>
          <button className="entity-toggle" onClick={()=>toggle(loc.id)}>{open?"▲":"▼"}</button>
        </div>
        <TagsEditor tags={loc.tags||[]} onChange={v=>upd(loc.id,"tags",v)}/>
        {open&&<div style={{marginTop:"0.8rem"}}>
          <div className="row" style={{gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.7rem"}}>{LOC_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:loc.type===t?1:0.4,borderColor:loc.type===t?"currentColor":""}} onClick={()=>upd(loc.id,"type",t)}>{t}</button>)}</div>
          <textarea className="g-textarea" rows={4} placeholder="Geography, atmosphere, notable features, dangers…" value={loc.notes||""} onChange={e=>upd(loc.id,"notes",e.target.value)}/>
          <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(loc.id)}>Remove</button></div>
        </div>}
      </div>
    );})}
  </>;
}

/* ═══ SESSION LOG ═══════════════════════════════ */
function SessionLog({sessions,setSessions,npcs,locations,quests,inventory,skills,onNavigate}) {
  const [openIds,setOpenIds]=useState({});const [editingId,setEditingId]=useState(null);
  const addSession=()=>{const e={id:Date.now(),number:sessions.length+1,date:today(),title:`Session ${sessions.length+1}`,notes:""};setSessions(s=>[e,...s]);setOpenIds(o=>({...o,[e.id]:true}));setEditingId(e.id);};
  const upd=(id,f,v)=>setSessions(s=>s.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>{setSessions(s=>s.filter(x=>x.id!==id));if(editingId===id)setEditingId(null);};
  const toggle=id=>{setOpenIds(o=>({...o,[id]:!o[id]}));if(!openIds[id])setEditingId(null);};
  const hasAny=npcs.length||locations.length||quests.length||inventory.length||skills.length;
  const hasNotes=sessions.some(s=>s.notes);
  return <>
    <div className="row" style={{justifyContent:"space-between"}}>
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em"}}>{sessions.length} {sessions.length===1?"session":"sessions"} recorded</span>
      <button className="btn-gold" onClick={addSession}>⊕ New Session</button>
    </div>
    {hasAny&&hasNotes&&<div className="sess-legend">
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>Hover for preview →</span>
      {LEGEND_ITEMS.map(li=>{const counts={npc:npcs.length,location:locations.length,quest:quests.length,inventory:inventory.length,skill:skills.length};if(!counts[li.type])return null;return<div key={li.type} className="sess-legend-item"><div className="legend-dot" style={{background:li.color,border:`1px solid ${li.border}`}}/><span style={{color:li.border}}>{li.label}</span></div>;})}
    </div>}
    {sessions.length===0&&<div className="card empty-state">No chronicles written yet.</div>}
    {sessions.map(sess=>{
      const open=!!openIds[sess.id];const editing=editingId===sess.id;
      const parsed=parseEntityLinksWithTooltips(sess.notes,npcs,locations,quests,inventory,skills,onNavigate);
      return <div key={sess.id} className="sess-entry">
        <div className={`sess-header${open?" open":""}`} onClick={()=>toggle(sess.id)}>
          <span className="sess-num">#{String(sess.number).padStart(2,"0")}</span>
          <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.92rem"}} value={sess.title} onChange={e=>{e.stopPropagation();upd(sess.id,"title",e.target.value);}} onClick={e=>e.stopPropagation()}/>
          <input type="date" style={{background:"transparent",border:"none",color:"inherit",fontFamily:"inherit",fontSize:"0.75rem",outline:"none",flexShrink:0,opacity:0.6}} value={sess.date} onChange={e=>{e.stopPropagation();upd(sess.id,"date",e.target.value);}} onClick={e=>e.stopPropagation()}/>
          <span style={{fontSize:"0.65rem",flexShrink:0,opacity:0.5}}>{open?"▲":"▼"}</span>
        </div>
        {open&&<div className="sess-body">
          {editing?<>
            <textarea className="g-textarea" rows={6} autoFocus placeholder="Write your session notes… named entities become coloured links with hover previews." value={sess.notes} onChange={e=>upd(sess.id,"notes",e.target.value)}/>
            <div className="row mt05" style={{justifyContent:"space-between"}}>
              <button className="btn-ghost" onClick={()=>del(sess.id)}>Expunge Record</button>
              <button className="btn-gold" onClick={()=>setEditingId(null)}>✓ Done</button>
            </div>
          </>:<>
            <div className="sess-rendered" data-placeholder="No notes yet — tap to write…" onClick={()=>setEditingId(sess.id)}>{sess.notes?parsed:null}</div>
            <div className="row mt05" style={{justifyContent:"space-between"}}>
              <button className="btn-ghost" onClick={()=>del(sess.id)}>Expunge Record</button>
              <button className="btn-ghost" style={{opacity:0.7}} onClick={()=>setEditingId(sess.id)}>✎ Edit</button>
            </div>
          </>}
        </div>}
      </div>;
    })}
  </>;
}

/* ═══ QUEST TRACKER ════════════════════════════ */
function QuestTracker({quests,setQuests}) {
  const [name,setName]=useState("");const [desc,setDesc]=useState("");const [reward,setReward]=useState("");
  const [expanded,setExpanded]=useState({});
  const addQuest=()=>{const n=name.trim();if(!n)return;setQuests(q=>[...q,{id:Date.now(),name:n,description:desc.trim(),reward:reward.trim(),status:"Active",steps:[]}]);setName("");setDesc("");setReward("");};
  const cycle=id=>setQuests(q=>q.map(x=>x.id===id?{...x,status:STATUS_CYCLE[x.status]}:x));
  const del=id=>setQuests(q=>q.filter(x=>x.id!==id));
  const upd=(id,f,v)=>setQuests(q=>q.map(x=>x.id===id?{...x,[f]:v}:x));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const addStep=id=>setQuests(q=>q.map(x=>x.id===id?{...x,steps:[...(x.steps||[]),{id:Date.now(),text:"",done:false}]}:x));
  const updStep=(id,sid,f,v)=>setQuests(q=>q.map(x=>x.id===id?{...x,steps:(x.steps||[]).map(s=>s.id===sid?{...s,[f]:v}:s)}:x));
  const delStep=(id,sid)=>setQuests(q=>q.map(x=>x.id===id?{...x,steps:(x.steps||[]).filter(s=>s.id!==sid)}:x));
  return <>
    <div className="card">
      <div className="sect-label">Issue New Mandate</div>
      <div className="col">
        <input className="g-input" placeholder="Quest name…" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQuest()}/>
        <input className="g-input" placeholder="Brief description…" value={desc} onChange={e=>setDesc(e.target.value)}/>
        <input className="g-input" placeholder="Reward (gold, items, XP…)" value={reward} onChange={e=>setReward(e.target.value)}/>
        <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addQuest}>⊕ Add Quest</button></div>
      </div>
    </div>
    {quests.length===0&&<div className="card empty-state">No mandates issued.</div>}
    {["Active","Completed","Failed"].map(status=>{
      const filtered=quests.filter(q=>q.status===status);if(!filtered.length)return null;
      const lc=status==="Active"?"#c9943e":status==="Completed"?"#5a8a5a":"#8a3a3a";
      return <div key={status} style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
        <div className="sect-label" style={{color:lc}}>{status} <span style={{opacity:0.5}}>({filtered.length})</span></div>
        {filtered.map(quest=>{const open=!!expanded[quest.id];const steps=quest.steps||[];const doneCount=steps.filter(s=>s.done).length;
          return <div key={quest.id} className={`quest-entry ${status.toLowerCase()}`}>
            <div className="row" style={{alignItems:"flex-start"}}>
              <div className="flex1">
                <div className="row" style={{marginBottom:"0.3rem",flexWrap:"wrap",gap:"0.4rem"}}>
                  <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.95rem",fontWeight:700}} value={quest.name} onChange={e=>upd(quest.id,"name",e.target.value)} placeholder="Quest name…"/>
                  <span className={`badge ${status.toLowerCase()}`} onClick={()=>cycle(quest.id)}>{status}</span>
                </div>
                <input className="iedit" style={{fontSize:"0.92rem",fontStyle:"italic"}} value={quest.description||""} onChange={e=>upd(quest.id,"description",e.target.value)} placeholder="Description…"/>
                {quest.reward&&<div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.1em",color:"var(--quest-reward)",marginTop:"0.3rem"}}>⭐ {quest.reward}</div>}
                {steps.length>0&&<div style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.08em",marginTop:"0.2rem",opacity:0.6}}>{doneCount}/{steps.length} steps</div>}
              </div>
              <button className="entity-toggle" onClick={()=>toggle(quest.id)} style={{marginTop:"0.1rem"}}>{open?"▲":"▼"}</button>
              <button onClick={()=>del(quest.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"0.1rem 0.2rem",transition:"color 0.15s",flexShrink:0,opacity:0.4}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.4"}>✕</button>
            </div>
            {open&&<div style={{marginTop:"0.7rem"}}>
              {steps.map(step=><div key={step.id} className="checklist-item">
                <div className={`check-box${step.done?" checked":""}`} onClick={()=>updStep(quest.id,step.id,"done",!step.done)}/>
                <input className={`iedit flex1 checklist-text${step.done?" done":""}`} style={{fontSize:"0.92rem"}} value={step.text} onChange={e=>updStep(quest.id,step.id,"text",e.target.value)} placeholder="Step description…"/>
                <button style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"0.75rem",transition:"opacity 0.15s",opacity:0.3}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.3"} onClick={()=>delStep(quest.id,step.id)}>✕</button>
              </div>)}
              <div className="row mt05" style={{justifyContent:"space-between",alignItems:"flex-end"}}>
                <button className="btn-sm" onClick={()=>addStep(quest.id)}>+ Step</button>
                <div style={{display:"flex",flexDirection:"column",gap:"0.1rem"}}>
                  <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.1em",textTransform:"uppercase",opacity:0.6}}>Reward</span>
                  <input className="iedit" style={{fontSize:"0.88rem",color:"var(--quest-reward)",minWidth:120}} value={quest.reward||""} onChange={e=>upd(quest.id,"reward",e.target.value)} placeholder="Gold, items, XP…"/>
                </div>
              </div>
            </div>}
          </div>;
        })}
      </div>;
    })}
  </>;
}

/* ═══ NAV ══════════════════════════════════════ */
/* ═══════════════════════════════════════════════
   PROFILE SCREEN — character select
═══════════════════════════════════════════════ */
const DND_CLASSES = [
  {name:"Barbarian", icon:"🪓"}, {name:"Bard",       icon:"🎶"},
  {name:"Cleric",    icon:"✝️"}, {name:"Druid",      icon:"🌿"},
  {name:"Fighter",   icon:"⚔️"}, {name:"Monk",       icon:"☯️"},
  {name:"Paladin",   icon:"🛡️"}, {name:"Ranger",     icon:"🏹"},
  {name:"Rogue",     icon:"🗡️"}, {name:"Sorcerer",   icon:"💫"},
  {name:"Warlock",   icon:"👁️"}, {name:"Wizard",     icon:"📚"},
  {name:"Other",     icon:"⚡"},
];

const STAT_ARRAYS = {
  Standard: {STR:15,DEX:14,CON:13,INT:12,WIS:10,CHA:8},
  Heroic:   {STR:16,DEX:15,CON:14,INT:13,WIS:12,CHA:11},
  Balanced: {STR:13,DEX:13,CON:13,INT:13,WIS:13,CHA:13},
};

function ProfileScreen({ profiles, activeId, onSelect, onCreate, onDelete, theme }) {
  const t = THEMES[theme]||THEMES.dark;
  return (
    <div className="profile-screen">
      <div style={{position:"absolute",top:"1rem",right:"1rem"}}>
        <button
          onClick={()=>{ const next=theme==="dark"?"light":"dark"; localStorage.setItem("hj_theme",JSON.stringify(next)); window.location.reload(); }}
          style={{background:"transparent",border:`1px solid ${t.borderInput}`,color:t.textMuted,fontFamily:"Cinzel,serif",fontSize:"0.55rem",letterSpacing:"0.1em",padding:"0.2rem 0.5rem",cursor:"pointer",textTransform:"uppercase"}}
        >{theme==="dark"?"☀ Parchment":"🌙 Dark"}</button>
      </div>

      <div className="profile-logo">⚔ Hero Journal</div>
      <div className="profile-tagline">Choose your hero to continue the adventure</div>

      <div className="profile-list">
        {profiles.map(p => (
          <div key={p.id} className={`profile-card${p.id===activeId?" active-profile":""}`}
            onClick={() => onSelect(p.id)}>
            <span className="profile-card-icon">
              {DND_CLASSES.find(c=>c.name===p.class)?.icon || "⚔️"}
            </span>
            <div style={{flex:1,minWidth:0}}>
              <div className="profile-card-name">{p.name||"Unnamed Hero"}</div>
              <div className="profile-card-sub">
                {[p.class, p.level&&`Level ${p.level}`].filter(Boolean).join(" · ")}
                {p.id===activeId&&<span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.1em",textTransform:"uppercase",color:t.accent,marginLeft:"0.6rem"}}>● Active</span>}
              </div>
            </div>
            {profiles.length > 1 && (
              <button className="profile-card-del" onClick={e=>{e.stopPropagation();onDelete(p.id);}}>✕</button>
            )}
          </div>
        ))}
      </div>

      <button className="btn-new-profile" onClick={onCreate}>
        ⊕ Create New Hero
      </button>

      <div style={{marginTop:"2rem",fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.1em",color:t.textDim,textTransform:"uppercase",textAlign:"center"}}>
        {profiles.length} hero{profiles.length!==1?"es":""} in journal
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CHARACTER WIZARD — new hero creator
═══════════════════════════════════════════════ */
function CharacterWizard({ onFinish, onCancel, theme }) {
  const t = THEMES[theme]||THEMES.dark;
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [cls,  setCls]  = useState(null);
  const [level,setLevel]= useState(1);
  const [bg,   setBg]   = useState("");
  const [align,setAlign]= useState("True Neutral");
  const [statArray, setStatArray] = useState("Standard");
  const [customStats, setCustomStats] = useState({STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10});
  const [useCustom, setUseCustom] = useState(false);

  const STEPS = ["Name", "Class", "Stats", "Details"];
  const stats = useCustom ? customStats : (STAT_ARRAYS[statArray]||STAT_ARRAYS.Standard);

  const canNext = [
    name.trim().length > 0,
    cls !== null,
    true,
    true,
  ][step];

  const handleFinish = () => {
    const id = "profile_" + Date.now();
    const newChar = {
      ...DEFAULT_CHAR,
      name: name.trim(),
      classes: [{ name: cls?.name||"Adventurer", level }],
      background: bg.trim(),
      alignment: align,
      stats: { ...stats },
    };
    onFinish(id, newChar, { name:name.trim(), class:cls?.name||"", level, created:Date.now() });
  };

  const inputStyle = {
    background:t.bgInput, border:`1px solid ${t.borderInput}`, color:t.text,
    fontFamily:"Crimson Text,Georgia,serif", fontSize:"1.05rem",
    padding:"0.5rem 0.85rem", outline:"none", width:"100%",
  };

  return (
    <div className="wizard-screen">
      <div className="wizard-box">
        {/* Step dots */}
        <div className="wizard-step-dots">
          {STEPS.map((s,i)=><div key={s} className={`wizard-dot${i<=step?" active":""}`}/>)}
        </div>

        <div className="wizard-title">New Hero</div>
        <div className="wizard-sub">{STEPS[step]} — step {step+1} of {STEPS.length}</div>

        {/* Step 0: Name */}
        {step===0&&<>
          <div className="wizard-step-label">What is your hero's name?</div>
          <input autoFocus style={inputStyle} placeholder="Enter name…"
            value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&canNext&&setStep(1)}/>
          <div style={{marginTop:"0.6rem",fontFamily:"Crimson Text,serif",fontSize:"0.9rem",color:t.textDim,fontStyle:"italic"}}>
            This will appear at the top of your journal.
          </div>
        </>}

        {/* Step 1: Class */}
        {step===1&&<>
          <div className="wizard-step-label">Choose your class</div>
          <div className="wizard-class-grid">
            {DND_CLASSES.map(c=>(
              <button key={c.name} className={`wizard-class-btn${cls?.name===c.name?" selected":""}`}
                onClick={()=>setCls(c)}>
                <span className="wizard-class-icon">{c.icon}</span>
                <span className="wizard-class-name">{c.name}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginTop:"0.4rem"}}>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",letterSpacing:"0.14em",color:t.textLabel,textTransform:"uppercase"}}>Level</span>
            <input type="number" min={1} max={20} value={level}
              onChange={e=>setLevel(clamp(parseInt(e.target.value)||1,1,20))}
              style={{...inputStyle,width:64,textAlign:"center",fontFamily:"Cinzel,serif",fontSize:"1rem"}}/>
          </div>
        </>}

        {/* Step 2: Stats */}
        {step===2&&<>
          <div className="wizard-step-label">Choose stat array</div>
          <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.8rem",flexWrap:"wrap"}}>
            {Object.keys(STAT_ARRAYS).map(arr=>(
              <button key={arr}
                style={{fontFamily:"Cinzel,serif",fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"transparent",border:`1px solid ${!useCustom&&statArray===arr?t.accent:t.borderInput}`,color:!useCustom&&statArray===arr?t.accent:t.textMuted,padding:"0.3rem 0.7rem",cursor:"pointer",transition:"all 0.15s"}}
                onClick={()=>{setStatArray(arr);setUseCustom(false);}}>
                {arr}
              </button>
            ))}
            <button
              style={{fontFamily:"Cinzel,serif",fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"transparent",border:`1px solid ${useCustom?t.accent:t.borderInput}`,color:useCustom?t.accent:t.textMuted,padding:"0.3rem 0.7rem",cursor:"pointer",transition:"all 0.15s"}}
              onClick={()=>setUseCustom(true)}>
              Custom
            </button>
          </div>
          <div className="wizard-stat-grid">
            {STAT_KEYS.map(k=>(
              <div key={k} className="wizard-stat-box">
                <span className="wizard-stat-label">{k}</span>
                {useCustom
                  ? <input type="number" min={1} max={30} value={customStats[k]}
                      onChange={e=>setCustomStats(s=>({...s,[k]:clamp(parseInt(e.target.value)||10,1,30)}))}
                      style={{background:"transparent",border:"none",outline:"none",fontFamily:"Cinzel,serif",fontSize:"1.1rem",fontWeight:700,color:t.accent,textAlign:"center",width:"100%"}}/>
                  : <span className="wizard-stat-val">{stats[k]}</span>}
                <div style={{fontFamily:"Cinzel,serif",fontSize:"0.55rem",color:t.textMuted}}>{statMod(stats[k])}</div>
              </div>
            ))}
          </div>
        </>}

        {/* Step 3: Details */}
        {step===3&&<>
          <div className="wizard-step-label">Background</div>
          <input style={{...inputStyle,marginBottom:"0.6rem"}} placeholder="e.g. Soldier, Noble, Outlander…"
            value={bg} onChange={e=>setBg(e.target.value)}/>
          <div className="wizard-step-label">Alignment</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.3rem",marginBottom:"0.6rem"}}>
            {ALIGNMENTS.map(a=>(
              <button key={a}
                style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.06em",textTransform:"uppercase",background:"transparent",border:`1px solid ${align===a?t.accent:t.borderInput}`,color:align===a?t.accent:t.textMuted,padding:"0.35rem 0.2rem",cursor:"pointer",transition:"all 0.15s",lineHeight:1.3,textAlign:"center"}}
                onClick={()=>setAlign(a)}>{a}</button>
            ))}
          </div>
          <div style={{fontFamily:"Crimson Text,serif",fontSize:"0.9rem",color:t.textDim,fontStyle:"italic",marginTop:"0.5rem",lineHeight:1.6}}>
            Your hero is ready. You can change everything later.
          </div>
        </>}

        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"1.5rem",gap:"0.6rem"}}>
          <button
            onClick={step===0?onCancel:()=>setStep(s=>s-1)}
            style={{fontFamily:"Cinzel,serif",fontSize:"0.68rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"transparent",border:`1px solid ${t.borderInput}`,color:t.textMuted,padding:"0.5rem 1rem",cursor:"pointer",flex:"0 0 auto"}}>
            {step===0?"Cancel":"← Back"}
          </button>
          {step<STEPS.length-1
            ? <button disabled={!canNext}
                onClick={()=>setStep(s=>s+1)}
                style={{fontFamily:"Cinzel,serif",fontSize:"0.68rem",letterSpacing:"0.1em",textTransform:"uppercase",background:canNext?"rgba(226,185,78,0.1)":"transparent",border:`1px solid ${canNext?t.accent:t.borderInput}`,color:canNext?t.accent:t.textDim,padding:"0.5rem 1.5rem",cursor:canNext?"pointer":"default",flex:1,transition:"all 0.15s"}}>
                Next →
              </button>
            : <button
                onClick={handleFinish}
                style={{fontFamily:"Cinzel,serif",fontSize:"0.68rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(226,185,78,0.12)",border:`1px solid ${t.accent}`,color:t.accent,padding:"0.5rem 1.5rem",cursor:"pointer",flex:1,boxShadow:`0 0 16px rgba(226,185,78,0.2)`}}>
                ⚔ Begin Adventure
              </button>}
        </div>
      </div>
    </div>
  );
}


const TABS=[
  {id:"character", label:"Hero",     icon:"⚔️"},
  {id:"inventory", label:"Pack",     icon:"🎒"},
  {id:"skills",    label:"Skills",   icon:"✨"},
  {id:"spells",    label:"Spells",   icon:"🔮"},
  {id:"npcs",      label:"People",   icon:"👥"},
  {id:"locations", label:"Places",   icon:"🗺️"},
  {id:"sessions",  label:"Log",      icon:"📜"},
  {id:"quests",    label:"Quests",   icon:"⚡"},
];

/* ═══ ROOT APP ═════════════════════════════════ */
export default function HeroJournal() {
  // ── Global state ──
  const [theme,     setTheme]     = useState(()=>load("hj_theme","dark"));
  const [profiles,  setProfilesState] = useState(()=>{ migrateLegacy(); return loadProfiles(); });
  const [activeId,  setActiveId]  = useState(()=>{ migrateLegacy(); return loadActiveId(); });
  const [screen,    setScreen]    = useState(() => {
    migrateLegacy();
    const profs = loadProfiles();
    const aid   = loadActiveId();
    if (profs.length===0) return "wizard";
    if (!aid || !profs.find(p=>p.id===aid)) return "profiles";
    return "app";
  });

  // ── Per-character state (loaded when activeId changes) ──
  const [tab,       setTab]       = useState("character");
  const [char,      setChar]      = useState(()=>activeId?loadChar("char",activeId,DEFAULT_CHAR):DEFAULT_CHAR);
  const [inventory, setInventory] = useState(()=>activeId?loadChar("inventory",activeId,[]):[]);
  const [npcs,      setNPCs]      = useState(()=>activeId?loadChar("npcs",activeId,[]):[]);
  const [locations, setLocations] = useState(()=>activeId?loadChar("locations",activeId,[]):[]);
  const [skills,    setSkills]    = useState(()=>activeId?loadChar("skills",activeId,[]):[]);
  const [spells,    setSpells]    = useState(()=>activeId?loadChar("spells",activeId,[]):[]);
  const [sessions,  setSessions]  = useState(()=>activeId?loadChar("sessions",activeId,[]):[]);
  const [quests,    setQuests]    = useState(()=>activeId?loadChar("quests",activeId,[]):[]);
  const [showReset, setShowReset] = useState(false);

  // ── Persist theme globally ──
  useEffect(()=>{save("hj_theme", theme);},[theme]);

  // ── Persist per-character data ──
  useEffect(()=>{ if(activeId) saveChar("char",      activeId, char);      },[char,activeId]);
  useEffect(()=>{ if(activeId) saveChar("inventory", activeId, inventory); },[inventory,activeId]);
  useEffect(()=>{ if(activeId) saveChar("npcs",      activeId, npcs);      },[npcs,activeId]);
  useEffect(()=>{ if(activeId) saveChar("locations", activeId, locations); },[locations,activeId]);
  useEffect(()=>{ if(activeId) saveChar("skills",    activeId, skills);    },[skills,activeId]);
  useEffect(()=>{ if(activeId) saveChar("spells",    activeId, spells);    },[spells,activeId]);
  useEffect(()=>{ if(activeId) saveChar("sessions",  activeId, sessions);  },[sessions,activeId]);
  useEffect(()=>{ if(activeId) saveChar("quests",    activeId, quests);    },[quests,activeId]);

  // ── Keep profiles index updated when char name/class changes ──
  useEffect(()=>{
    if (!activeId) return;
    setProfilesState(prev=>{
      const updated = prev.map(p=>p.id===activeId
        ? {...p, name:char.name?.trim()||p.name, class:(char.classes||[])[0]?.name||p.class, level:(char.classes||[])[0]?.level||p.level}
        : p);
      saveProfiles(updated);
      return updated;
    });
  },[char.name, char.classes, activeId]);

  const handleNavigate = useCallback(tt=>setTab(tt),[]);
  const t = THEMES[theme]||THEMES.dark;

  // ── Switch to a different profile ──
  const switchProfile = useCallback(id => {
    saveActiveId(id);
    setActiveId(id);
    setChar(loadChar("char",id,DEFAULT_CHAR));
    setInventory(loadChar("inventory",id,[]));
    setNPCs(loadChar("npcs",id,[]));
    setLocations(loadChar("locations",id,[]));
    setSkills(loadChar("skills",id,[]));
    setSpells(loadChar("spells",id,[]));
    setSessions(loadChar("sessions",id,[]));
    setQuests(loadChar("quests",id,[]));
    setTab("character");
    setScreen("app");
  },[]);

  // ── Create new hero from wizard ──
  const handleWizardFinish = useCallback((id, newChar, profileMeta) => {
    CHAR_SLOTS.forEach(slot => saveChar(slot, id, slot==="char"?newChar:[]));
    const newProfile = {...profileMeta, id};
    const updated = [...loadProfiles(), newProfile];
    saveProfiles(updated);
    saveActiveId(id);
    setProfilesState(updated);
    setChar(newChar);
    setInventory([]); setNPCs([]); setLocations([]);
    setSkills([]); setSpells([]); setSessions([]); setQuests([]);
    setActiveId(id);
    setTab("character");
    setScreen("app");
  },[]);

  // ── Delete profile ──
  const deleteProfile = useCallback(id => {
    deleteCharData(id);
    const updated = loadProfiles().filter(p=>p.id!==id);
    saveProfiles(updated);
    setProfilesState(updated);
    if (id===activeId) {
      if (updated.length>0) {
        switchProfile(updated[0].id);
      } else {
        saveActiveId(null);
        setActiveId(null);
        setScreen("wizard");
      }
    }
  },[activeId,switchProfile]);

  // ── Reset current character ──
  const handleReset = () => {
    if (!activeId) return;
    CHAR_SLOTS.forEach(s=>saveChar(s,activeId,s==="char"?DEFAULT_CHAR:[]));
    setChar(DEFAULT_CHAR); setInventory([]); setNPCs([]); setLocations([]);
    setSkills([]); setSpells([]); setSessions([]); setQuests([]);
    setShowReset(false);
  };

  const charName = char.name?.trim()||"";

  // ── SCREENS ──
  if (screen==="profiles") {
    return <>
      <style>{buildCSS(t)}</style>
      <ProfileScreen
        profiles={profiles} activeId={activeId} theme={theme}
        onSelect={switchProfile}
        onCreate={()=>setScreen("wizard")}
        onDelete={deleteProfile}
      />
    </>;
  }

  if (screen==="wizard") {
    return <>
      <style>{buildCSS(t)}</style>
      <CharacterWizard
        theme={theme}
        onFinish={handleWizardFinish}
        onCancel={profiles.length>0?()=>setScreen("profiles"):undefined}
      />
    </>;
  }

  // ── APP ──
  return <>
    <style>{buildCSS(t)}</style>
    {showReset&&<ResetModal onConfirm={handleReset} onCancel={()=>setShowReset(false)}/>}
    <div className="hj-root">

      <header className="hj-header">
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",minWidth:0,cursor:"pointer"}} onClick={()=>setScreen("profiles")} title="Switch character">
            <div className="hj-logo"><span style={{fontSize:"0.9rem",opacity:0.75}}>⚔</span>HJ</div>
            <span className="hj-char-name">{charName||"Hero"}</span>
            <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",color:t.textDim,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0}}>▾ switch</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.4rem",flexShrink:0}}>
            <button
              onClick={()=>setTheme(tm=>tm==="dark"?"light":"dark")}
              style={{background:"transparent",border:`1px solid ${t.borderInput}`,color:t.textMuted,fontFamily:"Cinzel,serif",fontSize:"0.55rem",letterSpacing:"0.1em",padding:"0.2rem 0.5rem",cursor:"pointer",textTransform:"uppercase",transition:"all 0.2s"}}
            >{theme==="dark"?"☀ Parchment":"🌙 Dark"}</button>
            <button className="btn-danger" style={{fontSize:"0.55rem",padding:"0.2rem 0.55rem",letterSpacing:"0.1em"}} onClick={()=>setShowReset(true)} title="Reset current character">↺ Reset</button>
          </div>
        </div>
      </header>

      <main className="hj-content">
        {tab==="character" &&<CharacterSheet char={char} setChar={setChar} inventory={inventory} skills={skills} spells={spells}/>}
        {tab==="inventory" &&<Pack inventory={inventory} setInventory={setInventory}/>}
        {tab==="skills"    &&<SkillsTab skills={skills} setSkills={setSkills}/>}
        {tab==="spells"    &&<SpellsTab spells={spells} setSpells={setSpells} char={char} setChar={setChar}/>}
        {tab==="npcs"      &&<NPCTracker npcs={npcs} setNPCs={setNPCs}/>}
        {tab==="locations" &&<Locations locations={locations} setLocations={setLocations}/>}
        {tab==="sessions"  &&<SessionLog sessions={sessions} setSessions={setSessions} npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab==="quests"    &&<QuestTracker quests={quests} setQuests={setQuests}/>}
      </main>

      <nav className="hj-bottom-nav">
        {TABS.map(tb=><button key={tb.id} className={`hj-nav-btn${tab===tb.id?" active":""}`} onClick={()=>setTab(tb.id)}>
          <span className="hj-nav-icon">{tb.icon}</span>
          <span className="hj-nav-label">{tb.label}</span>
        </button>)}
      </nav>
    </div>
  </>;
}