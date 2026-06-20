import { useState, useCallback } from 'react';
import { clamp, numMod } from '../utils/math';
import { CONDITIONS, XP_THRESHOLDS } from '../constants/gameConstants';
import Icon from '../shared/icons';

const hpColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

const SIZE_LABEL = "0.46rem";

const mkToggleStyleSide = (open, color) => ({
  display:"flex", alignItems:"center", gap:"0.25rem", justifyContent:"center",
  padding:"0.3rem 0.4rem", flex:"1 1 0",
  background: open ? `${color}1e` : "transparent",
  border: `1px solid ${open ? color + "90" : "var(--hj-border-input)"}`,
  color: open ? color : "var(--hj-text-muted)",
  borderRadius: "var(--radius-pill)", cursor:"pointer",
  fontFamily:"Cinzel,serif", fontSize:"0.42rem",
  letterSpacing:"0.06em", textTransform:"uppercase",
  transition:"all 0.15s", whiteSpace:"nowrap", overflow:"hidden",
});

export default function VitalsBar({ char, setChar, C, T, pb, onRestModal, variant = "mobile" }) {
  /* Draft dla Biegłości — char.profBonus||2 w rodzicu zjada NaN podczas
     czyszczenia pola, wiec trzymamy tekst lokalnie do czasu zatwierdzenia */
  const [pbDraft, setPbDraft] = useState(null);
  const [stanyOpen, setStanyOpen] = useState(false);
  const [deathOpen, setDeathOpen] = useState(false);
  const [exhOpen,   setExhOpen]   = useState(false);

  const hp        = char.hp || { current: 0, max: 1, temp: 0 };
  const hpCurSafe = isNaN(hp.current) ? 0 : hp.current;
  const hpMaxSafe = isNaN(hp.max) ? 1 : (hp.max || 1);
  const hpPct = Math.round(clamp((hpCurSafe / hpMaxSafe) * 100, 0, 100));

  const totalLevel = Math.min(Math.max((char.classes||[]).reduce((s,c)=>s+(c.level||1),0),1),20);
  const xp        = char.xp ?? 0;
  const xpSafe    = isNaN(xp) ? 0 : xp;
  const xpNext    = totalLevel < 20 ? XP_THRESHOLDS[totalLevel] : null;
  const xpPct     = xpNext ? Math.min(100, Math.max(0, (xpSafe / xpNext) * 100)) : 100;

  const wisBonus  = Math.floor(((char.stats?.WIS ?? 10) - 10) / 2);
  const percProf  = !!(char.skills?.perception);
  const percExp   = !!(char.skillExp?.perception);
  const percBonus = percExp ? wisBonus + pb*2 : percProf ? wisBonus + pb : wisBonus;
  const spellAbi  = Math.floor(((char.stats??{})[char.spellcastingAbility||"INT"]||10)-10)/2;
  const spellDC   = 8 + pb + spellAbi;
  const spellAtk  = pb + spellAbi;

  const hd         = char.hitDice || { type:"d8", max:1, used:0 };
  const hdPipCount = Math.min(hd.max || 1, 12);
  const ds         = char.deathSaves || { successes: 0, failures: 0 };
  const exhaustion = (char.conditions||{}).exhaustion || 0;

  const adjustHP = delta => setChar(c => {
    const h = c.hp || { current: 0, max: 1, temp: 0 };
    return { ...c, hp: { ...h, current: clamp(h.current + delta, 0, h.max) } };
  });

  const toggleDeath = useCallback((type, idx) => setChar(c => {
    const cur  = (c.deathSaves||{})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves||{}), [type]: Math.min(3, Math.max(0, next)) } };
  }), [setChar]);

  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);

  return (
    <>
    <div className={`vitals-bar vitals-bar-${variant}`}>
      <div className="vitals-hp">
        <div className="vitals-hp-row">
          <span className="vitals-hp-label">{C.hp}</span>
          <span className="vitals-hp-value">
            <input type="number" className="vitals-hp-current" value={hp.current} style={{ color: hpColor(hpPct) }}
              onFocus={e => e.target.select()}
              onChange={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, current: isNaN(v)?v:clamp(v,0,h.max) } }; }); }}
              onBlur={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, current: clamp(isNaN(v)?0:v, 0, h.max) } }; }); }}/>
            <span className="vitals-hp-sep">/</span>
            <input type="number" min={1} className="vitals-hp-max" value={hp.max}
              onFocus={e => e.target.select()}
              onChange={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, max: isNaN(v)?v:Math.max(1,v) } }; }); }}
              onBlur={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, max: Math.max(1, isNaN(v)?1:v) } }; }); }}/>
          </span>
          <span className="vitals-hp-temp" title={C.hpTemp}>
            <Icon name="shield" size="0.8em"/>
            <input type="number" min={0} value={hp.temp ?? 0}
              onFocus={e => e.target.select()}
              onChange={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, temp: v } }; }); }}
              onBlur={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, temp: isNaN(v)?0:Math.max(0,v) } }; }); }}/>
          </span>
        </div>
        <div className="hp-bar-bg">
          <div className="hp-bar-fill" style={{ width: `${hpPct}%`, background: hpColor(hpPct) }}/>
        </div>
      </div>

      {/* ── Pasek XP ── */}
      <div style={{ margin:"6px 0 0", display:"flex", alignItems:"center", gap:"6px" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:SIZE_LABEL, letterSpacing:"0.1em",
                       textTransform:"uppercase", color:"var(--hj-text-muted)", flexShrink:0 }}>XP</span>
        <input type="number" min={0} value={xp}
          onFocus={e => e.target.select()}
          onChange={e => { const v=parseInt(e.target.value); setChar(c => ({...c, xp: isNaN(v)?v:Math.max(0,v)})); }}
          onBlur={e => { const v=parseInt(e.target.value); setChar(c => ({...c, xp: isNaN(v)?0:Math.max(0,v)})); }}
          style={{ fontFamily:"Cinzel,serif", fontSize:"0.78rem", fontWeight:700,
                   color:"var(--hj-accent)", background:"transparent", border:"none",
                   outline:"none", width:42, textAlign:"left", flexShrink:0, padding:0 }}/>
        <div style={{ flex:1, height:5, borderRadius:"var(--radius-pill)",
                      background:"var(--hj-border-input)", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${xpPct}%`, background:"var(--hj-accent)",
                        borderRadius:"var(--radius-pill)", transition:"width 0.3s ease" }}/>
        </div>
      </div>
      {xpNext ? (
        <div style={{ fontFamily:"Cinzel,serif", fontSize:SIZE_LABEL, letterSpacing:"0.04em", fontWeight:600,
                      color: xpSafe >= xpNext ? "var(--hj-accent)" : "var(--hj-text-muted)",
                      marginTop:"2px", textAlign:"right" }}>
          {xpSafe >= xpNext
            ? `✦ ${C.level} ${totalLevel + 1}`
            : `${(xpNext - xpSafe).toLocaleString()} XP → ${C.level} ${totalLevel + 1}`}
        </div>
      ) : (
        <div style={{ fontFamily:"Cinzel,serif", fontSize:SIZE_LABEL, color:"var(--hj-accent)", marginTop:"2px", textAlign:"right" }}>
          {C.xpMax || "MAX"}
        </div>
      )}

      <div className="vitals-mini-grid" style={{ marginTop:"6px" }}>
        <div className="vitals-mini-box" title={C.ac}>
          <input className="vitals-mini-value" type="number" value={char.ac ?? 0}
            onFocus={e => e.target.select()}
            onChange={e => { const v=parseInt(e.target.value); upd("ac", v); }}
            onBlur={e => { const v=parseInt(e.target.value); upd("ac", isNaN(v)?0:v); }}/>
          <span className="vitals-mini-label">{C.ac}</span>
        </div>
        <div className="vitals-mini-box" title={C.initiativeTip}>
          <input className="vitals-mini-value" type="number" value={initiative}
            onFocus={e => e.target.select()}
            onChange={e => upd("initiativeBonus", e.target.value==="" ? undefined : parseInt(e.target.value))}
            onBlur={e => { if (e.target.value==="") setChar(c => { const o={...c}; delete o.initiativeBonus; return o; }); }}/>
          <span className="vitals-mini-label">{C.initiative}</span>
        </div>
        <div className="vitals-mini-box featured" title={C.profBonusTip}>
          <input className="vitals-mini-value" type="number" value={pbDraft ?? pb}
            onFocus={e => { e.target.select(); setPbDraft(String(pb)); }}
            onChange={e => {
              setPbDraft(e.target.value);
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v > 0) upd("profBonus", v);
            }}
            onBlur={e => {
              const v = parseInt(pbDraft ?? "");
              upd("profBonus", (!isNaN(v) && v > 0) ? v : 2);
              setPbDraft(null);
            }}/>
          <span className="vitals-mini-label">{C.profBonus}</span>
        </div>
      </div>

      {/* ── Drugi rząd mini-statów: Pas. Percepcja / DC Czarów / Atak Czarami ── */}
      <div className="vitals-mini-grid" style={{ marginTop:"6px" }}>
        {[
          { label: C.passivePerc, key:"passivePerceptionOverride", computed: 10+percBonus },
          { label: C.spellDC,     key:"skillDCOverride",           computed: spellDC },
          { label: C.spellAtk,    key:"spellAttackOverride",       computed: spellAtk, signed: true },
        ].map(({ label, key, computed, signed }) => {
          const over = char[key];
          const displayVal = signed ? numMod(over ?? computed) : String(over ?? computed);
          return (
            <div key={key} className="vitals-mini-box" title={C.overrideTip || "Wpisz by nadpisać"}>
              <input className="vitals-mini-value" type="text" inputMode="numeric"
                value={displayVal}
                style={{ color: over !== undefined ? "var(--hj-pip-prof)" : undefined }}
                onFocus={e => e.target.select()}
                onChange={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  setChar(c => r===""
                    ? (o => { const n={...o}; delete n[key]; return n; })(c)
                    : {...c, [key]: parseInt(r)});
                }}
                onBlur={e => {
                  if (!e.target.value.trim() || isNaN(parseInt(e.target.value)))
                    setChar(c => { const n={...c}; delete n[key]; return n; });
                }}/>
              <span className="vitals-mini-label">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="vitals-controls">
        <button className="btn-pm minus" aria-label="Decrease HP" onClick={() => adjustHP(-1)}><Icon name="minus" size="1em"/></button>
        <button className="btn-pm plus" aria-label="Increase HP" onClick={() => adjustHP(1)}><Icon name="plus" size="1em"/></button>
      </div>

      {/* ── Stany / Rzuty vs Śmierć / Wyczerpanie ── */}
      <div style={{ display:"flex", gap:"4px", marginTop:"8px" }}>
        <button style={mkToggleStyleSide(stanyOpen, "#aa4444")}
          onClick={() => setStanyOpen(s => !s)} aria-expanded={stanyOpen}>
          <Icon name="skull" size="0.8em"/>
          {C.stanyTitle||"Stany"}
        </button>
        <button style={mkToggleStyleSide(deathOpen, "#9a3a3a")}
          onClick={() => setDeathOpen(s => !s)} aria-expanded={deathOpen}>
          <Icon name="heart" size="0.8em"/>
          {C.deathSaves}
        </button>
        <button style={mkToggleStyleSide(exhOpen, "#b06020")}
          onClick={() => setExhOpen(s => !s)} aria-expanded={exhOpen}>
          <Icon name="activity" size="0.8em"/>
          {exhaustion > 0 && <span style={{ fontWeight:700 }}>{exhaustion}</span>}
          {C.exhaustion}
        </button>
      </div>

      {stanyOpen && (
        <div style={{ marginTop:"0.4rem", padding:"0.45rem 0.5rem",
                      border:"1px solid rgba(170,68,68,0.3)", background:"rgba(170,68,68,0.05)",
                      borderRadius:"var(--radius-md)" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
            {CONDITIONS.map(cond => {
              const active = !!(char.conditions||{})[cond.key];
              const label  = T?.CONDITIONS?.[cond.key] || cond.label;
              return (
                <button key={cond.key}
                  onClick={() => setChar(c => {
                    const conds={...(c.conditions||{})};
                    if(conds[cond.key]) delete conds[cond.key]; else conds[cond.key]=true;
                    return {...c,conditions:conds};
                  })}
                  style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.05em",
                           textTransform:"uppercase", padding:"0.18rem 0.4rem", cursor:"pointer",
                           transition:"all 0.15s", borderRadius:"var(--radius-pill)",
                           border:`1px solid ${active?"#cc3030":"var(--hj-pip-empty)"}`,
                           background:active?"rgba(200,48,48,0.2)":"transparent",
                           color:active?"#ee5050":"var(--hj-text-muted)" }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {deathOpen && (
        <div style={{ marginTop:"0.4rem", padding:"0.45rem 0.5rem",
                      border:"1px solid rgba(154,58,58,0.3)", background:"rgba(154,58,58,0.05)",
                      borderRadius:"var(--radius-md)" }}>
          {[["successes",C.deathSuccess,"#4a9a5a"],["failures",C.deathFailure,"#9a3a3a"]].map(([type,label,color], i) => (
            <div key={type} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                                      padding:"0.25rem 0",
                                      borderTop: i>0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.06em",
                             textTransform:"uppercase", color }}>{label}</span>
              <div style={{ display:"flex", gap:"0.3rem" }}>
                {[0,1,2].map(i2 => (
                  <button key={i2} onClick={() => toggleDeath(type, i2)}
                    style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${color}`,
                             background:i2<(ds[type]||0)?color:"transparent",
                             cursor:"pointer", transition:"background 0.15s", flexShrink:0, padding:0 }}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {exhOpen && (
        <div style={{ marginTop:"0.4rem", padding:"0.45rem 0.5rem",
                      border:"1px solid rgba(176,96,32,0.3)", background:"rgba(176,96,32,0.05)",
                      borderRadius:"var(--radius-md)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.25rem" }}>
            {[0,1,2,3,4,5,6].map(level => {
              const cur    = exhaustion;
              const filled = level > 0 && level <= cur;
              return (
                <button key={level}
                  onClick={() => setChar(c => ({...c,conditions:{...(c.conditions||{}),exhaustion:level===cur?0:level}}))}
                  style={{ width:"100%", aspectRatio:"1", borderRadius:"var(--radius-sm)",
                           border:`1.5px solid ${filled?"#cc5020":level===0&&cur===0?"#4a9a5a":"var(--hj-pip-empty)"}`,
                           background:filled?"rgba(200,80,32,0.25)":level===0&&cur===0?"rgba(74,154,90,0.15)":"transparent",
                           cursor:"pointer", fontFamily:"Cinzel,serif", fontSize:"0.5rem", fontWeight:700,
                           color:filled?"#ee7040":level===0&&cur===0?"#4a9a5a":"var(--hj-text-dim)",
                           display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {level===0?<Icon name="check" size="0.8em"/>:level}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>

    <div className={`rest-row rest-row-${variant}`}>
      <button className="btn-rest short" aria-label="Short rest" onClick={() => onRestModal("short")}>
        <Icon name="moon" size="1.1em"/>
        <span>{C.shortRest}</span>
        <div style={{ display:"flex", flexWrap:"wrap", gap:2, justifyContent:"center", marginTop:1 }}>
          {Array.from({ length: hdPipCount }, (_, i) => {
            const used = i < (hd.used||0);
            return (
              <span key={i} style={{
                width:4, height:4, borderRadius:"50%", display:"inline-block", flexShrink:0,
                background: used ? "transparent" : "var(--hj-accent)",
                border: `1px solid ${used ? "rgba(128,128,128,0.35)" : "var(--hj-accent)"}`,
                opacity: used ? 0.5 : 1,
              }}/>
            );
          })}
        </div>
      </button>
      <button className="btn-rest long" aria-label="Long rest" onClick={() => onRestModal("long")}>
        <Icon name="sun" size="1.1em"/>
        <span>{C.longRest}</span>
      </button>
    </div>
    </>
  );
}
