import { useCallback } from 'react';
import { useT } from '../../../i18n/translations';
import { ProfMarker, ProfLegend } from './ProfMarker';
import { numMod } from '../../../utils/math';

export default function SavingThrowsCard({ char, setChar, C, pb }) {
  const T = useT();
  const SAVING_THROWS = T.SAVING_THROWS;
  const cycleSavingThrow = useCallback(key => setChar(c => {
    const wasP = !!(c.savingThrows||{})[key]; const wasE = !!(c.savingThrowExp||{})[key];
    const ov = {...(c.savingThrowOverride||{})}; delete ov[key]; // klik pipsa = wróć do liczonej wartości
    if (!wasP && !wasE) return { ...c, savingThrows:{...(c.savingThrows||{}),[key]:true}, savingThrowExp:{...(c.savingThrowExp||{}),[key]:false}, savingThrowOverride:ov };
    if ( wasP && !wasE) return { ...c, savingThrows:{...(c.savingThrows||{}),[key]:true}, savingThrowExp:{...(c.savingThrowExp||{}),[key]:true}, savingThrowOverride:ov };
    const s2={...(c.savingThrows||{})}; delete s2[key];
    const e2={...(c.savingThrowExp||{})}; delete e2[key];
    return { ...c, savingThrows:s2, savingThrowExp:e2, savingThrowOverride:ov };
  }), [setChar]);

  const setOverride = useCallback((key, raw) => setChar(c => {
    if (raw === "") {
      const o = {...(c.savingThrowOverride||{})}; delete o[key];
      return {...c, savingThrowOverride: o};
    }
    return {...c, savingThrowOverride: {...(c.savingThrowOverride||{}), [key]: parseInt(raw)}};
  }), [setChar]);

  return (
    <div className="card">
      <div className="sect-divider">{C.savingThrowsTitle}</div>
      <ProfLegend C={C}/>
      <div className="prof-grid">
        {SAVING_THROWS.map(st => {
          const statVal = char.stats?.[st.attr] ?? 10;
          const base    = Math.floor((statVal - 10) / 2);
          const prz     = !!(char.savingThrows||{})[st.key];
          const exp     = !!(char.savingThrowExp||{})[st.key];
          const computed = exp ? base + pb*2 : prz ? base + pb : base;
          const over    = (char.savingThrowOverride||{})[st.key];
          const display = over !== undefined ? (over >= 0 ? `+${over}` : `${over}`) : numMod(computed);
          const valColor  = over !== undefined ? "var(--hj-pip-prof)" : exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text-muted)";

          return (
            <div key={st.key} className="prof-row">
              <ProfMarker prof={prz} exp={exp} label={st.label} C={C} onClick={() => cycleSavingThrow(st.key)}/>
              <span className={`prof-name${exp ? " exp" : prz ? " prof" : ""}`}>
                {st.label}
              </span>
              <input
                type="text" inputMode="numeric"
                value={display}
                title={C.overrideTip}
                onFocus={e => e.target.select()}
                onChange={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  setOverride(st.key, r);
                }}
                onBlur={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  if (!r || isNaN(parseInt(r))) setOverride(st.key, "");
                }}
                className={`prof-value${over !== undefined ? " overridden" : ""}`} style={{ color: valColor }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
