import { statMod } from '../../../utils/math';

const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/* Karta Atrybutów — siatka 6 cech z podświetleniem cechy zarzucającej. Imię/klasa/poziom przeniesione do trwałego nagłówka (Header/Sidebar). */
export default function HeroHeaderCard({ char, C }) {
  const spellAbility = char.spellcastingAbility || "INT";
  const statAbbr = C.statAbbr || {};

  return (
    <div className="card">
      <div className="sect-divider">{C.abilitiesTitle}</div>
      <div className="hcv2-stat-grid">
        {STAT_KEYS.map(key => {
          const val = char.stats?.[key] ?? 10;
          const featured = key === spellAbility;
          return (
            <div key={key} className={`hcv2-stat-box${featured ? " featured" : ""}`}>
              <div className="hcv2-stat-score">{val}</div>
              <div className="hcv2-stat-mod">{statMod(val)}</div>
              <div className="hcv2-stat-label">{statAbbr[key] || key}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
