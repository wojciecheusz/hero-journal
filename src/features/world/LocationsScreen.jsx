import { useState, memo } from 'react';
import { LOC_TYPES, SUGGESTED_LOCATION_TAGS, LOC_TYPE_ICONS } from '../../constants/gameConstants';
import { LOC_TYPE } from '../../constants/enums.js';
import { TagsEditor, FilterBar, SearchBar, PrzypnijBtn } from '../../shared/ui';
import { useT } from '../../i18n/translations';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';

function LocationsScreen({ title, locations, setLocations, openEntity }) {
  const T = useT();

  const [form, setForm] = useState({ name:"", type:LOC_TYPE.SETTLEMENT, notes:"", tags:[] });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editing,  setEditing]  = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [search, setSearch] = useState('');

  useScrollToEntity(openEntity, locations, setExpanded);

  const allTags = [...new Set(locations.flatMap(l => l.tags || []))].sort();

  const addLoc = () => {
    const n = form.name.trim(); if (!n) return;
    setLocations(l => [...l, { id: Date.now(), name: n, type: form.type, notes: form.notes.trim(), tags: form.tags, pinned: false }]);
    setForm({ name:"", type:LOC_TYPE.SETTLEMENT, notes:"", tags:[] });
    setShowForm(false);
  };
  const upd       = (id, f, v) => setLocations(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del       = id => setLocations(l => l.filter(x => x.id !== id));
  const toggle    = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));

  const q = search.trim().toLowerCase();
  const visible = locations
    .filter(l => !activeTag || (l.tags || []).includes(activeTag))
    .filter(l => !filterType || l.type === filterType)
    .filter(l => !q || [l.name, l.notes].some(f => f?.toLowerCase().includes(q)))
    .sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));
  const displayLocType = type => T.LABELS.locType[type] || type;

  return (
    <>
      <div className="screen-col-header">
        <span className="col-title">{title}</span>
        <span className="col-actions">
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{T.LOCATIONS.count(locations.length)}</span>
          <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? T.LOCATIONS.cancel : T.LOCATIONS.add}</button>
        </span>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder={T.LOCATIONS.namePh} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addLoc()}/>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {LOC_TYPES.map((type) => (
                <button key={type} className="filter-tag" style={{ opacity: form.type===type?1:0.45, borderColor: form.type===type?"currentColor":"" }}
                  onClick={() => setForm(f => ({ ...f, type }))}>{LOC_TYPE_ICONS[type]} {displayLocType(type)}</button>
              ))}
            </div>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {SUGGESTED_LOCATION_TAGS.map((tag) => (
                <button key={tag} className="tag tag-suggestion" style={{ opacity: form.tags.includes(tag) ? 1 : 0.45 }}
                  onClick={() => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))}>
                  {form.tags.includes(tag) ? "✓ " : "+ "}{tag}
                </button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={T.LOCATIONS.notesPh} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addLoc}>{T.LOCATIONS.addBtn}</button></div>
          </div>
        </div>
      )}

      <SearchBar value={search} onChange={setSearch}/>
      <div className="filter-bar">
        <button className={`filter-tag${!filterType?" active-filter":""}`} onClick={() => setFilterType(null)}>{T.UI.filterAll}</button>
        {LOC_TYPES.map(type => {
          const c = locations.filter(l => l.type === type).length;
          if (!c) return null;
          return (
            <button key={type} className={`filter-tag${filterType===type?" active-filter":""}`} onClick={() => setFilterType(filterType===type?null:type)}>
              <span className="badge-icon">{LOC_TYPE_ICONS[type]}</span> {displayLocType(type)} ({c})
            </button>
          );
        })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {locations.length === 0 && <div className="card empty-state">{T.LOCATIONS.empty}</div>}

      {visible.map(loc => {
        const open = !!expanded[loc.id];
        const isEditing = !!editing[loc.id];
        return (
          <div key={loc.id} id={`entity-${loc.id}`} className={`card${loc.pinned?" pinned":""}`} style={{ padding:"1rem 1.1rem" }}>
            <div className="row" style={{ gap:"0.5rem", marginBottom:"0.2rem" }}>
              <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                value={loc.name} onChange={e => upd(loc.id, "name", e.target.value)} placeholder={T.LOCATIONS.editNamePh}/>
              <PrzypnijBtn pinned={loc.pinned} onToggle={() => upd(loc.id, "pinned", !loc.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(loc.id)} aria-label="Edit location">✎</button>
              <button className="entity-toggle" onClick={() => toggle(loc.id)} aria-label={open ? "Collapse" : "Expand"}>{open ? "▲" : "▼"}</button>
            </div>
            <div style={{ marginBottom:"0.4rem" }}>
              <span className="loc-type"><span className="badge-icon">{LOC_TYPE_ICONS[loc.type]}</span> {displayLocType(loc.type)}</span>
            </div>

            {loc.notes && !isEditing && (
              <p className="entry-preview" style={{ ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{loc.notes}</p>
            )}

            <TagsEditor tags={loc.tags || []} onChange={v => upd(loc.id, "tags", v)}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.7rem" }}>
                  {LOC_TYPES.map((type) => (
                    <button key={type} className="filter-tag" style={{ opacity: loc.type===type?1:0.4, borderColor: loc.type===type?"currentColor":"" }}
                      onClick={() => upd(loc.id, "type", type)}>{LOC_TYPE_ICONS[type]} {displayLocType(type)}</button>
                  ))}
                </div>
                <textarea className="g-textarea" rows={4} placeholder={T.LOCATIONS.editNotesPh} value={loc.notes||""} onChange={e => upd(loc.id, "notes", e.target.value)}/>
                <div className="row mt05" style={{ justifyContent:"space-between" }}>
                  <button className="btn-ghost" onClick={() => del(loc.id)}>{T.LOCATIONS.delete}</button>
                  <button className="btn-ghost" onClick={() => stopEdit(loc.id)}>✓</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
export default memo(LocationsScreen);
