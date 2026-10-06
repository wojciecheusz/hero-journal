import { useState } from 'react';
import Icon from '../shared/icons';
import CharIconPicker from './CharIconPicker';
import { getCharIcon } from './charIcons';
import FitText from './hero/FitText';
import { HpModal } from './hero/VitalsModals';
import { getClassLevelLabel } from '../utils/character';
import { clamp } from '../utils/math';

/* Górny pasek na telefonie i tablecie w pionie (<1024px), P29.
   Zamiast stałego nagłówka o wysokości ~360px (z ręcznie liczonym
   przesunięciem treści) jest zwarty, przyklejony pasek: ikona, imię w jednej
   linii, PŻ (stuknięcie → obrażenia/leczenie), pomoc i ustawienia.
   Pełny panel Życia jest na zakładce Postać (MobileHeroPanel). */
export default function Header({ T, char, setChar, showHelp, setShowHelp, showSettings, setShowSettings }) {
  const [hpOpen, setHpOpen] = useState(false);
  const { className, totalLevel } = getClassLevelLabel(char, T.CHAR);
  const hp   = char.hp || { current: 0, max: 1, temp: 0 };
  const max  = Math.max(1, parseInt(hp.max) || 1);
  const cur  = parseInt(hp.current) || 0;
  const pct  = clamp((cur / max) * 100, 0, 100);
  const tone = pct > 70 ? "good" : pct > 35 ? "warn" : "bad";
  const name = char.name?.trim() || T.CHAR.heroName;

  return (
    <header className="hj-topbar">
      <CharIconPicker value={getCharIcon(char)} onChange={icon => setChar(c => ({ ...c, icon }))}/>
      <div className="hj-topbar-id">
        <FitText text={name} className="hero-id-name" max={1} min={0.66}/>
        <div className="hero-id-sub">{className} · {T.HERO.levelN(totalLevel)}</div>
      </div>
      <button className={`hj-topbar-hp tone-${tone}`} onClick={() => setHpOpen(true)}
        aria-label={`${T.CHAR.hp}: ${cur} / ${max}`}>
        <Icon name="heart" size="0.95em"/>
        <span><b>{cur}</b>/{max}</span>
        {hp.temp > 0 && <span className="hj-topbar-temp"><Icon name="shield" size="0.85em"/>{hp.temp}</span>}
        <span className="hj-topbar-hp-bar" style={{ width: `${pct}%` }} aria-hidden="true"/>
      </button>
      <button className={`hj-icon-btn${showHelp ? " active" : ""}`} aria-label={T.UI.help} aria-pressed={showHelp}
        onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}>
        <Icon name="help-circle" size="1.15em"/>
      </button>
      <button className={`hj-icon-btn${showSettings ? " active" : ""}`} aria-label={T.UI.settings} aria-pressed={showSettings}
        onClick={() => { setShowSettings(s => !s); setShowHelp(false); }}>
        <Icon name="settings" size="1.15em"/>
      </button>
      {hpOpen && <HpModal T={T} char={char} setChar={setChar} onClose={() => setHpOpen(false)}/>}
    </header>
  );
}
