import { useState } from 'react';

/**
 * Wspólny stan i operacje CRUD dla list encji (Przedmioty/Zdolności/Czary/
 * NPC/Lokacje/Frakcje) — rozwijanie, tryb edycji, filtr po tagach oraz
 * add/update/remove, identyczne we wszystkich sześciu ekranach encji.
 * Filtry specyficzne dla danego ekranu (typ/relacja/szkoła…) zostają lokalne.
 */
export function useEntityList(items, setItems) {
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing]   = useState({});
  const [activeTag, setActiveTag] = useState(null);

  const allTags = [...new Set(items.flatMap(x => x.tags || []))].sort();

  const upd       = (id, f, v) => setItems(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const del       = id => setItems(l => l.filter(x => x.id !== id));
  const toggle    = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));

  return { expanded, setExpanded, editing, activeTag, setActiveTag, allTags, upd, del, toggle, startEdit, stopEdit };
}
