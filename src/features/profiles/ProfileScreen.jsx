import { useState } from 'react';
import { STAT_KEYS, DND_CLASSES, STAT_ARRAYS } from '../../constants/gameConstants';
import { clamp, statMod } from '../../utils/math';
import { THEMES } from '../../theme/themes';
import { useT } from '../../i18n/translations';

export function ProfileScreen({ profiles, activeId, onSelect, onCreate, onDelete, onCreateSample, onRename, theme }) {
  const t = THEMES[theme] || THEMES.pergamin;
  const T = useT();
  const P = T.PROFILES;

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState("");

  const startEdit = (e, p) => { e.stopPropagation(); setEditingId(p.id); setEditName(p.name || ""); };
  const commitEdit = (id) => { const trimmed = editName.trim(); if (trimmed && onRename) onRename(id, trimmed); setEditingId(null); };

  return (
    <div className="profile-screen">
      <div className="profile-logo">⚔ Hero Journal</div>
      <div className="profile-tagline">{P.tagline}</div>

      <div className="profile-list">
        {profiles.map(p => (
          <button key={p.id}
            className={`profile-card${p.id === activeId ? " active-profile" : ""}`}
            aria-label={`${p.name || P.unnamed}${p.id === activeId ? " ("+P.active+")" : ""}`}
            onClick={() => editingId !== p.id && onSelect(p.id)}>

            <span className="profile-card-icon">{DND_CLASSES.find(c => c.name === p.class)?.icon || "⚔️"}</span>

            <div style={{ flex:1, minWidth:0 }}>
              {editingId === p.id ? (
                <input autoFocus value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => commitEdit(p.id)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commitEdit(p.id); } if (e.key === "Escape") setEditingId(null); }}
                  onClick={e => e.stopPropagation()}
                  style={{ fontFamily:"Cinzel,serif", fontSize:"0.95rem", fontWeight:700, color:t.text, background:"transparent", border:"none", borderBottom:`1px solid ${t.accent}`, outline:"none", width:"100%", padding:"0.1rem 0" }}/>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                  <div className="profile-card-name">{p.name || P.unnamed}</div>
                  {onRename && (
                    <button onClick={e => startEdit(e, p)} title={P.renameTitle}
                      style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:"0.7rem", color:t.textDim, padding:"0", lineHeight:1, opacity:0.5, transition:"opacity 0.15s", flexShrink:0 }}
                      onMouseEnter={e => e.currentTarget.style.opacity="1"}
                      onMouseLeave={e => e.currentTarget.style.opacity="0.5"}>✎</button>
                  )}
                </div>
              )}
              <div className="profile-card-sub">
                {[p.class, p.level && `${P.levelLabel} ${p.level}`].filter(Boolean).join(" · ")}
                {p.id === activeId && (
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.1em", textTransform:"uppercase", color:t.accent, marginLeft:"0.6rem" }}>{P.active}</span>
                )}
              </div>
            </div>

            {profiles.length > 1 && editingId !== p.id && (
              <button className="profile-card-del" onClick={e => { e.stopPropagation(); onDelete(p.id); }}>✕</button>
            )}
          </button>
        ))}
      </div>

      <button className="btn-new-profile" onClick={onCreate}>{P.createNew}</button>

      {onCreateSample && (
        <button onClick={onCreateSample}
          style={{ width:"100%", maxWidth:"440px", fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", color:t.textMuted, border:`1px dashed ${t.border}`, padding:"0.6rem 1.5rem", cursor:"pointer", marginTop:"0.6rem", transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentBorder; e.currentTarget.style.color = t.textLabel; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}>
          {P.createSample}
        </button>
      )}

      <div style={{ marginTop:"1.5rem", fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.1em", color:t.textDim, textTransform:"uppercase", textAlign:"center" }}>
        {P.heroCount(profiles.length)}
      </div>
    </div>
  );
}

export function HeroWizard({ onFinish, onCancel, theme }) {
  const t = THEMES[theme] || THEMES.pergamin;
  const T = useT();
  const P = T.PROFILES;
  const C = T.CHAR;

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [cls, setCls] = useState(null);
  const [level, setLevel] = useState(1);
  const [bg, setBg] = useState("");
  const [align, setAlign] = useState("");
  const [statArray, setStatArray] = useState("Zestaw standardowy");
  const [customStats, setCustomStats] = useState({ STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10 });
  const [useCustom, setUseCustom] = useState(false);
  const [appearance, setAppearance] = useState({ age:"", height:"", weight:"", eyes:"", skin:"", hair:"" });
  const [traits, setTraits] = useState({ personality:"", ideals:"", bonds:"", flaws:"" });

  const STEPS = P.stepNames;
  const stats = useCustom ? customStats : (STAT_ARRAYS[statArray] || STAT_ARRAYS["Zestaw standardowy"]);
  const canNext = [name.trim().length > 0, cls !== null, true, true, true, true][step];

  const handleFinish = () => {
    const id = "profile_" + Date.now();
    const newChar = {
      name: name.trim(), race: "", classes: [{ name: cls?.name || "Poszukiwacz przygód", level }],
      stats: { ...stats }, profBonus: 2, hp: { current: 10, max: 10, temp: 0 }, ac: 10,
      initiativeBonus: undefined, savingThrows: {}, savingThrowExp: {}, savingThrowOverride: {},
      passivePerceptionOverride: undefined, skillDCOverride: undefined, spellAttackOverride: undefined,
      skills: {}, skillExp: {}, alignment: align, background: bg.trim(),
      traits,
      personalNotes:"", backstory:"", spellSlots:{}, spellcastingAbility:"INT",
      hitDice:{ type:"d8", max:1, used:0 }, xp:0, speed:30,
      coins:{ gold:0, silver:0, copper:0 },
      appearance,
      conditions:{}, proficiencies:{ weapons:"", armor:"", languages:"", tools:"" },
      deathSaves:{ successes:0, failures:0 },
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
          {STEPS.map((s, i) => <div key={s} className={`wizard-dot${i <= step ? " active" : ""}`}/>)}
        </div>
        <div className="wizard-title">{P.wizardTitle}</div>
        <div className="wizard-sub">{STEPS[step]} — {P.step} {step + 1} {P.of} {STEPS.length}</div>

        {step === 0 && (
          <>
            <div className="wizard-step-label">{P.nameQuestion}</div>
            <input autoFocus style={inputStyle} placeholder={P.namePh}
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}/>
            <div style={{ marginTop:"0.6rem", fontFamily:"Crimson Text,serif", fontSize:"0.9rem", color:t.textDim, fontStyle:"italic" }}>
              {P.nameHint}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="wizard-step-label">{P.classQuestion}</div>
            <div className="wizard-class-grid">
              {DND_CLASSES.map(c => (
                <button key={c.name} className={`wizard-class-btn${cls?.name === c.name ? " selected" : ""}`} onClick={() => setCls(c)}>
                  <span className="wizard-class-icon">{c.icon}</span>
                  <span className="wizard-class-name">{c.name}</span>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginTop:"0.4rem" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.14em", color:t.textLabel, textTransform:"uppercase" }}>{P.levelLabel2}</span>
              <input type="number" min={1} max={20} value={level}
                onChange={e => setLevel(clamp(parseInt(e.target.value) || 1, 1, 20))}
                style={{ ...inputStyle, width:64, textAlign:"center", fontFamily:"Cinzel,serif", fontSize:"1rem" }}/>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="wizard-step-label">{P.attrQuestion}</div>
            <div style={{ display:"flex", gap:"0.4rem", marginBottom:"0.8rem", flexWrap:"wrap" }}>
              {Object.keys(STAT_ARRAYS).map(arr => (
                <button key={arr}
                  style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:`1px solid ${!useCustom && statArray === arr ? t.accent : t.borderInput}`, color:!useCustom && statArray === arr ? t.accent : t.textMuted, padding:"0.3rem 0.7rem", cursor:"pointer" }}
                  onClick={() => { setStatArray(arr); setUseCustom(false); }}>{arr}</button>
              ))}
              <button
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:`1px solid ${useCustom ? t.accent : t.borderInput}`, color:useCustom ? t.accent : t.textMuted, padding:"0.3rem 0.7rem", cursor:"pointer" }}
                onClick={() => setUseCustom(true)}>{P.custom}</button>
            </div>
            <div className="wizard-stat-grid">
              {STAT_KEYS.map(k => (
                <div key={k} className="wizard-stat-box">
                  <span className="wizard-stat-label">{k}</span>
                  {useCustom
                    ? <input type="number" min={0} max={30} value={customStats[k]}
                        onChange={e => setCustomStats(s => ({ ...s, [k]: parseInt(e.target.value) ?? 0 }))}
                        onFocus={e => e.target.select()}
                        style={{ background:"transparent", border:"none", outline:"none", fontFamily:"Cinzel,serif", fontSize:"1.1rem", fontWeight:700, color:t.accent, textAlign:"center", width:"100%" }}/>
                    : <span className="wizard-stat-val">{stats[k]}</span>
                  }
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.55rem", color:t.textMuted }}>{statMod(stats[k])}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="wizard-step-label">{P.bgQuestion}</div>
            <input style={{ ...inputStyle, marginBottom:"0.6rem" }} placeholder={P.bgPh}
              value={bg} onChange={e => setBg(e.target.value)}/>
            <div className="wizard-step-label">{P.alignQuestion}</div>
            <input style={{ ...inputStyle, marginBottom:"0.6rem" }} maxLength={8}
              placeholder={P.alignPh}
              value={align} onChange={e => setAlign(e.target.value)}/>
            <div style={{ fontFamily:"Crimson Text,serif", fontSize:"0.9rem", color:t.textDim, fontStyle:"italic", marginTop:"0.5rem", lineHeight:1.6 }}>
              {P.readyHint}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="wizard-step-label">{P.appearanceQuestion}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              {[
                ["age", C.age, C.agePh],
                ["height", C.height, C.heightPh],
                ["weight", C.weight, C.weightPh],
                ["eyes", C.eyes, C.eyesPh],
                ["skin", C.skin, C.skinPh],
                ["hair", C.hair, C.hairPh],
              ].map(([key, label, ph]) => (
                <div key={key}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.16em", textTransform:"uppercase", color:t.textLabel, marginBottom:"0.2rem" }}>{label}</div>
                  <input style={inputStyle} placeholder={ph} value={appearance[key]||""}
                    onChange={e => setAppearance(a => ({ ...a, [key]: e.target.value }))}/>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="wizard-step-label">{P.personalityQuestion}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {[
                ["personality", C.persTraits, C.persPh],
                ["ideals", C.ideals, C.idealsPh],
                ["bonds", C.bonds, C.bondsPh],
                ["flaws", C.flaws, C.flawsPh],
              ].map(([key, label, ph]) => (
                <div key={key}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.16em", textTransform:"uppercase", color:t.textLabel, marginBottom:"0.2rem" }}>{label}</div>
                  <textarea
                    style={{ ...inputStyle, resize:"vertical", minHeight:"3rem", lineHeight:1.55 }}
                    placeholder={ph} value={traits[key]||""}
                    onChange={e => setTraits(tr => ({ ...tr, [key]: e.target.value }))}/>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"1.5rem", gap:"0.6rem" }}>
          <button onClick={step === 0 ? onCancel : () => setStep(s => s - 1)}
            style={{ fontFamily:"Cinzel,serif", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:`1px solid ${t.borderInput}`, color:t.textMuted, padding:"0.5rem 1rem", cursor:"pointer", flex:"0 0 auto" }}>
            {step === 0 ? P.cancel : P.back}
          </button>
          {step < STEPS.length - 1
            ? <button disabled={!canNext} onClick={() => setStep(s => s + 1)}
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", background:canNext?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${canNext?t.accent:t.borderInput}`, color:canNext?t.accent:t.textDim, padding:"0.5rem 1.5rem", cursor:canNext?"pointer":"default", flex:1 }}>
                {P.next}
              </button>
            : <button onClick={handleFinish}
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"rgba(226,185,78,0.12)", border:`1px solid ${t.accent}`, color:t.accent, padding:"0.5rem 1.5rem", cursor:"pointer", flex:1 }}>
                {P.start}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
