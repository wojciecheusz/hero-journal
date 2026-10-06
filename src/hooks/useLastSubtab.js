import { useCallback } from 'react';
import { EQUIPMENT_TABS, WORLD_TABS } from '../app/navigation';

/* Ostatnio otwarta podzakładka Wyposażenia / Świata (P29/A1–A2).
   Wygoda per urządzenie — trzymana w localStorage, nie synchronizowana. */
const KEYS = { equipment: 'hj_last_equipment_tab', world: 'hj_last_world_tab' };
const DEFAULTS = { equipment: EQUIPMENT_TABS[0], world: WORLD_TABS[0] };
const VALID = { equipment: EQUIPMENT_TABS, world: WORLD_TABS };

export function getLastSubtab(group) {
  try {
    const v = localStorage.getItem(KEYS[group]);
    return VALID[group].includes(v) ? v : DEFAULTS[group];
  } catch { return DEFAULTS[group]; }
}

export function rememberSubtab(tab) {
  const group = EQUIPMENT_TABS.includes(tab) ? 'equipment' : WORLD_TABS.includes(tab) ? 'world' : null;
  if (!group) return;
  try { localStorage.setItem(KEYS[group], tab); } catch { /* tryb prywatny — trudno */ }
}

/* Rozwiązuje zakładki-grupy ("equipment", "world-all") na konkretną podzakładkę. */
export function useResolveTab() {
  return useCallback(tab => {
    if (tab === 'equipment') return getLastSubtab('equipment');
    if (tab === 'world-all') return getLastSubtab('world');
    return tab;
  }, []);
}
