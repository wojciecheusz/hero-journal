import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';

/* ── Mocki SDK Firestore ───────────────────────────────────────── */
const { setDocMock, getDocsMock } = vi.hoisted(() => ({
  setDocMock:  vi.fn(),
  getDocsMock: vi.fn(),
}));

const SERVER_TS = { __sentinel: 'serverTimestamp' };

vi.mock('firebase/firestore', () => ({
  doc:             (...args) => ({ path: args.slice(1).join('/') }),
  collection:      (...args) => ({ path: args.slice(1).join('/') }),
  setDoc:          setDocMock,
  getDocs:         getDocsMock,
  serverTimestamp: () => SERVER_TS,
}));

vi.mock('../firebase/index.js', () => ({ db: { __mock: true } }));

const {
  cloudSave, syncFromCloud, forcePushAll, forcePullAll,
  resolveKeepLocal, resolveTakeCloud,
} = await import('../firebase/firestore.js');
const { save, isDirty, getSyncedRev, markDirty, setSyncedRev } = await import('../utils/storage.js');

/* ── Pomocnicze ────────────────────────────────────────────────── */

// Reguly bez komentarzy — komentarze zawieraja przyklady skladni.
// Uwaga: w jsdom import.meta.url nie jest URL-em file://, wiec sciezka jest
// wzgledna wobec katalogu roboczego (vitest startuje z korzenia projektu).
const RULES = readFileSync('firestore.rules', 'utf8').replace(/\/\/.*$/gm, '');

function keyListFromRules(fnName) {
  const m = RULES.match(new RegExp(`${fnName}\\(\\[([^\\]]*)\\]\\)`));
  if (!m) throw new Error(`Nie znaleziono ${fnName}([...]) w firestore.rules`);
  return m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean).sort();
}

function snapshot(docs) {
  return { forEach: cb => docs.forEach(d => cb({ id: d.id, data: () => d.data })) };
}

const lastPayload = () => setDocMock.mock.calls.at(-1)[1];

beforeEach(() => {
  setDocMock.mockReset().mockResolvedValue(undefined);
  getDocsMock.mockReset().mockResolvedValue(snapshot([]));
  localStorage.clear();
});

/* ── Kontrakt: klient ↔ firestore.rules ────────────────────────── */
/* Rozjazd tych dwoch miejsc = PERMISSION_DENIED przy kazdym zapisie
   i cicha utrata synchronizacji miedzy urzadzeniami. */

describe('Kontrakt cloudSave() ↔ firestore.rules', () => {
  it('wysyla dokladnie te pola, ktore dopuszcza hasOnly() w regulach', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(Object.keys(lastPayload()).sort()).toEqual(keyListFromRules('hasOnly'));
  });

  it('reguly wymagaja (hasAll) dokladnie tych pol, ktore dopuszczaja (hasOnly)', () => {
    expect(keyListFromRules('hasAll')).toEqual(keyListFromRules('hasOnly'));
  });

  it('reguly NIE wymagaja value != null — hj_active_profile bywa nullem', () => {
    expect(RULES).not.toMatch(/value\s*!=\s*null/);
  });
});

/* ── cloudSave() ───────────────────────────────────────────────── */

describe('cloudSave()', () => {
  it('usuwa rekurencyjnie pola o wartosci undefined', async () => {
    await cloudSave('uid1', 'hj_char_p1', {
      name: 'Aria', initiativeBonus: undefined, hp: { current: 10, temp: undefined },
    });
    const { value } = lastPayload();
    expect(value).toEqual({ name: 'Aria', hp: { current: 10 } });
    expect('initiativeBonus' in value).toBe(false);
  });

  it('zamienia undefined na null, zeby pole value nie zniknelo z dokumentu', async () => {
    await cloudSave('uid1', 'hj_active_profile', undefined);
    expect('value' in lastPayload()).toBe(true);
    expect(lastPayload().value).toBeNull();
  });

  it('przepuszcza value === null (usuniecie ostatniego profilu)', async () => {
    await cloudSave('uid1', 'hj_active_profile', null);
    expect(lastPayload().value).toBeNull();
  });

  it('uzywa serwerowego znacznika czasu, nie zegara urzadzenia', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(lastPayload().updatedAt).toBe(SERVER_TS);
    expect(typeof lastPayload().updatedAt).not.toBe('number');
  });

  it('nadaje niepusty rev, inny przy kazdym zapisie', async () => {
    await cloudSave('uid1', 'hj_char_p1', { n: 1 });
    const a = lastPayload().rev;
    await cloudSave('uid1', 'hj_char_p1', { n: 2 });
    const b = lastPayload().rev;
    expect(typeof a).toBe('string');
    expect(a.length).toBeGreaterThan(0);
    expect(a.length).toBeLessThanOrEqual(64);
    expect(b).not.toBe(a);
  });

  it('po sukcesie zapisuje rev jako potwierdzony i czysci flage brudnego', async () => {
    save('hj_char_p1', { name: 'Aria' });          // oznacza brudny
    expect(isDirty('hj_char_p1')).toBe(true);
    const rev = await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(getSyncedRev('hj_char_p1')).toBe(rev);
    expect(isDirty('hj_char_p1')).toBe(false);
  });

  it('po nieudanym zapisie klucz zostaje brudny i bez potwierdzenia', async () => {
    setDocMock.mockRejectedValue(new Error('Missing or insufficient permissions.'));
    save('hj_char_p1', { name: 'Aria' });
    await expect(cloudSave('uid1', 'hj_char_p1', { name: 'Aria' })).rejects.toThrow();
    expect(isDirty('hj_char_p1')).toBe(true);
    expect(getSyncedRev('hj_char_p1')).toBeNull();
  });

  it('zapisuje pod sciezka users/{uid}/data/{key}', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(setDocMock.mock.calls.at(-1)[0].path).toBe('users/uid1/data/hj_char_p1');
  });
});

/* ── syncFromCloud() — scalanie po rev ─────────────────────────── */

describe('syncFromCloud()', () => {
  it('pobiera z chmury, gdy brak danych lokalnych', async () => {
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Aria' }, rev: 'r1' } },
    ]));
    const r = await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Aria' });
    expect(getSyncedRev('hj_char_p1')).toBe('r1');
    expect(r.pulled).toEqual(['hj_char_p1']);
  });

  it('nie rusza niczego, gdy chmura ma rev, ktory juz znamy', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna' }));
    setSyncedRev('hj_char_p1', 'r1');
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Chmurowa' }, rev: 'r1' } },
    ]));
    const r = await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Lokalna' });
    expect(r.pulled).toEqual([]);
    expect(r.conflicts).toEqual([]);
  });

  it('pobiera nowa wersje z chmury, gdy nie ma lokalnych zmian', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Stara' }));
    setSyncedRev('hj_char_p1', 'r1');
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Nowa' }, rev: 'r2' } },
    ]));
    const r = await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Nowa' });
    expect(getSyncedRev('hj_char_p1')).toBe('r2');
    expect(r.pulled).toEqual(['hj_char_p1']);
  });

  it('zglasza konflikt i NIE nadpisuje, gdy sa lokalne zmiany i nowy rev w chmurze', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna' }));
    setSyncedRev('hj_char_p1', 'r1');
    markDirty('hj_char_p1');
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Chmurowa' }, rev: 'r2' } },
    ]));
    const r = await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Lokalna' });
    expect(r.conflicts).toEqual(['hj_char_p1']);
    expect(r.pulled).toEqual([]);
  });

  it('zegar urzadzenia do przodu nie blokuje juz pobrania z chmury', async () => {
    /* Regresja starego modelu: hj_ts_ z Date.now() tabletu bil znacznik
       telefonu i tablet na stale odrzucal jego dane. Teraz kolejnosc czasu
       nie bierze udzialu w scalaniu — liczy sie tylko rownosc rev. */
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Stara' }));
    setSyncedRev('hj_char_p1', 'r1');
    localStorage.setItem('hj_ts_hj_char_p1', String(Date.now() + 10 * 365 * 864e5));
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Nowa' }, rev: 'r2' } },
    ]));
    await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Nowa' });
  });

  it('nie nadpisuje danych lokalnych dokumentem legacy bez rev', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna' }));
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Legacy' }, updatedAt: 1000 } },
    ]));
    const r = await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Lokalna' });
    expect(r.legacy).toEqual(['hj_char_p1']);
  });

  it('pomija dokumenty bez pola value', async () => {
    getDocsMock.mockResolvedValue(snapshot([{ id: 'hj_char_p1', data: { rev: 'r1' } }]));
    await syncFromCloud('uid1');
    expect(localStorage.getItem('hj_char_p1')).toBeNull();
  });

  it('nie rzuca przy bledzie sieci i raportuje go', async () => {
    getDocsMock.mockRejectedValue(new Error('offline'));
    const r = await syncFromCloud('uid1');
    expect(r.error).toBe('offline');
    expect(r.conflicts).toEqual([]);
  });
});

/* ── Rozstrzyganie konfliktow ──────────────────────────────────── */

describe('rozstrzyganie konfliktow', () => {
  it('resolveKeepLocal wypycha wersje lokalna do chmury', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna' }));
    markDirty('hj_char_p1');
    await resolveKeepLocal('uid1', ['hj_char_p1']);
    expect(lastPayload().value).toEqual({ name: 'Lokalna' });
    expect(isDirty('hj_char_p1')).toBe(false);
  });

  it('resolveTakeCloud nadpisuje tylko wskazane klucze', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna1' }));
    localStorage.setItem('hj_char_p2', JSON.stringify({ name: 'Lokalna2' }));
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Chmura1' }, rev: 'r1' } },
      { id: 'hj_char_p2', data: { value: { name: 'Chmura2' }, rev: 'r2' } },
    ]));
    await resolveTakeCloud('uid1', ['hj_char_p1']);
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Chmura1' });
    expect(JSON.parse(localStorage.getItem('hj_char_p2'))).toEqual({ name: 'Lokalna2' });
  });
});

/* ── Furtka awaryjna ───────────────────────────────────────────── */

describe('wymuszony push / pull', () => {
  it('forcePushAll wypycha wszystkie klucze danych, pomijajac znaczniki', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 1 }));
    localStorage.setItem('hj_profiles', JSON.stringify([{ id: 'p1' }]));
    markDirty('hj_char_p1');                     // tworzy hj_dirty_*
    setSyncedRev('hj_char_p1', 'r0');            // tworzy hj_syn_*
    localStorage.setItem('hj_ts_hj_char_p1', '123');  // znacznik legacy
    const r = await forcePushAll('uid1');
    const pushedKeys = setDocMock.mock.calls.map(c => c[0].path.split('/').pop()).sort();
    expect(pushedKeys).toEqual(['hj_char_p1', 'hj_profiles']);
    expect(r.pushed).toBe(2);
    expect(r.failed).toEqual([]);
  });

  it('forcePullAll robi z urzadzenia odbicie chmury i usuwa nadmiarowe klucze', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'stare' }));
    localStorage.setItem('hj_char_obcy', JSON.stringify({ n: 'tylko lokalnie' }));
    markDirty('hj_char_p1');
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { n: 'z chmury' }, rev: 'r9' } },
    ]));
    const r = await forcePullAll('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'z chmury' });
    expect(localStorage.getItem('hj_char_obcy')).toBeNull();
    expect(isDirty('hj_char_p1')).toBe(false);
    expect(getSyncedRev('hj_char_p1')).toBe('r9');
    expect(r).toEqual({ pulled: 1, removed: 1 });
  });
});
