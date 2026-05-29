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
      const { value } = docSnap.data();
      if (value !== undefined) {
        localStorage.setItem(docSnap.id, JSON.stringify(value));
      }
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
  await setDoc(doc(db, 'users', uid, 'data', key), { value });
}
