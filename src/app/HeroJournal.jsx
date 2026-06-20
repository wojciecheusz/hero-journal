import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useLocation } from 'wouter';
import {
  CHAR_SLOTS, saveChar, saveProfiles, load, save,
  exportProfileData, importProfileData,
} from '../utils/storage';
import { useTheme }         from '../hooks/useTheme';
import { useLanguage }      from '../hooks/useLanguage';
import { useCharacterData, EMPTY_DATA, loadProfileData } from '../hooks/useCharacterData';
import { useProfileManager } from '../hooks/useProfileManager';
import { useTextareaAutoResize } from '../hooks/useTextareaAutoResize';
import { useCloudSaveQueue } from '../hooks/useCloudSaveQueue';
import { getNavGroups, getNavGroupsDesktop } from './navigation';
import TutorialModal from './TutorialModal';
import DiceRoller from '../features/dice/DiceRoller';
import HelpPanel     from './HelpPanel';
import Sidebar       from './Sidebar';
import Header        from './Header';
import MobileNav     from './MobileNav';
import { RestModal } from '../features/character/widgets/RestModal';
import { LangContext, TRANSLATIONS } from '../i18n/translations';
import { ProfileScreen, HeroWizard } from '../features/profiles/ProfileScreen';
import { ResetModal } from '../shared/ui';
import ErrorBoundary from './ErrorBoundary';
import { setQuotaExceededHook } from '../utils/storage';
import Icon from '../shared/icons';

/* ── Lazy imports — każdy tab ładowany na żądanie ─────────────── */
const CharacterScreen  = lazy(() => import('../features/character/CharacterScreen'));
const InventoryScreen  = lazy(() => import('../features/inventory/InventoryScreen'));
const SkillsScreen     = lazy(() => import('../features/skills/SkillsScreen'));
const SpellsScreen     = lazy(() => import('../features/spells/SpellsScreen'));
const NPCsScreen       = lazy(() => import('../features/world/NPCsScreen'));
const LocationsScreen  = lazy(() => import('../features/world/LocationsScreen'));
const FactionsPanel    = lazy(() => import('../features/world/factions/FactionsPanel'));
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
  const [showReset, setShowReset]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp]         = useState(false);
  const [showDice, setShowDice]         = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !load("hj_tutorial_seen", null));
  const [openEntity, setOpenEntity] = useState(null);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [restModal, setRestModal] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [stanyOpen,      setStanyOpen]      = useState(false);
  const [deathOpen,      setDeathOpen]      = useState(false);
  const [exhOpen,        setExhOpen]        = useState(false);
  const [moreOpen,       setMoreOpen]       = useState(false);
  useEffect(() => {
    setQuotaExceededHook(() => setQuotaWarning(true));
  }, []);

  /* ── Auto-resize textarea (input listener + po zmianie taba/profilu) ── */
  useTextareaAutoResize(tab, activeId);

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
  const { syncWarning, syncFailed, dismissSyncError } = useCloudSaveQueue(user);

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

  const handleExport = useCallback(() => {
    const profileMeta = profiles.find(p => p.id === activeId);
    if (!profileMeta) return;
    const json = exportProfileData(activeId, profileMeta);
    const safeName = (profileMeta.name || 'hero').replace(/[^\wÀ-ž]/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = `hj_backup_${safeName}_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, [activeId, profiles]);

  const handleImport = useCallback((json) => {
    const newProfile = importProfileData(json);
    setProfiles(prev => {
      const updated = [...prev, newProfile];
      saveProfiles(updated);
      return updated;
    });
    switchProfile(newProfile.id);
  }, [switchProfile]);

  const handleReset = useCallback(() => {
    if (!activeId) return;
    CHAR_SLOTS.forEach(slot => saveChar(slot, activeId, EMPTY_DATA[slot]));
    setDataRaw(EMPTY_DATA);
    setShowReset(false);
  }, [activeId, setDataRaw]);

  /* ── Skróty do danych ────────────────────────────────────────── */
  const { char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = data;
  const pb = char.profBonus || 2;

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
  const contentTopBase = 345; // brand + identity + hp (z wbudowanymi +/-) + xp + mini-stats + 2 btn rows + spacing
  const contentTopExtra =
    (moreOpen  ? 195 : 0) +
    (stanyOpen ?  82 : 0) +
    (deathOpen ?  78 : 0) +
    (exhOpen   ?  68 : 0);
  const contentTop = panelCollapsed
    ? "calc(env(safe-area-inset-top, 0px) + 62px)"
    : `calc(env(safe-area-inset-top, 0px) + ${contentTopBase + contentTopExtra}px)`;

  return (
    <LangContext.Provider value={lang}>
    <div className="hj-root" style={{ "--hj-content-top": contentTop }}>
      {showReset && <ResetModal onConfirm={handleReset} onCancel={() => setShowReset(false)}/>}
      {restModal && <RestModal type={restModal} char={char} setChar={setChar} onClose={() => setRestModal(null)}/>}
      {syncWarning && !syncFailed && (
        <div style={{ position:"fixed", bottom:"calc(var(--hj-nav-h,56px) + 0.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:500, background:"rgba(40,32,8,0.95)", border:"1px solid #8a7020", color:"#d4aa40", fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.35rem 0.8rem", display:"flex", gap:"0.4rem", alignItems:"center", borderRadius:"3px", maxWidth:"90vw", boxShadow:"0 2px 8px rgba(0,0,0,0.4)", pointerEvents:"none" }}>
          <Icon name="cloud" size="0.9em"/> Synchronizacja…
        </div>
      )}
      {syncFailed && (
        <div style={{ position:"fixed", bottom:"calc(var(--hj-nav-h,56px) + 0.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:500, background:"#5a1a1a", border:"1px solid #8a3a3a", color:"#f0c0c0", fontFamily:"Cinzel,serif", fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.5rem 1rem", display:"flex", gap:"0.8rem", alignItems:"center", borderRadius:"3px", maxWidth:"90vw", boxShadow:"0 4px 16px rgba(0,0,0,0.5)" }}>
          <span style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}><Icon name="cloud" size="0.9em"/> Błąd synchronizacji — dane zapisane lokalnie</span>
          <button onClick={dismissSyncError}
            style={{ background:"transparent", border:"none", color:"inherit", cursor:"pointer", lineHeight:1, padding:0, flexShrink:0, display:"flex" }}><Icon name="close" size="0.9em"/></button>
        </div>
      )}
      {showTutorial && <TutorialModal theme={theme} onClose={() => { setShowTutorial(false); save("hj_tutorial_seen","1"); }}/>}
      {/* HelpPanel — tylko na mobile (sidebar przejmuje rolę na desktop) */}
      {showHelp && <HelpPanel tab={tab} theme={theme} onClose={() => setShowHelp(false)}/>}

      {/* ── Sidebar (desktop only) ── */}
      <Sidebar T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage} char={char} setChar={setChar} pb={pb}
        tab={tab} setTab={setTab} navGroupsDesktop={navGroupsDesktop}
        showHelp={showHelp} setShowHelp={setShowHelp} showSettings={showSettings} setShowSettings={setShowSettings}
        setScreen={setScreen} setShowReset={setShowReset} user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
        onExport={handleExport} onImport={handleImport} onRestModal={setRestModal}/>

      {/* ── Header (mobile only) — zawiera pasek HP + mini-statsy ── */}
      <Header T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage} char={char} tab={tab}
        showHelp={showHelp} setShowHelp={setShowHelp} showSettings={showSettings} setShowSettings={setShowSettings}
        setScreen={setScreen} setShowReset={setShowReset} user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
        onExport={handleExport} onImport={handleImport}
        setChar={setChar} pb={pb} onRestModal={setRestModal}
        panelCollapsed={panelCollapsed} setPanelCollapsed={setPanelCollapsed}
        stanyOpen={stanyOpen} setStanyOpen={setStanyOpen}
        deathOpen={deathOpen} setDeathOpen={setDeathOpen}
        exhOpen={exhOpen}     setExhOpen={setExhOpen}
        moreOpen={moreOpen}   setMoreOpen={setMoreOpen}/>

      {quotaWarning && (
        <div role="alert" style={{ position:"fixed", bottom:"4.5rem", left:"50%", transform:"translateX(-50%)", zIndex:9999, background:"var(--hj-accent,#cc2233)", color:"#fff", fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.5rem 1rem", borderRadius:"2px", display:"flex", gap:"0.75rem", alignItems:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.5)" }}>
          <span>Storage full — data not saved</span>
          <button onClick={() => setQuotaWarning(false)} style={{ background:"none", border:"none", color:"inherit", cursor:"pointer", lineHeight:1, padding:0, display:"flex" }}><Icon name="close" size="0.9em"/></button>
        </div>
      )}

      <main className="hj-content">
      <ErrorBoundary>
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
      </ErrorBoundary>
      </main>

      <MobileNav navGroups={navGroups} tab={tab} setTab={setTab}/>

      {/* ── Rzutnik kości — FAB + panel ── */}
      <button className={`dice-fab${showDice ? ' open' : ''}`}
        onClick={() => setShowDice(s => !s)}
        aria-label={T.DICE.title} title={T.DICE.title}>
        <Icon name="dice" size="1.3rem"/>
      </button>
      {showDice && <DiceRoller onClose={() => setShowDice(false)}/>}
    </div>
    </LangContext.Provider>
  );
}
