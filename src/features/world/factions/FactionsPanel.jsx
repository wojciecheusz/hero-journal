import { useState, memo } from 'react';
import { FACTION_TYPES, FACTION_RANKS, FACTION_RANK_COLORS, FACTION_RANK_ICONS } from '../../../constants/gameConstants';
import { FACTION_TYPE, FACTION_RANK } from '../../../constants/enums.js';
import { TagsEditor, FilterBar, SearchBar, PrzypnijBtn } from '../../../shared/ui';
import { useT } from '../../../i18n/translations';
import { useScrollToEntity } from '../../../hooks/useScrollToEntity';
import { useEntityList } from '../../../hooks/useEntityList';
import Icon from '../../../shared/icons';

function FactionsPanel({ factions, setFactions, openEntity }) {
  const T = useT();
  const F = T.FACTIONS;

  const [form, setForm] = useState({ name:"", type:FACTION_TYPE.GUILD, rank:FACTION_RANK.UNKNOWN, leader:"", headquarters:"", goal:"", notes:"" });
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [search, setSearch] = useState('');

  const {
    expanded, setExpanded, editing, activeTag, setActiveTag, allTags,
    upd, del, pendingDelete, toggle, startEdit, stopEdit,
  } = useEntityList(factions, setFactions);

  useScrollToEntity(openEntity, factions, setExpanded);

  const rankColor = r => FACTION_RANK_COLORS[r] || "#6a5a38";
  const displayFactionType = type => T.LABELS.factionType[type] || type;
  const displayFactionRank = rank => T.LABELS.factionRank[rank] || rank;

  const addFaction = () => {
    const n = form.name.trim(); if (!n) return;
    setFactions(l => [...l, { id: Date.now(), ...form, name: n, tags: [], pinned: false }]);
    setForm({ name:"", type:FACTION_TYPE.GUILD, rank:FACTION_RANK.UNKNOWN, leader:"", headquarters:"", goal:"", notes:"" });
    setShowForm(false);
  };

  const q = search.trim().toLowerCase();
  const visible = factions
    .filter(f => (!activeTag||(f.tags||[]).includes(activeTag)) && (!filterType||f.type===filterType))
    .filter(f => !q || [f.name, f.goal, f.notes, f.leader, f.headquarters].some(v => v?.toLowerCase().includes(q)))
    .sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));

  return (
    <>
      <div className="sect-divider sect-divider-actions">
        <span>{F.count(factions.length)}</span>
        <button className="sect-divider-btn" onClick={() => setShowForm(s => !s)}>
          {showForm ? <><Icon name="close" size="0.85em"/> {F.cancel}</> : <><Icon name="plus" size="0.85em"/> {F.add}</>}
        </button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <input className="g-input" placeholder={F.namePh} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addFaction()}/>
              <input className="g-input" placeholder={F.leaderPh} value={form.leader} onChange={e => setForm(f => ({ ...f, leader: e.target.value }))}/>
              <input className="g-input" placeholder={F.hqPh} value={form.headquarters} onChange={e => setForm(f => ({ ...f, headquarters: e.target.value }))}/>
              <input className="g-input" placeholder={F.goalPh} value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}/>
            </div>
            <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap" }}>
              {FACTION_TYPES.map(t => (
                <button key={t} className="filter-tag" style={{ opacity: form.type===t?1:0.45, borderColor: form.type===t?"currentColor":"" }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{displayFactionType(t)}</button>
              ))}
            </div>
            <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap" }}>
              {FACTION_RANKS.map(r => (
                <button key={r} className="filter-tag" style={{ opacity: form.rank===r?1:0.4, borderColor: form.rank===r?rankColor(r)+"88":"", color: form.rank===r?rankColor(r):"" }}
                  onClick={() => setForm(f => ({ ...f, rank: r }))}>{displayFactionRank(r)}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={F.notesPh} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem" }} onClick={addFaction}><Icon name="plus" size="0.85em"/> {F.addBtn}</button></div>
          </div>
        </div>
      )}

      <SearchBar value={search} onChange={setSearch}/>
      <div className="filter-bar">
        <button className={`filter-tag${!filterType?" active-filter":""}`} onClick={() => setFilterType(null)}>{F.all}</button>
        {FACTION_TYPES.map(t => { const c=factions.filter(f=>f.type===t).length; if(!c) return null; return <button key={t} className={`filter-tag${filterType===t?" active-filter":""}`} onClick={() => setFilterType(filterType===t?null:t)}>{displayFactionType(t)} ({c})</button>; })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>

      {factions.length===0 && <div className="card empty-state">{F.empty}<br/><span style={{ fontSize:"0.62rem" }}>{F.emptySub}</span></div>}

      {visible.map(fac => {
        const open = !!expanded[fac.id];
        const isEditing = !!editing[fac.id];
        const rc  = rankColor(fac.rank||FACTION_RANK.UNKNOWN);
        return (
          <div key={fac.id} id={`entity-${fac.id}`} className={`card${fac.pinned?" pinned":""}`} style={{ padding:"1rem 1.1rem", borderLeftWidth:2, borderLeftColor: rc+"55" }}>
            <div className="row" style={{ gap:"0.5rem", marginBottom:"0.2rem" }}>
              <span className="icon-badge icon-badge-circle"><Icon name={FACTION_RANK_ICONS[fac.rank||FACTION_RANK.UNKNOWN]}/></span>
              <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                value={fac.name} onChange={e => upd(fac.id,"name",e.target.value)} placeholder={F.editNamePh}/>
              <PrzypnijBtn pinned={fac.pinned} onToggle={() => upd(fac.id,"pinned",!fac.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(fac.id)} aria-label="Edit entry"><Icon name="edit" size="0.85em"/></button>
              <button className="entity-toggle" onClick={() => toggle(fac.id)} aria-label={open?"Collapse":"Expand"}><Icon name={open?"chevron-up":"chevron-down"}/></button>
            </div>
            <TagsEditor tags={fac.tags||[]} onChange={v => upd(fac.id,"tags",v)}/>

            {open && (
              <>
                <div style={{ margin:"0.4rem 0" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.15rem 0.55rem", border:`1px solid ${rc}55`, color:rc, background:`${rc}12`, borderRadius:"var(--radius-pill)" }}>{displayFactionRank(fac.rank||FACTION_RANK.UNKNOWN)}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.2rem 0.6rem", marginBottom:"0.3rem" }}>
                  <div className="pack-field"><span className="pack-field-label">{F.type}</span>
                    <select className="g-select" style={{ fontSize:"0.82rem", fontStyle:"italic", opacity:0.7 }} value={fac.type||""} onChange={e => upd(fac.id,"type",e.target.value)}>
                      <option value="">—</option>
                      {FACTION_TYPES.map(t => <option key={t} value={t}>{displayFactionType(t)}</option>)}
                    </select>
                  </div>
                  <div className="pack-field"><span className="pack-field-label">{F.leader}</span><input className="iedit" style={{ fontSize:"0.82rem", opacity:0.7 }} value={fac.leader||""} onChange={e => upd(fac.id,"leader",e.target.value)} placeholder={F.leaderEditPh}/></div>
                  <div className="pack-field"><span className="pack-field-label">{F.headquarters}</span><input className="iedit" style={{ fontSize:"0.8rem", opacity:0.55 }} value={fac.headquarters||""} onChange={e => upd(fac.id,"headquarters",e.target.value)} placeholder={F.hqEditPh}/></div>
                  <div className="pack-field"><span className="pack-field-label">{F.goal}</span><input className="iedit" style={{ fontSize:"0.8rem", opacity:0.55 }} value={fac.goal||""} onChange={e => upd(fac.id,"goal",e.target.value)} placeholder={F.goalEditPh}/></div>
                </div>

                {fac.notes && !isEditing && (
                  <p className="entry-preview" style={{ whiteSpace:"pre-wrap" }}>{fac.notes}</p>
                )}

                {isEditing && (
                  <div style={{ marginTop:"0.8rem" }}>
                    <div className="row" style={{ gap:"0.35rem", flexWrap:"wrap", marginBottom:"0.6rem" }}>
                      {FACTION_RANKS.map(r => <button key={r} className="filter-tag" style={{ opacity: fac.rank===r?1:0.35, borderColor: fac.rank===r?rankColor(r)+"88":"", color: fac.rank===r?rankColor(r):"" }} onClick={() => upd(fac.id,"rank",r)}><Icon name={FACTION_RANK_ICONS[r]} size="0.85em" color={fac.rank===r?rankColor(r):undefined}/> {displayFactionRank(r)}</button>)}
                    </div>
                    <textarea className="g-textarea" rows={4} placeholder={F.editNotesPh} value={fac.notes||""} onChange={e => upd(fac.id,"notes",e.target.value)}/>
                    <div className="row mt05" style={{ justifyContent:"space-between" }}>
                      <button className="btn-ghost" onClick={() => del(fac.id)}
                        style={pendingDelete[fac.id]?{color:"var(--hj-danger,#c94a4a)",borderColor:"var(--hj-danger,#c94a4a)",display:"flex",alignItems:"center",gap:"0.3rem"}:{}}>
                        {pendingDelete[fac.id] ? <><Icon name="warning" size="0.8em"/> {T.UI.confirmDelete}</> : F.delete}</button>
                      <button className="btn-ghost" onClick={() => stopEdit(fac.id)}><Icon name="check" size="0.85em"/></button>
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
export default memo(FactionsPanel);
