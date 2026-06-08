import { useT } from '../../../i18n/translations';

export function SpellSlotsWidget({ char, setChar, spells }) {
  const T = useT();
  const SPELL_SLOT_LABELS = ["level1","level2","level3","level4","level5","level6","level7","level8","level9"];
  const usedLevels = [...new Set((spells || []).map(s => s.level).filter(l => l !== "cantrip"))];
  if (!usedLevels.length) return (
    <p style={{ fontFamily: "Cinzel,serif", fontSize: "0.62rem", opacity: 0.5, textAlign: "center", padding: "1rem 0" }}>
      {T.UI.noLevelSpells}
    </p>
  );
  usedLevels.sort((a, b) => SPELL_SLOT_LABELS.indexOf(a) - SPELL_SLOT_LABELS.indexOf(b));
  return (
    <div style={{ display: "grid", gap: "0.35rem", gridTemplateColumns: `repeat(${usedLevels.length},1fr)` }}>
      {usedLevels.map(lv => {
        const sl = (char.spellSlots || {})[lv] || { max: 0, used: 0 };
        const count = (spells || []).filter(s => s.level === lv).length;
        return (
          <div key={lv} className="spell-slot-box">
            <span className="spell-slot-label">{T.LABELS.spellLevel[lv] ?? lv}</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
              <input className="spell-slot-input" type="number" min={0} value={sl.used || 0}
                onChange={e => setChar(c => ({ ...c, spellSlots: { ...(c.spellSlots || {}), [lv]: { ...((c.spellSlots || {})[lv] || { max: 0, used: 0 }), used: Math.max(0, parseInt(e.target.value) || 0) } } }))}
                style={{ width: 28, fontSize: "0.9rem" }}/>
              <span style={{ color: "var(--hj-spell-border)", fontSize: "0.7rem" }}>/</span>
              <input className="spell-slot-input" type="number" min={0} value={sl.max || 0}
                onChange={e => setChar(c => ({ ...c, spellSlots: { ...(c.spellSlots || {}), [lv]: { ...((c.spellSlots || {})[lv] || { max: 0, used: 0 }), max: Math.max(0, parseInt(e.target.value) || 0) } } }))}
                style={{ width: 28, fontSize: "0.9rem", color: "var(--hj-spell-muted)" }}/>
            </div>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.42rem", color: "var(--hj-spell-dim)", textTransform: "uppercase", marginTop: "0.1rem", display: "block" }}>
              {T.UI.spellCount(count)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
