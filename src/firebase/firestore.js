import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from './index';

/**
 * Pobiera wszystkie klucze użytkownika z Firestore i zapisuje do localStorage.
 * Wywołaj po zalogowaniu — przed pierwszym renderem aplikacji.
 */
export async function syncFromCloud(uid) {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'data'));
    snap.forEach(docSnap => {
      const { value, updatedAt } = docSnap.data();
      if (value === undefined) return;
      const localRaw = localStorage.getItem(docSnap.id);
      if (!localRaw) {
        // Brak danych lokalnych — zawsze pobierz z chmury
        localStorage.setItem(docSnap.id, JSON.stringify(value));
        return;
      }
      if (!updatedAt) {
        // Stary dokument bez timestampu — nie nadpisuj danych lokalnych
        return;
      }
      const localTs = Number(localStorage.getItem(`hj_ts_${docSnap.id}`) || 0);
      if (updatedAt > localTs) {
        // Chmura jest nowsza — nadpisz
        localStorage.setItem(docSnap.id, JSON.stringify(value));
        localStorage.setItem(`hj_ts_${docSnap.id}`, String(updatedAt));
      }
      // Lokalny jest nowszy lub równy — zostaw
    });
  } catch (e) {
    console.warn('[HeroJournal] Sync z chmury nieudany:', e.message);
  }
}

/**
 * Zapisuje jeden klucz do Firestore.
 * Wywoływane z debouncingiem po każdej zmianie stanu.
 */
export async function cloudSave(uid, key, value) {
  if (!db) return;
  /* Firestore odrzuca pola o wartości undefined (np. initiativeBonus jako
     sentinel "brak nadpisania") — JSON round-trip usuwa je rekurencyjnie,
     analogicznie do zapisu w localStorage. */
  const ts = Date.now();
  const sanitized = JSON.parse(JSON.stringify({ value, updatedAt: ts }));
  await setDoc(doc(db, 'users', uid, 'data', key), sanitized);
  // Aktualizuj lokalny timestamp — sync z innego urządzenia nie nadpisze
  // danych nowszych od tego zapisu
  localStorage.setItem(`hj_ts_${key}`, String(ts));
}
