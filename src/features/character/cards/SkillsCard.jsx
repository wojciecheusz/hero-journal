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

  return (
    <div className="card">
      <div className="sect-divider">{C.skillsTitle}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 0.4rem" }}>
        {GENERIC_SKILLS.map(sk => {
          const prz = !!(char.skills||{})[sk.key];
          const exp = !!(char.skillExp||{})[sk.key];
          const base  = Math.floor(((char.stats?.[sk.attr] ?? 10)-10)/2);
          const bonus = exp ? base+pb*2 : prz ? base+pb : base;
          const pipColor  = exp ? "var(--hj-pip-exp)"  : prz ? "var(--hj-pip-prof)" : "transparent";
          const pipBorder = exp ? "2px solid var(--hj-pip-exp)" : prz ? "1.5px solid var(--hj-pip-prof)" : "1.5px solid var(--hj-pip-empty)";
          const nameColor = exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text)";
          const valColor  = exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text-muted)";
          return (
            <div key={sk.key}
              role="button" tabIndex={0} aria-pressed={prz || exp}
              aria-label={`${sk.label}: ${exp?"Expertise":prz?"Proficient":"Not proficient"}`}
              onClick={() => cycleSkill(sk.key)}
              onKeyDown={e => (e.key==="Enter"||e.key===" ") && cycleSkill(sk.key)}
              style={{ display:"flex", alignItems:"center", gap:"0.3rem", padding:"0.22rem 0.1rem",
                       cursor:"pointer", userSelect:"none", minWidth:0 }}>
              <span style={{ width:8, height:8, flexShrink:0, borderRadius:"50%",
                             border:pipBorder, background:pipColor, display:"inline-block",
                             boxShadow:exp?"0 0 4px var(--hj-pip-exp)":prz?"0 0 4px var(--hj-pip-prof)":"none",
                             transition:"all 0.15s" }}/>
              <span style={{ flex:1, fontFamily:"Cinzel,serif", fontSize:"0.72rem",
                             fontWeight:(prz||exp)?700:400, color:nameColor,
                             overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {sk.label}
              </span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem",
                             color:"var(--hj-text-dim)", marginRight:"0.1rem" }}>
                {sk.attr}
              </span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.78rem", fontWeight:700,
                             color:valColor, minWidth:"1.8rem", textAlign:"right" }}>
                {numMod(bonus)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
