import Icon from '../shared/icons';
import { isEquipmentTab, isWorldTab } from './navigation';

/* Górny pasek aplikacji na desktopie / iPadzie poziomo (≥1024px), P34.
   Zakładki główne (Postać · Wyposażenie · Świat · Kronika · Zadania) oraz
   pomoc / wsparcie / ustawienia — dzięki temu sidebar mieści cały panel
   Życia bez przewijania. Na telefonie nawigacja zostaje na dole (MobileNav). */
export default function AppBar({ T, navGroups, tab, setTab, showHelp, setShowHelp, showSettings, setShowSettings }) {
  const items = navGroups.flatMap(g => g.tabs.length > 1
    ? g.tabs
    : [{ ...g.tabs[0], label: g.label, icon: g.icon }]);
  const isActive = id =>
    tab === id
    || (id === "equipment" && isEquipmentTab(tab))
    || (id === "world-all" && isWorldTab(tab));

  return (
    <header className="hj-appbar">
      <nav className="appbar-nav" aria-label={T.NAV.hero}>
        {items.map(t => {
          const active = isActive(t.id);
          return (
            <button key={t.id} className={`appbar-tab${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size="1.25em"/>
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="appbar-actions">
        <button className={`hj-icon-btn${showHelp ? " active" : ""}`} aria-pressed={showHelp}
          aria-label={T.UI.help} title={T.UI.help}
          onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}>
          <Icon name="help-circle" size="1.25em"/>
        </button>
        <a className="hj-icon-btn" href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
          aria-label={T.UI.buyBeer} title={T.UI.buyBeer}>
          <Icon name="beer" size="1.3em"/>
        </a>
        <button className={`hj-icon-btn${showSettings ? " active" : ""}`} aria-pressed={showSettings}
          aria-label={T.UI.settings} title={T.UI.settings}
          onClick={() => { setShowSettings(s => !s); setShowHelp(false); }}>
          <Icon name="settings" size="1.25em"/>
        </button>
      </div>
    </header>
  );
}
