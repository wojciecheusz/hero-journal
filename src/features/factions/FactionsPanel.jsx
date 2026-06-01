import { useState, useEffect } from 'react';
import { FACTION_TYPES, FACTION_RANKS, FACTION_RANK_COLORS } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, PrzypnijBtn } from '../../shared/ui';
import { useT } from '../../i18n/translations';

export default function FactionsPanel({ factions, setFactions, openEntity }) {
  const T  = useT();
  const F  = T.FACTIONS;

  const [form, setForm] = useState({ name:"", type:"Gildia", rank:"Nieznany", leader:"", headquarters:"", goal:"", notes:"" });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = factions.find(f => f.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 150);
    }
  }, [openEntity]);

  const allTags = [...new Set(factions.flatMap(f => f.tags || []))].sort();
  const rankColor = r => FACTION_RANK_COLORS[r] || "#6a5a38";

  const addFaction = () => {
    const n = form.name.trim(); if (!n) return;
    setFactions(l => [...l, { id: Date.now(), ...form, name: n, tags: [], pinned: false, reputation: 0 }]);
    setForm({ name:"", type:"Gildia", rank:"Nieznany", leader:"", headquarters:"", goal:"", notes:"" });
    setShowForm(false);
  };
  const upd = (id, f, v) => setFactions(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => setFactions(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const cycleRank = id => setFactions(l => l.map(x => {
    if (x.id !== id) return x;
    const idx = FACTION_RANKS.indexOf(x.rank || "Nieznany");
    return { ...x, rank: FACTION_RANKS[(idx + 1) % FACTION_RANKS.length] };
  }));

  const visible = factions.filter(f => (!activeTag || (f.tags || []).includes(activeTag)) && (!filterType || f.type === filterType)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{F.count(factions.length)}</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? F.cancel : F.add}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <input className="g-input" placeholder={F.namePh} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addFaction()}/>
              <input className="g-input" placeholder={F.leaderPh} value={form.leader} onChange={e => setForm(f => ({ ...f, leader: e.target.value }))}/>
              <input className="g-input" placeholder={F.hqPh} value={form.headquarters} onChange={e => setForm(f => ({ ...f, headquarters: e.target.value }))}/>
              <input className="g-input" placeholder={F.goalPh} value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}/>
            </div>
            <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap" }}>
              {FACTION_TYPES.map(t => (
                <button key={t} className="filter-tag" style={{ opacity: form.type === t ? 1 : 0.45, borderColor: form.type === t ? "currentColor" : "" }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
              ))}
            </div>
            <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap" }}>
              {FACTION_RANKS.map(r => (
                <button key={r} className="filter-tag" style={{ opacity: form.rank === r ? 1 : 0.4, borderColor: form.rank === r ? rankColor(r) + "88" : "", color: form.rank === r ? rankColor(r) : "" }}
                  onClick={() => setForm(f => ({ ...f, rank: r }))}>{r}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={F.notesPh} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addFaction}>{F.addBtn}</button></div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-tag${!filterType ? " active-filter" : ""}`} onClick={() => setFilterType(null)}>{F.all}</button>
        {FACTION_TYPES.map(t => { const c = factions.filter(f => f.type === t).length; if (!c) return null; return <button key={t} className={`filter-tag${filterType === t ? " active-filter" : ""}`} onClick={() => setFilterType(filterType === t ? null : t)}>{t} ({c})</button>; })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>

      {factions.length === 0 && <div className="card empty-state">{F.empty}<br/><span style={{ fontSize:"0.62rem" }}>{F.emptySub}</span></div>}
      {visible.map(fac => {
        const open = !!expanded[fac.id];
        const rc = rankColor(fac.rank || "Nieznany");
        const rep = fac.reputation || 0;
        return (
          <div key={fac.id} id={`entity-${fac.id}`} className={`card${fac.pinned ? " pinned" : ""}`} style={{ padding:"1rem 1.1rem", borderLeftWidth:2, borderLeftColor: rc + "55" }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap:"0.5rem", marginBottom:"0.25rem", flexWrap:"wrap" }}>
                  <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                    value={fac.name} onChange={e => upd(fac.id, "name", e.target.value)} placeholder={F.editNamePh}/>
                  <span onClick={() => cycleRank(fac.id)} style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.15rem 0.55rem", border:`1px solid ${rc}55`, color:rc, background:`${rc}12`, cursor:"pointer", flexShrink:0, userSelect:"none" }}>{fac.rank || "Nieznany"}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.2rem 0.6rem" }}>
                  <input className="iedit" style={{ fontSize:"0.82rem", fontStyle:"italic", opacity:0.7 }} value={fac.type || ""} onChange={e => upd(fac.id, "type", e.target.value)} placeholder="…"/>
                  <input className="iedit" style={{ fontSize:"0.82rem", opacity:0.7 }} value={fac.leader || ""} onChange={e => upd(fac.id, "leader", e.target.value)} placeholder={F.leaderEditPh}/>
                  <input className="iedit" style={{ fontSize:"0.8rem", opacity:0.55 }} value={fac.headquarters || ""} onChange={e => upd(fac.id, "headquarters", e.target.value)} placeholder={F.hqEditPh}/>
                  <input className="iedit" style={{ fontSize:"0.8rem", opacity:0.55 }} value={fac.goal || ""} onChange={e => upd(fac.id, "goal", e.target.value)} placeholder={F.goalEditPh}/>
                </div>
                <div style={{ marginTop:"0.4rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.1em", opacity:0.5, textTransform:"uppercase", flexShrink:0 }}>{F.reputation}</span>
                  <input type="range" min={-100} max={100} value={rep} onChange={e => upd(fac.id, "reputation", parseInt(e.target.value))}
                    style={{ flex:1, accentColor: rep > 0 ? "#5a9a5a" : rep < 0 ? "#8a3a3a" : "#6a5a38", cursor:"pointer" }}/>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.65rem", fontWeight:700, minWidth:36, textAlign:"right", color: rep > 50 ? "#5a9a5a" : rep > 0 ? "#8a9a5a" : rep < -50 ? "#8a3a3a" : rep < 0 ? "#9a6a3a" : "#6a5a38" }}>{rep > 0 ? "+" : ""}{rep}</span>
                </div>
              </div>
              <PrzypnijBtn pinned={fac.pinned} onToggle={() => upd(fac.id, "pinned", !fac.pinned)}/>
              <button className="entity-toggle" onClick={() => toggle(fac.id)}>{open ? "▲" : "▼"}</button>
            </div>
            <TagsEditor tags={fac.tags || []} onChange={v => upd(fac.id, "tags", v)}/>
            {open && (
              <div style={{ marginTop:"0.8rem" }}>
                <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap", marginBottom:"0.6rem" }}>
                  {FACTION_RANKS.map(r => <button key={r} className="filter-tag" style={{ opacity: fac.rank === r ? 1 : 0.35, borderColor: fac.rank === r ? rankColor(r) + "88" : "", color: fac.rank === r ? rankColor(r) : "" }} onClick={() => upd(fac.id, "rank", r)}>{r}</button>)}
                </div>
                <textarea className="g-textarea" rows={4} placeholder={F.editNotesPh} value={fac.notes || ""} onChange={e => upd(fac.id, "notes", e.target.value)}/>
                <div className="row mt05" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={() => del(fac.id)}>{F.delete}</button></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
