import { useState } from 'react';
import HeroIdentity from './hero/HeroIdentity';
import HeroDetailsModal from './hero/HeroDetailsModal';
import VitalsPanel from './hero/VitalsPanel';

/* Sidebar desktopowy (≥1024px): tożsamość bohatera + panel Życia.
   P34: zakładki główne oraz pomoc / wsparcie / ustawienia przeniesione na
   górny pasek aplikacji (AppBar), żeby cały panel Życia mieścił się bez
   przewijania. Szerokość w rem (--hj-sidebar-w) — rośnie z czcionką na QHD/4K. */
export default function Sidebar({ T, char, setChar, pb, setScreen, onRestModal }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <aside className="hj-sidebar">
      <div className="sb-top">
        <HeroIdentity T={T} char={char} setChar={setChar}
          onChangeHero={() => setScreen("profiles")} onOpenDetails={() => setDetailsOpen(true)}/>
      </div>

      {/* Na bardzo niskich ekranach panel nadal może się przewinąć — ale tylko on */}
      <div className="sb-scroll">
        <VitalsPanel T={T} char={char} setChar={setChar} pb={pb} onRestModal={onRestModal} variant="sidebar"/>
      </div>

      {detailsOpen && <HeroDetailsModal T={T} char={char} setChar={setChar} onClose={() => setDetailsOpen(false)}/>}
    </aside>
  );
}
