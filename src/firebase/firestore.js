import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './index';
import {
  getSyncedRev, setSyncedRev, isDirty, clearDirty, clearSyncMarkers, syncableKeys,
} from '../utils/storage';

/* Identyfikator wersji dokumentu. Nieprzezroczysty — porownywany WYLACZNIE na
   rownosc, nigdy na kolejnosc. Dlatego rozjazd zegarow miedzy urzadzeniami nie
   wplywa na poprawnosc scalania (stary model porownywal Date.now() i tablet
   z zegarem do przodu na stale odrzucal dane z telefonu). */
const newRev = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

function readLocal(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) return { present: false, value: null };
  try { return { present: true, value: JSON.parse(raw) }; }
  catch { return { present: false, value: null }; }
}

function acceptCloud(key, value, rev) {
  localStorage.setItem(key, JSON.stringify(value));
  if (rev) setSyncedRev(key, rev);
  clearDirty(key);
}

/**
 * Zapisuje jeden klucz do Firestore. Po sukcesie klucz przestaje byc "brudny",
 * a jego `rev` staje sie wspolnym punktem odniesienia z chmura.
 */
export async function cloudSave(uid, key, value) {
  if (!db) return null;
  const rev = newRev();
  /* Firestore odrzuca pola o wartosci `undefined` (np. initiativeBonus jako
     sentinel "brak nadpisania") — round-trip przez JSON usuwa je rekurencyjnie.
     `value ?? null` chroni przed zgubieniem calego pola, gdy sama wartosc jest
     undefined: JSON.stringify wycialby wtedy klucz `value`, a reguly wymagaja
     jego obecnosci. */
  const payload = JSON.parse(JSON.stringify({ value: value ?? null, rev }));
  /* updatedAt dokladany PO round-tripie — serverTimestamp() to sentinel SDK,
     ktory nie przetrwalby serializacji. Znacznik jest serwerowy, wiec nie da sie
     go przesunac zegarem urzadzenia. Sluzy do prezentacji i do rozstrzygania
     konfliktow przez uzytkownika, nie do automatycznego scalania. */
  await setDoc(doc(db, 'users', uid, 'data', key), { ...payload, updatedAt: serverTimestamp() });
  setSyncedRev(key, rev);
  clearDirty(key);
  return rev;
}

/**
 * Scala chmure z localStorage. Nie nadpisuje niczego, czego uzytkownik nie
 * potwierdzil: kolizja lokalnych zmian z nowa wersja w chmurze konczy sie
 * wpisem w `conflicts`, nie cichym wyborem jednej ze stron.
 *
 * Zwraca { pulled, conflicts, legacy, error? } — listy kluczy.
 */
export async function syncFromCloud(uid) {
  const result = { pulled: [], conflicts: [], legacy: [] };
  if (!db) return result;
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'data'));
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (!('value' in data)) return;
      const key      = docSnap.id;
      const cloudRev = (typeof data.rev === 'string' && data.rev) ? data.rev : null;
      const local    = readLocal(key);

      // Brak danych lokalnych — nie ma czego stracic, bierzemy chmure.
      if (!local.present) {
        acceptCloud(key, data.value, cloudRev);
        result.pulled.push(key);
        return;
      }

      /* Dokument w starym formacie (bez `rev`) — brak wspolnego punktu
         odniesienia, wiec nie ryzykujemy nadpisania danych lokalnych. */
      if (!cloudRev) { result.legacy.push(key); return; }

      /* Chmura trzyma dokladnie te wersje, ktora juz znamy. Jesli mamy przy tym
         lokalne zmiany, sa one nowsze — zostaja i pojada przy najblizszym zapisie. */
      if (cloudRev === getSyncedRev(key)) return;

      // Chmura ma wersje, ktorej nie widzielismy.
      if (isDirty(key)) { result.conflicts.push(key); return; }

      acceptCloud(key, data.value, cloudRev);
      result.pulled.push(key);
    });
  } catch (e) {
    console.warn('[HeroJournal] Sync z chmury nieudany:', e.message);
    result.error = e.message;
  }
  return result;
}

/** Rozstrzygniecie konfliktu: zachowaj wersje lokalna — wypchnij ja do chmury. */
export async function resolveKeepLocal(uid, keys) {
  const failed = [];
  for (const key of keys) {
    const local = readLocal(key);
    if (!local.present) continue;
    try { await cloudSave(uid, key, local.value); }
    catch { failed.push(key); }
  }
  return { failed };
}

/** Rozstrzygniecie konfliktu: wez wersje z chmury dla wskazanych kluczy. */
export async function resolveTakeCloud(uid, keys) {
  if (!db) return { applied: [] };
  const wanted = new Set(keys);
  const applied = [];
  const snap = await getDocs(collection(db, 'users', uid, 'data'));
  snap.forEach(docSnap => {
    if (!wanted.has(docSnap.id)) return;
    const data = docSnap.data();
    if (!('value' in data)) return;
    const rev = (typeof data.rev === 'string' && data.rev) ? data.rev : null;
    acceptCloud(docSnap.id, data.value, rev);
    applied.push(docSnap.id);
  });
  return { applied };
}

/**
 * Awaryjne: to urzadzenie ma racje — wypchnij wszystkie lokalne klucze do
 * chmury z nowym `rev`. Po tym pozostale urzadzenia zobacza je jako nowa wersje.
 */
export async function forcePushAll(uid) {
  const keys = syncableKeys();
  const failed = [];
  let pushed = 0;
  for (const key of keys) {
    const local = readLocal(key);
    if (!local.present) continue;
    try { await cloudSave(uid, key, local.value); pushed++; }
    catch { failed.push(key); }
  }
  return { pushed, failed, total: keys.length };
}

/**
 * Awaryjne: chmura ma racje — zrob z tego urzadzenia jej dokladne odbicie.
 * Klucze, ktorych w chmurze nie ma, sa lokalnie USUWANE. Wolac tylko po tym,
 * jak urzadzenie-zrodlo wykonalo forcePushAll.
 */
export async function forcePullAll(uid) {
  if (!db) return { pulled: 0, removed: 0 };
  const snap = await getDocs(collection(db, 'users', uid, 'data'));
  const seen = new Set();
  let pulled = 0;
  snap.forEach(docSnap => {
    const data = docSnap.data();
    if (!('value' in data)) return;
    const rev = (typeof data.rev === 'string' && data.rev) ? data.rev : null;
    seen.add(docSnap.id);
    acceptCloud(docSnap.id, data.value, rev);
    pulled++;
  });
  let removed = 0;
  for (const key of syncableKeys()) {
    if (seen.has(key)) continue;
    localStorage.removeItem(key);
    clearSyncMarkers(key);
    removed++;
  }
  return { pulled, removed };
}
