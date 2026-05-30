const BASE = 'https://www.dnd5eapi.co';
const TTL  = 7 * 24 * 60 * 60 * 1000; // 7 dni

function cacheGet(key) {
  try {
    const raw = localStorage.getItem('dnd5e_' + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL) { localStorage.removeItem('dnd5e_' + key); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(key, data) {
  try { localStorage.setItem('dnd5e_' + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export async function fetchList(path) {
  const key = path.replace(/\//g, '_');
  const hit = cacheGet(key);
  if (hit) return hit;
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  cacheSet(key, json);
  return json;
}

export async function fetchDetail(path) {
  const key = 'det' + path.replace(/\//g, '_');
  const hit = cacheGet(key);
  if (hit) return hit;
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  cacheSet(key, json);
  return json;
}

export function clearCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('dnd5e_'))
    .forEach(k => localStorage.removeItem(k));
}
