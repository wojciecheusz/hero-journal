import { detectLang, TRANSLATIONS } from '../i18n/translations';

export default function LoadingScreen({ stage }) {
  const T = TRANSLATIONS[detectLang()];
  const label = stage === 'sync' ? T.UI.loadingSync
              : stage === 'auth' ? T.UI.loadingAuth
              : T.UI.loading;

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--hj-bg,#0e0e0e)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem" }}>
      <div style={{ fontFamily:"Cinzel Decorative,serif", fontSize:"1.5rem", color:"var(--hj-accent,#8b1a1a)", letterSpacing:"0.1em" }}>
        HJ
      </div>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", color:"var(--hj-text-dim,#666)", letterSpacing:"0.18em", textTransform:"uppercase" }}>
        {label}
      </div>
    </div>
  );
}
