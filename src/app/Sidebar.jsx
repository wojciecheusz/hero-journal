import { useState } from 'react';
import SettingsMenu from './SettingsMenu';
import VitalsBar from './VitalsBar';
import CharIconPicker, { getCharIcon } from './CharIconPicker';
import Icon from '../shared/icons';
import { clamp } from '../utils/math';
import { getClassLevelLabel } from '../utils/character';

const LBL_SIDE = {
  fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.1em",
  textTransform:"uppercase", color:"var(--hj-text-muted)",
  marginBottom:"0.15rem", display:"block",
};
const ieditSideStyle = {
  fontFamily:"Cinzel,serif", fontSize:"0.8rem", background:"transparent",
  border:"none", outline:"none", color:"var(--hj-text)", width:"100%", padding:0,
};
const fieldBoxSide = {
  border:"1px solid var(--hj-border-input)",
  borderRadius:"var(--radius-md)", padding:"0.4rem 0.5rem",
};

/* Treść kontekstowego panelu pomocy — zależna od aktywnej zakładki */
function SidebarHelp({ tab, T, onClose }) {
  const helpKey = tab==="character" ? "character"
    : tab==="equipment"||["inventory","spells","skills"].includes(tab) ? "equipment"
    : tab==="world-all"||["npcs","locations","factions"].includes(tab) ? "world"
    : tab==="sessions" ? "sessions"
    : tab==="quests" ? "quests"
    : "character";
  const hc = T.HELP[helpKey];
  if (!hc) return null;
  return (
    <div style={{ flex:1, overflowY:"auto", borderTop:"1px solid var(--hj-border-sub)", padding:"0.7rem 0.8rem 0.4rem", display:"flex", flexDirection:"column", gap:0 }}>
      {/* Nagłówek sekcji pomocy */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
        <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--hj-accent)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <Icon name="help-circle" size="0.9em" color="var(--hj-accent)"/> {hc.title}
        </span>
        <button onClick={onClose}
          style={{ background:"transparent", border:"none", color:"var(--hj-text-dim)", fontSize:"0.75rem", cursor:"pointer", lineHeight:1, padding:"0.1rem 0.2rem", display:"flex" }}><Icon name="close" size="0.85em"/></button>
      </div>
      {/* Intro */}
      {hc.intro && (
        <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--hj-text-muted)", lineHeight:1.6, fontStyle:"italic", marginBottom:"0.55rem", paddingBottom:"0.5rem", borderBottom:"1px solid var(--hj-border-sub)" }}>
          {hc.intro}
        </p>
      )}
      {/* Pozycje pomocy */}
      {hc.items.map(([icon, label, desc]) => (
        <div key={label} style={{ paddingBottom:"0.5rem", marginBottom:"0.5rem", borderBottom:"1px solid var(--hj-border-sub)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom: desc ? "0.2rem" : 0 }}>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", color:"var(--hj-accent)", background:`rgba(168,120,48,0.1)`, border:"1px solid var(--hj-accent-border)", padding:"0.12rem 0.3rem", borderRadius:"2px", flexShrink:0, whiteSpace:"nowrap" }}>
              {icon}
            </span>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.46rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--hj-text-label)", lineHeight:1.3 }}>
              {label}
            </span>
          </div>
          {desc && (
            <p style={{ fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.82rem", color:"var(--hj-text-muted)", lineHeight:1.55, paddingLeft:"0.2rem", margin:0 }}>
              {desc}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* Sidebar nawigacyjny widoczny na desktopie — marka, nawigacja, pomoc kontekstowa, stopka z ustawieniami */
export default function Sidebar({
  T, theme, setTheme, toggleLanguage, char, setChar, pb, tab, setTab, navGroupsDesktop,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, setShowReset, user, onCloudRefresh, onLogout,
  onExport, onImport, onRestModal,
}) {
  const { className, totalLevel } = getClassLevelLabel(char, T.CHAR);
  const C = T.CHAR;
  const charIcon = getCharIcon(char);
  const [moreOpen, setMoreOpen] = useState(false);

  const updAppearance = (key, val) =>
    setChar(c => ({ ...c, appearance: { ...(c.appearance||{}), [key]: val } }));

  return (
    <aside className="hj-sidebar">

      {/* Brand */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.6rem 0.75rem 0.3rem", flexShrink:0 }}>
        <CharIconPicker value={charIcon} onChange={icon => setChar(c => ({...c, icon}))} size={24}/>
        <button className="hj-sidebar-brand" style={{ flex:1, minWidth:0, padding:0 }}
          onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--hj-text-muted)", letterSpacing:"0.08em", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>
            HJ
          </span>
        </button>
      </div>

      {/* Tożsamość bohatera — imię, klasa/poziom, widoczne na każdym ekranie */}
      <div className="hj-sidebar-identity">
        <div className="hcv2-eyebrow"><Icon name="sparkle" size="0.85em"/> Hero Journal</div>
        <div className="hcv2-name">{char.name?.trim() || T.CHAR.heroName}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.3rem" }}>
          <div className="hcv2-subtitle" style={{ minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{className} · {T.CHAR.level} {totalLevel}</div>
          <button onClick={() => setMoreOpen(s => !s)} aria-expanded={moreOpen}
            style={{ display:"flex", alignItems:"center", gap:"0.2rem", flexShrink:0,
                     fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.1em",
                     textTransform:"uppercase", padding:"0.2rem 0.5rem",
                     background:moreOpen?"rgba(226,185,78,0.08)":"transparent",
                     border:`1px solid ${moreOpen?"var(--hj-accent-border)":"var(--hj-border-input)"}`,
                     color:moreOpen?"var(--hj-accent)":"var(--hj-text-muted)",
                     borderRadius:"var(--radius-pill)", cursor:"pointer", transition:"all 0.15s" }}>
            {moreOpen ? (C.less||"Mniej") : (C.more||"Więcej")}
            <Icon name={moreOpen?"chevron-up":"chevron-down"} size="0.7em"/>
          </button>
        </div>
      </div>

      {/* ── Panel Więcej: klasy (multiclass), rasa, przeszłość, charakter, wygląd ── */}
      {moreOpen && (() => {
        const moreFields = [
          ["race",       C.race,       C.racePh,                  null],
          ["background", C.background, C.backgroundPh,            null],
          ["alignment",  C.alignment,  C.alignmentPh||"CN, LG…",  null],
          ["age",        C.age,        C.agePh,        "appearance"],
          ["height",     C.height,     C.heightPh,     "appearance"],
          ["weight",     C.weight,     C.weightPh,     "appearance"],
          ["eyes",       C.eyes,       C.eyesPh,       "appearance"],
          ["skin",       C.skin,       C.skinPh,       "appearance"],
          ["hair",       C.hair,       C.hairPh,       "appearance"],
        ];
        const classes = char.classes?.length ? char.classes : [{ name:"", level:1 }];
        return (
          <div style={{ padding:"0 0.75rem 0.5rem" }}>

            {/* Klasy / multiclassing */}
            <div style={{ paddingBottom:"0.45rem", borderBottom:"1px solid var(--hj-border-sub)", marginBottom:"0.45rem" }}>
              <span style={LBL_SIDE}>{C.classLabel}</span>
              {classes.map((cls, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.35rem",
                                       marginTop: i>0 ? "0.3rem" : 0 }}>
                  <input style={{ ...ieditSideStyle, flex:1 }} value={cls.name||""}
                    placeholder={i===0 ? C.classPh : `${C.classPh} (${i+1})`}
                    onChange={e => setChar(c => {
                      const cl = c.classes?.length ? [...c.classes] : [{ name:"", level:1 }];
                      cl[i] = { ...cl[i], name:e.target.value };
                      return { ...c, classes: cl };
                    })}/>
                  <span style={{ ...LBL_SIDE, marginBottom:0, flexShrink:0 }}>{C.level}</span>
                  <input type="number" min={1} max={20} value={cls.level||1}
                    style={{ ...ieditSideStyle, width:28, textAlign:"center", flexShrink:0 }}
                    onFocus={e => e.target.select()}
                    onChange={e => {
                      const v = parseInt(e.target.value);
                      setChar(c => {
                        const cl = c.classes?.length ? [...c.classes] : [{ name:"", level:1 }];
                        cl[i] = { ...cl[i], level: isNaN(v) ? v : clamp(v,1,20) };
                        return { ...c, classes: cl };
                      });
                    }}
                    onBlur={e => {
                      const v = parseInt(e.target.value);
                      setChar(c => {
                        const cl = c.classes?.length ? [...c.classes] : [{ name:"", level:1 }];
                        cl[i] = { ...cl[i], level: (!isNaN(v)) ? clamp(v,1,20) : 1 };
                        return { ...c, classes: cl };
                      });
                    }}/>
                  {i > 0 && (
                    <button onClick={() => setChar(c => ({...c, classes:(c.classes||[]).filter((_,j) => j!==i)}))}
                      aria-label="Usuń klasę"
                      style={{ background:"transparent", border:"none", color:"var(--hj-text-dim)",
                               cursor:"pointer", flexShrink:0, display:"flex", padding:0 }}>
                      <Icon name="close" size="0.7em"/>
                    </button>
                  )}
                </div>
              ))}
              {classes.length < 4 && (
                <button
                  onClick={() => setChar(c => ({...c, classes:[...(c.classes?.length ? c.classes : [{name:"",level:1}]), {name:"",level:1}]}))}
                  style={{ marginTop:"0.35rem", display:"flex", alignItems:"center", gap:"0.25rem",
                           background:"transparent", border:"none", color:"var(--hj-accent)", cursor:"pointer",
                           fontFamily:"Cinzel,serif", fontSize:"0.44rem", letterSpacing:"0.08em",
                           textTransform:"uppercase", padding:0 }}>
                  <Icon name="plus" size="0.65em"/> {C.addClass}
                </button>
              )}
            </div>

            {moreFields.map(([key,label,ph,group]) => (
              <div key={key} style={{ ...fieldBoxSide, marginBottom:"0.35rem" }}>
                <span style={LBL_SIDE}>{label}</span>
                <input style={ieditSideStyle}
                  value={group ? (char.appearance||{})[key]||"" : char[key]||""}
                  placeholder={ph||""}
                  onChange={e => group ? updAppearance(key, e.target.value) : setChar(c => ({...c,[key]:e.target.value}))}/>
              </div>
            ))}
          </div>
        );
      })()}

      <div style={{ height:"1px", background:"var(--hj-border)", margin:"0 0.75rem 0.25rem", flexShrink:0 }}/>

      {/* Pasek PŻ / Odpoczynek */}
      <div style={{ flexShrink:0 }}>
        <VitalsBar char={char} setChar={setChar} C={T.CHAR} T={T} pb={pb} onRestModal={onRestModal} variant="sidebar"/>
      </div>

      {/* Nawigacja */}
      <div style={{ flexShrink:0 }}>
        {navGroupsDesktop.map(g => {
          if (g.tabs.length === 1) {
            const t = g.tabs[0];
            const isWorldActive = t.id === "world-all" && (tab === "world-all" || ["npcs","locations","factions"].includes(tab));
            const isActive = tab === t.id || isWorldActive;
            return (
              <div key={g.id} className="hj-sidebar-group">
                <button className={`hj-sidebar-item${isActive?" active":""}`}
                  style={{ paddingTop:"0.55rem", paddingBottom:"0.55rem" }}
                  onClick={() => setTab(t.id)}>
                  <span style={{ fontSize:"0.95rem", lineHeight:1, flexShrink:0, display:"inline-flex" }}><Icon name={g.icon}/></span>
                  <span>{g.label}</span>
                </button>
              </div>
            );
          }
          return (
            <div key={g.id} className="hj-sidebar-group">
              <span className="hj-sidebar-group-label">{g.label}</span>
              {g.tabs.map(t => {
                const isEquipActive = t.id === "equipment" && (tab === "equipment" || ["inventory","skills","spells"].includes(tab));
                const isActive = tab === t.id || isEquipActive;
                return (
                  <button key={t.id} className={`hj-sidebar-item${isActive?" active":""}`} onClick={() => setTab(t.id)}>
                    <span style={{ fontSize:"0.95rem", lineHeight:1, flexShrink:0, display:"inline-flex" }}><Icon name={t.icon}/></span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Panel pomocy — wypełnia wolną przestrzeń ── */}
      {showHelp && <SidebarHelp tab={tab} T={T} onClose={() => setShowHelp(false)}/>}

      {/* ── Stopka: ? i ⚙ ── */}
      <div style={{ flexShrink:0, marginTop: showHelp ? 0 : "auto", padding:"0.5rem 0.6rem", borderTop:"1px solid var(--hj-border-sub)", display:"flex", gap:"0.4rem" }}>
        <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }} aria-label="Open help" title="Help"
          style={{ flex:1, background:showHelp?"rgba(168,120,48,0.1)":"transparent", border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="help-circle" size="1em"/>
        </button>

        {/* Wsparcie autora */}
        <a href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
          aria-label={T.UI.buyBeer} title={T.UI.buyBeer}
          style={{ flexShrink:0, width:32, height:32, background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontSize:"1.05rem", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--hj-accent-border)"; e.currentTarget.style.color="var(--hj-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--hj-border-input)"; e.currentTarget.style.color="var(--hj-text-muted)"; }}>
          <Icon name="beer" size="1.1em"/>
        </a>

        {/* Ustawienia — dropdown fixed, nie obcięty przez overflow sidebara */}
        <div style={{ flex:1, position:"relative" }}>
          <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
            style={{ width:"100%", height:32, background:showSettings?"rgba(168,120,48,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", fontSize:"1.1rem", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="settings" size="1.1em"/>
          </button>
          {showSettings && <>
            <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
            <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
              setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
              user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
              onExport={onExport} onImport={onImport}
              dropdownStyle={{ position:"fixed", bottom:"48px", left:"5px" }}/>
          </>}
        </div>
      </div>
    </aside>
  );
}
