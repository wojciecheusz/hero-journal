import { PALETTES } from '../theme/themes';

/**
 * Dropdown z paletą motywów i akcjami (język, zmiana bohatera, reset, sync, wyloguj).
 * Renderowany przez sidebar desktop i header mobile — różnią się pozycjonowaniem (`dropdownStyle`).
 */
export default function SettingsMenu({
  T, theme, setTheme, toggleLanguage,
  setScreen, setShowReset, setShowSettings,
  user, onCloudRefresh, onLogout,
  dropdownStyle,
}) {
  const btnStyle = {
    background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)",
    fontFamily:"Cinzel,serif", fontSize:"0.55rem", letterSpacing:"0.07em", textTransform:"uppercase",
    padding:"0.32rem 0.55rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s",
  };
  const btnDanger = { ...btnStyle, border:"1px solid #6a2a2a", color:"#c04040" };

  const close = (fn) => () => { fn(); setShowSettings(false); };

  return (
    <div style={{ background:"var(--hj-modal-bg)", border:"1px solid var(--hj-border)", boxShadow:"0 8px 32px var(--hj-shadow-bot)", zIndex:200, width:260, borderRadius:"2px", ...dropdownStyle }}>
      <div style={{ padding:"0.55rem 0.65rem 0.4rem" }}>
        <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.49rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--hj-text-muted)", marginBottom:"0.45rem" }}>
          {T.UI.themeColor}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.22rem" }}>
          {PALETTES.map(p => (
            <button key={p} onClick={() => setTheme(p)}
              style={{ background:theme===p?"rgba(226,185,78,0.12)":"transparent", border:`1px solid ${theme===p?"var(--hj-accent-border)":"var(--hj-border-sub)"}`, color:theme===p?"var(--hj-accent)":"var(--hj-text)", fontFamily:"Cinzel,serif", fontSize:"0.54rem", letterSpacing:"0.04em", padding:"0.27rem 0.35rem", cursor:"pointer", textAlign:"left", transition:"all 0.12s", borderRadius:"2px" }}>
              {T.PALETTE_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ borderTop:"1px solid var(--hj-border-sub)", padding:"0.38rem 0.48rem", display:"flex", flexDirection:"column", gap:"0.18rem" }}>
        <button style={btnStyle} onClick={close(toggleLanguage)}>
          🌐 {T.UI.langToggle === "EN" ? "Switch to English" : "Przełącz na polski"}
        </button>
        <button style={btnStyle} onClick={close(() => setScreen("profiles"))}>
          👤 {T.UI.changeHero}
        </button>
        <button style={btnDanger} onClick={close(() => setShowReset(true))}>
          {T.UI.resetChar}
        </button>
        {user && onCloudRefresh && (
          <button style={btnStyle} onClick={close(onCloudRefresh)}>
            {T.UI.syncData}
          </button>
        )}
        {user && onLogout && (
          <button style={btnStyle} onClick={close(onLogout)}>
            {T.UI.logout} ({(user.displayName || user.email || "").split(/[\s@]/)[0]})
          </button>
        )}
      </div>
    </div>
  );
}
