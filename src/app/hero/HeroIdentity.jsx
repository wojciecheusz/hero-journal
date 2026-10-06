import Icon from '../../shared/icons';
import CharIconPicker from '../CharIconPicker';
import { getCharIcon } from '../charIcons';
import { getClassLevelLabel } from '../../utils/character';
import FitText from './FitText';

/* Tożsamość bohatera (P29/D4–D6): ikona, imię w JEDNEJ linii (dopasowane
   do szerokości), klasa · poziom, oraz dwa wyraźne przyciski — zmiana
   bohatera i szczegóły (dawne „More"). Używana w sidebarze i na mobile. */
export default function HeroIdentity({ T, char, setChar, onChangeHero, onOpenDetails, compact = false }) {
  const { className, totalLevel } = getClassLevelLabel(char, T.CHAR);
  const name = char.name?.trim() || T.CHAR.heroName;

  return (
    <div className={`hero-id${compact ? " hero-id-compact" : ""}`}>
      <div className="hero-id-main">
        <CharIconPicker value={getCharIcon(char)} onChange={icon => setChar(c => ({ ...c, icon }))}/>
        <div className="hero-id-text">
          <FitText text={name} className="hero-id-name" max={compact ? 1.05 : 1.15} min={0.6}/>
          <div className="hero-id-sub">{className} · {T.HERO.levelN(totalLevel)}</div>
        </div>
      </div>
      {!compact && (
        <div className="hero-id-actions">
          <button className="hero-chip" onClick={onChangeHero}>
            <Icon name="users" size="1em"/> <span>{T.HERO.changeHero}</span>
          </button>
          <button className="hero-chip" onClick={onOpenDetails}>
            <Icon name="user" size="1em"/> <span>{T.HERO.details}</span>
          </button>
        </div>
      )}
    </div>
  );
}
