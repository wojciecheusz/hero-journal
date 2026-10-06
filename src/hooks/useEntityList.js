import { useState } from 'react';

/**
 * Wspólny stan list encji (Przedmioty/Zdolności/Czary/NPC/Lokacje/Frakcje):
 * rozwinięte karty, filtr po tagu, lista tagów i szybka zmiana pola.
 * Dodawanie, edycja i usuwanie odbywają się w EntityEditModal (P29/B).
 */
export function useEntityList(items, setItems) {
  const [expanded, setExpanded]   = useState({});
  const [activeTag, setActiveTag] = useState(null);

  const allTags = [...new Set(items.flatMap(x => x.tags || []))].sort();

  const upd    = (id, f, v) => setItems(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return { expanded, setExpanded, activeTag, setActiveTag, allTags, upd, toggle };
}
