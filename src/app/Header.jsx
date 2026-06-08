import SettingsMenu from './SettingsMenu';

/* Górny pasek widoczny na mobile — marka, pomoc kontekstowa, ustawienia (sidebar przejmuje tę rolę na desktopie) */
export default function Header({
  T, theme, setTheme, toggleLanguage, char,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, setShowReset, user, onCloudRefresh, onLogout,
}) {
  return (
    <header className="hj-header">
      <div className="hj-header-inner" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>

        {/* Logo + imię bohatera — ukryte na desktop (sidebar przejmuje tę rolę) */}
        <button className="hj-header-brand" style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0, cursor:"pointer", background:"transparent", border:"none", padding:0, color:"inherit", textAlign:"left" }}
          onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
          <div className="hj-logo">⚔ HJ</div>
          <span className="hj-char-name" style={{ flex:1 }}>{char.name?.trim() || T.UI.hero}</span>
        </button>

        {/* Prawa strona: ? i ⚙ */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>

        {/* Przycisk pomocy kontekstowej */}
        <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}
          title="Help"
          style={{ background:showHelp?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
          ?
        </button>

        {/* Panel ustawień */}
        <div style={{ position:"relative" }}>
          <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
            style={{ background:showSettings?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", fontSize:"1.1rem", lineHeight:1, width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ⚙
          </button>
          {showSettings && <>
            <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
            <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
              setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
              user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
              dropdownStyle={{ position:"absolute", top:"calc(100% + 8px)", right:0 }}/>
          </>}
        </div>{/* /settings */}
        </div>{/* /right-side flex */}
      </div>
    </header>
  );
}
