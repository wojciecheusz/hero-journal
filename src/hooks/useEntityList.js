import { useState, useRef, useEffect } from 'react';

/**
 * Wspólny stan i operacje CRUD dla list encji (Przedmioty/Zdolności/Czary/
 * NPC/Lokacje/Frakcje) — rozwijanie, tryb edycji, filtr po tagach oraz
 * add/update/remove, identyczne we wszystkich sześciu ekranach encji.
 * Filtry specyficzne dla danego ekranu (typ/relacja/szkoła…) zostają lokalne.
 * del() wymaga dwóch kliknięć (2-step) — pierwsze ustawia pendingDelete[id]
 * na 2.5 s, drugie faktycznie usuwa; chroni przed przypadkowym skasowaniem.
 */
export function useEntityList(items, setItems) {
  const [expanded, setExpanded]       = useState({});
  const [editing, setEditing]         = useState({});
  const [activeTag, setActiveTag]     = useState(null);
  const [pendingDelete, setPending]   = useState({});
  const timers = useRef({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  const allTags = [...new Set(items.flatMap(x => x.tags || []))].sort();

  const upd    = (id, f, v) => setItems(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const startEdit = id => { setExpanded(e => ({ ...e, [id]: true })); setEditing(e => ({ ...e, [id]: true })); };
  const stopEdit  = id => setEditing(e => ({ ...e, [id]: false }));

  const del = id => {
    if (pendingDelete[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
      setPending(p => { const n = { ...p }; delete n[id]; return n; });
      setItems(l => l.filter(x => x.id !== id));
    } else {
      setPending(p => ({ ...p, [id]: true }));
      timers.current[id] = setTimeout(() => {
        setPending(p => { const n = { ...p }; delete n[id]; return n; });
        delete timers.current[id];
      }, 2500);
    }
  };

  return { expanded, setExpanded, editing, activeTag, setActiveTag, allTags, upd, del, pendingDelete, toggle, startEdit, stopEdit };
}
