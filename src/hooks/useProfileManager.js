import { useState, useCallback } from 'react';
import {
  CHAR_SLOTS, saveChar, loadProfiles, saveProfiles,
  loadActiveId, saveActiveId, deleteCharData,
  migrateLegacy, migrateToEnums,
} from '../utils/storage';
import { createSampleHero } from '../constants/sampleHero';

/**
 * Zarządza listą profili, aktywnym ID i stanem ekranu (app/profiles/wizard).
 * NIE zarządza danymi postaci — HeroJournal koordynuje między tym hookiem
 * a useCharacterData, przekazując `setDataRaw` do działań które go potrzebują.
 */
export function useProfileManager() {
  const [profiles, setProfiles] = useState(() => {
    migrateLegacy();
    migrateToEnums();
    return loadProfiles();
  });

  const [activeId, setActiveId] = useState(() => {
    migrateLegacy();
    return loadActiveId();
  });

  const [screen, setScreen] = useState(() => {
    migrateLegacy();
    const przs = loadProfiles();
    const aid  = loadActiveId();
    if (przs.length === 0) return "wizard";
    if (!aid || !przs.find(p => p.id === aid)) return "profiles";
    return "app";
  });

  /* Przełącz profil — nie ładuje danych postaci (HeroJournal to robi) */
  const selectProfile = useCallback(id => {
    saveActiveId(id);
    setActiveId(id);
    setScreen("app");
  }, []);

  /* Zakończ kreator — przyjmuje newChar i profileMeta */
  const finishWizard = useCallback((id, newChar, profileMeta) => {
    CHAR_SLOTS.forEach(slot => saveChar(slot, id, slot === "char" ? newChar : []));
    const updated = [...loadProfiles(), { ...profileMeta, id }];
    saveProfiles(updated);
    saveActiveId(id);
    setProfiles(updated);
    setActiveId(id);
    setScreen("app");
    return { newChar };  // HeroJournal używa tego do ustawienia data
  }, []);

  /* Utwórz przykładowego bohatera */
  const createSample = useCallback(() => {
    const hero = createSampleHero();
    const { id, profile, char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = hero;
    const slots = { char, inventory, npcs, locations, skills, spells, sessions, quests, factions };
    CHAR_SLOTS.forEach(slot => saveChar(slot, id, slots[slot]));
    const updated = [...loadProfiles(), profile];
    saveProfiles(updated);
    saveActiveId(id);
    setProfiles(updated);
    setActiveId(id);
    setScreen("app");
    return slots;  // HeroJournal używa tego do ustawienia data
  }, []);

  /* Zmień nazwę profilu */
  const renameProfile = useCallback((profileId, newName, currentActiveId, setChar) => {
    const updated = loadProfiles().map(p => p.id === profileId ? { ...p, name: newName } : p);
    saveProfiles(updated);
    setProfiles(updated);
    if (profileId === currentActiveId && setChar) {
      setChar(c => ({ ...c, name: newName }));
    }
  }, []);

  /* Usuń profil */
  const deleteProfile = useCallback((id, currentActiveId, onSwitchProfile) => {
    deleteCharData(id);
    const updated = loadProfiles().filter(p => p.id !== id);
    saveProfiles(updated);
    setProfiles(updated);
    if (id === currentActiveId) {
      if (updated.length > 0) onSwitchProfile(updated[0].id);
      else { saveActiveId(null); setActiveId(null); setScreen("wizard"); }
    }
  }, []);

  return {
    profiles, setProfiles, activeId, setActiveId, screen, setScreen,
    selectProfile, finishWizard, createSample, renameProfile, deleteProfile,
  };
}
