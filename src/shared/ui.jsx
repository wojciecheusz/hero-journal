import { useState } from 'react';
import { useT } from '../i18n/translations';

export function TagsEditor({ tags, onChange, suggestions }) {
  const T = useT();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [showSugg, setShowSugg] = useState(true);
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
        showSugg ? (
          <div className="tags-row tags-suggestions">
            <span className="tags-suggest-label">{T.UI.tagSuggestions}</span>
            {remaining.map(tag => (
              <button key={tag} className="tag tag-suggestion" onClick={() => onChange([...tags, tag])}>
                + {tag}
              </button>
            ))}
            <button className="tag-remove" onClick={() => setShowSugg(false)} aria-label={T.UI.hideSuggestions} title={T.UI.hideSuggestions}>✕</button>
          </div>
        ) : (
          <div className="tags-row tags-suggestions">
            <button className="tags-suggest-label" style={{ cursor:"pointer", background:"none", border:"none", color:"inherit", fontFamily:"inherit", fontSize:"inherit", padding:0, opacity:0.5 }} onClick={() => setShowSugg(true)}>
              {T.UI.tagSuggestions} ▸
            </button>
          </div>
        )
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
