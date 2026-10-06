import { useState } from 'react';
import Icon from '../../shared/icons';
import { CONDITIONS } from '../../constants/gameConstants';
import { clamp, numMod } from '../../utils/math';
import { xpProgress, abilityMod } from '../../utils/character';
import { HpModal, XpModal, ConditionsModal, DeathSavesModal, ExhaustionModal } from './VitalsModals';

const hpTone = pct => pct > 70 ? "good" : pct > 35 ? "warn" : "bad";

/* Panel „Życie" (P29/D1–D3) — wspólny dla sidebara (desktop) i karty
   bohatera na mobile. Wartości są duże i dotykowe: stuknięcie w PŻ/XP
   otwiera okno z obrażeniami/leczeniem albo dodawaniem XP i awansem,
   a stany/rzuty/wyczerpanie pokazują swój stan bez rozwijania. */
export default function VitalsPanel({ T, char, setChar, pb, onRestModal, variant = "sidebar" }) {
  const H = T.HERO;
  const C = T.CHAR;
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const hp     = char.hp || { current: 0, max: 1, temp: 0 };
  const cur    = parseInt(hp.current) || 0;
  const max    = Math.max(1, parseInt(hp.max) || 1);
  const temp   = Math.max(0, parseInt(hp.temp) || 0);
  const hpPct  = Math.round(clamp((cur / max) * 100, 0, 100));
  const tone   = hpTone(hpPct);
  const adjust = d => setChar(c => {
    const h = c.hp || hp;
    return { ...c, hp: { ...h, current: clamp((parseInt(h.current) || 0) + d, 0, Math.max(1, parseInt(h.max) || 1)) } };
  });

  const xp = xpProgress(char);

  const wis       = abilityMod(char.stats?.WIS);
  const percBonus = char.skillExp?.perception ? wis + pb * 2 : char.skills?.perception ? wis + pb : wis;
  const spellAbi  = abilityMod((char.stats || {})[char.spellcastingAbility || "INT"]);
  const minis = [
    { key: "passivePerceptionOverride", label: H.miniPerc,     value: 10 + percBonus },
    { key: "skillDCOverride",           label: H.miniSpellDc,  value: 8 + pb + spellAbi },
    { key: "spellAttackOverride",       label: H.miniSpellAtk, value: pb + spellAbi, signed: true },
  ];

  const activeConds = CONDITIONS.filter(c => (char.conditions || {})[c.key]).length;
  const ds  = char.deathSaves || { successes: 0, failures: 0 };
  const exh = (char.conditions || {}).exhaustion || 0;
  const hd  = char.hitDice || { type: "d8", max: 1, used: 0 };
  const hdLeft = Math.max(0, (hd.max || 0) - (hd.used || 0));

  return (
    <section className={`vp vp-${variant}`} aria-label={C.hp}>
      {/* ── PŻ ── */}
      <div className="vp-card">
        <div className="vp-head">
          <span className="vp-label">{C.hp}</span>
          <button className={`vp-temp-pill${temp > 0 ? "" : " empty"}`} onClick={() => setModal("hp")}
            aria-label={`${H.tempHp}: ${temp}`}>
            <Icon name="shield" size="0.95em"/> <span>{H.tempShort}</span> <b>{temp}</b>
          </button>
        </div>
        <button className="vp-big-value" onClick={() => setModal("hp")} aria-label={`${C.hp}: ${cur} / ${max}. ${H.tapToEdit}`}>
          <span className={`vp-hp-cur tone-${tone}`}>{cur}</span>
          <span className="vp-hp-max">/ {max}</span>
        </button>
        <div className="vp-hp-ctrl">
          <button className="vp-step minus" onClick={() => adjust(-1)} aria-label={`${C.hp} −1`}><Icon name="minus" size="1.1em"/></button>
          <div className="vp-bar" aria-hidden="true">
            <div className={`vp-bar-fill tone-${tone}`} style={{ width: `${hpPct}%` }}/>
          </div>
          <button className="vp-step plus" onClick={() => adjust(1)} aria-label={`${C.hp} +1`}><Icon name="plus" size="1.1em"/></button>
        </div>
      </div>

      {/* ── XP / poziom ── */}
      <div className="vp-card">
        <div className="vp-head">
          <span className="vp-label">{H.xpTitle}</span>
          <span className="vp-level-pill">{H.levelN(xp.level)}</span>
        </div>
        <button className="vp-xp-row" onClick={() => setModal("xp")} aria-label={`${H.xpTitle}: ${xp.xp}. ${H.tapToEdit}`}>
          <span className="vp-xp-value">{xp.xp.toLocaleString()}</span>
          {xp.xpNext != null && <span className="vp-xp-next">/ {xp.xpNext.toLocaleString()}</span>}
          <span className="vp-xp-add"><Icon name="plus" size="1em"/> XP</span>
        </button>
        <div className="vp-bar thin" aria-hidden="true"><div className="vp-bar-fill xp" style={{ width: `${xp.pct}%` }}/></div>
        {xp.canLevelUp ? (
          <button className="vp-levelup" onClick={() => setModal("levelup")}>
            <Icon name="sparkle" size="1em"/> {H.levelUp} → {xp.level + 1}
          </button>
        ) : (
          <div className="vp-xp-hint">
            {xp.xpNext == null ? H.xpMaxLevel : H.xpToNext((xp.xpNext - xp.xp).toLocaleString(), xp.level + 1)}
          </div>
        )}
      </div>

      {/* ── Mini-staty: biegłość / percepcja pasywna / ST czarów / atak czarem ── */}
      <div className="vp-minis">
        <MiniStat label={H.miniProf} value={pb} title={C.profBonusTip}
          onCommit={v => setChar(c => ({ ...c, profBonus: v > 0 ? v : 2 }))} required/>
        {minis.map(m => {
          const over = char[m.key];
          return (
            <MiniStat key={m.key} label={m.label} value={over ?? m.value} signed={m.signed}
              overridden={over !== undefined} title={H.miniOverride}
              onCommit={v => setChar(c => { const n = { ...c }; if (v === null) delete n[m.key]; else n[m.key] = v; return n; })}/>
          );
        })}
      </div>

      {/* ── Stany / Rzuty przeciw śmierci / Wyczerpanie ── */}
      <div className="vp-status">
        <button className={`vp-status-btn${activeConds ? " alert" : ""}`} onClick={() => setModal("conditions")}>
          <span className="vp-status-label">{C.stanyTitle}</span>
          <span className="vp-status-value">{activeConds ? H.activeN(activeConds) : H.none}</span>
        </button>
        <button className={`vp-status-btn${ds.successes || ds.failures ? " alert" : ""}`} onClick={() => setModal("death")}>
          <span className="vp-status-label">{C.deathSaves}</span>
          <span className="vp-status-value death-summary">
            <span className="death-ok">{"●".repeat(ds.successes || 0)}{"○".repeat(3 - (ds.successes || 0))}</span>
            <span className="death-bad">{"●".repeat(ds.failures || 0)}{"○".repeat(3 - (ds.failures || 0))}</span>
          </span>
        </button>
        <button className={`vp-status-btn${exh ? " alert" : ""}`} onClick={() => setModal("exhaustion")}>
          <span className="vp-status-label">{C.exhaustion}</span>
          <span className="vp-status-value">{exh} / 6</span>
        </button>
      </div>

      {/* ── Odpoczynek ── */}
      <div className="vp-rest">
        <button className="vp-rest-btn short" onClick={() => onRestModal("short")}>
          <Icon name="moon" size="1.15em"/>
          <span className="vp-rest-label">{C.shortRest}</span>
          <span className="vp-rest-sub">{C.hitDice}: {hdLeft}/{hd.max || 0}</span>
        </button>
        <button className="vp-rest-btn long" onClick={() => onRestModal("long")}>
          <Icon name="sun" size="1.15em"/>
          <span className="vp-rest-label">{C.longRest}</span>
        </button>
      </div>

      {modal === "hp"         && <HpModal T={T} char={char} setChar={setChar} onClose={close}/>}
      {modal === "xp"         && <XpModal T={T} char={char} setChar={setChar} onClose={close}/>}
      {modal === "levelup"    && <XpModal T={T} char={char} setChar={setChar} onClose={close} startWithLevelUp/>}
      {modal === "conditions" && <ConditionsModal T={T} char={char} setChar={setChar} onClose={close}/>}
      {modal === "death"      && <DeathSavesModal T={T} char={char} setChar={setChar} onClose={close}/>}
      {modal === "exhaustion" && <ExhaustionModal T={T} char={char} setChar={setChar} onClose={close}/>}
    </section>
  );
}

/* Mini-stat z możliwością nadpisania wartości. Edycja na tekście (draft),
   zatwierdzenie przy opuszczeniu pola; puste pole = powrót do automatu. */
function MiniStat({ label, value, signed, overridden, title, onCommit, required = false }) {
  const [draft, setDraft] = useState(null);
  const shown = draft ?? (signed ? numMod(value) : String(value));
  return (
    <label className={`vp-mini${overridden ? " overridden" : ""}`} title={title}>
      <input className="vp-mini-value" type="text" inputMode="numeric" value={shown}
        onFocus={e => { setDraft(String(value)); requestAnimationFrame(() => e.target.select()); }}
        onChange={e => setDraft(e.target.value.replace(/[^-\d]/g, ""))}
        onBlur={() => {
          const n = parseInt(draft ?? "", 10);
          if (isNaN(n)) { if (!required) onCommit(null); }
          else if (n !== value || overridden || required) onCommit(n);
          setDraft(null);
        }}
        onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}/>
      <span className="vp-mini-label">{label}</span>
    </label>
  );
}
