import { useCallback } from 'react';
import { CONDITIONS, XP_THRESHOLDS } from '../constants/gameConstants';
import SettingsMenu from './SettingsMenu';
import Icon from '../shared/icons';
import { clamp, numMod } from '../utils/math';
import { getClassLevelLabel } from '../utils/character';

const mkToggleStyle = (open, color) => ({
  display:"flex", alignItems:"center", gap:"0.3rem",
  padding:"0.22rem 0.5rem",
  background: open ? `${color}1e` : "transparent",
  border: `1px solid ${open ? color + "90" : "var(--hj-border-input)"}`,
  color: open ? color : "var(--hj-text-muted)",
  borderRadius: "var(--radius-sm)", cursor:"pointer",
  fontFamily:"Cinzel,serif", fontSize:"0.47rem",
  letterSpacing:"0.08em", textTransform:"uppercase",
  transition:"all 0.15s", flex:"1 1 0", justifyContent:"center",
  whiteSpace:"nowrap", overflow:"hidden",
});

const LBL = {
  fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.1em",
  textTransform:"uppercase", color:"var(--hj-text-muted)",
  marginBottom:"0.15rem", display:"block",
};

const ieditStyle = {
  fontFamily:"Cinzel,serif", fontSize:"0.72rem", background:"transparent",
  border:"none", borderBottom:"1px dashed var(--hj-border-input)",
  outline:"none", color:"inherit", width:"100%", padding:"0.1rem 0",
};

export default function Header({
  T, theme, setTheme, toggleLanguage, char, tab,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, setShowReset, user, onCloudRefresh, onLogout,
  onExport, onImport,
  setChar, pb, onRestModal,
  panelCollapsed, setPanelCollapsed,
  stanyOpen, setStanyOpen,
  deathOpen, setDeathOpen,
  exhOpen,   setExhOpen,
  moreOpen,  setMoreOpen,
}) {
  const { className, totalLevel } = getClassLevelLabel(char, T.CHAR);
  const C = T.CHAR;

  const hp    = char.hp || { current: 0, max: 1, temp: 0 };
  const hpPct = Math.round(clamp((hp.current / (hp.max || 1)) * 100, 0, 100));
  const hpCol = hpPct > 70 ? "#3a9a3a" : hpPct > 35 ? "#c06010" : "#c03030";

  const wisBonus  = Math.floor(((char.stats?.WIS ?? 10) - 10) / 2);
  const percProf  = !!(char.skills?.perception);
  const percExp   = !!(char.skillExp?.perception);
  const percBonus = percExp ? wisBonus + pb*2 : percProf ? wisBonus + pb : wisBonus;
  const spellAbi  = Math.floor(((char.stats??{})[char.spellcastingAbility||"INT"]||10)-10)/2;
  const spellDC   = 8 + pb + spellAbi;
  const spellAtk  = pb + spellAbi;

  /* ── XP / poziomowanie ── */
  const xp        = char.xp || 0;
  const xpPrev    = XP_THRESHOLDS[totalLevel - 1] || 0;
  const xpNext    = totalLevel < 20 ? XP_THRESHOLDS[totalLevel] : null;
  const xpPct     = xpNext
    ? Math.min(100, Math.max(0, ((xp - xpPrev) / (xpNext - xpPrev)) * 100))
    : 100;

  /* ── Kości wytrzymałości ── */
  const hd         = char.hitDice || { type:"d8", max:1, used:0 };
  const hdPipCount = Math.min(hd.max || 1, 12);

  const ds        = char.deathSaves || { successes: 0, failures: 0 };
  const exhaustion = (char.conditions||{}).exhaustion || 0;

  const adjustHP = delta => setChar(c => {
    const h = c.hp || { current: 0, max: 1, temp: 0 };
    return { ...c, hp: { ...h, current: clamp(h.current + delta, 0, h.max) } };
  });

  const toggleDeath = useCallback((type, idx) => setChar(c => {
    const cur  = (c.deathSaves||{})[type] || 0;
    const next = idx < cur ? idx : idx + 1;
    return { ...c, deathSaves: { ...(c.deathSaves||{}), [type]: Math.min(3, Math.max(0, next)) } };
  }), [setChar]);

  const updAppearance = (key, val) =>
    setChar(c => ({ ...c, appearance: { ...(c.appearance||{}), [key]: val } }));

  return (
    <header className="hj-header">
      <div className="hj-header-inner">

        {/* ── Rząd: logo + imię bohatera + ikony ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>
          <button className="hj-header-brand"
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0,
                     cursor:"pointer", background:"transparent", border:"none", padding:0,
                     color:"inherit", textAlign:"left" }}
            onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero}>
            <div className="hj-logo" style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <Icon name="sword" size="1em"/> HJ
            </div>
            <span className="hj-char-name" style={{ flex:1 }}>{char.name?.trim() || T.UI.hero}</span>
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>
            <button onClick={() => setPanelCollapsed?.(s => !s)}
              title={panelCollapsed ? "Rozwiń" : "Zwiń"}
              style={{ background:"transparent", border:"1px solid var(--hj-border-input)",
                       color:"var(--hj-text-muted)", width:28, height:28, cursor:"pointer",
                       transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={panelCollapsed ? "chevron-down" : "chevron-up"} size="1em"/>
            </button>
            <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}
              style={{ background:showHelp?"rgba(226,185,78,0.1)":"transparent",
                       border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`,
                       color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)",
                       width:28, height:28, cursor:"pointer", transition:"all 0.2s",
                       display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="help-circle" size="1em"/>
            </button>
            <a href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
              aria-label={T.UI.buyBeer}
              style={{ background:"transparent", border:"1px solid var(--hj-border-input)",
                       color:"var(--hj-text-muted)", width:28, height:28,
                       display:"flex", alignItems:"center", justifyContent:"center",
                       textDecoration:"none", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--hj-accent-border)"; e.currentTarget.style.color="var(--hj-accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--hj-border-input)"; e.currentTarget.style.color="var(--hj-text-muted)"; }}>
              <Icon name="beer" size="1em"/>
            </a>
            <div style={{ position:"relative" }}>
              <button onClick={() => setShowSettings(s => !s)}
                style={{ background:showSettings?"rgba(226,185,78,0.1)":"transparent",
                         border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`,
                         color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)",
                         width:28, height:28, cursor:"pointer", transition:"all 0.2s",
                         display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="settings" size="1em"/>
              </button>
              {showSettings && <>
                <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
                <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
                  setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
                  user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
                  onExport={onExport} onImport={onImport}
                  dropdownStyle={{ position:"absolute", top:"calc(100% + 8px)", right:0 }}/>
              </>}
            </div>
          </div>
        </div>

        {!panelCollapsed && (<>

          {/* ── Tożsamość + przycisk Więcej ── */}
          <div className="hj-header-identity" style={{ marginBottom:"2px" }}>
            <div className="hcv2-name">{char.name?.trim() || C.heroName}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.4rem" }}>
              <div className="hcv2-subtitle" style={{ minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{className} · {C.level} {totalLevel}</div>
              <button
                onClick={() => setMoreOpen?.(s => !s)}
                aria-expanded={!!moreOpen}
                style={{ display:"flex", alignItems:"center", gap:"0.2rem", flexShrink:0,
                         fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.1em",
                         textTransform:"uppercase", padding:"0.18rem 0.5rem",
                         background:moreOpen?"rgba(226,185,78,0.08)":"transparent",
                         border:`1px solid ${moreOpen?"var(--hj-accent-border)":"var(--hj-border-input)"}`,
                         color:moreOpen?"var(--hj-accent)":"var(--hj-text-muted)",
                         borderRadius:"var(--radius-sm)", cursor:"pointer", transition:"all 0.15s" }}>
                {moreOpen ? (C.less||"Mniej") : (C.more||"Więcej")}
                <Icon name={moreOpen?"chevron-up":"chevron-down"} size="0.75em"/>
              </button>
            </div>
          </div>

          {/* ── Panel Więcej: rasa, przeszłość, charakter, wygląd ── */}
          {moreOpen && (
            <div style={{ marginTop:"0.3rem", padding:"0.55rem 0.65rem",
                          border:"1px solid var(--hj-border-input)",
                          background:"rgba(255,255,255,0.03)", borderRadius:"var(--radius-md)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.35rem 0.8rem", marginBottom:"0.4rem" }}>
                {[["race",C.race,C.racePh],["background",C.background,C.backgroundPh]].map(([key,label,ph]) => (
                  <div key={key}>
                    <span style={LBL}>{label}</span>
                    <input style={ieditStyle} value={char[key]||""} placeholder={ph}
                      onChange={e => setChar(c => ({...c,[key]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:"0.4rem" }}>
                <span style={LBL}>{C.alignment}</span>
                <input style={{...ieditStyle, maxWidth:100}} value={char.alignment||""} placeholder={C.alignmentPh||"CN, LG…"}
                  onChange={e => setChar(c => ({...c,alignment:e.target.value}))}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.3rem 0.6rem" }}>
                {[["age",C.age,C.agePh],["height",C.height,C.heightPh],["weight",C.weight,C.weightPh],
                  ["eyes",C.eyes,C.eyesPh],["skin",C.skin,C.skinPh],["hair",C.hair,C.hairPh]
                ].map(([key,label,ph]) => (
                  <div key={key}>
                    <span style={LBL}>{label}</span>
                    <input style={ieditStyle} value={(char.appearance||{})[key]||""} placeholder={ph||""}
                      onChange={e => updAppearance(key, e.target.value)}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Pasek PŻ (pełna szerokość) ── */}
          <div style={{ margin:"6px 0 0", background:"rgba(255,255,255,.04)", borderRadius:"var(--radius-md)",
                        padding:"8px 10px", border:"1px solid var(--hj-border)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"3px" }}>
              <span className="vitals-hp-label">PŻ</span>
              <span className="vitals-hp-value">
                <input type="number" className="vitals-hp-current" value={hp.current}
                  style={{ color: hpCol }}
                  onFocus={e => e.target.select()}
                  onChange={e => setChar(c => { const h=c.hp||{current:0,max:1,temp:0}; return {...c,hp:{...h,current:e.target.value===""?0:clamp(parseInt(e.target.value)||0,0,h.max)}}; })}
                  onBlur={e => setChar(c => { const h=c.hp||{current:0,max:1,temp:0}; return {...c,hp:{...h,current:clamp(parseInt(e.target.value)||0,0,h.max)}}; })}/>
                <span className="vitals-hp-sep">/</span>
                <input type="number" min={1} className="vitals-hp-max" value={hp.max}
                  onFocus={e => e.target.select()}
                  onChange={e => setChar(c => { const h=c.hp||{current:0,max:1,temp:0}; return {...c,hp:{...h,max:e.target.value===""?1:Math.max(1,parseInt(e.target.value)||1)}}; })}
                  onBlur={e => setChar(c => { const h=c.hp||{current:0,max:1,temp:0}; return {...c,hp:{...h,max:Math.max(1,parseInt(e.target.value)||1)}}; })}/>
              </span>
            </div>
            <div className="hp-bar-bg" style={{ marginBottom:"6px" }}>
              <div className="hp-bar-fill" style={{ width:`${hpPct}%`, background:hpCol }}/>
            </div>
            <div style={{ display:"flex", gap:"6px" }}>
              <button className="btn-pm minus" aria-label="HP −"
                style={{ flex:1, width:"auto", height:"24px", borderRadius:"var(--radius-sm)" }}
                onClick={() => adjustHP(-1)}>
                <Icon name="minus" size="1em"/>
              </button>
              <button className="btn-pm plus" aria-label="HP +"
                style={{ flex:1, width:"auto", height:"24px", borderRadius:"var(--radius-sm)" }}
                onClick={() => adjustHP(1)}>
                <Icon name="plus" size="1em"/>
              </button>
            </div>
          </div>

          {/* ── Pasek XP ── */}
          <div style={{ margin:"5px 0 0", padding:"5px 10px 6px",
                        background:"rgba(255,255,255,.03)", borderRadius:"var(--radius-sm)",
                        border:"1px solid var(--hj-border-input)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"4px" }}>
              <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.1em",
                             textTransform:"uppercase", color:"var(--hj-text-muted)", flexShrink:0 }}>XP</span>
              <input type="number" min={0}
                value={xp}
                onFocus={e => e.target.select()}
                onChange={e => setChar(c => ({...c, xp: Math.max(0, parseInt(e.target.value)||0)}))}
                style={{ fontFamily:"Cinzel,serif", fontSize:"0.75rem", fontWeight:700,
                         color:"var(--hj-accent)", background:"transparent", border:"none",
                         borderBottom:"1px dashed var(--hj-accent-border)", outline:"none",
                         width:56, textAlign:"center" }}/>
              {xpNext && (
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", letterSpacing:"0.06em",
                               color:"var(--hj-text-dim)", marginLeft:"auto", flexShrink:0 }}>
                  {C.xpNext ? C.xpNext(totalLevel+1, xpNext.toLocaleString()) : `→ lvl ${totalLevel+1}: ${xpNext.toLocaleString()}`}
                </span>
              )}
              {!xpNext && (
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.42rem", color:"var(--hj-accent)", marginLeft:"auto" }}>
                  {C.xpMax || "MAX"}
                </span>
              )}
            </div>
            <div style={{ height:4, borderRadius:2, background:"var(--hj-border-input)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${xpPct}%`, background:"var(--hj-accent)",
                            borderRadius:2, transition:"width 0.3s ease" }}/>
            </div>
          </div>

          {/* ── Rząd mini-statów (pełna szerokość) ── */}
          <div style={{ display:"flex", margin:"5px 0 0", borderRadius:"var(--radius-sm)",
                        overflow:"hidden", border:"1px solid var(--hj-border)" }}>
            {[
              { label: C.passivePerc,  key:"passivePerceptionOverride", computed: 10+percBonus, color: undefined },
              { label: C.profBonus,    key:"profBonus",                  computed: pb,           color: undefined, direct: true },
              { label: C.spellDC,      key:"skillDCOverride",            computed: spellDC,      color: "var(--hj-spell-accent)" },
              { label: C.spellAtk,     key:"spellAttackOverride",        computed: spellAtk,     color: "var(--hj-spell-accent)", signed: true },
            ].map(({ label, key, computed, color, direct, signed }, idx, arr) => {
              const over = direct ? undefined : char[key];
              const displayVal = signed
                ? numMod(over ?? computed)
                : String(over ?? computed);
              const overrideColor = over !== undefined ? "var(--hj-pip-prof)" : color;
              return (
                <div key={key} style={{ flex:1, padding:"4px 4px", textAlign:"center",
                                         background:"rgba(255,255,255,.03)",
                                         borderRight: idx < arr.length-1 ? "1px solid var(--hj-border)" : "none" }}>
                  <input className="vitals-mini-value" type="text" inputMode="numeric"
                    value={displayVal}
                    title={C.overrideTip || "Wpisz by nadpisać"}
                    style={{ width:"100%", display:"block", textAlign:"center",
                             color: overrideColor }}
                    onFocus={e => e.target.select()}
                    onChange={e => {
                      const r = e.target.value.replace(/[^-\d]/g, "");
                      if (direct) {
                        setChar(c => ({...c, [key]: parseInt(r)||2}));
                      } else {
                        setChar(c => r===""
                          ? (o => { const n={...o}; delete n[key]; return n; })(c)
                          : {...c, [key]: parseInt(r)});
                      }
                    }}
                    onBlur={e => {
                      if (!direct && (!e.target.value.trim() || isNaN(parseInt(e.target.value))))
                        setChar(c => { const n={...c}; delete n[key]; return n; });
                    }}/>
                  <span className="vitals-mini-label">{label}</span>
                </div>
              );
            })}
          </div>

          {/* ── Wiersz 1: Odpoczynek (z pipsami kości) ── */}
          <div style={{ display:"flex", gap:"6px", marginTop:"5px" }}>
            <button className="btn-rest short" style={{ flex:"1 1 0" }}
              aria-label="Short rest" onClick={() => onRestModal("short")}>
              <span style={{ display:"flex", alignItems:"center", gap:"0.25rem" }}>
                <Icon name="moon" size="1em"/>
                {C.shortRest}
              </span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:2, justifyContent:"center", marginTop:1 }}>
                {Array.from({ length: hdPipCount }, (_, i) => {
                  const used = i < (hd.used||0);
                  return (
                    <span key={i} style={{
                      width:4, height:4, borderRadius:"50%", display:"inline-block", flexShrink:0,
                      background: used ? "transparent" : "var(--hj-accent)",
                      border: `1px solid ${used ? "rgba(128,128,128,0.35)" : "var(--hj-accent)"}`,
                      opacity: used ? 0.5 : 1,
                    }}/>
                  );
                })}
              </div>
            </button>
            <button className="btn-rest long" style={{ flex:"1 1 0" }}
              aria-label="Long rest" onClick={() => onRestModal("long")}>
              <Icon name="sun" size="1em"/>
              <span>{C.longRest}</span>
            </button>
          </div>

          {/* ── Wiersz 2: Stany / Rzuty / Wyczerpanie ── */}
          <div style={{ display:"flex", gap:"6px", marginTop:"5px" }}>
            <button style={mkToggleStyle(!!stanyOpen, "#aa4444")}
              onClick={() => setStanyOpen?.(s => !s)} aria-expanded={!!stanyOpen}>
              <Icon name="skull" size="0.9em"/>
              {C.stanyTitle||"Stany"}
              <Icon name={stanyOpen?"chevron-up":"chevron-down"} size="0.75em"/>
            </button>
            <button style={mkToggleStyle(!!deathOpen, "#9a3a3a")}
              onClick={() => setDeathOpen?.(s => !s)} aria-expanded={!!deathOpen}>
              <Icon name="heart" size="0.9em"/>
              {C.deathSaves}
              <Icon name={deathOpen?"chevron-up":"chevron-down"} size="0.75em"/>
            </button>
            <button style={mkToggleStyle(!!exhOpen, "#b06020")}
              onClick={() => setExhOpen?.(s => !s)} aria-expanded={!!exhOpen}>
              <Icon name="activity" size="0.9em"/>
              {exhaustion > 0 && <span style={{ fontWeight:700 }}>{exhaustion}</span>}
              {C.exhaustion}
              <Icon name={exhOpen?"chevron-up":"chevron-down"} size="0.75em"/>
            </button>
          </div>

          {/* ── Rozwinięte panele ── */}
          {stanyOpen && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem", paddingTop:"0.5rem",
                          borderTop:"1px solid var(--hj-border-sub)", marginTop:"0.4rem" }}>
              {CONDITIONS.map(cond => {
                const active = !!(char.conditions||{})[cond.key];
                const label  = T?.CONDITIONS?.[cond.key] || cond.label;
                return (
                  <button key={cond.key}
                    onClick={() => setChar(c => {
                      const conds={...(c.conditions||{})};
                      if(conds[cond.key]) delete conds[cond.key]; else conds[cond.key]=true;
                      return {...c,conditions:conds};
                    })}
                    style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.06em",
                             textTransform:"uppercase", padding:"0.2rem 0.4rem", cursor:"pointer",
                             transition:"all 0.15s", borderRadius:"var(--radius-pill)",
                             border:`1px solid ${active?"#cc3030":"var(--hj-pip-empty)"}`,
                             background:active?"rgba(200,48,48,0.2)":"transparent",
                             color:active?"#ee5050":"var(--hj-text-muted)" }}>
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {deathOpen && (
            <div style={{ marginTop:"0.4rem", padding:"0.45rem 0.6rem",
                          border:"1px solid rgba(154,58,58,0.3)", background:"rgba(154,58,58,0.05)",
                          borderRadius:"var(--radius-md)" }}>
              {[["successes",C.deathSuccess,"#4a9a5a"],["failures",C.deathFailure,"#9a3a3a"]].map(([type,label,color]) => (
                <div key={type} style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.3rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.08em",
                                 textTransform:"uppercase", color, flexShrink:0, minWidth:50 }}>{label}</span>
                  <div style={{ display:"flex", gap:"0.3rem" }}>
                    {[0,1,2].map(i => (
                      <button key={i} onClick={() => toggleDeath(type, i)}
                        style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${color}`,
                                 background:i<(ds[type]||0)?color:"transparent",
                                 cursor:"pointer", transition:"background 0.15s", flexShrink:0, padding:0 }}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {exhOpen && (
            <div style={{ marginTop:"0.4rem", padding:"0.45rem 0.6rem",
                          border:"1px solid rgba(176,96,32,0.3)", background:"rgba(176,96,32,0.05)",
                          borderRadius:"var(--radius-md)" }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
                {[0,1,2,3,4,5,6].map(level => {
                  const cur    = exhaustion;
                  const filled = level > 0 && level <= cur;
                  return (
                    <button key={level}
                      onClick={() => setChar(c => ({...c,conditions:{...(c.conditions||{}),exhaustion:level===cur?0:level}}))}
                      style={{ width:"2rem", height:"2rem", borderRadius:"var(--radius-sm)",
                               border:`1.5px solid ${filled?"#cc5020":level===0&&cur===0?"#4a9a5a":"var(--hj-pip-empty)"}`,
                               background:filled?"rgba(200,80,32,0.25)":level===0&&cur===0?"rgba(74,154,90,0.15)":"transparent",
                               cursor:"pointer", fontFamily:"Cinzel,serif", fontSize:"0.55rem", fontWeight:700,
                               color:filled?"#ee7040":level===0&&cur===0?"#4a9a5a":"var(--hj-text-dim)",
                               display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {level===0?<Icon name="check" size="0.9em"/>:level}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </>)}

      </div>
    </header>
  );
}
