import { useState } from 'react';
import { clamp } from '../utils/math';
import Icon from '../shared/icons';

const hpColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

export default function VitalsBar({ char, setChar, C, pb, onRestModal, variant = "mobile" }) {
  /* Draft dla Biegłości — char.profBonus||2 w rodzicu zjada NaN podczas
     czyszczenia pola, wiec trzymamy tekst lokalnie do czasu zatwierdzenia */
  const [pbDraft, setPbDraft] = useState(null);

  const hp        = char.hp || { current: 0, max: 1, temp: 0 };
  const hpCurSafe = isNaN(hp.current) ? 0 : hp.current;
  const hpMaxSafe = isNaN(hp.max) ? 1 : (hp.max || 1);
  const hpPct = Math.round(clamp((hpCurSafe / hpMaxSafe) * 100, 0, 100));

  const adjustHP = delta => setChar(c => {
    const h = c.hp || { current: 0, max: 1, temp: 0 };
    return { ...c, hp: { ...h, current: clamp(h.current + delta, 0, h.max) } };
  });

  const upd = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);

  return (
    <>
    <div className={`vitals-bar vitals-bar-${variant}`}>
      <div className="vitals-hp">
        <div className="vitals-hp-row">
          <span className="vitals-hp-label">{C.hp}</span>
          <span className="vitals-hp-value">
            <input type="number" className="vitals-hp-current" value={hp.current} style={{ color: hpColor(hpPct) }}
              onFocus={e => e.target.select()}
              onChange={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, current: isNaN(v)?v:clamp(v,0,h.max) } }; }); }}
              onBlur={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, current: clamp(isNaN(v)?0:v, 0, h.max) } }; }); }}/>
            <span className="vitals-hp-sep">/</span>
            <input type="number" min={1} className="vitals-hp-max" value={hp.max}
              onFocus={e => e.target.select()}
              onChange={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, max: isNaN(v)?v:Math.max(1,v) } }; }); }}
              onBlur={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, max: Math.max(1, isNaN(v)?1:v) } }; }); }}/>
          </span>
          <span className="vitals-hp-temp" title={C.hpTemp}>
            <Icon name="shield" size="0.8em"/>
            <input type="number" min={0} value={hp.temp ?? 0}
              onFocus={e => e.target.select()}
              onChange={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, temp: v } }; }); }}
              onBlur={e => { const v=parseInt(e.target.value); setChar(c => { const h = c.hp || { current:0, max:1, temp:0 }; return { ...c, hp: { ...h, temp: isNaN(v)?0:Math.max(0,v) } }; }); }}/>
          </span>
        </div>
        <div className="hp-bar-bg">
          <div className="hp-bar-fill" style={{ width: `${hpPct}%`, background: hpColor(hpPct) }}/>
        </div>
      </div>

      <div className="vitals-mini-grid">
        <div className="vitals-mini-box" title={C.ac}>
          <input className="vitals-mini-value" type="number" value={char.ac ?? 0}
            onFocus={e => e.target.select()}
            onChange={e => { const v=parseInt(e.target.value); upd("ac", v); }}
            onBlur={e => { const v=parseInt(e.target.value); upd("ac", isNaN(v)?0:v); }}/>
          <span className="vitals-mini-label">{C.ac}</span>
        </div>
        <div className="vitals-mini-box" title={C.initiativeTip}>
          <input className="vitals-mini-value" type="number" value={initiative}
            onFocus={e => e.target.select()}
            onChange={e => upd("initiativeBonus", e.target.value==="" ? undefined : parseInt(e.target.value))}
            onBlur={e => { if (e.target.value==="") setChar(c => { const o={...c}; delete o.initiativeBonus; return o; }); }}/>
          <span className="vitals-mini-label">{C.initiative}</span>
        </div>
        <div className="vitals-mini-box featured" title={C.profBonusTip}>
          <input className="vitals-mini-value" type="number" value={pbDraft ?? pb}
            onFocus={e => { e.target.select(); setPbDraft(String(pb)); }}
            onChange={e => {
              setPbDraft(e.target.value);
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v > 0) upd("profBonus", v);
            }}
            onBlur={e => {
              const v = parseInt(pbDraft ?? "");
              upd("profBonus", (!isNaN(v) && v > 0) ? v : 2);
              setPbDraft(null);
            }}/>
          <span className="vitals-mini-label">{C.profBonus}</span>
        </div>
      </div>

      <div className="vitals-controls">
        <button className="btn-pm minus" aria-label="Decrease HP" onClick={() => adjustHP(-1)}><Icon name="minus" size="1em"/></button>
        <button className="btn-pm plus" aria-label="Increase HP" onClick={() => adjustHP(1)}><Icon name="plus" size="1em"/></button>
      </div>
    </div>

    <div className={`rest-row rest-row-${variant}`}>
      <button className="btn-rest short" aria-label="Short rest" onClick={() => onRestModal("short")}>
        <Icon name="moon" size="1.1em"/>
        <span>{C.shortRest}</span>
      </button>
      <button className="btn-rest long" aria-label="Long rest" onClick={() => onRestModal("long")}>
        <Icon name="sun" size="1.1em"/>
        <span>{C.longRest}</span>
      </button>
    </div>
    </>
  );
}
