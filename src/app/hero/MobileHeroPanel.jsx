import { useState } from 'react';
import Icon from '../../shared/icons';
import VitalsPanel from './VitalsPanel';
import HeroDetailsModal from './HeroDetailsModal';

/* Panel bohatera na telefonie/tablecie w pionie (<1024px) — na zakładce
   Postać, nad kartami. Na desktopie tę rolę pełni sidebar (ukryty przez CSS). */
export default function MobileHeroPanel({ T, char, setChar, pb, onRestModal, onChangeHero }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <div className="mobile-hero-panel">
      <div className="hero-id-actions">
        <button className="hero-chip" onClick={onChangeHero}>
          <Icon name="users" size="1em"/> <span>{T.HERO.changeHero}</span>
        </button>
        <button className="hero-chip" onClick={() => setDetailsOpen(true)}>
          <Icon name="user" size="1em"/> <span>{T.HERO.details}</span>
        </button>
      </div>
      <VitalsPanel T={T} char={char} setChar={setChar} pb={pb} onRestModal={onRestModal} variant="mobile"/>
      {detailsOpen && <HeroDetailsModal T={T} char={char} setChar={setChar} onClose={() => setDetailsOpen(false)}/>}
    </div>
  );
}
