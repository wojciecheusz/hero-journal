import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';

/* ── Mocki SDK Firestore ───────────────────────────────────────── */
const { setDocMock, getDocsMock } = vi.hoisted(() => ({
  setDocMock:  vi.fn(),
  getDocsMock: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc:        (...args) => ({ path: args.slice(1).join('/') }),
  collection: (...args) => ({ path: args.slice(1).join('/') }),
  setDoc:     setDocMock,
  getDocs:    getDocsMock,
}));

vi.mock('../firebase/index.js', () => ({ db: { __mock: true } }));

const { cloudSave, syncFromCloud } = await import('../firebase/firestore.js');

/* ── Pomocnicze ────────────────────────────────────────────────── */

// Reguły bez komentarzy — komentarze mogą zawierać przykłady składni.
// Uwaga: w środowisku jsdom import.meta.url nie jest URL-em file://, więc ścieżka
// jest względna wobec katalogu roboczego (vitest startuje z korzenia projektu).
const RULES = readFileSync('firestore.rules', 'utf8')
  .replace(/\/\/.*$/gm, '');

function keyListFromRules(fnName) {
  const m = RULES.match(new RegExp(`${fnName}\\(\\[([^\\]]*)\\]\\)`));
  if (!m) throw new Error(`Nie znaleziono ${fnName}([...]) w firestore.rules`);
  return m[1]
    .split(',')
    .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
    .sort();
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
/* Rozjazd tych dwóch miejsc = PERMISSION_DENIED przy każdym zapisie
   i cicha utrata synchronizacji między urządzeniami. */

describe('Kontrakt cloudSave() ↔ firestore.rules', () => {
  it('wysyła dokładnie te pola, które dopuszcza hasOnly() w regułach', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(Object.keys(lastPayload()).sort()).toEqual(keyListFromRules('hasOnly'));
  });

  it('reguły wymagają (hasAll) dokładnie tych pól, które dopuszczają (hasOnly)', () => {
    expect(keyListFromRules('hasAll')).toEqual(keyListFromRules('hasOnly'));
  });

  it('nie wysyła pola value === null (reguły odrzucają value == null)', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(lastPayload().value).not.toBeNull();
  });
});

/* ── cloudSave() ───────────────────────────────────────────────── */

describe('cloudSave()', () => {
  it('usuwa rekurencyjnie pola o wartości undefined', async () => {
    await cloudSave('uid1', 'hj_char_p1', {
      name: 'Aria',
      initiativeBonus: undefined,
      hp: { current: 10, temp: undefined },
    });
    const { value } = lastPayload();
    expect(value).toEqual({ name: 'Aria', hp: { current: 10 } });
    expect('initiativeBonus' in value).toBe(false);
  });

  it('dołącza updatedAt jako liczbę całkowitą', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    const { updatedAt } = lastPayload();
    expect(typeof updatedAt).toBe('number');
    expect(Number.isInteger(updatedAt)).toBe(true);
  });

  it('zapisuje lokalny znacznik hj_ts_{key} zgodny z updatedAt', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(localStorage.getItem('hj_ts_hj_char_p1')).toBe(String(lastPayload().updatedAt));
  });

  it('zapisuje pod ścieżką users/{uid}/data/{key}', async () => {
    await cloudSave('uid1', 'hj_char_p1', { name: 'Aria' });
    expect(setDocMock.mock.calls.at(-1)[0].path).toBe('users/uid1/data/hj_char_p1');
  });

  it('propaguje błąd zapisu (kolejka liczy niepowodzenia)', async () => {
    setDocMock.mockRejectedValue(new Error('Missing or insufficient permissions.'));
    await expect(cloudSave('uid1', 'hj_char_p1', { name: 'Aria' }))
      .rejects.toThrow('Missing or insufficient permissions.');
  });
});

/* ── syncFromCloud() ───────────────────────────────────────────── */

describe('syncFromCloud() — last-write-wins', () => {
  it('pobiera z chmury, gdy brak danych lokalnych', async () => {
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Aria' }, updatedAt: 1000 } },
    ]));
    await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Aria' });
  });

  it('nadpisuje lokalne, gdy chmura jest nowsza', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Stara' }));
    localStorage.setItem('hj_ts_hj_char_p1', '500');
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Nowa' }, updatedAt: 1000 } },
    ]));
    await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Nowa' });
    expect(localStorage.getItem('hj_ts_hj_char_p1')).toBe('1000');
  });

  it('zachowuje lokalne, gdy lokalny zapis jest nowszy', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna' }));
    localStorage.setItem('hj_ts_hj_char_p1', '2000');
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Chmurowa' }, updatedAt: 1000 } },
    ]));
    await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Lokalna' });
  });

  it('nie nadpisuje danych lokalnych dokumentem legacy bez updatedAt', async () => {
    localStorage.setItem('hj_char_p1', JSON.stringify({ name: 'Lokalna' }));
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { value: { name: 'Legacy' } } },
    ]));
    await syncFromCloud('uid1');
    expect(JSON.parse(localStorage.getItem('hj_char_p1'))).toEqual({ name: 'Lokalna' });
  });

  it('pomija dokumenty bez pola value', async () => {
    getDocsMock.mockResolvedValue(snapshot([
      { id: 'hj_char_p1', data: { updatedAt: 1000 } },
    ]));
    await syncFromCloud('uid1');
    expect(localStorage.getItem('hj_char_p1')).toBeNull();
  });

  it('nie rzuca przy błędzie sieci/uprawnień', async () => {
    getDocsMock.mockRejectedValue(new Error('offline'));
    await expect(syncFromCloud('uid1')).resolves.toBeUndefined();
  });
});
