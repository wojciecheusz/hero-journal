import SettingsMenu from './SettingsMenu';
import Icon from '../shared/icons';
import { getClassLevelLabel } from '../utils/character';
import { getTabLabel } from './navigation';

/* Górny pasek widoczny na mobile — marka, imię/klasa/poziom, etykieta zakładki, pomoc kontekstowa, ustawienia (sidebar przejmuje tę rolę na desktopie) */
export default function Header({
  T, theme, setTheme, toggleLanguage, char, tab,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, setShowReset, user, onCloudRefresh, onLogout,
  onExport, onImport,
}) {
  const { className, totalLevel } = getClassLevelLabel(char, T.CHAR);

  return (
    <header className="hj-header">
      <div className="hj-header-inner">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>

        {/* Logo + imię bohatera — ukryte na desktop (sidebar przejmuje tę rolę) */}
        <button className="hj-header-brand" style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0, cursor:"pointer", background:"transparent", border:"none", padding:0, color:"inherit", textAlign:"left" }}
          onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
          <div className="hj-logo" style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}><Icon name="sword" size="1em"/> HJ</div>
          <span className="hj-char-name" style={{ flex:1 }}>{char.name?.trim() || T.UI.hero}</span>
        </button>

        {/* Prawa strona: ? i ⚙ */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>

        {/* Przycisk pomocy kontekstowej */}
        <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}
          title="Help"
          style={{ background:showHelp?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)", width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="help-circle" size="1em"/>
        </button>

        {/* Wsparcie autora */}
        <a href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
          aria-label={T.UI.buyBeer} title={T.UI.buyBeer}
          style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", lineHeight:1, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--hj-accent-border)"; e.currentTarget.style.color="var(--hj-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--hj-border-input)"; e.currentTarget.style.color="var(--hj-text-muted)"; }}>
          <Icon name="beer" size="1.1em"/>
        </a>

        {/* Panel ustawień */}
        <div style={{ position:"relative" }}>
          <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
            style={{ background:showSettings?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", lineHeight:1, width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="settings" size="1.1em"/>
          </button>
          {showSettings && <>
            <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
            <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
              setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
              user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
              onExport={onExport} onImport={onImport}
              dropdownStyle={{ position:"absolute", top:"calc(100% + 8px)", right:0 }}/>
          </>}
        </div>{/* /settings */}
        </div>{/* /right-side flex */}
      </div>

      {/* Tożsamość bohatera — imię, klasa/poziom, widoczne na każdym ekranie */}
      <div className="hj-header-identity">
        <div className="hcv2-eyebrow"><Icon name="sparkle" size="0.85em"/> Hero Journal</div>
        <div className="hcv2-name">{char.name?.trim() || T.CHAR.heroName}</div>
        <div className="hcv2-subtitle">{className} · {T.CHAR.level} {totalLevel}</div>
      </div>

      {/* Etykieta aktualnej zakładki */}
      <div className="tab-label">{getTabLabel(T, tab)}</div>
      </div>
    </header>
  );
}
