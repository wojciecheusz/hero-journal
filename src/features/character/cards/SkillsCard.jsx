import { useCallback } from 'react';
import { numMod } from '../../../utils/math';

export default function SkillsCard({ char, setChar, C, GENERIC_SKILLS, pb }) {
  const cycleSkill = useCallback(key => setChar(c => {
    const wasP = !!(c.skills||{})[key]; const wasE = !!(c.skillExp||{})[key];
    if (!wasP && !wasE) return { ...c, skills:{...(c.skills||{}),[key]:true}, skillExp:{...(c.skillExp||{}),[key]:false} };
    if ( wasP && !wasE) return { ...c, skills:{...(c.skills||{}),[key]:true}, skillExp:{...(c.skillExp||{}),[key]:true} };
    const s2={...(c.skills||{})}; delete s2[key];
    const e2={...(c.skillExp||{})}; delete e2[key];
    return { ...c, skills:s2, skillExp:e2 };
  }), [setChar]);

  const setOverride = useCallback((key, raw) => setChar(c => {
    if (raw === "") {
      const o = {...(c.skillOverride||{})}; delete o[key];
      return {...c, skillOverride: o};
    }
    return {...c, skillOverride: {...(c.skillOverride||{}), [key]: parseInt(raw)}};
  }), [setChar]);

  return (
    <div className="card">
      <div className="sect-divider">{C.skillsTitle}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 0.4rem" }}>
        {GENERIC_SKILLS.map(sk => {
          const prz  = !!(char.skills||{})[sk.key];
          const exp  = !!(char.skillExp||{})[sk.key];
          const base = Math.floor(((char.stats?.[sk.attr] ?? 10)-10)/2);
          const computed = exp ? base+pb*2 : prz ? base+pb : base;
          const over = (char.skillOverride||{})[sk.key];
          const display = over !== undefined ? (over >= 0 ? `+${over}` : `${over}`) : numMod(computed);

          const pipColor  = exp ? "var(--hj-pip-exp)"  : prz ? "var(--hj-pip-prof)" : "transparent";
          const pipBorder = exp ? "2px solid var(--hj-pip-exp)" : prz ? "1.5px solid var(--hj-pip-prof)" : "1.5px solid var(--hj-pip-empty)";
          const pipClip   = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
          const nameColor = exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text)";
          const valColor  = over !== undefined ? "var(--hj-pip-prof)" : exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text-muted)";

          return (
            <div key={sk.key}
              style={{ display:"flex", alignItems:"center", gap:"0.3rem",
                       padding:"0.22rem 0.1rem", userSelect:"none", minWidth:0 }}>
              {/* Pip — jedyne miejsce cyklu brak→biegłość→ekspertyza */}
              <button
                onClick={() => cycleSkill(sk.key)}
                aria-label={`${sk.label}: ${exp?"Expertise":prz?"Proficient":"Not proficient"}`}
                aria-pressed={prz || exp}
                style={{ width:8, height:8, flexShrink:0,
                         borderRadius: exp ? "0" : "50%",
                         border:pipBorder, background:pipColor, clipPath:pipClip,
                         boxShadow:exp?"0 0 4px var(--hj-pip-exp)":prz?"0 0 4px var(--hj-pip-prof)":"none",
                         cursor:"pointer", transition:"all 0.15s", padding:0 }}/>
              <span style={{ flex:1, fontFamily:"Cinzel,serif", fontSize:"0.72rem",
                             fontWeight:(prz||exp)?700:400, color:nameColor,
                             overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                             pointerEvents:"none" }}>
                {sk.label}
              </span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem",
                             color:"var(--hj-text-dim)", marginRight:"0.1rem",
                             pointerEvents:"none" }}>
                {sk.attr}
              </span>
              <input
                type="text" inputMode="numeric"
                value={display}
                title={C.overrideTip || "Wpisz by nadpisać, wyczyść by przywrócić"}
                onFocus={e => e.target.select()}
                onChange={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  setOverride(sk.key, r);
                }}
                onBlur={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  if (!r || isNaN(parseInt(r))) setOverride(sk.key, "");
                }}
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.78rem", fontWeight:700,
                         color:valColor, minWidth:"1.8rem", width:"1.8rem", textAlign:"right",
                         background:"transparent", border:"none", outline:"none",
                         borderBottom: over !== undefined ? "1px dashed var(--hj-pip-prof)" : "none",
                         padding:0 }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
