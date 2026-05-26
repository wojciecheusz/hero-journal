import { useState, useEffect, useRef } from 'react'
/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    min-height: 100vh;
    background: #0f0d0b;
  }

  /* ── Noise grain overlay ── */
  .hj-root {
    position: relative;
    min-height: 100vh;
    background: #0f0d0b;
    color: #c8bfa8;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1rem;
    line-height: 1.55;
  }
  .hj-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 999;
    opacity: 0.06;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0a0806; }
  ::-webkit-scrollbar-thumb { background: #3a3020; }
  ::-webkit-scrollbar-thumb:hover { background: #5a4a30; }

  /* ── Typography helpers ── */
  .cinzel      { font-family: 'Cinzel', serif; }
  .cinzel-deco { font-family: 'Cinzel Decorative', 'Cinzel', serif; }
  .crimson     { font-family: 'Crimson Text', Georgia, serif; }

  /* ── Colors ── */
  .c-gold    { color: #c9a84c; }
  .c-dim     { color: #7a6a4a; }
  .c-muted   { color: #9a8a6a; }
  .c-text    { color: #c8bfa8; }
  .c-crimson { color: #a83232; }
  .c-jade    { color: #5a9a5a; }

  /* ── Header / Nav ── */
  .hj-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: linear-gradient(180deg, #181410 0%, #0f0d0b 100%);
    border-bottom: 1px solid #2a2018;
    box-shadow: 0 4px 24px rgba(0,0,0,0.7);
    padding: 0.85rem 1.25rem 0;
  }
  .hj-logo {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #c9a84c;
    letter-spacing: 0.12em;
    text-shadow: 0 0 22px rgba(201,168,76,0.35), 0 0 60px rgba(201,168,76,0.1);
    margin-bottom: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hj-logo-glyph {
    font-size: 1rem;
    opacity: 0.8;
  }

  .hj-tabs {
    display: flex;
    gap: 2px;
  }
  .hj-tab {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    padding: 0.55rem 1.1rem 0.6rem;
    background: transparent;
    border: 1px solid transparent;
    border-bottom: none;
    color: #6a5a3a;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    position: relative;
    bottom: -1px;
  }
  .hj-tab:hover:not(.active) {
    color: #9a8050;
    border-color: #2a2018;
  }
  .hj-tab.active {
    color: #c9a84c;
    border-color: #3a3020;
    border-bottom-color: #0f0d0b;
    background: #0f0d0b;
  }

  /* ── Layout container ── */
  .hj-content {
    max-width: 780px;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  /* ── Parchment card ── */
  .card {
    background: #181410;
    border: 1px solid #2e2618;
    box-shadow: 0 3px 0 #0a0806, inset 0 1px 0 rgba(201,168,76,0.04);
    padding: 1.2rem;
    position: relative;
  }
  .card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.025) 0%, transparent 55%);
    pointer-events: none;
  }

  /* ── Section label ── */
  .sect-label {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #6a5a3a;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.9rem;
  }
  .sect-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #2e2618, transparent);
  }

  /* ── Inline editable input ── */
  .iedit {
    background: transparent;
    border: none;
    border-bottom: 1px dashed #3a2e1a;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    font-style: inherit;
    outline: none;
    width: 100%;
    transition: border-color 0.15s;
    line-height: inherit;
    padding: 0;
  }
  .iedit:focus { border-bottom-color: #c9a84c; }
  .iedit::placeholder { color: #3a3020; }

  /* ── Gothic input / textarea ── */
  .g-input {
    background: #110e0b;
    border: 1px solid #2a2018;
    color: #c8bfa8;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1rem;
    padding: 0.45rem 0.8rem;
    outline: none;
    width: 100%;
    transition: border-color 0.15s;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.45);
  }
  .g-input:focus { border-color: #7a6030; }
  .g-input::placeholder { color: #3a3020; font-style: italic; }

  .g-textarea {
    background: #110e0b;
    border: 1px solid #2a2018;
    color: #c8bfa8;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1rem;
    padding: 0.7rem 0.8rem;
    outline: none;
    width: 100%;
    resize: vertical;
    transition: border-color 0.15s;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.45);
    line-height: 1.6;
  }
  .g-textarea:focus { border-color: #7a6030; }
  .g-textarea::placeholder { color: #3a3020; font-style: italic; }

  /* ── Buttons ── */
  .btn-gold {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    color: #c9a84c;
    border: 1px solid #7a6030;
    padding: 0.42rem 1rem;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-gold:hover {
    background: rgba(201,168,76,0.1);
    border-color: #c9a84c;
    box-shadow: 0 0 10px rgba(201,168,76,0.18);
  }
  .btn-ghost {
    background: transparent;
    border: 1px solid #2a2018;
    color: #6a5a3a;
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Cinzel', serif;
    letter-spacing: 0.06em;
  }
  .btn-ghost:hover { border-color: #9b2c2c; color: #9b2c2c; }

  .btn-pm {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #2a2018;
    color: #6a5a3a;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
    font-family: monospace;
  }
  .btn-pm.minus:hover { border-color: #7a2a2a; color: #c04040; }
  .btn-pm.plus:hover  { border-color: #2a6a2a; color: #5aaa5a; }

  /* ── Stat box ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.45rem;
  }
  @media (max-width: 500px) {
    .stat-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .stat-box {
    background: #110e0b;
    border: 1px solid #2a2018;
    text-align: center;
    padding: 0.6rem 0.3rem 0.5rem;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 0 rgba(201,168,76,0.06);
    user-select: none;
  }
  .stat-box:hover {
    border-color: #6a5030;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 0 10px rgba(201,168,76,0.12);
  }
  .stat-box.editing {
    border-color: #c9a84c;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 0 14px rgba(201,168,76,0.22);
  }
  .stat-name {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: #6a5a3a;
    display: block;
    margin-bottom: 0.2rem;
  }
  .stat-val {
    font-family: 'Cinzel', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: #c9a84c;
    line-height: 1.1;
    display: block;
  }
  .stat-mod {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    color: #5a4a2a;
    display: block;
    margin-top: 0.1rem;
  }
  .stat-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid #c9a84c;
    color: #c9a84c;
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    font-weight: 600;
    width: 100%;
    text-align: center;
    outline: none;
  }

  /* ── HP bar ── */
  .hp-bar-bg {
    height: 9px;
    background: #0a0806;
    border: 1px solid #1e1810;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.7);
    position: relative;
    overflow: hidden;
    margin-top: 0.6rem;
  }
  .hp-bar-fill {
    height: 100%;
    transition: width 0.3s ease, background 0.4s;
    position: relative;
  }
  .hp-bar-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 60%, transparent 100%);
  }

  /* ── Inventory item ── */
  .inv-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.38rem 0;
    border-bottom: 1px solid #1c1810;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 0.98rem;
    color: #b8af98;
  }
  .inv-item::before {
    content: '◈';
    font-size: 0.65rem;
    color: #4a3a20;
    flex-shrink: 0;
  }
  .inv-del {
    background: transparent;
    border: none;
    color: #3a2a2a;
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0 0.2rem;
    margin-left: auto;
    transition: color 0.15s;
    line-height: 1;
  }
  .inv-del:hover { color: #9b2c2c; }

  /* ── Rune divider ── */
  .rune-div {
    border: none;
    border-top: 1px solid #2a2018;
    position: relative;
    margin: 1rem 0;
  }
  .rune-div::before {
    content: '✦';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #181410;
    padding: 0 0.5rem;
    color: #3a2e18;
    font-size: 0.65rem;
  }

  /* ── Session entries ── */
  .sess-entry {
    border: 1px solid #221e14;
    background: #140f0c;
    overflow: hidden;
    transition: border-color 0.2s;
    box-shadow: 0 2px 0 #0a0806;
  }
  .sess-entry:hover { border-color: #2e2618; }

  .sess-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;
  }
  .sess-header:hover { background: rgba(201,168,76,0.03); }
  .sess-header.open  { background: rgba(201,168,76,0.05); border-bottom: 1px solid #2a2018; }

  .sess-num {
    font-family: 'Cinzel', serif;
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    color: #4a3a20;
    flex-shrink: 0;
    min-width: 24px;
  }
  .sess-body { padding: 0.85rem 0.9rem 1rem; }

  /* ── Quest entries ── */
  .quest-entry {
    background: #181410;
    border: 1px solid #222018;
    padding: 0.85rem 0.9rem;
    box-shadow: 0 2px 0 #0a0806;
    transition: opacity 0.2s;
  }
  .quest-entry.active    { border-left: 2px solid #c9a84c; }
  .quest-entry.completed { border-left: 2px solid #4a7a4a; opacity: 0.72; }
  .quest-entry.failed    { border-left: 2px solid #7a2a2a; opacity: 0.58; }

  /* ── Status badges ── */
  .badge {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.13rem 0.5rem;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s;
    user-select: none;
  }
  .badge.active    { border: 1px solid #7a6030; color: #c9a84c; background: rgba(201,168,76,0.08); }
  .badge.completed { border: 1px solid #3a6a3a; color: #5a9a5a; background: rgba(74,122,74,0.08); }
  .badge.failed    { border: 1px solid #6a2a2a; color: #a04040; background: rgba(122,44,44,0.08); }
  .badge:hover { filter: brightness(1.2); }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #3a3020;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    line-height: 1.8;
  }

  /* ── Row layout helpers ── */
  .row { display: flex; align-items: center; gap: 0.6rem; }
  .col { display: flex; flex-direction: column; gap: 0.45rem; }
  .flex1 { flex: 1; min-width: 0; }
  .mt05 { margin-top: 0.5rem; }
  .mt1  { margin-top: 1rem; }

  /* ── Identity grid ── */
  .id-grid {
    display: grid;
    grid-template-columns: 1fr 140px 70px;
    gap: 1rem;
    align-items: end;
  }
  @media (max-width: 480px) {
    .id-grid { grid-template-columns: 1fr; gap: 0.7rem; }
    .hj-tab  { padding: 0.5rem 0.7rem 0.55rem; font-size: 0.6rem; letter-spacing: 0.08em; }
    .hj-logo { font-size: 0.95rem; }
  }

  /* ── HP row ── */
  .hp-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .hp-display {
    font-family: 'Cinzel', serif;
    font-size: 1.4rem;
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  .hp-cur { color: #a83232; }
  .hp-sep { color: #3a2a2a; font-size: 1rem; }
  .hp-max { color: #6a4a4a; font-size: 1rem; }
  .hp-cur-input, .hp-max-input {
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Cinzel', serif;
    text-align: center;
  }
  .hp-cur-input { color: #a83232; font-size: 1.4rem; width: 50px; }
  .hp-max-input { color: #6a4a4a; font-size: 1rem;   width: 44px; }
  .hp-label {
    font-family: 'Cinzel', serif;
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    color: #4a3a20;
  }
  .hp-pct {
    font-family: 'Cinzel', serif;
    font-size: 0.58rem;
    color: #3a2a2a;
    text-align: right;
    margin-top: 0.2rem;
  }
`;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const today = () => new Date().toISOString().slice(0, 10);

const statMod = (v) => {
  const m = Math.floor((v - 10) / 2);
  return m >= 0 ? `+${m}` : String(m);
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const STATUS_CYCLE = { Active: "Completed", Completed: "Failed", Failed: "Active" };

/* ═══════════════════════════════════════════════
   DEFAULT DATA
═══════════════════════════════════════════════ */
const DEFAULT_CHAR = {
  name: "Unnamed Hero",
  charClass: "Adventurer",
  level: 1,
  stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  hp: { current: 10, max: 10 },
  inventory: ["Torch", "Rope (50 ft)"],
  notes: "",
};

/* ═══════════════════════════════════════════════
   STORAGE
═══════════════════════════════════════════════ */
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */

/* ── StatBox ── */
function StatBox({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(String(value));
  const inputRef = useRef(null);

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n)) onChange(clamp(n, 1, 30));
    setEditing(false);
  };

  return (
    <div
      className={`stat-box${editing ? " editing" : ""}`}
      onClick={() => { if (!editing) { setDraft(String(value)); setEditing(true); } }}
    >
      <span className="stat-name">{label}</span>
      {editing ? (
        <input
          ref={inputRef}
          className="stat-input"
          value={draft}
          autoFocus
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className="stat-val">{value}</span>
      )}
      <span className="stat-mod">{statMod(value)}</span>
    </div>
  );
}

/* ── HP bar color based on percentage ── */
function hpColor(pct) {
  if (pct > 60) return "linear-gradient(90deg, #6b1515, #9b2c2c, #b83232)";
  if (pct > 25) return "linear-gradient(90deg, #7a3a10, #b55a1a, #cc6820)";
  return "linear-gradient(90deg, #3a0a0a, #6b0f0f, #8b1515)";
}

/* ═══════════════════════════════════════════════
   CHARACTER SHEET
═══════════════════════════════════════════════ */
function CharacterSheet({ char, setChar }) {
  const upd   = (field, val) => setChar(c => ({ ...c, [field]: val }));
  const updSt = (stat,  val) => setChar(c => ({ ...c, stats: { ...c.stats, [stat]: val } }));

  const adjustHP = (delta) =>
    setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(c.hp.current + delta, 0, c.hp.max) } }));

  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const t = newItem.trim();
    if (!t) return;
    setChar(c => ({ ...c, inventory: [...c.inventory, t] }));
    setNewItem("");
  };

  const removeItem = (i) =>
    setChar(c => ({ ...c, inventory: c.inventory.filter((_, idx) => idx !== i) }));

  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));

  return (
    <>
      {/* ── Identity ── */}
      <div className="card">
        <div className="sect-label">Identity</div>
        <div className="id-grid">
          <div>
            <div className="sect-label" style={{ fontSize: "0.55rem", marginBottom: "0.3rem" }}>Character Name</div>
            <input
              className="iedit"
              style={{ fontFamily: "Cinzel, serif", fontSize: "1.2rem", color: "#e0d5b0", fontWeight: 600 }}
              value={char.name}
              onChange={e => upd("name", e.target.value)}
              placeholder="Enter name…"
            />
          </div>
          <div>
            <div className="sect-label" style={{ fontSize: "0.55rem", marginBottom: "0.3rem" }}>Class</div>
            <input
              className="iedit"
              style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "#c9a84c" }}
              value={char.charClass}
              onChange={e => upd("charClass", e.target.value)}
              placeholder="Class…"
            />
          </div>
          <div>
            <div className="sect-label" style={{ fontSize: "0.55rem", marginBottom: "0.3rem" }}>Level</div>
            <input
              className="iedit"
              type="number"
              style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "#c9a84c", textAlign: "center" }}
              value={char.level}
              min={1} max={20}
              onChange={e => upd("level", clamp(parseInt(e.target.value) || 1, 1, 20))}
            />
          </div>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div className="card">
        <div className="sect-label">Attributes <span className="c-dim" style={{ fontFamily: "Crimson Text, serif", textTransform: "none", letterSpacing: 0, fontSize: "0.75rem" }}>— click to edit</span></div>
        <div className="stat-grid">
          {STAT_KEYS.map(k => (
            <StatBox key={k} label={k} value={char.stats[k]} onChange={v => updSt(k, v)} />
          ))}
        </div>
      </div>

      {/* ── Vitality ── */}
      <div className="card">
        <div className="sect-label">Vitality</div>
        <div className="hp-row">
          <button className="btn-pm minus" onClick={() => adjustHP(-1)}>−</button>
          <div className="hp-display">
            <input
              className="hp-cur-input"
              type="number"
              value={char.hp.current}
              onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(parseInt(e.target.value) || 0, 0, c.hp.max) } }))}
            />
            <span className="hp-sep">/</span>
            <input
              className="hp-max-input"
              type="number"
              value={char.hp.max}
              onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, max: Math.max(1, parseInt(e.target.value) || 1) } }))}
            />
          </div>
          <button className="btn-pm plus" onClick={() => adjustHP(1)}>+</button>
          <span className="hp-label">HP</span>
        </div>
        <div className="hp-bar-bg">
          <div
            className="hp-bar-fill"
            style={{ width: `${hpPct}%`, background: hpColor(hpPct), boxShadow: `0 0 8px ${hpPct > 25 ? "rgba(168,50,50,0.45)" : "rgba(100,10,10,0.3)"}` }}
          />
        </div>
        <div className="hp-pct">{hpPct}% vitality remaining</div>
      </div>

      {/* ── Inventory ── */}
      <div className="card">
        <div className="sect-label">Inventory</div>
        {char.inventory.length === 0 ? (
          <div style={{ color: "#3a2e18", fontStyle: "italic", fontSize: "0.9rem", paddingBottom: "0.5rem" }}>
            Your pack lies empty…
          </div>
        ) : (
          <div style={{ marginBottom: "0.6rem" }}>
            {char.inventory.map((item, i) => (
              <div key={i} className="inv-item">
                <span style={{ flex: 1 }}>{item}</span>
                <button className="inv-del" onClick={() => removeItem(i)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="row mt05">
          <input
            className="g-input flex1"
            placeholder="Name an item…"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
          />
          <button className="btn-gold" onClick={addItem}>Add</button>
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="card">
        <div className="sect-label">Chronicles & Traits</div>
        <textarea
          className="g-textarea"
          rows={6}
          placeholder="Backstory, personality traits, bonds, flaws — the ink of your legend…"
          value={char.notes}
          onChange={e => upd("notes", e.target.value)}
        />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SESSION LOG
═══════════════════════════════════════════════ */
function SessionLog({ sessions, setSessions }) {
  const [openIds, setOpenIds] = useState({});

  const addSession = () => {
    const entry = {
      id:     Date.now(),
      number: sessions.length + 1,
      date:   today(),
      title:  `Session ${sessions.length + 1}`,
      notes:  "",
    };
    setSessions(s => [entry, ...s]);
    setOpenIds(o => ({ ...o, [entry.id]: true }));
  };

  const upd = (id, field, val) =>
    setSessions(s => s.map(x => x.id === id ? { ...x, [field]: val } : x));

  const del = (id) => setSessions(s => s.filter(x => x.id !== id));

  const toggle = (id) => setOpenIds(o => ({ ...o, [id]: !o[id] }));

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="c-dim cinzel" style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}>
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"} recorded
        </span>
        <button className="btn-gold" onClick={addSession}>⊕ New Session</button>
      </div>

      {sessions.length === 0 && (
        <div className="card empty-state">
          No chronicles written yet.<br />
          <span style={{ fontSize: "0.6rem" }}>Begin your first session above.</span>
        </div>
      )}

      {sessions.map(sess => {
        const open = !!openIds[sess.id];
        return (
          <div key={sess.id} className="sess-entry">
            <div className={`sess-header${open ? " open" : ""}`} onClick={() => toggle(sess.id)}>
              <span className="sess-num">#{String(sess.number).padStart(2, "0")}</span>
              <input
                className="iedit flex1"
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.88rem", color: "#c8bfa8" }}
                value={sess.title}
                onChange={e => { e.stopPropagation(); upd(sess.id, "title", e.target.value); }}
                onClick={e => e.stopPropagation()}
              />
              <input
                type="date"
                style={{ background: "transparent", border: "none", color: "#5a4a2a", fontFamily: "inherit", fontSize: "0.72rem", outline: "none", flexShrink: 0 }}
                value={sess.date}
                onChange={e => { e.stopPropagation(); upd(sess.id, "date", e.target.value); }}
                onClick={e => e.stopPropagation()}
              />
              <span style={{ color: open ? "#c9a84c" : "#3a3020", fontSize: "0.65rem", flexShrink: 0 }}>
                {open ? "▲" : "▼"}
              </span>
            </div>

            {open && (
              <div className="sess-body">
                <textarea
                  className="g-textarea"
                  rows={5}
                  placeholder="What transpired this session? Record the deeds, discoveries, and disasters of your company…"
                  value={sess.notes}
                  onChange={e => upd(sess.id, "notes", e.target.value)}
                />
                <div className="row mt05" style={{ justifyContent: "flex-end" }}>
                  <button className="btn-ghost" onClick={() => del(sess.id)}>Expunge Record</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════
   QUEST TRACKER
═══════════════════════════════════════════════ */
function QuestTracker({ quests, setQuests }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const addQuest = () => {
    const n = name.trim();
    if (!n) return;
    setQuests(q => [...q, { id: Date.now(), name: n, description: desc.trim(), status: "Active" }]);
    setName(""); setDesc("");
  };

  const cycle  = (id) => setQuests(q => q.map(x => x.id === id ? { ...x, status: STATUS_CYCLE[x.status] } : x));
  const del    = (id) => setQuests(q => q.filter(x => x.id !== id));
  const upd    = (id, field, val) => setQuests(q => q.map(x => x.id === id ? { ...x, [field]: val } : x));

  const groups = ["Active", "Completed", "Failed"];

  return (
    <>
      {/* ── Add quest ── */}
      <div className="card">
        <div className="sect-label">Issue New Mandate</div>
        <div className="col">
          <input
            className="g-input"
            placeholder="Quest name…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addQuest()}
          />
          <input
            className="g-input"
            placeholder="Brief description…"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addQuest()}
          />
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn-gold" onClick={addQuest}>⊕ Add Quest</button>
          </div>
        </div>
      </div>

      {quests.length === 0 && (
        <div className="card empty-state">
          No mandates issued.<br />
          <span style={{ fontSize: "0.6rem" }}>The board awaits your first quest.</span>
        </div>
      )}

      {groups.map(status => {
        const filtered = quests.filter(q => q.status === status);
        if (filtered.length === 0) return null;
        const labelColor = status === "Active" ? "#c9a84c" : status === "Completed" ? "#5a9a5a" : "#9b2c2c";
        return (
          <div key={status} style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            <div className="sect-label" style={{ color: labelColor }}>
              {status} <span style={{ color: "#3a3020" }}>({filtered.length})</span>
            </div>
            {filtered.map(quest => (
              <div key={quest.id} className={`quest-entry ${status.toLowerCase()}`}>
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <div className="flex1">
                    <div className="row" style={{ marginBottom: "0.3rem", flexWrap: "wrap", gap: "0.4rem" }}>
                      <input
                        className="iedit flex1"
                        style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", color: "#d4c9a8", fontWeight: 600 }}
                        value={quest.name}
                        onChange={e => upd(quest.id, "name", e.target.value)}
                        placeholder="Quest name…"
                      />
                      <span
                        className={`badge ${status.toLowerCase()}`}
                        onClick={() => cycle(quest.id)}
                        title="Click to cycle status"
                      >
                        {status}
                      </span>
                    </div>
                    <input
                      className="iedit"
                      style={{ fontSize: "0.9rem", color: "#7a6a4a", fontStyle: "italic" }}
                      value={quest.description}
                      onChange={e => upd(quest.id, "description", e.target.value)}
                      placeholder="No description…"
                    />
                  </div>
                  <button
                    onClick={() => del(quest.id)}
                    style={{ background: "transparent", border: "none", color: "#3a2a2a", cursor: "pointer", fontSize: "0.8rem", padding: "0.1rem 0.2rem", marginLeft: "0.4rem", transition: "color 0.15s", flexShrink: 0 }}
                    onMouseEnter={e => e.target.style.color = "#9b2c2c"}
                    onMouseLeave={e => e.target.style.color = "#3a2a2a"}
                    title="Remove"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function HeroJournal() {
  const [tab,      setTab]      = useState("character");
  const [char,     setChar]     = useState(() => load("hj_char",     DEFAULT_CHAR));
  const [sessions, setSessions] = useState(() => load("hj_sessions", []));
  const [quests,   setQuests]   = useState(() => load("hj_quests",   []));

  // Persist on every change
  useEffect(() => { save("hj_char",     char);     }, [char]);
  useEffect(() => { save("hj_sessions", sessions); }, [sessions]);
  useEffect(() => { save("hj_quests",   quests);   }, [quests]);

  const TABS = [
    { id: "character", label: "Character"     },
    { id: "sessions",  label: "Session Log"   },
    { id: "quests",    label: "Quest Tracker" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="hj-root">

        {/* Header */}
        <header className="hj-header">
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div className="hj-logo">
              <span className="hj-logo-glyph">⚔</span>
              Hero Journal
            </div>
            <nav className="hj-tabs">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`hj-tab${tab === t.id ? " active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="hj-content">
          {tab === "character" && (
            <CharacterSheet char={char} setChar={setChar} />
          )}
          {tab === "sessions" && (
            <SessionLog sessions={sessions} setSessions={setSessions} />
          )}
          {tab === "quests" && (
            <QuestTracker quests={quests} setQuests={setQuests} />
          )}
        </main>

      </div>
    </>
  );
}