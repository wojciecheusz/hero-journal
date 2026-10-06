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
import { getNavGroupsDesktop, isEquipmentTab, isWorldTab } from './navigation';
import { useResolveTab, rememberSubtab } from '../hooks/useLastSubtab';
import SubTabBar from './SubTabBar';
import TutorialModal from './TutorialModal';
import DiceRoller from '../features/dice/DiceRoller';
import HelpPanel     from './HelpPanel';
import SettingsMenu  from './SettingsMenu';
import { Popover }   from '../shared/Overlay';
import Sidebar       from './Sidebar';
import AppBar        from './AppBar';
import Header        from './Header';
import MobileHeroPanel from './hero/MobileHeroPanel';
import MobileNav     from './MobileNav';
import { RestModal } from '../features/character/widgets/RestModal';
import { LangContext, TRANSLATIONS, useT } from '../i18n/translations';
import { ProfileScreen, HeroWizard } from '../features/profiles/ProfileScreen';
import { ResetModal } from '../shared/ui';
import ErrorBoundary from './ErrorBoundary';
import { setQuotaExceededHook } from '../utils/storage';
import Icon from '../shared/icons';
import { totalLevelOf } from '../utils/character';

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

/* Przycisk rzutnika kości schowany na razie -- ustaw true, aby przywrócić */
const DICE_FAB_ENABLED = false;

/* Loader wyświetlany podczas ładowania chunka */
function TabLoader() {
  const T = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"4rem 2rem", color:"var(--hj-text-dim)", fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase" }}>
      {T.UI.loadingTab}
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
  const resolveTab = useResolveTab();
  /* "equipment" / "world-all" to grupy — rozwijamy je do ostatnio otwartej
     podzakładki (P29/A1–A2), także dla starych linków z hasha. */
  const tab = resolveTab(VALID_TABS.has(tabFromUrl) ? tabFromUrl : "character");
  const setTab = useCallback((t) => navigate("/" + resolveTab(t)), [navigate, resolveTab]);
  useEffect(() => {
    rememberSubtab(tab);
    if (tabFromUrl !== tab) navigate("/" + tab, { replace: true }); // stare linki #/equipment, #/world-all
  }, [tab, tabFromUrl, navigate]);

  /* ── UI state (pozostaje w HeroJournal — czysto prezentacyjny) ── */
  const [showReset, setShowReset]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp]         = useState(false);
  const [showDice, setShowDice]         = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !load("hj_tutorial_seen", null));
  const [openEntity, setOpenEntity] = useState(null);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [restModal, setRestModal] = useState(null);
  useEffect(() => {
    setQuotaExceededHook(() => setQuotaWarning(true));
  }, []);
  /* Stabilne referencje — Drawer/Popover rejestrują na nich obsługę Escape */
  const closeHelp     = useCallback(() => setShowHelp(false), []);
  const closeSettings = useCallback(() => setShowSettings(false), []);

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
        level: data.char.classes?.length ? totalLevelOf(data.char) : p.level,
        icon:  data.char.icon || p.icon,
      });
      saveProfiles(updated);
      return updated;
    });
  }, [data.char.name, data.char.classes, data.char.icon, activeId]);

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
  const navGroupsDesktop = getNavGroupsDesktop(lang);  // sidebar + dolne menu mobilne

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
      {restModal && <RestModal type={restModal} char={char} setChar={setChar} inventory={inventory} setInventory={setInventory} onClose={() => setRestModal(null)}/>}
      {syncWarning && !syncFailed && (
        <div style={{ position:"fixed", bottom:"calc(var(--hj-nav-h,56px) + 0.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:500, background:"rgba(40,32,8,0.95)", border:"1px solid #8a7020", color:"#d4aa40", fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.35rem 0.8rem", display:"flex", gap:"0.4rem", alignItems:"center", borderRadius:"3px", maxWidth:"90vw", boxShadow:"0 2px 8px rgba(0,0,0,0.4)", pointerEvents:"none" }}>
          <Icon name="cloud" size="0.9em"/> {T.SYNC.running}
        </div>
      )}
      {syncFailed && (
        <div style={{ position:"fixed", bottom:"calc(var(--hj-nav-h,56px) + 0.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:500, background:"#5a1a1a", border:"1px solid #8a3a3a", color:"#f0c0c0", fontFamily:"Cinzel,serif", fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.5rem 1rem", display:"flex", gap:"0.8rem", alignItems:"center", borderRadius:"3px", maxWidth:"90vw", boxShadow:"0 4px 16px rgba(0,0,0,0.5)" }}>
          <span style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}><Icon name="cloud" size="0.9em"/> {T.SYNC.failedLocal}</span>
          <button onClick={dismissSyncError}
            style={{ background:"transparent", border:"none", color:"inherit", cursor:"pointer", lineHeight:1, padding:0, flexShrink:0, display:"flex" }}><Icon name="close" size="0.9em"/></button>
        </div>
      )}
      {showTutorial && <TutorialModal theme={theme} onClose={() => { setShowTutorial(false); save("hj_tutorial_seen","1"); }}/>}
      {/* Pomoc kontekstowa — szuflada na każdej szerokości (P29/D7) */}
      {showHelp && <HelpPanel tab={tab} onClose={closeHelp}/>}
      {/* Ustawienia — popover w portalu, nie przycinany przez sidebar (P29/D8) */}
      {showSettings && (
        <Popover className="settings-pop" onClose={closeSettings} label={T.UI.settings}>
          <SettingsMenu T={T} theme={theme} setTheme={setTheme} toggleLanguage={toggleLanguage}
            setScreen={setScreen} setShowReset={setShowReset} onClose={closeSettings}
            user={user} onCloudRefresh={onCloudRefresh} onLogout={onLogout}
            onExport={handleExport} onImport={handleImport}/>
        </Popover>
      )}

      {/* ── Sidebar (desktop ≥1024px) ── */}
      <Sidebar T={T} char={char} setChar={setChar} pb={pb}
        setScreen={setScreen} onRestModal={setRestModal}/>

      {/* ── Górny pasek z zakładkami (desktop ≥1024px, P34) ── */}
      <AppBar T={T} navGroups={navGroupsDesktop} tab={tab} setTab={setTab}
        showHelp={showHelp} setShowHelp={setShowHelp} showSettings={showSettings} setShowSettings={setShowSettings}/>

      {/* ── Górny pasek (telefon / tablet w pionie) ── */}
      <Header T={T} char={char} setChar={setChar}
        showHelp={showHelp} setShowHelp={setShowHelp} showSettings={showSettings} setShowSettings={setShowSettings}/>

      {quotaWarning && (
        <div role="alert" style={{ position:"fixed", bottom:"4.5rem", left:"50%", transform:"translateX(-50%)", zIndex:9999, background:"var(--hj-accent,#cc2233)", color:"#fff", fontFamily:"Cinzel,serif", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.5rem 1rem", borderRadius:"2px", display:"flex", gap:"0.75rem", alignItems:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.5)" }}>
          <span>{T.UI.storageFull}</span>
          <button onClick={() => setQuotaWarning(false)} style={{ background:"none", border:"none", color:"inherit", cursor:"pointer", lineHeight:1, padding:0, display:"flex" }}><Icon name="close" size="0.9em"/></button>
        </div>
      )}

      <main className="hj-content">
      <ErrorBoundary>
      <Suspense fallback={<TabLoader/>}>
        {tab === "character" && <MobileHeroPanel T={T} char={char} setChar={setChar} pb={pb}
          onRestModal={setRestModal} onChangeHero={() => setScreen("profiles")}/>}
        {tab === "character" && <CharacterScreen char={char} setChar={setChar} inventory={inventory} setInventory={setInventory} skills={skills} setSkills={setSkills} spells={spells} setSpells={setSpells}/>}

        {/* ── Wyposażenie: podzakładki na górze, jedna lista na cały obszar (P29/A1) ── */}
        {isEquipmentTab(tab) && <>
          <SubTabBar label={T.NAV.equipment} active={tab} onSelect={setTab} tabs={[
            { id:"inventory", label:T.CHAR.tabItems,     icon:"backpack", count: inventory.length },
            { id:"skills",    label:T.CHAR.tabAbilities, icon:"sparkles", count: skills.length },
            { id:"spells",    label:T.CHAR.tabSpells,    icon:"wand",     count: spells.length },
          ]}/>
          {tab === "inventory" && <InventoryScreen inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>}
          {tab === "skills"    && <SkillsScreen    skills={skills}       setSkills={setSkills}       openEntity={openEntity}/>}
          {tab === "spells"    && <SpellsScreen    spells={spells}       setSpells={setSpells}       char={char} setChar={setChar}/>}
        </>}

        {/* ── Świat: podzakładki jak w Wyposażeniu (P29/A2) ── */}
        {isWorldTab(tab) && <>
          <SubTabBar label={T.NAV.world} active={tab} onSelect={setTab} tabs={[
            { id:"npcs",      label:T.NAV.npcs,      icon:"users", count: npcs.length },
            { id:"locations", label:T.NAV.locations, icon:"map",   count: locations.length },
            { id:"factions",  label:T.NAV.factions,  icon:"flag",  count: factions.length },
          ]}/>
          {tab === "npcs"      && <NPCsScreen      npcs={npcs}           setNPCs={setNPCs}           openEntity={openEntity}/>}
          {tab === "locations" && <LocationsScreen locations={locations} setLocations={setLocations} openEntity={openEntity}/>}
          {tab === "factions"  && <FactionsPanel   factions={factions}   setFactions={setFactions}   openEntity={openEntity}/>}
        </>}

        {tab === "sessions"  && <SessionsScreen   sessions={sessions}   setSessions={setSessions}      npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab === "quests"    && <QuestScreen       quests={quests}       setQuests={setQuests}       openEntity={openEntity}/>}
      </Suspense>
      </ErrorBoundary>
      </main>

      <MobileNav navGroups={navGroupsDesktop} tab={tab} setTab={setTab}/>

      {/* ── Rzutnik kości — FAB + panel (ukryty na razie, DICE_FAB_ENABLED) ── */}
      {DICE_FAB_ENABLED && (
        <button className={`dice-fab${showDice ? ' open' : ''}`}
          onClick={() => setShowDice(s => !s)}
          aria-label={T.DICE.title} title={T.DICE.title}>
          <Icon name="dice" size="1.3rem"/>
        </button>
      )}
      {DICE_FAB_ENABLED && showDice && <DiceRoller onClose={() => setShowDice(false)}/>}
    </div>
    </LangContext.Provider>
  );
}
