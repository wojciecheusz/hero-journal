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
      <div className="hj-skills-grid" style={{ display:"grid", gap:"0.3rem" }}>
        {GENERIC_SKILLS.map(sk => {
          const prz = !!(char.skills||{})[sk.key];
          const exp = !!(char.skillExp||{})[sk.key];
          const base  = Math.floor(((char.stats?.[sk.attr] ?? 10)-10)/2);
          const bonus = exp ? base+pb*2 : prz ? base+pb : base;
          const pipColor  = exp ? "var(--hj-pip-exp)"  : prz ? "var(--hj-pip-prof)" : "transparent";
          const pipBorder = exp ? "2px solid var(--hj-pip-exp)" : prz ? "1.5px solid var(--hj-pip-prof)" : "1.5px solid var(--hj-pip-empty)";
          const pipClip   = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
          const statColor = exp ? "var(--hj-pip-exp)"  : prz ? "var(--hj-pip-prof)" : "inherit";
          return (
            <button key={sk.key} title={sk.label}
              aria-label={`${sk.label}: ${exp?"Expertise":prz?"Proficient":"Not proficient"}`}
              aria-pressed={prz || exp}
              className={`stat-box${exp?" stat-box-exp":prz?" stat-box-prz":""}`}
              onClick={() => cycleSkill(sk.key)}
              style={{ position:"relative", cursor:"pointer", padding:"0.35rem 0.25rem 0.3rem", textAlign:"center", userSelect:"none", minWidth:0 }}>
              <div style={{ position:"absolute", top:"0.22rem", right:"0.22rem", width:10, height:10, borderRadius:"50%", border:pipBorder, background:pipColor, clipPath:pipClip, boxShadow:exp?"0 0 4px var(--hj-pip-exp)":prz?"0 0 4px var(--hj-pip-prof)":"none", transition:"all 0.15s", pointerEvents:"none" }}/>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--hj-text-label)", display:"block", marginBottom:"0.15rem", lineHeight:1.2, paddingRight:"0.7rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sk.label}</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.9rem", fontWeight:700, color:statColor, display:"block", lineHeight:1 }}>{numMod(bonus)}</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.38rem", color:"var(--hj-text-muted)", display:"block", marginTop:"0.1rem" }}>{sk.attr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
