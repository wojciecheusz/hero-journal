import { useState, useEffect, useRef, useCallback } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100vh; background: #0f0d0b; }

  .hj-root { position: relative; min-height: 100vh; background: #0f0d0b; color: #ddd5bb; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; line-height: 1.55; padding-bottom: 80px; }
  .hj-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: 0.045; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); background-repeat: repeat; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0a0806; }
  ::-webkit-scrollbar-thumb { background: #3a3020; }
  ::-webkit-scrollbar-thumb:hover { background: #5a4a30; }

  .hj-header { position: sticky; top: 0; z-index: 50; background: linear-gradient(180deg,#1c1810 0%,#141008 100%); border-bottom: 1px solid #352e1e; box-shadow: 0 4px 32px rgba(0,0,0,0.8); padding: 0.9rem 1.25rem; }
  .hj-logo { font-family: 'Cinzel Decorative', serif; font-size: 1.2rem; font-weight: 700; color: #e2b94e; letter-spacing: 0.12em; text-shadow: 0 0 22px rgba(226,185,78,0.4),0 0 60px rgba(226,185,78,0.12); display: flex; align-items: center; gap: 0.5rem; }

  .hj-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: linear-gradient(0deg,#0d0b08 0%,#161210 100%); border-top: 1px solid #302818; box-shadow: 0 -4px 32px rgba(0,0,0,0.8); display: flex; align-items: stretch; height: 68px; padding-bottom: env(safe-area-inset-bottom,0px); }
  .hj-nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.18rem; background: transparent; border: none; cursor: pointer; transition: all 0.18s; padding: 0.35rem 0.1rem; position: relative; }
  .hj-nav-btn::before { content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 2px; background: #e2b94e; transform: scaleX(0); transition: transform 0.2s; border-radius: 0 0 2px 2px; }
  .hj-nav-btn.active::before { transform: scaleX(1); }
  .hj-nav-icon { font-size: 1.25rem; line-height: 1; filter: grayscale(1) brightness(0.45); transition: filter 0.18s; }
  .hj-nav-btn.active .hj-nav-icon { filter: grayscale(0) brightness(1); }
  .hj-nav-label { font-family: 'Cinzel', serif; font-size: 0.46rem; letter-spacing: 0.08em; text-transform: uppercase; color: #4a3a20; transition: color 0.18s; }
  .hj-nav-btn.active .hj-nav-label { color: #e2b94e; }
  .hj-nav-btn:hover:not(.active) .hj-nav-icon { filter: grayscale(0.4) brightness(0.7); }
  .hj-nav-btn:hover:not(.active) .hj-nav-label { color: #7a6030; }

  .hj-content { max-width: 780px; margin: 0 auto; padding: 1.4rem 1rem 2rem; display: flex; flex-direction: column; gap: 1rem; }

  .card { background: #1c1810; border: 1px solid #352e1e; box-shadow: 0 3px 0 #0a0806, inset 0 1px 0 rgba(226,185,78,0.05); padding: 1.25rem; position: relative; }
  .card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(226,185,78,0.03) 0%,transparent 55%); pointer-events: none; }
  .card.pinned { border-color: #7a6030; box-shadow: 0 3px 0 #0a0806,0 0 0 1px rgba(226,185,78,0.12),inset 0 1px 0 rgba(226,185,78,0.08); }
  .card.pinned::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,#e2b94e,transparent); pointer-events: none; }

  .sect-label { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #8a7848; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
  .sect-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg,#352e1e,transparent); }

  .iedit { background: transparent; border: none; border-bottom: 1px dashed #4a3e24; color: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; font-style: inherit; outline: none; width: 100%; transition: border-color 0.15s; line-height: inherit; padding: 0; }
  .iedit:focus { border-bottom-color: #e2b94e; }
  .iedit::placeholder { color: #4a3e24; }

  .g-input { background: #130f0c; border: 1px solid #352e1e; color: #ddd5bb; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; padding: 0.5rem 0.85rem; outline: none; width: 100%; transition: border-color 0.15s; box-shadow: inset 0 2px 6px rgba(0,0,0,0.45); }
  .g-input:focus { border-color: #8a6830; }
  .g-input::placeholder { color: #4a3e24; font-style: italic; }

  .g-textarea { background: #130f0c; border: 1px solid #352e1e; color: #ddd5bb; font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; padding: 0.75rem 0.85rem; outline: none; width: 100%; resize: vertical; transition: border-color 0.15s; box-shadow: inset 0 2px 6px rgba(0,0,0,0.45); line-height: 1.65; }
  .g-textarea:focus { border-color: #8a6830; }
  .g-textarea::placeholder { color: #4a3e24; font-style: italic; }

  .btn-gold { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; background: transparent; color: #e2b94e; border: 1px solid #8a6830; padding: 0.48rem 1.1rem; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-gold:hover { background: rgba(226,185,78,0.12); border-color: #e2b94e; box-shadow: 0 0 14px rgba(226,185,78,0.22); }
  .btn-ghost { background: transparent; border: 1px solid #352e1e; color: #7a6840; font-size: 0.72rem; padding: 0.28rem 0.65rem; cursor: pointer; transition: all 0.15s; font-family: 'Cinzel', serif; letter-spacing: 0.06em; }
  .btn-ghost:hover { border-color: #9b2c2c; color: #c04040; }
  .btn-pm { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1px solid #352e1e; color: #7a6840; font-size: 1.2rem; cursor: pointer; transition: all 0.15s; flex-shrink: 0; font-family: monospace; }
  .btn-pm.minus:hover { border-color: #7a2a2a; color: #e04040; }
  .btn-pm.plus:hover  { border-color: #2a6a2a; color: #5acc5a; }

  .tags-row { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin-top: 0.55rem; }
  .tag { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.18rem 0.55rem; cursor: default; display: inline-flex; align-items: center; gap: 0.3rem; white-space: nowrap; }
  .tag-default { background: rgba(226,185,78,0.08); border: 1px solid #4a3e20; color: #9a8444; }
  .tag-remove { background: transparent; border: none; color: #5a4a28; cursor: pointer; font-size: 0.6rem; padding: 0; line-height: 1; transition: color 0.15s; }
  .tag-remove:hover { color: #c04040; }
  .tag-input { background: transparent; border: none; border-bottom: 1px dashed #4a3e24; color: #9a8444; font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; outline: none; width: 80px; padding: 0.1rem 0; transition: border-color 0.15s; }
  .tag-input:focus { border-bottom-color: #e2b94e; }
  .tag-input::placeholder { color: #3a3018; font-style: normal; }
  .tag-add-btn { background: transparent; border: 1px dashed #3a3018; color: #5a4a28; font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.08em; padding: 0.18rem 0.5rem; cursor: pointer; transition: all 0.15s; }
  .tag-add-btn:hover { border-color: #7a6030; color: #8a7040; }

  .filter-bar { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; margin-bottom: 0.8rem; }
  .filter-tag { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border: 1px solid #352e1e; color: #6a5830; cursor: pointer; transition: all 0.15s; background: transparent; }
  .filter-tag.active-filter { background: rgba(226,185,78,0.1); border-color: #8a6830; color: #e2b94e; }
  .filter-tag:hover:not(.active-filter) { border-color: #5a4a28; color: #9a8444; }

  .entity-header { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.5rem; }
  .pin-btn { background: transparent; border: none; cursor: pointer; font-size: 0.9rem; padding: 0.1rem; opacity: 0.35; transition: opacity 0.15s,transform 0.15s; flex-shrink: 0; line-height: 1; }
  .pin-btn.pinned { opacity: 1; }
  .pin-btn:hover { opacity: 0.7; transform: scale(1.15); }
  .entity-toggle { background: transparent; border: none; color: #4a3e20; cursor: pointer; font-size: 0.6rem; padding: 0; transition: color 0.15s; flex-shrink: 0; font-family: 'Cinzel', serif; }
  .entity-toggle:hover { color: #8a7040; }

  .stat-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.5rem; }
  @media (max-width:500px) { .stat-grid { grid-template-columns: repeat(3,1fr); } }
  .stat-box { background: #130f0c; border: 1px solid #352e1e; text-align: center; padding: 0.65rem 0.3rem 0.55rem; cursor: pointer; transition: all 0.15s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); user-select: none; }
  .stat-box:hover { border-color: #7a6030; }
  .stat-box.editing { border-color: #e2b94e; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5),0 0 16px rgba(226,185,78,0.26); }
  .stat-name { font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.15em; color: #8a7848; display: block; margin-bottom: 0.25rem; }
  .stat-val  { font-family: 'Cinzel', serif; font-size: 1.5rem; font-weight: 700; color: #e2b94e; line-height: 1.1; display: block; }
  .stat-mod  { font-family: 'Cinzel', serif; font-size: 0.62rem; color: #7a6640; display: block; margin-top: 0.15rem; }
  .stat-input { background: transparent; border: none; border-bottom: 1px solid #e2b94e; color: #e2b94e; font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; width: 100%; text-align: center; outline: none; }

  .hp-bar-bg { height: 10px; background: #0a0806; border: 1px solid #231e12; box-shadow: inset 0 2px 5px rgba(0,0,0,0.7); position: relative; overflow: hidden; margin-top: 0.7rem; }
  .hp-bar-fill { height: 100%; transition: width 0.35s ease,background 0.4s; position: relative; }
  .hp-bar-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 60%,transparent 100%); }
  .hp-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .hp-display { font-family: 'Cinzel', serif; font-size: 1.6rem; display: flex; align-items: baseline; gap: 0.25rem; }
  .hp-cur { color: #cc3a3a; } .hp-sep { color: #4a3a2a; font-size: 1.1rem; } .hp-max { color: #8a5a5a; font-size: 1.1rem; }
  .hp-cur-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; text-align: center; color: #cc3a3a; font-size: 1.6rem; width: 56px; }
  .hp-max-input { background: transparent; border: none; outline: none; font-family: 'Cinzel', serif; text-align: center; color: #8a5a5a; font-size: 1.1rem; width: 48px; }
  .hp-label { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.18em; color: #5a4a28; }
  .hp-pct { font-family: 'Cinzel', serif; font-size: 0.6rem; color: #4a3a22; text-align: right; margin-top: 0.25rem; }

  .inv-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0; border-bottom: 1px solid #231e12; font-size: 1.05rem; color: #ccc4aa; }
  .inv-item::before { content: '◈'; font-size: 0.65rem; color: #5a4a28; flex-shrink: 0; }
  .inv-del { background: transparent; border: none; color: #4a3a2a; cursor: pointer; font-size: 0.8rem; padding: 0 0.25rem; margin-left: auto; transition: color 0.15s; line-height: 1; }
  .inv-del:hover { color: #c04040; }

  .sess-entry { border: 1px solid #2a2416; background: #171208; overflow: hidden; transition: border-color 0.2s; box-shadow: 0 2px 0 #0a0806; }
  .sess-entry:hover { border-color: #352e1e; }
  .sess-header { display: flex; align-items: center; gap: 0.6rem; padding: 0.8rem 1rem; cursor: pointer; transition: background 0.15s; user-select: none; }
  .sess-header:hover { background: rgba(226,185,78,0.04); }
  .sess-header.open { background: rgba(226,185,78,0.06); border-bottom: 1px solid #2e2618; }
  .sess-num { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.08em; color: #5a4a28; flex-shrink: 0; min-width: 24px; }
  .sess-body { padding: 0.9rem 1rem 1.1rem; }

  .sess-rendered { font-family: 'Crimson Text', Georgia, serif; font-size: 1.05rem; color: #c8c0a0; line-height: 1.75; white-space: pre-wrap; word-break: break-word; padding: 0.75rem 0.85rem; background: #130f0c; border: 1px solid #352e1e; min-height: 80px; cursor: text; box-shadow: inset 0 2px 6px rgba(0,0,0,0.45); }
  .sess-rendered:empty::before { content: attr(data-placeholder); color: #4a3e24; font-style: italic; }

  /* ── Entity link colors ── */
  .entity-link { cursor: pointer; padding: 0 2px; font-weight: 600; transition: all 0.15s; text-decoration: none; display: inline; }
  /* NPC → gold */
  .entity-link-npc      { color: #e2b94e; background: rgba(226,185,78,0.10); border-bottom: 1px solid rgba(226,185,78,0.4); }
  .entity-link-npc:hover { background: rgba(226,185,78,0.22); border-bottom-color: #e2b94e; }
  /* Location → blue */
  .entity-link-location      { color: #7aaccc; background: rgba(122,172,204,0.10); border-bottom: 1px solid rgba(122,172,204,0.4); }
  .entity-link-location:hover { background: rgba(122,172,204,0.22); border-bottom-color: #7aaccc; }
  /* Quest → red */
  .entity-link-quest      { color: #cc6666; background: rgba(204,102,102,0.10); border-bottom: 1px solid rgba(204,102,102,0.4); }
  .entity-link-quest:hover { background: rgba(204,102,102,0.22); border-bottom-color: #cc6666; }
  /* Inventory → green */
  .entity-link-inventory      { color: #7acc9a; background: rgba(122,204,154,0.10); border-bottom: 1px solid rgba(122,204,154,0.4); }
  .entity-link-inventory:hover { background: rgba(122,204,154,0.22); border-bottom-color: #7acc9a; }
  /* Skill → purple */
  .entity-link-skill      { color: #a87acc; background: rgba(168,122,204,0.10); border-bottom: 1px solid rgba(168,122,204,0.4); }
  .entity-link-skill:hover { background: rgba(168,122,204,0.22); border-bottom-color: #a87acc; }

  /* ── Legend ── */
  .sess-legend { display: flex; gap: 0.7rem; flex-wrap: wrap; padding: 0.5rem 0.7rem; background: rgba(226,185,78,0.03); border: 1px solid #2a2416; margin-bottom: 0.6rem; align-items: center; }
  .sess-legend-item { display: flex; align-items: center; gap: 0.3rem; font-family: 'Cinzel', serif; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .legend-dot { width: 8px; height: 8px; flex-shrink: 0; }

  .quest-entry { background: #1c1810; border: 1px solid #2a2416; padding: 0.9rem 1rem; box-shadow: 0 2px 0 #0a0806; transition: opacity 0.2s; }
  .quest-entry.active    { border-left: 2px solid #e2b94e; }
  .quest-entry.completed { border-left: 2px solid #5a9a5a; opacity: 0.75; }
  .quest-entry.failed    { border-left: 2px solid #8a2a2a; opacity: 0.6; }
  .badge { font-family: 'Cinzel', serif; font-size: 0.57rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.15rem 0.55rem; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; user-select: none; }
  .badge.active    { border: 1px solid #8a6830; color: #e2b94e; background: rgba(226,185,78,0.1); }
  .badge.completed { border: 1px solid #3a6a3a; color: #6acc6a; background: rgba(74,122,74,0.1); }
  .badge.failed    { border: 1px solid #6a2a2a; color: #cc4444; background: rgba(122,44,44,0.1); }
  .badge:hover { filter: brightness(1.25); }

  .skill-pips { display: flex; gap: 3px; align-items: center; flex-shrink: 0; }
  .pip { width: 8px; height: 8px; border: 1px solid #3a3018; cursor: pointer; transition: all 0.15s; }
  .pip.filled { background: #e2b94e; border-color: #c9a84c; box-shadow: 0 0 4px rgba(226,185,78,0.4); }

  .rel-badge { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.1em; padding: 0.15rem 0.5rem; cursor: pointer; flex-shrink: 0; transition: all 0.15s; user-select: none; text-transform: uppercase; }
  .rel-ally    { border: 1px solid #3a6a3a; color: #6acc6a; background: rgba(74,122,74,0.08); }
  .rel-neutral { border: 1px solid #4a4030; color: #9a8a5a; background: rgba(74,64,48,0.08); }
  .rel-hostile { border: 1px solid #6a2a2a; color: #cc4444; background: rgba(122,44,44,0.08); }
  .rel-unknown { border: 1px solid #2e2618; color: #5a4a28; background: transparent; }
  .rel-badge:hover { filter: brightness(1.2); }

  .loc-type { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.15rem 0.55rem; border: 1px solid #352e1e; color: #7a6840; background: rgba(226,185,78,0.04); flex-shrink: 0; }
  .add-form { background: #171208; border: 1px dashed #352e1e; padding: 1.1rem; }
  .empty-state { text-align: center; padding: 2.5rem; color: #4a3e24; font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 0.12em; line-height: 1.9; }

  .row { display: flex; align-items: center; gap: 0.6rem; }
  .col { display: flex; flex-direction: column; gap: 0.5rem; }
  .flex1 { flex: 1; min-width: 0; }
  .mt05 { margin-top: 0.5rem; }
  .mt1  { margin-top: 1rem; }
  .id-grid { display: grid; grid-template-columns: 1fr 150px 75px; gap: 1.1rem; align-items: end; }
  @media (max-width:480px) { .id-grid { grid-template-columns: 1fr; gap: 0.8rem; } .hj-logo { font-size: 1rem; } }
`;

/* ═══ HELPERS ═══════════════════════════════════ */
const today   = () => new Date().toISOString().slice(0,10);
const statMod = v  => { const m=Math.floor((v-10)/2); return m>=0?`+${m}`:String(m); };
const clamp   = (n,lo,hi) => Math.max(lo,Math.min(hi,n));
const STAT_KEYS    = ["STR","DEX","CON","INT","WIS","CHA"];
const STATUS_CYCLE = { Active:"Completed", Completed:"Failed", Failed:"Active" };
const REL_CYCLE    = { unknown:"ally", ally:"neutral", neutral:"hostile", hostile:"unknown" };
const REL_LABELS   = { ally:"Ally", neutral:"Neutral", hostile:"Hostile", unknown:"Unknown" };
const SKILL_CATS   = ["Skill","Trait","Feat","Spell","Ability","Other"];
const LOC_TYPES    = ["Settlement","Dungeon","Wilderness","Building","Ruin","Landmark","Other"];

const DEFAULT_CHAR = { name:"Unnamed Hero", charClass:"Adventurer", level:1, stats:{STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10}, hp:{current:10,max:10}, notes:"" };

const load = (key,fb) => { try { return JSON.parse(localStorage.getItem(key))??fb; } catch { return fb; } };
const save = (key,val) => { try { localStorage.setItem(key,JSON.stringify(val)); } catch {} };

/* ═══ ENTITY LINK PARSER ════════════════════════
   Color legend:
     NPC       → gold    #e2b94e
     Location  → blue    #7aaccc
     Quest     → red     #cc6666
     Inventory → green   #7acc9a
     Skill     → purple  #a87acc
═══════════════════════════════════════════════ */
function parseEntityLinks(text, npcs, locations, quests, inventory, skills, onNavigate) {
  if (!text) return null;

  const entities = [
    ...npcs.map(n      => ({ name:n.name,    tab:"npcs",      type:"npc"       })),
    ...locations.map(l => ({ name:l.name,    tab:"locations", type:"location"  })),
    ...quests.map(q    => ({ name:q.name,    tab:"quests",    type:"quest"     })),
    ...inventory.map(i => ({ name:i.name,    tab:"inventory", type:"inventory" })),
    ...skills.map(s    => ({ name:s.name,    tab:"skills",    type:"skill"     })),
  ].filter(e => e.name && e.name.trim().length > 1)
   .sort((a,b) => b.name.length - a.name.length);

  if (entities.length === 0) return text;

  const escaped = entities.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts   = text.split(pattern);

  const TAB_LABELS = { npc:"People", location:"Places", quest:"Quests", inventory:"Pack", skill:"Abilities" };

  return parts.map((part, i) => {
    const match = entities.find(e => e.name.toLowerCase() === part.toLowerCase());
    if (match) {
      return (
        <span key={i} className={`entity-link entity-link-${match.type}`}
          onClick={() => onNavigate(match.tab)}
          title={`→ ${TAB_LABELS[match.type]}: ${match.name}`}>
          {part}
        </span>
      );
    }
    return part;
  });
}

/* Legend config */
const LEGEND_ITEMS = [
  { type:"npc",       color:"rgba(226,185,78,0.35)",  border:"rgba(226,185,78,0.6)",   label:"People"    },
  { type:"location",  color:"rgba(122,172,204,0.35)", border:"rgba(122,172,204,0.6)",  label:"Places"    },
  { type:"quest",     color:"rgba(204,102,102,0.35)", border:"rgba(204,102,102,0.6)",  label:"Quests"    },
  { type:"inventory", color:"rgba(122,204,154,0.35)", border:"rgba(122,204,154,0.6)",  label:"Pack"      },
  { type:"skill",     color:"rgba(168,122,204,0.35)", border:"rgba(168,122,204,0.6)",  label:"Abilities" },
];

/* ═══ SHARED COMPONENTS ════════════════════════ */
function TagsEditor({ tags, onChange }) {
  const [adding,setAdding]=useState(false); const [draft,setDraft]=useState(""); const ref=useRef(null);
  const commit=()=>{ const t=draft.trim().toLowerCase(); if(t&&!tags.includes(t)) onChange([...tags,t]); setDraft(""); setAdding(false); };
  return (
    <div className="tags-row">
      {tags.map(tag=>(
        <span key={tag} className="tag tag-default">{tag}
          <button className="tag-remove" onClick={()=>onChange(tags.filter(x=>x!==tag))}>✕</button>
        </span>
      ))}
      {adding
        ? <input ref={ref} className="tag-input" autoFocus value={draft} placeholder="tag…" onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setAdding(false);setDraft("");}}}/>
        : <button className="tag-add-btn" onClick={()=>setAdding(true)}>+ tag</button>}
    </div>
  );
}

function FilterBar({ allTags, activeTag, onSelect }) {
  if (!allTags.length) return null;
  return (
    <div className="filter-bar">
      <span style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.12em",color:"#4a3a20",textTransform:"uppercase"}}>Filter:</span>
      <button className={`filter-tag${!activeTag?" active-filter":""}`} onClick={()=>onSelect(null)}>All</button>
      {allTags.map(tag=><button key={tag} className={`filter-tag${activeTag===tag?" active-filter":""}`} onClick={()=>onSelect(activeTag===tag?null:tag)}>{tag}</button>)}
    </div>
  );
}

function PinBtn({ pinned, onToggle }) {
  return <button className={`pin-btn${pinned?" pinned":""}`} onClick={onToggle} title={pinned?"Unpin":"Pin to top"}>{pinned?"📌":"📍"}</button>;
}

function StatBox({ label, value, onChange }) {
  const [editing,setEditing]=useState(false); const [draft,setDraft]=useState(String(value)); const ref=useRef(null);
  const commit=()=>{ const n=parseInt(draft,10); if(!isNaN(n)) onChange(clamp(n,1,30)); setEditing(false); };
  return (
    <div className={`stat-box${editing?" editing":""}`} onClick={()=>{if(!editing){setDraft(String(value));setEditing(true);}}}>
      <span className="stat-name">{label}</span>
      {editing ? <input ref={ref} className="stat-input" value={draft} autoFocus onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} onClick={e=>e.stopPropagation()}/>
               : <span className="stat-val">{value}</span>}
      <span className="stat-mod">{statMod(value)}</span>
    </div>
  );
}

const hpColor = p => p>60?"linear-gradient(90deg,#6b1515,#9b2c2c,#cc3a3a)":p>25?"linear-gradient(90deg,#7a3a10,#c06020,#d87030)":"linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";

function SkillPips({ value, onChange }) {
  return <div className="skill-pips">{[1,2,3,4,5].map(i=><div key={i} className={`pip${i<=value?" filled":""}`} onClick={()=>onChange(i===value?0:i)} title={`Level ${i}`}/>)}</div>;
}

/* ═══ CHARACTER SHEET ══════════════════════════ */
function CharacterSheet({ char, setChar }) {
  const upd=(f,v)=>setChar(c=>({...c,[f]:v}));
  const updSt=(s,v)=>setChar(c=>({...c,stats:{...c.stats,[s]:v}}));
  const hpPct=Math.round(clamp((char.hp.current/char.hp.max)*100,0,100));
  return (
    <>
      <div className="card">
        <div className="sect-label">Identity</div>
        <div className="id-grid">
          <div>
            <div className="sect-label" style={{fontSize:"0.56rem",marginBottom:"0.35rem"}}>Character Name</div>
            <input className="iedit" style={{fontFamily:"Cinzel,serif",fontSize:"1.25rem",color:"#ede5c5",fontWeight:700}} value={char.name} onChange={e=>upd("name",e.target.value)} placeholder="Enter name…"/>
          </div>
          <div>
            <div className="sect-label" style={{fontSize:"0.56rem",marginBottom:"0.35rem"}}>Class</div>
            <input className="iedit" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",color:"#e2b94e"}} value={char.charClass} onChange={e=>upd("charClass",e.target.value)} placeholder="Class…"/>
          </div>
          <div>
            <div className="sect-label" style={{fontSize:"0.56rem",marginBottom:"0.35rem"}}>Level</div>
            <input className="iedit" type="number" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",color:"#e2b94e",textAlign:"center"}} value={char.level} min={1} max={20} onChange={e=>upd("level",clamp(parseInt(e.target.value)||1,1,20))}/>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="sect-label">Attributes <span style={{fontFamily:"Crimson Text,serif",textTransform:"none",letterSpacing:0,fontSize:"0.85rem",color:"#6a5830"}}>— tap to edit</span></div>
        <div className="stat-grid">{STAT_KEYS.map(k=><StatBox key={k} label={k} value={char.stats[k]} onChange={v=>updSt(k,v)}/>)}</div>
      </div>
      <div className="card">
        <div className="sect-label">Vitality</div>
        <div className="hp-row">
          <button className="btn-pm minus" onClick={()=>setChar(c=>({...c,hp:{...c.hp,current:clamp(c.hp.current-1,0,c.hp.max)}}))}>−</button>
          <div className="hp-display">
            <input className="hp-cur-input" type="number" value={char.hp.current} onChange={e=>setChar(c=>({...c,hp:{...c.hp,current:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}/>
            <span className="hp-sep">/</span>
            <input className="hp-max-input" type="number" value={char.hp.max} onChange={e=>setChar(c=>({...c,hp:{...c.hp,max:Math.max(1,parseInt(e.target.value)||1)}}))}/>
          </div>
          <button className="btn-pm plus" onClick={()=>setChar(c=>({...c,hp:{...c.hp,current:clamp(c.hp.current+1,0,c.hp.max)}}))}>+</button>
          <span className="hp-label">HP</span>
        </div>
        <div className="hp-bar-bg"><div className="hp-bar-fill" style={{width:`${hpPct}%`,background:hpColor(hpPct),boxShadow:`0 0 10px ${hpPct>25?"rgba(200,60,60,0.5)":"rgba(120,15,15,0.4)"}`}}/></div>
        <div className="hp-pct">{hpPct}% vitality remaining</div>
      </div>
      <div className="card">
        <div className="sect-label">Chronicles & Traits</div>
        <textarea className="g-textarea" rows={6} placeholder="Backstory, personality traits, bonds, flaws…" value={char.notes} onChange={e=>upd("notes",e.target.value)}/>
      </div>
    </>
  );
}

/* ═══ INVENTORY ════════════════════════════════ */
function Inventory({ inventory, setInventory }) {
  const [newItem,setNewItem]=useState(""); const [newQty,setNewQty]=useState("");
  const addItem=()=>{ const t=newItem.trim(); if(!t)return; setInventory(inv=>[...inv,{id:Date.now(),name:t,qty:newQty.trim()||"1",note:""}]); setNewItem("");setNewQty(""); };
  const removeItem=id=>setInventory(inv=>inv.filter(x=>x.id!==id));
  const updItem=(id,f,v)=>setInventory(inv=>inv.map(x=>x.id===id?{...x,[f]:v}:x));
  return (
    <>
      <div className="card">
        <div className="sect-label">Add Item</div>
        <div className="row">
          <input className="g-input flex1" placeholder="Item name…" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}/>
          <input className="g-input" style={{width:64}} placeholder="Qty" value={newQty} onChange={e=>setNewQty(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}/>
          <button className="btn-gold" onClick={addItem}>Add</button>
        </div>
      </div>
      {inventory.length===0
        ? <div className="card empty-state">Your pack lies empty…<br/><span style={{fontSize:"0.62rem"}}>Add your first item above.</span></div>
        : <div className="card">
            <div className="sect-label">Carried Items ({inventory.length})</div>
            {inventory.map(item=>(
              <div key={item.id} style={{borderBottom:"1px solid #231e12",padding:"0.55rem 0"}}>
                <div className="row" style={{marginBottom:"0.2rem"}}>
                  <span style={{color:"#4a3a20",fontSize:"0.7rem"}}>◈</span>
                  <input className="iedit flex1" style={{fontSize:"1.05rem",color:"#ddd5bb",fontWeight:600}} value={item.name} onChange={e=>updItem(item.id,"name",e.target.value)}/>
                  <input className="iedit" style={{width:48,textAlign:"center",fontSize:"0.9rem",color:"#8a7848"}} value={item.qty} onChange={e=>updItem(item.id,"qty",e.target.value)} placeholder="qty"/>
                  <button className="inv-del" onClick={()=>removeItem(item.id)}>✕</button>
                </div>
                <input className="iedit" style={{fontSize:"0.9rem",color:"#7a6a48",fontStyle:"italic",paddingLeft:"1.1rem"}} value={item.note} onChange={e=>updItem(item.id,"note",e.target.value)} placeholder="Note…"/>
              </div>
            ))}
          </div>}
    </>
  );
}

/* ═══ NPC TRACKER ══════════════════════════════ */
function NPCTracker({ npcs, setNPCs }) {
  const [formState,setForm]=useState({name:"",role:"",relation:"unknown",notes:""});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeTag,setActiveTag]=useState(null);
  const allTags=[...new Set(npcs.flatMap(n=>n.tags||[]))].sort();
  const addNPC=()=>{ const n=formState.name.trim(); if(!n)return; setNPCs(l=>[...l,{id:Date.now(),name:n,role:formState.role.trim(),relation:formState.relation,notes:formState.notes.trim(),tags:[],pinned:false}]); setForm({name:"",role:"",relation:"unknown",notes:""}); setShowForm(false); };
  const upd=(id,f,v)=>setNPCs(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setNPCs(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const cycleRel=id=>setNPCs(l=>l.map(x=>x.id===id?{...x,relation:REL_CYCLE[x.relation||"unknown"]}:x));
  const visible=npcs.filter(n=>!activeTag||(n.tags||[]).includes(activeTag)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return (
    <>
      <div className="row" style={{justifyContent:"space-between"}}>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#6a5830"}}>{npcs.length} {npcs.length===1?"character":"characters"} known</span>
        <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add NPC"}</button>
      </div>
      {showForm&&(
        <div className="add-form">
          <div className="sect-label" style={{marginBottom:"0.8rem"}}>New Character</div>
          <div className="col">
            <input className="g-input" placeholder="Name…" value={formState.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addNPC()}/>
            <input className="g-input" placeholder="Role / occupation…" value={formState.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/>
            <div className="row" style={{gap:"0.5rem",flexWrap:"wrap"}}>
              {["unknown","ally","neutral","hostile"].map(r=><button key={r} className={`rel-badge rel-${r}`} style={{opacity:formState.relation===r?1:0.45}} onClick={()=>setForm(f=>({...f,relation:r}))}>{REL_LABELS[r]}</button>)}
            </div>
            <textarea className="g-textarea" rows={3} placeholder="First impressions, known facts…" value={formState.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
            <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addNPC}>⊕ Add Character</button></div>
          </div>
        </div>
      )}
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {npcs.length===0&&<div className="card empty-state">No characters recorded.<br/><span style={{fontSize:"0.62rem"}}>Add the first soul you've encountered.</span></div>}
      {visible.map(npc=>{ const open=!!expanded[npc.id]; const rel=npc.relation||"unknown"; return (
        <div key={npc.id} className={`card${npc.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem"}}>
          <div className="entity-header">
            <div className="flex1">
              <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",color:"#e0d6b4",fontWeight:700}} value={npc.name} onChange={e=>upd(npc.id,"name",e.target.value)} placeholder="Name…"/>
                <span className={`rel-badge rel-${rel}`} onClick={()=>cycleRel(npc.id)} title="Tap to change">{REL_LABELS[rel]}</span>
              </div>
              <input className="iedit" style={{fontSize:"0.9rem",color:"#8a7848",fontStyle:"italic"}} value={npc.role} onChange={e=>upd(npc.id,"role",e.target.value)} placeholder="Role or occupation…"/>
            </div>
            <PinBtn pinned={npc.pinned} onToggle={()=>upd(npc.id,"pinned",!npc.pinned)}/>
            <button className="entity-toggle" onClick={()=>toggle(npc.id)}>{open?"▲":"▼"}</button>
          </div>
          <TagsEditor tags={npc.tags||[]} onChange={v=>upd(npc.id,"tags",v)}/>
          {open&&<div style={{marginTop:"0.8rem"}}>
            <textarea className="g-textarea" rows={4} placeholder="Known facts, personality, secrets…" value={npc.notes} onChange={e=>upd(npc.id,"notes",e.target.value)}/>
            <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(npc.id)}>Remove</button></div>
          </div>}
        </div>
      );})}
    </>
  );
}

/* ═══ LOCATIONS ════════════════════════════════ */
function Locations({ locations, setLocations }) {
  const [form,setForm]=useState({name:"",type:"Settlement",notes:""});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeTag,setActiveTag]=useState(null);
  const allTags=[...new Set(locations.flatMap(l=>l.tags||[]))].sort();
  const addLoc=()=>{ const n=form.name.trim(); if(!n)return; setLocations(l=>[...l,{id:Date.now(),name:n,type:form.type,notes:form.notes.trim(),tags:[],pinned:false}]); setForm({name:"",type:"Settlement",notes:""}); setShowForm(false); };
  const upd=(id,f,v)=>setLocations(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setLocations(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const visible=locations.filter(l=>!activeTag||(l.tags||[]).includes(activeTag)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return (
    <>
      <div className="row" style={{justifyContent:"space-between"}}>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#6a5830"}}>{locations.length} {locations.length===1?"location":"locations"} mapped</span>
        <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Location"}</button>
      </div>
      {showForm&&(
        <div className="add-form">
          <div className="sect-label" style={{marginBottom:"0.8rem"}}>New Location</div>
          <div className="col">
            <input className="g-input" placeholder="Location name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLoc()}/>
            <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>
              {LOC_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:form.type===t?1:0.45,borderColor:form.type===t?"#8a6830":"#352e1e",color:form.type===t?"#e2b94e":"#6a5830"}} onClick={()=>setForm(f=>({...f,type:t}))}>{t}</button>)}
            </div>
            <textarea className="g-textarea" rows={3} placeholder="Description, atmosphere, notable features…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
            <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addLoc}>⊕ Add Location</button></div>
          </div>
        </div>
      )}
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {locations.length===0&&<div className="card empty-state">No locations recorded.<br/><span style={{fontSize:"0.62rem"}}>Mark the first place your party visited.</span></div>}
      {visible.map(loc=>{ const open=!!expanded[loc.id]; return (
        <div key={loc.id} className={`card${loc.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem"}}>
          <div className="entity-header">
            <div className="flex1">
              <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem"}}>
                <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"1rem",color:"#e0d6b4",fontWeight:700}} value={loc.name} onChange={e=>upd(loc.id,"name",e.target.value)} placeholder="Location name…"/>
                <span className="loc-type">{loc.type}</span>
              </div>
            </div>
            <PinBtn pinned={loc.pinned} onToggle={()=>upd(loc.id,"pinned",!loc.pinned)}/>
            <button className="entity-toggle" onClick={()=>toggle(loc.id)}>{open?"▲":"▼"}</button>
          </div>
          <TagsEditor tags={loc.tags||[]} onChange={v=>upd(loc.id,"tags",v)}/>
          {open&&<div style={{marginTop:"0.8rem"}}>
            <div className="row" style={{gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.7rem"}}>
              {LOC_TYPES.map(t=><button key={t} className="filter-tag" style={{opacity:loc.type===t?1:0.4,borderColor:loc.type===t?"#8a6830":"#352e1e",color:loc.type===t?"#e2b94e":"#6a5830"}} onClick={()=>upd(loc.id,"type",t)}>{t}</button>)}
            </div>
            <textarea className="g-textarea" rows={4} placeholder="Geography, atmosphere, notable features, dangers…" value={loc.notes} onChange={e=>upd(loc.id,"notes",e.target.value)}/>
            <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(loc.id)}>Remove</button></div>
          </div>}
        </div>
      );})}
    </>
  );
}

/* ═══ SKILLS & TRAITS ══════════════════════════ */
function SkillsTraits({ skills, setSkills }) {
  const [form,setForm]=useState({name:"",category:"Skill",description:"",level:0});
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [activeTag,setActiveTag]=useState(null);
  const [activeCat,setActiveCat]=useState(null);
  const allTags=[...new Set(skills.flatMap(s=>s.tags||[]))].sort();
  const addSkill=()=>{ const n=form.name.trim(); if(!n)return; setSkills(l=>[...l,{id:Date.now(),name:n,category:form.category,description:form.description.trim(),level:form.level,tags:[],pinned:false}]); setForm({name:"",category:"Skill",description:"",level:0}); setShowForm(false); };
  const upd=(id,f,v)=>setSkills(l=>l.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>setSkills(l=>l.filter(x=>x.id!==id));
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const visible=skills.filter(s=>(!activeTag||(s.tags||[]).includes(activeTag))&&(!activeCat||s.category===activeCat)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  const catColor=cat=>({Skill:"#e2b94e",Trait:"#7aaccc",Feat:"#cc8844",Spell:"#9a6acc",Ability:"#6acc9a",Other:"#8a8a8a"})[cat]||"#8a7848";
  return (
    <>
      <div className="row" style={{justifyContent:"space-between"}}>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#6a5830"}}>{skills.length} {skills.length===1?"entry":"entries"}</span>
        <button className="btn-gold" onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"⊕ Add Entry"}</button>
      </div>
      {showForm&&(
        <div className="add-form">
          <div className="sect-label" style={{marginBottom:"0.8rem"}}>New Entry</div>
          <div className="col">
            <input className="g-input" placeholder="Name…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSkill()}/>
            <div className="row" style={{gap:"0.4rem",flexWrap:"wrap"}}>
              {SKILL_CATS.map(c=><button key={c} className="filter-tag" style={{opacity:form.category===c?1:0.45,borderColor:form.category===c?catColor(c)+"88":"#352e1e",color:form.category===c?catColor(c):"#6a5830"}} onClick={()=>setForm(f=>({...f,category:c}))}>{c}</button>)}
            </div>
            <div className="row" style={{gap:"0.6rem",alignItems:"center"}}>
              <span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",letterSpacing:"0.12em",color:"#6a5830",textTransform:"uppercase"}}>Mastery</span>
              <SkillPips value={form.level} onChange={v=>setForm(f=>({...f,level:v}))}/>
            </div>
            <textarea className="g-textarea" rows={3} placeholder="Description, effect, source…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
            <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addSkill}>⊕ Add</button></div>
          </div>
        </div>
      )}
      <div className="filter-bar">
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.52rem",letterSpacing:"0.12em",color:"#4a3a20",textTransform:"uppercase"}}>Type:</span>
        <button className={`filter-tag${!activeCat?" active-filter":""}`} onClick={()=>setActiveCat(null)}>All</button>
        {SKILL_CATS.map(c=>{ const count=skills.filter(s=>s.category===c).length; if(!count)return null; return <button key={c} className={`filter-tag${activeCat===c?" active-filter":""}`} style={{borderColor:activeCat===c?catColor(c)+"88":"",color:activeCat===c?catColor(c):""}} onClick={()=>setActiveCat(activeCat===c?null:c)}>{c} ({count})</button>; })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {skills.length===0&&<div className="card empty-state">No abilities recorded.<br/><span style={{fontSize:"0.62rem"}}>Add your first skill, trait, or feat.</span></div>}
      {visible.map(sk=>{ const open=!!expanded[sk.id]; const cc=catColor(sk.category); return (
        <div key={sk.id} className={`card${sk.pinned?" pinned":""}`} style={{padding:"1rem 1.1rem",borderLeftColor:cc+"55",borderLeftWidth:2}}>
          <div className="entity-header">
            <div className="flex1">
              <div className="row" style={{gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.98rem",color:"#e0d6b4",fontWeight:700}} value={sk.name} onChange={e=>upd(sk.id,"name",e.target.value)} placeholder="Name…"/>
                <span style={{fontFamily:"Cinzel,serif",fontSize:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase",color:cc,border:`1px solid ${cc}55`,padding:"0.15rem 0.5rem",background:`${cc}0d`,flexShrink:0}}>{sk.category}</span>
              </div>
              {sk.level>0&&<SkillPips value={sk.level} onChange={v=>upd(sk.id,"level",v)}/>}
            </div>
            <PinBtn pinned={sk.pinned} onToggle={()=>upd(sk.id,"pinned",!sk.pinned)}/>
            <button className="entity-toggle" onClick={()=>toggle(sk.id)}>{open?"▲":"▼"}</button>
          </div>
          {!open&&sk.description&&<p style={{fontSize:"0.92rem",color:"#9a8a68",fontStyle:"italic",marginTop:"0.3rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sk.description}</p>}
          <TagsEditor tags={sk.tags||[]} onChange={v=>upd(sk.id,"tags",v)}/>
          {open&&<div style={{marginTop:"0.8rem"}}>
            <div className="row" style={{gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
              {SKILL_CATS.map(c=><button key={c} className="filter-tag" style={{opacity:sk.category===c?1:0.4,borderColor:sk.category===c?catColor(c)+"88":"#352e1e",color:sk.category===c?catColor(c):"#6a5830"}} onClick={()=>upd(sk.id,"category",c)}>{c}</button>)}
            </div>
            <div className="row" style={{gap:"0.6rem",marginBottom:"0.7rem"}}>
              <span style={{fontFamily:"Cinzel,serif",fontSize:"0.58rem",letterSpacing:"0.12em",color:"#6a5830",textTransform:"uppercase"}}>Mastery</span>
              <SkillPips value={sk.level} onChange={v=>upd(sk.id,"level",v)}/>
            </div>
            <textarea className="g-textarea" rows={4} placeholder="Description, effect, source, requirements…" value={sk.description} onChange={e=>upd(sk.id,"description",e.target.value)}/>
            <div className="row mt05" style={{justifyContent:"flex-end"}}><button className="btn-ghost" onClick={()=>del(sk.id)}>Remove</button></div>
          </div>}
        </div>
      );})}
    </>
  );
}

/* ═══ SESSION LOG — SMART ══════════════════════ */
function SessionLog({ sessions, setSessions, npcs, locations, quests, inventory, skills, onNavigate }) {
  const [openIds,  setOpenIds]  = useState({});
  const [editingId,setEditingId]= useState(null);

  const addSession=()=>{ const e={id:Date.now(),number:sessions.length+1,date:today(),title:`Session ${sessions.length+1}`,notes:""}; setSessions(s=>[e,...s]); setOpenIds(o=>({...o,[e.id]:true})); setEditingId(e.id); };
  const upd=(id,f,v)=>setSessions(s=>s.map(x=>x.id===id?{...x,[f]:v}:x));
  const del=id=>{ setSessions(s=>s.filter(x=>x.id!==id)); if(editingId===id) setEditingId(null); };
  const toggle=id=>{ setOpenIds(o=>({...o,[id]:!o[id]})); if(!openIds[id]) setEditingId(null); };

  const hasAnyEntities = npcs.length||locations.length||quests.length||inventory.length||skills.length;
  const hasNotes = sessions.some(s=>s.notes);

  return (
    <>
      <div className="row" style={{justifyContent:"space-between"}}>
        <span style={{fontFamily:"Cinzel,serif",fontSize:"0.62rem",letterSpacing:"0.12em",color:"#6a5830"}}>{sessions.length} {sessions.length===1?"session":"sessions"} recorded</span>
        <button className="btn-gold" onClick={addSession}>⊕ New Session</button>
      </div>

      {/* Legend */}
      {hasAnyEntities && hasNotes && (
        <div className="sess-legend">
          <span style={{fontFamily:"Cinzel,serif",fontSize:"0.48rem",letterSpacing:"0.1em",color:"#4a3a20",textTransform:"uppercase"}}>Tap to jump →</span>
          {LEGEND_ITEMS.map(li => {
            const counts = {npc:npcs.length,location:locations.length,quest:quests.length,inventory:inventory.length,skill:skills.length};
            if (!counts[li.type]) return null;
            return (
              <div key={li.type} className="sess-legend-item">
                <div className="legend-dot" style={{background:li.color,border:`1px solid ${li.border}`}}/>
                <span style={{color:li.border}}>{li.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {sessions.length===0&&<div className="card empty-state">No chronicles written yet.<br/><span style={{fontSize:"0.62rem"}}>Begin your first session above.</span></div>}

      {sessions.map(sess=>{
        const open    = !!openIds[sess.id];
        const editing = editingId===sess.id;
        const parsed  = parseEntityLinks(sess.notes, npcs, locations, quests, inventory, skills, onNavigate);
        return (
          <div key={sess.id} className="sess-entry">
            <div className={`sess-header${open?" open":""}`} onClick={()=>toggle(sess.id)}>
              <span className="sess-num">#{String(sess.number).padStart(2,"0")}</span>
              <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.92rem",color:"#ddd5bb"}} value={sess.title} onChange={e=>{e.stopPropagation();upd(sess.id,"title",e.target.value);}} onClick={e=>e.stopPropagation()}/>
              <input type="date" style={{background:"transparent",border:"none",color:"#6a5830",fontFamily:"inherit",fontSize:"0.75rem",outline:"none",flexShrink:0}} value={sess.date} onChange={e=>{e.stopPropagation();upd(sess.id,"date",e.target.value);}} onClick={e=>e.stopPropagation()}/>
              <span style={{color:open?"#e2b94e":"#3a3020",fontSize:"0.65rem",flexShrink:0}}>{open?"▲":"▼"}</span>
            </div>
            {open&&(
              <div className="sess-body">
                {editing ? (
                  <>
                    <textarea className="g-textarea" rows={6} autoFocus
                      placeholder="Write your session notes… NPC names, locations, quests, items and skills you've added will become coloured links."
                      value={sess.notes} onChange={e=>upd(sess.id,"notes",e.target.value)}/>
                    <div className="row mt05" style={{justifyContent:"space-between"}}>
                      <button className="btn-ghost" onClick={()=>del(sess.id)}>Expunge Record</button>
                      <button className="btn-gold" onClick={()=>setEditingId(null)}>✓ Done</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sess-rendered" data-placeholder="No notes yet — tap to write…" onClick={()=>setEditingId(sess.id)} title="Tap to edit">
                      {sess.notes ? parsed : null}
                    </div>
                    <div className="row mt05" style={{justifyContent:"space-between"}}>
                      <button className="btn-ghost" onClick={()=>del(sess.id)}>Expunge Record</button>
                      <button className="btn-ghost" style={{borderColor:"#5a4a28",color:"#8a7040"}} onClick={()=>setEditingId(sess.id)}>✎ Edit</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ═══ QUEST TRACKER ════════════════════════════ */
function QuestTracker({ quests, setQuests }) {
  const [name,setName]=useState(""); const [desc,setDesc]=useState("");
  const addQuest=()=>{ const n=name.trim(); if(!n)return; setQuests(q=>[...q,{id:Date.now(),name:n,description:desc.trim(),status:"Active"}]); setName("");setDesc(""); };
  const cycle=id=>setQuests(q=>q.map(x=>x.id===id?{...x,status:STATUS_CYCLE[x.status]}:x));
  const del=id=>setQuests(q=>q.filter(x=>x.id!==id));
  const upd=(id,f,v)=>setQuests(q=>q.map(x=>x.id===id?{...x,[f]:v}:x));
  return (
    <>
      <div className="card">
        <div className="sect-label">Issue New Mandate</div>
        <div className="col">
          <input className="g-input" placeholder="Quest name…" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQuest()}/>
          <input className="g-input" placeholder="Brief description…" value={desc} onChange={e=>setDesc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQuest()}/>
          <div className="row" style={{justifyContent:"flex-end"}}><button className="btn-gold" onClick={addQuest}>⊕ Add Quest</button></div>
        </div>
      </div>
      {quests.length===0&&<div className="card empty-state">No mandates issued.<br/><span style={{fontSize:"0.62rem"}}>The board awaits your first quest.</span></div>}
      {["Active","Completed","Failed"].map(status=>{
        const filtered=quests.filter(q=>q.status===status); if(!filtered.length)return null;
        const lc=status==="Active"?"#e2b94e":status==="Completed"?"#6acc6a":"#cc4444";
        return (
          <div key={status} style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            <div className="sect-label" style={{color:lc}}>{status} <span style={{color:"#3a3020"}}>({filtered.length})</span></div>
            {filtered.map(quest=>(
              <div key={quest.id} className={`quest-entry ${status.toLowerCase()}`}>
                <div className="row" style={{alignItems:"flex-start"}}>
                  <div className="flex1">
                    <div className="row" style={{marginBottom:"0.35rem",flexWrap:"wrap",gap:"0.4rem"}}>
                      <input className="iedit flex1" style={{fontFamily:"Cinzel,serif",fontSize:"0.95rem",color:"#e0d6b4",fontWeight:700}} value={quest.name} onChange={e=>upd(quest.id,"name",e.target.value)} placeholder="Quest name…"/>
                      <span className={`badge ${status.toLowerCase()}`} onClick={()=>cycle(quest.id)} title="Tap to cycle">{status}</span>
                    </div>
                    <input className="iedit" style={{fontSize:"0.95rem",color:"#8a7848",fontStyle:"italic"}} value={quest.description} onChange={e=>upd(quest.id,"description",e.target.value)} placeholder="No description…"/>
                  </div>
                  <button onClick={()=>del(quest.id)} style={{background:"transparent",border:"none",color:"#4a3a2a",cursor:"pointer",fontSize:"0.85rem",padding:"0.1rem 0.25rem",marginLeft:"0.4rem",transition:"color 0.15s",flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.color="#c04040"} onMouseLeave={e=>e.currentTarget.style.color="#4a3a2a"}>✕</button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

/* ═══ NAV ══════════════════════════════════════ */
const TABS = [
  { id:"character", label:"Hero",      icon:"⚔️" },
  { id:"inventory", label:"Pack",      icon:"🎒" },
  { id:"npcs",      label:"People",    icon:"👥" },
  { id:"locations", label:"Places",    icon:"🗺️" },
  { id:"skills",    label:"Abilities", icon:"✨" },
  { id:"sessions",  label:"Log",       icon:"📜" },
  { id:"quests",    label:"Quests",    icon:"⚡" },
];

/* ═══ ROOT APP ═════════════════════════════════ */
export default function HeroJournal() {
  const [tab,       setTab]       = useState("character");
  const [char,      setChar]      = useState(()=>load("hj_char",      DEFAULT_CHAR));
  const [inventory, setInventory] = useState(()=>load("hj_inventory", []));
  const [npcs,      setNPCs]      = useState(()=>load("hj_npcs",      []));
  const [locations, setLocations] = useState(()=>load("hj_locations", []));
  const [skills,    setSkills]    = useState(()=>load("hj_skills",    []));
  const [sessions,  setSessions]  = useState(()=>load("hj_sessions",  []));
  const [quests,    setQuests]    = useState(()=>load("hj_quests",    []));

  useEffect(()=>{ save("hj_char",      char);      },[char]);
  useEffect(()=>{ save("hj_inventory", inventory); },[inventory]);
  useEffect(()=>{ save("hj_npcs",      npcs);      },[npcs]);
  useEffect(()=>{ save("hj_locations", locations); },[locations]);
  useEffect(()=>{ save("hj_skills",    skills);    },[skills]);
  useEffect(()=>{ save("hj_sessions",  sessions);  },[sessions]);
  useEffect(()=>{ save("hj_quests",    quests);    },[quests]);

  const handleNavigate = useCallback(t => setTab(t), []);

  return (
    <>
      <style>{CSS}</style>
      <div className="hj-root">
        <header className="hj-header">
          <div style={{maxWidth:780,margin:"0 auto"}}>
            <div className="hj-logo"><span style={{fontSize:"1rem",opacity:0.85}}>⚔</span>Hero Journal</div>
          </div>
        </header>

        <main className="hj-content">
          {tab==="character" && <CharacterSheet char={char} setChar={setChar}/>}
          {tab==="inventory" && <Inventory inventory={inventory} setInventory={setInventory}/>}
          {tab==="npcs"      && <NPCTracker npcs={npcs} setNPCs={setNPCs}/>}
          {tab==="locations" && <Locations locations={locations} setLocations={setLocations}/>}
          {tab==="skills"    && <SkillsTraits skills={skills} setSkills={setSkills}/>}
          {tab==="sessions"  && (
            <SessionLog
              sessions={sessions}   setSessions={setSessions}
              npcs={npcs}           locations={locations}
              quests={quests}       inventory={inventory}
              skills={skills}       onNavigate={handleNavigate}
            />
          )}
          {tab==="quests" && <QuestTracker quests={quests} setQuests={setQuests}/>}
        </main>

        <nav className="hj-bottom-nav">
          {TABS.map(t=>(
            <button key={t.id} className={`hj-nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              <span className="hj-nav-icon">{t.icon}</span>
              <span className="hj-nav-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}