/** Współdzielone style i CardHeader używane przez wszystkie karty postaci */

export const LBL    = { fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:"0.2rem", color:"var(--text-label)" };
export const LBL_SM = { fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)" };

export function CardHeader({ label, open, onToggle, hint }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: open ? "0.85rem" : 0, cursor:"pointer", userSelect:"none" }}
      onClick={onToggle}>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--text-label)", display:"flex", alignItems:"center", gap:"0.5rem", flex:1 }}>
        {label}
        {hint && <span style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.8rem", color:"var(--text-muted)", textTransform:"none", letterSpacing:"0.03em", fontWeight:400, marginLeft:"0.3rem" }}>{hint}</span>}
        {open && <span style={{ flex:1, height:1, background:"linear-gradient(90deg,var(--hj-border),transparent)", display:"block" }}/>}
      </div>
      <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--text-dim)", marginLeft:"0.5rem" }}>{open ? "▲" : "▼"}</span>
    </div>
  );
}
