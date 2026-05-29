import { useState, useEffect } from 'react';
import { STATUS_CYCLE } from '../../constants/gameConstants';

const today = () => new Date().toISOString().slice(0, 10);

export default function QuestScreen({ quests, setZadania, openEntity }) {
  const [name, setImie] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!openEntity?.name) return;
    const found = quests.find(q => q.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (found) {
      setExpanded(e => ({ ...e, [found.id]: true }));
      setTimeout(() => document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }, [openEntity]);
  const [reward, setNagroda] = useState("");
  const [expanded, setExpanded] = useState({});

  const addQuest = () => {
    const n = name.trim(); if (!n) return;
    setZadania(q => [...q, { id: Date.now(), name: n, description: desc.trim(), reward: reward.trim(), status: "Aktywne", kroks: [] }]);
    setImie(""); setDesc(""); setNagroda("");
  };
  const cycle = id => setZadania(q => q.map(x => x.id === id ? { ...x, status: STATUS_CYCLE[x.status] } : x));
  const del = id => setZadania(q => q.filter(x => x.id !== id));
  const upd = (id, f, v) => setZadania(q => q.map(x => x.id === id ? { ...x, [f]: v } : x));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const addStep = id => setZadania(q => q.map(x => x.id === id ? { ...x, kroks: [...(x.kroks || []), { id: Date.now(), text: "", done: false }] } : x));
  const updStep = (id, sid, f, v) => setZadania(q => q.map(x => x.id === id ? { ...x, kroks: (x.kroks || []).map(s => s.id === sid ? { ...s, [f]: v } : s) } : x));
  const delStep = (id, sid) => setZadania(q => q.map(x => x.id === id ? { ...x, kroks: (x.kroks || []).filter(s => s.id !== sid) } : x));

  return (
    <>
      <div className="card">
        <div className="sect-label">Nowe zadanie w dzienniku</div>
        <div className="col">
          <input className="g-input" placeholder="Nazwa zlecenia / misji głównej…" value={name} onChange={e => setImie(e.target.value)} onKeyDown={e => e.key === "Enter" && addQuest()}/>
          <input className="g-input" placeholder="Krótki opis celów zlecenia…" value={desc} onChange={e => setDesc(e.target.value)}/>
          <input className="g-input" placeholder="Przewidziana nagroda (np. złoto, unikalny artefakt, PD)…" value={reward} onChange={e => setNagroda(e.target.value)}/>
          <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn-ghost" onClick={addQuest}>⊕ Aktywuj zadanie</button></div>
        </div>
      </div>

      {quests.length === 0 && <div className="card empty-state">Brak aktywnych zleceń i zadań w dzienniku. Pokonaj marazm!</div>}
      {["Aktywne", "Ukończone", "Nieudane"].map(status => {
        const filtered = quests.filter(q => q.status === status); if (!filtered.length) return null;
        const lc = status === "Aktywne" ? "#c9943e" : status === "Ukończone" ? "#5a8a5a" : "#8a3a3a";
        return (
          <div key={status} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="sect-label" style={{ color: lc }}>{status} <span style={{ opacity: 0.5 }}>({filtered.length})</span></div>
            {filtered.map(quest => {
              const open = !!expanded[quest.id];
              const kroks = quest.kroks || [];
              const doneCount = kroks.filter(s => s.done).length;
              const statusClass = status === "Aktywne" ? "active" : status === "Ukończone" ? "completed" : "failed";
              return (
                <div key={quest.id} id={`entity-${quest.id}`} className={`quest-entry ${statusClass}`}>
                  <div className="row" style={{ alignItems: "flex-start" }}>
                    <div className="flex1">
                      <div className="row" style={{ marginBottom: "0.3rem", flexWrap: "wrap", gap: "0.4rem" }}>
                        <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: "0.95rem", fontWeight: 700 }}
                          value={quest.name} onChange={e => upd(quest.id, "name", e.target.value)} placeholder="Nazwa zlecenia…"/>
                        <span className={`badge ${statusClass}`} onClick={() => cycle(quest.id)}>{status}</span>
                      </div>
                      <input className="iedit" style={{ fontSize: "0.92rem", fontStyle: "italic" }}
                        value={quest.description || ""} onChange={e => upd(quest.id, "description", e.target.value)} placeholder="Opis…"/>
                      {quest.reward && <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.1em", color: "var(--quest-reward)", marginTop: "0.3rem" }}>⭐ Nagroda: {quest.reward}</div>}
                      {kroks.length > 0 && <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.08em", marginTop: "0.2rem", opacity: 0.6 }}>Postęp krokowy: {doneCount}/{kroks.length} wykonanych celów</div>}
                    </div>
                    <button className="entity-toggle" onClick={() => toggle(quest.id)} style={{ marginTop: "0.1rem" }}>{open ? "▲" : "▼"}</button>
                    <button onClick={() => del(quest.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.2rem", flexShrink: 0, opacity: 0.4 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}>✕</button>
                  </div>
                  {open && (
                    <div style={{ marginTop: "0.7rem" }}>
                      {kroks.map(krok => (
                        <div key={krok.id} className="checklist-item">
                          <div className={`check-box${krok.done ? " checked" : ""}`} onClick={() => updStep(quest.id, krok.id, "done", !krok.done)}/>
                          <input className={`iedit flex1 checklist-text${krok.done ? " done" : ""}`} style={{ fontSize: "0.92rem" }}
                            value={krok.text} onChange={e => updStep(quest.id, krok.id, "text", e.target.value)} placeholder="Opis kroku szczegółowego…"/>
                          <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "0.75rem", opacity: 0.3 }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.3"}
                            onClick={() => delStep(quest.id, krok.id)}>✕</button>
                        </div>
                      ))}
                      <div className="row mt05" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                        <button className="btn-sm" onClick={() => addStep(quest.id)}>+ Dodaj krok</button>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                          <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>Modyfikuj nagrodę</span>
                          <input className="iedit" style={{ fontSize: "0.88rem", color: "var(--quest-reward)", minWidth: 120 }}
                            value={quest.reward || ""} onChange={e => upd(quest.id, "reward", e.target.value)} placeholder="Nagroda…"/>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
