import { useState, useEffect } from 'react';
import { ITEM_TYPES, ITEM_ICONS } from '../../constants/gameConstants';
import { Toggle } from '../../shared/ui';
import { useT } from '../../i18n/translations';

export default function InventoryScreen({ inventory, setInventory, openEntity }) {
  const T = useT();
  const I = T.INVENTORY;
  const displayItemType = type => T.ITEM_TYPES[ITEM_TYPES.indexOf(type)] ?? type;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", type:"Ogólny", qty:"1", damage:"", damageType:"", modifier:"", charges:"", effect:"", note:"" });
  const [expanded, setExpanded] = useState({});
  const [editing,  setEditing]  = useState({});
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = inventory.find(i => i.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 150);
    }
  }, [openEntity]);

  const addItem = () => {
    const n = form.name.trim(); if (!n) return;
    setInventory(inv => [...inv, { id: Date.now(), equipped: false, ...form, name: n }]);
    setForm({ name:"", type:"Ogólny", qty:"1", damage:"", damageType:"", modifier:"", charges:"", effect:"", note:"" });
    setShowForm(false);
  };
  const upd         = (id, f, v) => setInventory(inv => inv.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del         = id => setInventory(inv => inv.filter(x => x.id !== id));
  const toggle      = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit   = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit    = id => setEditing(e => ({ ...e, [id]: false }));
  const toggleEquip = id => setInventory(inv => inv.map(x => x.id === id ? { ...x, equipped: !x.equipped } : x));

  const visible      = filterType ? inventory.filter(i => i.type === filterType) : inventory;
  const equippedCount = inventory.filter(i => i.equipped).length;
  const needsExtras  = t => ["Broń","Zwój z czarem","Cudowny przedmiot","Jednorazowy"].includes(t);

  return (
    <>
      <div className="row" style={{ justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.12em" }}>
          {I.count(inventory.length, equippedCount)}
        </span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? I.cancel : I.add}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <div className="row">
              <input className="g-input flex1" placeholder={I.namePh} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addItem()}/>
              <input className="g-input" style={{ width:60 }} placeholder={I.qty} value={form.qty}
                onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}/>
            </div>
            <div className="row" style={{ gap:"0.4rem", flexWrap:"wrap" }}>
              {ITEM_TYPES.map((t, i) => (
                <button key={t} className="filter-tag" style={{ opacity: form.type === t ? 1 : 0.5, borderColor: form.type === t ? "currentColor" : "" }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{ITEM_ICONS[t]} {T.ITEM_TYPES[i] ?? t}</button>
              ))}
            </div>
            {needsExtras(form.type) && (
              <>
                {form.type === "Broń" && (
                  <div className="pack-item-row">
                    <div className="pack-field"><span className="pack-field-label">{I.damageDice}</span><input className="pack-field-input" placeholder="e.g. 1d8" value={form.damage} onChange={e => setForm(f => ({ ...f, damage: e.target.value }))}/></div>
                    <div className="pack-field"><span className="pack-field-label">{I.damageType}</span><input className="pack-field-input" placeholder="e.g. Slashing" value={form.damageType} onChange={e => setForm(f => ({ ...f, damageType: e.target.value }))}/></div>
                    <div className="pack-field"><span className="pack-field-label">{I.hitBonus}</span><input className="pack-field-input" type="number" value={form.modifier} onChange={e => setForm(f => ({ ...f, modifier: e.target.value }))}/></div>
                  </div>
                )}
                {["Zwój z czarem","Cudowny przedmiot","Jednorazowy"].includes(form.type) && (
                  <div className="pack-item-row">
                    <div className="pack-field"><span className="pack-field-label">{I.charges}</span><input className="pack-field-input" value={form.charges} onChange={e => setForm(f => ({ ...f, charges: e.target.value }))}/></div>
                    <div className="pack-field" style={{ flex:2 }}><span className="pack-field-label">{I.effect}</span><input className="pack-field-input" value={form.effect} onChange={e => setForm(f => ({ ...f, effect: e.target.value }))}/></div>
                  </div>
                )}
              </>
            )}
            <input className="g-input" placeholder={I.note} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}/>
            <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addItem}>{I.save}</button></div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-tag${!filterType ? " active-filter" : ""}`} onClick={() => setFilterType(null)}>{I.all}</button>
        {ITEM_TYPES.map((t, i) => {
          const c = inventory.filter(x => x.type === t).length; if (!c) return null;
          return <button key={t} className={`filter-tag${filterType === t ? " active-filter" : ""}`} onClick={() => setFilterType(filterType === t ? null : t)}>{ITEM_ICONS[t]} {T.ITEM_TYPES[i] ?? t} ({c})</button>;
        })}
      </div>

      {inventory.length === 0 && <div className="card empty-state">{I.empty}</div>}
      {visible.map(item => {
        const open      = !!expanded[item.id];
        const isEditing = !!editing[item.id];
        const preview   = [item.effect, item.note].filter(Boolean).join(" · ");
        return (
          <div key={item.id} id={`entity-${item.id}`} className={`pack-item${item.equipped ? " equipped-active" : ""}`}>

            {/* Nagłówek */}
            <div className="pack-item-header">
              <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{ITEM_ICONS[item.type] || "◈"}</span>
              <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                <input className="iedit" style={{ fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, width:"100%" }}
                  value={item.name} onChange={e => upd(item.id, "name", e.target.value)}/>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em", border:"1px solid currentColor", padding:"0.1rem 0.3rem", flexShrink:0, opacity:0.6 }}>{displayItemType(item.type)}</span>
                  <Toggle on={!!item.equipped} onToggle={() => toggleEquip(item.id)} label={item.equipped ? I.equipped : I.inBag}/>
                </div>
              </div>
              <button className="entity-toggle" onClick={() => startEdit(item.id)} title="Edytuj">✎</button>
              <button className="entity-toggle" onClick={() => toggle(item.id)}>{open ? "▲" : "▼"}</button>
            </div>

            {/* Podgląd — 2 linie gdy zwinięty, pełny gdy rozwinięty (ale nie w trybie edycji) */}
            {preview && !isEditing && (
              <p className="entry-preview" style={{ ...(open ? { whiteSpace:"pre-wrap" } : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>
                {preview}
              </p>
            )}

            {/* Statystyki broni/czaru — zawsze widoczne gdy rozwinięty i nie w edycji */}
            {open && !isEditing && (item.damage || item.charges) && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginTop:"0.35rem" }}>
                {item.damage && <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.08em", color:"var(--hj-text-label)" }}>⚔ {item.damage}{item.damageType ? ` (${item.damageType})` : ""}{item.modifier ? ` +${parseInt(item.modifier)||0}` : ""}</span>}
                {item.charges && <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.08em", color:"var(--hj-text-label)" }}>{I.charges} {item.charges}</span>}
                {item.qty && item.qty !== "1" && <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.08em", color:"var(--hj-text-dim)" }}>×{item.qty}</span>}
              </div>
            )}

            {/* Formularz edycji */}
            {isEditing && (
              <div className="pack-item-body">
                <div className="pack-item-row">
                  <div className="pack-field"><span className="pack-field-label">{I.qty}</span><input className="pack-field-input" value={item.qty || "1"} onChange={e => upd(item.id, "qty", e.target.value)}/></div>
                  {item.type === "Broń" && (
                    <>
                      <div className="pack-field"><span className="pack-field-label">{I.damage}</span><input className="pack-field-input" value={item.damage || ""} onChange={e => upd(item.id, "damage", e.target.value)}/></div>
                      <div className="pack-field"><span className="pack-field-label">{I.type}</span><input className="pack-field-input" value={item.damageType || ""} onChange={e => upd(item.id, "damageType", e.target.value)}/></div>
                      <div className="pack-field"><span className="pack-field-label">{I.attackBonus}</span><input className="pack-field-input" type="number" value={item.modifier || ""} onChange={e => upd(item.id, "modifier", e.target.value)}/></div>
                    </>
                  )}
                  {["Zwój z czarem","Cudowny przedmiot","Jednorazowy"].includes(item.type) && (
                    <>
                      <div className="pack-field"><span className="pack-field-label">{I.charges}</span><input className="pack-field-input" value={item.charges || ""} onChange={e => upd(item.id, "charges", e.target.value)}/></div>
                      <div className="pack-field" style={{ flex:2 }}><span className="pack-field-label">{I.action}</span><input className="pack-field-input" value={item.effect || ""} onChange={e => upd(item.id, "effect", e.target.value)}/></div>
                    </>
                  )}
                </div>
                <div className="pack-field"><span className="pack-field-label">{I.notes}</span><input className="pack-field-input" value={item.note || ""} onChange={e => upd(item.id, "note", e.target.value)}/></div>
                <div className="row" style={{ justifyContent:"space-between", marginTop:"0.3rem" }}>
                  <button className="btn-ghost" onClick={() => del(item.id)}>{I.delete}</button>
                  <button className="btn-ghost" onClick={() => stopEdit(item.id)}>✓</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
