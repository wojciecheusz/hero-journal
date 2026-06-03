import { useCallback } from 'react';
import { clamp, numMod } from '../../../utils/math';
import { CONDITIONS } from '../../../constants/gameConstants';
import { LBL_SM } from './shared';

const hpNumColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

export default function CombatCard({ char, setChar, C, T, pb, percBonus, spellAbi, spellDC, onRestModal }) {
  const upd  = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));
  const ds   = char.deathSaves || { successes: 0, failures: 0 };

  const toggleCondition = useCallback(key => setChar(c => {
    const conds = { ...(c.conditions||{}) };
    if (conds[key]) delete conds[key]; else conds[key] = true;
    return { ...c, conditions: conds };
  }), [setChar]);

  const toggleDeath = useCallback((type, idx) => setChar(c => {
    const cur = (c.deathSaves||{})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves||{}), [type]: Math.min(3, Math.max(0, next)) } };
  }), [setChar]);

  return (
    <div className="card">
      <div className="sect-label">{C.combatTitle}</div>

      <div className="combat-layout">

        {/* ── LEWA: AC / HP / Hit Dice ── */}
        <div className="combat-group">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem" }}>
            {[
              [C.ac, char.ac||0, v => upd("ac", parseInt(v)||0), C.ac],
              [C.initiative, char.initiativeBonus !== undefined ? char.initiativeBonus : Math.floor((char.stats.DEX-10)/2), null, C.initiativeTip],
              [C.speed, char.speed||30, v => upd("speed", parseInt(v)||30), C.speed],
              [C.profBonus, pb, v => upd("profBonus", parseInt(v)||2), C.profBonusTip],
            ].map(([label, val, onChange, tip], i) => (
              <div key={i} className="combat-box" title={tip}>
                <span className="combat-box-label">{label}</span>
                <input className="combat-box-input" type="number" value={val}
                  onFocus={e => e.target.select()}
                  onChange={e => {
                    if (i === 0) upd("ac", e.target.value===""?0:parseInt(e.target.value)||0);
                    else if (i === 1) upd("initiativeBonus", e.target.value===""?undefined:parseInt(e.target.value));
                    else onChange?.(e.target.value);
                  }}
                  onBlur={e => {
                    if (i === 1 && e.target.value==="") setChar(c => { const o={...c}; delete o.initiativeBonus; return o; });
                  }}/>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"36px 1fr 36px auto", gap:"0.3rem", alignItems:"stretch" }}>
            <button className="btn-pm minus" onClick={() => setChar(c => ({...c, hp:{...c.hp, current:clamp(c.hp.current-1,0,c.hp.max)}}))}>−</button>
            <div className="combat-box" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0.2rem 0.5rem", gap:0 }}>
              <span className="combat-box-label">{C.hp}</span>
              <div style={{ display:"flex", alignItems:"baseline", gap:"0.15rem" }}>
                <input type="number" value={char.hp.current}
                  style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"1.4rem", fontWeight:700, width:52, color:hpNumColor(hpPct), transition:"color 0.5s" }}
                  onFocus={e => e.target.select()}
                  onChange={e => setChar(c => ({...c, hp:{...c.hp, current:e.target.value===""?0:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}
                  onBlur={e => setChar(c => ({...c, hp:{...c.hp, current:clamp(parseInt(e.target.value)||0,0,c.hp.max)}}))}/>
                <span style={{ color:"inherit", opacity:0.35, fontSize:"0.85rem" }}>/</span>
                <input type="number" value={char.hp.max}
                  style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", textAlign:"center", fontSize:"0.9rem", width:40, opacity:0.75 }}
                  onFocus={e => e.target.select()}
                  onChange={e => setChar(c => ({...c, hp:{...c.hp, max:e.target.value===""?1:Math.max(1,parseInt(e.target.value)||1)}}))}
                  onBlur={e => setChar(c => ({...c, hp:{...c.hp, max:Math.max(1,parseInt(e.target.value)||1)}}))}/>
              </div>
            </div>
            <button className="btn-pm plus" onClick={() => setChar(c => ({...c, hp:{...c.hp, current:clamp(c.hp.current+1,0,c.hp.max)}}))}>+</button>
            <div className="combat-box" style={{ minWidth:72 }}>
              <span className="combat-box-label">{C.hpTemp}</span>
              <input className="combat-box-input" type="number" value={char.hp.temp||0}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({...c, hp:{...c.hp, temp:e.target.value===""?0:parseInt(e.target.value)||0}}))}
                onBlur={e => setChar(c => ({...c, hp:{...c.hp, temp:parseInt(e.target.value)||0}}))}/>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:"0.4rem", alignItems:"stretch" }}>
            <div className="combat-box" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0.3rem 0.6rem", gap:"0.1rem" }}>
              <span className="combat-box-label">{C.hitDice}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"0.25rem" }}>
                <select className="combat-box-input" style={{ width:"auto", cursor:"pointer", fontSize:"0.75rem" }}
                  value={(char.hitDice||{type:"d8"}).type}
                  onChange={e => setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),type:e.target.value}}))}>
                  {["d4","d6","d8","d10","d12"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" min={0} max={(char.hitDice||{max:1}).max||1}
                  value={Math.max(0, ((char.hitDice||{max:1}).max||1) - ((char.hitDice||{used:0}).used||0))}
                  onChange={e => { const rem=parseInt(e.target.value)||0; const max=(char.hitDice||{max:1}).max||1; setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),used:Math.max(0,max-rem)}})); }}
                  style={{ width:24, background:"transparent", border:"none", borderBottom:"1px dashed currentColor", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center" }}/>
                <span style={{ fontSize:"0.6rem", opacity:0.35 }}>/</span>
                <input type="number" min={1} value={(char.hitDice||{max:1}).max||1}
                  onChange={e => setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),max:parseInt(e.target.value)||1}}))}
                  style={{ width:24, background:"transparent", border:"none", borderBottom:"1px dashed currentColor", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.9rem", textAlign:"center", opacity:0.65 }}/>
              </div>
            </div>
            <button className="btn-rest short" onClick={() => onRestModal("short")}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.1rem", padding:"0.4rem 0.8rem" }}>
              <span style={{ fontSize:"1rem", lineHeight:1 }}>☽</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.43rem", textTransform:"uppercase" }}>{C.shortRest}</span>
            </button>
            <button className="btn-rest long" onClick={() => onRestModal("long")}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.1rem", padding:"0.4rem 0.8rem" }}>
              <span style={{ fontSize:"1rem", lineHeight:1 }}>☀</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.43rem", textTransform:"uppercase" }}>{C.longRest}</span>
            </button>
          </div>
        </div>

        {/* ── PRAWA: Percepcja / Stany / Śmierć ── */}
        <div className="combat-group">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem" }}>
            <div className="combat-box">
              <span className="combat-box-label">{C.passivePerc}</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, display:"block", textAlign:"center" }}>{10+percBonus}</span>
            </div>
            <div className="combat-box">
              <span className="combat-box-label">{C.spellDC}</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, display:"block", textAlign:"center", color:"var(--spell-accent)" }}>{spellDC}</span>
            </div>
            <div className="combat-box">
              <span className="combat-box-label">{C.spellAtk}</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, display:"block", textAlign:"center", color:"var(--spell-accent)" }}>{numMod(pb+spellAbi)}</span>
            </div>
          </div>

          <div>
            <div style={{ ...LBL_SM, marginBottom:"0.4rem" }}>{C.conditionsTitle}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
              {CONDITIONS.map(cond => {
                const active = !!(char.conditions||{})[cond.key];
                const label  = T.CONDITIONS?.[cond.key] || cond.label;
                return (
                  <button key={cond.key} onClick={() => toggleCondition(cond.key)}
                    style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.06em", textTransform:"uppercase", padding:"0.22rem 0.45rem", border:`1px solid ${active?"#cc3030":"var(--pip-empty)"}`, background:active?"rgba(200,48,48,0.2)":"transparent", color:active?"#ee5050":"var(--text-muted)", cursor:"pointer", transition:"all 0.15s", borderRadius:"2px" }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.7rem", alignItems:"start" }}>
            <div style={{ padding:"0.5rem 0.6rem", border:"1px solid rgba(128,128,128,0.14)", background:"rgba(128,128,128,0.04)", borderRadius:"2px" }}>
              <div style={{ ...LBL_SM, marginBottom:"0.5rem" }}>{C.deathSaves}</div>
              {[["successes",C.deathSuccess,"#4a9a5a"],["failures",C.deathFailure,"#9a3a3a"]].map(([type,label,color]) => (
                <div key={type} style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.35rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em", textTransform:"uppercase", color, flexShrink:0, minWidth:44 }}>{label}</span>
                  <div style={{ display:"flex", gap:"0.3rem" }}>
                    {[0,1,2].map(i => (
                      <div key={i} onClick={() => toggleDeath(type, i)}
                        style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${color}`, background:i<(ds[type]||0)?color:"transparent", cursor:"pointer", transition:"background 0.15s", flexShrink:0 }}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"0.5rem 0.6rem", border:"1px solid rgba(128,128,128,0.14)", background:"rgba(128,128,128,0.04)", borderRadius:"2px" }}>
              <div style={{ ...LBL_SM, marginBottom:"0.5rem" }}>{C.exhaustion}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 2rem)", gap:"0.25rem" }}>
                {[0,1,2,3,4,5,6].map(level => {
                  const cur = (char.conditions||{}).exhaustion || 0;
                  const filled = level > 0 && level <= cur;
                  return (
                    <button key={level}
                      onClick={() => setChar(c => ({...c, conditions:{...(c.conditions||{}), exhaustion:level===cur?0:level}}))}
                      style={{ width:"2rem", height:"2rem", borderRadius:"4px", border:`1.5px solid ${filled?"#cc5020":level===0&&cur===0?"#4a9a5a":"var(--pip-empty)"}`, background:filled?"rgba(200,80,32,0.25)":level===0&&cur===0?"rgba(74,154,90,0.15)":"transparent", cursor:"pointer", fontFamily:"Cinzel,serif", fontSize:"0.55rem", fontWeight:700, color:filled?"#ee7040":level===0&&cur===0?"#4a9a5a":"var(--text-dim)", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {level===0?"✓":level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
