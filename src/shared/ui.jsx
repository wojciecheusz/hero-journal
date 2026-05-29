import { useState, useRef } from 'react';
import { clamp } from '../utils/math';

export function TagsEditor({ tags, onChange }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const commit = () => {
    const t = draft.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft(""); setAdding(false);
  };
  return (
    <div className="tags-row">
      {tags.map(tag => (
        <span key={tag} className="tag tag-default">
          {tag}
          <button className="tag-remove" onClick={() => onChange(tags.filter(x => x !== tag))}>✕</button>
        </span>
      ))}
      {adding
        ? <input className="tag-input" autoFocus value={draft} placeholder="tag…"
            onChange={e => setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setAdding(false); setDraft(""); } }}/>
        : <button className="tag-add-btn" onClick={() => setAdding(true)}>+ tag</button>
      }
    </div>
  );
}

export function FilterBar({ allTags, activeTag, onSelect }) {
  if (!allTags.length) return null;
  return (
    <div className="filter-bar">
      <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Filtr:</span>
      <button className={`filter-tag${!activeTag ? " active-filter" : ""}`} onClick={() => onSelect(null)}>Wszystkie</button>
      {allTags.map(tag => (
        <button key={tag} className={`filter-tag${activeTag === tag ? " active-filter" : ""}`}
          onClick={() => onSelect(activeTag === tag ? null : tag)}>{tag}</button>
      ))}
    </div>
  );
}

export function PrzypnijBtn({ pinned, onToggle }) {
  return (
    <button className={`pin-btn${pinned ? " pinned" : ""}`} onClick={onToggle} title={pinned ? "Odepnij" : "Przypnij"}>
      {pinned ? "📌" : "📍"}
    </button>
  );
}

export function Toggle({ on, onToggle, label, color }) {
  const cls = on ? (color === "purple" ? "on-purple" : color === "blue" ? "on-blue" : "on") : "";
  return (
    <div className="toggle-wrap" onClick={onToggle}>
      <div className={`toggle-track${cls ? " " + cls : ""}`}><div className="toggle-thumb"/></div>
      <span className="toggle-label">{label}</span>
    </div>
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

export function SkillPips({ value, onChange }) {
  return (
    <div className="skill-pips">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`pip${i <= value ? " filled" : ""}`} onClick={() => onChange(i === value ? 0 : i)}/>
      ))}
    </div>
  );
}

export function EntityLink({ match, part, onNavigate }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const show = () => { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setVisible(true), 350); };
  const hide = () => { clearTimeout(timerRef.current); setVisible(false); };
  return (
    <span className={`entity-link entity-link-${match.type}`}
      onClick={() => onNavigate(match.tab)}
      onMouseEnter={show} onMouseLeave={hide}
      onTouchStart={e => { e.preventDefault(); show(); }} onTouchEnd={hide}
      title={match.name} style={{ position: "relative", display: "inline" }}>
      {part}
      {visible && (
        <span className="entity-tooltip" onClick={e => e.stopPropagation()}>
          <span className="entity-tooltip-name">{match.name}</span>
          {match.tooltip.sub && <span className="entity-tooltip-sub">{match.tooltip.sub}</span>}
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

export function parseEntityLinksWithTooltips(text, npcs, locations, quests, inventory, skills, onNavigate) {
  if (!text) return null;
  const entityMap = new Map();
  const addEntities = (list, tab, type, getTooltip) =>
    list.forEach(e => e.name?.trim().length > 1 && entityMap.set(e.name.toLowerCase(), { name: e.name, tab, type, tooltip: getTooltip(e) }));
  addEntities(npcs,      "npcs",      "npc",       e => ({ sub: e.role || "",        body: e.notes || "" }));
  addEntities(locations, "locations", "location",  e => ({ sub: e.type || "",        body: e.notes || "" }));
  addEntities(quests,    "quests",    "quest",     e => ({ sub: e.status || "",      body: e.description || "" }));
  addEntities(inventory, "inventory", "inventory", e => ({ sub: e.type || "",        body: e.note || "" }));
  addEntities(skills,    "skills",    "skill",     e => ({ sub: e.category || "",    body: e.description || "" }));
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
  const SPELL_SLOT_LABELS = ["1. poziom", "2. poziom", "3. poziom", "4. poziom", "5. poziom", "6. poziom", "7. poziom", "8. poziom", "9. poziom"];
  const usedLevels = [...new Set((spells || []).map(s => s.level).filter(l => l !== "Sztuczka"))];
  if (!usedLevels.length) return (
    <p style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", opacity: 0.5, textAlign: "center", padding: "1rem 0" }}>
      Brak zapisanych czarów poziomowych (innych niż sztuczki).
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
            <span className="spell-slot-label">{lv}</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
              <input className="spell-slot-input" type="number" min={0} value={sl.used || 0}
                onChange={e => setChar(c => ({ ...c, spellSlots: { ...(c.spellSlots || {}), [lv]: { ...((c.spellSlots || {})[lv] || { max: 0, used: 0 }), used: Math.max(0, parseInt(e.target.value) || 0) } } }))}
                style={{ width: 28, fontSize: "0.9rem" }}/>
              <span style={{ color: "var(--spell-border)", fontSize: "0.7rem" }}>/</span>
              <input className="spell-slot-input" type="number" min={0} value={sl.max || 0}
                onChange={e => setChar(c => ({ ...c, spellSlots: { ...(c.spellSlots || {}), [lv]: { ...((c.spellSlots || {})[lv] || { max: 0, used: 0 }), max: Math.max(0, parseInt(e.target.value) || 0) } } }))}
                style={{ width: 28, fontSize: "0.9rem", color: "var(--spell-muted)" }}/>
            </div>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.42rem", color: "var(--spell-dim)", textTransform: "uppercase", marginTop: "0.1rem", display: "block" }}>
              {count} czar{count !== 1 ? "y" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function RestModal({ type, char, setChar, onClose }) {
  const hd = char.hitDice || { type: "d8", max: 1, used: 0 };
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
        {isShort ? (
          <>
            <p className="modal-text">
              Wydaj Kości Wytrzymałości, aby odzyskać punkty życia.{" "}
              <strong style={{ color: "inherit" }}>{available}</strong> z <strong style={{ color: "inherit" }}>{hd.max}</strong> kości {hd.type} dostępnych.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>Typ kości</span>
              <select className="g-select" style={{ width: "auto", fontSize: "0.9rem", padding: "0.3rem 0.5rem" }}
                value={hd.type} onChange={e => setChar(c => ({ ...c, hitDice: { ...hd, type: e.target.value } }))}>
                {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>Maks.</span>
              <input type="number" min={1} value={hd.max}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...hd, max: parseInt(e.target.value) || 1 } }))}
                style={{ width: 44, fontFamily: "Cinzel,serif", fontSize: "0.9rem", background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", textAlign: "center", color: "inherit" }}/>
            </div>
            <div className="modal-detail">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>Wydaj</span>
                <button onClick={() => setHdWydaj(s => Math.max(0, s - 1))} style={{ width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: "pointer", fontFamily: "monospace", fontSize: "1rem" }}>−</button>
                <input type="number" min={0} max={available} value={hdWydaj}
                  onChange={e => setHdWydaj(clamp(parseInt(e.target.value) || 0, 0, available))}
                  style={{ width: 36, fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, background: "transparent", border: "none", borderBottom: "1px solid currentColor", outline: "none", textAlign: "center", color: "inherit" }}/>
                <button onClick={() => setHdWydaj(s => Math.min(available, s + 1))} style={{ width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: "pointer", fontFamily: "monospace", fontSize: "1rem" }}>+</button>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.72rem", opacity: 0.9 }}>{hd.type}</span>
              </div>
              {(() => {
                const spend = clamp(hdWydaj, 0, available);
                const dieMax = parseInt(hd.type.replace("d", "")) || 8;
                const conMod = Math.floor((char.stats.CON - 10) / 2);
                const avg = spend * Math.ceil(dieMax / 2) + spend * conMod;
                const min = spend * 1 + spend * conMod;
                const max = spend * dieMax + spend * conMod;
                return (
                  <span style={{ fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.95rem", fontStyle: "italic", opacity: 0.85 }}>
                    Przywraca ok. <strong>{Math.max(0, avg)}</strong> PŻ (zakres {Math.max(0, min)}–{Math.max(0, max)}, śr. + MOD Budowy {conMod >= 0 ? "+" : ""}{conMod})
                  </span>
                );
              })()}
            </div>
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.8rem" }}>
              <button className="btn-ghost" onClick={onClose}>Anuluj</button>
              <button className="btn-ghost" onClick={doShortRest}>☽ Odpoczywaj</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                ["❤️", "Przywróć pełne punkty życia", `Z ${char.hp.current} → ${char.hp.max}`],
                ["💫", "Zresetuj komórki czarów", "Wszystkie zużyte gniazda czarów zostaną odnowione"],
                ["🎲", "Odzyskaj Kości Wytrzymałości", (() => { const rec = Math.max(1, Math.floor((char.hitDice?.max || 1) / 2)); const cur = (char.hitDice?.max || 1) - (char.hitDice?.used || 0); return `${cur} → ${Math.min(char.hitDice?.max || 1, cur + rec)} (odzyskano ${rec})`; })()],
                ["☠️", "Wyczyść rzuty obronne przeciw śmierci", "Sukcesy i porażki zostały zresetowane"],
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
              <button className="btn-ghost" onClick={onClose}>Anuluj</button>
              <button className="btn-ghost" onClick={doLongRest}>☀ Odpocznij Długo</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ResetModal({ onConfirm, onAnuluj }) {
  return (
    <div className="modal-overlay" onClick={onAnuluj}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚠ Pełny reset karty</div>
        <p className="modal-text">Spowoduje to trwałe usunięcie wszystkich danych postaci. Tej operacji nie można cofnąć.</p>
        <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
          <button className="btn-ghost" onClick={onAnuluj}>Anuluj</button>
          <button className="btn-danger" onClick={onConfirm}>Usuń wszystko</button>
        </div>
      </div>
    </div>
  );
}
