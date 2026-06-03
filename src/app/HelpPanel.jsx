import { useT } from '../i18n/translations';
import { THEMES } from '../theme/themes';

/* Mapuje aktywny tab na klucz w T.HELP */
function helpKey(tab) {
  if (tab === "character")                                       return "character";
  if (tab === "equipment" || ["inventory","spells","skills"].includes(tab)) return "equipment";
  if (tab === "world-all"  || ["npcs","locations","factions"].includes(tab)) return "world";
  if (tab === "sessions")                                        return "sessions";
  if (tab === "quests")                                          return "quests";
  return "character";
}

export default function HelpPanel({ tab, theme, onClose }) {
  const T       = useT();
  const H       = T.HELP;
  const t       = THEMES[theme] || THEMES.mrok;
  const content = H[helpKey(tab)];

  if (!content) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{ position:"fixed", inset:0, zIndex:498, background:"transparent" }} onClick={onClose}/>

      {/* Panel */}
      <div style={{ position:"fixed", top:0, right:0, bottom:0, zIndex:499, width:"min(380px, 100vw)", background:t.bgCard, borderLeft:`1px solid ${t.border}`, boxShadow:`-12px 0 48px ${t.shadowBot}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ padding:"1rem 1.25rem 0.85rem", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:t.accent, display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <span style={{ opacity:0.7 }}>?</span>
            <span>{content.title}</span>
          </div>
          <button onClick={onClose}
            style={{ background:"transparent", border:"none", color:t.textDim, fontSize:"1rem", cursor:"pointer", lineHeight:1, padding:"0.2rem 0.3rem", transition:"color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color=t.textMuted}
            onMouseLeave={e => e.currentTarget.style.color=t.textDim}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"0.9rem 1.25rem 2rem" }}>
          {content.intro && (
            <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"1rem", color:t.text, lineHeight:1.7, marginBottom:"1.1rem", fontStyle:"italic", opacity:0.85 }}>
              {content.intro}
            </p>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
            {content.items.map(([icon, label, desc], i) => (
              <div key={i} style={{ display:"flex", gap:"0.75rem", padding:"0.65rem 0", borderBottom:`1px solid ${t.borderSub}` }}>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:t.accent, minWidth:48, textAlign:"center", background:`${t.accent}12`, border:`1px solid ${t.accentBorder}`, padding:"0.2rem 0.3rem", borderRadius:"2px", flexShrink:0, alignSelf:"flex-start", lineHeight:1.5 }}>
                  {icon}
                </span>
                <div>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.56rem", letterSpacing:"0.12em", textTransform:"uppercase", color:t.textLabel, marginBottom: desc ? "0.2rem" : 0 }}>
                    {label}
                  </div>
                  {desc && (
                    <div style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.9rem", color:t.textMuted, lineHeight:1.6 }}>
                      {desc}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
