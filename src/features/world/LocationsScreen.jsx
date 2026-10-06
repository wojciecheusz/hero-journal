import { useState, memo } from 'react';
import { LOC_TYPES, LOC_TYPE_ICONS } from '../../constants/gameConstants';
import { LOC_TYPE } from '../../constants/enums.js';
import { TagsEditor, PrzypnijBtn } from '../../shared/ui';
import ListToolbar from '../../shared/ListToolbar';
import { matchesSearch } from '../../utils/search';
import { useT } from '../../i18n/translations';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';
import Icon from '../../shared/icons';

function LocationsScreen({ locations, setLocations, openEntity }) {
  const T = useT();

  const [form, setForm] = useState({ name:"", type:LOC_TYPE.SETTLEMENT, notes:"", tags:[] });
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [search, setSearch] = useState('');

  const {
    expanded, setExpanded, editing, activeTag, setActiveTag, allTags,
    upd, del, pendingDelete, toggle, startEdit, stopEdit,
  } = useEntityList(locations, setLocations);

  useScrollToEntity(openEntity, locations, setExpanded);

  const addLoc = () => {
    const n = form.name.trim(); if (!n) return;
    setLocations(l => [...l, { id: Date.now(), name: n, type: form.type, notes: form.notes.trim(), tags: form.tags, pinned: false }]);
    setForm({ name:"", type:LOC_TYPE.SETTLEMENT, notes:"", tags:[] });
    setShowForm(false);
  };

  const displayLocType = type => T.LABELS.locType[type] || type;
  const visible = locations
    .filter(l => !activeTag || (l.tags || []).includes(activeTag))
    .filter(l => !filterType || l.type === filterType)
    .filter(l => matchesSearch(search, [l.name, l.notes, displayLocType(l.type), ...(l.tags || [])]))
    .sort((a, b) => (b.pinned?1:0) - (a.pinned?1:0));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setShowForm(f => !f)} addActive={showForm} addLabel={T.LOCATIONS.add}
        summary={[T.LOCATIONS.count(locations.length), T.LIST.shown(visible.length, locations.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"type", label:T.LIST.type, value:filterType, onChange:setFilterType,
            options: LOC_TYPES.map(type => ({ value:type, label:displayLocType(type), icon:LOC_TYPE_ICONS[type], count:locations.filter(l => l.type === type).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:tag, count:locations.filter(x => (x.tags||[]).includes(tag)).length })) },
        ]}/>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder={T.LOCATIONS.namePh} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addLoc()}/>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {LOC_TYPES.map((type) => (
                <button key={type} className="filter-tag" style={{ opacity: form.type===type?1:0.45, borderColor: form.type===type?"currentColor":"" }}
                  onClick={() => setForm(f => ({ ...f, type }))}><Icon name={LOC_TYPE_ICONS[type]} size="0.85em"/> {displayLocType(type)}</button>
              ))}
            </div>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {(T.UI.SUGGESTED_LOCATION_TAGS||[]).map((tag) => (
                <button key={tag} className="tag tag-suggestion" style={{ opacity: form.tags.includes(tag) ? 1 : 0.45 }}
                  onClick={() => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))}>
                  <Icon name={form.tags.includes(tag) ? "check" : "plus"} size="0.85em"/> {tag}
                </button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={T.LOCATIONS.notesPh} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem" }} onClick={addLoc}><Icon name="plus" size="0.85em"/> {T.LOCATIONS.addBtn}</button></div>
          </div>
        </div>
      )}

      {locations.length === 0 && <div className="card empty-state">{T.LOCATIONS.empty}</div>}
      {locations.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
      {visible.map(loc => {
        const open = !!expanded[loc.id];
        const isEditing = !!editing[loc.id];
        return (
          <div key={loc.id} id={`entity-${loc.id}`} className={`card${loc.pinned?" pinned":""}${open?" is-open":""}`} style={{ padding:"1rem 1.1rem" }}>
            <div className="row" style={{ gap:"0.5rem", marginBottom:"0.2rem" }}>
              <span className="icon-badge icon-badge-circle"><Icon name={LOC_TYPE_ICONS[loc.type]}/></span>
              <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700 }}
                value={loc.name} onChange={e => upd(loc.id, "name", e.target.value)} placeholder={T.LOCATIONS.editNamePh}/>
              <PrzypnijBtn pinned={loc.pinned} onToggle={() => upd(loc.id, "pinned", !loc.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(loc.id)} aria-label="Edit location"><Icon name="edit" size="0.85em"/></button>
              <button className="entity-toggle" onClick={() => toggle(loc.id)} aria-label={open ? "Collapse" : "Expand"}><Icon name={open ? "chevron-up" : "chevron-down"}/></button>
            </div>
            <TagsEditor tags={loc.tags || []} onChange={v => upd(loc.id, "tags", v)}/>

            {open && (
              <>
                <div style={{ margin:"0.4rem 0" }}>
                  <span className="loc-type">{displayLocType(loc.type)}</span>
                </div>

                {loc.notes && !isEditing && (
                  <p className="entry-preview" style={{ whiteSpace:"pre-wrap" }}>{loc.notes}</p>
                )}

                {isEditing && (
                  <div style={{ marginTop:"0.8rem" }}>
                    <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.7rem" }}>
                      {LOC_TYPES.map((type) => (
                        <button key={type} className="filter-tag" style={{ opacity: loc.type===type?1:0.4, borderColor: loc.type===type?"currentColor":"" }}
                          onClick={() => upd(loc.id, "type", type)}><Icon name={LOC_TYPE_ICONS[type]} size="0.85em"/> {displayLocType(type)}</button>
                      ))}
                    </div>
                    <textarea className="g-textarea" rows={4} placeholder={T.LOCATIONS.editNotesPh} value={loc.notes||""} onChange={e => upd(loc.id, "notes", e.target.value)}/>
                    <div className="row mt05" style={{ justifyContent:"space-between" }}>
                      <button className="btn-ghost" onClick={() => del(loc.id)}
                        style={pendingDelete[loc.id]?{color:"var(--hj-danger,#c94a4a)",borderColor:"var(--hj-danger,#c94a4a)",display:"flex",alignItems:"center",gap:"0.3rem"}:{}}>
                        {pendingDelete[loc.id] ? <><Icon name="warning" size="0.8em"/> {T.UI.confirmDelete}</> : T.LOCATIONS.delete}</button>
                      <button className="btn-ghost" onClick={() => stopEdit(loc.id)}><Icon name="check" size="0.85em"/></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
      </div>
    </>
  );
}
export default memo(LocationsScreen);
