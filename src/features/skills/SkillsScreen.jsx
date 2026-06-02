import { useState, useEffect } from 'react';
import { SKILL_CATS } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, PrzypnijBtn, Toggle, SkillPips } from '../../shared/ui';
import { useT } from '../../i18n/translations';

const catColor = cat => ({ "Umiejętność":"#c9943e","Skill":"#c9943e","Cecha rasowa":"#4a8aaa","Racial Feature":"#4a8aaa","Atut":"#9a6030","Feat":"#9a6030" })[cat] || "#8a7848";

export default function SkillsScreen({ skills, setUmiejętności, openEntity }) {
  const T    = useT();
  const SK   = T.SKILLS;
  const CATS = T.SKILL_CATS;

  const [form, setForm] = useState({ name:"", category: CATS[0], description:"", level:0 });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = skills.find(s => s.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 150);
    }
  }, [openEntity]);

  const allTags    = [...new Set(skills.flatMap(s => s.tags||[]))].sort();
  const inUseCount = skills.filter(s => s.inUse).length;

  const addSkill = () => {
    const n = form.name.trim(); if (!n) return;
    setUmiejętności(l => [...l, { id: Date.now(), name: n, category: form.category, description: form.description.trim(), level: form.level, tags: [], pinned: false, inUse: false }]);
    setForm({ name:"", category: CATS[0], description:"", level:0 });
    setShowForm(false);
  };
  const upd       = (id, f, v) => setUmiejętności(l => l.map(x => x.id===id ? { ...x, [f]: v } : x));
  const del       = id => setUmiejętności(l => l.filter(x => x.id!==id));
  const toggle    = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));
  const toggleInUse = id => setUmiejętności(l => l.map(x => x.id===id ? { ...x, inUse: !x.inUse } : x));

  const visible = skills.filter(s =>
    (!activeTag || (s.tags||[]).includes(activeTag)) &&
    (!activeCat || s.category===activeCat || SKILL_CATS[CATS.indexOf(activeCat)]===s.category)
  ).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>{SK.count(skills.length, inUseCount)}</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? SK.cancel : SK.add}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder={SK.namePh} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key==="Enter" && addSkill()}/>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {CATS.map(c => (
                <button key={c} className="filter-tag" style={{ opacity: form.category===c?1:0.45, borderColor: form.category===c?catColor(c)+"88":"", color: form.category===c?catColor(c):"" }}
                  onClick={() => setForm(f => ({ ...f, category: c }))}>{c}</button>
              ))}
            </div>
            <div className="row" style={{ gap:"0.6rem" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", textTransform:"uppercase", letterSpacing:"0.12em" }}>{SK.masteryLevel}</span>
              <SkillPips value={form.level} onChange={v => setForm(f => ({ ...f, level: v }))}/>
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
          return <button key={c} className={`filter-tag${activeCat===c?" active-filter":""}`} style={{ borderColor: activeCat===c?catColor(c)+"88":"", color: activeCat===c?catColor(c):"" }} onClick={() => setActiveCat(activeCat===c?null:c)}>{c} ({count})</button>;
        })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setActiveTag}/>

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
              <div className="flex1">
                <div className="row" style={{ gap:"0.5rem", marginBottom:"0.25rem", flexWrap:"wrap" }}>
                  <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"0.98rem", fontWeight:700 }}
                    value={sk.name} onChange={e => upd(sk.id,"name",e.target.value)} placeholder={SK.editNamePh}/>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", color:cc, border:`1px solid ${cc}55`, padding:"0.15rem 0.5rem", background:`${cc}0d`, flexShrink:0 }}>{displayCat}</span>
                </div>
                {sk.level>0 && <SkillPips value={sk.level} onChange={v => upd(sk.id,"level",v)}/>}
              </div>
              <Toggle on={!!sk.inUse} onToggle={() => toggleInUse(sk.id)} label={sk.inUse?SK.active:SK.inactive} color="purple"/>
              <PrzypnijBtn pinned={sk.pinned} onToggle={() => upd(sk.id,"pinned",!sk.pinned)}/>
              <button className="entity-toggle" onClick={() => startEdit(sk.id)} title="Edytuj">✎</button>
              <button className="entity-toggle" onClick={() => toggle(sk.id)}>{open?"▲":"▼"}</button>
            </div>

            {/* Podgląd opisu — 2 linie gdy zwinięty, pełny gdy rozwinięty */}
            {sk.description && !isEditing && (
              <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.95rem", color:"var(--hj-text)", lineHeight:1.65, marginTop:"0.4rem", wordBreak:"break-word", opacity:0.88, ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{sk.description}</p>
            )}

            <TagsEditor tags={sk.tags||[]} onChange={v => upd(sk.id,"tags",v)}/>

            {open && isEditing && (
              <div style={{ marginTop:"0.8rem" }}>
                <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.5rem" }}>
                  {CATS.map((c,i) => <button key={c} className="filter-tag" style={{ opacity: sk.category===SKILL_CATS[i]||sk.category===c?1:0.4, borderColor: sk.category===SKILL_CATS[i]||sk.category===c?catColor(c)+"88":"", color: sk.category===SKILL_CATS[i]||sk.category===c?catColor(c):"" }} onClick={() => upd(sk.id,"category",SKILL_CATS[i])}>{c}</button>)}
                </div>
                <div className="row" style={{ gap:"0.6rem", marginBottom:"0.7rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", textTransform:"uppercase", letterSpacing:"0.12em" }}>{SK.mastery}</span>
                  <SkillPips value={sk.level} onChange={v => upd(sk.id,"level",v)}/>
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
