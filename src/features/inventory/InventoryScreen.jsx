import { useState } from 'react';
import { ITEM_TYPES, ITEM_ICONS } from '../../constants/gameConstants';
import { Toggle } from '../../shared/ui';

export default function InventoryScreen({ inventory, setInventory }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Ogólny", qty: "1", damage: "", damageType: "", modifier: "", charges: "", effect: "", note: "" });
  const [expanded, setExpanded] = useState({});
  const [filterType, setFilterType] = useState(null);

  const addItem = () => {
    const n = form.name.trim(); if (!n) return;
    setInventory(inv => [...inv, { id: Date.now(), equipped: false, ...form, name: n }]);
    setForm({ name: "", type: "Ogólny", qty: "1", damage: "", damageType: "", modifier: "", charges: "", effect: "", note: "" });
    setShowForm(false);
  };
  const upd = (id, f, v) => setInventory(inv => inv.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del = id => setInventory(inv => inv.filter(x => x.id !== id));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const toggleEquip = id => setInventory(inv => inv.map(x => x.id === id ? { ...x, equipped: !x.equipped } : x));

  const visible = filterType ? inventory.filter(i => i.type === filterType) : inventory;
  const equippedCount = inventory.filter(i => i.equipped).length;
  const needsExtras = t => ["Broń", "Zwój z czarem", "Cudowny przedmiot", "Jednorazowy"].includes(t);

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", letterSpacing: "0.12em" }}>
          {inventory.length} przedmiotów{equippedCount > 0 ? ` · ${equippedCount} wyposażonych` : ""}
        </span>
        <button className="btn-ghost" onClick={() => setShowForm(s => !s)}>{showForm ? "✕ Anuluj" : "⊕ Dodaj przedmiot"}</button>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="col">
            <div className="row">
              <input className="g-input flex1" placeholder="Nazwa przedmiotu…" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && addItem()}/>
              <input className="g-input" style={{ width: 60 }} placeholder="Ilość" value={form.qty}
                onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}/>
            </div>
            <div className="row" style={{ gap: "0.4rem", flexWrap: "wrap" }}>
              {ITEM_TYPES.map(t => (
                <button key={t} className="filter-tag" style={{ opacity: form.type === t ? 1 : 0.5, borderColor: form.type === t ? "currentColor" : "" }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{ITEM_ICONS[t]} {t}</button>
              ))}
            </div>
            {needsExtras(form.type) && (
              <>
                {form.type === "Broń" && (
                  <div className="pack-item-row">
                    <div className="pack-field"><span className="pack-field-label">Kości obrażeń</span><input className="pack-field-input" placeholder="e.g. 1d8" value={form.damage} onChange={e => setForm(f => ({ ...f, damage: e.target.value }))}/></div>
                    <div className="pack-field"><span className="pack-field-label">Typ obrażeń</span><input className="pack-field-input" placeholder="e.g. Cięte" value={form.damageType} onChange={e => setForm(f => ({ ...f, damageType: e.target.value }))}/></div>
                    <div className="pack-field"><span className="pack-field-label">Premia do trafienia</span><input className="pack-field-input" type="number" value={form.modifier} onChange={e => setForm(f => ({ ...f, modifier: e.target.value }))}/></div>
                  </div>
                )}
                {["Zwój z czarem", "Cudowny przedmiot", "Jednorazowy"].includes(form.type) && (
                  <div className="pack-item-row">
                    <div className="pack-field"><span className="pack-field-label">Ładunki</span><input className="pack-field-input" value={form.charges} onChange={e => setForm(f => ({ ...f, charges: e.target.value }))}/></div>
                    <div className="pack-field" style={{ flex: 2 }}><span className="pack-field-label">Efekt działania</span><input className="pack-field-input" value={form.effect} onChange={e => setForm(f => ({ ...f, effect: e.target.value }))}/></div>
                  </div>
                )}
              </>
            )}
            <input className="g-input" placeholder="Własne notatki…" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}/>
            <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={addItem}>⊕ Zapisz przedmiot</button></div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-tag${!filterType ? " active-filter" : ""}`} onClick={() => setFilterType(null)}>Wszystkie</button>
        {ITEM_TYPES.map(t => {
          const c = inventory.filter(i => i.type === t).length; if (!c) return null;
          return <button key={t} className={`filter-tag${filterType === t ? " active-filter" : ""}`} onClick={() => setFilterType(filterType === t ? null : t)}>{ITEM_ICONS[t]} {t} ({c})</button>;
        })}
      </div>

      {inventory.length === 0 && <div className="card empty-state">Twój plecak jest pusty…</div>}
      {visible.map(item => {
        const open = !!expanded[item.id];
        return (
          <div key={item.id} className={`pack-item${item.equipped ? " equipped-active" : ""}`}>
            <div className="pack-item-header">
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{ITEM_ICONS[item.type] || "◈"}</span>
              <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700 }}
                value={item.name} onChange={e => upd(item.id, "name", e.target.value)}/>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.08em", border: "1px solid currentColor", padding: "0.1rem 0.35rem", flexShrink: 0, opacity: 0.6 }}>{item.type}</span>
              <Toggle on={!!item.equipped} onToggle={() => toggleEquip(item.id)} label={item.equipped ? "Wyposażony" : "W plecaku"} color="rgba(255,255,255,0.06)"/>
              <button className="entity-toggle" onClick={() => toggle(item.id)}>{open ? "▲" : "▼"}</button>
            </div>
            {open && (
              <div className="pack-item-body">
                <div className="pack-item-row">
                  <div className="pack-field"><span className="pack-field-label">Ilość</span><input className="pack-field-input" value={item.qty || "1"} onChange={e => upd(item.id, "qty", e.target.value)}/></div>
                  {item.type === "Broń" && (
                    <>
                      <div className="pack-field"><span className="pack-field-label">Obrażenia</span><input className="pack-field-input" value={item.damage || ""} onChange={e => upd(item.id, "damage", e.target.value)}/></div>
                      <div className="pack-field"><span className="pack-field-label">Typ</span><input className="pack-field-input" value={item.damageType || ""} onChange={e => upd(item.id, "damageType", e.target.value)}/></div>
                      <div className="pack-field"><span className="pack-field-label">Premia rzutu</span><input className="pack-field-input" type="number" value={item.modifier || ""} onChange={e => upd(item.id, "modifier", e.target.value)}/></div>
                    </>
                  )}
                  {["Zwój z czarem", "Cudowny przedmiot", "Jednorazowy"].includes(item.type) && (
                    <>
                      <div className="pack-field"><span className="pack-field-label">Ładunki</span><input className="pack-field-input" value={item.charges || ""} onChange={e => upd(item.id, "charges", e.target.value)}/></div>
                      <div className="pack-field" style={{ flex: 2 }}><span className="pack-field-label">Działanie</span><input className="pack-field-input" value={item.effect || ""} onChange={e => upd(item.id, "effect", e.target.value)}/></div>
                    </>
                  )}
                </div>
                <div className="pack-field"><span className="pack-field-label">Notatki</span><input className="pack-field-input" value={item.note || ""} onChange={e => upd(item.id, "note", e.target.value)}/></div>
                <div className="row" style={{ justifyContent: "flex-end", marginTop: "0.3rem" }}><button className="btn-ghost" onClick={() => del(item.id)}>Usuń</button></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
