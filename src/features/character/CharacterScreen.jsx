import { useState, useCallback } from 'react';
import { clamp, numMod } from '../../utils/math';
import { SAVING_THROWS, GENERIC_SKILLS, ALIGNMENTS, ITEM_ICONS, SPELL_SLOT_LABELS } from '../../constants/gameConstants';
import { StatBox, SkillPips, Toggle, RestModal, SpellSlotsWidget } from '../../shared/ui';

const hpBarColor = pct => pct > 70 ? "linear-gradient(90deg,#1a5a1a,#2a8a2a,#33aa33)" : pct > 35 ? "linear-gradient(90deg,#7a4a10,#cc7020,#e08030)" : "linear-gradient(90deg,#3a0a0a,#6b0f0f,#961a1a)";
const hpNumColor = pct => pct > 70 ? "#3a9a3a" : pct > 35 ? "#c06010" : "#c03030";

export default function CharacterScreen({ char, setChar, inventory, skills, spells }) {
  const upd   = (f, v) => setChar(c => ({ ...c, [f]: v }));
  const updSt = (s, v) => setChar(c => ({ ...c, stats: { ...c.stats, [s]: v } }));
  const hpPct = Math.round(clamp((char.hp.current / char.hp.max) * 100, 0, 100));
  const pb    = char.profBonus || 2;
  const [restModal, setRestModal] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if ((inventory || []).some(i => i.equipped)) return "items";
    if ((skills || []).some(s => s.inUse)) return "skills";
    return "spells";
  });

  const equippedItems = (inventory || []).filter(i => i.equipped);
  const activeSkills  = (skills || []).filter(s => s.inUse);
  const activeSpells  = (spells || []).filter(s => s.inUse);
  const hasActive     = equippedItems.length || activeSkills.length || activeSpells.length;

  const cycleSave = useCallback(key => setChar(c => {
    const wasP = !!(c.savingThrows || {})[key]; const wasE = !!(c.savingThrowExp || {})[key];
    if (!wasP && !wasE) return { ...c, savingThrows: { ...(c.savingThrows || {}), [key]: true }, savingThrowExp: { ...(c.savingThrowExp || {}), [key]: false } };
    if (wasP && !wasE)  return { ...c, savingThrows: { ...(c.savingThrows || {}), [key]: true }, savingThrowExp: { ...(c.savingThrowExp || {}), [key]: true } };
    const s2 = { ...(c.savingThrows || {}) }; delete s2[key];
    const e2 = { ...(c.savingThrowExp || {}) }; delete e2[key];
    return { ...c, savingThrows: s2, savingThrowExp: e2 };
  }), [setChar]);

  const cycleSkill = useCallback(key => setChar(c => {
    const wasP = !!(c.skills || {})[key]; const wasE = !!(c.skillExp || {})[key];
    if (!wasP && !wasE) return { ...c, skills: { ...(c.skills || {}), [key]: true }, skillExp: { ...(c.skillExp || {}), [key]: false } };
    if (wasP && !wasE)  return { ...c, skills: { ...(c.skills || {}), [key]: true }, skillExp: { ...(c.skillExp || {}), [key]: true } };
    const s2 = { ...(c.skills || {}) }; delete s2[key];
    const e2 = { ...(c.skillExp || {}) }; delete e2[key];
    return { ...c, skills: s2, skillExp: e2 };
  }), [setChar]);

  return (
    <>
      {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={() => setRestModal(null)}/>}

      <div className="card">
        <div className="sect-label">Bohater</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.8rem" }}>
          {(char.classes || []).map((cls, i) => (
            <div key={i} className="class-row" style={{ alignItems: "baseline", gap: "0.4rem" }}>
              <input className="iedit flex1" style={{ fontFamily: "Cinzel,serif", fontSize: i === 0 ? "1.15rem" : "0.95rem", fontWeight: 700, letterSpacing: "0.03em" }}
                value={cls.name} placeholder={`Klasa ${i + 1}…`}
                onChange={e => setChar(c => { const cl = [...c.classes]; cl[i] = { ...cl[i], name: e.target.value }; return { ...c, classes: cl }; })}/>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.14em", opacity: 0.45, flexShrink: 0, textTransform: "uppercase" }}>Poz.</span>
              <input type="number" className="iedit" style={{ width: 32, textAlign: "center", fontFamily: "Cinzel,serif", fontSize: i === 0 ? "1rem" : "0.88rem", fontWeight: 600, opacity: 0.85 }}
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 1fr", gap: "0.6rem", alignItems: "end" }}>
          <div>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Przeszłość</div>
            <input className="iedit" style={{ fontSize: "0.9rem" }} value={char.background || ""} onChange={e => upd("background", e.target.value)} placeholder="Przeszłość postaci…"/>
          </div>
          <div>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Premia z Biegłości</div>
            <input type="number" className="iedit" style={{ textAlign: "center", fontFamily: "Cinzel,serif", fontSize: "0.95rem" }} value={pb} onChange={e => upd("profBonus", parseInt(e.target.value) || 2)}/>
          </div>
          <div>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Charakter</div>
            <select className="g-select" value={char.alignment || "Bezwzględnie neutralny"} onChange={e => upd("alignment", e.target.value)} style={{ fontSize: "0.78rem", padding: "0.3rem 0.5rem" }}>
              {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <hr className="inner-divider" data-label="Cechy — Kliknij, aby edytować modyfikator rzutu obronnego (ST)" style={{ marginTop: "1.1rem" }}/>
        <div className="stat-grid-6" style={{ marginTop: "0.8rem" }}>
          {SAVING_THROWS.map(st => {
            const prz = !!(char.savingThrows || {})[st.key];
            const exp = !!(char.savingThrowExp || {})[st.key];
            const base = Math.floor((char.stats[st.attr] - 10) / 2);
            const auto = exp ? base + pb * 2 : prz ? base + pb : base;
            const over = (char.savingThrowOverride || {})[st.key];
            const stVal = over !== undefined ? over : auto;
            const stColor = exp ? "var(--spell-accent)" : prz ? "#c9a84c" : "inherit";
            return (
              <div key={st.key} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <StatBox label={st.attr} value={char.stats[st.attr]} onChange={v => updSt(st.attr, v)}/>
                <div className="stat-box" onClick={() => cycleSave(st.key)}
                  style={{ borderTop: "none", textAlign: "center", padding: "0.25rem 0.1rem 0.2rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.44rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.45, lineHeight: 1 }}>ST</span>
                  <input type="number" value={stVal}
                    title={over !== undefined ? "Wartość ręczna — kliknij dwukrotnie, aby zresetować" : "Wartość automatyczna — kliknij dwukrotnie, aby zresetować"}
                    style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.85rem", fontWeight: 700, color: stColor, textAlign: "center", width: "100%", padding: "0.15rem 0", lineHeight: 1, display: "block" }}
                    onChange={e => { const n = parseInt(e.target.value); setChar(c => ({ ...c, savingThrowOverride: { ...(c.savingThrowOverride || {}), [st.key]: isNaN(n) ? undefined : n } })); }}
                    onDoubleClick={e => { e.stopPropagation(); setChar(c => { const o = { ...(c.savingThrowOverride || {}) }; delete o[st.key]; return { ...c, savingThrowOverride: o }; }); }}/>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="inner-divider" data-label="Żywotność i Walka" style={{ marginTop: "1.1rem" }}/>
        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "34px auto 34px 1fr 1fr 1fr", gap: "0.35rem", alignItems: "stretch" }}>
          <button className="btn-pm minus" style={{ height: "100%", minHeight: 52 }}
            onClick={() => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(c.hp.current - 1, 0, c.hp.max) } }))}>−</button>
          <div className="combat-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.2rem 0.3rem", gap: 0 }}>
            <span className="combat-box-label">PŻ (HP)</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.15rem" }}>
              <input type="number" value={char.hp.current}
                style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", textAlign: "center", fontSize: "1.3rem", fontWeight: 700, width: 40, color: hpNumColor(hpPct), transition: "color 0.5s" }}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, current: e.target.value === "" ? 0 : clamp(parseInt(e.target.value) || 0, 0, c.hp.max) } }))}
                onBlur={e => setChar(c => ({ ...c, hp: { ...c.hp, current: clamp(parseInt(e.target.value) || 0, 0, c.hp.max) } }))}/>
              <span style={{ color: "inherit", opacity: 0.35, fontSize: "0.8rem" }}>/</span>
              <input type="number" value={char.hp.max}
                style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", textAlign: "center", fontSize: "0.85rem", width: 34, opacity: 0.6 }}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({ ...c, hp: { ...c.hp, max: e.target.value === "" ? 1 : Math.max(1, parseInt(e.target.value) || 1) } }))}
                onBlur={e => setChar(c => ({ ...c, hp: { ...c.hp, max: Math.max(1, parseInt(e.target.value) || 1) } }))}/>
            </div>
          </div>
          <button className="btn-pm plus" style={{ height: "100%", minHeight: 52 }}
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
          <div className="combat-box" title="Modyfikator Zręczności — edytuj, aby nadpisać">
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem", marginTop: "0.6rem", alignItems: "stretch" }}>
          <div className="combat-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.3rem 0.6rem", gap: "0.15rem" }}>
            <span className="combat-box-label">Kości Wytrzymałości</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <select className="combat-box-input" style={{ width: "auto", cursor: "pointer", fontSize: "0.78rem" }}
                value={(char.hitDice || { type: "d8" }).type}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...(c.hitDice || { type: "d8", max: 1, used: 0 }), type: e.target.value } }))}>
                {["d4", "d6", "d8", "d10", "d12"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="number" min={0} value={(char.hitDice || { used: 0 }).used || 0}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...(c.hitDice || { type: "d8", max: 1, used: 0 }), used: parseInt(e.target.value) || 0 } }))}
                style={{ width: 32, background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.95rem", fontWeight: 700, textAlign: "center", color: "inherit" }}/>
              <span style={{ fontSize: "0.65rem", opacity: 0.4 }}>/</span>
              <input type="number" min={1} value={(char.hitDice || { max: 1 }).max || 1}
                onChange={e => setChar(c => ({ ...c, hitDice: { ...(c.hitDice || { type: "d8", max: 1, used: 0 }), max: parseInt(e.target.value) || 1 } }))}
                style={{ width: 32, background: "transparent", border: "none", borderBottom: "1px dashed currentColor", outline: "none", fontFamily: "Cinzel,serif", fontSize: "0.95rem", textAlign: "center", color: "inherit", opacity: 0.7 }}/>
            </div>
          </div>
          <button className="btn-rest short" onClick={() => setRestModal("short")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.1rem", padding: "0.4rem 0.5rem" }}>
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>☽</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3 }}>Krótki odp.</span>
          </button>
          <button className="btn-rest long" onClick={() => setRestModal("long")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.1rem", padding: "0.4rem 0.5rem" }}>
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>☀</span>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Długi odp.</span>
          </button>
        </div>

        <hr className="inner-divider" data-label="Umiejętności" style={{ marginTop: "1.1rem" }}/>
        <div style={{ marginTop: "0.6rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.3rem" }}>
          {GENERIC_SKILLS.map(sk => {
            const prz = !!(char.skills || {})[sk.key];
            const exp = !!(char.skillExp || {})[sk.key];
            const base = Math.floor((char.stats[sk.attr] - 10) / 2);
            const bonus = exp ? base + pb * 2 : prz ? base + pb : base;
            const pipColor = exp ? "#64c8e0" : prz ? "#c9a84c" : "transparent";
            const pipBorder = exp ? "2px solid #64c8e0" : prz ? "1.5px solid #c9a84c" : "1.5px solid #5a4a28";
            const pipClip = exp ? "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" : "none";
            const statColor = exp ? "#64c8e0" : prz ? "#c9a84c" : "inherit";
            return (
              <div key={sk.key} className={`stat-box${exp ? " stat-box-exp" : prz ? " stat-box-prz" : ""}`}
                onClick={() => cycleSkill(sk.key)}
                style={{ position: "relative", cursor: "pointer", padding: "0.35rem 0.25rem 0.3rem", textAlign: "center", minHeight: 0, userSelect: "none" }}>
                <div style={{ position: "absolute", top: "0.22rem", right: "0.22rem", width: 10, height: 10, borderRadius: "50%", border: pipBorder, background: pipColor, clipPath: pipClip, boxShadow: exp ? "0 0 4px rgba(100,200,224,0.5)" : prz ? "0 0 4px rgba(201,168,76,0.5)" : "none", transition: "all 0.15s", pointerEvents: "none" }}/>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.42rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55, display: "block", marginBottom: "0.15rem", lineHeight: 1.2, paddingRight: "0.7rem" }}>{sk.label}</span>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.9rem", fontWeight: 700, color: statColor, display: "block", lineHeight: 1 }}>{numMod(bonus)}</span>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.38rem", opacity: 0.35, display: "block", marginTop: "0.1rem" }}>{sk.attr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {hasActive > 0 && (
        <div className="card">
          <div className="sect-label">Aktywne i wyposażone</div>
          <div className="subtab-bar">
            {equippedItems.length > 0 && <button className={`subtab-btn${activeTab === "items" ? " active" : ""}`} onClick={() => setActiveTab("items")}>Przedmioty ({equippedItems.length})</button>}
            {activeSkills.length > 0 && <button className={`subtab-btn${activeTab === "skills" ? " active" : ""}`} onClick={() => setActiveTab("skills")}>Zdolności ({activeSkills.length})</button>}
            <button className={`subtab-btn${activeTab === "spells" ? " active" : ""}`} onClick={() => setActiveTab("spells")}>Czary{activeSpells.length > 0 ? ` (${activeSpells.length})` : ""}</button>
          </div>
          {activeTab === "items" && (equippedItems.length === 0
            ? <div className="empty-state" style={{ padding: "1.5rem" }}>Brak wyposażonych przedmiotów.</div>
            : equippedItems.map(item => (
              <div key={item.id} className="equipped-item">
                <span className="equipped-icon">{ITEM_ICONS[item.type] || "◈"}</span>
                <div className="flex1">
                  <div className="row" style={{ gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                    <span className="equipped-name">{item.name}</span>
                    <span className="equipped-type-badge">{item.type}</span>
                    {item.qty && item.qty !== "1" && <span className="equipped-type-badge">×{item.qty}</span>}
                  </div>
                  {item.damage && <div className="equipped-stat">⚔ Obrażenia: {item.damage}{item.damageType ? ` (${item.damageType})` : ""}{item.modifier ? ` · +${parseInt(item.modifier) || 0} do trafienia` : ""}</div>}
                  {!item.damage && item.modifier !== undefined && item.modifier !== "" && <div className="equipped-stat">Modyfikator trafienia: {numMod(parseInt(item.modifier) || 0)}</div>}
                  {item.charges && <div className="equipped-stat">Ładunki: {item.charges}</div>}
                  {item.effect && <div className="equipped-stat" style={{ color: "var(--spell-muted)" }}>{item.effect}</div>}
                  {item.note && <div className="equipped-stat" style={{ fontStyle: "italic", opacity: 0.7 }}>{item.note}</div>}
                </div>
              </div>
            ))
          )}
          {activeTab === "skills" && (activeSkills.length === 0
            ? <div className="empty-state" style={{ padding: "1.5rem" }}>Zaznacz zdolności jako aktywne w zakładce „Zdolności".</div>
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
                  {sk.tags && sk.tags.length > 0 && <div className="equipped-stat" style={{ opacity: 0.55, fontSize: "0.8rem" }}>{sk.tags.join(" · ")}</div>}
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
                          {sp.school && <span className="equipped-spell-badge">Szkoła: {sp.school}</span>}
                        </div>
                        {(sp.castingTime || sp.range || sp.duration) && (
                          <div className="equipped-stat" style={{ color: "var(--spell-muted)" }}>
                            {[sp.castingTime && `⏱ Czas rzucania: ${sp.castingTime}`, sp.range && `↗ Zasięg: ${sp.range}`, sp.duration && `⧗ Czas trwania: ${sp.duration}`].filter(Boolean).join("  ·  ")}
                          </div>
                        )}
                        {sp.components && <div className="equipped-stat" style={{ opacity: 0.6, fontSize: "0.85rem" }}>Komponenty: {sp.components}</div>}
                        {sp.description && <div className="equipped-stat">{sp.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeSpells.length === 0 && <div className="empty-state" style={{ padding: "1rem" }}>Zaznacz czary jako przygotowane w zakładce „Czary".</div>}
            </>
          )}
        </div>
      )}

      <div className="card">
        <div className="sect-label">Cechy osobowości</div>
        <div className="trait-grid">
          {[["personality", "Cechy charakteru", "Jak Twoja postać się zachowuje, co mówi…"],
            ["ideals", "Ideały", "W co wierzy i jakimi zasadami się kieruje…"],
            ["bonds", "Więzi", "Co łączy Twoją postać ze światem lub drużyną…"],
            ["flaws", "Wady i słabości", "Największe skazy i słabości Twojego bohatera…"]
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
        <textarea className="g-textarea" rows={4} placeholder="Wskazówki Mistrza Gry, przypomnienia, cele drużynowe…" value={char.personalNotes || ""} onChange={e => upd("personalNotes", e.target.value)}/>
      </div>

      <div className="card">
        <div className="sect-label">Historia postaci</div>
        <textarea className="g-textarea" rows={6} placeholder="Skąd pochodzi Twój bohater? Co go ukształtowało i czego szuka w świecie?…" value={char.backstory || ""} onChange={e => upd("backstory", e.target.value)}/>
      </div>
    </>
  );
}
