import { SAVING_THROWS } from '../../../constants/gameConstants';
import { StatBox } from '../../../shared/ui';

export default function SavingThrowsCard({ char, setChar, C }) {
  return (
    <div className="card">
      <div className="sect-label">{C.savingThrowsTitle}</div>
      <div className="stat-grid-6">
        {SAVING_THROWS.map(st => {
          const statVal = char.stats?.[st.attr] ?? 10;
          const base  = Math.floor((statVal-10)/2);
          const over  = (char.savingThrowOverride||{})[st.key];
          const stVal = over !== undefined ? over : base;
          return (
            <div key={st.key} style={{ display:"flex", flexDirection:"column", gap:0 }}>
              <StatBox label={st.attr} value={statVal}
                onChange={v => setChar(c => ({ ...c, stats: { ...c.stats, [st.attr]: v } }))}/>
              <div className="stat-box" style={{ borderTop:"none", textAlign:"center", padding:"0.25rem 0.1rem 0.2rem", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--hj-text-muted)", lineHeight:1 }}>{C.st}</span>
                <input type="number" value={stVal}
                  style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, color: over !== undefined ? "var(--hj-pip-prof)" : "inherit", textAlign:"center", width:"100%", padding:"0.1rem 0", lineHeight:1, cursor:"text" }}
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
