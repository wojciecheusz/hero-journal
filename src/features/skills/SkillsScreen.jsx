import { useState, memo } from 'react';
import { SKILL_CATS, SKILL_CAT_ICONS } from '../../constants/gameConstants';
import { SKILL_CAT } from '../../constants/enums.js';
import { TagsEditor, PrzypnijBtn, Toggle } from '../../shared/ui';
import ListToolbar from '../../shared/ListToolbar';
import { matchesSearch } from '../../utils/search';
import { useT } from '../../i18n/translations';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';
import { useEntityList } from '../../hooks/useEntityList';
import Icon from '../../shared/icons';

const catColor = cat => ({
  // Enum keys (po migracji)
  [SKILL_CAT.SKILL]:  "#c9943e",
  [SKILL_CAT.RACIAL]: "#4a8aaa",
  [SKILL_CAT.FEAT]:   "#9a6030",
  // Legacy Polish keys (sprzed migracji)
  "Umiejętność":  "#c9943e",
  "Cecha rasowa": "#4a8aaa",
  "Atut":         "#9a6030",
  // Legacy English display labels
  "Skill":           "#c9943e",
  "Racial Feature":  "#4a8aaa",
  "Feat":            "#9a6030",
})[cat] || "#8a7848";

function SkillsScreen({ skills, setSkills, openEntity }) {
  const T    = useT();
  const SK   = T.SKILLS;
  const CATS = T.SKILL_CATS;

  const [form, setForm] = useState({ name:"", category: SKILL_CAT.SKILL, description:"", level:0 });
  const [showForm, setShowForm] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');

  const {
    expanded, setExpanded, editing, activeTag, setActiveTag, allTags,
    upd, del, pendingDelete, toggle, startEdit, stopEdit,
  } = useEntityList(skills, setSkills);

  useScrollToEntity(openEntity, skills, setExpanded);

  const inUseCount = skills.filter(s => s.inUse).length;

  const addSkill = () => {
    const n = form.name.trim(); if (!n) return;
    setSkills(l => [...l, { id: Date.now(), name: n, category: form.category, description: form.description.trim(), level: form.level, tags: [], pinned: false, inUse: false }]);
    setForm({ name:"", category: SKILL_CAT.SKILL, description:"", level:0 });
    setShowForm(false);
  };
  const toggleInUse = id => setSkills(l => l.map(x => x.id===id ? { ...x, inUse: !x.inUse } : x));

  const RACIAL_VALUES = [SKILL_CAT.RACIAL, "Cecha rasowa", "Racial Feature"];
  const FEAT_VALUES   = [SKILL_CAT.FEAT, "Atut", "Feat"];
  /* Kategoria kanoniczna — obsługuje też stare wartości PL/EN sprzed migracji */
  const catKey = c => RACIAL_VALUES.includes(c) ? SKILL_CAT.RACIAL : FEAT_VALUES.includes(c) ? SKILL_CAT.FEAT : SKILL_CAT.SKILL;
  const catLabel = c => CATS[SKILL_CATS.indexOf(catKey(c))] ?? c;

  const visible = skills.filter(s =>
    (!activeTag || (s.tags||[]).includes(activeTag)) &&
    (!activeCat || catKey(s.category) === activeCat) &&
    matchesSearch(search, [s.name, s.description, catLabel(s.category), ...(s.tags || [])])
  ).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));
  const groupRacial = visible.filter(sk => RACIAL_VALUES.includes(sk.category));
  const groupFeats  = visible.filter(sk => FEAT_VALUES.includes(sk.category));
  const groupClass  = visible.filter(sk => !RACIAL_VALUES.includes(sk.category) && !FEAT_VALUES.includes(sk.category));

  return (
    <>
      <ListToolbar
        search={search} onSearch={setSearch}
        onAdd={() => setShowForm(f => !f)} addActive={showForm} addLabel={SK.add}
        summary={[SK.count(skills.length, inUseCount), T.LIST.shown(visible.length, skills.length)].filter(Boolean).join(" · ")}
        filterGroups={[
          { key:"cat", label:T.LIST.category, value:activeCat, onChange:setActiveCat,
            options: SKILL_CATS.map((c, i) => ({ value:c, label:CATS[i], icon:SKILL_CAT_ICONS[c], count:skills.filter(s => catKey(s.category) === c).length })).filter(o => o.count) },
          { key:"tag", label:T.LIST.tags, value:activeTag, onChange:setActiveTag,
            options: allTags.map(tag => ({ value:tag, label:tag, count:skills.filter(x => (x.tags||[]).includes(tag)).length })) },
        ]}/>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder={SK.namePh} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addSkill()}/>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {CATS.map((c,i) => (
                <button key={c} className="filter-tag" style={{ opacity: form.category===c?1:0.45, borderColor: form.category===c?catColor(c)+"88":"", color: form.category===c?catColor(c):"" }}
                  onClick={() => setForm(f => ({ ...f, category: c }))}><Icon name={SKILL_CAT_ICONS[SKILL_CATS[i]]} size="0.85em"/> {c}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={SK.descPh} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem" }} onClick={addSkill}><Icon name="plus" size="0.85em"/> {SK.addBtn}</button></div>
          </div>
        </div>
      )}

      {skills.length===0 && <div className="card empty-state">{SK.empty}</div>}
      {skills.length > 0 && visible.length === 0 && <div className="card empty-state">{T.LIST.noResults}</div>}

      <div className="entity-grid">
        {groupRacial.length > 0 && <div className="sect-divider">{SK.sectionRacial}</div>}
        {groupRacial.map(renderSkill)}
        {groupClass.length > 0 && <div className="sect-divider">{SK.sectionClass}</div>}
        {groupClass.map(renderSkill)}
        {groupFeats.length > 0 && <div className="sect-divider">{SK.sectionFeats}</div>}
        {groupFeats.map(renderSkill)}
      </div>
    </>
  );

  function renderSkill(sk) {
        const open = !!expanded[sk.id];
        const isEditing = !!editing[sk.id];
        const cc = catColor(sk.category);
        const catIdx = SKILL_CATS.indexOf(sk.category);
        const displayCat = catIdx>=0 ? CATS[catIdx] : sk.category;
        return (
          <div key={sk.id} id={`entity-${sk.id}`} className={`card${sk.pinned?" pinned":""}${sk.inUse?" inuse-active":""}${open?" is-open":""}`} style={{ padding:"1rem 1.1rem", borderLeftColor: cc+"55", borderLeftWidth:2 }}>
            <div className="entity-header">
              <span className="icon-badge"><Icon name={SKILL_CAT_ICONS[sk.category] || "diamond"}/></span>
              <div className="flex1" style={{ display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                <input className="iedit" style={{ fontFamily:"Cinzel,serif", fontSize:"0.98rem", fontWeight:700, width:"100%" }}
                  value={sk.name} onChange={e => upd(sk.id,"name",e.target.value)} placeholder={SK.editNamePh}/>
                <div style={{ display:"flex", gap:"0.4rem", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.1em", textTransform:"uppercase", color:cc, border:`1px solid ${cc}55`, padding:"0.1rem 0.45rem", background:`${cc}0d`, flexShrink:0, borderRadius:"var(--radius-pill)" }}>{displayCat}</span>
                  <Toggle on={!!sk.inUse} onToggle={() => toggleInUse(sk.id)} label={sk.inUse?SK.active:SK.inactive} color="purple"/>
                </div>
              </div>
              <PrzypnijBtn pinned={sk.pinned} onToggle={() => upd(sk.id,"pinned",!sk.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(sk.id)} aria-label="Edit entry"><Icon name="edit" size="0.85em"/></button>
              <button className="entity-toggle" onClick={() => toggle(sk.id)}><Icon name={open?"chevron-up":"chevron-down"}/></button>
            </div>

            {/* Podgląd opisu — 2 linie gdy zwinięty, pełny gdy rozwinięty */}
            {sk.description && !isEditing && (
              <p className="entry-preview" style={{ ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{sk.description}</p>
            )}

            <TagsEditor tags={sk.tags||[]} onChange={v => upd(sk.id,"tags",v)}
              suggestions={(sk.tags||[]).some(t => (T.UI.SUGGESTED_ACTION_TAGS||[]).includes(t)) ? [] : T.UI.SUGGESTED_ACTION_TAGS}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.5rem" }}>
                  {CATS.map((c,i) => <button key={c} className="filter-tag" style={{ opacity: sk.category===SKILL_CATS[i]||sk.category===c?1:0.4, borderColor: sk.category===SKILL_CATS[i]||sk.category===c?catColor(c)+"88":"", color: sk.category===SKILL_CATS[i]||sk.category===c?catColor(c):"" }} onClick={() => upd(sk.id,"category",SKILL_CATS[i])}><Icon name={SKILL_CAT_ICONS[SKILL_CATS[i]]} size="0.85em"/> {c}</button>)}
                </div>
                <textarea className="g-textarea" rows={4} placeholder={SK.editDescPh} value={sk.description||""} onChange={e => upd(sk.id,"description",e.target.value)}/>
                <div className="row mt05" style={{ justifyContent:"space-between" }}>
                  <button className="btn-ghost" onClick={() => del(sk.id)}
                    style={pendingDelete[sk.id]?{color:"var(--hj-danger,#c94a4a)",borderColor:"var(--hj-danger,#c94a4a)",display:"flex",alignItems:"center",gap:"0.3rem"}:{}}>
                    {pendingDelete[sk.id] ? <><Icon name="warning" size="0.8em"/> {T.UI.confirmDelete}</> : SK.delete}</button>
                  <button className="btn-ghost" onClick={() => stopEdit(sk.id)}><Icon name="check" size="0.85em"/></button>
                </div>
              </div>
            )}
          </div>
        );
  }
}
export default memo(SkillsScreen);
