import { useState, useEffect } from 'react';
import { REL_CYCLE } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, PrzypnijBtn } from '../../shared/ui';
import { useT } from '../../i18n/translations';

export default function NPCsScreen({ npcs, setNPCs, openEntity }) {
  const T  = useT();
  const N  = T.NPCS;
  const RL = T.REL_LABELS;

  const [formState, setForm] = useState({ name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:"" });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = npcs.find(n => n.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 150);
    }
  }, [openEntity]);

  const allTags = [...new Set(npcs.flatMap(n => n.tags || []))].sort();

  const addNPC = () => {
    const n = formState.name.trim(); if (!n) return;
    setNPCs(l => [...l, { id: Date.now(), ...formState, name: n, tags: [], pinned: false }]);
    setForm({ name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:"" });
    setShowForm(false);
  };
  const upd       = (id, f, v) => setNPCs(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del       = id => setNPCs(l => l.filter(x => x.id !== id));
  const toggle    = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));
  const cycleRel  = id => setNPCs(l => l.map(x => x.id === id ? { ...x, relation: REL_CYCLE[x.relation || "unknown"] } : x));

  const visible = npcs.filter(n => !activeTag || (n.tags || []).includes(activeTag)).sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{N.count(npcs.length)}</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? N.cancel : N.add}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <input className="g-input" placeholder={N.namePh} value={formState.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addNPC()}/>
              <input className="g-input" placeholder={N.rolePh} value={formState.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}/>
              <input className="g-input" placeholder={N.affiliationPh} value={formState.affiliation} onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))}/>
              <input className="g-input" placeholder={N.metAtPh} value={formState.metAt} onChange={e => setForm(f => ({ ...f, metAt: e.target.value }))}/>
            </div>
            <input className="g-input" placeholder={N.connectionsPh} value={formState.connections} onChange={e => setForm(f => ({ ...f, connections: e.target.value }))}/>
            <div className="row" style={{ gap:"0.5rem", flexWrap:"wrap" }}>
              {["unknown","ally","neutral","hostile"].map(r => (
                <button key={r} className={`rel-badge rel-${r}`} style={{ opacity: formState.relation===r?1:0.45 }}
                  onClick={() => setForm(f => ({ ...f, relation: r }))}>{RL[r]}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={N.notesPh} value={formState.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addNPC}>{N.addBtn}</button></div>
          </div>
        </div>
      )}

      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {npcs.length === 0 && <div className="card empty-state">{N.empty}</div>}

      {visible.map(npc => {
        const open = !!expanded[npc.id];
        const isEditing = !!editing[npc.id];
        const rel = npc.relation || "unknown";
        return (
          <div key={npc.id} id={`entity-${npc.id}`} className={`card${npc.pinned?" pinned":""}`} style={{ padding:"1rem 1.1rem" }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap:"0.5rem", marginBottom:"0.25rem", flexWrap:"wrap" }}>
                  <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                    value={npc.name} onChange={e => upd(npc.id, "name", e.target.value)} placeholder={N.editNamePh}/>
                  <span className={`rel-badge rel-${rel}`} onClick={() => cycleRel(npc.id)}>{RL[rel]}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.25rem 0.6rem" }}>
                  <input className="iedit" style={{ fontSize:"0.88rem", fontStyle:"italic" }} value={npc.role||""} onChange={e => upd(npc.id,"role",e.target.value)} placeholder={N.editRolePh}/>
                  <input className="iedit" style={{ fontSize:"0.88rem" }} value={npc.affiliation||""} onChange={e => upd(npc.id,"affiliation",e.target.value)} placeholder={N.editAffilPh}/>
                  <input className="iedit" style={{ fontSize:"0.85rem" }} value={npc.metAt||""} onChange={e => upd(npc.id,"metAt",e.target.value)} placeholder={N.editMetAtPh}/>
                  <input className="iedit" style={{ fontSize:"0.85rem" }} value={npc.connections||""} onChange={e => upd(npc.id,"connections",e.target.value)} placeholder={N.editConnPh}/>
                </div>
              </div>
              <PrzypnijBtn pinned={npc.pinned} onToggle={() => upd(npc.id,"pinned",!npc.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(npc.id)} title="Edytuj">✎</button>
              <button className="entity-toggle" onClick={() => toggle(npc.id)}>{open ? "▲" : "▼"}</button>
            </div>

            {/* Podgląd notatek — 2 linie gdy zwinięty, pełny gdy rozwinięty */}
            {npc.notes && !isEditing && (
              <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.95rem", color:"var(--hj-text)", lineHeight:1.65, marginTop:"0.5rem", wordBreak:"break-word", opacity:0.88, ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{npc.notes}</p>
            )}

            <TagsEditor tags={npc.tags||[]} onChange={v => upd(npc.id,"tags",v)}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <textarea className="g-textarea" rows={4} placeholder={N.editNotesPh} value={npc.notes||""} onChange={e => upd(npc.id,"notes",e.target.value)}/>
                <div className="row mt05" style={{ justifyContent:"space-between" }}>
                  <button className="btn-ghost" onClick={() => del(npc.id)}>{N.delete}</button>
                  <button className="btn-ghost" onClick={() => stopEdit(npc.id)}>✓</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
