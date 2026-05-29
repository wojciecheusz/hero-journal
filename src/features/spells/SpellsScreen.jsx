import { useState } from 'react';
import { SPELL_SCHOOLS, SPELL_LEVELS, STAT_KEYS } from '../../constants/gameConstants';
import { TagsEditor, PrzypnijBtn, Toggle, SpellSlotsWidget } from '../../shared/ui';

const numMod = v => v >= 0 ? `+${v}` : String(v);

export default function SpellsScreen({ spells, setCzary, char, setChar }) {
  const [form, setForm] = useState({ name: "", level: "Sztuczka", school: "Wywoływanie", castingTime: "1 akcja", zakres: "", duration: "", components: "", description: "", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeLevel, setAktywnyLevel] = useState(null);
  const [showSlots, setShowSlots] = useState(false);

  const pb = char.profBonus || 2;
  const spMod = Math.floor(((char.stats || {})[char.spellcastingAbility || "INT"] || 10) - 10) / 2;
  const inUseCount = spells.filter(s => s.inUse).length;
  const visible = activeLevel ? spells.filter(s => s.level === activeLevel) : spells;

  const addSpell = () => {
    const n = form.name.trim(); if (!n) return;
    setCzary(l => [...l, { id: Date.now(), ...form, name: n, tags: [], pinned: false, inUse: false }]);
    setForm({ name: "", level: "Sztuczka", school: "Wywoływanie", castingTime: "1 akcja", zakres: "", duration: "", components: "", description: "", notes: "" });
    setShowForm(false);
  };
  const upd = (id, f, v) => setCzary(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => setCzary(l => l.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const toggleInUse = id => setCzary(l => l.map(x => x.id === id ? { ...x, inUse: !x.inUse } : x));

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--spell-muted)" }}>{spells.length} czarów{inUseCount > 0 ? ` · ${inUseCount} przygotowanych` : ""}</span>
        <div className="row" style={{ gap: "0.5rem" }}>
          <button className="btn-shadow" style={{ borderColor: "var(--spell-border)", color: "var(--spell-accent)", background: "transparent", cursor: "pointer" }} onClick={() => setShowSlots(s => !s)}>{showSlots ? "✕ Ukryj komórki" : "⚙ Zarządzaj komórkami"}</button>
          <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj czar"}</button>
        </div>
      </div>

      {showSlots && (
        <div className="card" style={{ borderColor: "var(--spell-border)" }}>
          <div className="sect-label" style={{ color: "var(--spell-accent)" }}>Komórki czarów i rzucanie magii</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.54rem", letterSpacing: "0.14em", color: "var(--spell-muted)", textTransform: "uppercase" }}>Cecha rzucania</span>
            <select className="g-select" style={{ width: "auto", fontSize: "0.82rem", padding: "0.25rem 0.5rem", borderColor: "#1a3a6a" }}
              value={char.spellcastingAbility || "INT"} onChange={e => setChar(c => ({ ...c, spellcastingAbility: e.target.value }))}>
              {STAT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.72rem", color: "var(--spell-accent)" }}>Trudność czarów (DC): {8 + pb + spMod} · Modyfikator ataku: {numMod(pb + spMod)}</span>
          </div>
          <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
        </div>
      )}

      {showForm && (
        <div className="add-form" style={{ borderColor: "var(--spell-border)" }}>
          <div className="col">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <input className="g-input" placeholder="Nazwa zaklęcia…" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addSpell()}/>
              <select className="g-select" value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))}>
                {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="row" style={{ gap: "0.4rem", flexWrap: "wrap" }}>
              {SPELL_LEVELS.map(lv => (
                <button key={lv} className="filter-tag" style={{ opacity: form.level === lv ? 1 : 0.45, borderColor: form.level === lv ? "#1a5a9a" : "", color: form.level === lv ? "#64a0e6" : "" }}
                  onClick={() => setForm(f => ({ ...f, level: lv }))}>{lv}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              <div className="pack-field"><span className="pack-field-label">Czas rzucania</span><input className="pack-field-input" placeholder="e.g. 1 akcja" value={form.castingTime} onChange={e => setForm(f => ({ ...f, castingTime: e.target.value }))}/></div>
              <div className="pack-field"><span className="pack-field-label">Zasięg</span><input className="pack-field-input" placeholder="e.g. 60 stóp" value={form.zakres} onChange={e => setForm(f => ({ ...f, zakres: e.target.value }))}/></div>
              <div className="pack-field"><span className="pack-field-label">Czas trwania</span><input className="pack-field-input" placeholder="e.g. Natychmiastowy" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}/></div>
            </div>
            <input className="g-input" placeholder="Komponenty (V, S, M…)" value={form.components} onChange={e => setForm(f => ({ ...f, components: e.target.value }))}/>
            <textarea className="g-textarea" rows={3} placeholder="Opis działania czaru i jego efekty rzutu…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
            <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={addSpell}>⊕ Zapisz czar</button></div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-tag${!activeLevel ? " active-filter" : ""}`} onClick={() => setAktywnyLevel(null)}>Wszystkie</button>
        {SPELL_LEVELS.map(lv => { const count = spells.filter(s => s.level === lv).length; if (!count) return null; return <button key={lv} className={`filter-tag${activeLevel === lv ? " active-filter" : ""}`} style={{ borderColor: activeLevel === lv ? "#1a5a9a" : "", color: activeLevel === lv ? "#64a0e6" : "" }} onClick={() => setAktywnyLevel(activeLevel === lv ? null : lv)}>{lv} ({count})</button>; })}
      </div>

      {spells.length === 0 && <div className="card empty-state">Brak zapisanych czarów w księdze.</div>}
      {visible.map(sp => {
        const open = !!expanded[sp.id];
        return (
          <div key={sp.id} className={`card${sp.pinned ? " pinned" : ""}${sp.inUse ? " spell-active" : ""}`} style={{ padding: "1rem 1.1rem", borderLeftColor: "#1a4a8a", borderLeftWidth: 2 }}>
            <div className="entity-header">
              <div className="flex1">
                <div className="row" style={{ gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                  <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: "0.98rem", color: "var(--spell-text)", fontWeight: 700 }}
                    value={sp.name} onChange={e => upd(sp.id, "name", e.target.value)} placeholder="Nazwa czaru…"/>
                  <span className="spell-level-badge">{sp.level}</span>
                  {sp.school && <span className="spell-school-badge">{sp.school}</span>}
                </div>
                {!open && <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.08em", color: "var(--spell-muted)" }}>
                  {[sp.castingTime, sp.zakres && `Zasięg: ${sp.zakres}`, sp.duration && `Czas trwania: ${sp.duration}`].filter(Boolean).join(" · ")}
                </div>}
              </div>
              <Toggle on={!!sp.inUse} onToggle={() => toggleInUse(sp.id)} label={sp.inUse ? "Przygotowany" : "Znany"} color="blue"/>
              <PrzypnijBtn pinned={sp.pinned} onToggle={() => upd(sp.id, "pinned", !sp.pinned)}/>
              <button className="entity-toggle" onClick={() => toggle(sp.id)}>{open ? "▲" : "▼"}</button>
            </div>
            {!open && sp.description && <p style={{ fontSize: "0.9rem", color: "var(--spell-muted)", fontStyle: "italic", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sp.description}</p>}
            <TagsEditor tags={sp.tags || []} onChange={v => upd(sp.id, "tags", v)}/>
            {open && (
              <div style={{ marginTop: "0.8rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.7rem" }}>
                  <div><span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--spell-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>Poziom</span>
                    <select className="g-select" style={{ fontSize: "0.82rem", padding: "0.25rem 0.5rem", borderColor: "var(--spell-border)" }} value={sp.level} onChange={e => upd(sp.id, "level", e.target.value)}>{SPELL_LEVELS.map(lv => <option key={lv} value={lv}>{lv}</option>)}</select></div>
                  <div><span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--spell-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>Szkoła magii</span>
                    <select className="g-select" style={{ fontSize: "0.82rem", padding: "0.25rem 0.5rem", borderColor: "var(--spell-border)" }} value={sp.school} onChange={e => upd(sp.id, "school", e.target.value)}>{SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.7rem" }}>
                  <div className="pack-field"><span className="pack-field-label">Czas rzucania</span><input className="pack-field-input" value={sp.castingTime || ""} onChange={e => upd(sp.id, "castingTime", e.target.value)}/></div>
                  <div className="pack-field"><span className="pack-field-label">Zasięg</span><input className="pack-field-input" value={sp.zakres || ""} onChange={e => upd(sp.id, "zakres", e.target.value)}/></div>
                  <div className="pack-field"><span className="pack-field-label">Czas trwania</span><input className="pack-field-input" value={sp.duration || ""} onChange={e => upd(sp.id, "duration", e.target.value)}/></div>
                </div>
                <div className="pack-field" style={{ marginBottom: "0.6rem" }}><span className="pack-field-label">Komponenty czaru</span><input className="pack-field-input" value={sp.components || ""} placeholder="V, S, M (komponenty materialne)" onChange={e => upd(sp.id, "components", e.target.value)}/></div>
                <textarea className="g-textarea" rows={4} placeholder="Pełny opis działania czaru…" value={sp.description || ""} onChange={e => upd(sp.id, "description", e.target.value)}/>
                <div style={{ marginTop: "0.5rem" }}>
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--spell-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Na wyższych poziomach / Notatki dodatkowe</span>
                  <textarea className="g-textarea" rows={2} value={sp.notes || ""} placeholder="Efekty, gdy rzucasz czar za pomocą wyższego slotu magii…" onChange={e => upd(sp.id, "notes", e.target.value)}/>
                </div>
                <div className="row mt05" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={() => del(sp.id)}>Usuń</button></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
