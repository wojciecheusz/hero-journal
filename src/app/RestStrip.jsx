import { CONDITIONS } from '../constants/gameConstants';
import Icon from '../shared/icons';

export default function RestStrip({ C, onRestModal, char, setChar, T, stanyOpen, setStanyOpen }) {
  return (
    <div className="rest-strip-mobile">
      <div style={{ display:"flex", gap:7, width:"100%" }}>
        <button className="btn-rest short" aria-label="Short rest" onClick={() => onRestModal("short")}>
          <Icon name="moon" size="1.1em"/>
          <span>{C.shortRest}</span>
        </button>
        <button className="btn-rest long" aria-label="Long rest" onClick={() => onRestModal("long")}>
          <Icon name="sun" size="1.1em"/>
          <span>{C.longRest}</span>
        </button>
        <button onClick={() => setStanyOpen?.(s => !s)}
          aria-expanded={!!stanyOpen}
          style={{ display:"flex", alignItems:"center", gap:"0.3rem", padding:"0 0.6rem",
                   background:stanyOpen?"rgba(200,48,48,0.12)":"transparent",
                   border:`1px solid ${stanyOpen?"rgba(204,48,48,0.5)":"var(--hj-border-input)"}`,
                   color:stanyOpen?"#ee5050":"var(--hj-text-muted)",
                   borderRadius:"var(--radius-sm)", cursor:"pointer", flexShrink:0,
                   fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.08em",
                   textTransform:"uppercase", transition:"all 0.15s", whiteSpace:"nowrap" }}>
          <Icon name="skull" size="0.9em"/>
          {C.stanyTitle || "Stany"}
          <Icon name={stanyOpen ? "chevron-up" : "chevron-down"} size="0.75em"/>
        </button>
      </div>

      {stanyOpen && char && setChar && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem", paddingTop:"0.5rem", borderTop:"1px solid var(--hj-border-sub)", marginTop:"0.4rem", width:"100%" }}>
          {CONDITIONS.map(cond => {
            const active = !!(char.conditions||{})[cond.key];
            const label  = T?.CONDITIONS?.[cond.key] || cond.label;
            return (
              <button key={cond.key}
                onClick={() => setChar(c => {
                  const conds = { ...(c.conditions||{}) };
                  if (conds[cond.key]) delete conds[cond.key]; else conds[cond.key] = true;
                  return { ...c, conditions: conds };
                })}
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.06em",
                         textTransform:"uppercase", padding:"0.2rem 0.4rem", cursor:"pointer",
                         transition:"all 0.15s", borderRadius:"var(--radius-pill)",
                         border:`1px solid ${active?"#cc3030":"var(--hj-pip-empty)"}`,
                         background:active?"rgba(200,48,48,0.2)":"transparent",
                         color:active?"#ee5050":"var(--hj-text-muted)" }}>
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
