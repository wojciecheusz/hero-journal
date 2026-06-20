import { useState } from 'react';
import { clamp } from '../../../utils/math';
import { useT } from '../../../i18n/translations';
import Icon from '../../../shared/icons';

const fieldBoxStyle = {
  border: "1px solid var(--hj-border-input)", borderRadius: "var(--radius-md)",
  padding: "0.4rem 0.6rem", display: "flex", alignItems: "center", gap: "0.5rem",
};

const roundBtnStyle = {
  width: 26, height: 26, background: "transparent", border: "1px solid var(--hj-accent-border)",
  color: "var(--hj-accent)", borderRadius: "50%", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};

const DICE_TYPES = ["d4", "d6", "d8", "d10", "d12"];

/* ── Własny dropdown typu kości — natywny <select> renderuje popup w
   kolorach systemowych (jasny), nawet z color-scheme:dark na elemencie ── */
function DiceTypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ background: "transparent", border: "none", outline: "none", cursor: "pointer",
                 display: "flex", alignItems: "center", gap: "0.25rem", padding: 0,
                 fontFamily: "Cinzel,serif", fontSize: "0.85rem", color: "var(--hj-accent)" }}>
        {value}
        <Icon name={open ? "chevron-up" : "chevron-down"} size="0.65em"/>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)}/>
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 11,
                        background: "var(--hj-modal-bg)", border: "1px solid var(--hj-accent-border)",
                        borderRadius: "var(--radius-md)", overflow: "hidden", minWidth: 56,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>
            {DICE_TYPES.map(d => (
              <button key={d} onClick={() => { onChange(d); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "center", padding: "0.4rem 0.8rem",
                         background: d === value ? "rgba(226,185,78,0.12)" : "transparent",
                         border: "none", cursor: "pointer",
                         fontFamily: "Cinzel,serif", fontSize: "0.8rem",
                         color: d === value ? "var(--hj-accent)" : "var(--hj-text)" }}>
                {d}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function RestModal({ type, char, setChar, onClose }) {
  const T  = useT();
  const R  = T.REST;
  const hd = char.hitDice || { type: "d8", max: 1, used: 0 };
  const available = Math.max(0, hd.max - hd.used);
  const [hdSpend, setHdSpend] = useState(1);
  const [maxDraft, setMaxDraft] = useState(null);
  const [spendDraft, setSpendDraft] = useState(null);

  const adjustSpend = delta => setHdSpend(s => {
    const next = clamp(s + delta, 0, available);
    setSpendDraft(null);
    return next;
  });

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
    const newSlots = {};
    Object.entries(char.spellSlots || {}).forEach(([k, v]) => { newSlots[k] = { ...v, used: 0 }; });
    setChar(c => ({
      ...c,
      hp: { ...c.hp, current: c.hp.max, temp: 0 },
      hitDice: { ...hd, used: 0 },
      spellSlots: newSlots,
      deathSaves: { successes: 0, failures: 0 },
      conditions: {},
    }));
    onClose();
  };

  const isShort = type === "short";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ borderColor: "var(--hj-accent-border)" }} onClick={e => e.stopPropagation()}>
        <div className="modal-title" style={{ display:"flex", alignItems:"center", gap:"0.4rem", color:"var(--hj-accent)" }}>
          <Icon name={isShort ? "moon" : "sun"} size="0.95em"/> {isShort ? R.shortTitle : R.longTitle}
        </div>
        {isShort ? (
          <>
            <p className="modal-text">{R.availableDice(available, hd.max, hd.type)}</p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.7rem", flexWrap: "wrap" }}>
              <div style={fieldBoxStyle}>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color:"var(--hj-text-muted)" }}>{R.diceType}</span>
                <DiceTypeDropdown value={hd.type}
                  onChange={d => setChar(c => ({ ...c, hitDice: { ...hd, type: d } }))}/>
              </div>
              <div style={fieldBoxStyle}>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color:"var(--hj-text-muted)" }}>{R.maxLabel}</span>
                <input type="number" min={1} value={maxDraft ?? hd.max}
                  onFocus={e => { e.target.select(); setMaxDraft(String(hd.max)); }}
                  onChange={e => {
                    const raw = e.target.value;
                    setMaxDraft(raw);
                    const v = parseInt(raw);
                    if (!isNaN(v) && v >= 1) setChar(c => ({ ...c, hitDice: { ...hd, max: v } }));
                  }}
                  onBlur={e => {
                    const v = parseInt(e.target.value);
                    const final = (!isNaN(v) && v >= 1) ? v : 1;
                    setChar(c => ({ ...c, hitDice: { ...hd, max: final } }));
                    setMaxDraft(null);
                  }}
                  style={{ width: 36, fontFamily: "Cinzel,serif", fontSize: "0.85rem", background: "transparent", border: "none", outline: "none", textAlign: "center", color: "var(--hj-accent)" }}/>
              </div>
            </div>
            <div className="modal-detail" style={{ borderColor:"var(--hj-border-input)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color:"var(--hj-text-muted)" }}>{R.spend}</span>
                <button onClick={() => adjustSpend(-1)} aria-label="Decrease dice" style={roundBtnStyle}><Icon name="minus" size="0.9em"/></button>
                <input type="number" min={0} max={available} value={spendDraft ?? hdSpend}
                  onFocus={e => { e.target.select(); setSpendDraft(String(hdSpend)); }}
                  onChange={e => {
                    const raw = e.target.value;
                    setSpendDraft(raw);
                    const v = parseInt(raw);
                    if (!isNaN(v)) setHdSpend(clamp(v, 0, available));
                  }}
                  onBlur={e => {
                    const v = parseInt(e.target.value);
                    setHdSpend(clamp(isNaN(v) ? 0 : v, 0, available));
                    setSpendDraft(null);
                  }}
                  style={{ width: 36, fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, background: "transparent", border: "none", borderBottom: "1px solid var(--hj-accent-border)", outline: "none", textAlign: "center", color: "var(--hj-accent)" }}/>
                <button onClick={() => adjustSpend(1)} aria-label="Increase dice" style={roundBtnStyle}><Icon name="plus" size="0.9em"/></button>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.72rem", color:"var(--hj-text-muted)" }}>{hd.type}</span>
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
              <button className="btn-ghost" style={{ borderColor:"var(--hj-border-input)" }} onClick={onClose}>{R.cancel}</button>
              <button className="btn-ghost"
                style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", borderColor:"var(--hj-accent-border)", color:"var(--hj-accent)" }}
                onClick={doShortRest}><Icon name="moon" size="0.85em"/> {R.doShortRest}</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                ["heart",  R.restoreHp,    R.restoreHpDetail(char.hp.current, char.hp.max), "#4a9a5a"],
                ["sparkles", R.resetSlots, R.resetSlotsDetail, "var(--hj-spell-accent)"],
                ["dice",   R.recoverDice,  R.recoverDiceDetail(char.hitDice?.max - char.hitDice?.used || 0, char.hitDice?.max||1, char.hitDice?.used||0), "var(--hj-accent)"],
                ["skull",  R.resetDeath,   R.resetDeathDetail, "#9a3a3a"],
                ["flag",   R.resetConditions, R.resetConditionsDetail, "#aa4444"],
              ].map(([icon, label, detail, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.35rem 0", borderBottom: "1px solid var(--hj-border-sub)" }}>
                  <span style={{ flexShrink: 0, display: "flex", color }}><Icon name={icon} size="1.1em"/></span>
                  <div>
                    <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontFamily: "Crimson Text,Georgia,serif", fontSize: "0.88rem", opacity: 0.9, fontStyle: "italic" }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
              <button className="btn-ghost" style={{ borderColor:"var(--hj-border-input)" }} onClick={onClose}>{R.cancel}</button>
              <button className="btn-ghost"
                style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", borderColor:"var(--hj-accent-border)", color:"var(--hj-accent)" }}
                onClick={doLongRest}><Icon name="sun" size="0.85em"/> {R.doLongRest}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
