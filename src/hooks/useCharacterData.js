import { useState, useCallback, useRef, useEffect } from 'react';
import { DEFAULT_CHAR } from '../constants/gameConstants';
import {
  CHAR_SLOTS, loadChar, saveChar,
  validateCharData, validateArray,
} from '../utils/storage';

export const EMPTY_DATA = {
  char: DEFAULT_CHAR,
  inventory: [], npcs: [], locations: [],
  skills: [], spells: [], sessions: [], quests: [], factions: [],
};

export function loadProfileData(id) {
  return {
    char:      validateCharData(loadChar("char",      id, null), DEFAULT_CHAR),
    inventory: validateArray(loadChar("inventory", id, null)),
    npcs:      validateArray(loadChar("npcs",      id, null)),
    locations: validateArray(loadChar("locations", id, null)),
    skills:    validateArray(loadChar("skills",    id, null)),
    spells:    validateArray(loadChar("spells",    id, null)),
    sessions:  validateArray(loadChar("sessions",  id, null)),
    quests:    validateArray(loadChar("quests",    id, null)),
    factions:  validateArray(loadChar("factions",  id, null)),
  };
}

/**
 * Skonsolidowany stan danych postaci.
 * Zastępuje 9 oddzielnych useState + 9 useEffect w HeroJournal.
 * Używa jednego obiektu `data` i per-slot setterów z porównaniem referencyjnym.
 */
export function useCharacterData(activeId) {
  const [data, setDataRaw] = useState(() =>
    activeId ? loadProfileData(activeId) : EMPTY_DATA
  );

  /* Per-slot settery — stable references (useCallback z pustymi deps) */
  const makeSet = useCallback(
    slot => fn => setDataRaw(d => ({
      ...d,
      [slot]: typeof fn === 'function' ? fn(d[slot]) : fn,
    })),
    []
  );

  const setChar      = useCallback(makeSet('char'), [makeSet]);
  const setInventory = useCallback(makeSet('inventory'), [makeSet]);
  const setNPCs      = useCallback(makeSet('npcs'), [makeSet]);
  const setLocations = useCallback(makeSet('locations'), [makeSet]);
  const setSkills    = useCallback(makeSet('skills'), [makeSet]);
  const setSpells    = useCallback(makeSet('spells'), [makeSet]);
  const setSessions  = useCallback(makeSet('sessions'), [makeSet]);
  const setQuests    = useCallback(makeSet('quests'), [makeSet]);
  const setFactions  = useCallback(makeSet('factions'), [makeSet]);

  /* Zapis tylko zmienionych slotów (diff przez referencję) */
  const prevRef = useRef(data);
  useEffect(() => {
    if (!activeId) return;
    const prev = prevRef.current;
    CHAR_SLOTS.forEach(slot => {
      if (data[slot] !== prev[slot]) saveChar(slot, activeId, data[slot]);
    });
    prevRef.current = data;
  }, [data, activeId]);

  return {
    data, setDataRaw,
    setChar, setInventory, setNPCs, setLocations,
    setSkills, setSpells, setSessions, setQuests, setFactions,
  };
}
