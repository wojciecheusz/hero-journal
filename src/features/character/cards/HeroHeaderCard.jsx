import { clamp, statMod, numMod } from '../../../utils/math';
import Icon from '../../../shared/icons';

const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/* Karta podsumowania bohatera w nowej, bardziej "appkowej" estetyce —
   ciemna karta z zaokrąglonymi rogami, serifowy nagłówek, akcenty złota.
   Niezależna od aktywnego motywu (własna paleta przez zmienne --hcv2-*). */
export default function HeroHeaderCard({ char, setChar, C, pb }) {
  const hp = char.hp || { current: 0, max: 1, temp: 0 };
  const hpPct = Math.round(clamp((hp.current / (hp.max || 1)) * 100, 0, 100));
  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);
  const totalLevel = Math.min(Math.max((char.classes || []).reduce((s, c) => s + (c.level || 1), 0), 1), 20);
  const className = (char.classes || []).map(c => c.name?.trim()).filter(Boolean).join(" / ") || C.title;
  const spellAbility = char.spellcastingAbility || "INT";
  const statAbbr = C.statAbbr || {};

  const adjustHP = delta => setChar(c => {
    const h = c.hp || { current: 0, max: 1, temp: 0 };
    return { ...c, hp: { ...h, current: clamp(h.current + delta, 0, h.max) } };
  });

  return (
    <div className="hcv2">
      <div className="hcv2-eyebrow"><Icon name="sparkle" size="0.85em"/> Hero Journal</div>
      <div className="hcv2-name">{char.name?.trim() || C.heroName}</div>
      <div className="hcv2-subtitle">{className} · {C.level} {totalLevel}</div>

      <div className="hcv2-divider"><Icon name="diamond" size="0.6em" className="glyph"/></div>

      <div className="hcv2-card">
        <div className="hcv2-card-row">
          <span className="hcv2-label">{C.hp}</span>
          <span className="hcv2-hp-value">{hp.current} / {hp.max}</span>
        </div>
        <div className="hcv2-bar-track"><div className="hcv2-bar-fill" style={{ width: `${hpPct}%` }}/></div>
        <div className="hcv2-hp-controls">
          <button className="hcv2-pm-btn" aria-label="Decrease HP" onClick={() => adjustHP(-1)}><Icon name="minus" size="1em"/></button>
          <button className="hcv2-pm-btn plus" aria-label="Increase HP" onClick={() => adjustHP(1)}><Icon name="plus" size="1em"/></button>
          <div className="hcv2-mini-badges">
            <div className="hcv2-mini-badge"><span className="val">{char.ac || 0}</span><span className="lbl">{C.ac}</span></div>
            <div className="hcv2-mini-badge"><span className="val">{numMod(initiative)}</span><span className="lbl">{C.initiative}</span></div>
            <div className="hcv2-mini-badge"><span className="val">{char.speed || 30}</span><span className="lbl">{C.speed}</span></div>
          </div>
        </div>
      </div>

      <div className="hcv2-section-label">{C.abilitiesTitle}</div>
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

      <div className="hcv2-section-label">{C.combatTitle}</div>
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
