import { useState, memo, useEffect } from 'react';
import { LOC_TYPES } from '../../constants/gameConstants';
import { LOC_TYPE } from '../../constants/enums.js';
import { TagsEditor, FilterBar, PrzypnijBtn } from '../../shared/ui';
import { useT } from '../../i18n/translations';

function LocationsScreen({ locations, setLocations, openEntity }) {
  const T = useT();
  const L = T.LOCATIONS;

  const [form, setForm] = useState({ name:"", type:LOC_TYPE.SETTLEMENT, notes:"" });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = locations.find(l => l.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 150);
    }
  }, [openEntity]);

  const allTags = [...new Set(locations.flatMap(l => l.tags || []))].sort();

  const addLoc = () => {
    const n = form.name.trim(); if (!n) return;
    setLocations(l => [...l, { id: Date.now(), name: n, type: form.type, notes: form.notes.trim(), tags: [], pinned: false }]);
    setForm({ name:"", type:LOC_TYPE.SETTLEMENT, notes:"" });
    setShowForm(false);
  };
  const upd    = (id, f, v) => setLocations(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del    = id => setLocations(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));

  const visible = locations.filter(l => !activeTag || (l.tags || []).includes(activeTag)).sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));
  const displayLocType = type => T.LOC_TYPES[LOC_TYPES.indexOf(type)] ?? type;

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{L.count(locations.length)}</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? L.cancel : L.add}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder={L.namePh} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addLoc()}/>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {LOC_TYPES.map((t, i) => (
                <button key={t} className="filter-tag" style={{ opacity: form.type===t?1:0.45, borderColor: form.type===t?"currentColor":"" }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{T.LOC_TYPES[i] ?? t}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={L.notesPh} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addLoc}>{L.addBtn}</button></div>
          </div>
        </div>
      )}

      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {locations.length === 0 && <div className="card empty-state">{L.empty}</div>}

      {visible.map(loc => {
        const open = !!expanded[loc.id];
        const isEditing = !!editing[loc.id];
        return (
          <div key={loc.id} id={`entity-${loc.id}`} className={`card${loc.pinned?" pinned":""}`} style={{ padding:"1rem 1.1rem" }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap:"0.5rem", marginBottom:"0.25rem" }}>
                  <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                    value={loc.name} onChange={e => upd(loc.id, "name", e.target.value)} placeholder={L.editNamePh}/>
                  <span className="loc-type">{displayLocType(loc.type)}</span>
                </div>
              </div>
              <PrzypnijBtn pinned={loc.pinned} onToggle={() => upd(loc.id, "pinned", !loc.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(loc.id)} aria-label="Edit entry">✎</button>
              <button className="entity-toggle" onClick={() => toggle(loc.id)}>{open ? "▲" : "▼"}</button>
            </div>

            {/* Podgląd notatek — 2 linie gdy zwinięty, pełny gdy rozwinięty */}
            {loc.notes && !isEditing && (
              <p className="entry-preview" style={{ ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{loc.notes}</p>
            )}

            <TagsEditor tags={loc.tags || []} onChange={v => upd(loc.id, "tags", v)}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.7rem" }}>
                  {LOC_TYPES.map((t, i) => (
                    <button key={t} className="filter-tag" style={{ opacity: loc.type===t?1:0.4, borderColor: loc.type===t?"currentColor":"" }}
                      onClick={() => upd(loc.id, "type", t)}>{T.LOC_TYPES[i] ?? t}</button>
                  ))}
                </div>
                <textarea className="g-textarea" rows={4} placeholder={L.editNotesPh} value={loc.notes||""} onChange={e => upd(loc.id, "notes", e.target.value)}/>
                <div className="row mt05" style={{ justifyContent:"space-between" }}>
                  <button className="btn-ghost" onClick={() => del(loc.id)}>{L.delete}</button>
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
