import { useState, useEffect } from 'react';
import { LOC_TYPES } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, PrzypnijBtn } from '../../shared/ui';

export default function LocationsScreen({ locations, setLocations, openEntity }) {
  const [form, setForm] = useState({ name: "", type: "Osada", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = locations.find(l => l.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }, [openEntity]);
  const [activeTag, setAktywnyTag] = useState(null);

  const allTags = [...new Set(locations.flatMap(l => l.tags || []))].sort();

  const addLoc = () => {
    const n = form.name.trim(); if (!n) return;
    setLocations(l => [...l, { id: Date.now(), name: n, type: form.type, notes: form.notes.trim(), tags: [], pinned: false }]);
    setForm({ name: "", type: "Osada", notes: "" });
    setShowForm(false);
  };
  const upd = (id, f, v) => setLocations(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => setLocations(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const visible = locations.filter(l => !activeTag || (l.tags || []).includes(activeTag)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em" }}>{locations.length} lokacji naniesionych na mapę</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj lokację"}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder="Nazwa geograficzna lokacji…" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addLoc()}/>
            <div className="row" style={{ gap: "0.4rem", flexWrap: "wrap" }}>
              {LOC_TYPES.map(t => (
                <button key={t} className="filter-tag" style={{ opacity: form.type === t ? 1 : 0.45, borderColor: form.type === t ? "currentColor" : "" }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder="Opis, klimat, geografia, niebezpieczeństwa, ważne punkty…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={addLoc}>⊕ Dodaj</button></div>
          </div>
        </div>
      )}

      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setAktywnyTag}/>
      {locations.length === 0 && <div className="card empty-state">Brak zapisanych lokacji. Mapuj odkryty świat!</div>}
      {visible.map(loc => {
        const open = !!expanded[loc.id];
        return (
          <div key={loc.id} id={`entity-${loc.id}`} className={`card${loc.pinned ? " pinned" : ""}`} style={{ padding: "1rem 1.1rem" }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: "1rem", fontWeight: 700 }}
                    value={loc.name} onChange={e => upd(loc.id, "name", e.target.value)} placeholder="Nazwa lokacji…"/>
                  <span className="loc-type">{loc.type}</span>
                </div>
              </div>
              <PrzypnijBtn pinned={loc.pinned} onToggle={() => upd(loc.id, "pinned", !loc.pinned)}/>
              <button className="entity-toggle" onClick={() => toggle(loc.id)}>{open ? "▲" : "▼"}</button>
            </div>
            <TagsEditor tags={loc.tags || []} onChange={v => upd(loc.id, "tags", v)}/>
            {open && (
              <div style={{ marginTop: "0.8rem" }}>
                <div className="row" style={{ gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
                  {LOC_TYPES.map(t => <button key={t} className="filter-tag" style={{ opacity: loc.type === t ? 1 : 0.4, borderColor: loc.type === t ? "currentColor" : "" }} onClick={() => upd(loc.id, "type", t)}>{t}</button>)}
                </div>
                <textarea className="g-textarea" rows={4} placeholder="Atmosfera, rezydenci, zagrożenia, historia lokacji…" value={loc.notes || ""} onChange={e => upd(loc.id, "notes", e.target.value)}/>
                <div className="row mt05" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={() => del(loc.id)}>Usuń</button></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
