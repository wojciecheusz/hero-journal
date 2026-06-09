import { useState, memo } from 'react';
import { STATUS_CYCLE, QUEST_STATUSES } from '../../constants/enums.js';
import { useT } from '../../i18n/translations';
import { useScrollToEntity } from '../../hooks/useScrollToEntity';

function QuestScreen({ quests, setQuests, openEntity }) {
  const T = useT();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [reward, setReward] = useState("");
  const [expanded, setExpanded] = useState({});

  useScrollToEntity(openEntity, quests, setExpanded);

  const addQuest = () => {
    const n = name.trim(); if (!n) return;
    setQuests(q => [...q, { id: Date.now(), name: n, description: desc.trim(), reward: reward.trim(), status: "active", kroks: [] }]);
    setName(""); setDesc(""); setReward("");
  };
  const cycle  = id => setQuests(q => q.map(x => x.id === id ? { ...x, status: STATUS_CYCLE[x.status] ?? "active" } : x));
  const del    = id => setQuests(q => q.filter(x => x.id !== id));
  const upd    = (id, f, v) => setQuests(q => q.map(x => x.id === id ? { ...x, [f]: v } : x));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const addStep   = id => setQuests(q => q.map(x => x.id === id ? { ...x, kroks: [...(x.kroks||[]), { id: Date.now(), text:"", done:false }] } : x));
  const updStep   = (id,sid,f,v) => setQuests(q => q.map(x => x.id === id ? { ...x, kroks:(x.kroks||[]).map(s => s.id===sid?{...s,[f]:v}:s) } : x));
  const delStep   = (id,sid) => setQuests(q => q.map(x => x.id === id ? { ...x, kroks:(x.kroks||[]).filter(s=>s.id!==sid) } : x));

  const statusClass = s => s === "active" ? "active" : s === "completed" ? "completed" : "failed";

  return (
    <>
      <div className="card">
        <div className="sect-label">{T.QUESTS.newTitle}</div>
        <div className="col">
          <input className="g-input" placeholder={T.QUESTS.namePh} value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && addQuest()}/>
          <input className="g-input" placeholder={T.QUESTS.descPh} value={desc} onChange={e => setDesc(e.target.value)}/>
          <input className="g-input" placeholder={T.QUESTS.rewardPh} value={reward} onChange={e => setReward(e.target.value)}/>
          <div className="row" style={{ justifyContent:"flex-end" }}><button className="btn-ghost" onClick={addQuest}>{T.QUESTS.addBtn}</button></div>
        </div>
      </div>

      {quests.length === 0 && <div className="card empty-state">{T.QUESTS.empty}</div>}

      {QUEST_STATUSES.map(status => {
        const filtered = quests.filter(q => q.status === status); if (!filtered.length) return null;
        const displayStatus = T.LABELS.questStatus[status] || status;
        const lc = status==="active" ? "#c9943e" : status==="completed" ? "#5a8a5a" : "#8a3a3a";
        return (
          <div key={status} style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            <div className="sect-label" style={{ color:lc }}>{displayStatus} <span style={{ opacity:0.5 }}>({filtered.length})</span></div>
            {filtered.map(quest => {
              const open  = !!expanded[quest.id];
              const steps = quest.kroks || [];
              const doneCount = steps.filter(s=>s.done).length;
              const cls   = statusClass(quest.status);
              return (
                <div key={quest.id} id={`entity-${quest.id}`} className={`quest-entry ${cls}`}>
                  <div className="row" style={{ alignItems:"flex-start" }}>
                    <div className="flex1">
                      <div className="row" style={{ marginBottom:"0.3rem", flexWrap:"wrap", gap:"0.4rem" }}>
                        <input className="iedit flex1" style={{ fontFamily:"Cinzel,serif", fontSize:"0.95rem", fontWeight:700 }}
                          value={quest.name} onChange={e => upd(quest.id,"name",e.target.value)} placeholder={T.QUESTS.editNamePh}/>
                        <button className={`badge ${cls}`} onClick={() => cycle(quest.id)} aria-label={`Change status: ${displayStatus}`}>{displayStatus}</button>
                      </div>
                      <input className="iedit" style={{ fontSize:"0.92rem", fontStyle:"italic" }}
                        value={quest.description||""} onChange={e => upd(quest.id,"description",e.target.value)} placeholder={T.QUESTS.editDescPh}/>
                      {quest.reward && <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.1em", color:"var(--quest-reward)", marginTop:"0.3rem" }}>{T.QUESTS.reward} {quest.reward}</div>}
                      {steps.length>0 && <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.08em", marginTop:"0.2rem", opacity:0.6 }}>{doneCount}/{steps.length}</div>}
                    </div>
                    <button className="entity-toggle" onClick={() => toggle(quest.id)} aria-label={open?"Collapse":"Expand"} style={{ marginTop:"0.1rem" }}>{open?"▲":"▼"}</button>
                    <button onClick={() => del(quest.id)} aria-label="Delete quest" style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:"0.85rem", padding:"0.1rem 0.2rem", flexShrink:0, opacity:0.4 }}
                      onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.4"}>✕</button>
                  </div>
                  {open && (
                    <div style={{ marginTop:"0.7rem" }}>
                      {steps.map(step => (
                        <div key={step.id} className="checklist-item">
                          <div className={`check-box${step.done?" checked":""}`} onClick={() => updStep(quest.id,step.id,"done",!step.done)}/>
                          <input className={`iedit flex1 checklist-text${step.done?" done":""}`} style={{ fontSize:"0.92rem" }}
                            value={step.text} onChange={e => updStep(quest.id,step.id,"text",e.target.value)} placeholder={T.QUESTS.stepPh}/>
                          <button aria-label="Delete step" style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:"0.75rem", opacity:0.3 }}
                            onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.3"}
                            onClick={() => delStep(quest.id,step.id)}>✕</button>
                        </div>
                      ))}
                      <div className="row mt05" style={{ justifyContent:"space-between", alignItems:"flex-end" }}>
                        <button className="btn-sm" onClick={() => addStep(quest.id)}>{T.QUESTS.addStep}</button>
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.1rem" }}>
                          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.6 }}>{T.QUESTS.modifyReward}</span>
                          <input className="iedit" style={{ fontSize:"0.88rem", color:"var(--quest-reward)", minWidth:120 }}
                            value={quest.reward||""} onChange={e => upd(quest.id,"reward",e.target.value)} placeholder={T.QUESTS.rewardEditPh}/>
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
export default memo(QuestScreen);
