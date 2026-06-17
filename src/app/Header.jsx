import SettingsMenu from './SettingsMenu';
import Icon from '../shared/icons';
import { clamp } from '../utils/math';
import { getClassLevelLabel } from '../utils/character';
import { getTabLabel } from './navigation';

/* Górny pasek widoczny na mobile — marka, tożsamość, pasek HP, etykieta zakładki, ustawienia */
export default function Header({
  T, theme, setTheme, toggleLanguage, char, tab,
  showHelp, setShowHelp, showSettings, setShowSettings,
  setScreen, setShowReset, user, onCloudRefresh, onLogout,
  onExport, onImport,
  setChar, pb, onRestModal,
  panelCollapsed, setPanelCollapsed,
}) {
  const { className, totalLevel } = getClassLevelLabel(char, T.CHAR);
  const C = T.CHAR;

  const hp    = char.hp || { current: 0, max: 1, temp: 0 };
  const hpPct = Math.round(clamp((hp.current / (hp.max || 1)) * 100, 0, 100));
  const hpCol = hpPct > 70 ? "#3a9a3a" : hpPct > 35 ? "#c06010" : "#c03030";

  const adjustHP = delta => setChar(c => {
    const h = c.hp || { current: 0, max: 1, temp: 0 };
    return { ...c, hp: { ...h, current: clamp(h.current + delta, 0, h.max) } };
  });

  const initiative = char.initiativeBonus !== undefined
    ? char.initiativeBonus
    : Math.floor(((char.stats?.DEX ?? 10) - 10) / 2);

  return (
    <header className="hj-header">
      <div className="hj-header-inner">

        {/* Rząd: logo + imię + ikony */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>
          <button className="hj-header-brand"
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0,
                     cursor:"pointer", background:"transparent", border:"none", padding:0,
                     color:"inherit", textAlign:"left" }}
            onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
            <div className="hj-logo" style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <Icon name="sword" size="1em"/> HJ
            </div>
            <span className="hj-char-name" style={{ flex:1 }}>{char.name?.trim() || T.UI.hero}</span>
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>
            <button onClick={() => setPanelCollapsed?.(s => !s)}
              title={panelCollapsed ? "Rozwiń panel" : "Zwiń panel"}
              style={{ background:"transparent", border:"1px solid var(--hj-border-input)",
                       color:"var(--hj-text-muted)", width:32, height:32, cursor:"pointer",
                       transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={panelCollapsed ? "chevron-down" : "chevron-up"} size="1em"/>
            </button>
            <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}
              title="Help"
              style={{ background:showHelp?"rgba(226,185,78,0.1)":"transparent",
                       border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`,
                       color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)",
                       width:32, height:32, cursor:"pointer", transition:"all 0.2s",
                       display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="help-circle" size="1em"/>
            </button>

            <a href="https://ko-fi.com/herojournal" target="_blank" rel="noopener noreferrer"
              aria-label={T.UI.buyBeer} title={T.UI.buyBeer}
              style={{ background:"transparent", border:"1px solid var(--hj-border-input)",
                       color:"var(--hj-text-muted)", lineHeight:1, width:32, height:32,
                       display:"flex", alignItems:"center", justifyContent:"center",
                       textDecoration:"none", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--hj-accent-border)"; e.currentTarget.style.color="var(--hj-accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--hj-border-input)"; e.currentTarget.style.color="var(--hj-text-muted)"; }}>
              <Icon name="beer" size="1.1em"/>
            </a>

            <div style={{ position:"relative" }}>
              <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
                style={{ background:showSettings?"rgba(226,185,78,0.1)":"transparent",
                         border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`,
                         color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)",
                         lineHeight:1, width:32, height:32, cursor:"pointer", transition:"all 0.2s",
                         display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="settings" size="1.1em"/>
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
          {/* Tożsamość bohatera */}
          <div className="hj-header-identity">
            <div className="hcv2-name">{char.name?.trim() || C.heroName}</div>
            <div className="hcv2-subtitle">{className} · {C.level} {totalLevel}</div>
          </div>

          {/* Etykieta aktualnej zakładki */}
          <div className="tab-label">{getTabLabel(T, tab)}</div>

          {/* ── Pasek HP + mini-statsy (AC / Init / PB) ── */}
          <div style={{ margin:"6px 0 0", background:"rgba(255,255,255,.04)", borderRadius:"10px",
                        padding:"8px 10px", border:"1px solid var(--hj-border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>

              {/* Kolumna HP */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"3px" }}>
                  <span className="vitals-hp-label">{C.hp}</span>
                  <span className="vitals-hp-value">
                    <input type="number" className="vitals-hp-current" value={hp.current}
                      style={{ color: hpCol }}
                      onFocus={e => e.target.select()}
                      onChange={e => setChar(c => {
                        const h = c.hp||{current:0,max:1,temp:0};
                        return {...c, hp:{...h, current: e.target.value===""?0:clamp(parseInt(e.target.value)||0,0,h.max)}};
                      })}
                      onBlur={e => setChar(c => {
                        const h = c.hp||{current:0,max:1,temp:0};
                        return {...c, hp:{...h, current: clamp(parseInt(e.target.value)||0,0,h.max)}};
                      })}/>
                    <span className="vitals-hp-sep">/</span>
                    <input type="number" min={1} className="vitals-hp-max" value={hp.max}
                      onFocus={e => e.target.select()}
                      onChange={e => setChar(c => {
                        const h = c.hp||{current:0,max:1,temp:0};
                        return {...c, hp:{...h, max: e.target.value===""?1:Math.max(1,parseInt(e.target.value)||1)}};
                      })}
                      onBlur={e => setChar(c => {
                        const h = c.hp||{current:0,max:1,temp:0};
                        return {...c, hp:{...h, max: Math.max(1,parseInt(e.target.value)||1)}};
                      })}/>
                  </span>
                </div>
                <div className="hp-bar-bg" style={{ marginBottom:"5px" }}>
                  <div className="hp-bar-fill" style={{ width:`${hpPct}%`, background:hpCol }}/>
                </div>
                <div style={{ display:"flex", gap:"5px" }}>
                  <button className="btn-pm minus" aria-label="HP −"
                    style={{ flex:1, width:"auto", height:"26px", borderRadius:"6px" }}
                    onClick={() => adjustHP(-1)}>
                    <Icon name="minus" size="1em"/>
                  </button>
                  <button className="btn-pm plus" aria-label="HP +"
                    style={{ flex:1, width:"auto", height:"26px", borderRadius:"6px" }}
                    onClick={() => adjustHP(1)}>
                    <Icon name="plus" size="1em"/>
                  </button>
                </div>
              </div>

              {/* Separator pionowy */}
              <div style={{ width:"1px", height:"54px", background:"var(--hj-border)", flexShrink:0 }}/>

              {/* Mini-statsy: AC / Init / PB */}
              <div style={{ display:"flex", flexShrink:0, borderRadius:"8px", overflow:"hidden",
                            border:"1px solid var(--hj-border)" }}>
                <div style={{ padding:"4px 8px", textAlign:"center", background:"rgba(255,255,255,.03)" }}>
                  <input className="vitals-mini-value" type="number" value={char.ac||0}
                    onFocus={e => e.target.select()}
                    onChange={e => setChar(c => ({...c, ac: e.target.value===""?0:parseInt(e.target.value)||0}))}
                    style={{ width:"2em", display:"block", margin:"0 auto" }}/>
                  <span className="vitals-mini-label">{C.ac}</span>
                </div>
                <div style={{ width:"1px", background:"var(--hj-border)" }}/>
                <div style={{ padding:"4px 8px", textAlign:"center", background:"rgba(255,255,255,.03)" }}>
                  <input className="vitals-mini-value" type="number" value={initiative}
                    onFocus={e => e.target.select()}
                    onChange={e => setChar(c => ({...c, initiativeBonus: e.target.value===""?undefined:parseInt(e.target.value)}))}
                    onBlur={e => { if (e.target.value==="") setChar(c => { const o={...c}; delete o.initiativeBonus; return o; }); }}
                    style={{ width:"2em", display:"block", margin:"0 auto" }}/>
                  <span className="vitals-mini-label">{C.initiative}</span>
                </div>
                <div style={{ width:"1px", background:"var(--hj-border)" }}/>
                <div style={{ padding:"4px 8px", textAlign:"center", background:"rgba(255,255,255,.03)" }}>
                  <input className="vitals-mini-value" type="number" value={pb}
                    onFocus={e => e.target.select()}
                    onChange={e => setChar(c => ({...c, profBonus: parseInt(e.target.value)||2}))}
                    style={{ width:"2em", display:"block", margin:"0 auto" }}/>
                  <span className="vitals-mini-label">{C.profBonus}</span>
                </div>
              </div>

            </div>
          </div>
        </>)}

      </div>
    </header>
  );
}
