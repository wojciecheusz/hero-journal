import { clamp } from '../utils/math';
import Icon from '../shared/icons';

const hpColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

export default function VitalsBar({ char, setChar, C, onRestModal, variant = "mobile" }) {
  const hp    = char.hp || { current: 0, max: 1, temp: 0 };
  const hpPct = Math.round(clamp((hp.current / (hp.max || 1)) * 100, 0, 100));

  const adjustHP = delta => setChar(c => {
    const h = c.hp || { current: 0, max: 1, temp: 0 };
    return { ...c, hp: { ...h, current: clamp(h.current + delta, 0, h.max) } };
  });

  return (
    <div className={`vitals-bar vitals-bar-${variant}`}>
      <div className="vitals-hp">
        <div className="vitals-hp-row">
          <span className="vitals-hp-label">{C.hp}</span>
          <span className="vitals-hp-value">
            <input type="number" className="vitals-hp-current" value={hp.current} style={{ color: hpColor(hpPct) }}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, current: e.target.value==="" ? 0 : clamp(parseInt(e.target.value)||0, 0, h.max) } }; })}
              onBlur={e => setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, current: clamp(parseInt(e.target.value)||0, 0, h.max) } }; })}/>
            <span className="vitals-hp-sep">/</span>
            <input type="number" min={1} className="vitals-hp-max" value={hp.max}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, max: e.target.value==="" ? 1 : Math.max(1, parseInt(e.target.value)||1) } }; })}
              onBlur={e => setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, max: Math.max(1, parseInt(e.target.value)||1) } }; })}/>
          </span>
          <span className="vitals-hp-temp" title={C.hpTemp}>
            <Icon name="shield" size="0.8em"/>
            <input type="number" min={0} value={hp.temp||0}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, temp: e.target.value==="" ? 0 : Math.max(0, parseInt(e.target.value)||0) } }; })}
              onBlur={e => setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, temp: Math.max(0, parseInt(e.target.value)||0) } }; })}/>
          </span>
        </div>
        <div className="hp-bar-bg">
          <div className="hp-bar-fill" style={{ width: `${hpPct}%`, background: hpColor(hpPct) }}/>
        </div>
      </div>

      <div className="vitals-controls">
        <button className="btn-pm minus" aria-label="Decrease HP" onClick={() => adjustHP(-1)}><Icon name="minus" size="1em"/></button>
        <button className="btn-pm plus" aria-label="Increase HP" onClick={() => adjustHP(1)}><Icon name="plus" size="1em"/></button>
        <button className="btn-rest short" aria-label="Short rest" onClick={() => onRestModal("short")}>
          <Icon name="moon" size="1.1em"/>
          <span>{C.shortRest}</span>
        </button>
        <button className="btn-rest long" aria-label="Long rest" onClick={() => onRestModal("long")}>
          <Icon name="sun" size="1.1em"/>
          <span>{C.longRest}</span>
        </button>
      </div>
    </div>
  );
}
