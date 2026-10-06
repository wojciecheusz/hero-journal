import { useCallback } from 'react';
import { numMod } from '../../../utils/math';
import { ProfMarker, ProfLegend } from './ProfMarker';

export default function SkillsCard({ char, setChar, C, GENERIC_SKILLS, pb }) {
  const cycleSkill = useCallback(key => setChar(c => {
    const wasP = !!(c.skills||{})[key]; const wasE = !!(c.skillExp||{})[key];
    const ov = {...(c.skillOverride||{})}; delete ov[key]; // klik pipsa = wróć do liczonej wartości
    if (!wasP && !wasE) return { ...c, skills:{...(c.skills||{}),[key]:true}, skillExp:{...(c.skillExp||{}),[key]:false}, skillOverride:ov };
    if ( wasP && !wasE) return { ...c, skills:{...(c.skills||{}),[key]:true}, skillExp:{...(c.skillExp||{}),[key]:true}, skillOverride:ov };
    const s2={...(c.skills||{})}; delete s2[key];
    const e2={...(c.skillExp||{})}; delete e2[key];
    return { ...c, skills:s2, skillExp:e2, skillOverride:ov };
  }), [setChar]);

  const setOverride = useCallback((key, raw) => setChar(c => {
    if (raw === "") {
      const o = {...(c.skillOverride||{})}; delete o[key];
      return {...c, skillOverride: o};
    }
    return {...c, skillOverride: {...(c.skillOverride||{}), [key]: parseInt(raw)}};
  }), [setChar]);

  return (
    <div className="card">
      <div className="sect-divider">{C.skillsTitle}</div>
      <ProfLegend C={C}/>
      <div className="prof-grid">
        {GENERIC_SKILLS.map(sk => {
          const prz  = !!(char.skills||{})[sk.key];
          const exp  = !!(char.skillExp||{})[sk.key];
          const base = Math.floor(((char.stats?.[sk.attr] ?? 10)-10)/2);
          const computed = exp ? base+pb*2 : prz ? base+pb : base;
          const over = (char.skillOverride||{})[sk.key];
          const display = over !== undefined ? (over >= 0 ? `+${over}` : `${over}`) : numMod(computed);

          const valColor  = over !== undefined ? "var(--hj-pip-prof)" : exp ? "var(--hj-pip-exp)" : prz ? "var(--hj-pip-prof)" : "var(--hj-text-muted)";

          return (
            <div key={sk.key} className="prof-row">
              <ProfMarker prof={prz} exp={exp} label={sk.label} C={C} onClick={() => cycleSkill(sk.key)}/>
              <span className={`prof-name${exp ? " exp" : prz ? " prof" : ""}`}>
                {sk.label}
              </span>
              <span className="prof-attr">
                {C.statAbbr?.[sk.attr] || sk.attr}
              </span>
              <input
                type="text" inputMode="numeric"
                value={display}
                title={C.overrideTip}
                onFocus={e => e.target.select()}
                onChange={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  setOverride(sk.key, r);
                }}
                onBlur={e => {
                  const r = e.target.value.replace(/[^-\d]/g, "");
                  if (!r || isNaN(parseInt(r))) setOverride(sk.key, "");
                }}
                className={`prof-value${over !== undefined ? " overridden" : ""}`} style={{ color: valColor }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
