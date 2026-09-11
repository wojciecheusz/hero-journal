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

const { cloudSave, syncNow } = await import('../firebase/firestore.js');
const { save, isDirty, getSyncedRev, setSyncedRev, markDirty, migrateSyncMarkers } =
  await import('../utils/storage.js');

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

const cloud = docs => ({ forEach: cb => docs.forEach(d => cb({ id: d.id, data: () => d.data })) });
const lastPayload = () => setDocMock.mock.calls.at(-1)[1];
const pushedKeys  = () => setDocMock.mock.calls.map(c => c[0].path.split('/').pop()).sort();

beforeEach(() => {
  setDocMock.mockReset().mockResolvedValue(undefined);
  getDocsMock.mockReset().mockResolvedValue(cloud([]));
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
    expect(lastPayload().value).toEqual({ name: 'Aria', hp: { current: 10 } });
  });

  it('zamienia undefined na null, zeby pole value nie zniknelo z dokumentu', async () => {
    await cloudSave('uid1', 'hj_active_profile', undefined);
    expect('value' in lastPayload()).toBe(true);
    expect(lastPayload().value).toBeNull();
  });

  it('uzywa serwerowego znacznika czasu, nie zegara urzadzenia', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(lastPayload().updatedAt).toBe(SERVER_TS);
  });

  it('nadaje niepusty rev, inny przy kazdym zapisie', async () => {
    await cloudSave('uid1', 'hj_char_p1', { n: 1 });
    const a = lastPayload().rev;
    await cloudSave('uid1', 'hj_char_p1', { n: 2 });
    expect(typeof a).toBe('string');
    expect(a.length).toBeGreaterThan(0);
    expect(a.length).toBeLessThanOrEqual(64);
    expect(lastPayload().rev).not.toBe(a);
  });

  it('po sukcesie potwierdza rev i czysci flage brudnego', async () => {
    save('hj_char_p1', { name: 'Aria' });
    expect(isDirty('hj_char_p1')).toBe(true);
    const rev = await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(getSyncedRev('hj_char_p1')).toBe(rev);
    expect(isDirty('hj_char_p1')).toBe(false);
  });
});

/* ── migracja ──────────────────────────────────────────────────── */

describe('migrateSyncMarkers()', () => {
  it('usuwa stare hj_ts_* i NIE oznacza kluczy jako brudnych', () => {
    /* Regresja: oznaczanie wszystkiego jako brudne sprawialo, ze urzadzenie
       uwazalo kazda swoja wartosc za niezapisana zmiane i odmawialo przyjecia
       czegokolwiek z chmury — pobieranie po prostu nie dzialalo. */
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 1 }));
    localStorage.setItem('hj_ts_hj_char_p1', '12345');
    const r = migrateSyncMarkers();
    expect(r.removed).toBe(1);
    expect(localStorage.getItem('hj_ts_hj_char_p1')).toBeNull();
    expect(isDirty('hj_char_p1')).toBe(false);
  });

  it('jest jednorazowa', () => {
    migrateSyncMarkers();
    localStorage.setItem('hj_ts_x', '1');
    expect(migrateSyncMarkers().removed).toBe(0);
  });
});

/* ── syncNow() — jeden przycisk, oba kierunki ──────────────────── */

describe('syncNow()', () => {
  it('wypycha lokalne zmiany', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'lokalne' }));
    setSyncedRev('hj_char_p1', 'r1');
    markDirty('hj_char_p1');
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'stare' }, rev: 'r1' } },
    ]));
    const r = await syncNow('uid1');
    expect(r.pushed).toEqual(['hj_char_p1']);
    expect(lastPayload().value).toEqual({ n: 'lokalne' });
    expect(isDirty('hj_char_p1')).toBe(false);
    // krok 2 nie moze nadpisac tego, co wlasnie wyslalismy
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'lokalne' });
  });

  it('pobiera nowa wersje z chmury, gdy nie ma lokalnych zmian', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'stare' }));
    setSyncedRev('hj_char_p1', 'r1');
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'nowe' }, rev: 'r2' } },
    ]));
    const r = await syncNow('uid1');
    expect(r.pulled).toEqual(['hj_char_p1']);
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'nowe' });
    expect(getSyncedRev('hj_char_p1')).toBe('r2');
  });

  it('PO MIGRACJI pobiera z chmury, gdy chmura ma juz wersje z rev', async () => {
    /* Dokladnie scenariusz zgloszony przez uzytkownika: tablet wyslal dane,
       PC ma wlasna (starsza) kopie bez potwierdzonego rev i musi ja przyjac.
       Wczesniej PC probowal wypchnac swoja i nadpisywal tablet. */
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'z PC' }));
    migrateSyncMarkers();
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'z tabletu' }, rev: 'rT' } },
    ]));
    const r = await syncNow('uid1');
    expect(r.pulled).toEqual(['hj_char_p1']);
    expect(r.pushed).toEqual([]);
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'z tabletu' });
  });

  it('PO MIGRACJI wypycha, gdy chmura nie ma jeszcze wersji z rev', async () => {
    /* Druga strona tego samego: tablet synchronizuje sie pierwszy, chmura jest
       pusta albo ma tylko dokumenty legacy — wtedy to on zasila chmure. */
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'z tabletu' }));
    migrateSyncMarkers();
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'legacy' }, updatedAt: 1000 } },
    ]));
    const r = await syncNow('uid1');
    expect(r.pushed).toEqual(['hj_char_p1']);
    expect(r.pulled).toEqual([]);
    expect(lastPayload().value).toEqual({ n: 'z tabletu' });
  });

  it('przy prawdziwej kolizji zachowuje wersje lokalna i to raportuje', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'lokalne' }));
    setSyncedRev('hj_char_p1', 'r1');
    markDirty('hj_char_p1');
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'z chmury' }, rev: 'r2' } },
    ]));
    const r = await syncNow('uid1');
    expect(r.keptLocal).toEqual(['hj_char_p1']);
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'lokalne' });
    expect(r.pushed).toEqual(['hj_char_p1']);
  });

  it('gdy zapis sie nie uda, klucz zostaje brudny i NIE jest nadpisany z chmury', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'lokalne' }));
    setSyncedRev('hj_char_p1', 'r1');
    markDirty('hj_char_p1');
    setDocMock.mockRejectedValue(new Error('Missing or insufficient permissions.'));
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'z chmury' }, rev: 'r2' } },
    ]));
    const r = await syncNow('uid1');
    expect(r.error).toBe('Missing or insufficient permissions.');
    expect(isDirty('hj_char_p1')).toBe(true);
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'lokalne' });
  });

  it('raportuje doslownie blad odczytu i niczego nie zmienia', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'lokalne' }));
    getDocsMock.mockRejectedValue(new Error('Missing or insufficient permissions.'));
    const r = await syncNow('uid1');
    expect(r.error).toBe('Missing or insufficient permissions.');
    expect(setDocMock).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'lokalne' });
  });

  it('nie pobiera dokumentow legacy bez rev', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 'lokalne' }));
    setSyncedRev('hj_char_p1', 'r1');
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 'legacy' }, updatedAt: 1 } },
    ]));
    const r = await syncNow('uid1');
    expect(r.pulled).toEqual([]);
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ n: 'lokalne' });
  });

  it('pomija znaczniki — do chmury ida tylko klucze danych', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 1 }));
    localStorage.setItem('hj_profiles', JSON.stringify([{ id: 'p1' }]));
    markDirty('hj_char_p1'); markDirty('hj_profiles');
    setSyncedRev('hj_char_p1', 'r0');
    localStorage.setItem('hj_ts_hj_char_p1', '123');
    await syncNow('uid1');
    expect(pushedKeys()).toEqual(['hj_char_p1', 'hj_profiles']);
  });

  it('nic do zrobienia = pusty wynik', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ n: 1 }));
    setSyncedRev('hj_char_p1', 'r1');
    getDocsMock.mockResolvedValue(cloud([
      { id: 'hj_char_p1', data: { value: { n: 1 }, rev: 'r1' } },
    ]));
    const r = await syncNow('uid1');
    expect(r).toEqual({ pushed: [], pulled: [], keptLocal: [] });
  });
});
