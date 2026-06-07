import { useCallback } from 'react';
import { SAVING_THROWS } from '../../../constants/gameConstants';
import { StatBox } from '../../../shared/ui';

export default function SavingThrowsCard({ char, setChar, C, pb }) {
  const cycleSavingThrow = useCallback(key => setChar(c => {
    const wasP = !!(c.savingThrows||{})[key]; const wasE = !!(c.savingThrowExp||{})[key];
    if (!wasP && !wasE) return { ...c, savingThrows:{...(c.savingThrows||{}),[key]:true}, savingThrowExp:{...(c.savingThrowExp||{}),[key]:false} };
    if ( wasP && !wasE) return { ...c, savingThrows:{...(c.savingThrows||{}),[key]:true}, savingThrowExp:{...(c.savingThrowExp||{}),[key]:true} };
    const s2={...(c.savingThrows||{})}; delete s2[key];
    const e2={...(c.savingThrowExp||{})}; delete e2[key];
    return { ...c, savingThrows:s2, savingThrowExp:e2 };
  }), [setChar]);

  return (
    <div className="card">
      <div className="sect-label">{C.savingThrowsTitle}</div>
      <div className="stat-grid-6">
        {SAVING_THROWS.map(st => {
          const statVal = char.stats?.[st.attr] ?? 10;
          const base  = Math.floor((statVal-10)/2);
          const prz   = !!(char.savingThrows||{})[st.key];
          const exp   = !!(char.savingThrowExp||{})[st.key];
          const computed = exp ? base+pb*2 : prz ? base+pb : base;
          const over  = (char.savingThrowOverride||{})[st.key];
          const stVal = over !== undefined ? over : computed;
          const pipColor  = exp ? "var(--hj-pip-exp)"  : prz ? "var(--hj-pip-prof)" : "transparent";
          const pipBorder = exp ? "2px solid var(--hj-pip-exp)" : prz ? "1.5px solid var(--hj-pip-prof)" : "1.5px solid var(--hj-pip-empty)";
          const pipClip   = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
          return (
            <div key={st.key} style={{ display:"flex", flexDirection:"column", gap:0 }}>
              <StatBox label={st.attr} value={statVal}
                onChange={v => setChar(c => ({ ...c, stats: { ...c.stats, [st.attr]: v } }))}/>
              <div className="stat-box" style={{ position:"relative", borderTop:"none", textAlign:"center", padding:"0.25rem 0.1rem 0.2rem", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                <button
                  title={C.proficiency ?? "Proficiency"}
                  aria-label={`${st.attr}: ${exp?"Expertise":prz?"Proficient":"Not proficient"}`}
                  aria-pressed={prz || exp}
                  onClick={() => cycleSavingThrow(st.key)}
                  style={{ position:"absolute", top:"0.22rem", right:"0.22rem", width:10, height:10, padding:0, borderRadius:"50%", border:pipBorder, background:pipColor, clipPath:pipClip, boxShadow:exp?"0 0 4px var(--hj-pip-exp)":prz?"0 0 4px var(--hj-pip-prof)":"none", cursor:"pointer", transition:"all 0.15s" }}/>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--hj-text-muted)", lineHeight:1 }}>{C.st}</span>
                <input type="number" value={stVal}
                  style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, color: over !== undefined ? "var(--hj-pip-prof)" : (exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "inherit"), textAlign:"center", width:"100%", padding:"0.1rem 0", lineHeight:1, cursor:"text" }}
                  onFocus={e => e.target.select()}
                  onChange={e => { const n=parseInt(e.target.value); setChar(c => ({...c, savingThrowOverride:{...(c.savingThrowOverride||{}),[st.key]:isNaN(n)?undefined:n}})); }}
                  onDoubleClick={() => setChar(c => { const o={...(c.savingThrowOverride||{})}; delete o[st.key]; return {...c,savingThrowOverride:o}; })}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
