export let _cloudSaveHook = null;
export const setCloudSaveHook = fn => { _cloudSaveHook = fn; };

export const CHAR_SLOTS = ["char","inventory","npcs","locations","skills","spells","sessions","quests","factions"];

export const load    = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
export const save    = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} _cloudSaveHook?.(key, val); };

const charKey              = (slot, id) => `hj_${slot}_${id}`;
export const loadChar       = (slot, id, fb) => load(charKey(slot, id), fb);
export const saveChar       = (slot, id, val) => save(charKey(slot, id), val);
export const deleteCharData = id => CHAR_SLOTS.forEach(s => localStorage.removeItem(`hj_${s}_${id}`));

export const loadProfiles  = () => load("hj_profiles", []);
export const saveProfiles  = p  => save("hj_profiles", p);
export const loadActiveId  = () => load("hj_active_profile", null);
export const saveActiveId  = id => save("hj_active_profile", id);

export const migrateLegacy = () => {
  if (loadProfiles().length > 0) return;
  const legacyChar = load("hj_char", null);
  if (!legacyChar) return;
  const id = "profile_" + Date.now();
  CHAR_SLOTS.forEach(slot => {
    const val = load("hj_" + slot, null);
    if (val !== null) saveChar(slot, id, val);
  });
  saveProfiles([{
    id,
    name:    legacyChar.name?.trim() || "Mój Bohater",
    class:   (legacyChar.classes || [{name:""}])[0]?.name || "",
    level:   (legacyChar.classes || [{level:1}])[0]?.level || 1,
    created: Date.now(),
  }]);
  saveActiveId(id);
};
