import { useState } from 'react';
import { REL_CYCLE, REL_LABELS } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, PrzypnijBtn } from '../../shared/ui';

export default function NPCsScreen({ npcs, setNPCs }) {
  const [formState, setForm] = useState({ name: "", role: "", relation: "unknown", affiliation: "", metAt: "", connections: "", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeTag, setAktywnyTag] = useState(null);

  const allTags = [...new Set(npcs.flatMap(n => n.tags || []))].sort();

  const addNPC = () => {
    const n = formState.name.trim(); if (!n) return;
    setNPCs(l => [...l, { id: Date.now(), ...formState, name: n, tags: [], pinned: false }]);
    setForm({ name: "", role: "", relation: "unknown", affiliation: "", metAt: "", connections: "", notes: "" });
    setShowForm(false);
  };
  const upd = (id, f, v) => setNPCs(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => setNPCs(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const cycleRel = id => setNPCs(l => l.map(x => x.id === id ? { ...x, relation: REL_CYCLE[x.relation || "unknown"] } : x));

  const visible = npcs.filter(n => !activeTag || (n.tags || []).includes(activeTag)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em" }}>{npcs.length} znanych postaci</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj postać"}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <input className="g-input" placeholder="Imię / Nazwa postaci…" value={formState.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addNPC()}/>
              <input className="g-input" placeholder="Rola / Profesja postaci…" value={formState.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}/>
              <input className="g-input" placeholder="Przynależność / Frakcja…" value={formState.affiliation} onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))}/>
              <input className="g-input" placeholder="Miejsce poznania…" value={formState.metAt} onChange={e => setForm(f => ({ ...f, metAt: e.target.value }))}/>
            </div>
            <input className="g-input" placeholder="Powiązania z innymi bohaterami…" value={formState.connections} onChange={e => setForm(f => ({ ...f, connections: e.target.value }))}/>
            <div className="row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
              {["unknown", "ally", "neutral", "hostile"].map(r => (
                <button key={r} className={`rel-badge rel-${r}`} style={{ opacity: formState.relation === r ? 1 : 0.45 }}
                  onClick={() => setForm(f => ({ ...f, relation: r }))}>{REL_LABELS[r]}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder="Notatki dodatkowe, sekrety postawy…" value={formState.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={addNPC}>⊕ Dodaj postać</button></div>
          </div>
        </div>
      )}

      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setAktywnyTag}/>
      {npcs.length === 0 && <div className="card empty-state">Brak zapisanych postaci w kartotece świata.</div>}
      {visible.map(npc => {
        const open = !!expanded[npc.id];
        const rel = npc.relation || "unknown";
        return (
          <div key={npc.id} className={`card${npc.pinned ? " pinned" : ""}`} style={{ padding: "1rem 1.1rem" }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: "1rem", fontWeight: 700 }}
                    value={npc.name} onChange={e => upd(npc.id, "name", e.target.value)} placeholder="Imię postaci…"/>
                  <span className={`rel-badge rel-${rel}`} onClick={() => cycleRel(npc.id)}>{REL_LABELS[rel]}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 0.6rem" }}>
                  <input className="iedit" style={{ fontSize: "0.88rem", fontStyle: "italic" }} value={npc.role || ""} onChange={e => upd(npc.id, "role", e.target.value)} placeholder="Rola…"/>
                  <input className="iedit" style={{ fontSize: "0.88rem" }} value={npc.affiliation || ""} onChange={e => upd(npc.id, "affiliation", e.target.value)} placeholder="Frakcja…"/>
                  <input className="iedit" style={{ fontSize: "0.85rem" }} value={npc.metAt || ""} onChange={e => upd(npc.id, "metAt", e.target.value)} placeholder="Miejsce poznania…"/>
                  <input className="iedit" style={{ fontSize: "0.85rem" }} value={npc.connections || ""} onChange={e => upd(npc.id, "connections", e.target.value)} placeholder="Powiązania…"/>
                </div>
              </div>
              <PrzypnijBtn pinned={npc.pinned} onToggle={() => upd(npc.id, "pinned", !npc.pinned)}/>
              <button className="entity-toggle" onClick={() => toggle(npc.id)}>{open ? "▲" : "▼"}</button>
            </div>
            <TagsEditor tags={npc.tags || []} onChange={v => upd(npc.id, "tags", v)}/>
            {open && (
              <div style={{ marginTop: "0.8rem" }}>
                <textarea className="g-textarea" rows={4} placeholder="Zgromadzone fakty, sekrety, plotki, cechy charakterystyczne…" value={npc.notes || ""} onChange={e => upd(npc.id, "notes", e.target.value)}/>
                <div className="row mt05" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={() => del(npc.id)}>Usuń</button></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
