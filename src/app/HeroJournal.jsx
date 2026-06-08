import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useLocation } from 'wouter';
import { syncI18nLang } from '../i18n/i18n';
import {
  CHAR_SLOTS, saveChar, saveProfiles,
  load, save, setCloudSaveHook, clearCloudSaveHook,
} from '../utils/storage';
import { useTheme }         from '../hooks/useTheme';
import { useLanguage }      from '../hooks/useLanguage';
import { useCharacterData, EMPTY_DATA, loadProfileData } from '../hooks/useCharacterData';
import { useProfileManager } from '../hooks/useProfileManager';
import { getNavGroups, getNavGroupsDesktop } from './navigation';
import TutorialModal from './TutorialModal';
import HelpPanel     from './HelpPanel';
import { LangContext, TRANSLATIONS } from '../i18n/translations';
import { cloudSave } from '../firebase/firestore';
import { ProfileScreen, HeroWizard } from '../features/profiles/ProfileScreen';
import { ResetModal } from '../shared/ui';
import SettingsMenu from './SettingsMenu';

/* ── Lazy imports — każdy tab ładowany na żądanie ─────────────── */
const CharacterScreen  = lazy(() => import('../features/character/CharacterScreen'));
const InventoryScreen  = lazy(() => import('../features/inventory/InventoryScreen'));
const SkillsScreen     = lazy(() => import('../features/skills/SkillsScreen'));
const SpellsScreen     = lazy(() => import('../features/spells/SpellsScreen'));
const NPCsScreen       = lazy(() => import('../features/world/NPCsScreen'));
const LocationsScreen  = lazy(() => import('../features/world/LocationsScreen'));
const FactionsPanel    = lazy(() => import('../features/factions/FactionsPanel'));
const SessionsScreen   = lazy(() => import('../features/sessions/SessionsScreen'));
const QuestScreen      = lazy(() => import('../features/quests/QuestScreen'));

/* Loader wyświetlany podczas ładowania chunka */
function TabLoader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"4rem 2rem", color:"var(--hj-text-dim)", fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase" }}>
      Loading…
    </div>
  );
}

/* EMPTY_DATA / loadProfileData → src/hooks/useCharacterData.js */

export default function HeroJournal({ user = null, onLogout = null, onCloudRefresh = null }) {
  /* ── Custom hooks ────────────────────────────────────────────── */
  const { theme, setTheme }            = useTheme();
  const { lang, toggleLanguage } = useLanguage();

  const {
    profiles, setProfiles, activeId, screen, setScreen,
    selectProfile, finishWizard, createSample, renameProfile, deleteProfile,
  } = useProfileManager();

  const {
    data, setDataRaw,
    setChar, setInventory, setNPCs, setLocations,
    setSkills, setSpells, setSessions, setQuests, setFactions,
  } = useCharacterData(activeId);

  /* ── URL routing — tab synchronizowany z hashem (#/character, #/inventory…) ── */
  const [location, navigate] = useLocation();
  const VALID_TABS = new Set([
    "character","equipment","inventory","skills","spells",
    "npcs","locations","factions","world-all",
    "sessions","quests",
  ]);
  const tabFromUrl = location.replace(/^\//, '') || "character";
  const tab = VALID_TABS.has(tabFromUrl) ? tabFromUrl : "character";
  const setTab = useCallback((t) => navigate("/" + t), [navigate]);

  /* ── UI state (pozostaje w HeroJournal — czysto prezentacyjny) ── */
  const [openGroup, setOpenGroup]   = useState(null);
  const [showReset, setShowReset]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp]         = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !load("hj_tutorial_seen", null));
  const [openEntity, setOpenEntity] = useState(null);

  /* ── Synchronizacja i18next z aktywnym językiem ─────────────── */
  useEffect(() => { syncI18nLang(lang); }, [lang]);

  /* ── Auto-resize textarea: listener na input ─────────────────── */
  useEffect(() => {
    const resize = ta => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    };
    const onInput = e => { if (e.target.tagName === 'TEXTAREA') resize(e.target); };
    document.addEventListener('input', onInput, true);
    return () => document.removeEventListener('input', onInput, true);
  }, []);

  /* ── Auto-resize textarea: po zmianie taba lub profilu ─────────── */
  useEffect(() => {
    const resize = ta => { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; };
    const runAll = () => document.querySelectorAll('textarea').forEach(resize);
    const rafId = requestAnimationFrame(runAll);
    /* Fallback dla lazy-loaded chunków — czekamy aż komponent się zamontuje */
    const tid = setTimeout(runAll, 250);
    return () => { cancelAnimationFrame(rafId); clearTimeout(tid); };
  }, [tab, activeId]);

  /* ── Synchronizacja metadanych profilu (useCharacterData + useProfileManager) ── */
  useEffect(() => {
    if (!activeId) return;
    setProfiles(prev => {
      const updated = prev.map(p => p.id !== activeId ? p : {
        ...p,
        name:  data.char.name?.trim() || p.name,
        class: (data.char.classes || [])[0]?.name  || p.class,
        level: (data.char.classes || [])[0]?.level || p.level,
      });
      saveProfiles(updated);
      return updated;
    });
  }, [data.char.name, data.char.classes, activeId]);

  /* ── Cloud save (debounced 1.5 s per klucz) ─────────────────── */
  const _cloudQueue    = useRef(new Map());
  const _cloudErrCount = useRef(0);
  const [syncFailed, setSyncFailed] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setCloudSaveHook(null); return; }
    const uid   = user.uid;
    const queue = _cloudQueue.current;
    setCloudSaveHook((key, val) => {
      clearTimeout(queue.get(key));
      queue.set(key, setTimeout(() => {
        cloudSave(uid, key, val).catch(e => {
          console.warn('[HJ] cloudSave error:', e.message);
          _cloudErrCount.current += 1;
          if (_cloudErrCount.current >= 3) setSyncFailed(true);
        });
        queue.delete(key);
      }, 1500));
    });
    return () => { clearCloudSaveHook(); queue.forEach(clearTimeout); queue.clear(); };
  }, [user?.uid]);

  /* ── Nawigacja ───────────────────────────────────────────────── */
  const handleNavigate = useCallback((tt, name = null) => {
    setTab(tt);
    setOpenEntity(name ? { tab: tt, name } : null);
  }, []);

  /* ── Zarządzanie profilami ───────────────────────────────────── */
  const switchProfile = useCallback(id => {
    selectProfile(id);
    setDataRaw(loadProfileData(id));
    setTab("character");
  }, [selectProfile, setDataRaw]);

  const handleWizardFinish = useCallback((id, newChar, profileMeta) => {
    const { newChar: nc } = finishWizard(id, newChar, profileMeta);
    setDataRaw({ ...EMPTY_DATA, char: nc });
    setTab("character");
  }, [finishWizard, setDataRaw]);

  const handleSampleCreate = useCallback(() => {
    const slots = createSample();
    setDataRaw(slots);
    setTab("character");
  }, [createSample, setDataRaw]);

  const handleRename = useCallback((profileId, newName) => {
    renameProfile(profileId, newName, activeId, setChar);
  }, [renameProfile, activeId, setChar]);

  const handleDelete = useCallback(id => {
    deleteProfile(id, activeId, switchProfile);
  }, [deleteProfile, activeId, switchProfile]);

  const handleReset = useCallback(() => {
    if (!activeId) return;
    CHAR_SLOTS.forEach(slot => saveChar(slot, activeId, EMPTY_DATA[slot]));
    setDataRaw(EMPTY_DATA);
    setShowReset(false);
  }, [activeId, setDataRaw]);

  /* ── Skróty do danych ────────────────────────────────────────── */
  const { char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = data;

  /* ── Zlokalizowane dane ───────────────────────────────────────── */
  const T                = TRANSLATIONS[lang];
  const navGroups        = getNavGroups(lang);         // mobile bottom nav
  const navGroupsDesktop = getNavGroupsDesktop(lang);  // desktop sidebar

  /* ── Ekrany pomocnicze ───────────────────────────────────────── */
  if (screen === "profiles") return (
    <LangContext.Provider value={lang}>
      <ProfileScreen
        profiles={profiles} activeId={activeId} theme={theme}
        onSelect={switchProfile} onCreate={() => setScreen("wizard")}
        onDelete={handleDelete} onCreateSample={handleSampleCreate}
        onRename={handleRename}
      />
    </LangContext.Provider>
  );

  if (screen === "wizard") return (
    <LangContext.Provider value={lang}>
      <HeroWizard
        theme={theme} onFinish={handleWizardFinish}
        onCancel={profiles.length > 0 ? () => setScreen("profiles") : undefined}
      />
    </LangContext.Provider>
  );

  /* ── Główny widok aplikacji ───────────────────────────────────── */
  return (
    <LangContext.Provider value={lang}>
    <div className="hj-root">
      {showReset && <ResetModal onConfirm={handleReset} onCancel={() => setShowReset(false)}/>}
      {syncFailed && (
        <div style={{ position:"fixed", bottom:"calc(var(--hj-nav-h,56px) + 0.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:500, background:"#5a1a1a", border:"1px solid #8a3a3a", color:"#f0c0c0", fontFamily:"Cinzel,serif", fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.5rem 1rem", display:"flex", gap:"0.8rem", alignItems:"center", borderRadius:"3px", maxWidth:"90vw", boxShadow:"0 4px 16px rgba(0,0,0,0.5)" }}>
          <span>☁ Błąd synchronizacji — dane zapisane lokalnie</span>
          <button onClick={() => { setSyncFailed(false); _cloudErrCount.current = 0; }}
            style={{ background:"transparent", border:"none", color:"inherit", cursor:"pointer", fontSize:"0.9rem", lineHeight:1, padding:0, flexShrink:0 }}>✕</button>
        </div>
      )}
      {showTutorial && <TutorialModal theme={theme} onClose={() => { setShowTutorial(false); save("hj_tutorial_seen","1"); }}/>}
      {/* HelpPanel — tylko na mobile (sidebar przejmuje rolę na desktop) */}
      {showHelp && <HelpPanel tab={tab} theme={theme} onClose={() => setShowHelp(false)}/>}

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hj-sidebar">

        {/* Brand */}
        <button className="hj-sidebar-brand" onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
          <div className="hj-logo" style={{ fontSize:"0.9rem", flexShrink:0 }}>⚔ HJ</div>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--hj-text-muted)", letterSpacing:"0.08em", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>
            {char.name?.trim() || T.UI.hero}
          </span>
        </button>
        <div style={{ height:"1px", background:"var(--hj-border)", margin:"0 0.75rem 0.25rem", flexShrink:0 }}/>

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
                    <span style={{ fontSize:"0.95rem", lineHeight:1, flexShrink:0 }}>{g.icon}</span>
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
                      <span style={{ fontSize:"0.95rem", lineHeight:1, flexShrink:0 }}>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ── Panel pomocy — wypełnia wolną przestrzeń ── */}
        {showHelp && (() => {
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
                <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--hj-accent)" }}>
                  ? {hc.title}
                </span>
                <button onClick={() => setShowHelp(false)}
                  style={{ background:"transparent", border:"none", color:"var(--hj-text-dim)", fontSize:"0.75rem", cursor:"pointer", lineHeight:1, padding:"0.1rem 0.2rem" }}>✕</button>
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
                    <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.52rem", color:"var(--hj-accent)", background:`rgba(226,185,78,0.1)`, border:"1px solid var(--hj-accent-border)", padding:"0.12rem 0.3rem", borderRadius:"2px", flexShrink:0, whiteSpace:"nowrap" }}>
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
        })()}

        {/* ── Stopka: ? i ⚙ ── */}
        <div style={{ flexShrink:0, marginTop: showHelp ? 0 : "auto", padding:"0.5rem 0.6rem", borderTop:"1px solid var(--hj-border-sub)", display:"flex", gap:"0.4rem" }}>
          <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }} aria-label="Open help" title="Help"
            style={{ flex:1, background:showHelp?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ?
          </button>

          {/* Ustawienia — dropdown fixed, nie obcięty przez overflow sidebara */}
          <div style={{ flex:1, position:"relative" }}>
            <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
              style={{ width:"100%", height:32, background:showSettings?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", fontSize:"1.1rem", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              ⚙
            </button>
            {showSettings && <>
              <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
              <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
                setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
                user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
                dropdownStyle={{ position:"fixed", bottom:"48px", left:"5px" }}/>
            </>}
          </div>
        </div>
      </aside>

      <header className="hj-header">
        <div className="hj-header-inner" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>

          {/* Logo + imię bohatera — ukryte na desktop (sidebar przejmuje tę rolę) */}
          <button className="hj-header-brand" style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0, cursor:"pointer", background:"transparent", border:"none", padding:0, color:"inherit", textAlign:"left" }}
            onClick={() => setScreen("profiles")} aria-label={T.UI.changeHero} title={T.UI.changeHero}>
            <div className="hj-logo">⚔ HJ</div>
            <span className="hj-char-name" style={{ flex:1 }}>{char.name?.trim() || T.UI.hero}</span>
          </button>

          {/* Prawa strona: ? i ⚙ */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>

          {/* Przycisk pomocy kontekstowej */}
          <button onClick={() => { setShowHelp(s => !s); setShowSettings(false); }}
            title="Help"
            style={{ background:showHelp?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showHelp?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showHelp?"var(--hj-accent)":"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.85rem", fontWeight:700, width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ?
          </button>

          {/* Panel ustawień */}
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowSettings(s => !s)} aria-label="Settings" title="Ustawienia"
              style={{ background:showSettings?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", fontSize:"1.1rem", lineHeight:1, width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              ⚙
            </button>
            {showSettings && <>
              <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
              <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
                setScreen={setScreen} setShowReset={setShowReset} setShowSettings={setShowSettings}
                user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
                dropdownStyle={{ position:"absolute", top:"calc(100% + 8px)", right:0 }}/>
            </>}
          </div>{/* /settings */}
          </div>{/* /right-side flex */}
        </div>
      </header>

      <main className="hj-content">
      <Suspense fallback={<TabLoader/>}>
        {tab === "character" && <CharacterScreen char={char} setChar={setChar} inventory={inventory} setInventory={setInventory} skills={skills} setSkills={setSkills} spells={spells} setSpells={setSpells}/>}

        {/* ── Equipment (virtual desktop tab) + mobile individual tabs ── */}
        {(tab === "equipment" || ["inventory","skills","spells"].includes(tab)) && <>
          <div className="multi-col-desktop">
            <div className="screen-col">
              <InventoryScreen title={T.NAV.inventory} inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <SkillsScreen title={T.NAV.skills} skills={skills} setSkills={setSkills} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <SpellsScreen title={T.NAV.spells} spells={spells} setSpells={setSpells} char={char} setChar={setChar}/>
            </div>
          </div>
          <div className="single-col-mobile">
            {tab === "inventory" && <InventoryScreen title={T.NAV.inventory} inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>}
            {tab === "skills"    && <SkillsScreen    title={T.NAV.skills}    skills={skills}       setSkills={setSkills}  openEntity={openEntity}/>}
            {tab === "spells"    && <SpellsScreen    title={T.NAV.spells}    spells={spells}       setSpells={setSpells}         char={char} setChar={setChar}/>}
            {tab === "equipment" && <InventoryScreen title={T.NAV.inventory} inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>}
          </div>
        </>}

        {/* ── World-all (virtual desktop tab) + mobile individual tabs ── */}
        {(tab === "world-all" || ["npcs","locations","factions"].includes(tab)) && <>
          <div className="multi-col-desktop">
            <div className="screen-col">
              <NPCsScreen title={T.NAV.npcs} npcs={npcs} setNPCs={setNPCs} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <LocationsScreen title={T.NAV.locations} locations={locations} setLocations={setLocations} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <FactionsPanel title={T.NAV.factions} factions={factions} setFactions={setFactions} openEntity={openEntity}/>
            </div>
          </div>
          <div className="single-col-mobile">
            {tab === "npcs"      && <NPCsScreen       title={T.NAV.npcs}      npcs={npcs}           setNPCs={setNPCs}            openEntity={openEntity}/>}
            {tab === "locations" && <LocationsScreen  title={T.NAV.locations} locations={locations} setLocations={setLocations}  openEntity={openEntity}/>}
            {tab === "factions"  && <FactionsPanel    title={T.NAV.factions}  factions={factions}   setFactions={setFactions}    openEntity={openEntity}/>}
            {tab === "world-all" && <NPCsScreen       title={T.NAV.npcs}      npcs={npcs}           setNPCs={setNPCs}            openEntity={openEntity}/>}
          </div>
        </>}

        {tab === "sessions"  && <SessionsScreen   sessions={sessions}   setSessions={setSessions}      npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab === "quests"    && <QuestScreen       quests={quests}       setQuests={setQuests}       openEntity={openEntity}/>}
      </Suspense>
      </main>

      {/* Szuflada nawigacyjna */}
      {openGroup && <div className="nav-drawer-overlay" onClick={() => setOpenGroup(null)}/>}
      {openGroup && (() => {
        const group = navGroups.find(g => g.id === openGroup);
        if (!group) return null;
        return (
          <div className="nav-drawer" onClick={e => e.stopPropagation()}>
            {group.tabs.map(t => (
              <button key={t.id} className={`nav-drawer-item${tab === t.id ? " active" : ""}`}
                onClick={() => { setTab(t.id); setOpenGroup(null); }}>
                <span className="nav-drawer-icon">{t.icon}</span>
                <span className="nav-drawer-label">{t.label}</span>
              </button>
            ))}
          </div>
        );
      })()}

      <nav className="hj-bottom-nav">
        {navGroups.map(g => {
          const isGroupActive     = g.tabs.some(t => t.id === tab);
          const activeTabInGroup  = g.tabs.find(t => t.id === tab);
          const isOpen            = openGroup === g.id;
          return (
            <button key={g.id}
              className={`hj-nav-btn${isGroupActive ? " group-active" : ""}${isOpen ? " active" : ""}`}
              onClick={() => {
                if (isOpen) setOpenGroup(null);
                else if (g.tabs.length === 1) { setTab(g.tabs[0].id); setOpenGroup(null); }
                else setOpenGroup(g.id);
              }}>
              <span className="hj-nav-icon">{activeTabInGroup ? activeTabInGroup.icon : g.icon}</span>
              <span className="hj-nav-label">{g.label}</span>
              {!activeTabInGroup && (
                <span className="hj-nav-sub">{g.tabs.map(t => t.icon).join(" ")}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
    </LangContext.Provider>
  );
}
