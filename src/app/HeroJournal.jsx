import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useLocation } from 'wouter';
import { syncI18nLang } from '../i18n/i18n';
import { THEMES, PALETTES, PALETTE_LABELS } from '../theme/themes';
import { DEFAULT_CHAR } from '../constants/gameConstants';
import {
  CHAR_SLOTS, saveChar, loadProfiles, saveProfiles, saveActiveId,
  load, save, setCloudSaveHook, clearCloudSaveHook,
} from '../utils/storage';
import { useTheme }         from '../hooks/useTheme';
import { useLanguage }      from '../hooks/useLanguage';
import { useCharacterData, EMPTY_DATA, loadProfileData } from '../hooks/useCharacterData';
import { useProfileManager } from '../hooks/useProfileManager';
import { getNavGroups, getNavGroupsDesktop } from './navigation';
import { applyThemeVars } from '../utils/themeUtils';
import TutorialModal from './TutorialModal';
import HelpPanel     from './HelpPanel';
import { detectLang, LangContext, TRANSLATIONS } from '../i18n/translations';
import { createSampleHero } from '../constants/sampleHero';
import { cloudSave } from '../firebase/firestore';
import { ProfileScreen, PostaćWizard } from '../features/profiles/ProfileScreen';
import { ResetModal } from '../shared/ui';

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

/* applyThemeVars → src/utils/themeUtils.js
   EMPTY_DATA / loadProfileData → src/hooks/useCharacterData.js */

export default function HeroJournal({ user = null, onLogout = null, onCloudRefresh = null }) {
  /* ── Custom hooks ────────────────────────────────────────────── */
  const { theme, setTheme }            = useTheme();
  const { lang, setLang, toggleLanguage } = useLanguage();

  const {
    profiles, setProfiles, activeId, setActiveId, screen, setScreen,
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
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem("hj_tutorial_seen"));
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
    const id = requestAnimationFrame(() => {
      document.querySelectorAll('textarea').forEach(ta => {
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
      });
    });
    return () => cancelAnimationFrame(id);
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
  const _cloudQueue = useRef(new Map());
  useEffect(() => {
    if (!user?.uid) { setCloudSaveHook(null); return; }
    const uid   = user.uid;
    const queue = _cloudQueue.current;
    setCloudSaveHook((key, val) => {
      clearTimeout(queue.get(key));
      queue.set(key, setTimeout(() => {
        cloudSave(uid, key, val).catch(e => console.warn('[HJ] cloudSave error:', e.message));
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
      <PostaćWizard
        theme={theme} onFinish={handleWizardFinish}
        onAnuluj={profiles.length > 0 ? () => setScreen("profiles") : undefined}
      />
    </LangContext.Provider>
  );

  /* ── Główny widok aplikacji ───────────────────────────────────── */
  return (
    <LangContext.Provider value={lang}>
    <div className="hj-root">
      {showReset && <ResetModal onConfirm={handleReset} onAnuluj={() => setShowReset(false)}/>}
      {showTutorial && <TutorialModal theme={theme} onClose={() => { setShowTutorial(false); localStorage.setItem("hj_tutorial_seen","1"); }}/>}
      {/* HelpPanel — tylko na mobile (sidebar przejmuje rolę na desktop) */}
      {showHelp && <HelpPanel tab={tab} theme={theme} onClose={() => setShowHelp(false)}/>}

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hj-sidebar">

        {/* Brand */}
        <div className="hj-sidebar-brand" onClick={() => setScreen("profiles")} title={T.UI.changeHero}>
          <div className="hj-logo" style={{ fontSize:"0.9rem", flexShrink:0 }}>⚔ HJ</div>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:"0.6rem", color:"var(--hj-text-muted)", letterSpacing:"0.08em", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>
            {char.name?.trim() || T.UI.hero}
          </span>
        </div>
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
              {hc.items.map(([icon, label, desc], i) => (
                <div key={i} style={{ paddingBottom:"0.5rem", marginBottom:"0.5rem", borderBottom:"1px solid var(--hj-border-sub)" }}>
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
              {/* position:fixed — nie obcinany przez overflow sidebara */}
              <div style={{ position:"fixed", bottom:"48px", left:"5px", background:"var(--hj-modal-bg)", border:"1px solid var(--hj-border)", boxShadow:"0 -8px 32px var(--hj-shadow-bot)", zIndex:200, width:250, borderRadius:"2px" }}>
                <div style={{ padding:"0.5rem 0.6rem 0.35rem" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.48rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--hj-text-muted)", marginBottom:"0.4rem" }}>{T.UI.themeColor}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.2rem" }}>
                    {PALETTES.map(p => (
                      <button key={p} onClick={() => setTheme(p)}
                        style={{ background:theme===p?"rgba(226,185,78,0.12)":"transparent", border:`1px solid ${theme===p?"var(--hj-accent-border)":"var(--hj-border-sub)"}`, color:theme===p?"var(--hj-accent)":"var(--hj-text)", fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.04em", padding:"0.25rem 0.3rem", cursor:"pointer", textAlign:"left", transition:"all 0.12s", borderRadius:"2px" }}>
                        {T.PALETTE_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop:"1px solid var(--hj-border-sub)", padding:"0.35rem 0.45rem", display:"flex", flexDirection:"column", gap:"0.18rem" }}>
                  {[
                    [() => toggleLanguage(), `🌐 ${T.UI.langToggle==="EN"?"Switch to English":"Przełącz na polski"}`, false],
                    [() => { setScreen("profiles"); setShowSettings(false); }, `👤 ${T.UI.changeHero}`, false],
                    [() => { setShowReset(true); setShowSettings(false); }, T.UI.resetChar, true],
                    ...(user&&onCloudRefresh?[[() => { onCloudRefresh(); setShowSettings(false); }, T.UI.syncData, false]]:[]),
                    ...(user&&onLogout?[[() => { onLogout(); setShowSettings(false); }, `${T.UI.logout} (${(user.displayName||user.email||"").split(/[\s@]/)[0]})`, false]]:[]),
                  ].map(([onClick, label, isDanger], i) => (
                    <button key={i} onClick={onClick}
                      style={{ background:"transparent", border:`1px solid ${isDanger?"#6a2a2a":"var(--hj-border-input)"}`, color:isDanger?"#c04040":"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.52rem", letterSpacing:"0.06em", textTransform:"uppercase", padding:"0.3rem 0.5rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>}
          </div>
        </div>
      </aside>

      <header className="hj-header">
        <div className="hj-header-inner" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>

          {/* Logo + imię bohatera — ukryte na desktop (sidebar przejmuje tę rolę) */}
          <div className="hj-header-brand" style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0, cursor:"pointer" }}
            onClick={() => setScreen("profiles")} title={T.UI.changeHero}>
            <div className="hj-logo">⚔ HJ</div>
            <span className="hj-char-name" style={{ flex:1 }}>{char.name?.trim() || T.UI.hero}</span>
          </div>

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
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"var(--hj-modal-bg)", border:"1px solid var(--hj-border)", boxShadow:"0 8px 32px var(--hj-shadow-bot)", zIndex:200, width:270, borderRadius:"2px" }}>
                <div style={{ padding:"0.6rem 0.7rem 0.4rem" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--hj-text-muted)", marginBottom:"0.5rem" }}>{T.UI.themeColor}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.25rem" }}>
                    {PALETTES.map(p => (
                      <button key={p} onClick={() => setTheme(p)}
                        style={{ background:theme===p?"rgba(226,185,78,0.12)":"transparent", border:`1px solid ${theme===p?"var(--hj-accent-border)":"var(--hj-border-sub)"}`, color:theme===p?"var(--hj-accent)":"var(--hj-text)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.04em", padding:"0.3rem 0.4rem", cursor:"pointer", textAlign:"left", transition:"all 0.12s", borderRadius:"2px" }}>
                        {T.PALETTE_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop:"1px solid var(--hj-border-sub)", padding:"0.4rem 0.5rem", display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                  <button onClick={() => { toggleLanguage(); }}
                    style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                    🌐 {T.UI.langToggle === "EN" ? "Switch to English" : "Przełącz na polski"}
                  </button>
                  <button onClick={() => { setScreen("profiles"); setShowSettings(false); }}
                    style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                    👤 {T.UI.changeHero}
                  </button>
                  <button onClick={() => { setShowReset(true); setShowSettings(false); }}
                    style={{ background:"transparent", border:"1px solid #6a2a2a", color:"#c04040", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                    {T.UI.resetChar}
                  </button>
                  {user && onCloudRefresh && (
                    <button onClick={() => { onCloudRefresh(); setShowSettings(false); }}
                      style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                      {T.UI.syncData}
                    </button>
                  )}
                  {user && onLogout && (
                    <button onClick={() => { onLogout(); setShowSettings(false); }}
                      style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                      {T.UI.logout} ({(user.displayName || user.email || "").split(/[\s@]/)[0]})
                    </button>
                  )}
                </div>
              </div>
            </>}
          </div>{/* /settings */}
          </div>{/* /right-side flex */}
        </div>
      </header>

      <main className="hj-content">
      <Suspense fallback={<TabLoader/>}>
        {tab === "character" && <CharacterScreen char={char} setChar={setChar} inventory={inventory} skills={skills} spells={spells}/>}

        {/* ── Equipment (virtual desktop tab) + mobile individual tabs ── */}
        {(tab === "equipment" || ["inventory","skills","spells"].includes(tab)) && <>
          <div className="multi-col-desktop">
            <div className="screen-col">
              <div className="screen-col-header">{T.NAV.inventory}</div>
              <InventoryScreen inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <div className="screen-col-header">{T.NAV.spells}</div>
              <SpellsScreen spells={spells} setCzary={setSpells} char={char} setChar={setChar}/>
            </div>
            <div className="screen-col">
              <div className="screen-col-header">{T.NAV.skills}</div>
              <SkillsScreen skills={skills} setUmiejętności={setSkills} openEntity={openEntity}/>
            </div>
          </div>
          <div className="single-col-mobile">
            {tab === "inventory" && <InventoryScreen inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>}
            {tab === "skills"    && <SkillsScreen    skills={skills}       setUmiejętności={setSkills}  openEntity={openEntity}/>}
            {tab === "spells"    && <SpellsScreen     spells={spells}       setCzary={setSpells}         char={char} setChar={setChar}/>}
            {tab === "equipment" && <InventoryScreen inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>}
          </div>
        </>}

        {/* ── World-all (virtual desktop tab) + mobile individual tabs ── */}
        {(tab === "world-all" || ["npcs","locations","factions"].includes(tab)) && <>
          <div className="multi-col-desktop">
            <div className="screen-col">
              <div className="screen-col-header">{T.NAV.npcs}</div>
              <NPCsScreen npcs={npcs} setNPCs={setNPCs} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <div className="screen-col-header">{T.NAV.locations}</div>
              <LocationsScreen locations={locations} setLocations={setLocations} openEntity={openEntity}/>
            </div>
            <div className="screen-col">
              <div className="screen-col-header">{T.NAV.factions}</div>
              <FactionsPanel factions={factions} setFactions={setFactions} openEntity={openEntity}/>
            </div>
          </div>
          <div className="single-col-mobile">
            {tab === "npcs"      && <NPCsScreen       npcs={npcs}           setNPCs={setNPCs}            openEntity={openEntity}/>}
            {tab === "locations" && <LocationsScreen  locations={locations} setLocations={setLocations}  openEntity={openEntity}/>}
            {tab === "factions"  && <FactionsPanel    factions={factions}   setFactions={setFactions}    openEntity={openEntity}/>}
            {tab === "world-all" && <NPCsScreen       npcs={npcs}           setNPCs={setNPCs}            openEntity={openEntity}/>}
          </div>
        </>}

        {tab === "sessions"  && <SessionsScreen   sessions={sessions}   setSesjas={setSessions}      npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab === "quests"    && <QuestScreen       quests={quests}       setZadania={setQuests}       openEntity={openEntity}/>}
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
