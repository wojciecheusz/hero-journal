import { clamp } from '../../../utils/math';
import { XP_THRESHOLDS } from '../../../constants/gameConstants';
import { CardHeader, LBL, LBL_SM } from './shared';

export default function CharCard({ char, setChar, C, open, onToggle }) {
  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));

  const totalLevel = Math.min(Math.max((char.classes || []).reduce((s, c) => s + (c.level || 1), 0), 1), 20);
  const xpMax = totalLevel < 20 ? XP_THRESHOLDS[totalLevel] : null;

  return (
    <div className="card">
      <CardHeader label={C.title} open={open} onToggle={onToggle}
        hint={!open ? [
          char.name?.trim(),
          (char.classes||[]).map(c => `${c.name}  ${C.level} ${c.level}`).join(" / ")
        ].filter(Boolean).join("   ·   ") : ""}/>

      {open && (
        <>
          <input className="iedit"
            style={{ fontFamily:"Cinzel,serif", fontSize:"1.35rem", fontWeight:700, letterSpacing:"0.04em", width:"100%", marginBottom:"0.65rem" }}
            value={char.name||""} onChange={e => upd("name", e.target.value)} placeholder={C.heroName}/>

          <div style={{ marginBottom:"0.35rem" }}>
            {(char.classes||[]).map((cls, i) => (
              <div key={i} style={{ display:"flex", alignItems:"baseline", gap:"0.45rem", marginBottom:"0.25rem" }}>
                <input className="iedit flex1"
                  style={{ fontFamily:"Cinzel,serif", fontSize: i===0?"1.05rem":"0.92rem", fontWeight:700, letterSpacing:"0.03em", minWidth:0 }}
                  value={cls.name} placeholder={`${i===0?"":"↳ "}${i+1}`}
                  onChange={e => setChar(c => { const cl=[...c.classes]; cl[i]={...cl[i],name:e.target.value}; return {...c,classes:cl}; })}/>
                {i===0 && (char.classes||[]).length < 4 && (
                  <button className="btn-ghost" style={{ padding:"0.1rem 0.4rem", fontSize:"0.8rem", flexShrink:0 }}
                    onClick={() => setChar(c => ({...c, classes:[...(c.classes||[]),{name:"",level:1}]}))}>+</button>
                )}
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.14em", opacity:0.4, flexShrink:0, textTransform:"uppercase" }}>{C.level}</span>
                <input type="number" className="iedit"
                  style={{ width:28, textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"0.95rem", fontWeight:600, opacity:0.85, flexShrink:0 }}
                  value={cls.level} min={1} max={20}
                  onChange={e => setChar(c => { const cl=[...c.classes]; cl[i]={...cl[i],level:clamp(parseInt(e.target.value)||1,1,20)}; return {...c,classes:cl}; })}/>
                {i > 0 && (
                  <button className="btn-ghost" style={{ padding:"0.1rem 0.35rem", fontSize:"0.65rem", flexShrink:0 }}
                    onClick={() => setChar(c => ({...c, classes:c.classes.filter((_,j) => j!==i)}))}>✕</button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"baseline", gap:"0.5rem", marginBottom:"0.6rem", flexWrap:"wrap" }}>
            <span style={{ ...LBL_SM, marginBottom:0 }}>Σ {C.level}</span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"1rem", fontWeight:700, color:"var(--hj-accent)" }}>{totalLevel}</span>
            <span style={{ ...LBL_SM, marginBottom:0, marginLeft:"0.4rem" }}>XP</span>
            <input type="number" min={0} className="iedit"
              style={{ width:60, fontFamily:"Cinzel,serif", fontSize:"0.9rem", textAlign:"center" }}
              value={char.xp??0} onChange={e => upd("xp", Math.max(0, parseInt(e.target.value)||0))}
              onFocus={e => e.target.select()}/>
            <span style={{ ...LBL_SM, fontSize:"0.42rem", marginBottom:0, opacity:0.6 }}>
              {xpMax !== null ? C.xpNext(totalLevel+1, xpMax.toLocaleString()) : C.xpMax}
            </span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.45rem", marginBottom:"0.45rem" }}>
            <div><div style={LBL}>{C.race}</div>
              <input className="iedit" style={{ fontSize:"0.9rem" }} value={char.race||""} onChange={e => upd("race", e.target.value)} placeholder={C.racePh}/></div>
            <div><div style={LBL}>{C.background}</div>
              <input className="iedit" style={{ fontSize:"0.9rem" }} value={char.background||""} onChange={e => upd("background", e.target.value)} placeholder={C.backgroundPh}/></div>
          </div>

          <div style={{ marginBottom:"0.7rem" }}>
            <div style={LBL}>{C.alignment}</div>
            <input className="iedit" maxLength={8} style={{ fontSize:"0.9rem", maxWidth:120 }} value={char.alignment||""}
              onChange={e => upd("alignment", e.target.value)} placeholder={C.alignmentPh}/>
          </div>

          <hr className="inner-divider" data-label={C.appearance} style={{ marginTop:"0.3rem" }}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.45rem", marginTop:"0.65rem" }}>
            {[
              ["age",C.age,C.agePh],["height",C.height,C.heightPh],["weight",C.weight,C.weightPh],
              ["eyes",C.eyes,C.eyesPh],["skin",C.skin,C.skinPh],["hair",C.hair,C.hairPh],
            ].map(([key,label,ph]) => (
              <div key={key}>
                <div style={LBL}>{label}</div>
                <input className="iedit" style={{ fontSize:"0.88rem" }}
                  value={(char.appearance||{})[key]||""} placeholder={ph}
                  onChange={e => setChar(c => ({...c, appearance:{...(c.appearance||{}),[key]:e.target.value}}))}/>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
