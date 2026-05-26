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
    color: #ddd5bb;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1.05rem;
    line-height: 1.55;
    padding-bottom: 72px; /* space for bottom nav */
  }
  .hj-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 999;
    opacity: 0.045;
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

  /* ── Colors — increased contrast ── */
  .c-gold    { color: #e2b94e; }
  .c-dim     { color: #9a8a66; }
  .c-muted   { color: #b8a880; }
  .c-text    { color: #ddd5bb; }
  .c-crimson { color: #c84040; }
  .c-jade    { color: #6ab46a; }

  /* ── TOP Header ── */
  .hj-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: linear-gradient(180deg, #1c1810 0%, #141008 100%);
    border-bottom: 1px solid #352e1e;
    box-shadow: 0 4px 32px rgba(0,0,0,0.8);
    padding: 0.9rem 1.25rem;
  }
  .hj-logo {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #e2b94e;
    letter-spacing: 0.12em;
    text-shadow: 0 0 22px rgba(226,185,78,0.4), 0 0 60px rgba(226,185,78,0.12);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hj-logo-glyph {
    font-size: 1rem;
    opacity: 0.85;
  }

  /* ── BOTTOM NAV ── */
  .hj-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: linear-gradient(0deg, #0d0b08 0%, #161210 100%);
    border-top: 1px solid #302818;
    box-shadow: 0 -4px 32px rgba(0,0,0,0.8);
    display: flex;
    align-items: stretch;
    height: 68px;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .hj-nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.18s;
    padding: 0.4rem 0.2rem;
    position: relative;
  }
  .hj-nav-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 2px;
    background: #e2b94e;
    transform: scaleX(0);
    transition: transform 0.2s;
    border-radius: 0 0 2px 2px;
  }
  .hj-nav-btn.active::before { transform: scaleX(1); }
  .hj-nav-icon {
    font-size: 1.3rem;
    line-height: 1;
    filter: grayscale(1) brightness(0.5);
    transition: filter 0.18s;
  }
  .hj-nav-btn.active .hj-nav-icon {
    filter: grayscale(0) brightness(1);
  }
  .hj-nav-label {
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5a4a2a;
    transition: color 0.18s;
  }
  .hj-nav-btn.active .hj-nav-label { color: #e2b94e; }
  .hj-nav-btn:hover:not(.active) .hj-nav-icon { filter: grayscale(0.4) brightness(0.75); }
  .hj-nav-btn:hover:not(.active) .hj-nav-label { color: #8a7040; }

  /* ── Layout container ── */
  .hj-content {
    max-width: 780px;
    margin: 0 auto;
    padding: 1.5rem 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  /* ── Parchment card ── */
  .card {
    background: #1c1810;
    border: 1px solid #352e1e;
    box-shadow: 0 3px 0 #0a0806, inset 0 1px 0 rgba(226,185,78,0.05);
    padding: 1.25rem;
    position: relative;
  }
  .card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(226,185,78,0.03) 0%, transparent 55%);
    pointer-events: none;
  }

  /* ── Section label — higher contrast ── */
  .sect-label {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #8a7848;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  .sect-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #352e1e, transparent);
  }

  /* ── Inline editable input — more visible ── */
  .iedit {
    background: transparent;
    border: none;
    border-bottom: 1px dashed #4a3e24;
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
  .iedit:focus { border-bottom-color: #e2b94e; }
  .iedit::placeholder { color: #4a3e24; }

  /* ── Gothic input / textarea — improved contrast ── */
  .g-input {
    background: #130f0c;
    border: 1px solid #352e1e;
    color: #ddd5bb;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1.05rem;
    padding: 0.5rem 0.85rem;
    outline: none;
    width: 100%;
    transition: border-color 0.15s;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.45);
  }
  .g-input:focus { border-color: #8a6830; }
  .g-input::placeholder { color: #4a3e24; font-style: italic; }

  .g-textarea {
    background: #130f0c;
    border: 1px solid #352e1e;
    color: #ddd5bb;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1.05rem;
    padding: 0.75rem 0.85rem;
    outline: none;
    width: 100%;
    resize: vertical;
    transition: border-color 0.15s;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.45);
    line-height: 1.65;
  }
  .g-textarea:focus { border-color: #8a6830; }
  .g-textarea::placeholder { color: #4a3e24; font-style: italic; }

  /* ── Buttons — brighter, more readable ── */
  .btn-gold {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    color: #e2b94e;
    border: 1px solid #8a6830;
    padding: 0.48rem 1.1rem;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-gold:hover {
    background: rgba(226,185,78,0.12);
    border-color: #e2b94e;
    box-shadow: 0 0 14px rgba(226,185,78,0.22);
  }
  .btn-ghost {
    background: transparent;
    border: 1px solid #352e1e;
    color: #7a6840;
    font-size: 0.75rem;
    padding: 0.28rem 0.65rem;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Cinzel', serif;
    letter-spacing: 0.06em;
  }
  .btn-ghost:hover { border-color: #9b2c2c; color: #c04040; }

  .btn-pm {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #352e1e;
    color: #7a6840;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
    font-family: monospace;
  }
  .btn-pm.minus:hover { border-color: #7a2a2a; color: #e04040; }
  .btn-pm.plus:hover  { border-color: #2a6a2a; color: #5acc5a; }

  /* ── Stat box — higher contrast values ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
  }
  @media (max-width: 500px) {
    .stat-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .stat-box {
    background: #130f0c;
    border: 1px solid #352e1e;
    text-align: center;
    padding: 0.65rem 0.3rem 0.55rem;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 0 rgba(226,185,78,0.06);
    user-select: none;
  }
  .stat-box:hover {
    border-color: #7a6030;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 0 12px rgba(226,185,78,0.14);
  }
  .stat-box.editing {
    border-color: #e2b94e;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 0 16px rgba(226,185,78,0.26);
  }
  .stat-name {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    color: #8a7848;
    display: block;
    margin-bottom: 0.25rem;
  }
  .stat-val {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #e2b94e;
    line-height: 1.1;
    display: block;
  }
  .stat-mod {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    color: #7a6640;
    display: block;
    margin-top: 0.15rem;
  }
  .stat-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid #e2b94e;
    color: #e2b94e;
    font-family: 'Cinzel', serif;
    font-size: 1.3rem;
    font-weight: 700;
    width: 100%;
    text-align: center;
    outline: none;
  }

  /* ── HP bar ── */
  .hp-bar-bg {
    height: 10px;
    background: #0a0806;
    border: 1px solid #231e12;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.7);
    position: relative;
    overflow: hidden;
    margin-top: 0.7rem;
  }
  .hp-bar-fill {
    height: 100%;
    transition: width 0.35s ease, background 0.4s;
    position: relative;
  }
  .hp-bar-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 60%, transparent 100%);
  }

  /* ── Inventory item ── */
  .inv-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0;
    border-bottom: 1px solid #231e12;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 1.05rem;
    color: #ccc4aa;
  }
  .inv-item::before {
    content: '◈';
    font-size: 0.65rem;
    color: #5a4a28;
    flex-shrink: 0;
  }
  .inv-del {
    background: transparent;
    border: none;
    color: #4a3a2a;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0 0.25rem;
    margin-left: auto;
    transition: color 0.15s;
    line-height: 1;
  }
  .inv-del:hover { color: #c04040; }

  /* ── Rune divider ── */
  .rune-div {
    border: none;
    border-top: 1px solid #2e2618;
    position: relative;
    margin: 1rem 0;
  }
  .rune-div::before {
    content: '✦';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #1c1810;
    padding: 0 0.5rem;
    color: #4a3e20;
    font-size: 0.65rem;
  }

  /* ── Session entries ── */
  .sess-entry {
    border: 1px solid #2a2416;
    background: #171208;
    overflow: hidden;
    transition: border-color 0.2s;
    box-shadow: 0 2px 0 #0a0806;
  }
  .sess-entry:hover { border-color: #352e1e; }

  .sess-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;
  }
  .sess-header:hover { background: rgba(226,185,78,0.04); }
  .sess-header.open  { background: rgba(226,185,78,0.06); border-bottom: 1px solid #2e2618; }

  .sess-num {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    color: #5a4a28;
    flex-shrink: 0;
    min-width: 24px;
  }
  .sess-body { padding: 0.9rem 1rem 1.1rem; }

  /* ── Quest entries ── */
  .quest-entry {
    background: #1c1810;
    border: 1px solid #2a2416;
    padding: 0.9rem 1rem;
    box-shadow: 0 2px 0 #0a0806;
    transition: opacity 0.2s;
  }
  .quest-entry.active    { border-left: 2px solid #e2b94e; }
  .quest-entry.completed { border-left: 2px solid #5a9a5a; opacity: 0.75; }
  .quest-entry.failed    { border-left: 2px solid #8a2a2a; opacity: 0.6; }

  /* ── Status badges — more contrast ── */
  .badge {
    font-family: 'Cinzel', serif;
    font-size: 0.57rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.15rem 0.55rem;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s;
    user-select: none;
  }
  .badge.active    { border: 1px solid #8a6830; color: #e2b94e; background: rgba(226,185,78,0.1); }
  .badge.completed { border: 1px solid #3a6a3a; color: #6acc6a; background: rgba(74,122,74,0.1); }
  .badge.failed    { border: 1px solid #6a2a2a; color: #cc4444; background: rgba(122,44,44,0.1); }
  .badge:hover { filter: brightness(1.25); }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 2.5rem;
    color: #4a3e24;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    line-height: 1.9;
  }

  /* ── Row layout helpers ── */
  .row { display: flex; align-items: center; gap: 0.6rem; }
  .col { display: flex; flex-direction: column; gap: 0.5rem; }
  .flex1 { flex: 1; min-width: 0; }
  .mt05 { margin-top: 0.5rem; }
  .mt1  { margin-top: 1rem; }

  /* ── Identity grid ── */
  .id-grid {
    display: grid;
    grid-template-columns: 1fr 150px 75px;
    gap: 1.1rem;
    align-items: end;
  }
  @media (max-width: 480px) {
    .id-grid { grid-template-columns: 1fr; gap: 0.8rem; }
    .hj-logo { font-size: 1rem; }
  }

  /* ── HP row ── */
  .hp-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .hp-display {
    font-family: 'Cinzel', serif;
    font-size: 1.6rem;
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  .hp-cur { color: #cc3a3a; }
  .hp-sep { color: #4a3a2a; font-size: 1.1rem; }
  .hp-max { color: #8a5a5a; font-size: 1.1rem; }
  .hp-cur-input, .hp-max-input {
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Cinzel', serif;
    text-align: center;
  }
  .hp-cur-input { color: #cc3a3a; font-size: 1.6rem; width: 56px; }
  .hp-max-input { color: #8a5a5a; font-size: 1.1rem; width: 48px; }
  .hp-label {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    color: #5a4a28;
  }
  .hp-pct {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    color: #4a3a22;
    text-align: right;
    margin-top: 0.25rem;
  }

  /* ── Page title ── */
  .page-title {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #6a5830;
    padding: 0.3rem 0 0.1rem;
    border-bottom: 1px solid #2a2416;
    margin-bottom: 0.2rem;
  }
`;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const today = () => new Date().toISOString().slice(0, 10);
const statMod = (v) => { const m = Math.floor((v - 10) / 2); return m >= 0 ? `+${m}` : String(m); };
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
function StatBox({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
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

function hpColor(pct) {
  if (pct > 60) return "linear-gradient(90deg, #6b1515, #9b2c2c, #cc3a3a)";
  if (pct > 25) return "linear-gradient(90deg, #7a3a10, #c06020, #d87030)";
  return "linear-gradient(90deg, #3a0a0a, #6b0f0f, #961a1a)";
}

/* ═══════════════════════════════════════════════
   CHARACTER SHEET
═══════════════════════════════════════════════ */
function CharacterSheet({ char, setChar }) {
  const upd   = (field, val) => setChar(c => ({ ...c, [field]: val }));
  const updSt = (stat,  val) => setChar(c => ({ ...c, stats: { ...c.stats, [stat]: val } }));

  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));

  return (
    <>
      <div className="card">
        <div className="sect-label">Identity</div>
        <div className="id-grid">
          <div>
            <div className="sect-label" style={{ fontSize: "0.56rem", marginBottom: "0.35rem" }}>Character Name</div>
            <input
              className="iedit"
              style={{ fontFamily: "Cinzel, serif", fontSize: "1.25rem", color: "#ede5c5", fontWeight: 700 }}
              value={char.name}
              onChange={e => upd("name", e.target.value)}
              placeholder="Enter name…"
            />
          </div>
          <div>
            <div className="sect-label" style={{ fontSize: "0.56rem", marginBottom: "0.35rem" }}>Class</div>
            <input
              className="iedit"
              style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "#e2b94e" }}
              value={char.charClass}
              onChange={e => upd("charClass", e.target.value)}
              placeholder="Class…"
            />
          </div>
          <div>
            <div className="sect-label" style={{ fontSize: "0.56rem", marginBottom: "0.35rem" }}>Level</div>
            <input
              className="iedit"
              type="number"
              style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "#e2b94e", textAlign: "center" }}
              value={char.level}
              min={1} max={20}
              onChange={e => upd("level", clamp(parseInt(e.target.value) || 1, 1, 20))}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="sect-label">
          Attributes
          <span style={{ fontFamily: "Crimson Text, serif", textTransform: "none", letterSpacing: 0, fontSize: "0.85rem", color: "#6a5830" }}>— tap to edit</span>
        </div>
        <div className="stat-grid">
          {STAT_KEYS.map(k => (
            <StatBox key={k} label={k} value={char.stats[k]} onChange={v => updSt(k, v)} />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="sect-label">Vitality</div>
        <div className="hp-row">
          <button className="btn-pm minus" onClick={() => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(c.hp.current - 1, 0, c.hp.max) } }))}>−</button>
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
          <button className="btn-pm plus" onClick={() => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(c.hp.current + 1, 0, c.hp.max) } }))}>+</button>
          <span className="hp-label">HP</span>
        </div>
        <div className="hp-bar-bg">
          <div
            className="hp-bar-fill"
            style={{ width: `${hpPct}%`, background: hpColor(hpPct), boxShadow: `0 0 10px ${hpPct > 25 ? "rgba(200,60,60,0.5)" : "rgba(120,15,15,0.4)"}` }}
          />
        </div>
        <div className="hp-pct">{hpPct}% vitality remaining</div>
      </div>

      <div className="card">
        <div className="sect-label">Personal thoughts</div>
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
   INVENTORY (osobna zakładka)
═══════════════════════════════════════════════ */
function Inventory({ inventory, setInventory }) {
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");

  const addItem = () => {
    const t = newItem.trim();
    if (!t) return;
    setInventory(inv => [...inv, { id: Date.now(), name: t, qty: newQty.trim() || "1", note: "" }]);
    setNewItem(""); setNewQty("");
  };

  const removeItem = (id) => setInventory(inv => inv.filter(x => x.id !== id));

  const updItem = (id, field, val) =>
    setInventory(inv => inv.map(x => x.id === id ? { ...x, [field]: val } : x));

  return (
    <>
      <div className="card">
        <div className="sect-label">Add Item</div>
        <div className="row">
          <input
            className="g-input flex1"
            placeholder="Item name…"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
          />
          <input
            className="g-input"
            style={{ width: 64 }}
            placeholder="Qty"
            value={newQty}
            onChange={e => setNewQty(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
          />
          <button className="btn-gold" onClick={addItem}>Add</button>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="card empty-state">
          Your pack lies empty…<br />
          <span style={{ fontSize: "0.62rem" }}>Add your first item above.</span>
        </div>
      ) : (
        <div className="card">
          <div className="sect-label">Carried Items ({inventory.length})</div>
          {inventory.map((item) => (
            <div key={item.id} style={{ borderBottom: "1px solid #231e12", padding: "0.55rem 0" }}>
              <div className="row" style={{ marginBottom: "0.2rem" }}>
                <span style={{ color: "#4a3a20", fontSize: "0.7rem" }}>◈</span>
                <input
                  className="iedit flex1"
                  style={{ fontSize: "1.05rem", color: "#ddd5bb", fontWeight: 600 }}
                  value={item.name}
                  onChange={e => updItem(item.id, "name", e.target.value)}
                />
                <input
                  className="iedit"
                  style={{ width: 48, textAlign: "center", fontSize: "0.9rem", color: "#8a7848" }}
                  value={item.qty}
                  onChange={e => updItem(item.id, "qty", e.target.value)}
                  placeholder="qty"
                />
                <button className="inv-del" onClick={() => removeItem(item.id)}>✕</button>
              </div>
              <input
                className="iedit"
                style={{ fontSize: "0.9rem", color: "#7a6a48", fontStyle: "italic", paddingLeft: "1.1rem" }}
                value={item.note}
                onChange={e => updItem(item.id, "note", e.target.value)}
                placeholder="Note…"
              />
            </div>
          ))}
        </div>
      )}
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

  const upd    = (id, field, val) => setSessions(s => s.map(x => x.id === id ? { ...x, [field]: val } : x));
  const del    = (id) => setSessions(s => s.filter(x => x.id !== id));
  const toggle = (id) => setOpenIds(o => ({ ...o, [id]: !o[id] }));

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#6a5830" }}>
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"} recorded
        </span>
        <button className="btn-gold" onClick={addSession}>⊕ New Session</button>
      </div>

      {sessions.length === 0 && (
        <div className="card empty-state">
          No chronicles written yet.<br />
          <span style={{ fontSize: "0.62rem" }}>Begin your first session above.</span>
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
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.92rem", color: "#ddd5bb" }}
                value={sess.title}
                onChange={e => { e.stopPropagation(); upd(sess.id, "title", e.target.value); }}
                onClick={e => e.stopPropagation()}
              />
              <input
                type="date"
                style={{ background: "transparent", border: "none", color: "#6a5830", fontFamily: "inherit", fontSize: "0.75rem", outline: "none", flexShrink: 0 }}
                value={sess.date}
                onChange={e => { e.stopPropagation(); upd(sess.id, "date", e.target.value); }}
                onClick={e => e.stopPropagation()}
              />
              <span style={{ color: open ? "#e2b94e" : "#3a3020", fontSize: "0.65rem", flexShrink: 0 }}>
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

  const cycle = (id) => setQuests(q => q.map(x => x.id === id ? { ...x, status: STATUS_CYCLE[x.status] } : x));
  const del   = (id) => setQuests(q => q.filter(x => x.id !== id));
  const upd   = (id, field, val) => setQuests(q => q.map(x => x.id === id ? { ...x, [field]: val } : x));

  const groups = ["Active", "Completed", "Failed"];

  return (
    <>
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
          <span style={{ fontSize: "0.62rem" }}>The board awaits your first quest.</span>
        </div>
      )}

      {groups.map(status => {
        const filtered = quests.filter(q => q.status === status);
        if (filtered.length === 0) return null;
        const labelColor = status === "Active" ? "#e2b94e" : status === "Completed" ? "#6acc6a" : "#cc4444";
        return (
          <div key={status} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="sect-label" style={{ color: labelColor }}>
              {status} <span style={{ color: "#3a3020" }}>({filtered.length})</span>
            </div>
            {filtered.map(quest => (
              <div key={quest.id} className={`quest-entry ${status.toLowerCase()}`}>
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <div className="flex1">
                    <div className="row" style={{ marginBottom: "0.35rem", flexWrap: "wrap", gap: "0.4rem" }}>
                      <input
                        className="iedit flex1"
                        style={{ fontFamily: "Cinzel, serif", fontSize: "0.95rem", color: "#e0d6b4", fontWeight: 700 }}
                        value={quest.name}
                        onChange={e => upd(quest.id, "name", e.target.value)}
                        placeholder="Quest name…"
                      />
                      <span
                        className={`badge ${status.toLowerCase()}`}
                        onClick={() => cycle(quest.id)}
                        title="Tap to cycle status"
                      >{status}</span>
                    </div>
                    <input
                      className="iedit"
                      style={{ fontSize: "0.95rem", color: "#8a7848", fontStyle: "italic" }}
                      value={quest.description}
                      onChange={e => upd(quest.id, "description", e.target.value)}
                      placeholder="No description…"
                    />
                  </div>
                  <button
                    onClick={() => del(quest.id)}
                    style={{ background: "transparent", border: "none", color: "#4a3a2a", cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.25rem", marginLeft: "0.4rem", transition: "color 0.15s", flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#c04040"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4a3a2a"}
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
   NAVIGATION CONFIG
═══════════════════════════════════════════════ */
const TABS = [
  { id: "character", label: "Character", icon: "⚔️" },
  { id: "inventory", label: "Inventory",  icon: "🎒" },
  { id: "sessions",  label: "Sessions",   icon: "📜" },
  { id: "quests",    label: "Quests",     icon: "🗺️" },
];

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function HeroJournal() {
  const [tab,       setTab]       = useState("character");
  const [char,      setChar]      = useState(() => load("hj_char",      DEFAULT_CHAR));
  const [inventory, setInventory] = useState(() => load("hj_inventory", []));
  const [sessions,  setSessions]  = useState(() => load("hj_sessions",  []));
  const [quests,    setQuests]    = useState(() => load("hj_quests",    []));

  useEffect(() => { save("hj_char",      char);      }, [char]);
  useEffect(() => { save("hj_inventory", inventory); }, [inventory]);
  useEffect(() => { save("hj_sessions",  sessions);  }, [sessions]);
  useEffect(() => { save("hj_quests",    quests);    }, [quests]);

  return (
    <>
      <style>{CSS}</style>
      <div className="hj-root">

        {/* Top header — logo only */}
        <header className="hj-header">
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div className="hj-logo">
              <span className="hj-logo-glyph">⚔</span>
              Hero Journal
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="hj-content">
          {tab === "character" && <CharacterSheet char={char} setChar={setChar} />}
          {tab === "inventory" && <Inventory inventory={inventory} setInventory={setInventory} />}
          {tab === "sessions"  && <SessionLog sessions={sessions} setSessions={setSessions} />}
          {tab === "quests"    && <QuestTracker quests={quests} setQuests={setQuests} />}
        </main>

        {/* Bottom navigation */}
        <nav className="hj-bottom-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`hj-nav-btn${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="hj-nav-icon">{t.icon}</span>
              <span className="hj-nav-label">{t.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </>
  );
}