import { useState, useCallback } from 'react';
import { numMod } from '../../../utils/math';
import { LBL_SM } from './shared';
import Icon from '../../../shared/icons';

export default function CombatCard({ char, setChar, C, T, pb }) {
  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const ds  = char.deathSaves || { successes: 0, failures: 0 };

  const [deathOpen, setDeathOpen] = useState(false);
  const [exhOpen,   setExhOpen]   = useState(false);

  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);

  const toggleDeath = useCallback((type, idx) => setChar(c => {
    const cur  = (c.deathSaves||{})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves||{}), [type]: Math.min(3, Math.max(0, next)) } };
  }), [setChar]);

  const exhaustion = (char.conditions||{}).exhaustion || 0;

  /* ── Wspólny styl przycisku toggle (jak STANY) ── */
  const toggleBtn = (open, color, label, icon) => ({
    display:"flex", alignItems:"center", gap:"0.3rem",
    padding:"0.3rem 0.7rem",
    background: open ? `${color}1a` : "transparent",
    border: `1px solid ${open ? color+"80" : "var(--hj-border-input)"}`,
    color: open ? color : "var(--hj-text-muted)",
    borderRadius: "var(--radius-sm)", cursor:"pointer",
    fontFamily:"Cinzel,serif", fontSize:"0.48rem",
    letterSpacing:"0.08em", textTransform:"uppercase",
    transition:"all 0.15s", flex:1, justifyContent:"center",
  });

  return (
    <div className="card">
      <div className="sect-divider">{C.combatTitle}</div>

      <div className="combat-layout">

        {/* ── Prędkość + Kości Wytrzymałości ── */}
        <div className="combat-group">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem" }}>
            <div className="combat-box">
              <span className="combat-box-label">{C.speed}</span>
              <input className="combat-box-input" type="number" value={char.speed||30}
                onFocus={e => e.target.select()}
                onChange={e => upd("speed", parseInt(e.target.value)||30)}/>
            </div>
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
                  style={{ width:24, background:"transparent", border:"none", borderBottom:"1px dashed var(--hj-accent)", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, textAlign:"center", color:"var(--hj-accent)" }}/>
                <span style={{ color:"var(--hj-text-muted)", opacity:0.5, fontSize:"0.6rem" }}>/</span>
                <input type="number" min={1} value={(char.hitDice||{max:1}).max||1}
                  onChange={e => setChar(c => ({...c, hitDice:{...(c.hitDice||{type:"d8",max:1,used:0}),max:parseInt(e.target.value)||1}}))}
                  style={{ width:24, background:"transparent", border:"none", borderBottom:"1px dashed var(--hj-text-muted)", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.9rem", textAlign:"center", color:"var(--hj-text-muted)", opacity:0.8 }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── KP + Inicjatywa + Biegłość ── */}
        <div className="combat-group">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:"0.4rem", marginBottom:"0.5rem" }}>
            {/* KP */}
            <div className="combat-box">
              <span className="combat-box-label">{C.ac}</span>
              <input className="combat-box-input" type="number" value={char.ac||0}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({...c, ac: e.target.value===""?0:parseInt(e.target.value)||0}))}/>
            </div>
            {/* Inicjatywa */}
            <div className="combat-box">
              <span className="combat-box-label">{C.initiative}</span>
              <input className="combat-box-input" type="text" inputMode="numeric" value={numMod(initiative)}
                onFocus={e => e.target.select()}
                onChange={e => {
                  const raw = e.target.value.replace(/[^-\d]/g, "");
                  setChar(c => raw===""
                    ? (({ initiativeBonus:_, ...rest }) => rest)(c)
                    : {...c, initiativeBonus: parseInt(raw)});
                }}
                onBlur={e => {
                  if (e.target.value==="" || isNaN(parseInt(e.target.value.replace(/[^-\d]/g,""))))
                    setChar(c => { const o={...c}; delete o.initiativeBonus; return o; });
                }}/>
            </div>
            {/* Biegłość */}
            <div className="combat-box">
              <span className="combat-box-label">{C.profBonus}</span>
              <input className="combat-box-input" type="number" value={pb}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({...c, profBonus: parseInt(e.target.value)||2}))}/>
            </div>
          </div>

          {/* ── Rzuty vs Śmierć + Wyczerpanie — toggles ── */}
          <div style={{ display:"flex", gap:"0.4rem" }}>
            <button style={toggleBtn(deathOpen, "#9a4a4a", C.deathSaves, "skull")}
              onClick={() => setDeathOpen(s => !s)} aria-expanded={deathOpen}>
              <Icon name="skull" size="0.9em"/>
              {C.deathSaves}
              <Icon name={deathOpen ? "chevron-up" : "chevron-down"} size="0.75em"/>
            </button>
            <button style={toggleBtn(exhOpen, "#b06020", C.exhaustion, "zap")}
              onClick={() => setExhOpen(s => !s)} aria-expanded={exhOpen}>
              <Icon name="activity" size="0.9em"/>
              {C.exhaustion}
              {exhaustion > 0 && <span style={{ fontWeight:700, fontSize:"0.55rem" }}>{exhaustion}</span>}
              <Icon name={exhOpen ? "chevron-up" : "chevron-down"} size="0.75em"/>
            </button>
          </div>

          {/* Rzuty vs Śmierć — rozwinięte */}
          {deathOpen && (
            <div style={{ marginTop:"0.35rem", padding:"0.5rem 0.6rem",
                          border:"1px solid rgba(154,74,74,0.3)", background:"rgba(154,74,74,0.05)",
                          borderRadius:"var(--radius-md)" }}>
              {[["successes",C.deathSuccess,"#4a9a5a"],["failures",C.deathFailure,"#9a3a3a"]].map(([type,label,color]) => (
                <div key={type} style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.35rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em",
                                 textTransform:"uppercase", color, flexShrink:0, minWidth:50 }}>{label}</span>
                  <div style={{ display:"flex", gap:"0.3rem" }}>
                    {[0,1,2].map(i => (
                      <button key={i} onClick={() => toggleDeath(type, i)}
                        aria-label={`${label} ${i+1}`}
                        style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${color}`,
                                 background:i<(ds[type]||0)?color:"transparent",
                                 cursor:"pointer", transition:"background 0.15s", flexShrink:0, padding:0 }}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wyczerpanie — rozwinięte */}
          {exhOpen && (
            <div style={{ marginTop:"0.35rem", padding:"0.5rem 0.6rem",
                          border:"1px solid rgba(176,96,32,0.3)", background:"rgba(176,96,32,0.05)",
                          borderRadius:"var(--radius-md)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 2rem)", gap:"0.25rem" }}>
                {[0,1,2,3,4,5,6].map(level => {
                  const cur    = exhaustion;
                  const filled = level > 0 && level <= cur;
                  return (
                    <button key={level}
                      onClick={() => setChar(c => ({...c, conditions:{...(c.conditions||{}), exhaustion:level===cur?0:level}}))}
                      style={{ width:"2rem", height:"2rem", borderRadius:"var(--radius-sm)",
                               border:`1.5px solid ${filled?"#cc5020":level===0&&cur===0?"#4a9a5a":"var(--hj-pip-empty)"}`,
                               background:filled?"rgba(200,80,32,0.25)":level===0&&cur===0?"rgba(74,154,90,0.15)":"transparent",
                               cursor:"pointer", fontFamily:"Cinzel,serif", fontSize:"0.55rem", fontWeight:700,
                               color:filled?"#ee7040":level===0&&cur===0?"#4a9a5a":"var(--hj-text-dim)",
                               lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {level===0 ? <Icon name="check" size="0.9em"/> : level}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
