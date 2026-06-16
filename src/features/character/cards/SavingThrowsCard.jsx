import { useCallback } from 'react';
import { SAVING_THROWS } from '../../../constants/gameConstants';
import { numMod } from '../../../utils/math';

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
      <div className="sect-divider">{C.savingThrowsTitle}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.35rem 0.6rem" }}>
        {SAVING_THROWS.map(st => {
          const statVal = char.stats?.[st.attr] ?? 10;
          const base    = Math.floor((statVal - 10) / 2);
          const prz     = !!(char.savingThrows||{})[st.key];
          const exp     = !!(char.savingThrowExp||{})[st.key];
          const computed = exp ? base + pb*2 : prz ? base + pb : base;
          const over    = (char.savingThrowOverride||{})[st.key];
          const stVal   = over !== undefined ? over : computed;
          const pipColor  = exp ? "var(--hj-pip-exp)"  : prz ? "var(--hj-pip-prof)" : "transparent";
          const pipBorder = exp ? "2px solid var(--hj-pip-exp)" : prz ? "1.5px solid var(--hj-pip-prof)" : "1.5px solid var(--hj-pip-empty)";
          const pipClip   = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
          const valColor  = over !== undefined ? "var(--hj-pip-prof)" : exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text-muted)";

          return (
            <div key={st.key} style={{ display:"flex", alignItems:"center", gap:"0.45rem", padding:"0.18rem 0" }}>
              <button
                aria-label={`${st.attr}: ${exp?"Expertise":prz?"Proficient":"Not proficient"}`}
                aria-pressed={prz || exp}
                onClick={() => cycleSavingThrow(st.key)}
                style={{ width:10, height:10, padding:0, flexShrink:0, borderRadius:"50%", border:pipBorder, background:pipColor, clipPath:pipClip, boxShadow:exp?"0 0 4px var(--hj-pip-exp)":prz?"0 0 4px var(--hj-pip-prof)":"none", cursor:"pointer", transition:"all 0.15s" }}/>
              <span style={{ flex:1, fontFamily:"Cinzel,serif", fontSize:"0.78rem", fontWeight:(prz||exp)?700:400, color:exp?"var(--hj-pip-exp)":prz?"var(--hj-pip-prof)":"inherit", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{st.label}</span>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, color:valColor, minWidth:"1.6rem", textAlign:"right" }}>{numMod(stVal)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
