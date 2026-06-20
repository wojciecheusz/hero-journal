import { useRef, useState } from 'react';
import Icon, { PALETTE_ICONS } from '../shared/icons';
import { PALETTES, THEMES } from '../theme/themes';

/**
 * Dropdown z akcjami (język, zmiana bohatera, reset, sync, wyloguj, eksport/import).
 * Renderowany przez sidebar desktop i header mobile — różnią się pozycjonowaniem (`dropdownStyle`).
 */
export default function SettingsMenu({
  T, theme, setTheme, toggleLanguage,
  setScreen, setShowReset, setShowSettings,
  user, onCloudRefresh, onLogout,
  onExport, onImport,
  dropdownStyle,
}) {
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState(null);

  const btnStyle = {
    background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)",
    fontFamily:"Cinzel,serif", fontSize:"0.55rem", letterSpacing:"0.07em", textTransform:"uppercase",
    padding:"0.32rem 0.55rem", cursor:"pointer", textAlign:"left", borderRadius:"var(--radius-sm)", transition:"all 0.15s",
  };
  const btnDanger = { ...btnStyle, border:"1px solid #6a2a2a", color:"#c04040" };

  const close = (fn) => () => { fn(); setShowSettings(false); };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        onImport(ev.target.result);
        setShowSettings(false);
      } catch {
        setImportError(T.UI.importError);
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ background:"var(--hj-modal-bg)", border:"1px solid var(--hj-border)", boxShadow:"0 8px 32px var(--hj-shadow-bot)", zIndex:200, width:260, borderRadius:"var(--radius-md)", overflow:"hidden", ...dropdownStyle }}>
      <div style={{ padding:"0.38rem 0.48rem", display:"flex", flexDirection:"column", gap:"0.18rem" }}>
        <button style={{ ...btnStyle, display:"flex", alignItems:"center", gap:"0.4rem" }} onClick={close(toggleLanguage)}>
          <Icon name="globe" size="0.9em"/> {T.UI.langToggle === "EN" ? "Switch to English" : "Przełącz na polski"}
        </button>
        <button style={{ ...btnStyle, display:"flex", alignItems:"center", gap:"0.4rem" }} onClick={close(() => setScreen("profiles"))}>
          <Icon name="user" size="0.9em"/> {T.UI.changeHero}
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

      {/* ── Motyw kolorystyczny ── */}
      <div style={{ borderTop:"1px solid var(--hj-border-sub)", padding:"0.38rem 0.48rem" }}>
        <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--hj-text-muted)", paddingBottom:"0.3rem" }}>
          {T.UI.themeColor}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.3rem" }}>
          {PALETTES.map(name => {
            const t = THEMES[name];
            const active = theme === name;
            const label = T.PALETTE_LABELS?.[name] || name;
            return (
              <button key={name} onClick={() => setTheme(name)} title={label}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.2rem",
                         background: active ? "rgba(168,120,48,0.1)" : "transparent",
                         border:`1px solid ${active ? "var(--hj-accent-border)" : "var(--hj-border-input)"}`,
                         borderRadius:"var(--radius-sm)", padding:"0.3rem 0.15rem", cursor:"pointer", transition:"all 0.15s" }}>
                <span style={{ width:16, height:16, borderRadius:"50%", flexShrink:0,
                               background:t.bg, border:`2px solid ${t.accent}`,
                               display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={PALETTE_ICONS[name] || "sparkle"} size="0.55em" color={t.accent}/>
                </span>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.4rem", letterSpacing:"0.03em",
                               textTransform:"uppercase", color: active ? "var(--hj-accent)" : "var(--hj-text-muted)",
                               textAlign:"center", lineHeight:1.15 }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Kopia zapasowa ── */}
      <div style={{ borderTop:"1px solid var(--hj-border-sub)", padding:"0.38rem 0.48rem", display:"flex", flexDirection:"column", gap:"0.18rem" }}>
        <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--hj-text-muted)", paddingBottom:"0.1rem" }}>
          {T.UI.backupSection}
        </div>
        <button style={{ ...btnStyle, display:"flex", alignItems:"center", gap:"0.4rem" }} onClick={onExport}>
          <Icon name="download" size="0.9em"/> {T.UI.exportProfile}
        </button>
        <button style={{ ...btnStyle, display:"flex", alignItems:"center", gap:"0.4rem" }} onClick={() => fileInputRef.current?.click()}>
          <Icon name="upload" size="0.9em"/> {T.UI.importProfile}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display:"none" }}
          onChange={handleFileChange}
        />
        {importError && (
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", color:"#c04040", paddingTop:"0.1rem", display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <Icon name="warning" size="0.9em"/> {importError}
          </span>
        )}
      </div>
    </div>
  );
}
