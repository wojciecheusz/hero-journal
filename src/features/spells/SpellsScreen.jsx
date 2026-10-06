import { useState, memo } from 'react';
import { SPELL_SCHOOLS, SPELL_LEVELS, STAT_KEYS, SPELL_SCHOOL_ICONS } from '../../constants/gameConstants';
import { SPELL_LEVEL, SPELL_SCHOOL } from '../../constants/enums.js';
import { TagsEditor, PrzypnijBtn, Toggle } from '../../shared/ui';
import ListToolbar from '../../shared/ListToolbar';
import { matchesSearch } from '../../utils/search';
import { SpellSlotsWidget } from '../character/widgets/SpellSlotsWidget';
import { useT } from '../../i18n/translations';
import { useEntityList } from '../../hooks/useEntityList';
import Icon from '../../shared/icons';

const numMod = v => v >= 0 ? `+${v}` : String(v);

function SpellsScreen({ spells, setSpells, char, setChar }) {
  const T  = useT();
  const SP = T.SPELLS;

  const [form, setForm] = useState({ name:"", level:SPELL_LEVEL.CANTRIP, school:SPELL_SCHOOL.EVOCATION, castingTime:"1 action", zakres:"", duration:"", components:"", description:"", notes:"" });
  const [showForm, setShowForm] = useState(false);
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeSchool, setActiveSchool] = useState(null);
  const [sortMode, setSortMode] = useState("level"); // 'level' | 'school'
  const [showSlots, setShowSlots] = useState(false);
  const [search, setSearch] = useState('');

  const {
    expanded, setExpanded, editing, activeTag, setActiveTag, allTags,
    upd, del, pendingDelete, toggle, startEdit, stopEdit,
  } = useEntityList(spells, setSpells);

  const pb = char.profBonus || 2;
  const spMod = Math.floor(((char.stats||{})[char.spellcastingAbility||"INT"]||10)-10)/2;
  const inUseCount = spells.filter(s => s.inUse).length;
  const displayLevel  = lv => T.LABELS.spellLevel[lv]  ?? lv;
  const displaySchool = sc => T.LABELS.spellSchool[sc] ?? sc;
  const filtered = spells
    .filter(s => !activeLevel  || s.level === activeLevel)
    .filter(s => !activeSchool || s.school === activeSchool)
    .filter(s => !activeTag || (s.tags || []).includes(activeTag))
    .filter(s => matchesSearch(search, [s.name, s.description, s.notes, displaySchool(s.school), displayLevel(s.level), ...(s.tags || [])]));
  const visible = [...filtered].sort((a, b) => {
    const pinDiff = (b.pinned?1:0) - (a.pinned?1:0);
    if (pinDiff) return pinDiff;
    if (sortMode === "school") return (a.school||"").localeCompare(b.school||"") || SPELL_LEVELS.indexOf(a.level) - SPELL_LEVELS.indexOf(b.level);
    return SPELL_LEVELS.indexOf(a.level) - SPELL_LEVELS.indexOf(b.level) || (a.name||"").localeCompare(b.name||"");
  });

  const groupCantrips = visible.filter(sp => sp.level === SPELL_LEVEL.CANTRIP);
  const groupActive   = visible.filter(sp => sp.level !== SPELL_LEVEL.CANTRIP);

  const addSpell = () => {
    const n = form.name.trim(); if (!n) return;
    setSpells(l => [...l, { id: Date.now(), ...form, name: n, tags: [], pinned: false, inUse: false }]);
    setForm({ name:"", level:SPELL_LEVEL.CANTRIP, school:SPELL_SCHOOL.EVOCATION, castingTime:"1 action", zakres:"", duration:"", components:"", description:"", notes:"" });
    setShowForm(false);
  };
  const toggleInUse = id => setSpells(l => l.map(x => x.id===id ? { ...x, inUse: !x.inUse } : x));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setShowForm(f => !f)} addActive={showForm} addLabel={SP.add}
        summary={[SP.count(spells.length, inUseCount), T.LIST.shown(visible.length, spells.length)].filter(Boolean).join(" · ")}
        extraActions={
          <button className={`hj-btn spell-slots-btn${showSlots ? " on" : ""}`} aria-expanded={showSlots} onClick={() => setShowSlots(s => !s)}>
            <Icon name={showSlots ? "close" : "settings"} size="1em"/> <span>{showSlots ? SP.hideSlots : SP.manageSlots}</span>
          </button>
        }
        filterGroups={[
          { key:"sort", label:T.LIST.sortBy, value:sortMode, onChange:setSortMode, isSort:true,
            options: [{ value:"level", label:SP.sortByLevel }, { value:"school", label:SP.sortBySchool }] },
          { key:"level", label:T.LIST.level, value:activeLevel, onChange:setActiveLevel,
            options: SPELL_LEVELS.map((lv, i) => ({ value:lv, label:T.SPELL_LEVELS[i] ?? lv, count:spells.filter(s => s.level === lv).length })).filter(o => o.count) },
          { key:"school", label:T.LIST.school, value:activeSchool, onChange:setActiveSchool,
            options: SPELL_SCHOOLS.map((sc, i) => ({ value:sc, label:T.SPELL_SCHOOLS[i] ?? sc, icon:SPELL_SCHOOL_ICONS[sc], count:spells.filter(s => s.school === sc).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:tag, count:spells.filter(x => (x.tags||[]).includes(tag)).length })) },
        ]}/>

      {showSlots && (
        <div className="card" style={{ borderColor:"var(--hj-spell-border)" }}>
          <div className="sect-divider">{SP.slotsSectionTitle}</div>
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.7rem", flexWrap:"wrap" }}>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.54rem", letterSpacing:"0.14em", color:"var(--hj-spell-muted)", textTransform:"uppercase" }}>{SP.castingAbility}</span>
            <select className="g-select" style={{ width:"auto", fontSize:"0.82rem", padding:"0.25rem 0.5rem", borderColor:"#1a3a6a" }}
              value={char.spellcastingAbility||"INT"} onChange={e => setChar(c => ({ ...c, spellcastingAbility: e.target.value }))}>
              {STAT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.72rem", color:"var(--hj-spell-accent)" }}>{SP.spellStats(8+pb+spMod, numMod(pb+spMod))}</span>
          </div>
          <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
        </div>
      )}

      {showForm && (
        <div className="add-form" style={{ borderColor:"var(--hj-spell-border)" }}>
          <div className="col">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <input className="g-input" placeholder={SP.namePh} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addSpell()}/>
              <select className="g-select" value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))}>
                {SPELL_SCHOOLS.map((s,i) => <option key={s} value={s}>{T.SPELL_SCHOOLS[i]??s}</option>)}
              </select>
            </div>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {SPELL_LEVELS.map((lv,i) => (
                <button key={lv} className="filter-tag" style={{ opacity: form.level===lv?1:0.45, borderColor: form.level===lv?"var(--hj-spell-border)":"", color: form.level===lv?"var(--hj-spell-accent)":"" }}
                  onClick={() => setForm(f => ({ ...f, level: lv }))}>{T.SPELL_LEVELS[i]??lv}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem" }}>
              <div className="pack-field"><span className="pack-field-label">{SP.castingTime}</span><input className="pack-field-input" placeholder={SP.castingTimePh} value={form.castingTime} onChange={e => setForm(f => ({ ...f, castingTime: e.target.value }))}/></div>
              <div className="pack-field"><span className="pack-field-label">{SP.range}</span><input className="pack-field-input" placeholder={SP.rangePh} value={form.zakres} onChange={e => setForm(f => ({ ...f, zakres: e.target.value }))}/></div>
              <div className="pack-field"><span className="pack-field-label">{SP.duration}</span><input className="pack-field-input" placeholder={SP.durationPh} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}/></div>
            </div>
            <input className="g-input" placeholder={SP.components} value={form.components} onChange={e => setForm(f => ({ ...f, components: e.target.value }))}/>
            <textarea className="g-textarea" rows={3} placeholder={SP.descPh} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem" }} onClick={addSpell}><Icon name="plus" size="0.85em"/> {SP.save}</button></div>
          </div>
        </div>
      )}

      {spells.length===0 && <div className="card empty-state">{SP.empty}</div>}
      {spells.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {groupCantrips.length > 0 && <div className="sect-divider">{SP.cantripsTitle}</div>}
        {groupCantrips.map(renderSpell)}
        {groupActive.length > 0 && <div className="sect-divider">{SP.activeSpellsTitle}</div>}
        {groupActive.map(renderSpell)}
      </div>
    </>
  );

  function renderSpell(sp) {
        const open = !!expanded[sp.id];
        const isEditing = !!editing[sp.id];
        return (
          <div key={sp.id} id={`entity-${sp.id}`} className={`card${sp.pinned?" pinned":""}${sp.inUse?" spell-active":""}${open?" is-open":""}`} style={{ padding:"1rem 1.1rem", borderLeftColor:"var(--hj-spell-border)", borderLeftWidth:2 }}>
            <div className="entity-header">
              <span className="icon-badge"><Icon name={SPELL_SCHOOL_ICONS[sp.school] || "diamond"}/></span>
              <div className="flex1">
                <div style={{ display:"flex", flexDirection:"column", gap:"0.2rem", flex:1, minWidth:0 }}>
                  <input className="iedit" style={{ fontFamily:"Cinzel,serif", fontSize:"0.98rem", color:"var(--hj-spell-text)", fontWeight:700, width:"100%" }}
                    value={sp.name} onChange={e => upd(sp.id,"name",e.target.value)} placeholder={SP.editNamePh}/>
                  <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap", alignItems:"center" }}>
                    <span className="spell-level-badge">{displayLevel(sp.level)}</span>
                    {sp.school && <span className="spell-school-badge">{displaySchool(sp.school)}</span>}
                    <Toggle on={!!sp.inUse} onToggle={() => toggleInUse(sp.id)} label={sp.inUse?SP.prepared:SP.known} color="blue"/>
                  </div>
                </div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.08em", color:"var(--hj-spell-muted)" }}>
                  {[sp.castingTime, sp.zakres&&`${SP.rangeLbl}: ${sp.zakres}`, sp.duration&&`${SP.durationLbl}: ${sp.duration}`].filter(Boolean).join(" · ")}
                </div>
              </div>
              <PrzypnijBtn pinned={sp.pinned} onToggle={() => upd(sp.id,"pinned",!sp.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(sp.id)} aria-label="Edit entry"><Icon name="edit" size="0.85em"/></button>
              <button className="entity-toggle" onClick={() => toggle(sp.id)}><Icon name={open?"chevron-up":"chevron-down"}/></button>
            </div>

            {/* Podgląd opisu — 2 linie gdy zwinięty, pełny gdy rozwinięty */}
            {sp.description && !isEditing && (
              <p className="entry-preview" style={{ ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{sp.description}</p>
            )}
            {sp.notes && !isEditing && open && (
              <p className="entry-preview" style={{ fontSize:"0.88rem", whiteSpace:"pre-wrap", opacity:0.65 }}>{sp.notes}</p>
            )}

            <TagsEditor tags={sp.tags||[]} onChange={v => upd(sp.id,"tags",v)}
              suggestions={(sp.tags||[]).some(t => (T.UI.SUGGESTED_ACTION_TAGS||[]).includes(t)) ? [] : T.UI.SUGGESTED_ACTION_TAGS}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"0.7rem" }}>
                  <div>
                    <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.12em", color:"var(--hj-spell-muted)", textTransform:"uppercase", display:"block", marginBottom:"0.2rem" }}>{SP.level}</span>
                    <select className="g-select" style={{ fontSize:"0.82rem", padding:"0.25rem 0.5rem", borderColor:"var(--hj-spell-border)" }} value={sp.level} onChange={e => upd(sp.id,"level",e.target.value)}>
                      {SPELL_LEVELS.map((lv,i) => <option key={lv} value={lv}>{T.SPELL_LEVELS[i]??lv}</option>)}
                    </select>
                  </div>
                  <div>
                    <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.12em", color:"var(--hj-spell-muted)", textTransform:"uppercase", display:"block", marginBottom:"0.2rem" }}>{SP.school}</span>
                    <select className="g-select" style={{ fontSize:"0.82rem", padding:"0.25rem 0.5rem", borderColor:"var(--hj-spell-border)" }} value={sp.school} onChange={e => upd(sp.id,"school",e.target.value)}>
                      {SPELL_SCHOOLS.map((s,i) => <option key={s} value={s}>{T.SPELL_SCHOOLS[i]??s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", marginBottom:"0.7rem" }}>
                  <div className="pack-field"><span className="pack-field-label">{SP.castingTimeLbl}</span><input className="pack-field-input" value={sp.castingTime||""} onChange={e => upd(sp.id,"castingTime",e.target.value)}/></div>
                  <div className="pack-field"><span className="pack-field-label">{SP.rangeLbl}</span><input className="pack-field-input" value={sp.zakres||""} onChange={e => upd(sp.id,"zakres",e.target.value)}/></div>
                  <div className="pack-field"><span className="pack-field-label">{SP.durationLbl}</span><input className="pack-field-input" value={sp.duration||""} onChange={e => upd(sp.id,"duration",e.target.value)}/></div>
                </div>
                <div className="pack-field" style={{ marginBottom:"0.6rem" }}><span className="pack-field-label">{SP.componentsLbl}</span><input className="pack-field-input" value={sp.components||""} placeholder={SP.componentsPh} onChange={e => upd(sp.id,"components",e.target.value)}/></div>
                <textarea className="g-textarea" rows={4} placeholder={SP.fullDescPh} value={sp.description||""} onChange={e => upd(sp.id,"description",e.target.value)}/>
                <div style={{ marginTop:"0.5rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.12em", color:"var(--hj-spell-muted)", textTransform:"uppercase", display:"block", marginBottom:"0.25rem" }}>{SP.higherLevels}</span>
                  <textarea className="g-textarea" rows={2} value={sp.notes||""} placeholder={SP.higherLevelsPh} onChange={e => upd(sp.id,"notes",e.target.value)}/>
                </div>
                <div className="row mt05" style={{ justifyContent:"space-between" }}>
                  <button className="btn-ghost" onClick={() => del(sp.id)}
                    style={pendingDelete[sp.id]?{color:"var(--hj-danger,#c94a4a)",borderColor:"var(--hj-danger,#c94a4a)",display:"flex",alignItems:"center",gap:"0.3rem"}:{}}>
                    {pendingDelete[sp.id] ? <><Icon name="warning" size="0.8em"/> {T.UI.confirmDelete}</> : SP.delete}</button>
                  <button className="btn-ghost" onClick={() => stopEdit(sp.id)}><Icon name="check" size="0.85em"/></button>
                </div>
              </div>
            )}
          </div>
        );
  }
}
export default memo(SpellsScreen);
