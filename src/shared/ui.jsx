import { useState } from 'react';
import { clamp } from '../utils/math';
import { useT } from '../i18n/translations';

export function TagsEditor({ tags, onChange, suggestions }) {
  const T = useT();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const commit = () => {
    const t = draft.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft(""); setAdding(false);
  };
  const remaining = (suggestions || []).filter(s => !tags.includes(s));
  return (
    <div>
      <div className="tags-row">
        {tags.map(tag => (
          <span key={tag} className="tag tag-default">
            {tag}
            <button className="tag-remove" onClick={() => onChange(tags.filter(x => x !== tag))} aria-label="Remove tag">✕</button>
          </span>
        ))}
        {adding
          ? <input className="tag-input" autoFocus value={draft} placeholder={T.UI.tagPlaceholder}
              onChange={e => setDraft(e.target.value)} onBlur={commit}
              onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setAdding(false); setDraft(""); } }}/>
          : <button className="tag-add-btn" onClick={() => setAdding(true)}>{T.UI.tagAdd}</button>
        }
      </div>
      {remaining.length > 0 && (
        <div className="tags-row tags-suggestions">
          <span className="tags-suggest-label">{T.UI.tagSuggestions}</span>
          {remaining.map(tag => (
            <button key={tag} className="tag tag-suggestion" onClick={() => onChange([...tags, tag])}>
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ allTags, activeTag, onSelect }) {
  const T = useT();
  if (!allTags.length) return null;
  return (
    <div className="filter-bar">
      <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{T.UI.filterLabel}</span>
      <button className={`filter-tag${!activeTag ? " active-filter" : ""}`} onClick={() => onSelect(null)}>{T.UI.filterAll}</button>
      {allTags.map(tag => (
        <button key={tag} className={`filter-tag${activeTag === tag ? " active-filter" : ""}`}
          onClick={() => onSelect(activeTag === tag ? null : tag)}>{tag}</button>
      ))}
    </div>
  );
}

export function SearchBar({ value, onChange }) {
  const T = useT();
  const clearSearch = () => onChange('');
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      <input
        type="text"
        className="g-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={T.UI.searchPlaceholder}
        style={{ width:"100%", minWidth:"160px" }}
      />
      {value && (
        <button
          onClick={clearSearch}
          aria-label="Wyczysc"
          style={{ position:"absolute", right:"0.4rem", background:"none", border:"none", cursor:"pointer", fontSize:"0.8rem", opacity:0.5, color:"inherit" }}
        >x</button>
      )}
    </div>
  );
}

export function PrzypnijBtn({ pinned, onToggle }) {
  return (
    <button className={`pin-btn${pinned ? " pinned" : ""}`} onClick={onToggle} aria-label={pinned ? "Unpin" : "Pin"}>
      {pinned ? "📌" : "📍"}
    </button>
  );
}

export function Toggle({ on, onToggle, label, color }) {
  const cls = on ? (color === "purple" ? "on-purple" : color === "blue" ? "on-blue" : "on") : "";
  return (
    <button className="toggle-wrap" role="switch" aria-checked={on} onClick={onToggle} aria-label={label}>
      <div className={`toggle-track${cls ? " " + cls : ""}`}><div className="toggle-thumb"/></div>
      <span className="toggle-label">{label}</span>
    </button>
  );
}

export function StatBox({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const commit = () => { const n = parseInt(draft, 10); if (!isNaN(n)) onChange(clamp(n, 1, 30)); setEditing(false); };
  return (
    <div className={`stat-box${editing ? " editing" : ""}`}
      onClick={() => { if (!editing) { setDraft(String(value)); setEditing(true); } }}>
      <span className="stat-name">{label}</span>
      {editing
        ? <input className="stat-input" value={draft} autoFocus
            onChange={e => setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
            onClick={e => e.stopPropagation()}/>
        : <span className="stat-val">{value}</span>
      }
      <span className="stat-mod">{(() => { const m = Math.floor((value - 10) / 2); return m >= 0 ? `+${m}` : String(m); })()}</span>
    </div>
  );
}

export function EntityLink({ match, part, onNavigate }) {
  return (
    <span
      className={`entity-link entity-link-${match.type}`}
      onClick={() => onNavigate(match.tab, match.name)}
      title={match.name}>
      {part}
    </span>
  );
}

export function parseEntityLinksWithTooltips(text, npcs, locations, quests, inventory, skills, onNavigate) {
  if (!text) return null;
  const entityMap = new Map();
  const add = (list, tab, type) =>
    list.forEach(e => e.name?.trim().length > 1 && entityMap.set(e.name.toLowerCase(), { name: e.name, tab, type }));
  add(npcs,      "npcs",      "npc");
  add(locations, "locations", "location");
  add(quests,    "quests",    "quest");
  add(inventory, "inventory", "inventory");
  add(skills,    "skills",    "skill");
  const sorted = [...entityMap.values()].sort((a, b) => b.name.length - a.name.length);
  if (!sorted.length) return text;
  const pattern = new RegExp(`(${sorted.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(pattern).map((part, i) => {
    const match = entityMap.get(part.toLowerCase());
    if (match) return <EntityLink key={i} match={match} part={part} onNavigate={onNavigate}/>;
    return part;
  });
}

export function SpellSlotsWidget({ char, setChar, spells }) {
  const T = useT();
  const SPELL_SLOT_LABELS = ["level1","level2","level3","level4","level5","level6","level7","level8","level9"];
  const usedLevels = [...new Set((spells || []).map(s => s.level).filter(l => l !== "cantrip"))];
  if (!usedLevels.length) return (
    <p style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", opacity: 0.5, textAlign: "center", padding: "1rem 0" }}>
      {T.UI.noLevelSpells}
    </p>
  );
  usedLevels.sort((a, b) => SPELL_SLOT_LABELS.indexOf(a) - SPELL_SLOT_LABELS.indexOf(b));
  return (
    <div style={{ display: "grid", gap: "0.35rem", gridTemplateColumns: `repeat(${usedLevels.length},1fr)` }}>
      {usedLevels.map(lv => {
        const sl = (char.spellSlots || {})[lv] || { max: 0, used: 0 };
        const count = (spells || []).filter(s => s.level === lv).length;
        return (
          <div key={lv} className="spell-slot-box">
            <span className="spell-slot-label">{T.LABELS.spellLevel[lv] ?? lv}</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
              <input className="spell-slot-input" type="number" min={0} value={sl.used || 0}
                onChange={e => setChar(c => ({ ...c, spellSlots: { ...(c.spellSlots || {}), [lv]: { ...((c.spellSlots || {})[lv] || { max: 0, used: 0 }), used: Math.max(0, parseInt(e.target.value) || 0) } } }))}
                style={{ width: 28, fontSize: "0.9rem" }}/>
              <span style={{ color: "var(--hj-spell-border)", fontSize: "0.7rem" }}>/</span>
              <input className="spell-slot-input" type="number" min={0} value={sl.max || 0}
                onChange={e => setChar(c => ({ ...c, spellSlots: { ...(c.spellSlots || {}), [lv]: { ...((c.spellSlots || {})[lv] || { max: 0, used: 0 }), max: Math.max(0, parseInt(e.target.value) || 0) } } }))}
                style={{ width: 28, fontSize: "0.9rem", color: "var(--hj-spell-muted)" }}/>
            </div>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.42rem", color: "var(--hj-spell-dim)", textTransform: "uppercase", marginTop: "0.1rem", display: "block" }}>
              {T.UI.spellCount(count)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function RestModal({ type, char, setChar, onClose }) {
  const T  = useT();
  const R  = T.REST;
  const hd = char.hitDice || { type: "d8", max: 1, used: 0 };
  const available = Math.max(0, hd.max - hd.used);
  const [hdSpend, setHdSpend] = useState(1);

  const doShortRest = () => {
    const spend = clamp(hdSpend, 0, available);
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
    setChar(c => {
      const prevCond = c.conditions || {};
      const prevExh  = prevCond.exhaustion || 0;
      return {
        ...c,
        hp: { ...c.hp, current: c.hp.max, temp: 0 },
        hitDice: { ...hd, used: newUsed },
        spellSlots: newSlots,
        deathSaves: { successes: 0, failures: 0 },
        // Długi odpoczynek zmniejsza Wycieńczenie o 1 poziom (min 0), ale NIE
        // kasuje pozostałych stanów (ich czas trwania zależy od efektu/czaru)
        conditions: { ...prevCond, exhaustion: Math.max(0, prevExh - 1) },
      };
    });
    onClose();
  };

  const isShort = type === "short";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{isShort ? R.shortTitle : R.longTitle}</div>
        {isShort ? (
          <>
            <p className="modal-text">{R.availableDice(available, hd.max, hd.type)}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>{R.diceType}</span>
              <select className="g-select" style={{ width: "auto", fontSize: "0.9rem", padding: "0.3rem 0.5rem" }}
                value={hd.type} onChange={e => setChar(c => ({ ...c, hitDice: { ...hd, type: e.target.value } }))}>
                {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>{R.maxLabel}</span>
              <input type="number" min={1} value={hd.max}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...hd, max: parseInt(e.target.value) || 1 } }))}
                style={{ width: 44, fontFamily: "Cinzel,serif", fontSize: "0.9rem", background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", textAlign: "center", color: "inherit" }}/>
            </div>
            <div className="modal-detail">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>{R.spend}</span>
                <button onClick={() => setHdSpend(s => Math.max(0, s - 1))} aria-label="Decrease dice" style={{ width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: "pointer", fontFamily: "monospace", fontSize: "1rem", color: "inherit" }}>−</button>
                <input type="number" min={0} max={available} value={hdSpend}
                  onChange={e => setHdSpend(clamp(parseInt(e.target.value) || 0, 0, available))}
                  style={{ width: 36, fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, background: "transparent", border: "none", borderBottom: "1px solid currentColor", outline: "none", textAlign: "center", color: "inherit" }}/>
                <button onClick={() => setHdSpend(s => Math.min(available, s + 1))} aria-label="Increase dice" style={{ width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: "pointer", fontFamily: "monospace", fontSize: "1rem", color: "inherit" }}>+</button>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.72rem", opacity: 0.9 }}>{hd.type}</span>
              </div>
              {(() => {
                const spend = clamp(hdSpend, 0, available);
                const dieMax = parseInt(hd.type.replace("d", "")) || 8;
                const conMod = Math.floor((char.stats.CON - 10) / 2);
                const avg = spend * Math.ceil(dieMax / 2) + spend * conMod;
                const min = spend * 1 + spend * conMod;
                const max = spend * dieMax + spend * conMod;
                return (
                  <span style={{ fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.95rem", fontStyle: "italic", opacity: 0.85 }}>
                    {R.restores(Math.max(0, avg), Math.max(0, min), Math.max(0, max), conMod)}
                  </span>
                );
              })()}
            </div>
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.8rem" }}>
              <button className="btn-ghost" onClick={onClose}>{R.cancel}</button>
              <button className="btn-ghost" onClick={doShortRest}>{R.doShortRest}</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                ["❤️", R.restoreHp,    R.restoreHpDetail(char.hp.current, char.hp.max)],
                ["💫", R.resetSlots,   R.resetSlotsDetail],
                ["🎲", R.recoverDice,  (() => { const rec = Math.max(1, Math.floor((char.hitDice?.max || 1) / 2)); const cur = (char.hitDice?.max || 1) - (char.hitDice?.used || 0); return R.recoverDiceDetail(cur, Math.min(char.hitDice?.max || 1, cur + rec), rec); })()],
                ["☠️", R.resetDeath,   R.resetDeathDetail],
              ].map(([icon, label, detail]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.35rem 0", borderBottom: "1px solid rgba(128,128,128,0.15)" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.88rem", opacity: 0.9, fontStyle: "italic" }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
              <button className="btn-ghost" onClick={onClose}>{R.cancel}</button>
              <button className="btn-ghost" onClick={doLongRest}>{R.doLongRest}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ResetModal({ onConfirm, onCancel }) {
  const T = useT();
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{T.UI.resetTitle}</div>
        <p className="modal-text">{T.UI.resetText}</p>
        <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
          <button className="btn-ghost" onClick={onCancel}>{T.UI.resetCancel}</button>
          <button className="btn-danger" onClick={onConfirm}>{T.UI.resetConfirm}</button>
        </div>
      </div>
    </div>
  );
}
