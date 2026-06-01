import { useState, useEffect, useRef, useCallback } from 'react';
import { THEMES, PALETTES, PALETTE_LABELS } from '../theme/themes';
import { DEFAULT_CHAR } from '../constants/gameConstants';
import {
  CHAR_SLOTS, loadChar, saveChar, loadProfiles, saveProfiles,
  loadActiveId, saveActiveId, migrateLegacy, deleteCharData, load, save,
  setCloudSaveHook,
} from '../utils/storage';
import { NAV_GROUPS } from './navigation';
import { createSampleHero } from '../constants/sampleHero';
import { cloudSave } from '../firebase/firestore';
import { ProfileScreen, PostaćWizard } from '../features/profiles/ProfileScreen';
import { ResetModal } from '../shared/ui';
import CharacterScreen  from '../features/character/CharacterScreen';
import InventoryScreen  from '../features/inventory/InventoryScreen';
import SkillsScreen     from '../features/skills/SkillsScreen';
import SpellsScreen     from '../features/spells/SpellsScreen';
import NPCsScreen       from '../features/world/NPCsScreen';
import LocationsScreen  from '../features/world/LocationsScreen';
import FactionsPanel    from '../features/factions/FactionsPanel';
import SessionsScreen   from '../features/sessions/SessionsScreen';
import QuestScreen      from '../features/quests/QuestScreen';
import CompendiumScreen from '../features/compendium/CompendiumScreen';

/* Aplikuje zmienne CSS motywu na :root — synchronicznie, bez FOUC */
export function applyThemeVars(t) {
  const r = document.documentElement;
  const set = (k, v) => r.style.setProperty(k, v);
  set('--hj-bg',               t.bg);
  set('--hj-bg-card',          t.bgCard);
  set('--hj-bg-input',         t.bgInput);
  set('--hj-bg-nav',           t.navBg ?? t.bgNav ?? t.bg);
  set('--hj-border',           t.border);
  set('--hj-border-sub',       t.borderSub);
  set('--hj-border-input',     t.borderInput);
  set('--hj-text',             t.text);
  set('--hj-text-muted',       t.textMuted);
  set('--hj-text-dim',         t.textDim);
  set('--hj-text-label',       t.textLabel);
  set('--hj-accent',           t.accent);
  set('--hj-accent-border',    t.accentBorder);
  set('--hj-header-bg',        t.headerBg);
  set('--hj-nav-bg',           t.navBg);
  set('--hj-scroll-track',     t.scrollTrack);
  set('--hj-scroll-thumb',     t.scrollThumb);
  set('--hj-noise',            t.noise);
  set('--hj-shadow-bot',       t.shadowBot);
  set('--hj-shadow-card',      t.shadowCard);
  set('--hj-inner-div-bg',     t.innerDivBg);
  set('--hj-hp-bg',            t.hpBg);
  set('--hj-add-form',         t.addForm);
  set('--hj-modal-bg',         t.modalBg);
  set('--hj-empty-color',      t.emptyColor);
  set('--hj-sess-entry',       t.sessEntry);
  set('--hj-combat-box',       t.combatBox);
  set('--hj-spell-slot-box',   t.spellSlotBox);
  set('--hj-spell-slot-border',t.spellSlotBorder);
  set('--hj-pack-item',        t.packItem);
  set('--hj-pack-item-border', t.packItemBorder);
  set('--hj-pack-field-input', t.packFieldInput);
  set('--spell-accent',        t.spellAccent);
  set('--spell-border',        t.spellBorder);
  set('--spell-muted',         t.spellMuted);
  set('--spell-dim',           t.spellDim);
  set('--spell-text',          t.spellText);
  set('--spell-bg',            t.spellBg);
  set('--quest-reward',        t.questReward);
  set('--hj-selected-bg',      t.selectedBg);
  set('--pip-prof',            t.accent);
  set('--pip-exp',             t.spellAccent);
  set('--pip-empty',           t.borderInput);
  set('--text-label',          t.textLabel);
  set('--text-muted',          t.textMuted);
  set('--text-dim',            t.textDim);
}

const EMPTY_DATA = {
  char: DEFAULT_CHAR, inventory: [], npcs: [], locations: [],
  skills: [], spells: [], sessions: [], quests: [], factions: [],
};

function loadProfileData(id) {
  return {
    char:      loadChar("char",      id, DEFAULT_CHAR),
    inventory: loadChar("inventory", id, []),
    npcs:      loadChar("npcs",      id, []),
    locations: loadChar("locations", id, []),
    skills:    loadChar("skills",    id, []),
    spells:    loadChar("spells",    id, []),
    sessions:  loadChar("sessions",  id, []),
    quests:    loadChar("quests",    id, []),
    factions:  loadChar("factions",  id, []),
  };
}

export default function HeroJournal({ user = null, onLogout = null, onCloudRefresh = null }) {
  const [theme, setTheme] = useState(() => {
    const s = load("hj_theme", "mrok");
    const name = PALETTES.includes(s) ? s : "mrok";
    applyThemeVars(THEMES[name] || THEMES.mrok);
    return name;
  });

  const [profiles, setProfiles] = useState(() => { migrateLegacy(); return loadProfiles(); });
  const [activeId, setActiveId] = useState(() => { migrateLegacy(); return loadActiveId(); });
  const [screen, setScreen]     = useState(() => {
    migrateLegacy();
    const przs = loadProfiles();
    const aid  = loadActiveId();
    if (przs.length === 0) return "wizard";
    if (!aid || !przs.find(p => p.id === aid)) return "profiles";
    return "app";
  });

  const [tab, setTab]               = useState("character");
  const [openGroup, setOpenGroup]   = useState(null);
  const [showReset, setShowReset]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [openEntity, setOpenEntity] = useState(null);

  /* ── Skonsolidowany stan danych postaci ─────────────────────── */
  const [data, setDataRaw] = useState(() =>
    activeId ? loadProfileData(activeId) : EMPTY_DATA
  );

  const setChar      = useCallback(fn => setDataRaw(d => ({ ...d, char:      typeof fn === 'function' ? fn(d.char)      : fn })), []);
  const setInventory = useCallback(fn => setDataRaw(d => ({ ...d, inventory: typeof fn === 'function' ? fn(d.inventory) : fn })), []);
  const setNPCs      = useCallback(fn => setDataRaw(d => ({ ...d, npcs:      typeof fn === 'function' ? fn(d.npcs)      : fn })), []);
  const setLocations = useCallback(fn => setDataRaw(d => ({ ...d, locations: typeof fn === 'function' ? fn(d.locations) : fn })), []);
  const setSkills    = useCallback(fn => setDataRaw(d => ({ ...d, skills:    typeof fn === 'function' ? fn(d.skills)    : fn })), []);
  const setSpells    = useCallback(fn => setDataRaw(d => ({ ...d, spells:    typeof fn === 'function' ? fn(d.spells)    : fn })), []);
  const setSessions  = useCallback(fn => setDataRaw(d => ({ ...d, sessions:  typeof fn === 'function' ? fn(d.sessions)  : fn })), []);
  const setQuests    = useCallback(fn => setDataRaw(d => ({ ...d, quests:    typeof fn === 'function' ? fn(d.quests)    : fn })), []);
  const setFactions  = useCallback(fn => setDataRaw(d => ({ ...d, factions:  typeof fn === 'function' ? fn(d.factions)  : fn })), []);

  /* ── Motyw ──────────────────────────────────────────────────── */
  useEffect(() => {
    applyThemeVars(THEMES[theme] || THEMES.mrok);
    save("hj_theme", theme);
  }, [theme]);

  /* ── Zapis danych (tylko zmienione sloty) ────────────────────── */
  const prevDataRef = useRef(data);
  useEffect(() => {
    if (!activeId) return;
    const prev = prevDataRef.current;
    CHAR_SLOTS.forEach(slot => {
      if (data[slot] !== prev[slot]) saveChar(slot, activeId, data[slot]);
    });
    prevDataRef.current = data;
  }, [data, activeId]);

  /* ── Synchronizacja metadanych profilu ───────────────────────── */
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
    return () => { setCloudSaveHook(null); queue.forEach(clearTimeout); queue.clear(); };
  }, [user?.uid]);

  /* ── Nawigacja ───────────────────────────────────────────────── */
  const handleNavigate = useCallback((tt, name = null) => {
    setTab(tt);
    setOpenEntity(name ? { tab: tt, name } : null);
  }, []);

  /* ── Zarządzanie profilami ───────────────────────────────────── */
  const switchProfile = useCallback(id => {
    saveActiveId(id);
    setActiveId(id);
    setDataRaw(loadProfileData(id));
    setTab("character");
    setScreen("app");
  }, []);

  const handleWizardFinish = useCallback((id, newChar, profileMeta) => {
    CHAR_SLOTS.forEach(slot => saveChar(slot, id, slot === "char" ? newChar : []));
    const updated = [...loadProfiles(), { ...profileMeta, id }];
    saveProfiles(updated);
    saveActiveId(id);
    setProfiles(updated);
    setDataRaw({ ...EMPTY_DATA, char: newChar });
    setActiveId(id);
    setTab("character");
    setScreen("app");
  }, []);

  const handleSampleCreate = useCallback(() => {
    const { id, profile, char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = createSampleHero();
    const slots = { char, inventory, npcs, locations, skills, spells, sessions, quests, factions };
    CHAR_SLOTS.forEach(slot => saveChar(slot, id, slots[slot]));
    const updated = [...loadProfiles(), profile];
    saveProfiles(updated);
    saveActiveId(id);
    setProfiles(updated);
    setDataRaw(slots);
    setActiveId(id);
    setTab("character");
    setScreen("app");
  }, []);

  const handleRename = useCallback((profileId, newName) => {
    const updated = loadProfiles().map(p => p.id === profileId ? { ...p, name: newName } : p);
    saveProfiles(updated);
    setProfiles(updated);
    if (profileId === activeId) setChar(c => ({ ...c, name: newName }));
  }, [activeId, setChar]);

  const handleDelete = useCallback(id => {
    deleteCharData(id);
    const updated = loadProfiles().filter(p => p.id !== id);
    saveProfiles(updated);
    setProfiles(updated);
    if (id === activeId) {
      if (updated.length > 0) switchProfile(updated[0].id);
      else { saveActiveId(null); setActiveId(null); setScreen("wizard"); }
    }
  }, [activeId, switchProfile]);

  const handleReset = useCallback(() => {
    if (!activeId) return;
    CHAR_SLOTS.forEach(slot => saveChar(slot, activeId, EMPTY_DATA[slot]));
    setDataRaw(EMPTY_DATA);
    setShowReset(false);
  }, [activeId]);

  /* ── Skróty do danych ────────────────────────────────────────── */
  const { char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = data;

  /* ── Ekrany pomocnicze ───────────────────────────────────────── */
  if (screen === "profiles") return (
    <ProfileScreen
      profiles={profiles} activeId={activeId} theme={theme}
      onSelect={switchProfile} onCreate={() => setScreen("wizard")}
      onDelete={handleDelete} onCreateSample={handleSampleCreate}
      onRename={handleRename}
    />
  );

  if (screen === "wizard") return (
    <PostaćWizard
      theme={theme} onFinish={handleWizardFinish}
      onAnuluj={profiles.length > 0 ? () => setScreen("profiles") : undefined}
    />
  );

  /* ── Główny widok aplikacji ───────────────────────────────────── */
  return (
    <div className="hj-root">
      {showReset && <ResetModal onConfirm={handleReset} onAnuluj={() => setShowReset(false)}/>}

      <header className="hj-header">
        <div style={{ maxWidth:780, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>

          {/* Logo + imię bohatera */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.55rem", flex:1, minWidth:0, cursor:"pointer" }}
            onClick={() => setScreen("profiles")} title="Zmień bohatera">
            <div className="hj-logo">⚔ HJ</div>
            <span className="hj-char-name">{char.name?.trim() || "Bohater"}</span>
            <div style={{ flexShrink:0, width:26, height:26, borderRadius:"50%", border:"1px solid var(--hj-border-input)", background:"var(--hj-bg-input)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--hj-text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="currentColor"/>
                <path d="M4 20c0-3.87 3.58-7 8-7s8 3.13 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Panel ustawień */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <button onClick={() => setShowSettings(s => !s)} title="Ustawienia"
              style={{ background:showSettings?"rgba(226,185,78,0.1)":"transparent", border:`1px solid ${showSettings?"var(--hj-accent-border)":"var(--hj-border-input)"}`, color:showSettings?"var(--hj-accent)":"var(--hj-text-muted)", fontSize:"1.1rem", lineHeight:1, width:32, height:32, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              ⚙
            </button>
            {showSettings && <>
              <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={() => setShowSettings(false)}/>
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"var(--hj-modal-bg)", border:"1px solid var(--hj-border)", boxShadow:"0 8px 32px var(--hj-shadow-bot)", zIndex:200, width:230, borderRadius:"2px" }}>
                <div style={{ padding:"0.6rem 0.7rem 0.4rem" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--hj-text-muted)", marginBottom:"0.5rem" }}>Motyw kolorystyczny</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.25rem" }}>
                    {PALETTES.map(p => (
                      <button key={p} onClick={() => setTheme(p)}
                        style={{ background:theme===p?"rgba(226,185,78,0.12)":"transparent", border:`1px solid ${theme===p?"var(--hj-accent-border)":"var(--hj-border-sub)"}`, color:theme===p?"var(--hj-accent)":"var(--hj-text)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.04em", padding:"0.3rem 0.4rem", cursor:"pointer", textAlign:"left", transition:"all 0.12s", borderRadius:"2px" }}>
                        {PALETTE_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop:"1px solid var(--hj-border-sub)", padding:"0.4rem 0.5rem", display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                  <button onClick={() => { setShowReset(true); setShowSettings(false); }}
                    style={{ background:"transparent", border:"1px solid #6a2a2a", color:"#c04040", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                    ↺ Reset postaci
                  </button>
                  {user && onCloudRefresh && (
                    <button onClick={() => { onCloudRefresh(); setShowSettings(false); }}
                      style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                      ☁ Synchronizuj dane
                    </button>
                  )}
                  {user && onLogout && (
                    <button onClick={() => { onLogout(); setShowSettings(false); }}
                      style={{ background:"transparent", border:"1px solid var(--hj-border-input)", color:"var(--hj-text-muted)", fontFamily:"Cinzel,serif", fontSize:"0.58rem", letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.35rem 0.6rem", cursor:"pointer", textAlign:"left", borderRadius:"2px", transition:"all 0.15s" }}>
                      ⎋ Wyloguj ({(user.displayName || user.email || "").split(/[\s@]/)[0]})
                    </button>
                  )}
                </div>
              </div>
            </>}
          </div>
        </div>
      </header>

      <main className="hj-content">
        {tab === "character" && <CharacterScreen char={char} setChar={setChar} inventory={inventory} skills={skills} spells={spells}/>}
        {tab === "inventory" && <InventoryScreen inventory={inventory} setInventory={setInventory} openEntity={openEntity}/>}
        {tab === "skills"    && <SkillsScreen    skills={skills}       setUmiejętności={setSkills}  openEntity={openEntity}/>}
        {tab === "spells"    && <SpellsScreen     spells={spells}       setCzary={setSpells}         char={char} setChar={setChar}/>}
        {tab === "npcs"      && <NPCsScreen       npcs={npcs}           setNPCs={setNPCs}            openEntity={openEntity}/>}
        {tab === "locations" && <LocationsScreen  locations={locations} setLocations={setLocations}  openEntity={openEntity}/>}
        {tab === "factions"  && <FactionsPanel    factions={factions}   setFactions={setFactions}    openEntity={openEntity}/>}
        {tab === "sessions"  && <SessionsScreen   sessions={sessions}   setSesjas={setSessions}      npcs={npcs} locations={locations} quests={quests} inventory={inventory} skills={skills} onNavigate={handleNavigate}/>}
        {tab === "quests"    && <QuestScreen       quests={quests}       setZadania={setQuests}       openEntity={openEntity}/>}
        {tab.startsWith("compendium") && <CompendiumScreen activeTab={tab.replace("compendium-", "")} key={tab}/>}
      </main>

      {/* Szuflada nawigacyjna */}
      {openGroup && <div className="nav-drawer-overlay" onClick={() => setOpenGroup(null)}/>}
      {openGroup && (() => {
        const group = NAV_GROUPS.find(g => g.id === openGroup);
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
        {NAV_GROUPS.map(g => {
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
  );
}
