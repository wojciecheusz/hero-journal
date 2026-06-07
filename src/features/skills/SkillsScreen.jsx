import { useState, memo } from 'react';
import { SKILL_CATS, SKILL_CAT_ICONS } from '../../constants/gameConstants';
import { SKILL_CAT } from '../../constants/enums.js';
import { TagsEditor, FilterBar, PrzypnijBtn, Toggle } from '../../shared/ui';
import { useT } from '../../i18n/translations';
import styles from './SkillsScreen.module.css';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';

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
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [activeCat, setActiveCat] = useState(null);

  useScrollToEntity(openEntity, skills, setExpanded);

  const allTags    = [...new Set(skills.flatMap(s => s.tags||[]))].sort();
  const inUseCount = skills.filter(s => s.inUse).length;

  const addSkill = () => {
    const n = form.name.trim(); if (!n) return;
    setSkills(l => [...l, { id: Date.now(), name: n, category: form.category, description: form.description.trim(), level: form.level, tags: [], pinned: false, inUse: false }]);
    setForm({ name:"", category: SKILL_CAT.SKILL, description:"", level:0 });
    setShowForm(false);
  };
  const upd       = (id, f, v) => setSkills(l => l.map(x => x.id===id ? { ...x, [f]: v } : x));
  const del       = id => setSkills(l => l.filter(x => x.id!==id));
  const toggle    = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));
  const toggleInUse = id => setSkills(l => l.map(x => x.id===id ? { ...x, inUse: !x.inUse } : x));

  const visible = skills.filter(s =>
    (!activeTag || (s.tags||[]).includes(activeTag)) &&
    (!activeCat || s.category===activeCat || SKILL_CATS[CATS.indexOf(activeCat)]===s.category)
  ).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span className={styles.countBar}>{SK.count(skills.length, inUseCount)}</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? SK.cancel : SK.add}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder={SK.namePh} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addSkill()}/>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {CATS.map((c,i) => (
                <button key={c} className="filter-tag" style={{ opacity: form.category===c?1:0.45, borderColor: form.category===c?catColor(c)+"88":"", color: form.category===c?catColor(c):"" }}
                  onClick={() => setForm(f => ({ ...f, category: c }))}>{SKILL_CAT_ICONS[SKILL_CATS[i]] || ""} {c}</button>
              ))}
            </div>
            <textarea className="g-textarea" rows={3} placeholder={SK.descPh} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addSkill}>{SK.addBtn}</button></div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-tag${!activeCat?" active-filter":""}`} onClick={() => setActiveCat(null)}>{SK.all}</button>
        {CATS.map((c, i) => {
          const plCat = SKILL_CATS[i];
          const count = skills.filter(s => s.category===plCat || s.category===c).length;
          if (!count) return null;
          return <button key={c} className={`filter-tag${activeCat===c?" active-filter":""}`} style={{ borderColor: activeCat===c?catColor(c)+"88":"", color: activeCat===c?catColor(c):"" }} onClick={() => setActiveCat(activeCat===c?null:c)}>{SKILL_CAT_ICONS[plCat] || ""} {c} ({count})</button>;
        })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>

      {/* Legenda kategorii */}
      {skills.length > 0 && (
        <div className={styles.legend}>
          {[["Umiejętność","#c9943e"],["Cecha rasowa","#4a8aaa"],["Atut","#9a6030"]].map(([plCat,color],i) => {
            const displayLabel = CATS[i] ?? plCat;
            return (
              <div key={plCat} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background:color }}/>
                <span className={styles.legendLabel} style={{ color }}>{SKILL_CAT_ICONS[SKILL_CATS[i]] || ""} {displayLabel}</span>
              </div>
            );
          })}
        </div>
      )}

      {skills.length===0 && <div className="card empty-state">{SK.empty}</div>}

      {visible.map(sk => {
        const open = !!expanded[sk.id];
        const isEditing = !!editing[sk.id];
        const cc = catColor(sk.category);
        const catIdx = SKILL_CATS.indexOf(sk.category);
        const displayCat = catIdx>=0 ? CATS[catIdx] : sk.category;
        return (
          <div key={sk.id} id={`entity-${sk.id}`} className={`card${sk.pinned?" pinned":""}${sk.inUse?" inuse-active":""}`} style={{ padding:"1rem 1.1rem", borderLeftColor: cc+"55", borderLeftWidth:2 }}>
            <div className="entity-header">
              <div className="flex1" style={{ display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                <input className="iedit" style={{ fontFamily:"Cinzel,serif", fontSize:"0.98rem", fontWeight:700, width:"100%" }}
                  value={sk.name} onChange={e => upd(sk.id,"name",e.target.value)} placeholder={SK.editNamePh}/>
                <div style={{ display:"flex", gap:"0.4rem", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.1em", textTransform:"uppercase", color:cc, border:`1px solid ${cc}55`, padding:"0.1rem 0.4rem", background:`${cc}0d`, flexShrink:0 }}>{SKILL_CAT_ICONS[sk.category] || ""} {displayCat}</span>
                  <Toggle on={!!sk.inUse} onToggle={() => toggleInUse(sk.id)} label={sk.inUse?SK.active:SK.inactive} color="purple"/>
                </div>
              </div>
              <PrzypnijBtn pinned={sk.pinned} onToggle={() => upd(sk.id,"pinned",!sk.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(sk.id)} aria-label="Edit entry">✎</button>
              <button className="entity-toggle" onClick={() => toggle(sk.id)}>{open?"▲":"▼"}</button>
            </div>

            {/* Podgląd opisu — 2 linie gdy zwinięty, pełny gdy rozwinięty */}
            {sk.description && !isEditing && (
              <p className="entry-preview" style={{ ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{sk.description}</p>
            )}

            <TagsEditor tags={sk.tags||[]} onChange={v => upd(sk.id,"tags",v)}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.5rem" }}>
                  {CATS.map((c,i) => <button key={c} className="filter-tag" style={{ opacity: sk.category===SKILL_CATS[i]||sk.category===c?1:0.4, borderColor: sk.category===SKILL_CATS[i]||sk.category===c?catColor(c)+"88":"", color: sk.category===SKILL_CATS[i]||sk.category===c?catColor(c):"" }} onClick={() => upd(sk.id,"category",SKILL_CATS[i])}>{SKILL_CAT_ICONS[SKILL_CATS[i]] || ""} {c}</button>)}
                </div>
                <textarea className="g-textarea" rows={4} placeholder={SK.editDescPh} value={sk.description||""} onChange={e => upd(sk.id,"description",e.target.value)}/>
                <div className="row mt05" style={{ justifyContent:"space-between" }}>
                  <button className="btn-ghost" onClick={() => del(sk.id)}>{SK.delete}</button>
                  <button className="btn-ghost" onClick={() => stopEdit(sk.id)}>✓</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
export default memo(SkillsScreen);
