import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './index';
import { getSyncedRev, setSyncedRev, isDirty, clearDirty, syncableKeys } from '../utils/storage';

/* Identyfikator wersji dokumentu. Nieprzezroczysty — porownywany WYLACZNIE na
   rownosc, nigdy na kolejnosc. Dlatego rozjazd zegarow miedzy urzadzeniami nie
   wplywa na poprawnosc scalania. */
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
     ktory nie przetrwalby serializacji. */
  await setDoc(doc(db, 'users', uid, 'data', key), { ...payload, updatedAt: serverTimestamp() });
  setSyncedRev(key, rev);
  clearDirty(key);
  return rev;
}

/**
 * JEDNA dwukierunkowa synchronizacja — cala obsluga przycisku "Synchronizuj
 * dane" i logowania. Najpierw wypycha lokalne zmiany, potem pobiera z chmury
 * to, czego to urzadzenie jeszcze nie widzialo.
 *
 * Zwraca { pushed, pulled, keptLocal, error? } — listy kluczy.
 * `keptLocal` to prawdziwe kolizje: byly lokalne zmiany I chmura miala nowa
 * wersje. Wygrywa lokalna, bo na tym urzadzeniu uzytkownik wlasnie pracuje —
 * ale jest to raportowane, zeby nie stalo sie po cichu.
 */
export async function syncNow(uid) {
  const out = { pushed: [], pulled: [], keptLocal: [] };
  if (!db) return out;
  /* Klucze wyslane w kroku 1. Snapshot chmury pochodzi SPRZED tych zapisow,
     wiec w kroku 2 wygladalyby na "nowa wersje w chmurze" i nadpisalyby to,
     co wlasnie wyslalismy. */
  const justPushed = new Set();

  const cloud = new Map();
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'data'));
    snap.forEach(d => {
      const data = d.data();
      if ('value' in data) cloud.set(d.id, data);
    });
  } catch (e) {
    out.error = e.message;
    return out;
  }

  const cloudRevOf = key => {
    const d = cloud.get(key);
    return (d && typeof d.rev === 'string' && d.rev) ? d.rev : null;
  };

  /* ── 1. Wypchnij to, co lokalne ──────────────────────────────────────
     Kolizje trzeba wykryc TU, przed zapisem, bo udany zapis czysci flage.

     Klucz bez potwierdzonego `rev` (np. swiezo po migracji ze starego modelu)
     wypychamy tylko wtedy, gdy chmura nie ma dla niego wersji z `rev`. Gdy ma,
     wygrywa chmura (krok 2): zostala zapisana swiadomie przez urzadzenie
     dzialajace na nowym modelu, a nasza kopia jest sprzed migracji. Bez tego
     warunku kazde urzadzenie nadpisywaloby poprzednie i "wygrywalby" ten, kto
     zsynchronizowal sie ostatni. */
  for (const key of syncableKeys()) {
    const dirty = isDirty(key);
    const synced = getSyncedRev(key);
    const cRev = cloudRevOf(key);
    const neverSynced = !synced && !cRev;
    if (!dirty && !neverSynced) continue;
    if (dirty && cRev && cRev !== synced) out.keptLocal.push(key);
    const local = readLocal(key);
    if (!local.present) continue;
    try { await cloudSave(uid, key, local.value); out.pushed.push(key); justPushed.add(key); }
    catch (e) { out.error = e.message; }
  }

  /* ── 2. Pobierz z chmury to, czego nie mamy ──────────────────────────
     Po kroku 1 brudne sa tylko klucze, ktorych zapis sie NIE udal — tych nie
     nadpisujemy, zeby nie zgubic lokalnej zmiany. */
  for (const [key, data] of cloud) {
    const cRev = cloudRevOf(key);
    if (justPushed.has(key)) continue;
    if (isDirty(key)) continue;
    if (!cRev) continue;                       // dokument legacy bez `rev`
    if (cRev === getSyncedRev(key)) continue;  // juz to mamy
    acceptCloud(key, data.value, cRev);
    out.pulled.push(key);
  }

  return out;
}
