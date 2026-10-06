import { useState } from 'react';
import Icon from '../shared/icons';
import HeroIdentity from './hero/HeroIdentity';
import HeroDetailsModal from './hero/HeroDetailsModal';
import VitalsPanel from './hero/VitalsPanel';
import { isEquipmentTab, isWorldTab } from './navigation';

/* Sidebar desktopowy (≥1024px), P29: tożsamość bohatera → panel Życia →
   nawigacja → stopka (pomoc / wsparcie / ustawienia — same ikony, nazwy
   w podpowiedzi i aria-label). Szerokość w rem
   (--hj-sidebar-w), więc rośnie razem z czcionką na QHD/4K. Stopka jest
   przyklejona do dołu — zawsze osiągalna, nawet gdy sidebar się przewija. */
export default function Sidebar({
  T, char, setChar, pb, tab, setTab, navGroupsDesktop,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, onRestModal,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isActive = id =>
    tab === id
    || (id === "equipment" && isEquipmentTab(tab))
    || (id === "world-all" && isWorldTab(tab));

  return (
    <aside className="hj-sidebar">
      <div className="sb-top">
        <HeroIdentity T={T} char={char} setChar={setChar}
          onChangeHero={() => setScreen("profiles")} onOpenDetails={() => setDetailsOpen(true)}/>
      </div>

      {/* Tylko panel Życia się przewija — nawigacja i stopka zawsze widoczne */}
      <div className="sb-scroll">
        <VitalsPanel T={T} char={char} setChar={setChar} pb={pb} onRestModal={onRestModal} variant="sidebar"/>
      </div>

      <nav className="sb-nav" aria-label={T.NAV.hero}>
        {navGroupsDesktop.map(g => (
          <div key={g.id} className="sb-nav-group">
            {g.tabs.length > 1 && <span className="sb-nav-group-label">{g.label}</span>}
            {g.tabs.map(t => {
              const active = isActive(t.id);
              return (
                <button key={t.id} className={`sb-nav-item${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined} onClick={() => setTab(t.id)}>
                  <Icon name={g.tabs.length > 1 ? t.icon : g.icon} size="1.15em"/>
                  <span>{g.tabs.length > 1 ? t.label : g.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <footer className="sb-foot">
        <button className={`sb-foot-btn${showHelp ? " active" : ""}`} aria-pressed={showHelp}
          aria-label={T.UI.help} title={T.UI.help}
          onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}>
          <Icon name="help-circle" size="1.2em"/>
        </button>
        <a className="sb-foot-btn" href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
          aria-label={T.UI.buyBeer} title={T.UI.buyBeer}>
          <Icon name="beer" size="1.2em"/>
        </a>
        <button className={`sb-foot-btn${showSettings ? " active" : ""}`} aria-pressed={showSettings}
          aria-label={T.UI.settings} title={T.UI.settings}
          onClick={() => { setShowSettings(s => !s); setShowHelp(false); }}>
          <Icon name="settings" size="1.2em"/>
        </button>
      </footer>

      {detailsOpen && <HeroDetailsModal T={T} char={char} setChar={setChar} onClose={() => setDetailsOpen(false)}/>}
    </aside>
  );
}
