import { statMod, clamp } from '../../../utils/math';

const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const STAT_MIN = 1;
const STAT_MAX = 30;

export default function HeroHeaderCard({ char, setChar, C }) {
  const statAbbr = C.statAbbr || {};

  return (
    <div className="card">
      <div className="sect-divider">{C.abilitiesTitle}</div>
      <div className="hcv2-stat-grid">
        {STAT_KEYS.map(key => {
          const val = char.stats?.[key] ?? 10;
          return (
            <label key={key} className="hcv2-stat-box">
              <div className="hcv2-stat-label">{statAbbr[key] || key}</div>
              <div className="hcv2-stat-mod">{statMod(val)}</div>
              <input
                type="text" inputMode="numeric"
                className="hcv2-stat-score"
                value={val}
                aria-label={`${statAbbr[key] || key}`}
                onFocus={e => e.target.select()}
                onChange={e => {
                  const raw = parseInt(e.target.value);
                  setChar(c => ({
                    ...c,
                    stats: { ...(c.stats||{}), [key]: isNaN(raw) ? e.target.value : clamp(raw, STAT_MIN, STAT_MAX) },
                  }));
                }}
                onBlur={e => {
                  const v = parseInt(e.target.value);
                  setChar(c => ({...c, stats:{...(c.stats||{}), [key]: isNaN(v) ? 10 : clamp(v, STAT_MIN, STAT_MAX)}}));
                }}/>
            </label>
          );
        })}
      </div>
    </div>
  );
}
