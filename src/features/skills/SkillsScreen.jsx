import { useState } from 'react';
import { SKILL_CATS } from '../../constants/gameConstants';
import { TagsEditor, FilterBar, PrzypnijBtn, Toggle, SkillPips } from '../../shared/ui';

const catColor = cat => ({ "Umiejętność": "#c9943e", "Cecha rasowa": "#4a8aaa", "Atut": "#9a6030" })[cat] || "#8a7848";

export default function SkillsScreen({ skills, setUmiejętności }) {
  const [form, setForm] = useState({ name: "", category: "Umiejętność", description: "", level: 0 });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeTag, setAktywnyTag] = useState(null);
  const [activeCat, setAktywnyCat] = useState(null);

  const allTags = [...new Set(skills.flatMap(s => s.tags || []))].sort();
  const inUseCount = skills.filter(s => s.inUse).length;

  const addSkill = () => {
    const n = form.name.trim(); if (!n) return;
    setUmiejętności(l => [...l, { id: Date.now(), name: n, category: form.category, description: form.description.trim(), level: form.level, tags: [], pinned: false, inUse: false }]);
    setForm({ name: "", category: "Umiejętność", description: "", level: 0 });
    setShowForm(false);
  };
  const upd = (id, f, v) => setUmiejętności(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => setUmiejętności(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const toggleInUse = id => setUmiejętności(l => l.map(x => x.id === id ? { ...x, inUse: !x.inUse } : x));

  const visible = skills.filter(s => (!activeTag || (s.tags || []).includes(activeTag)) && (!activeCat || s.category === activeCat)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em" }}>{skills.length} wpisów{inUseCount > 0 ? ` · ${inUseCount} aktywnych` : ""}</span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj wpis"}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <input className="g-input" placeholder="Nazwa zdolności…" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addSkill()}/>
            <div className="row" style={{ gap: "0.4rem", flexWrap: "wrap" }}>
              {SKILL_CATS.map(c => (
                <button key={c} className="filter-tag" style={{ opacity: form.category === c ? 1 : 0.45, borderColor: form.category === c ? catColor(c) + "88" : "", color: form.category === c ? catColor(c) : "" }}
                  onClick={() => setForm(f => ({ ...f, category: c }))}>{c}</button>
              ))}
            </div>
            <div className="row" style={{ gap: "0.6rem" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>Poziom Mistrzostwa</span>
              <SkillPips value={form.level} onChange={v => setForm(f => ({ ...f, level: v }))}/>
            </div>
            <textarea className="g-textarea" rows={3} placeholder="Opis działania, wymagania, modyfikatory mechaniczne…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
            <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={addSkill}>⊕ Dodaj</button></div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-tag${!activeCat ? " active-filter" : ""}`} onClick={() => setAktywnyCat(null)}>Wszystkie</button>
        {SKILL_CATS.map(c => { const count = skills.filter(s => s.category === c).length; if (!count) return null; return <button key={c} className={`filter-tag${activeCat === c ? " active-filter" : ""}`} style={{ borderColor: activeCat === c ? catColor(c) + "88" : "", color: activeCat === c ? catColor(c) : "" }} onClick={() => setAktywnyCat(activeCat === c ? null : c)}>{c} ({count})</button>; })}
      </div>
      <FilterBar allTags={allTags} activeTag={activeTag} onSelect={setAktywnyTag}/>

      {skills.length === 0 && <div className="card empty-state">Brak zapisanych umiejętności, cech rasowych ani atutów.</div>}
      {visible.map(sk => {
        const open = !!expanded[sk.id];
        const cc = catColor(sk.category);
        return (
          <div key={sk.id} className={`card${sk.pinned ? " pinned" : ""}${sk.inUse ? " inuse-active" : ""}`} style={{ padding: "1rem 1.1rem", borderLeftColor: cc + "55", borderLeftWidth: 2 }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: "0.98rem", fontWeight: 700 }}
                    value={sk.name} onChange={e => upd(sk.id, "name", e.target.value)} placeholder="Nazwa…"/>
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: cc, border: `1px solid ${cc}55`, padding: "0.15rem 0.5rem", background: `${cc}0d`, flexShrink: 0 }}>{sk.category}</span>
                </div>
                {sk.level > 0 && <SkillPips value={sk.level} onChange={v => upd(sk.id, "level", v)}/>}
              </div>
              <Toggle on={!!sk.inUse} onToggle={() => toggleInUse(sk.id)} label={sk.inUse ? "Aktywna" : "Nieaktywna"} color="purple"/>
              <PrzypnijBtn pinned={sk.pinned} onToggle={() => upd(sk.id, "pinned", !sk.pinned)}/>
              <button className="entity-toggle" onClick={() => toggle(sk.id)}>{open ? "▲" : "▼"}</button>
            </div>
            {!open && sk.description && <p style={{ fontSize: "0.92rem", fontStyle: "italic", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.7 }}>{sk.description}</p>}
            <TagsEditor tags={sk.tags || []} onChange={v => upd(sk.id, "tags", v)}/>
            {open && (
              <div style={{ marginTop: "0.8rem" }}>
                <div className="row" style={{ gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  {SKILL_CATS.map(c => <button key={c} className="filter-tag" style={{ opacity: sk.category === c ? 1 : 0.4, borderColor: sk.category === c ? catColor(c) + "88" : "", color: sk.category === c ? catColor(c) : "" }} onClick={() => upd(sk.id, "category", c)}>{c}</button>)}
                </div>
                <div className="row" style={{ gap: "0.6rem", marginBottom: "0.7rem" }}>
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>Mistrzostwo</span>
                  <SkillPips value={sk.level} onChange={v => upd(sk.id, "level", v)}/>
                </div>
                <textarea className="g-textarea" rows={4} placeholder="Opis efektu działania cechy…" value={sk.description || ""} onChange={e => upd(sk.id, "description", e.target.value)}/>
                <div className="row mt05" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={() => del(sk.id)}>Usuń</button></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
