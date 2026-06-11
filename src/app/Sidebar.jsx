import SettingsMenu from './SettingsMenu';
import Icon from '../shared/icons';

/* Treść kontekstowego panelu pomocy — zależna od aktywnej zakładki */
function SidebarHelp({ tab, T, onClose }) {
  const helpKey = tab==="character" ? "character"
    : tab==="equipment"||["inventory","spells","skills"].includes(tab) ? "equipment"
    : tab==="world-all"||["npcs","locations","factions"].includes(tab) ? "world"
    : tab==="sessions" ? "sessions"
    : tab==="quests" ? "quests"
    : "character";
  const hc = T.HELP[helpKey];
  if (!hc) return null;
  return (
    <div style={{ flex:1, overflowY:"auto", borderTop:"1px solid var(--hj-border-sub)", padding:"0.7rem 0.8rem 0.4rem", display:"flex", flexDirection:"column", gap:0 }}>
      {/* Nagłówek sekcji pomocy */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--hj-accent)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <Icon name="help-circle" size="0.9em" color="var(--hj-accent)"/> {hc.title}
        </span>
        <button onClick={onClose}
          style={{ background:"transparent", border:"none", color:"var(--hj-text-dim)", fontSize:"0.75rem", cursor:"pointer", lineHeight:1, padding:"0.1rem 0.2rem", display:"flex" }}><Icon name="close" size="0.85em"/></button>
      </div>
      {/* Intro */}
      {hc.intro && (
        <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--hj-text-muted)", lineHeight:1.6, fontStyle:"italic", marginBottom:"0.55rem", paddingBottom:"0.5rem", borderBottom:"1px solid var(--hj-border-sub)" }}>
          {hc.intro}
        </p>
      )}
      {/* Pozycje pomocy */}
      {hc.items.map(([icon, label, desc]) => (
        <div key={label} style={{ paddingBottom:"0.5rem", marginBottom:"0.5rem", borderBottom:"1px solid var(--hj-border-sub)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom: desc ? "0.2rem" : 0 }}>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", color:"var(--hj-accent)", background:`rgba(226,185,78,0.1)`, border:"1px solid var(--hj-accent-border)", padding:"0.12rem 0.3rem", borderRadius:"2px", flexShrink:0, whiteSpace:"nowrap" }}>
              {icon}
            </span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--hj-text-label)", lineHeight:1.3 }}>
              {label}
            </span>
          </div>
          {desc && (
            <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--hj-text-muted)", lineHeight:1.55, paddingLeft:"0.2rem", margin:0 }}>
              {desc}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* Sidebar nawigacyjny widoczny na desktopie — marka, nawigacja, pomoc kontekstowa, stopka z ustawieniami */
export default function Sidebar({
  T, theme, setTheme, toggleLanguage, char, tab, setTab, navGroupsDesktop,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, setShowReset, user, onCloudRefresh, onLogout,
  onExport, onImport,
}) {
  return (
    <aside className="hj-sidebar">

      {/* Brand */}
      <button className="hj-sidebar-brand" onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }} aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--hj-text-muted)", letterSpacing:"0.08em", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>
          {char.name?.trim() || T.UI.hero}
        </span>
      </button>
      <div style={{ height:"1px", background:"var(--hj-border)", margin:"0 0.75rem 0.25rem", flexShrink:0 }}/>

      {/* Nawigacja */}
      <div style={{ flexShrink:0 }}>
        {navGroupsDesktop.map(g => {
          if (g.tabs.length === 1) {
            const t = g.tabs[0];
            const isWorldActive = t.id === "world-all" && (tab === "world-all" || ["npcs","locations","factions"].includes(tab));
            const isActive = tab === t.id || isWorldActive;
            return (
              <div key={g.id} className="hj-sidebar-group">
                <button className={`hj-sidebar-item${isActive?" active":""}`}
                  style={{ paddingTop:"0.55rem", paddingBottom:"0.55rem" }}
                  onClick={() => setTab(t.id)}>
                  <span style={{ fontSize:"0.95rem", lineHeight:1, flexShrink:0, display:"inline-flex" }}><Icon name={g.icon}/></span>
                  <span>{g.label}</span>
                </button>
              </div>
            );
          }
          return (
            <div key={g.id} className="hj-sidebar-group">
              <span className="hj-sidebar-group-label">{g.label}</span>
              {g.tabs.map(t => {
                const isEquipActive = t.id === "equipment" && (tab === "equipment" || ["inventory","skills","spells"].includes(tab));
                const isActive = tab === t.id || isEquipActive;
                return (
                  <button key={t.id} className={`hj-sidebar-item${isActive?" active":""}`} onClick={() => setTab(t.id)}>
                    <span style={{ fontSize:"0.95rem", lineHeight:1, flexShrink:0, display:"inline-flex" }}><Icon name={t.icon}/></span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Panel pomocy — wypełnia wolną przestrzeń ── */}
      {showHelp && <SidebarHelp tab={tab} T={T} onClose={() => setShowHelp(false)}/>}

      {/* ── Stopka: ? i ⚙ ── */}
      <div style={{ flexShrink:0, marginTop: showHelp ? 0 : "auto", padding:"0.5rem 0.6rem", borderTop:"1px solid var(--hj-border-sub)", display:"flex", gap:"0.4rem" }}>
        <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }} aria-label="Open help" title="Help"
          style={{ flex:1, background:showHelp?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="help-circle" size="1em"/>
        </button>

        {/* Wsparcie autora */}
        <a href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
          aria-label={T.UI.buyBeer} title={T.UI.buyBeer}
          style={{ flexShrink:0, width:32, height:32, background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontSize:"1.05rem", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--hj-accent-border)"; e.currentTarget.style.color="var(--hj-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--hj-border-input)"; e.currentTarget.style.color="var(--hj-text-muted)"; }}>
          <Icon name="beer" size="1.1em"/>
        </a>

        {/* Ustawienia — dropdown fixed, nie obcięty przez overflow sidebara */}
        <div style={{ flex:1, position:"relative" }}>
          <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
            style={{ width:"100%", height:32, background:showSettings?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", fontSize:"1.1rem", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="settings" size="1.1em"/>
          </button>
          {showSettings && <>
            <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
            <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
              setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
              user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
              onExport={onExport} onImport={onImport}
              dropdownStyle={{ position:"fixed", bottom:"48px", left:"5px" }}/>
          </>}
        </div>
      </div>
    </aside>
  );
}
