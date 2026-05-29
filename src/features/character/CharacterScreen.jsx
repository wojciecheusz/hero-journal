import { useState, useCallback } from 'react';
import { clamp, numMod } from '../../utils/math';
import { SAVING_THROWS, GENERIC_SKILLS, ALIGNMENTS, ITEM_ICONS, XP_THRESHOLDS, CONDITIONS } from '../../constants/gameConstants';
import { StatBox, SkillPips, Toggle, RestModal, SpellSlotsWidget } from '../../shared/ui';

const hpBarColor = pct => pct > 70
  ? "linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)"
  : pct > 35
    ? "linear-gradient(90deg,#7a4a10,#cc7020,#e08030)"
    : "linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

const LABEL = { fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.25rem", color: "var(--text-label)" };
const LABEL_SM = { fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" };

export default function CharacterScreen({ char, setChar, inventory, skills, spells }) {
  const upd   = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const updSt = (s, v) => setChar(c => ({ ...c, stats: { ...c.stats, [s]: v } }));
  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));
  const pb    = char.profBonus || 2;
  const ds    = char.deathSaves || { successes: 0, failures: 0 };

  const [restModal, setRestModal] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if ((inventory || []).some(i => i.equipped)) return "items";
    if ((skills || []).some(s => s.inUse)) return "skills";
    return "spells";
  });

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills || []).filter(s => s.inUse);
  const activeSpells  = (spells || []).filter(s => s.inUse);

  const totalLevel = Math.min(Math.max((char.classes || []).reduce((s, c) => s + (c.level || 1), 0), 1), 20);
  const xpMax      = totalLevel < 20 ? XP_THRESHOLDS[totalLevel] : null;

  // Calculated values
  const wisBonus = Math.floor((char.stats.WIS - 10) / 2);
  const percProf = !!(char.skills || {}).perception;
  const percExp  = !!(char.skillExp || {}).perception;
  const percBonus = percExp ? wisBonus + pb * 2 : percProf ? wisBonus + pb : wisBonus;
  const passivePerception = 10 + percBonus;
  const spellAbilityBonus = Math.floor(((char.stats || {})[char.spellcastingAbility || "INT"] || 10) - 10) / 2;
  const spellDC = 8 + pb + spellAbilityBonus;
  const spellAttack = pb + spellAbilityBonus;

  const cycleSkill = useCallback(key => setChar(c => {
    const wasP = !!(c.skills || {})[key]; const wasE = !!(c.skillExp || {})[key];
    if (!wasP && !wasE) return { ...c, skills: { ...(c.skills || {}), [key]: true }, skillExp: { ...(c.skillExp || {}), [key]: false } };
    if (wasP && !wasE)  return { ...c, skills: { ...(c.skills || {}), [key]: true }, skillExp: { ...(c.skillExp || {}), [key]: true } };
    const s2 = { ...(c.skills || {}) }; delete s2[key];
    const e2 = { ...(c.skillExp || {}) }; delete e2[key];
    return { ...c, skills: s2, skillExp: e2 };
  }), [setChar]);

  const toggleDeath = useCallback((type, idx) => setChar(c => {
    const cur = (c.deathSaves || {})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves || {}), [type]: Math.min(3, Math.max(0, next)) } };
  }), [setChar]);

  const toggleCondition = useCallback(key => setChar(c => {
    const conds = { ...(c.conditions || {}) };
    if (conds[key]) { delete conds[key]; } else { conds[key] = true; }
    return { ...c, conditions: conds };
  }), [setChar]);

  const updCoins = useCallback((type, val) => setChar(c => ({
    ...c, coins: { ...(c.coins || { gold: 0, silver: 0, copper: 0 }), [type]: Math.max(0, parseInt(val) || 0) }
  })), [setChar]);

  return (
    <>
      {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={() => setRestModal(null)}/>}

      <div className="card">
        <div className="sect-label">Bohater</div>

        {/* ── Imię postaci ── */}
        <input className="iedit"
          style={{ fontFamily: "Cinzel,serif", fontSize: "1.35rem", fontWeight: 700, letterSpacing: "0.04em", width: "100%", marginBottom: "0.7rem" }}
          value={char.name || ""} onChange={e => upd("name", e.target.value)} placeholder="Imię bohatera…"/>

        {/* ── Klasy ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.8rem" }}>
          {(char.classes || []).map((cls, i) => (
            <div key={i} className="class-row" style={{ alignItems: "baseline", gap: "0.4rem" }}>
              <input className="iedit flex1"
                style={{ fontFamily: "Cinzel,serif", fontSize: i === 0 ? "1.1rem" : "0.95rem", fontWeight: 700, letterSpacing: "0.03em" }}
                value={cls.name} placeholder={`Klasa ${i + 1}…`}
                onChange={e => setChar(c => { const cl = [...c.classes]; cl[i] = { ...cl[i], name: e.target.value }; return { ...c, classes: cl }; })}/>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.14em", opacity: 0.45, flexShrink: 0, textTransform: "uppercase" }}>Poz.</span>
              <input type="number" className="iedit"
                style={{ width: 32, textAlign: "center", fontFamily: "Cinzel,serif", fontSize: i === 0 ? "1rem" : "0.88rem", fontWeight: 600, opacity: 0.85 }}
                value={cls.level} min={1} max={20}
                onChange={e => setChar(c => { const cl = [...c.classes]; cl[i] = { ...cl[i], level: clamp(parseInt(e.target.value) || 1, 1, 20) }; return { ...c, classes: cl }; })}/>
              {i > 0 && <button className="btn-ghost" style={{ padding: "0.1rem 0.35rem", fontSize: "0.65rem" }}
                onClick={() => setChar(c => ({ ...c, classes: c.classes.filter((_, j) => j !== i) }))}>✕</button>}
            </div>
          ))}
          {(char.classes || []).length < 4 && (
            <button className="btn-sm" style={{ alignSelf: "flex-start", marginTop: "0.2rem" }}
              onClick={() => setChar(c => ({ ...c, classes: [...(c.classes || []), { name: "", level: 1 }] }))}>+ Wieloklasowość</button>
          )}
        </div>

        {/* ── Przeszłość | Charakter | XP ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: "0.5rem", alignItems: "end" }}>
          <div>
            <div style={LABEL}>Przeszłość</div>
            <input className="iedit" style={{ fontSize: "0.9rem" }} value={char.background || ""}
              onChange={e => upd("background", e.target.value)} placeholder="Przeszłość postaci…"/>
          </div>
          <div>
            <div style={LABEL}>Charakter</div>
            <select className="g-select" value={char.alignment || "Bezwzględnie neutralny"}
              onChange={e => upd("alignment", e.target.value)} style={{ fontSize: "0.75rem", padding: "0.3rem 0.4rem" }}>
              {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <div style={LABEL}>XP</div>
            <input type="number" min={0} className="iedit"
              style={{ fontFamily: "Cinzel,serif", fontSize: "0.9rem", textAlign: "center", width: "100%", color: "inherit" }}
              value={char.xp ?? 0} onChange={e => upd("xp", Math.max(0, parseInt(e.target.value) || 0))}/>
            <div style={{ ...LABEL_SM, fontSize: "0.42rem", marginTop: "0.18rem", textAlign: "center" }}>
              {xpMax !== null ? `→ lvl ${totalLevel + 1}: ${xpMax.toLocaleString("pl-PL")}` : "— MAX —"}
            </div>
          </div>
        </div>

        {/* ── Atrybuty + Rzuty Obronne ── */}
        <hr className="inner-divider" data-label="Atrybuty + Rzuty Obronne" style={{ marginTop: "1.1rem" }}/>
        <div className="stat-grid-6" style={{ marginTop: "0.8rem" }}>
          {SAVING_THROWS.map(st => {
            const base = Math.floor((char.stats[st.attr] - 10) / 2);
            const over = (char.savingThrowOverride || {})[st.key];
            const stVal = over !== undefined ? over : base;
            const stColor = over !== undefined ? "var(--pip-prof)" : "inherit";
            return (
              <div key={st.key} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <StatBox label={st.attr} value={char.stats[st.attr]} onChange={v => updSt(st.attr, v)}/>
                <div className="stat-box" style={{ borderTop: "none", textAlign: "center", padding: "0.25rem 0.1rem 0.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.42rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", lineHeight: 1 }}>ST</span>
                  <input type="number" value={stVal}
                    title="Edytuj ręcznie · dwuklik = reset"
                    style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.85rem", fontWeight: 700, color: stColor, textAlign: "center", width: "100%", padding: "0.1rem 0", lineHeight: 1, display: "block", cursor: "text" }}
                    onFocus={e => e.target.select()}
                    onChange={e => { const n = parseInt(e.target.value); setChar(c => ({ ...c, savingThrowOverride: { ...(c.savingThrowOverride || {}), [st.key]: isNaN(n) ? undefined : n } })); }}
                    onDoubleClick={() => setChar(c => { const o = { ...(c.savingThrowOverride || {}) }; delete o[st.key]; return { ...c, savingThrowOverride: o }; })}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Żywotność i Walka ── */}
        <hr className="inner-divider" data-label="Żywotność i Walka" style={{ marginTop: "1.1rem" }}/>

        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "32px auto 32px 1fr 1fr 1fr", gap: "0.3rem", alignItems: "stretch" }}>
          <button className="btn-pm minus" style={{ height: "100%", minHeight: 50 }}
            onClick={() => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(c.hp.current - 1, 0, c.hp.max) } }))}>−</button>
          <div className="combat-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.2rem 0.3rem", gap: 0 }}>
            <span className="combat-box-label">PŻ (HP)</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.1rem" }}>
              <input type="number" value={char.hp.current}
                style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", textAlign: "center", fontSize: "1.25rem", fontWeight: 700, width: 46, color: hpNumColor(hpPct), transition: "color 0.5s" }}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, current: e.target.value === "" ? 0 : clamp(parseInt(e.target.value) || 0, 0, c.hp.max) } }))}
                onBlur={e => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(parseInt(e.target.value) || 0, 0, c.hp.max) } }))}/>
              <span style={{ color: "inherit", opacity: 0.3, fontSize: "0.75rem" }}>/</span>
              <input type="number" value={char.hp.max}
                style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", textAlign: "center", fontSize: "0.82rem", width: 36, opacity: 0.8, color: "inherit" }}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, max: e.target.value === "" ? 1 : Math.max(1, parseInt(e.target.value) || 1) } }))}
                onBlur={e => setChar(c => ({ ...c, hp: { ...c.hp, max: Math.max(1, parseInt(e.target.value) || 1) } }))}/>
            </div>
          </div>
          <button className="btn-pm plus" style={{ height: "100%", minHeight: 50 }}
            onClick={() => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(c.hp.current + 1, 0, c.hp.max) } }))}>+</button>
          <div className="combat-box">
            <span className="combat-box-label">Tym. PŻ</span>
            <input className="combat-box-input" type="number" value={char.hp.temp || 0}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, temp: e.target.value === "" ? 0 : parseInt(e.target.value) || 0 } }))}
              onBlur={e => setChar(c => ({ ...c, hp: { ...c.hp, temp: parseInt(e.target.value) || 0 } }))}/>
          </div>
          <div className="combat-box">
            <span className="combat-box-label">KP</span>
            <input className="combat-box-input" type="number" value={char.ac || 0}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => ({ ...c, ac: e.target.value === "" ? 0 : parseInt(e.target.value) || 0 }))}
              onBlur={e => setChar(c => ({ ...c, ac: parseInt(e.target.value) || 0 }))}/>
          </div>
          <div className="combat-box" title="Domyślnie mod. Zręczności">
            <span className="combat-box-label">INI</span>
            <input className="combat-box-input" type="number"
              value={char.initiativeBonus !== undefined ? char.initiativeBonus : Math.floor((char.stats.DEX - 10) / 2)}
              onFocus={e => e.target.select()}
              onChange={e => setChar(c => ({ ...c, initiativeBonus: e.target.value === "" ? undefined : parseInt(e.target.value) }))}
              onBlur={e => { if (e.target.value === "") setChar(c => { const o = { ...c }; delete o.initiativeBonus; return o; }); }}/>
          </div>
        </div>

        <div className="hp-bar-bg" style={{ marginTop: "0.5rem" }}>
          <div className="hp-bar-fill" style={{ width: `${hpPct}%`, background: hpBarColor(hpPct) }}/>
        </div>
        <div className="hp-pct" style={{ color: hpNumColor(hpPct) }}>{hpPct}% żywotności pozostało</div>

        {/* Death Saves */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.55rem", padding: "0.4rem 0.6rem", borderRadius: "2px", border: "1px solid rgba(128,128,128,0.12)", background: "rgba(128,128,128,0.04)" }}>
          <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", flexShrink: 0 }}>☠ vs śmierć</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.46rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a9a5a", flexShrink: 0 }}>S</span>
              {[0, 1, 2].map(i => <div key={i} onClick={() => toggleDeath("successes", i)}
                style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid #4a9a5a", background: i < ds.successes ? "#4a9a5a" : "transparent", cursor: "pointer", transition: "background 0.15s", flexShrink: 0 }}/>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.46rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a3a3a", flexShrink: 0 }}>P</span>
              {[0, 1, 2].map(i => <div key={i} onClick={() => toggleDeath("failures", i)}
                style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid #9a3a3a", background: i < ds.failures ? "#9a3a3a" : "transparent", cursor: "pointer", transition: "background 0.15s", flexShrink: 0 }}/>)}
            </div>
          </div>
        </div>

        {/* KW + Odpoczynek + Biegłość */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "0.4rem", marginTop: "0.5rem", alignItems: "stretch" }}>
          <div className="combat-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.25rem 0.4rem", gap: "0.1rem" }}>
            <span className="combat-box-label">Kości Wyt.</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <select className="combat-box-input" style={{ width: "auto", cursor: "pointer", fontSize: "0.75rem", paddingRight: "0.1rem" }}
                value={(char.hitDice || { type: "d8" }).type}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...(c.hitDice || { type: "d8", max: 1, used: 0 }), type: e.target.value } }))}>
                {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="number" min={0} value={(char.hitDice || { used: 0 }).used || 0}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...(c.hitDice || { type: "d8", max: 1, used: 0 }), used: parseInt(e.target.value) || 0 } }))}
                style={{ width: 24, background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700, textAlign: "center", color: "inherit" }}/>
              <span style={{ fontSize: "0.6rem", opacity: 0.35 }}>/</span>
              <input type="number" min={1} value={(char.hitDice || { max: 1 }).max || 1}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...(c.hitDice || { type: "d8", max: 1, used: 0 }), max: parseInt(e.target.value) || 1 } }))}
                style={{ width: 24, background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.9rem", textAlign: "center", color: "inherit", opacity: 0.65 }}/>
            </div>
          </div>
          <button className="btn-rest short" onClick={() => setRestModal("short")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.1rem", padding: "0.35rem 0.2rem" }}>
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>☽</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.43rem", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.3 }}>Krótki</span>
          </button>
          <button className="btn-rest long" onClick={() => setRestModal("long")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.1rem", padding: "0.35rem 0.2rem" }}>
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>☀</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.43rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Długi</span>
          </button>
          <div className="combat-box" title="Premia z Biegłości">
            <span className="combat-box-label">Biegłość</span>
            <input className="combat-box-input" type="number" value={pb}
              onFocus={e => e.target.select()} onChange={e => upd("profBonus", parseInt(e.target.value) || 2)}/>
          </div>
        </div>

        {/* Wartości obliczone */}
        <hr className="inner-divider" data-label="Wartości" style={{ marginTop: "1.1rem" }}/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem", marginTop: "0.7rem" }}>
          <div className="combat-box">
            <span className="combat-box-label">Pas. Percepcja</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "1.2rem", fontWeight: 700, display: "block", textAlign: "center", lineHeight: 1.2, color: "inherit" }}>{passivePerception}</span>
          </div>
          <div className="combat-box" title={`8 + Biegłość (${pb}) + mod. ${char.spellcastingAbility||"INT"} (${spellAbilityBonus >= 0 ? "+" : ""}${spellAbilityBonus})`}>
            <span className="combat-box-label">DC czarów</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "1.2rem", fontWeight: 700, display: "block", textAlign: "center", lineHeight: 1.2, color: "var(--spell-accent)" }}>{spellDC}</span>
          </div>
          <div className="combat-box" title={`Biegłość (${pb}) + mod. ${char.spellcastingAbility||"INT"} (${spellAbilityBonus >= 0 ? "+" : ""}${spellAbilityBonus})`}>
            <span className="combat-box-label">Atak czarami</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "1.2rem", fontWeight: 700, display: "block", textAlign: "center", lineHeight: 1.2, color: "var(--spell-accent)" }}>{numMod(spellAttack)}</span>
          </div>
        </div>

        {/* Umiejętności */}
        <hr className="inner-divider" data-label="Umiejętności" style={{ marginTop: "1.1rem" }}/>
        <div style={{ marginTop: "0.6rem", display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "0.3rem" }}>
          {GENERIC_SKILLS.map(sk => {
            const prz = !!(char.skills || {})[sk.key];
            const exp = !!(char.skillExp || {})[sk.key];
            const base = Math.floor((char.stats[sk.attr] - 10) / 2);
            const bonus = exp ? base + pb * 2 : prz ? base + pb : base;
            const pipColor  = exp ? "var(--pip-exp)" : prz ? "var(--pip-prof)" : "transparent";
            const pipBorder = exp ? "2px solid var(--pip-exp)" : prz ? "1.5px solid var(--pip-prof)" : "1.5px solid var(--pip-empty)";
            const pipClip   = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
            const statColor = exp ? "var(--pip-exp)" : prz ? "var(--pip-prof)" : "inherit";
            return (
              <div key={sk.key} title={sk.label} className={`stat-box${exp ? " stat-box-exp" : prz ? " stat-box-prz" : ""}`}
                onClick={() => cycleSkill(sk.key)}
                style={{ position: "relative", cursor: "pointer", padding: "0.35rem 0.25rem 0.3rem", textAlign: "center", minHeight: 0, userSelect: "none", minWidth: 0 }}>
                <div style={{ position: "absolute", top: "0.22rem", right: "0.22rem", width: 10, height: 10, borderRadius: "50%", border: pipBorder, background: pipColor, clipPath: pipClip, boxShadow: exp ? "0 0 4px var(--pip-exp)" : prz ? "0 0 4px var(--pip-prof)" : "none", transition: "all 0.15s", pointerEvents: "none" }}/>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.42rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-label)", display: "block", marginBottom: "0.15rem", lineHeight: 1.2, paddingRight: "0.7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sk.label}</span>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700, color: statColor, display: "block", lineHeight: 1 }}>{numMod(bonus)}</span>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.38rem", color: "var(--text-muted)", display: "block", marginTop: "0.1rem" }}>{sk.attr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Aktywne i Wyposażone + Sakiewka (zawsze widoczne) ── */}
      <div className="card">
        <div className="sect-label">Aktywne i Wyposażone</div>
        <div className="subtab-bar">
          <button className={`subtab-btn${activeTab === "items" ? " active" : ""}`} onClick={() => setActiveTab("items")}>
            Przedmioty{equippedItems.length > 0 ? ` (${equippedItems.length})` : ""}
          </button>
          <button className={`subtab-btn${activeTab === "skills" ? " active" : ""}`} onClick={() => setActiveTab("skills")}>
            Zdolności{activeSkills.length > 0 ? ` (${activeSkills.length})` : ""}
          </button>
          <button className={`subtab-btn${activeTab === "spells" ? " active" : ""}`} onClick={() => setActiveTab("spells")}>
            Czary{activeSpells.length > 0 ? ` (${activeSpells.length})` : ""}
          </button>
        </div>

        {activeTab === "items" && (equippedItems.length === 0
          ? <div className="empty-state">Brak wyposażonych przedmiotów.</div>
          : equippedItems.map(item => (
            <div key={item.id} className="equipped-item">
              <span className="equipped-icon">{ITEM_ICONS[item.type] || "◈"}</span>
              <div className="flex1">
                <div className="row" style={{ gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                  <span className="equipped-name">{item.name}</span>
                  <span className="equipped-type-badge">{item.type}</span>
                  {item.qty && item.qty !== "1" && <span className="equipped-type-badge">×{item.qty}</span>}
                </div>
                {item.damage && <div className="equipped-stat">⚔ {item.damage}{item.damageType ? ` (${item.damageType})` : ""}{item.modifier ? ` · +${parseInt(item.modifier)||0}` : ""}</div>}
                {item.charges && <div className="equipped-stat">Ładunki: {item.charges}</div>}
                {item.effect && <div className="equipped-stat" style={{ color: "var(--spell-muted)" }}>{item.effect}</div>}
                {item.note && <div className="equipped-stat" style={{ fontStyle: "italic", opacity: 0.7 }}>{item.note}</div>}
              </div>
            </div>
          ))
        )}

        {activeTab === "skills" && (activeSkills.length === 0
          ? <div className="empty-state">Zaznacz zdolności jako aktywne w zakładce „Zdolności".</div>
          : activeSkills.map(sk => (
            <div key={sk.id} className="equipped-item">
              <span className="equipped-icon">✨</span>
              <div className="flex1">
                <div className="row" style={{ gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                  <span className="equipped-name">{sk.name}</span>
                  <span className="equipped-skill-badge">{sk.category}</span>
                  {sk.level > 0 && <span className="equipped-skill-badge">{"●".repeat(sk.level)}</span>}
                </div>
                {sk.description && <div className="equipped-stat">{sk.description}</div>}
              </div>
            </div>
          ))
        )}

        {activeTab === "spells" && (
          <>
            <SpellSlotsWidget char={char} setChar={setChar} spells={spells}/>
            {activeSpells.length > 0 && (
              <div style={{ marginTop: "0.8rem" }}>
                {activeSpells.map(sp => (
                  <div key={sp.id} className="equipped-item">
                    <span className="equipped-icon">🔮</span>
                    <div className="flex1">
                      <div className="row" style={{ gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                        <span className="equipped-name" style={{ color: "var(--spell-text)" }}>{sp.name}</span>
                        <span className="equipped-spell-badge">{sp.level}</span>
                        {sp.school && <span className="equipped-spell-badge">{sp.school}</span>}
                      </div>
                      {sp.description && <div className="equipped-stat">{sp.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeSpells.length === 0 && <div className="empty-state">Zaznacz czary jako przygotowane w zakładce „Czary".</div>}
          </>
        )}

        {/* Sakiewka — złoto, srebro, miedź */}
        <div style={{ borderTop: "1px solid rgba(128,128,128,0.15)", marginTop: "0.8rem", paddingTop: "0.75rem" }}>
          <div style={{ ...LABEL_SM, marginBottom: "0.5rem" }}>💰 Sakiewka</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            {[["gold","🪙","Złoto","#c8a820"],["silver","⚪","Srebro","#8898a8"],["copper","🟤","Miedź","#b07040"]].map(([type, icon, label, color]) => {
              const val = (char.coins || {})[type] || 0;
              return (
                <div key={type} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.08em", textTransform: "uppercase", color, lineHeight: 1 }}>{icon} {label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <button onClick={() => updCoins(type, val - 1)}
                      style={{ width: 22, height: 22, background: "transparent", border: "1px solid var(--pip-empty)", cursor: "pointer", fontFamily: "monospace", fontSize: "0.85rem", color: "inherit", lineHeight: 1 }}>−</button>
                    <input type="number" min={0} value={val}
                      onChange={e => updCoins(type, parseInt(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      style={{ width: 46, fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700, textAlign: "center", background: "transparent", border: "none", borderBottom: `1px dashed ${color}`, outline: "none", color: "inherit" }}/>
                    <button onClick={() => updCoins(type, val + 1)}
                      style={{ width: 22, height: 22, background: "transparent", border: "1px solid var(--pip-empty)", cursor: "pointer", fontFamily: "monospace", fontSize: "0.85rem", color: "inherit", lineHeight: 1 }}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Stany postaci ── */}
      <div className="card">
        <div className="sect-label">Stany postaci</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {CONDITIONS.map(cond => {
            const active = !!(char.conditions || {})[cond.key];
            return (
              <button key={cond.key} onClick={() => toggleCondition(cond.key)}
                style={{
                  fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "0.25rem 0.5rem", border: `1px solid ${active ? "#cc3030" : "var(--pip-empty)"}`,
                  background: active ? "rgba(200,48,48,0.2)" : "transparent",
                  color: active ? "#ee5050" : "var(--text-muted)",
                  cursor: "pointer", transition: "all 0.15s", borderRadius: "2px",
                }}>
                {cond.label}
              </button>
            );
          })}
        </div>
        {/* Wyczerpanie */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.8rem", paddingTop: "0.6rem", borderTop: "1px solid rgba(128,128,128,0.12)" }}>
          <span style={{ ...LABEL_SM, flexShrink: 0 }}>Wyczerpanie</span>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {[0, 1, 2, 3, 4, 5, 6].map(level => {
              const current = (char.conditions || {}).exhaustion || 0;
              const filled = level > 0 && level <= current;
              return (
                <button key={level}
                  onClick={() => setChar(c => ({ ...c, conditions: { ...(c.conditions || {}), exhaustion: level === current ? 0 : level } }))}
                  style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${filled ? "#cc5020" : "var(--pip-empty)"}`, background: filled ? "rgba(200,80,32,0.3)" : "transparent", cursor: "pointer", fontFamily: "Cinzel,serif", fontSize: "0.46rem", fontWeight: 700, color: filled ? "#ee7040" : "var(--text-dim)", lineHeight: 1 }}>
                  {level === 0 ? "✓" : level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Biegłości (Proficiencies) ── */}
      <div className="card">
        <div className="sect-label">Biegłości</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {[
            ["weapons",  "Bronie"],
            ["armor",    "Zbroje"],
            ["languages","Języki"],
            ["tools",    "Narzędzia i inne"],
          ].map(([key, label]) => (
            <div key={key}>
              <div style={LABEL}>{label}</div>
              <textarea className="g-textarea" rows={2}
                placeholder={`np. ${key === "weapons" ? "broń prosta, długi miecz" : key === "armor" ? "lekka, średnia, tarcze" : key === "languages" ? "wspólny, elficki" : "zestaw gier, instrumenty"}`}
                value={(char.proficiencies || {})[key] || ""}
                onChange={e => setChar(c => ({ ...c, proficiencies: { ...(c.proficiencies || {}), [key]: e.target.value } }))}
                style={{ fontSize: "0.9rem", minHeight: "2.5rem" }}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wygląd ── */}
      <div className="card">
        <div className="sect-label">Wygląd</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
          {[
            ["age",    "Wiek",    "np. 25 lat"],
            ["height", "Wzrost",  "np. 178 cm"],
            ["weight", "Waga",    "np. 75 kg"],
            ["eyes",   "Oczy",    "np. niebieskie"],
            ["skin",   "Skóra",   "np. oliwkowa"],
            ["hair",   "Włosy",   "np. ciemne"],
          ].map(([key, label, ph]) => (
            <div key={key}>
              <div style={LABEL}>{label}</div>
              <input className="iedit" style={{ fontSize: "0.88rem" }}
                value={(char.appearance || {})[key] || ""} placeholder={ph}
                onChange={e => setChar(c => ({ ...c, appearance: { ...(c.appearance || {}), [key]: e.target.value } }))}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cechy osobowości ── */}
      <div className="card">
        <div className="sect-label">Cechy osobowości</div>
        <div className="trait-grid">
          {[
            ["personality", "Cechy charakteru", "Jak Twoja postać się zachowuje…"],
            ["ideals",      "Ideały",            "W co wierzy i jakimi zasadami…"],
            ["bonds",       "Więzi",             "Co łączy Twoją postać ze światem…"],
            ["flaws",       "Wady i słabości",   "Największe skazy i słabości…"],
          ].map(([key, label, ph]) => (
            <div key={key} className="trait-block">
              <span className="trait-label">{label}</span>
              <textarea className="trait-ta" rows={3} placeholder={ph} value={char.traits?.[key] || ""}
                onChange={e => setChar(c => ({ ...c, traits: { ...(c.traits || {}), [key]: e.target.value } }))}/>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="sect-label">Notatki osobiste</div>
        <textarea className="g-textarea" rows={4} placeholder="Wskazówki MG, przypomnienia, cele drużynowe…" value={char.personalNotes || ""} onChange={e => upd("personalNotes", e.target.value)}/>
      </div>

      <div className="card">
        <div className="sect-label">Historia postaci</div>
        <textarea className="g-textarea" rows={6} placeholder="Skąd pochodzi Twój bohater?…" value={char.backstory || ""} onChange={e => upd("backstory", e.target.value)}/>
      </div>
    </>
  );
}
