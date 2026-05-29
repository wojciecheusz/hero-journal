import { useState } from 'react';
import { ALIGNMENTS, STAT_KEYS, DND_CLASSES, STAT_ARRAYS } from '../../constants/gameConstants';
import { clamp } from '../../utils/math';
import { THEMES, PALETTES } from '../../theme/themes';

export function ProfileScreen({ profiles, activeId, onSelect, onCreate, onDelete, onCreateSample, onRename, theme }) {
  const t = THEMES[theme] || THEMES.mrok;
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState("");

  const startEdit = (e, p) => {
    e.stopPropagation();
    setEditingId(p.id);
    setEditName(p.name || "");
  };

  const commitEdit = (id) => {
    const trimmed = editName.trim();
    if (trimmed && onRename) onRename(id, trimmed);
    setEditingId(null);
  };

  return (
    <div className="profile-screen">
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <button
          onClick={() => { const idx = PALETTES.indexOf(theme); const next = PALETTES[(idx + 1) % PALETTES.length]; localStorage.setItem("hj_theme", JSON.stringify(next)); window.location.reload(); }}
          style={{ background: "transparent", border: `1px solid ${t.borderInput}`, color: t.textMuted, fontFamily: "Cinzel,serif", fontSize: "0.55rem", letterSpacing: "0.1em", padding: "0.2rem 0.5rem", cursor: "pointer", textTransform: "uppercase" }}>
          Zmień motyw
        </button>
      </div>

      <div className="profile-logo">⚔ Hero Journal</div>
      <div className="profile-tagline">Wybierz postać bohatera, aby kontynuować kampanię RPG</div>

      <div className="profile-list">
        {profiles.map(p => (
          <div key={p.id}
            className={`profile-card${p.id === activeId ? " active-profile" : ""}`}
            onClick={() => editingId !== p.id && onSelect(p.id)}>

            <span className="profile-card-icon">
              {DND_CLASSES.find(c => c.name === p.class)?.icon || "⚔️"}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              {editingId === p.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => commitEdit(p.id)}
                  onKeyDown={e => {
                    if (e.key === "Enter") { e.preventDefault(); commitEdit(p.id); }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={e => e.stopPropagation()}
                  style={{ fontFamily: "Cinzel,serif", fontSize: "0.95rem", fontWeight: 700, color: t.text, background: "transparent", border: "none", borderBottom: `1px solid ${t.accent}`, outline: "none", width: "100%", padding: "0.1rem 0" }}/>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div className="profile-card-name">{p.name || "Bezimienny Bohater"}</div>
                  {onRename && (
                    <button
                      onClick={e => startEdit(e, p)}
                      title="Zmień imię bohatera"
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "0.7rem", color: t.textDim, padding: "0", lineHeight: 1, opacity: 0.5, transition: "opacity 0.15s", flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}>
                      ✎
                    </button>
                  )}
                </div>
              )}
              <div className="profile-card-sub">
                {[p.class, p.level && `Poziom ${p.level}`].filter(Boolean).join(" · ")}
                {p.id === activeId && (
                  <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, marginLeft: "0.6rem" }}>● Aktywny</span>
                )}
              </div>
            </div>

            {profiles.length > 1 && editingId !== p.id && (
              <button className="profile-card-del" onClick={e => { e.stopPropagation(); onDelete(p.id); }}>✕</button>
            )}
          </div>
        ))}
      </div>

      <button className="btn-new-profile" onClick={onCreate}>
        ⊕ Stwórz Nowego Bohatera
      </button>

      {onCreateSample && (
        <button
          onClick={onCreateSample}
          style={{
            width: "100%", maxWidth: "440px",
            fontFamily: "Cinzel,serif", fontSize: "0.6rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            background: "transparent",
            color: t.textMuted,
            border: `1px dashed ${t.border}`,
            padding: "0.6rem 1.5rem",
            cursor: "pointer", marginTop: "0.6rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentBorder; e.currentTarget.style.color = t.textLabel; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}>
          ✦ Stwórz przykładowego bohatera
        </button>
      )}

      <div style={{ marginTop: "1.5rem", fontFamily: "Cinzel,serif", fontSize: "0.5rem", letterSpacing: "0.1em", color: t.textDim, textTransform: "uppercase", textAlign: "center" }}>
        {profiles.length} {profiles.length === 1 ? "heros" : "herosów"} w dzienniku
      </div>
    </div>
  );
}

export function PostaćWizard({ onFinish, onAnuluj, theme }) {
  const t = THEMES[theme] || THEMES.mrok;
  const [krok, setStep] = useState(0);
  const [name, setImie] = useState("");
  const [cls, setCls] = useState(null);
  const [level, setPoziom] = useState(1);
  const [bg, setBg] = useState("");
  const [align, setAlign] = useState("Bezwzględnie neutralny");
  const [statArray, setStatArray] = useState("Zestaw standardowy");
  const [customCechy, setWlasneCechy] = useState({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
  const [useWlasne, setUseWlasne] = useState(false);

  const STEPS = ["Imię", "Klasa", "Atrybuty", "Przeszłość i charakter"];
  const stats = useWlasne ? customCechy : (STAT_ARRAYS[statArray] || STAT_ARRAYS["Zestaw standardowy"]);
  const statMod = v => { const m = Math.floor((v - 10) / 2); return m >= 0 ? `+${m}` : String(m); };

  const canNext = [name.trim().length > 0, cls !== null, true, true][krok];

  const handleFinish = () => {
    const id = "profile_" + Date.now();
    const newChar = {
      name: name.trim(), classes: [{ name: cls?.name || "Poszukiwacz przygód", level }],
      stats: { ...stats }, profBonus: 2, hp: { current: 10, max: 10, temp: 0 }, ac: 10,
      initiativeBonus: undefined, savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
      skills: {}, skillExp: {}, alignment: align, background: bg.trim(),
      traits: { personality: "", ideals: "", bonds: "", flaws: "" },
      personalNotes: "", backstory: "", spellSlots: {}, spellcastingAbility: "INT",
      hitDice: { type: "d8", max: 1, used: 0 }, xp: 0,
      speed: 30,
      coins: { gold: 0, silver: 0, copper: 0 },
      appearance: { age: "", height: "", weight: "", eyes: "", skin: "", hair: "" },
      conditions: {}, proficiencies: { weapons: "", armor: "", languages: "", tools: "" },
      deathSaves: { successes: 0, failures: 0 },
    };
    onFinish(id, newChar, { name: name.trim(), class: cls?.name || "", level, created: Date.now() });
  };

  const inputStyle = {
    background: t.bgInput, border: `1px solid ${t.borderInput}`, color: t.text,
    fontFamily: "Crimson Text,Georgia,serif", fontSize: "1.05rem",
    padding: "0.5rem 0.85rem", outline: "none", width: "100%",
  };

  return (
    <div className="wizard-screen">
      <div className="wizard-box">
        <div className="wizard-step-dots">
          {STEPS.map((s, i) => <div key={s} className={`wizard-dot${i <= krok ? " active" : ""}`}/>)}
        </div>
        <div className="wizard-title">Tworzenie Bohatera</div>
        <div className="wizard-sub">{STEPS[krok]} — Krok {krok + 1} z {STEPS.length}</div>

        {krok === 0 && (
          <>
            <div className="wizard-step-label">Jak ma na imię Twój bohater?</div>
            <input autoFocus style={inputStyle} placeholder="Wpisz imię bohatera…"
              value={name} onChange={e => setImie(e.target.value)}
              onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}/>
            <div style={{ marginTop: "0.6rem", fontFamily: "Crimson Text,serif", fontSize: "0.9rem", color: t.textDim, fontStyle: "italic" }}>
              Imię pojawi się w nagłówku dziennika karty.
            </div>
          </>
        )}

        {krok === 1 && (
          <>
            <div className="wizard-step-label">Wybierz klasę postaci</div>
            <div className="wizard-class-grid">
              {DND_CLASSES.map(c => (
                <button key={c.name} className={`wizard-class-btn${cls?.name === c.name ? " selected" : ""}`} onClick={() => setCls(c)}>
                  <span className="wizard-class-icon">{c.icon}</span>
                  <span className="wizard-class-name">{c.name}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.4rem" }}>
              <span style={{ fontFamily: "Cinzel,serif", fontSize: "0.58rem", letterSpacing: "0.14em", color: t.textLabel, textTransform: "uppercase" }}>Poziom (Lvl)</span>
              <input type="number" min={1} max={20} value={level}
                onChange={e => setPoziom(clamp(parseInt(e.target.value) || 1, 1, 20))}
                style={{ ...inputStyle, width: 64, textAlign: "center", fontFamily: "Cinzel,serif", fontSize: "1rem" }}/>
            </div>
          </>
        )}

        {krok === 2 && (
          <>
            <div className="wizard-step-label">Wybierz dystrybucję cech atrybutów</div>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
              {Object.keys(STAT_ARRAYS).map(arr => (
                <button key={arr}
                  style={{ fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${!useWlasne && statArray === arr ? t.accent : t.borderInput}`, color: !useWlasne && statArray === arr ? t.accent : t.textMuted, padding: "0.3rem 0.7rem", cursor: "pointer" }}
                  onClick={() => { setStatArray(arr); setUseWlasne(false); }}>{arr}</button>
              ))}
              <button
                style={{ fontFamily: "Cinzel,serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${useWlasne ? t.accent : t.borderInput}`, color: useWlasne ? t.accent : t.textMuted, padding: "0.3rem 0.7rem", cursor: "pointer" }}
                onClick={() => setUseWlasne(true)}>Ręczne (Własne)</button>
            </div>
            <div className="wizard-stat-grid">
              {STAT_KEYS.map(k => (
                <div key={k} className="wizard-stat-box">
                  <span className="wizard-stat-label">{k}</span>
                  {useWlasne
                    ? <input type="number" min={1} max={30} value={customCechy[k]}
                        onChange={e => setWlasneCechy(s => ({ ...s, [k]: clamp(parseInt(e.target.value) || 10, 1, 30) }))}
                        style={{ background: "transparent", border: "none", outline: "none", fontFamily: "Cinzel,serif", fontSize: "1.1rem", fontWeight: 700, color: t.accent, textAlign: "center", width: "100%" }}/>
                    : <span className="wizard-stat-val">{stats[k]}</span>
                  }
                  <div style={{ fontFamily: "Cinzel,serif", fontSize: "0.55rem", color: t.textMuted }}>{statMod(stats[k])}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {krok === 3 && (
          <>
            <div className="wizard-step-label">Przeszłość bohatera</div>
            <input style={{ ...inputStyle, marginBottom: "0.6rem" }} placeholder="np. Żołnierz, Szlachcic, Mędrzec…"
              value={bg} onChange={e => setBg(e.target.value)}/>
            <div className="wizard-step-label">Charakter moralny</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.3rem", marginBottom: "0.6rem" }}>
              {ALIGNMENTS.map(a => (
                <button key={a}
                  style={{ fontFamily: "Cinzel,serif", fontSize: "0.48rem", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${align === a ? t.accent : t.borderInput}`, color: align === a ? t.accent : t.textMuted, padding: "0.35rem 0.2rem", cursor: "pointer", lineHeight: 1.3, textAlign: "center" }}
                  onClick={() => setAlign(a)}>{a}</button>
              ))}
            </div>
            <div style={{ fontFamily: "Crimson Text,serif", fontSize: "0.9rem", color: t.textDim, fontStyle: "italic", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Twój bohater jest gotowy do drogi. Każdą wartość będziesz mógł swobodnie edytować podczas kampanii.
            </div>
          </>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", gap: "0.6rem" }}>
          <button onClick={krok === 0 ? onAnuluj : () => setStep(s => s - 1)}
            style={{ fontFamily: "Cinzel,serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${t.borderInput}`, color: t.textMuted, padding: "0.5rem 1rem", cursor: "pointer", flex: "0 0 auto" }}>
            {krok === 0 ? "Anuluj" : "← Wstecz"}
          </button>
          {krok < STEPS.length - 1
            ? <button disabled={!canNext} onClick={() => setStep(s => s + 1)}
                style={{ fontFamily: "Cinzel,serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", background: canNext ? "rgba(226,185,78,0.1)" : "transparent", border: `1px solid ${canNext ? t.accent : t.borderInput}`, color: canNext ? t.accent : t.textDim, padding: "0.5rem 1.5rem", cursor: canNext ? "pointer" : "default", flex: 1 }}>
                Dalej →
              </button>
            : <button onClick={handleFinish}
                style={{ fontFamily: "Cinzel,serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(226,185,78,0.12)", border: `1px solid ${t.accent}`, color: t.accent, padding: "0.5rem 1.5rem", cursor: "pointer", flex: 1 }}>
                ⚔ Rozpocznij Przygodę
              </button>
          }
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
