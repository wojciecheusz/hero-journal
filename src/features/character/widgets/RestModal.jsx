import { useState } from 'react';
import { clamp } from '../../../utils/math';
import { useT } from '../../../i18n/translations';
import Icon from '../../../shared/icons';

export function RestModal({ type, char, setChar, onClose }) {
  const T  = useT();
  const R  = T.REST;
  const hd = char.hitDice || { type: "d8", max: 1, used: 0 };
  const available = Math.max(0, hd.max - hd.used);
  const [hdSpend, setHdSpend] = useState(1);

  const doShortRest = () => {
    const spend = clamp(hdSpend, 0, available);
    const dieMax = parseInt(hd.type.replace("d", "")) || 8;
    const conMod = Math.floor(((char.stats?.CON ?? 10) - 10) / 2);
    const healed = spend > 0 ? spend * Math.ceil(dieMax / 2) + spend * conMod : 0;
    setChar(c => ({
      ...c,
      hp: { ...c.hp, current: clamp(c.hp.current + Math.max(0, healed), 0, c.hp.max) },
      hitDice: { ...hd, used: hd.used + spend },
    }));
    onClose();
  };

  const doLongRest = () => {
    const recover = Math.max(1, Math.floor(hd.max / 2));
    const newUsed = Math.max(0, hd.used - recover);
    const newSlots = {};
    Object.entries(char.spellSlots || {}).forEach(([k, v]) => { newSlots[k] = { ...v, used: 0 }; });
    setChar(c => {
      const prevCond = c.conditions || {};
      const prevExh  = prevCond.exhaustion || 0;
      return {
        ...c,
        hp: { ...c.hp, current: c.hp.max, temp: 0 },
        hitDice: { ...hd, used: newUsed },
        spellSlots: newSlots,
        deathSaves: { successes: 0, failures: 0 },
        // Długi odpoczynek zmniejsza Wycieńczenie o 1 poziom (min 0), ale NIE
        // kasuje pozostałych stanów (ich czas trwania zależy od efektu/czaru)
        conditions: { ...prevCond, exhaustion: Math.max(0, prevExh - 1) },
      };
    });
    onClose();
  };

  const isShort = type === "short";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title" style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}><Icon name={isShort ? "moon" : "sun"} size="0.95em"/> {isShort ? R.shortTitle : R.longTitle}</div>
        {isShort ? (
          <>
            <p className="modal-text">{R.availableDice(available, hd.max, hd.type)}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>{R.diceType}</span>
              <select className="g-select" style={{ width: "auto", fontSize: "0.9rem", padding: "0.3rem 0.5rem" }}
                value={hd.type} onChange={e => setChar(c => ({ ...c, hitDice: { ...hd, type: e.target.value } }))}>
                {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>{R.maxLabel}</span>
              <input type="number" min={1} value={hd.max}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...hd, max: parseInt(e.target.value) || 1 } }))}
                style={{ width: 44, fontFamily: "Cinzel,serif", fontSize: "0.9rem", background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", textAlign: "center", color: "inherit" }}/>
            </div>
            <div className="modal-detail">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>{R.spend}</span>
                <button onClick={() => setHdSpend(s => Math.max(0, s - 1))} aria-label="Decrease dice" style={{ width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="minus" size="0.9em"/></button>
                <input type="number" min={0} max={available} value={hdSpend}
                  onChange={e => setHdSpend(clamp(parseInt(e.target.value) || 0, 0, available))}
                  style={{ width: 36, fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, background: "transparent", border: "none", borderBottom: "1px solid currentColor", outline: "none", textAlign: "center", color: "inherit" }}/>
                <button onClick={() => setHdSpend(s => Math.min(available, s + 1))} aria-label="Increase dice" style={{ width: 26, height: 26, background: "transparent", border: "1px solid currentColor", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size="0.9em"/></button>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.72rem", opacity: 0.9 }}>{hd.type}</span>
              </div>
              {(() => {
                const spend = clamp(hdSpend, 0, available);
                const dieMax = parseInt(hd.type.replace("d", "")) || 8;
                const conMod = Math.floor(((char.stats?.CON ?? 10) - 10) / 2);
                const avg = spend * Math.ceil(dieMax / 2) + spend * conMod;
                const min = spend * 1 + spend * conMod;
                const max = spend * dieMax + spend * conMod;
                return (
                  <span style={{ fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.95rem", fontStyle: "italic", opacity: 0.85 }}>
                    {R.restores(Math.max(0, avg), Math.max(0, min), Math.max(0, max), conMod)}
                  </span>
                );
              })()}
            </div>
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.8rem" }}>
              <button className="btn-ghost" onClick={onClose}>{R.cancel}</button>
              <button className="btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem" }} onClick={doShortRest}><Icon name="moon" size="0.85em"/> {R.doShortRest}</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                ["heart", R.restoreHp,    R.restoreHpDetail(char.hp.current, char.hp.max)],
                ["sparkles", R.resetSlots,   R.resetSlotsDetail],
                ["dice", R.recoverDice,  (() => { const rec = Math.max(1, Math.floor((char.hitDice?.max || 1) / 2)); const cur = (char.hitDice?.max || 1) - (char.hitDice?.used || 0); return R.recoverDiceDetail(cur, Math.min(char.hitDice?.max || 1, cur + rec), rec); })()],
                ["skull", R.resetDeath,   R.resetDeathDetail],
              ].map(([icon, label, detail]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.35rem 0", borderBottom: "1px solid rgba(128,128,128,0.15)" }}>
                  <span style={{ flexShrink: 0, display: "flex" }}><Icon name={icon} size="1.1em"/></span>
                  <div>
                    <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.88rem", opacity: 0.9, fontStyle: "italic" }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
              <button className="btn-ghost" onClick={onClose}>{R.cancel}</button>
              <button className="btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem" }} onClick={doLongRest}><Icon name="sun" size="0.85em"/> {R.doLongRest}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
