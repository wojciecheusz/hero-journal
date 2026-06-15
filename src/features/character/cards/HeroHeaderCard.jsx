import { statMod, numMod } from '../../../utils/math';
import Icon from '../../../shared/icons';

const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/* Karta podsumowania bohatera — imię, klasa/poziom, odznaki walki, siatka atrybutów. */
export default function HeroHeaderCard({ char, C, pb }) {
  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);
  const totalLevel = Math.min(Math.max((char.classes || []).reduce((s, c) => s + (c.level || 1), 0), 1), 20);
  const className = (char.classes || []).map(c => c.name?.trim()).filter(Boolean).join(" / ") || C.title;
  const spellAbility = char.spellcastingAbility || "INT";
  const statAbbr = C.statAbbr || {};

  return (
    <div className="hcv2">
      <div className="hcv2-eyebrow"><Icon name="sparkle" size="0.85em"/> Hero Journal</div>
      <div className="hcv2-name">{char.name?.trim() || C.heroName}</div>
      <div className="hcv2-subtitle">{className} · {C.level} {totalLevel}</div>

      <div className="hcv2-divider"><Icon name="diamond" size="0.6em" className="glyph"/></div>

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

      <div className="sect-divider">{C.combatTitle}</div>
      <div className="hcv2-combat-grid">
        <div className="hcv2-combat-box">
          <div className="hcv2-combat-value">{char.ac || 0}</div>
          <div className="hcv2-combat-label">{C.ac}</div>
        </div>
        <div className="hcv2-combat-box">
          <div className="hcv2-combat-value">{numMod(initiative)}</div>
          <div className="hcv2-combat-label">{C.initiative}</div>
        </div>
        <div className="hcv2-combat-box">
          <div className="hcv2-combat-value">{char.speed || 30}</div>
          <div className="hcv2-combat-label">{C.speed}</div>
        </div>
        <div className="hcv2-combat-box featured">
          <div className="hcv2-combat-value">{numMod(pb)}</div>
          <div className="hcv2-combat-label">{C.profBonus}</div>
        </div>
      </div>
    </div>
  );
}
