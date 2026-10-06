import { useState } from 'react';
import Icon from '../../shared/icons';
import { Modal } from '../../shared/Overlay';
import { CONDITIONS } from '../../constants/gameConstants';
import { clamp } from '../../utils/math';
import {
  applyDamage, applyHeal, applyTempHp, xpProgress, levelUp,
  hitDieAverage, abilityMod, totalLevelOf, profBonusForLevel,
} from '../../utils/character';

/* Okna obsługi PŻ / XP / stanów (P29/D1–D3). Wszystko pod palec:
   duże pola liczbowe (klawiatura numeryczna) i przyciski ≥44px. */

const numeric = { inputMode: "numeric", pattern: "[0-9]*" };
const toInt = v => { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; };

/* ── Punkty życia: obrażenia / leczenie / tymczasowe + edycja wartości ── */
export function HpModal({ T, char, setChar, onClose }) {
  const H = T.HERO;
  const hp = char.hp || { current: 0, max: 1, temp: 0 };
  const [amount, setAmount] = useState("");
  const amt = toInt(amount);

  const apply = fn => { setChar(c => ({ ...c, hp: fn(c.hp || hp, amt) })); setAmount(""); };
  const setField = (key, raw, min) => setChar(c => {
    const h = c.hp || hp;
    const v = Math.max(min, toInt(raw));
    const next = { ...h, [key]: v };
    if (key === "max") next.current = clamp(h.current, 0, v);
    if (key === "current") next.current = clamp(v, 0, h.max);
    return { ...c, hp: next };
  });

  return (
    <Modal title={H.hpTitle} onClose={onClose} closeLabel={T.UI.close}>
      <div className="hp-modal-summary">
        <span className="hp-modal-big">{hp.current}<small>/ {hp.max}</small></span>
        {hp.temp > 0 && <span className="vp-temp-pill"><Icon name="shield" size="0.9em"/> {H.tempShort} {hp.temp}</span>}
      </div>

      <label className="form-field">
        <span className="form-label">{H.amount}</span>
        <input className="g-input big-num" type="text" {...numeric} value={amount} autoFocus
          onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
          onKeyDown={e => { if (e.key === "Enter" && amt > 0) apply(applyDamage); }}/>
      </label>
      <div className="btn-row-3">
        <button className="hj-btn danger" disabled={!amt} onClick={() => apply(applyDamage)}>
          <Icon name="minus" size="1em"/> {H.damage}
        </button>
        <button className="hj-btn primary" disabled={!amt} onClick={() => apply(applyHeal)}>
          <Icon name="plus" size="1em"/> {H.heal}
        </button>
        <button className="hj-btn temp" disabled={!amt} onClick={() => apply(applyTempHp)}>
          <Icon name="shield" size="1em"/> {H.setTemp}
        </button>
      </div>
      <p className="form-hint">{H.hpHint}</p>

      <div className="form-grid form-grid-3">
        <label className="form-field">
          <span className="form-label">{H.currentHp}</span>
          <input className="g-input" type="text" {...numeric} value={hp.current}
            onFocus={e => e.target.select()} onChange={e => setField("current", e.target.value, 0)}/>
        </label>
        <label className="form-field">
          <span className="form-label">{H.maxHp}</span>
          <input className="g-input" type="text" {...numeric} value={hp.max}
            onFocus={e => e.target.select()} onChange={e => setField("max", e.target.value, 1)}/>
        </label>
        <label className="form-field">
          <span className="form-label">{H.tempHp}</span>
          <input className="g-input" type="text" {...numeric} value={hp.temp ?? 0}
            onFocus={e => e.target.select()} onChange={e => setField("temp", e.target.value, 0)}/>
        </label>
      </div>
    </Modal>
  );
}

/* ── Doświadczenie: dodawanie XP, edycja sumy, awans ── */
export function XpModal({ T, char, setChar, onClose, startWithLevelUp = false }) {
  const H = T.HERO;
  const [gain, setGain] = useState("");
  const [levelMode, setLevelMode] = useState(startWithLevelUp);
  const p = xpProgress(char);

  if (levelMode) return <LevelUpModal T={T} char={char} setChar={setChar} onClose={onClose} onBack={() => setLevelMode(false)}/>;

  const add = () => { const g = toInt(gain); if (g > 0) setChar(c => ({ ...c, xp: Math.max(0, toInt(c.xp)) + g })); setGain(""); };

  return (
    <Modal title={H.xpTitle} onClose={onClose} closeLabel={T.UI.close}>
      <div className="hp-modal-summary">
        <span className="hp-modal-big">{p.xp.toLocaleString()}<small>XP</small></span>
        <span className="vp-level-pill">{H.levelN(p.level)}</span>
      </div>
      <div className="vp-bar" aria-hidden="true"><div className="vp-bar-fill xp" style={{ width: `${p.pct}%` }}/></div>
      <p className="form-hint">{p.xpNext == null ? H.xpMaxLevel : H.xpToNext(Math.max(0, p.xpNext - p.xp).toLocaleString(), p.level + 1)}</p>

      <label className="form-field">
        <span className="form-label">{H.addXp}</span>
        <div className="input-with-btn">
          <input className="g-input big-num" type="text" {...numeric} value={gain} autoFocus
            onChange={e => setGain(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => { if (e.key === "Enter") add(); }}/>
          <button className="hj-btn primary" disabled={!toInt(gain)} onClick={add}><Icon name="plus" size="1em"/> {H.add}</button>
        </div>
      </label>

      <label className="form-field">
        <span className="form-label">{H.xpTotal}</span>
        <input className="g-input" type="text" {...numeric} value={char.xp ?? 0}
          onFocus={e => e.target.select()}
          onChange={e => setChar(c => ({ ...c, xp: Math.max(0, toInt(e.target.value.replace(/\D/g, ""))) }))}/>
      </label>

      {p.level < 20 && (
        <button className={`hj-btn levelup-btn${p.canLevelUp ? " ready" : ""}`} onClick={() => setLevelMode(true)}>
          <Icon name="sparkle" size="1em"/> {H.levelUp} → {p.level + 1}
        </button>
      )}
    </Modal>
  );
}

/* ── Awans: wybór klasy, przyrost PŻ, podsumowanie zmian ── */
function LevelUpModal({ T, char, setChar, onClose, onBack }) {
  const H = T.HERO;
  const classes = char.classes?.length ? char.classes : [{ name: T.CHAR.title, level: 1 }];
  const [classIndex, setClassIndex] = useState(0);
  const die = char.hitDice?.type || "d8";
  const avg = hitDieAverage(die);
  const con = abilityMod(char.stats?.CON);
  const oldMax = parseInt(char.hp?.max) || 0;
  const avgMax = oldMax + Math.max(1, avg + con);
  /* Nowe maksimum PŻ wpisuje gracz po fizycznym rzucie kością (P33) */
  const [newMax, setNewMax] = useState("");
  const typed = toInt(newMax);
  const valid = typed >= 1;
  const p = xpProgress(char);
  const newLevel = Math.min(20, totalLevelOf(char) + 1);

  const confirm = () => {
    if (!valid) return;
    setChar(c => levelUp(c, { classIndex, newMaxHp: typed }));
    onClose();
  };

  return (
    <Modal title={H.levelUpTitle(newLevel)} onClose={onClose} closeLabel={T.UI.close}
      footer={<>
        <button className="hj-btn" onClick={onBack}>{H.cancel}</button>
        <button className="hj-btn primary" onClick={confirm} disabled={!valid}><Icon name="check" size="1em"/> {H.confirm}</button>
      </>}>
      {!p.canLevelUp && <p className="form-hint warn">{H.levelUpEarly}</p>}

      {classes.length > 1 && (
        <div className="form-section">
          <div className="form-heading">{H.levelUpClass}</div>
          <div className="choice-list">
            {classes.map((cls, i) => (
              <button key={i} className={`choice-btn${classIndex === i ? " active" : ""}`}
                aria-pressed={classIndex === i} onClick={() => setClassIndex(i)}>
                <span>{cls.name?.trim() || `${T.CHAR.classLabel} ${i + 1}`}</span>
                <span className="choice-meta">{cls.level || 1} → {(cls.level || 1) + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="form-hint">{H.levelUpRollHint(die, con, oldMax)}</p>
      <label className="form-field">
        <span className="form-label">{H.levelUpNewMax}</span>
        <div className="input-with-btn">
          <input className="g-input big-num" type="text" {...numeric} value={newMax} autoFocus
            aria-describedby="levelup-hp-status"
            onChange={e => setNewMax(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => { if (e.key === "Enter") confirm(); }}/>
          <button className="hj-btn" type="button" onClick={() => setNewMax(String(avgMax))}>
            {H.levelUpUseAverage(avgMax)}
          </button>
        </div>
      </label>
      <p id="levelup-hp-status" className={`form-hint${valid && typed < oldMax ? " warn" : ""}`}>
        {!valid ? H.levelUpNeedHp
          : typed < oldMax ? H.levelUpLower(oldMax)
          : H.levelUpGain(typed - oldMax)}
      </p>

      <div className="form-section">
        <div className="form-heading">{H.levelUpWillChange}</div>
        <ul className="change-list">
          <li>{H.levelN(newLevel)}</li>
          <li>{H.maxHpFull}: {oldMax} → {valid ? typed : "?"}</li>
          <li>{H.levelUpHitDice(`${newLevel}${char.hitDice?.type || "d8"}`)}</li>
          <li>{H.levelUpProf(profBonusForLevel(newLevel))}</li>
        </ul>
      </div>
    </Modal>
  );
}

/* ── Stany ── */
export function ConditionsModal({ T, char, setChar, onClose }) {
  const active = char.conditions || {};
  const toggle = key => setChar(c => {
    const conds = { ...(c.conditions || {}) };
    if (conds[key]) delete conds[key]; else conds[key] = true;
    return { ...c, conditions: conds };
  });
  return (
    <Modal title={T.CHAR.conditionsTitle} onClose={onClose} closeLabel={T.UI.close}
      footer={<button className="hj-btn primary" onClick={onClose}>{T.UI.close}</button>}>
      <div className="chip-grid">
        {CONDITIONS.map(cond => {
          const on = !!active[cond.key];
          return (
            <button key={cond.key} className={`cond-chip${on ? " on" : ""}`} aria-pressed={on} onClick={() => toggle(cond.key)}>
              <Icon name={`cond-${cond.key}`} size="1.15em"/>
              {T.CONDITIONS?.[cond.key] || cond.label}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

/* ── Rzuty przeciw śmierci ── */
export function DeathSavesModal({ T, char, setChar, onClose }) {
  const ds = char.deathSaves || { successes: 0, failures: 0 };
  const set = (type, idx) => setChar(c => {
    const cur = (c.deathSaves || {})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves || {}), [type]: clamp(next, 0, 3) } };
  });
  const reset = () => setChar(c => ({ ...c, deathSaves: { successes: 0, failures: 0 } }));
  return (
    <Modal title={T.CHAR.deathSaves} onClose={onClose} closeLabel={T.UI.close}
      footer={<>
        <button className="hj-btn" onClick={reset}>{T.HERO.reset}</button>
        <button className="hj-btn primary" onClick={onClose}>{T.UI.close}</button>
      </>}>
      {[["successes", T.CHAR.deathSuccess, "ok"], ["failures", T.CHAR.deathFailure, "bad"]].map(([type, label, tone]) => (
        <div key={type} className="death-row">
          <span className={`form-label death-${tone}`}>{label}</span>
          <div className="death-pips">
            {[0, 1, 2].map(i => (
              <button key={i} className={`death-pip death-${tone}${i < (ds[type] || 0) ? " on" : ""}`}
                aria-label={`${label} ${i + 1}`} aria-pressed={i < (ds[type] || 0)} onClick={() => set(type, i)}/>
            ))}
          </div>
        </div>
      ))}
    </Modal>
  );
}

/* ── Wyczerpanie 0–6 ── */
export function ExhaustionModal({ T, char, setChar, onClose }) {
  const cur = (char.conditions || {}).exhaustion || 0;
  const set = level => setChar(c => ({ ...c, conditions: { ...(c.conditions || {}), exhaustion: level } }));
  return (
    <Modal title={T.CHAR.exhaustion} onClose={onClose} closeLabel={T.UI.close}
      footer={<button className="hj-btn primary" onClick={onClose}>{T.UI.close}</button>}>
      <div className="exh-grid">
        {[0, 1, 2, 3, 4, 5, 6].map(level => (
          <button key={level} className={`exh-btn${level === cur ? " current" : ""}${level > 0 && level <= cur ? " filled" : ""}`}
            aria-pressed={level === cur} onClick={() => set(level)}>
            {level === 0 ? <Icon name="check" size="1em"/> : level}
          </button>
        ))}
      </div>
      {T.HERO.exhaustionEffects?.[cur] && <p className="form-hint">{T.HERO.exhaustionEffects[cur]}</p>}
    </Modal>
  );
}
