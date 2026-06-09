import { useState, memo } from 'react';
import { REL_ICONS } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, SearchBar, PrzypnijBtn } from '../../shared/ui';
import { useT } from '../../i18n/translations';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';

function NPCsScreen({ title, npcs, setNPCs, openEntity }) {
  const T  = useT();
  const N  = T.NPCS;
  const RL = T.REL_LABELS;

  const [formState, setForm] = useState({ name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:"" });
  const [showForm, setShowForm] = useState(false);
  const [filterRel, setFilterRel] = useState(null);
  const [search, setSearch] = useState('');

  const {
    expanded, setExpanded, editing, activeTag, setActiveTag, allTags,
    upd, del, pendingDelete, toggle, startEdit, stopEdit,
  } = useEntityList(npcs, setNPCs);

  useScrollToEntity(openEntity, npcs, setExpanded);

  const addNPC = () => {
    const n = formState.name.trim(); if (!n) return;
    setNPCs(l => [...l, { id: Date.now(), ...formState, name: n, tags: [], pinned: false }]);
    setForm({ name:"", role:"", relation:"unknown", affiliation:"", metAt:"", connections:"", notes:"" });
    setShowForm(false);
  };

  const q = search.trim().toLowerCase();
  const visible = npcs
    .filter(n => !activeTag || (n.tags || []).includes(activeTag))
    .filter(n => !filterRel || (n.relation || "unknown") === filterRel)
    .filter(n => !q || [n.name, n.role, n.affiliation, n.notes, n.connections]
      .some(f => f?.toLowerCase().includes(q)))
    .sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));

  return (
    <>
      <div className="screen-col-header">
        <span className="col-title">{title}</span>
        <span className="col-actions">
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{N.count(npcs.length)}</span>
          <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? N.cancel : N.add}</button>
        </span>
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

      <SearchBar value={search} onChange={setSearch}/>
      <div className="filter-bar">
        <button className={`filter-tag${!filterRel?" active-filter":""}`} onClick={() => setFilterRel(null)}>{T.UI.filterAll}</button>
        {["unknown","ally","neutral","hostile"].map(r => {
          const c = npcs.filter(n => (n.relation||"unknown")===r).length;
          if (!c) return null;
          return (
            <button key={r} className={`filter-tag${filterRel===r?" active-filter":""}`} onClick={() => setFilterRel(filterRel===r?null:r)}>
              <span className="badge-icon">{REL_ICONS[r]}</span> {RL[r]} ({c})
            </button>
          );
        })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>
      {npcs.length === 0 && <div className="card empty-state">{N.empty}</div>}

      {visible.map(npc => {
        const open = !!expanded[npc.id];
        const isEditing = !!editing[npc.id];
        const rel = npc.relation || "unknown";
        return (
          <div key={npc.id} id={`entity-${npc.id}`} className={`card${npc.pinned?" pinned":""}`} style={{ padding:"1rem 1.1rem" }}>
            <div className="row" style={{ gap:"0.5rem", marginBottom:"0.2rem" }}>
              <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{REL_ICONS[rel]}</span>
              <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                value={npc.name} onChange={e => upd(npc.id, "name", e.target.value)} placeholder={N.editNamePh}/>
              <PrzypnijBtn pinned={npc.pinned} onToggle={() => upd(npc.id,"pinned",!npc.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(npc.id)} aria-label="Edit entry">✎</button>
              <button className="entity-toggle" onClick={() => toggle(npc.id)} aria-label={open?"Collapse":"Expand"}>{open ? "▲" : "▼"}</button>
            </div>

            <TagsEditor tags={npc.tags||[]} onChange={v => upd(npc.id,"tags",v)}/>

            {open && (
              <>
                <div style={{ margin:"0.4rem 0" }}>
                  <span className={`rel-badge rel-${rel}`}>{RL[rel]}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.25rem 0.6rem", marginBottom:"0.3rem" }}>
                  <div className="pack-field"><span className="pack-field-label">{N.role}</span><input className="iedit" style={{ fontSize:"0.88rem", fontStyle:"italic" }} value={npc.role||""} onChange={e => upd(npc.id,"role",e.target.value)} placeholder={N.editRolePh}/></div>
                  <div className="pack-field"><span className="pack-field-label">{N.affiliation}</span><input className="iedit" style={{ fontSize:"0.88rem" }} value={npc.affiliation||""} onChange={e => upd(npc.id,"affiliation",e.target.value)} placeholder={N.editAffilPh}/></div>
                  <div className="pack-field"><span className="pack-field-label">{N.metAt}</span><input className="iedit" style={{ fontSize:"0.85rem" }} value={npc.metAt||""} onChange={e => upd(npc.id,"metAt",e.target.value)} placeholder={N.editMetAtPh}/></div>
                  <div className="pack-field"><span className="pack-field-label">{N.connections}</span><input className="iedit" style={{ fontSize:"0.85rem" }} value={npc.connections||""} onChange={e => upd(npc.id,"connections",e.target.value)} placeholder={N.editConnPh}/></div>
                </div>

                {npc.notes && !isEditing && (
                  <p className="entry-preview" style={{ whiteSpace:"pre-wrap" }}>{npc.notes}</p>
                )}

                {isEditing && (
                  <div style={{ marginTop:"0.8rem" }}>
                    <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap", marginBottom:"0.6rem" }}>
                      {["unknown","ally","neutral","hostile"].map(r => (
                        <button key={r} className="filter-tag" style={{ opacity: rel===r?1:0.4, borderColor: rel===r?"currentColor":"" }}
                          onClick={() => upd(npc.id,"relation",r)}>{REL_ICONS[r]} {RL[r]}</button>
                      ))}
                    </div>
                    <textarea className="g-textarea" rows={4} placeholder={N.editNotesPh} value={npc.notes||""} onChange={e => upd(npc.id,"notes",e.target.value)}/>
                    <div className="row mt05" style={{ justifyContent:"space-between" }}>
                      <button className="btn-ghost" onClick={() => del(npc.id)}
                        style={pendingDelete[npc.id]?{color:"var(--hj-danger,#c94a4a)",borderColor:"var(--hj-danger,#c94a4a)"}:{}}>
                        {pendingDelete[npc.id] ? T.UI.confirmDelete : N.delete}</button>
                      <button className="btn-ghost" onClick={() => stopEdit(npc.id)}>✓</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
export default memo(NPCsScreen);
